function draw(){const d=D,x=d.dates,L=(k,n,c,dash,ya)=>({x,y:d[k],name:n,type:'scatter',mode:'lines',line:{width:1.4,color:c,dash},yaxis:ya||'y'});
 const t=[{type:'candlestick',x,open:d.open,high:d.high,low:d.low,close:d.close,name:'Price',increasing:{line:{color:'#22c55e'}},decreasing:{line:{color:'#ef4444'}}}];
 if(TG.SMA20)t.push(L('sma20','SMA20','#38bdf8'));if(TG.SMA50)t.push(L('sma50','SMA50','#f59e0b'));if(TG.SMA200)t.push(L('sma200','SMA200','#e879f9'));if(TG.EMA20)t.push(L('ema20','EMA20','#a3e635','dot'));
 if(TG.Bollinger){t.push({...L('bb_lo','BB lower','#64748b','dash'),showlegend:false},{...L('bb_up','Bollinger','#64748b','dash'),fill:'tonexty',fillcolor:'rgba(99,102,241,.08)'})}
 t.push({type:'bar',x,y:d.volume,name:'Volume',marker:{color:'#64748b88'},yaxis:'y2'},L('rsi','RSI','#a78bfa',null,'y3'),
  {type:'bar',x,y:d.hist,name:'Hist',marker:{color:d.hist.map(v=>v>=0?'#22c55e88':'#ef444488')},yaxis:'y4'},L('macd','MACD','#38bdf8',null,'y4'),L('signal','Signal','#f59e0b',null,'y4'));
 const ax=(dm,o)=>({domain:dm,gridcolor:'#ffffff0d',zeroline:false,...o});
 const sh=v=>({type:'line',xref:'paper',x0:0,x1:1,yref:'y3',y0:v,y1:v,line:{color:'#ffffff33',dash:'dot',width:1}});
 Plotly.react('chart',t,{paper_bgcolor:'transparent',plot_bgcolor:'transparent',font:{color:'#8b97b3',family:'Inter'},margin:{l:50,r:10,t:10,b:30},hovermode:'x unified',
  xaxis:{rangeslider:{visible:false},gridcolor:'#ffffff0d',anchor:'y4'},yaxis:ax([.42,1]),yaxis2:ax([.30,.40],{showticklabels:false}),yaxis3:ax([.15,.28],{range:[0,100]}),yaxis4:ax([0,.13]),
  shapes:[sh(30),sh(70)],legend:{orientation:'h',y:1.04},annotations:[{text:'RSI',xref:'paper',yref:'paper',x:0,y:.28,showarrow:false},{text:'MACD',xref:'paper',yref:'paper',x:0,y:.13,showarrow:false}]},{responsive:true,displaylogo:false})}
