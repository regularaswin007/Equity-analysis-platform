$('#mk').onclick=e=>{if(e.target.dataset.m){setM(e.target.dataset.m)}};
$('#pd').onclick=e=>{if(e.target.dataset.p){P=e.target.dataset.p;document.querySelectorAll('#pd button').forEach(b=>b.classList.toggle('on',b===e.target));run()}};
$('#go').onclick=run;$('#t').onkeydown=e=>{if(e.key==='Enter')run()};
$('#tgs').innerHTML=Object.keys(TG).map(k=>`<button class="tg ${TG[k]?'on':''}" data-k="${k}">${k}</button>`).join('');
$('#tgs').onclick=e=>{const k=e.target.dataset.k;if(k){TG[k]=!TG[k];e.target.classList.toggle('on');D&&draw()}};
async function run(){
 const id=++reqId,t=$('#t').value.trim();if(!t)return;err('');$('#go').textContent='…';
 try{const r=await fetch(`/api/analyze?market=${M}&ticker=${encodeURIComponent(t)}&period=${P}`);
  if(!r.ok)throw new Error((await r.json()).detail||'Request failed');const d=await r.json();if(id!==reqId)return;D=d;render();saveH();news(id)}
 catch(e){err(e.message)}finally{$('#go').textContent='Analyze'}}
