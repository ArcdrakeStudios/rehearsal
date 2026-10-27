import test from 'node:test';
import assert from 'node:assert/strict';
import { CHOICE_KEY, createMeasurementClient, mountMeasurementFeedback, NOTICES, runMeasuredAction } from '../dist/measurement-feedback-client.mjs';
import {EVENTS, CATEGORIES, WRITE_ERRORS, validatePayload} from '../dist/measurement-contract.mjs';
const RECEIPT = '12345678-1234-4234-8234-123456789abc';

test('contract enforces event/category allowlists and message/reply boundaries', () => {
  for (const event of EVENTS) assert.deepEqual(validatePayload('events', {product:'rehearsal', event}), {product:'rehearsal', event});
  for (const data of [{product:'rehearsal',event:'save'}, {product:'rehearsal',event:'page_view',url:'private'}, {product:'unknown',event:'page_view'}])
    assert.throws(()=>validatePayload('events', data));
  for (const category of CATEGORIES) {
    assert.equal(validatePayload('feedback', {product:'rehearsal',category,message:'  Text\n\tmore  '}).message, 'Text\n\tmore');
  }
  const base = {product:'rehearsal', category:'bug', message:'Synthetic'};
  assert.equal(validatePayload('feedback', {...base,message:'x'.repeat(2000)}).message.length, 2000);
  assert.equal(validatePayload('feedback', {...base,replyTo:'  synthetic@example.com  '}).replyTo, 'synthetic@example.com');
  for (const fields of [{category:'support'}, {message:' '}, {message:'x'.repeat(2001)}, {message:'bad\u0000'},
    {replyTo:'invalid'}, {replyTo:'a@example.com\r\nb@example.com'}, {replyTo:''}, {replyTo:'x'.repeat(255)+'@example.com'}, {identity:'extra'}])
    assert.throws(()=>validatePayload('feedback', {...base,...fields}));
});

function setup(overrides = {}) {
  const data = new Map(), calls = [];
  const storage = { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
  const client = createMeasurementClient({ product: 'company', storage, privacy: {},
    fetchImpl: async (path, options) => { calls.push({ path, options }); return Response.json(path === '/api/events' ? { ok: true } : { ok: true, id: RECEIPT }, { status: 202 }); },
    ...overrides });
  return { client, calls, storage };
}

test('no automatic traffic, explicit opt-in, narrow payload, no credentials/referrer, and immediate opt-out', async () => {
  const { client, calls } = setup();
  assert.equal(client.choice(), 'unset');
  await client.track('page_view');
  assert.equal(calls.length, 0);
  client.setChoice('yes');
  await client.track('play_start');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, '/api/events');
  assert.deepEqual(JSON.parse(calls[0].options.body), { product: 'company', event: 'play_start' });
  assert.equal(calls[0].options.credentials, 'omit');
  assert.equal(calls[0].options.referrerPolicy, 'no-referrer');
  client.setChoice('no');
  await client.track('page_view');
  assert.equal(calls.length, 1);
  await assert.rejects(client.track('unknown'), /Unknown event/);
});

test('browser GPC/DNT override opt-in, storage failures use session-only choice, cross-instance opt-out respected', async () => {
  for (const privacy of [{ globalPrivacyControl: true }, { doNotTrack: '1' }]) {
    const { client, calls } = setup({ privacy });
    assert.equal(client.setChoice('yes'), 'blocked');
    await client.track('page_view');
    assert.equal(calls.length, 0);
  }
  const broken = setup({ storage: { getItem() { throw Error(); }, setItem() { throw Error(); } } });
  broken.client.setChoice('yes');
  await broken.client.track('page_view');
  assert.equal(broken.calls.length, 1);
  const f = setup();
  f.client.setChoice('yes');
  const second = createMeasurementClient({ product: 'studios', storage: f.storage, privacy: {} });
  second.setChoice('no');
  await f.client.track('page_view');
  assert.equal(f.calls.length, 0);
  f.client.setChoice('yes');
  f.storage.removeItem(CHOICE_KEY);
  await f.client.track('page_view');
  assert.equal(f.calls.length, 0);
});

