import * as THREE from 'three';

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = matchMedia('(min-width: 901px)').matches;
if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

const loader = document.querySelector('.loader');
window.addEventListener('load', () => setTimeout(() => loader?.classList.add('hide'), 280));
setTimeout(() => loader?.classList.add('hide'), 2200);

const nav = document.querySelector('.site-nav');
const menuBtn = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
menuBtn?.addEventListener('click', () => {
  const open = mobileNav?.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(!!open));
  mobileNav?.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
});
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open'); menuBtn?.setAttribute('aria-expanded','false'); document.body.style.overflow='';
}));

addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', scrollY > 30);
  const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  document.querySelector('.progress i')?.style.setProperty('transform', `scaleX(${scrollY/max})`);
}, {passive:true});

if (window.Lenis && !reduced && desktop) {
  const lenis = new Lenis({ duration: 1.0, smoothWheel: true, wheelMultiplier: .9 });
  lenis.on('scroll', ScrollTrigger?.update);
  gsap?.ticker.add(t => lenis.raf(t * 1000));
  gsap?.ticker.lagSmoothing(0);
}

function rendererFor(canvas, dark = true) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = dark ? 1.28 : 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
  camera.position.set(0, .1, 7);
  const hemi = new THREE.HemisphereLight(0xfff4dd, dark ? 0x16110d : 0x777066, dark ? 1.2 : 1.7);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffe1a6, dark ? 5.7 : 4.2); key.position.set(-3.5, 5, 5); key.castShadow = true; scene.add(key);
  const rim = new THREE.PointLight(0x9ebaff, dark ? 3.6 : 1.6, 12); rim.position.set(3.8, 2.2, -2.5); scene.add(rim);
  const warm = new THREE.PointLight(0xd8a85e, 2.4, 10); warm.position.set(-3, -2, 3); scene.add(warm);
  const group = new THREE.Group(); scene.add(group);
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width/r.height; camera.updateProjectionMatrix();
  };
  resize();
  return {renderer, scene, camera, group, resize};
}

function enamelMaterial({transparent=false, opacity=1}={}) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xf7f0df, roughness: .16, metalness: 0, clearcoat: 1, clearcoatRoughness: .08,
    transmission: transparent ? .18 : .07, thickness: 1.0, ior: 1.43,
    transparent, opacity, specularIntensity: 1.25, sheen: .18, sheenColor: new THREE.Color(0xffe7bd)
  });
}
function crownGeometry() {
  const g = new THREE.SphereGeometry(1, 72, 64);
  const p = g.attributes.position;
  for (let i=0;i<p.count;i++) {
    let x=p.getX(i), y=p.getY(i), z=p.getZ(i);
    const a=Math.atan2(z,x);
    const upper=Math.max(0,(y+.1)/1.1);
    const lobes=1 + .07*Math.cos(a*4)*upper + .025*Math.cos(a*8)*upper;
    const taper = y < -.15 ? 1 - Math.min(.24,(-y-.15)*.18) : 1;
    x *= 1.34 * lobes * taper;
    z *= 1.03 * lobes * taper;
    y *= 1.12;
    if (y>.45) y += .05*Math.cos(a*4);
    p.setXYZ(i,x,y,z);
  }
  g.computeVertexNormals();
  return g;
}
function rootMesh(mat, side=1, scale=.98) {
  const g = new THREE.CylinderGeometry(.11,.33,2.25,48,12,false);
  const m = new THREE.Mesh(g, mat);
  m.position.set(side*.39,-1.72,0);
  m.rotation.z = side * -.13;
  m.rotation.x = side * .035;
  m.scale.set(scale,1,scale);
  m.castShadow = m.receiveShadow = true;
  return m;
}
function createTooth(mat=enamelMaterial()) {
  const grp = new THREE.Group();
  const crown = new THREE.Mesh(crownGeometry(), mat); crown.position.y=.05; crown.castShadow=crown.receiveShadow=true;
  grp.add(crown, rootMesh(mat,-1), rootMesh(mat,1));
  return grp;
}
function floorDisc(color=0x1a1713, y=-3.15) {
  const d = new THREE.Mesh(new THREE.CylinderGeometry(2.05,2.18,.18,96), new THREE.MeshPhysicalMaterial({color,roughness:.22,metalness:.1,clearcoat:.7}));
  d.position.y=y; d.receiveShadow=true; return d;
}
function addHalo(scene, radius=2.8, color=0xd4a35e) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius,.012,8,160), new THREE.MeshBasicMaterial({color,transparent:true,opacity:.62}));
  ring.rotation.x=Math.PI/2; ring.position.z=-1.2; scene.add(ring); return ring;
}

const heroCanvas = document.querySelector('#hero3d');
const heroCtx = rendererFor(heroCanvas, true);
const heroTooth = createTooth(); heroTooth.scale.setScalar(1.34); heroCtx.group.add(heroTooth);
heroCtx.group.add(floorDisc(0x15110c,-3.0));
const heroHalo = addHalo(heroCtx.scene, 3.05);
heroCtx.camera.position.set(.35,.05,7.4);
let pointerX=0,pointerY=0, heroP=0;
addEventListener('pointermove', e => { pointerX=(e.clientX/innerWidth-.5)*2; pointerY=(e.clientY/innerHeight-.5)*2; }, {passive:true});

