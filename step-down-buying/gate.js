'use strict';
const accept=document.querySelector('#ack'),tiles=[...document.querySelectorAll('[data-page]')],dialog=document.querySelector('dialog');
accept.addEventListener('change',()=>tiles.forEach(t=>t.disabled=!accept.checked));
for(const tile of tiles)tile.addEventListener('click',()=>{
 if(!accept.checked)return;
 tiles.forEach(t=>t.disabled=true);
 dialog.showModal();
 document.querySelector('#gateTitle').textContent='One quick CAPTCHA…';
 document.querySelector('#gateBody').innerHTML='<p>Prove you’re human. Solve this:</p><div class="equation" aria-label="Find the derivative of e to the x squared times sine of x">d/dx [e<sup>x²</sup> sin(x)] = ?</div><p class="note">No pressure. We’ll wait.</p>';
 setTimeout(()=>{
  document.querySelector('#gateTitle').textContent='Just kidding 😄';
  document.querySelector('#gateBody').innerHTML='<p>You don’t need calculus to use this.</p><p class="note">Taking you there now…</p>';
  try{sessionStorage.setItem('stepDownAcknowledged','yes');}catch{}
  setTimeout(()=>location.assign('/step-down-buying/'+tile.dataset.page+'/'),1200);
 },2000);
});
dialog.addEventListener('cancel',event=>event.preventDefault());
document.querySelectorAll('[data-page]').forEach(t=>t.disabled=!accept.checked);
