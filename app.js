(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('#header');
  const menu = document.querySelector('.menu');
  const mobileNav = document.querySelector('.mobile-nav');

  addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>20),{passive:true});
  menu?.addEventListener('click',()=>{
    const open=mobileNav.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
    mobileNav.setAttribute('aria-hidden',String(!open));
  });
  mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));

  const dust=document.querySelector('.hero-dust');
  if(dust){
    for(let i=0;i<22;i++){
      const p=document.createElement('i');
      p.style.left=`${8+Math.random()*88}%`;
      p.style.top=`${10+Math.random()*78}%`;
      p.style.setProperty('--dur',`${3.5+Math.random()*5}s`);
      p.style.opacity=(.08+Math.random()*.3).toFixed(2);
      p.style.transform=`scale(${.45+Math.random()*1.1})`;
      dust.appendChild(p);
    }
  }

  if(reduced || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  if(window.Lenis){
    const lenis=new Lenis({duration:.72,smoothWheel:true,syncTouch:false});
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(t=>lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);
  }

  const setPct=(selector,p)=>{const el=document.querySelector(selector);if(el) el.textContent=`${Math.round(p*100).toString().padStart(2,'0')}%`};
  const setBar=(selector,p)=>gsap.set(selector,{width:`${p*100}%`});

  const hero=gsap.timeline({
    scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom 15%',scrub:.45,invalidateOnRefresh:true,onUpdate:s=>{
      setBar('.hero .scene-footer i b',s.progress);
    }}
  });
  hero.fromTo('.tooth-motion',
      {xPercent:-2,yPercent:1,rotationY:-7,rotationX:3,rotationZ:-1.2,scale:.96,transformPerspective:1200},
      {xPercent:5,yPercent:4,rotationY:11,rotationX:-4,rotationZ:2.2,scale:1.075,ease:'none'},0)
    .to('.helix-back',{rotation:150,scaleX:1.08,scaleY:.9,yPercent:-15,ease:'none'},0)
    .to('.helix-front',{rotation:-118,scaleX:.88,scaleY:1.06,yPercent:14,ease:'none'},0)
    .to('.hero-bg',{scale:1.13,xPercent:-1.5,yPercent:1.5,filter:'saturate(.9) contrast(1.12) brightness(1.08)',ease:'none'},0)
    .to('.hero-copy',{yPercent:-10,opacity:.76,ease:'none'},.1)
    .to('.hero-light',{xPercent:10,yPercent:-5,scale:1.12,ease:'none'},0);

  if(matchMedia('(pointer:fine)').matches){
    document.querySelector('.hero-visual')?.addEventListener('pointermove',e=>{
      const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      gsap.to('.tooth-idle',{x:x*10,y:y*7,rotationZ:x*1.1,duration:.7,overwrite:'auto'});
    });
  }

  gsap.set(['.a-crown','.a-dentin','.a-pulp','.a-root'],{opacity:0});
  gsap.set(['.callout.c1','.callout.c2','.callout.c3','.callout.c4'],{opacity:0,x:18});

  const anatomy=gsap.timeline({
    scrollTrigger:{
      trigger:'#anatomy',
      start:'top 72%',
      end:'bottom 12%',
      scrub:.32,
      invalidateOnRefresh:true,
      onUpdate:s=>{setPct('.anatomy-pct',s.progress);setBar('.anatomy-bar',s.progress);}
    }
  });
  anatomy.to('.anatomy-full',{scale:1.045,yPercent:-1,ease:'none'},0)
    .to('.anatomy-scan',{opacity:1,top:'67%',ease:'none',duration:.13},.01)
    .to('.anatomy-full',{opacity:0,scale:.995,duration:.10},.10)
    .set(['.a-crown','.a-dentin','.a-pulp','.a-root'],{opacity:1},.11)
    .fromTo('.a-crown',{y:78},{y:0,ease:'none',duration:.22},.11)
    .fromTo('.a-dentin',{y:22},{y:0,ease:'none',duration:.22},.11)
    .fromTo('.a-pulp',{y:-34},{y:0,ease:'none',duration:.22},.11)
    .fromTo('.a-root',{y:-72},{y:0,ease:'none',duration:.22},.11)
    .to('.a-crown',{y:-48,rotation:-.7,ease:'none',duration:.34},.34)
    .to('.a-dentin',{y:-10,rotation:.4,ease:'none',duration:.34},.34)
    .to('.a-pulp',{y:25,scale:1.018,ease:'none',duration:.34},.34)
    .to('.a-root',{y:62,rotation:-.28,ease:'none',duration:.34},.34)
    .to('.callout.c1',{opacity:1,x:0,duration:.07},.40)
    .to('.callout.c2',{opacity:1,x:0,duration:.07},.47)
    .to('.callout.c3',{opacity:1,x:0,duration:.07},.54)
    .to('.callout.c4',{opacity:1,x:0,duration:.07},.61)
    .to('.anatomy-bg',{scale:1.11,xPercent:-1,ease:'none'},0);

  gsap.set(['.ic1','.ic2','.ic3'],{opacity:0});
  const implant=gsap.timeline({
    scrollTrigger:{
      trigger:'#implant',
      start:'top 72%',
      end:'bottom 12%',
      scrub:.28,
      invalidateOnRefresh:true,
      onUpdate:s=>{setPct('.implant-pct',s.progress);setBar('.implant-bar',s.progress);}
    }
  });
  implant.fromTo('.i-screw',
      {y:128,scale:.95,rotationY:-12,transformOrigin:'50% 60%',transformPerspective:1100},
      {y:0,scale:1,duration:.26,ease:'none'},0)
    .to('.i-screw',{rotationY:17,scaleX:.965,x:5,duration:.042,ease:'none'},0)
    .to('.i-screw',{rotationY:-17,scaleX:1.025,x:-5,duration:.042,ease:'none'},.042)
    .to('.i-screw',{rotationY:17,scaleX:.965,x:5,duration:.042,ease:'none'},.084)
    .to('.i-screw',{rotationY:-17,scaleX:1.025,x:-5,duration:.042,ease:'none'},.126)
    .to('.i-screw',{rotationY:14,scaleX:.975,x:4,duration:.042,ease:'none'},.168)
    .to('.i-screw',{rotationY:0,scaleX:1,x:0,duration:.05,ease:'none'},.21)
    .to('.spin-rings',{opacity:1,rotation:520,ease:'none',duration:.27},0)
    .to('.ic1',{opacity:1,duration:.045},.09)
    .fromTo('.i-abutment',{y:-104,rotationY:-22,rotationZ:6,scale:.96,transformPerspective:1000},{y:44,rotationY:0,rotationZ:0,scale:1,duration:.25,ease:'none'},.24)
    .to('.ic2',{opacity:1,duration:.045},.34)
    .fromTo('.i-crown',{y:-138,rotationY:17,rotationZ:-6,scale:.95,transformPerspective:1000},{y:92,rotationY:0,rotationZ:0,scale:1,duration:.28,ease:'none'},.43)
    .to('.ic3',{opacity:1,duration:.045},.54)
    .to('.implant-flash',{opacity:1,scaleX:1.25,duration:.04},.64)
    .to('.implant-flash',{opacity:0,duration:.07},.69)
    .to(['.i-screw','.i-abutment','.i-crown','.spin-rings'],{opacity:0,duration:.10},.74)
    .to('.implant-endstate',{opacity:1,scale:1.03,duration:.18,ease:'none'},.74)
    .to('.implant-bg',{scale:1.11,yPercent:1,ease:'none'},0);

  gsap.to('.result-media img',{scale:1.16,xPercent:-2.5,scrollTrigger:{trigger:'.result',start:'top 92%',end:'bottom 18%',scrub:.45,invalidateOnRefresh:true}});
  gsap.fromTo('.result-scan',{top:'-10%'},{top:'105%',ease:'none',scrollTrigger:{trigger:'.result',start:'top 90%',end:'bottom 25%',scrub:.4,invalidateOnRefresh:true}});
  gsap.from('.result-copy',{y:54,opacity:0,duration:.75,scrollTrigger:{trigger:'.result-copy',start:'top 88%'}});

  const refresh=()=>requestAnimationFrame(()=>ScrollTrigger.refresh(true));
  addEventListener('load',refresh,{once:true});
  if(document.fonts?.ready) document.fonts.ready.then(refresh);
  document.querySelectorAll('img').forEach(img=>{
    if(!img.complete) img.addEventListener('load',refresh,{once:true});
  });
  addEventListener('resize',refresh);
})();