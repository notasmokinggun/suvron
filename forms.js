/* Forms, mailto helpers, email-copy toast, blog gallery. Shared by every page, so it works with the shared theme header. */
// ============================================================
// CONTACT FORM: submissions go straight to our inbox.
//
// The site is static (GitHub Pages), so the form posts to FormSubmit
// (formsubmit.co), a free form-to-email relay: no account, no API key,
// nothing to deploy. It emails each submission to contact@suvron.in
// with the sender's address as Reply-To, so "Reply" answers them.
//
// One-time setup: FormSubmit emails contact@suvron.in an "Activate Form"
// link when the form is first used (and again after any change of address).
// Click it once; after that every message is delivered. FormSubmit keeps
// earlier submissions for 30 days and sends them on once activated.
//
// Set up per FormSubmit's docs (formsubmit.co/documentation, /help):
//   - reCAPTCHA stays ON. Their docs strongly advise against _captcha=false,
//     which opts the form into extra bot filtering. Background (AJAX) sends
//     skip the captcha anyway; the normal-post path shows it.
//   - _url names the page the form lives on, since browsers no longer send
//     the full page address with cross-site requests.
//   - If the background send comes back with anything but success
//     (including "needs activation"), the form is sent once more the normal
//     way, the same path a no-JS visitor uses, so nothing is lost.
//
// Spam and rate limiting, cheapest first:
//   1. Honeypot field (_honey): bots fill it, people never see it. FormSubmit
//      also silently drops any submission where it is filled.
//   2. Fill-time check: a form submitted under 3 seconds after the page
//      loaded is a bot. It gets a fake "sent" and nothing is sent.
//   3. Per-browser limits: one message every 60 seconds and at most 5 an
//      hour; the same message can't be sent twice within 10 minutes.
//   4. FormSubmit's own spam filtering and reCAPTCHA on the normal-post path.
// Limits 2 and 3 run in the visitor's browser, so they stop accidental
// double-sends and casual abuse; a determined attacker can bypass them.
//
// Without JavaScript the form still works: it posts normally and
// FormSubmit sends the visitor back to /contact/?sent=1.
// To change the destination, edit CONTACT_TO below and the form's action.
// ============================================================
const CONTACT_TO = 'contact@suvron.in';
const CONTACT_LIMITS = {gapMs: 60e3, perHour: 5, minFillMs: 3000, dupeMs: 10*60e3};

function setStatus(el, text, kind){
  if(!el) return;
  el.textContent = text;
  el.classList.remove('success','error','pending');
  el.classList.add(kind);
}

(function(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  const status = document.getElementById('formStatus');
  const btn = form.querySelector('button[type=submit]');
  const loadedAt = Date.now();
  const KEY = 'suvron-contact-log';
  let busy = false;

  if(/[?&]sent=1\b/.test(location.search)) setStatus(status, "Sent. Your message is in our inbox and we'll reply to your email.", 'success');

  const readLog = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; } };
  const writeLog = log => { try { localStorage.setItem(KEY, JSON.stringify(log)); } catch(e){} };
  const hash = str => { let h = 0; for(let i = 0; i < str.length; i++){ h = (h * 31 + str.charCodeAt(i)) | 0; } return String(h); };
  const wait = ms => { const m = Math.ceil(ms / 60e3); return ms < 60e3 ? `${Math.ceil(ms / 1e3)} seconds` : `${m} minute${m === 1 ? '' : 's'}`; };
  const fakeSent = () => { setStatus(status, "Sent. Your message is in our inbox and we'll reply to your email.", 'success'); form.reset(); };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if(busy) return;
    const data = Object.fromEntries(new FormData(form).entries());
    ['name','email','subject','message'].forEach(k => { data[k] = (data[k] || '').trim(); });

    if(data._honey || Date.now() - loadedAt < CONTACT_LIMITS.minFillMs){ fakeSent(); return; }
    if(!data.name || !data.email || !data.subject || !data.message){
      setStatus(status, 'Fill in every field so we know how to help.', 'error'); return;
    }
    if(!form.querySelector('[name=email]').checkValidity()){
      setStatus(status, 'That email address looks incomplete. Check it so we can reply.', 'error'); return;
    }

    const now = Date.now();
    const log = readLog().filter(e => now - e.t < 3600e3);
    const last = log[log.length - 1];
    const sig = hash(data.email + '|' + data.subject + '|' + data.message);
    if(log.some(e => e.h === sig && now - e.t < CONTACT_LIMITS.dupeMs)){
      setStatus(status, "We already have this exact message. No need to send it again.", 'success'); return;
    }
    if(last && now - last.t < CONTACT_LIMITS.gapMs){
      setStatus(status, `Give it ${wait(CONTACT_LIMITS.gapMs - (now - last.t))} before sending another message.`, 'error'); return;
    }
    if(log.length >= CONTACT_LIMITS.perHour){
      setStatus(status, `That's the limit for now. Try again in ${wait(3600e3 - (now - log[0].t))}, or email ${CONTACT_TO}.`, 'error'); return;
    }

    busy = true; btn.disabled = true; btn.textContent = 'Sending…';
    setStatus(status, 'Sending your message…', 'pending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_TO}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({
          name: data.name, email: data.email, subject: data.subject, message: data.message,
          _subject: `suvron.in contact: ${data.subject}`.slice(0, 160),
          _template: 'table', _url: 'https://suvron.in/contact/', _honey: ''
        })
      });
      const out = await res.json().catch(() => ({}));
      if(!res.ok || String(out.success) !== 'true') throw new Error(out.message || String(res.status));
      log.push({t: now, h: sig}); writeLog(log);
      setStatus(status, "Sent. Your message is in our inbox and we'll reply to your email.", 'success');
      form.reset();
      busy = false; btn.disabled = false; btn.textContent = 'Send message';
    } catch(err){
      // Fall back to a normal form post (see the note at the top). It also covers
      // blocked or failed background requests, since it is the same path as no-JS.
      if(!navigator.onLine){
        setStatus(status, `You look offline. Reconnect and try again, or email us at ${CONTACT_TO}.`, 'error');
        busy = false; btn.disabled = false; btn.textContent = 'Send message'; return;
      }
      log.push({t: now, h: sig}); writeLog(log);
      setStatus(status, 'Sending…', 'pending');
      const subj = form.querySelector('[name=_subject]');
      if(subj) subj.value = `suvron.in contact: ${data.subject}`.slice(0, 160);
      HTMLFormElement.prototype.submit.call(form);
    }
  });
})();

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
