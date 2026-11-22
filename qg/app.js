/* TAOS Militar · app de estudos (base: plataforma Tático Cursos) */
/* ============================================================
   CONTEÚDO — Soldado PMDF. Aulas: Gran Cursos Online (curso
   "PMDF - Soldado QPPMC"). Lei seca: Planalto.
   ============================================================ */
const CURSO=window.CURSO;
const G=window.GRAN;
const CORES=['#1d5fd1','#0b7285','#7048e8','#a07d00','#c2255c','#2b8a3e','#e8590c','#364fc7','#9c36b5','#e03131','#0ca678','#5c940d','#868e96'];
const DISC=G.disc.map((d,i)=>({...d,cor:CORES[i%CORES.length]}));
const MAT=Object.fromEntries(DISC.map(d=>[d.id,d]));
const UN={},AULA={};
const PDFS=window.TATICO_PDF||{};
function pdfsDe(u,aulas){const l=PDFS[u.id]||[];if(!aulas)return l;const ns=new Set(aulas.map(v=>AULA[v].n));return l.filter(p=>p.a.some(n=>ns.has(n)))}
DISC.forEach(d=>d.u.forEach((u,ui)=>{u.d=d.id;u.ix=ui;UN[u.id]=u;u.a.forEach((a,i)=>{AULA[a[0]]={v:a[0],t:a[1],s:a[2],p:G.profs[a[3]],pdf:!!a[4],u:u.id,n:i+1}})}));
const TOTAL_AULAS=Object.keys(AULA).length;
const INTERVALOS=[1,7,15,30];
const MIN_REV=10;
const DIAS=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const DIAS_C=['D','S','T','Q','Q','S','S'];
const MARCA='TAOS '+(CURSO.marca||'MILITAR');
const LOGO=`<span class="taos-logo"><svg viewBox="0 0 90 90" fill="currentColor" aria-hidden="true"><rect width="90" height="14"/><rect x="24" y="22" width="10" height="68"/><rect x="40" y="22" width="10" height="68"/><rect x="56" y="22" width="10" height="68"/></svg><span class="sep"></span><span><b>TAOS</b><i>${CURSO.marca||'MILITAR'} · ${CURSO.sigla}</i></span></span>`;
/* Patentes por questões certas: [mínimo, nome, nível da insígnia] */
const PATENTES=CURSO.patentes||[[0,'Recruta',0],[300,'Soldado',1],[1000,'Cabo',2],[2500,'3º Sargento',3],[5000,'2º Sargento',4],[9000,'1º Sargento',5],[15000,'Subtenente',6],[25000,'Aspirante',7],[40000,'Tenente',8]];
/* ---------- Arte (desenhos próprios) ---------- */
const ART={
 granada:`<svg viewBox="0 0 64 64" aria-hidden="true"><defs><clipPath id="gcp"><ellipse cx="32" cy="41" rx="16.5" ry="19"/></clipPath><radialGradient id="gbg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7d8f45"/><stop offset=".6" stop-color="#4d5a28"/><stop offset="1" stop-color="#2c3416"/></radialGradient></defs><ellipse cx="32" cy="41" rx="16.5" ry="19" fill="url(#gbg)" stroke="#1d230f" stroke-width="1.5"/><g clip-path="url(#gcp)" stroke="#232a12" stroke-width="2" opacity=".85"><path d="M10 31h44M10 41h44M10 51h44M24 18v46M32 18v46M40 18v46"/></g><rect x="25" y="15" width="14" height="8" rx="1.5" fill="#9aa08a" stroke="#4a4f3f"/><rect x="27.5" y="11" width="9" height="5" rx="1" fill="#7d826f"/><path d="M38 14l8.5 2.5q4.5 9-1.5 22" fill="none" stroke="#b9bea6" stroke-width="3.2" stroke-linecap="round"/><circle cx="20" cy="15" r="6" fill="none" stroke="#d6a630" stroke-width="2.4"/><path d="M25.5 16.5h3" stroke="#d6a630" stroke-width="2.4"/></svg>`,
 pino:`<svg viewBox="0 0 40 30" aria-hidden="true"><circle cx="14" cy="15" r="10" fill="none" stroke="#d6a630" stroke-width="3.5"/><path d="M23 15h15" stroke="#d6a630" stroke-width="3.5" stroke-linecap="round"/></svg>`,
 fuzil:`<svg viewBox="0 0 220 64" aria-hidden="true"><path fill="currentColor" d="M2 30l34-6 6-3h22l2-4h46l2 3h40l2-2h16l1 2h40v5h-40l-1 2h-12l-2 4h-26l-6 15h-10l4-15h-12l-6 21h-13l5-21H52l-5 2-20 16H4z"/><rect x="88" y="12" width="26" height="4" rx="1.5" fill="currentColor"/><rect x="96" y="9" width="10" height="4" fill="currentColor"/></svg>`,
 mira:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><path d="M12 1v5M12 18v5M1 12h5M18 12h5"/></svg>`
};
{const tpl=ART.granada;let gid=0;Object.defineProperty(ART,'granada',{get(){gid++;return tpl.replace(/gcp/g,'gcp'+gid).replace(/gbg/g,'gbg'+gid)}})}
document.getElementById('loadArt').innerHTML=ART.granada;
document.getElementById('topLogo').innerHTML=LOGO;
function insignia(n){
  const ch=y=>`<path d="M8 ${y}l16 9 16-9" fill="none" stroke="#d6a630" stroke-width="4.5" stroke-linejoin="round"/>`;
  const arc=y=>`<path d="M8 ${y}q16 9 32 0" fill="none" stroke="#d6a630" stroke-width="4"/>`;
  const star=(f)=>`<path d="M24 6l5.3 11 12 1.6-8.8 8.3 2.2 11.9L24 33l-10.7 5.8 2.2-11.9-8.8-8.3 12-1.6z" fill="${f?'#d6a630':'none'}" stroke="#d6a630" stroke-width="3" stroke-linejoin="round"/>`;
  let g='';
  if(n===0)g=`<circle cx="24" cy="24" r="12" fill="none" stroke="#7a8269" stroke-width="3.5" stroke-dasharray="4 4"/>`;
  else if(n<=3)for(let i=0;i<n;i++)g+=ch(10+i*9+(3-n)*5);
  else if(n<=5){g=ch(6)+ch(14)+ch(22);for(let i=0;i<n-3;i++)g+=arc(32+i*7)}
  else if(n===6)g=`<path d="M24 6l14 18-14 18-14-18z" fill="none" stroke="#d6a630" stroke-width="4" stroke-linejoin="round"/><path d="M24 15l7 9-7 9-7-9z" fill="#d6a630"/>`;
  else g=star(n>=8);
  return`<svg viewBox="0 0 48 48" aria-hidden="true">${g}</svg>`;
}
(function(){const camo=`<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260"><rect width="260" height="260" fill="${CURSO.camo[0]}"/><g fill="${CURSO.camo[1]}"><path d="M-10 40q40-30 80-5t60 30q30 20-10 40t-70 0-60-65z"/><path d="M150 -10q50 10 70 40t-20 50-60-10-40-50 50-30z"/><path d="M120 150q40-20 80 0t40 50-50 40-70-20-0-70z"/><path d="M-20 190q30-20 60 0t30 50-60 30-30-80z"/></g><g fill="${CURSO.camo[2]}"><path d="M60 90q30-10 50 10t-10 40-50 0 10-50z"/><path d="M200 90q30 0 50 20t-10 40-40-10-0-50z"/><path d="M40 230q20-20 50-10t10 30-40 20-20-40z"/><path d="M170 210q20-10 30 10t-20 20-10-30z"/></g><g fill="${CURSO.camo[3]}"><path d="M100 20q20-10 30 5t-15 20-20-10 5-15z"/><path d="M10 130q20-5 25 15t-20 15-5-30z"/><path d="M230 180q15 0 20 15t-15 15-5-30z"/><path d="M140 110q15-5 20 10t-15 10-5-20z"/></g></svg>`;document.documentElement.style.setProperty('--camo',`url("data:image/svg+xml,${encodeURIComponent(camo)}")`)})();
const CFG=window.QG_CONFIG||{};
const sb=window.__SB||null;
let USER=null;

/* ---------- Datas ---------- */
const pad=n=>String(n).padStart(2,'0');
function fmt(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function hoje(){return fmt(new Date())}
function addD(s,n){const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return fmt(d)}
function dow(s){return new Date(s+'T12:00:00').getDay()}
function br(s){if(!s)return'';const[y,m,d]=s.split('-');return d+'/'+m}
function brA(s){if(!s)return'';const[y,m,d]=s.split('-');return d+'/'+m+'/'+y}
function diffD(a,b){return Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5)}
function segunda(s){return addD(s,-((dow(s)+6)%7))}

/* ---------- Estado ---------- */
function padrao(){return{v:2,nome:'',prova:'',bloco:90,vel:1,horas:[2,3,3,3,3,3,4],pesos:{},aulas:{},top:{},q:[],sim:[],cards:[],at:{},mats:{},notas:{},missao:{},rv:{},corte:70}}
let S=padrao();
const chaveLocal=()=>'taos-qg-'+CURSO.id+(USER?'-'+USER.id:'');
function lerLocal(k){try{const r=localStorage.getItem(k);if(r)return JSON.parse(r)}catch(e){}return null}
function gravarLocal(){try{localStorage.setItem(chaveLocal(),JSON.stringify(S))}catch(e){}}
let syncT=null,syncEstado='ok',ultimoSync=null,pendente=false;
function salvar(){
  gravarLocal();_cache.k=null;
  if(!sb||!USER)return;
  pendente=true;setSync('wait');clearTimeout(syncT);syncT=setTimeout(enviar,1200);
}
async function enviar(){
  if(!sb||!USER)return;
  const agora=new Date().toISOString();
  const {error}=await sb.from('progresso').upsert({user_id:USER.id,curso_id:CURSO.id,dados:S,atualizado:agora});
  if(error){setSync('err');console.error(error);syncT=setTimeout(enviar,8000);return}
  pendente=false;ultimoSync=agora;setSync('ok');
}
function setSync(e){syncEstado=e;const el=document.getElementById('sync');if(el){el.className='sync '+e;el.querySelector('span').textContent={ok:'Sincronizado',wait:'Salvando…',err:'Sem conexão — salvo no aparelho'}[e]}}
async function carregarRemoto(){
  const {data,error}=await sb.from('progresso').select('dados,atualizado').eq('user_id',USER.id).eq('curso_id',CURSO.id).maybeSingle();
  if(error)throw error;
  if(data&&data.dados&&data.dados.v){S=Object.assign(padrao(),data.dados);ultimoSync=data.atualizado;if(migrar())salvar();else gravarLocal();return}
  const local=lerLocal(chaveLocal())||null;
  S=Object.assign(padrao(),local||{});
  if(!S.nome)S.nome=(USER.user_metadata&&USER.user_metadata.nome)||'';
  migrar();salvar();
}
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ativ(d=hoje()){S.at[d]=1}

/* ---------- Aulas, blocos e fila ---------- */
const minAula=a=>Math.max(1,Math.round(a.s/60/(+S.vel||1)));
const aulaUrl=v=>`https://www.grancursosonline.com.br/aluno/curso/video/codigo/${G.curso}/v/${encodeURIComponent(v)}`;
function questoesUrl(q){if(!q)return null;const[b,as,query]=q.split('|');if(!as)return null;const p=new URLSearchParams();if(b)p.set('banca',b);p.set('assunto',as);if(query)p.set('query',query);p.set('desatualizada','0');p.set('anulada','0');return'https://questoes.grancursosonline.com.br/aluno/filtro/concursos?'+p.toString()}
const _cache={k:null};
function blocosDe(u){
  const k=S.bloco+'|'+S.vel;
  if(_cache.k!==k){_cache.k=k;_cache.b={}}
  if(_cache.b[u.id])return _cache.b[u.id];
  const out=[];let cur=null;
  u.a.forEach(a=>{const m=minAula(AULA[a[0]]);if(!cur||(cur.min+m>S.bloco&&cur.aulas.length)){cur={u:u.id,i:out.length,aulas:[],min:0};out.push(cur)}cur.aulas.push(a[0]);cur.min+=m});
  return _cache.b[u.id]=out;
}
const blocoFeito=b=>b.aulas.every(v=>S.aulas[v]);
const dataBloco=b=>b.aulas.reduce((m,v)=>S.aulas[v]>m?S.aulas[v]:m,'');
function unidadeFeita(u){return u.a.every(a=>S.aulas[a[0]])}
function peso(d){const p=S.pesos[d.id];return p===undefined?d.peso:+p}
function fila(){
  const est=DISC.map(d=>{const bl=[];let feitos=0;d.u.forEach(u=>blocosDe(u).forEach(b=>{blocoFeito(b)?feitos++:bl.push(b)}));const w=Math.max(0,peso(d)||0);return{bl,w,pass:w?feitos/w:0}}).filter(x=>x.w>0);
  const q=[];
  for(;;){let b=null;for(const x of est){if(x.bl.length&&(!b||x.pass<b.pass-1e-9))b=x}if(!b)break;q.push(b.bl.shift());b.pass+=1/b.w}
  return q;
}
function blocosFeitosEm(d){const out=[];DISC.forEach(D=>D.u.forEach(u=>blocosDe(u).forEach(b=>{if(blocoFeito(b)&&dataBloco(b)===d)out.push(b)})));return out}
/* ---------- Revisões por bloco estudado (1, 7, 15 e 30 dias) ---------- */
const REV_MIN={1:15,7:10,15:10,30:10}; // minutos por revisão, conforme o intervalo
function cobertas(){const s=new Set();for(const o of Object.values(S.rv))o.aulas.forEach(v=>s.add(v));return s}
function sincronizarRevisoes(u){
  // tira aulas desmarcadas; apaga revisões que ficaram vazias
  for(const[id,o]of Object.entries(S.rv)){if(o.u!==u.id)continue;o.aulas=o.aulas.filter(v=>S.aulas[v]);if(!o.aulas.length)delete S.rv[id]}
  // cada bloco concluído gera a sua revisão, a partir da data em que foi concluído
  const cob=cobertas();
  blocosDe(u).forEach(b=>{if(!blocoFeito(b))return;const novas=b.aulas.filter(v=>!cob.has(v));if(!novas.length)return;
    const d=dataBloco(b);S.rv['r'+uid()]={u:u.id,aulas:novas,e:d,r:INTERVALOS.map(i=>({i,d:addD(d,i),ok:null}))};novas.forEach(v=>cob.add(v))});
  // marcador de assunto 100% concluído
  if(unidadeFeita(u)){if(!S.top[u.id])S.top[u.id]={e:u.a.reduce((m,a)=>S.aulas[a[0]]>m?S.aulas[a[0]]:m,''),r:[]}}
  else if(S.top[u.id])delete S.top[u.id];
}
function migrar(){
  S.rv=S.rv||{};let mudou=false;
  const antes=JSON.stringify([S.rv,S.top]);
  Object.values(UN).forEach(u=>{
    const old=S.top[u.id];const legado=old&&old.r&&old.r.length?old.r:null;
    if(legado)S.top[u.id]={e:old.e,r:[]};
    sincronizarRevisoes(u);
    if(legado)Object.values(S.rv).forEach(o=>{if(o.u!==u.id)return;o.r.forEach(r=>{const l=legado.find(x=>x.i===r.i);if(l&&l.ok)r.ok=l.ok})});
  });
  mudou=antes!==JSON.stringify([S.rv,S.top]);
  return mudou;
}
function marcarAula(v,on,d=hoje()){
  const a=AULA[v];if(!a)return;
  if(on)S.aulas[v]=d;else delete S.aulas[v];
  sincronizarRevisoes(UN[a.u]);
  if(on)ativ(d);
}
function rotuloRev(o){const ns=o.aulas.map(v=>AULA[v]&&AULA[v].n).filter(Boolean).sort((a,b)=>a-b);return ns.length===1?`Aula ${ns[0]}`:`Aulas ${ns[0]} a ${ns[ns.length-1]}`}
function revisoes(f){const out=[];for(const[id,o]of Object.entries(S.rv)){if(!UN[o.u])continue;o.r.forEach((r,k)=>{if(f(r))out.push({id,k,o,u:UN[o.u],...r})})}return out.sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:a.i-b.i)}
const revsAte=d=>revisoes(r=>!r.ok&&r.d<=d);
const revsNoDia=d=>revisoes(r=>!r.ok&&r.d===d);
const revsFeitas=d=>revisoes(r=>r.ok===d);
const minRevs=l=>l.reduce((s,r)=>s+(REV_MIN[r.i]||10),0);
function minDia(d){return Math.round((+S.horas[dow(d)]||0)*60)}
function encher(q,p,cap){const out=[];let used=0;while(p<q.length&&cap>0){const m=q[p].min;if(used===0||used+m<=cap+10){out.push(q[p]);used+=m;p++;if(used>=cap)break}else break}return{out,p,used}}
function projecao(ate){
  const out={};const h=hoje();if(ate<h)return out;
  const q=fila();let p=0;const previstos={};
  for(let d=h;d<=ate;d=addD(d,1)){
    let nRev,minR;
    if(d===h){const l=revsAte(h).concat(revsFeitas(h));nRev=l.length;minR=minRevs(l)}
    else{const l=revsNoDia(d);nRev=l.length;minR=minRevs(l);
      // revisões dos blocos que ainda serão estudados nos dias anteriores do plano
      INTERVALOS.forEach(i=>{const n=(previstos[addD(d,-i)]||0);nRev+=n;minR+=n*(REV_MIN[i]||10)})}
    const tot=minDia(d);const revMin=Math.min(minR,Math.floor(tot/2));
    let cap=tot-revMin;
    if(d===h)cap-=blocosFeitosEm(h).reduce((s,b)=>s+b.min,0);
    const r=cap>0?encher(q,p,cap):{out:[],p};p=r.p;
    previstos[d]=r.out.length;
    out[d]={nRev,revMin,novos:r.out};
  }
  return out;
}
function terminoEstimado(){
  const q=fila();if(!q.length)return'concluído';
  let p=0,d=hoje();
  for(let i=0;i<2500;i++){let cap=minDia(d);if(i===0)cap-=blocosFeitosEm(d).reduce((s,b)=>s+b.min,0);if(cap>0)p=encher(q,p,cap).p;if(p>=q.length)return d;d=addD(d,1)}
  return null;
}
function sequencia(){let d=hoje();if(!S.at[d])d=addD(d,-1);let n=0;while(S.at[d]){n++;d=addD(d,-1)}return n}
function statsQ(f=()=>true){let t=0,c=0;S.q.filter(f).forEach(x=>{t+=+x.t;c+=+x.c});return{t,c}}
function patente(c){let i=0;PATENTES.forEach((f,k)=>{if(c>=f[0])i=k});return{f:PATENTES[i],next:PATENTES[i+1]||null}}
function cardsPend(m){const h=hoje();return S.cards.filter(c=>c.due<=h&&(!m||c.m===m))}
function progUn(u){let f=0,t=0,fm=0,tm=0;u.a.forEach(a=>{const m=minAula(AULA[a[0]]);t++;tm+=m;if(S.aulas[a[0]]){f++;fm+=m}});return{f,t,fm,tm}}
function nomeCurto(u,n=90){const s=u.n.replace(/^\d+(\.\d+)*\.?\s*/,'');return s.length>n?s.slice(0,n-1)+'…':s}

