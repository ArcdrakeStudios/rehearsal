export function validate(plan) {
  const errors=[];
  if(!plan || plan.version!==1 || !Array.isArray(plan.steps) || !Array.isArray(plan.people)) return ['Unsupported or invalid event file.'];
  if(typeof plan.title!=='string'||plan.title.length>120||typeof plan.start!=='string'||plan.steps.length>100||plan.people.length>50||plan.people.some(p=>typeof p!=='string'||!p.trim()||p.length>100)||new Set(plan.people).size!==plan.people.length) return ['Event fields are invalid or exceed limits (100 steps, 50 people).'];
  if(plan.steps.some(s=>!s||typeof s!=='object'||typeof s.id!=='string'||!s.id||s.id.length>100||typeof s.title!=='string'||s.title.length>120||typeof s.notes!=='string'||s.notes.length>2000||!Array.isArray(s.people)||!Array.isArray(s.depends)||s.people.length>50||s.depends.length>100||s.people.some(p=>typeof p!=='string')||s.depends.some(d=>typeof d!=='string'))) return ['A step has invalid fields.'];
  if(!/^\d{2}:\d{2}$/.test(plan.start)||Number(plan.start.slice(0,2))>23||Number(plan.start.slice(3))>59) errors.push('Choose a valid start time.');
  const ids=new Set(plan.steps.map(s=>s.id));
  if(ids.size!==plan.steps.length) errors.push('Step IDs must be unique.');
  const people=new Set(plan.people);
  for(const s of plan.steps){
    if(!s.title?.trim()) errors.push('Every step needs a name.');
    if(!Number.isInteger(s.duration)||s.duration<1||s.duration>1440) errors.push(`${s.title}: duration must be 1–1440 minutes.`);
    if(!Array.isArray(s.people)||s.people.some(p=>!people.has(p))) errors.push(`${s.title}: unknown person.`);
    if(!Array.isArray(s.depends)||s.depends.some(d=>!ids.has(d))) errors.push(`${s.title}: dependency is missing.`);
  }
  const visiting=new Set(),done=new Set();
  function visit(id){if(visiting.has(id))return true;if(done.has(id))return false;visiting.add(id);const s=plan.steps.find(s=>s.id===id);for(const d of s?.depends||[])if(visit(d))return true;visiting.delete(id);done.add(id);return false;}
  if(plan.steps.some(s=>visit(s.id)))errors.push('Circular step order (dependency cycle): two or more steps are waiting for each other. Uncheck a step under “Must wait for these steps” to break the loop.');
  return [...new Set(errors)];
}
export function envelope(data){
 if(!data||data.version!==1)throw Error('Unsupported event version.');
 const errors=validate(data.plan);if(errors.length)throw Error(errors.join(' '));
 const s=data.simulation??{};
 if(!s||typeof s!=='object'||Array.isArray(s))throw Error('Invalid simulation.');
 const simulation={delayStep:s.delayStep??'',delay:s.delay??0,unavailable:s.unavailable??''};
 if(typeof simulation.delayStep!=='string'||typeof simulation.unavailable!=='string'||!Number.isInteger(simulation.delay)||simulation.delay<0||simulation.delay>1440||(simulation.delayStep&&!data.plan.steps.some(p=>p.id===simulation.delayStep))||(simulation.unavailable&&!data.plan.people.includes(simulation.unavailable)))throw Error('Invalid simulation: choose known steps/people and a delay of 0–1440 minutes.');
 return {plan:structuredClone(data.plan),simulation};
}
export function schedule(plan,simulation={}){
 const errors=validate(plan);if(errors.length)return {errors,rows:[]};
 const start=Number(plan.start.slice(0,2))*60+Number(plan.start.slice(3));
 const rows=[],byId=new Map(),free=new Map();
 const remaining=[...plan.steps];
 while(remaining.length){
   const i=remaining.findIndex(s=>s.depends.every(d=>byId.has(d)));const s=remaining.splice(i,1)[0];
   const blocked=s.people.includes(simulation.unavailable)||s.depends.some(d=>byId.get(d).blocked);
   const dependencyEnd=Math.max(start,...s.depends.map(d=>byId.get(d).end));
   const personEnd=Math.max(start,...s.people.map(p=>free.get(p)||start));
   const delay=s.id===simulation.delayStep?Math.max(0,Number(simulation.delay)||0):0;
   const begin=Math.max(dependencyEnd,personEnd)+delay,end=begin+s.duration;
   const row={...s,begin,end,blocked,delay,wait:begin-dependencyEnd-delay};rows.push(row);byId.set(s.id,row);s.people.forEach(p=>free.set(p,end));
 }
 return {errors:[],rows:rows.sort((a,b)=>a.begin-b.begin||plan.steps.findIndex(s=>s.id===a.id)-plan.steps.findIndex(s=>s.id===b.id)),start,end:Math.max(start,...rows.map(r=>r.end))};
}
export function time(minutes){const day=Math.floor(minutes/1440);const n=minutes%1440;return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}${day?` (+${day}d)`:''}`;}
export const example=()=>({version:1,title:'Product launch rehearsal',start:'18:00',people:['Alex','Sam'],steps:[{id:'welcome',title:'Welcome & sound check',duration:5,people:['Alex'],depends:[],notes:'Check handheld mic and house lights.'},{id:'demo',title:'Live product demo',duration:15,people:['Alex','Sam'],depends:['welcome'],notes:'Open the demo environment before doors.'},{id:'questions',title:'Audience questions',duration:10,people:['Alex'],depends:['demo'],notes:'Keep the final two minutes for one last question.'},{id:'handoff',title:'Partner handoff',duration:5,people:['Sam'],depends:['questions'],notes:'Switch slides and pass the clicker.'},{id:'close',title:'Closing & next steps',duration:5,people:['Alex'],depends:['handoff'],notes:'Show the contact link.'}]});
