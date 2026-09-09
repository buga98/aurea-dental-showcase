(() => {
  const services = [
    ['01','Estetska dentalna medicina','Minimalno invazivni zahvati, kompozitne ljuskice i individualno oblikovanje osmijeha.','Prirodno · precizno · individualno'],
    ['02','Implantologija','Digitalno planiranje implantata i jasan plan terapije od prvog pregleda do završnog osmijeha.','3D plan · kirurgija · protetika'],
    ['03','Protetika','Keramičke krunice, mostovi i nadomjesci dizajnirani prema licu, zagrizu i karakteru osmijeha.','Keramika · CAD/CAM · funkcija'],
    ['04','Ortodoncija','Diskretni pristupi ispravljanju položaja zuba uz digitalno praćenje i predvidljiv tijek terapije.','Aligneri · kontrola · plan'],
    ['05','Endodoncija','Mikroskopska preciznost kod liječenja korijenskih kanala i očuvanja prirodnog zuba.','Mikroskop · očuvanje zuba'],
    ['06','Preventiva','Kontrole, profesionalno čišćenje i programi održavanja prilagođeni vašem riziku i navikama.','Kontrola · higijena · edukacija']
  ];
  const tooth = '<svg><use href="#tooth-mark"></use></svg>';
  const arrow = '<svg><use href="#arrow"></use></svg>';
  const grid = document.querySelector('#services-grid');
  if (grid) grid.innerHTML = services.map(s => `<article class="service-card reveal"><div class="service-no">${s[0]}</div><div class="service-icon">${tooth}</div><h3>${s[1]}</h3><p>${s[2]}</p><div class="service-meta">${s[3]}</div><div class="service-arrow">${arrow}</div></article>`).join('');

  const makeArch = (selector, lower = false) => {
    const el = document.querySelector(selector); if (!el) return;
    el.innerHTML = Array.from({length:14}, (_,i) => {
      const n = i - 6.5, rot = n * (lower ? -4.7 : 4.7), y = Math.abs(n) * (lower ? -4.4 : 4.4), scale = 1 - Math.abs(n)*.025;
      return `<div class="arch-tooth" style="--rot:${rot}deg;--y:${y}px;--scale:${scale};--i:${i}">${tooth}</div>`;
    }).join('');
  };
  makeArch('#upper-arch'); makeArch('#lower-arch', true);

  const makeSmileTeeth = (selector, newer) => {
    const g = document.querySelector(selector); if (!g) return;
    g.innerHTML = Array.from({length:10}, (_,i) => {
      const x=302+i*30, y=(newer?174:181)+Math.abs(4.5-i)*(newer?1.5:2), h=(newer?71:65)-Math.abs(4.5-i)*(newer?1.5:2), r=(i-4.5)*(newer?1.1:1.8);
      return `<rect x="${x}" y="${y}" width="33" height="${h}" rx="10" transform="rotate(${r} ${318+i*30} 210)"/>`;
    }).join('');
  };
  makeSmileTeeth('#old-teeth', false); makeSmileTeeth('#new-teeth', true);

  const range = document.querySelector('#smile-range');
  const updateSmile = () => {
    const v = Number(range?.value || 58), x = 900*v/100;
    document.querySelector('#simulator-value').textContent = `${v}%`;
    document.querySelector('#reveal-rect').setAttribute('width', x);
    document.querySelector('#reveal-line').setAttribute('x1', x); document.querySelector('#reveal-line').setAttribute('x2', x);
    document.querySelector('#reveal-knob').setAttribute('cx', x);
  };
  range?.addEventListener('input', updateSmile); updateSmile();

  const menuBtn = document.querySelector('.menu-btn'), mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = () => { menuBtn?.classList.remove('open'); mobileMenu?.classList.remove('open'); menuBtn?.setAttribute('aria-expanded','false'); mobileMenu?.setAttribute('aria-hidden','true'); document.body.classList.remove('menu-open'); };
  menuBtn?.addEventListener('click', () => { const open = !menuBtn.classList.contains('open'); menuBtn.classList.toggle('open', open); mobileMenu?.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded',String(open)); mobileMenu?.setAttribute('aria-hidden',String(!open)); document.body.classList.toggle('menu-open', open); });
  document.querySelectorAll('[data-scroll]').forEach(b => b.addEventListener('click', () => { closeMenu(); document.querySelector(b.dataset.scroll)?.scrollIntoView({behavior:'smooth'}); }));
  document.querySelector('.contact-form')?.addEventListener('submit', e => { e.preventDefault(); const btn=e.currentTarget.querySelector('button'); const old=btn.innerHTML; btn.textContent='Upit je zabilježen · demo'; setTimeout(()=>btn.innerHTML=old,2200); });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero'), heroTooth = document.querySelector('.hero-tooth'), heroVisual = document.querySelector('.hero-visual-wrap');
  const serviceSection = document.querySelector('.services-section'), orbitTeeth = [...document.querySelectorAll('.orbit-tooth')];
  const jawSection = document.querySelector('.jaw-section'), jawStage = document.querySelector('.jaw-stage'), jawScan = document.querySelector('.jaw-scan');
  const marquee = document.querySelector('.marquee'), marqueeTrack = document.querySelector('.marquee-track');
  let scrollY = 0, ticking = false, mouseX=0, mouseY=0;
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  const progress = (el) => { if(!el) return 0; const r=el.getBoundingClientRect(), vh=innerHeight; return clamp((vh-r.top)/(vh+r.height),0,1); };
  const renderScroll = () => {
    ticking=false; header?.classList.toggle('is-scrolled', scrollY>24); if(reduced) return;
    const hp = clamp(scrollY / Math.max(hero?.offsetHeight || 1,1),0,1);
    if(heroTooth) heroTooth.style.transform = `translate3d(${hp*22}px,${hp*45}px,0) rotate(${hp*310}deg)`;
    const sp=progress(serviceSection); orbitTeeth.forEach((el,i)=>el.style.transform=`translate3d(${(i? -1:1)*sp*65}px,${(i?1:-1)*sp*130}px,0) rotate(${(i?-1:1)*sp*200+(i?-27:18)}deg)`);
    const jp=progress(jawSection); if(jawStage) jawStage.style.transform=`rotateY(${(jp-.5)*18}deg) rotateX(${(jp-.5)*-7}deg)`; if(jawScan) jawScan.style.transform=`translateY(${jp*320}px)`;
    const mp=progress(marquee); if(marqueeTrack) marqueeTrack.style.transform=`translate3d(${-mp*18}%,0,0)`;
  };
  addEventListener('scroll',()=>{scrollY=scrollY||window.scrollY; scrollY=window.scrollY; if(!ticking){requestAnimationFrame(renderScroll);ticking=true;}},{passive:true}); scrollY=window.scrollY; renderScroll();

  if(!reduced && matchMedia('(pointer:fine)').matches){
    addEventListener('pointermove', e => { mouseX=(e.clientX/innerWidth-.5)*2; mouseY=(e.clientY/innerHeight-.5)*2; document.querySelector('.cursor-glow')?.style.setProperty('transform',`translate(${e.clientX-210}px,${e.clientY-210}px)`); if(heroVisual) heroVisual.style.transform=`perspective(1100px) rotateY(${mouseX*5}deg) rotateX(${mouseY*-4}deg) translate3d(${mouseX*5}px,${mouseY*5}px,0)`; },{passive:true});
  }

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('in'); observer.unobserve(entry.target); } }),{threshold:.12,rootMargin:'0px 0px -4%'});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  requestAnimationFrame(()=>document.body.classList.add('loaded'));
})();
