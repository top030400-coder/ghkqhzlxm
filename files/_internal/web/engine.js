/* ============================================================
   Photobook Kit — layout engine
   LAYOUTS: 페이지 레이아웃 정의 목록.
   PBK.render(page, opts) → '<div class="sheet ...">…</div>' HTML 문자열.
   편집기와 완성본 내보내기가 같은 렌더러를 써서 100% 동일하게 보임.
   ============================================================ */
window.PBK = (function () {
  'use strict';

  function esc(s) {
    s = String(s == null ? '' : s);
    /* 사진 base64 dataURL은 MB급 문자열인데 이스케이프 대상 문자가 없어 4패스
       정규식이 통째로 낭비다(렌더마다 반복). 빠른 스캔으로 항등이면 그대로 반환. */
    if (s.length > 1024 && s.lastIndexOf('data:image/', 0) === 0 &&
        s.indexOf('<') < 0 && s.indexOf('>') < 0 && s.indexOf('"') < 0 && s.indexOf('&') < 0) return s;
    return s
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 아치(곡선) 텍스트 — 글자를 한 자씩 회전·오프셋한 span으로 (foreignObject PNG에서도 동작).
     bend > 0 = 위로 볼록(∩), bend < 0 = 아래로 볼록(∪). 단위는 em이라 글자 크기를 따라간다. */
  function fxArch(text, bend) {
    bend = Math.max(-80, Math.min(80, parseFloat(bend) || 0));
    var plain = String(text == null ? '' : text).replace(/\n/g, ' ');
    var chars = plain.split('');
    var n = chars.length;
    if (!bend || n < 2) return esc(plain);
    var out = '<span style="display:inline-block;white-space:pre">';
    for (var i = 0; i < n; i++) {
      var t = (i / (n - 1)) * 2 - 1;
      var rot = t * bend * 0.5;
      var y = -(1 - t * t) * bend * 0.011;
      out += '<span style="display:inline-block;transform:rotate(' + rot.toFixed(2) +
        'deg) translateY(' + y.toFixed(3) + 'em)">' +
        (chars[i] === ' ' ? '&#160;' : esc(chars[i])) + '</span>';
    }
    return out + '</span>';
  }

  var PAGE_W = 1200;   /* 페이지 기준 가로 픽셀 — 사진 '원본 크기' 계산의 기준 */

  /* SNS 본문 — @멘션 · #해시태그를 파란 글씨로 */
  function snsRich(c, k) {
    var v = c.raw(k);
    var h = esc(v).replace(/([@#][^\s@#<>]+)/g, '<span class="mn">$1</span>');
    return c.f(k, h);
  }
  /* 카톡 대화 대본 파서 —
       >내용        = 내 말풍선(오른쪽 노랑)
       이름: 내용   = 상대 말풍선(왼쪽 흰색)
       #내용        = 가운데 안내(날짜·시스템)
     줄 끝에  |시간  = 시간 표시,  (숫자) = 안읽음 수 */
  function kkParse(raw) {
    var lines = String(raw == null ? '' : raw).split('\n');
    var out = [], i, ln, m, it, prev = null;
    for (i = 0; i < lines.length; i++) {
      ln = lines[i];
      if (!ln.replace(/\s/g, '')) continue;
      it = { side: 'me', name: '', body: '', time: '', un: '', sys: false };
      /* 안읽음 (숫자) 를 먼저 떼야 한다 — 시간(|…)을 먼저 떼면 그 뒤의 (숫자)까지 시간에 먹힌다 */
      m = /\s*\((\d+)\)\s*$/.exec(ln);
      if (m) { it.un = m[1]; ln = ln.slice(0, m.index); }
      m = /\s\|([^|]*)$/.exec(ln);
      if (m) { it.time = m[1].trim(); ln = ln.slice(0, m.index); }
      m = /\s*\((\d+)\)\s*$/.exec(ln);
      if (!it.un && m) { it.un = m[1]; ln = ln.slice(0, m.index); }
      if (ln.charAt(0) === '#') { it.sys = true; it.body = ln.slice(1).trim(); }
      else if (ln.charAt(0) === '>') { it.side = 'me'; it.body = ln.slice(1).trim(); }
      else {
        m = /^([^:]{1,20}):\s?([\s\S]*)$/.exec(ln);
        if (m) { it.side = 'you'; it.name = m[1].trim(); it.body = m[2]; }
        else { it.side = 'you'; it.name = ''; it.body = ln; }
      }
      /* 같은 사람이 연달아 말하면 이름·프사는 첫 줄에만 */
      it.head = !(prev && !prev.sys && !it.sys && prev.side === it.side && prev.name === it.name);
      if (!it.sys) prev = it;
      out.push(it);
    }
    return out;
  }
  /* 아이콘 — 브랜드 로고를 쓰지 않고 직접 그린 단순 형태 */
  var SNSI = {
    heart: '<svg class="si" viewBox="0 0 24 24"><path d="M12 20.6C6.8 17 3.6 13.9 3.6 10.3A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 8.4 2.3c0 3.6-3.2 6.7-8.4 10.3z"/></svg>',
    cmt: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M20.5 11.7c0 4-3.8 7.2-8.5 7.2-1 0-2-.15-2.9-.42L4 20l1.3-3.5C4.1 15.2 3.5 13.5 3.5 11.7c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2z"/></svg>',
    rt: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h11a3 3 0 0 1 3 3v2"/><path d="M7 5 4 8l3 3"/><path d="M20 16H9a3 3 0 0 1-3-3v-2"/><path d="M17 19l3-3-3-3"/></svg>',
    mark: '<svg class="si" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.2L6 21z"/></svg>',
    ok: '<svg class="si vf" viewBox="0 0 24 24"><path d="M12 2.4 14.3 4l2.8-.3 1 2.6 2.4 1.5-.8 2.7.8 2.7-2.4 1.5-1 2.6-2.8-.3L12 21.6 9.7 20l-2.8.3-1-2.6L3.5 16.2l.8-2.7-.8-2.7 2.4-1.5 1-2.6L9.7 4z"/><path d="m8.6 12.1 2.3 2.3 4.6-4.8" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chart: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M21 19H3"/></svg>',
    up: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></svg>',
    mute: '<svg class="si" viewBox="0 0 24 24"><path d="M4 9h3l4-3.4v12.8L7 15H4z"/><path d="M15 9.5 20 15M20 9.5 15 15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    dots: '<svg class="si" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>',
    srch: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>',
    call: '<svg class="si" viewBox="0 0 24 24"><path d="M7 3.5 9.6 8 7.8 10a12 12 0 0 0 6.2 6.2l2-1.8 4.5 2.6-1.4 3.2a2 2 0 0 1-2 1.1C9.6 20.6 3.4 14.4 2.7 6.9a2 2 0 0 1 1.1-2z"/></svg>',
    cam: '<svg class="si" viewBox="0 0 24 24"><rect x="3" y="6.5" width="12" height="11" rx="2.5"/><path d="M16 10.5 21 8v8l-5-2.5z"/></svg>',
    menu: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    ppl: '<svg class="si" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0z"/></svg>',
    horn: '<svg class="si" viewBox="0 0 24 24"><path d="M4 9.5h4l8-4.5v14l-8-4.5H4z"/><path d="M18.5 9a3.5 3.5 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    chev: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    plus: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    smile: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.4"/><circle cx="9.3" cy="10" r=".9" fill="currentColor" stroke="none"/><circle cx="14.7" cy="10" r=".9" fill="currentColor" stroke="none"/><path d="M8.6 14.4a4.4 4.4 0 0 0 6.8 0"/></svg>',
    file: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z"/><path d="M14 3v4.5h4.5"/></svg>',
    back: '<svg class="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6-6 6 6 6"/></svg>'
  };


  var LAYOUTS = [];
  function reg(def) { LAYOUTS.push(def); }
  function byId(id) {
    for (var i = 0; i < LAYOUTS.length; i++) if (LAYOUTS[i].id === id) return LAYOUTS[i];
    return null;
  }

  var CATS = [
    { id: 'cover',   n: '표지' },
    { id: 'front',   n: '목차·프롤로그' },
    { id: 'divider', n: '챕터 표지' },
    { id: 'collage', n: '콜라주' },
    { id: 'selfie',  n: '셀카·폰컷' },
    { id: 'column',  n: '사진+글' },
    { id: 'grid',    n: '그리드' },
    { id: 'feature', n: '피처·타이포' },
    { id: 'finale',  n: '피날레·뒷표지' },
    { id: 'sns',     n: 'SNS·채팅' }
  ];

  var PRESETS = [
    { n: '세이지 × 허니',   mat: '#e7eadb', cover: '#e3e8d1', paper: '#fbfaf3', acc1: '#6ea564', acc2: '#dea44e' },
    { n: '민트 그레이',     mat: '#e4e8e5', cover: '#dbe3de', paper: '#faf9f6', acc1: '#4fae93', acc2: '#f0a9bd' },
    { n: '로즈 블러쉬',     mat: '#efe3e3', cover: '#ecd9dc', paper: '#fdfaf7', acc1: '#c86a7e', acc2: '#8fae93' },
    { n: '라벤더',          mat: '#e6e3ee', cover: '#ddd8ea', paper: '#fbfaf9', acc1: '#8b7fc7', acc2: '#e0a86e' },
    { n: '오션 블루',       mat: '#dfe7ea', cover: '#d3dfe5', paper: '#f9fafb', acc1: '#4a7fa5', acc2: '#e0b168' },
    { n: '버터 크림',       mat: '#f2eddc', cover: '#ece4c8', paper: '#fdfcf5', acc1: '#c99a2e', acc2: '#7f9a6a' },
    { n: '모노 × 레드',     mat: '#e8e6e2', cover: '#dedcd6', paper: '#fbfaf8', acc1: '#2e2e2c', acc2: '#b0453a' },
    { n: '미드나이트',      mat: '#23262e', cover: '#2b2f38', paper: '#f5f4ef', acc1: '#7ea0c7', acc2: '#d8a95b' }
  ];

  /* ---------- 렌더 컨텍스트 ---------- */
  function makeCtx(page, def, opts) {
    opts = opts || {};
    var mode = opts.mode || 'edit';           // edit | export | sample
    var srcOf = opts.src || function () { return null; };
    /* (k) -> 그 문구에 얹을 인라인 스타일 문자열(폰트·크기) | null */
    var tstyle = opts.tstyle || opts.tfont || function () { return null; };
    /* (k) -> 그 문구의 텍스트 효과 객체({arch:도, ...}) | null — 아치는 마크업 치환이라 여기서 처리 */
    var tfx = opts.tfx || function () { return null; };

    var c = {};
    /* 필드별 폰트/크기 오버라이드 래핑 — 있으면 span으로 감싼다.
       color:inherit — '.… h3 span{color:포인트색}' 류의 자손 선택자가
       래퍼 span 전체를 물들이는 것을 막는다(안쪽 마침표 span만 물들게). */
    c.f = function (k, html) {
      var st = tstyle(k);
      if (!st) return html;
      if (st.indexOf(':') < 0) st = 'font-family:' + st; /* 구형 tfont(가족명만) 호환 */
      /* data-cf: 부분 편집에서 이 래퍼 대신 부모(문구 칸)를 선택하게 하는 표식 */
      return '<span data-cf="1" style="color:inherit;' + esc(st) + '">' + html + '</span>';
    };
    c.t = function (k) {
      var f0 = fieldOf(def, k);
      var v = page.texts && page.texts[k];
      /* 빈 문자열은 "사용자가 일부러 비운 것"이라 그대로 비워둔다.
         예전엔 빈칸도 기본값으로 되돌려서, "(비우면 숨김)"이라고 적힌 칸을 비워도
         기본 문구가 되살아나 아무 칸도 지울 수가 없었다.
         한 번도 안 건드린 칸(undefined)만 기본값으로 채운다. */
      if (v == null) v = f0 ? f0.d : '';
      var fx = tfx(k);
      var html = (fx && fx.arch) ? c.f(k, fxArch(v, fx.arch)) : c.f(k, esc(v));
      /* 긴 글(m:true)에 표식을 달아둔다 — 페이지별 "글 배치"(단 수·정렬·줄간격)가 여기 걸린다.
         기본값이면 CSS가 아무것도 안 걸어서 겉모습은 그대로(span은 inline). */
      if (f0 && f0.m) html = '<span class="tbd">' + html + '</span>';
      return html;
    };
    c.raw = function (k) {
      var v = page.texts && page.texts[k];
      /* c.t 와 같은 규칙 — 빈 문자열은 비운 것으로 존중한다 */
      if (v == null) { var f = fieldOf(def, k); v = f ? f.d : ''; }
      return String(v == null ? '' : v);
    };
    /* 제목 끝의 마침표를 포인트 색으로 */
    c.h3 = function (k) {
      var v = c.raw(k).trim();
      if (!v) return '';   /* 비운 칸에 마침표만 덩그러니 남지 않게 */
      if (v.slice(-1) === '.') v = v.slice(0, -1);
      return c.f(k, esc(v) + '<span>.</span>');
    };
    /* 무드 필터(p.flt 프리셋 키) + ✨자동보정(p.fab/fac/fas %) → CSS filter.
       ⚠ editor.html 의 BN_FLT_PRE 와 키·값 동기 유지. 저장(SVG foreignObject)에 그대로 구워짐. */
    var FLT_PRE = {
      film:  'contrast(1.06) saturate(.9) sepia(.14) brightness(1.02)',
      pastel:'saturate(.8) brightness(1.07) contrast(.94)',
      cine:  'contrast(1.13) saturate(1.06) sepia(.07) brightness(.97)',
      mono:  'grayscale(1) contrast(1.08)',
      warm:  'sepia(.2) saturate(1.04) brightness(1.03)',
      cool:  'hue-rotate(-8deg) saturate(.94) brightness(1.02) contrast(1.05)',
      vivid: 'saturate(1.28) contrast(1.09)',
      soft:  'contrast(.9) brightness(1.06) saturate(.88)'
    };
    function fltSt(p) {
      var parts = [];
      if (p && p.flt && FLT_PRE[p.flt]) parts.push(FLT_PRE[p.flt]);
      /* 자동보정 수치 — 숫자만 허용(속성 주입 차단), 100 = 무보정 */
      var br = parseFloat(p && p.fab), ct = parseFloat(p && p.fac), sa = parseFloat(p && p.fas);
      if (isFinite(br) && br > 0 && br !== 100) parts.push('brightness(' + Math.max(30, Math.min(300, br)) / 100 + ')');
      if (isFinite(ct) && ct > 0 && ct !== 100) parts.push('contrast(' + Math.max(30, Math.min(300, ct)) / 100 + ')');
      if (isFinite(sa) && sa > 0 && sa !== 100) parts.push('saturate(' + Math.max(0, Math.min(300, sa)) / 100 + ')');
      return parts.length ? ';filter:' + parts.join(' ') : '';
    }
    c.img = function (i, extra) {
      var p = (page.photos && page.photos[i]) || null;
      var src = p ? srcOf(p, i) : null;
      if (mode === 'sample') return '<div class="phS s' + (i % 4) + '"></div>';
      if (!src) {
        /* 완성본에는 편집기용 점선 placeholder 대신 조용한 빈 칸 */
        if (mode === 'export') return '<div class="phX"></div>';
        var lbl = (def.ph && def.ph[i] && def.ph[i].n) || '';
        return '<div class="phE" data-pi="' + i + '"><b>사진 ' + (i + 1) + '</b><span>' + esc(lbl) + '</span></div>';
      }
      /* 자유 배치 — 사진을 원본 크기 그대로 얹고 크기·위치·기울기를 직접 조절한다.
         예전 방식(칸에 맞춰 강제로 채우기)은 더 큰 사진을 넣어도 칸에 갇혀 들어와서
         줄이면 양옆에 여백만 생겼다. 여기선 칸을 넘치게 두고 칸이 잘라준다(.ph는 overflow:hidden).
         free 표시가 없는 예전 사진은 아래 기존 경로 그대로 → 옛 프로젝트가 안 바뀐다. */
      /* 가장자리 페더 — 사진 가장자리를 서서히 투명하게(마스크 가로+세로 교차).
         규격 안 맞는 사진 밑에 같은 계열 배경을 깔아도 경계선이 안 보이게.
         PNG 저장(SVG foreignObject)에선 overflow:hidden 조상 안의 마스크가
           통째로 무시되는 크로미움 버그가 있다(실측). 그래서 저장 쪽은 마스크 대신
           "사진 비트맵에 페더를 구워서" 넘긴다 — opts.feBake 가 켜지면 마스크 생략. */
      var fe = parseFloat(p.fe);
      var feSt = '';
      if (isFinite(fe) && fe > 0 && !opts.feBake) {
        fe = Math.min(45, fe);
        var g1 = 'linear-gradient(90deg,transparent 0,#000 ' + fe + '%,#000 ' + (100 - fe) + '%,transparent 100%)';
        var g2 = 'linear-gradient(180deg,transparent 0,#000 ' + fe + '%,#000 ' + (100 - fe) + '%,transparent 100%)';
        feSt = ';-webkit-mask-image:' + g1 + ',' + g2 + ';-webkit-mask-composite:source-in' +
          ';mask-image:' + g1 + ',' + g2 + ';mask-composite:intersect';
      }
      if (p.free && p.iw > 0 && p.ih > 0) {
        var fsc = parseFloat(p.sc);
        if (!isFinite(fsc) || fsc <= 0) fsc = 1;
        fsc = Math.max(0.05, Math.min(8, fsc));
        var fpx = parseFloat(p.px); if (!isFinite(fpx)) fpx = 0;
        var fpy = parseFloat(p.py); if (!isFinite(fpy)) fpy = 0;
        fpx = Math.max(-300, Math.min(300, fpx));
        fpy = Math.max(-300, Math.min(300, fpy));
        var frot = parseFloat(p.rot); if (!isFinite(frot)) frot = 0;
        frot = Math.max(-180, Math.min(180, frot));
        var wcq = (p.iw / PAGE_W * 100) * fsc;   /* cqw = 페이지 폭의 1% */
        return '<img src="' + esc(src) + '" alt="" draggable="false" data-pi="' + i + '" class="phFree"' +
          ' style="--pw:' + wcq.toFixed(3) + 'cqw;--px:' + fpx.toFixed(3) + 'cqw;--py:' + fpy.toFixed(3) +
          'cqw;--prot:' + frot.toFixed(2) + 'deg' + feSt + fltSt(p) + (extra ? ';' + extra : '') + '">';
      }
      /* ox/oy는 숫자만 허용(조작된 프로젝트 파일의 속성 주입 차단) */
      var ox = parseFloat(p.ox), oy = parseFloat(p.oy);
      if (!isFinite(ox)) ox = 50;
      if (!isFinite(oy)) oy = 30;
      ox = Math.max(0, Math.min(100, ox));
      oy = Math.max(0, Math.min(100, oy));
      return '<img src="' + esc(src) + '" alt="" draggable="false" data-pi="' + i + '"' +
        ' style="object-position:' + ox + '% ' + oy + '%' + feSt + fltSt(p) + (extra ? ';' + extra : '') + '">';
    };
    c.mast = function (k) {
      var v = c.raw(k).trim() || 'BOOK';
      var n = v.length;
      var cls = n > 10 ? ' fit4' : n > 7 ? ' fit3' : n > 5 ? ' fit2' : '';
      return { txt: c.f(k, esc(v)), cls: cls };
    };
    return c;
  }
  /* 마지막 "글자" 떼어내기 — 이모지처럼 두 칸을 차지하는 글자(서로게이트 페어)를
     slice(-1) 로 자르면 반쪽만 잘려 나가 �로 깨진다. 코드포인트 단위로 나눈다.
     'HANA🌸' → head 'HANA', last '🌸' */
  function splitLast(s) {
    var a = Array.from(String(s == null ? '' : s));
    if (!a.length) return { head: '', last: '' };
    return { head: a.slice(0, -1).join(''), last: a[a.length - 1] };
  }
  function fieldOf(def, k) {
    if (!def.tx) return null;
    for (var i = 0; i < def.tx.length; i++) if (def.tx[i].k === k) return def.tx[i];
    return null;
  }

  /* ---------- 부분(요소) 커스텀 ----------
     page.els = { "0.1.2": { hide:1, dx:cqw, dy:cqw } }
     키 = .pg 루트부터의 자식 인덱스 경로(레이아웃 구조가 고정이라 안정적).
     편집 모드에선 모든 요소에 data-elp 경로를 태깅해 클릭 선택이 가능하게 한다. */
  function applyParts(html, page, mode) {
    var els = page.els || null;
    var keys = els ? Object.keys(els) : [];
    var tagging = mode === 'edit';
    if (!keys.length && !tagging) return html;
    if (typeof document === 'undefined') return html;
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var pgEl = tmp.querySelector('.pg');
    if (!pgEl) return html;
    (function walk(el, prefix) {
      var kids = el.children;
      for (var i = 0; i < kids.length; i++) {
        var k = kids[i];
        var path = prefix ? prefix + '.' + i : String(i);
        if (tagging) k.setAttribute('data-elp', path);
        var o = els && els[path];
        if (o) {
          if (o.hide) k.style.display = 'none';
          /* dx/dy는 숫자만(조작된 프로젝트 파일의 스타일 주입 차단) */
          var dx = parseFloat(o.dx), dy = parseFloat(o.dy);
          dx = isFinite(dx) ? Math.max(-300, Math.min(300, dx)) : 0;
          dy = isFinite(dy) ? Math.max(-300, Math.min(300, dy)) : 0;
          /* translate 속성 — CSS transform(rotate 등)과 독립이라 겹쳐도 안전 */
          if (dx || dy) k.style.translate = dx + 'cqw ' + dy + 'cqw';
        }
        walk(k, path);
      }
    })(pgEl, '');
    return tmp.innerHTML;
  }

  /* 페이지별 "글 배치" — 단 수 / 정렬 / 줄간격.
     값이 없으면 클래스를 안 붙이므로 예전 페이지는 지금까지와 똑같이 그려진다. */
  function txoCls(page) {
    var o = page && page.txo;
    if (!o) return '';
    var s = '';
    if (o.col === 1 || o.col === 2 || o.col === 3) s += ' txc' + o.col;
    if (o.al === 'l' || o.al === 'c' || o.al === 'j') s += ' txa' + o.al.toUpperCase();
    if (o.lh === 1 || o.lh === 2 || o.lh === 3) s += ' txh' + o.lh;
    return s;
  }
  /* 페이지 자유 텍스트 — 레이아웃 칸과 무관하게 아무 데나 놓는 글자.
     키를 '@0','@1'… 로 두면 폰트·크기·색·효과가 기존 문구와 똑같은 배선(tstyle)으로 걸린다.
     반드시 맨 뒤에 붙인다 — .pg 자식 인덱스가 부분편집(els) 경로라서,
        앞에 끼우면 이미 저장된 숨김·이동이 전부 밀린다. */
  function numOf(v, d, lo, hi) {
    v = parseFloat(v);
    if (!isFinite(v)) v = d;
    return Math.max(lo, Math.min(hi, v));
  }
  function freeTexts(page, c, mode) {
    var arr = page && page.txts;
    if (!arr || !arr.length) return '';
    var out = '';
    for (var i = 0; i < arr.length && i < 12; i++) {
      var t = arr[i];
      if (!t) continue;
      var s = String(t.t == null ? '' : t.t);
      /* 비워두면 완성본엔 안 나오고, 편집 화면에선 잡을 수 있게 자리만 남긴다 */
      if (!s.trim() && mode !== 'edit') continue;
      var st = 'left:' + numOf(t.x, 50, -60, 160) + '%' +
        ';top:' + numOf(t.y, 50, -60, 160) + '%' +
        ';font-size:' + numOf(t.sc, 4, 0.5, 40) + 'cqw' +
        ';transform:translate(-50%,-50%) rotate(' + numOf(t.rot, 0, -180, 180) + 'deg)' +
        ';text-align:' + (t.al === 'l' ? 'left' : t.al === 'r' ? 'right' : 'center');
      var w = numOf(t.w, 0, 0, 100);
      if (w) st += ';width:' + w + 'cqw';
      var fx = (page.tfx && page.tfx['@' + i]) || null;
      var body = (fx && fx.arch) ? fxArch(s, fx.arch)
        : esc(s).replace(/\n/g, '<br>');
      out += '<div class="pgtxt" data-ti="' + i + '" style="' + st + '">' +
        c.f('@' + i, body) + '</div>';
    }
    return out;
  }
  /* 페이지 소품(스티커) — 배너 소품을 화보집 페이지에도 얹는다.
     dataURL(d)을 페이지에 지녀서 저장/완성본/EXE 어디서든 따라온다.
     부분편집(els) 경로가 "몇 번째 자식"이라 소품은 항상 자유 텍스트 뒤(맨 끝)에 붙인다. */
  function stickers(page) {
    var arr = page && page.stk;
    if (!arr || !arr.length) return '';
    var out = '';
    for (var i = 0; i < arr.length && i < 12; i++) {
      var s = arr[i];
      if (!s || typeof s.d !== 'string' || s.d.slice(0, 11) !== 'data:image/') continue;
      var st = 'left:' + numOf(s.x, 50, -60, 160) + '%' +
        ';top:' + numOf(s.y, 50, -60, 160) + '%' +
        ';width:' + numOf(s.sc, 18, 2, 160) + 'cqw' +
        ';transform:translate(-50%,-50%) rotate(' + numOf(s.rot, 0, -180, 180) + 'deg)' +
        (s.flip ? ' scaleX(-1)' : '');
      out += '<img class="pstk" data-si="' + i + '" src="' + esc(s.d) + '" alt="" draggable="false" style="' + st + '">';
    }
    return out;
  }
  /* page.bg → `.pg` 에 붙일 인라인 style 문자열(없으면 빈 문자열) */
  function pageBgStyle(page) {
    var b = page && page.bg;
    if (!b || typeof b !== 'object') return '';
    var c = String(b.c || '');
    if (!/^#[0-9a-fA-F]{6}$/.test(c)) return '';
    /* 단축 속성으로 덮어써야 레이아웃이 깔아둔 그라데이션·이미지까지 확실히 치운다 */
    return ' style="background:' + c + '"';
  }

  function render(page, opts) {
    opts = opts || {};
    var def = byId(page.layout);
    if (!def) return '<div class="sheet"><div class="phE"><b>알 수 없는 레이아웃</b></div></div>';
    var c = makeCtx(page, def, opts);
    /* cqw 단위는 컨테이너(.sheet)의 "자손"에서만 확실히 풀리므로
       레이아웃 클래스는 내부 래퍼(.pg)에 얹는다 */
    var cls = 'pg ' + def.cls + (page.mir && def.mir ? ' mir' : '') + (def.dark ? ' dark' : '') + txoCls(page);
    /* 페이지별 배경 오버라이드(page.bg) — 없으면 예전과 똑같이 동작한다.
       ⚠ 반드시 `.pg` 자기 자신에 인라인으로 얹는다.
          · 레이아웃 클래스(.cover{background:var(--cover)} 등)와 같은 엘리먼트라 인라인이 이긴다.
          · 자식 요소로 넣으면 부분편집의 '자식 인덱스 경로'가 한 칸씩 밀려 다 깨진다. */
    var bgSty = pageBgStyle(page);
    if (bgSty) cls += ' pgbg';
    var inner = def.h(c);
    if (def.pnum !== false && opts.pnum != null) {
      inner += '<span class="pnum' + (def.pnumLeft ? ' pl' : '') + '">' +
        String(opts.pnum).padStart(2, '0') + '</span>';
    }
    inner += freeTexts(page, c, opts.mode || 'edit'); /* 자유 텍스트는 항상 맨 뒤·맨 위 */
    inner += stickers(page); /* 소품은 그 뒤 — els 자식 인덱스 경로를 안 민다 */
    var html = '<div class="sheet"><div class="' + cls + '"' + bgSty + '>' + inner + '</div></div>';
    return applyParts(html, page, opts.mode || 'edit');
  }

  /* ============================================================
     표지 COVER
     ============================================================ */

  reg({
    id: 'cover-mast', cat: 'cover', n: '매거진 마스트헤드', cls: 'cover', pnum: false,
    ph: [{ n: '메인 사진(하단)' }],
    tx: [
      { k: 'tag', n: '상단 작은 문구', d: 'SOOP LIVE VTUBER STYLE BOOK' },
      { k: 'mast', n: '제호(영문 이름)', d: 'YOUR NAME' },
      { k: 'vol', n: '볼륨 배지', d: 'VOL.1' },
      { k: 'season', n: '시즌 문구', d: '2026 SUMMER' }
    ],
    h: function (c) {
      var m = c.mast('mast');
      return '<header class="cv-head">' +
        '<div class="cv-tag">' + c.t('tag') + '</div>' +
        '<h1 class="cv-mast' + m.cls + '">' + m.txt + '</h1>' +
        '<div class="cv-vol"><span class="cv-volbox">' + c.t('vol') + '</span>' +
        '<span class="cv-season">' + c.t('season') + '</span></div>' +
        '</header><div class="cv-photo ph">' + c.img(0) + '</div>';
    }
  });

  reg({
    id: 'cover-full', cat: 'cover', n: '풀블리드 오버레이', cls: 'coverfull', pnum: false,
    ph: [{ n: '배경 전체 사진' }],
    tx: [
      { k: 'tag', n: '상단 작은 문구', d: 'SOOP LIVE STYLE BOOK' },
      { k: 'vol', n: '볼륨 배지', d: 'VOL.1' },
      { k: 'mast', n: '제호(영문 이름)', d: 'YOUR NAME' },
      { k: 'ko', n: '아래 한 줄(한글)', d: '여름의 기록, 첫 번째.' },
      { k: 'season', n: '시즌 문구', d: '2026 SUMMER' }
    ],
    h: function (c) {
      var m = c.mast('mast');
      return '<div class="bgph ph">' + c.img(0) + '</div><div class="scrim"></div>' +
        '<div class="top"><span class="cv-tag">' + c.t('tag') + '</span>' +
        '<span class="cv-volbox">' + c.t('vol') + '</span></div>' +
        '<div class="bottom"><h1 class="cv-mast' + m.cls + '">' + m.txt + '</h1>' +
        '<div class="sub"><span class="ko">' + c.t('ko') + '</span>' +
        '<span class="cv-season">' + c.t('season') + '</span></div></div>';
    }
  });

  reg({
    id: 'cover-split', cat: 'cover', n: '상하 분할', cls: 'coversplit', pnum: false,
    ph: [{ n: '메인 사진' }],
    tx: [
      { k: 'tag', n: '상단 작은 문구', d: 'PHOTOGRAPHY & SCENES' },
      { k: 'mast', n: '제호(영문 이름)', d: 'YOUR NAME' },
      { k: 'ko', n: '소개 한 줄(한글)', d: '오늘의 표정을 모았습니다.' },
      { k: 'vol', n: '볼륨 배지', d: 'VOL.1' },
      { k: 'strip', n: '하단 띠 문구', d: 'A SEASONAL PORTRAIT' },
      { k: 'season', n: '하단 띠 강조', d: '2026' }
    ],
    h: function (c) {
      var m = c.mast('mast');
      return '<div class="blk"><div class="cv-tag">' + c.t('tag') + '</div>' +
        '<h1 class="cv-mast' + m.cls + '">' + m.txt + '</h1>' +
        '<div class="row"><span class="ko">' + c.t('ko') + '</span>' +
        '<span class="cv-volbox">' + c.t('vol') + '</span></div></div>' +
        '<div class="ph">' + c.img(0) + '</div>' +
        '<div class="strip"><span>' + c.t('strip') + '</span><b>' + c.t('season') + '</b></div>';
    }
  });

  reg({
    id: 'cover-frame', cat: 'cover', n: '액자 프레임', cls: 'coverframe', pnum: false,
    ph: [{ n: '액자 속 사진' }],
    tx: [
      { k: 'tag', n: '상단 작은 문구', d: 'THE PORTRAIT ISSUE' },
      { k: 'mast', n: '제호(영문 이름)', d: 'YOUR NAME' },
      { k: 'season', n: '하단 문구', d: 'VOL.1 — 2026' }
    ],
    h: function (c) {
      var m = c.mast('mast');
      return '<div class="cv-tag">' + c.t('tag') + '</div>' +
        '<h1 class="cv-mast' + m.cls + '">' + m.txt + '</h1>' +
        '<div class="frame"><div class="ph">' + c.img(0) + '</div></div>' +
        '<div class="foot"><span class="rule"></span><span class="cv-season">' + c.t('season') + '</span><span class="rule"></span></div>';
    }
  });

  reg({
    id: 'cover-duo', cat: 'cover', n: '두 컷 + 중앙 밴드', cls: 'coverduo', pnum: false,
    ph: [{ n: '왼쪽 사진' }, { n: '오른쪽 사진' }],
    tx: [
      { k: 'mast', n: '제호(영문 이름)', d: 'YOUR NAME' },
      { k: 'vol', n: '볼륨 배지', d: 'VOL.1' },
      { k: 'season', n: '시즌 문구', d: '2026 SUMMER' }
    ],
    h: function (c) {
      var m = c.mast('mast');
      return '<div class="ph">' + c.img(0) + '</div><div class="ph">' + c.img(1) + '</div>' +
        '<div class="band"><h1 class="cv-mast' + m.cls + '">' + m.txt + '</h1>' +
        '<div class="row"><span class="cv-volbox">' + c.t('vol') + '</span>' +
        '<span class="cv-season">' + c.t('season') + '</span></div></div>';
    }
  });

  /* ============================================================
     목차·프롤로그 FRONT
     ============================================================ */

  reg({
    id: 'toc', cat: 'front', n: '목차', cls: 'toc', dark: false,
    ph: [{ n: '챕터 1 썸네일' }, { n: '챕터 2 썸네일' }, { n: '챕터 3 썸네일' }, { n: '챕터 4 썸네일' }, { n: '폴라로이드' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Contents' },
      { k: 'title', n: '제목', d: 'In this issue' },
      { k: 'n1', n: '챕터1 영문', d: 'Meadow' }, { k: 's1', n: '챕터1 한글', d: '초원에서의 오후' }, { k: 'p1', n: '챕터1 쪽', d: '04' },
      { k: 'n2', n: '챕터2 영문', d: 'Angel' }, { k: 's2', n: '챕터2 한글', d: '노란 후드와 날개' }, { k: 'p2', n: '챕터2 쪽', d: '08' },
      { k: 'n3', n: '챕터3 영문', d: 'Summer' }, { k: 's3', n: '챕터3 한글', d: '파도와 데님' }, { k: 'p3', n: '챕터3 쪽', d: '12' },
      { k: 'n4', n: '챕터4 영문', d: 'Bloom' }, { k: 's4', n: '챕터4 한글', d: '장미와 레이스' }, { k: 'p4', n: '챕터4 쪽', d: '18' },
      { k: 'note', n: '하단 소개 글', d: '한 계절을 함께 걸은 기록.\n페이지마다 다른 표정이 기다립니다.', m: true },
      { k: 'polcap', n: '폴라로이드 캡션', d: 'behind cut' }
    ],
    h: function (c) {
      var no = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'];
      var rows = '';
      for (var i = 1; i <= 4; i++) {
        rows += '<li><div class="toc-th ph">' + c.img(i - 1) + '</div>' +
          '<span class="toc-no">' + no[i - 1] + '</span>' +
          '<span class="toc-name">' + c.t('n' + i) + '<small>' + c.t('s' + i) + '</small></span>' +
          '<span class="toc-pg">' + c.t('p' + i) + '</span></li>';
      }
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<h2 class="toc-title">' + c.t('title') + '</h2>' +
        '<ul class="toc-list">' + rows + '</ul>' +
        '<div class="toc-note"><p>' + c.t('note') + '</p>' +
        '<figure class="polaroid"><div class="pph ph">' + c.img(4) + '</div>' +
        '<figcaption>' + c.t('polcap') + '</figcaption></figure></div>';
    }
  });

  reg({
    id: 'prologue', cat: 'front', n: '프롤로그', cls: 'ed prologue',
    ph: [{ n: '와이드 사진' }],
    tx: [
      { k: 'title', n: '제목(영문)', d: 'PROLOGUE' },
      { k: 'body', n: '본문(오른쪽 정렬)', d: '천천히 넘겨 주세요.\n한 장 한 장이 하나의 계절입니다.', m: true }
    ],
    h: function (c) {
      return '<div class="ed-title">' + c.t('title') + '</div><div class="rule"></div>' +
        '<div class="ph">' + c.img(0) + '</div><p>' + c.t('body') + '</p>';
    }
  });

  reg({
    id: 'letter', cat: 'front', n: '편지(긴 글)', cls: 'ed openletter',
    ph: [{ n: '옆 사진' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'From me, to you' },
      { k: 'title', n: '제목(영문)', d: 'Dear.' },
      { k: 'body', n: '편지 본문', d: '이 책을 펼친 당신에게.\n\n좋아하는 장면만 모았습니다.\n끝까지 함께해 주세요.', m: true },
      { k: 'sig', n: '서명', d: '— with love' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span><h3>' + c.h3('title') + '</h3>' +
        '<div class="row"><div class="lt">' + c.t('body') + '</div>' +
        '<div class="rt"><div class="ph">' + c.img(0) + '</div>' +
        '<div class="sig">' + c.t('sig') + '</div></div></div>';
    }
  });

  /* ============================================================
     챕터 표지 DIVIDER
     ============================================================ */

  reg({
    id: 'dv-dark', cat: 'divider', n: '다크 챕터 표지', cls: 'divider', dark: true,
    ph: [{ n: '중앙 밴드 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: 'CHAPTER 01' },
      { k: 'title', n: '챕터 제목(영문)', d: 'MEA\nDOW', m: true },
      { k: 'em', n: '작은 이탤릭 부제', d: '♡ green days' },
      { k: 'ko', n: '하단 한글 소개', d: '초록 위에서 뒹군 오후' },
      { k: 'nums', n: '하단 작은 표기', d: '04 CUTS' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<h2 class="dv-title">' + c.t('title').replace(/\n/g, '<br>') + '<em>' + c.t('em') + '</em></h2>' +
        '<div class="dv-band ph">' + c.img(0) + '</div>' +
        '<div class="dv-foot"><span class="ko">' + c.t('ko') + '</span>' +
        '<span class="nums">' + c.t('nums') + '</span></div>';
    }
  });

  reg({
    id: 'dv-light', cat: 'divider', n: '라이트 챕터 표지', cls: 'dvlight',
    ph: [{ n: '중앙 밴드 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: 'CHAPTER 02' },
      { k: 'title', n: '챕터 제목(영문)', d: 'BLO\nOM', m: true },
      { k: 'em', n: '작은 이탤릭 부제', d: '♡ roses & lace' },
      { k: 'ko', n: '하단 한글 소개', d: '가장 하얀 날의 기록' },
      { k: 'nums', n: '하단 작은 표기', d: '06 CUTS' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<h2 class="dv-title">' + c.t('title').replace(/\n/g, '<br>') + '<em>' + c.t('em') + '</em></h2>' +
        '<div class="dv-band ph">' + c.img(0) + '</div>' +
        '<div class="dv-foot"><span class="ko">' + c.t('ko') + '</span>' +
        '<span class="nums">' + c.t('nums') + '</span></div>';
    }
  });

  reg({
    id: 'dv-full', cat: 'divider', n: '풀블리드 챕터 표지', cls: 'dvfull', dark: true,
    ph: [{ n: '배경 전체 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: 'CHAPTER 03' },
      { k: 'title', n: '챕터 제목(영문)', d: 'SUMMER' },
      { k: 'ko', n: '한 줄 소개', d: '구름도 파도도 전부 여름.' }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div><div class="scrim"></div>' +
        '<div class="txt"><span class="chip">' + c.t('chip') + '</span>' +
        '<h2 class="dv-title">' + c.t('title') + '</h2>' +
        '<span class="ko">' + c.t('ko') + '</span></div>';
    }
  });

  reg({
    id: 'dv-num', cat: 'divider', n: '거대 숫자', cls: 'dvnum', mir: true,
    ph: [{ n: '세로 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: 'CHAPTER' },
      { k: 'no', n: '큰 숫자', d: '04' },
      { k: 'total', n: '전체 수(작게)', d: '/ 06' },
      { k: 'title', n: '챕터 제목(영문)', d: 'GOLDEN' },
      { k: 'ko', n: '하단 소개 글', d: '다섯 시의 빛은 꿀색이다.\n노을이 유리 홀을 채운다.', m: true }
    ],
    h: function (c) {
      return '<div class="lt"><span class="chip">' + c.t('chip') + '</span>' +
        '<div class="No">' + c.t('no') + '<small>' + c.t('total') + '</small></div>' +
        '<h3>' + c.t('title') + '</h3>' +
        '<p class="ko">' + c.t('ko') + '</p></div>' +
        '<div class="ph">' + c.img(0) + '</div>';
    }
  });

  /* ============================================================
     콜라주 COLLAGE
     ============================================================ */

  function headCapWrap(c, inner) {
    return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
      '<h3>' + c.h3('title') + '</h3></div>' + inner +
      '<div class="cap"><span class="kcap">' + c.t('cap1') + '</span>' +
      '<span class="kcap q">' + c.t('cap2') + '</span></div>';
  }
  var CAPTX = [
    { k: 'chip', n: '챕터 라벨', d: '01 — Scene' },
    { k: 'title', n: '제목(영문)', d: 'Bloom' },
    { k: 'cap1', n: '왼쪽 캡션', d: '구름도 파도도 전부 여름.' },
    { k: 'cap2', n: '오른쪽 인용', d: '“오늘도 좋은 하루!”' }
  ];

  reg({
    id: 'col-bloom3', cat: 'collage', n: '큰 1 + 작은 2', cls: 'ed bloom2', mir: true,
    ph: [{ n: '작은 사진(위)' }, { n: '작은 사진(아래)' }, { n: '큰 사진' }],
    tx: CAPTX,
    h: function (c) {
      return headCapWrap(c,
        '<div class="grid"><figure class="ph">' + c.img(0) + '</figure>' +
        '<figure class="ph">' + c.img(1) + '</figure>' +
        '<figure class="ph big">' + c.img(2) + '</figure></div>');
    }
  });

  reg({
    id: 'col-pair', cat: 'collage', n: '나란히 2컷', cls: 'ed stack2',
    ph: [{ n: '왼쪽 사진' }, { n: '오른쪽 사진' }],
    tx: CAPTX,
    h: function (c) {
      return headCapWrap(c,
        '<div class="grid"><figure class="ph">' + c.img(0) + '</figure>' +
        '<figure class="ph">' + c.img(1) + '</figure></div>');
    }
  });

  reg({
    id: 'col-grid4', cat: 'collage', n: '2×2 네 컷', cls: 'ed grid4',
    ph: [{ n: '사진 1' }, { n: '사진 2' }, { n: '사진 3' }, { n: '사진 4' }],
    tx: CAPTX,
    h: function (c) {
      var g = '';
      for (var i = 0; i < 4; i++) g += '<figure class="ph">' + c.img(i) + '</figure>';
      return headCapWrap(c, '<div class="grid">' + g + '</div>');
    }
  });

  reg({
    id: 'col-l3', cat: 'collage', n: '와이드 1 + 아래 2', cls: 'ed l3', mir: true,
    ph: [{ n: '와이드 사진' }, { n: '아래 왼쪽' }, { n: '아래 오른쪽' }],
    tx: CAPTX,
    h: function (c) {
      return headCapWrap(c,
        '<div class="grid"><figure class="ph wide">' + c.img(0) + '</figure>' +
        '<figure class="ph">' + c.img(1) + '</figure>' +
        '<figure class="ph">' + c.img(2) + '</figure></div>');
    }
  });

  reg({
    id: 'col-pola', cat: 'collage', n: '폴라로이드 3장', cls: 'polas',
    ph: [{ n: '폴라로이드 1' }, { n: '폴라로이드 2' }, { n: '폴라로이드 3' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '02 — Snap' },
      { k: 'title', n: '제목(영문)', d: 'Snapshots' },
      { k: 'c1', n: '캡션 1', d: '오늘의 첫 컷' },
      { k: 'c2', n: '캡션 2', d: '바람이 좋아서' },
      { k: 'c3', n: '캡션 3', d: '한 번 더!' },
      { k: 'side', n: '세로 글자', d: 'keep this moment' }
    ],
    h: function (c) {
      var pol = '';
      for (var i = 0; i < 3; i++) {
        pol += '<figure class="pol p' + i + '"><div class="pph ph">' + c.img(i) + '</div>' +
          '<figcaption>' + c.t('c' + (i + 1)) + '</figcaption></figure>';
      }
      return '<div class="head"><span class="chip" style="color:var(--acc1)">' + c.t('chip') + '</span>' +
        '<h3 style="font-family:var(--serif);font-style:italic;font-weight:900;font-size:8.5cqw">' + c.h3('title') + '</h3></div>' +
        '<div class="field">' + pol + '<span class="side">' + c.t('side') + '</span></div>';
    }
  });

  reg({
    id: 'col-film', cat: 'collage', n: '필름 스트립', cls: 'ed film', mir: true,
    ph: [{ n: '프레임 1' }, { n: '프레임 2' }, { n: '프레임 3' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '03 — Film' },
      { k: 'title', n: '제목(영문)', d: 'Rewind' },
      { k: 'body', n: '본문', d: '연속으로 눌러 담은 순간들.\n한 컷도 버릴 게 없다.', m: true },
      { k: 'q', n: '인용 한 줄', d: '“다시 봐도 좋다.”' },
      { k: 'fno', n: '필름 번호', d: 'NO. 07 — 09' }
    ],
    h: function (c) {
      var fr = '';
      for (var i = 0; i < 3; i++) fr += '<div class="ph">' + c.img(i) + '</div>';
      return '<div class="strip">' + fr + '<span class="fno">' + c.t('fno') + '</span></div>' +
        '<div class="col"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3><p>' + c.t('body') + '</p>' +
        '<span class="kcap q">' + c.t('q') + '</span></div>';
    }
  });

  reg({
    id: 'col-hero', cat: 'collage', n: '히어로 한 컷', cls: 'ed hero1',
    ph: [{ n: '큰 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '04 — Best cut' },
      { k: 'title', n: '겹치는 제목(영문)', d: 'Shine' },
      { k: 'cap1', n: '캡션', d: '오늘의 베스트 컷.' },
      { k: 'cap2', n: '인용', d: '“이 장면 하나면 충분해.”' }
    ],
    h: function (c) {
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span></div>' +
        '<figure class="ph">' + c.img(0) + '<div class="ov">' + c.h3('title') + '</div></figure>' +
        '<div class="cap"><span class="kcap">' + c.t('cap1') + '</span>' +
        '<span class="kcap q">' + c.t('cap2') + '</span></div>';
    }
  });

  reg({
    id: 'col-duocap', cat: 'collage', n: '두 컷 + 개별 캡션', cls: 'ed duo2',
    ph: [{ n: '왼쪽 사진' }, { n: '오른쪽 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '02 — Pair' },
      { k: 'title', n: '제목(영문)', d: 'Duet' },
      { k: 'a1', n: '왼쪽 라벨', d: 'Ⅰ' }, { k: 'b1', n: '왼쪽 설명', d: '창가에서' },
      { k: 'a2', n: '오른쪽 라벨', d: 'Ⅱ' }, { k: 'b2', n: '오른쪽 설명', d: '골목에서' }
    ],
    h: function (c) {
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div>' +
        '<div class="grid">' +
        '<figure><div class="ph">' + c.img(0) + '</div><figcaption><b>' + c.t('a1') + '</b><span>' + c.t('b1') + '</span></figcaption></figure>' +
        '<figure><div class="ph">' + c.img(1) + '</div><figcaption><b>' + c.t('a2') + '</b><span>' + c.t('b2') + '</span></figcaption></figure>' +
        '</div>';
    }
  });

  reg({
    id: 'col-mosaic5', cat: 'collage', n: '모자이크 5컷', cls: 'ed mosaic5', mir: true,
    ph: [{ n: '큰 사진(세로)' }, { n: '사진 2' }, { n: '사진 3' }, { n: '사진 4' }, { n: '사진 5' }],
    tx: CAPTX,
    h: function (c) {
      var g = '';
      for (var i = 0; i < 5; i++) g += '<figure class="ph g' + i + '">' + c.img(i) + '</figure>';
      return headCapWrap(c, '<div class="grid">' + g + '</div>');
    }
  });

  /* ============================================================
     사진+글 COLUMN
     ============================================================ */

  reg({
    id: 'tx-velvet', cat: 'column', n: '사진 2 + 글 칼럼', cls: 'ed velvet2', mir: true,
    ph: [{ n: '사진(위)' }, { n: '사진(아래)' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '03 — Summer' },
      { k: 'title', n: '제목(영문)', d: 'Denim' },
      { k: 'body', n: '본문', d: '하늘색 셔츠에 청반바지.\n여름의 드레스코드는\n이걸로 충분하다.', m: true },
      { k: 'q', n: '아래 인용', d: '“시원하지?”' }
    ],
    h: function (c) {
      return '<div class="col-ph"><figure class="ph">' + c.img(0) + '</figure>' +
        '<figure class="ph">' + c.img(1) + '</figure></div>' +
        '<div class="col-tx"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3><p>' + c.t('body') + '</p>' +
        '<span class="kcap q">' + c.t('q') + '</span></div>';
    }
  });

  reg({
    id: 'tx-mag', cat: 'column', n: '큰 사진 + 긴 글', cls: 'ed mag1', mir: true,
    ph: [{ n: '큰 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: 'Interview' },
      { k: 'title', n: '제목(영문)', d: 'About her' },
      { k: 'body', n: '본문(길게)', d: '카메라 앞에서 늘 웃는 사람.\n\n오늘은 조금 다른 얼굴을 보여 달라고 부탁했다.\n“이런 것도 괜찮아요?”라며 웃던 순간이\n결국 이 페이지가 되었다.', m: true },
      { k: 'q', n: '아래 인용', d: '“괜찮은 정도가 아니라니까.”' }
    ],
    h: function (c) {
      return '<figure class="ph">' + c.img(0) + '</figure>' +
        '<div class="col"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3><p>' + c.t('body') + '</p>' +
        '<span class="kcap q">' + c.t('q') + '</span></div>';
    }
  });

  reg({
    id: 'tx-inter', cat: 'column', n: '인터뷰 Q&A', cls: 'ed inter',
    ph: [{ n: '상단 와이드 사진' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Q & A' },
      { k: 'title', n: '제목(영문)', d: 'Small talk' },
      { k: 'q1', n: '질문 1', d: '요즘 제일 좋아하는 건?' },
      { k: 'a1', n: '답변 1', d: '방송 끝나고 마시는 아이스라떼. 그게 하루의 마침표예요.' },
      { k: 'q2', n: '질문 2', d: '이번 화보에서 최애 컷은?' },
      { k: 'a2', n: '답변 2', d: '노을 아래에서 찍은 컷! 빛이 진짜 예뻤거든요.' },
      { k: 'q3', n: '질문 3', d: '보는 분들께 한마디.' },
      { k: 'a3', n: '답변 3', d: '끝까지 넘겨줘서 고마워요. 다음 권에서 또 만나요!' }
    ],
    h: function (c) {
      var qa = '';
      for (var i = 1; i <= 3; i++) {
        qa += '<div><div class="qq">' + c.t('q' + i) + '</div>' +
          '<div class="aa">' + c.t('a' + i) + '</div></div>';
      }
      return '<figure class="ph">' + c.img(0) + '</figure>' +
        '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div>' +
        '<div class="qa">' + qa + '</div>';
    }
  });

  reg({
    id: 'tx-note', cat: 'column', n: '다이어리 노트', cls: 'ed note', pnumLeft: true,
    ph: [{ n: '스냅 사진' }],
    tx: [
      { k: 'date', n: '날짜(크게)', d: 'July 15' },
      { k: 'day', n: '요일/라벨', d: 'DIARY' },
      { k: 'body', n: '일기 본문', d: '오늘은 촬영이 있는 날.\n\n준비한 옷이 마음에 들어서\n아침부터 기분이 좋았다.\n\n이런 날의 기록은\n오래 남겨두고 싶다.', m: true },
      { k: 'cap', n: '사진 캡션', d: '오늘의 나' }
    ],
    h: function (c) {
      return '<div class="date"><b>' + c.t('date') + '</b><span>' + c.t('day') + '</span></div>' +
        '<div class="body">' + c.t('body') + '</div>' +
        '<figure class="snap"><span class="tape"></span><div class="pph ph">' + c.img(0) + '</div>' +
        '<figcaption>' + c.t('cap') + '</figcaption></figure>';
    }
  });

  reg({
    id: 'tx-likes', cat: 'column', n: '좋아하는 것 리스트', cls: 'ed likes', mir: true,
    ph: [{ n: '옆 사진' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Favorites' },
      { k: 'title', n: '제목(영문)', d: 'Likes' },
      { k: 'l1', n: '항목 1', d: '달콤한 디저트, 특히 마카롱' },
      { k: 'l2', n: '항목 2', d: '비 오는 날의 방송' },
      { k: 'l3', n: '항목 3', d: '새 옷 입고 거울 보기' },
      { k: 'l4', n: '항목 4', d: '시청자들이 남기는 밈' },
      { k: 'l5', n: '항목 5', d: '엔딩 직전의 정적' }
    ],
    h: function (c) {
      var no = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ'];
      var li = '';
      for (var i = 1; i <= 5; i++) li += '<li><b>' + no[i - 1] + '</b><span>' + c.t('l' + i) + '</span></li>';
      return '<div class="col"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3><ol>' + li + '</ol></div>' +
        '<figure class="ph">' + c.img(0) + '</figure>';
    }
  });

  /* ============================================================
     그리드 GRID
     ============================================================ */

  reg({
    id: 'gr-contact4', cat: 'grid', n: '콘택트 2×2', cls: 'ed contact',
    ph: [{ n: '사진 1' }, { n: '사진 2' }, { n: '사진 3' }, { n: '사진 4' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: '05 — Contact' },
      { k: 'em', n: '오른쪽 이탤릭', d: 'scenes Ⅰ–Ⅳ' },
      { k: 'c1', n: '캡션 1', d: '부채 너머' }, { k: 'c2', n: '캡션 2', d: '밤바람' },
      { k: 'c3', n: '캡션 3', d: '은장식' }, { k: 'c4', n: '캡션 4', d: '달빛 아래' }
    ],
    h: function (c) {
      var no = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'];
      var g = '';
      for (var i = 0; i < 4; i++) {
        g += '<figure><div class="ph">' + c.img(i) + '</div>' +
          '<figcaption><b>' + no[i] + '</b><span>' + c.t('c' + (i + 1)) + '</span></figcaption></figure>';
      }
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<em>' + c.t('em') + '</em></div><div class="g">' + g + '</div>';
    }
  });

  reg({
    id: 'gr-contact6', cat: 'grid', n: '콘택트 3×2', cls: 'ed contact contact6',
    ph: [{ n: '사진 1' }, { n: '사진 2' }, { n: '사진 3' }, { n: '사진 4' }, { n: '사진 5' }, { n: '사진 6' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Contact sheet' },
      { k: 'em', n: '오른쪽 이탤릭', d: 'scenes Ⅰ–Ⅵ' },
      { k: 'c1', n: '캡션 1', d: '첫 컷' }, { k: 'c2', n: '캡션 2', d: '두 번째' },
      { k: 'c3', n: '캡션 3', d: '세 번째' }, { k: 'c4', n: '캡션 4', d: '네 번째' },
      { k: 'c5', n: '캡션 5', d: '다섯 번째' }, { k: 'c6', n: '캡션 6', d: '마지막' }
    ],
    h: function (c) {
      var no = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ'];
      var g = '';
      for (var i = 0; i < 6; i++) {
        g += '<figure><div class="ph">' + c.img(i) + '</div>' +
          '<figcaption><b>' + no[i] + '</b><span>' + c.t('c' + (i + 1)) + '</span></figcaption></figure>';
      }
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<em>' + c.t('em') + '</em></div><div class="g">' + g + '</div>';
    }
  });

  reg({
    id: 'gr-strip3', cat: 'grid', n: '와이드 스트립 3', cls: 'ed strip3',
    ph: [{ n: '와이드 1' }, { n: '와이드 2' }, { n: '와이드 3' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Sequence' },
      { k: 'title', n: '제목(영문)', d: 'Motion' },
      { k: 's1', n: '라벨 1', d: 'CUT 01' }, { k: 's2', n: '라벨 2', d: 'CUT 02' }, { k: 's3', n: '라벨 3', d: 'CUT 03' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 3; i++) {
        g += '<figure><div class="ph">' + c.img(i) + '</div>' +
          '<span class="no">' + c.t('s' + (i + 1)) + '</span></figure>';
      }
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div><div class="g">' + g + '</div>';
    }
  });

  reg({
    id: 'gr-index9', cat: 'grid', n: '인덱스 3×3', cls: 'ed index9',
    ph: [{ n: '사진 1' }, { n: '사진 2' }, { n: '사진 3' }, { n: '사진 4' }, { n: '사진 5' }, { n: '사진 6' }, { n: '사진 7' }, { n: '사진 8' }, { n: '사진 9' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'All cuts' },
      { k: 'title', n: '제목(영문)', d: 'Index' },
      { k: 'cap1', n: '왼쪽 캡션', d: '이번 시즌의 모든 장면.' },
      { k: 'cap2', n: '오른쪽 인용', d: '“전부 소중해.”' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 9; i++) g += '<figure class="ph">' + c.img(i) + '</figure>';
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div><div class="g">' + g + '</div>' +
        '<div class="cap"><span class="kcap">' + c.t('cap1') + '</span>' +
        '<span class="kcap q">' + c.t('cap2') + '</span></div>';
    }
  });

  /* 인덱스 3×2 — 3×3 과 같은 모양인데 칸이 훨씬 크다(세로로 김).
     의상·굿즈처럼 한 장씩 크게 보여줄 때.
     ⚠ 이 레이아웃 자체는 새로 추가한 것이지만, 같은 회차에 engine.css 의 .index9
        (여백·제목·칸 간격)도 같이 줄였다 — 그래서 인덱스 3×3 을 쓰던 옛 프로젝트는
        열면 사진칸이 커진 모습으로 바뀐다(요청받은 개선이라 의도된 변화). */
  reg({
    id: 'gr-index6', cat: 'grid', n: '인덱스 3×2 (큰 칸)', cls: 'ed index9 index6',
    ph: [{ n: '사진 1' }, { n: '사진 2' }, { n: '사진 3' }, { n: '사진 4' }, { n: '사진 5' }, { n: '사진 6' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'All cuts' },
      { k: 'title', n: '제목(영문)', d: 'Index' },
      { k: 'cap1', n: '왼쪽 캡션', d: '이번 시즌의 모든 장면.' },
      { k: 'cap2', n: '오른쪽 인용', d: '“전부 소중해.”' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 6; i++) g += '<figure class="ph">' + c.img(i) + '</figure>';
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div><div class="g">' + g + '</div>' +
        '<div class="cap"><span class="kcap">' + c.t('cap1') + '</span>' +
        '<span class="kcap q">' + c.t('cap2') + '</span></div>';
    }
  });

  /* ============================================================
     피처·타이포 FEATURE
     ============================================================ */

  reg({
    id: 'ft-vtitle', cat: 'feature', n: '세로 타이틀', cls: 'ed winkft', mir: true,
    ph: [{ n: '사진(위)' }, { n: '사진(아래)' }],
    tx: [
      { k: 'title', n: '세로 제목(영문)', d: 'WINK' },
      { k: 'cap1', n: '캡션', d: '순간의 표정을 모아서.' },
      { k: 'cap2', n: '인용', d: '“봤어?”' }
    ],
    h: function (c) {
      var t = c.raw('title').trim();
      var _sl = splitLast(t), last = _sl.last, head = _sl.head;
      return '<div class="vt">' + c.f('title', esc(head) + '<span>' + esc(last) + '</span>') + '</div>' +
        '<div class="col"><figure class="ph">' + c.img(0) + '</figure>' +
        '<figure class="ph">' + c.img(1) + '</figure>' +
        '<div class="cap"><span class="kcap">' + c.t('cap1') + '</span>' +
        '<span class="kcap q">' + c.t('cap2') + '</span></div></div>';
    }
  });

  reg({
    id: 'ft-word', cat: 'feature', n: '밴드 + 거대 단어', cls: 'meow',
    ph: [{ n: '상단 밴드 사진' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'Keyword' },
      { k: 'title', n: '거대 단어(영문)', d: 'Lovely' },
      { k: 'ko', n: '하단 한글', d: '이 단어면 설명 끝.' },
      { k: 'no', n: '오른쪽 표기', d: 'PAGE — KEYWORD' }
    ],
    h: function (c) {
      return '<div class="band ph">' + c.img(0) + '</div>' +
        '<div class="txt"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3>' +
        '<div class="ko"><span>' + c.t('ko') + '</span><i>' + c.t('no') + '</i></div></div>';
    }
  });

  reg({
    id: 'ft-typo', cat: 'feature', n: '타이포 온리(사진 없음)', cls: 'typo',
    ph: [],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Quotes' },
      { k: 'title', n: '거대 단어(영문)', d: 'Voice' },
      { k: 'l1', n: '어록 1', d: '오늘도 와줘서 고마워.' },
      { k: 'l2', n: '어록 2', d: '이번 곡은 진짜 자신 있어.' },
      { k: 'l3', n: '어록 3', d: '다음 방송에서 봐!' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="big"><h3>' + c.h3('title') + '</h3>' +
        '<span class="star">✦</span>' +
        '<div class="lines"><p>' + c.t('l1') + '</p><p>' + c.t('l2') + '</p><p>' + c.t('l3') + '</p></div></div>';
    }
  });

  reg({
    id: 'ft-quote', cat: 'feature', n: '풀사진 + 중앙 인용', cls: 'quotefull', dark: true,
    ph: [{ n: '배경 전체 사진' }],
    tx: [
      { k: 'body', n: '인용문', d: '좋아하는 걸 좋아한다고\n말할 수 있는 방송이고 싶어.', m: true },
      { k: 'small', n: '아래 작은 표기', d: 'FROM THE INTERVIEW' }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div><div class="scrim"></div>' +
        '<div class="mid"><div class="mark">“</div><p>' + c.t('body') + '</p>' +
        '<small>' + c.t('small') + '</small></div>';
    }
  });

  reg({
    id: 'ft-stats', cat: 'feature', n: '프로필 카드', cls: 'ed stats', mir: true,
    ph: [{ n: '옆 사진' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Profile' },
      { k: 'title', n: '제목', d: 'ABOUT' },
      { k: 'k1', n: '항목 1 이름', d: '텐션' }, { k: 'v1', n: '항목 1 게이지', d: '●●●●●' },
      { k: 'k2', n: '항목 2 이름', d: '먹성' }, { k: 'v2', n: '항목 2 게이지', d: '●●●●○' },
      { k: 'k3', n: '항목 3 이름', d: '수줍음' }, { k: 'v3', n: '항목 3 게이지', d: '●●○○○' },
      { k: 'k4', n: '항목 4 이름', d: '승부욕' }, { k: 'v4', n: '항목 4 게이지', d: '●●●●○' },
      { k: 'memo', n: '하단 메모', d: '게이지는 본인 주장에 근거함.\n이의 제기는 방송 채팅으로.', m: true }
    ],
    h: function (c) {
      var rows = '';
      for (var i = 1; i <= 4; i++) {
        rows += '<div><dt>' + c.t('k' + i) + '</dt><dd>' + c.t('v' + i) + '</dd></div>';
      }
      return '<div class="col"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3><em>' + c.t('title') + '</em></h3><dl>' + rows + '</dl>' +
        '<p class="memo">' + c.t('memo') + '</p></div>' +
        '<figure class="ph">' + c.img(0) + '</figure>';
    }
  });

  /* ============================================================
     피날레·뒷표지 FINALE
     ============================================================ */

  reg({
    id: 'fin-gaze', cat: 'finale', n: '피날레 매트', cls: 'ed gazeed',
    ph: [{ n: '큰 사진' }],
    tx: [
      { k: 'side', n: '세로 글자', d: 'the last page' },
      { k: 'chip', n: '라벨', d: 'Fin' },
      { k: 'cap', n: '캡션', d: '다음 계절에 또 만나요.' },
      { k: 'fin', n: '오른쪽 마무리(영문)', d: 'See you' }
    ],
    h: function (c) {
      return '<figure class="ph">' + c.img(0) + '<span class="vside">' + c.t('side') + '</span></figure>' +
        '<div class="foot"><div><span class="chip">' + c.t('chip') + '</span>' +
        '<div class="kcap">' + c.t('cap') + '</div></div>' +
        '<div class="fin">' + c.h3('fin') + '</div></div>';
    }
  });

  reg({
    id: 'fin-full', cat: 'finale', n: '풀사진 Fin.', cls: 'finfull', dark: true, pnum: false,
    ph: [{ n: '배경 전체 사진' }],
    tx: [
      { k: 'fin', n: '마무리(영문)', d: 'Fin' },
      { k: 'cap', n: '아래 한 줄', d: '여기까지 봐줘서 고마워요.' }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div><div class="scrim"></div>' +
        '<div class="corner"><div class="fin">' + c.h3('fin') + '</div>' +
        '<div class="kcap">' + c.t('cap') + '</div></div>';
    }
  });

  reg({
    id: 'back-end', cat: 'finale', n: 'THE END + 카드', cls: 'back', pnum: false,
    ph: [{ n: '카드 사진' }],
    tx: [
      { k: 'title', n: '큰 글자', d: 'THE END' },
      { k: 'meta', n: '작은 영문 표기', d: 'PHOTOBOOK — VOL.1' },
      { k: 'ko', n: '한글 인사', d: '함께해 줘서 고마워요.\n다음 권에서 만나요.', m: true },
      { k: 'code', n: '바코드 아래 글자', d: 'SOOP LIVE' }
    ],
    h: function (c) {
      return '<div class="heart">♥</div><h4>' + c.t('title') + '</h4>' +
        '<div class="card ph">' + c.img(0) + '</div>' +
        '<div class="rule"></div><div class="meta">' + c.t('meta') + '</div>' +
        '<p class="ko">' + c.t('ko') + '</p>' +
        '<div class="code"><div class="bars"></div><small>' + c.t('code') + '</small></div>';
    }
  });

  reg({
    id: 'back-dark', cat: 'finale', n: '다크 뒷표지', cls: 'backdark', pnum: false,
    ph: [],
    tx: [
      { k: 'mast', n: '이름(영문)', d: 'YOUR NAME' },
      { k: 'ko', n: '한글 인사', d: '이 책의 모든 장면은\n당신을 위해 준비했습니다.', m: true },
      { k: 'code', n: '바코드 아래 글자', d: 'SOOP LIVE — VOL.1' }
    ],
    h: function (c) {
      var t = c.raw('mast').trim();
      var _sl = splitLast(t), last = _sl.last, head = _sl.head;
      return '<div class="mast">' + c.f('mast', esc(head) + '<span>' + esc(last) + '</span>') + '</div>' +
        '<div class="heart">♥</div><p class="ko">' + c.t('ko') + '</p>' +
        '<div class="code"><div class="bars"></div><small>' + c.t('code') + '</small></div>';
    }
  });

  reg({
    id: 'back-credits', cat: 'finale', n: '크레딧', cls: 'credits', pnum: false,
    ph: [{ n: '작은 사진' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Credits' },
      { k: 'r1', n: '역할 1', d: 'MODEL' }, { k: 'v1', n: '이름 1', d: '이름' },
      { k: 'r2', n: '역할 2', d: 'PHOTO' }, { k: 'v2', n: '이름 2', d: '이름' },
      { k: 'r3', n: '역할 3', d: 'DESIGN' }, { k: 'v3', n: '이름 3', d: '이름' },
      { k: 'r4', n: '역할 4', d: 'SPECIAL THANKS' }, { k: 'v4', n: '이름 4', d: '시청자 여러분' },
      { k: 'thanks', n: '마지막 인사', d: '“다음 계절에 또 만나요.”' }
    ],
    h: function (c) {
      var rows = '';
      for (var i = 1; i <= 4; i++) {
        rows += '<div><dt>' + c.t('r' + i) + '</dt><dd>' + c.t('v' + i) + '</dd></div>';
      }
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="snap ph">' + c.img(0) + '</div>' +
        '<dl>' + rows + '</dl><div class="rule"></div>' +
        '<p class="thanks">' + c.t('thanks') + '</p>';
    }
  });

  /* ============================================================
     추가 레이아웃 20종 (v2)
     ============================================================ */

  reg({
    id: 'cover-poster', cat: 'cover', n: '포스터 프레임', cls: 'coverposter', pnum: false,
    ph: [{ n: '중앙 사진' }],
    tx: [
      { k: 'tag', n: '상단 작은 문구', d: 'A PORTRAIT COLLECTION' },
      { k: 'mast', n: '제호(영문 이름)', d: 'YOUR NAME' },
      { k: 'vol', n: '왼쪽 하단', d: 'VOL.1' },
      { k: 'season', n: '오른쪽 하단', d: '2026 SUMMER' }
    ],
    h: function (c) {
      var m = c.mast('mast');
      return '<div class="inframe"><div class="cv-tag">' + c.t('tag') + '</div>' +
        '<h1 class="cv-mast' + m.cls + '">' + m.txt + '</h1>' +
        '<div class="ph">' + c.img(0) + '</div>' +
        '<div class="foot"><span class="cv-volbox">' + c.t('vol') + '</span>' +
        '<span class="cv-season">' + c.t('season') + '</span></div></div>';
    }
  });

  reg({
    id: 'dv-min', cat: 'divider', n: '미니멀 챕터(사진 없음)', cls: 'dvmin',
    ph: [],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: 'CHAPTER' },
      { k: 'no', n: '큰 숫자', d: '02' },
      { k: 'title', n: '챕터 제목(영문)', d: 'ANGEL' },
      { k: 'ko', n: '한 줄 소개', d: '노란 후드에 조그만 날개.' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="No">' + c.t('no') + '</div>' +
        '<h3>' + c.t('title') + '</h3>' +
        '<p class="ko">' + c.t('ko') + '</p>';
    }
  });

  reg({
    id: 'col-fullb', cat: 'collage', n: '풀블리드 한 컷', cls: 'colfull', dark: true, pnum: false,
    ph: [{ n: '배경 전체 사진' }],
    tx: [
      { k: 'chip', n: '라벨', d: '02 — Full cut' },
      { k: 'cap', n: '캡션(한글)', d: '설명이 필요 없는 장면.' },
      { k: 'fin', n: '오른쪽 영문', d: 'One shot' }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div><div class="scrim"></div>' +
        '<div class="txt"><div><span class="chip">' + c.t('chip') + '</span>' +
        '<div class="kcap">' + c.t('cap') + '</div></div>' +
        '<div class="fin">' + c.h3('fin') + '</div></div>';
    }
  });

  reg({
    id: 'col-trip3', cat: 'collage', n: '세로 3연폭', cls: 'ed trip3',
    ph: [{ n: '왼쪽' }, { n: '가운데' }, { n: '오른쪽' }],
    tx: CAPTX,
    h: function (c) {
      var g = '';
      for (var i = 0; i < 3; i++) g += '<figure class="ph">' + c.img(i) + '</figure>';
      return headCapWrap(c, '<div class="grid">' + g + '</div>');
    }
  });

  reg({
    id: 'col-hstack2', cat: 'collage', n: '와이드 2단', cls: 'ed hstack2',
    ph: [{ n: '위 와이드' }, { n: '아래 와이드' }],
    tx: CAPTX,
    h: function (c) {
      return headCapWrap(c,
        '<div class="grid"><figure class="ph">' + c.img(0) + '</figure>' +
        '<figure class="ph">' + c.img(1) + '</figure></div>');
    }
  });

  reg({
    id: 'col-one4', cat: 'collage', n: '큰 1 + 작은 4', cls: 'ed one4', mir: true,
    ph: [{ n: '큰 사진' }, { n: '작은 1' }, { n: '작은 2' }, { n: '작은 3' }, { n: '작은 4' }],
    tx: CAPTX,
    h: function (c) {
      var g = '<figure class="ph big">' + c.img(0) + '</figure>';
      for (var i = 1; i < 5; i++) g += '<figure class="ph">' + c.img(i) + '</figure>';
      return headCapWrap(c, '<div class="grid">' + g + '</div>');
    }
  });

  reg({
    id: 'col-min1', cat: 'collage', n: '미니멀 한 컷(여백)', cls: 'min1',
    ph: [{ n: '가운데 사진' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Stillness' },
      { k: 'cap', n: '캡션(한글)', d: '조용한 페이지 하나쯤은.' },
      { k: 'en', n: '아래 영문 한 줄', d: 'less, but better' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="ph">' + c.img(0) + '</div>' +
        '<div class="kcap">' + c.t('cap') + '</div>' +
        '<div class="en">' + c.t('en') + '</div>';
    }
  });

  reg({
    id: 'col-diag', cat: 'collage', n: '대각 듀오', cls: 'diag',
    ph: [{ n: '왼쪽 위 사진' }, { n: '오른쪽 아래 사진' }],
    tx: [
      { k: 'la', n: '왼쪽 위 라벨', d: 'Day' },
      { k: 'lb', n: '오른쪽 아래 라벨', d: 'Night' }
    ],
    h: function (c) {
      return '<div class="ph a">' + c.img(0) + '</div>' +
        '<div class="ph b">' + c.img(1) + '</div>' +
        '<span class="lab la">' + c.h3('la') + '</span>' +
        '<span class="lab lb">' + c.h3('lb') + '</span>';
    }
  });

  reg({
    id: 'col-band3', cat: 'collage', n: '가로 밴드 3(풀폭)', cls: 'band3',
    ph: [{ n: '밴드 1' }, { n: '밴드 2' }, { n: '밴드 3' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'Sequence' },
      { k: 'cap', n: '하단 캡션', d: '연속된 세 장면.' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 3; i++) g += '<div class="ph">' + c.img(i) + '</div>';
      return '<div class="bands">' + g + '</div>' +
        '<div class="foot"><span class="chip">' + c.t('chip') + '</span>' +
        '<span class="kcap">' + c.t('cap') + '</span></div>';
    }
  });

  reg({
    id: 'tx-essay', cat: 'column', n: '2단 에세이', cls: 'ed essay',
    ph: [{ n: '상단 와이드 사진' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'Essay' },
      { k: 'title', n: '제목(영문)', d: 'Behind' },
      { k: 'body', n: '본문(길게)', d: '촬영이 끝나고 나면 늘 같은 질문을 한다. 오늘 제일 좋았던 순간이 언제였냐고.\n\n대답은 매번 다르지만, 공통점이 하나 있다. 전부 카메라를 의식하지 않던 순간이라는 것. 그래서 이 책의 절반은 몰래 찍은 컷이다.\n\n들키면 혼나겠지만, 후회는 없다.', m: true }
    ],
    h: function (c) {
      return '<figure class="ph">' + c.img(0) + '</figure>' +
        '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div>' +
        '<div class="cols">' + c.t('body') + '</div>';
    }
  });

  reg({
    id: 'tx-poem', cat: 'column', n: '시·가사(사진 없음)', cls: 'poem',
    ph: [],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Lyrics' },
      { k: 'title', n: '제목(영문)', d: 'Verse' },
      { k: 'body', n: '가사/시 본문', d: '오늘도 모니터 너머로\n손을 흔드는 너에게\n\n닿지 않아도 닿은 것처럼\n웃어 보이는 나에게', m: true },
      { k: 'src', n: '아래 작은 표기', d: 'FROM THE UNRELEASED TRACK' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3>' +
        '<div class="lines">' + c.t('body') + '</div>' +
        '<span class="star">✦</span>' +
        '<span class="src">' + c.t('src') + '</span>';
    }
  });

  reg({
    id: 'tx-timeline', cat: 'column', n: '타임라인', cls: 'ed timeline', mir: true,
    ph: [{ n: '옆 사진' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'One day' },
      { k: 'title', n: '제목(영문)', d: 'Routine' },
      { k: 't1', n: '시간 1', d: 'PM 2:00' }, { k: 'e1', n: '내용 1', d: '기상. 오늘도 건강한 생활' },
      { k: 't2', n: '시간 2', d: 'PM 6:00' }, { k: 'e2', n: '내용 2', d: '방송 준비, 셋리스트 고민' },
      { k: 't3', n: '시간 3', d: 'PM 8:00' }, { k: 'e3', n: '내용 3', d: '방송 시작! 오늘은 노래방송' },
      { k: 't4', n: '시간 4', d: 'AM 1:00' }, { k: 'e4', n: '내용 4', d: '엔딩 후 야식과 함께 마무리' }
    ],
    h: function (c) {
      var li = '';
      for (var i = 1; i <= 4; i++) {
        li += '<li><b>' + c.t('t' + i) + '</b><span>' + c.t('e' + i) + '</span></li>';
      }
      return '<div class="col"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3><ol>' + li + '</ol></div>' +
        '<figure class="ph">' + c.img(0) + '</figure>';
    }
  });

  reg({
    id: 'gr-vert4', cat: 'grid', n: '세로 4분할', cls: 'ed vert4',
    ph: [{ n: '사진 1' }, { n: '사진 2' }, { n: '사진 3' }, { n: '사진 4' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'Four cuts' },
      { k: 'title', n: '제목(영문)', d: 'Frames' },
      { k: 'cap1', n: '왼쪽 캡션', d: '네 컷이면 충분한 이야기.' },
      { k: 'cap2', n: '오른쪽 인용', d: '“한 장 더?”' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 4; i++) g += '<figure class="ph">' + c.img(i) + '</figure>';
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div><div class="g">' + g + '</div>' +
        '<div class="cap"><span class="kcap">' + c.t('cap1') + '</span>' +
        '<span class="kcap q">' + c.t('cap2') + '</span></div>';
    }
  });

  reg({
    id: 'gr-win4', cat: 'grid', n: '창문 프레임 2×2', cls: 'win4',
    ph: [{ n: '사진 1' }, { n: '사진 2' }, { n: '사진 3' }, { n: '사진 4' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Window' },
      { k: 'cap', n: '하단 캡션', d: '창문 너머로 본 네 개의 계절.' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 4; i++) g += '<div class="ph">' + c.img(i) + '</div>';
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="frame">' + g + '</div>' +
        '<div class="kcap">' + c.t('cap') + '</div>';
    }
  });

  reg({
    id: 'gr-film4h', cat: 'grid', n: '가로 필름 밴드', cls: 'film4h',
    ph: [{ n: '프레임 1' }, { n: '프레임 2' }, { n: '프레임 3' }, { n: '프레임 4' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'Contact roll' },
      { k: 'title', n: '제목(영문)', d: 'Roll 35' },
      { k: 'cap', n: '하단 캡션', d: '한 롤을 다 쓴 날.' },
      { k: 'no', n: '오른쪽 표기', d: 'NO. 24 — 27' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 4; i++) g += '<div class="ph">' + c.img(i) + '</div>';
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div>' +
        '<div class="strip">' + g + '</div>' +
        '<div class="foot"><span class="kcap">' + c.t('cap') + '</span>' +
        '<span class="no">' + c.t('no') + '</span></div>';
    }
  });

  reg({
    id: 'ft-ticket', cat: 'feature', n: '포토카드 티켓', cls: 'ticket',
    ph: [{ n: '카드 사진' }],
    tx: [
      { k: 'title', n: '카드 이름(영문)', d: 'Photocard' },
      { k: 'r1a', n: '왼쪽 표기 1', d: 'DATE' }, { k: 'r1b', n: '오른쪽 값 1', d: '2026. 07. 15' },
      { k: 'r2a', n: '왼쪽 표기 2', d: 'NO' }, { k: 'r2b', n: '오른쪽 값 2', d: '001 / 100' },
      { k: 'ko', n: '아래 문구(한글)', d: '소중히 간직해 주세요.' }
    ],
    h: function (c) {
      return '<div class="card"><div class="ph">' + c.img(0) + '</div>' +
        '<div class="info"><div class="tname">' + c.h3('title') + '</div>' +
        '<div class="trow"><span>' + c.t('r1a') + '</span><b>' + c.t('r1b') + '</b></div>' +
        '<div class="trow"><span>' + c.t('r2a') + '</span><b>' + c.t('r2b') + '</b></div>' +
        '<div class="tko">' + c.t('ko') + '</div></div></div>';
    }
  });

  reg({
    id: 'ft-date', cat: 'feature', n: '거대 날짜', cls: 'bigdate',
    ph: [{ n: '아래 사진' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'The day' },
      { k: 'no', n: '큰 날짜', d: '07.15' },
      { k: 'sub', n: '날짜 아래 표기', d: 'WEDNESDAY — RAINY THEN CLEAR' },
      { k: 'cap', n: '하단 캡션', d: '기억해 둘 것. 오늘 같은 날.' }
    ],
    h: function (c) {
      var v = c.raw('no').trim();
      var parts = v.split('.');
      var html = parts.length > 1
        ? esc(parts[0]) + '<span>.</span>' + esc(parts.slice(1).join('.'))
        : esc(v);
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="No">' + c.f('no', html) + '</div>' +
        '<div class="sub">' + c.t('sub') + '</div>' +
        '<figure class="ph">' + c.img(0) + '</figure>' +
        '<div class="kcap">' + c.t('cap') + '</div>';
    }
  });

  reg({
    id: 'ft-marquee', cat: 'feature', n: '반복 타이포 밴드', cls: 'marquee',
    ph: [{ n: '가운데 밴드 사진' }],
    tx: [
      { k: 'word', n: '반복할 단어(영문)', d: 'LOVELY' },
      { k: 'chip', n: '하단 라벨', d: 'Keyword' },
      { k: 'cap', n: '하단 캡션', d: '오늘의 단어.' }
    ],
    h: function (c) {
      var w = esc(c.raw('word').trim() || 'LOVELY');
      function row(cls) {
        var s = '';
        for (var i = 0; i < 6; i++) s += w + '<i>✦</i>';
        return '<div class="row ' + cls + '">' + c.f('word', s) + '</div>';
      }
      return row('') + row('o') +
        '<div class="band ph">' + c.img(0) + '</div>' +
        row('o') +
        '<div class="foot"><span class="chip">' + c.t('chip') + '</span>' +
        '<span class="kcap">' + c.t('cap') + '</span></div>';
    }
  });

  reg({
    id: 'ft-rank', cat: 'feature', n: 'BEST 3', cls: 'ed rank3',
    ph: [{ n: '2위 사진(왼쪽)' }, { n: '1위 사진(가운데)' }, { n: '3위 사진(오른쪽)' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'Ranking' },
      { k: 'title', n: '제목(영문)', d: 'Best 3' },
      { k: 'c2', n: '2위 설명', d: '아슬아슬 2위' },
      { k: 'c1', n: '1위 설명', d: '이번 시즌 최애 컷' },
      { k: 'c3', n: '3위 설명', d: '숨은 명장면' }
    ],
    h: function (c) {
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div>' +
        '<div class="g">' +
        '<figure><div class="rno">Ⅱ</div><div class="ph">' + c.img(0) + '</div><figcaption>' + c.t('c2') + '</figcaption></figure>' +
        '<figure class="first"><div class="rno">Ⅰ</div><div class="ph">' + c.img(1) + '</div><figcaption>' + c.t('c1') + '</figcaption></figure>' +
        '<figure><div class="rno">Ⅲ</div><div class="ph">' + c.img(2) + '</div><figcaption>' + c.t('c3') + '</figcaption></figure>' +
        '</div>';
    }
  });

  reg({
    id: 'fin-pola', cat: 'finale', n: '마지막 폴라로이드', cls: 'finpola', pnum: false,
    ph: [{ n: '폴라로이드 사진' }],
    tx: [
      { k: 'cap', n: '폴라로이드 캡션', d: 'thank you ♡' },
      { k: 'ko', n: '마지막 인사', d: '끝까지 넘겨줘서 고마워요.\n다음 계절에 또 만나요.', m: true }
    ],
    h: function (c) {
      return '<figure class="pol"><div class="pph ph">' + c.img(0) + '</div>' +
        '<figcaption>' + c.t('cap') + '</figcaption></figure>' +
        '<div class="heart">♥</div>' +
        '<p class="ko">' + c.t('ko') + '</p>';
    }
  });

  /* ============================================================
     추가 레이아웃 40종 (v4 — 폴라로이드·스크랩·감성카드)
     ============================================================ */
  function pol(c, i, capKey, cls) {
    return '<figure class="polc ' + (cls || '') + '"><div class="pph ph">' + c.img(i) + '</div>' +
      (capKey ? '<figcaption>' + c.t(capKey) + '</figcaption>' : '') + '</figure>';
  }

  /* ── 목차·프롤로그 6종 ── */
  reg({
    id: 'toc-pola', cat: 'front', n: '폴라로이드 목차', cls: 'toc2',
    ph: [{ n: '폴라로이드(위)' }, { n: '폴라로이드(아래)' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Contents' },
      { k: 'title', n: '제목', d: 'Index' },
      { k: 'n1', n: '챕터1 이름', d: 'Meadow' }, { k: 'p1', n: '쪽', d: '04' },
      { k: 'n2', n: '챕터2 이름', d: 'Angel' }, { k: 'p2', n: '쪽', d: '08' },
      { k: 'n3', n: '챕터3 이름', d: 'Summer' }, { k: 'p3', n: '쪽', d: '12' },
      { k: 'n4', n: '챕터4 이름', d: 'Bloom' }, { k: 'p4', n: '쪽', d: '18' },
      { k: 'note', n: '하단 소개', d: '마음에 드는 장부터\n펼쳐도 좋아요.', m: true },
      { k: 'c1', n: '폴라 캡션1', d: 'moment 01' }, { k: 'c2', n: '폴라 캡션2', d: 'moment 02' }
    ],
    h: function (c) {
      var no = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], li = '';
      for (var i = 1; i <= 4; i++) {
        li += '<li><b>' + no[i - 1] + '</b><span class="nm">' + c.t('n' + i) + '</span>' +
          '<span class="dots"></span><span class="pgn">' + c.t('p' + i) + '</span></li>';
      }
      return '<div class="lt"><span class="chip">' + c.t('chip') + '</span>' +
        '<h2>' + c.t('title') + '</h2><ol>' + li + '</ol>' +
        '<p class="note">' + c.t('note') + '</p></div>' +
        '<div class="rt"><span class="tp"></span>' + pol(c, 0, 'c1', 'a') + pol(c, 1, 'c2', 'b') + '</div>';
    }
  });

  reg({
    id: 'toc-film', cat: 'front', n: '필름 목차', cls: 'toc3',
    ph: [{ n: '필름 1' }, { n: '필름 2' }, { n: '필름 3' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Contents' },
      { k: 'title', n: '제목(영문)', d: 'Scenes' },
      { k: 'n1', n: '챕터1 영문', d: 'Meadow' }, { k: 's1', n: '챕터1 한글', d: '초원에서의 오후 — 04' },
      { k: 'n2', n: '챕터2 영문', d: 'Angel' }, { k: 's2', n: '챕터2 한글', d: '노란 후드와 날개 — 08' },
      { k: 'n3', n: '챕터3 영문', d: 'Summer' }, { k: 's3', n: '챕터3 한글', d: '파도와 데님 — 12' },
      { k: 'n4', n: '챕터4 영문', d: 'Bloom' }, { k: 's4', n: '챕터4 한글', d: '장미와 레이스 — 18' }
    ],
    h: function (c) {
      var fr = '';
      for (var i = 0; i < 3; i++) fr += '<div class="ph">' + c.img(i) + '</div>';
      var no = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], rows = '';
      for (var j = 1; j <= 4; j++) {
        rows += '<div><dt><i>' + no[j - 1] + '</i>' + c.t('n' + j) + '</dt><dd>' + c.t('s' + j) + '</dd></div>';
      }
      return '<div class="strip">' + fr + '</div>' +
        '<div class="col"><span class="chip">' + c.t('chip') + '</span>' +
        '<h2>' + c.h3('title') + '</h2><dl>' + rows + '</dl></div>';
    }
  });

  reg({
    id: 'toc-ticket', cat: 'front', n: '티켓 목차', cls: 'toc4',
    ph: [],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Contents' },
      { k: 'title', n: '제목', d: 'LINE-UP' },
      { k: 'n1', n: '챕터1 이름', d: 'Meadow' }, { k: 's1', n: '챕터1 설명', d: '초원에서의 오후' }, { k: 'p1', n: '쪽', d: 'P.04' },
      { k: 'n2', n: '챕터2 이름', d: 'Angel' }, { k: 's2', n: '챕터2 설명', d: '노란 후드와 날개' }, { k: 'p2', n: '쪽', d: 'P.08' },
      { k: 'n3', n: '챕터3 이름', d: 'Summer' }, { k: 's3', n: '챕터3 설명', d: '파도와 데님' }, { k: 'p3', n: '쪽', d: 'P.12' },
      { k: 'n4', n: '챕터4 이름', d: 'Bloom' }, { k: 's4', n: '챕터4 설명', d: '장미와 레이스' }, { k: 'p4', n: '쪽', d: 'P.18' }
    ],
    h: function (c) {
      var no = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'], rows = '';
      for (var i = 1; i <= 4; i++) {
        rows += '<div class="tik"><b>' + no[i - 1] + '</b>' +
          '<div><div class="nm">' + c.t('n' + i) + '</div><div class="sub">' + c.t('s' + i) + '</div></div>' +
          '<span class="pgn">' + c.t('p' + i) + '</span></div>';
      }
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<h2>' + c.t('title') + '</h2>' + rows;
    }
  });

  reg({
    id: 'toc-mag', cat: 'front', n: '매거진 목차(썸네일 6)', cls: 'toc5',
    ph: [{ n: '썸네일 1' }, { n: '썸네일 2' }, { n: '썸네일 3' }, { n: '썸네일 4' }, { n: '썸네일 5' }, { n: '썸네일 6' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Contents' },
      { k: 'title', n: '제목', d: 'In this issue' },
      { k: 'c1', n: '캡션1', d: '초원 · 04' }, { k: 'c2', n: '캡션2', d: '날개 · 08' },
      { k: 'c3', n: '캡션3', d: '여름 · 12' }, { k: 'c4', n: '캡션4', d: '노을 · 14' },
      { k: 'c5', n: '캡션5', d: '치파오 · 16' }, { k: 'c6', n: '캡션6', d: '장미 · 18' },
      { k: 'foot', n: '하단 한 줄', d: '여섯 개의 장면으로 남긴 한 계절.' }
    ],
    h: function (c) {
      var no = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ'], g = '';
      for (var i = 0; i < 6; i++) {
        g += '<figure><span class="no">' + no[i] + '</span><div class="ph">' + c.img(i) + '</div>' +
          '<figcaption>' + c.t('c' + (i + 1)) + '</figcaption></figure>';
      }
      var t = c.raw('title').trim();
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<h2>' + c.f('title', esc(t)) + '</h2>' +
        '<div class="g">' + g + '</div>' +
        '<div class="foot">' + c.t('foot') + '</div>';
    }
  });

  reg({
    id: 'pro-scrap', cat: 'front', n: '스크랩 프롤로그', cls: 'pro2',
    ph: [{ n: '기울어진 사진' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Prologue' },
      { k: 'memo', n: '메모(손글씨 느낌)', d: '이 책은 한 계절의 스크랩북.\n\n좋았던 순간만 골라\n붙여 두었습니다.', m: true }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="fld"><div class="shot"><span class="tp"></span><div class="pph ph">' + c.img(0) + '</div></div>' +
        '<div class="memo">' + c.t('memo') + '</div>' +
        '<span class="hrt">♥</span></div>';
    }
  });

  reg({
    id: 'pro-air', cat: 'front', n: '항공우편 프롤로그', cls: 'pro3',
    ph: [{ n: '우표 사진' }],
    tx: [
      { k: 'chip', n: '상단 라벨', d: 'Air mail' },
      { k: 'title', n: '제목(영문)', d: 'Prologue' },
      { k: 'body', n: '본문', d: '어딘가 멀리서 도착한\n편지처럼 읽어 주세요.\n\n소인이 찍힌 날짜는\n우리가 함께한 계절입니다.', m: true },
      { k: 'post', n: '소인 글자', d: 'SOOP POST 2026' }
    ],
    h: function (c) {
      return '<div class="inner"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3>' +
        '<div class="row"><div class="stampf"><div class="pph ph">' + c.img(0) + '</div></div>' +
        '<div class="lt">' + c.t('body') + '</div></div>' +
        '<div class="post">' + c.t('post') + '</div></div>';
    }
  });

  /* ── 폴라로이드·스크랩 콜라주 14종 ── */
  reg({
    id: 'pola-grid4', cat: 'collage', n: '폴라로이드 4장', cls: 'pola4',
    ph: [{ n: '폴라 1' }, { n: '폴라 2' }, { n: '폴라 3' }, { n: '폴라 4' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '01 — Snap' },
      { k: 'title', n: '제목(영문)', d: 'Moments' },
      { k: 'c1', n: '캡션1', d: '첫 컷' }, { k: 'c2', n: '캡션2', d: '두 번째' },
      { k: 'c3', n: '캡션3', d: '세 번째' }, { k: 'c4', n: '캡션4', d: '마지막' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 4; i++) {
        g += '<figure class="polc"><span class="tp"></span><div class="pph ph">' + c.img(i) + '</div>' +
          '<figcaption>' + c.t('c' + (i + 1)) + '</figcaption></figure>';
      }
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div><div class="g">' + g + '</div>';
    }
  });

  reg({
    id: 'pola-line', cat: 'collage', n: '빨랫줄 폴라로이드', cls: 'polaline',
    ph: [{ n: '폴라 1(왼쪽 위)' }, { n: '폴라 2(오른쪽 위)' }, { n: '폴라 3(아래)' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '02 — Line' },
      { k: 'c1', n: '캡션1', d: '맑음' }, { k: 'c2', n: '캡션2', d: '산들바람' }, { k: 'c3', n: '캡션3', d: '오후 세 시' },
      { k: 'cap', n: '하단 캡션', d: '햇볕에 말리는 중인 기억들.' }
    ],
    h: function (c) {
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span></div>' +
        '<div class="rope r1"></div><div class="rope r2"></div>' +
        pol(c, 0, 'c1', 'a') + pol(c, 1, 'c2', 'b') + pol(c, 2, 'c3', 'c') +
        '<span class="peg pa"></span><span class="peg pb"></span><span class="peg pc"></span>' +
        '<div class="cap">' + c.t('cap') + '</div>';
    }
  });

  reg({
    id: 'pola-stack', cat: 'collage', n: '폴라로이드 무더기', cls: 'polastack',
    ph: [{ n: '맨 아래 폴라' }, { n: '가운데 폴라' }, { n: '맨 위 폴라' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '03 — Pile' },
      { k: 'title', n: '세로 제목(영문)', d: 'Stack' },
      { k: 'c3', n: '맨 위 캡션', d: '오늘의 최애 컷' }
    ],
    h: function (c) {
      var t = c.raw('title').trim();
      var _sl = splitLast(t), last = _sl.last, head = _sl.head;
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="fld">' + pol(c, 0, null, 'a') + pol(c, 1, null, 'b') + pol(c, 2, 'c3', 'c') + '</div>' +
        '<div class="vt">' + c.f('title', esc(head) + '<span>' + esc(last) + '</span>') + '</div>';
    }
  });

  reg({
    id: 'scrap-tape2', cat: 'collage', n: '마스킹테이프 2컷', cls: 'tape2',
    ph: [{ n: '왼쪽 위 사진' }, { n: '오른쪽 아래 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '04 — Scrap' },
      { k: 'title', n: '제목(영문)', d: 'Diary' },
      { k: 'memo', n: '오른쪽 메모', d: '오늘 찍은 것 중\n제일 마음에 드는 두 장.', m: true }
    ],
    h: function (c) {
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div>' +
        '<div class="fld">' +
        '<div class="shot a"><span class="tp"></span><span class="tp t2"></span><div class="pph ph">' + c.img(0) + '</div></div>' +
        '<div class="shot b"><span class="tp"></span><span class="tp t2"></span><div class="pph ph">' + c.img(1) + '</div></div>' +
        '<div class="memo">' + c.t('memo') + '</div></div>';
    }
  });

  reg({
    id: 'scrap-corner', cat: 'collage', n: '앨범 코너 2컷', cls: 'corner2',
    ph: [{ n: '왼쪽 사진' }, { n: '오른쪽 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '05 — Album' },
      { k: 'title', n: '오른쪽 이탤릭', d: 'old album' },
      { k: 'c1', n: '왼쪽 캡션', d: '그날의 우리' }, { k: 'c2', n: '오른쪽 캡션', d: '그리고 다음 날' }
    ],
    h: function (c) {
      function fr(i, cap) {
        return '<figure><div class="fr"><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i>' +
          '<div class="ph">' + c.img(i) + '</div></div>' +
          '<figcaption>' + c.t(cap) + '</figcaption></figure>';
      }
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<em style="font-family:var(--serif);font-style:italic;font-size:3.4cqw;color:var(--soft)">' + c.t('title') + '</em></div>' +
        '<div class="g">' + fr(0, 'c1') + fr(1, 'c2') + '</div>';
    }
  });

  reg({
    id: 'tilt-hero', cat: 'collage', n: '기울어진 히어로+클립', cls: 'tilthero',
    ph: [{ n: '큰 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '06 — Pin up' },
      { k: 'title', n: '제목(영문)', d: 'Today' },
      { k: 'cap', n: '캡션', d: '벽에 붙여두고 싶은 하루.' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="shot"><span class="clip"></span><div class="pph ph">' + c.img(0) + '</div></div>' +
        '<h3>' + c.h3('title') + '</h3>' +
        '<div class="kcap2">' + c.t('cap') + '</div>';
    }
  });

  reg({
    id: 'tilt-duo', cat: 'collage', n: '엇갈린 두 컷', cls: 'tiltduo',
    ph: [{ n: '왼쪽 위 사진' }, { n: '오른쪽 아래 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '07 — Cross' },
      { k: 'title', n: '제목(영문)', d: 'Both' },
      { k: 'q', n: '오른쪽 인용', d: '“둘 중에\n못 고르겠어.”', m: true }
    ],
    h: function (c) {
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div>' +
        '<div class="fld">' +
        '<div class="shot a"><div class="pph ph">' + c.img(0) + '</div></div>' +
        '<div class="shot b"><div class="pph ph">' + c.img(1) + '</div></div>' +
        '<div class="q2">' + c.t('q') + '</div></div>';
    }
  });

  reg({
    id: 'tape-trio', cat: 'collage', n: '지그재그 3컷', cls: 'tapetrio',
    ph: [{ n: '위 사진' }, { n: '가운데 사진' }, { n: '아래 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '08 — Zigzag' },
      { k: 'title', n: '오른쪽 이탤릭', d: 'step by step' },
      { k: 'cap', n: '하단 캡션', d: '하나씩 붙이다 보니 하루가 다 갔다.' }
    ],
    h: function (c) {
      function sh(cls, i) {
        return '<div class="shot ' + cls + '"><span class="tp"></span><div class="pph ph">' + c.img(i) + '</div></div>';
      }
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<em style="font-family:var(--serif);font-style:italic;font-size:3.4cqw;color:var(--soft)">' + c.t('title') + '</em></div>' +
        '<div class="fld"><div class="cline"></div>' + sh('a', 0) + sh('b', 1) + sh('c', 2) +
        '<div class="kcap3">' + c.t('cap') + '</div></div>';
    }
  });

  reg({
    id: 'clip-board', cat: 'collage', n: '클립보드', cls: 'clipbd',
    ph: [{ n: '보드 사진' }],
    tx: [
      { k: 'title', n: '제목(영문)', d: 'Checklist' },
      { k: 'body', n: '메모 줄글', d: '오늘 할 일:\n예쁘게 웃기 — 완료\n맛있는 거 먹기 — 완료\n행복하기 — 진행 중', m: true }
    ],
    h: function (c) {
      return '<div class="board"><span class="metal"></span>' +
        '<div class="paper"><div class="ttl">' + c.h3('title') + '</div>' +
        '<div class="ph">' + c.img(0) + '</div>' +
        '<div class="ln">' + c.t('body') + '</div></div></div>';
    }
  });

  reg({
    id: 'pin-board', cat: 'collage', n: '코르크 핀보드', cls: 'pinbd',
    ph: [{ n: '왼쪽 사진' }, { n: '오른쪽 사진' }, { n: '아래 사진' }],
    tx: [
      { k: 'title', n: '보드 제목(영문)', d: 'My board' },
      { k: 'note', n: '메모지', d: '이번 주\n최고의 순간들 ★', m: true }
    ],
    h: function (c) {
      function sh(cls, i) {
        return '<div class="shot ' + cls + '"><span class="pinDot" style="top:-1.2cqw;left:46%"></span>' +
          '<div class="pph ph">' + c.img(i) + '</div></div>';
      }
      return '<div class="cork">' +
        '<div class="ttl">' + c.h3('title') + '</div>' +
        sh('a', 0) + sh('b', 1) + sh('c', 2) +
        '<div class="note"><span class="pinDot" style="top:-1.2cqw;left:46%"></span>' + c.t('note') + '</div></div>';
    }
  });

  reg({
    id: 'sticker-page', cat: 'collage', n: '스티커 페이지', cls: 'stickpg',
    ph: [{ n: '가운데 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '09 — Deco' },
      { k: 'badge', n: '동그란 뱃지 글자', d: '오늘도\n최고!', m: true },
      { k: 'cap', n: '하단 캡션', d: '스티커 붙이고 싶은 사진 1호.' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="ph">' + c.img(0) + '</div>' +
        '<span class="st h1">♥</span><span class="st h2">✦</span><span class="st h3">★</span>' +
        '<div class="bdg">' + c.t('badge') + '</div>' +
        '<div class="kcap4">' + c.t('cap') + '</div>';
    }
  });

  reg({
    id: 'torn-page', cat: 'collage', n: '찢은 종이', cls: 'tornpg', dark: true,
    ph: [{ n: '배경 전체 사진' }],
    tx: [
      { k: 'chip', n: '라벨', d: '10 — Torn' },
      { k: 'cap', n: '하단 캡션', d: '찢고 나니 더 예쁘잖아.' },
      { k: 'fin', n: '오른쪽 영문', d: 'Rip it' }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div>' +
        '<div class="torn t"></div><div class="torn b"></div>' +
        '<div class="hd"><span class="chip">' + c.t('chip') + '</span></div>' +
        '<div class="cap5"><span class="kcap">' + c.t('cap') + '</span>' +
        '<span class="fin">' + c.h3('fin') + '</span></div>';
    }
  });

  reg({
    id: 'arch-win', cat: 'collage', n: '아치 창문 3', cls: 'archwin',
    ph: [{ n: '왼쪽 창' }, { n: '가운데 창(큰)' }, { n: '오른쪽 창' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '11 — Window' },
      { k: 'title', n: '제목(영문)', d: 'Arch' },
      { k: 'cap1', n: '왼쪽 캡션', d: '창문 셋, 계절 셋.' },
      { k: 'cap2', n: '오른쪽 인용', d: '“어느 창이 제일 좋아?”' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 3; i++) {
        g += '<div class="win"><div class="ph">' + c.img(i) + '</div><div class="sill"></div></div>';
      }
      return '<div class="head"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div><div class="g">' + g + '</div>' +
        '<div class="cap"><span class="kcap">' + c.t('cap1') + '</span>' +
        '<span class="q">' + c.t('cap2') + '</span></div>';
    }
  });

  reg({
    id: 'round-frame', cat: 'collage', n: '원형 프레임+리본', cls: 'roundfr',
    ph: [{ n: '큰 원(가운데)' }, { n: '작은 원(왼쪽)' }, { n: '작은 원(오른쪽)' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: '12 — Circle' },
      { k: 'rib', n: '리본 글자', d: '이달의 장면' },
      { k: 'cap', n: '하단 캡션', d: '동그랗게 오려 간직하고 싶은 컷.' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="big ph">' + c.img(0) + '</div>' +
        '<div class="sm a ph">' + c.img(1) + '</div>' +
        '<div class="sm b ph">' + c.img(2) + '</div>' +
        '<div class="rib">' + c.t('rib') + '</div>' +
        '<div class="kcap6">' + c.t('cap') + '</div>';
    }
  });

  /* ── 감성 카드 피처 10종 ── */
  reg({
    id: 'ft-idcard', cat: 'feature', n: '학생증 카드', cls: 'idcard',
    ph: [{ n: '증명사진' }],
    tx: [
      { k: 'bar', n: '상단 띠 글자', d: 'SOOP ACADEMY — STUDENT ID' },
      { k: 'k1', n: '항목1', d: 'NAME' }, { k: 'v1', n: '값1', d: '테스트' },
      { k: 'k2', n: '항목2', d: 'BIRTH' }, { k: 'v2', n: '값2', d: '03. 15' },
      { k: 'k3', n: '항목3', d: 'CLASS' }, { k: 'v3', n: '값3', d: '버추얼학과 1반' },
      { k: 'code', n: '하단 작은 글자', d: 'NO. 2026-0001' }
    ],
    h: function (c) {
      var rows = '';
      for (var i = 1; i <= 3; i++) rows += '<div><dt>' + c.t('k' + i) + '</dt><dd>' + c.t('v' + i) + '</dd></div>';
      return '<div class="card"><div class="bar">' + c.t('bar') + '</div>' +
        '<div class="body"><div class="pho"><div class="ph">' + c.img(0) + '</div></div>' +
        '<div class="rows">' + rows + '</div></div>' +
        '<div class="foot"><div class="bars2"></div><small>' + c.t('code') + '</small></div></div>';
    }
  });

  reg({
    id: 'ft-cd', cat: 'feature', n: 'CD 앨범 재킷', cls: 'cdcase',
    ph: [{ n: '앨범 커버 사진' }],
    tx: [
      { k: 'chip', n: '라벨', d: '1st Album' },
      { k: 'title', n: '앨범명(영문)', d: 'Voice' },
      { k: 't1', n: '트랙1', d: '오프닝 — 인사' }, { k: 't2', n: '트랙2', d: '오늘의 셋리스트' },
      { k: 't3', n: '트랙3', d: '엔딩 멘트' }, { k: 't4', n: '트랙4', d: '(보너스) 웃음 모음' }
    ],
    h: function (c) {
      var tr = '';
      for (var i = 1; i <= 4; i++) tr += '<li><b>0' + i + '</b>' + c.t('t' + i) + '</li>';
      return '<div class="ttl"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3></div>' +
        '<div class="case"><div class="ph">' + c.img(0) + '</div></div>' +
        '<ol>' + tr + '</ol>';
    }
  });

  reg({
    id: 'ft-cassette', cat: 'feature', n: '카세트 테이프', cls: 'cassette',
    ph: [{ n: '라벨 사진' }],
    tx: [
      { k: 'title', n: '테이프 이름(영문)', d: 'Mixtape' },
      { k: 'cap', n: '하단 캡션', d: 'Side A — 좋아하는 순간만 녹음했음.' }
    ],
    h: function (c) {
      return '<div class="shell"><div class="label"><div class="nm">' + c.h3('title') + '</div>' +
        '<div class="ph">' + c.img(0) + '</div></div>' +
        '<div class="wheels"><i></i><i></i></div></div>' +
        '<div class="kcap7">' + c.t('cap') + '</div>';
    }
  });

  reg({
    id: 'ft-receipt', cat: 'feature', n: '영수증(사진 없음)', cls: 'receipt',
    ph: [],
    tx: [
      { k: 'title', n: '가게 이름', d: 'MEMORY MART' },
      { k: 'sub', n: '부제', d: '2026. 07. 15 — 20:26' },
      { k: 'i1', n: '품목1', d: '웃음' }, { k: 'q1', n: '수량1', d: 'x 47' },
      { k: 'i2', n: '품목2', d: '감동' }, { k: 'q2', n: '수량2', d: 'x 12' },
      { k: 'i3', n: '품목3', d: '행복한 기억' }, { k: 'q3', n: '수량3', d: 'x 999' },
      { k: 'tot', n: '합계 문구', d: 'TOTAL — 무한대' },
      { k: 'thx', n: '하단 인사', d: 'THANK YOU! COME AGAIN' }
    ],
    h: function (c) {
      var rows = '';
      for (var i = 1; i <= 3; i++) {
        rows += '<div class="rw"><span>' + c.t('i' + i) + '</span><span>' + c.t('q' + i) + '</span></div>';
      }
      return '<div class="paper"><h3>' + c.t('title') + '</h3>' +
        '<div class="sub">' + c.t('sub') + '</div>' + rows +
        '<div class="rw tot"><span>' + c.t('tot') + '</span></div>' +
        '<div class="bars3"></div><div class="thx">' + c.t('thx') + '</div></div>';
    }
  });

  reg({
    id: 'ft-passport', cat: 'feature', n: '여권 스탬프', cls: 'passpg',
    ph: [{ n: '위 스탬프 사진' }, { n: '아래 스탬프 사진' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'Passport' },
      { k: 'title', n: '제목', d: 'ARRIVAL' },
      { k: 'visa', n: '도장 글자', d: 'APPROVED' },
      { k: 'cap', n: '하단 캡션', d: '이 계절에 입국 도장 쾅.\n체류 기간: 무기한', m: true }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.t('title') + '</h3>' +
        '<div class="fld">' +
        '<div class="stampf a"><div class="pph ph">' + c.img(0) + '</div></div>' +
        '<div class="stampf b"><div class="pph ph">' + c.img(1) + '</div></div>' +
        '<div class="visa">' + c.t('visa') + '</div>' +
        '<div class="kcap8">' + c.t('cap') + '</div></div>';
    }
  });

  reg({
    id: 'ft-polnote', cat: 'feature', n: '폴라로이드+줄노트', cls: 'polnote',
    ph: [{ n: '폴라로이드 사진' }],
    tx: [
      { k: 'c1', n: '폴라 캡션', d: 'best shot ♡' },
      { k: 'body', n: '줄노트 글', d: '이 사진을 찍던 순간의 공기까지\n기억하고 싶어서 몇 줄 적어둔다.\n\n다음에 또 이런 날이 오면\n그때도 꼭 남겨둬야지.', m: true }
    ],
    h: function (c) {
      return '<figure class="polc"><span class="tp"></span><div class="pph ph">' + c.img(0) + '</div>' +
        '<figcaption>' + c.t('c1') + '</figcaption></figure>' +
        '<div class="ln">' + c.t('body') + '</div>';
    }
  });

  reg({
    id: 'ft-chat', cat: 'feature', n: '폰 채팅', cls: 'phonechat',
    ph: [{ n: '말풍선 사진' }],
    tx: [
      { k: 'b1', n: '상대 말풍선', d: '오늘 방송 사진 봤어?' },
      { k: 'b2', n: '내 말풍선', d: '방금 봤어!! 미쳤다 진짜' },
      { k: 'b3', n: '내 말풍선 2', d: '이건 저장 각이지 ㄹㅇ' },
      { k: 'tm', n: '하단 시간 표기', d: '오후 8:26 · 읽음' }
    ],
    h: function (c) {
      return '<div class="phone"><div class="notch"></div>' +
        '<div class="bb yo">' + c.t('b1') + '</div>' +
        '<div class="bb pic"><div class="ph">' + c.img(0) + '</div></div>' +
        '<div class="bb me">' + c.t('b2') + '</div>' +
        '<div class="bb me">' + c.t('b3') + '</div>' +
        '<div class="tm">' + c.t('tm') + '</div></div>';
    }
  });

  reg({
    id: 'ft-sns', cat: 'feature', n: 'SNS 피드 카드', cls: 'snscard',
    ph: [{ n: '본문 사진' }, { n: '프로필 사진' }],
    tx: [
      { k: 'nick', n: '닉네임', d: 'test_official' },
      { k: 'loc', n: '위치/부제', d: 'SOOP LIVE' },
      { k: 'likes', n: '좋아요 줄', d: '좋아요 2,026개' },
      { k: 'cap', n: '캡션', d: '오늘도 와줘서 고마워요' },
      { k: 'tags', n: '해시태그', d: '#버튜버 #오늘의컷 #화보집' }
    ],
    h: function (c) {
      return '<div class="card"><div class="hd"><div class="ava ph">' + c.img(1) + '</div>' +
        '<div><div class="nick">' + c.t('nick') + '</div><div class="loc">' + c.t('loc') + '</div></div></div>' +
        '<div class="ph">' + c.img(0) + '</div>' +
        '<div class="act"><i>♥</i><i>💬</i><i>↗</i></div>' +
        '<div class="cap9"><div>' + c.t('likes') + '</div><b>' + c.t('nick') + '</b>' + c.t('cap') +
        '<span class="tags">' + c.t('tags') + '</span></div></div>';
    }
  });

  reg({
    id: 'ft-envelope', cat: 'feature', n: '편지+봉투', cls: 'lettercard',
    ph: [{ n: '편지 속 사진' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'From me' },
      { k: 'title', n: '제목(영문)', d: 'Dear you' },
      { k: 'body', n: '편지 본문', d: '이 페이지까지 넘겨준 당신에게.\n\n짧은 편지를 숨겨 두었어요.\n오늘도 고마워요.', m: true },
      { k: 'addr', n: '봉투 글자', d: 'to. my dear' }
    ],
    h: function (c) {
      return '<div class="paper"><span class="chip">' + c.t('chip') + '</span>' +
        '<h3>' + c.h3('title') + '</h3><p>' + c.t('body') + '</p>' +
        '<div class="mini"><div class="pph ph">' + c.img(0) + '</div></div></div>' +
        '<div class="env"><span class="seal">♥</span><div class="addr">' + c.t('addr') + '</div></div>';
    }
  });

  reg({
    id: 'ft-badge', cat: 'feature', n: '원형 씰 뱃지', cls: 'bigbadge',
    ph: [{ n: '원 안 사진' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'Official' },
      { k: 'title', n: '제목(영문)', d: 'Approved' },
      { k: 'cap', n: '하단 캡션', d: '공식 인증. 이번 시즌 최고의 한 장.' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="seal2"><div class="ph">' + c.img(0) + '</div></div>' +
        '<div class="tails"><i></i><i></i></div>' +
        '<h3>' + c.h3('title') + '</h3>' +
        '<div class="kcapA">' + c.t('cap') + '</div>';
    }
  });

  /* ── 커버 4종 ── */
  reg({
    id: 'cover-pola', cat: 'cover', n: '폴라로이드 커버', cls: 'coverpola', pnum: false,
    ph: [{ n: '폴라로이드 사진' }],
    tx: [
      { k: 'mast', n: '제호(영문 이름)', d: 'YOUR NAME' },
      { k: 'vol', n: '볼륨 배지', d: 'VOL.1' },
      { k: 'season', n: '시즌 문구', d: '2026 SUMMER' }
    ],
    h: function (c) {
      var m = c.mast('mast');
      return '<figure class="polc"><span class="tp"></span><div class="pph ph">' + c.img(0) + '</div>' +
        '<div class="cap"><h1 class="cv-mast' + m.cls + '">' + m.txt + '</h1>' +
        '<div class="row"><span class="cv-volbox">' + c.t('vol') + '</span>' +
        '<span class="cv-season">' + c.t('season') + '</span></div></div></figure>';
    }
  });

  reg({
    id: 'cover-scrap', cat: 'cover', n: '스크랩북 커버', cls: 'coverscrap', pnum: false,
    ph: [{ n: '기울어진 사진' }],
    tx: [
      { k: 'mast', n: '제호(영문 이름)', d: 'YOUR NAME' },
      { k: 'vol', n: '볼륨 배지', d: 'VOL.1' },
      { k: 'season', n: '시즌 문구', d: '2026 SUMMER' }
    ],
    h: function (c) {
      var m = c.mast('mast');
      return '<span class="st1">✦</span><span class="st2">♥</span>' +
        '<div class="shot"><span class="tp"></span><span class="tp t2"></span><div class="pph ph">' + c.img(0) + '</div></div>' +
        '<div class="lab"><h1 class="cv-mast' + m.cls + '">' + m.txt + '</h1>' +
        '<div class="row"><span class="cv-volbox">' + c.t('vol') + '</span>' +
        '<span class="cv-season">' + c.t('season') + '</span></div></div>';
    }
  });

  reg({
    id: 'cover-arch', cat: 'cover', n: '아치 커버', cls: 'coverarch', pnum: false,
    ph: [{ n: '아치 속 사진' }],
    tx: [
      { k: 'tag', n: '상단 작은 문구', d: 'THE SEASON GALLERY' },
      { k: 'mast', n: '제호(영문 이름)', d: 'YOUR NAME' },
      { k: 'vol', n: '볼륨 배지', d: 'VOL.1' },
      { k: 'season', n: '시즌 문구', d: '2026 SUMMER' }
    ],
    h: function (c) {
      var m = c.mast('mast');
      return '<div class="cv-tag">' + c.t('tag') + '</div>' +
        '<h1 class="cv-mast' + m.cls + '">' + m.txt + '</h1>' +
        '<div class="arch ph">' + c.img(0) + '</div><div class="base"></div>' +
        '<div class="row"><span class="cv-volbox">' + c.t('vol') + '</span>' +
        '<span class="cv-season">' + c.t('season') + '</span></div>';
    }
  });

  reg({
    id: 'cover-ticket', cat: 'cover', n: '티켓 커버', cls: 'coverticket', pnum: false,
    ph: [{ n: '티켓 사진' }],
    tx: [
      { k: 'tag', n: '상단 작은 문구', d: 'ADMISSION FOR ONE SEASON' },
      { k: 'mast', n: '제호(영문 이름)', d: 'YOUR NAME' },
      { k: 'stub', n: '옆면 세로 글자', d: 'PHOTOBOOK' },
      { k: 'no', n: '스텁 번호', d: 'No.001' }
    ],
    h: function (c) {
      var m = c.mast('mast');
      return '<div class="tik"><div class="main"><div class="cv-tag">' + c.t('tag') + '</div>' +
        '<h1 class="cv-mast' + m.cls + '">' + m.txt + '</h1>' +
        '<div class="ph">' + c.img(0) + '</div></div>' +
        '<div class="stub"><span class="no">' + c.t('no') + '</span>' +
        '<span class="vtx">' + c.t('stub') + '</span><span class="no">★</span></div>' +
        '<span class="hole h1"></span><span class="hole h2"></span></div>';
    }
  });

  /* ── 챕터 표지 3종 ── */
  reg({
    id: 'dv-pola', cat: 'divider', n: '폴라로이드 챕터 표지', cls: 'dvpola', dark: true,
    ph: [{ n: '폴라로이드 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: 'CHAPTER 05' },
      { k: 'title', n: '챕터 제목(영문)', d: 'JADE' },
      { k: 'em', n: '작은 이탤릭 부제', d: '♡ silk night' },
      { k: 'c1', n: '폴라 캡션', d: 'scene 05' },
      { k: 'nums', n: '하단 표기', d: '04 CUTS' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<figure class="polc"><span class="tp"></span><div class="pph ph">' + c.img(0) + '</div>' +
        '<figcaption>' + c.t('c1') + '</figcaption></figure>' +
        '<h2 class="dv-title">' + c.t('title') + '<em>' + c.t('em') + '</em></h2>' +
        '<div class="nums">' + c.t('nums') + '</div>';
    }
  });

  reg({
    id: 'dv-tape', cat: 'divider', n: '테이프 챕터 표지', cls: 'dvtape',
    ph: [{ n: '기울어진 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: 'CHAPTER 02' },
      { k: 'title', n: '챕터 제목(영문)', d: 'ANGEL' },
      { k: 'em', n: '작은 이탤릭 부제', d: '♡ tiny wings' },
      { k: 'ko', n: '한 줄 소개', d: '날개 달린 방과 후.' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<h2 class="dv-title">' + c.t('title') + '<em>' + c.t('em') + '</em></h2>' +
        '<div class="ko2">' + c.t('ko') + '</div>' +
        '<div class="shot"><span class="tp"></span><span class="tp t2"></span><div class="pph ph">' + c.img(0) + '</div></div>';
    }
  });

  reg({
    id: 'dv-stamp', cat: 'divider', n: '우표 챕터 표지', cls: 'dvstamp',
    ph: [{ n: '우표 사진' }],
    tx: [
      { k: 'chip', n: '챕터 라벨', d: 'CHAPTER 03' },
      { k: 'title', n: '챕터 제목(영문)', d: 'SUMMER' },
      { k: 'em', n: '작은 이탤릭 부제', d: '♡ blue days' },
      { k: 'ko', n: '하단 한 줄', d: '여름에서 온 우편.' }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="stampf"><div class="pph ph">' + c.img(0) + '</div></div>' +
        '<h2 class="dv-title">' + c.t('title') + '<em>' + c.t('em') + '</em></h2>' +
        '<div class="ko3">' + c.t('ko') + '</div>';
    }
  });

  /* ── 피날레 3종 ── */
  reg({
    id: 'fin-pinboard', cat: 'finale', n: '핀보드 피날레', cls: 'finpin', pnum: false,
    ph: [{ n: '폴라로이드 사진' }],
    tx: [
      { k: 'c1', n: '폴라 캡션', d: 'thank you' },
      { k: 'note', n: '메모지', d: '끝까지 봐줘서 고마워요.\n다음 보드에서 또 만나요!', m: true }
    ],
    h: function (c) {
      return '<div class="cork">' +
        '<div class="shot"><span class="pinDot" style="top:-1.2cqw;left:46%"></span>' +
        '<div class="pph ph">' + c.img(0) + '</div><figcaption>' + c.t('c1') + '</figcaption></div>' +
        '<div class="note"><span class="pinDot" style="top:-1.2cqw;left:46%"></span>' + c.t('note') + '</div>' +
        '<span class="hrt2">♥</span></div>';
    }
  });

  reg({
    id: 'fin-envelope', cat: 'finale', n: '봉투 피날레', cls: 'finenv', pnum: false,
    ph: [{ n: '봉투 속 사진' }],
    tx: [
      { k: 'en', n: '위 영문', d: 'With love' },
      { k: 'ko', n: '인사말', d: '이 책의 마지막 장은\n당신에게 부치는 편지입니다.', m: true }
    ],
    h: function (c) {
      return '<div class="en1">' + c.h3('en') + '</div>' +
        '<div class="ko4">' + c.t('ko') + '</div>' +
        '<div class="env"><div class="ph">' + c.img(0) + '</div>' +
        '<div class="flap"></div><span class="seal">♥</span></div>';
    }
  });

  reg({
    id: 'fin-line', cat: 'finale', n: '빨랫줄 피날레', cls: 'finline', pnum: false,
    ph: [{ n: '폴라 1' }, { n: '폴라 2' }],
    tx: [
      { k: 'chip', n: '라벨', d: 'The end' },
      { k: 'c1', n: '캡션1', d: 'see you' }, { k: 'c2', n: '캡션2', d: 'again ♡' },
      { k: 'fin', n: '큰 마무리(영문)', d: 'Bye' },
      { k: 'ko', n: '인사말', d: '다음 계절에 또 걸어둘게요.', m: true }
    ],
    h: function (c) {
      return '<span class="chip">' + c.t('chip') + '</span>' +
        '<div class="rope"></div>' +
        pol(c, 0, 'c1', 'a') + pol(c, 1, 'c2', 'b') +
        '<span class="peg pa"></span><span class="peg pb"></span>' +
        '<div class="bot"><div class="fin">' + c.h3('fin') + '</div>' +
        '<div class="ko5">' + c.t('ko') + '</div></div>';
    }
  });

  /* ============================================================
     셀카·폰컷 SELFIE — 사진이 주인공, 글자는 한두 마디만
     ============================================================ */

  reg({
    id: 'sf-full', cat: 'selfie', n: '풀샷 + 손글씨 한 줄', cls: 'sffull', dark: true, pnum: false,
    ph: [{ n: '전체 사진' }],
    tx: [
      { k: 'cap', n: '손글씨 한 줄', d: '오늘의 나, 기록 완료 ♡' },
      { k: 'date', n: '날짜 스탬프', d: "'26 07 16" }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div><div class="scrim"></div>' +
        '<div class="cap">' + c.t('cap') + '</div>' +
        '<span class="stamp">' + c.t('date') + '</span>';
    }
  });

  reg({
    id: 'sf-4cut', cat: 'selfie', n: '인생네컷', cls: 'sf4cut', pnum: false,
    ph: [{ n: '1컷' }, { n: '2컷' }, { n: '3컷' }, { n: '4컷' }],
    tx: [
      { k: 'brand', n: '하단 로고 문구', d: 'TEST × 4CUT' },
      { k: 'date', n: '날짜', d: '2026.07.16' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 4; i++) g += '<div class="ph">' + c.img(i) + '</div>';
      return '<div class="strip">' + g +
        '<div class="foot"><b>' + c.t('brand') + '</b><span>' + c.t('date') + '</span></div></div>';
    }
  });

  reg({
    id: 'sf-story', cat: 'selfie', n: '스토리 화면', cls: 'sfstory', dark: true, pnum: false,
    ph: [{ n: '전체 사진' }],
    tx: [
      { k: 'name', n: '아이디', d: 'test_daily' },
      { k: 'time', n: '몇 시간 전', d: '3시간 전' },
      { k: 're', n: '하단 버튼 문구', d: '♡ 답장 보내기' }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div>' +
        '<div class="topsh"></div>' +
        '<div class="segs"><span class="on"></span><span></span><span></span></div>' +
        '<div class="who"><span class="dot"></span><b>' + c.t('name') + '</b><em>' + c.t('time') + '</em></div>' +
        '<div class="reply">' + c.t('re') + '</div>';
    }
  });

  reg({
    id: 'sf-mirror', cat: 'selfie', n: '거울 셀카(세로 한 줄)', cls: 'sfmirror', mir: true,
    ph: [{ n: '전신 사진' }],
    tx: [
      { k: 'side', n: '세로 한 줄', d: '오늘 옷, 어때?' },
      { k: 'en', n: '아래 영문', d: 'mirror shot' }
    ],
    h: function (c) {
      return '<div class="ph">' + c.img(0) + '</div>' +
        '<div class="rail"><span class="vtx">' + c.t('side') + '</span>' +
        '<span class="heart">♡</span><span class="en">' + c.t('en') + '</span></div>';
    }
  });

  reg({
    id: 'sf-duo', cat: 'selfie', n: '세로 두 컷(풀)', cls: 'sfduo', dark: true, pnum: false,
    ph: [{ n: '왼쪽' }, { n: '오른쪽' }],
    tx: [{ k: 'tag', n: '가운데 한 마디', d: 'today ♡' }],
    h: function (c) {
      return '<div class="ph">' + c.img(0) + '</div><div class="ph">' + c.img(1) + '</div>' +
        '<span class="pill">' + c.t('tag') + '</span>';
    }
  });

  reg({
    id: 'sf-grid4', cat: 'selfie', n: '셀카 2×2(풀)', cls: 'sfgrid4', dark: true, pnum: false,
    ph: [{ n: '왼쪽 위' }, { n: '오른쪽 위' }, { n: '왼쪽 아래' }, { n: '오른쪽 아래' }],
    tx: [{ k: 'word', n: '가운데 뱃지 문구', d: '4 MOODS' }],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 4; i++) g += '<div class="ph">' + c.img(i) + '</div>';
      return '<div class="grid">' + g + '</div><span class="badge">' + c.t('word') + '</span>';
    }
  });

  reg({
    id: 'sf-cam', cat: 'selfie', n: '카메라 뷰파인더', cls: 'sfcam', dark: true, pnum: false,
    ph: [{ n: '화면 전체' }],
    tx: [
      { k: 'rec', n: '왼쪽 위', d: 'REC' },
      { k: 'date', n: '아래 날짜', d: '2026.07.16 PM 9:41' }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div>' +
        '<span class="ck a"></span><span class="ck b"></span><span class="ck c"></span><span class="ck d"></span>' +
        '<div class="rec"><span class="reddot"></span>' + c.t('rec') + '</div>' +
        '<span class="af">[ AF ]</span>' +
        '<span class="stamp">' + c.t('date') + '</span>';
    }
  });

  reg({
    id: 'sf-bigpola', cat: 'selfie', n: '빅 폴라로이드', cls: 'sfbigpola',
    ph: [{ n: '폴라로이드 사진' }],
    tx: [{ k: 'cap', n: '손글씨 캡션', d: '오늘 최애 컷 ☆' }],
    h: function (c) {
      return '<div class="card"><div class="ph">' + c.img(0) + '</div>' +
        '<div class="cap">' + c.t('cap') + '</div></div>';
    }
  });

  reg({
    id: 'sf-feed', cat: 'selfie', n: '피드 그리드', cls: 'sffeed',
    ph: [{ n: '큰 사진' }, { n: '작은 1' }, { n: '작은 2' }, { n: '작은 3' }],
    tx: [
      { k: 'id', n: '아이디 줄', d: '@test_daily' },
      { k: 'fo', n: '오른쪽 버튼 문구', d: '+ 팔로우' }
    ],
    h: function (c) {
      return '<div class="bar"><b>' + c.t('id') + '</b><span class="fo">' + c.t('fo') + '</span></div>' +
        '<div class="big ph">' + c.img(0) + '</div>' +
        '<div class="row"><div class="ph">' + c.img(1) + '</div><div class="ph">' + c.img(2) +
        '</div><div class="ph">' + c.img(3) + '</div></div>';
    }
  });

  reg({
    id: 'sf-print', cat: 'selfie', n: '인화지 한 장', cls: 'sfprint',
    ph: [{ n: '인화 사진' }],
    tx: [{ k: 'word', n: '아래 한 마디', d: 'film no.7' }],
    h: function (c) {
      return '<div class="card"><div class="ph">' + c.img(0) + '</div>' +
        '<div class="word">' + c.t('word') + '</div></div>';
    }
  });

  reg({
    id: 'sf-zoom', cat: 'selfie', n: '줌 디테일 서클', cls: 'sfzoom', dark: true, pnum: false, mir: true,
    ph: [{ n: '전체 사진' }, { n: '동그라미 속(확대 컷)' }],
    tx: [{ k: 'cap', n: '동그라미 옆 한 마디', d: 'zoom in!' }],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div>' +
        '<div class="lens ph">' + c.img(1) + '</div>' +
        '<span class="cap">' + c.t('cap') + '</span>';
    }
  });

  reg({
    id: 'sf-filmone', cat: 'selfie', n: '필름 한 컷(와이드)', cls: 'sffilmone', dark: true, pnum: false,
    ph: [{ n: '필름 속 사진' }],
    tx: [
      { k: 'code', n: '필름 코드', d: 'TEST 400 — 24A' },
      { k: 'cap', n: '아래 한 줄', d: '필름엔 그날 공기까지 담긴다' }
    ],
    h: function (c) {
      return '<div class="holes top"></div>' +
        '<div class="fr ph">' + c.img(0) + '</div>' +
        '<div class="holes bot"></div>' +
        '<span class="code">' + c.t('code') + '</span>' +
        '<div class="cap">' + c.t('cap') + '</div>';
    }
  });

  reg({
    id: 'sf-burst', cat: 'selfie', n: '연사 3컷(풀)', cls: 'sfburst', dark: true, pnum: false,
    ph: [{ n: '연사 1' }, { n: '연사 2' }, { n: '연사 3' }],
    tx: [{ k: 'tag', n: '왼쪽 위 문구', d: '● BURST' }],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 3; i++) {
        g += '<div class="ph">' + c.img(i) + '<span class="tc">00:0' + (i + 1) + '</span></div>';
      }
      return g + '<span class="tag">' + c.t('tag') + '</span>';
    }
  });

  reg({
    id: 'sf-poster', cat: 'selfie', n: '포스터 타이포 풀샷', cls: 'sfposter', dark: true, pnum: false,
    ph: [{ n: '전체 사진' }],
    tx: [
      { k: 'word', n: '큰 단어(영문)', d: 'MOOD' },
      { k: 'sub', n: '작은 한 줄', d: 'seoul, summer night' }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div><div class="scrim"></div>' +
        '<div class="word">' + c.t('word') + '</div>' +
        '<div class="sub">' + c.t('sub') + '</div>';
    }
  });

  reg({
    id: 'sf-strip2v', cat: 'selfie', n: '미니 네컷 두 줄', cls: 'sfstrip2', pnum: false,
    ph: [{ n: '왼줄 1' }, { n: '왼줄 2' }, { n: '왼줄 3' }, { n: '오른줄 1' }, { n: '오른줄 2' }, { n: '오른줄 3' }],
    tx: [{ k: 'brand', n: '스트립 하단 문구', d: 'TEST CUT' }],
    h: function (c) {
      function strip(a, b, cc, cls) {
        return '<div class="strip ' + cls + '">' +
          '<div class="ph">' + c.img(a) + '</div><div class="ph">' + c.img(b) + '</div>' +
          '<div class="ph">' + c.img(cc) + '</div><div class="foot">' + c.t('brand') + '</div></div>';
      }
      return strip(0, 1, 2, 'a') + strip(3, 4, 5, 'b');
    }
  });

  reg({
    id: 'sf-phone', cat: 'selfie', n: '폰 화면 목업', cls: 'sfphone',
    ph: [{ n: '화면(배경화면)' }],
    tx: [{ k: 'time', n: '상태바 시간', d: '9:41' }],
    h: function (c) {
      return '<div class="body"><div class="scr ph">' + c.img(0) + '</div>' +
        '<span class="notch"></span><span class="stime">' + c.t('time') + '</span>' +
        '<span class="sig">●●● ⌁</span><span class="homebar"></span></div>';
    }
  });

  reg({
    id: 'sf-lock', cat: 'selfie', n: '잠금화면', cls: 'sflock', dark: true, pnum: false,
    ph: [{ n: '배경 전체' }],
    tx: [
      { k: 'clock', n: '시계', d: '21:32' },
      { k: 'date', n: '날짜 줄', d: '7월 16일 목요일' },
      { k: 'noti', n: '알림 문구', d: '♡ 오늘도 수고했어' }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div><div class="dim"></div>' +
        '<div class="clock">' + c.t('clock') + '</div>' +
        '<div class="date">' + c.t('date') + '</div>' +
        '<div class="noti">' + c.t('noti') + '</div>' +
        '<span class="lk a">⚐</span><span class="lk b">◎</span><span class="swipe"></span>';
    }
  });

  reg({
    id: 'sf-captop', cat: 'selfie', n: '손글씨 위 + 풀 사진', cls: 'sfcaptop', pnum: false, mir: true,
    ph: [{ n: '아래 큰 사진' }],
    tx: [
      { k: 'cap', n: '위 손글씨 한 줄', d: '오늘의 표정은 이거!' },
      { k: 'en', n: '작은 영문', d: 'daily face archive' }
    ],
    h: function (c) {
      return '<div class="top"><div class="cap">' + c.t('cap') + '</div>' +
        '<span class="en">' + c.t('en') + '</span></div>' +
        '<div class="ph">' + c.img(0) + '</div>';
    }
  });

  reg({
    id: 'sf-pola2', cat: 'selfie', n: '폴라로이드 2장 겹침', cls: 'sfpola2',
    ph: [{ n: '뒤 폴라로이드' }, { n: '앞 폴라로이드' }],
    tx: [{ k: 'cap', n: '앞 장 손글씨', d: '둘 다 못 버림 ♡' }],
    h: function (c) {
      return '<div class="pcard a"><div class="ph">' + c.img(0) + '</div><div class="blank"></div></div>' +
        '<div class="pcard b"><div class="ph">' + c.img(1) + '</div><div class="cap">' + c.t('cap') + '</div></div>';
    }
  });

  reg({
    id: 'sf-heart', cat: 'selfie', n: '하트 프레임', cls: 'sfheart',
    ph: [{ n: '하트 속 사진' }],
    tx: [{ k: 'word', n: '아래 한 마디', d: 'my pick ♡' }],
    h: function (c) {
      return '<div class="hwrap"><div class="heart ph">' + c.img(0) + '</div></div>' +
        '<div class="word">' + c.t('word') + '</div>';
    }
  });

  reg({
    id: 'sf-half', cat: 'selfie', n: '위아래 반반(풀)', cls: 'sfhalf', dark: true, pnum: false,
    ph: [{ n: '위 사진' }, { n: '아래 사진' }],
    tx: [{ k: 'tag', n: '가운데 라벨', d: 'AM / PM' }],
    h: function (c) {
      return '<div class="ph">' + c.img(0) + '</div><div class="ph">' + c.img(1) + '</div>' +
        '<span class="tag">' + c.t('tag') + '</span>';
    }
  });

  reg({
    id: 'sf-3v', cat: 'selfie', n: '세로 3열(풀)', cls: 'sf3v', dark: true, pnum: false,
    ph: [{ n: '왼쪽' }, { n: '가운데' }, { n: '오른쪽' }],
    tx: [{ k: 'tag', n: '오른쪽 아래 한 마디', d: 'triple shot' }],
    h: function (c) {
      return '<div class="ph">' + c.img(0) + '</div><div class="ph">' + c.img(1) + '</div>' +
        '<div class="ph">' + c.img(2) + '</div><span class="tag">' + c.t('tag') + '</span>';
    }
  });

  reg({
    id: 'sf-stickers', cat: 'selfie', n: '스티커 뿌림 풀샷', cls: 'sfstick', dark: true, pnum: false,
    ph: [{ n: '전체 사진' }],
    tx: [
      { k: 's1', n: '스티커 1(오른쪽 위)', d: '♡' },
      { k: 's2', n: '스티커 2(왼쪽 중간)', d: '☆' },
      { k: 's3', n: '스티커 3(오른쪽 아래)', d: '!!' }
    ],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div>' +
        '<span class="st a">' + c.t('s1') + '</span>' +
        '<span class="st b">' + c.t('s2') + '</span>' +
        '<span class="st c">' + c.t('s3') + '</span>';
    }
  });

  reg({
    id: 'sf-tapebig', cat: 'selfie', n: '테이프 대형 한 컷', cls: 'sftapebig',
    ph: [{ n: '큰 사진' }],
    tx: [{ k: 'cap', n: '아래 손글씨', d: '벽에 붙여두고 싶어서' }],
    h: function (c) {
      return '<div class="photo"><div class="ph">' + c.img(0) + '</div>' +
        '<span class="tp a"></span><span class="tp b"></span><span class="tp c"></span><span class="tp d"></span></div>' +
        '<div class="cap">' + c.t('cap') + '</div>';
    }
  });

  reg({
    id: 'sf-swipe', cat: 'selfie', n: '스와이프 캐러셀', cls: 'sfswipe', dark: true, pnum: false,
    ph: [{ n: '가운데 큰 컷' }, { n: '왼쪽 살짝' }, { n: '오른쪽 살짝' }],
    tx: [{ k: 'tag', n: '위 작은 문구', d: '1 / 3' }],
    h: function (c) {
      return '<div class="side l ph">' + c.img(1) + '</div>' +
        '<div class="side r ph">' + c.img(2) + '</div>' +
        '<div class="main ph">' + c.img(0) + '</div>' +
        '<span class="tag">' + c.t('tag') + '</span>' +
        '<div class="dots"><span class="on"></span><span></span><span></span></div>';
    }
  });

  reg({
    id: 'sf-window', cat: 'selfie', n: '창문 프레임 풀샷', cls: 'sfwin', dark: true, pnum: false,
    ph: [{ n: '창 밖(전체 사진)' }],
    tx: [{ k: 'cap', n: '창틀 아래 한 줄', d: '오늘 창밖 말고 내 최애' }],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div>' +
        '<span class="bar v1"></span><span class="bar v2"></span><span class="bar h1"></span>' +
        '<span class="frame"></span>' +
        '<div class="sill"><span>' + c.t('cap') + '</span></div>';
    }
  });

  reg({
    id: 'sf-diagcut', cat: 'selfie', n: '대각 반반(풀)', cls: 'sfdiag', dark: true, pnum: false,
    ph: [{ n: '왼쪽 위 사진' }, { n: '오른쪽 아래 사진' }],
    tx: [{ k: 'tag', n: '가운데 라벨', d: '어제 × 오늘' }],
    h: function (c) {
      return '<div class="cut a ph">' + c.img(0) + '</div>' +
        '<div class="cut b ph">' + c.img(1) + '</div>' +
        '<span class="tag">' + c.t('tag') + '</span>';
    }
  });

  reg({
    id: 'sf-blur', cat: 'selfie', n: '블러 배경 + 카드', cls: 'sfblur', dark: true, pnum: false,
    ph: [{ n: '사진(배경에도 흐리게 깔려요)' }],
    tx: [{ k: 'cap', n: '카드 아래 한 줄', d: 'now playing — 나' }],
    h: function (c) {
      return '<div class="bgb ph">' + c.img(0) + '</div><div class="dim"></div>' +
        '<div class="card ph">' + c.img(0) + '</div>' +
        '<div class="cap">' + c.t('cap') + '</div>';
    }
  });

  reg({
    id: 'sf-postit', cat: 'selfie', n: '풀샷 + 포스트잇', cls: 'sfpostit', dark: true, pnum: false,
    ph: [{ n: '전체 사진' }],
    tx: [{ k: 'note', n: '포스트잇 메모', d: '나중에 또 보기\n(중요)', m: true }],
    h: function (c) {
      return '<div class="bgph ph">' + c.img(0) + '</div>' +
        '<div class="note"><span class="ntp"></span>' + c.t('note') + '</div>';
    }
  });

  reg({
    id: 'sf-filmroll', cat: 'selfie', n: '기울어진 필름 롤', cls: 'sfroll',
    ph: [{ n: '필름 1' }, { n: '필름 2' }, { n: '필름 3' }],
    tx: [{ k: 'code', n: '구석 코드', d: 'ROLL 02 · TEST' }],
    h: function (c) {
      return '<div class="roll"><div class="holes"></div>' +
        '<div class="frs"><div class="ph">' + c.img(0) + '</div><div class="ph">' + c.img(1) + '</div>' +
        '<div class="ph">' + c.img(2) + '</div></div>' +
        '<div class="holes"></div></div>' +
        '<span class="code">' + c.t('code') + '</span>';
    }
  });

  reg({
    id: 'sf-tv', cat: 'selfie', n: '레트로 TV', cls: 'sftv',
    ph: [{ n: 'TV 화면' }],
    tx: [{ k: 'ch', n: '채널 표시', d: 'CH 07 · ON AIR' }],
    h: function (c) {
      return '<div class="set"><div class="scr"><div class="ph">' + c.img(0) + '</div>' +
        '<span class="scan"></span></div>' +
        '<div class="deck"><span class="ch">' + c.t('ch') + '</span>' +
        '<span class="knob"></span><span class="knob k2"></span></div></div>';
    }
  });

  reg({
    id: 'sf-idsheet', cat: 'selfie', n: '증명사진 시트', cls: 'sfid',
    ph: [{ n: '증명사진(4번 반복돼요)' }],
    tx: [{ k: 'stamp', n: '하단 스탬프', d: '2026.07.16 · 4매 · 재출력 가능' }],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 4; i++) g += '<div class="ph">' + c.img(0) + '</div>';
      return '<div class="sheet2"><div class="grid">' + g + '</div>' +
        '<div class="stamp">' + c.t('stamp') + '</div></div>';
    }
  });

  reg({
    id: 'sf-pano', cat: 'selfie', n: '파노라마 와이드', cls: 'sfpano',
    ph: [{ n: '와이드 한 컷' }],
    tx: [
      { k: 'loc', n: '위 좌표/장소', d: '37.5°N 127.0°E — SEOUL' },
      { k: 'cap', n: '아래 한 줄', d: '풍경보다 네가 넓다' }
    ],
    h: function (c) {
      return '<span class="loc">' + c.t('loc') + '</span>' +
        '<div class="wide ph">' + c.img(0) + '</div>' +
        '<div class="cap">' + c.t('cap') + '</div>';
    }
  });

  /* 확정 그래픽 PNG 오버레이 — 투명 부분 아래의 사진 슬롯은 기존 편집 기능을 그대로 쓴다. */
  reg({
    id: 'sf-art-camlog', cat: 'selfie', n: '그래픽 · 셀카 캠로그 2컷', cls: 'sfgraphic sfcamlog', dark: true, pnum: false,
    ph: [{ n: '위쪽 가로 사진' }, { n: '아래쪽 가로 사진' }], tx: [],
    h: function (c) {
      return '<div class="photo top ph">' + c.img(0) + '</div>' +
        '<div class="photo bottom ph">' + c.img(1) + '</div>' +
        '<div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-art-zine', cat: 'selfie', n: '그래픽 · 패션진 콜라주', cls: 'sfgraphic sfzine', pnum: false,
    ph: [{ n: '위쪽 메인 사진' }, { n: '왼쪽 아래 사진' }, { n: '오른쪽 아래 사진' }], tx: [],
    h: function (c) {
      return '<div class="photo hero ph">' + c.img(0) + '</div>' +
        '<div class="photo left ph">' + c.img(1) + '</div>' +
        '<div class="photo right ph">' + c.img(2) + '</div>' +
        '<div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-art-magcover', cat: 'selfie', n: '그래픽 · 패션 매거진 커버', cls: 'sfgraphic sfmagcover', pnum: false,
    ph: [{ n: '세로 메인 사진' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-art-retrocam', cat: 'selfie', n: '그래픽 · 레트로 디지털 카메라', cls: 'sfgraphic sfretrocam', dark: true, pnum: false,
    ph: [{ n: '카메라 화면 가로 사진' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-art-street', cat: 'selfie', n: '그래픽 · 스트리트 포스터', cls: 'sfgraphic sfstreet', pnum: false,
    ph: [{ n: '정사각 메인 사진' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-art-newsprint', cat: 'selfie', n: '그래픽 · 패션 뉴스프린트', cls: 'sfgraphic sfnewsprint', pnum: false,
    ph: [{ n: '신문 지면 가로 사진' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-art-airmail', cat: 'selfie', n: '그래픽 · 빈티지 에어메일', cls: 'sfgraphic sfairmail', pnum: false,
    ph: [{ n: '포스트카드 가로 사진' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  /* 참고 이미지 감성 6종 — 장식 PNG와 편집 가능한 문구를 완전히 분리한다. */
  reg({
    id: 'sf-ref-strawberry-p', cat: 'selfie', n: '스크랩 · 딸기 콜라주 세로', cls: 'sfgraphic sfref sfrefstrawp', pnum: false,
    ph: [{ n: '위쪽 가로 사진' }, { n: '왼쪽 큰 세로 사진' }, { n: '오른쪽 작은 사진' }],
    tx: [{ k: 'label', n: '종이 라벨 문구', d: 'strawberry call' }],
    h: function (c) {
      return '<div class="photo top ph">' + c.img(0) + '</div>' +
        '<div class="photo hero ph">' + c.img(1) + '</div>' +
        '<div class="photo mini ph">' + c.img(2) + '</div>' +
        '<div class="art" aria-hidden="true"></div>' +
        '<span class="paperlabel">' + c.t('label') + '</span>';
    }
  });

  reg({
    id: 'sf-ref-blue-p', cat: 'selfie', n: '매거진 · 블루 노트 세로', cls: 'sfgraphic sfref sfrefbluep', pnum: false,
    ph: [{ n: '왼쪽 위 가로 사진' }, { n: '왼쪽 아래 세로 사진' }, { n: '오른쪽 세로 사진' }],
    tx: [
      { k: 'title', n: '큰 제목', d: 'Dear : blue' },
      { k: 'sub', n: '오른쪽 작은 문구', d: 'MY BLUE HOUR' }
    ],
    h: function (c) {
      return '<div class="photo small ph">' + c.img(0) + '</div>' +
        '<div class="photo left ph">' + c.img(1) + '</div>' +
        '<div class="photo right ph">' + c.img(2) + '</div>' +
        '<div class="art" aria-hidden="true"></div>' +
        '<span class="title">' + c.t('title') + '</span>' +
        '<span class="sub">' + c.t('sub') + '</span>';
    }
  });

  reg({
    id: 'sf-ref-feed-p', cat: 'selfie', n: '피드 · 옐로 블루 세로', cls: 'sfgraphic sfref sfreffeedp', pnum: false,
    ph: [{ n: '메인 사진' }, { n: '디테일 위' }, { n: '디테일 가운데' }, { n: '디테일 아래' }],
    tx: [
      { k: 'id', n: '상단 아이디', d: '@photo.day' },
      { k: 'action', n: '하단 버튼 문구', d: 'FOLLOW' }
    ],
    h: function (c) {
      return '<div class="photo main ph">' + c.img(0) + '</div>' +
        '<div class="photo thumb t1 ph">' + c.img(1) + '</div>' +
        '<div class="photo thumb t2 ph">' + c.img(2) + '</div>' +
        '<div class="photo thumb t3 ph">' + c.img(3) + '</div>' +
        '<div class="art" aria-hidden="true"></div>' +
        '<span class="feedid">' + c.t('id') + '</span>' +
        '<span class="feedaction">' + c.t('action') + '</span>';
    }
  });

  reg({
    id: 'sf-ref-strawberry-w', cat: 'selfie', n: '스크랩 · 딸기 가로 사진형', cls: 'sfgraphic sfref sfrefstraww', pnum: false,
    ph: [{ n: '가운데 큰 가로 사진' }, { n: '오른쪽 세로 사진' }, { n: '왼쪽 작은 사진' }],
    tx: [{ k: 'label', n: '종이 라벨 문구', d: 'sweet weekend' }],
    h: function (c) {
      return '<div class="photo hero ph">' + c.img(0) + '</div>' +
        '<div class="photo right ph">' + c.img(1) + '</div>' +
        '<div class="photo mini ph">' + c.img(2) + '</div>' +
        '<div class="art" aria-hidden="true"></div>' +
        '<span class="paperlabel">' + c.t('label') + '</span>';
    }
  });

  reg({
    id: 'sf-ref-blue-w', cat: 'selfie', n: '매거진 · 블루 노트 가로 사진형', cls: 'sfgraphic sfref sfrefbluew', pnum: false,
    ph: [{ n: '위쪽 큰 가로 사진' }, { n: '왼쪽 아래 가로 사진' }, { n: '오른쪽 아래 정사각 사진' }],
    tx: [
      { k: 'title', n: '가운데 제목', d: 'Dear : blue' },
      { k: 'sub', n: '오른쪽 위 작은 문구', d: 'YOUTH NOTES' }
    ],
    h: function (c) {
      return '<div class="photo left ph">' + c.img(0) + '</div>' +
        '<div class="photo wide ph">' + c.img(1) + '</div>' +
        '<div class="photo square ph">' + c.img(2) + '</div>' +
        '<div class="art" aria-hidden="true"></div>' +
        '<span class="title">' + c.t('title') + '</span>' +
        '<span class="sub">' + c.t('sub') + '</span>';
    }
  });

  reg({
    id: 'sf-ref-feed-w', cat: 'selfie', n: '피드 · 옐로 블루 가로 사진형', cls: 'sfgraphic sfref sfreffeedw', pnum: false,
    ph: [{ n: '가운데 큰 가로 사진' }, { n: '왼쪽 디테일 1' }, { n: '왼쪽 디테일 2' }, { n: '왼쪽 디테일 3' }],
    tx: [
      { k: 'id', n: '왼쪽 아이디', d: '@daily.frame' },
      { k: 'action', n: '왼쪽 버튼 문구', d: 'FOLLOW' }
    ],
    h: function (c) {
      return '<div class="photo main ph">' + c.img(0) + '</div>' +
        '<div class="photo thumb t1 ph">' + c.img(1) + '</div>' +
        '<div class="photo thumb t2 ph">' + c.img(2) + '</div>' +
        '<div class="photo thumb t3 ph">' + c.img(3) + '</div>' +
        '<div class="art" aria-hidden="true"></div>' +
        '<span class="feedid">' + c.t('id') + '</span>' +
        '<span class="feedaction">' + c.t('action') + '</span>';
    }
  });

  /* 단일 사진 그래픽 5종 — 장식 오버레이와 사진 슬롯을 분리해 기존 이동·확대 기능을 유지한다. */
  reg({
    id: 'sf-single-cherry', cat: 'selfie', n: '그래픽 · 체리 키친 다이어리', cls: 'sfgraphic sfsingle sfsinglecherry', pnum: false,
    ph: [{ n: '세로 사진 한 장' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-single-film', cat: 'selfie', n: '그래픽 · 아날로그 필름 아카이브', cls: 'sfgraphic sfsingle sfsinglefilm', dark: true, pnum: false,
    ph: [{ n: '가로 사진 한 장' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-single-postage', cat: 'selfie', n: '그래픽 · 민트 포스티지', cls: 'sfgraphic sfsingle sfsinglepostage', pnum: false,
    ph: [{ n: '세로 사진 한 장' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-single-ticket', cat: 'selfie', n: '그래픽 · 인디 티켓 포스터', cls: 'sfgraphic sfsingle sfsingleticket', dark: true, pnum: false,
    ph: [{ n: '가로 사진 한 장' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-single-seaside', cat: 'selfie', n: '그래픽 · 씨사이드 스케치북', cls: 'sfgraphic sfsingle sfsingleseaside', pnum: false,
    ph: [{ n: '세로 사진 한 장' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-single-greenapple', cat: 'selfie', n: '그래픽 · 풋사과 다이어리', cls: 'sfgraphic sfsingle sfsinglegreenapple', pnum: false,
    ph: [{ n: '세로 사진 한 장' }], tx: [],
    h: function (c) {
      return '<div class="photo ph">' + c.img(0) + '</div><div class="art" aria-hidden="true"></div>';
    }
  });

  reg({
    id: 'sf-grid9', cat: 'selfie', n: '셀카 3×3(풀)', cls: 'sfgrid9', dark: true, pnum: false,
    ph: [{ n: '1' }, { n: '2' }, { n: '3' }, { n: '4' }, { n: '5' }, { n: '6' }, { n: '7' }, { n: '8' }, { n: '9' }],
    tx: [],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 9; i++) g += '<div class="ph">' + c.img(i) + '</div>';
      return '<div class="grid">' + g + '</div>';
    }
  });

  /* ============================================================
     SNS · 채팅 — 올린 느낌을 내는 레이아웃
     (브랜드 로고·상표는 쓰지 않고 아이콘은 직접 그린 단순 형태)
     ============================================================ */

  reg({
    id: 'sns-post', cat: 'sns', n: 'SNS 포스트', cls: 'snspost', pnum: false,
    /* 인스타처럼 사진 한 장 — 아래 작은 사진 두 칸은 없애고 그만큼 흰 칸을 키웠다 */
    ph: [{ n: '메인 사진 (정사각)' }, { n: '프로필 사진(작은 원)' }],
    tx: [
      { k: 'acc', n: '계정 이름', d: '테스트' },
      { k: 'badge', n: '인증 배지 (비우면 숨김)', d: '✓' },
      { k: 'music', n: '음악 줄 (비우면 숨김)', d: '노래 제목 · 가수 이름' },
      { k: 'idx', n: '오른쪽 위 장수', d: '1/10' },
      { k: 'over', n: '사진 위 큰 문구 (줄바꿈 가능)', d: '여기에 큰 문구를\n두 줄까지 넣어요', m: true },
      { k: 'like', n: '좋아요 수', d: '1.2만' },
      { k: 'cmt', n: '댓글 수', d: '340' },
      { k: 'shr', n: '공유 수', d: '512' },
      { k: 'cap', n: '아래 캡션', d: '테스트 캡션을 여기에 적어요' }
    ],
    h: function (c) {
      var badge = c.raw('badge').trim() ? '<i class="vfw">' + SNSI.ok + '</i>' : '';
      var mus = c.raw('music').trim()
        ? '<div class="mus"><b>♪</b>' + c.t('music') + '</div>' : '';
      var idx = c.raw('idx').trim() ? '<span class="idx">' + c.t('idx') + '</span>' : '';
      var over = c.raw('over').trim() ? '<div class="over">' + c.t('over') + '</div>' : '';
      var dots = '';
      for (var i = 0; i < 6; i++) dots += '<i' + (i === 0 ? ' class="on"' : '') + '></i>';
      return '<div class="card">' +
        '<div class="hd"><span class="sav ph">' + c.img(1) + '</span>' +
        '<span class="who"><span class="nm">' + c.t('acc') + badge + '</span>' + mus + '</span>' +
        '<span class="mo">' + SNSI.dots + '</span></div>' +
        '<div class="pics"><div class="p1 ph">' + c.img(0) + over + idx +
        '<span class="mt">' + SNSI.mute + '</span></div></div>' +
        '<div class="act"><span>' + SNSI.heart + '<b>' + c.t('like') + '</b></span>' +
        '<span>' + SNSI.cmt + '<b>' + c.t('cmt') + '</b></span>' +
        '<span>' + SNSI.rt + '<b>' + c.t('shr') + '</b></span>' +
        '<span class="bm">' + SNSI.mark + '</span></div>' +
        '<div class="cap">' + c.t('cap') + '</div>' +
        '<div class="dots">' + dots + '</div>' +
        '</div>';
    }
  });

  reg({
    id: 'sns-feed', cat: 'sns', n: 'SNS 피드 (글 2개)', cls: 'snsfeed', pnum: false,
    ph: [{ n: '사진 (16:9)' }, { n: '프로필 사진(작은 원)' }],
    tx: [
      { k: 'top', n: '맨 위 제목', d: '피드' },
      { k: 'nm', n: '이름', d: '테스트' },
      { k: 'at', n: '아이디(@)', d: '@테스트' },
      { k: 'when', n: '시간', d: '방금' },
      { k: 'b1', n: '첫 글 본문', d: '@테스트 님과 함께한 #나들이\n여기에 본문을 적어요. 멘션과 해시태그는 파란 글씨로 표시됩니다.', m: true },
      { k: 'c1', n: '첫 글 — 답글 수', d: '1' },
      { k: 'c2', n: '첫 글 — 공유 수', d: '111' },
      { k: 'c3', n: '첫 글 — 좋아요 수', d: '111' },
      { k: 'c4', n: '첫 글 — 조회 수', d: '111만' },
      { k: 'b2', n: '둘째 글 본문', d: '두 번째 글은 사진 없이 글만 들어갑니다.\n줄바꿈을 그대로 살려서 여러 줄로 적을 수 있어요.\n\n길게 적으면 아래로 늘어나고, 짧게 적으면 그만큼 줄어듭니다.\n필요 없으면 내용을 비워서 지울 수도 있어요.', m: true },
      { k: 'd1', n: '둘째 글 — 답글 수', d: '1' },
      { k: 'd2', n: '둘째 글 — 공유 수', d: '111' },
      { k: 'd3', n: '둘째 글 — 좋아요 수', d: '111' },
      { k: 'd4', n: '둘째 글 — 조회 수', d: '111만' }
    ],
    h: function (c) {
      var head = function () {
        return '<div class="who"><span class="sav ph">' + c.img(1) + '</span>' +
          '<span class="nm">' + c.t('nm') + '</span>' +
          '<span class="at">' + c.t('at') + '</span><span class="dt">·</span>' +
          '<span class="at">' + c.t('when') + '</span></div>';
      };
      var acts = function (a, b, d, e) {
        return '<div class="act"><span>' + SNSI.cmt + '<b>' + c.t(a) + '</b></span>' +
          '<span>' + SNSI.rt + '<b>' + c.t(b) + '</b></span>' +
          '<span>' + SNSI.heart + '<b>' + c.t(d) + '</b></span>' +
          '<span>' + SNSI.chart + '<b>' + c.t(e) + '</b></span>' +
          '<span class="up">' + SNSI.up + '</span></div>';
      };
      return '<div class="top">' + c.t('top') + '<i class="knob"></i></div>' +
        '<article class="tw">' + head() +
        '<div class="bd">' + snsRich(c, 'b1') + '</div>' +
        '<div class="pic ph">' + c.img(0) + '</div>' +
        acts('c1', 'c2', 'c3', 'c4') + '</article>' +
        '<article class="tw">' + head() +
        '<div class="bd">' + snsRich(c, 'b2') + '</div>' +
        acts('d1', 'd2', 'd3', 'd4') + '</article>';
    }
  });

  reg({
    id: 'sns-chat', cat: 'sns', n: '채팅창 (대화)', cls: 'snschat', pnum: false,
    ph: [{ n: '상대 프로필 사진' }],
    tx: [
      { k: 'nm', n: '상대 이름', d: '테스트' },
      { k: 'cnt', n: '인원 수', d: '2' },
      { k: 'notice', n: '공지 문구 (비우면 숨김)', d: '여기에 공지 문구가 들어갑니다' },
      { k: 'chat', n: '대화  —  >내 말 / 이름: 상대 말 / #가운데 안내  (끝에 |시간, (숫자)=안읽음)',
        d: '#날짜나 안내는 # 로 시작해요\n테스트: 이름을 앞에 쓰면 왼쪽 말풍선 |오후 1:11\n>부등호로 시작하면 오른쪽 말풍선\n>줄을 바꾸면 말풍선이 하나 더 생겨요\n>같은 사람이 이어 말하면 이름은 한 번만 |오후 1:11 (1)\n테스트: 줄 끝에 세로줄과 시간을 적으면 시간이 붙어요 |오후 1:12\n>괄호 안에 숫자를 넣으면 안 읽음 표시 |오후 1:12 (2)\n테스트: 필요 없는 줄은 지우면 됩니다', m: true },
      { k: 'inp', n: '아래 입력칸 문구', d: '메시지 입력' },
      { k: 'send', n: '보내기 버튼 글자', d: '전송' }
    ],
    h: function (c) {
      var list = kkParse(c.raw('chat')), i, it, rows = '';
      for (i = 0; i < list.length; i++) {
        it = list[i];
        if (it.sys) { rows += '<div class="sys"><span>' + esc(it.body) + '</span></div>'; continue; }
        var meta = '<span class="meta">' +
          (it.un ? '<i class="un">' + esc(it.un) + '</i>' : '') +
          (it.time ? '<i class="tm">' + esc(it.time) + '</i>' : '') + '</span>';
        if (it.side === 'me') {
          rows += '<div class="ln me">' + meta +
            '<span class="bb">' + esc(it.body) + '</span></div>';
        } else {
          rows += '<div class="ln you' + (it.head ? ' hd' : '') + '">' +
            (it.head ? '<span class="sav ph">' + c.img(0) + '</span>'
                     : '<span class="sav gap"></span>') +
            '<span class="col">' +
            (it.head && it.name ? '<span class="who">' + esc(it.name) + '</span>' : '') +
            '<span class="row"><span class="bb">' + esc(it.body) + '</span>' + meta + '</span>' +
            '</span></div>';
        }
      }
      var notice = c.raw('notice').trim()
        ? '<div class="ntc"><i class="hn">' + SNSI.horn + '</i><span>' + c.t('notice') + '</span>' +
          '<i class="cv">' + SNSI.chev + '</i></div>' : '';
      return '<div class="win">' +
        '<div class="bar"><i></i><i></i><i class="x"></i></div>' +
        '<div class="hd"><span class="sav ph">' + c.img(0) + '</span>' +
        '<span class="ttl"><b>' + c.t('nm') + '</b>' +
        '<span class="cnt">' + SNSI.ppl + c.t('cnt') + '</span></span>' +
        '<span class="ico">' + SNSI.srch + SNSI.call + SNSI.cam + SNSI.menu + '</span></div>' +
        notice +
        '<div class="body">' + c.f('chat', rows) + '</div>' +
        '<div class="foot"><div class="inp">' + c.t('inp') + '</div>' +
        '<div class="tools"><span>' + SNSI.plus + SNSI.smile + SNSI.file + '</span>' +
        '<span class="sendwrap"><i class="slide"></i><b class="send">' + c.t('send') + '</b></span></div></div>' +
        '</div>';
    }
  });


  /* ---------- 새 책 기본 구성(13장 = 표지 + 6펼침면) ---------- */
  function newPage(layoutId) {
    var def = byId(layoutId);
    var photos = [];
    for (var i = 0; i < (def.ph ? def.ph.length : 0); i++) photos.push({ id: null, ox: 50, oy: 30 });
    return { layout: layoutId, mir: false, photos: photos, texts: {} };
  }
  var DEFAULT_BOOK = ['cover-mast', 'toc', 'prologue', 'dv-dark', 'col-bloom3', 'tx-velvet',
    'gr-contact4', 'ft-vtitle', 'ft-word', 'tx-mag', 'fin-gaze', 'back-end', 'back-dark'];


  /* ===== 누끼 프레임 레이아웃 등록 =====
     SNS 목업 4종은 아트에 구워져 있던 TEST 자리표시 글자를 지우고
     진짜 편집 가능한 문구 칸(tx)으로 교체했다(2026-07-26).
     글자는 .art(z3) 위에 뜨는 절대배치 span(.stx, z4). */
  function stx(c, k, cls) {
    /* 비우면 요소째 숨김 — 원치 않는 줄은 지울 수 있게 */
    return c.raw(k).trim() ? '<span class="stx ' + cls + '">' + c.t(k) + '</span>' : '';
  }
  reg({ id: 'sns-ig-feed', cat: 'sns', n: '인스타 피드 목업', cls: 'sfgraphic sfsingle pfsnsigfeed', pnum: false,
    ph: [{ n: '사진 1' }],
    tx: [
      { k: 'user', n: '계정 이름', d: 'soop_vtuber' },
      { k: 'loc', n: '위치 줄 (비우면 숨김)', d: '서울, 대한민국' },
      { k: 'likes', n: '좋아요 줄', d: '좋아요 1,234개' },
      { k: 'cap', n: '캡션', d: '오늘도 방송 와줘서 고마워요 💜' },
      { k: 'more', n: '댓글 더보기 줄 (비우면 숨김)', d: '댓글 12개 모두 보기' },
      { k: 'cmt', n: '댓글 한 줄 (비우면 숨김)', d: '팬닉네임 오늘 방송 최고였어요!' },
      { k: 'time', n: '시간 줄', d: '1시간 전' }
    ],
    h: function (c) {
      return '<div class="photo ph s0">' + c.img(0) + '</div>' +
        '<div class="art" aria-hidden="true"></div>' +
        stx(c, 'user', 't-user') + stx(c, 'loc', 't-loc') + stx(c, 'likes', 't-likes') +
        stx(c, 'cap', 't-cap') + stx(c, 'more', 't-more') + stx(c, 'cmt', 't-cmt') + stx(c, 'time', 't-time');
    } });
  reg({ id: 'sns-x-post', cat: 'sns', n: 'X 게시물 상세', cls: 'sfgraphic sfsingle pfsnsxpost', pnum: false,
    ph: [{ n: '사진 1' }],
    tx: [
      { k: 'user', n: '이름', d: '수프 버튜버' },
      { k: 'handle', n: '핸들(@아이디)', d: '@soop_vtuber' },
      { k: 'body', n: '본문', d: '오늘 방송 하이라이트 모음!' },
      { k: 'meta', n: '시간·조회수 줄', d: '오후 8:00 · 2026. 7. 26. · 12.3만 조회수' },
      { k: 'stats', n: '지표 줄', d: '123 재게시   45 인용   1.2천 좋아요   89 북마크' },
      { k: 'r1n', n: '답글1 이름줄', d: '팬 하나 @fan_one · 1시간' },
      { k: 'r1b', n: '답글1 내용', d: '오늘 방송 진짜 최고였어요!' },
      { k: 'r2n', n: '답글2 이름줄', d: '팬 둘 @fan_two · 2시간' },
      { k: 'r2b', n: '답글2 내용', d: '다시보기 벌써 세 번째예요 ㅋㅋ' },
      { k: 'r3n', n: '답글3 이름줄', d: '팬 셋 @fan_three · 3시간' },
      { k: 'r3b', n: '답글3 내용', d: '다음 방송도 기다릴게요 💜' }
    ],
    h: function (c) {
      var user = c.raw('user').trim()
        ? '<span class="stx t-user">' + c.t('user') + '<i class="vchk">✓</i></span>' : '';
      return '<div class="photo ph s0">' + c.img(0) + '</div>' +
        '<div class="art" aria-hidden="true"></div>' +
        user + stx(c, 'handle', 't-handle') + stx(c, 'body', 't-body') +
        stx(c, 'meta', 't-meta') + stx(c, 'stats', 't-stats') +
        stx(c, 'r1n', 't-r1n') + stx(c, 'r1b', 't-r1b') +
        stx(c, 'r2n', 't-r2n') + stx(c, 'r2b', 't-r2b') +
        stx(c, 'r3n', 't-r3n') + stx(c, 'r3b', 't-r3b');
    } });
  reg({ id: 'sns-x-feed', cat: 'sns', n: 'X 피드', cls: 'sfgraphic sfsingle pfsnsxfeed', pnum: false,
    ph: [{ n: '사진 1' }],
    tx: [
      { k: 'h1', n: '글1 이름줄', d: '수프 버튜버 @soop_vtuber · 2시간' },
      { k: 'b1', n: '글1 본문', d: '오늘 방송 짤 모음 공개!' },
      { k: 'h2', n: '글2 이름줄', d: '팬 하나 @fan_one · 3시간' },
      { k: 'b2', n: '글2 본문', d: '어제 방송 다시보기 정주행 중' },
      { k: 'h3', n: '글3 이름줄', d: '팬 둘 @fan_two · 5시간' },
      { k: 'b3', n: '글3 본문', d: '이번 화보집 너무 예쁘다…' },
      { k: 'h4', n: '글4 이름줄', d: '팬 셋 @fan_three · 7시간' },
      { k: 'b4', n: '글4 본문 (두 줄 가능)', d: '오늘도 칼퇴하고 본방 사수 성공. 뿌듯하다', m: true },
      { k: 'h5', n: '글5 이름줄', d: '팬 넷 @fan_four · 9시간' },
      { k: 'b5', n: '글5 본문', d: '다음 컨텐츠 기대 중!' }
    ],
    h: function (c) {
      return '<div class="photo ph s0">' + c.img(0) + '</div>' +
        '<div class="art" aria-hidden="true"></div>' +
        stx(c, 'h1', 't-h1') + stx(c, 'b1', 't-b1') + stx(c, 'h2', 't-h2') + stx(c, 'b2', 't-b2') +
        stx(c, 'h3', 't-h3') + stx(c, 'b3', 't-b3') + stx(c, 'h4', 't-h4') + stx(c, 'b4', 't-b4') +
        stx(c, 'h5', 't-h5') + stx(c, 'b5', 't-b5');
    } });
  reg({ id: 'sns-ig-profile', cat: 'sns', n: '인스타 프로필 (3×3)', cls: 'sfgraphic sfsingle pfsnsigprofile', pnum: false,
    ph: [{ n: '사진 1' }, { n: '사진 2' }, { n: '사진 3' }, { n: '사진 4' }, { n: '사진 5' }, { n: '사진 6' }, { n: '사진 7' }, { n: '사진 8' }, { n: '사진 9' }],
    tx: [
      { k: 'user', n: '위 계정 이름', d: 'soop_vtuber' },
      { k: 'n1', n: '게시물 수', d: '128' },
      { k: 'n2', n: '팔로워 수', d: '3.2만' },
      { k: 'n3', n: '팔로잉 수', d: '210' },
      { k: 'name', n: '프로필 이름', d: '수프 버튜버' },
      { k: 'bio', n: '소개 (비우면 숨김)', d: '매일 저녁 8시 방송 🎙' },
      { k: 'link', n: '링크 (비우면 숨김)', d: 'sooplive.co.kr/mychannel' }
    ],
    h: function (c) {
      var g = '';
      for (var i = 0; i < 9; i++) g += '<div class="photo ph s' + i + '">' + c.img(i) + '</div>';
      return g + '<div class="art" aria-hidden="true"></div>' +
        stx(c, 'user', 't-user') +
        stx(c, 'n1', 't-n1') + stx(c, 'n2', 't-n2') + stx(c, 'n3', 't-n3') +
        '<span class="stx t-l1">게시물</span><span class="stx t-l2">팔로워</span><span class="stx t-l3">팔로잉</span>' +
        stx(c, 'name', 't-name') + stx(c, 'bio', 't-bio') + stx(c, 'link', 't-link');
    } });
  reg({ id: 'fr-comic', cat: 'selfie', n: '만화 팝아트 프레임', cls: 'sfgraphic sfsingle pffrcomic', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-scrap-pink', cat: 'selfie', n: '핑크 스크랩북', cls: 'sfgraphic sfsingle pffrscrappink', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-filmstrip', cat: 'grid', n: '필름 스트립 (2컷)', cls: 'sfgraphic sfsingle pffrfilmstrip', pnum: false,
    ph: [{ n: '사진 1' }, { n: '사진 2' }],
    tx: [{ k: 'date', n: '아래 날짜 테이프', d: '2026.07.26' }],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="photo ph s1">' + c.img(1) + '</div>' + '<div class="art" aria-hidden="true"></div>' + stx(c, 'date', 't-date'); } });
  reg({ id: 'fr-zine', cat: 'collage', n: 'ZINE 콜라주 (3컷)', cls: 'sfgraphic sfsingle pffrzine', pnum: false,
    ph: [{ n: '사진 1' }, { n: '사진 2' }, { n: '사진 3' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="photo ph s1">' + c.img(1) + '</div>' + '<div class="photo ph s2">' + c.img(2) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-journey', cat: 'selfie', n: '여행 저널', cls: 'sfgraphic sfsingle pffrjourney', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-kisunote', cat: 'selfie', n: '키스노트 필름', cls: 'sfgraphic sfsingle pffrkisunote', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-player-pur', cat: 'selfie', n: '뮤직 플레이어 · 보라', cls: 'sfgraphic sfsingle pffrplayerpur', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-player-grn', cat: 'selfie', n: '뮤직 플레이어 · 초록', cls: 'sfgraphic sfsingle pffrplayergrn', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-player-blu', cat: 'selfie', n: '뮤직 플레이어 · 파랑', cls: 'sfgraphic sfsingle pffrplayerblu', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-gameboy-ylw', cat: 'selfie', n: '게임기 · 노랑', cls: 'sfgraphic sfsingle pffrgameboyylw', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-gameboy-wht', cat: 'selfie', n: '게임기 · 화이트', cls: 'sfgraphic sfsingle pffrgameboywht', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-photocard', cat: 'selfie', n: '포토카드 홀더', cls: 'sfgraphic sfsingle pffrphotocard', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-diary', cat: 'selfie', n: '다이어리 속지', cls: 'sfgraphic sfsingle pffrdiary', pnum: false,
    ph: [{ n: '사진 1' }], tx: [],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>'; } });
  reg({ id: 'fr-airmail2', cat: 'selfie', n: '에어메일 봉투', cls: 'sfgraphic sfsingle pffrairmail2', pnum: false,
    ph: [{ n: '사진 1' }],
    tx: [{ k: 'to', n: 'TO: 받는 사람 (비우면 숨김)', d: '나의 팬에게 ♥' }],
    h: function (c) { return '<div class="photo ph s0">' + c.img(0) + '</div>' + '<div class="art" aria-hidden="true"></div>' + stx(c, 'to', 't-to'); } });
  /* ===== end ===== */

  return {
    LAYOUTS: LAYOUTS, CATS: CATS, PRESETS: PRESETS, PAGE_W: PAGE_W,
    byId: byId, render: render, esc: esc, fxArch: fxArch,
    newPage: newPage, DEFAULT_BOOK: DEFAULT_BOOK
  };



})();
