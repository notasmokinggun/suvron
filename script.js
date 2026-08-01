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
      // Hysteresis: turn on above 40px, only turn back off below 12px.
      // A single shared threshold made the header flip on and off rapidly
      // whenever the page sat right at that scroll position.
      if(scrollY > 40){
        headerEl.classList.add('scrolled');
      } else if(scrollY < 12){
        headerEl.classList.remove('scrolled');
      }
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
  const headerForMenu = document.querySelector('header');
  function closeMobileNav(){ navLinks.classList.remove('open'); headerForMenu.classList.remove('menu-open'); }
  function openMobileNav(){ navLinks.classList.add('open'); headerForMenu.classList.add('menu-open'); }
  burger.addEventListener('click',()=>{
    navLinks.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMobileNav));
  document.querySelectorAll('.nav-actions a').forEach(a=>a.addEventListener('click', closeMobileNav));

// ============================================================
// BACKEND: plain mailto form submissions. No API, no key, no
// third-party service and nothing that can expire.
//
// Every form on the site builds a mailto: link from what the
// person typed, then hands it to their own device. Their phone or
// computer opens whatever mail app is already signed in there
// (Gmail, Outlook, the default Mail app, and so on) with the
// recipient, subject and body already filled in. The person taps
// send from their own inbox, so the email is really sent by their
// mail provider, not by us, which is why it reliably lands: there
// is no API key to expire, no sending domain to get flagged as
// spam and nothing on our end that can go down.
//
// The one real tradeoff is that it needs a mail app to be signed
// in on the person's device, and it needs one extra tap from them
// to hit send. If that mail app is missing, the browser usually
// does nothing, so every status message below also spells out the
// destination address as a manual fallback.
//
// Each form routes to its own inbox so replies stay sorted without
// any extra tooling:
//   - "Check eligibility" form (index.html)   -> eligibility@suvron.in
//   - "Apply now" sticky bar (every page)     -> contact@suvron.in
//   - Contact page message form (contact.html) -> connect@suvron.in
// To change any destination, edit the address in the matching
// function below. Nothing else in the site needs to change.
// ============================================================

function setStatus(el, text, kind){
  if(!el) return;
  el.textContent = text;
  el.classList.remove('success','error','pending');
  el.classList.add(kind);
}

