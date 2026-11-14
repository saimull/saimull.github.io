'use strict';
const form=document.querySelector('form'),error=document.querySelector('#error'),output=document.querySelector('#output');
const money=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2});
let plan;
function scenario(){
 const field=document.querySelector('#future'),value=field.valueAsNumber;
 const invalid=!field.validity.valid||!Number.isFinite(value);
 document.querySelector('#scenarioError').textContent=invalid?'Enter a future price of $0 or more.':'';
 document.querySelector('#scenarioResult').hidden=invalid;
 if(invalid||!plan)return;
 const position=plan.shares*value,pnl=position-plan.spent;
 const result=document.querySelector('#pnl');
 result.textContent=(pnl>0?'+':'')+money(pnl)+' ('+(pnl/plan.spent*100).toFixed(1)+'%)';
 result.className='result '+(pnl>=0?'positive':'negative');
 document.querySelector('#value').textContent=money(position);
 document.querySelector('#combined').textContent=money(position+plan.cash);
}
form.addEventListener('submit',event=>{event.preventDefault();
 if(!form.reportValidity())return;
 const values=Object.fromEntries(['price','first','drop','increase','budget'].map(k=>[k,document.querySelector('#'+k).valueAsNumber]));
 try{plan=StepDown.calculate(values);error.textContent='';}catch(e){error.textContent=e.message;output.hidden=true;return;}
 output.hidden=false;
 document.querySelector('#avg').textContent=money(plan.average);
 document.querySelector('#spent').textContent=money(plan.spent);
 document.querySelector('#cash').textContent=money(plan.cash);
 document.querySelector('#allocation').style.width=100*plan.spent/values.budget+'%';
 document.querySelector('#count').textContent=plan.rows.length+' planned purchases';
 document.querySelector('#rows').innerHTML=plan.rows.map(r=>'<tr><td>'+r.number+'</td><td>'+money(r.price)+'</td><td>'+money(r.amount)+'</td><td>'+money(r.spent)+'</td><td>'+money(r.average)+'</td><td>'+money(r.cash)+'</td></tr>').join('');
 document.querySelector('#stop').textContent=plan.capped?'Showing the first 500 purchases. Some budget remains unallocated.':plan.priceFloor?'The plan stops before the next buying price falls below $0.01.':'The plan stops before the next full purchase would exceed your budget. Leftover cash stays uninvested.';
 document.querySelector('#future').value=values.price;
 scenario();
});
form.addEventListener('input',()=>{output.hidden=true;document.querySelector('#recalculate').textContent='Update your plan to see the new numbers.';});
form.addEventListener('submit',()=>{document.querySelector('#recalculate').textContent='';});
document.querySelector('#future').addEventListener('input',scenario);
form.requestSubmit();
