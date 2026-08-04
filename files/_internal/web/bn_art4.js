/* [Patch2] 집게·압정 소품 + 원형 방셀 밑판 + 레이스 도일리
   — 파일 기반(bn_art3.js 와 같은 방식). 재빌드 불필요.
   밑판·도일리는 "얹은 뒤 레이어를 맨 아래로" 내리면 배경처럼 쓸 수 있다. */
window.BN_ART = window.BN_ART || { themes: {} };
(function () {
  var T = {
 "patch_clip_pastel": {
  "n": "집게·압정 (파스텔)",
  "type": "prop",
  "props": [
   {
    "id": "p40-01",
    "n": "크림 집게",
    "url": "bn/patch/patch_clip_c01.png"
   },
   {
    "id": "p40-02",
    "n": "하늘 집게 Archive",
    "url": "bn/patch/patch_clip_c02.png"
   },
   {
    "id": "p40-03",
    "n": "크림 집게 각인",
    "url": "bn/patch/patch_clip_c03.png"
   },
   {
    "id": "p40-04",
    "n": "핑크 집게 Archive",
    "url": "bn/patch/patch_clip_c04.png"
   },
   {
    "id": "p40-05",
    "n": "핑크 집게 옆",
    "url": "bn/patch/patch_clip_c05.png"
   },
   {
    "id": "p40-06",
    "n": "하늘 집게 큰",
    "url": "bn/patch/patch_clip_c06.png"
   },
   {
    "id": "p40-07",
    "n": "하늘 집게 Archive 기울",
    "url": "bn/patch/patch_clip_c07.png"
   },
   {
    "id": "p40-08",
    "n": "화이트 집게",
    "url": "bn/patch/patch_clip_c08.png"
   },
   {
    "id": "p40-09",
    "n": "연보라 집게",
    "url": "bn/patch/patch_clip_c09.png"
   },
   {
    "id": "p40-10",
    "n": "연보라 집게 정면",
    "url": "bn/patch/patch_clip_c10.png"
   },
   {
    "id": "p40-11",
    "n": "핑크 바인더 집게",
    "url": "bn/patch/patch_clip_c11.png"
   },
   {
    "id": "p40-12",
    "n": "핑크 압정 큰",
    "url": "bn/patch/patch_clip_c12.png"
   },
   {
    "id": "p40-13",
    "n": "하늘 압정",
    "url": "bn/patch/patch_clip_c13.png"
   },
   {
    "id": "p40-14",
    "n": "원목 압정",
    "url": "bn/patch/patch_clip_c14.png"
   },
   {
    "id": "p40-15",
    "n": "핑크 클립",
    "url": "bn/patch/patch_clip_c15.png"
   },
   {
    "id": "p40-16",
    "n": "핑크 압정 굵은",
    "url": "bn/patch/patch_clip_c16.png"
   },
   {
    "id": "p40-17",
    "n": "핑크 클립 가는",
    "url": "bn/patch/patch_clip_c17.png"
   },
   {
    "id": "p40-18",
    "n": "핑크 클립 긴",
    "url": "bn/patch/patch_clip_c18.png"
   },
   {
    "id": "p40-19",
    "n": "하늘 압정 작은",
    "url": "bn/patch/patch_clip_c19.png"
   },
   {
    "id": "p40-20",
    "n": "원목 압정 작은",
    "url": "bn/patch/patch_clip_c20.png"
   },
   {
    "id": "p40-21",
    "n": "핑크 클립 납작",
    "url": "bn/patch/patch_clip_c21.png"
   },
   {
    "id": "p40-22",
    "n": "핑크 클립 소",
    "url": "bn/patch/patch_clip_c22.png"
   }
  ]
 },
 "patch_bangsel_base": {
  "n": "방셀 밑판 (원형)",
  "type": "prop",
  "props": [
   {
    "id": "p41-01",
    "n": "우주 아가일 (남색)",
    "url": "bn/patch/patch_bangsel_base_01.png"
   },
   {
    "id": "p41-02",
    "n": "라벤더 하트 레이스",
    "url": "bn/patch/patch_bangsel_base_02.png"
   },
   {
    "id": "p41-03",
    "n": "민트 스페이드 아가일",
    "url": "bn/patch/patch_bangsel_base_03.png"
   },
   {
    "id": "p41-04",
    "n": "핑크 스트라이프 리본",
    "url": "bn/patch/patch_bangsel_base_04.png"
   },
   {
    "id": "p41-05",
    "n": "핑크 아가일 스캘럽",
    "url": "bn/patch/patch_bangsel_base_05.png"
   },
   {
    "id": "p41-06",
    "n": "연두 별 그라데이션",
    "url": "bn/patch/patch_bangsel_base_06.png"
   }
  ]
 },
 "patch_doily": {
  "n": "레이스 도일리",
  "type": "prop",
  "props": [
   {
    "id": "p42-01",
    "n": "도일리 · 파랑 리본",
    "url": "bn/patch/patch_doily_01.png"
   },
   {
    "id": "p42-02",
    "n": "도일리 · 하늘",
    "url": "bn/patch/patch_doily_02.png"
   },
   {
    "id": "p42-03",
    "n": "도일리 · 핑크 리본",
    "url": "bn/patch/patch_doily_03.png"
   }
  ]
 }
};
  Object.keys(T).forEach(function (k) { BN_ART.themes[k] = T[k]; });
})();
