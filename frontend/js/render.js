function render(){const d=D,n=d.close.length,l=d.close[n-1],p=d.close[n-2],c=(l/p-1)*100,i=d.info;
 $('#nm').textContent=d.name;$('#sb').textContent=`${d.symbol} · ${i.sector||'—'} · ${i.industry||''}`;$('#pr').textContent=money(l);
 const ch=$('#ch');ch.textContent=`${c>=0?'▲':'▼'} ${Math.abs(c).toFixed(2)}%`;ch.className='pill '+(c>=0?'up':'dn');
 const lo=i.fiftyTwoWeekLow??Math.min(...d.low),hi=i.fiftyTwoWeekHigh??Math.max(...d.high),pos=Math.max(0,Math.min(100,(l-lo)/(hi-lo)*100));
 const avg=d.volume.reduce((a,b)=>a+b,0)/n;
 $('#stats').innerHTML=[['Market cap',big(i.marketCap)],['P/E (TTM)',r2(i.trailingPE)],['Avg volume',Math.round(avg).toLocaleString(M==='US'?'en-US':'en-IN')]].map(x=>`<div class="card"><div class="k">${x[0]}</div><div class="v">${x[1]}</div></div>`).join('')
 +`<div class="card"><div class="k">52-week range</div><div class="v" style="font-size:15px">${money(lo)} – ${money(hi)}</div><div class="rng"><i style="left:${pos}%"></i></div></div>`;
 $('#sig').innerHTML=d.signals.map(s=>`<div class="sig ${s.tone}"><span class="dot"></span>${esc(s.text)}</div>`).join('');
 const f=[['Forward P/E',r2(i.forwardPE)],['P/B',r2(i.priceToBook)],['P/S',r2(i.priceToSalesTrailing12Months)],['EPS (TTM)',money(i.trailingEps)],['ROE',r2(i.returnOnEquity,1)],['ROA',r2(i.returnOnAssets,1)],['Profit margin',r2(i.profitMargins,1)],['Operating margin',r2(i.operatingMargins,1)],['Debt / Equity',r2(i.debtToEquity)],['Current ratio',r2(i.currentRatio)],['Dividend yield',i.dividendYield==null?'—':i.dividendYield.toFixed(2)+'%'],['Beta',r2(i.beta)],['Revenue',big(i.totalRevenue)]];
 $('#fund').innerHTML=f.map(x=>`<div><div class="k">${x[0]}</div><div class="v">${x[1]}</div></div>`).join('');draw()}
