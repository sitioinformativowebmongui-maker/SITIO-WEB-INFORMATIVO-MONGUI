/* ===== MOTOR DINÁMICO MONGUÍ v2: progreso, reveal, visor, pestañas, filtro, modal ===== */
(function(){
"use strict";
function norm(s){return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
var SEL_SEC="main section, body > section";

/* 1. Barra de progreso de lectura */
var prog=document.createElement("div");prog.id="progreso";document.body.appendChild(prog);
function barra(){var h=document.documentElement;var max=h.scrollHeight-h.clientHeight;prog.style.width=(max>0?(h.scrollTop/max*100):0)+"%";}
window.addEventListener("scroll",barra,{passive:true});barra();

/* 2. Aparición suave al hacer scroll */
var revs=document.querySelectorAll(SEL_SEC+", main .card, main .tarjeta, main .card-lugar");
if("IntersectionObserver" in window){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("visto");io.unobserve(e.target);}});},{threshold:.08});
revs.forEach(function(el){el.classList.add("revelar");io.observe(el);});
}

/* 3. Botón flotante para subir (si la página no tiene uno) */
if(!document.getElementById("subir")){
var sub=document.createElement("button");sub.id="subirGen";sub.title="Volver arriba";sub.textContent="↑";
sub.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"});});
document.body.appendChild(sub);
window.addEventListener("scroll",function(){sub.style.display=window.scrollY>500?"block":"none";},{passive:true});
}

/* 4. Visor de fotos universal (la galería ya tiene el suyo) */
if(!document.getElementById("galeriaGrid")){
var imgs=Array.prototype.filter.call(document.querySelectorAll("main img, body > section img"),function(im){return !im.closest("a")&&im.getAttribute("src");});
if(imgs.length){
var vis=document.createElement("div");vis.id="visorGen";vis.setAttribute("role","dialog");vis.setAttribute("aria-modal","true");
vis.innerHTML='<button id="vgX" aria-label="Cerrar">✕</button><button id="vgP" class="vgF" aria-label="Anterior">←</button><figure><img id="vgI" alt=""><figcaption id="vgT"></figcaption><div id="vgN"></div></figure><button id="vgS" class="vgF" aria-label="Siguiente">→</button>';
document.body.appendChild(vis);
var vi=vis.querySelector("#vgI"),vt=vis.querySelector("#vgT"),vn=vis.querySelector("#vgN"),idx=0,lista=[];
function abrir(i){if(!lista.length)return;idx=(i+lista.length)%lista.length;var im=lista[idx];vi.src=im.src;vi.alt=im.alt||"Foto de Monguí";vt.textContent=im.alt||"";vn.textContent=(idx+1)+" / "+lista.length;vis.classList.add("abierto");document.body.style.overflow="hidden";}
function cerrar(){vis.classList.remove("abierto");document.body.style.overflow="";}
imgs.forEach(function(im){im.style.cursor="zoom-in";im.title="Clic para ampliar 🔍";});
document.addEventListener("click",function(e){var im=e.target&&e.target.closest?e.target.closest("main img, body > section img"):null;if(!im||im.closest("a")||!im.getAttribute("src"))return;lista=Array.prototype.filter.call(document.querySelectorAll("main img, body > section img"),function(x){return !x.closest("a")&&x.getAttribute("src")&&x.offsetParent!==null;});var i=lista.indexOf(im);abrir(i<0?0:i);});
vis.querySelector("#vgX").addEventListener("click",cerrar);
vis.querySelector("#vgP").addEventListener("click",function(e){e.stopPropagation();abrir(idx-1);});
vis.querySelector("#vgS").addEventListener("click",function(e){e.stopPropagation();abrir(idx+1);});
vis.addEventListener("click",function(e){if(e.target===vis)cerrar();});
document.addEventListener("keydown",function(e){if(!vis.classList.contains("abierto"))return;if(e.key==="Escape")cerrar();if(e.key==="ArrowLeft")abrir(idx-1);if(e.key==="ArrowRight")abrir(idx+1);});
}}

