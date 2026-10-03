/* Forms, mailto helpers, email-copy toast, blog gallery. Shared by every page, so it works with the shared theme header. */
// ============================================================
// BACKEND: plain mailto form submissions. No API, no key, no
// third-party service and nothing that can expire.
//
// The contact form builds a mailto: link from what the
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
  const link = event.target.closest && event.target.closest('a[href^="mailto:"]');
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

// ===================== Skeleton loader (deliberate ~1s reveal) =====================
// No-ops entirely if a page doesn't have the overlay markup.
(function(){
  var overlay = document.getElementById('skeletonOverlay');
  if(!overlay) return;
  // No artificial hold: the page is already styled (CSS is render-blocking), so
  // reveal as soon as the DOM is ready. A forced delay pushes Largest Contentful
  // Paint later, which costs search ranking. Raise this only for a deliberate hold.
  var MIN_DISPLAY_MS = 0;
  var start = Date.now();

  function reveal(){
    var elapsed = Date.now() - start;
    var wait = Math.max(MIN_DISPLAY_MS - elapsed, 0);
    setTimeout(function(){
      overlay.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
      overlay.addEventListener('transitionend', function handler(){
        overlay.removeEventListener('transitionend', handler);
        overlay.remove();
      });
      // Fallback in case transitionend doesn't fire (e.g. display:none edge cases)
      setTimeout(function(){ if(overlay.parentNode) overlay.remove(); }, 500);
    }, wait);
  }

  if(document.readyState !== 'loading'){
    reveal();
  } else {
    document.addEventListener('DOMContentLoaded', reveal);
  }
})();
