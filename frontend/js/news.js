async function news(id){
 $('#news').innerHTML='<div class="ld">Loading…</div>';$('#gauge').innerHTML='<div class="ld">Analyzing headlines with FinBERT…</div>';
 try{const r=await fetch(`/api/news?market=${M}&ticker=${encodeURIComponent($('#t').value.trim())}&name=${encodeURIComponent(D.name)}`),n=await r.json();if(id!==reqId)return;
  $('#news').innerHTML=n.items.length?n.items.map(i=>{const c=i.label==='positive'?'pos':i.label==='negative'?'neg':'neu';
   return`<div class="ni"><div><a href="${esc(i.link)}" target="_blank" rel="noopener">${esc(i.title)}</a><div class="k">${esc(i.source)}</div></div>${i.label?`<span class="pill ${c}" style="height:fit-content">${i.label} ${i.score>0?'+':''}${i.score}</span>`:''}</div>`}).join(''):'<div class="k">No headlines found.</div>';
  if(n.avg==null){$('#gauge').innerHTML=`<div class="k">${esc(n.error||'No sentiment available.')}</div>`;return}
  $('#gauge').innerHTML='';Plotly.newPlot('gauge',[{type:'indicator',mode:'gauge+number',value:n.avg,number:{font:{color:'#e8edf7'},valueformat:'+.2f'},
   gauge:{axis:{range:[-1,1]},bar:{color:'#818cf8'},bgcolor:'transparent',borderwidth:0,steps:[{range:[-1,-.15],color:'#ef444455'},{range:[-.15,.15],color:'#ffffff1a'},{range:[.15,1],color:'#22c55e55'}]}}],
   {paper_bgcolor:'transparent',font:{color:'#8b97b3',family:'Inter'},margin:{l:25,r:25,t:20,b:10}},{displayModeBar:false,responsive:true})
 }catch(e){$('#news').innerHTML='<div class="k">Could not load news.</div>'}}
