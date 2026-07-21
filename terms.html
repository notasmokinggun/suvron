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

// ============================================================
// BACKEND: Firestore-backed form submissions.
//
// Every form on the site (contact form, "check eligibility" form,
// the sticky "Apply now" bar on all pages) writes to Firebase
// Firestore, so a real record lands in your database instead of
// just showing a success message and going nowhere.
//
// TO GO LIVE: create a Firebase project (console.firebase.google.com),
// enable Firestore in production mode, then paste your web app's
// config below in place of the placeholder values. Suggested
// Firestore security rules so the public site can only create
// records, never read/edit/delete them:
//
//   rules_version = '2';
//   service cloud.firestore {
//     match /databases/{database}/documents {
//       match /{collection}/{doc} {
//         allow create: if true;
//         allow read, update, delete: if false;
//       }
//     }
//   }
//
// Until real values are pasted in below, forms will show an honest
// "not connected yet, email/call us directly" message instead of a
// fake success message.
// ============================================================
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

function isFirebaseConfigured(){
  return FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";
}

let _dbPromise = null;
async function getFirestoreDb(){
  if(_dbPromise) return _dbPromise;
  _dbPromise = (async () => {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js");
    const { getFirestore, collection, addDoc, serverTimestamp } =
      await import("https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js");
    const app = initializeApp(FIREBASE_CONFIG);
    const db = getFirestore(app);
    return { db, collection, addDoc, serverTimestamp };
  })();
  return _dbPromise;
}

async function submitToFirestore(collectionName, data){
  const { db, collection, addDoc, serverTimestamp } = await getFirestoreDb();
  await addDoc(collection(db, collectionName), {
    ...data,
    page: window.location.pathname,
    submittedAt: serverTimestamp()
  });
}

function setStatus(el, text, kind){
  if(!el) return;
  el.textContent = text;
  el.classList.remove('success','error','pending');
  el.classList.add(kind);
}

// Contact form (contact.html)
async function handleContactSubmit(event){
  event.preventDefault();
  const form = event.target;
  const status = document.getElementById('formStatus');
  const submitBtn = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form).entries());

  if(!isFirebaseConfigured()){
    setStatus(status, "This form isn't connected yet. Email us directly at connect@suvron.in in the meantime.", 'error');
    return;
  }

  setStatus(status, 'Sending...', 'pending');
  submitBtn.disabled = true;
  try{
    await submitToFirestore('contact_messages', data);
    setStatus(status, "Message sent. We'll get back to you soon.", 'success');
    form.reset();
  } catch(err){
    setStatus(status, 'Something went wrong. Try emailing connect@suvron.in instead.', 'error');
  } finally {
    submitBtn.disabled = false;
  }
}

// "Apply now" forms: the hero mini-form (#apply on index.html) and the
// sticky bottom bar form repeated on every page.
async function handleApplySubmit(event){
  event.preventDefault();
  const form = event.target;
  const isSticky = form.classList.contains('sticky-form');

  // On small screens the sticky bar's inputs are hidden (single tappable
  // CTA), so there's nothing to submit yet — send the person to the real
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

  if(!isFirebaseConfigured()){
    setStatus(status, "Applications aren't connected to our systems yet — email connect@suvron.in with your name and number and we'll follow up manually.", 'error');
    return;
  }

  const originalLabel = submitBtn.textContent;
  setStatus(status, 'Submitting...', 'pending');
  submitBtn.disabled = true;
  try{
    await submitToFirestore('loan_applications', data);
    setStatus(status, `Thanks, ${data.name.split(' ')[0]} — we've got your details and will call you within 24 hours.`, 'success');
    submitBtn.textContent = 'Request received';
    form.reset();
  } catch(err){
    setStatus(status, 'Something went wrong. Try emailing connect@suvron.in instead.', 'error');
    submitBtn.textContent = originalLabel;
  } finally {
    submitBtn.disabled = false;
  }
}

// Copy-to-clipboard fallback for mailto buttons/links, since mailto: does
// nothing visible on devices with no default mail app configured (common
// on mobile browsers and in-app browsers).
document.addEventListener('click', async (event) => {
  const link = event.target.closest('a[href^="mailto:"]');
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
    // Clipboard API unavailable — the mailto: link itself still fires as normal.
  }
});