test('feedback needs explicit send, works with analytics off, validates and never retries on failure', async () => {
  const { client, calls } = setup();
  assert.equal(calls.length, 0);
  const valid = { category: 'idea', message: 'A thought' };
  assert.equal((await client.sendFeedback(valid)).ok, true);
  assert.equal(calls[0].path, '/api/feedback');
  assert.deepEqual(JSON.parse(calls[0].options.body), { product: 'company', ...valid });
  assert.equal((await client.sendFeedback({ ...valid, metadata: 'extra' })).ok, false);
  assert.equal(calls.length, 1);
  let attempts = 0;
  const failed = setup({ fetchImpl: async () => { attempts++; throw Error('offline'); } });
  assert.deepEqual(await failed.client.sendFeedback(valid), { ok: false, error: 'unavailable' });
  assert.equal(attempts, 1);
});

// Minimal DOM harness checks control flow and safe text assignment; not browser QA.
class Element {
  constructor(tag, doc) { this.tag = tag; this.ownerDocument = doc; this.children = []; this.listeners = {}; this.attributes = {}; this.value = ''; }
  append(child) { this.children.push(child); }
  setAttribute(key, value) { this.attributes[key] = value; }
  addEventListener(key, fn) { this.listeners[key] = fn; }
  focus() {}
  reset() {}
  remove() {}
  set innerHTML(_value) { assert.fail('Unsafe HTML rendering'); }
}
function all(root) { return [root, ...root.children.flatMap(all)]; }

test('EN/DE widget sends only on submit and rejects injected invalid receipts', async () => {
  for (const language of ['en', 'de']) {
    const doc = { createElement: tag => new Element(tag, doc) };
    const container = new Element('div', doc);
    let sends = 0;
    mountMeasurementFeedback(container, { product: 'tools', language, storage: null, privacy: {},
      fetchImpl: async () => { sends++; return Response.json({ ok: true, id: '<script>unsafe</script>' }, { status: 202 }); } });
    const nodes = all(container), copy = NOTICES[language];
    assert.ok(nodes.some(node => node.textContent === copy.analytics));
    assert.ok(nodes.some(node => node.textContent === copy.feedback));
    await nodes.find(node => node.textContent === copy.open).listeners.click();
    assert.equal(sends, 0);
    const form = nodes.find(node => node.tag === 'form');
    nodes.find(node => node.tag === 'textarea').value = 'A report';
    nodes.find(node => node.tag === 'select').value = 'bug';
    await form.listeners.submit({ preventDefault() {} });
    assert.equal(sends, 1);
    assert.ok(nodes.some(node => node.textContent === copy.unavailable));
    assert.equal(nodes.find(node => node.tag === 'textarea').value, 'A report');
  }
});

test('client preserves bounded API errors, rejects malformed receipts, never follows redirects or retries', async () => {
  for (const [status, body, error] of [[400, { ok: false, error: 'invalid' }, 'invalid'],
    [429, { ok: false, error: 'rate' }, 'rate'], [503, { ok: false, error: 'capacity' }, 'capacity'],
    [503, { error: '<secret provider exception>' }, 'unavailable'], [202, null, 'unavailable'],
    [200, { ok: true }, 'unavailable'], [202, { ok: 'yes' }, 'unavailable']]) {
    let attempts = 0;
    const { client } = setup({ fetchImpl: async (_path, options) => {
      attempts++;
      assert.equal(options.redirect, 'error');
      return Response.json(body, { status });
    } });
    assert.deepEqual(await client.sendFeedback({ category: 'other', message: 'Synthetic' }), { ok: false, error });
    assert.equal(attempts, 1);
  }
});

test('exact HTTP/body acceptance and every public error/status pair match the contract', async () => {
 for (const [error,status] of Object.entries(WRITE_ERRORS)) {
  const f = setup({fetchImpl:async()=>Response.json({ok:false,error},{status})});
  assert.deepEqual(await f.client.sendFeedback({category:'bug',message:'Synthetic'}), {ok:false,error});
 }
 for (const body of [{ok:true}, {ok:true,id:'invalid'}, {ok:true,id:RECEIPT,extra:true}, {ok:false,error:'rate',extra:true}]) {
  const f = setup({fetchImpl:async()=>Response.json(body,{status:202})});
  assert.deepEqual(await f.client.sendFeedback({category:'bug',message:'Synthetic'}), {ok:false,error:'unavailable'});
 }
 const f = setup({fetchImpl:async()=>Response.json({ok:true,id:RECEIPT},{status:202})});
 f.client.setChoice('yes');
 assert.deepEqual(await f.client.track('tool_complete'), {ok:false,error:'unavailable'});
});

