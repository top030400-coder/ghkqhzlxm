/* Photobook Kit — 완성본 책 런타임 (넘김·자동재생·컨트롤)
   #store 안의 .sheet 수에서 펼침면(VIEWS)을 자동 계산한다. */
(function(){
  var sheets=[].slice.call(document.querySelectorAll('#store .sheet'));
  var VIEWS=(function(){
    var v=[[null,0]];
    for(var i=1;i<sheets.length;i+=2)v.push([i,(i+1<sheets.length)?i+1:null]);
    return v;
  })();
  var book=document.getElementById('book');
  var slotL=book.querySelector('.pageL'),slotR=book.querySelector('.pageR');
  var now=document.getElementById('pgNow'),all=document.getElementById('pgAll');
  all.textContent=String(VIEWS.length).padStart(2,'0');
  var v=0,busy=false,timer=null,playing=false;
  var DUR=870,GAP=4300;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var forceAnim=new URLSearchParams(location.search).has('anim');
  if(forceAnim)reduced=false;

  function clone(i){return i===null?null:sheets[i].cloneNode(true)}
  function put(slot,i){
    slot.innerHTML='';
    var c=clone(i);
    if(c)slot.appendChild(c);
  }
  function setNum(i){now.textContent=String(i+1).padStart(2,'0')}
  function sideCls(i){
    book.classList.toggle('single',VIEWS[i][0]===null);
    book.classList.toggle('singleR',VIEWS[i][1]===null);
  }
  function render(i){
    put(slotL,VIEWS[i][0]);put(slotR,VIEWS[i][1]);
    sideCls(i);setNum(i);v=i;
  }
  function makeLeaf(frontIdx,backIdx,cls,frontSide,backSide){
    var leaf=document.createElement('div');
    leaf.className='leaf '+cls;
    var f=document.createElement('div');f.className='face fwd '+frontSide;
    var b=document.createElement('div');b.className='face rev '+backSide;
    var fc=clone(frontIdx);if(fc)f.appendChild(fc);
    var bc=clone(backIdx);if(bc)b.appendChild(bc);
    leaf.appendChild(f);leaf.appendChild(b);
    return leaf;
  }

  function clearLeaves(){
    var ls=book.querySelectorAll('.leaf');
    for(var i=0;i<ls.length;i++)ls[i].remove();
  }
  function turn(nv,dir){
    /* 어떤 상황에서도 최종 상태가 보장되도록: 밑장을 먼저 깔고, 낱장 애니는 장식.
       끝나면(animationend 또는 타임아웃 중 먼저) 무조건 render()로 정리 */
    busy=true;setNum(nv);
    clearLeaves();
    var leaf=(dir>0)
      ? makeLeaf(VIEWS[v][1],VIEWS[nv][0],'turnNext','fR','fL')
      : makeLeaf(VIEWS[v][0],VIEWS[nv][1],'turnPrev','fL','fR');
    /* 낱장 크기를 픽셀로 고정 — 3D 회전 중 재계산으로 내용물이 작아지는 것 차단 */
    var br=book.getBoundingClientRect();
    leaf.style.width=(br.width/2)+'px';
    leaf.style.height=br.height+'px';
    if(dir>0){
      put(slotR,VIEWS[nv][1]);
      setTimeout(function(){put(slotL,VIEWS[nv][0])},Math.round(DUR/2));
    }else{
      put(slotL,VIEWS[nv][0]);
      setTimeout(function(){put(slotR,VIEWS[nv][1])},Math.round(DUR/2));
    }
    book.appendChild(leaf);
    sideCls(nv);
    var done=false;
    function fin(){if(done)return;done=true;clearLeaves();render(nv);busy=false}
    leaf.addEventListener('animationend',fin);
    setTimeout(fin,DUR+200);
  }
  function next(man){
    if(busy)return;
    var nv=(v+1)%VIEWS.length;
    if(reduced||(document.hidden&&!forceAnim))render(nv);else turn(nv,1);
    if(man&&playing)restart();
  }
  function prev(man){
    if(busy)return;
    var nv=(v-1+VIEWS.length)%VIEWS.length;
    if(reduced||(document.hidden&&!forceAnim))render(nv);else turn(nv,-1);
    if(man&&playing)restart();
  }
  document.addEventListener('visibilitychange',function(){
    if(document.hidden){clearInterval(timer)}
    else{clearLeaves();render(v);busy=false;if(playing)restart()}
  });
  function restart(){clearInterval(timer);timer=setInterval(function(){next(false)},GAP)}
  function setPlay(on){
    playing=on;
    var b=document.getElementById('btnPlay');
    b.textContent=on?'❚❚':'▶';
    b.classList.toggle('on',on);
    clearInterval(timer);
    if(on)restart();
  }

  document.getElementById('btnNext').addEventListener('click',function(){next(true)});
  document.getElementById('btnPrev').addEventListener('click',function(){prev(true)});
  document.getElementById('btnPlay').addEventListener('click',function(){setPlay(!playing)});
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();next(true)}
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();prev(true)}
    else if(e.key===' '){e.preventDefault();setPlay(!playing)}
  });
  var tx=null;
  document.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
  document.addEventListener('touchend',function(e){
    if(tx===null)return;
    var dx=e.changedTouches[0].clientX-tx;tx=null;
    if(dx<-40)next(true);else if(dx>40)prev(true);
  },{passive:true});

  render(0);

  /* 검증용 — ?view=N 해당 펼침면, ?flat 전 페이지 세로 나열 */
  var q=new URLSearchParams(location.search);
  if(q.has('view')){
    var n=Math.max(1,Math.min(VIEWS.length,parseInt(q.get('view'),10)||1));
    render(n-1);
    document.documentElement.classList.add('shot');
  }
  if(q.has('flat'))document.documentElement.classList.add('flat');

  /* 첫 조작 힌트 — 넘길 수 있다는 걸 모르고 닫는 사람이 있어서.
     한 번 넘기면 바로 사라지고, 움직임 줄이기면 애니 없이 표시만 한다. */
  (function(){
    if(q.has('shot')||q.has('flat')||q.has('view'))return;
    var tip=document.createElement('div');
    tip.className='firsttip';
    tip.innerHTML='<b>‹ ›</b> 또는 키보드 <b>← →</b> 로 넘겨보세요 · <b>Space</b> 자동 넘김';
    var gone=false;
    function hide(){
      if(gone)return; gone=true;
      tip.classList.add('out');
      setTimeout(function(){ if(tip.parentNode)tip.remove(); },600);
    }
    setTimeout(function(){
      if(gone)return;
      document.body.appendChild(tip);
      /* rAF 는 백그라운드 탭·비활성 창에서 안 돌 수 있어 힌트가 투명한 채로 남는다.
         타이머로 클래스를 붙여야 어느 상황에서도 보인다. */
      setTimeout(function(){ tip.classList.add('in'); },30);
      setTimeout(hide,5200);
    },1400);
    ['click','keydown','touchstart','wheel'].forEach(function(ev){
      document.addEventListener(ev,hide,{passive:true,once:true});
    });
  })();

  /* 사이즈·이미지 준비된 뒤 페이드인 */
  var readyTO=null,loaded=false;
  function ready(){document.body.classList.add('ready')}
  function arm(ms){clearTimeout(readyTO);readyTO=setTimeout(ready,ms)}
  window.addEventListener('load',function(){loaded=true;arm(250)});
  window.addEventListener('resize',function(){
    if(!document.body.classList.contains('ready'))arm(loaded?250:600);
  });
  if(document.readyState==='complete'){loaded=true;arm(250)}
  setTimeout(ready,1500);
})();