/* ---------- UI helpers ---------- */
const IC={
 dash:'<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',
 sem:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 cont:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V21h16"/>',
 rev:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 3"/>',
 q:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
 des:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
 sim:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
 fc:'<rect x="2" y="6" width="16" height="14" rx="2"/><path d="M6 6V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2"/>',
 cfg:'<circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
 check:'<path d="M20 6L9 17l-5-5"/>',
 fire:'<path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 play:'<path d="M6 4l14 8-14 8z"/>',
 ext:'<path d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
 book:'<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>'
};
const svg=(k,extra='')=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${IC[k]}</svg>`;
const mdot=m=>`<span class="mdot" style="background:${MAT[m]?.cor||'#888'}"></span>`;
function optMaterias(sel){return DISC.map(m=>`<option value="${m.id}" ${m.id===sel?'selected':''}>${esc(m.nome)}</option>`).join('')}
function toast(msg,icone){const t=document.getElementById('toast');t.innerHTML=(icone?ART.granada:'')+'<span></span>';t.querySelector('span').textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2400)}
/* ---------- Efeitos ---------- */
let lastXY=[innerWidth/2,innerHeight/2];
const CORES_FX=['#d6a630','#f2b33d','#a3bf4f','#e8743b','#cfd6b8'];
function boom(x=lastXY[0],y=lastXY[1]){
  const p=document.createElement('div');p.className='puff';p.style.left=x+'px';p.style.top=y+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),500);
  for(let i=0;i<16;i++){const s=document.createElement('i');s.className='shard';const a=Math.random()*Math.PI*2,d=40+Math.random()*70;
    s.style.cssText=`left:${x}px;top:${y}px;background:${CORES_FX[i%5]};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--r:${Math.random()*540-270}deg`;
    document.body.appendChild(s);setTimeout(()=>s.remove(),750)}
}
function missaoCumprida(){
  const h=hoje(),bl=blocosFeitosEm(h),rvL=revsFeitas(h),rv=rvL.length,min=bl.reduce((s,b)=>s+b.min,0)+minRevs(rvL);
  const fx=document.createElement('div');fx.className='fx';fx.setAttribute('role','dialog');fx.setAttribute('aria-label','Missão do dia cumprida');
  let sh='';for(let i=0;i<26;i++){const a=Math.random()*Math.PI*2,d=140+Math.random()*220;sh+=`<i class="fx-sh" style="background:${CORES_FX[i%5]};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;--r:${Math.random()*720-360}deg"></i>`}
  fx.innerHTML=`<div class="fx-flash"></div><div class="fx-stage"><div class="fx-smoke"></div><div class="fx-fire"></div><div class="fx-ring"></div><div class="fx-ring r2"></div>${sh}<div class="fx-pin">${ART.pino}</div><div class="fx-gren">${ART.granada}</div>
   <div class="fx-card"><div class="fx-stamp">MISSÃO CUMPRIDA</div><div class="fx-sub">Objetivo do dia neutralizado</div>
   <div class="fx-stats"><span><b>${bl.length}</b> bloco${bl.length===1?'':'s'}</span><span><b>${minTxt(min)}</b> de estudo</span>${rv?`<span><b>${rv}</b> revis${rv===1?'ão':'ões'}</span>`:''}<span><b>${sequencia()}</b> dia${sequencia()===1?'':'s'} em operação</span></div>
   <button class="btn gold" data-fx="fechar">Continuar</button></div></div>`;
  document.body.appendChild(fx);
  const fechar=()=>{fx.style.transition='opacity .25s';fx.style.opacity='0';setTimeout(()=>fx.remove(),260)};
  fx.querySelector('[data-fx]').onclick=fechar;
  setTimeout(()=>{fx.addEventListener('click',ev=>{if(ev.target===fx||ev.target.classList.contains('fx-stage'))fechar()})},1600);
  document.addEventListener('keydown',function k(ev){if(ev.key==='Escape'){fechar();document.removeEventListener('keydown',k)}});
}
function checarMissao(){
  const h=hoje();S.missao=S.missao||{};if(S.missao[h])return;
  const pr=projecao(h)[h];const feitos=blocosFeitosEm(h).length+revsFeitas(h).length;
  if(feitos>0&&!revsAte(h).length&&!pr.novos.length){S.missao[h]=1;salvar();setTimeout(missaoCumprida,350)}
}
function pct(a,b){return b?Math.round(a/b*100):0}
function pbar(p,cor){return`<div class="pbar"><span style="width:${Math.min(100,p)}%;background:${cor||'var(--acc)'}"></span></div>`}
function minTxt(m){m=Math.round(m);return m>=60?(m%60?Math.floor(m/60)+'h'+pad(m%60):m/60+'h'):m+' min'}
const linkUn=(u,b)=>`#/assunto/${encodeURIComponent(u)}${b!==undefined?'/'+b:''}`;
function rvChipsEntrada(o){const h=hoje();return o.r.map(r=>`<span class="rv ${r.ok?'ok':r.d<=h?'due':''}" title="Revisão de ${r.i} dia(s): ${r.ok?'feita em '+brA(r.ok):'prevista para '+brA(r.d)}">${r.i}d</span>`).join('')}

