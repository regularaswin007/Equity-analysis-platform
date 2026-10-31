const err=m=>{const e=$('#err');e.textContent=m;e.style.display=m?'block':'none'};
const H=()=>{try{return JSON.parse(localStorage.hist||'[]')}catch{return[]}};
function saveH(){try{const h=H().filter(x=>x[0]!==M||x[1]!==D.symbol.split('.')[0]);h.unshift([M,D.symbol.split('.')[0]]);localStorage.hist=JSON.stringify(h.slice(0,10))}catch{}drawH()}
function drawH(){$('#hist').innerHTML=H().map(x=>`<span class="chip" data-m="${x[0]}" data-t="${esc(x[1])}">${x[0]} · ${esc(x[1])}</span>`).join('')}
$('#hist').onclick=e=>{const c=e.target.closest('.chip');if(c){setM(c.dataset.m);$('#t').value=c.dataset.t;run()}};
function setM(m){M=m;document.querySelectorAll('#mk button').forEach(b=>b.classList.toggle('on',b.dataset.m===m))}
