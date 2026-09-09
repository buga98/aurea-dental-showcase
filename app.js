(async()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const topbar=document.querySelector('#topbar');
  const menuBtn=document.querySelector('.menu-toggle');
  const mobileNav=document.querySelector('.mobile-nav');
  addEventListener('scroll',()=>topbar?.classList.toggle('scrolled',scrollY>24),{passive:true});
  menuBtn?.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));mobileNav.setAttribute('aria-hidden',String(!open));});
  mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));

  const assetCache=new Map();
  const loadAsset=async(name)=>{
    if(assetCache.has(name))return assetCache.get(name);
    const r=await fetch(`assets-b64/${name}.txt`,{cache:'force-cache'});if(!r.ok)throw new Error(`asset ${name}`);
    const b64=(await r.text()).trim();
    const src=`data:image/webp;base64,${b64}`;assetCache.set(name,src);return src;
  };
  const imgs=[...document.querySelectorAll('[data-asset]')];
  const bgEls=[...document.querySelectorAll('[data-asset-bg]')];
  const names=[...new Set([...imgs.map(i=>i.dataset.asset),...bgEls.map(i=>i.dataset.assetBg)])];
  try{
    await Promise.all(names.map(loadAsset));
    imgs.forEach(img=>{img.src=assetCache.get(img.dataset.asset)});
    bgEls.forEach(el=>{el.style.backgroundImage=`url(${assetCache.get(el.dataset.assetBg)})`});
    const hero=assetCache.get('hero-tooth');document.documentElement.style.setProperty('--hero-mask',`url(${hero})`);
  }catch(e){console.error('AUREA asset load failed',e)}

  const makeParticles=(selector,count)=>{const host=document.querySelector(selector);if(!host)return;for(let i=0;i<count;i++){const p=document.createElement('i');p.className='particle'+(Math.random()>.82?' big':'');p.style.left=`${Math.random()*100}%`;p.style.top=`${25+Math.random()*70}%`;p.style.setProperty('--dur',`${3.5+Math.random()*5}s`);p.style.setProperty('--dx',`${(Math.random()-.5)*70}px`);p.style.setProperty('--dy',`${-(20+Math.random()*85)}px`);p.style.animationDelay=`${-Math.random()*5}s`;host.appendChild(p)}};
  makeParticles('.hero-particles',42);
  const dustHost=document.querySelector('.implant-dust');if(dustHost){for(let i=0;i<28;i++){const d=document.createElement('i');d.className='dust';d.style.left=`${25+Math.random()*50}%`;d.style.top=`${55+Math.random()*38}%`;dustHost.appendChild(d)}}

  if(reduced||!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  if(window.Lenis){const lenis=new Lenis({duration:.78,smoothWheel:true,syncTouch:false,wheelMultiplier:.9});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}

  gsap.set('.hero-tooth-wrap',{transformPerspective:1200,transformOrigin:'50% 55%'});
  const heroTL=gsap.timeline({scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom bottom',scrub:.65}});
  heroTL
    .fromTo('.hero-tooth-wrap',{rotationY:-15,rotationX:3,rotationZ:-3,scale:.93,y:20},{rotationY:18,rotationX:-5,rotationZ:4,scale:1.1,y:-36,ease:'none'},0)
    .fromTo('.hero-specular',{backgroundPosition:'170% 0'},{backgroundPosition:'-70% 0',ease:'none'},0)
    .to('.orbit-back',{rotation:150,scale:1.06,ease:'none'},0)
    .to('.orbit-front',{rotation:-130,scale:.94,ease:'none'},0)
    .to('.hero-bg',{scale:1.16,xPercent:-2,yPercent:2,ease:'none'},0)
    .to('.hero-ground',{scaleX:1.04,y:8,ease:'none'},0)
    .to('.hero-copy',{y:-90,opacity:.18,ease:'none'},.55)
    .to('.hero-bottom',{opacity:.2,ease:'none'},.65);
  gsap.to('.hero-ground i',{y:()=>gsap.utils.random(-8,8),x:()=>gsap.utils.random(-6,6),duration:.16,repeat:-1,yoyo:true,stagger:{each:.03,repeat:-1},ease:'none'});

  const anatomyTL=gsap.timeline({scrollTrigger:{trigger:'#anatomy',start:'top top',end:'bottom bottom',scrub:.7,onUpdate:self=>{const v=Math.round(self.progress*100);document.querySelector('#anatomy .progress-value').textContent=`${String(v).padStart(2,'0')}%`;gsap.set('#anatomy .scene-progress i b',{width:`${v}%`})}}});
  anatomyTL
    .set('.anatomy-part',{opacity:0},0)
    .set('.label',{opacity:0},0)
    .to('.whole-top',{y:-100,rotationZ:-2,scale:1.03,ease:'none'},.18)
    .to('.whole-bottom',{y:115,rotationZ:2,scale:1.03,ease:'none'},.18)
    .to('.anatomy-scan',{opacity:1,y:250,ease:'none'},.2)
    .to('.anatomy-part',{opacity:1,duration:.12},.27)
    .to('.whole-tooth',{opacity:0,duration:.15},.36)
    .fromTo('.a-crown',{y:75,rotationZ:0,scale:.96},{y:-115,x:-10,rotationZ:-4,scale:1,ease:'none'},.3)
    .fromTo('.a-dentin',{y:10,rotationZ:0,scale:.97},{y:-28,x:14,rotationZ:2,scale:1,ease:'none'},.3)
    .fromTo('.a-pulp',{y:-20,scale:.94},{y:82,x:-8,scale:1.04,ease:'none'},.3)
    .fromTo('.a-root',{y:-85,rotationZ:0,scale:.95},{y:205,x:8,rotationZ:-2,scale:1,ease:'none'},.3)
    .to('.anatomy-ring',{rotationZ:145,scale:1.12,ease:'none'},0)
    .to('.label',{opacity:1,x:0,stagger:.045,duration:.18},.6);

  const implantTL=gsap.timeline({scrollTrigger:{trigger:'#implant',start:'top top',end:'bottom bottom',scrub:.65,onUpdate:self=>{const p=self.progress,v=Math.round(p*100);document.querySelector('#implant .progress-value').textContent=`${String(v).padStart(2,'0')}%`;gsap.set('#implant .scene-progress i b',{width:`${v}%`});document.querySelectorAll('.implant-state').forEach((el,i)=>el.classList.toggle('active',p>(i===0?.12:i===1?.5:.72)))}}});
  implantTL
    .set('.implant-crown,.implant-abutment',{opacity:0},0)
    .set('.spin-ring',{opacity:0},0)
    .fromTo('.screw-wrap',{y:-95,scale:.95,rotationY:-8},{y:150,scale:1,rotationY:10,ease:'none'},0)
    .to('.spin-ring',{opacity:.85,rotationZ:720,scale:1.12,ease:'none'},.04)
    .fromTo('.screw-specular',{backgroundPosition:'180% 0'},{backgroundPosition:'-120% 0',ease:'none'},0)
    .to('.dust',{opacity:()=>Math.random()*.8+.2,y:()=>gsap.utils.random(-110,-35),x:()=>gsap.utils.random(-55,55),scale:()=>gsap.utils.random(.4,1.8),stagger:.008,ease:'none'},.13)
    .to('.spin-ring',{opacity:0,duration:.08},.43)
    .to('.implant-abutment',{opacity:1,duration:.08},.46)
    .fromTo('.implant-abutment',{y:-195,rotationY:75,rotationZ:-8,scale:.9},{y:36,rotationY:0,rotationZ:0,scale:1,ease:'none'},.46)
    .to('.implant-crown',{opacity:1,duration:.08},.69)
    .fromTo('.implant-crown',{y:-310,rotationY:-24,rotationZ:7,scale:.92},{y:75,rotationY:0,rotationZ:0,scale:1,ease:'none'},.69)
    .to('.implant-crown',{y:68,scale:1.02,duration:.06,yoyo:true,repeat:1,ease:'power1.inOut'},.93)
    .to('.implant-orbit',{rotationZ:180,scale:1.15,ease:'none'},0);

  const alignTL=gsap.timeline({scrollTrigger:{trigger:'#align',start:'top bottom',end:'bottom top',scrub:.8}});
  alignTL.fromTo('.aligner',{x:130,y:70,rotationZ:12,rotationY:-15,rotationX:10,scale:.84},{x:-45,y:-25,rotationZ:-7,rotationY:16,rotationX:-8,scale:1.05,ease:'none'})
    .to('.align-ring',{rotationZ:120,scale:1.14,ease:'none'},0);
  gsap.to('.smile-media img',{scale:1.14,xPercent:-3,scrollTrigger:{trigger:'.smile-scene',start:'top bottom',end:'bottom top',scrub:.8}});
  gsap.fromTo('.smile-scan',{top:'-10%'},{top:'105%',ease:'none',scrollTrigger:{trigger:'.smile-scene',start:'top 75%',end:'bottom 25%',scrub:.8}});

  if(matchMedia('(pointer:fine)').matches){document.querySelector('.hero-stage')?.addEventListener('pointermove',e=>{const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to('.hero-tooth-wrap',{x:x*20,yPercent:y*2,rotationY:x*11,rotationX:y*-7,duration:.55,overwrite:'auto'})})}
  addEventListener('load',()=>ScrollTrigger.refresh());addEventListener('resize',()=>ScrollTrigger.refresh());
})();
