// Executes the real modules and event handlers in a minimal DOM, with no browser,
// server or network. This tests state/control flow, not layout or native behavior.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext, runInContext} from 'node:vm';
import * as scheduling from '../dist/schedule.js';
import {NOTICES, CHOICE_KEY, mountMeasurementFeedback} from '../dist/measurement-feedback-client.mjs';

class Element {
 constructor(tag, doc) {
  this.tag = tag; this.ownerDocument = doc; this.children = [];
  this.dataset = {}; this.attributes = {}; this.listeners = {}; this.value = '';
 }
 append(child) { child.parentElement = this; this.children.push(child); }
 prepend(child) { child.parentElement = this; this.children.unshift(child); }
 set textContent(value) { this.children = [{nodeValue:String(value), parentElement:this}]; }
 get textContent() { return this.children.map(c=>c.nodeValue ?? c.textContent).join(''); }
 set innerHTML(value) {
  this.html = value; this.children = [];
  for (const match of value.matchAll(/data-app-language="(en|de)"/g)) {
   const button = new Element('button', this.ownerDocument);
   button.dataset.appLanguage = match[1]; this.append(button);
  }
 }
 get innerHTML() { return this.html ?? ''; }
 setAttribute(name, value) { this.attributes[name] = String(value); }
 getAttribute(name) { return this.attributes[name] ?? null; }
 hasAttribute(name) { return name in this.attributes; }
 addEventListener(name, fn) { (this.listeners[name] ??= []).push(fn); }
 async fire(name, event = {}) { for (const fn of this.listeners[name] ?? []) await fn(event); }
 closest(selector) {
  if (selector === '.step') return this.step ?? null;
  if (this.tag === 'textarea' || this.dataset.l10nRaw !== undefined || this.tag === 'script') return this;
  return this.parentElement?.closest(selector) ?? null;
 }
 querySelectorAll(selector) { return all(this).filter(n=>n.tag === selector); }
 querySelector(selector) { return this.querySelectorAll(selector)[0]; }
 focus() {}
 scrollIntoView() {}
 reset() { for (const n of all(this)) if (['input','textarea'].includes(n.tag)) n.value = ''; }
 remove() {}
}
const all = root => [root, ...(root.children ?? []).flatMap(all)];
const source = file => readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8')
 .replace(/^import .*;\r?\n/gm, '').replace(/export /g, '');

