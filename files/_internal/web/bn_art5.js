/* [Patch3] 2026-08-10 — 카와이 스티커 24종 + 사진 오버레이 8종
   bn_art3.js·bn_art4.js 와 같은 "파일 기반" 방식(재빌드 불필요).
   ⚠ 이 파일은 bn_art3.js 뒤에 실려야 한다 — 오버레이는 기존
      "뷰파인더·오버레이(patch_overlay)" 칸에 이어 붙이기 때문. */
window.BN_ART = window.BN_ART || { themes: {} };
(function () {
  /* ── 스티커 24종 (1024×1024, 배경 투명) ────────────────── */
  var STK = [
    '말풍선 · 둥근', '말풍선 · 구름', '말풍선 · 외침',
    '배지 · ON AIR', '배지 · LIVE', '배지 · NEW', '배지 · 하트 체력바',
    '반짝 · 4갈래 별', '반짝 · 별 무리', '반짝 · 폭죽',
    '리본 · 나비매듭', '리본 · 긴 띠',
    '하트 · 통통', '하트 · 손그림',
    '왕관', '나비', '벚꽃 한 송이', '구름', '음표', '커피컵',
    '도장 · 빈 원형', '화살표 · 곡선', '화살표 · 직선', '낙서 동그라미'
  ];
  var props = STK.map(function (n, i) {
    var num = (i + 1 < 10 ? '0' : '') + (i + 1);
    return { id: 'stk-' + num, n: n, url: 'bn/patch/patch_stk_' + num + '.png' };
  });
  BN_ART.themes['patch_sticker_kawaii'] = {
    n: '스티커 (카와이)', type: 'prop', props: props
  };

  /* ── 사진 오버레이 8종 (1920×1080, 배경 투명) ──────────────
     기존 "뷰파인더·오버레이" 칸이 있으면 거기에 이어 붙인다
     (한 곳에서 다 고르게). 없으면 그 칸을 새로 만든다. */
  var OVL = [
    ['ovg-01', '필름 그레인 (가로)', 'ovl_grain_w'],
    ['ovg-02', '빛샘 (가로)', 'ovl_leak_w'],
    ['ovg-03', '비네트 (가로)', 'ovl_vign_w'],
    ['ovg-04', '스캔라인 (가로)', 'ovl_scan_w'],
    ['ovg-05', '창문 그림자 (가로)', 'ovl_winsh_w'],
    ['ovg-06', '블라인드 그림자 (가로)', 'ovl_blind_w'],
    ['ovg-07', '유리 물방울 (가로)', 'ovl_drops_w'],
    ['ovg-08', '반짝 보케 (가로)', 'ovl_bokeh_w']
  ].map(function (o) {
    return { id: o[0], n: o[1], url: 'bn/patch/' + o[2] + '.png' };
  });
  var ov = BN_ART.themes['patch_overlay'];
  if (ov && ov.props && ov.props.length) {
    /* 두 번 실려도 중복으로 쌓이지 않게 */
    var have = {};
    ov.props.forEach(function (p) { have[p.id] = 1; });
    OVL.forEach(function (p) { if (!have[p.id]) ov.props.push(p); });
  } else {
    BN_ART.themes['patch_overlay'] = { n: '뷰파인더·오버레이', type: 'prop', props: OVL };
  }
})();
