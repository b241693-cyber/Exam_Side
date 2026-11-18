const quizSets = [
 {id:"science-basics",title:"Science fundamentals",subject:"Science",icon:"⚗️",level:"Beginner",description:"Explore basic physics, chemistry and biology concepts.",questions:[
  {q:"Which gas do plants mainly absorb during photosynthesis?",o:["Oxygen","Carbon dioxide","Nitrogen","Hydrogen"],a:1,e:"Plants absorb carbon dioxide and use light energy to make food."},
  {q:"What is the SI unit of force?",o:["Joule","Watt","Newton","Pascal"],a:2,e:"Force is measured in newtons (N)."},
  {q:"Which part of the cell controls its activities?",o:["Cell wall","Nucleus","Cytoplasm","Vacuole"],a:1,e:"The nucleus contains genetic material and controls cell activities."},
  {q:"Water boils at what temperature at sea level?",o:["50°C","90°C","100°C","120°C"],a:2,e:"At standard atmospheric pressure, water boils at 100°C."},
  {q:"Which vitamin is produced in skin with sunlight exposure?",o:["Vitamin A","Vitamin B12","Vitamin C","Vitamin D"],a:3,e:"Sunlight helps the skin produce vitamin D."}
 ]},
 {id:"maths-quick",title:"Mathematics quick test",subject:"Mathematics",icon:"📐",level:"Beginner",description:"Warm up with arithmetic, algebra and geometry.",questions:[
  {q:"What is 15% of 200?",o:["15","20","30","45"],a:2,e:"15% of 200 = 0.15 × 200 = 30."},
  {q:"Solve: 3x + 5 = 20.",o:["3","5","7","8"],a:1,e:"3x = 15, so x = 5."},
  {q:"What is the sum of angles in a triangle?",o:["90°","180°","270°","360°"],a:1,e:"The interior angles of every triangle add up to 180°."},
  {q:"What is the square root of 144?",o:["10","11","12","14"],a:2,e:"12 × 12 = 144."},
  {q:"Which is a prime number?",o:["21","27","29","33"],a:2,e:"29 has exactly two positive factors: 1 and 29."}
 ]},
 {id:"english-essentials",title:"English essentials",subject:"English",icon:"📖",level:"Beginner",description:"Practise grammar, vocabulary and sentence skills.",questions:[
  {q:"Choose the correct spelling.",o:["Accomodation","Acommodation","Accommodation","Acomodation"],a:2,e:"Accommodation is spelled with double c and double m."},
  {q:"Identify the noun: 'The child reads a book.'",o:["The","Reads","Child","A"],a:2,e:"Child is a noun because it names a person."},
  {q:"Choose the antonym of 'ancient'.",o:["Old","Modern","Historic","Past"],a:1,e:"Modern is the opposite of ancient."},
  {q:"Which sentence is grammatically correct?",o:["She go to school.","She goes to school.","She going school.","She gone to school."],a:1,e:"With 'she' in the simple present, use 'goes'."},
  {q:"What is the plural of 'criterion'?",o:["Criterions","Criteria","Criterias","Criterion"],a:1,e:"The plural form of criterion is criteria."}
 ]},
 {id:"reasoning-starter",title:"Logical reasoning",subject:"Reasoning",icon:"🧩",level:"Beginner",description:"Build problem-solving skills with patterns and logic.",questions:[
  {q:"Find the next number: 2, 4, 8, 16, __",o:["18","24","30","32"],a:3,e:"Each number is multiplied by 2, so the next number is 32."},
  {q:"Which one does not belong?",o:["Square","Triangle","Circle","Carrot"],a:3,e:"Carrot is a vegetable; the others are geometric shapes."},
  {q:"If CAT is coded as DBU, how is DOG coded?",o:["EPH","CNG","FQI","EOG"],a:0,e:"Each letter moves one step forward: D→E, O→P, G→H."},
  {q:"A is taller than B. B is taller than C. Who is shortest?",o:["A","B","C","Cannot say"],a:2,e:"The order is A > B > C, so C is shortest."},
  {q:"Find the missing number: 5, 10, 15, __, 25",o:["18","19","20","22"],a:2,e:"The pattern adds 5 each time."}
 ]},
 {id:"science-advanced",title:"Science challenge",subject:"Science",icon:"🔬",level:"Intermediate",description:"A slightly tougher round covering scientific ideas.",questions:[
  {q:"Which phenomenon explains the blue colour of the sky?",o:["Reflection","Refraction","Scattering","Dispersion"],a:2,e:"Air molecules scatter shorter blue wavelengths more strongly."},
  {q:"The pH of a neutral solution at 25°C is:",o:["0","5","7","14"],a:2,e:"A neutral solution has pH 7 at 25°C."},
  {q:"Which blood cells help fight infection?",o:["Red blood cells","White blood cells","Platelets","Plasma"],a:1,e:"White blood cells are part of the immune system."},
  {q:"Which lens is used to correct myopia?",o:["Convex","Concave","Cylindrical only","Bifocal only"],a:1,e:"A concave lens diverges light to correct short-sightedness."},
  {q:"What is the chemical symbol for sodium?",o:["S","So","Na","N"],a:2,e:"Sodium's symbol is Na, from the Latin name natrium."}
 ]}
];