if (gsap && ScrollTrigger && !reduced) {
  ScrollTrigger.create({ trigger:'#hero', start:'top top', end:'bottom bottom', onUpdate:self=>{heroP=self.progress;} });
  gsap.to('.hero-title',{yPercent:-18,opacity:.35,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom bottom',scrub:1}});
  gsap.to('.hero-backdrop',{scale:1.14,ease:'none',scrollTrigger:{trigger:'#hero',start:'top top',end:'bottom bottom',scrub:1}});
  gsap.from('.manifesto-row',{y:70,opacity:0,stagger:.12,duration:1.1,scrollTrigger:{trigger:'.manifesto',start:'top 65%'}});
}

if (gsap && ScrollTrigger && !reduced && desktop) {
  const track=document.querySelector('.treatments-track');
  const panels=gsap.utils.toArray('.treatment-panel');
  const maxX=()=>Math.max(0,track.scrollWidth-innerWidth);
  const horizontal=gsap.to(track,{x:()=>-maxX(),ease:'none',scrollTrigger:{trigger:'.treatments-viewport',start:'top top',end:()=>`+=${maxX()+innerWidth*.55}`,pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true}});
  panels.forEach(panel=>{
    gsap.fromTo(panel.querySelector('img'),{scale:1.14},{scale:1.02,ease:'none',scrollTrigger:{trigger:panel,containerAnimation:horizontal,start:'left right',end:'right left',scrub:true}});
    gsap.from(panel.querySelector('.panel-copy'),{x:90,opacity:.25,scrollTrigger:{trigger:panel,containerAnimation:horizontal,start:'left 82%',end:'center center',scrub:true}});
  });
}

const anatomyCanvas=document.querySelector('#anatomy3d');
const anatomyCtx=rendererFor(anatomyCanvas,true);
anatomyCtx.camera.position.set(.4,.15,7.4);
addHalo(anatomyCtx.scene,3.15,0x8aa5ff);
const enamel = createTooth(enamelMaterial({transparent:true,opacity:.58})); enamel.scale.setScalar(1.02);
const dentinMat=new THREE.MeshPhysicalMaterial({color:0xe0ad5d,roughness:.32,clearcoat:.25,transparent:true,opacity:.92});
const dentin=createTooth(dentinMat); dentin.scale.setScalar(.82);
const pulpMat=new THREE.MeshPhysicalMaterial({color:0xb3322f,emissive:0x3a0504,emissiveIntensity:.35,roughness:.42});
const pulp=new THREE.Group();
const pulpCore=new THREE.Mesh(new THREE.CapsuleGeometry(.22,1.0,10,28),pulpMat); pulpCore.position.y=-.25; pulp.add(pulpCore);
for(const side of [-1,1]){
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,-.6,0),new THREE.Vector3(side*.13,-1.4,0),new THREE.Vector3(side*.34,-2.4,side*.04)]);
  pulp.add(new THREE.Mesh(new THREE.TubeGeometry(curve,48,.055,10,false),pulpMat));
}
const rootOnly=new THREE.Group(); rootOnly.add(rootMesh(enamelMaterial(),-1),rootMesh(enamelMaterial(),1));
[...enamel.children].slice(1).forEach(m=>m.visible=false);
[...dentin.children].slice(1).forEach(m=>m.visible=false);
anatomyCtx.group.add(enamel,dentin,pulp,rootOnly);
let anatomyP=0;
if (ScrollTrigger && !reduced) {
  ScrollTrigger.create({trigger:'.anatomy-scene',start:'top top',end:'bottom bottom',onUpdate:s=>{anatomyP=s.progress;}});
  gsap.to('.anatomy-labels>div',{opacity:1,y:0,stagger:.09,ease:'none',scrollTrigger:{trigger:'.anatomy-scene',start:'top 5%',end:'+=80%',scrub:1}});
  gsap.to('.anatomy-copy',{yPercent:-10,opacity:.65,ease:'none',scrollTrigger:{trigger:'.anatomy-scene',start:'top top',end:'bottom bottom',scrub:1}});
}