export function fixture({language = 'en', privacy = {}, offline = false, stored = null, response, storageDenied = false} = {}) {
 const ids = new Map(), store = new Map(), requests = [];
 if (stored) store.set('arcdrake-tools-language', stored);
 const doc = {
  createElement: tag=>new Element(tag, doc),
  getElementById: id=>ids.get(id) ?? all(doc.documentElement).find(n=>n.id === id),
  createTreeWalker() {
   const nodes = all(doc.documentElement).filter(n=>n.nodeValue !== undefined); let i = 0;
   return {nextNode() { this.currentNode = nodes[i++]; return Boolean(this.currentNode); }};
  },
  querySelector(selector) { return selector === 'header' ? ids.get('header') : selector === '.output' ? ids.get('output') : null; },
  querySelectorAll(selector) { return selector === '[data-app-language]' ? all(doc.documentElement).filter(n=>n.dataset?.appLanguage) : []; },
  listeners: {}, addEventListener(name, fn) { (this.listeners[name] ??= []).push(fn); },
 };
 doc.documentElement = new Element('html', doc);
 for (const id of ['header', 'output', ...readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8').matchAll(/\bid="([^"]+)"/g)].map(x=>typeof x === 'string' ? x : x[1])) {
  const el = new Element(id === 'title' ? 'input' : 'div', doc); el.id = id;
  ids.set(id, el); doc.documentElement.append(el);
 }
 ids.get('demo-result').dataset.l10nRaw = '';
 const listeners = {};
 const window = {
  addEventListener(name, fn) { (listeners[name] ??= []).push(fn); },
  dispatchEvent(e) { for (const fn of listeners[e.type] ?? []) fn(e); },
 };
 const location = new URL(`https://tools.arcdrake.com/rehearsal/?lang=${language}&keep=1#planner`);
 const historyState = {draft:'keep'};
 const context = createContext({
  ...scheduling, NOTICES, mountMeasurementFeedback, document:doc, window, location, URL,
  navigator:{language:'en-GB', ...privacy},
  history:{state:historyState, replaceState(state, _title, url) { assert.equal(state, historyState); location.href = url.href; }},
  localStorage:{getItem:key=>{if(storageDenied)throw Error('storage denied');return store.get(key) ?? null;}, setItem:(key,value)=>{if(storageDenied)throw Error('storage denied');store.set(key,value);}},
  fetch:async (path, options)=>{
   requests.push({path, options, body:JSON.parse(options.body)});
   if (offline) throw Error('fixture unavailable');
   if (response) return response(path, options);
   return Response.json(path === '/api/events' ? {ok:true} : {ok:true, id:RECEIPT}, {status:202});
  },
  CustomEvent:class { constructor(type, init) { this.type = type; this.detail = init.detail; }},
  MutationObserver:class { observe() {} disconnect() {} }, NodeFilter:{SHOW_TEXT:4},
 });
 // Bind the shared module to fixture-only dependencies. The production adapter
 // and handlers otherwise execute unchanged.
 context.mountMeasurementFeedback = (container, options)=>mountMeasurementFeedback(container, {
  ...options, fetchImpl:context.fetch, storage:context.localStorage, privacy:context.navigator,
 });
 runInContext(source('language.js'), context);
 runInContext(source('feedback.js'), context);
 runInContext(source('app.js'), context);
 const evaluate = script=>runInContext(script, context);
 const switchLanguage = language=>{
  window.dispatchEvent({type:'arcdrake-language-change', detail:{language}});
  evaluate('refresh()');
 };
 const input = (id, value, type = 'input')=>{
  const target = ids.get(id); target.value = value;
  for (const fn of doc.listeners[type] ?? []) fn({target});
 };
 const state = ()=>JSON.parse(evaluate('JSON.stringify({plan,simulation,savedSignature})'));
 return {ids, store, requests, context, evaluate, switchLanguage, input, state, window};
}

test('F3: direct DE demo and EN → DE → EN retain delayed selection and unsaved event', () => {
 const direct = fixture({language:'de'});
 assert.match(direct.ids.get('demo-result').innerHTML, /Live-Produktdemo/);
 direct.ids.get('demo-delay').onclick();
 assert.match(direct.ids.get('demo-result').innerHTML, /Live-Produktdemo · 10 Min\. verspätet/);
 assert.doesNotMatch(direct.ids.get('demo-result').innerHTML, /Live product demo|10 min late/);
 const f = fixture();
 f.input('title', 'Private draft');
 f.input('delayStep', 'demo', 'change'); f.input('delay', '10');
 f.input('unavailable', 'Sam', 'change');
 f.ids.get('demo-delay').onclick();
 const before = f.state();
 f.switchLanguage('de');
 assert.deepEqual(f.state(), before);
 assert.match(f.ids.get('demo-result').innerHTML, /Live-Produktdemo · 10 Min\. verspätet/);
 assert.match(f.ids.get('demo-result').innerHTML, /18:50/);
 assert.equal(f.ids.get('demo-delay').getAttribute('aria-pressed'), 'true');
 f.switchLanguage('en');
 assert.deepEqual(f.state(), before);
 assert.match(f.ids.get('demo-result').innerHTML, /Live product demo · 10 min late/);
 assert.equal(f.context.location.searchParams.get('keep'), '1');
 assert.equal(f.context.location.hash, '#planner');
 assert.equal(f.requests.length, 0);
});

test('same feedback form, draft, category, email, expanded state and notices survive language switches', async () => {
 const f = fixture({offline:true});
 const nodes = all(f.ids.get('measurement-feedback'));
 const form = nodes.find(n=>n.tag === 'form');
 const message = nodes.find(n=>n.tag === 'textarea');
 const category = nodes.find(n=>n.tag === 'select');
 const email = nodes.find(n=>n.tag === 'input');
 await nodes.find(n=>n.textContent === NOTICES.en.open).fire('click');
 message.value = 'Keep current event — private draft'; category.value = 'usability'; email.value = 'synthetic@example.com';
 f.switchLanguage('de');
 assert.equal(form.hidden, false);
 assert.equal(message.value, 'Keep current event — private draft');
 assert.equal(category.value, 'usability'); assert.equal(email.value, 'synthetic@example.com');
 assert.ok(nodes.some(n=>n.textContent === NOTICES.de.analytics));
 assert.ok(nodes.some(n=>n.textContent === NOTICES.de.feedback));
 assert.ok(nodes.some(n=>n.href === 'https://tools.arcdrake.com/de/privacy/'));
 assert.ok(nodes.some(n=>n.href === 'https://arcdrake.com/de/contact/'));
 assert.equal(f.requests.length, 0);
 await form.fire('submit', {preventDefault(){}}); f.evaluate('refresh()');
 assert.equal(f.requests.length, 1);
 assert.equal(f.requests[0].path, '/api/feedback');
 assert.equal(message.value, 'Keep current event — private draft');
 assert.ok(all(form).some(n=>n.textContent === NOTICES.de.unavailable));
 f.switchLanguage('en');
 assert.ok(all(form).some(n=>n.textContent === NOTICES.en.unavailable));
 assert.equal(f.requests.length, 1);
});

const RECEIPT = '12345678-1234-4234-8234-123456789abc';

test('confirmed receipt remains plain text and localized after a language switch', async () => {
 const f = fixture();
 const nodes = all(f.ids.get('measurement-feedback'));
 nodes.find(n=>n.tag === 'textarea').value = 'Synthetic';
 nodes.find(n=>n.tag === 'select').value = 'idea';
 await nodes.find(n=>n.tag === 'form').fire('submit', {preventDefault(){}});
 f.evaluate('refresh()');
 assert.ok(all(f.ids.get('measurement-feedback')).some(n=>n.textContent === NOTICES.en.sent+RECEIPT));
 f.switchLanguage('de');
 assert.ok(all(f.ids.get('measurement-feedback')).some(n=>n.textContent === NOTICES.de.sent+RECEIPT));
 assert.equal(f.requests.length, 1);
});

test('actual scheduling handlers count start/success only after opt-in and never send plan data', () => {
 const f = fixture({offline:true});
 f.evaluate("measurement.setChoice('yes')");
 f.input('delayStep', 'demo', 'change'); f.input('delay', '10');
 assert.equal(f.requests.length, 2); // Live keystrokes do not generate counts.
 f.input('delay', '10', 'change');
 assert.deepEqual(f.requests.map(r=>r.body.event), ['tool_start','tool_complete','tool_start','tool_complete']);
 assert.match(f.ids.get('summary').innerHTML, /18:50/);
 for (const r of f.requests) assert.deepEqual(Object.keys(r.body).sort(), ['event','product']);
 assert.ok(f.requests.every(r=>r.body.product === 'rehearsal' && r.path === '/api/events'));
 f.input('start', 'invalid'); f.input('start', 'invalid', 'change');
 assert.equal(f.requests.at(-1).body.event, 'tool_start');
 assert.equal(f.requests.length, 5);
 f.evaluate("measurement.setChoice('no')");
 f.input('start', '23:50');
 assert.match(f.ids.get('summary').innerHTML, /00:40 \(\+1d\)/);
 assert.equal(f.requests.length, 5);
 f.ids.get('save').onclick();
 const saved = JSON.parse(f.store.get('arcdrake.rehearsal.v1'));
 assert.equal(saved.plan.start, '23:50'); assert.equal(saved.simulation.delay, 10);
 assert.match(f.ids.get('save-state').textContent, /match your browser save/);
 f.switchLanguage('de');
 assert.equal(f.store.get('arcdrake.rehearsal.v1'), JSON.stringify(saved));
});

test('GPC/DNT block actual action hooks and manual browser-save restore preserves simulation', async () => {
 for (const privacy of [{globalPrivacyControl:true},{doNotTrack:'1'}]) {
  const f = fixture({privacy});
  f.evaluate("measurement.setChoice('yes')"); f.input('delayStep','demo','change');
  f.input('delay','10'); f.ids.get('save').onclick();
  f.input('title','Unsaved');
  // Resolve the actual replacement confirmation without opening native UI.
  f.evaluate('askConfirm = async()=>true');
  await f.ids.get('reload').onclick();
  assert.notEqual(f.state().plan.title, 'Unsaved');
  assert.equal(f.state().simulation.delay, 10);
  assert.equal(f.state().simulation.delayStep, 'demo');
  assert.equal(f.requests.length, 0);
  assert.equal(f.store.get(CHOICE_KEY), 'yes');
 }
});

test('page-only consent notices translate fully and retain a voluntary draft', async () => {
 const f = fixture({storageDenied:true});
 const nodes = all(f.ids.get('measurement-feedback'));
 const allow = nodes.find(n=>n.textContent === NOTICES.en.allow);
 await allow.fire('click');
 f.switchLanguage('de');
 assert.ok(all(f.ids.get('measurement-feedback')).some(n=>n.textContent === NOTICES.de.on+' '+NOTICES.de.pageOnly));
 assert.equal(f.requests.length, 0); // Choosing a preference never replays actions.
 f.switchLanguage('en');
 assert.ok(all(f.ids.get('measurement-feedback')).some(n=>n.textContent === NOTICES.en.on+' '+NOTICES.en.pageOnly));
});

test('language switch during pending send preserves the form and localizes confirmed receipt', async () => {
 let finish;
 const f = fixture({response:()=>new Promise(resolve=>{finish=resolve;})});
 const nodes = all(f.ids.get('measurement-feedback'));
 const form = nodes.find(n=>n.tag === 'form');
 const message = nodes.find(n=>n.tag === 'textarea');
 const submit = nodes.find(n=>n.type === 'submit');
 nodes.find(n=>n.tag === 'select').value = 'idea'; message.value = 'Synthetic pending report';
 const pending = form.fire('submit', {preventDefault(){}});
 assert.equal(submit.disabled, true);
 f.switchLanguage('de');
 assert.equal(message.value, 'Synthetic pending report');
 assert.ok(all(form).some(n=>n.textContent === NOTICES.de.sending));
 await form.fire('submit', {preventDefault(){}});
 assert.equal(f.requests.length, 1);
 finish(Response.json({ok:true,id:RECEIPT}, {status:202}));
 await pending; f.evaluate('refresh()');
 assert.equal(submit.disabled, false); assert.equal(message.value, '');
 assert.ok(all(form).some(n=>n.textContent === NOTICES.de.sent+RECEIPT));
});

test('rate and capacity preserve valid input and translate service limits on language switch', async () => {
 for (const [error,status] of [['rate',429],['capacity',503]]) {
  const f = fixture({response:()=>Response.json({ok:false,error}, {status})});
  const nodes = all(f.ids.get('measurement-feedback'));
  nodes.find(n=>n.tag === 'select').value = 'other';
  const message = nodes.find(n=>n.tag === 'textarea'); message.value = 'Synthetic valid message';
  await nodes.find(n=>n.tag === 'form').fire('submit', {preventDefault(){}});
  f.evaluate('refresh()');
  assert.ok(all(f.ids.get('measurement-feedback')).some(n=>n.textContent === NOTICES.en[error]));
  f.switchLanguage('de');
  assert.ok(all(f.ids.get('measurement-feedback')).some(n=>n.textContent === NOTICES.de[error]));
  assert.equal(message.value, 'Synthetic valid message'); assert.equal(f.requests.length, 1);
 }
});