test('single deadline bounds stalled JSON and restores EN/DE send controls without retry', async () => {
 for (const language of ['en','de']) {
  const doc = {createElement:tag=>new Element(tag,doc)};
  const container = new Element('div',doc); let attempts = 0, signal;
  mountMeasurementFeedback(container, {product:'rehearsal',language,storage:null,privacy:{},timeoutMs:10,
   fetchImpl:async(_path,options)=>{attempts++;signal=options.signal;return {status:202,json:()=>new Promise(()=>{})};}});
  const nodes = all(container), message = nodes.find(n=>n.tag === 'textarea');
  message.value = 'Synthetic'; nodes.find(n=>n.tag === 'select').value = 'bug';
  await nodes.find(n=>n.tag === 'form').listeners.submit({preventDefault(){}});
  assert.equal(signal.aborted,true); assert.equal(attempts,1); assert.equal(message.value,'Synthetic');
  assert.equal(nodes.find(n=>n.type === 'submit').disabled,false);
  assert.ok(nodes.some(n=>n.textContent === NOTICES[language].unavailable));
 }
});

test('failed opt-out stays off across page clients even when stored permission cannot be removed', async () => {
 const storage = {getItem:()=> 'yes',setItem(){throw Error('denied');},removeItem(){throw Error('denied');}};
 const first = setup({storage}), second = setup({storage});
 assert.equal(first.client.choice(),'yes');
 assert.equal(first.client.setChoice('no'),'no');
 assert.equal(first.client.choicePersistence(),'page');
 await first.client.track('tool_start'); await second.client.track('tool_start');
 assert.equal(first.calls.length+second.calls.length,0);
});

test('real action wrapper emits start and successful completion only, with consent and privacy gates', async () => {
  for (const kind of ['play', 'tool']) {
    const f = setup();
    let actions = 0;
    const action = async () => { actions++; return 'task result'; };
    assert.equal(await runMeasuredAction(f.client, kind, action), 'task result');
    assert.equal(actions, 1);
    assert.equal(f.calls.length, 0);
    f.client.setChoice('yes');
    assert.equal(await runMeasuredAction(f.client, kind, action), 'task result');
    assert.deepEqual(f.calls.map(call => JSON.parse(call.options.body).event), [`${kind}_start`, `${kind}_complete`]);
    await assert.rejects(runMeasuredAction(f.client, kind, async () => { throw Error('task failed'); }), /task failed/);
    assert.deepEqual(f.calls.map(call => JSON.parse(call.options.body).event), [`${kind}_start`, `${kind}_complete`, `${kind}_start`]);
    f.client.setChoice('no');
    await runMeasuredAction(f.client, kind, action);
    assert.equal(f.calls.length, 3);
    for (const privacy of [{ globalPrivacyControl: true }, { doNotTrack: '1' }]) {
      const blocked = setup({ privacy });
      blocked.client.setChoice('yes');
      await runMeasuredAction(blocked.client, kind, action);
      assert.equal(blocked.calls.length, 0);
    }
    const offline = setup({ fetchImpl: async () => { throw Error('offline'); } });
    offline.client.setChoice('yes');
    assert.equal(await runMeasuredAction(offline.client, kind, action), 'task result');
  }
});

test('localized widget links existing host privacy/contact routes and preserves text on unconfirmed sends', async () => {
  for (const language of ['en', 'de']) for (const product of ['company', 'studios', 'tools']) {
    const doc = { createElement: tag => new Element(tag, doc) };
    const container = new Element('div', doc);
    mountMeasurementFeedback(container, { product, language, storage: null, privacy: {},
      fetchImpl: async () => { throw Error('offline'); } });
    const nodes = all(container), prefix = language === 'de' ? '/de' : '';
    const host = product === 'company' ? 'arcdrake.com' : product === 'tools' ? 'tools.arcdrake.com' : 'arcdrakestudios.com';
    assert.ok(nodes.some(node => node.href === `https://${host}${prefix}/privacy/`));
    assert.ok(nodes.some(node => node.href === `https://${product === 'tools' ? 'arcdrake.com' : host}${prefix}/contact/`));
    const message = nodes.find(node => node.tag === 'textarea');
    message.value = '<script>untrusted text</script>';
    nodes.find(node => node.tag === 'select').value = 'other';
    await nodes.find(node => node.tag === 'form').listeners.submit({ preventDefault() {} });
    assert.equal(message.value, '<script>untrusted text</script>');
    assert.ok(nodes.some(node => node.textContent === NOTICES[language].unavailable));
    assert.match(NOTICES[language].feedback, /Arcdrake/);
    assert.match(NOTICES[language].feedback, /platform failures|Plattformfehlern/);
  }
});