/* ---------- Sidebar ---------- */
const NAV=[['','Dashboard','dash'],['semana','Metas da semana','sem'],['conteudos','Conteúdos e aulas','cont'],['revisoes','Revisões','rev'],['questoes','Questões','q'],['desempenho','Desempenho','des'],['simulados','Simulados','sim'],['flashcards','Flashcards','fc'],['config','Configurações','cfg']];
function renderSide(rota){
  const nome=S.nome||(USER?USER.email.split('@')[0]:'Futuro '+CURSO.cargo);
  const ini=nome.split(/[\s._-]+/).filter(Boolean).slice(0,2).map(p=>p[0].toUpperCase()).join('');
  const nRev=revsAte(hoje()).length,nFc=cardsPend().length;
  const falta=S.prova?diffD(hoje(),S.prova):null;
  document.getElementById('side').innerHTML=`
   <div class="brand brand-logo">${LOGO}<small>Missão: ${CURSO.cargo} ${CURSO.sigla}</small></div>
   <div class="user"><div class="avatar">${esc(ini)}</div><div style="min-width:0"><b>${esc(nome)}</b><small>${patente(statsQ().c).f[1]} · Pré-edital</small><small>${falta!==null?(falta>=0?`Prova em ${falta} dia${falta===1?'':'s'}`:'Prova realizada'):'Defina a data da prova'}</small></div></div>
   <div class="nav-t">Estudos</div>
   <nav class="nav">${NAV.map(([r,t,i])=>{let b='';if(r==='revisoes'&&nRev)b=`<span class="badge">${nRev}</span>`;if(r==='flashcards'&&nFc)b=`<span class="badge">${nFc}</span>`;return`<a href="#/${r}" class="${r===rota?'on':''}">${svg(i)}${t}${b}</a>`}).join('')}</nav>
   <div class="side-foot">${sb&&USER?`<div class="sync ${syncEstado}" id="sync"><i></i><span></span></div><a class="trocar" href="./">Trocar de curso</a><button data-a="sair">Sair da conta</button>`:'<a class="trocar" href="./">Trocar de curso</a><div>Modo demonstração: seus dados ficam salvos neste navegador.</div>'}</div>`;
  if(sb&&USER)setSync(syncEstado);
}

/* ---------- Páginas ---------- */
function itemBloco(b,feito){
  const u=UN[b.u],d=MAT[u.d],nb=blocosDe(u).length;
  return`<div class="item ${feito?'done':''}"><button class="check ${feito?'on':''}" data-a="bloco" data-u="${u.id}" data-b="${b.i}" title="${feito?'Desmarcar':'Marcar bloco como concluído'}">${feito?svg('check'):''}</button><a class="tx" href="${linkUn(u.id,b.i)}" style="color:inherit"><b>${mdot(d.id)} ${esc(d.nome)}</b><span>${esc(nomeCurto(u))}${nb>1?` · bloco ${b.i+1}/${nb}`:''} · ${b.aulas.length} aula${b.aulas.length>1?'s':''}</span></a><span class="chip">${minTxt(b.min)}</span></div>`;
}
function pgDash(){
  const h=hoje(),feitas=Object.keys(S.aulas).filter(v=>AULA[v]).length,p=pct(feitas,TOTAL_AULAS);
  const unFeitas=Object.keys(S.top).filter(id=>UN[id]).length,unTot=Object.keys(UN).length;
  const {t,c}=statsQ();const acc=t?(c/t*100).toFixed(1).replace('.',',')+'%':'—';
  const seq=sequencia(),fx=patente(c);
  const c7=statsQ(x=>x.d>addD(h,-7)).c;
  const proj=projecao(h)[h];const revs=revsAte(h),revsOk=revsFeitas(h),feitosHoje=blocosFeitosEm(h);
  const ter=terminoEstimado();
  const ini=addD(h,-dow(h));
  const dots=[0,1,2,3,4,5,6].map(i=>{const d=addD(ini,i);return`<span class="${S.at[d]?'on':''} ${d===h?'today':''}">${DIAS_C[i]}</span>`}).join('');
  const r=26,C=2*Math.PI*r;
  const msg=seq?`${seq} dia${seq>1?'s':''} em operação! Cumpra a missão de hoje para não quebrar a sequência.`:'Inicie hoje a sua operação de estudos.';
  const ammo=[...Array(revs.length+revsOk.length?1:0)].map(()=>`<i class="rv ${revs.length?'':'on'}" title="Revisões"></i>`).join('')+feitosHoje.map(()=>'<i class="on"></i>').join('')+proj.novos.map(()=>'<i></i>').join('');
  const minFeito=feitosHoje.reduce((s,b)=>s+b.min,0)+Math.min(proj.revMin,minRevs(revsOk));
  const minMeta=feitosHoje.reduce((s,b)=>s+b.min,0)+proj.novos.reduce((s,b)=>s+b.min,0)+proj.revMin;
  return`
  <div class="page-h"><div><h1>Bom serviço${S.nome?', '+esc(S.nome.split(' ')[0]):''}!</h1><p>${DIAS[dow(h)]}, ${brA(h)} · foco total na ${CURSO.sigla}.</p></div>
   ${S.prova?`<div class="chip" style="font-size:13px;padding:6px 12px">${svg('target','width="15" height="15"')} ${diffD(h,S.prova)>=0?diffD(h,S.prova)+' dias para a prova':'Prova em '+brA(S.prova)}</div>`:`<a class="btn sec" href="#/config">Definir data da prova</a>`}</div>
  <section class="hero">
    <div class="hero-art">${ART.fuzil}</div>
    <div class="hero-top"><span style="width:18px;display:inline-flex">${ART.mira}</span>${msg}</div>
    <div class="grid g3">
      <div class="panel"><div class="panel-t">Sua patente</div>
        <div class="rank">${insignia(fx.f[2])}<b>${fx.f[1]}</b></div>
        <div class="bar"><span style="width:${fx.next?pct(c-fx.f[0],fx.next[0]-fx.f[0]):100}%"></span></div>
        <small>${fx.next?`faltam <b>${(fx.next[0]-c).toLocaleString('pt-BR')}</b> questões certas para <b>${fx.next[1]}</b>`:'Patente máxima alcançada!'}</small></div>
      <div class="panel"><div class="panel-t">Seu plano</div>
        <div class="ring-wrap"><div class="ring"><svg width="66" height="66"><circle cx="33" cy="33" r="${r}" stroke="rgba(127,127,127,.25)" stroke-width="7" fill="none"/><circle cx="33" cy="33" r="${r}" stroke="var(--ok)" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p/100)}"/></svg><span>${p}%</span></div>
        <div><b>${feitas}</b> <small>de ${TOTAL_AULAS.toLocaleString('pt-BR')} aulas · ${unFeitas}/${unTot} assuntos</small><br><small>${ter==='concluído'?'Conteúdo todo estudado!':ter?`término previsto em <b>${brA(ter)}</b>`:'defina suas horas de estudo'}</small></div></div></div>
      <div class="panel"><div class="panel-t">Dias em operação</div>
        <div class="streak"><span style="color:var(--gold)">${svg('fire','width="22" height="22"')}</span>${seq} <small style="font-size:13px;font-weight:500;font-family:Inter">dias seguidos</small></div>
        <div class="dots">${dots}</div><small>estude, revise ou resolva questões para somar</small></div>
    </div>
  </section>
  <div class="grid g4 mt">
    <div class="card stat"><div class="ic" style="background:var(--acc-soft);color:var(--acc)">${svg('q','width="20" height="20"')}</div><div><b>${t.toLocaleString('pt-BR')}</b><small>${c.toLocaleString('pt-BR')} certas</small></div></div>
    <div class="card stat"><div class="ic" style="background:var(--ok-soft);color:var(--ok)">${svg('target','width="20" height="20"')}</div><div><b style="color:var(--ok)">${acc}</b><small>acertos</small></div></div>
    <div class="card stat"><div class="ic" style="background:var(--gold-soft);color:var(--gold)">${svg('rev','width="20" height="20"')}</div><div><b>${revs.length}</b><small>revisões pendentes</small></div></div>
    <div class="card stat"><div class="ic" style="background:var(--bad-soft);color:var(--bad)">${svg('fire','width="20" height="20"')}</div><div><b>${c7}</b><small>certas (7 dias)</small></div></div>
  </div>
  <div class="grid g2 mt">
    <div class="card"><h2><span style="width:20px;height:20px;display:inline-flex">${ART.granada}</span> Missão do dia <span class="sub">${minTxt(minFeito)} de ${minTxt(minMeta)}</span></h2>
      ${ammo?`<div class="ammo" title="Cada cartucho é um bloco da missão">${ammo}<small>${feitosHoje.length}/${feitosHoje.length+proj.novos.length} blocos</small></div>`:''}
      ${revs.length||revsOk.length?`<div class="item ${revs.length?'rev':'done'}"><div class="tx"><b>Revisões</b><span>${revs.length?`${revs.length} revis${revs.length>1?'ões':'ão'} para fazer`:'Revisões do dia concluídas'} · ~${minTxt(proj.revMin)}</span></div><a class="btn sm ${revs.length?'gold':'sec'}" href="#/revisoes">${revs.length?'Revisar':'Ver'}</a></div>`:''}
      ${feitosHoje.map(b=>itemBloco(b,true)).join('')}
      ${proj.novos.map(b=>itemBloco(b,false)).join('')}
      ${!revs.length&&!revsOk.length&&!feitosHoje.length&&!proj.novos.length?`<div class="empty">${minDia(h)?'Nada pendente para hoje. Aproveite para resolver questões!':'Hoje é dia de folga no seu plano. Ajuste em Configurações se quiser estudar.'}</div>`:''}
      <p class="muted" style="font-size:12.5px;margin:12px 0 0">Clique numa meta para abrir as aulas. Quando todas as aulas de um assunto forem concluídas, as revisões de 1, 7, 15 e 30 dias são agendadas automaticamente.</p>
    </div>
    <div class="card"><h2>Registrar questões</h2>
      ${formQuestoes()}
      <h2 style="margin-top:22px">Últimos registros</h2>
      ${listaQuestoes(4)}
    </div>
  </div>`;
}