const $ = id => document.getElementById(id);
const storeKey = "examSidekickDataV1";
let data = loadData();
let activeFilter = "All", activeQuiz = null, currentQuestion = 0, answers = [], quizStartedAt = 0, timerInterval = null, selectedAnswer = null;
function loadData(){try{return JSON.parse(localStorage.getItem(storeKey))||{name:"Student",history:[],tasks:[]}}catch{return{name:"Student",history:[],tasks:[]}}}
function saveData(){localStorage.setItem(storeKey,JSON.stringify(data));renderStats();renderTasks()}
function renderStats(){
 const h=data.history, count=h.length, avg=count?Math.round(h.reduce((s,x)=>s+x.percent,0)/count):null;
 $("quizCount").textContent=count;$("averageScore").textContent=avg===null?"—":avg+"%";$("bestScore").textContent=count?Math.max(...h.map(x=>x.percent))+"%":"—";
 const mins=h.reduce((s,x)=>s+x.minutes,0);$("studyTime").textContent=mins+" min";
 const done=data.tasks.filter(t=>t.done).length, taskPct=data.tasks.length?Math.round(done/data.tasks.length*100):0;
 $("heroProgress").textContent=taskPct+"%";$("heroProgressBar").style.width=taskPct+"%";
 $("streakCount").textContent=(count?Math.min(count,7):0)+" day streak";
 $("planPercent").textContent=taskPct+"%";$("planBar").style.width=taskPct+"%";
}
function renderQuizzes(){
 const term=$("searchInput").value.trim().toLowerCase();
 const list=quizSets.filter(q=>(activeFilter==="All"||q.subject===activeFilter)&&(`${q.title} ${q.description} ${q.subject}`).toLowerCase().includes(term));
 $("quizGrid").innerHTML=list.length?list.map(q=>`<article class="quiz-card"><div class="quiz-card-top"><span class="subject-icon">${q.icon}</span><span class="difficulty">${q.level}</span></div><h3>${q.title}</h3><p>${q.description}</p><div class="quiz-card-bottom"><span class="question-count">◷ &nbsp; ${q.questions.length} questions · ${q.subject}</span><button class="start-link" data-quiz="${q.id}">Start quiz →</button></div></article>`).join(""):`<div class="empty-state">No topics found. Try another search.</div>`;
 document.querySelectorAll("[data-quiz]").forEach(b=>b.addEventListener("click",()=>startQuiz(b.dataset.quiz)));
}
function renderTasks(){
 $("taskCount").textContent=`${data.tasks.filter(t=>!t.done).length} pending`;
 $("taskList").innerHTML=data.tasks.length?data.tasks.map(t=>`<div class="task-item ${t.done?"done":""}"><input type="checkbox" data-task="${t.id}" ${t.done?"checked":""} aria-label="Mark task complete"><span>${escapeHtml(t.text)}</span><button class="delete-task" data-delete="${t.id}" aria-label="Delete task">×</button></div>`).join(""):`<div class="empty-state">No tasks yet. Add your first study topic above.</div>`;
 document.querySelectorAll("[data-task]").forEach(el=>el.addEventListener("change",()=>{const t=data.tasks.find(x=>x.id===el.dataset.task);if(t)t.done=el.checked;saveData()}));
 document.querySelectorAll("[data-delete]").forEach(el=>el.addEventListener("click",()=>{data.tasks=data.tasks.filter(x=>x.id!==el.dataset.delete);saveData()}));
 const done=data.tasks.filter(t=>t.done).length,pct=data.tasks.length?Math.round(done/data.tasks.length*100):0;$("planPercent").textContent=pct+"%";$("planBar").style.width=pct+"%";$("heroProgress").textContent=pct+"%";$("heroProgressBar").style.width=pct+"%";
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function startQuiz(id){
 activeQuiz=quizSets.find(q=>q.id===id);currentQuestion=0;answers=[];selectedAnswer=null;quizStartedAt=Date.now();
 $("modalTitle").textContent=activeQuiz.title;$("modalSubject").textContent=activeQuiz.subject.toUpperCase()+" · "+activeQuiz.level.toUpperCase();
 $("resultArea").classList.add("hidden");$("questionArea").classList.remove("hidden");$("nextQuestion").classList.remove("hidden");$("quitQuiz").classList.remove("hidden");$("quizModal").classList.remove("hidden");renderQuestion();
 clearInterval(timerInterval);timerInterval=setInterval(()=>{const s=Math.floor((Date.now()-quizStartedAt)/1000);$("quizTimer").textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")},1000);
}
function renderQuestion(){
 const q=activeQuiz.questions[currentQuestion];selectedAnswer=null;
 $("questionProgress").textContent=`Question ${currentQuestion+1} of ${activeQuiz.questions.length}`;$("questionBar").style.width=((currentQuestion+1)/activeQuiz.questions.length*100)+"%";
 $("questionArea").innerHTML=`<h3 class="question-text">${escapeHtml(q.q)}</h3><div class="answer-list">${q.o.map((o,i)=>`<button class="answer-option" data-answer="${i}"><span class="option-letter">${"ABCD"[i]}</span>${escapeHtml(o)}</button>`).join("")}</div><div id="feedback"></div>`;
 document.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>chooseAnswer(Number(b.dataset.answer))));
 $("nextQuestion").disabled=true;$("nextQuestion").textContent=currentQuestion===activeQuiz.questions.length-1?"See results →":"Next question →";
}
function chooseAnswer(index){
 if(selectedAnswer!==null)return;selectedAnswer=index;const q=activeQuiz.questions[currentQuestion],correct=index===q.a;answers[currentQuestion]=index;
 document.querySelectorAll("[data-answer]").forEach((b,i)=>{b.disabled=true;if(i===q.a)b.classList.add("correct");else if(i===index)b.classList.add("wrong")});
 $("feedback").innerHTML=`<div class="feedback ${correct?"good":"bad"}"><b>${correct?"Correct!":"Not quite."}</b> ${escapeHtml(q.e)}</div>`;$("nextQuestion").disabled=false;
}
function finishQuiz(){
 clearInterval(timerInterval);const correct=answers.filter((a,i)=>a===activeQuiz.questions[i].a).length,percent=Math.round(correct/activeQuiz.questions.length*100),minutes=Math.max(1,Math.round((Date.now()-quizStartedAt)/60000));
 data.history.push({quiz:activeQuiz.title,percent,minutes,date:new Date().toISOString()});saveData();
 $("questionArea").classList.add("hidden");$("nextQuestion").classList.add("hidden");$("quitQuiz").classList.add("hidden");$("resultArea").classList.remove("hidden");
 const message=percent===100?"Perfect score! Outstanding work.":percent>=70?"Great effort! Keep building on this momentum.":percent>=40?"Good start. Review the explanations and try again.":"Every attempt is progress. Revise the basics and give it another go.";
 $("resultArea").innerHTML=`<div class="result"><div style="font-size:34px">${percent>=70?"🏆":"📚"}</div><div class="result-score">${percent}%</div><b>${correct} out of ${activeQuiz.questions.length} correct</b><p>${message}<br>Time spent: ${minutes} minute(s)</p><div class="result-actions"><button class="btn btn-ghost" id="reviewBtn">Back to dashboard</button><button class="btn btn-primary" id="retryBtn">Try again ↻</button></div></div>`;
 $("reviewBtn").onclick=closeQuiz;$("retryBtn").onclick=()=>startQuiz(activeQuiz.id);
}
function closeQuiz(){clearInterval(timerInterval);$("quizModal").classList.add("hidden");activeQuiz=null}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
$("subjectFilters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderQuizzes()});
$("searchInput").addEventListener("input",renderQuizzes);
$("taskForm").addEventListener("submit",e=>{e.preventDefault();const text=$("taskInput").value.trim();if(!text)return;data.tasks.push({id:Date.now().toString(),text,done:false});$("taskInput").value="";saveData();toast("Study task added!")});
$("nextQuestion").addEventListener("click",()=>{if(selectedAnswer===null)return;if(currentQuestion<activeQuiz.questions.length-1){currentQuestion++;renderQuestion()}else finishQuiz()});
$("closeQuiz").addEventListener("click",closeQuiz);$("quitQuiz").addEventListener("click",()=>{if(confirm("Exit this quiz? Your current attempt will not be saved."))closeQuiz()});
$("quizModal").addEventListener("click",e=>{if(e.target===$("quizModal"))closeQuiz()});
$("profileBtn").addEventListener("click",()=>{const name=prompt("What should we call you?",data.name||"Student");if(name&&name.trim()){data.name=name.trim().slice(0,30);$("profileBtn").textContent=data.name.split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase();toast("Profile updated!") }});
$("todayDate").textContent=new Intl.DateTimeFormat("en-IN",{weekday:"long",day:"numeric",month:"long"}).format(new Date());$("year").textContent=new Date().getFullYear();
$("profileBtn").textContent=(data.name||"Student").split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase();
renderQuizzes();renderStats();renderTasks();