function buildMailto(to, subject, bodyLines){
  const body = bodyLines.join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function openMailto(mailtoUrl){
  // A short-lived hidden link click is the most reliable way to trigger
  // the mail app across desktop and mobile browsers alike.
  const a = document.createElement('a');
  a.href = mailtoUrl;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Contact page message form (contact.html) -> connect@suvron.in
function handleContactSubmit(event){
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById('formStatus');
  const data = Object.fromEntries(new FormData(form).entries());

  if(!data.name || !data.email || !data.subject || !data.message){
    setStatus(status, 'Fill in every field so we know how to help.', 'error');
    return;
  }

  const mailto = buildMailto('connect@suvron.in', `Suvron Money contact form: ${data.subject}`, [
    'Form: Contact page message form',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Subject: ${data.subject}`,
    '',
    data.message
  ]);

  openMailto(mailto);
  setStatus(status, "Your email app should now be open with this filled in. Hit send there to reach us. If nothing opened, email us directly at connect@suvron.in.", 'success');
  form.reset();
}

// "Apply now" forms: the hero "check eligibility" mini-form (#apply on
// index.html) goes to eligibility@suvron.in, and the sticky bottom bar
// "Apply now" form repeated on every page goes to contact@suvron.in.
function handleApplySubmit(event){
  event.preventDefault();
  const form = event.target;
  const isSticky = form.classList.contains('sticky-form');

  // On small screens the sticky bar's inputs are hidden (single tappable
  // CTA), so there is nothing to submit yet. Send the person to the real
  // form instead of silently doing nothing.
  if(isSticky){
    const fieldsVisible = form.querySelector('.sticky-fields') &&
      window.getComputedStyle(form.querySelector('.sticky-fields')).display !== 'none';
    if(!fieldsVisible){
      const onIndex = /(^|\/)index\.html$|\/$/.test(window.location.pathname) || window.location.pathname === '';
      if(onIndex && document.getElementById('apply')){
        document.getElementById('apply').scrollIntoView({behavior:'smooth', block:'start'});
      } else {
        window.location.href = 'index.html#apply';
      }
      return;
    }
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const status = isSticky ? form.parentElement.querySelector('.sticky-status') : form.parentElement.querySelector('.form-status');
  const nameInput = form.querySelector('input[type="text"]');
  const phoneInput = form.querySelector('input[type="tel"]');
  const data = { name: nameInput ? nameInput.value.trim() : '', phone: phoneInput ? phoneInput.value.trim() : '' };

  if(!data.name || !/^[6-9][0-9]{9}$/.test(data.phone)){
    setStatus(status, 'Enter your name and a valid 10-digit mobile number.', 'error');
    return;
  }

  const destination = isSticky ? 'contact@suvron.in' : 'eligibility@suvron.in';
  const formLabel = isSticky ? 'Apply now form (sticky bar, all pages)' : 'Check eligibility form (main page)';
  const subject = isSticky ? 'Suvron Money: new Apply now request' : 'Suvron Money: new eligibility check request';

  const mailto = buildMailto(destination, subject, [
    `Form: ${formLabel}`,
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Page: ${window.location.pathname}`
  ]);

  openMailto(mailto);

  const originalLabel = submitBtn.textContent;
  setStatus(status, `Thanks, ${data.name.split(' ')[0]}. Your email app should now be open, ready to send to us. If nothing opened, email ${destination} with your name and number.`, 'success');
  submitBtn.textContent = 'Request opened in email';
  form.reset();
  setTimeout(() => { submitBtn.textContent = originalLabel; }, 4000);
}

// Copy-to-clipboard fallback for mailto buttons/links, since mailto: does
// nothing visible on devices with no default mail app configured (common
// on mobile browsers and in-app browsers).
// Sliding blog gallery: builds dot indicators, keeps them in sync while
// scrolling, and gently auto-advances until the person touches it.
(function(){
  const gallery = document.getElementById('blogGallery');
  const dotsWrap = document.getElementById('galleryDots');
  if(!gallery || !dotsWrap) return;

  const slides = Array.from(gallery.children);
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    if(i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      slides[i].scrollIntoView({behavior:'smooth', block:'nearest', inline:'start'});
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function syncActiveDot(){
    const galleryLeft = gallery.getBoundingClientRect().left;
    let closest = 0, closestDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.getBoundingClientRect().left - galleryLeft);
      if(dist < closestDist){ closestDist = dist; closest = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === closest));
  }
  gallery.addEventListener('scroll', () => {
    window.requestAnimationFrame(syncActiveDot);
  }, {passive:true});

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let autoplayTimer = null;
  function startAutoplay(){
    if(prefersReducedMotion) return;
    autoplayTimer = setInterval(() => {
      const nextScroll = gallery.scrollLeft + slides[0].offsetWidth + 16;
      if(nextScroll >= gallery.scrollWidth - gallery.clientWidth - 4){
        gallery.scrollTo({left:0, behavior:'smooth'});
      } else {
        gallery.scrollBy({left: slides[0].offsetWidth + 16, behavior:'smooth'});
      }
    }, 3800);
  }
  function stopAutoplay(){
    if(autoplayTimer){ clearInterval(autoplayTimer); autoplayTimer = null; }
  }
  startAutoplay();
  ['pointerdown','touchstart','wheel'].forEach(evt => {
    gallery.addEventListener(evt, stopAutoplay, {passive:true, once:true});
  });
  dotsWrap.addEventListener('click', stopAutoplay);
})();

document.addEventListener('click', async (event) => {
  if(!link) return;
  const email = link.getAttribute('href').replace('mailto:', '').split('?')[0];
  try{
    await navigator.clipboard.writeText(email);
    const toast = document.createElement('div');
    toast.textContent = `Copied ${email} to clipboard`;
    toast.className = 'email-toast';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('in'));
    setTimeout(() => { toast.classList.remove('in'); setTimeout(() => toast.remove(), 300); }, 2600);
  } catch(err){
    // Clipboard API unavailable, so the mailto: link itself still fires as normal.
  }
});

// ===================== NAV: "Resources" dropdown =====================
(function(){
  var triggers = document.querySelectorAll('.nav-drop-trigger');
  triggers.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      var parent = btn.closest('.nav-drop');
      var wasOpen = parent.classList.contains('open');
      document.querySelectorAll('.nav-drop.open').forEach(function(d){ d.classList.remove('open'); });
      if(!wasOpen) parent.classList.add('open');
    });
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('.nav-drop')){
      document.querySelectorAll('.nav-drop.open').forEach(function(d){ d.classList.remove('open'); });
    }
  });
})();