function formQuestoes(m){return`<form class="form" data-f="questao">
  <div class="fld" style="flex:2 1 200px"><label>Matéria</label><select name="m">${optMaterias(m||pgQ.ultima)}</select></div>
  <div class="fld" style="flex:1 1 80px"><label>Feitas</label><input name="t" type="number" min="1" required inputmode="numeric"></div>
  <div class="fld" style="flex:1 1 80px"><label>Certas</label><input name="c" type="number" min="0" required inputmode="numeric"></div>
  <div class="fld" style="flex:1 1 130px"><label>Data</label><input name="d" type="date" value="${hoje()}" max="${hoje()}" required></div>
  <button class="btn">Salvar</button></form>`}
function listaQuestoes(n){
  const l=[...S.q].sort((a,b)=>a.d<b.d?1:a.d>b.d?-1:0).slice(0,n);
  if(!l.length)return'<div class="empty">Nenhuma questão registrada ainda.</div>';
  return`<div class="scroll-x"><table class="tbl"><thead><tr><th>Data</th><th>Matéria</th><th class="num">Feitas</th><th class="num">Certas</th><th class="num">%</th><th></th></tr></thead><tbody>${l.map(x=>`<tr><td>${br(x.d)}</td><td>${mdot(x.m)} ${esc(MAT[x.m]?.nome||x.m)}</td><td class="num">${x.t}</td><td class="num">${x.c}</td><td class="num" style="color:${pct(x.c,x.t)>=S.corte?'var(--ok)':'var(--bad)'}">${pct(x.c,x.t)}%</td><td class="num"><button class="btn sec icon sm" data-a="delQ" data-id="${x.id}" title="Excluir">✕</button></td></tr>`).join('')}</tbody></table></div>`;
}
const pgQ={ultima:'244'};

let semOff=0;
function cardSem(b,feito){const u=UN[b.u],d=MAT[u.d];return`<a href="${linkUn(u.id,b.i)}" class="blk ${feito?'done':''}"><b>${feito?'':mdot(d.id)+' '}${esc(d.nome)}</b><p>${esc(nomeCurto(u,70))}</p><span class="min">${minTxt(b.min)}</span></a>`}
function pgSemana(){
  const h=hoje(),ini=addD(segunda(h),semOff*7),fim=addD(ini,6);
  const proj=projecao(fim);
  let planejado=0,feito=0;
  const cols=[0,1,2,3,4,5,6].map(i=>{
    const d=addD(ini,i),past=d<h,isT=d===h;let blocks='';
    if(past){
      const rf=revsFeitas(d),bf=blocosFeitosEm(d);
      if(rf.length){blocks+=`<div class="blk done"><b>Revisão</b><p>${rf.length} revis${rf.length>1?'ões feitas':'ão feita'}</p><span class="min">${minRevs(rf)} min</span></div>`;feito+=minRevs(rf);planejado+=minRevs(rf)}
      bf.forEach(b=>{blocks+=cardSem(b,true);feito+=b.min;planejado+=b.min});
      if(!blocks)blocks=`<div class="empty" style="padding:14px 4px">—</div>`;
    }else{
      const pr=proj[d];
      if(pr.nRev){const pend=isT?revsAte(h).length:pr.nRev;const done=isT&&!pend;
        blocks+=`<a href="#/revisoes" class="blk ${done?'done':'rev'}"><b>Revisão</b><p>${isT?(done?'Revisões concluídas':pend+' pendente'+(pend>1?'s':'')):pr.nRev+' revis'+(pr.nRev>1?'ões previstas':'ão prevista')}</p><span class="min">${pr.revMin} min</span></a>`;
        planejado+=pr.revMin;if(done)feito+=pr.revMin}
      if(isT)blocosFeitosEm(h).forEach(b=>{blocks+=cardSem(b,true);feito+=b.min;planejado+=b.min});
      pr.novos.forEach(b=>{blocks+=cardSem(b,false);planejado+=b.min});
      if(!blocks)blocks=`<div class="empty" style="padding:14px 4px">${minDia(d)?'Sem pendências':'Folga'}</div>`;
    }
    return`<div class="day ${isT?'today':''} ${past?'past':''}"><div class="day-h"><b>${DIAS[dow(d)]}</b><small>${br(d)}</small></div><div class="day-b">${blocks}</div></div>`;
  }).join('');
  return`<div class="page-h"><div><h1>Metas da semana</h1><p>${brA(ini)} a ${brA(fim)} · ${minTxt(feito)} de ${minTxt(planejado)} (${pct(feito,planejado)}%)</p></div>
   <div class="row"><button class="btn sec" data-a="sem" data-v="-1">‹ Anterior</button><button class="btn sec" data-a="sem" data-v="0">Hoje</button><button class="btn sec" data-a="sem" data-v="1">Próxima ›</button></div></div>
   <div class="week">${cols}</div>
   <div class="note mt">As metas são montadas automaticamente com as aulas do Gran, em blocos de até ${S.bloco} min, alternando as matérias pelo peso. Se um bloco não for concluído, ele passa para o próximo dia. Clique num bloco para abrir as aulas.</div>`;
}

const abertas=new Set();
function pgConteudos(){
  const unTot=Object.keys(UN).length,unF=Object.keys(S.top).filter(id=>UN[id]).length;
  const feitas=Object.keys(S.aulas).filter(v=>AULA[v]).length;
  return`<div class="page-h"><div><h1>Conteúdos e aulas</h1><p>${CURSO.cargo} ${CURSO.sigla} · ${unF} de ${unTot} assuntos concluídos · ${feitas} de ${TOTAL_AULAS.toLocaleString('pt-BR')} aulas</p></div>
   <div class="row"><button class="btn sec" data-a="abrirTodas">Expandir tudo</button><button class="btn sec" data-a="fecharTodas">Recolher</button></div></div>
   ${DISC.map(d=>{let f=0,t=0;d.u.forEach(u=>{const p=progUn(u);f+=p.f;t+=p.t});
    return`<details class="mat" data-m="${d.id}" ${abertas.has(d.id)?'open':''}><summary>${mdot(d.id)}<span class="nm">${esc(d.nome)} <span class="chip" style="margin-left:6px">peso ${peso(d)}</span></span><span class="muted" style="font-size:12.5px">${f}/${t} aulas</span>${pbar(pct(f,t),d.cor)}</summary>
     ${d.u.map(u=>{const p=progUn(u);const ok=!!S.top[u.id];
       return`<a class="trow" href="${linkUn(u.id)}"><span class="check ${ok?'on':''}" style="pointer-events:none">${ok?svg('check'):''}</span><div class="tx">${esc(u.n)}<small>${p.t} aula${p.t>1?'s':''} · ${minTxt(p.tm)}${p.f&&!ok?` · ${p.f} assistida${p.f>1?'s':''}`:''}${S.top[u.id]?' · concluído em '+brA(S.top[u.id].e):''}</small></div><div class="meta">${`<div class="pbar mini">${`<span style="width:${pct(p.f,p.t)}%;background:${d.cor}"></span>`}</div>`}</div></a>`}).join('')}
    </details>`}).join('')}
   <p class="credit">Aulas: Gran Cursos Online, curso “PMDF – Soldado QPPMC”. Os links abrem no Gran e exigem assinatura própria. Lei seca: Portal da Legislação do Planalto.</p>`;
}

