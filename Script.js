// Scroll reveal (fade-up, slide-left/right, pop) for all animation variants
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-pop');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{threshold:0.15});
  revealEls.forEach(el=>io.observe(el));

  // Scroll progress bar, header shrink, and a light parallax drift on the hero phone
  const progressBar = document.getElementById('scrollProgress');
  const headerEl = document.querySelector('header');
  const phoneMock = document.querySelector('.phone-mock');
  const heroEl = document.querySelector('.hero');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;

  function onScroll(){
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    if(progressBar) progressBar.style.width = pct + '%';

    if(headerEl){
      headerEl.classList.toggle('scrolled', scrollY > 24);
    }

    if(phoneMock && heroEl && !prefersReducedMotion){
      const heroHeight = heroEl.offsetHeight;
      if(scrollY < heroHeight){
        const drift = Math.min(scrollY * 0.12, 40);
        phoneMock.style.setProperty('--drift', drift + 'px');
      }
    }
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{
    if(!ticking){
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, {passive:true});
  onScroll();

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item=>{
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click',()=>{
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o=>{
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // Mobile burger toggle
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  function closeMobileNav(){ navLinks.classList.remove('open'); }
  function openMobileNav(){ navLinks.classList.add('open'); }
  burger.addEventListener('click',()=>{
    navLinks.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMobileNav));
