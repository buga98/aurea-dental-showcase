(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;

  const teethRow = document.querySelector('#teeth-row');
  if (teethRow) {
    const setup = [
      [-18, 9, -10],[-13, 4, 7],[-9, 8, -5],[-5, 1, 6],[-2, 6, -3],[0, 0, 2],
      [0, 0, -2],[2, 5, 4],[6, 1, -7],[10, 7, 5],[14, 3, -8],[18, 10, 9]
    ];
    teethRow.innerHTML = setup.map((v,i) => `<i class="smile-tooth" data-x="${v[0]}" data-y="${v[1]}" data-r="${v[2]}" aria-hidden="true"></i>`).join('');
  }

  if (finePointer && !reduced) {
    const orb = document.querySelector('.cursor-orb');
    addEventListener('pointermove', e => {
      if (!orb) return;
      orb.style.opacity = '1';
      orb.style.left = `${e.clientX}px`;
      orb.style.top = `${e.clientY}px`;
    }, { passive:true });
  }

  if (!window.gsap || !window.ScrollTrigger || reduced) {
    document.documentElement.classList.add('motion-fallback');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease:'power3.out' });

  const heroTl = gsap.timeline({
    scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:1.1 }
  });
  heroTl
    .to('.hero-word-a',{ yPercent:-42, scale:1.08 },0)
    .to('.hero-word-b',{ yPercent:24, scale:1.05 },0)
    .to('#hero-tooth-wrap',{ yPercent:36, rotate:130, scale:.82 },0)
    .to('.ring-one',{ scale:1.25, rotate:90 },0)
    .to('.ring-two',{ scale:.84, rotate:-120 },0)
    .to('.hero-copy',{ yPercent:-28, opacity:.16 },0)
    .to('.hero-meta',{ opacity:0, y:-30 },0);

  if (finePointer) {
    const tooth = document.querySelector('#hero-tooth-wrap');
    addEventListener('pointermove', e => {
      const nx = (e.clientX / innerWidth - .5) * 2;
      const ny = (e.clientY / innerHeight - .5) * 2;
      gsap.to(tooth,{ rotateY:nx*8, rotateX:ny*-6, duration:.8, overwrite:'auto' });
    }, { passive:true });
  }

  gsap.from('.manifesto-line span',{ xPercent:-16, opacity:0, stagger:.12, duration:1.1, scrollTrigger:{trigger:'.manifesto',start:'top 65%'} });
  gsap.from('.manifesto-line b',{ xPercent:18, opacity:0, stagger:.12, duration:1.1, scrollTrigger:{trigger:'.manifesto',start:'top 65%'} });
  gsap.to('.orbit-copy',{ xPercent:-28, scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1} });

  const desktop = matchMedia('(min-width: 761px)');
  if (desktop.matches) {
    const track = document.querySelector('.lineup-track');
    const viewport = document.querySelector('.lineup-viewport');
    const getX = () => -(track.scrollWidth - innerWidth + innerWidth*.03);
    const lineupTween = gsap.to(track,{
      x:getX,
      ease:'none',
      scrollTrigger:{
        trigger:viewport,
        start:'top top',
        end:()=>`+=${Math.max(track.scrollWidth-innerWidth, innerWidth)}`,
        pin:true,
        scrub:1,
        invalidateOnRefresh:true
      }
    });
    gsap.utils.toArray('.treatment-card').forEach((card,i) => {
      gsap.fromTo(card,{ rotate:i===0?-4:i===1?3:-2, scale:.93 },{
        rotate:0, scale:1, ease:'none',
        scrollTrigger:{ trigger:card, containerAnimation:lineupTween, start:'left 92%', end:'center center', scrub:true }
      });
    });
  } else {
    gsap.utils.toArray('.treatment-card').forEach(card => gsap.from(card,{ y:70, rotate:3, opacity:0, duration:1, scrollTrigger:{trigger:card,start:'top 82%'} }));
  }

  const anatomy = gsap.timeline({
    scrollTrigger:{ trigger:'.anatomy', start:'top top', end:'+=150%', pin:true, scrub:1.05 }
  });
  anatomy
    .from('.anatomy-copy h2',{ xPercent:-10, opacity:.2 },0)
    .to('[data-layer="enamel"]',{ y:-155, rotate:-5 },0)
    .to('[data-layer="dentin"]',{ y:-28, rotate:4 },0)
    .to('[data-layer="pulp"]',{ y:42, scale:1.08 },0)
    .to('[data-layer="root"]',{ y:160, rotate:-2 },0)
    .to('.layer-label',{ opacity:1, stagger:.08 },.18)
    .to('.anatomy-glow',{ scale:1.35, opacity:.7 },0)
    .to('.anatomy-stage',{ rotateY:-8, rotateX:3 },0);

  const implantTl = gsap.timeline({
    scrollTrigger:{ trigger:'.implant', start:'top top', end:'+=155%', pin:true, scrub:1 }
  });
  implantTl
    .from('.implant-crown',{ y:-320, rotate:18, opacity:.15 },0)
    .from('.implant-abutment',{ y:-120, rotate:-12, opacity:.2 },0)
    .from('.implant-screw',{ y:340, rotate:12, opacity:.16 },0)
    .from('.bone-plane',{ y:170, opacity:.1 },0)
    .from('.implant-heading',{ xPercent:-10, opacity:.2 },0)
    .to('.implant-crown',{ y:30 },.65)
    .to('.implant-abutment',{ y:10 },.65)
    .to('.implant-screw',{ y:-8 },.65)
    .to('.implant-part>span',{ opacity:1 },.42);

  const alignTl = gsap.timeline({
    scrollTrigger:{ trigger:'.align-scene', start:'top top', end:'+=130%', pin:true, scrub:1 }
  });
  alignTl
    .from('.case-wrap',{ xPercent:52, yPercent:20, rotateZ:14, scale:.72 },0)
    .to('.case-lid',{ rotateX:-112, y:-40, z:30, transformOrigin:'50% 100%' },.28)
    .to('.case-wrap',{ rotateZ:4, rotateY:8, scale:1.02 },.28)
    .from('.align-stamp',{ scale:2.2, rotate:-35, opacity:0 },.4)
    .to('.align-copy',{ yPercent:-8 },0);

  const smileTeeth = gsap.utils.toArray('.smile-tooth');
  smileTeeth.forEach(el => {
    gsap.set(el,{ x:Number(el.dataset.x), y:Number(el.dataset.y), rotate:Number(el.dataset.r) });
  });
  const smileTl = gsap.timeline({
    scrollTrigger:{ trigger:'.smile', start:'top 20%', end:'bottom bottom', scrub:1 }
  });
  smileTl
    .to(smileTeeth,{ x:0, y:0, rotate:0, stagger:.018, ease:'power2.inOut' },0)
    .fromTo('.smile-scan',{ y:-180 },{ y:380, ease:'none' },0)
    .to('.mouth-stage',{ scale:1.035 },0)
    .from('.smile-head',{ xPercent:-8 },0);

  gsap.from('.finale h2',{ y:130, opacity:0, duration:1.25, scrollTrigger:{trigger:'.finale',start:'top 62%'} });
  gsap.from('.finale-cta',{ y:50, opacity:0, duration:.9, scrollTrigger:{trigger:'.finale',start:'top 48%'} });
  gsap.to('.finale-ring',{ scale:1.45, scrollTrigger:{trigger:'.finale',start:'top bottom',end:'bottom top',scrub:1} });

  gsap.utils.toArray('.section-code').forEach(code => gsap.from(code,{ y:16, opacity:0, duration:.65, scrollTrigger:{trigger:code,start:'top 88%'} }));

  addEventListener('resize', () => ScrollTrigger.refresh());
})();
