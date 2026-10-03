/* SUVRON Money shared behaviour: header glass-on-scroll + motion engine. Header and footer markup is static in each page. */
(function(){
 const h=document.querySelector('.site-h');if(!h)return;
 const s=()=>h.classList.toggle('scrolled',scrollY>30);addEventListener('scroll',s,{passive:true});s();
})();
(function(){
 const d=document,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(d.body.classList.contains('inner'))d.querySelectorAll('.page h1,.page h2,.page table,.page blockquote').forEach(e=>{if(!e.hasAttribute('data-r'))e.setAttribute('data-r','')});
 d.querySelectorAll('[data-words]').forEach(el=>{
  let i=0;const walk=n=>[...n.childNodes].forEach(c=>{
   if(c.nodeType===3){const f=d.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){f.appendChild(d.createTextNode(' '));return}const w=d.createElement('span');w.className='w';w.style.setProperty('--wi',i++);w.textContent=p;f.appendChild(w)});c.replaceWith(f)}
   else if(c.nodeType===1)walk(c)});
  walk(el);if(el.tagName==='H1')el.style.setProperty('--d0','.15s');
 });
 const els=[...d.querySelectorAll('[data-r],[data-words]')];
 if(reduce||!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));}
 else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -6% 0px'});els.forEach(e=>io.observe(e))}
 // count-up
 d.querySelectorAll('[data-count]').forEach(el=>{
  const end=+el.dataset.count,pre=el.dataset.pre||'',suf=el.dataset.suf||'';
  const run=()=>{if(reduce){return}const t0=performance.now(),dur=1600;(function f(t){const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,4);el.textContent=pre+Math.round(end*e).toLocaleString('en-IN')+suf;if(k<1)requestAnimationFrame(f)})(t0)};
  if(reduce||!('IntersectionObserver' in window))return;
  const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){run();o.disconnect()}},{threshold:.6});o.observe(el)});
 // cursor spotlight on cards
 d.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.gc,.rev,.trust,.refer');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
})();
(function(){
 const m=document.querySelector('.site-h .more');if(!m)return;
 const t=m.querySelector('.more-t');
 const mqm=matchMedia('(max-width:700px)'),lab=()=>mqm.matches?t.setAttribute('aria-label','Menu'):t.removeAttribute('aria-label');lab();mqm.addEventListener('change',lab);
 const set=o=>{m.classList.toggle('open',o);t.setAttribute('aria-expanded',o)};
 t.addEventListener('click',e=>{e.stopPropagation();set(!m.classList.contains('open'))});
 document.addEventListener('click',e=>{if(!m.contains(e.target))set(false)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&m.classList.contains('open')){set(false);t.focus()}});
 m.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
})();
