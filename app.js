(() => {
  const hydrateAssets = async () => {
    const imgs = [...document.querySelectorAll('img[data-asset]')];
    const cache = new Map();
    await Promise.all(imgs.map(async img => {
      const name = img.dataset.asset;
      const parts = Number(img.dataset.parts || 1);
      try {
        let src = cache.get(name);
        if (!src) {
          const chunks = await Promise.all(Array.from({length:parts}, (_,i) => fetch(`assets-b64/${name}.${i+1}.txt`, {cache:'force-cache'}).then(r => { if(!r.ok) throw new Error(`${name}.${i+1}`); return r.text(); })));
          src = `data:image/webp;base64,${chunks.join('')}`;
          cache.set(name, src);
        }
        img.src = src;
        img.classList.add('asset-ready');
      } catch (err) { console.error('Asset load failed', name, err); }
    }));
    window.dispatchEvent(new Event('aurea-assets-ready'));
  };
  hydrateAssets();
})();

(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  menuBtn?.addEventListener('click', () => {
    const open = mobileNav?.classList.toggle('open');
    document.body.classList.toggle('menu-open', !!open);
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open'); document.body.classList.remove('menu-open');
  }));
  document.querySelector('.contact-form')?.addEventListener('submit', e => {
    e.preventDefault(); const b=e.currentTarget.querySelector('button'); const old=b.innerHTML; b.textContent='Upit je zabilježen · demo'; setTimeout(()=>b.innerHTML=old,1800);
  });

  if (!window.gsap || !window.ScrollTrigger || reduced) {
    addEventListener('scroll', () => {
      const max=document.documentElement.scrollHeight-innerHeight;
      document.querySelector('.progress span').style.width=`${max?scrollY/max*100:0}%`;
    }, {passive:true});
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({duration:1.05, smoothWheel:true, wheelMultiplier:.9});
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t*1000));
    gsap.ticker.lagSmoothing(0);
  }

  gsap.to('.progress span', {width:'100%', ease:'none', scrollTrigger:{start:0,end:'max',scrub:.15}});
  ScrollTrigger.create({start:20,onEnter:()=>document.querySelector('.topbar')?.classList.add('compact'),onLeaveBack:()=>document.querySelector('.topbar')?.classList.remove('compact')});

  const hero = gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'+=120%',pin:true,scrub:1}});
  hero.to('.hero-media img',{scale:1.28,yPercent:8,ease:'none'},0)
      .to('.line-a',{xPercent:-12,opacity:.18,ease:'none'},0)
      .to('.line-b',{xPercent:18,opacity:.1,ease:'none'},0)
      .to('.hero-bottom,.hero-kicker',{opacity:0,y:40,ease:'none'},0)
      .to('.hero-media',{filter:'brightness(.45)',ease:'none'},.5);

  gsap.from('.statement-copy span',{yPercent:120,opacity:0,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:'.statement',start:'top 65%',end:'center center',scrub:.6}});

  const track=document.querySelector('.lineup-track');
  const lineup=document.querySelector('.lineup');
  const lineupDistance=()=>Math.max(0,track.scrollWidth-innerWidth+innerWidth*.1);
  gsap.to(track,{x:()=>-lineupDistance(),ease:'none',scrollTrigger:{trigger:lineup,start:'top top',end:'bottom bottom',scrub:1,invalidateOnRefresh:true}});
  gsap.utils.toArray('.treatment-card').forEach(card=>{
    const img=card.querySelector('img');
    gsap.fromTo(img,{scale:1.16},{scale:1,ease:'none',scrollTrigger:{trigger:card,containerAnimation:null,start:'left right',end:'right left',scrub:true,horizontal:true}});
  });

  const anat=gsap.timeline({scrollTrigger:{trigger:'.anatomy',start:'top top',end:'bottom bottom',scrub:1}});
  anat.to('.anatomy-media img',{scale:1.02,yPercent:-2,ease:'none'},0)
      .to('.label-enamel',{opacity:1,y:-15,duration:.18},.12)
      .to('.label-dentin',{opacity:1,y:-15,duration:.18},.28)
      .to('.label-pulp',{opacity:1,y:-15,duration:.18},.45)
      .to('.label-root',{opacity:1,y:-15,duration:.18},.62)
      .to('.anatomy-title',{opacity:.15,xPercent:-10,ease:'none'},.54);

  gsap.fromTo('.implant-photo',{scale:1.25,yPercent:8},{scale:1,yPercent:-3,ease:'none',scrollTrigger:{trigger:'.implant-story',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.from('.specs>div',{x:-50,opacity:0,stagger:.12,scrollTrigger:{trigger:'.specs',start:'top 75%',toggleActions:'play none none reverse'}});

  const align=gsap.timeline({scrollTrigger:{trigger:'.aligner-story',start:'top top',end:'bottom bottom',scrub:1}});
  align.to('.aligner-media img',{scale:1.23,yPercent:5,ease:'none'},0)
       .fromTo('.aligner-type span:first-child',{xPercent:-15},{xPercent:4,ease:'none'},0)
       .fromTo('.aligner-type .outline',{xPercent:14},{xPercent:-4,ease:'none'},0)
       .fromTo('.aligner-copy',{opacity:0,y:90},{opacity:1,y:0,duration:.35},.3);

  const smile=gsap.timeline({scrollTrigger:{trigger:'.smile-story',start:'top top',end:'bottom top',scrub:1}});
  smile.to('.smile-photo img',{scale:1.17,xPercent:3,ease:'none'},0)
       .to('.scan-line',{y:()=>innerHeight*.78,ease:'none'},0)
       .fromTo('.smile-overlay',{xPercent:-8},{xPercent:3,ease:'none'},0);

  gsap.utils.toArray('.eyebrow').forEach(el=>gsap.from(el,{opacity:0,y:18,duration:.7,scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none reverse'}}));
  addEventListener('load',()=>ScrollTrigger.refresh());
  addEventListener('aurea-assets-ready',()=>ScrollTrigger.refresh());
})();
