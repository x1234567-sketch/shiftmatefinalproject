"use strict";
const KEY="shiftmate-sample-v1";
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const offsetDate=(n)=>{const d=new Date();d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const samples=()=>[
 {id:"s1",name:"Check fridge temperature",assignee:"Alex",due:offsetDate(-1),priority:"High",done:false},
 {id:"s2",name:"Clean coffee machine",assignee:"Jamie",due:today(),priority:"High",done:false},
 {id:"s3",name:"Restock takeaway cups",assignee:"Sam",due:offsetDate(1),priority:"Medium",done:false},
 {id:"s4",name:"Wipe down tables",assignee:"Taylor",due:today(),priority:"Medium",done:true},
 {id:"s5",name:"Check milk supplies",assignee:"Alex",due:offsetDate(-2),priority:"High",done:false},
 {id:"s6",name:"Empty recycling bins",assignee:"Jamie",due:offsetDate(2),priority:"Low",done:false},
 {id:"s7",name:"Prepare pastry display",assignee:"Sam",due:today(),priority:"Medium",done:true},
 {id:"s8",name:"Complete closing checklist",assignee:"Taylor",due:offsetDate(1),priority:"High",done:false}
];
function load(){try{const raw=localStorage.getItem(KEY);if(raw!==null){const v=JSON.parse(raw);if(Array.isArray(v))return v}}catch(e){console.warn("Unable to read saved tasks",e)}return samples()}
let tasks=load();
function persist(){try{localStorage.setItem(KEY,JSON.stringify(tasks))}catch(e){alert("Your browser could not save changes. Check storage settings.")}}
const $=(id)=>document.getElementById(id);
const overdue=(t)=>!t.done&&t.due<today();
function makeButton(label,cls,handler){const b=document.createElement("button");b.type="button";b.textContent=label;b.className=cls;b.addEventListener("click",handler);return b}
function render(){
 $("total").textContent=tasks.length;$("pending").textContent=tasks.filter(t=>!t.done).length;$("done").textContent=tasks.filter(t=>t.done).length;$("overdue").textContent=tasks.filter(overdue).length;
 const filter=$("filter").value;const visible=tasks.filter(t=>filter==="all"||(filter==="pending"&&!t.done)||(filter==="completed"&&t.done)||(filter==="overdue"&&overdue(t)));
 const root=$("taskList");root.replaceChildren();if(!visible.length){const p=document.createElement("p");p.textContent="No tasks match this filter.";root.append(p);return}
 for(const t of visible){const card=document.createElement("article");const top=document.createElement("div");top.className="task-top";const h=document.createElement("h3");h.textContent=t.name;const pill=document.createElement("span");pill.className="pill"+(t.done?" completed":overdue(t)?" overdue":t.due===today()?" today":"");pill.textContent=t.done?"Completed":overdue(t)?"Overdue":t.due===today()?"Due today":"Pending";top.append(h,pill);
 const meta=document.createElement("p");meta.className="task-meta";meta.textContent=`Assigned: ${t.assignee} · Due: ${t.due} · Priority: ${t.priority}`;
 const buttons=document.createElement("div");buttons.className="task-buttons";buttons.append(makeButton(t.done?"Reopen":"Complete","finish",()=>{t.done=!t.done;persist();render()}),makeButton("Edit","",()=>edit(t.id)),makeButton("Delete","",()=>{if(confirm(`Delete “${t.name}”?`)){tasks=tasks.filter(x=>x.id!==t.id);persist();render()}}));card.append(top,meta,buttons);root.append(card)}
}
function edit(id){const t=tasks.find(x=>x.id===id);if(!t)return;$("editId").value=t.id;$("taskName").value=t.name;$("assignee").value=t.assignee;$("dueDate").value=t.due;$("priority").value=t.priority;$("formTitle").textContent="Edit café task";$("saveTask").textContent="Save changes";$("cancelEdit").hidden=false;$("taskForm").scrollIntoView({behavior:"smooth",block:"center"})}
function clearEdit(){$("taskForm").reset();$("editId").value="";$("dueDate").value=today();$("formTitle").textContent="Add a café task";$("saveTask").textContent="Add task";$("cancelEdit").hidden=true}
$("taskForm").addEventListener("submit",e=>{e.preventDefault();const item={id:$("editId").value||`task-${Date.now()}-${Math.random().toString(36).slice(2)}`,name:$("taskName").value.trim(),assignee:$("assignee").value.trim(),due:$("dueDate").value,priority:$("priority").value,done:false};if(!item.name||!item.assignee||!item.due)return;const idx=tasks.findIndex(t=>t.id===item.id);if(idx>=0){item.done=tasks[idx].done;tasks[idx]=item}else tasks.unshift(item);persist();clearEdit();render()});
$("cancelEdit").addEventListener("click",clearEdit);$("filter").addEventListener("change",render);$("reset").addEventListener("click",()=>{if(confirm("Replace your current tasks with the original eight fictional sample tasks?")){tasks=samples();persist();clearEdit();$("filter").value="all";render()}});$("dueDate").value=today();render();