/* 5. Historia y Turismo: pestañas animadas por sección */
var tieneFiltro=document.getElementById("filtros")||document.getElementById("pildoras")||document.getElementById("chips");
var h3s=Array.prototype.slice.call(document.querySelectorAll("main section h3, body > section h3"));
var h2s=Array.prototype.slice.call(document.querySelectorAll("main section h2, body > section h2"));
var esTabs=/historia|turismo/i.test(document.title);
if(!tieneFiltro&&esTabs&&h2s.length>=2){
var tabs=document.createElement("div");tabs.className="tabs-mongui";
tabs.innerHTML="<span>📑 Elige una sección:</span>";
var btns=[];
function mostrar(i,saltar){h2s.forEach(function(h,j){var sec=h.closest("section");if(!sec)return;sec.style.display=(i===j)?"":"none";if(i===j){sec.classList.remove("sec-anim");void sec.offsetWidth;sec.classList.add("sec-anim");}});btns.forEach(function(b,j){b.classList.toggle("act",i===j);});if(saltar!==false){var y=tabs.getBoundingClientRect().top+window.scrollY-90;window.scrollTo({top:y,behavior:"smooth"});}}
h2s.forEach(function(h,i){var b=document.createElement("button");b.textContent=h.textContent;if(i===0)b.classList.add("act");b.addEventListener("click",function(){mostrar(i);});tabs.appendChild(b);btns.push(b);});
var primera=h2s[0].closest("section");
primera.parentNode.insertBefore(tabs,primera);
mostrar(0,false);
}else if(!tieneFiltro&&h3s.length>=4){
/* 6. Cultura: filtro de celebraciones + fiesta al azar */
h3s.forEach(function(h){var sec=h.closest("section");if(!sec||sec.dataset.cat)return;var t=norm(sec.textContent);sec.dataset.cat=(/semana santa|patronal|virgen|pascual|carmen|santa ana|pena de oti|cascada/.test(t))?"religiosas":"tradicionales";});
var secs=Array.prototype.slice.call(document.querySelectorAll("main section[data-cat], body > section[data-cat]"));
if(secs.length){
var bar=document.createElement("div");bar.className="filtro-mongui";
bar.innerHTML="<span>🎭 Filtrar celebraciones:</span>";
var info=document.createElement("p");info.className="toc-info";
function pintar(f){var n=0;secs.forEach(function(s){var ok=(f==="todas"||s.dataset.cat===f);s.style.display=ok?"":"none";if(ok)n++;});info.textContent=n+(n===1?" celebración visible":" celebraciones visibles");}
[["todas","Todas"],["religiosas","⛪ Religiosas"],["tradicionales","🎉 Tradicionales"]].forEach(function(op,i){
var b=document.createElement("button");b.textContent=op[1];if(i===0)b.classList.add("act");b.dataset.f=op[0];
b.addEventListener("click",function(){var bs=bar.querySelectorAll("button");for(var k=0;k<bs.length;k++)bs[k].classList.remove("act");b.classList.add("act");pintar(b.dataset.f);});
bar.appendChild(b);});
var azar=document.createElement("button");azar.textContent="🎲 Al azar";
azar.addEventListener("click",function(){var vis2=secs.filter(function(s){return s.style.display!=="none";});if(!vis2.length)return;var s=vis2[Math.floor(Math.random()*vis2.length)];s.scrollIntoView({behavior:"smooth",block:"center"});s.classList.remove("destello");void s.offsetWidth;s.classList.add("destello");setTimeout(function(){s.classList.remove("destello");},2200);});
bar.appendChild(azar);
var p0=secs[0];p0.parentNode.insertBefore(bar,p0);bar.parentNode.insertBefore(info,p0);pintar("todas");
}
}else if(!tieneFiltro&&h2s.length>=3){
/* 7. Otras páginas: navegador de secciones con resaltado */
var toc=document.createElement("nav");toc.className="toc-mongui";toc.setAttribute("aria-label","Navegación de secciones");
toc.innerHTML="<span>🧭 Explora esta página:</span>";
var links=[];
h2s.forEach(function(h,i){var sec=h.closest("section")||h.parentNode;var id="sec-mongui-"+i;sec.id=id;var a=document.createElement("a");a.href="#"+id;a.textContent=h.textContent;toc.appendChild(a);links.push(a);
a.addEventListener("click",function(e){e.preventDefault();document.getElementById(id).scrollIntoView({behavior:"smooth"});});});
var main=document.querySelector("main");var refNav=document.querySelector("nav");
if(main)main.insertBefore(toc,main.firstChild);
else if(refNav)refNav.parentNode.insertBefore(toc,refNav.nextSibling);
if("IntersectionObserver" in window){var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id=e.target.id;links.forEach(function(a){a.classList.toggle("act",a.getAttribute("href")==="#"+id);});}});},{rootMargin:"-40% 0px -55% 0px"});h2s.forEach(function(h){var sec=h.closest("section")||h.parentNode;if(sec.id)spy.observe(sec);});}
}

/* 8. Modal de reserva (botón Reservar visita turística) */
var res=document.querySelector('.boton[href="#"]');
if(res){res.addEventListener("click",function(e){e.preventDefault();
if(document.querySelector(".modal-mongui"))return;
var m=document.createElement("div");m.className="modal-mongui";
m.innerHTML='<div class="modal-caja"><h3>Reservar visita turística 🏔️</h3><label>Nombre<input id="mN" type="text" placeholder="Tu nombre"></label><label>Fecha<input id="mF" type="date"></label><label>Personas<input id="mP" type="number" min="1" value="2"></label><div class="modal-btns"><button id="mOk">Confirmar</button><button id="mNo">Cancelar</button></div><p id="mMsg"></p></div>';
document.body.appendChild(m);
m.querySelector("#mNo").addEventListener("click",function(){m.remove();});
m.addEventListener("click",function(ev){if(ev.target===m)m.remove();});
m.querySelector("#mOk").addEventListener("click",function(){var n=m.querySelector("#mN").value||"viajero";var f=m.querySelector("#mF").value||"pronto";m.querySelector("#mMsg").textContent="¡Gracias, "+n+"! Te esperamos el "+f+" en Monguí. 🎉";});});}

/* 9. Slider de fondo en la portada (solo donde exista) */
var slider=document.getElementById("sliderFondo");
if(slider){
var fotos=["imagenes/WhatsApp Image 2026-10-03 at 11.31.24 AM.jpeg","imagenes/WhatsApp Image 2026-10-03 at 11.31.25 AM.jpeg","imagenes/WhatsApp Image 2026-10-03 at 11.31.26 AM.jpeg","imagenes/WhatsApp Image 2026-10-03 at 11.31.27 AM.jpeg","imagenes/WhatsApp Image 2026-10-03 at 11.31.24 AM (1).jpeg"];
fotos.forEach(function(s){var p=new Image();p.src=s;});
var cap=0;
fotos.forEach(function(s,i){var im=document.createElement("img");im.src=s;im.alt="";if(i===0)im.classList.add("ver");slider.appendChild(im);});
var slides=slider.querySelectorAll("img");
if(slides.length>1){setInterval(function(){slides[cap].classList.remove("ver");cap=(cap+1)%slides.length;slides[cap].classList.add("ver");},5000);}
}
})();