function pgAssunto(id,blk){
  const u=UN[id];if(!u)return`<div class="empty">Assunto não encontrado. <a href="#/conteudos">Voltar aos conteúdos</a></div>`;
  const d=MAT[u.d],p=progUn(u),bl=blocosDe(u),ok=S.top[u.id];
  const prox=bl.find(b=>!blocoFeito(b));
  const alvo=blk!==undefined&&bl[blk]?bl[blk]:prox;
  const qUrl=questoesUrl(u.q)||questoesUrl(d.q);
  const mats=S.mats[u.id]||[];
  const i=d.u.indexOf(u),ant=d.u[i-1],seg=d.u[i+1];
  return`<div class="crumb"><a href="#/conteudos">Conteúdos</a> › ${mdot(d.id)} ${esc(d.nome)}</div>
  <div class="page-h"><div style="max-width:900px"><h1 class="h-un">${esc(u.n)}</h1><p>${p.t} aula${p.t>1?'s':''} · ${minTxt(p.tm)} · ${bl.length} bloco${bl.length>1?'s':''} de estudo</p></div>
   ${ok?`<span class="chip" style="background:var(--ok-soft);color:var(--ok);border-color:transparent;font-size:13px;padding:6px 12px">${svg('check','width="14" height="14"')} Concluído em ${brA(ok.e)}</span>`:`<button class="btn ok" data-a="unidadeToda" data-u="${u.id}">Marcar assunto como concluído</button>`}</div>
  <div class="grid g21">
   <div>
    <div class="card"><h2><span class="step">1</span> Orientação</h2>
      <div class="row" style="gap:14px;align-items:center"><div style="flex:1;min-width:200px">${pbar(pct(p.fm,p.tm),'var(--ok)')}</div><b>${minTxt(p.fm)} de ${minTxt(p.tm)}</b></div>
      <ul style="margin:12px 0 0;padding-left:18px;color:var(--muted);font-size:13px">
        ${ok?`<li>Assunto concluído! Agora é revisar nas datas marcadas e resolver questões.</li>`:prox?`<li>Próximo passo: <b style="color:var(--ink)">bloco ${prox.i+1}</b> (${prox.aulas.length} aula${prox.aulas.length>1?'s':''}, ${minTxt(prox.min)}).</li>`:''}
        <li>Assista às aulas na ordem. Se preferir ler, abra a aula no Gran e use a aba <b>PDF</b>.</li>
        <li>Ao terminar todas as aulas, resolva questões do assunto. As revisões de 1, 7, 15 e 30 dias são agendadas sozinhas.</li>
      </ul>
      ${(()=>{const ls=Object.values(S.rv).filter(o=>o.u===u.id).sort((a,b)=>a.e<b.e?-1:1);return ls.length?`<div class="mt" style="display:grid;gap:6px"><span class="muted" style="font-size:12.5px;font-weight:600">Revisões deste assunto</span>${ls.map(o=>`<div class="row" style="gap:6px;font-size:12.5px"><span style="min-width:110px">${rotuloRev(o)}</span>${rvChipsEntrada(o)}</div>`).join('')}</div>`:''})()}
    </div>
    <div class="card mt"><h2><span class="step">2</span> Teoria · videoaulas do Gran <span class="sub">${p.f}/${p.t} concluídas</span></h2>
      ${bl.map(b=>{const f=blocoFeito(b);return`<div class="blk-t ${b===alvo&&!f?'cur':''}" id="b${b.i}">${f?`<span style="color:var(--ok)">${svg('check','width="14" height="14"')}</span>`:''}Bloco ${b.i+1} · ${minTxt(b.min)}${b===alvo&&!f?' · <span>meta atual</span>':''}<button class="btn sec sm right" data-a="bloco" data-u="${u.id}" data-b="${b.i}">${f?'Desmarcar bloco':'Concluir bloco'}</button></div>
        ${b.aulas.map(v=>{const a=AULA[v],on=!!S.aulas[v];return`<div class="aula ${on?'done':''}"><button class="check ${on?'on':''}" data-a="aula" data-v="${esc(v)}" title="${on?'Desmarcar':'Marcar como assistida'}">${on?svg('check'):''}</button><div class="tx"><b>Aula ${a.n} — ${esc(a.t)}</b><small>${minTxt(minAula(a))}${S.vel!=1?' (em '+S.vel+'x)':''} · ${esc(a.p||'')}${a.pdf?' · tem PDF':''}${on?' · assistida em '+br(S.aulas[v]):''}</small></div><div class="aula-bt">${pdfsDe(u,[v]).map(p=>`<a class="btn pdf sm" href="${esc(CURSO.base+p.f)}" target="_blank" rel="noopener" title="${esc(p.n)}">${svg('book','width="12" height="12"')} Abrir PDF</a>`).join('')}<a class="btn vid sm" href="${aulaUrl(v)}" target="_blank" rel="noopener">${svg('play','width="12" height="12"')} Abrir no Gran</a></div></div>`}).join('')}`}).join('')}
    </div>
    <div class="card mt"><h2><span class="step">3</span> Meu caderno <span class="sub">dúvidas, macetes, artigos que caem</span></h2>
      <textarea class="notes" data-nota="${u.id}" placeholder="Anote aqui o que você não quer esquecer deste assunto. Salva sozinho.">${esc(S.notas[u.id]||'')}</textarea>
    </div>
   </div>
   <div>
    <div class="card"><h2>${svg('q','width="18" height="18"')} Questões</h2>
      <p class="muted" style="margin:0 0 12px;font-size:13px">Resolva questões deste assunto para fixar o conteúdo e registre o resultado.</p>
      ${qUrl?`<a class="btn" style="width:100%" href="${esc(qUrl)}" target="_blank" rel="noopener">Resolver no Gran Questões ${svg('ext','width="13" height="13"')}</a>`:''}
      <div class="mt">${formQuestoes(d.id)}</div>
    </div>
    ${pdfsDe(u).length?`<div class="card mt"><h2>${svg('book','width="18" height="18"')} Material TAOS <span class="sub">PDF</span></h2>${pdfsDe(u).map(p=>`<a class="law pdf" href="${esc(CURSO.base+p.f)}" target="_blank" rel="noopener"><b>PDF</b>${esc(p.n)}<span>Abrir ${svg('ext','width="12" height="12"')}</span></a>`).join('')}</div>`:''}
    ${u.l.length?`<div class="card mt"><h2>${svg('book','width="18" height="18"')} Lei seca</h2>${u.l.map(([n,url])=>`<a class="law" href="${esc(url)}" target="_blank" rel="noopener">${esc(n)}<span>Planalto ${svg('ext','width="12" height="12"')}</span></a>`).join('')}</div>`:''}
    <div class="card mt"><h2>Meus materiais <span class="sub">${mats.filter(m=>m.ok).length}/${mats.length}</span></h2>
      ${mats.map(m=>`<div class="aula ${m.ok?'done':''}"><button class="check ${m.ok?'on':''}" data-a="matOk" data-u="${u.id}" data-id="${m.id}">${m.ok?svg('check'):''}</button><div class="tx"><b>${esc(m.n)}</b>${m.url?`<small><a href="${esc(m.url)}" target="_blank" rel="noopener">abrir link</a></small>`:''}</div><button class="btn sec icon sm" data-a="matDel" data-u="${u.id}" data-id="${m.id}" title="Remover">✕</button></div>`).join('')}
      <form class="form ${mats.length?'mt':''}" data-f="mat"><input type="hidden" name="u" value="${u.id}"><input name="n" placeholder="Nome (ex.: Resumo, PDF, mapa mental)" required style="flex:1 1 160px"><input name="url" type="text" inputmode="url" placeholder="Link (opcional)" style="flex:1 1 160px"><button class="btn sec">Adicionar</button></form>
    </div>
   </div>
  </div>
  <div class="row mt">${ant?`<a class="btn sec" href="${linkUn(ant.id)}">‹ Assunto anterior</a>`:''}${seg?`<a class="btn sec right" href="${linkUn(seg.id)}">Próximo assunto ›</a>`:''}</div>
  <p class="credit">Videoaulas e PDFs: Gran Cursos Online (é preciso ter assinatura própria e estar logado no Gran). Lei seca: Planalto.</p>`;
}

function pgRevisoes(){
  const h=hoje(),pend=revsAte(h),prox=revisoes(r=>!r.ok&&r.d>h&&r.d<=addD(h,14)),feitasH=revsFeitas(h);
  const item=(r,btn)=>`<div class="item ${btn?'rev':''}"><a class="tx" href="${linkUn(r.u.id)}" style="color:inherit"><b>${mdot(r.u.d)} ${esc(MAT[r.u.d].nome)} <span class="chip">${r.i===1?'dia anterior':r.i+' dias'}</span>${btn&&r.d<h?` <span class="chip" style="color:var(--bad)">atrasada ${diffD(r.d,h)}d</span>`:''}</b><span>${rotuloRev(r.o)} · ${esc(nomeCurto(r.u,110))}</span></a>${btn?`<a class="btn vid sm" href="${aulaUrl(r.o.aulas[0])}" target="_blank" rel="noopener" title="Abrir a primeira aula no Gran">Gran</a><button class="btn ok sm" data-a="revisar" data-id="${r.id}" data-k="${r.k}">Revisado</button>`:`<span class="chip">${br(r.d)}</span>`}</div>`;
  const grupos={};prox.forEach(r=>{(grupos[r.d]=grupos[r.d]||[]).push(r)});
  return`<div class="page-h"><div><h1>Revisões</h1><p>Sistema 1-7-15-30: cada bloco que você estuda volta para revisão no dia seguinte e depois de 7, 15 e 30 dias.</p></div></div>
  <div class="grid g2">
   <div class="card"><h2>Para hoje <span class="sub">${feitasH.length} feita${feitasH.length===1?'':'s'} hoje</span></h2>
    ${pend.length?pend.map(r=>item(r,true)).join(''):'<div class="empty">Nenhuma revisão pendente. Ótimo trabalho!</div>'}
    ${pend.length>1?`<button class="btn sec mt" data-a="revisarTodas">Marcar todas como revisadas</button>`:''}
    <div class="note mt"><b>Como revisar bem:</b> releia seu caderno do assunto (5 min) e resolva de 5 a 10 questões no Gran Questões. Registre o resultado para acompanhar o desempenho.</div>
   </div>
   <div class="card"><h2>Próximos 14 dias <span class="sub">${prox.length} agendada${prox.length===1?'':'s'}</span></h2>
    ${Object.keys(grupos).length?Object.entries(grupos).map(([d,l])=>`<div class="muted" style="font-weight:700;font-size:12px;text-transform:uppercase;margin:12px 0 6px">${DIAS[dow(d)]} · ${br(d)}</div>${l.map(r=>item(r,false)).join('')}`).join(''):'<div class="empty">Nada agendado. Conclua assuntos para gerar revisões.</div>'}
   </div>
  </div>`;
}

