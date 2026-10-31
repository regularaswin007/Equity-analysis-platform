const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let M='US',P='1y',D=null,TG={SMA20:1,SMA50:1,SMA200:1,EMA20:0,Bollinger:1},reqId=0;
const cur=()=>M==='US'?'USD':'INR';
const money=v=>v==null?'—':new Intl.NumberFormat(M==='US'?'en-US':'en-IN',{style:'currency',currency:cur()}).format(v);
const big=v=>{if(v==null)return'—';const a=Math.abs(v);if(M!=='US'){const f=x=>(x).toLocaleString('en-IN',{maximumFractionDigits:2});return a>=1e7?'₹'+f(v/1e7)+' Cr':a>=1e5?'₹'+f(v/1e5)+' L':money(v)}
const u=[[1e12,'T'],[1e9,'B'],[1e6,'M']].find(x=>a>=x[0]);return u?'$'+(v/u[0]).toFixed(2)+u[1]:'$'+v.toLocaleString()};
const r2=(v,p)=>v==null?'—':p?(v*100).toFixed(2)+'%':v.toFixed(2);
