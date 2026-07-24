(function(){
  const principalInput = document.getElementById('principal');
  const rateInput = document.getElementById('rate');
  const tenureInput = document.getElementById('tenure');
  const freqInput = document.getElementById('freq');
  const compoundFreqWrap = document.getElementById('compoundFreqWrap');
  const tabSimple = document.getElementById('tabSimple');
  const tabCompound = document.getElementById('tabCompound');

  const principalVal = document.getElementById('principalVal');
  const rateVal = document.getElementById('rateVal');
  const tenureVal = document.getElementById('tenureVal');

  const resultTotal = document.getElementById('resultTotal');
  const resultPrincipal = document.getElementById('resultPrincipal');
  const resultInterest = document.getElementById('resultInterest');
  const resultEffective = document.getElementById('resultEffective');

  let mode = 'simple';

  function formatINR(n){
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  function calculate(){
    const principal = Number(principalInput.value);
    const ratePct = Number(rateInput.value);
    const days = Number(tenureInput.value);
    const years = days / 365;

    let total;
    if(mode === 'simple'){
      const interest = principal * (ratePct / 100) * years;
      total = principal + interest;
    } else {
      const n = Number(freqInput.value);
      total = principal * Math.pow(1 + (ratePct / 100) / n, n * years);
    }

    const interest = total - principal;
    const effectivePct = (interest / principal) * 100;

    principalVal.textContent = formatINR(principal);
    rateVal.textContent = ratePct + '%';
    tenureVal.textContent = days + (days === 1 ? ' day' : ' days');

    resultTotal.textContent = formatINR(total);
    resultPrincipal.textContent = formatINR(principal);
    resultInterest.textContent = formatINR(interest);
    resultEffective.textContent = effectivePct.toFixed(1) + '% of principal';
  }

  function setMode(newMode){
    mode = newMode;
    const isSimple = mode === 'simple';
    tabSimple.classList.toggle('active', isSimple);
    tabCompound.classList.toggle('active', !isSimple);
    tabSimple.setAttribute('aria-selected', String(isSimple));
    tabCompound.setAttribute('aria-selected', String(!isSimple));
    compoundFreqWrap.style.display = isSimple ? 'none' : '';
    calculate();
  }

  tabSimple.addEventListener('click', () => setMode('simple'));
  tabCompound.addEventListener('click', () => setMode('compound'));

  [principalInput, rateInput, tenureInput, freqInput].forEach(el => {
    if(el) el.addEventListener('input', calculate);
  });

  calculate();
})();
