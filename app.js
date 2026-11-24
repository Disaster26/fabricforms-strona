(function(){
  var d=document,b=d.body;
  // naglowek po przewinieciu
  var top=d.querySelector('.top'),tik=false;
  function stan(){tik=false;if(top)top.classList.toggle('on',window.scrollY>40);}
  window.addEventListener('scroll',function(){if(!tik){tik=true;requestAnimationFrame(stan);}},{passive:true});
  requestAnimationFrame(stan);
  // menu telefonu
  var mb=d.querySelector('.menu-b');
  if(mb)mb.addEventListener('click',function(){var o=b.classList.toggle('menu-o');mb.setAttribute('aria-expanded',o?'true':'false');});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&b.classList.contains('menu-o')){b.classList.remove('menu-o');if(mb)mb.setAttribute('aria-expanded','false');}});

  // galerie w kartach: palec, mysz, strzalki
  var lb=d.getElementById('lb');
  d.querySelectorAll('[data-gal]').forEach(function(g){
    var t=g.querySelector('.gal-t'),n=t.children.length,c=g.querySelector('.gal-c');
    if(n<2){g.querySelectorAll('button').forEach(function(x){x.remove();});if(c)c.remove();}
    function ile(){return Math.round(t.scrollLeft/t.clientWidth);}
    function idz(i){t.scrollTo({left:Math.max(0,Math.min(n-1,i))*t.clientWidth,behavior:'smooth'});}
    var p=g.querySelector('.gp'),nx=g.querySelector('.gn');
    if(p)p.addEventListener('click',function(){idz(ile()-1);});
    if(nx)nx.addEventListener('click',function(){idz(ile()+1);});
    var rt=false;
    t.addEventListener('scroll',function(){if(!rt){rt=true;requestAnimationFrame(function(){rt=false;if(c)c.textContent=(ile()+1)+' / '+n;});}},{passive:true});
    t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(ile()+1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(ile()-1);}});
    var x0=0,s0=0,dr=false,ruch=0;
    t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dr=true;ruch=0;x0=e.clientX;s0=t.scrollLeft;t.classList.add('drag');});
    window.addEventListener('pointermove',function(e){if(!dr)return;var dx=e.clientX-x0;ruch=Math.max(ruch,Math.abs(dx));t.scrollLeft=s0-dx;});
    window.addEventListener('pointerup',function(){if(!dr)return;dr=false;t.classList.remove('drag');var w=t.clientWidth,i=Math.round(t.scrollLeft/w);if(ruch>40){i=t.scrollLeft>s0?Math.ceil(s0/w+.15):Math.floor(s0/w-.15);}idz(i);});
    t.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();ruch=0;return;}var f=e.target.closest('figure');if(f&&lb)otworz(t,[].indexOf.call(t.children,f));},true);
  });

  // powiekszenie zdjec
  var lt,lc,ostatni;
  function otworz(t,i){
    ostatni=d.activeElement;
    lt=lb.querySelector('.lb-t');lc=lb.querySelector('.lb-c');lt.innerHTML='';
    [].forEach.call(t.querySelectorAll('img'),function(im){var f=d.createElement('figure'),m=d.createElement('img');m.src=im.getAttribute('data-full');m.alt=im.alt;m.decoding='async';f.appendChild(m);lt.appendChild(f);});
    lb.hidden=false;b.style.overflow='hidden';
    requestAnimationFrame(function(){lt.scrollLeft=i*lt.clientWidth;licz();lb.querySelector('.lx').focus();});
  }
  function licz(){if(lc&&lt)lc.textContent=(Math.round(lt.scrollLeft/lt.clientWidth)+1)+' / '+lt.children.length;}
  function zamknij(){lb.hidden=true;b.style.overflow='';if(ostatni)ostatni.focus();}
  if(lb){
    lb.querySelector('.lx').addEventListener('click',zamknij);
    lb.querySelector('.lp').addEventListener('click',function(){lt.scrollBy({left:-lt.clientWidth,behavior:'smooth'});});
    lb.querySelector('.ln').addEventListener('click',function(){lt.scrollBy({left:lt.clientWidth,behavior:'smooth'});});
    lb.querySelector('.lb-t').addEventListener('scroll',function(){requestAnimationFrame(licz);},{passive:true});
    d.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')zamknij();if(e.key==='ArrowRight')lt.scrollBy({left:lt.clientWidth,behavior:'smooth'});if(e.key==='ArrowLeft')lt.scrollBy({left:-lt.clientWidth,behavior:'smooth'});});
  }

  // formularz (wersja testowa: bez wysylki)
  var f=d.getElementById('form');
  if(f){
    var info=d.getElementById('form-info');
    var tm=new URLSearchParams(location.search).get('temat');
    if(tm){var s=f.querySelector('select[name=temat]');if(s){[].forEach.call(s.options,function(o){if(o.value===tm)s.value=tm;});}}
    f.addEventListener('submit',function(e){e.preventDefault();
      if(!f.checkValidity()){info.className='bl';info.textContent='Uzupełnij pola oznaczone gwiazdką i zaznacz zgodę na kontakt.';var z=f.querySelector(':invalid');if(z)z.focus();return;}
      info.className='ok';info.textContent='To wersja testowa strony - formularz zacznie wysyłać wiadomości po uruchomieniu na fabricforms.pl. Do tego czasu zapraszamy pod numer 501 338 623.';});
  }

  // zgody cookies, mapa i moduł Facebooka
  var KL='ff-zgoda',c=d.getElementById('cookies');
  function zgoda(){try{return localStorage.getItem(KL);}catch(e){return null;}}
  function zapisz(v){try{localStorage.setItem(KL,v);}catch(e){}if(c)c.hidden=true;if(v!=='nie')zewn(true);}
  if(c){
    c.querySelector('[data-c=tak]').addEventListener('click',function(){zapisz('tak');});
    c.querySelector('[data-c=nie]').addEventListener('click',function(){zapisz('nie');});
    var ust=c.querySelector('[data-c=ust]'),pan=c.querySelector('.ust'),zap=c.querySelector('[data-c=zap]');
    ust.addEventListener('click',function(){pan.hidden=false;ust.hidden=true;zap.hidden=false;});
    zap.addEventListener('click',function(){zapisz(c.querySelector('#zg-zew').checked?'tak':'nie');});
  }
  d.querySelectorAll('[data-cookies]').forEach(function(x){x.addEventListener('click',function(){if(c)c.hidden=false;});});
  function wstaw(m){if(m.querySelector('iframe'))return;var i=d.createElement('iframe');i.src=m.getAttribute('data-src');i.title=m.getAttribute('data-t');i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';if(m.classList.contains('fb'))i.setAttribute('scrolling','no');m.appendChild(i);var z=m.querySelector('.mapa-z,.fb-z');if(z)z.remove();}
  function zewn(teraz){
    d.querySelectorAll('[data-src]').forEach(function(m){
      var bt=m.querySelector('button');if(bt)bt.onclick=function(){wstaw(m);};
      if(zgoda()==='nie'&&!teraz)return;
      if(!('IntersectionObserver' in window)){wstaw(m);return;}
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){wstaw(m);io.disconnect();}});},{rootMargin:'400px'});io.observe(m);
    });
  }
  zewn(false);
  var r=d.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
})();