function pgQuestoes(){
  return`<div class="page-h"><div><h1>Questões</h1><p>Registre as baterias de questões que você resolve (Gran Questões, QConcursos, TEC etc.).</p></div></div>
  <div class="card">${formQuestoes()}</div>
  <div class="card mt"><h2>Cadernos do Gran Questões por matéria</h2><div class="row">${DISC.map(d=>{const u=questoesUrl(d.q);return u?`<a class="btn sec sm" href="${esc(u)}" target="_blank" rel="noopener">${mdot(d.id)} ${esc(d.nome)}</a>`:''}).join('')}</div></div>
  <div class="card mt"><h2>Histórico <span class="sub">${S.q.length} registro${S.q.length===1?'':'s'}</span></h2>${listaQuestoes(200)}</div>`;
}

function barras(dados,cor){
  const W=720,H=170,pl=30,pb=22,max=Math.max(5,...dados.map(d=>d.v));const bw=(W-pl)/dados.length;
  const ticks=[0,.5,1].map(f=>Math.round(max*f));
  return`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" style="display:block">
   ${ticks.map(tk=>{const y=H-pb-(tk/max)*(H-pb-10);return`<line x1="${pl}" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${pl-6}" y="${y+4}" font-size="10" text-anchor="end" fill="var(--muted)">${tk}</text>`}).join('')}
   ${dados.map((d,i)=>{const hh=(d.v/max)*(H-pb-10);const x=pl+i*bw+bw*.18;return`<rect x="${x}" y="${H-pb-hh}" width="${bw*.64}" height="${hh}" rx="3" fill="${cor}"><title>${d.l}: ${d.v}</title></rect>${i%5===0||i===dados.length-1?`<text x="${x+bw*.32}" y="${H-6}" font-size="10" text-anchor="middle" fill="var(--muted)">${d.l}</text>`:''}`}).join('')}
  </svg>`;
}
function pgDesempenho(){
  const h=hoje();
  const dias=[];for(let i=29;i>=0;i--){const d=addD(h,-i);dias.push({l:br(d),v:statsQ(x=>x.d===d).t})}
  const linhas=DISC.map(m=>{const s=statsQ(x=>x.m===m.id);let f=0,n=0;m.u.forEach(u=>{const p=progUn(u);f+=p.f;n+=p.t});return{m,...s,p:pct(s.c,s.t),f,n}});
  const {t,c}=statsQ();
  return`<div class="page-h"><div><h1>Desempenho</h1><p>${t.toLocaleString('pt-BR')} questões · ${pct(c,t)}% de acerto geral · meta de referência: ${S.corte}%</p></div></div>
  <div class="card"><h2>Questões por dia <span class="sub">últimos 30 dias</span></h2>${barras(dias,'var(--acc)')}</div>
  <div class="card mt"><h2>Por matéria</h2><div class="scroll-x"><table class="tbl"><thead><tr><th>Matéria</th><th class="num">Questões</th><th class="num">Certas</th><th style="width:20%">Acerto</th><th class="num">%</th><th style="width:20%">Aulas</th></tr></thead><tbody>
   ${linhas.map(l=>`<tr><td>${mdot(l.m.id)} ${esc(l.m.nome)}</td><td class="num">${l.t}</td><td class="num">${l.c}</td><td>${pbar(l.p,l.t?(l.p>=S.corte?'var(--ok)':'var(--bad)'):'var(--line)')}</td><td class="num" style="font-weight:700;color:${!l.t?'var(--muted)':l.p>=S.corte?'var(--ok)':'var(--bad)'}">${l.t?l.p+'%':'—'}</td><td><div class="row" style="flex-wrap:nowrap">${pbar(pct(l.f,l.n),l.m.cor)}<small class="muted">${l.f}/${l.n}</small></div></td></tr>`).join('')}
  </tbody></table></div>
  <p class="muted" style="font-size:12.5px;margin-bottom:0">Em vermelho: matérias abaixo de ${S.corte}% de acerto. Dê prioridade a elas aumentando o peso em Configurações.</p></div>`;
}

function pgSimulados(){
  const l=[...S.sim].sort((a,b)=>a.d<b.d?-1:1);
  let chart='<div class="empty">Registre pelo menos um simulado para ver a evolução.</div>';
  if(l.length){
    const W=720,H=200,pl=34,pr=14,pt=14,pb=26;const X=i=>l.length===1?(W+pl-pr)/2:pl+i*(W-pl-pr)/(l.length-1);const Y=v=>pt+(1-v/100)*(H-pt-pb);
    const pts=l.map((s,i)=>[X(i),Y(pct(s.nota,s.max))]);
    chart=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block">${[0,25,50,75,100].map(v=>`<line x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="${pl-6}" y="${Y(v)+4}" font-size="10" text-anchor="end" fill="var(--muted)">${v}%</text>`).join('')}
     <line x1="${pl}" x2="${W-pr}" y1="${Y(S.corte)}" y2="${Y(S.corte)}" stroke="var(--bad)" stroke-dasharray="5 4"/><text x="${W-pr}" y="${Y(S.corte)-5}" font-size="10" text-anchor="end" fill="var(--bad)">meta ${S.corte}%</text>
     <polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="var(--acc)" stroke-width="2.5"/>
     ${pts.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="var(--acc)"><title>${esc(l[i].nome)}: ${pct(l[i].nota,l[i].max)}%</title></circle><text x="${p[0]}" y="${H-8}" font-size="10" text-anchor="middle" fill="var(--muted)">${br(l[i].d)}</text>`).join('')}</svg>`;
  }
  return`<div class="page-h"><div><h1>Simulados</h1><p>Acompanhe sua evolução e compare com a sua meta de acerto.</p></div></div>
  <div class="card"><form class="form" data-f="sim">
   <div class="fld" style="flex:2 1 200px"><label>Nome do simulado</label><input name="nome" placeholder="Ex.: Simulado ${CURSO.sigla} #1" required></div>
   <div class="fld" style="flex:1 1 90px"><label>Acertos / pontos</label><input name="nota" type="number" step="0.01" min="0" required></div>
   <div class="fld" style="flex:1 1 90px"><label>Total</label><input name="max" type="number" step="0.01" min="1" required></div>
   <div class="fld" style="flex:1 1 130px"><label>Data</label><input name="d" type="date" value="${hoje()}" required></div>
   <button class="btn">Salvar</button></form></div>
  <div class="card mt"><h2>Evolução</h2>${chart}</div>
  ${l.length?`<div class="card mt"><h2>Histórico</h2><div class="scroll-x"><table class="tbl"><thead><tr><th>Data</th><th>Simulado</th><th class="num">Nota</th><th class="num">%</th><th></th></tr></thead><tbody>${[...l].reverse().map(s=>`<tr><td>${brA(s.d)}</td><td>${esc(s.nome)}</td><td class="num">${s.nota} / ${s.max}</td><td class="num" style="font-weight:700;color:${pct(s.nota,s.max)>=S.corte?'var(--ok)':'var(--bad)'}">${pct(s.nota,s.max)}%</td><td class="num"><button class="btn sec icon sm" data-a="delSim" data-id="${s.id}">✕</button></td></tr>`).join('')}</tbody></table></div></div>`:''}`;
}

let fcSessao=null;
function pgFlashcards(){
  if(fcSessao){
    const c=S.cards.find(x=>x.id===fcSessao.fila[0]);
    if(!c){fcSessao=null;return pgFlashcards()}
    return`<div class="page-h"><div><h1>Flashcards</h1><p>${fcSessao.fila.length} restante${fcSessao.fila.length>1?'s':''} nesta sessão</p></div><button class="btn sec" data-a="fcSair">Encerrar sessão</button></div>
    <div class="fc"><div class="fc-card"><div class="chip" style="align-self:center">${mdot(c.m)} ${esc(MAT[c.m]?.nome||'')}</div><div style="font-weight:600">${esc(c.f)}</div>${fcSessao.virado?`<hr><div>${esc(c.b)}</div>`:''}</div>
    <div class="fc-btns">${fcSessao.virado?`<button class="btn danger" data-a="fcResp" data-v="0">Errei</button><button class="btn sec" data-a="fcResp" data-v="1">Difícil</button><button class="btn ok" data-a="fcResp" data-v="2">Bom</button><button class="btn" data-a="fcResp" data-v="3">Fácil</button>`:`<button class="btn gold" data-a="fcVirar">Mostrar resposta</button>`}</div></div>`;
  }
  const pend=cardsPend();
  const porM=DISC.map(m=>({m,n:S.cards.filter(c=>c.m===m.id).length,p:pend.filter(c=>c.m===m.id).length})).filter(x=>x.n);
  return`<div class="page-h"><div><h1>Flashcards</h1><p>${S.cards.length} cartões · ${pend.length} para revisar hoje · repetição espaçada automática</p></div>${pend.length?`<button class="btn gold" data-a="fcIniciar">Revisar ${pend.length} cartão${pend.length>1?'ões':''}</button>`:''}</div>
  <div class="grid g2">
   <div class="card"><h2>Novo cartão</h2><form data-f="card" class="grid" style="gap:10px">
    <div class="fld"><label>Matéria</label><select name="m">${optMaterias(pgFc.ultima)}</select></div>
    <div class="fld"><label>Frente (pergunta)</label><textarea name="f" required placeholder="Ex.: Qual o prazo do IPM com indiciado preso?"></textarea></div>
    <div class="fld"><label>Verso (resposta)</label><textarea name="b" required placeholder="Ex.: 20 dias (art. 20 do CPPM)."></textarea></div>
    <div><button class="btn">Adicionar cartão</button></div></form></div>
   <div class="card"><h2>Seus baralhos</h2>${porM.length?porM.map(x=>`<div class="item"><div class="tx"><b>${mdot(x.m.id)} ${esc(x.m.nome)}</b><span>${x.n} cartão${x.n>1?'ões':''} · ${x.p} para hoje</span></div>${x.p?`<button class="btn sm gold" data-a="fcIniciar" data-m="${x.m.id}">Revisar</button>`:''}<button class="btn sm sec" data-a="fcVer" data-m="${x.m.id}">Ver</button></div>`).join(''):'<div class="empty">Crie seu primeiro cartão ao lado. Ótimo para prazos, números de leis e "decoreba".</div>'}</div>
  </div>
  ${pgFc.ver&&MAT[pgFc.ver]?`<div class="card mt"><h2>${mdot(pgFc.ver)} ${esc(MAT[pgFc.ver].nome)} <button class="btn sec sm right" data-a="fcVer" data-m="">Fechar</button></h2><div class="scroll-x"><table class="tbl"><thead><tr><th>Frente</th><th>Verso</th><th>Próxima</th><th></th></tr></thead><tbody>${S.cards.filter(c=>c.m===pgFc.ver).map(c=>`<tr><td>${esc(c.f)}</td><td class="muted">${esc(c.b)}</td><td>${br(c.due)}</td><td class="num"><button class="btn sec icon sm" data-a="delCard" data-id="${c.id}">✕</button></td></tr>`).join('')}</tbody></table></div></div>`:''}`;
}
const pgFc={ultima:'1908',ver:''};

function pgConfig(){
  return`<div class="page-h"><div><h1>Configurações</h1><p>Ajuste o plano ao seu tempo. As metas se recalculam sozinhas.</p></div></div>
  <form data-f="config">
  <div class="grid g2">
   <div class="card"><h2>Você e a prova</h2><div class="grid" style="gap:12px">
    <div class="fld"><label>Seu nome</label><input name="nome" value="${esc(S.nome)}" placeholder="Como quer ser chamado"></div>
    <div class="fld"><label>Data prevista da prova</label><input name="prova" type="date" value="${esc(S.prova)}"></div>
    <div class="fld"><label>Meta de acerto (%)</label><input name="corte" type="number" min="1" max="100" value="${S.corte}"></div>
    <div class="fld"><label>Tamanho máximo de cada bloco de estudo</label><select name="bloco">${[45,60,90,120,150].map(v=>`<option value="${v}" ${+S.bloco===v?'selected':''}>${v} minutos</option>`).join('')}</select></div>
    <div class="fld"><label>Velocidade em que você assiste às aulas</label><select name="vel">${[1,1.25,1.5,1.75,2].map(v=>`<option value="${v}" ${+S.vel===v?'selected':''}>${String(v).replace('.',',')}x</option>`).join('')}</select></div>
   </div></div>
   <div class="card"><h2>Horas de estudo por dia</h2><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px">
    ${[1,2,3,4,5,6,0].map(i=>`<div class="fld"><label>${DIAS[i]}</label><input name="h${i}" type="number" step="0.5" min="0" max="16" value="${S.horas[i]}"></div>`).join('')}
   </div><p class="muted" style="font-size:12.5px;margin-bottom:0">Use 0 para dias de folga. As revisões ocupam ~15 min (dia anterior) ou ~10 min (7, 15 e 30 dias) cada, até metade do seu tempo; o restante vira blocos de aulas.</p></div>
  </div>
  <div class="card mt"><h2>Peso das matérias <span class="sub">peso maior = aparece mais vezes no plano · 0 = fora do plano</span></h2>
   <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px">${DISC.map(m=>`<div class="item" style="margin:0"><div class="tx"><b>${mdot(m.id)} ${esc(m.nome)}</b></div><input name="p_${m.id}" type="number" min="0" max="5" step="1" value="${peso(m)}" style="width:64px"></div>`).join('')}</div>
  </div>
  <div class="row mt"><button class="btn">Salvar configurações</button></div>
  </form>
  ${sb&&USER?`<div class="card mt"><h2>Trocar senha</h2>
   <form class="form" data-f="senha"><div class="fld" style="flex:1 1 200px"><label>Nova senha (mín. 8 caracteres)</label><input name="s1" type="password" minlength="8" autocomplete="new-password" required></div><div class="fld" style="flex:1 1 200px"><label>Repita a nova senha</label><input name="s2" type="password" minlength="8" autocomplete="new-password" required></div><button class="btn">Salvar nova senha</button></form>
   <p class="muted" style="font-size:12.5px;margin-bottom:0">Recebeu uma senha provisória? Troque por uma só sua aqui.</p></div>`:''}
  <div class="card mt"><h2>Backup dos seus dados</h2>
   <p class="muted" style="margin-top:0">${sb&&USER?`Seu progresso fica salvo na sua conta (${esc(USER.email)}) e aparece em qualquer aparelho em que você entrar. Se quiser, baixe uma cópia.`:'Tudo fica salvo neste navegador. Exporte um backup de vez em quando.'}</p>
   <div class="row"><button class="btn sec" data-a="exportar">Baixar backup (.json)</button><label class="btn sec" style="cursor:pointer">Restaurar backup<input type="file" accept=".json,application/json" data-a="importar" style="display:none"></label><button class="btn danger right" data-a="resetar">Apagar meu progresso</button></div>
  </div>`;
}

/* ---------- Router ---------- */
const ROTAS={'':pgDash,semana:pgSemana,conteudos:pgConteudos,assunto:pgAssunto,revisoes:pgRevisoes,questoes:pgQuestoes,desempenho:pgDesempenho,simulados:pgSimulados,flashcards:pgFlashcards,config:pgConfig};
function rota(){const h=location.hash;if(/access_token|error_description|type=/.test(h))return[''];return h.replace(/^#\/?/,'').split('/').map(decodeURIComponent)}
function render(){
  const [r0,...args]=rota();const r=ROTAS[r0]?r0:'';
  document.getElementById('main').innerHTML=r==='assunto'?pgAssunto(args[0],args[1]!==undefined?+args[1]:undefined):ROTAS[r]();
  renderSide(r==='assunto'?'conteudos':r);
  document.title=(r==='assunto'&&UN[args[0]]?nomeCurto(UN[args[0]],40):(NAV.find(n=>n[0]===r)||NAV[0])[1])+' · TAOS '+CURSO.sigla;
}
window.addEventListener('hashchange',()=>{if(!USER&&sb)return;fecharMenu();render();const [r0,,b]=rota();const el=r0==='assunto'&&b!==undefined&&document.getElementById('b'+b);if(el)el.scrollIntoView({block:'center'});else window.scrollTo(0,0)});

/* ---------- Ações ---------- */
const ACOES={
  aula(el){const v=el.dataset.v;const on=!S.aulas[v];const antes=!!S.top[AULA[v].u];marcarAula(v,on);salvar();if(on&&!antes&&S.top[AULA[v].u])toast('Assunto concluído! Revisões agendadas',1);render();if(on){boom();checarMissao()}},
  bloco(el){const u=UN[el.dataset.u],b=blocosDe(u)[+el.dataset.b];const on=!blocoFeito(b);const antes=!!S.top[u.id];const d=hoje();b.aulas.forEach(v=>{if(on){if(!S.aulas[v])S.aulas[v]=d}else delete S.aulas[v]});marcarAula(b.aulas[0],!!S.aulas[b.aulas[0]],S.aulas[b.aulas[0]]||d);salvar();toast(on?(!antes&&S.top[u.id]?'Assunto concluído! Revisões agendadas':'Bloco concluído! Alvo abatido'):'Bloco desmarcado',on);render();if(on){boom();checarMissao()}},
  unidadeToda(el){const u=UN[el.dataset.u];const d=hoje();u.a.forEach(a=>{if(!S.aulas[a[0]])S.aulas[a[0]]=d});marcarAula(u.a[0][0],true,d);salvar();toast('Assunto concluído! Revisões agendadas',1);render();boom();checarMissao()},
  matOk(el){const l=S.mats[el.dataset.u]||[];const m=l.find(x=>x.id===el.dataset.id);if(m){m.ok=!m.ok;if(m.ok)ativ();salvar();render()}},
  matDel(el){S.mats[el.dataset.u]=(S.mats[el.dataset.u]||[]).filter(x=>x.id!==el.dataset.id);salvar();render()},
  abrirTodas(){DISC.forEach(m=>abertas.add(m.id));render()},
  fecharTodas(){abertas.clear();render()},
  revisar(el){const o=S.rv[el.dataset.id];if(o){o.r[+el.dataset.k].ok=hoje();ativ();salvar()}toast('Revisão concluída!',1);render();boom();checarMissao()},
  revisarTodas(){revsAte(hoje()).forEach(r=>{S.rv[r.id].r[r.k].ok=hoje()});ativ();salvar();toast('Todas as revisões concluídas!',1);render();boom();checarMissao()},
  sem(el){const v=+el.dataset.v;semOff=v===0?0:semOff+v;render()},
  delQ(el){if(!confirm('Excluir este registro?'))return;S.q=S.q.filter(x=>x.id!==el.dataset.id);salvar();render()},
  delSim(el){if(!confirm('Excluir este simulado?'))return;S.sim=S.sim.filter(x=>x.id!==el.dataset.id);salvar();render()},
  delCard(el){S.cards=S.cards.filter(x=>x.id!==el.dataset.id);salvar();render()},
  fcIniciar(el){const l=cardsPend(el.dataset.m).map(c=>c.id);if(!l.length)return;fcSessao={fila:l,virado:false};render()},
  fcVirar(){fcSessao.virado=true;render()},
  fcSair(){fcSessao=null;render()},
  fcVer(el){pgFc.ver=el.dataset.m;render()},
  fcResp(el){
    const q=+el.dataset.v,c=S.cards.find(x=>x.id===fcSessao.fila[0]);
    if(c){
      c.ef=c.ef||2.5;c.iv=c.iv||0;c.reps=c.reps||0;
      if(q===0){c.reps=0;c.iv=0;c.ef=Math.max(1.3,c.ef-.2)}
      else if(q===1){c.iv=Math.max(1,Math.round((c.iv||1)*1.2));c.ef=Math.max(1.3,c.ef-.15);c.reps++}
      else{c.iv=c.reps===0?(q===3?3:1):c.reps===1?(q===3?7:4):Math.round(c.iv*c.ef*(q===3?1.3:1));if(q===3)c.ef+=.15;c.reps++}
      c.due=addD(hoje(),c.iv);ativ();salvar();
    }
    fcSessao.fila.shift();
    if(q===0&&c)fcSessao.fila.push(c.id);
    fcSessao.virado=false;
    if(!fcSessao.fila.length){fcSessao=null;toast('Sessão concluída!')}
    render();
  },
  exportar(){const b=new Blob([JSON.stringify(S,null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='qg-pmdf-backup-'+hoje()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)},
  resetar(){if(!confirm('Apagar TODO o seu progresso? Isso não pode ser desfeito. Baixe um backup antes.'))return;S=padrao();salvar();render();toast('Progresso apagado')},
  async sair(){if(pendente){clearTimeout(syncT);await enviar()}await sb.auth.signOut();location.href='./'}
};
document.addEventListener('click',e=>{lastXY=[e.clientX,e.clientY];const el=e.target.closest('[data-a]');if(!el||el.tagName==='INPUT')return;const f=ACOES[el.dataset.a];if(f){e.preventDefault();f(el,e)}});
document.addEventListener('change',e=>{
  if(e.target.dataset.a==='importar'){const file=e.target.files[0];if(!file)return;const rd=new FileReader();rd.onload=()=>{try{const d=JSON.parse(rd.result);if(!d||typeof d!=='object'||d.v!==2)throw 0;if(!confirm('Substituir seus dados atuais por este backup?'))return;S=Object.assign(padrao(),d);salvar();render();toast('Backup restaurado!')}catch(err){toast('Arquivo de backup inválido')}};rd.readAsText(file)}
});
let notaT=null;
document.addEventListener('input',e=>{const id=e.target.dataset&&e.target.dataset.nota;if(!id)return;clearTimeout(notaT);const v=e.target.value;notaT=setTimeout(()=>{if(v.trim())S.notas[id]=v;else delete S.notas[id];salvar()},600)});
document.addEventListener('toggle',e=>{const m=e.target.dataset&&e.target.dataset.m;if(m&&e.target.tagName==='DETAILS'){e.target.open?abertas.add(m):abertas.delete(m)}},true);
const FORMS={
  questao(fd){const t=+fd.get('t'),c=+fd.get('c');if(c>t){toast('Certas não pode ser maior que feitas');return false}pgQ.ultima=fd.get('m');S.q.push({id:uid(),d:fd.get('d'),m:fd.get('m'),t,c});ativ(fd.get('d'));salvar();toast('Questões registradas!')},
  sim(fd){const nota=+fd.get('nota'),max=+fd.get('max');if(nota>max){toast('A nota não pode ser maior que o total');return false}S.sim.push({id:uid(),d:fd.get('d'),nome:fd.get('nome').trim(),nota,max});salvar();toast('Simulado salvo!')},
  card(fd){pgFc.ultima=fd.get('m');S.cards.push({id:uid(),m:fd.get('m'),f:fd.get('f').trim(),b:fd.get('b').trim(),due:hoje(),iv:0,ef:2.5,reps:0});salvar();toast('Cartão criado!')},
  mat(fd){const u=fd.get('u');let url=(fd.get('url')||'').trim();if(url&&!/^https?:\/\//i.test(url))url='https://'+url;(S.mats[u]=S.mats[u]||[]).push({id:uid(),n:fd.get('n').trim(),url,ok:false});salvar()},
  config(fd){S.nome=fd.get('nome').trim();S.prova=fd.get('prova');S.corte=Math.min(100,Math.max(1,+fd.get('corte')||70));S.bloco=+fd.get('bloco')||90;S.vel=+fd.get('vel')||1;
    for(let i=0;i<7;i++)S.horas[i]=Math.max(0,+fd.get('h'+i)||0);
    DISC.forEach(m=>{const v=fd.get('p_'+m.id);if(v!==null&&v!=='')S.pesos[m.id]=Math.max(0,Math.min(5,+v))});
    salvar();toast('Configurações salvas!')}
};
document.addEventListener('submit',async e=>{if(e.target.dataset.f!=='senha')return;e.preventDefault();const fd=new FormData(e.target);if(fd.get('s1')!==fd.get('s2'))return toast('As senhas não conferem');const {error}=await sb.auth.updateUser({password:fd.get('s1')});if(error)return toast('Erro: '+error.message);e.target.reset();toast('Senha alterada!')});
document.addEventListener('submit',e=>{const f=e.target.dataset.f;if(!f||!FORMS[f])return;e.preventDefault();if(FORMS[f](new FormData(e.target))!==false)render()});

/* ---------- Menu mobile ---------- */
function fecharMenu(){document.getElementById('side').classList.remove('open');document.getElementById('scrim').classList.remove('open')}
document.getElementById('menuBtn').onclick=()=>{document.getElementById('side').classList.add('open');document.getElementById('scrim').classList.add('open')};
document.getElementById('scrim').onclick=fecharMenu;

/* ---------- Login ---------- */
const AUTH_BRAND=`<div class="auth-logo"><img src="logo.svg" alt="${MARCA}"><small>Estude · Prepare-se · Conquiste</small></div>`;
function mostrar(qual){['loading','auth','app'].forEach(id=>document.getElementById(id).classList.toggle('hidden',id!==qual))}
function telaLogin(msg,ok){
  mostrar('auth');
  document.getElementById('auth').className='auth';
  document.getElementById('auth').innerHTML=`<div class="auth-card">${AUTH_BRAND}<h1>Identifique-se</h1><p>Acesso restrito à tropa convidada.</p>
   ${msg?`<div class="auth-msg ${ok?'ok':''}">${esc(msg)}</div>`:''}
   <form id="fLogin"><div class="fld"><label>E-mail</label><input name="email" type="email" autocomplete="email" required></div>
   <div class="fld"><label>Senha</label><input name="senha" type="password" autocomplete="current-password" required></div>
   <button class="btn">Entrar no QG</button></form>
   <div style="text-align:center;margin-top:12px"><button class="linkbtn" id="esqueci">Esqueci minha senha</button></div></div>`;
  document.getElementById('fLogin').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);const b=e.target.querySelector('button');b.disabled=true;b.textContent='Entrando…';
    const {error}=await sb.auth.signInWithPassword({email:fd.get('email').trim(),password:fd.get('senha')});
    if(error){telaLogin(/invalid/i.test(error.message)?'E-mail ou senha incorretos.':error.message)}};
  document.getElementById('esqueci').onclick=()=>telaEsqueci();
}
function telaEsqueci(msg,ok){
  document.getElementById('auth').innerHTML=`<div class="auth-card">${AUTH_BRAND}<h1>Recuperar senha</h1><p>Enviaremos um link para você criar uma nova senha.</p>
   ${msg?`<div class="auth-msg ${ok?'ok':''}">${esc(msg)}</div>`:''}
   <form id="fEsq"><div class="fld"><label>E-mail</label><input name="email" type="email" required></div><button class="btn">Enviar link</button></form>
   <div style="text-align:center;margin-top:12px"><button class="linkbtn" id="voltar">Voltar para o login</button></div></div>`;
  document.getElementById('fEsq').onsubmit=async e=>{e.preventDefault();const em=new FormData(e.target).get('email').trim();
    const {error}=await sb.auth.resetPasswordForEmail(em,{redirectTo:location.origin+location.pathname});
    telaEsqueci(error?error.message:'Se esse e-mail tiver acesso, o link chega em alguns minutos. Confira também o spam.',!error)};
  document.getElementById('voltar').onclick=()=>telaLogin();
}
function telaSenha(msg){
  mostrar('auth');
  document.getElementById('auth').className='auth';
  document.getElementById('auth').innerHTML=`<div class="auth-card">${AUTH_BRAND}<h1>Crie sua senha</h1><p>Você vai usar esta senha para entrar no TAOS Militar.</p>
   ${msg?`<div class="auth-msg">${esc(msg)}</div>`:''}
   <form id="fSenha"><div class="fld"><label>Nova senha (mín. 8 caracteres)</label><input name="s1" type="password" minlength="8" autocomplete="new-password" required></div>
   <div class="fld"><label>Repita a senha</label><input name="s2" type="password" minlength="8" autocomplete="new-password" required></div>
   <button class="btn">Salvar e entrar</button></form></div>`;
  document.getElementById('fSenha').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target);
    if(fd.get('s1')!==fd.get('s2'))return telaSenha('As senhas não conferem.');
    const {error}=await sb.auth.updateUser({password:fd.get('s1')});
    if(error)return telaSenha(error.message);
    precisaSenha=false;history.replaceState(null,'',location.pathname+'#/');entrar()};
}
let precisaSenha=/type=(invite|recovery)/.test(location.hash);
let entrando=false;
async function entrar(){
  if(entrando)return;entrando=true;
  try{
    if(precisaSenha){entrando=false;return telaSenha()}
    mostrar('loading');
    await carregarRemoto();
    if(/access_token|type=/.test(location.hash))history.replaceState(null,'',location.pathname+'#/');
    mostrar('app');render();
  }catch(err){console.error(err);telaLogin('Não foi possível carregar seus dados. Verifique a conexão e tente de novo.')}
  entrando=false;
}
document.addEventListener('visibilitychange',async()=>{
  if(document.visibilityState==='hidden'&&pendente){clearTimeout(syncT);enviar();return}
  if(document.visibilityState!=='visible'||!sb||!USER||pendente)return;
  const {data}=await sb.from('progresso').select('dados,atualizado').eq('user_id',USER.id).eq('curso_id',CURSO.id).maybeSingle();
  if(data&&data.atualizado&&(!ultimoSync||data.atualizado>ultimoSync)&&!pendente){S=Object.assign(padrao(),data.dados);ultimoSync=data.atualizado;_cache.k=null;if(migrar())salvar();else gravarLocal();render()}
});

async function iniciar(){
  if(!sb){S=Object.assign(padrao(),lerLocal(chaveLocal())||{});if(migrar())salvar();mostrar('app');render();return}
  sb.auth.onAuthStateChange((ev,session)=>{
    if(ev==='PASSWORD_RECOVERY')precisaSenha=true;
    if(session&&session.user){const novo=!USER||USER.id!==session.user.id;USER=session.user;if(novo||ev==='PASSWORD_RECOVERY')setTimeout(entrar,0)}
    else if(ev==='SIGNED_OUT'){USER=null;telaLogin()}
  });
  const {data:{session}}=await sb.auth.getSession();
  if(!session){const h=location.hash;if(/error_description/.test(h)){const m=new URLSearchParams(h.slice(1)).get('error_description');history.replaceState(null,'',location.pathname);telaLogin('O link expirou ou já foi usado. '+(m?'('+m+')':''))}else telaLogin()}
}
iniciar();

/* TAOS: sem sessão, volta para o login do QG */
function telaLogin(){if(sb)location.replace('./?c='+CURSO.id)}
