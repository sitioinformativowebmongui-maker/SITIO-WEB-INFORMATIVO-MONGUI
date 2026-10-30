(function(){
document.querySelectorAll('a[href$=".html"]').forEach(function(a){
a.addEventListener('click',function(e){
var h=a.getAttribute('href');
if(!h||h.indexOf('http')===0||h.charAt(0)==='#')return;
e.preventDefault();
document.body.classList.add('saliendo');
setTimeout(function(){location.href=h;},450);
});
});
})();
