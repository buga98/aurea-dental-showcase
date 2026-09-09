(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const topbar = document.querySelector('#topbar');
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  addEventListener('scroll', () => topbar?.classList.toggle('scrolled', scrollY > 24), {passive:true});
  menuBtn?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

  if (reduced || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  gsap.set('.hero-tooth', {transformPerspective:1100, transformOrigin:'50% 55%'});
  const hero = gsap.timeline({scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom top',scrub:1}});
  hero.to('.hero-tooth',{rotationZ:18,rotationY:-13,rotationX:6,scale:1.14,y:80,ease:'none'},0)
      .to('.ring-a',{rotationZ:120,scale:1.16,ease:'none'},0)
      .to('.ring-b',{rotationZ:-90,scale:.9,ease:'none'},0)
      .to('.orbit-one',{rotation:16,y:-40,ease:'none'},0)
      .to('.orbit-two',{rotation:-24,y:36,ease:'none'},0)
      .to('.hero-copy',{y:-80,opacity:.28,ease:'none'},0)
      .to('.hero-side',{y:60,opacity:0,ease:'none'},0);

  if (matchMedia('(pointer:fine)').matches) {
    const tooth = document.querySelector('.hero-tooth');
    document.querySelector('.hero-stage')?.addEventListener('pointermove', e => {
      const r=e.currentTarget.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      gsap.to(tooth,{x:x*18,yPercent:y*3,rotationY:x*10,rotationX:y*-7,duration:.8,overwrite:'auto'});
    });
  }

  gsap.utils.toArray('.statement-row').forEach((row) => {
    gsap.from(row.children,{x:(j)=>j?80:-80,opacity:0,duration:1,stagger:.04,scrollTrigger:{trigger:row,start:'top 82%'}});
  });

  const anatomy = gsap.timeline({scrollTrigger:{trigger:'.precision',start:'top top',end:'+=165%',pin:true,scrub:1,anticipatePin:1}});
  anatomy.set('.anatomy-label',{opacity:0},0)
    .fromTo('.anatomy-crown',{y:130,scale:.94},{y:0,scale:1,ease:'none'},0)
    .fromTo('.anatomy-dentin',{y:30,scale:.96},{y:0,scale:1,ease:'none'},0)
    .fromTo('.anatomy-pulp',{y:-85,scale:.93},{y:0,scale:1,ease:'none'},0)
    .fromTo('.anatomy-root',{y:-150,scale:.94},{y:0,scale:1,ease:'none'},0)
    .to('.anatomy-crown',{y:-75,rotation:-2,ease:'none'},.46)
    .to('.anatomy-dentin',{y:-12,rotation:1.5,ease:'none'},.46)
    .to('.anatomy-pulp',{y:42,scale:1.04,ease:'none'},.46)
    .to('.anatomy-root',{y:112,rotation:-1,ease:'none'},.46)
    .to('.anatomy-label',{opacity:1,stagger:.06,duration:.18},.55)
    .to('.anatomy-stage',{rotationY:-3,rotationX:1,transformPerspective:1200,ease:'none'},0);

  const implant = gsap.timeline({scrollTrigger:{trigger:'.implant',start:'top top',end:'+=165%',pin:true,scrub:1,anticipatePin:1}});
  implant.set('.implant-label',{opacity:0},0)
    .fromTo('.implant-crown',{y:-220,rotation:10,scale:.94},{y:155,rotation:0,scale:1,ease:'none'},0)
    .fromTo('.implant-abutment',{y:-55,rotation:-9,scale:.94},{y:58,rotation:0,scale:1,ease:'none'},0)
    .fromTo('.implant-screw',{y:220,rotation:12,scale:.94},{y:-28,rotation:0,scale:1,ease:'none'},0)
    .to('.implant-group',{rotationY:8,rotationZ:1.5,transformPerspective:1000,ease:'none'},.55)
    .to('.implant-label',{opacity:1,stagger:.08,duration:.2},.52);

  const align = gsap.timeline({scrollTrigger:{trigger:'.align-section',start:'top 80%',end:'bottom top',scrub:1}});
  align.fromTo('.aligner',{x:160,y:80,rotationZ:14,rotationY:-18,rotationX:12,scale:.82},{x:-35,y:-35,rotationZ:-6,rotationY:16,rotationX:-8,scale:1.06,ease:'none'})
       .to('.align-ring',{rotationZ:120,scale:1.15,ease:'none'},0);

  gsap.to('.smile-media img',{scale:1.16,xPercent:-3,scrollTrigger:{trigger:'.smile-scene',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.fromTo('.smile-scan',{top:'-10%'},{top:'105%',ease:'none',scrollTrigger:{trigger:'.smile-scene',start:'top 70%',end:'bottom 30%',scrub:1}});
  gsap.from('.smile-copy h2',{y:90,opacity:0,duration:1,scrollTrigger:{trigger:'.smile-copy',start:'top 78%'}});

  gsap.from('.contact h2',{y:120,opacity:0,duration:1.15,scrollTrigger:{trigger:'.contact',start:'top 70%'}});
  addEventListener('load',()=>ScrollTrigger.refresh());
  addEventListener('resize',()=>ScrollTrigger.refresh());
})();