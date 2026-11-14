(function(root){
 'use strict';
 function calculate({price,first,drop,increase,budget}){
  if(![price,first,drop,increase,budget].every(Number.isFinite)||price<.01||price>1e7||first<1||first>1e6||drop<.1||drop>90||increase<0||increase>1e6||budget<first||budget>1e6)throw new Error('Enter valid amounts. Your budget must cover the first purchase.');
  let rows=[],spentCents=0,shares=0,p=price;
  const budgetCents=Math.round(budget*100),firstCents=Math.round(first*100),incCents=Math.round(increase*100);
  for(let n=0;n<500;n++){
   const amountCents=firstCents+n*incCents;
   if(spentCents+amountCents>budgetCents||p<.01)break;
   const amount=amountCents/100;
   shares+=amount/p;spentCents+=amountCents;
   rows.push({number:n+1,price:p,amount,spent:spentCents/100,shares,average:spentCents/100/shares,cash:(budgetCents-spentCents)/100});
   p*=1-drop/100;
  }
  return {rows,spent:spentCents/100,shares,average:spentCents/100/shares,cash:(budgetCents-spentCents)/100,capped:rows.length===500,priceFloor:p<.01};
 }
 if(typeof module!=='undefined'&&module.exports)module.exports={calculate};else root.StepDown={calculate};
})(typeof window!=='undefined'?window:globalThis);
