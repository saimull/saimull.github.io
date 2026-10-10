(function(root){
function payment(balance,rate,months){const r=rate/1200;return r===0?balance/months:balance*r/(1-Math.pow(1+r,-months));}
function simulate(p,share,annual=p.returns,shock=false){
 const regular=payment(p.balance,p.rate,p.term*12),budget=regular+p.extra;
 let debt=p.balance,invest=p.existing,interest=0,contributed=0,payoff=null;
 const rows=[{month:0,debt,invest,net:invest-debt,interest,contributed}];
 for(let m=1;m<=p.horizon*12;m++){
  const rr=(shock&&m<=12)?Math.pow(.8,1/12)-1:Math.pow(1+(shock?6:annual)/100,1/12)-1;
  invest*=1+rr;
  let spent=0;
  if(debt>0){const dueInterest=debt*p.rate/1200;interest+=dueInterest;spent=Math.min(regular+p.extra*share,debt+dueInterest);debt=Math.max(0,debt+dueInterest-spent);if(debt<1e-7){debt=0;payoff=m;}}
  const contribution=budget-spent;invest+=contribution;contributed+=contribution;
  rows.push({month:m,debt,invest,net:invest-debt,interest,contributed});
 }
 return {regular,budget,payoff,rows,...rows.at(-1)};
}
function breakEven(p){let lo=-90,hi=100;const delta=r=>simulate(p,0,r).net-simulate(p,1,r).net;if(Math.abs(delta(0))<1e-6&&Math.abs(delta(20))<1e-6)return null;for(let i=0;i<60;i++){const mid=(lo+hi)/2;if(delta(mid)>0)hi=mid;else lo=mid;}return (lo+hi)/2;}
const api={payment,simulate,breakEven};if(typeof module!=='undefined')module.exports=api;else root.MortgageMath=api;
})(typeof window!=='undefined'?window:globalThis);