const implantCanvas=document.querySelector('#implant3d');
const implantCtx=rendererFor(implantCanvas,false);
implantCtx.camera.position.set(.35,.1,7.8);
const crown=createTooth(enamelMaterial()); crown.children.slice(1).forEach(x=>x.visible=false); crown.scale.setScalar(.83);
const metal=new THREE.MeshPhysicalMaterial({color:0x9fa7ae,metalness:.9,roughness:.22,clearcoat:.45});
const screw=new THREE.Group();
const core=new THREE.Mesh(new THREE.CylinderGeometry(.24,.33,2.65,48),metal); core.castShadow=true; screw.add(core);
class Helix extends THREE.Curve{getPoint(t){const turns=9,a=t*turns*Math.PI*2,r=.38;return new THREE.Vector3(Math.cos(a)*r,-1.3+t*2.6,Math.sin(a)*r)}}
const thread=new THREE.Mesh(new THREE.TubeGeometry(new Helix(),260,.052,8,false),metal); thread.castShadow=true; screw.add(thread);
const abutment=new THREE.Mesh(new THREE.CylinderGeometry(.34,.52,.78,48),metal); abutment.castShadow=true;
const bone=new THREE.Mesh(new THREE.CylinderGeometry(2.25,2.35,.45,96),new THREE.MeshPhysicalMaterial({color:0xdfc6a0,roughness:.68})); bone.position.y=-2.1; bone.receiveShadow=true;
implantCtx.group.add(crown,abutment,screw,bone); addHalo(implantCtx.scene,3.15,0xb08752);
let implantP=0;
if (ScrollTrigger && !reduced) {
  ScrollTrigger.create({trigger:'.implant-scene',start:'top top',end:'bottom bottom',onUpdate:s=>{implantP=s.progress;}});
  gsap.from('.implant-steps span',{x:30,opacity:0,stagger:.12,scrollTrigger:{trigger:'.implant-scene',start:'top 5%',end:'+=55%',scrub:1}});
  gsap.to('.implant-copy',{yPercent:-10,opacity:.72,ease:'none',scrollTrigger:{trigger:'.implant-scene',start:'top top',end:'bottom bottom',scrub:1}});
}

if (gsap && ScrollTrigger && !reduced) {
  gsap.fromTo('.aligner-image',{xPercent:22,rotate:4,scale:.92},{xPercent:0,rotate:0,scale:1,ease:'none',scrollTrigger:{trigger:'.aligner-scene',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.aligner-orbit',{xPercent:-22,ease:'none',scrollTrigger:{trigger:'.aligner-scene',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.from('.aligner-copy',{y:70,opacity:0,duration:1,scrollTrigger:{trigger:'.aligner-scene',start:'top 64%'}});
  gsap.to('.smile-sticky img',{scale:1.12,ease:'none',scrollTrigger:{trigger:'.smile-scene',start:'top top',end:'bottom bottom',scrub:1}});
  gsap.fromTo('.scan-line',{top:'-5%'},{top:'94%',ease:'none',scrollTrigger:{trigger:'.smile-scene',start:'top top',end:'bottom bottom',scrub:1}});
  gsap.to('.smile-copy',{yPercent:-18,ease:'none',scrollTrigger:{trigger:'.smile-scene',start:'top top',end:'bottom bottom',scrub:1}});
  gsap.from('.contact-copy h2',{y:100,opacity:0,duration:1.15,scrollTrigger:{trigger:'.contact',start:'top 62%'}});
}

function lerp(a,b,t){return a+(b-a)*t}
let clock=new THREE.Clock();
function animate(){
  const t=clock.getElapsedTime();
  heroTooth.rotation.y = heroP*Math.PI*2.25 + pointerX*.12;
  heroTooth.rotation.x = heroP*.55 + pointerY*.06;
  heroTooth.position.y = Math.sin(t*.8)*.04 + lerp(.1,-.2,heroP);
  heroTooth.scale.setScalar(1.34 + heroP*.12);
  heroHalo.rotation.z = t*.06 + heroP*.8;
  heroCtx.camera.position.z = lerp(7.4,6.15,heroP);
  heroCtx.renderer.render(heroCtx.scene,heroCtx.camera);

  anatomyCtx.group.rotation.y = anatomyP*.78 + Math.sin(t*.35)*.04;
  anatomyCtx.group.rotation.x = -.06 + anatomyP*.09;
  enamel.position.y = lerp(.45,2.65,anatomyP); enamel.rotation.z = lerp(0,-.15,anatomyP);
  dentin.position.y = lerp(.25,.55,anatomyP); dentin.rotation.z = lerp(0,.1,anatomyP);
  pulp.position.y = lerp(-.05,-1.15,anatomyP); pulp.rotation.y = anatomyP*.6;
  rootOnly.position.y = lerp(-.05,-2.65,anatomyP); rootOnly.rotation.z = lerp(0,-.07,anatomyP);
  anatomyCtx.camera.position.z = lerp(7.4,6.25,anatomyP);
  anatomyCtx.renderer.render(anatomyCtx.scene,anatomyCtx.camera);

  const q=Math.min(1,Math.max(0,implantP*1.08));
  crown.position.y=lerp(3.65,1.18,q); crown.rotation.y=lerp(-.35,0,q); crown.rotation.z=lerp(.18,0,q);
  abutment.position.y=lerp(1.65,.15,q); abutment.rotation.y=lerp(.6,0,q);
  screw.position.y=lerp(-4.1,-1.15,q); screw.rotation.y=lerp(-Math.PI*7,0,q);
  implantCtx.group.rotation.y = .05 + Math.sin(t*.28)*.04;
  implantCtx.camera.position.z=lerp(7.8,6.65,q);
  implantCtx.renderer.render(implantCtx.scene,implantCtx.camera);
  requestAnimationFrame(animate);
}
animate();

const resizers=[heroCtx,anatomyCtx,implantCtx];
addEventListener('resize',()=>{resizers.forEach(x=>x.resize());ScrollTrigger?.refresh();},{passive:true});
