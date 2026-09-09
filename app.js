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
    const lenis=new Lenis({duration:.95,smoothWheel:true,syncTouch:false});
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(t=>lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);
  }

  const setPct=(selector,p)=>{const el=document.querySelector(selector);if(el) el.textContent=`${Math.round(p*100).toString().padStart(2,'0')}%`};
  const setBar=(selector,p)=>gsap.set(selector,{width:`${p*100}%`});

  const hero=gsap.timeline({
    scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom bottom',scrub:.75,onUpdate:s=>{
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
  const anatomy=gsap.timeline({
    scrollTrigger:{trigger:'#anatomy',start:'top top',end:'bottom bottom',scrub:.65,onUpdate:s=>{
      setPct('.anatomy-pct',s.progress);setBar('.anatomy-bar',s.progress);
    }}
  });
  anatomy.to('.anatomy-full',{scale:1.06,yPercent:-1,ease:'none'},0)
    .to('.anatomy-scan',{opacity:1,top:'72%',ease:'none'},.04)
    .to('.anatomy-full',{opacity:0,scale:.99,duration:.18},.18)
    .set(['.a-crown','.a-dentin','.a-pulp','.a-root'],{opacity:1},.18)
    .fromTo('.a-crown',{y:135},{y:0,ease:'none'},.18)
    .fromTo('.a-dentin',{y:38},{y:0,ease:'none'},.18)
    .fromTo('.a-pulp',{y:-52},{y:0,ease:'none'},.18)
    .fromTo('.a-root',{y:-122},{y:0,ease:'none'},.18)
    .to('.a-crown',{y:-42,rotation:-.6,ease:'none'},.54)
    .to('.a-dentin',{y:-8,rotation:.35,ease:'none'},.54)
    .to('.a-pulp',{y:22,scale:1.015,ease:'none'},.54)
    .to('.a-root',{y:58,rotation:-.25,ease:'none'},.54)
    .to('.callout.c1',{opacity:1,x:0,duration:.08},.55)
    .to('.callout.c2',{opacity:1,x:0,duration:.08},.62)
    .to('.callout.c3',{opacity:1,x:0,duration:.08},.69)
    .to('.callout.c4',{opacity:1,x:0,duration:.08},.76)
    .to('.anatomy-bg',{scale:1.11,xPercent:-1,ease:'none'},0);

  gsap.set(['.ic1','.ic2','.ic3'],{opacity:0});
  const implant=gsap.timeline({
    scrollTrigger:{trigger:'#implant',start:'top top',end:'bottom bottom',scrub:.55,onUpdate:s=>{
      setPct('.implant-pct',s.progress);setBar('.implant-bar',s.progress);
    }}
  });
  implant.fromTo('.i-screw',
      {y:150,scale:.95,rotationY:-12,transformOrigin:'50% 60%',transformPerspective:1100},
      {y:0,scale:1,duration:.34,ease:'none'},0)
    .to('.i-screw',{rotationY:14,scaleX:.97,x:4,duration:.055,ease:'none'},0)
    .to('.i-screw',{rotationY:-14,scaleX:1.02,x:-4,duration:.055,ease:'none'},.055)
    .to('.i-screw',{rotationY:14,scaleX:.97,x:4,duration:.055,ease:'none'},.11)
    .to('.i-screw',{rotationY:-14,scaleX:1.02,x:-4,duration:.055,ease:'none'},.165)
    .to('.i-screw',{rotationY:12,scaleX:.98,x:3,duration:.055,ease:'none'},.22)
    .to('.i-screw',{rotationY:0,scaleX:1,x:0,duration:.06,ease:'none'},.275)
    .to('.spin-rings',{opacity:1,rotation:420,ease:'none',duration:.34},0)
    .to('.ic1',{opacity:1,duration:.05},.12)
    .fromTo('.i-abutment',{y:-118,rotationY:-20,rotationZ:5,scale:.96,transformPerspective:1000},{y:44,rotationY:0,rotationZ:0,scale:1,ease:'none'},.30)
    .to('.ic2',{opacity:1,duration:.05},.42)
    .fromTo('.i-crown',{y:-160,rotationY:14,rotationZ:-5,scale:.95,transformPerspective:1000},{y:92,rotationY:0,rotationZ:0,scale:1,ease:'none'},.52)
    .to('.ic3',{opacity:1,duration:.05},.64)
    .to('.implant-flash',{opacity:1,scaleX:1.25,duration:.04},.70)
    .to('.implant-flash',{opacity:0,duration:.08},.75)
    .to(['.i-screw','.i-abutment','.i-crown','.spin-rings'],{opacity:0,duration:.12},.78)
    .to('.implant-endstate',{opacity:1,scale:1.03,duration:.18,ease:'none'},.78)
    .to('.implant-bg',{scale:1.11,yPercent:1,ease:'none'},0);

  gsap.to('.result-media img',{scale:1.16,xPercent:-2.5,scrollTrigger:{trigger:'.result',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.fromTo('.result-scan',{top:'-10%'},{top:'105%',ease:'none',scrollTrigger:{trigger:'.result',start:'top 75%',end:'bottom 25%',scrub:1}});
  gsap.from('.result-copy',{y:80,opacity:0,duration:1,scrollTrigger:{trigger:'.result-copy',start:'top 80%'}});

  addEventListener('load',()=>ScrollTrigger.refresh());
  addEventListener('resize',()=>ScrollTrigger.refresh());
})();