/* SUVRON Money inner pages: the phone menu and the Company panel */
(function(){
  var n=document.querySelector('.sv-nav'),b=n&&n.querySelector('.sv-toggle');if(!n)return;
  var d=n.querySelector('.sv-more');
  if(b)b.addEventListener('click',function(){var o=n.classList.toggle('is-open');b.setAttribute('aria-expanded',String(o));document.body.style.overflow=o?'hidden':''});
  n.querySelectorAll('.sv-links a').forEach(function(a){a.addEventListener('click',function(){n.classList.remove('is-open');document.body.style.overflow=''})});
  document.addEventListener('click',function(e){if(d&&d.open&&!d.contains(e.target))d.open=false});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(d)d.open=false;if(n.classList.contains('is-open')){n.classList.remove('is-open');document.body.style.overflow='';b&&b.focus()}}});
})();
