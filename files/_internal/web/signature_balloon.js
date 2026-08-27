(() => {
  "use strict";

  const W = 293;
  const H = 248;
  const SAFE_TOP = 84;
  const CONTENT_H = 164;
  const ASSET_DIR = "sig_assets/";
  const KB_LIMIT = 50000;
  const WEFLAB_WIDTH = 668;
  const WEFLAB_HEIGHT = 374;
  const WEFLAB_RENDER_SCALE = 2;
  const WEFLAB_UPLOAD_LIMIT = 10 * 1024 * 1024;
  const DPR = 2;
  const MOBILE_NUMBER_SIZE = 55;
  const PC_NUMBER_SIZE = 38;
  const MASK_SCALE = 2;
  const MASK_W = W * MASK_SCALE;
  const MASK_H = H * MASK_SCALE;
  const MASK_SAFE_TOP = SAFE_TOP * MASK_SCALE;
  const MASK_HISTORY_LIMIT = 50;
  const MASK_LIBRARY_KEY = "photobookKit.sigMaskLibrary.v2";
  const MASK_LIBRARY_LEGACY_KEY = "photobookKit.sigMaskLibrary.v1";
  const MASK_LIBRARY_SLOTS = 6;
  const MASK_BRUSH_PRESETS = { s: 8, m: 18, l: 34, xl: 56 };
  const SNAP_DISTANCE = 4;
  const DOME_SEED_DEFAULTS = Object.freeze({ sideDrop: 48.02, shoulder: 29.20 });
  const DOME_LOW_DEFAULTS = Object.freeze({ apex: 112.68, sideDrop: 48.02, shoulder: 29.20 });
  const DOME_HIGH_DEFAULTS = Object.freeze({ apex: 90.68, sideDrop: 48.02, shoulder: 29.20 });
  const HEART_SEED_DEFAULTS = Object.freeze({ height: 155.9904, notchDepth: 27.4195, notchWidth: 31.19, asymmetry: 0 });
  const OUTPUT_PROFILE_TYPES = Object.freeze(["mobile", "pc", "weflab"]);
  const OUTPUT_PROFILE_LABELS = Object.freeze({ mobile: "모바일 293×248", pc: "PC 195×145", weflab: "위플랩 668×374" });
  const OUTPUT_PROFILE_LIMITS = Object.freeze({
    mobile: { x: 146, y: 124 },
    pc: { x: 97, y: 72 },
    weflab: { x: 334, y: 187 }
  });
  const TEXT_PROP_RENDER_SCALE = 4;
  const TEXT_PROP_MAX_RASTER_SIZE = 2048;
  const SIG_PROJECT_SCHEMA_VERSION = 1;
  const SIG_PROJECT_VERSION = 2;
  const SIG_PROJECT_BROWSER_SUFFIX = ".pbsig.json";
  const SIG_DEFAULT_EXPORT_BASE = "sigballoon";
  const SIG_PROJECT_MAX_BROWSER_BYTES = 224 * 1024 * 1024;
  const PHRASE_FONT_OPTIONS = [
    { key: "sig-jua", label: "BM JUA · 기본", family: '\"SigJua\",\"Arial Rounded MT Bold\",sans-serif' },
    { key: "rounded", label: "둥근 고딕", family: '\"Arial Rounded MT Bold\",\"Pretendard\",\"Noto Sans KR\",sans-serif' },
    { key: "sans", label: "깔끔한 고딕", family: '\"Pretendard\",\"Noto Sans KR\",\"Malgun Gothic\",sans-serif' },
    { key: "serif", label: "명조", family: '\"Noto Serif KR\",\"Batang\",\"Times New Roman\",serif' },
    { key: "bold", label: "굵은 제목체", family: 'Impact,\"Arial Black\",\"Pretendard\",\"Noto Sans KR\",sans-serif' }
  ];

  const textureFiles = {
    catRoulette33: "bg-cat-roulette33.webp",
    catRoulette330: "bg-cat-roulette330.webp",
    catSignature1xx: "bg-cat-signature1xx.webp",
    catLove486: "bg-cat-love486.webp",
    catAngel14xx: "bg-cat-angel14xx.webp",
    catPretty28xx: "bg-cat-pretty28xx.webp",
    catOnly57xx: "bg-cat-only57xx.webp",
    catLove12486: "bg-cat-love12486.webp",
    flatPinkA: "bg-flat-pink-hearts-a.webp",
    flatPinkB: "bg-flat-pink-hearts-b.webp",
    flatGrayA: "bg-flat-gray-wheel-a.webp",
    flatGrayB: "bg-flat-gray-wheel-b.webp",
    flatBlueA: "bg-flat-blue-wings-a.webp",
    flatBlueB: "bg-flat-blue-wings-b.webp",
    flatOrangeA: "bg-flat-orange-circles-a.webp",
    flatOrangeB: "bg-flat-orange-circles-b.webp",
    flatGreenA: "bg-flat-green-clover-a.webp",
    flatGreenB: "bg-flat-green-clover-b.webp",
    flatPurpleA: "bg-flat-purple-ribbon-a.webp",
    flatPurpleB: "bg-flat-purple-ribbon-b.webp",
    richPink: "bg-rich-pink-lace.webp",
    richYellow: "bg-rich-yellow-carnival.webp",
    richBlue: "bg-rich-blue-angel.webp",
    richPurple: "bg-rich-purple-ribbon.webp",
    richGreen: "bg-rich-green-patchwork.webp",
    richRed: "bg-rich-red-comic.webp",
    richPinkCoral: "bg-rich-pink-lace.webp",
    richPinkBerry: "bg-rich-pink-lace.webp",
    richBlueAqua: "bg-rich-blue-angel.webp",
    richBlueLilac: "bg-rich-blue-angel.webp",
    richPurpleRose: "bg-rich-purple-ribbon.webp",
    richPurpleIndigo: "bg-rich-purple-ribbon.webp",
    richGreenAqua: "bg-rich-green-patchwork.webp",
    richGreenSpring: "bg-rich-green-patchwork.webp",
    modernPeach: "bg-modern-peach.webp",
    modernSky: "bg-modern-sky.webp",
    modernRose: "bg-modern-rose.webp",
    modernLoveHeart: "bg-modern-love-heart.webp",
    modernLilac: "bg-modern-lilac.webp",
    modernMint: "bg-modern-mint.webp",
    modernLemon: "bg-modern-lemon.webp",
    modernRoulette: "bg-modern-roulette.webp",
    modernAngel: "bg-modern-angel.webp",
    modernRouletteGiant: "bg-modern-roulette-giant.webp",
    modernDoubleHeart: "bg-modern-double-heart.webp",
    modernPrettyBow: "bg-modern-pretty-bow.webp",
    pink: "bg-pink-doodle.webp",
    blue: "bg-blue-cloud.webp",
    yellow: "bg-yellow-party.webp",
    lavender: "bg-lavender-dream.webp",
    red: "bg-red-energy.webp"
  };

  const imagePropDefs = [
    { id: "cat33-wheel-small", label: "33 작은 룰렛", category: "33 룰렛", folder: "props_category", file: "cat33-wheel-small.webp" },
    { id: "cat33-loop-arrow", label: "33 회전 화살표", category: "33 룰렛", folder: "props_category", file: "cat33-loop-arrow.webp" },
    { id: "cat33-twin-wheels", label: "33 미니 룰렛 2개", category: "33 룰렛", folder: "props_category", file: "cat33-twin-wheels.webp" },
    { id: "cat33-checker-ribbon", label: "33 체크 리본", category: "33 룰렛", folder: "props_category", file: "cat33-checker-ribbon.webp" },
    { id: "cat33-spirals", label: "33 소용돌이", category: "33 룰렛", folder: "props_category", file: "cat33-spirals.webp" },
    { id: "cat33-plus-dots", label: "33 플러스 점", category: "33 룰렛", folder: "props_category", file: "cat33-plus-dots.webp" },

    { id: "cat330-wheel-large", label: "330 대왕 룰렛", category: "330 대왕룰렛", folder: "props_category", file: "cat330-wheel-large.webp" },
    { id: "cat330-tickets", label: "330 상품권 묶음", category: "330 대왕룰렛", folder: "props_category", file: "cat330-tickets.webp" },
    { id: "cat330-spin-arrow", label: "330 회전 화살표", category: "330 대왕룰렛", folder: "props_category", file: "cat330-spin-arrow.webp" },
    { id: "cat330-clover", label: "330 행운 클로버", category: "330 대왕룰렛", folder: "props_category", file: "cat330-clover.webp" },
    { id: "cat330-checker-pennants", label: "330 체크 깃발", category: "330 대왕룰렛", folder: "props_category", file: "cat330-checker-pennants.webp" },
    { id: "cat330-rim-fragment", label: "330 룰렛 테두리", category: "330 대왕룰렛", folder: "props_category", file: "cat330-rim-fragment.webp" },

    { id: "cat1xx-speech-bubble", label: "1xx 말풍선", category: "1xx 기본 시그", folder: "props_category", file: "cat1xx-speech-bubble.webp" },
    { id: "cat1xx-bow", label: "1xx 리본", category: "1xx 기본 시그", folder: "props_category", file: "cat1xx-bow.webp" },
    { id: "cat1xx-flowers", label: "1xx 꽃 장식", category: "1xx 기본 시그", folder: "props_category", file: "cat1xx-flowers.webp" },
    { id: "cat1xx-heart-sparkle", label: "1xx 하트 반짝", category: "1xx 기본 시그", folder: "props_category", file: "cat1xx-heart-sparkle.webp" },
    { id: "cat1xx-cloud-bubble", label: "1xx 구름 말풍선", category: "1xx 기본 시그", folder: "props_category", file: "cat1xx-cloud-bubble.webp" },
    { id: "cat1xx-ribbon-loop", label: "1xx 리본 고리", category: "1xx 기본 시그", folder: "props_category", file: "cat1xx-ribbon-loop.webp" },

    { id: "cat486-heart-frame", label: "486 하트 프레임", category: "486 사랑해", folder: "props_category", file: "cat486-heart-frame.webp" },
    { id: "cat486-double-hearts", label: "486 겹하트", category: "486 사랑해", folder: "props_category", file: "cat486-double-hearts.webp" },
    { id: "cat486-cupid-heart", label: "486 큐피드 하트", category: "486 사랑해", folder: "props_category", file: "cat486-cupid-heart.webp" },
    { id: "cat486-envelope", label: "486 하트 편지", category: "486 사랑해", folder: "props_category", file: "cat486-envelope.webp" },
    { id: "cat486-heart-flower", label: "486 하트 꽃", category: "486 사랑해", folder: "props_category", file: "cat486-heart-flower.webp" },
    { id: "cat486-heart-petals", label: "486 하트 꽃잎", category: "486 사랑해", folder: "props_category", file: "cat486-heart-petals.webp" },

    { id: "cat14xx-wings", label: "14xx 천사 날개", category: "14xx 천사", folder: "props_category", file: "cat14xx-wings.webp" },
    { id: "cat14xx-halo", label: "14xx 헤일로", category: "14xx 천사", folder: "props_category", file: "cat14xx-halo.webp" },
    { id: "cat14xx-cloud", label: "14xx 구름", category: "14xx 천사", folder: "props_category", file: "cat14xx-cloud.webp" },
    { id: "cat14xx-feather", label: "14xx 깃털", category: "14xx 천사", folder: "props_category", file: "cat14xx-feather.webp" },
    { id: "cat14xx-sparkles", label: "14xx 별빛", category: "14xx 천사", folder: "props_category", file: "cat14xx-sparkles.webp" },
    { id: "cat14xx-halo-bow", label: "14xx 헤일로 리본", category: "14xx 천사", folder: "props_category", file: "cat14xx-halo-bow.webp" },

    { id: "cat28xx-mirror", label: "28xx 손거울", category: "28xx 이쁜", folder: "props_category", file: "cat28xx-mirror.webp" },
    { id: "cat28xx-bow", label: "28xx 큰 리본", category: "28xx 이쁜", folder: "props_category", file: "cat28xx-bow.webp" },
    { id: "cat28xx-flowers", label: "28xx 꽃다발", category: "28xx 이쁜", folder: "props_category", file: "cat28xx-flowers.webp" },
    { id: "cat28xx-pearls", label: "28xx 진주 줄", category: "28xx 이쁜", folder: "props_category", file: "cat28xx-pearls.webp" },
    { id: "cat28xx-lace-corner", label: "28xx 레이스 모서리", category: "28xx 이쁜", folder: "props_category", file: "cat28xx-lace-corner.webp" },
    { id: "cat28xx-sparkles", label: "28xx 반짝이", category: "28xx 이쁜", folder: "props_category", file: "cat28xx-sparkles.webp" },

    { id: "cat57xx-heart-lock", label: "57xx 하트 자물쇠", category: "57xx 오직", folder: "props_category", file: "cat57xx-heart-lock.webp" },
    { id: "cat57xx-key", label: "57xx 하트 열쇠", category: "57xx 오직", folder: "props_category", file: "cat57xx-key.webp" },
    { id: "cat57xx-heart-medallion", label: "57xx 하트 메달", category: "57xx 오직", folder: "props_category", file: "cat57xx-heart-medallion.webp" },
    { id: "cat57xx-linked-hearts", label: "57xx 연결 하트", category: "57xx 오직", folder: "props_category", file: "cat57xx-linked-hearts.webp" },
    { id: "cat57xx-ribbon-bow", label: "57xx 리본", category: "57xx 오직", folder: "props_category", file: "cat57xx-ribbon-bow.webp" },
    { id: "cat57xx-seal-tag", label: "57xx 하트 태그", category: "57xx 오직", folder: "props_category", file: "cat57xx-seal-tag.webp" },

    { id: "cat12486-layered-hearts", label: "12486 하트 묶음", category: "12486 많이 사랑해", folder: "props_category", file: "cat12486-layered-hearts.webp" },
    { id: "cat12486-double-heart-frame", label: "12486 겹하트 프레임", category: "12486 많이 사랑해", folder: "props_category", file: "cat12486-double-heart-frame.webp" },
    { id: "cat12486-heart-garland", label: "12486 하트 가랜드", category: "12486 많이 사랑해", folder: "props_category", file: "cat12486-heart-garland.webp" },
    { id: "cat12486-envelopes", label: "12486 편지 묶음", category: "12486 많이 사랑해", folder: "props_category", file: "cat12486-envelopes.webp" },
    { id: "cat12486-heart-bow", label: "12486 하트 리본", category: "12486 많이 사랑해", folder: "props_category", file: "cat12486-heart-bow.webp" },
    { id: "cat12486-heart-confetti", label: "12486 하트 콘페티", category: "12486 많이 사랑해", folder: "props_category", file: "cat12486-heart-confetti.webp" },

    { id: "flat-pink-heart-ring", label: "핑크 하트 링", category: "핑크", folder: "props_flat", file: "flat-pink-heart-ring.webp" },
    { id: "flat-pink-heart-cluster", label: "핑크 하트 묶음", category: "핑크", folder: "props_flat", file: "flat-pink-heart-cluster.webp" },
    { id: "flat-pink-bow", label: "핑크 리본", category: "핑크", folder: "props_flat", file: "flat-pink-bow.webp" },
    { id: "flat-pink-flowers", label: "핑크 꽃", category: "핑크", folder: "props_flat", file: "flat-pink-flowers.webp" },
    { id: "flat-pink-sparkles", label: "핑크 반짝이", category: "핑크", folder: "props_flat", file: "flat-pink-sparkles.webp" },
    { id: "flat-pink-bubble", label: "핑크 구름 칸", category: "핑크", folder: "props_flat", file: "flat-pink-bubble.webp" },

    { id: "flat-gray-roulette", label: "흑백 룰렛", category: "흑백", folder: "props_flat", file: "flat-gray-roulette.webp" },
    { id: "flat-gray-wheel", label: "흑백 바퀴", category: "흑백", folder: "props_flat", file: "flat-gray-wheel.webp" },
    { id: "flat-gray-spirals", label: "흑백 소용돌이", category: "흑백", folder: "props_flat", file: "flat-gray-spirals.webp" },
    { id: "flat-gray-arrow", label: "흑백 화살표", category: "흑백", folder: "props_flat", file: "flat-gray-arrow.webp" },
    { id: "flat-gray-pluses", label: "흑백 플러스", category: "흑백", folder: "props_flat", file: "flat-gray-pluses.webp" },
    { id: "flat-gray-burst", label: "흑백 코믹 폭발", category: "흑백", folder: "props_flat", file: "flat-gray-burst.webp" },

    { id: "flat-blue-wings", label: "블루 단순 날개", category: "블루", folder: "props_flat", file: "flat-blue-wings.webp" },
    { id: "flat-blue-halo", label: "블루 헤일로", category: "블루", folder: "props_flat", file: "flat-blue-halo.webp" },
    { id: "flat-blue-cloud", label: "블루 구름", category: "블루", folder: "props_flat", file: "flat-blue-cloud.webp" },
    { id: "flat-blue-sparkles", label: "블루 별빛", category: "블루", folder: "props_flat", file: "flat-blue-sparkles.webp" },
    { id: "flat-blue-bow", label: "블루 리본", category: "블루", folder: "props_flat", file: "flat-blue-bow.webp" },
    { id: "flat-blue-bubbles", label: "블루 버블", category: "블루", folder: "props_flat", file: "flat-blue-bubbles.webp" },

    { id: "flat-orange-rings", label: "오렌지 쌍원", category: "오렌지", folder: "props_flat", file: "flat-orange-rings.webp" },
    { id: "flat-orange-butterflies", label: "오렌지 나비", category: "오렌지", folder: "props_flat", file: "flat-orange-butterflies.webp" },
    { id: "flat-orange-flowers", label: "오렌지 꽃", category: "오렌지", folder: "props_flat", file: "flat-orange-flowers.webp" },
    { id: "flat-orange-hearts", label: "오렌지 하트", category: "오렌지", folder: "props_flat", file: "flat-orange-hearts.webp" },
    { id: "flat-orange-rays", label: "오렌지 방사선", category: "오렌지", folder: "props_flat", file: "flat-orange-rays.webp" },
    { id: "flat-orange-confetti", label: "오렌지 콘페티", category: "오렌지", folder: "props_flat", file: "flat-orange-confetti.webp" },

    { id: "flat-green-clovers", label: "그린 클로버", category: "그린", folder: "props_flat", file: "flat-green-clovers.webp" },
    { id: "flat-green-gingham", label: "그린 체크 조각", category: "그린", folder: "props_flat", file: "flat-green-gingham.webp" },
    { id: "flat-green-bow", label: "그린 리본", category: "그린", folder: "props_flat", file: "flat-green-bow.webp" },
    { id: "flat-green-flowers", label: "그린 꽃", category: "그린", folder: "props_flat", file: "flat-green-flowers.webp" },
    { id: "flat-green-curls", label: "그린 꼬불이", category: "그린", folder: "props_flat", file: "flat-green-curls.webp" },
    { id: "flat-green-bubble", label: "그린 구름 칸", category: "그린", folder: "props_flat", file: "flat-green-bubble.webp" },

    { id: "flat-purple-scalloped-ring", label: "퍼플 물결 링", category: "퍼플", folder: "props_flat", file: "flat-purple-scalloped-ring.webp" },
    { id: "flat-purple-bows", label: "퍼플 리본 묶음", category: "퍼플", folder: "props_flat", file: "flat-purple-bows.webp" },
    { id: "flat-purple-dots", label: "퍼플 점 장식", category: "퍼플", folder: "props_flat", file: "flat-purple-dots.webp" },
    { id: "flat-purple-heart-lock", label: "퍼플 하트 자물쇠", category: "퍼플", folder: "props_flat", file: "flat-purple-heart-lock.webp" },
    { id: "flat-purple-flowers", label: "퍼플 꽃", category: "퍼플", folder: "props_flat", file: "flat-purple-flowers.webp" },
    { id: "flat-purple-sparkles", label: "퍼플 반짝이", category: "퍼플", folder: "props_flat", file: "flat-purple-sparkles.webp" }
  ];

  const legacyRichPropDefs = [
    { id: "img-angel-wings", label: "천사 날개", category: "판타지", folder: "props", file: "img-angel-wings.webp" },
    { id: "img-heart-crown", label: "하트 왕관", category: "판타지", folder: "props", file: "img-heart-crown.webp" },
    { id: "img-crescent-orbit", label: "초승달 궤도", category: "판타지", folder: "props", file: "img-crescent-orbit.webp" },
    { id: "img-feather-chain", label: "깃털 체인", category: "판타지", folder: "props", file: "img-feather-chain.webp" },
    { id: "img-cloud-halo", label: "구름 헤일로", category: "판타지", folder: "props", file: "img-cloud-halo.webp" },
    { id: "img-star-wand", label: "별 리본봉", category: "판타지", folder: "props", file: "img-star-wand.webp" },
    { id: "img-heart-cluster", label: "러블리 하트", category: "러블리", folder: "props", file: "img-heart-cluster.webp" },
    { id: "img-ribbon-bow", label: "리본 보우", category: "러블리", folder: "props", file: "img-ribbon-bow.webp" },
    { id: "img-flower-lace", label: "플라워 레이스", category: "러블리", folder: "props", file: "img-flower-lace.webp" },
    { id: "img-sparkle-cluster", label: "혼합 반짝", category: "러블리", folder: "props", file: "img-sparkle-cluster.webp" },
    { id: "img-cloud-bubble", label: "구름 말풍선", category: "러블리", folder: "props", file: "img-cloud-bubble.webp" },
    { id: "img-curly-doodles", label: "컬리 낙서", category: "러블리", folder: "props", file: "img-curly-doodles.webp" },
    { id: "img-roulette-wheel", label: "룰렛 휠", category: "프레임", folder: "props", file: "img-roulette-wheel.webp" },
    { id: "img-pearl-heart-ring", label: "펄 하트 링", category: "프레임", folder: "props", file: "img-pearl-heart-ring.webp" },
    { id: "img-twin-circle-frame", label: "트윈 원형", category: "프레임", folder: "props", file: "img-twin-circle-frame.webp" },
    { id: "img-wheel-spokes", label: "바퀴 윤곽", category: "프레임", folder: "props", file: "img-wheel-spokes.webp" },
    { id: "img-lace-oval", label: "레이스 타원", category: "프레임", folder: "props", file: "img-lace-oval.webp" },
    { id: "img-halo-ring", label: "헤일로 링", category: "프레임", folder: "props", file: "img-halo-ring.webp" },
    { id: "img-comic-burst", label: "코믹 폭발", category: "에너지", folder: "props", file: "img-comic-burst.webp" },
    { id: "img-lightning-cluster", label: "번개 묶음", category: "에너지", folder: "props", file: "img-lightning-cluster.webp" },
    { id: "img-flame-swoosh", label: "불꽃 스워시", category: "에너지", folder: "props", file: "img-flame-swoosh.webp" },
    { id: "img-speed-lines", label: "속도선", category: "에너지", folder: "props", file: "img-speed-lines.webp" },
    { id: "img-target-rings", label: "타깃 링", category: "에너지", folder: "props", file: "img-target-rings.webp" },
    { id: "img-starburst", label: "방사 폭발", category: "에너지", folder: "props", file: "img-starburst.webp" }
  ];

  const activeImagePropDefs = [...legacyRichPropDefs, ...imagePropDefs];

  const backgroundMaskCurves = {
    "band-straight": 18,
    "dome-soft": 24,
    "heart-wide": 28,
    "rounded-cap": 22,
    "dome-high": 32,
    "twin-dome": 25,
    "cloud-soft": 23,
    "bow-curve": 24,
    "offset-dome-left": 25,
    "offset-dome-right": 25
  };

  const themes = [
    { key: "cat33Mono", name: "33 룰렛 · 모노", categoryMode: true, simple: true, rich: true, texture: "catRoulette33", hue: 0, primary: "#595959", secondary: "#f6f3ec", accent: "#2f2f2f", pattern: "none", defaultNum: "33", defaultPhrase: "룰렛", props: ["cat33-wheel-small", "cat33-loop-arrow", "cat33-twin-wheels", "cat33-checker-ribbon", "cat33-spirals", "cat33-plus-dots"] },
    { key: "cat33Cool", name: "33 룰렛 · 쿨그레이", categoryMode: true, simple: true, rich: true, texture: "catRoulette33", hue: 205, primary: "#52606d", secondary: "#f1f5f7", accent: "#273746", pattern: "none", defaultNum: "33", defaultPhrase: "룰렛", props: ["cat33-twin-wheels", "cat33-checker-ribbon", "cat33-loop-arrow", "cat33-spirals", "cat33-wheel-small", "cat33-plus-dots"] },

    { key: "cat330Lavender", name: "330 대왕룰렛 · 라벤더", categoryMode: true, simple: true, rich: true, texture: "catRoulette330", hue: 0, primary: "#8067d8", secondary: "#f1edff", accent: "#4e35a7", pattern: "none", defaultNum: "330", defaultPhrase: "대왕룰렛", props: ["cat330-wheel-large", "cat330-tickets", "cat330-spin-arrow", "cat330-clover", "cat330-checker-pennants", "cat330-rim-fragment"] },
    { key: "cat330Mint", name: "330 대왕룰렛 · 민트", categoryMode: true, simple: true, rich: true, texture: "catRoulette330", hue: 82, primary: "#48aa9b", secondary: "#e9fbf7", accent: "#19766c", pattern: "none", defaultNum: "330", defaultPhrase: "대왕룰렛", props: ["cat330-wheel-large", "cat330-clover", "cat330-tickets", "cat330-checker-pennants", "cat330-spin-arrow", "cat330-rim-fragment"] },

    { key: "cat1xxMint", name: "1xx 기본 시그 · 민트", categoryMode: true, simple: true, rich: true, texture: "catSignature1xx", hue: 0, primary: "#64c4bb", secondary: "#effcf8", accent: "#19776f", pattern: "none", defaultNum: "100", defaultPhrase: "시그풍", props: ["flat-green-bubble", "flat-green-bow", "flat-green-flowers", "flat-green-curls", "flat-blue-bubbles", "flat-pink-sparkles"] },
    { key: "cat1xxAqua", name: "1xx 기본 시그 · 아쿠아", categoryMode: true, simple: true, rich: true, texture: "catSignature1xx", hue: 24, primary: "#54b9d0", secondary: "#eefaff", accent: "#1c7188", pattern: "none", defaultNum: "100", defaultPhrase: "시그풍", props: ["flat-blue-bubbles", "flat-blue-bow", "flat-blue-cloud", "flat-green-flowers", "flat-pink-heart-ring", "flat-purple-dots"] },

    { key: "cat486Rose", name: "486 사랑해 · 로즈", categoryMode: true, simple: true, rich: true, texture: "catLove486", hue: 0, primary: "#f06f87", secondary: "#fff0f3", accent: "#d4375a", pattern: "none", defaultNum: "486", defaultPhrase: "사랑해", props: ["cat486-heart-frame", "cat486-double-hearts", "cat486-cupid-heart", "cat486-envelope", "cat486-heart-flower", "cat486-heart-petals"] },
    { key: "cat486Coral", name: "486 사랑해 · 코랄", categoryMode: true, simple: true, rich: true, texture: "catLove486", hue: 18, primary: "#f47e72", secondary: "#fff2ed", accent: "#d94b43", pattern: "none", defaultNum: "486", defaultPhrase: "사랑해", props: ["cat486-double-hearts", "cat486-envelope", "cat486-heart-petals", "cat486-heart-frame", "cat486-heart-flower", "cat486-cupid-heart"] },

    { key: "cat14xxSky", name: "14xx 천사 · 스카이", categoryMode: true, simple: true, rich: true, texture: "catAngel14xx", hue: 0, primary: "#5fa9ef", secondary: "#edf8ff", accent: "#245ac4", pattern: "none", defaultNum: "1482", defaultPhrase: "천사", props: ["cat14xx-wings", "cat14xx-halo", "cat14xx-cloud", "cat14xx-feather", "cat14xx-sparkles", "cat14xx-halo-bow"] },
    { key: "cat14xxLilac", name: "14xx 천사 · 라일락", categoryMode: true, simple: true, rich: true, texture: "catAngel14xx", hue: 38, primary: "#8b8ee9", secondary: "#f4f1ff", accent: "#4a4fbd", pattern: "none", defaultNum: "1482", defaultPhrase: "천사", props: ["cat14xx-wings", "cat14xx-halo-bow", "cat14xx-cloud", "cat14xx-sparkles", "cat14xx-halo", "cat14xx-feather"] },

    { key: "cat28xxLilac", name: "28xx 이쁜 · 라일락", categoryMode: true, simple: true, rich: true, texture: "catPretty28xx", hue: 0, primary: "#a47bdc", secondary: "#f7f0ff", accent: "#6d3da3", pattern: "none", defaultNum: "2846", defaultPhrase: "이쁜", props: ["cat28xx-mirror", "cat28xx-bow", "cat28xx-flowers", "cat28xx-pearls", "cat28xx-lace-corner", "cat28xx-sparkles"] },
    { key: "cat28xxPink", name: "28xx 이쁜 · 핑크", categoryMode: true, simple: true, rich: true, texture: "catPretty28xx", hue: 320, primary: "#e58bbb", secondary: "#fff0f7", accent: "#ae4b7c", pattern: "none", defaultNum: "2846", defaultPhrase: "이쁜", props: ["cat28xx-bow", "cat28xx-mirror", "cat28xx-pearls", "cat28xx-flowers", "cat28xx-sparkles", "cat28xx-lace-corner"] },

    { key: "cat57xxIndigo", name: "57xx 오직 · 인디고", categoryMode: true, simple: true, rich: true, texture: "catOnly57xx", hue: 0, primary: "#687bd4", secondary: "#f0f3ff", accent: "#30489f", pattern: "none", defaultNum: "5746", defaultPhrase: "오직", props: ["cat57xx-heart-lock", "cat57xx-key", "cat57xx-heart-medallion", "cat57xx-linked-hearts", "cat57xx-ribbon-bow", "cat57xx-seal-tag"] },
    { key: "cat57xxViolet", name: "57xx 오직 · 바이올렛", categoryMode: true, simple: true, rich: true, texture: "catOnly57xx", hue: 34, primary: "#8a6bd4", secondary: "#f5efff", accent: "#5535a2", pattern: "none", defaultNum: "5746", defaultPhrase: "오직", props: ["cat57xx-heart-lock", "cat57xx-linked-hearts", "cat57xx-key", "cat57xx-heart-medallion", "cat57xx-seal-tag", "cat57xx-ribbon-bow"] },

    { key: "cat12486Berry", name: "12486 많이 사랑해 · 베리", categoryMode: true, simple: true, rich: true, texture: "catLove12486", hue: 0, primary: "#ec6690", secondary: "#fff0f5", accent: "#bd315e", pattern: "none", defaultNum: "12486", defaultPhrase: "많이 사랑해", props: ["cat12486-layered-hearts", "cat12486-double-heart-frame", "cat12486-heart-garland", "cat12486-envelopes", "cat12486-heart-bow", "cat12486-heart-confetti"] },
    { key: "cat12486Purple", name: "12486 많이 사랑해 · 퍼플", categoryMode: true, simple: true, rich: true, texture: "catLove12486", hue: 32, primary: "#b56bd4", secondary: "#f9efff", accent: "#8139a0", pattern: "none", defaultNum: "12486", defaultPhrase: "많이 사랑해", props: ["cat12486-double-heart-frame", "cat12486-layered-hearts", "cat12486-heart-bow", "cat12486-heart-garland", "cat12486-heart-confetti", "cat12486-envelopes"] },

    { key: "flatPinkA", name: "평면 핑크 쌍원", texture: "flatPinkA", primary: "#ff7f91", secondary: "#fff0f2", accent: "#f25e73", pattern: "none", rich: true, props: ["flat-pink-heart-ring", "flat-pink-heart-cluster", "flat-pink-bow", "flat-pink-flowers", "flat-pink-sparkles", "flat-pink-bubble"] },
    { key: "flatPinkB", name: "평면 핑크 구름", texture: "flatPinkB", primary: "#ff6682", secondary: "#fff3ee", accent: "#ed526d", pattern: "none", rich: true, props: ["flat-pink-bubble", "flat-pink-flowers", "flat-pink-bow", "flat-pink-heart-ring", "flat-pink-sparkles"] },
    { key: "flatGrayA", name: "평면 흑백 룰렛", texture: "flatGrayA", primary: "#555555", secondary: "#f4f4f4", accent: "#262626", pattern: "none", rich: true, props: ["flat-gray-roulette", "flat-gray-spirals", "flat-gray-arrow", "flat-gray-pluses", "flat-gray-burst"] },
    { key: "flatGrayB", name: "평면 흑백 휠", texture: "flatGrayB", primary: "#6b6b6b", secondary: "#f1f1f1", accent: "#252525", pattern: "none", rich: true, props: ["flat-gray-wheel", "flat-gray-arrow", "flat-gray-pluses", "flat-gray-spirals", "flat-gray-burst"] },
    { key: "flatBlueA", name: "평면 블루 날개", texture: "flatBlueA", primary: "#39aeea", secondary: "#eaf8ff", accent: "#1250a2", pattern: "none", rich: true, props: ["flat-blue-wings", "flat-blue-halo", "flat-blue-cloud", "flat-blue-sparkles", "flat-blue-bow", "flat-blue-bubbles"] },
    { key: "flatBlueB", name: "평면 블루 구름", texture: "flatBlueB", primary: "#20a5df", secondary: "#e7f7ff", accent: "#173f87", pattern: "none", rich: true, props: ["flat-blue-cloud", "flat-blue-bubbles", "flat-blue-bow", "flat-blue-wings", "flat-blue-sparkles"] },
    { key: "flatOrangeA", name: "평면 오렌지 쌍원", texture: "flatOrangeA", primary: "#ff9b20", secondary: "#fff4d9", accent: "#ef7f0b", pattern: "none", rich: true, props: ["flat-orange-rings", "flat-orange-butterflies", "flat-orange-flowers", "flat-orange-hearts", "flat-orange-rays", "flat-orange-confetti"] },
    { key: "flatOrangeB", name: "평면 옐로 원형", texture: "flatOrangeB", primary: "#ffc64b", secondary: "#fff8d9", accent: "#e46b09", pattern: "none", rich: true, props: ["flat-orange-flowers", "flat-orange-butterflies", "flat-orange-rays", "flat-orange-hearts", "flat-orange-confetti"] },
    { key: "flatGreenA", name: "평면 그린 클로버", texture: "flatGreenA", primary: "#66c76a", secondary: "#eefbec", accent: "#277f3b", pattern: "none", rich: true, props: ["flat-green-clovers", "flat-green-gingham", "flat-green-bow", "flat-green-flowers", "flat-green-curls", "flat-green-bubble"] },
    { key: "flatGreenB", name: "평면 민트 체크", texture: "flatGreenB", primary: "#8bd28a", secondary: "#f2fff2", accent: "#388f48", pattern: "none", rich: true, props: ["flat-green-gingham", "flat-green-bubble", "flat-green-flowers", "flat-green-curls", "flat-green-bow"] },
    { key: "flatPurpleA", name: "평면 퍼플 리본", texture: "flatPurpleA", primary: "#8d78ea", secondary: "#f3efff", accent: "#5242cb", pattern: "none", rich: true, props: ["flat-purple-scalloped-ring", "flat-purple-bows", "flat-purple-dots", "flat-purple-heart-lock", "flat-purple-flowers", "flat-purple-sparkles"] },
    { key: "flatPurpleB", name: "평면 라일락 장식", texture: "flatPurpleB", primary: "#8c90ed", secondary: "#f4f2ff", accent: "#40338f", pattern: "none", rich: true, props: ["flat-purple-dots", "flat-purple-bows", "flat-purple-scalloped-ring", "flat-purple-sparkles", "flat-purple-heart-lock"] },

    { key: "richPink", name: "리치 핑크 레이스", texture: "richPink", primary: "#ff719c", secondary: "#ffe5ee", accent: "#ed4f81", pattern: "none", rich: true, props: ["img-heart-cluster", "img-ribbon-bow", "img-flower-lace", "img-pearl-heart-ring", "img-sparkle-cluster"] },
    { key: "richYellow", name: "리치 옐로 룰렛", texture: "richYellow", primary: "#ff9f24", secondary: "#fff0c9", accent: "#ee741d", pattern: "none", rich: true, props: ["img-roulette-wheel", "img-wheel-spokes", "img-target-rings", "img-curly-doodles", "img-sparkle-cluster"] },
    { key: "richBlue", name: "리치 블루 엔젤", texture: "richBlue", primary: "#5ba9ef", secondary: "#e8f5ff", accent: "#507ee1", pattern: "none", rich: true, props: ["img-angel-wings", "img-cloud-halo", "img-halo-ring", "img-feather-chain", "img-star-wand"] },
    { key: "richPurple", name: "리치 퍼플 리본", texture: "richPurple", primary: "#8f68d9", secondary: "#f0e9ff", accent: "#7550bf", pattern: "none", rich: true, props: ["img-ribbon-bow", "img-heart-crown", "img-pearl-heart-ring", "img-lace-oval", "img-crescent-orbit"] },
    { key: "richGreen", name: "리치 민트 패치", texture: "richGreen", primary: "#55bd82", secondary: "#effbdc", accent: "#339d75", pattern: "none", rich: true, props: ["img-flower-lace", "img-curly-doodles", "img-cloud-bubble", "img-twin-circle-frame", "img-sparkle-cluster"] },
    { key: "richRed", name: "리치 레드 코믹", texture: "richRed", primary: "#e92b31", secondary: "#fff0d5", accent: "#bf171e", pattern: "none", rich: true, props: ["img-comic-burst", "img-lightning-cluster", "img-flame-swoosh", "img-speed-lines", "img-target-rings"] },
    { key: "pink", name: "심플 핑크 하트", texture: "pink", primary: "#ff8eae", secondary: "#ffe8f0", accent: "#ff628e", pattern: "hearts" },
    { key: "blue", name: "심플 하늘 구름", texture: "blue", primary: "#4fbdf2", secondary: "#dff6ff", accent: "#209edb", pattern: "bubbles" },
    { key: "yellow", name: "심플 노랑 파티", texture: "yellow", primary: "#ffbe3f", secondary: "#fff1bd", accent: "#ff9c24", pattern: "flowers" },
    { key: "lavender", name: "심플 보라 드림", texture: "lavender", primary: "#786af5", secondary: "#ebe8ff", accent: "#6553ed", pattern: "bows" },
    { key: "red", name: "심플 레드 에너지", texture: "red", primary: "#f45c51", secondary: "#ffe0db", accent: "#e83c35", pattern: "lightning" }
  ];

  const richVariantThemes = [
    Object.assign({}, themes.find(theme => theme.key === "richPink"), {
      key: "richPinkCoral", name: "리치 코랄 레이스", texture: "richPinkCoral",
      hue: 18, saturation: 96, brightness: 104,
      primary: "#ff877b", secondary: "#fff0e7", accent: "#ed665c"
    }),
    Object.assign({}, themes.find(theme => theme.key === "richPink"), {
      key: "richPinkBerry", name: "리치 베리 레이스", texture: "richPinkBerry",
      hue: -24, saturation: 105, brightness: 97,
      primary: "#dc69a7", secondary: "#fbe8f5", accent: "#b94683"
    }),
    Object.assign({}, themes.find(theme => theme.key === "richBlue"), {
      key: "richBlueAqua", name: "리치 아쿠아 엔젤", texture: "richBlueAqua",
      hue: -18, saturation: 95, brightness: 104,
      primary: "#55c8d3", secondary: "#e7fcff", accent: "#278ea5"
    }),
    Object.assign({}, themes.find(theme => theme.key === "richBlue"), {
      key: "richBlueLilac", name: "리치 라일락 엔젤", texture: "richBlueLilac",
      hue: 38, saturation: 91, brightness: 103,
      primary: "#8f9be9", secondary: "#f0efff", accent: "#6870cb"
    }),
    Object.assign({}, themes.find(theme => theme.key === "richPurple"), {
      key: "richPurpleRose", name: "리치 로즈 리본", texture: "richPurpleRose",
      hue: -32, saturation: 94, brightness: 104,
      primary: "#d678b7", secondary: "#fbeafb", accent: "#aa5794"
    }),
    Object.assign({}, themes.find(theme => theme.key === "richPurple"), {
      key: "richPurpleIndigo", name: "리치 인디고 리본", texture: "richPurpleIndigo",
      hue: 24, saturation: 104, brightness: 96,
      primary: "#6f6bd3", secondary: "#ecebff", accent: "#4d49ad"
    }),
    Object.assign({}, themes.find(theme => theme.key === "richGreen"), {
      key: "richGreenAqua", name: "리치 아쿠아 패치", texture: "richGreenAqua",
      hue: 25, saturation: 92, brightness: 104,
      primary: "#56bdb0", secondary: "#e7faf5", accent: "#318e82"
    }),
    Object.assign({}, themes.find(theme => theme.key === "richGreen"), {
      key: "richGreenSpring", name: "리치 스프링 패치", texture: "richGreenSpring",
      hue: -22, saturation: 94, brightness: 105,
      primary: "#83c863", secondary: "#f3fbdf", accent: "#579a3c"
    })
  ];
  themes.push(...richVariantThemes);

  const modernThemes = [
    { key: "modernPeach", name: "모던 피치 체리", texture: "modernPeach", modern: true, rich: true, surface: "soft-grid", motif: "cherry", primary: "#ff9a82", secondary: "#fff4ec", accent: "#f47762", pattern: "none", props: ["flowers", "sparkles", "bubble", "heart-cluster"] },
    { key: "modernSky", name: "모던 스카이 클라우드", texture: "modernSky", modern: true, rich: true, surface: "stripe", motif: "cloud", primary: "#6baeff", secondary: "#eef7ff", accent: "#4d87dc", pattern: "none", props: ["bubble", "sparkles", "wings", "ring"] },
    { key: "modernRose", name: "모던 로즈 리본", texture: "modernRose", modern: true, rich: true, surface: "dots", motif: "heart", primary: "#f08aa4", secondary: "#fff0f4", accent: "#d96884", pattern: "none", props: ["heart-cluster", "sparkles", "bow", "flowers"] },
    { key: "modernPink", name: "사랑해 하트 아치", texture: "modernLoveHeart", modern: true, rich: true, surface: "soft-grid", motif: "ribbon", primary: "#f39bbb", secondary: "#fff2f7", accent: "#d8769b", pattern: "none", props: ["bow", "heart-cluster", "sparkles", "double-ring"] },
    { key: "modernLilac", name: "모던 라일락 펄", texture: "modernLilac", modern: true, rich: true, surface: "dots", motif: "pearls", primary: "#a692eb", secondary: "#f5f1ff", accent: "#7f6dc6", pattern: "none", props: ["ring", "sparkles", "bow", "double-ring"] },
    { key: "modernMint", name: "모던 민트 클로버", texture: "modernMint", modern: true, rich: true, surface: "gingham", motif: "clover", primary: "#78cfa6", secondary: "#effbf6", accent: "#54a982", pattern: "none", props: ["flowers", "sparkles", "bow", "bubble"] },
    { key: "modernLemon", name: "모던 레몬 스타", texture: "modernLemon", modern: true, rich: true, surface: "confetti", motif: "stars", primary: "#f6c85f", secondary: "#fff8df", accent: "#dca83d", pattern: "none", props: ["sparkles", "flowers", "bow", "ring"] },
    { key: "modernAqua", name: "33 룰렛 민트", texture: "modernRoulette", modern: true, rich: true, surface: "bubbles", motif: "waves", primary: "#69c9d7", secondary: "#ecfbfd", accent: "#43a4b4", pattern: "none", props: ["bubble", "ring", "sparkles", "wings"] },
    { key: "modernBlue", name: "14XX 천사 윙", texture: "modernAngel", modern: true, rich: true, surface: "grid", motif: "halo", primary: "#7b9ee9", secondary: "#eff3ff", accent: "#5879c3", pattern: "none", props: ["wings", "ring", "sparkles", "bubble"] },
    { key: "modernMono", name: "330 대왕룰렛", texture: "modernRouletteGiant", modern: true, rich: true, surface: "grid", motif: "loops", primary: "#75aeea", secondary: "#f0f7ff", accent: "#4f84c3", pattern: "none", props: ["ring", "double-ring", "bubble", "sparkles"] },
    { key: "modernCoral", name: "12486 더블하트", texture: "modernDoubleHeart", modern: true, rich: true, surface: "dots", motif: "flowers", primary: "#f28c82", secondary: "#fff2ef", accent: "#d66962", pattern: "none", props: ["flowers", "heart-cluster", "sparkles", "bow"] },
    { key: "modernBerry", name: "28XX 이쁜 리본", texture: "modernPrettyBow", modern: true, rich: true, surface: "stripe", motif: "heart-lock", primary: "#b786df", secondary: "#f8f0ff", accent: "#8e5fb8", pattern: "none", props: ["heart-cluster", "bow", "ring", "sparkles"] }
  ];
  themes.push(...modernThemes);

  const backgroundTextureGroups = [
    { label: "모던 2D 배경 12종", keys: modernThemes.map(theme => theme.key) },
    { label: "시그 숫자 테마 8종", keys: ["cat33Mono", "cat330Lavender", "cat1xxMint", "cat486Rose", "cat14xxSky", "cat28xxLilac", "cat57xxIndigo", "cat12486Berry"] },
    { label: "플랫 컬러 12종", keys: ["flatPinkA", "flatPinkB", "flatGrayA", "flatGrayB", "flatBlueA", "flatBlueB", "flatOrangeA", "flatOrangeB", "flatGreenA", "flatGreenB", "flatPurpleA", "flatPurpleB"] },
    { label: "리치 일러스트 6종", keys: ["richPink", "richYellow", "richBlue", "richPurple", "richGreen", "richRed"] },
    { label: "심플 5종", keys: ["pink", "blue", "yellow", "lavender", "red"] }
  ];
  const backgroundTextureOptionsHtml = backgroundTextureGroups.map(group => {
    const options = group.keys.map(key => themes.find(theme => theme.key === key)).filter(Boolean);
    return `<optgroup label="${escapeHtml(group.label)}">${options.map(theme => `<option value="${escapeHtml(theme.texture)}">${escapeHtml(theme.name)}</option>`).join("")}</optgroup>`;
  }).join("");

  const presetThemeKeys = [
    "modernPeach", "modernSky", "modernRose", "modernPink",
    "modernLilac", "modernMint", "modernLemon", "modernAqua",
    "modernBlue", "modernMono", "modernCoral", "modernBerry"
  ];

  const layouts = [
    {
      key: "full",
      name: "일자 배경",
      mask: "band-straight",
      top: 84,
      curve: 18,
      char: { x: 75, y: 167, scale: .91, rot: 0 },
      phrase: { x: 201, y: 139, size: 34, rot: -2 },
      num1: { x: 232, y: 219, size: 57 },
      num2: { enabled: false, x: 48, y: 219, size: 54 },
      props: [{ type: "ring", x: 78, y: 162, scale: 1.08, rot: 0, front: false }]
    },
    {
      key: "dome",
      name: "끝만 둥근 캡",
      mask: "rounded-cap",
      top: 76,
      curve: 29,
      char: { x: 81, y: 167, scale: .92, rot: 0 },
      phrase: { x: 207, y: 137, size: 33, rot: 1 },
      num1: { x: 229, y: 219, size: 57 },
      num2: { enabled: false, x: 48, y: 219, size: 54 },
      props: [{ type: "double-ring", x: 197, y: 165, scale: 1.18, rot: 0, front: false }]
    },
    {
      key: "roulette",
      name: "룰렛 소품",
      mask: "band-straight",
      top: 86,
      curve: 23,
      char: { x: 205, y: 169, scale: .94, rot: 0 },
      phrase: { x: 79, y: 142, size: 33, rot: -2 },
      num1: { x: 61, y: 219, size: 57 },
      num2: { enabled: false, x: 245, y: 219, size: 52 },
      props: [{ type: "roulette", x: 72, y: 170, scale: 1.2, rot: -9, front: false }]
    },
    {
      key: "twin",
      name: "쌍원 프레임",
      mask: "twin-dome",
      top: 75,
      curve: 25,
      char: { x: 146, y: 171, scale: .94, rot: 0 },
      phrase: { x: 146, y: 111, size: 28, rot: 0 },
      num1: { x: 50, y: 220, size: 53 },
      num2: { enabled: true, x: 244, y: 220, size: 53 },
      props: [{ type: "twin-circles", x: 146, y: 167, scale: 1.14, rot: 0, front: false }]
    },
    {
      key: "slope",
      name: "오른쪽 라운드 캡",
      mask: "rounded-cap",
      top: 85,
      curve: 32,
      char: { x: 89, y: 169, scale: .96, rot: 0 },
      phrase: { x: 210, y: 142, size: 32, rot: 2 },
      num1: { x: 233, y: 220, size: 57 },
      num2: { enabled: false, x: 45, y: 220, size: 51 },
      props: [{ type: "heart-cluster", x: 224, y: 173, scale: 1, rot: 6, front: false }]
    },
    {
      key: "cloud",
      name: "넓은 낮은 돔",
      mask: "dome-soft",
      top: 83,
      curve: 22,
      char: { x: 148, y: 170, scale: .93, rot: 0 },
      phrase: { x: 146, y: 111, size: 29, rot: 0 },
      num1: { x: 229, y: 219, size: 55 },
      num2: { enabled: false, x: 53, y: 219, size: 52 },
      props: [
        { type: "bubble", x: 147, y: 166, scale: 1.14, rot: 0, front: false },
        { type: "sparkles", x: 51, y: 143, scale: .75, rot: -6, front: true }
      ]
    },
    {
      key: "wings",
      name: "날개 포인트",
      mask: "dome-high",
      top: 84,
      curve: 28,
      char: { x: 146, y: 170, scale: .9, rot: 0 },
      phrase: { x: 146, y: 112, size: 29, rot: 0 },
      num1: { x: 48, y: 221, size: 51 },
      num2: { enabled: true, x: 245, y: 221, size: 51 },
      props: [{ type: "wings", x: 146, y: 170, scale: 1.15, rot: 0, front: false }]
    },
    {
      key: "burst",
      name: "일자 포인트",
      mask: "band-straight",
      top: 84,
      curve: 22,
      char: { x: 207, y: 170, scale: .95, rot: 0 },
      phrase: { x: 78, y: 141, size: 32, rot: -3 },
      num1: { x: 58, y: 219, size: 56 },
      num2: { enabled: false, x: 245, y: 218, size: 50 },
      props: [
        { type: "rays", x: 80, y: 169, scale: 1.12, rot: -8, front: false },
        { type: "sparkles", x: 239, y: 128, scale: .65, rot: 8, front: true }
      ]
    }
  ];

  const backgroundCardLayout = Object.assign({}, layouts[0], {
    key: "background-card",
    name: "배경",
    mask: "band-straight",
    top: 84,
    curve: 22,
    imageScale: 1,
    offsetX: 0,
    offsetY: 0
  });

  const placementLayouts = [
    Object.assign({}, layouts[0], { key: "char-left", name: "캐릭터 왼쪽 · 문구 오른쪽" }),
    Object.assign({}, layouts[2], { key: "char-right", name: "캐릭터 오른쪽 · 문구 왼쪽" }),
    Object.assign({}, layouts[5], { key: "char-center", name: "캐릭터 중앙 · 문구 위" }),
    Object.assign({}, layouts[3], { key: "char-center-split", name: "캐릭터 중앙 · 숫자 양쪽" })
  ];

  const state = {
    presetIndex: 0,
    placementIndex: 0,
    background: {
      texture: "modernPeach",
      modern: true,
      surface: "soft-grid",
      motif: "cherry",
      variant: 0,
      mask: "band-straight",
      top: 84,
      curve: 24,
      imageScale: 1,
      offsetX: 0,
      offsetY: 0,
      hue: 0,
      saturation: 100,
      brightness: 100,
      primary: "#ff9a82",
      secondary: "#fff4ec",
      tintOpacity: 0,
      pattern: "none",
      customImg: null,
      customSourceCanvas: null,
      customName: "",
      customBackup: null,
      maskCanvas: null,
      maskPaintMode: "theme",
      maskFillColor: "#ffe8ef",
      maskStrokeColor: "#ff7697",
      maskStrokeWidth: 3,
      maskDoubleOutline: true,
      maskOuterColor: "#ffffff",
      maskOuterWidth: 2
    },
    character: {
      img: null,
      name: "",
      x: 75,
      y: 167,
      scale: .91,
      rot: 0,
      flip: false,
      opacity: 1,
      locked: false
    },
    phrase: {
      text: "사랑해",
      x: 201,
      y: 139,
      size: 34,
      rot: -2,
      fontKey: "sig-jua",
      lineHeight: .83,
      fill: "#ffffff",
      stroke: "#ff628e",
      innerStrokeEnabled: true,
      innerStrokeWidth: .075,
      middleStrokeEnabled: true,
      middleStroke: "#ffffff",
      middleStrokeWidth: .14,
      outerStrokeEnabled: true,
      shadow: "#8d3152",
      outerStrokeWidth: .2,
      locked: false
    },
    num1: {
      text: "486",
      x: 232,
      y: 219,
      size: MOBILE_NUMBER_SIZE,
      rot: 0,
      enabled: true,
      locked: false
    },
    num2: {
      text: "46",
      x: 48,
      y: 219,
      size: MOBILE_NUMBER_SIZE,
      rot: 0,
      enabled: false,
      locked: false
    },
    props: [],
    outputProfiles: {
      mobile: { x: 0, y: 0, scale: 1 },
      pc: { x: 0, y: 0, scale: 1 },
      weflab: { x: 0, y: 0, scale: 1 }
    },
    selected: { kind: "character", index: -1 },
    snapEnabled: true,
    showGuides: true,
    previewDark: false,
    exportBaseName: SIG_DEFAULT_EXPORT_BASE
  };

  const images = {};
  const propImages = {};
  let canvas;
  let ctx;
  let view;
  let stage;
  let dragging = null;
  let activeSnapGuides = null;
  let layerHitCanvas = null;
  let layerHitCtx = null;
  const imageAlphaBoundsCache = new WeakMap();
  let renderQueued = false;
  let customPropSequence = 0;
  let customPhraseFontSequence = 0;
  const customPhraseFonts = new Map();
  let projectDirty = false;
  let projectIoBusy = false;
  let currentProjectPath = "";
  let projectIoGeneration = 0;
  let sigConfirmResolver = null;
  let sigConfirmPreviousFocus = null;
  const MAIN_HISTORY_LIMIT = 60;
  let mainUndoStack = [];
  let mainRedoStack = [];
  let mainHistoryReady = false;
  let mainBurstBefore = null;
  let mainBurstTimer = 0;
  let maskEditorCanvas = null;
  let maskEditorCtx = null;
  let maskWorkingCanvas = null;
  let maskShapeSession = null;
  let outputPreviewType = "mobile";
  let outputPreviewTimer = 0;
  let outputProfileHistoryBefore = null;
  let maskHistory = [];
  let maskHistoryIndex = -1;
  let maskGesture = null;
  let maskEditorTool = "brush";
  let maskEditorZoom = 1;
  let maskPointerPoint = null;
  let maskPointerInside = false;
  let maskCursorFrame = 0;
  let maskRenderFrame = 0;
  const maskOutlineCache = new WeakMap();

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value)));
  }

  function deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function nextPaint() {
    return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function settleSigConfirm(accepted) {
    const dialog = document.getElementById("sigConfirmDialog");
    if (dialog) dialog.hidden = true;
    document.body.classList.remove("sig-confirming");
    const resolve = sigConfirmResolver;
    sigConfirmResolver = null;
    const previousFocus = sigConfirmPreviousFocus;
    sigConfirmPreviousFocus = null;
    if (previousFocus?.isConnected && typeof previousFocus.focus === "function") {
      try { previousFocus.focus({ preventScroll: true }); } catch (_) { previousFocus.focus(); }
    }
    if (resolve) resolve(!!accepted);
  }

  function askSigConfirm(message, options = {}) {
    const dialog = document.getElementById("sigConfirmDialog");
    if (!dialog) return Promise.resolve(window.confirm(String(message || "계속할까?")));
    if (sigConfirmResolver) settleSigConfirm(false);
    sigConfirmPreviousFocus = document.activeElement;
    document.getElementById("sigConfirmTitle").textContent = options.title || "확인";
    document.getElementById("sigConfirmMessage").textContent = String(message || "계속할까?");
    document.getElementById("sigConfirmAccept").textContent = options.confirmLabel || "계속";
    document.getElementById("sigConfirmCancel").textContent = options.cancelLabel || "취소";
    dialog.hidden = false;
    document.body.classList.add("sig-confirming");
    requestAnimationFrame(() => {
      if (!dialog.hidden) document.getElementById("sigConfirmAccept")?.focus();
    });
    return new Promise(resolve => { sigConfirmResolver = resolve; });
  }

  function bindSigConfirm() {
    const dialog = document.getElementById("sigConfirmDialog");
    document.getElementById("sigConfirmAccept")?.addEventListener("click", () => settleSigConfirm(true));
    document.getElementById("sigConfirmCancel")?.addEventListener("click", () => settleSigConfirm(false));
    dialog?.addEventListener("pointerdown", event => {
      if (event.target === dialog) settleSigConfirm(false);
    });
    document.addEventListener("keydown", event => {
      if (!dialog || dialog.hidden) return;
      event.stopImmediatePropagation();
      if (event.ctrlKey || event.metaKey || event.altKey) event.preventDefault();
      if (event.key === "Tab") {
        event.preventDefault();
        const accept = document.getElementById("sigConfirmAccept");
        const cancel = document.getElementById("sigConfirmCancel");
        (event.shiftKey
          ? (document.activeElement === accept ? cancel : accept)
          : (document.activeElement === cancel ? accept : cancel))?.focus();
        return;
      }
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        settleSigConfirm(event.key === "Enter" && document.activeElement?.id !== "sigConfirmCancel");
      }
    }, true);
  }

  function hexToRgba(hex, alpha) {
    let h = String(hex || "#000000").replace("#", "");
    if (h.length === 3) h = h.split("").map(ch => ch + ch).join("");
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }

  function mixHex(a, b, amount) {
    const parse = hex => {
      const h = hex.replace("#", "");
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    };
    const aa = parse(a);
    const bb = parse(b);
    const out = aa.map((v, i) => Math.round(v + (bb[i] - v) * amount));
    return `#${out.map(v => v.toString(16).padStart(2, "0")).join("")}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function phraseFontRecord(fontKey) {
    return PHRASE_FONT_OPTIONS.find(font => font.key === fontKey)
      || customPhraseFonts.get(fontKey)
      || PHRASE_FONT_OPTIONS[0];
  }

  function phraseFontFamily(layer = state.phrase) {
    return phraseFontRecord(layer?.fontKey || "sig-jua").family;
  }

  function phraseLineHeight(layer) {
    const value = Number(layer?.lineHeight);
    return Number.isFinite(value) ? clamp(value, .55, 1.6) : .83;
  }

  function phraseStrokeRatio(layer, key, fallback) {
    const value = Number(layer?.[key]);
    return Math.max(0, Number.isFinite(value) ? value : fallback);
  }

  function phraseStrokeWidth(layer, key, fallback) {
    return phraseStrokeRatio(layer, key, fallback) * Number(layer?.size || 0);
  }

  function renderPhraseFontOptions() {
    const select = document.getElementById("sigPhraseFont");
    if (!select) return;
    const options = [
      ...PHRASE_FONT_OPTIONS,
      ...Array.from(customPhraseFonts.values())
    ];
    select.innerHTML = options.map(font => `<option value="${escapeHtml(font.key)}">${escapeHtml(font.label)}</option>`).join("");
    if (!options.some(font => font.key === state.phrase.fontKey)) state.phrase.fontKey = "sig-jua";
    select.value = state.phrase.fontKey;
  }

  function propDefaults(type, index = 0) {
    return {
      type,
      x: 146 + index * 8,
      y: 166,
      scale: 1,
      rot: 0,
      opacity: .92,
      hue: 0,
      saturation: 100,
      brightness: 100,
      color1: state.background.primary,
      color2: state.background.secondary,
      front: false,
      locked: false
    };
  }

  function createInterface() {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "signature_balloon.css?v=20260818-v18-freedom-rc2";
    document.head.appendChild(css);

    const tabs = document.getElementById("modeTabs");
    if (!tabs) return false;

    let tab = document.getElementById("tabSig");
    if (!tab) {
      tab = document.createElement("button");
      tab.id = "tabSig";
      tab.type = "button";
      tab.textContent = "🎈 시그풍";
      tabs.appendChild(tab);
    }

    view = document.createElement("div");
    view.id = "sigView";
    view.innerHTML = `
      <div class="sig-shell">
        <aside class="sig-panel">
          <div class="sig-panel-head">
            <h2>빠른 배경 ${presets.length}종 · 전체 43종</h2>
            <p>왼쪽은 대표 배경 12종 빠른 선택이야. 오른쪽에서 전체 43종·커스텀 PNG·소품과 배경판 직접 그리기를 조절해.</p>
          </div>
          <div class="sig-scroll">
            <div id="sigPresetGrid" class="sig-preset-grid"></div>
          </div>
        </aside>

        <main class="sig-stage-card">
          <div class="sig-stage-top">
            <div class="sig-stage-title">
              <strong>시그풍 캔버스</strong>
              <span class="sig-badge">모바일 293×248 기준</span>
              <span class="sig-badge">하단 직선 고정</span>
            </div>
            <div class="sig-toolbar">
              <div class="sig-project-tools" aria-label="시그풍 프로젝트">
                <button type="button" class="sig-btn" id="sigProjectOpen">프로젝트 열기</button>
                <button type="button" class="sig-btn primary" id="sigProjectSave">프로젝트 저장</button>
                <span class="sig-project-state" id="sigProjectState" title="아직 프로젝트 파일로 저장하지 않았어.">새 프로젝트</span>
                <input id="sigProjectFile" type="file" accept=".json,.pbsig.json,application/json">
              </div>
              <div class="sig-history-tools" aria-label="작업 기록">
                <button type="button" class="sig-btn sig-icon-btn" id="sigUndo" title="되돌리기 · Ctrl+Z" aria-label="되돌리기" disabled>↶</button>
                <button type="button" class="sig-btn sig-icon-btn" id="sigRedo" title="다시 실행 · Ctrl+Y" aria-label="다시 실행" disabled>↷</button>
              </div>
              <div class="sig-curve-quick" aria-label="배경판 모양">
                <span>배경판</span>
                <div class="sig-seg">
                  <button type="button" data-sig-mask="band-straight">일자</button>
                  <button type="button" class="sig-mask-open" id="sigMaskOpenTop">직접 그리기</button>
                </div>
              </div>
              <button type="button" class="sig-btn" id="sigDark">어두운 화면</button>
              <button type="button" class="sig-btn" id="sigGuides">가이드 숨김</button>
              <label class="sig-snap-toggle" title="레이어를 중앙선·안전선·캔버스 가장자리에 붙여줘. 드래그 중 Alt를 누르면 잠시 꺼져."><input id="sigSnapEnabled" type="checkbox" checked> 위치 스냅 <small>Alt 우회</small></label>
              <button type="button" class="sig-btn" id="sigAutoFit">내용에 맞춰 자르기</button>
              <button type="button" class="sig-btn" id="sigJumpLayers">레이어·잠금</button>
              <button type="button" class="sig-btn" id="sigJumpOutput">출력별 보정</button>
            </div>
          </div>
          <div class="sig-busy-overlay" id="sigBusyOverlay" hidden aria-live="assertive" aria-busy="true">
            <div class="sig-busy-card"><span class="sig-busy-spinner" aria-hidden="true"></span><strong id="sigBusyMessage">처리 중…</strong></div>
          </div>
          <div class="sig-stage" id="sigStage">
            <div class="sig-canvas-wrap">
              <canvas id="sigCanvas" width="${W * DPR}" height="${H * DPR}"></canvas>
            </div>
          </div>
          <div>
            <div class="sig-stage-foot">
              <div class="sig-foot-note">
                보이는 부분을 바로 잡아 이동 · 모서리 손잡이로 크기 조절<br>
                모바일은 상단 84px이 저장 때 반드시 투명해져. 배경판은 직접 그려 만들 수 있어.
              </div>
              <label class="sig-export-name" for="sigExportBaseName"><span>저장 파일명</span><input id="sigExportBaseName" type="text" value="${SIG_DEFAULT_EXPORT_BASE}" maxlength="80" spellcheck="false"></label>
              <div class="sig-export-actions">
                <button type="button" class="sig-btn" id="sigExportMobile">모바일 PNG</button>
                <button type="button" class="sig-btn" id="sigExportPc">PC PNG</button>
                <button type="button" class="sig-btn" id="sigExportBoth">SOOP 2종</button>
                <button type="button" class="sig-btn" id="sigExportWeflab">위플랩 고화질</button>
                <button type="button" class="sig-btn primary" id="sigExportAll">3종 저장</button>
              </div>
            </div>
            <div class="sig-export-status" id="sigExportStatus"></div>
          </div>
        </main>

        <aside class="sig-panel controls-panel">
          <div class="sig-panel-head">
            <h3>레이어와 스타일</h3>
            <p>숫자는 BM-JUA · 빨강 채움 · 흰 3px · 검정 2px, 모바일 55pt / PC 38pt로 고정돼.</p>
          </div>
          <div class="sig-selected-layer-bar" id="sigSelectedLayerBar">
            <span>선택</span><strong id="sigSelectedLayerName">캐릭터</strong>
            <button type="button" class="sig-btn" id="sigSelectedLayerLock">🔓 잠금</button>
            <button type="button" class="sig-btn" id="sigLayerListJump">전체 목록</button>
          </div>
          <div class="sig-scroll sig-controls">
            <section class="sig-section">
              <div class="sig-section-title">1. 캐릭터</div>
              <div class="sig-upload">
                <label class="sig-btn primary" for="sigCharFile" style="display:flex;align-items:center;justify-content:center">PNG 불러오기</label>
                <button type="button" class="sig-btn" id="sigCharRemove">지우기</button>
                <input id="sigCharFile" type="file" accept="image/png,image/webp,image/jpeg">
              </div>
              <div class="sig-upload-note" id="sigCharStatus">PNG · WebP · JPEG를 불러올 수 있어.</div>
              <div class="sig-two">
                <div class="sig-field compact"><label>X</label><input id="sigCharX" type="number" min="-100" max="393"></div>
                <div class="sig-field compact"><label>Y</label><input id="sigCharY" type="number" min="-100" max="348"></div>
              </div>
              <div class="sig-field"><label>크기</label><input id="sigCharScale" type="range" min="0.15" max="2.2" step="0.01"></div>
              <div class="sig-field"><label>회전</label><input id="sigCharRot" type="range" min="-45" max="45" step="1"></div>
              <label class="sig-check"><input id="sigCharFlip" type="checkbox"> 좌우 반전</label>
            </section>

            <section class="sig-section">
              <div class="sig-section-title">2. 문구 <span class="sig-help">줄바꿈 가능</span></div>
              <div class="sig-field sig-field-top"><label for="sigPhraseText">문구</label><textarea id="sigPhraseText" rows="3">사랑해</textarea></div>
              <div class="sig-field">
                <label for="sigPhraseFont">글꼴</label>
                <select id="sigPhraseFont">
                  ${PHRASE_FONT_OPTIONS.map(font => `<option value="${font.key}">${escapeHtml(font.label)}</option>`).join("")}
                </select>
              </div>
              <div class="sig-font-upload">
                <label class="sig-btn primary" for="sigPhraseFontFile">TTF · OTF · WOFF 추가</label>
                <span id="sigPhraseFontStatus">프로젝트 저장 시 글꼴도 함께 보관돼.</span>
                <input id="sigPhraseFontFile" type="file" accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2,application/font-woff">
              </div>
              <div class="sig-two">
                <div class="sig-field compact"><label>X</label><input id="sigPhraseX" type="number" min="-100" max="393"></div>
                <div class="sig-field compact"><label>Y</label><input id="sigPhraseY" type="number" min="-100" max="348"></div>
              </div>
              <div class="sig-field"><label>글자 크기</label><input id="sigPhraseSize" type="range" min="12" max="64" step="1"></div>
              <div class="sig-field"><label>회전</label><input id="sigPhraseRot" type="range" min="-30" max="30" step="1"></div>
              <div class="sig-field"><label>줄 간격 <output id="sigPhraseLineHeightValue">83%</output></label><input id="sigPhraseLineHeight" type="range" min="55" max="160" step="1"></div>
              <div class="sig-field"><label>글자 안쪽</label><input id="sigPhraseFill" type="color"></div>
              <div class="sig-outline-editor" aria-label="문구 3단 테두리">
                <div class="sig-outline-row">
                  <label class="sig-check"><input id="sigPhraseInnerEnabled" type="checkbox"> 1단 안쪽선</label>
                  <input id="sigPhraseStroke" type="color" aria-label="1단 안쪽선 색">
                  <input id="sigPhraseInnerWidth" type="range" min="0" max="40" step="0.5" aria-label="1단 안쪽선 굵기">
                  <output id="sigPhraseInnerWidthValue">7.5%</output>
                </div>
                <div class="sig-outline-row">
                  <label class="sig-check"><input id="sigPhraseMiddleEnabled" type="checkbox"> 2단 중간선</label>
                  <input id="sigPhraseMiddleStroke" type="color" aria-label="2단 중간선 색">
                  <input id="sigPhraseMiddleWidth" type="range" min="0" max="40" step="0.5" aria-label="2단 중간선 굵기">
                  <output id="sigPhraseMiddleWidthValue">14%</output>
                </div>
                <div class="sig-outline-row">
                  <label class="sig-check"><input id="sigPhraseOuterEnabled" type="checkbox"> 3단 바깥선</label>
                  <input id="sigPhraseShadow" type="color" aria-label="3단 바깥선 색">
                  <input id="sigPhraseOuterWidth" type="range" min="0" max="40" step="0.5" aria-label="3단 바깥선 굵기">
                  <output id="sigPhraseOuterWidthValue">20%</output>
                </div>
              </div>
              <button type="button" class="sig-btn primary sig-text-prop-button" id="sigPhraseToProp">현재 문구를 PNG 소품으로 복제</button>
              <div class="sig-upload-note" id="sigTextPropStatus">복제본은 원본 문구와 따로 이동 · 회전 · 크기 조절 · 잠금할 수 있어.</div>
            </section>

            <section class="sig-section">
              <div class="sig-section-title">3. 시그풍 숫자</div>
              <div class="sig-field"><label>첫 번째</label><input id="sigNum1Text" type="text" inputmode="numeric" value="486"></div>
              <div class="sig-two">
                <div class="sig-field compact"><label>X</label><input id="sigNum1X" type="number" min="-100" max="393"></div>
                <div class="sig-field compact"><label>Y</label><input id="sigNum1Y" type="number" min="-100" max="348"></div>
              </div>
              <div class="sig-field"><label>크기 · 공식 고정 55pt</label><input id="sigNum1Size" type="range" min="55" max="55" step="1" value="55" disabled></div>
              <button type="button" class="sig-btn sig-text-prop-button" id="sigNum1ToProp">숫자 1을 장식 PNG로 복제</button>
              <label class="sig-check"><input id="sigNum2Enable" type="checkbox"> 두 번째 숫자 사용</label>
              <div id="sigNum2Fields">
                <div class="sig-field"><label>두 번째</label><input id="sigNum2Text" type="text" inputmode="numeric" value="46"></div>
                <div class="sig-two">
                  <div class="sig-field compact"><label>X</label><input id="sigNum2X" type="number" min="-100" max="393"></div>
                  <div class="sig-field compact"><label>Y</label><input id="sigNum2Y" type="number" min="-100" max="348"></div>
                </div>
                <div class="sig-field"><label>크기 · 공식 고정 55pt</label><input id="sigNum2Size" type="range" min="55" max="55" step="1" value="55" disabled></div>
                <button type="button" class="sig-btn sig-text-prop-button" id="sigNum2ToProp">숫자 2를 장식 PNG로 복제</button>
              </div>
            </section>

            <section class="sig-section">
              <div class="sig-section-title">4. 배경판과 디자인</div>
              <div class="sig-field">
                <label>캐릭터·문구 배치</label>
                <select id="sigPlacement">
                  ${placementLayouts.map((layout, index) => `<option value="${index}">${escapeHtml(layout.name)}</option>`).join("")}
                </select>
              </div>
              <div class="sig-field">
                <label>배경 그림 · 43종</label>
                <select id="sigBgTexture">
                  ${backgroundTextureOptionsHtml}
                  <option value="solid">단색만</option>
                  <option value="custom" disabled>커스텀 업로드</option>
                </select>
              </div>
              <div class="sig-custom-upload">
                <div class="sig-upload">
                  <label class="sig-btn primary" for="sigBgFile">투명 배경판 PNG</label>
                  <button type="button" class="sig-btn" id="sigBgRemove">배경 그림만 해제</button>
                  <input id="sigBgFile" type="file" accept="image/png,.png">
                </div>
                <div class="sig-upload-note" id="sigBgUploadName">투명 PNG는 원색 유지 또는 알파만 재색칠할 수 있어</div>
              </div>
              <div class="sig-field">
                <label>배경판 모양</label>
                <select id="sigBgMask">
                  <option value="band-straight">일자 기본판</option>
                  <option value="alpha-custom" disabled>내 알파 마스크</option>
                </select>
              </div>
              <button type="button" class="sig-btn primary sig-mask-launch" id="sigMaskOpen">✏ 배경판 직접 그리기</button>
              <div class="sig-upload-note" id="sigMaskStatus">일자 기본판 · 윗선 펜과 브러시로 자유롭게 수정</div>
              <div class="sig-field"><label>일자 시작선</label><input id="sigBgTop" type="range" min="28" max="125" step="1"></div>
              <div class="sig-field">
                <label>배경판 표시</label>
                <select id="sigBgPaintMode">
                  <option value="theme">현재 43종 디자인</option>
                  <option value="solid">단색 채움</option>
                  <option value="original" disabled>업로드 PNG 원색 유지</option>
                  <option value="recolor" disabled>업로드 알파만 재색칠</option>
                </select>
              </div>
              <div class="sig-two">
                <div class="sig-field compact"><label>채움색</label><input id="sigMaskFillColor" type="color"></div>
                <div class="sig-field compact"><label>테두리색</label><input id="sigMaskStrokeColor" type="color"></div>
              </div>
              <div class="sig-field"><label>테두리 굵기</label><input id="sigMaskStrokeWidth" type="range" min="0" max="12" step="1"></div>
              <label class="sig-check"><input id="sigMaskDoubleOutline" type="checkbox"> 이중 외곽선</label>
              <div id="sigMaskOuterFields" class="sig-two">
                <div class="sig-field compact"><label>바깥선</label><input id="sigMaskOuterColor" type="color"></div>
                <div class="sig-field compact"><label>바깥 굵기</label><input id="sigMaskOuterWidth" type="range" min="1" max="10" step="1"></div>
              </div>
              <div class="sig-field"><label>그림 크기</label><input id="sigBgImageScale" type="range" min="0.65" max="2" step="0.01"></div>
              <div class="sig-two">
                <div class="sig-field compact"><label>그림 X</label><input id="sigBgOffsetX" type="number" min="-180" max="180"></div>
                <div class="sig-field compact"><label>그림 Y</label><input id="sigBgOffsetY" type="number" min="-180" max="180"></div>
              </div>
              <div class="sig-field">
                <label>패턴 소품</label>
                <select id="sigBgPattern">
                  <option value="none">없음</option>
                  <option value="hearts">하트 낙서</option>
                  <option value="stars">별 반짝이</option>
                  <option value="flowers">꽃 낙서</option>
                  <option value="bows">리본 낙서</option>
                  <option value="lightning">번개 낙서</option>
                  <option value="bubbles">버블·점</option>
                  <option value="checker">체크 조각</option>
                </select>
              </div>
              <div class="sig-two">
                <div class="sig-field compact"><label>주색</label><input id="sigBgPrimary" type="color"></div>
                <div class="sig-field compact"><label>보조색</label><input id="sigBgSecondary" type="color"></div>
              </div>
              <div class="sig-field"><label>색 덮기</label><input id="sigBgTintOpacity" type="range" min="0" max="80" step="1"></div>
              <div class="sig-field"><label>색상 회전</label><input id="sigBgHue" type="range" min="-180" max="180" step="1"></div>
              <div class="sig-field"><label>채도</label><input id="sigBgSaturation" type="range" min="0" max="180" step="1"></div>
              <div class="sig-field"><label>밝기</label><input id="sigBgBrightness" type="range" min="45" max="150" step="1"></div>
            </section>

            <section class="sig-section">
              <div class="sig-section-title">5. 독립 이미지 소품 ${activeImagePropDefs.length}종 <span class="sig-help">캡처 시점 2D 그림체</span></div>
              <div class="sig-field">
                <label>소품 분류</label>
                <select id="sigPropCategoryFilter">
                  <option value="">전체 108종</option>
                  <option value="props">리치 일러스트</option>
                  <option value="props_category">시그 테마</option>
                  <option value="props_flat">플랫 컬러</option>
                </select>
              </div>
              <div class="sig-image-prop-grid" id="sigImagePropGrid"></div>
              <div class="sig-subtitle">개인 그림 소품</div>
              <div class="sig-upload">
                <label class="sig-btn primary" for="sigPropFile">내 소품 추가</label>
                <span class="sig-upload-count" id="sigPropUploadStatus">여러 번 · 여러 파일 가능</span>
                <input id="sigPropFile" type="file" multiple accept="image/png,image/webp,image/jpeg,.png,.webp,.jpg,.jpeg">
              </div>
              <div class="sig-subtitle">기본 도형 소품</div>
              <div class="sig-upload">
                <select id="sigPropType">
                  <option value="ring">원형 링</option>
                  <option value="double-ring">이중 링</option>
                  <option value="roulette">룰렛 휠</option>
                  <option value="twin-circles">쌍원 프레임</option>
                  <option value="wings">날개</option>
                  <option value="heart-cluster">하트 묶음</option>
                  <option value="flowers">꽃 낙서</option>
                  <option value="sparkles">별 반짝이</option>
                  <option value="bow">리본</option>
                  <option value="bubble">구름 버블</option>
                  <option value="rays">팝 방사형</option>
                  <option value="wheel">바퀴 윤곽</option>
                </select>
                <button type="button" class="sig-btn primary" id="sigPropAdd">추가</button>
              </div>
              <div class="sig-layer-list" id="sigLayerList"></div>
              <div id="sigPropControls">
                <div class="sig-two">
                  <div class="sig-field compact"><label>X</label><input id="sigPropX" type="number" min="-150" max="443"></div>
                  <div class="sig-field compact"><label>Y</label><input id="sigPropY" type="number" min="-150" max="398"></div>
                </div>
                <div class="sig-field"><label>크기</label><input id="sigPropScale" type="range" min="0.2" max="2.5" step="0.01"></div>
                <div class="sig-field"><label>회전</label><input id="sigPropRot" type="range" min="-180" max="180" step="1"></div>
                <div class="sig-field"><label>불투명도</label><input id="sigPropOpacity" type="range" min="0.1" max="1" step="0.01"></div>
                <div class="sig-field"><label>색상 회전</label><input id="sigPropHue" type="range" min="-180" max="180" step="1"></div>
                <div class="sig-field"><label>채도</label><input id="sigPropSaturation" type="range" min="0" max="180" step="1"></div>
                <div class="sig-field"><label>밝기</label><input id="sigPropBrightness" type="range" min="45" max="160" step="1"></div>
                <div class="sig-two">
                  <div class="sig-field compact"><label>선</label><input id="sigPropColor1" type="color"></div>
                  <div class="sig-field compact"><label>면</label><input id="sigPropColor2" type="color"></div>
                </div>
                <label class="sig-check"><input id="sigPropFront" type="checkbox"> 캐릭터 앞에 배치</label>
              </div>
              <div class="sig-subtitle">레이어 선택 · 위치/크기 잠금</div>
              <div class="sig-core-layer-list" id="sigCoreLayerList">
                <div class="sig-layer-row sig-core-layer-row">
                  <button type="button" data-layer="character">캐릭터</button>
                  <button type="button" class="sig-lock" data-layer-lock="character" aria-label="캐릭터 위치와 크기 잠금">🔓</button>
                </div>
                <div class="sig-layer-row sig-core-layer-row">
                  <button type="button" data-layer="phrase">문구</button>
                  <button type="button" class="sig-lock" data-layer-lock="phrase" aria-label="문구 위치와 크기 잠금">🔓</button>
                </div>
                <div class="sig-layer-row sig-core-layer-row">
                  <button type="button" data-layer="num1">숫자 1</button>
                  <button type="button" class="sig-lock" data-layer-lock="num1" aria-label="숫자 1 위치 잠금">🔓</button>
                </div>
                <div class="sig-layer-row sig-core-layer-row">
                  <button type="button" data-layer="num2">숫자 2</button>
                  <button type="button" class="sig-lock" data-layer-lock="num2" aria-label="숫자 2 위치 잠금">🔓</button>
                </div>
              </div>
              <div class="sig-upload-note sig-lock-note">잠근 레이어와 PNG의 투명한 부분은 클릭이 뒤로 통과해.</div>
            </section>

            <details class="sig-section sig-output-section" id="sigOutputSection">
              <summary><span>6. 출력별 내용 보정</span><small>필요할 때만 열기</small></summary>
              <div class="sig-output-body">
                <p>배경판은 그대로 두고 캐릭터·문구·소품만 옮기거나 키워. 숫자는 공식 크기를 유지하고 위치만 함께 보정돼.</p>
                <div class="sig-field">
                  <label for="sigOutputType">확인할 출력</label>
                  <select id="sigOutputType"><option value="mobile">모바일 293×248</option><option value="pc">PC 195×145</option><option value="weflab">위플랩 668×374</option></select>
                </div>
                <div class="sig-output-control">
                  <label for="sigOutputXRange">가로 X</label><input id="sigOutputXRange" type="range" step="1"><input id="sigOutputX" type="number" step="1">
                </div>
                <div class="sig-output-control">
                  <label for="sigOutputYRange">세로 Y</label><input id="sigOutputYRange" type="range" step="1"><input id="sigOutputY" type="number" step="1">
                </div>
                <div class="sig-output-control">
                  <label for="sigOutputScaleRange">내용 크기</label><input id="sigOutputScaleRange" type="range" min="0.5" max="1.5" step="0.01"><input id="sigOutputScale" type="number" min="0.5" max="1.5" step="0.01">
                </div>
                <div class="sig-output-actions"><span id="sigOutputStatus">기본값 · 원본 픽셀 유지</span><button type="button" class="sig-btn" id="sigOutputReset">이 출력 초기화</button></div>
                <div class="sig-output-preview-wrap"><canvas id="sigOutputPreviewCanvas" width="293" height="248" aria-label="선택한 출력 전용 미리보기"></canvas></div>
              </div>
            </details>
          </div>
        </aside>

        <div class="sig-mask-modal" id="sigMaskStudio" hidden role="dialog" aria-modal="true" aria-labelledby="sigMaskTitle">
          <div class="sig-mask-dialog">
            <div class="sig-mask-head">
              <div><strong id="sigMaskTitle">배경판 모양 만들기</strong><p>분홍색 부분이 실제 배경판으로 남아. 원형 커서가 실제 굵기고, 한쪽만 그려도 대칭으로 완성할 수 있어.</p></div>
              <button type="button" class="sig-mask-close" id="sigMaskClose" aria-label="닫기">×</button>
            </div>
            <div class="sig-mask-workbar">
              <div class="sig-mask-zoom" aria-label="캔버스 확대">
                <span>확대</span>
                <button type="button" class="on" data-mask-zoom="1">100%</button>
                <button type="button" data-mask-zoom="1.5">150%</button>
                <button type="button" data-mask-zoom="2">200%</button>
              </div>
              <label class="sig-check sig-mask-preview-check"><input id="sigMaskPreviewMode" type="checkbox"> 실제 색 미리보기</label>
              <label class="sig-mask-color"><span>미리보기색</span><input id="sigMaskPreviewColor" type="color" value="#ff9bb7"></label>
              <span class="sig-mask-shortcuts"><kbd>B</kbd> 더하기 <kbd>E</kbd> 깎기 <kbd>T</kbd> 윗모양 <kbd>L</kbd> 윤곽 <kbd>[</kbd><kbd>]</kbd> 굵기</span>
            </div>
            <div class="sig-mask-body">
              <div class="sig-mask-main">
                <div class="sig-mask-canvas-wrap" id="sigMaskViewport">
                  <div class="sig-mask-canvas-frame" id="sigMaskCanvasFrame">
                    <canvas id="sigMaskCanvas" width="${MASK_W}" height="${MASK_H}"></canvas>
                    <div class="sig-mask-safe-label">SOOP 상단 84px 보호영역</div>
                    <div class="sig-mask-center-guide" id="sigMaskCenterGuide" hidden><span>대칭 중심</span></div>
                    <div class="sig-mask-cursor is-topline" id="sigMaskCursor" hidden aria-hidden="true"><span>T</span></div>
                  </div>
                </div>
                <div class="sig-mask-seed-panel">
                  <div class="sig-mask-section-head"><strong>시작 모양</strong><span>현재 배경판을 유지하거나 새 틀로 시작</span></div>
                  <div class="sig-mask-seeds" id="sigMaskSeeds">
                    <button type="button" data-mask-seed="straight"><canvas width="86" height="48"></canvas><span>일자</span></button>
                    <button type="button" data-mask-seed="dome-low"><canvas width="86" height="48"></canvas><span>낮은 돔</span></button>
                    <button type="button" data-mask-seed="dome-high"><canvas width="86" height="48"></canvas><span>높은 돔</span></button>
                    <button type="button" data-mask-seed="heart-wide"><canvas width="86" height="48"></canvas><span>하트</span></button>
                    <button type="button" data-mask-seed="organic"><canvas width="86" height="48"></canvas><span>유기형 판</span></button>
                    <button type="button" data-mask-seed="blank"><canvas width="86" height="48"></canvas><span>빈판</span></button>
                  </div>
                  <details class="sig-mask-shape-tuner" id="sigMaskShapeTuner" hidden>
                    <summary><span id="sigMaskShapeTitle">시작 모양 세부 조절</span><small>슬라이더와 숫자를 함께 사용</small></summary>
                    <div class="sig-mask-shape-panel" data-mask-shape-panel="dome" hidden>
                      <label><span>꼭대기 Y</span><input type="range" min="84" max="150" step="0.01" data-mask-shape-param="apex"><input type="number" min="84" max="150" step="0.01" data-mask-shape-number="apex"></label>
                      <label><span>양옆 내려감</span><input type="range" min="8" max="100" step="0.01" data-mask-shape-param="sideDrop"><input type="number" min="8" max="100" step="0.01" data-mask-shape-number="sideDrop"></label>
                      <label><span>어깨 내려감</span><input type="range" min="0" max="100" step="0.01" data-mask-shape-param="shoulder"><input type="number" min="0" max="100" step="0.01" data-mask-shape-number="shoulder"></label>
                    </div>
                    <div class="sig-mask-shape-panel" data-mask-shape-panel="heart" hidden>
                      <label><span>하트 높이</span><input type="range" min="110" max="164" step="0.01" data-mask-shape-param="height"><input type="number" min="110" max="164" step="0.01" data-mask-shape-number="height"></label>
                      <label><span>골 깊이</span><input type="range" min="8" max="55" step="0.01" data-mask-shape-param="notchDepth"><input type="number" min="8" max="55" step="0.01" data-mask-shape-number="notchDepth"></label>
                      <label><span>골 너비</span><input type="range" min="12" max="80" step="0.01" data-mask-shape-param="notchWidth"><input type="number" min="12" max="80" step="0.01" data-mask-shape-number="notchWidth"></label>
                      <label><span>좌우 비대칭</span><input type="range" min="-30" max="30" step="0.1" data-mask-shape-param="asymmetry"><input type="number" min="-30" max="30" step="0.1" data-mask-shape-number="asymmetry"></label>
                    </div>
                    <div class="sig-mask-shape-actions"><span id="sigMaskShapeStatus">기본값 · 기존 모양과 동일</span><button type="button" id="sigMaskShapeReset">초기값</button><button type="button" class="primary" id="sigMaskShapeConfirm">현재값 확정</button></div>
                  </details>
                </div>
                <div class="sig-mask-library-panel">
                  <div class="sig-mask-section-head"><strong>내 모양 보관함</strong><span>6칸 · 이 PC에 저장</span></div>
                  <div class="sig-mask-library" id="sigMaskLibrary">
                    ${Array.from({ length: MASK_LIBRARY_SLOTS }, (_, index) => `<article class="sig-mask-slot" data-mask-slot="${index}"><button type="button" class="sig-mask-slot-load" data-mask-library-load="${index}" disabled><canvas width="117" height="99"></canvas><span>${index + 1}번 · 비어 있음</span></button><div><button type="button" data-mask-library-save="${index}">현재 저장</button><button type="button" data-mask-library-delete="${index}" disabled>삭제</button></div></article>`).join("")}
                  </div>
                </div>
              </div>
              <div class="sig-mask-tools">
                <section class="sig-mask-tool-section">
                  <div class="sig-mask-section-head"><strong>그리기 도구</strong><span>단축키 B / E / T / L</span></div>
                  <div class="sig-mask-tool-grid">
                    <button type="button" data-mask-tool="topline"><b>T</b> 윗모양 자동채움</button>
                    <button type="button" data-mask-tool="brush" class="on"><b>＋</b> 더하기</button>
                    <button type="button" data-mask-tool="eraser"><b>−</b> 깎기</button>
                    <button type="button" data-mask-tool="lasso"><b>L</b> 윤곽 자동채움</button>
                  </div>
                </section>
                <section class="sig-mask-tool-section" id="sigMaskBrushControls">
                  <div class="sig-mask-section-head"><strong>더하기·깎기 굵기</strong><span id="sigMaskSizeLabel">18px</span></div>
                  <div class="sig-mask-size-row"><input id="sigMaskBrushSize" type="range" min="2" max="80" step="1" value="18"><input id="sigMaskBrushSizeNumber" type="number" min="2" max="80" step="1" value="18" aria-label="브러시 굵기 숫자 입력"></div>
                  <div class="sig-mask-size-presets">
                    <button type="button" data-mask-size="8">S <small>8</small></button><button type="button" class="on" data-mask-size="18">M <small>18</small></button><button type="button" data-mask-size="34">L <small>34</small></button><button type="button" data-mask-size="56">XL <small>56</small></button>
                  </div>
                  <p class="sig-mask-size-help" id="sigMaskSizeHelp">캔버스의 원형 커서가 실제 굵기야.</p>
                </section>
                <section class="sig-mask-tool-section">
                  <label class="sig-check sig-mask-toggle"><input id="sigMaskMirrorDraw" type="checkbox"> 좌우 대칭 그리기 <span>한쪽만 그리기</span></label>
                  <div class="sig-field sig-mask-stabilizer" id="sigMaskStabilizer"><label>윗선 안정화 <span id="sigMaskStabilizeLabel">55%</span></label><input id="sigMaskStabilize" type="range" min="0" max="100" step="5" value="55"></div>
                </section>
                <section class="sig-mask-tool-section">
                  <div class="sig-mask-section-head"><strong>모양 변형</strong><span>한 번당 되돌리기 가능</span></div>
                  <div class="sig-mask-nudge-grid">
                    <i></i><button type="button" id="sigMaskMoveUp" title="위로 4px">↑</button><i></i>
                    <button type="button" id="sigMaskMoveLeft" title="왼쪽 4px">←</button><button type="button" id="sigMaskMoveDown" title="아래로 4px">↓</button><button type="button" id="sigMaskMoveRight" title="오른쪽 4px">→</button>
                  </div>
                  <div class="sig-mask-action-grid sig-mask-transform-grid">
                    <button type="button" id="sigMaskScaleDown">− 축소</button><button type="button" id="sigMaskScaleUp">＋ 확대</button>
                    <button type="button" id="sigMaskFlipX">↔ 좌우반전</button><button type="button" id="sigMaskSmooth">부드럽게</button>
                    <button type="button" id="sigMaskFillHoles">구멍 메우기</button><button type="button" id="sigMaskRemoveSpecks">작은 점 제거</button>
                  </div>
                  <div class="sig-mask-align-grid" aria-label="마스크 빠른 정렬">
                    <button type="button" id="sigMaskAlignCenter">가운데</button><button type="button" id="sigMaskAlignSafe">안전선</button><button type="button" id="sigMaskAlignBottom">바닥</button>
                  </div>
                  <label class="sig-mask-speck"><span>작은 점 기준</span><input id="sigMaskSpeckSize" type="number" min="4" max="300" step="1" value="28"><em>px 이하</em></label>
                </section>
                <section class="sig-mask-tool-section">
                  <div class="sig-mask-action-grid">
                    <button type="button" id="sigMaskUndo">↶ 되돌리기</button><button type="button" id="sigMaskRedo">↷ 다시 실행</button>
                    <button type="button" id="sigMaskClear">빈 판에서 시작</button><button type="button" id="sigMaskReset">기본 일자판</button>
                  </div>
                </section>
                <div class="sig-mask-tip" id="sigMaskTip">윗선을 한 번 그리면 아래까지 자동으로 닫혀. 대칭을 켜면 왼쪽이나 오른쪽 한쪽만 그려도 돼.</div>
              </div>
            </div>
            <div class="sig-mask-foot">
              <div class="sig-mask-file-actions">
                <label class="sig-btn" for="sigMaskFile">마스크 PNG 불러오기</label><input id="sigMaskFile" type="file" accept="image/png,.png">
                <button type="button" class="sig-btn" id="sigMaskSave">내 마스크 PNG 저장</button>
              </div>
              <div class="sig-mask-confirm"><span class="sig-mask-cancel-note">취소하면 열기 전 모양은 그대로 유지돼.</span><button type="button" class="sig-btn" id="sigMaskCancel">취소</button><button type="button" class="sig-btn primary" id="sigMaskApply">배경판에 적용</button></div>
            </div>
          </div>
        </div>
        <div class="sig-confirm-modal" id="sigConfirmDialog" hidden role="dialog" aria-modal="true" aria-labelledby="sigConfirmTitle" aria-describedby="sigConfirmMessage">
          <div class="sig-confirm-card">
            <strong id="sigConfirmTitle">확인</strong>
            <p id="sigConfirmMessage"></p>
            <div class="sig-confirm-actions"><button type="button" class="sig-btn" id="sigConfirmCancel">취소</button><button type="button" class="sig-btn primary" id="sigConfirmAccept">계속</button></div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(view);

    canvas = document.getElementById("sigCanvas");
    ctx = canvas.getContext("2d", { alpha: true });
    stage = document.getElementById("sigStage");
    maskEditorCanvas = document.getElementById("sigMaskCanvas");
    maskEditorCtx = maskEditorCanvas.getContext("2d", { alpha: true });

    tab.addEventListener("click", () => setSigMode(true));
    ["tabBook", "tabBanner", "tabEdit", "tabGif"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", () => setSigMode(false));
    });

    return true;
  }

  function setSigMode(on) {
    document.body.classList.toggle("sigOn", on);
    const sigTab = document.getElementById("tabSig");
    if (sigTab) sigTab.classList.toggle("on", on);
    if (on) {
      document.body.classList.remove("bannerOn", "editOn", "gifOn");
      ["tabBook", "tabBanner", "tabEdit", "tabGif"].forEach(id => document.getElementById(id)?.classList.remove("on"));
      requestRender();
    }
  }

  function loadImages() {
    const jobs = Object.entries(textureFiles).map(([key, file]) => new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        images[key] = img;
        resolve();
      };
      img.onerror = resolve;
      img.src = ASSET_DIR + file;
    }));
    activeImagePropDefs.forEach(def => {
      jobs.push(new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          propImages[def.id] = img;
          resolve();
        };
        img.onerror = resolve;
        img.src = `${ASSET_DIR}${def.folder || "props"}/${def.file}`;
      }));
    });
    return Promise.all(jobs);
  }

  function buildPresets() {
    const presetThemes = presetThemeKeys.map(key => themes.find(theme => theme.key === key)).filter(Boolean);
    return presetThemes.map((theme, themeIndex) => ({
      name: theme.name,
      themeIndex,
      layoutIndex: 0,
      theme,
      layout: backgroundCardLayout
    }));
  }

  const presets = buildPresets();

  function buildPropsForPreset(preset) {
    if (preset.theme.categoryMode) {
      return [];
    }
    if (preset.theme.modern) {
      const leftSide = preset.layout.char.x <= W / 2;
      const primaryType = preset.theme.props[preset.layoutIndex % preset.theme.props.length];
      const secondaryType = preset.theme.props[(preset.layoutIndex + 1) % preset.theme.props.length];
      const primary = Object.assign(propDefaults(primaryType, 0), {
        type: primaryType,
        x: leftSide ? 28 : W - 28,
        y: clamp(preset.layout.top + 80, 138, 174),
        scale: .38,
        rot: preset.layoutIndex % 2 ? 10 : -10,
        opacity: .72,
        color1: preset.theme.accent,
        color2: preset.theme.secondary,
        front: false
      });
      const secondary = Object.assign(propDefaults(secondaryType, 1), {
        type: secondaryType,
        x: leftSide ? W - 22 : 22,
        y: clamp(preset.layout.top + 122, 184, 216),
        scale: .21,
        rot: preset.layoutIndex % 2 ? -12 : 12,
        opacity: .58,
        color1: preset.theme.accent,
        color2: preset.theme.secondary,
        front: false
      });
      return preset.layoutIndex % 3 === 1 ? [primary] : [primary, secondary];
    }
    if (!preset.theme.rich) {
      return preset.layout.props.map((prop, i) => Object.assign(
        propDefaults(prop.type, i),
        deepCopy(prop),
        { color1: preset.theme.accent, color2: preset.theme.secondary }
      ));
    }

    const base = preset.layout.props[0] || { x: 146, y: 166, scale: 1, rot: 0, front: false };
    const primaryType = preset.theme.props[preset.layoutIndex % preset.theme.props.length];
    const secondaryType = preset.theme.props[(preset.layoutIndex + 2) % preset.theme.props.length];
    const primary = Object.assign(
      propDefaults(primaryType, 0),
      deepCopy(base),
      {
        type: primaryType,
        scale: clamp((base.scale || 1) * .94, .72, 1.28),
        color1: preset.theme.accent,
        color2: preset.theme.secondary
      }
    );

    if (primaryType === "flat-blue-wings") {
      primary.x = preset.layout.char.x;
      primary.y = preset.layout.char.y;
      primary.scale = 1.22;
      primary.front = false;
    }

    const secondary = Object.assign(propDefaults(secondaryType, 1), {
      x: preset.layout.char.x < W / 2 ? 258 : 35,
      y: clamp(preset.layout.top + 53, 95, 145),
      scale: .48,
      rot: preset.layoutIndex % 2 ? 13 : -13,
      opacity: .86,
      type: secondaryType,
      color1: preset.theme.accent,
      color2: preset.theme.secondary,
      front: preset.layoutIndex % 3 === 0
    });
    return [primary, secondary];
  }

  function applyPreset(index, preserveContent = true) {
    const preset = presets[index];
    if (!preset) return;
    const historyBefore = beginMainChange();

    state.presetIndex = index;
    const backgroundUpdate = {
      texture: preset.theme.texture,
      hue: preset.theme.hue || 0,
      saturation: preset.theme.saturation == null ? 100 : preset.theme.saturation,
      brightness: preset.theme.brightness == null ? 100 : preset.theme.brightness,
      modern: !!preset.theme.modern,
      surface: preset.theme.surface || "none",
      motif: preset.theme.motif || "none",
      variant: preset.layoutIndex,
      primary: preset.theme.primary,
      secondary: preset.theme.secondary,
      tintOpacity: preset.theme.modern || preset.theme.simple || preset.theme.key.startsWith("flat") ? 0 : 12,
      pattern: preset.theme.pattern,
      maskPaintMode: "theme"
    };
    if (!preserveContent) {
      Object.assign(backgroundUpdate, {
        mask: "band-straight",
        top: 84,
        curve: 24,
        imageScale: 1,
        offsetX: 0,
        offsetY: 0
      });
    }
    Object.assign(state.background, backgroundUpdate);
    if (!preserveContent) {
      state.placementIndex = 0;
      Object.assign(state.character, deepCopy(preset.layout.char));
      Object.assign(state.phrase, deepCopy(preset.layout.phrase), {
        fill: "#ffffff",
        stroke: preset.theme.accent,
        shadow: mixHex(preset.theme.accent, "#28222c", .48)
      });
      Object.assign(state.num1, deepCopy(preset.layout.num1), { enabled: true, size: MOBILE_NUMBER_SIZE, rot: 0 });
      Object.assign(state.num2, deepCopy(preset.layout.num2), { size: MOBILE_NUMBER_SIZE, rot: 0 });
      state.props = buildPropsForPreset(preset);
      state.selected = { kind: "character", index: -1 };
    }

    if (!preserveContent && preset.theme.categoryMode) {
      state.phrase.text = preset.theme.defaultPhrase || state.phrase.text;
      state.num1.text = preset.theme.defaultNum || state.num1.text;
      state.num2.enabled = false;
    }
    syncControls();
    renderLayerList();
    highlightPreset();
    requestRender();
    commitMainChange(historyBefore);
  }

  function applyPlacement(index) {
    const layout = placementLayouts[index];
    if (!layout) return;
    const historyBefore = beginMainChange();
    state.placementIndex = index;
    if (!state.character.locked && layout.char) {
      ["x", "y", "scale", "rot"].forEach(key => {
        if (layout.char[key] != null) state.character[key] = layout.char[key];
      });
    }
    if (!state.phrase.locked && layout.phrase) {
      ["x", "y", "size", "rot"].forEach(key => {
        if (layout.phrase[key] != null) state.phrase[key] = layout.phrase[key];
      });
    }
    if (!state.num1.locked && layout.num1) {
      ["x", "y"].forEach(key => {
        if (layout.num1[key] != null) state.num1[key] = layout.num1[key];
      });
      state.num1.enabled = true;
      state.num1.size = MOBILE_NUMBER_SIZE;
      state.num1.rot = 0;
    }
    if (!state.num2.locked && layout.num2) {
      ["x", "y"].forEach(key => {
        if (layout.num2[key] != null) state.num2[key] = layout.num2[key];
      });
      state.num2.enabled = !!layout.num2.enabled;
      state.num2.size = MOBILE_NUMBER_SIZE;
      state.num2.rot = 0;
    }
    // 배치 프리셋은 기존 소품·색·텍스트를 건드리지 않는다. 잠근 핵심 레이어도 그대로 둔다.
    syncControls();
    renderLayerList();
    requestRender();
    commitMainChange(historyBefore);
  }

  function setBackgroundMask(mask) {
    if (mask === "alpha-custom") {
      if (!state.background.maskCanvas) return;
      const historyBefore = beginMainChange();
      state.background.mask = mask;
      syncControls();
      requestRender();
      commitMainChange(historyBefore);
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(backgroundMaskCurves, mask)) return;
    const historyBefore = beginMainChange();
    state.background.mask = mask;
    state.background.curve = backgroundMaskCurves[mask];
    syncControls();
    requestRender();
    commitMainChange(historyBefore);
  }

  function renderPresetGrid() {
    const grid = document.getElementById("sigPresetGrid");
    grid.innerHTML = "";
    presets.forEach((preset, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sig-preset";
      button.title = preset.name;
      button.innerHTML = `<canvas width="293" height="164"></canvas><span>${String(index + 1).padStart(2, "0")} ${escapeHtml(preset.name)}</span>`;
      button.addEventListener("click", () => applyPreset(index, true));
      grid.appendChild(button);
      drawPresetThumb(button.querySelector("canvas"), preset);
    });
    highlightPreset();
  }

  function highlightPreset() {
    document.querySelectorAll(".sig-preset").forEach((el, i) => el.classList.toggle("on", i === state.presetIndex));
  }

  function drawPresetThumb(target, preset) {
    const c = target.getContext("2d");
    c.clearRect(0, 0, 293, 164);
    const mock = {
      background: {
        texture: preset.theme.texture,
        mask: preset.layout.mask,
        top: preset.layout.top,
        curve: preset.layout.curve,
        imageScale: preset.layout.imageScale || 1,
        offsetX: preset.layout.offsetX || 0,
        offsetY: preset.layout.offsetY || 0,
        hue: preset.theme.hue || 0,
        saturation: preset.theme.saturation == null ? 100 : preset.theme.saturation,
        brightness: preset.theme.brightness == null ? 100 : preset.theme.brightness,
        modern: !!preset.theme.modern,
        surface: preset.theme.surface || "none",
        motif: preset.theme.motif || "none",
        variant: preset.layoutIndex,
        primary: preset.theme.primary,
        secondary: preset.theme.secondary,
        tintOpacity: preset.theme.modern || preset.theme.simple || preset.theme.key.startsWith("flat") ? 0 : 12,
        pattern: preset.theme.pattern
      }
    };
    c.save();
    c.translate(0, -84);
    drawBackground(c, mock.background, false);
    c.restore();
  }

  function createLogicalCanvas() {
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    return out;
  }

  function createMaskCanvas() {
    const out = document.createElement("canvas");
    out.width = MASK_W;
    out.height = MASK_H;
    return out;
  }

  function withMaskLogicalTransform(context, draw) {
    context.save();
    context.scale(MASK_SCALE, MASK_SCALE);
    try {
      return draw(context);
    } finally {
      context.restore();
    }
  }

  function drawMaskLogical(context, mask, dx = 0, dy = 0, dw = W, dh = H) {
    if (!mask) return;
    context.drawImage(mask, 0, 0, mask.width, mask.height, dx, dy, dw, dh);
  }

  function normalizeStoredMaskCanvas(source) {
    const out = createMaskCanvas();
    if (!source) return out;
    const context = out.getContext("2d", { alpha: true });
    const sourceWidth = Number(source.naturalWidth || source.width || 0);
    const sourceHeight = Number(source.naturalHeight || source.height || 0);
    // v1 masks were exactly 293×248. Nearest-neighbour promotion preserves their
    // coverage exactly while all new editing continues on the 2× alpha surface.
    context.imageSmoothingEnabled = !(sourceWidth === W && sourceHeight === H);
    context.drawImage(source, 0, 0, sourceWidth || W, sourceHeight || H, 0, 0, MASK_W, MASK_H);
    context.imageSmoothingEnabled = true;
    context.globalCompositeOperation = "source-in";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, MASK_W, MASK_H);
    context.globalCompositeOperation = "source-over";
    context.clearRect(0, 0, MASK_W, MASK_SAFE_TOP);
    return out;
  }

  function cloneMaskCanvas(source) {
    return normalizeStoredMaskCanvas(source);
  }

  function normalizeOutputProfile(type, value = null) {
    const limits = OUTPUT_PROFILE_LIMITS[type] || OUTPUT_PROFILE_LIMITS.mobile;
    const source = value || {};
    return {
      x: Math.round(clamp(Number(source.x) || 0, -limits.x, limits.x) * 10) / 10,
      y: Math.round(clamp(Number(source.y) || 0, -limits.y, limits.y) * 10) / 10,
      scale: Math.round(clamp(Number(source.scale) || 1, .5, 1.5) * 100) / 100
    };
  }

  function outputProfile(type) {
    if (!OUTPUT_PROFILE_TYPES.includes(type)) type = "mobile";
    state.outputProfiles[type] = normalizeOutputProfile(type, state.outputProfiles[type]);
    return state.outputProfiles[type];
  }

  function outputProfileIsIdentity(value) {
    return !!value && value.x === 0 && value.y === 0 && value.scale === 1;
  }

  function cloneOutputProfiles(source = state.outputProfiles) {
    const out = source && typeof source === "object" ? deepCopy(source) : {};
    OUTPUT_PROFILE_TYPES.forEach(type => {
      const preserved = out[type] && typeof out[type] === "object" ? out[type] : {};
      out[type] = Object.assign({}, preserved, normalizeOutputProfile(type, source?.[type]));
    });
    return out;
  }

  function projectDisplayName(path = currentProjectPath) {
    const value = String(path || "").replace(/\\/g, "/");
    return value.split("/").pop() || "새 프로젝트";
  }

  function syncProjectStatus(message = "") {
    const status = document.getElementById("sigProjectState");
    if (!status) return;
    const name = projectDisplayName();
    status.textContent = message || (projectDirty ? `변경됨 · ${name}` : currentProjectPath ? `저장됨 · ${name}` : "새 프로젝트");
    status.classList.toggle("is-dirty", projectDirty);
    status.classList.toggle("is-busy", projectIoBusy);
    status.title = currentProjectPath || (projectDirty ? "저장하지 않은 변경이 있어." : "아직 프로젝트 파일로 저장하지 않았어.");
  }

  function setProjectDirty(dirty = true) {
    projectDirty = !!dirty;
    syncProjectStatus();
  }

  function updateMainHistoryUi() {
    const undo = document.getElementById("sigUndo");
    const redo = document.getElementById("sigRedo");
    if (undo) {
      undo.disabled = projectIoBusy || !mainUndoStack.length;
      undo.title = mainUndoStack.length ? `되돌리기 · ${mainUndoStack.length}단계 · Ctrl+Z` : "되돌릴 작업 없음 · Ctrl+Z";
    }
    if (redo) {
      redo.disabled = projectIoBusy || !mainRedoStack.length;
      redo.title = mainRedoStack.length ? `다시 실행 · ${mainRedoStack.length}단계 · Ctrl+Y` : "다시 실행할 작업 없음 · Ctrl+Y";
    }
  }

  function setProjectIoBusy(busy, message = "") {
    projectIoBusy = !!busy;
    if (view) {
      view.classList.toggle("is-project-busy", projectIoBusy);
      view.setAttribute("aria-busy", String(projectIoBusy));
    }
    ["sigProjectOpen", "sigProjectSave", "sigExportMobile", "sigExportPc", "sigExportBoth", "sigExportWeflab", "sigExportAll"].forEach(id => {
      const control = document.getElementById(id);
      if (control) control.disabled = projectIoBusy;
    });
    const overlay = document.getElementById("sigBusyOverlay");
    const busyMessage = document.getElementById("sigBusyMessage");
    if (overlay) overlay.hidden = !projectIoBusy;
    if (busyMessage) busyMessage.textContent = message || "처리 중…";
    updateMainHistoryUi();
    syncProjectStatus(message);
  }

  function captureMainSnapshot() {
    const customPropAssets = {};
    state.props.forEach(prop => {
      if (!prop.customImage) return;
      customPropAssets[prop.type] = {
        image: propImages[prop.type] || null,
        label: propLabels[prop.type] || prop.type
      };
    });
    return {
      presetIndex: state.presetIndex,
      placementIndex: state.placementIndex,
      background: Object.assign({}, state.background, {
        customBackup: state.background.customBackup ? Object.assign({}, state.background.customBackup) : null,
        // Applied masks are immutable: the studio always edits a private clone and
        // commits a new canvas. Keeping the reference avoids 60 × 1.16 MB snapshots.
        maskCanvas: state.background.maskCanvas || null
      }),
      character: Object.assign({}, state.character),
      phrase: Object.assign({}, state.phrase),
      num1: Object.assign({}, state.num1),
      num2: Object.assign({}, state.num2),
      props: state.props.map(prop => Object.assign({}, prop)),
      outputProfiles: cloneOutputProfiles(),
      selected: Object.assign({}, state.selected),
      snapEnabled: state.snapEnabled !== false,
      showGuides: state.showGuides !== false,
      previewDark: !!state.previewDark,
      exportBaseName: String(state.exportBaseName || SIG_DEFAULT_EXPORT_BASE),
      customPropAssets
    };
  }

  function maskCanvasesEqual(left, right) {
    if (left === right) return true;
    if (!left || !right || left.width !== right.width || left.height !== right.height) return false;
    const a = left.getContext("2d", { alpha: true, willReadFrequently: true }).getImageData(0, 0, left.width, left.height).data;
    const b = right.getContext("2d", { alpha: true, willReadFrequently: true }).getImageData(0, 0, right.width, right.height).data;
    if (a.length !== b.length) return false;
    for (let index = 3; index < a.length; index += 4) {
      if (a[index] !== b[index]) return false;
    }
    return true;
  }

  function plainSnapshotObject(value, ignoredKeys = []) {
    const ignored = new Set(ignoredKeys);
    const out = {};
    Object.keys(value || {}).sort().forEach(key => {
      if (!ignored.has(key)) out[key] = value[key];
    });
    return out;
  }

  function mainSnapshotsEqual(left, right) {
    if (!left || !right) return false;
    if (left.presetIndex !== right.presetIndex || left.placementIndex !== right.placementIndex) return false;
    if (left.background.customImg !== right.background.customImg || left.background.customSourceCanvas !== right.background.customSourceCanvas) return false;
    if (left.character.img !== right.character.img) return false;
    if (JSON.stringify(plainSnapshotObject(left.background, ["customImg", "customSourceCanvas", "maskCanvas"])) !== JSON.stringify(plainSnapshotObject(right.background, ["customImg", "customSourceCanvas", "maskCanvas"]))) return false;
    if (!maskCanvasesEqual(left.background.maskCanvas, right.background.maskCanvas)) return false;
    if (JSON.stringify(plainSnapshotObject(left.character, ["img"])) !== JSON.stringify(plainSnapshotObject(right.character, ["img"]))) return false;
    if (JSON.stringify(left.phrase) !== JSON.stringify(right.phrase)) return false;
    if (JSON.stringify(left.num1) !== JSON.stringify(right.num1) || JSON.stringify(left.num2) !== JSON.stringify(right.num2)) return false;
    if (JSON.stringify(left.props) !== JSON.stringify(right.props)) return false;
    if (JSON.stringify(left.outputProfiles) !== JSON.stringify(right.outputProfiles)) return false;
    if (left.snapEnabled !== right.snapEnabled || left.showGuides !== right.showGuides || left.previewDark !== right.previewDark || left.exportBaseName !== right.exportBaseName) return false;
    return true;
  }

  function restoreMainSnapshot(snapshot) {
    if (!snapshot) return;
    state.presetIndex = snapshot.presetIndex;
    state.placementIndex = snapshot.placementIndex;
    Object.assign(state.background, snapshot.background, {
      customBackup: snapshot.background.customBackup ? Object.assign({}, snapshot.background.customBackup) : null,
      maskCanvas: snapshot.background.maskCanvas || null
    });
    Object.assign(state.character, snapshot.character);
    Object.assign(state.phrase, snapshot.phrase);
    Object.assign(state.num1, snapshot.num1);
    Object.assign(state.num2, snapshot.num2);
    state.props = snapshot.props.map(prop => Object.assign({}, prop));
    state.outputProfiles = cloneOutputProfiles(snapshot.outputProfiles);
    state.selected = Object.assign({}, snapshot.selected);
    state.snapEnabled = snapshot.snapEnabled !== false;
    state.showGuides = snapshot.showGuides !== false;
    state.previewDark = !!snapshot.previewDark;
    state.exportBaseName = String(snapshot.exportBaseName || SIG_DEFAULT_EXPORT_BASE);
    if (state.selected.kind === "prop" && !state.props[state.selected.index]) {
      state.selected = { kind: "character", index: -1 };
    }
    Object.entries(snapshot.customPropAssets || {}).forEach(([type, asset]) => {
      if (asset.image) propImages[type] = asset.image;
      if (asset.label) propLabels[type] = asset.label;
    });
    syncControls();
    renderLayerList();
    highlightPreset();
    requestRender();
  }

  function flushMainHistoryBurst() {
    if (mainBurstTimer) clearTimeout(mainBurstTimer);
    mainBurstTimer = 0;
    if (!mainBurstBefore) return;
    const before = mainBurstBefore;
    mainBurstBefore = null;
    commitMainChange(before);
  }

  function beginMainChange() {
    if (!mainHistoryReady) return null;
    commitOutputProfileEdit();
    flushMainHistoryBurst();
    return captureMainSnapshot();
  }

  function blurActiveSigEditorField() {
    const activeElement = document.activeElement;
    if (!activeElement || !activeElement.closest?.("#sigView")) return;
    if (/INPUT|SELECT|TEXTAREA/.test(activeElement.tagName || "") || activeElement.isContentEditable) {
      activeElement.blur();
    }
  }

  function commitMainChange(before) {
    if (!mainHistoryReady || !before) return;
    if (mainSnapshotsEqual(before, captureMainSnapshot())) return;
    mainUndoStack.push(before);
    if (mainUndoStack.length > MAIN_HISTORY_LIMIT) mainUndoStack.shift();
    mainRedoStack = [];
    updateMainHistoryUi();
    setProjectDirty(true);
  }

  function beginMainHistoryBurst() {
    if (!mainHistoryReady) return;
    if (!mainBurstBefore) mainBurstBefore = captureMainSnapshot();
    if (mainBurstTimer) clearTimeout(mainBurstTimer);
    mainBurstTimer = setTimeout(flushMainHistoryBurst, 220);
  }

  function resetMainHistory() {
    if (mainBurstTimer) clearTimeout(mainBurstTimer);
    mainBurstTimer = 0;
    mainBurstBefore = null;
    mainUndoStack = [];
    mainRedoStack = [];
    updateMainHistoryUi();
  }

  function mainUndo() {
    commitOutputProfileEdit();
    flushMainHistoryBurst();
    if (!mainUndoStack.length) {
      showExportStatus("되돌릴 시그풍 작업이 없어.", true);
      return false;
    }
    const previous = mainUndoStack.pop();
    mainRedoStack.push(captureMainSnapshot());
    restoreMainSnapshot(previous);
    updateMainHistoryUi();
    setProjectDirty(true);
    showExportStatus(`시그풍 작업을 되돌렸어 · 남은 단계 ${mainUndoStack.length}`);
    return true;
  }

  function mainRedo() {
    commitOutputProfileEdit();
    flushMainHistoryBurst();
    if (!mainRedoStack.length) {
      showExportStatus("다시 실행할 시그풍 작업이 없어.", true);
      return false;
    }
    const next = mainRedoStack.pop();
    mainUndoStack.push(captureMainSnapshot());
    if (mainUndoStack.length > MAIN_HISTORY_LIMIT) mainUndoStack.shift();
    restoreMainSnapshot(next);
    updateMainHistoryUi();
    setProjectDirty(true);
    showExportStatus(`시그풍 작업을 다시 실행했어 · 남은 단계 ${mainRedoStack.length}`);
    return true;
  }

  function createStraightMask(top = 84) {
    const out = createMaskCanvas();
    const outCtx = out.getContext("2d", { alpha: true });
    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, clamp(top, SAFE_TOP, H) * MASK_SCALE, MASK_W, MASK_H);
    return out;
  }

  function fitImageToCanvas(img) {
    const out = createLogicalCanvas();
    const outCtx = out.getContext("2d", { alpha: true });
    drawImageContainBottom(outCtx, img);
    return out;
  }

  function fitImageToMaskCanvas(img) {
    const iw = Number(img.naturalWidth || img.width || W);
    const ih = Number(img.naturalHeight || img.height || H);
    if (iw === W && ih === H || iw === MASK_W && ih === MASK_H) return normalizeStoredMaskCanvas(img);
    const out = createMaskCanvas();
    const outCtx = out.getContext("2d", { alpha: true });
    const scale = Math.min(MASK_W / iw, MASK_H / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = "high";
    outCtx.drawImage(img, (MASK_W - dw) / 2, MASK_H - dh, dw, dh);
    outCtx.globalCompositeOperation = "source-in";
    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, 0, MASK_W, MASK_H);
    outCtx.globalCompositeOperation = "source-over";
    enforceMaskSafeArea(out);
    return out;
  }

  function alphaMaskFromCanvas(source) {
    const out = createMaskCanvas();
    const outCtx = out.getContext("2d", { alpha: true });
    outCtx.drawImage(source, 0, 0, source.width || W, source.height || H, 0, 0, MASK_W, MASK_H);
    outCtx.globalCompositeOperation = "source-in";
    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, 0, MASK_W, MASK_H);
    outCtx.globalCompositeOperation = "source-over";
    outCtx.clearRect(0, 0, MASK_W, MASK_SAFE_TOP);
    return out;
  }

  function isAlphaMask(bg = state.background) {
    return bg.mask === "alpha-custom" && !!bg.maskCanvas;
  }

  function ensureMaskCanvas() {
    if (!state.background.maskCanvas) state.background.maskCanvas = createStraightMask(state.background.top);
    return state.background.maskCanvas;
  }

  function tintMask(mask, color) {
    const out = createMaskCanvas();
    const outCtx = out.getContext("2d", { alpha: true });
    outCtx.drawImage(mask, 0, 0, mask.width, mask.height, 0, 0, MASK_W, MASK_H);
    outCtx.globalCompositeOperation = "source-in";
    outCtx.fillStyle = color;
    outCtx.fillRect(0, 0, MASK_W, MASK_H);
    outCtx.globalCompositeOperation = "source-over";
    return out;
  }

  function drawExpandedMask(c, mask, color, radius) {
    const logicalRadius = Math.max(0, Number(radius) || 0);
    const r = Math.max(0, Math.round(logicalRadius * MASK_SCALE));
    if (!r) return;
    const key = `${color}:${r}:${MASK_SCALE}`;
    let cached = maskOutlineCache.get(mask);
    if (!cached) {
      cached = new Map();
      maskOutlineCache.set(mask, cached);
    }
    if (cached.has(key)) {
      drawMaskLogical(c, cached.get(key));
      return;
    }
    const expanded = createMaskCanvas();
    const expandedCtx = expanded.getContext("2d", { alpha: true });
    const tinted = tintMask(mask, color);
    // Iterate in logical pixels and scale offsets onto the raw surface. This keeps
    // the old O(r²) draw count instead of making the 2× mask four times more costly.
    const steps = Math.ceil(logicalRadius);
    for (let y = -steps; y <= steps; y++) {
      for (let x = -steps; x <= steps; x++) {
        if (x * x + y * y <= logicalRadius * logicalRadius) expandedCtx.drawImage(tinted, x * MASK_SCALE, y * MASK_SCALE);
      }
    }
    if (cached.size > 8) cached.clear();
    cached.set(key, expanded);
    drawMaskLogical(c, expanded);
  }

  function captureMaskAlpha(source = maskWorkingCanvas) {
    if (!source) return new Uint8ClampedArray(MASK_W * MASK_H);
    const canonical = source.width === MASK_W && source.height === MASK_H ? source : normalizeStoredMaskCanvas(source);
    const data = canonical.getContext("2d", { alpha: true, willReadFrequently: true }).getImageData(0, 0, MASK_W, MASK_H).data;
    const alpha = new Uint8ClampedArray(MASK_W * MASK_H);
    for (let i = 0, p = 3; i < alpha.length; i++, p += 4) alpha[i] = data[p];
    return alpha;
  }

  function maskAlphaEquals(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  function maskAlphaDelta(before, after) {
    let added = 0;
    let removed = 0;
    if (!before || !after || before.length !== after.length) return { added, removed, changed: 0 };
    for (let i = 0; i < before.length; i++) {
      if (after[i] > before[i]) added++;
      else if (after[i] < before[i]) removed++;
    }
    return { added, removed, changed: added + removed };
  }

  function invalidateWorkingMask() {
    if (maskWorkingCanvas) maskOutlineCache.delete(maskWorkingCanvas);
  }

  function enforceMaskSafeArea(target = maskWorkingCanvas) {
    if (!target) return;
    target.getContext("2d", { alpha: true }).clearRect(0, 0, target.width, MASK_SAFE_TOP);
    if (target === maskWorkingCanvas) invalidateWorkingMask();
  }

  function symmetrizeMaskAlpha(target) {
    if (!target || target.width !== MASK_W || target.height !== MASK_H) return;
    const context = target.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = context.getImageData(0, 0, MASK_W, MASK_H);
    for (let y = MASK_SAFE_TOP; y < MASK_H; y++) {
      for (let x = 0; x < MASK_W / 2; x++) {
        const left = (y * MASK_W + x) * 4;
        const right = (y * MASK_W + (MASK_W - 1 - x)) * 4;
        const alpha = Math.round((image.data[left + 3] + image.data[right + 3]) / 2);
        image.data[left] = image.data[left + 1] = image.data[left + 2] = 255;
        image.data[right] = image.data[right + 1] = image.data[right + 2] = 255;
        image.data[left + 3] = image.data[right + 3] = alpha;
      }
    }
    context.putImageData(image, 0, 0);
  }

  function restoreMaskAlpha(alpha) {
    if (!maskWorkingCanvas || !alpha) return;
    const workCtx = maskWorkingCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = workCtx.createImageData(MASK_W, MASK_H);
    for (let i = 0, p = 0; i < alpha.length; i++, p += 4) {
      image.data[p] = 255;
      image.data[p + 1] = 255;
      image.data[p + 2] = 255;
      image.data[p + 3] = alpha[i];
    }
    workCtx.putImageData(image, 0, 0);
    enforceMaskSafeArea();
  }

  function resetMaskHistory() {
    maskHistory = [captureMaskAlpha()];
    maskHistoryIndex = 0;
    updateMaskHistoryButtons();
  }

  function commitMaskHistory() {
    if (!maskWorkingCanvas) return false;
    enforceMaskSafeArea();
    const next = captureMaskAlpha();
    if (maskHistoryIndex >= 0 && maskAlphaEquals(maskHistory[maskHistoryIndex], next)) {
      updateMaskHistoryButtons();
      return false;
    }
    maskHistory.splice(maskHistoryIndex + 1);
    maskHistory.push(next);
    if (maskHistory.length > MASK_HISTORY_LIMIT) maskHistory.shift();
    maskHistoryIndex = maskHistory.length - 1;
    updateMaskHistoryButtons();
    return true;
  }

  function updateMaskHistoryButtons() {
    const undo = document.getElementById("sigMaskUndo");
    const redo = document.getElementById("sigMaskRedo");
    if (undo) undo.disabled = maskHistoryIndex <= 0;
    if (redo) redo.disabled = maskHistoryIndex < 0 || maskHistoryIndex >= maskHistory.length - 1;
  }

  function maskUndo() {
    leaveMaskShapeTuner(true);
    if (maskHistoryIndex <= 0) return;
    restoreMaskAlpha(maskHistory[--maskHistoryIndex]);
    updateMaskHistoryButtons();
    renderMaskEditor();
  }

  function maskRedo() {
    leaveMaskShapeTuner(true);
    if (maskHistoryIndex >= maskHistory.length - 1) return;
    restoreMaskAlpha(maskHistory[++maskHistoryIndex]);
    updateMaskHistoryButtons();
    renderMaskEditor();
  }

  function maskMirrorEnabled() {
    return !!document.getElementById("sigMaskMirrorDraw")?.checked;
  }

  function maskStabilizeStrength() {
    return clamp(document.getElementById("sigMaskStabilize")?.value || 55, 0, 100);
  }

  function gesturePathLength(points, closed = false) {
    if (!points || points.length < 2) return 0;
    let length = 0;
    for (let i = 1; i < points.length; i++) length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    if (closed && points.length > 2) length += Math.hypot(points[0].x - points[points.length - 1].x, points[0].y - points[points.length - 1].y);
    return length;
  }

  function validTopLineGesture(points) {
    if (!points || points.length < 2) return false;
    const xs = points.map(point => point.x);
    return Math.max(...xs) - Math.min(...xs) >= 12 && gesturePathLength(points) >= 16;
  }

  function validClosedOutlineGesture(points) {
    if (!points || points.length < 3 || gesturePathLength(points, true) < 18) return false;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const next = points[(i + 1) % points.length];
      area += points[i].x * next.y - next.x * points[i].y;
    }
    return Math.abs(area) / 2 >= 30;
  }

  function applyTopLine(points, target = maskWorkingCanvas, mirror = maskMirrorEnabled()) {
    if (!target || !validTopLineGesture(points)) return false;
    let linePoints = points.map(point => ({ x: clamp(point.x, 0, W), y: clamp(point.y, 84, H - 1) }));
    if (mirror) linePoints = linePoints.concat(linePoints.map(point => ({ x: W - point.x, y: point.y })));
    const sorted = linePoints.sort((a, b) => a.x - b.x);
    const samples = new Float32Array(W + 1);
    let segment = 0;
    for (let x = 0; x <= W; x++) {
      while (segment < sorted.length - 2 && sorted[segment + 1].x < x) segment++;
      const a = sorted[segment];
      const b = sorted[Math.min(sorted.length - 1, segment + 1)];
      const ratio = b.x === a.x ? 0 : clamp((x - a.x) / (b.x - a.x), 0, 1);
      samples[x] = a.y + (b.y - a.y) * ratio;
    }
    let smooth = samples;
    const strength = maskStabilizeStrength();
    const radius = Math.round(strength * .16);
    const passes = strength >= 70 ? 2 : 1;
    for (let pass = 0; pass < passes && radius > 0; pass++) {
      const next = new Float32Array(W + 1);
      for (let x = 0; x <= W; x++) {
        let total = 0;
        let count = 0;
        for (let k = -radius; k <= radius; k++) {
          total += smooth[clamp(x + k, 0, W)];
          count++;
        }
        next[x] = total / count;
      }
      smooth = next;
    }
    const workCtx = target.getContext("2d", { alpha: true });
    workCtx.clearRect(0, 0, MASK_W, MASK_H);
    withMaskLogicalTransform(workCtx, logicalCtx => {
      logicalCtx.beginPath();
      logicalCtx.moveTo(0, smooth[0]);
      for (let x = 1; x <= W; x++) logicalCtx.lineTo(x, smooth[x]);
      logicalCtx.lineTo(W, H);
      logicalCtx.lineTo(0, H);
      logicalCtx.closePath();
      logicalCtx.fillStyle = "#ffffff";
      logicalCtx.fill();
    });
    enforceMaskSafeArea(target);
    return true;
  }

  function applyClosedOutline(points, target = maskWorkingCanvas, mirror = maskMirrorEnabled()) {
    if (!target || !validClosedOutlineGesture(points)) return false;
    const workCtx = target.getContext("2d", { alpha: true });
    withMaskLogicalTransform(workCtx, logicalCtx => {
      const fillPolygon = source => {
        logicalCtx.beginPath();
        source.forEach((point, index) => index ? logicalCtx.lineTo(point.x, point.y) : logicalCtx.moveTo(point.x, point.y));
        logicalCtx.closePath();
        logicalCtx.fill();
      };
      logicalCtx.save();
      logicalCtx.beginPath();
      logicalCtx.rect(0, SAFE_TOP, W, H - SAFE_TOP);
      logicalCtx.clip();
      logicalCtx.fillStyle = "#ffffff";
      logicalCtx.globalCompositeOperation = "source-over";
      fillPolygon(points);
      if (mirror) fillPolygon(points.map(point => ({ x: W - point.x, y: point.y })));
      logicalCtx.restore();
    });
    enforceMaskSafeArea(target);
    return true;
  }

  function rasterizeBackgroundMask(bg = state.background) {
    if (bg.mask === "alpha-custom" && bg.maskCanvas) return cloneMaskCanvas(bg.maskCanvas);
    const out = createMaskCanvas();
    const outCtx = out.getContext("2d", { alpha: true });
    withMaskLogicalTransform(outCtx, logicalCtx => {
      backgroundPath(logicalCtx, bg);
      logicalCtx.fillStyle = "#ffffff";
      logicalCtx.fill();
    });
    enforceMaskSafeArea(out);
    return out;
  }

  function maskShapeDefaults(kind) {
    if (kind === "dome-low") return Object.assign({}, DOME_LOW_DEFAULTS);
    if (kind === "dome-high") return Object.assign({}, DOME_HIGH_DEFAULTS);
    if (kind === "heart-wide") return Object.assign({}, HEART_SEED_DEFAULTS);
    return null;
  }

  function maskShapeFamily(kind) {
    if (kind === "dome-low" || kind === "dome-high") return "dome";
    if (kind === "heart-wide") return "heart";
    return "";
  }

  function normalizedMaskShapeValues(kind, values = null) {
    const defaults = maskShapeDefaults(kind);
    if (!defaults) return null;
    const source = Object.assign({}, defaults, values || {});
    if (maskShapeFamily(kind) === "dome") {
      source.apex = clamp(Number(source.apex), 84, 150);
      source.sideDrop = clamp(Number(source.sideDrop), 8, 100);
      source.shoulder = clamp(Number(source.shoulder), 0, source.sideDrop);
    } else {
      source.height = clamp(Number(source.height), 110, 164);
      source.notchDepth = clamp(Number(source.notchDepth), 8, 55);
      source.notchWidth = clamp(Number(source.notchWidth), 12, 80);
      source.asymmetry = clamp(Number(source.asymmetry), -30, 30);
    }
    return source;
  }

  function maskShapeValuesAreDefault(kind, values) {
    const defaults = maskShapeDefaults(kind);
    const current = normalizedMaskShapeValues(kind, values);
    return !!defaults && Object.keys(defaults).every(key => Math.abs(Number(defaults[key]) - Number(current[key])) < 1e-9);
  }

  function createDomeSeed(apexY, sideDrop = DOME_SEED_DEFAULTS.sideDrop, shoulder = DOME_SEED_DEFAULTS.shoulder) {
    const out = createMaskCanvas();
    const outCtx = out.getContext("2d", { alpha: true });
    const centerX = W / 2;
    const sideY = apexY + sideDrop;
    // 실제 초록/파랑 돔의 깨끗한 외곽 픽셀에 직접 피팅한 2개 cubic.
    // 두 프리셋은 같은 곡선을 쓰고 apexY만 22px 이동한다.
    const nearSideX = 21.84;
    const nearCenterX = 67.92;
    const nearSideY = apexY + shoulder;
    withMaskLogicalTransform(outCtx, logicalCtx => {
      logicalCtx.beginPath();
      logicalCtx.moveTo(0, sideY);
      logicalCtx.bezierCurveTo(
        nearSideX, nearSideY,
        nearCenterX, apexY,
        centerX, apexY
      );
      logicalCtx.bezierCurveTo(
        W - nearCenterX, apexY,
        W - nearSideX, nearSideY,
        W, sideY
      );
      logicalCtx.lineTo(W, H);
      logicalCtx.lineTo(0, H);
      logicalCtx.closePath();
      logicalCtx.fillStyle = "#ffffff";
      logicalCtx.fill();
    });
    symmetrizeMaskAlpha(out);
    enforceMaskSafeArea(out);
    return out;
  }

  function drawLegacyHeartSeed(outCtx) {
    // v17.4의 literal vector path. 기본값은 같은 곡선을 2× 면에 그린 뒤
    // asymmetry=0 계약에 맞춰 좌우 알파만 정확히 대칭화한다.
    outCtx.translate(0, 5);
    outCtx.beginPath();
    outCtx.moveTo(32.5436, H);
    outCtx.ellipse(75.8961, 175.7948, 74.5011, 88.7852, 0, 2.191865, 1.5 * Math.PI);
    outCtx.bezierCurveTo(105.55, 87.01, 130.97, 102.68, 146.5, 115);
    outCtx.bezierCurveTo(162.16, 103.19, 187.80, 88.1515, 217.7038, 88.1515);
    outCtx.ellipse(217.7038, 174.9415, 73.0561, 86.7901, 0, 1.5 * Math.PI, 7.283765);
    outCtx.lineTo(32.5436, H);
    outCtx.closePath();
  }

  function createHeartSeed(values = null) {
    const params = normalizedMaskShapeValues("heart-wide", values);
    const out = createMaskCanvas();
    const outCtx = out.getContext("2d", { alpha: true });
    withMaskLogicalTransform(outCtx, logicalCtx => {
      if (maskShapeValuesAreDefault("heart-wide", params)) {
        drawLegacyHeartSeed(logicalCtx);
      } else {
        const heightScale = params.height / HEART_SEED_DEFAULTS.height;
        const mapY = value => H - (H - value) * heightScale;
        const averageLobeTop = mapY((92.0096 + 93.1515) / 2);
        const desiredNotchY = averageLobeTop + params.notchDepth;
        const notchShiftY = desiredNotchY - mapY(120);
        const handleMidX = (130.97 + 162.16) / 2 + params.asymmetry * .5;
        const leftHandleX = handleMidX - params.notchWidth / 2;
        const rightHandleX = handleMidX + params.notchWidth / 2;
        const notchX = 146.5 + params.asymmetry;
        logicalCtx.beginPath();
        logicalCtx.moveTo(32.5436, mapY(H + 5));
        logicalCtx.ellipse(75.8961, mapY(180.7948), 74.5011, 88.7852 * heightScale, 0, 2.191865, 1.5 * Math.PI);
        logicalCtx.bezierCurveTo(105.55, mapY(92.01), leftHandleX, mapY(107.68) + notchShiftY * .55, notchX, desiredNotchY);
        logicalCtx.bezierCurveTo(rightHandleX, mapY(108.19) + notchShiftY * .55, 187.80, mapY(93.1515), 217.7038, mapY(93.1515));
        logicalCtx.ellipse(217.7038, mapY(179.9415), 73.0561, 86.7901 * heightScale, 0, 1.5 * Math.PI, 7.283765);
        logicalCtx.lineTo(32.5436, mapY(H + 5));
        logicalCtx.closePath();
      }
      logicalCtx.fillStyle = "#ffffff";
      logicalCtx.fill();
    });
    if (Math.abs(params.asymmetry) < 1e-9) symmetrizeMaskAlpha(out);
    enforceMaskSafeArea(out);
    return out;
  }

  function createMaskSeed(kind, values = null) {
    if (kind === "blank") return createMaskCanvas();
    // 두 돔은 완전히 같은 타원 곡률이며 높은 돔만 22px 위로 평행 이동한다.
    // 기존 포물선보다 양끝을 48px 낮춰 실제 시그 레퍼런스의 큰 아치에 맞춘다.
    if (kind === "dome-low" || kind === "dome-high") {
      const params = normalizedMaskShapeValues(kind, values);
      return createDomeSeed(params.apex, params.sideDrop, params.shoulder);
    }
    if (kind === "heart-wide") {
      // 오렌지 레퍼런스의 실제 바깥선을 맞춘 판형 하트.
      // 좌우의 큰 세로 타원 로브와 깊은 중앙 골을 쓰고, 하단은 캔버스 아래로
      // 이어지는 큰 하트가 출력 영역에서 잘린 것처럼 자연스럽게 닫는다.
      return createHeartSeed(values);
    }
    if (kind === "organic") {
      const out = createMaskCanvas();
      const outCtx = out.getContext("2d", { alpha: true });
      withMaskLogicalTransform(outCtx, logicalCtx => {
        logicalCtx.beginPath();
        logicalCtx.moveTo(0, 125);
        logicalCtx.bezierCurveTo(20, 99, 58, 92, 96, 103);
        logicalCtx.bezierCurveTo(131, 83, 184, 88, 210, 104);
        logicalCtx.bezierCurveTo(242, 96, 277, 105, W, 128);
        logicalCtx.lineTo(W, H);
        logicalCtx.lineTo(0, H);
        logicalCtx.closePath();
        logicalCtx.fillStyle = "#ffffff";
        logicalCtx.fill();
      });
      enforceMaskSafeArea(out);
      return out;
    }
    const configs = {
      straight: { mask: "band-straight", top: 84, curve: 18 }
    };
    return rasterizeBackgroundMask(configs[kind] || configs.straight);
  }

  function formatMaskShapeValue(value) {
    return String(Math.round(Number(value) * 10000) / 10000);
  }

  function syncMaskShapeTuner() {
    const tuner = document.getElementById("sigMaskShapeTuner");
    if (!tuner) return;
    const family = maskShapeSession ? maskShapeFamily(maskShapeSession.kind) : "";
    tuner.hidden = !family;
    if (!family) return;
    tuner.open = true;
    tuner.querySelectorAll("[data-mask-shape-panel]").forEach(panel => {
      panel.hidden = panel.dataset.maskShapePanel !== family;
    });
    const title = document.getElementById("sigMaskShapeTitle");
    if (title) title.textContent = family === "dome" ? "돔 곡선 세부 조절" : "하트 곡선 세부 조절";
    Object.entries(maskShapeSession.values).forEach(([key, value]) => {
      tuner.querySelectorAll(`[data-mask-shape-param="${key}"], [data-mask-shape-number="${key}"]`).forEach(input => {
        input.value = formatMaskShapeValue(value);
      });
    });
    const status = document.getElementById("sigMaskShapeStatus");
    if (status) status.textContent = maskShapeSession.dirty
      ? "미확정 · 모양만 미리 보는 중"
      : maskShapeValuesAreDefault(maskShapeSession.kind, maskShapeSession.values)
        ? "기본값 · 기존 모양과 동일"
        : "현재값 확정됨";
    document.getElementById("sigMaskShapeConfirm")?.toggleAttribute("disabled", !maskShapeSession.dirty);
  }

  function confirmMaskShapeParameters() {
    if (!maskShapeSession?.dirty) return false;
    commitMaskHistory();
    maskShapeSession.dirty = false;
    maskShapeSession.beforeAlpha = null;
    syncMaskShapeTuner();
    return true;
  }

  function leaveMaskShapeTuner(commit = true) {
    if (commit) confirmMaskShapeParameters();
    maskShapeSession = null;
    syncMaskShapeTuner();
  }

  function previewMaskShapeParameter(key, value) {
    if (!maskShapeSession || !(key in maskShapeSession.values)) return;
    if (!maskShapeSession.beforeAlpha) maskShapeSession.beforeAlpha = captureMaskAlpha();
    const nextValues = normalizedMaskShapeValues(maskShapeSession.kind, Object.assign({}, maskShapeSession.values, { [key]: Number(value) }));
    maskShapeSession.values = nextValues;
    maskWorkingCanvas = createMaskSeed(maskShapeSession.kind, nextValues);
    maskShapeSession.dirty = !maskAlphaEquals(maskShapeSession.beforeAlpha, captureMaskAlpha());
    syncMaskShapeTuner();
    renderMaskEditor();
  }

  function resetMaskShapeParameters() {
    if (!maskShapeSession) return;
    if (!maskShapeSession.beforeAlpha) maskShapeSession.beforeAlpha = captureMaskAlpha();
    maskShapeSession.values = maskShapeDefaults(maskShapeSession.kind);
    maskWorkingCanvas = createMaskSeed(maskShapeSession.kind, maskShapeSession.values);
    maskShapeSession.dirty = !maskAlphaEquals(maskShapeSession.beforeAlpha, captureMaskAlpha());
    syncMaskShapeTuner();
    renderMaskEditor();
  }

  function applyMaskSeed(kind) {
    confirmMaskShapeParameters();
    replaceWorkingMask(createMaskSeed(kind));
    commitMaskHistory();
    const values = maskShapeDefaults(kind);
    maskShapeSession = values ? { kind, values, beforeAlpha: null, dirty: false } : null;
    syncMaskShapeTuner();
    renderMaskEditor();
    const label = document.querySelector(`[data-mask-seed="${kind}"] span`)?.textContent || "시작";
    const tip = document.getElementById("sigMaskTip");
    if (tip) tip.textContent = `${label} 모양에서 시작했어. 브러시와 지우개로 자유롭게 다듬어봐.`;
  }

  function refreshMaskSeedThumbnails() {
    document.querySelectorAll("[data-mask-seed]").forEach(button => {
      const thumb = button.querySelector("canvas");
      if (!thumb) return;
      const thumbCtx = thumb.getContext("2d", { alpha: true });
      thumbCtx.clearRect(0, 0, thumb.width, thumb.height);
      for (let y = 0; y < thumb.height; y += 6) {
        for (let x = 0; x < thumb.width; x += 6) {
          thumbCtx.fillStyle = ((x / 6 + y / 6) & 1) ? "#eee9f1" : "#fff";
          thumbCtx.fillRect(x, y, 6, 6);
        }
      }
      const seed = createMaskSeed(button.dataset.maskSeed);
      const colored = tintMask(seed, "#ed6f99");
      thumbCtx.drawImage(colored, 0, MASK_SAFE_TOP, MASK_W, MASK_H - MASK_SAFE_TOP, 0, 0, thumb.width, thumb.height);
    });
  }

  function drawMaskChecker(c) {
    const tile = 10;
    for (let y = 0; y < H; y += tile) {
      for (let x = 0; x < W; x += tile) {
        c.fillStyle = ((x / tile + y / tile) & 1) ? "#eee9f1" : "#ffffff";
        c.fillRect(x, y, tile, tile);
      }
    }
  }

  function drawMaskPreview(c, sourceMask = maskWorkingCanvas) {
    const previewMode = !!document.getElementById("sigMaskPreviewMode")?.checked;
    if (!previewMode) {
      drawMaskLogical(c, tintMask(sourceMask, "rgba(255,105,145,.78)"));
      return;
    }
    const color = document.getElementById("sigMaskPreviewColor")?.value || state.background.maskFillColor || "#ff9bb7";
    if (maskGesture) {
      // The outline dilation is intentionally deferred until pointer-up. At the
      // largest double-outline setting it requires thousands of compositing
      // operations, while the fill-only preview stays responsive during a stroke.
      drawMaskLogical(c, tintMask(sourceMask, color));
      return;
    }
    if (state.background.maskDoubleOutline && state.background.maskOuterWidth > 0) {
      drawExpandedMask(c, sourceMask, state.background.maskOuterColor || "#ffffff", (state.background.maskStrokeWidth || 0) + state.background.maskOuterWidth);
    }
    if (state.background.maskStrokeWidth > 0) {
      drawExpandedMask(c, sourceMask, state.background.maskStrokeColor || "#ff7697", state.background.maskStrokeWidth);
    }
    drawMaskLogical(c, tintMask(sourceMask, color));
  }

  function drawTopLineGesture(c, points, mirror) {
    if (!points || points.length < 2) return;
    const drawPoints = source => {
      c.beginPath();
      source.forEach((point, index) => index ? c.lineTo(point.x, point.y) : c.moveTo(point.x, point.y));
      c.stroke();
    };
    c.save();
    c.strokeStyle = "#45267e";
    c.lineWidth = 2;
    c.lineCap = "round";
    c.lineJoin = "round";
    drawPoints(points);
    if (mirror) {
      c.strokeStyle = "rgba(225,90,132,.84)";
      drawPoints(points.map(point => ({ x: W - point.x, y: point.y })));
    }
    c.restore();
  }

  function drawClosedOutlineGesture(c, points, mirror) {
    if (!points || points.length < 2) return;
    const drawPoints = source => {
      c.beginPath();
      source.forEach((point, index) => index ? c.lineTo(point.x, point.y) : c.moveTo(point.x, point.y));
      c.stroke();
      if (source.length > 2) {
        c.save();
        c.setLineDash([3, 3]);
        c.lineTo(source[0].x, source[0].y);
        c.stroke();
        c.restore();
      }
    };
    c.save();
    c.strokeStyle = "#2a9a77";
    c.lineWidth = 1.5;
    c.lineCap = "round";
    c.lineJoin = "round";
    drawPoints(points);
    if (mirror) {
      c.strokeStyle = "rgba(225,90,132,.84)";
      drawPoints(points.map(point => ({ x: W - point.x, y: point.y })));
    }
    c.restore();
  }

  function drawGestureAreaPreview(c, gesture) {
    if (!gesture) return;
    if (gesture.tool !== "lasso" || gesture.points.length < 3) return;
    const fillPoints = source => {
      c.beginPath();
      source.forEach((point, index) => index ? c.lineTo(point.x, point.y) : c.moveTo(point.x, point.y));
      c.closePath();
      c.fill();
    };
    c.save();
    c.fillStyle = "rgba(42,154,119,.20)";
    fillPoints(gesture.points);
    if (gesture.mirror) fillPoints(gesture.points.map(point => ({ x: W - point.x, y: point.y })));
    c.restore();
  }

  function renderMaskEditor() {
    if (!maskEditorCtx || !maskWorkingCanvas) return;
    maskEditorCtx.setTransform(MASK_SCALE, 0, 0, MASK_SCALE, 0, 0);
    maskEditorCtx.clearRect(0, 0, W, H);
    drawMaskChecker(maskEditorCtx);
    let previewMask = maskWorkingCanvas;
    if (maskGesture?.tool === "topline" && validTopLineGesture(maskGesture.points)) {
      const toplineMask = createMaskCanvas();
      if (applyTopLine(maskGesture.points, toplineMask, maskGesture.mirror)) previewMask = toplineMask;
    }
    drawMaskPreview(maskEditorCtx, previewMask);
    drawGestureAreaPreview(maskEditorCtx, maskGesture);
    maskEditorCtx.save();
    maskEditorCtx.setLineDash([4, 4]);
    maskEditorCtx.strokeStyle = "#4f3c8e";
    maskEditorCtx.lineWidth = 1;
    maskEditorCtx.beginPath();
    maskEditorCtx.moveTo(0, 84.5);
    maskEditorCtx.lineTo(W, 84.5);
    maskEditorCtx.stroke();
    maskEditorCtx.restore();
    if (maskGesture?.tool === "topline") drawTopLineGesture(maskEditorCtx, maskGesture.points, maskGesture.mirror);
    if (maskGesture?.tool === "lasso") drawClosedOutlineGesture(maskEditorCtx, maskGesture.points, maskGesture.mirror);
  }

  function scheduleMaskEditorRender() {
    if (maskRenderFrame) return;
    maskRenderFrame = requestAnimationFrame(() => {
      maskRenderFrame = 0;
      renderMaskEditor();
    });
  }

  function cancelMaskAnimationFrames() {
    if (maskRenderFrame) cancelAnimationFrame(maskRenderFrame);
    if (maskCursorFrame) cancelAnimationFrame(maskCursorFrame);
    maskRenderFrame = 0;
    maskCursorFrame = 0;
  }

  function setMaskZoom(value) {
    const zoom = [1, 1.5, 2].includes(Number(value)) ? Number(value) : 1;
    const viewport = document.getElementById("sigMaskViewport");
    const frame = document.getElementById("sigMaskCanvasFrame");
    if (!viewport || !frame) return;
    const oldWidth = Math.max(1, viewport.scrollWidth);
    const oldHeight = Math.max(1, viewport.scrollHeight);
    const centerX = (viewport.scrollLeft + viewport.clientWidth / 2) / oldWidth;
    const centerY = (viewport.scrollTop + viewport.clientHeight / 2) / oldHeight;
    maskEditorZoom = zoom;
    frame.style.width = `${W * DPR * zoom}px`;
    frame.style.height = `${H * DPR * zoom}px`;
    document.querySelectorAll("[data-mask-zoom]").forEach(button => button.classList.toggle("on", Number(button.dataset.maskZoom) === zoom));
    requestAnimationFrame(() => {
      viewport.scrollLeft = Math.max(0, centerX * viewport.scrollWidth - viewport.clientWidth / 2);
      viewport.scrollTop = Math.max(0, centerY * viewport.scrollHeight - viewport.clientHeight / 2);
      updateMaskCursor();
    });
  }

  function maskBrushSize() {
    return clamp(document.getElementById("sigMaskBrushSize")?.value || MASK_BRUSH_PRESETS.m, 2, 80);
  }

  function setMaskBrushSize(value) {
    const next = Math.round(clamp(value, 2, 80));
    const range = document.getElementById("sigMaskBrushSize");
    const number = document.getElementById("sigMaskBrushSizeNumber");
    const label = document.getElementById("sigMaskSizeLabel");
    if (range) range.value = String(next);
    if (number) number.value = String(next);
    if (label) label.textContent = `${next}px`;
    document.querySelectorAll("[data-mask-size]").forEach(button => button.classList.toggle("on", Number(button.dataset.maskSize) === next));
    updateMaskCursor();
  }

  function setMaskTool(tool) {
    if (!["topline", "brush", "eraser", "lasso"].includes(tool)) return;
    maskEditorTool = tool;
    document.querySelectorAll("[data-mask-tool]").forEach(button => button.classList.toggle("on", button.dataset.maskTool === tool));
    const brushControls = document.getElementById("sigMaskBrushControls");
    const stabilizer = document.getElementById("sigMaskStabilizer");
    const usesBrushSize = tool === "brush" || tool === "eraser";
    if (brushControls) {
      brushControls.hidden = false;
      brushControls.classList.toggle("is-inactive", !usesBrushSize);
    }
    [document.getElementById("sigMaskBrushSize"), document.getElementById("sigMaskBrushSizeNumber"), ...document.querySelectorAll("[data-mask-size]")]
      .forEach(control => { if (control) control.disabled = !usesBrushSize; });
    const sizeHelp = document.getElementById("sigMaskSizeHelp");
    if (sizeHelp) sizeHelp.textContent = usesBrushSize
      ? "캔버스의 원형 커서가 실제 굵기야."
      : "이 도구는 선 굵기 없이 면을 만들어. 굵기는 ‘더하기’와 ‘깎기’에서 사용해.";
    if (stabilizer) stabilizer.hidden = tool !== "topline";
    const cursor = document.getElementById("sigMaskCursor");
    if (cursor) {
      cursor.className = `sig-mask-cursor is-${tool}`;
      const symbol = cursor.querySelector("span");
      if (symbol) symbol.textContent = tool === "brush" ? "+" : tool === "eraser" ? "−" : tool === "lasso" ? "L" : "T";
    }
    const tip = document.getElementById("sigMaskTip");
    if (tip) {
      tip.textContent = tool === "topline"
        ? (maskMirrorEnabled() ? "대칭 중심선의 왼쪽이나 오른쪽 한쪽에 윗선을 그려. 반대쪽은 자동으로 똑같이 만들어져." : "왼쪽에서 오른쪽으로 윗선을 한 번 그리면 아래까지 자동으로 닫혀.")
        : tool === "brush"
          ? (maskMirrorEnabled() ? "＋ 원 안쪽을 칠하면 반대쪽에도 같은 굵기로 동시에 더해져." : "＋ 원이 실제 굵기야. 배경판을 더할 곳을 칠해.")
          : tool === "eraser"
            ? (maskMirrorEnabled() ? "− 원 안쪽을 지우면 반대쪽도 동시에 깎여." : "− 원이 실제 굵기야. 배경판을 깎을 곳을 문질러.")
            : (maskMirrorEnabled() ? "닫힌 윤곽을 한쪽에 그리면 양쪽 영역을 동시에 채워." : "채울 영역의 테두리를 한 바퀴 그리고 손을 떼면 안쪽이 자동으로 채워져.");
    }
    updateMaskCursor();
  }

  function updateMaskCursor(point = maskPointerPoint) {
    if (point) maskPointerPoint = point;
    if (maskCursorFrame) return;
    maskCursorFrame = requestAnimationFrame(() => {
      maskCursorFrame = 0;
      paintMaskCursor();
    });
  }

  function paintMaskCursor() {
    const cursor = document.getElementById("sigMaskCursor");
    const point = maskPointerPoint;
    if (!cursor || !maskEditorCanvas || !point || !maskPointerInside || document.getElementById("sigMaskStudio")?.hidden) {
      if (cursor) cursor.hidden = true;
      return;
    }
    const rect = maskEditorCanvas.getBoundingClientRect();
    const hasBrushRing = maskEditorTool === "brush" || maskEditorTool === "eraser";
    const diameter = hasBrushRing ? maskBrushSize() * rect.width / W : 18;
    const forbidden = point.y < 84;
    cursor.hidden = false;
    cursor.className = `sig-mask-cursor is-${maskEditorTool}${forbidden ? " is-forbidden" : ""}`;
    const symbol = cursor.querySelector("span");
    if (symbol) symbol.textContent = forbidden ? "×" : maskEditorTool === "brush" ? "+" : maskEditorTool === "eraser" ? "−" : maskEditorTool === "lasso" ? "L" : "T";
    cursor.style.width = `${diameter}px`;
    cursor.style.height = `${diameter}px`;
    const left = point.x * rect.width / W - diameter / 2;
    const top = point.y * rect.height / H - diameter / 2;
    cursor.style.transform = `translate3d(${left}px,${top}px,0)`;
    cursor.dataset.zoom = String(maskEditorZoom);
  }

  function openMaskStudio() {
    maskWorkingCanvas = rasterizeBackgroundMask(state.background);
    maskShapeSession = null;
    resetMaskHistory();
    const modal = document.getElementById("sigMaskStudio");
    modal.hidden = false;
    document.body.classList.add("sig-mask-editing");
    const previewColor = document.getElementById("sigMaskPreviewColor");
    if (previewColor) previewColor.value = state.background.maskFillColor || state.background.secondary || "#ff9bb7";
    setMaskZoom(1);
    setMaskBrushSize(document.getElementById("sigMaskBrushSize")?.value || MASK_BRUSH_PRESETS.m);
    setMaskTool(maskEditorTool);
    document.getElementById("sigMaskCenterGuide").hidden = !maskMirrorEnabled();
    refreshMaskSeedThumbnails();
    refreshMaskLibrary();
    syncMaskShapeTuner();
    renderMaskEditor();
  }

  function maskStudioDirty() {
    return !!maskWorkingCanvas && !!maskHistory[0] && !maskAlphaEquals(maskHistory[0], captureMaskAlpha());
  }

  async function closeMaskStudio(force = false) {
    if (!force && maskStudioDirty() && !(await askSigConfirm("아직 적용하지 않은 마스크 수정이 있어. 변경을 버리고 닫을까?", {
      title: "마스크 변경 버리기",
      confirmLabel: "버리고 닫기"
    }))) return false;
    cancelMaskAnimationFrames();
    document.getElementById("sigMaskStudio").hidden = true;
    document.body.classList.remove("sig-mask-editing");
    maskGesture = null;
    maskPointerInside = false;
    maskPointerPoint = null;
    maskShapeSession = null;
    syncMaskShapeTuner();
    updateMaskCursor();
    maskWorkingCanvas = null;
    maskHistory = [];
    maskHistoryIndex = -1;
    return true;
  }

  function applyMaskStudio() {
    /* 스튜디오가 닫혀 작업 캔버스가 없으면 no-op — 예전 guard가 겸하던 null 방어 유지
       (없으면 cloneMaskCanvas(null)이 빈 캔버스를 만들어 빈 마스크가 조용히 적용됨) */
    if (!maskWorkingCanvas) return false;
    confirmMaskShapeParameters();
    /* 빈 판도 그대로 적용한다 — 배경판 없이 불러온 이미지·소품으로만 꾸미는 구성 허용
       (예전엔 여기서 막아서 '빈판' 시작 모양이 저장이 안 됐다). 빈 마스크는 배경을
       아예 안 그릴 뿐, 테두리·저장·프로젝트 경로 전부 무해함을 확인했다. 출력에
       정말 아무것도 없으면 저장 단계의 "보이는 내용이 없어" 검증이 그때 잡아준다. */
    const historyBefore = beginMainChange();
    state.background.maskCanvas = cloneMaskCanvas(maskWorkingCanvas);
    state.background.mask = "alpha-custom";
    const option = document.querySelector('#sigBgMask option[value="alpha-custom"]');
    if (option) option.disabled = false;
    closeMaskStudio(true);
    syncControls();
    requestRender();
    commitMainChange(historyBefore);
    return true;
  }

  function editorRawPoint(event) {
    const rect = maskEditorCanvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * W / rect.width,
      y: (event.clientY - rect.top) * H / rect.height
    };
  }

  function editorPoint(event, restrictToContent = true) {
    const point = editorRawPoint(event);
    return {
      x: clamp(point.x, 0, W),
      y: clamp(point.y, restrictToContent ? 84 : 0, H)
    };
  }

  function editorPointerIsInside(event) {
    const rect = maskEditorCanvas.getBoundingClientRect();
    return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  }

  function paintSingleMaskSegment(workCtx, from, to, tool, size) {
    workCtx.beginPath();
    workCtx.moveTo(from.x, from.y);
    workCtx.lineTo(to.x, to.y);
    workCtx.stroke();
    workCtx.beginPath();
    workCtx.arc(to.x, to.y, size / 2, 0, Math.PI * 2);
    workCtx.fill();
  }

  function paintMaskSegment(from, to, tool, mirror = maskMirrorEnabled()) {
    const workCtx = maskWorkingCanvas.getContext("2d", { alpha: true });
    const size = maskBrushSize();
    withMaskLogicalTransform(workCtx, logicalCtx => {
      logicalCtx.save();
      logicalCtx.beginPath();
      logicalCtx.rect(0, SAFE_TOP, W, H - SAFE_TOP);
      logicalCtx.clip();
      logicalCtx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
      logicalCtx.strokeStyle = "#ffffff";
      logicalCtx.fillStyle = "#ffffff";
      logicalCtx.lineWidth = size;
      logicalCtx.lineCap = "round";
      logicalCtx.lineJoin = "round";
      paintSingleMaskSegment(logicalCtx, from, to, tool, size);
      if (mirror) paintSingleMaskSegment(logicalCtx, { x: W - from.x, y: from.y }, { x: W - to.x, y: to.y }, tool, size);
      logicalCtx.restore();
    });
    enforceMaskSafeArea();
  }

  function replaceWorkingMask(next) {
    if (!next) return;
    if (maskShapeSession) leaveMaskShapeTuner(true);
    maskWorkingCanvas = next.width === MASK_W && next.height === MASK_H ? next : normalizeStoredMaskCanvas(next);
    enforceMaskSafeArea();
  }

  function maskAlphaBounds(source = maskWorkingCanvas) {
    if (!source) return null;
    const data = source.getContext("2d", { alpha: true, willReadFrequently: true }).getImageData(0, 0, MASK_W, MASK_H).data;
    let minX = MASK_W;
    let minY = MASK_H;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < MASK_H; y++) {
      for (let x = 0; x < MASK_W; x++) {
        if (!data[(y * MASK_W + x) * 4 + 3]) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    return maxX < minX ? null : {
      minX: minX / MASK_SCALE,
      minY: minY / MASK_SCALE,
      maxX: maxX / MASK_SCALE,
      maxY: maxY / MASK_SCALE
    };
  }

  function alignWorkingMask(kind) {
    if (!maskWorkingCanvas) return false;
    leaveMaskShapeTuner(true);
    const bounds = maskAlphaBounds();
    if (!bounds) return false;
    let dx = 0;
    let dy = 0;
    if (kind === "center") dx = Math.round((W / 2 - (bounds.minX + bounds.maxX + 1 / MASK_SCALE) / 2) * MASK_SCALE) / MASK_SCALE;
    else if (kind === "safe") dy = SAFE_TOP - bounds.minY;
    else if (kind === "bottom") dy = H - 1 / MASK_SCALE - bounds.maxY;
    applyMaskTransform({ dx, dy });
    const tip = document.getElementById("sigMaskTip");
    if (tip) tip.textContent = kind === "center" ? "배경판을 캔버스 가운데에 맞췄어." : kind === "safe" ? "배경판의 첫 픽셀을 84px 안전선에 맞췄어." : "배경판을 캔버스 바닥에 맞췄어.";
    return true;
  }

  function applyMaskTransform({ dx = 0, dy = 0, scaleX = 1, scaleY = 1 } = {}) {
    if (!maskWorkingCanvas) return;
    leaveMaskShapeTuner(true);
    const source = cloneMaskCanvas(maskWorkingCanvas);
    const next = createMaskCanvas();
    const nextCtx = next.getContext("2d", { alpha: true });
    const centerX = W / 2;
    const centerY = 84 + (H - 84) / 2;
    withMaskLogicalTransform(nextCtx, logicalCtx => {
      logicalCtx.translate(centerX + dx, centerY + dy);
      logicalCtx.scale(scaleX, scaleY);
      logicalCtx.translate(-centerX, -centerY);
      drawMaskLogical(logicalCtx, source);
    });
    replaceWorkingMask(next);
    commitMaskHistory();
    renderMaskEditor();
  }

  function writeWorkingMaskAlpha(alpha) {
    leaveMaskShapeTuner(true);
    const next = createMaskCanvas();
    const nextCtx = next.getContext("2d", { alpha: true, willReadFrequently: true });
    const image = nextCtx.createImageData(MASK_W, MASK_H);
    for (let i = 0, p = 0; i < alpha.length; i++, p += 4) {
      image.data[p] = 255;
      image.data[p + 1] = 255;
      image.data[p + 2] = 255;
      image.data[p + 3] = i < MASK_W * MASK_SAFE_TOP ? 0 : alpha[i];
    }
    nextCtx.putImageData(image, 0, 0);
    replaceWorkingMask(next);
  }

  function smoothWorkingMask() {
    const source = captureMaskAlpha();
    const horizontal = new Float32Array(source.length);
    const next = new Uint8ClampedArray(source.length);
    const radius = 2 * MASK_SCALE;
    const diameter = radius * 2 + 1;
    for (let y = MASK_SAFE_TOP; y < MASK_H; y++) {
      for (let x = 0; x < MASK_W; x++) {
        let sum = 0;
        for (let xx = -radius; xx <= radius; xx++) sum += source[y * MASK_W + clamp(x + xx, 0, MASK_W - 1)];
        horizontal[y * MASK_W + x] = sum / diameter;
      }
    }
    for (let y = MASK_SAFE_TOP; y < MASK_H; y++) {
      for (let x = 0; x < MASK_W; x++) {
        let sum = 0;
        for (let yy = -radius; yy <= radius; yy++) sum += horizontal[clamp(y + yy, MASK_SAFE_TOP, MASK_H - 1) * MASK_W + x];
        next[y * MASK_W + x] = Math.round(sum / diameter);
      }
    }
    writeWorkingMaskAlpha(next);
    commitMaskHistory();
    renderMaskEditor();
  }

  function fillWorkingMaskHoles() {
    const alpha = captureMaskAlpha();
    const seen = new Uint8Array(MASK_W * MASK_H);
    const queue = new Int32Array(MASK_W * (MASK_H - MASK_SAFE_TOP));
    let head = 0;
    let tail = 0;
    const enqueue = index => {
      if (index < MASK_W * MASK_SAFE_TOP || index >= alpha.length || seen[index] || alpha[index] >= 128) return;
      seen[index] = 1;
      queue[tail++] = index;
    };
    for (let x = 0; x < MASK_W; x++) {
      enqueue(MASK_SAFE_TOP * MASK_W + x);
      enqueue((MASK_H - 1) * MASK_W + x);
    }
    for (let y = MASK_SAFE_TOP; y < MASK_H; y++) {
      enqueue(y * MASK_W);
      enqueue(y * MASK_W + MASK_W - 1);
    }
    while (head < tail) {
      const index = queue[head++];
      const x = index % MASK_W;
      const y = Math.floor(index / MASK_W);
      if (x > 0) enqueue(index - 1);
      if (x < MASK_W - 1) enqueue(index + 1);
      if (y > MASK_SAFE_TOP) enqueue(index - MASK_W);
      if (y < MASK_H - 1) enqueue(index + MASK_W);
    }
    let filled = 0;
    for (let index = MASK_W * MASK_SAFE_TOP; index < alpha.length; index++) {
      if (alpha[index] < 128 && !seen[index]) {
        alpha[index] = 255;
        filled++;
      }
    }
    writeWorkingMaskAlpha(alpha);
    commitMaskHistory();
    renderMaskEditor();
    const tip = document.getElementById("sigMaskTip");
    if (tip) tip.textContent = filled ? `닫힌 구멍 약 ${Math.round(filled / (MASK_SCALE * MASK_SCALE)).toLocaleString()}px을 메웠어.` : "메울 수 있는 닫힌 구멍이 없어.";
  }

  function removeWorkingMaskSpecks() {
    const alpha = captureMaskAlpha();
    const seen = new Uint8Array(MASK_W * MASK_H);
    const logicalThreshold = Math.round(clamp(document.getElementById("sigMaskSpeckSize")?.value || 28, 4, 300));
    const threshold = logicalThreshold * MASK_SCALE * MASK_SCALE;
    let removedPixels = 0;
    let removedGroups = 0;
    for (let start = MASK_W * MASK_SAFE_TOP; start < alpha.length; start++) {
      if (seen[start] || alpha[start] < 32) continue;
      const component = [];
      const queue = [start];
      seen[start] = 1;
      for (let head = 0; head < queue.length; head++) {
        const index = queue[head];
        component.push(index);
        const x = index % MASK_W;
        const y = Math.floor(index / MASK_W);
        for (let yy = -1; yy <= 1; yy++) {
          for (let xx = -1; xx <= 1; xx++) {
            if (!xx && !yy) continue;
            const nx = x + xx;
            const ny = y + yy;
            if (nx < 0 || nx >= MASK_W || ny < MASK_SAFE_TOP || ny >= MASK_H) continue;
            const next = ny * MASK_W + nx;
            if (!seen[next] && alpha[next] >= 32) {
              seen[next] = 1;
              queue.push(next);
            }
          }
        }
      }
      if (component.length <= threshold) {
        component.forEach(index => { alpha[index] = 0; });
        removedPixels += component.length;
        removedGroups++;
      }
    }
    writeWorkingMaskAlpha(alpha);
    commitMaskHistory();
    renderMaskEditor();
    const tip = document.getElementById("sigMaskTip");
    if (tip) tip.textContent = removedGroups ? `작은 점 ${removedGroups}개 · 약 ${Math.round(removedPixels / (MASK_SCALE * MASK_SCALE))}px을 정리했어.` : `${logicalThreshold}px 이하의 떨어진 작은 점이 없어.`;
  }

  function readMaskLibrary() {
    try {
      const v2Raw = localStorage.getItem(MASK_LIBRARY_KEY);
      const parsed = JSON.parse(v2Raw || "[]");
      const legacy = JSON.parse(localStorage.getItem(MASK_LIBRARY_LEGACY_KEY) || "[]");
      return Array.from({ length: MASK_LIBRARY_SLOTS }, (_, index) => {
        const v2OwnsSlot = Array.isArray(parsed) && Object.prototype.hasOwnProperty.call(parsed, index);
        const item = v2OwnsSlot ? parsed[index] : legacy[index];
        if (!item || typeof item.dataUrl !== "string" || !item.dataUrl.startsWith("data:image/png")) return null;
        return Object.assign({}, item, { legacy: !v2OwnsSlot });
      });
    } catch (error) {
      const tip = document.getElementById("sigMaskTip");
      if (tip) tip.textContent = "보관함을 읽지 못했어. 브라우저의 로컬 저장 허용 여부를 확인해줘.";
      return Array(MASK_LIBRARY_SLOTS).fill(null);
    }
  }

  function writeMaskLibrary(items) {
    try {
      localStorage.setItem(MASK_LIBRARY_KEY, JSON.stringify(items));
      return true;
    } catch (error) {
      const tip = document.getElementById("sigMaskTip");
      if (tip) tip.textContent = "보관함 저장 공간이 부족하거나 차단됐어. 마스크 PNG 저장을 이용해줘.";
      return false;
    }
  }

  async function migrateLegacyMaskLibrary() {
    if (localStorage.getItem(MASK_LIBRARY_KEY) || !localStorage.getItem(MASK_LIBRARY_LEGACY_KEY)) return false;
    const items = readMaskLibrary();
    const migrated = [];
    try {
      for (const item of items) {
        if (!item) {
          migrated.push(null);
          continue;
        }
        const image = await imageFromDataUrl(item.dataUrl);
        const mask = normalizeStoredMaskCanvas(image);
        migrated.push({
          dataUrl: mask.toDataURL("image/png"),
          width: MASK_W,
          height: MASK_H,
          scale: MASK_SCALE,
          savedAt: Number(item.savedAt) || Date.now()
        });
      }
      // Only remove v1 after the complete promoted library was committed.
      if (!writeMaskLibrary(migrated)) return false;
      localStorage.removeItem(MASK_LIBRARY_LEGACY_KEY);
      return true;
    } catch (_) {
      return false;
    }
  }

  function imageFromDataUrl(dataUrl, errorMessage = "이미지 데이터를 읽지 못했어.") {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(errorMessage));
      img.src = dataUrl;
    });
  }

  async function refreshMaskLibrary() {
    await migrateLegacyMaskLibrary();
    const items = readMaskLibrary();
    const slots = document.querySelectorAll("[data-mask-slot]");
    for (const slot of slots) {
      const index = Number(slot.dataset.maskSlot);
      const item = items[index];
      const load = slot.querySelector("[data-mask-library-load]");
      const remove = slot.querySelector("[data-mask-library-delete]");
      const canvasThumb = slot.querySelector("canvas");
      const label = load?.querySelector("span");
      if (load) load.disabled = !item;
      if (remove) remove.disabled = !item;
      if (label) label.textContent = item ? `${index + 1}번 · 불러오기` : `${index + 1}번 · 비어 있음`;
      if (!canvasThumb) continue;
      const thumbCtx = canvasThumb.getContext("2d", { alpha: true });
      thumbCtx.clearRect(0, 0, canvasThumb.width, canvasThumb.height);
      for (let y = 0; y < canvasThumb.height; y += 8) {
        for (let x = 0; x < canvasThumb.width; x += 8) {
          thumbCtx.fillStyle = ((x / 8 + y / 8) & 1) ? "#eee9f1" : "#ffffff";
          thumbCtx.fillRect(x, y, 8, 8);
        }
      }
      if (!item) continue;
      try {
        const img = await imageFromDataUrl(item.dataUrl);
        const colorCanvas = tintMask(normalizeStoredMaskCanvas(img), "#ef6d97");
        thumbCtx.drawImage(colorCanvas, 0, 0, canvasThumb.width, canvasThumb.height);
      } catch (error) {
        if (label) label.textContent = `${index + 1}번 · 손상됨`;
      }
    }
  }

  function saveMaskLibrarySlot(index) {
    if (!maskWorkingCanvas) return;
    const items = readMaskLibrary();
    try {
      items[index] = {
        dataUrl: maskWorkingCanvas.toDataURL("image/png"),
        width: MASK_W,
        height: MASK_H,
        scale: MASK_SCALE,
        savedAt: Date.now()
      };
      if (writeMaskLibrary(items)) {
        refreshMaskLibrary();
        const tip = document.getElementById("sigMaskTip");
        if (tip) tip.textContent = `현재 모양을 보관함 ${index + 1}번에 저장했어.`;
      }
    } catch (error) {
      const tip = document.getElementById("sigMaskTip");
      if (tip) tip.textContent = "현재 모양을 보관함에 저장하지 못했어. PNG 저장을 이용해줘.";
    }
  }

  async function loadMaskLibrarySlot(index) {
    const item = readMaskLibrary()[index];
    if (!item) return;
    try {
      const img = await imageFromDataUrl(item.dataUrl);
      replaceWorkingMask(normalizeStoredMaskCanvas(img));
      commitMaskHistory();
      renderMaskEditor();
      const tip = document.getElementById("sigMaskTip");
      if (tip) tip.textContent = `보관함 ${index + 1}번 모양을 불러왔어. 적용 전에는 언제든 취소할 수 있어.`;
    } catch (error) {
      const tip = document.getElementById("sigMaskTip");
      if (tip) tip.textContent = error.message || "저장된 모양을 읽지 못했어.";
    }
  }

  function deleteMaskLibrarySlot(index) {
    const items = readMaskLibrary();
    items[index] = null;
    if (writeMaskLibrary(items)) refreshMaskLibrary();
  }

  function bindMaskStudio() {
    ["sigMaskOpen", "sigMaskOpenTop"].forEach(id => document.getElementById(id)?.addEventListener("click", openMaskStudio));
    ["sigMaskClose", "sigMaskCancel"].forEach(id => document.getElementById(id)?.addEventListener("click", () => { void closeMaskStudio(false); }));
    document.getElementById("sigMaskApply").addEventListener("click", applyMaskStudio);
    document.getElementById("sigMaskShapeConfirm").addEventListener("click", confirmMaskShapeParameters);
    document.getElementById("sigMaskShapeReset").addEventListener("click", resetMaskShapeParameters);
    document.querySelectorAll("[data-mask-shape-param]").forEach(input => {
      input.addEventListener("input", () => previewMaskShapeParameter(input.dataset.maskShapeParam || input.dataset.maskShapeNumber, input.value));
      input.addEventListener("change", () => previewMaskShapeParameter(input.dataset.maskShapeParam || input.dataset.maskShapeNumber, input.value));
    });
    document.querySelectorAll("[data-mask-shape-number]").forEach(input => {
      let editPending = false;
      input.addEventListener("input", () => { editPending = true; });
      const commit = () => {
        editPending = false;
        previewMaskShapeParameter(input.dataset.maskShapeNumber, input.value);
      };
      input.addEventListener("change", commit);
      input.addEventListener("blur", () => {
        if (editPending) commit();
      });
      input.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        input.blur();
      });
    });
    document.getElementById("sigMaskUndo").addEventListener("click", maskUndo);
    document.getElementById("sigMaskRedo").addEventListener("click", maskRedo);
    document.getElementById("sigMaskClear").addEventListener("click", () => {
      if (!maskWorkingCanvas) return;
      leaveMaskShapeTuner(true);
      maskWorkingCanvas.getContext("2d").clearRect(0, 0, MASK_W, MASK_H);
      commitMaskHistory();
      renderMaskEditor();
    });
    document.getElementById("sigMaskReset").addEventListener("click", () => {
      leaveMaskShapeTuner(true);
      maskWorkingCanvas = createMaskSeed("straight");
      commitMaskHistory();
      renderMaskEditor();
    });
    const size = document.getElementById("sigMaskBrushSize");
    const sizeNumber = document.getElementById("sigMaskBrushSizeNumber");
    size.addEventListener("input", () => setMaskBrushSize(size.value));
    sizeNumber.addEventListener("input", () => setMaskBrushSize(sizeNumber.value));
    sizeNumber.addEventListener("change", () => setMaskBrushSize(sizeNumber.value));
    document.querySelectorAll("[data-mask-size]").forEach(button => button.addEventListener("click", () => setMaskBrushSize(button.dataset.maskSize)));
    document.querySelectorAll("[data-mask-tool]").forEach(button => button.addEventListener("click", () => setMaskTool(button.dataset.maskTool)));
    document.querySelectorAll("[data-mask-zoom]").forEach(button => button.addEventListener("click", () => setMaskZoom(button.dataset.maskZoom)));
    document.getElementById("sigMaskPreviewMode").addEventListener("change", renderMaskEditor);
    document.getElementById("sigMaskPreviewColor").addEventListener("input", renderMaskEditor);
    document.getElementById("sigMaskStabilize").addEventListener("input", event => {
      document.getElementById("sigMaskStabilizeLabel").textContent = `${event.currentTarget.value}%`;
    });
    document.getElementById("sigMaskMirrorDraw").addEventListener("change", event => {
      document.getElementById("sigMaskCenterGuide").hidden = !event.currentTarget.checked;
      setMaskTool(maskEditorTool);
      renderMaskEditor();
    });
    document.getElementById("sigMaskMoveUp").addEventListener("click", () => applyMaskTransform({ dy: -4 }));
    document.getElementById("sigMaskMoveDown").addEventListener("click", () => applyMaskTransform({ dy: 4 }));
    document.getElementById("sigMaskMoveLeft").addEventListener("click", () => applyMaskTransform({ dx: -4 }));
    document.getElementById("sigMaskMoveRight").addEventListener("click", () => applyMaskTransform({ dx: 4 }));
    document.getElementById("sigMaskScaleDown").addEventListener("click", () => applyMaskTransform({ scaleX: .94, scaleY: .94 }));
    document.getElementById("sigMaskScaleUp").addEventListener("click", () => applyMaskTransform({ scaleX: 1.06, scaleY: 1.06 }));
    document.getElementById("sigMaskFlipX").addEventListener("click", () => applyMaskTransform({ scaleX: -1 }));
    document.getElementById("sigMaskAlignCenter").addEventListener("click", () => alignWorkingMask("center"));
    document.getElementById("sigMaskAlignSafe").addEventListener("click", () => alignWorkingMask("safe"));
    document.getElementById("sigMaskAlignBottom").addEventListener("click", () => alignWorkingMask("bottom"));
    document.getElementById("sigMaskSmooth").addEventListener("click", smoothWorkingMask);
    document.getElementById("sigMaskFillHoles").addEventListener("click", fillWorkingMaskHoles);
    document.getElementById("sigMaskRemoveSpecks").addEventListener("click", removeWorkingMaskSpecks);
    document.querySelectorAll("[data-mask-library-save]").forEach(button => button.addEventListener("click", () => saveMaskLibrarySlot(Number(button.dataset.maskLibrarySave))));
    document.querySelectorAll("[data-mask-library-load]").forEach(button => button.addEventListener("click", () => loadMaskLibrarySlot(Number(button.dataset.maskLibraryLoad))));
    document.querySelectorAll("[data-mask-library-delete]").forEach(button => button.addEventListener("click", () => deleteMaskLibrarySlot(Number(button.dataset.maskLibraryDelete))));
    document.querySelectorAll("[data-mask-seed]").forEach(button => button.addEventListener("click", () => applyMaskSeed(button.dataset.maskSeed)));
    maskEditorCanvas.addEventListener("pointerenter", event => {
      maskPointerInside = true;
      maskPointerPoint = editorPoint(event, false);
      if (maskGesture && event.pointerId === maskGesture.pointerId
        && (maskGesture.tool === "brush" || maskGesture.tool === "eraser")
        && !maskEditorCanvas.hasPointerCapture?.(event.pointerId)) {
        // 브라우저 경계에서 캡처가 끊긴 뒤 돌아오면, 바깥의 마지막 좌표와
        // 재진입점을 긴 직선으로 잇지 않고 현재 지점부터 다시 이어 그린다.
        maskGesture.previous = editorRawPoint(event);
      }
      updateMaskCursor();
    });
    maskEditorCanvas.addEventListener("pointerleave", () => {
      if (maskGesture) return;
      maskPointerInside = false;
      updateMaskCursor();
    });
    maskEditorCanvas.addEventListener("pointerdown", event => {
      if (maskGesture || event.isPrimary === false || (event.pointerType === "mouse" && event.button !== 0)) return;
      event.preventDefault();
      leaveMaskShapeTuner(true);
      const rawPoint = editorRawPoint(event);
      if (rawPoint.x < 0 || rawPoint.x > W || rawPoint.y < 84 || rawPoint.y > H) {
        const tip = document.getElementById("sigMaskTip");
        if (tip) tip.textContent = "상단 84px은 SOOP 보호영역이라 그릴 수 없어. 점선 아래에서 시작해줘.";
        return;
      }
      try { maskEditorCanvas.setPointerCapture(event.pointerId); } catch (_) { /* window capture listener가 이어받는다. */ }
      const point = maskEditorTool === "brush" || maskEditorTool === "eraser" ? rawPoint : editorPoint(event, false);
      maskGesture = { pointerId: event.pointerId, tool: maskEditorTool, mirror: maskMirrorEnabled(), points: [point], previous: point, startAlpha: captureMaskAlpha() };
      if (maskGesture.tool === "brush" || maskGesture.tool === "eraser") paintMaskSegment(point, point, maskGesture.tool, maskGesture.mirror);
      renderMaskEditor();
    });
    const finish = (event, cancelled = false, force = false) => {
      if (!maskGesture || (!force && event.pointerId !== maskGesture.pointerId)) return;
      const completedGesture = maskGesture;
      // 먼저 비워 pointerup/lostcapture가 연달아 와도 한 번만 적용·기록한다.
      maskGesture = null;
      if (!cancelled && (completedGesture.tool === "brush" || completedGesture.tool === "eraser")
        && Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
        // 빠르게 캔버스 밖으로 나가 놓아도 마지막 move→pointerup 구간을 빼먹지 않는다.
        const endPoint = editorRawPoint(event);
        paintMaskSegment(completedGesture.previous, endPoint, completedGesture.tool, completedGesture.mirror);
        completedGesture.previous = endPoint;
      }
      try {
        if (maskEditorCanvas.hasPointerCapture?.(completedGesture.pointerId)) maskEditorCanvas.releasePointerCapture(completedGesture.pointerId);
      } catch (_) { /* 이미 브라우저 밖에서 해제된 경우 */ }
      if (maskRenderFrame) {
        cancelAnimationFrame(maskRenderFrame);
        maskRenderFrame = 0;
      }
      const keepPartialStroke = cancelled && (completedGesture.tool === "brush" || completedGesture.tool === "eraser");
      let applied = !cancelled || keepPartialStroke;
      if (cancelled && !keepPartialStroke) restoreMaskAlpha(completedGesture.startAlpha);
      else if (completedGesture.tool === "topline") applied = applyTopLine(completedGesture.points, maskWorkingCanvas, completedGesture.mirror);
      else if (completedGesture.tool === "lasso") applied = applyClosedOutline(completedGesture.points, maskWorkingCanvas, completedGesture.mirror);
      const afterAlpha = captureMaskAlpha();
      const delta = maskAlphaDelta(completedGesture.startAlpha, afterAlpha);
      if (applied && delta.changed) commitMaskHistory();
      const tip = document.getElementById("sigMaskTip");
      if (tip) {
        if (!applied) {
          tip.textContent = completedGesture.tool === "topline"
            ? "선이 너무 짧아 적용되지 않았어. 윗선을 조금 더 길게 그려줘."
            : completedGesture.tool === "lasso"
              ? "윤곽이 너무 짧아 적용되지 않았어. 영역을 한 바퀴 둘러 그려줘."
              : "입력이 취소되어 이전 모양으로 돌아갔어.";
        } else if (!delta.changed) {
          tip.textContent = completedGesture.tool === "brush"
            ? "변화 없음 · ‘더하기’는 체크무늬로 보이는 투명한 곳에 그려줘."
            : completedGesture.tool === "eraser"
              ? "변화 없음 · ‘깎기’는 분홍색 배경판 위에서 사용해줘."
              : "모양이 이전과 같아. 조금 다른 위치에 다시 그려줘.";
        } else if (completedGesture.tool === "brush") {
          tip.textContent = `더하기 완료 · 약 ${Math.round(delta.added / (MASK_SCALE * MASK_SCALE)).toLocaleString()}px 추가됨 · Ctrl+Z로 되돌릴 수 있어.`;
        } else if (completedGesture.tool === "eraser") {
          tip.textContent = `깎기 완료 · 약 ${Math.round(delta.removed / (MASK_SCALE * MASK_SCALE)).toLocaleString()}px 제거됨 · Ctrl+Z로 되돌릴 수 있어.`;
        } else if (completedGesture.tool === "topline") {
          tip.textContent = "윗모양 적용 완료 · 방금 보라색 가이드 아래가 배경판으로 바뀌었어.";
        } else {
          tip.textContent = "윤곽 자동채움 완료 · 방금 둘러 그린 안쪽이 배경판으로 바뀌었어.";
        }
      }
      if (Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
        maskPointerInside = editorPointerIsInside(event);
        maskPointerPoint = editorPoint(event, false);
      }
      renderMaskEditor();
      updateMaskCursor();
    };
    const moveActiveMaskGesture = event => {
      if (!maskGesture || event.pointerId !== maskGesture.pointerId) return;
      if (event.pointerType === "mouse" && event.buttons === 0) {
        finish(event, false);
        return;
      }
      if (event.cancelable) event.preventDefault();
      maskPointerInside = editorPointerIsInside(event);
      maskPointerPoint = editorPoint(event, false);
      updateMaskCursor();
      const freeBrush = maskGesture.tool === "brush" || maskGesture.tool === "eraser";
      const coalesced = typeof event.getCoalescedEvents === "function" ? event.getCoalescedEvents() : [event];
      for (const sample of coalesced.length ? coalesced : [event]) {
        const point = freeBrush ? editorRawPoint(sample) : editorPoint(sample, false);
        if (!freeBrush && point.y < 84) {
          maskGesture.previous = point;
          continue;
        }
        if (maskGesture.tool === "topline" || maskGesture.tool === "lasso") maskGesture.points.push(point);
        else paintMaskSegment(maskGesture.previous, point, maskGesture.tool, maskGesture.mirror);
        // 바깥 좌표도 계속 기억해야 재진입 때 경계에 붙거나 긴 직선이 생기지 않는다.
        maskGesture.previous = point;
      }
      scheduleMaskEditorRender();
    };
    maskEditorCanvas.addEventListener("pointermove", event => {
      if (maskGesture) return;
      maskPointerInside = editorPointerIsInside(event);
      maskPointerPoint = editorPoint(event, false);
      updateMaskCursor();
    });
    window.addEventListener("pointermove", moveActiveMaskGesture, true);
    window.addEventListener("pointerup", event => finish(event, false), true);
    window.addEventListener("pointercancel", event => finish(event, true), true);
    maskEditorCanvas.addEventListener("lostpointercapture", event => {
      if (maskGesture && event.pointerId === maskGesture.pointerId) finish(event, true);
    });
    window.addEventListener("blur", () => {
      if (!maskGesture) return;
      finish({ pointerId: maskGesture.pointerId, clientX: NaN, clientY: NaN }, true, true);
    });
    document.getElementById("sigMaskFile").addEventListener("change", async event => {
      const file = event.currentTarget.files?.[0];
      if (!file) return;
      try {
        const img = await imageFromFile(file);
        maskWorkingCanvas = fitImageToMaskCanvas(img);
        enforceMaskSafeArea();
        commitMaskHistory();
        renderMaskEditor();
      } catch (error) {
        document.getElementById("sigMaskTip").textContent = `불러오기 실패 · ${error.message || error}`;
      }
      event.currentTarget.value = "";
    });
    document.getElementById("sigMaskSave").addEventListener("click", () => {
      maskWorkingCanvas.toBlob(blob => blob && downloadBlob(blob, `sig-background-mask-${MASK_W}x${MASK_H}.png`), "image/png");
    });
    document.addEventListener("keydown", event => {
      const modal = document.getElementById("sigMaskStudio");
      if (!modal || modal.hidden) return;
      event.stopPropagation();
      const key = String(event.key || "").toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === "z") {
        event.preventDefault();
        if (event.shiftKey) maskRedo();
        else maskUndo();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && key === "y") {
        event.preventDefault();
        maskRedo();
        return;
      }
      if (key === "escape") {
        event.preventDefault();
        void closeMaskStudio(false);
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const tag = String(event.target?.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;
      if (key === "b" || key === "e" || key === "t" || key === "l") {
        event.preventDefault();
        setMaskTool(key === "b" ? "brush" : key === "e" ? "eraser" : key === "l" ? "lasso" : "topline");
      } else if (key === "[" || key === "]") {
        event.preventDefault();
        setMaskBrushSize(maskBrushSize() + (key === "]" ? (event.shiftKey ? 8 : 2) : (event.shiftKey ? -8 : -2)));
      }
    });
  }

  function traceBackgroundTop(c, bg) {
    const t = clamp(bg.top, 0, H - 28);
    const d = clamp(bg.curve, 3, 44);
    c.beginPath();
    switch (bg.mask) {
      case "canvas-full":
        c.moveTo(0, 0);
        c.lineTo(W, 0);
        break;
      case "rounded-cap":
      case "slope":
      case "ribbon-notch":
      case "brush":
        c.moveTo(0, t + d * .42);
        c.quadraticCurveTo(W * .06, t, W * .15, t);
        c.lineTo(W * .85, t);
        c.quadraticCurveTo(W * .94, t, W, t + d * .42);
        break;
      case "dome":
      case "dome-soft":
      case "wave":
      case "soft-wave":
      case "side-arc":
      case "angel-wing":
      case "wing-dip":
        {
          const apex = t - d * .65;
          const side = t + d * .75;
          c.moveTo(0, side);
          c.bezierCurveTo(0, t - d * .15, W * .2, apex, W * .5, apex);
          c.bezierCurveTo(W * .8, apex, W, t - d * .15, W, side);
        }
        break;
      case "dome-high":
      case "roulette-arc":
        c.moveTo(0, t + d * .65);
        c.quadraticCurveTo(W * .5, t - d * .92, W, t + d * .65);
        break;
      case "twin-dome":
      case "double-heart":
      case "bow-curve":
        c.moveTo(0, t + d * .55);
        c.bezierCurveTo(W * .06, t - d * .5, W * .34, t - d * .56, W * .5, t + d * .18);
        c.bezierCurveTo(W * .66, t - d * .56, W * .94, t - d * .5, W, t + d * .55);
        break;
      case "heart":
        c.moveTo(0, H);
        c.bezierCurveTo(0, H * .78, -d * .12, t + d * .92, W * .09, t + d * .58);
        c.bezierCurveTo(W * .1, t - d * .68, W * .36, t - d * .76, W * .5, t + d * .68);
        c.bezierCurveTo(W * .64, t - d * .76, W * .9, t - d * .68, W * .91, t + d * .58);
        c.bezierCurveTo(W + d * .12, t + d * .92, W, H * .78, W, H);
        break;
      case "cloud":
      case "cloud-soft":
      case "scallop":
      case "petal":
      case "triple-dome":
      case "soft-crown":
        c.moveTo(0, t + d * .38);
        c.bezierCurveTo(W * .06, t - d * .46, W * .2, t - d * .5, W * .3, t + d * .08);
        c.bezierCurveTo(W * .37, t - d * .58, W * .53, t - d * .6, W * .6, t + d * .06);
        c.bezierCurveTo(W * .68, t - d * .5, W * .92, t - d * .46, W, t + d * .38);
        break;
      case "canopy":
      case "lock-arch":
      case "halo-arch":
        c.moveTo(0, t + d * .55);
        c.bezierCurveTo(W * .07, t + d * .06, W * .13, t, W * .22, t);
        c.lineTo(W * .78, t);
        c.bezierCurveTo(W * .87, t, W * .93, t + d * .06, W, t + d * .55);
        break;
      case "offset-dome-left":
      case "heart-left":
        c.moveTo(0, t + d * .55);
        c.bezierCurveTo(W * .04, t - d * .55, W * .32, t - d * .72, W * .56, t - d * .06);
        c.bezierCurveTo(W * .73, t + d * .3, W * .9, t + d * .2, W, t + d * .32);
        break;
      case "offset-dome-right":
      case "heart-right":
        c.moveTo(0, t + d * .32);
        c.bezierCurveTo(W * .1, t + d * .2, W * .27, t + d * .3, W * .44, t - d * .06);
        c.bezierCurveTo(W * .68, t - d * .72, W * .96, t - d * .55, W, t + d * .55);
        break;
      case "full":
      case "band-straight":
      default:
        c.moveTo(0, t);
        c.lineTo(W, t);
        break;
    }
  }

  function backgroundPath(c, bg) {
    traceBackgroundTop(c, bg);
    c.lineTo(W, H);
    c.lineTo(0, H);
    c.closePath();
  }

  function drawImageCover(c, img, x, y, width, height, scale = 1, offsetX = 0, offsetY = 0) {
    if (!img || !img.naturalWidth) return;
    const cover = Math.max(width / img.naturalWidth, height / img.naturalHeight) * scale;
    const dw = img.naturalWidth * cover;
    const dh = img.naturalHeight * cover;
    c.drawImage(img, x + (width - dw) / 2 + offsetX, y + (height - dh) / 2 + offsetY, dw, dh);
  }

  function drawImageContainBottom(c, img, x = 0, y = 0, width = W, height = H, scale = 1, offsetX = 0, offsetY = 0) {
    if (!img || !(img.naturalWidth || img.width)) return;
    const imageWidth = img.naturalWidth || img.width;
    const imageHeight = img.naturalHeight || img.height;
    const contain = Math.min(width / imageWidth, height / imageHeight) * scale;
    const dw = imageWidth * contain;
    const dh = imageHeight * contain;
    c.drawImage(img, x + (width - dw) / 2 + offsetX, y + height - dh + offsetY, dw, dh);
  }

  function drawModernBlob(c, x, y, w, h, color, alpha = .2, rot = 0) {
    c.save();
    c.translate(x, y);
    c.rotate(rot * Math.PI / 180);
    c.beginPath();
    c.moveTo(-w * .5, -h * .04);
    c.bezierCurveTo(-w * .48, -h * .43, -w * .16, -h * .56, w * .16, -h * .46);
    c.bezierCurveTo(w * .48, -h * .37, w * .55, -h * .04, w * .43, h * .27);
    c.bezierCurveTo(w * .28, h * .55, -w * .18, h * .51, -w * .42, h * .3);
    c.bezierCurveTo(-w * .53, h * .2, -w * .55, h * .07, -w * .5, -h * .04);
    c.closePath();
    c.fillStyle = hexToRgba(color, alpha);
    c.fill();
    c.restore();
  }

  function drawModernSurface(c, bg) {
    const ink = mixHex(bg.primary, "#ffffff", .15);
    const soft = hexToRgba(ink, .13);
    const startY = Math.max(0, bg.top - bg.curve - 22);
    c.save();
    c.lineWidth = 1;

    if (bg.surface === "soft-grid" || bg.surface === "grid") {
      c.strokeStyle = bg.surface === "grid" ? hexToRgba(ink, .16) : soft;
      const step = bg.surface === "grid" ? 18 : 24;
      for (let x = -4; x <= W + 4; x += step) {
        c.beginPath();
        c.moveTo(x, startY);
        c.lineTo(x, H);
        c.stroke();
      }
      for (let y = startY; y <= H; y += step) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(W, y);
        c.stroke();
      }
    }

    if (bg.surface === "gingham") {
      c.fillStyle = hexToRgba(bg.primary, .075);
      for (let x = -8; x < W; x += 30) c.fillRect(x, startY, 12, H - startY);
      for (let y = startY; y < H; y += 30) c.fillRect(0, y, W, 12);
    }

    if (bg.surface === "stripe") {
      c.save();
      c.translate(-40, 0);
      c.rotate(-11 * Math.PI / 180);
      c.fillStyle = hexToRgba("#ffffff", .23);
      for (let x = -80; x < W + 120; x += 42) c.fillRect(x, startY - 60, 15, H + 100);
      c.restore();
    }

    if (bg.surface === "dots") {
      c.fillStyle = hexToRgba(bg.primary, .16);
      [[18, 116, 2], [39, 137, 1.5], [65, 109, 2.3], [96, 201, 1.8], [122, 126, 1.5],
        [177, 192, 2], [211, 116, 1.7], [244, 202, 2.2], [274, 145, 1.6], [153, 226, 1.5]]
        .forEach(([x, y, r]) => {
          c.beginPath();
          c.arc(x, y, r, 0, Math.PI * 2);
          c.fill();
        });
    }

    if (bg.surface === "bubbles") {
      c.strokeStyle = hexToRgba(bg.primary, .19);
      [[24, 130, 10], [54, 198, 5], [107, 114, 4], [198, 205, 8], [252, 132, 13], [278, 220, 5]]
        .forEach(([x, y, r]) => {
          c.beginPath();
          c.arc(x, y, r, 0, Math.PI * 2);
          c.stroke();
        });
    }

    if (bg.surface === "confetti") {
      c.strokeStyle = hexToRgba(bg.primary, .28);
      c.lineWidth = 2;
      [[18, 121, 6, -3], [55, 204, -5, -4], [104, 112, 4, 5], [185, 215, -4, 5], [231, 125, 5, -4], [275, 191, -5, -3]]
        .forEach(([x, y, dx, dy]) => {
          c.beginPath();
          c.moveTo(x, y);
          c.lineTo(x + dx, y + dy);
          c.stroke();
        });
    }
    c.restore();
  }

  function drawModernTexture(c, bg) {
    const ink = mixHex(bg.primary, "#4a4052", .14);
    const variant = bg.variant || 0;
    c.save();
    c.lineCap = "round";
    c.lineJoin = "round";

    c.strokeStyle = hexToRgba("#ffffff", .25);
    c.lineWidth = 18;
    c.beginPath();
    c.moveTo(-18, 214);
    c.bezierCurveTo(28, 184, 62, 205, 101, 181);
    c.stroke();

    c.strokeStyle = hexToRgba(bg.primary, .1);
    c.lineWidth = 13;
    c.beginPath();
    c.moveTo(194, 226);
    c.bezierCurveTo(226, 195, 261, 219, 311, 184);
    c.stroke();

    c.setLineDash([2, 6]);
    c.strokeStyle = hexToRgba(ink, .27);
    c.lineWidth = 1.7;
    c.beginPath();
    c.moveTo(8, 124 + (variant % 3) * 4);
    c.bezierCurveTo(45, 105, 68, 152, 102, 128);
    c.stroke();
    c.beginPath();
    c.moveTo(198, 205 - (variant % 2) * 5);
    c.bezierCurveTo(230, 181, 257, 224, 292, 194);
    c.stroke();
    c.setLineDash([]);

    c.fillStyle = hexToRgba(bg.primary, .19);
    for (let i = 0; i < 34; i++) {
      const side = i % 2 === 0;
      const x = side ? 7 + ((i * 29 + variant * 7) % 92) : 194 + ((i * 31 + variant * 5) % 94);
      const y = 108 + ((i * 37 + variant * 11) % 127);
      const r = 0.6 + (i % 3) * .42;
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2);
      c.fill();
    }

    drawSpark(c, 112, 211, 5, hexToRgba("#ffffff", .72), 1.6);
    drawHeart(c, 182, 119, 5, hexToRgba(ink, .38), 1.5);
    if (variant % 2 === 0) drawSpark(c, 282, 116, 4, hexToRgba(ink, .42), 1.4);
    else drawHeart(c, 18, 222, 4.5, hexToRgba("#ffffff", .7), 1.4);
    c.restore();
  }

  function drawModernMotif(c, bg) {
    const ink = mixHex(bg.primary, "#4a4052", .16);
    const white = hexToRgba("#ffffff", .88);
    c.save();
    c.lineCap = "round";
    c.lineJoin = "round";

    if (bg.motif === "cherry") {
      c.strokeStyle = white;
      c.lineWidth = 3;
      [[37, 151, 15], [64, 161, 13]].forEach(([x, y, r]) => {
        c.beginPath();
        c.arc(x, y, r, 0, Math.PI * 2);
        c.stroke();
      });
      c.beginPath();
      c.moveTo(38, 136);
      c.quadraticCurveTo(50, 112, 57, 136);
      c.moveTo(64, 148);
      c.quadraticCurveTo(62, 125, 55, 122);
      c.strokeStyle = hexToRgba(ink, .72);
      c.lineWidth = 2.2;
      c.stroke();
      c.beginPath();
      c.ellipse(60, 119, 9, 4, -.45, 0, Math.PI * 2);
      c.fillStyle = hexToRgba(ink, .28);
      c.fill();
    }

    if (bg.motif === "cloud") {
      c.beginPath();
      c.moveTo(211, 155);
      c.bezierCurveTo(207, 141, 220, 130, 233, 136);
      c.bezierCurveTo(240, 119, 265, 122, 270, 140);
      c.bezierCurveTo(287, 139, 291, 158, 279, 166);
      c.quadraticCurveTo(244, 174, 211, 165);
      c.closePath();
      c.fillStyle = hexToRgba("#ffffff", .34);
      c.fill();
      c.strokeStyle = white;
      c.lineWidth = 2.5;
      c.stroke();
      drawSpark(c, 201, 115, 7, white, 2);
      drawSpark(c, 279, 198, 5, white, 1.7);
    }

    if (bg.motif === "heart") {
      drawHeart(c, 247, 151, 27, white, 3.2);
      drawHeart(c, 271, 201, 10, hexToRgba(ink, .58), 2.2);
      drawHeart(c, 220, 119, 7, hexToRgba(ink, .5), 1.8);
    }

    if (bg.motif === "ribbon") {
      drawBow(c, 251, 150, 25, white, 3);
      c.beginPath();
      c.moveTo(244, 161);
      c.quadraticCurveTo(234, 184, 228, 202);
      c.moveTo(258, 161);
      c.quadraticCurveTo(269, 184, 276, 199);
      c.strokeStyle = hexToRgba(ink, .54);
      c.lineWidth = 2;
      c.stroke();
    }

    if (bg.motif === "pearls") {
      c.strokeStyle = white;
      c.lineWidth = 2;
      c.beginPath();
      c.arc(246, 157, 42, Math.PI * .7, Math.PI * 1.8);
      c.stroke();
      for (let i = 0; i < 8; i++) {
        const angle = Math.PI * (.72 + i * .15);
        c.beginPath();
        c.arc(246 + Math.cos(angle) * 42, 157 + Math.sin(angle) * 42, 2.6, 0, Math.PI * 2);
        c.fillStyle = i % 2 ? white : hexToRgba(ink, .45);
        c.fill();
      }
      drawSpark(c, 274, 128, 6, white, 1.8);
    }

    if (bg.motif === "clover") {
      drawFlower(c, 43, 151, 20, white, 3);
      drawFlower(c, 75, 202, 9, hexToRgba(ink, .55), 2);
      drawHeart(c, 25, 204, 7, hexToRgba(ink, .5), 1.7);
    }

    if (bg.motif === "stars") {
      drawSpark(c, 43, 145, 18, white, 3);
      drawSpark(c, 74, 198, 8, hexToRgba(ink, .55), 2);
      drawSpark(c, 266, 136, 10, white, 2.2);
      drawHeart(c, 247, 207, 6, hexToRgba(ink, .5), 1.7);
    }

    if (bg.motif === "waves") {
      c.strokeStyle = white;
      c.lineWidth = 2.6;
      for (let i = 0; i < 3; i++) {
        c.beginPath();
        c.moveTo(205, 140 + i * 17);
        c.bezierCurveTo(220, 128 + i * 17, 234, 152 + i * 17, 249, 140 + i * 17);
        c.bezierCurveTo(264, 128 + i * 17, 278, 152 + i * 17, 293, 140 + i * 17);
        c.stroke();
      }
      drawSpark(c, 193, 204, 6, hexToRgba(ink, .55), 1.8);
    }

    if (bg.motif === "halo") {
      c.strokeStyle = white;
      c.lineWidth = 3;
      c.beginPath();
      c.ellipse(245, 130, 31, 10, 0, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.moveTo(220, 165);
      c.bezierCurveTo(198, 145, 184, 158, 192, 184);
      c.bezierCurveTo(203, 174, 212, 174, 220, 165);
      c.moveTo(270, 165);
      c.bezierCurveTo(292, 145, 306, 158, 298, 184);
      c.bezierCurveTo(287, 174, 278, 174, 270, 165);
      c.strokeStyle = hexToRgba(ink, .48);
      c.lineWidth = 2;
      c.stroke();
    }

    if (bg.motif === "loops") {
      c.strokeStyle = white;
      c.lineWidth = 2.6;
      [[38, 150, 25, 17], [63, 174, 28, 20], [266, 133, 20, 14]].forEach(([x, y, rx, ry]) => {
        c.beginPath();
        c.ellipse(x, y, rx, ry, -.2, 0, Math.PI * 2);
        c.stroke();
      });
      c.beginPath();
      c.moveTo(221, 204);
      c.bezierCurveTo(229, 188, 239, 216, 247, 198);
      c.bezierCurveTo(255, 181, 264, 208, 274, 190);
      c.strokeStyle = hexToRgba(ink, .52);
      c.lineWidth = 2;
      c.stroke();
    }

    if (bg.motif === "flowers") {
      drawFlower(c, 247, 151, 20, white, 3);
      drawFlower(c, 274, 198, 9, hexToRgba(ink, .55), 2);
      drawFlower(c, 218, 115, 7, hexToRgba(ink, .46), 1.7);
    }

    if (bg.motif === "heart-lock") {
      drawHeart(c, 249, 144, 25, white, 3);
      c.strokeStyle = hexToRgba(ink, .56);
      c.lineWidth = 2.2;
      c.beginPath();
      c.roundRect(234, 165, 30, 25, 7);
      c.stroke();
      c.beginPath();
      c.arc(249, 165, 11, Math.PI, 0);
      c.stroke();
      c.beginPath();
      c.arc(249, 176, 2.5, 0, Math.PI * 2);
      c.fillStyle = hexToRgba(ink, .56);
      c.fill();
    }
    c.restore();
  }

  function drawModernBackdrop(c, bg) {
    drawModernSurface(c, bg);
    drawModernTexture(c, bg);
    const variant = bg.variant || 0;
    const variantX = (variant % 3 - 1) * 5;
    const variantY = (Math.floor(variant / 3) % 3 - 1) * 3;
    c.save();
    c.translate(W / 2 + (bg.offsetX || 0) + variantX, H / 2 + (bg.offsetY || 0) + variantY);
    c.scale(bg.imageScale || 1, bg.imageScale || 1);
    c.translate(-W / 2, -H / 2);
    drawModernBlob(c, 20, 165, 120, 118, bg.primary, .23, -8);
    drawModernBlob(c, 279, 190, 116, 132, "#ffffff", .4, 10);
    drawModernBlob(c, 152, 242, 180, 54, bg.primary, .13, 0);
    drawModernBlob(c, 142, 122, 112, 48, "#ffffff", .16, -4);
    drawModernMotif(c, bg);
    c.restore();
  }

  function drawBackgroundPaint(c, bg) {
    if (bg.maskPaintMode === "original") {
      // 위플랩은 고해상도 작업면에 원본을 직접 재렌더한다. 293×248 중간 캔버스를
      // 먼저 확대하면 마스크만 2×여도 배경판 그림의 세부가 이미 손실된다.
      if (bg.customImg && (bg.customImg.naturalWidth || bg.customImg.width)) {
        drawImageContainBottom(c, bg.customImg, 0, 0, W, H);
        return;
      }
      // 구형 프로젝트처럼 원본 이미지가 없는 경우에만 저장된 논리 캔버스로 폴백한다.
      if (bg.customSourceCanvas) {
        c.drawImage(bg.customSourceCanvas, 0, 0, W, H);
        return;
      }
    }
    if (bg.maskPaintMode === "solid" || bg.maskPaintMode === "recolor") {
      c.fillStyle = bg.maskFillColor || bg.secondary;
      c.fillRect(0, 0, W, H);
      if (bg.pattern && bg.pattern !== "none") drawPattern(c, bg.pattern, bg.maskStrokeColor || bg.primary, bg.maskFillColor || bg.secondary, bg.top);
      return;
    }
    const paintBg = bg.texture === "custom" && bg.customBackup
      ? Object.assign({}, bg, bg.customBackup, { maskPaintMode: "theme" })
      : bg;
    const grad = c.createLinearGradient(0, bg.top, W, H);
    grad.addColorStop(0, paintBg.secondary);
    grad.addColorStop(1, paintBg.modern ? mixHex(paintBg.primary, paintBg.secondary, .44) : paintBg.primary);
    c.fillStyle = grad;
    c.fillRect(0, Math.max(0, bg.top - bg.curve - 8), W, H);

    const customImg = paintBg.texture === "custom" ? paintBg.customImg : null;
    if (customImg && customImg.naturalWidth) {
      c.filter = `hue-rotate(${paintBg.hue || 0}deg) saturate(${paintBg.saturation == null ? 100 : paintBg.saturation}%) brightness(${paintBg.brightness == null ? 100 : paintBg.brightness}%)`;
      const imageY = bg.mask === "canvas-full" ? 0 : Math.max(0, bg.top - bg.curve - 20);
      drawImageCover(c, customImg, 0, imageY, W, H - imageY, paintBg.imageScale, paintBg.offsetX, paintBg.offsetY);
      c.filter = "none";
    } else if (paintBg.modern) {
      const img = images[paintBg.texture];
      if (img) {
        c.filter = `hue-rotate(${paintBg.hue}deg) saturate(${paintBg.saturation}%) brightness(${paintBg.brightness}%)`;
        if (bg.mask === "canvas-full") {
          drawImageCover(c, img, 0, 0, W, H, paintBg.imageScale, paintBg.offsetX, paintBg.offsetY);
        } else {
          drawImageCover(c, img, 0, H - CONTENT_H, W, CONTENT_H, paintBg.imageScale, paintBg.offsetX, paintBg.offsetY);
        }
        c.filter = "none";
      } else {
        drawModernBackdrop(c, paintBg);
      }
    } else {
      const img = images[paintBg.texture];
      if (img) {
        c.filter = `hue-rotate(${paintBg.hue}deg) saturate(${paintBg.saturation}%) brightness(${paintBg.brightness}%)`;
        const imageY = bg.top - bg.curve - 20;
        const imageHeight = H - bg.top + bg.curve + 20;
        if (String(paintBg.texture).startsWith("cat")) {
          drawImageContainBottom(c, img, 0, imageY, W, imageHeight, paintBg.imageScale, paintBg.offsetX, paintBg.offsetY);
        } else {
          drawImageCover(c, img, 0, imageY, W, imageHeight, paintBg.imageScale, paintBg.offsetX, paintBg.offsetY);
        }
        c.filter = "none";
      }
    }

    if (paintBg.tintOpacity > 0) {
      const tint = c.createLinearGradient(0, bg.top, W, H);
      tint.addColorStop(0, hexToRgba(paintBg.secondary, paintBg.tintOpacity / 100));
      tint.addColorStop(1, hexToRgba(paintBg.primary, paintBg.tintOpacity / 100));
      c.fillStyle = tint;
      c.fillRect(0, 0, W, H);
    }

    if (!paintBg.modern) drawPattern(c, paintBg.pattern, paintBg.primary, paintBg.secondary, paintBg.top);
  }

  function drawBackground(c, bg, includeOutline = true) {
    if (isAlphaMask(bg)) {
      const mask = bg.maskCanvas;
      c.save();
      c.beginPath();
      c.rect(0, 84, W, H - 84);
      c.clip();
      if (includeOutline && bg.maskStrokeWidth > 0) {
        if (bg.maskDoubleOutline && bg.maskOuterWidth > 0) {
          drawExpandedMask(c, mask, bg.maskOuterColor, bg.maskStrokeWidth + bg.maskOuterWidth);
        }
        drawExpandedMask(c, mask, bg.maskStrokeColor, bg.maskStrokeWidth);
      }
      const paint = createMaskCanvas();
      const paintCtx = paint.getContext("2d", { alpha: true });
      withMaskLogicalTransform(paintCtx, logicalCtx => drawBackgroundPaint(logicalCtx, bg));
      paintCtx.globalCompositeOperation = "destination-in";
      paintCtx.drawImage(mask, 0, 0, mask.width, mask.height, 0, 0, MASK_W, MASK_H);
      paintCtx.globalCompositeOperation = "source-over";
      drawMaskLogical(c, paint);
      c.restore();
      return;
    }
    c.save();
    c.beginPath();
    c.rect(0, 84, W, H - 84);
    c.clip();
    c.save();
    backgroundPath(c, bg);
    c.clip();
    drawBackgroundPaint(c, bg);
    c.restore();

    if (includeOutline) {
      traceBackgroundTop(c, bg);
      c.strokeStyle = hexToRgba(bg.primary, .62);
      c.lineWidth = 2;
      c.stroke();
    }
    c.restore();
  }

  function drawHeart(c, x, y, size, color, width = 2) {
    c.save();
    c.translate(x, y);
    c.beginPath();
    c.moveTo(0, size * .35);
    c.bezierCurveTo(-size * .95, -size * .22, -size * .5, -size, 0, -size * .42);
    c.bezierCurveTo(size * .5, -size, size * .95, -size * .22, 0, size * .35);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.stroke();
    c.restore();
  }

  function drawSpark(c, x, y, size, color, width = 2) {
    c.save();
    c.translate(x, y);
    c.beginPath();
    c.moveTo(0, -size);
    c.quadraticCurveTo(size * .15, -size * .15, size, 0);
    c.quadraticCurveTo(size * .15, size * .15, 0, size);
    c.quadraticCurveTo(-size * .15, size * .15, -size, 0);
    c.quadraticCurveTo(-size * .15, -size * .15, 0, -size);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.lineJoin = "round";
    c.stroke();
    c.restore();
  }

  function drawFlower(c, x, y, size, color, width = 2) {
    c.save();
    c.translate(x, y);
    c.strokeStyle = color;
    c.lineWidth = width;
    for (let i = 0; i < 5; i++) {
      c.save();
      c.rotate((Math.PI * 2 * i) / 5);
      c.beginPath();
      c.ellipse(0, -size * .56, size * .25, size * .46, 0, 0, Math.PI * 2);
      c.stroke();
      c.restore();
    }
    c.beginPath();
    c.arc(0, 0, size * .17, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }

  function drawBow(c, x, y, size, color, width = 2) {
    c.save();
    c.translate(x, y);
    c.strokeStyle = color;
    c.lineWidth = width;
    c.lineJoin = "round";
    c.beginPath();
    c.moveTo(-size * .08, 0);
    c.bezierCurveTo(-size * .95, -size * .75, -size, size * .55, -size * .12, size * .12);
    c.bezierCurveTo(size, size * .55, size * .95, -size * .75, size * .08, 0);
    c.stroke();
    c.beginPath();
    c.arc(0, 0, size * .16, 0, Math.PI * 2);
    c.stroke();
    c.restore();
  }

  function drawPattern(c, type, primary, secondary, top) {
    if (!type || type === "none") return;
    const ink = hexToRgba(mixHex(primary, "#ffffff", .2), .62);
    const ink2 = hexToRgba(mixHex(secondary, "#ffffff", .05), .75);
    const pts = [
      [21, top + 32, 7, -.2], [56, top + 67, 5, .4], [102, top + 24, 6, .2],
      [145, top + 51, 5, -.4], [193, top + 24, 7, .3], [237, top + 64, 6, -.2],
      [275, top + 30, 5, .5], [32, H - 25, 5, -.2], [121, H - 20, 6, .2],
      [186, H - 31, 4, -.5], [269, H - 18, 6, .2]
    ];
    c.save();
    c.lineCap = "round";
    c.lineJoin = "round";
    pts.forEach(([x, y, size, rot], i) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.translate(-x, -y);
      if (type === "hearts") drawHeart(c, x, y, size, i % 2 ? ink2 : ink, 1.4);
      if (type === "stars") drawSpark(c, x, y, size, i % 2 ? ink2 : ink, 1.4);
      if (type === "flowers") drawFlower(c, x, y, size, i % 2 ? ink2 : ink, 1.4);
      if (type === "bows") drawBow(c, x, y, size, i % 2 ? ink2 : ink, 1.4);
      if (type === "lightning") {
        c.beginPath();
        c.moveTo(x - size * .5, y - size);
        c.lineTo(x + size * .2, y - size * .15);
        c.lineTo(x - size * .1, y - size * .1);
        c.lineTo(x + size * .5, y + size);
        c.strokeStyle = i % 2 ? ink2 : ink;
        c.lineWidth = 1.6;
        c.stroke();
      }
      if (type === "bubbles") {
        c.beginPath();
        c.arc(x, y, size * .62, 0, Math.PI * 2);
        c.strokeStyle = i % 2 ? ink2 : ink;
        c.lineWidth = 1.4;
        c.stroke();
        c.beginPath();
        c.arc(x + size, y - size * .6, size * .18, 0, Math.PI * 2);
        c.fillStyle = i % 2 ? ink2 : ink;
        c.fill();
      }
      if (type === "checker") {
        c.fillStyle = i % 2 ? ink2 : ink;
        c.globalAlpha = .42;
        c.fillRect(x - size, y - size, size * 1.5, size * 1.5);
        c.globalAlpha = 1;
      }
      c.restore();
    });
    c.restore();
  }

  function setPropTransform(c, prop) {
    c.translate(prop.x, prop.y);
    c.rotate((prop.rot || 0) * Math.PI / 180);
    c.scale(prop.scale || 1, prop.scale || 1);
    c.globalAlpha = prop.opacity == null ? .92 : prop.opacity;
    c.lineCap = "round";
    c.lineJoin = "round";
  }

  function drawProp(c, prop) {
    c.save();
    setPropTransform(c, prop);
    const line = prop.color1 || state.background.primary;
    const fill = prop.color2 || state.background.secondary;
    const raster = propImages[prop.type];
    if (raster && raster.naturalWidth) {
      c.filter = `hue-rotate(${prop.hue || 0}deg) saturate(${prop.saturation == null ? 100 : prop.saturation}%) brightness(${prop.brightness == null ? 100 : prop.brightness}%)`;
      const fit = Math.min(140 / raster.naturalWidth, 140 / raster.naturalHeight);
      const rasterWidth = raster.naturalWidth * fit;
      const rasterHeight = raster.naturalHeight * fit;
      c.drawImage(raster, -rasterWidth / 2, -rasterHeight / 2, rasterWidth, rasterHeight);
      c.restore();
      return;
    }
    switch (prop.type) {
      case "ring":
        c.beginPath();
        c.arc(0, 0, 56, 0, Math.PI * 2);
        c.strokeStyle = line;
        c.lineWidth = 3;
        c.stroke();
        c.setLineDash([2, 5]);
        c.beginPath();
        c.arc(0, 0, 49, 0, Math.PI * 2);
        c.strokeStyle = hexToRgba(line, .72);
        c.lineWidth = 1.4;
        c.stroke();
        break;
      case "double-ring":
        c.fillStyle = hexToRgba(fill, .45);
        c.beginPath();
        c.arc(0, 0, 59, 0, Math.PI * 2);
        c.fill();
        [59, 51].forEach((r, i) => {
          c.beginPath();
          c.arc(0, 0, r, 0, Math.PI * 2);
          c.strokeStyle = i ? "#ffffff" : line;
          c.lineWidth = i ? 2 : 3;
          c.stroke();
        });
        break;
      case "roulette": {
        const r = 57;
        for (let i = 0; i < 10; i++) {
          c.beginPath();
          c.moveTo(0, 0);
          c.arc(0, 0, r, (Math.PI * 2 * i) / 10, (Math.PI * 2 * (i + 1)) / 10);
          c.closePath();
          c.fillStyle = i % 2 ? hexToRgba(fill, .68) : hexToRgba("#ffffff", .6);
          c.fill();
          c.strokeStyle = line;
          c.lineWidth = 1.5;
          c.stroke();
        }
        c.beginPath();
        c.arc(0, 0, r, 0, Math.PI * 2);
        c.strokeStyle = line;
        c.lineWidth = 4;
        c.stroke();
        c.beginPath();
        c.arc(0, 0, 9, 0, Math.PI * 2);
        c.fillStyle = line;
        c.fill();
        c.beginPath();
        c.moveTo(0, -r - 7);
        c.lineTo(-6, -r + 4);
        c.lineTo(6, -r + 4);
        c.closePath();
        c.fill();
        break;
      }
      case "twin-circles":
        [-43, 43].forEach(dx => {
          c.beginPath();
          c.arc(dx, 0, 54, 0, Math.PI * 2);
          c.fillStyle = hexToRgba(fill, .34);
          c.fill();
          c.strokeStyle = line;
          c.lineWidth = 3;
          c.stroke();
        });
        break;
      case "wings":
        c.fillStyle = hexToRgba(fill, .7);
        c.strokeStyle = line;
        c.lineWidth = 2.4;
        [-1, 1].forEach(side => {
          c.save();
          c.scale(side, 1);
          c.beginPath();
          c.moveTo(28, 20);
          c.bezierCurveTo(66, -31, 109, -27, 124, -8);
          c.bezierCurveTo(105, -7, 96, 2, 88, 10);
          c.bezierCurveTo(104, 8, 109, 18, 106, 28);
          c.bezierCurveTo(89, 20, 76, 29, 65, 37);
          c.bezierCurveTo(70, 37, 76, 44, 72, 51);
          c.bezierCurveTo(49, 43, 37, 36, 28, 20);
          c.closePath();
          c.fill();
          c.stroke();
          for (let i = 0; i < 3; i++) {
            c.beginPath();
            c.moveTo(42, 19 + i * 8);
            c.quadraticCurveTo(70 + i * 8, 2 + i * 4, 99, -3 + i * 12);
            c.strokeStyle = hexToRgba(line, .52);
            c.lineWidth = 1.2;
            c.stroke();
          }
          c.restore();
        });
        break;
      case "heart-cluster":
        drawHeart(c, 0, 0, 22, line, 4);
        drawHeart(c, -29, 18, 11, line, 2.5);
        drawHeart(c, 31, -17, 9, line, 2.2);
        drawSpark(c, 30, 23, 7, line, 2);
        break;
      case "flowers":
        drawFlower(c, 0, 0, 18, line, 3);
        drawFlower(c, -29, 20, 10, line, 2);
        drawFlower(c, 31, 18, 12, line, 2);
        drawSpark(c, 30, -21, 6, line, 2);
        break;
      case "sparkles":
        drawSpark(c, 0, 0, 19, line, 3);
        drawSpark(c, -25, 20, 8, line, 2);
        drawSpark(c, 29, 16, 11, line, 2.2);
        drawHeart(c, 25, -23, 8, line, 2);
        break;
      case "bow":
        drawBow(c, 0, 0, 28, line, 3);
        c.beginPath();
        c.moveTo(-5, 8);
        c.lineTo(-13, 42);
        c.moveTo(5, 8);
        c.lineTo(15, 42);
        c.strokeStyle = line;
        c.lineWidth = 2.6;
        c.stroke();
        break;
      case "bubble":
        c.fillStyle = hexToRgba(fill, .44);
        c.strokeStyle = line;
        c.lineWidth = 2.5;
        c.beginPath();
        c.moveTo(-61, 21);
        c.bezierCurveTo(-72, -2, -50, -22, -31, -14);
        c.bezierCurveTo(-18, -44, 22, -44, 34, -13);
        c.bezierCurveTo(57, -23, 75, -4, 63, 22);
        c.quadraticCurveTo(0, 38, -61, 21);
        c.closePath();
        c.fill();
        c.stroke();
        break;
      case "rays":
        c.strokeStyle = line;
        c.lineWidth = 4;
        for (let i = 0; i < 14; i++) {
          const a = (Math.PI * 2 * i) / 14;
          const r1 = i % 2 ? 18 : 28;
          const r2 = i % 2 ? 50 : 60;
          c.beginPath();
          c.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
          c.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
          c.stroke();
        }
        break;
      case "wheel":
        c.beginPath();
        c.arc(0, 0, 53, 0, Math.PI * 2);
        c.strokeStyle = line;
        c.lineWidth = 4;
        c.stroke();
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI * 2 * i) / 8;
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(Math.cos(a) * 53, Math.sin(a) * 53);
          c.strokeStyle = line;
          c.lineWidth = 2;
          c.stroke();
        }
        c.beginPath();
        c.arc(0, 0, 8, 0, Math.PI * 2);
        c.fillStyle = fill;
        c.fill();
        c.strokeStyle = line;
        c.stroke();
        break;
    }
    c.restore();
  }

  function characterBounds() {
    const char = state.character;
    if (!char.img) return { x: char.x - 55 * char.scale, y: char.y - 100 * char.scale, w: 110 * char.scale, h: 200 * char.scale };
    const ratio = char.img.naturalWidth / char.img.naturalHeight;
    const h = 200 * char.scale;
    return { x: char.x - (h * ratio) / 2, y: char.y - h / 2, w: h * ratio, h };
  }

  function drawCharacter(c, preview) {
    const char = state.character;
    const bounds = characterBounds();
    if (!char.img) return;
    c.save();
    c.globalAlpha = char.opacity;
    c.translate(char.x, char.y);
    c.rotate(char.rot * Math.PI / 180);
    c.scale(char.flip ? -1 : 1, 1);
    c.filter = "drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white) drop-shadow(0 2px 0 white) drop-shadow(0 -2px 0 white)";
    c.drawImage(char.img, -bounds.w / 2, -bounds.h / 2, bounds.w, bounds.h);
    c.restore();
  }

  function drawOutlinedText(c, text, layer, numberStyle = false) {
    if (!text || !layer.enabled && numberStyle) return;
    const lines = String(text).split(/\\n|\n/);
    c.save();
    c.translate(layer.x, layer.y);
    c.rotate(numberStyle ? 0 : (layer.rot || 0) * Math.PI / 180);
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.lineJoin = "round";
    c.lineCap = "round";
    c.font = `${layer.size}px ${numberStyle ? '"SigJua","Arial Rounded MT Bold",sans-serif' : phraseFontFamily(layer)}`;
    const lineH = layer.size * (numberStyle ? .83 : phraseLineHeight(layer));
    const startY = -((lines.length - 1) * lineH) / 2;
    lines.forEach((line, i) => {
      const y = startY + i * lineH;
      if (numberStyle) {
        c.strokeStyle = "#111111";
        c.lineWidth = 10;
        c.strokeText(line, 0, y);
        c.strokeStyle = "#ffffff";
        c.lineWidth = 6;
        c.strokeText(line, 0, y);
        c.fillStyle = "#ff0000";
        c.fillText(line, 0, y);
      } else {
        if (layer.outerStrokeEnabled !== false) {
          c.shadowColor = layer.shadow || "rgba(0,0,0,.28)";
          c.shadowBlur = 0;
          c.shadowOffsetX = Math.max(1, layer.size * .055);
          c.shadowOffsetY = Math.max(1, layer.size * .07);
          c.strokeStyle = layer.shadow || "#6b3451";
          c.lineWidth = phraseStrokeWidth(layer, "outerStrokeWidth", .2);
          if (c.lineWidth > 0) c.strokeText(line, 0, y);
        }
        c.shadowColor = "transparent";
        c.shadowOffsetX = 0;
        c.shadowOffsetY = 0;
        if (layer.middleStrokeEnabled !== false) {
          c.strokeStyle = layer.middleStroke || "#ffffff";
          c.lineWidth = phraseStrokeWidth(layer, "middleStrokeWidth", .14);
          if (c.lineWidth > 0) c.strokeText(line, 0, y);
        }
        if (layer.innerStrokeEnabled !== false) {
          c.strokeStyle = layer.stroke || "#ff628e";
          c.lineWidth = phraseStrokeWidth(layer, "innerStrokeWidth", .075);
          if (c.lineWidth > 0) c.strokeText(line, 0, y);
        }
        c.fillStyle = layer.fill || "#ffffff";
        c.fillText(line, 0, y);
      }
    });
    c.restore();
  }

  function layerTarget(ref = state.selected) {
    if (!ref) return null;
    if (ref.kind === "prop") return state.props[ref.index] || null;
    return state[ref.kind] || null;
  }

  function layerLocked(ref = state.selected) {
    return !!layerTarget(ref)?.locked;
  }

  function layerVisible(ref) {
    const target = layerTarget(ref);
    if (!target) return false;
    if (ref.kind === "character") return !!target.img;
    if (ref.kind === "phrase") return !!String(target.text || "").trim();
    if (ref.kind === "num1" || ref.kind === "num2") return !!target.enabled && !!String(target.text || "").trim();
    return ref.kind === "prop";
  }

  function sameLayerRef(a, b) {
    return !!a && !!b && a.kind === b.kind && (a.kind !== "prop" || a.index === b.index);
  }

  function layerRefsFrontToBack() {
    const refs = [{ kind: "num2", index: -1 }, { kind: "num1", index: -1 }];
    for (let index = state.props.length - 1; index >= 0; index--) if (state.props[index].front) refs.push({ kind: "prop", index });
    refs.push({ kind: "phrase", index: -1 }, { kind: "character", index: -1 });
    for (let index = state.props.length - 1; index >= 0; index--) if (!state.props[index].front) refs.push({ kind: "prop", index });
    return refs;
  }

  function ensureLayerHitSurface() {
    if (!layerHitCanvas) {
      layerHitCanvas = document.createElement("canvas");
      layerHitCanvas.width = W;
      layerHitCanvas.height = H;
      layerHitCtx = layerHitCanvas.getContext("2d", { alpha: true, willReadFrequently: true });
    }
    return layerHitCtx;
  }

  function renderLayerForHit(ref) {
    const hitCtx = ensureLayerHitSurface();
    hitCtx.setTransform(1, 0, 0, 1, 0, 0);
    hitCtx.globalAlpha = 1;
    hitCtx.filter = "none";
    hitCtx.clearRect(0, 0, W, H);
    if (!layerVisible(ref)) return hitCtx;
    if (ref.kind === "character") drawCharacter(hitCtx, false);
    else if (ref.kind === "phrase") drawOutlinedText(hitCtx, state.phrase.text, Object.assign({ enabled: true }, state.phrase), false);
    else if (ref.kind === "num1" || ref.kind === "num2") drawOutlinedText(hitCtx, state[ref.kind].text, state[ref.kind], true);
    else if (ref.kind === "prop") drawProp(hitCtx, state.props[ref.index]);
    return hitCtx;
  }

  function layerPixelHit(ref, point) {
    if (!layerVisible(ref) || layerLocked(ref) || point.x < 0 || point.x >= W || point.y < 0 || point.y >= H) return false;
    const hitCtx = renderLayerForHit(ref);
    const x = Math.max(0, Math.floor(point.x) - 1);
    const y = Math.max(0, Math.floor(point.y) - 1);
    const width = Math.min(3, W - x);
    const height = Math.min(3, H - y);
    const pixels = hitCtx.getImageData(x, y, width, height).data;
    for (let index = 3; index < pixels.length; index += 4) if (pixels[index] >= 8) return true;
    return false;
  }

  function pickLayerAt(point) {
    return layerRefsFrontToBack().find(ref => layerPixelHit(ref, point)) || null;
  }

  function imageAlphaBounds(img) {
    const full = { left: 0, top: 0, right: 1, bottom: 1 };
    if (!img || !img.naturalWidth || !img.naturalHeight) return full;
    const cached = imageAlphaBoundsCache.get(img);
    if (cached) return cached;
    try {
      const limit = 384;
      const scale = Math.min(1, limit / Math.max(img.naturalWidth, img.naturalHeight));
      const width = Math.max(1, Math.round(img.naturalWidth * scale));
      const height = Math.max(1, Math.round(img.naturalHeight * scale));
      const scan = document.createElement("canvas");
      scan.width = width;
      scan.height = height;
      const scanCtx = scan.getContext("2d", { alpha: true, willReadFrequently: true });
      scanCtx.clearRect(0, 0, width, height);
      scanCtx.drawImage(img, 0, 0, width, height);
      const pixels = scanCtx.getImageData(0, 0, width, height).data;
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (pixels[(y * width + x) * 4 + 3] < 8) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
      const bounds = maxX < minX ? full : {
        left: minX / width,
        top: minY / height,
        right: (maxX + 1) / width,
        bottom: (maxY + 1) / height
      };
      imageAlphaBoundsCache.set(img, bounds);
      return bounds;
    } catch (_) {
      // 읽기 제한이 걸린 외부 이미지도 편집 자체는 계속 가능하게 전체 영역으로 대체한다.
      imageAlphaBoundsCache.set(img, full);
      return full;
    }
  }

  function frameFromLocalBounds(ref, target, bounds, rotation = target.rot || 0) {
    const left = Math.min(bounds.left, bounds.right);
    const right = Math.max(bounds.left, bounds.right);
    const top = Math.min(bounds.top, bounds.bottom);
    const bottom = Math.max(bounds.top, bounds.bottom);
    const localX = (left + right) / 2;
    const localY = (top + bottom) / 2;
    const angle = rotation * Math.PI / 180;
    return {
      ref,
      target,
      cx: target.x + localX * Math.cos(angle) - localY * Math.sin(angle),
      cy: target.y + localX * Math.sin(angle) + localY * Math.cos(angle),
      width: Math.max(12, right - left),
      height: Math.max(12, bottom - top),
      rotation
    };
  }

  function vectorPropLocalBounds(type) {
    const bounds = {
      ring: [-61, -61, 61, 61],
      "double-ring": [-62, -62, 62, 62],
      roulette: [-62, -68, 62, 62],
      "twin-circles": [-99, -56, 99, 56],
      wings: [-127, -34, 127, 54],
      "heart-cluster": [-44, -35, 44, 35],
      flowers: [-44, -34, 44, 35],
      sparkles: [-38, -38, 40, 35],
      bow: [-33, -26, 33, 46],
      bubble: [-76, -46, 78, 42],
      rays: [-63, -63, 63, 63],
      wheel: [-57, -57, 57, 57]
    }[type] || [-62, -62, 62, 62];
    return { left: bounds[0], top: bounds[1], right: bounds[2], bottom: bounds[3] };
  }

  function textLocalBounds(target, numberStyle = false) {
    const measureCtx = ensureLayerHitSurface();
    const lines = String(target.text || "").split(/\\n|\n/);
    const lineHeight = target.size * (numberStyle ? .83 : phraseLineHeight(target));
    const startY = -((lines.length - 1) * lineHeight) / 2;
    const phraseWidths = numberStyle ? [] : [
      target.innerStrokeEnabled === false ? 0 : phraseStrokeWidth(target, "innerStrokeWidth", .075),
      target.middleStrokeEnabled === false ? 0 : phraseStrokeWidth(target, "middleStrokeWidth", .14),
      target.outerStrokeEnabled === false ? 0 : phraseStrokeWidth(target, "outerStrokeWidth", .2)
    ];
    const strokePad = numberStyle ? 6 : Math.max(1, ...phraseWidths.map(width => width / 2 + 1));
    const shadowX = numberStyle || target.outerStrokeEnabled === false ? 0 : Math.max(1, target.size * .055);
    const shadowY = numberStyle || target.outerStrokeEnabled === false ? 0 : Math.max(1, target.size * .07);
    measureCtx.save();
    measureCtx.setTransform(1, 0, 0, 1, 0, 0);
    measureCtx.font = `${target.size}px ${numberStyle ? '"SigJua","Arial Rounded MT Bold",sans-serif' : phraseFontFamily(target)}`;
    measureCtx.textAlign = "center";
    measureCtx.textBaseline = "middle";
    let left = 0;
    let right = 0;
    let top = Infinity;
    let bottom = -Infinity;
    lines.forEach((line, index) => {
      const metrics = measureCtx.measureText(line || " ");
      const width = metrics.width || target.size * .55;
      const ascent = metrics.actualBoundingBoxAscent || target.size * .74;
      const descent = metrics.actualBoundingBoxDescent || target.size * .22;
      const baseline = startY + index * lineHeight;
      left = Math.min(left, -width / 2 - strokePad);
      right = Math.max(right, width / 2 + strokePad + shadowX);
      top = Math.min(top, baseline - ascent - strokePad);
      bottom = Math.max(bottom, baseline + descent + strokePad + shadowY);
    });
    measureCtx.restore();
    return { left, top, right, bottom };
  }

  function selectionFrame(ref = state.selected) {
    const target = layerTarget(ref);
    if (!target || !layerVisible(ref)) return null;
    if (ref.kind === "character") {
      const drawBounds = characterBounds();
      const alpha = imageAlphaBounds(target.img);
      const flippedLeft = target.flip ? .5 - alpha.right : alpha.left - .5;
      const flippedRight = target.flip ? .5 - alpha.left : alpha.right - .5;
      return frameFromLocalBounds(ref, target, {
        left: flippedLeft * drawBounds.w - 3,
        top: (alpha.top - .5) * drawBounds.h - 3,
        right: flippedRight * drawBounds.w + 3,
        bottom: (alpha.bottom - .5) * drawBounds.h + 3
      });
    }
    if (ref.kind === "phrase") return frameFromLocalBounds(ref, target, textLocalBounds(target, false));
    if (ref.kind === "num1" || ref.kind === "num2") return frameFromLocalBounds(ref, target, textLocalBounds(target, true), 0);
    const raster = propImages[target.type];
    let local;
    if (raster?.naturalWidth) {
      const fit = Math.min(140 / raster.naturalWidth, 140 / raster.naturalHeight);
      const width = raster.naturalWidth * fit;
      const height = raster.naturalHeight * fit;
      const alpha = imageAlphaBounds(raster);
      local = {
        left: (alpha.left - .5) * width,
        top: (alpha.top - .5) * height,
        right: (alpha.right - .5) * width,
        bottom: (alpha.bottom - .5) * height
      };
    } else {
      local = vectorPropLocalBounds(target.type);
    }
    return frameFromLocalBounds(ref, target, {
      left: local.left * target.scale,
      top: local.top * target.scale,
      right: local.right * target.scale,
      bottom: local.bottom * target.scale
    });
  }

  function canResizeLayer(ref) {
    return !!ref && (ref.kind === "character" || ref.kind === "phrase" || ref.kind === "prop") && !layerLocked(ref);
  }

  function frameLocalPoint(frame, point) {
    const angle = -(frame.rotation || 0) * Math.PI / 180;
    const dx = point.x - frame.cx;
    const dy = point.y - frame.cy;
    return { x: dx * Math.cos(angle) - dy * Math.sin(angle), y: dx * Math.sin(angle) + dy * Math.cos(angle) };
  }

  function frameWorldPoint(frame, localX, localY) {
    const angle = (frame.rotation || 0) * Math.PI / 180;
    return {
      x: frame.cx + localX * Math.cos(angle) - localY * Math.sin(angle),
      y: frame.cy + localX * Math.sin(angle) + localY * Math.cos(angle)
    };
  }

  function resizeHandlePoint(ref) {
    if (!canResizeLayer(ref)) return null;
    const frame = selectionFrame(ref);
    if (!frame) return null;
    const corner = frameWorldPoint(frame, frame.width / 2, frame.height / 2);
    // 선택 박스가 캔버스 밖으로 나가도 손잡이는 항상 화면 안에 남긴다.
    return { x: clamp(corner.x, 6, W - 6), y: clamp(corner.y, 6, H - 6) };
  }

  function resizeHandleHit(ref, point) {
    const handle = resizeHandlePoint(ref);
    return !!handle && Math.hypot(point.x - handle.x, point.y - handle.y) <= 7;
  }

  function selectionFrameContains(ref, point) {
    if (!ref || layerLocked(ref)) return false;
    const frame = selectionFrame(ref);
    if (!frame) return false;
    const local = frameLocalPoint(frame, point);
    return Math.abs(local.x) <= frame.width / 2 && Math.abs(local.y) <= frame.height / 2;
  }

  function drawSelection(c) {
    const frame = selectionFrame();
    if (!frame) return;
    const locked = layerLocked(frame.ref);
    const handle = !locked ? resizeHandlePoint(frame.ref) : null;
    c.save();
    c.translate(frame.cx, frame.cy);
    c.rotate(frame.rotation * Math.PI / 180);
    c.setLineDash(locked ? [2, 3] : [4, 3]);
    c.strokeStyle = locked ? "rgba(70,65,74,.78)" : "#3f2a9d";
    c.lineWidth = 1;
    c.strokeRect(-frame.width / 2, -frame.height / 2, frame.width, frame.height);
    c.setLineDash([]);
    if (locked) {
      c.fillStyle = "rgba(55,50,58,.88)";
      c.font = '8px "SigJua",Arial,sans-serif';
      c.textAlign = "left";
      c.textBaseline = "bottom";
      c.fillText("잠금", -frame.width / 2 + 3, -frame.height / 2 - 2);
    }
    c.restore();
    if (handle) {
      c.save();
      c.beginPath();
      c.arc(handle.x, handle.y, 5, 0, Math.PI * 2);
      c.fillStyle = "#ffffff";
      c.fill();
      c.lineWidth = 2;
      c.strokeStyle = "#3f2a9d";
      c.stroke();
      c.restore();
    }
  }

  function frameAxisBounds(frame) {
    const radians = (frame.rotation || 0) * Math.PI / 180;
    const halfWidth = Math.abs(Math.cos(radians)) * frame.width / 2 + Math.abs(Math.sin(radians)) * frame.height / 2;
    const halfHeight = Math.abs(Math.sin(radians)) * frame.width / 2 + Math.abs(Math.cos(radians)) * frame.height / 2;
    return { left: frame.cx - halfWidth, right: frame.cx + halfWidth, top: frame.cy - halfHeight, bottom: frame.cy + halfHeight };
  }

  function nearestSnap(candidates) {
    return candidates
      .filter(candidate => Math.abs(candidate.delta) <= SNAP_DISTANCE)
      .sort((a, b) => Math.abs(a.delta) - Math.abs(b.delta) || a.priority - b.priority)[0] || null;
  }

  function snapMovedLayer(ref, bypass = false) {
    activeSnapGuides = null;
    if (!state.snapEnabled || bypass) return null;
    const target = layerTarget(ref);
    const frame = selectionFrame(ref);
    if (!target || !frame) return null;
    const bounds = frameAxisBounds(frame);
    const xSnap = nearestSnap([
      { delta: W / 2 - frame.cx, line: W / 2, label: "가운데", priority: 0 },
      { delta: -bounds.left, line: 0, label: "왼쪽 끝", priority: 1 },
      { delta: W - bounds.right, line: W, label: "오른쪽 끝", priority: 1 }
    ]);
    const ySnap = nearestSnap([
      { delta: 84 - bounds.top, line: 84, label: "84px 안전선", priority: 0 },
      { delta: 84 - bounds.bottom, line: 84, label: "84px 안전선", priority: 1 },
      { delta: -bounds.top, line: 0, label: "위쪽 끝", priority: 2 },
      { delta: H - bounds.bottom, line: H, label: "바닥", priority: 2 }
    ]);
    if (xSnap) target.x += xSnap.delta;
    if (ySnap) target.y += ySnap.delta;
    if (xSnap || ySnap) activeSnapGuides = { x: xSnap, y: ySnap };
    return activeSnapGuides;
  }

  function drawActiveSnapGuides(c) {
    if (!activeSnapGuides) return;
    c.save();
    c.setLineDash([2, 2]);
    c.strokeStyle = "rgba(28,153,119,.95)";
    c.fillStyle = "rgba(20,116,91,.96)";
    c.lineWidth = 1.2;
    c.font = '8px "SigJua",Arial,sans-serif';
    if (activeSnapGuides.x) {
      const x = clamp(activeSnapGuides.x.line, .5, W - .5);
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke();
      c.textAlign = "left"; c.textBaseline = "top"; c.fillText(activeSnapGuides.x.label, clamp(x + 3, 3, W - 48), 4);
    }
    if (activeSnapGuides.y) {
      const y = clamp(activeSnapGuides.y.line, .5, H - .5);
      c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke();
      c.textAlign = "right"; c.textBaseline = "bottom"; c.fillText(activeSnapGuides.y.label, W - 4, clamp(y - 3, 9, H - 3));
    }
    c.restore();
  }

  function drawGuides(c) {
    if (state.showGuides) {
      c.save();
      c.setLineDash([3, 4]);
      c.strokeStyle = "rgba(42,37,49,.28)";
      c.lineWidth = .8;
      c.beginPath();
      c.moveTo(0, 84);
      c.lineTo(W, 84);
      c.stroke();
      c.setLineDash([]);
      c.fillStyle = "rgba(42,37,49,.62)";
      c.font = '8px Arial,sans-serif';
      c.textAlign = "left";
      c.fillText("필수 투명영역 84px · 저장 시 잘림", 5, 79);
      c.strokeStyle = "rgba(236,37,55,.55)";
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(0, H - .5);
      c.lineTo(W, H - .5);
      c.stroke();
      c.fillStyle = "rgba(191,20,36,.8)";
      c.textAlign = "right";
      c.fillText("하단 수평 고정", W - 5, H - 5);
      c.restore();
    }
    drawActiveSnapGuides(c);
  }

  function renderTo(c, options = {}) {
    const preview = options.preview !== false;
    const showSelection = options.showSelection !== false;
    c.save();
    c.clearRect(0, 0, W, H);
    drawBackground(c, state.background, true);
    state.props.filter(p => !p.front).forEach(prop => drawProp(c, prop));
    drawCharacter(c, preview);
    drawOutlinedText(c, state.phrase.text, Object.assign({ enabled: true }, state.phrase), false);
    state.props.filter(p => p.front).forEach(prop => drawProp(c, prop));
    if (!options.skipNumbers) {
      drawOutlinedText(c, state.num1.text, state.num1, true);
      drawOutlinedText(c, state.num2.text, state.num2, true);
    }
    // 메인 작업면은 모바일 기준이다. 저장 때 강제로 비우는 84px을 화면에서도
    // 똑같이 비워 WYSIWYG를 지키고, 선택선/가이드만 그 위에 안내로 표시한다.
    if (preview) c.clearRect(0, 0, W, SAFE_TOP);
    if (preview) drawGuides(c);
    if (preview && showSelection) drawSelection(c);
    c.restore();
  }

  function render() {
    renderQueued = false;
    if (!ctx) return;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    renderTo(ctx, { preview: true, showSelection: true });
  }

  function requestRender() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(render);
    requestOutputPreview();
  }

  function syncOutputProfileControls() {
    if (!OUTPUT_PROFILE_TYPES.includes(outputPreviewType)) outputPreviewType = "mobile";
    const profile = outputProfile(outputPreviewType);
    const limits = OUTPUT_PROFILE_LIMITS[outputPreviewType];
    const type = document.getElementById("sigOutputType");
    if (type) type.value = outputPreviewType;
    [["sigOutputXRange", "sigOutputX", "x"], ["sigOutputYRange", "sigOutputY", "y"], ["sigOutputScaleRange", "sigOutputScale", "scale"]].forEach(([rangeId, numberId, key]) => {
      const range = document.getElementById(rangeId);
      const number = document.getElementById(numberId);
      const limit = key === "x" ? limits.x : key === "y" ? limits.y : 1.5;
      const min = key === "scale" ? .5 : -limit;
      const max = limit;
      [range, number].forEach(input => {
        if (!input) return;
        input.min = String(min);
        input.max = String(max);
        input.value = String(profile[key]);
      });
    });
    const status = document.getElementById("sigOutputStatus");
    if (status) status.textContent = outputProfileIsIdentity(profile)
      ? "기본값 · 원본 픽셀 유지"
      : `${OUTPUT_PROFILE_LABELS[outputPreviewType]} · X ${profile.x}, Y ${profile.y}, ${Math.round(profile.scale * 100)}%`;
  }

  function outputCanvasForPreview(type = outputPreviewType) {
    if (type === "pc") return makePcCanvas();
    if (type === "weflab") return makeWeflabCanvas();
    return makeMasterCanvas();
  }

  function renderOutputPreview() {
    outputPreviewTimer = 0;
    const section = document.getElementById("sigOutputSection");
    const preview = document.getElementById("sigOutputPreviewCanvas");
    if (!section?.open || !preview) return;
    const source = outputCanvasForPreview(outputPreviewType);
    preview.width = source.width;
    preview.height = source.height;
    const previewCtx = preview.getContext("2d", { alpha: true });
    previewCtx.clearRect(0, 0, preview.width, preview.height);
    previewCtx.drawImage(source, 0, 0);
  }

  function requestOutputPreview(immediate = false) {
    const section = document.getElementById("sigOutputSection");
    if (!section?.open) return;
    if (outputPreviewTimer) clearTimeout(outputPreviewTimer);
    outputPreviewTimer = setTimeout(renderOutputPreview, immediate ? 0 : 70);
  }

  function commitOutputProfileEdit() {
    if (!outputProfileHistoryBefore) return;
    const before = outputProfileHistoryBefore;
    outputProfileHistoryBefore = null;
    commitMainChange(before);
  }

  function setOutputProfileValue(key, value) {
    if (!outputProfileHistoryBefore) outputProfileHistoryBefore = beginMainChange();
    const next = Object.assign({}, outputProfile(outputPreviewType), { [key]: Number(value) });
    state.outputProfiles[outputPreviewType] = normalizeOutputProfile(outputPreviewType, next);
    syncOutputProfileControls();
    requestRender();
  }

  function resetOutputProfile() {
    commitOutputProfileEdit();
    const before = beginMainChange();
    state.outputProfiles[outputPreviewType] = { x: 0, y: 0, scale: 1 };
    syncOutputProfileControls();
    requestRender();
    commitMainChange(before);
  }

  function syncPhraseStyleControls() {
    const lineHeightValue = document.getElementById("sigPhraseLineHeightValue");
    if (lineHeightValue) lineHeightValue.textContent = `${Math.round(phraseLineHeight(state.phrase) * 100)}%`;
    const rows = [
      ["sigPhraseInnerEnabled", "sigPhraseStroke", "sigPhraseInnerWidth", "sigPhraseInnerWidthValue", "innerStrokeEnabled", "innerStrokeWidth", .075],
      ["sigPhraseMiddleEnabled", "sigPhraseMiddleStroke", "sigPhraseMiddleWidth", "sigPhraseMiddleWidthValue", "middleStrokeEnabled", "middleStrokeWidth", .14],
      ["sigPhraseOuterEnabled", "sigPhraseShadow", "sigPhraseOuterWidth", "sigPhraseOuterWidthValue", "outerStrokeEnabled", "outerStrokeWidth", .2]
    ];
    rows.forEach(([toggleId, colorId, widthId, outputId, enabledKey, widthKey, fallback]) => {
      const enabled = state.phrase[enabledKey] !== false;
      const toggle = document.getElementById(toggleId);
      const color = document.getElementById(colorId);
      const width = document.getElementById(widthId);
      const output = document.getElementById(outputId);
      if (toggle) toggle.checked = enabled;
      if (color) color.disabled = !enabled;
      if (width) width.disabled = !enabled;
      if (output) output.textContent = `${Math.round(phraseStrokeRatio(state.phrase, widthKey, fallback) * 1000) / 10}%`;
      toggle?.closest(".sig-outline-row")?.classList.toggle("is-disabled", !enabled);
    });
  }

  function syncControls() {
    renderPhraseFontOptions();
    const customBgOption = document.querySelector('#sigBgTexture option[value="custom"]');
    if (customBgOption) customBgOption.disabled = !state.background.customImg;
    const alphaMaskOption = document.querySelector('#sigBgMask option[value="alpha-custom"]');
    if (alphaMaskOption) alphaMaskOption.disabled = !state.background.maskCanvas;
    document.querySelectorAll('#sigBgPaintMode option[value="original"], #sigBgPaintMode option[value="recolor"]').forEach(option => {
      option.disabled = !state.background.customSourceCanvas;
    });
    const customBgName = document.getElementById("sigBgUploadName");
    if (customBgName) {
      customBgName.textContent = state.background.customImg
        ? `알파 마스크 적용 · ${state.background.customName}`
        : "투명 PNG는 원색 유지 또는 알파만 재색칠할 수 있어";
    }
    const maskStatus = document.getElementById("sigMaskStatus");
    if (maskStatus) maskStatus.textContent = isAlphaMask() ? "내 알파 마스크 적용 중 · 언제든 다시 편집 가능" : "일자 기본판 · 윗선 펜과 브러시로 자유롭게 수정";
    const straightOnly = !isAlphaMask();
    const bgTop = document.getElementById("sigBgTop");
    const autoFit = document.getElementById("sigAutoFit");
    if (bgTop) {
      bgTop.disabled = !straightOnly;
      bgTop.title = straightOnly ? "일자 배경판 시작선" : "직접 그린 모양은 배경판 작업실에서 수정해.";
    }
    if (autoFit) {
      autoFit.disabled = !straightOnly;
      autoFit.title = straightOnly ? "캐릭터와 문구에 맞춰 일자 시작선을 조정" : "직접 그린 모양은 배경판 작업실에서 수정해.";
    }
    const map = {
      sigPlacement: state.placementIndex,
      sigCharX: state.character.x,
      sigCharY: state.character.y,
      sigCharScale: state.character.scale,
      sigCharRot: state.character.rot,
      sigPhraseText: state.phrase.text,
      sigPhraseX: state.phrase.x,
      sigPhraseY: state.phrase.y,
      sigPhraseSize: state.phrase.size,
      sigPhraseRot: state.phrase.rot,
      sigPhraseFont: state.phrase.fontKey,
      sigPhraseLineHeight: phraseLineHeight(state.phrase) * 100,
      sigPhraseFill: state.phrase.fill,
      sigPhraseStroke: state.phrase.stroke,
      sigPhraseInnerWidth: phraseStrokeRatio(state.phrase, "innerStrokeWidth", .075) * 100,
      sigPhraseMiddleStroke: state.phrase.middleStroke || "#ffffff",
      sigPhraseMiddleWidth: phraseStrokeRatio(state.phrase, "middleStrokeWidth", .14) * 100,
      sigPhraseShadow: state.phrase.shadow,
      sigPhraseOuterWidth: phraseStrokeRatio(state.phrase, "outerStrokeWidth", .2) * 100,
      sigNum1Text: state.num1.text,
      sigNum1X: state.num1.x,
      sigNum1Y: state.num1.y,
      sigNum1Size: state.num1.size,
      sigNum2Text: state.num2.text,
      sigNum2X: state.num2.x,
      sigNum2Y: state.num2.y,
      sigNum2Size: state.num2.size,
      sigBgTexture: state.background.texture,
      sigBgMask: state.background.mask,
      sigBgTop: state.background.top,
      sigBgPaintMode: state.background.maskPaintMode,
      sigMaskFillColor: state.background.maskFillColor,
      sigMaskStrokeColor: state.background.maskStrokeColor,
      sigMaskStrokeWidth: state.background.maskStrokeWidth,
      sigMaskOuterColor: state.background.maskOuterColor,
      sigMaskOuterWidth: state.background.maskOuterWidth,
      sigBgImageScale: state.background.imageScale,
      sigBgOffsetX: state.background.offsetX,
      sigBgOffsetY: state.background.offsetY,
      sigBgPattern: state.background.pattern,
      sigBgPrimary: state.background.primary,
      sigBgSecondary: state.background.secondary,
      sigBgTintOpacity: state.background.tintOpacity,
      sigBgHue: state.background.hue,
      sigBgSaturation: state.background.saturation,
      sigBgBrightness: state.background.brightness,
      sigExportBaseName: state.exportBaseName || SIG_DEFAULT_EXPORT_BASE
    };
    Object.entries(map).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.value = value;
    });
    document.querySelectorAll("[data-sig-mask]").forEach(button => {
      button.classList.toggle("on", button.dataset.sigMask === state.background.mask);
    });
    const charFlip = document.getElementById("sigCharFlip");
    if (charFlip) charFlip.checked = state.character.flip;
    const snapEnabled = document.getElementById("sigSnapEnabled");
    if (snapEnabled) snapEnabled.checked = state.snapEnabled !== false;
    if (stage) stage.classList.toggle("dark", !!state.previewDark);
    const darkButton = document.getElementById("sigDark");
    if (darkButton) darkButton.textContent = state.previewDark ? "밝은 화면" : "어두운 화면";
    const guideButton = document.getElementById("sigGuides");
    if (guideButton) guideButton.textContent = state.showGuides ? "가이드 숨김" : "가이드 표시";
    const num2Enable = document.getElementById("sigNum2Enable");
    if (num2Enable) num2Enable.checked = state.num2.enabled;
    const num2Fields = document.getElementById("sigNum2Fields");
    if (num2Fields) num2Fields.style.opacity = state.num2.enabled ? "1" : ".45";
    const doubleOutline = document.getElementById("sigMaskDoubleOutline");
    if (doubleOutline) doubleOutline.checked = state.background.maskDoubleOutline;
    const outerFields = document.getElementById("sigMaskOuterFields");
    if (outerFields) {
      outerFields.style.opacity = state.background.maskDoubleOutline ? "1" : ".42";
      outerFields.style.pointerEvents = state.background.maskDoubleOutline ? "auto" : "none";
    }
    syncPhraseStyleControls();
    syncLayerLockControls();
    syncPropControls();
    syncOutputProfileControls();
  }

  function selectedProp() {
    return state.selected.kind === "prop" ? state.props[state.selected.index] : null;
  }

  function selectedLayerLabel(ref = state.selected) {
    if (ref.kind === "character") return "캐릭터";
    if (ref.kind === "phrase") return "문구";
    if (ref.kind === "num1") return "숫자 1";
    if (ref.kind === "num2") return "숫자 2";
    if (ref.kind === "prop") {
      const prop = state.props[ref.index];
      return prop ? `소품 · ${propLabels[prop.type] || prop.type}` : "소품 없음";
    }
    return "선택 없음";
  }

  function syncSelectedLayerBar() {
    const name = document.getElementById("sigSelectedLayerName");
    const lock = document.getElementById("sigSelectedLayerLock");
    const target = layerTarget(state.selected);
    const locked = !!target && layerLocked(state.selected);
    if (name) name.textContent = selectedLayerLabel();
    if (lock) {
      lock.disabled = !target;
      lock.textContent = locked ? "🔒 잠금 해제" : "🔓 잠금";
      lock.classList.toggle("is-locked", locked);
      lock.setAttribute("aria-pressed", String(locked));
    }
  }

  function syncLayerLockControls() {
    document.querySelectorAll("[data-layer]").forEach(button => {
      button.classList.toggle("on", button.dataset.layer === state.selected.kind);
    });
    document.querySelectorAll("[data-layer-lock]").forEach(button => {
      const ref = { kind: button.dataset.layerLock, index: -1 };
      const locked = layerLocked(ref);
      button.textContent = locked ? "🔒" : "🔓";
      button.classList.toggle("is-locked", locked);
      button.setAttribute("aria-pressed", String(locked));
      button.title = locked ? "잠금 해제" : "위치와 크기 잠금";
    });
    const groups = [
      [state.character.locked, ["sigCharX", "sigCharY", "sigCharScale", "sigCharRot", "sigCharFlip"]],
      [state.phrase.locked, ["sigPhraseX", "sigPhraseY", "sigPhraseSize", "sigPhraseRot"]],
      [state.num1.locked, ["sigNum1X", "sigNum1Y"]],
      [state.num2.locked, ["sigNum2X", "sigNum2Y"]]
    ];
    groups.forEach(([locked, ids]) => ids.forEach(id => {
      const field = document.getElementById(id);
      if (field) field.disabled = !!locked || field.dataset.officialFixed === "true";
    }));
    const prop = selectedProp();
    ["sigPropX", "sigPropY", "sigPropScale", "sigPropRot", "sigPropFront"].forEach(id => {
      const field = document.getElementById(id);
      if (field) field.disabled = !!prop?.locked;
    });
    syncSelectedLayerBar();
  }

  function setLayerLocked(ref, locked) {
    const target = layerTarget(ref);
    if (!target) return;
    const historyBefore = beginMainChange();
    target.locked = !!locked;
    renderLayerList();
    syncLayerLockControls();
    syncPropControls();
    requestRender();
    commitMainChange(historyBefore);
  }

  function toggleLayerLocked(ref) {
    setLayerLocked(ref, !layerLocked(ref));
  }

  function syncPropControls() {
    const prop = selectedProp();
    const wrap = document.getElementById("sigPropControls");
    if (!wrap) return;
    wrap.style.opacity = prop ? "1" : ".45";
    wrap.style.pointerEvents = prop ? "auto" : "none";
    if (!prop) return;
    document.getElementById("sigPropX").value = prop.x;
    document.getElementById("sigPropY").value = prop.y;
    document.getElementById("sigPropScale").value = prop.scale;
    document.getElementById("sigPropRot").value = prop.rot;
    document.getElementById("sigPropOpacity").value = prop.opacity == null ? .92 : prop.opacity;
    document.getElementById("sigPropHue").value = prop.hue || 0;
    document.getElementById("sigPropSaturation").value = prop.saturation == null ? 100 : prop.saturation;
    document.getElementById("sigPropBrightness").value = prop.brightness == null ? 100 : prop.brightness;
    document.getElementById("sigPropColor1").value = prop.color1;
    document.getElementById("sigPropColor2").value = prop.color2;
    document.getElementById("sigPropFront").checked = prop.front;
    syncLayerLockControls();
  }

  const propLabels = {
    ring: "원형 링",
    "double-ring": "이중 링",
    roulette: "룰렛 휠",
    "twin-circles": "쌍원 프레임",
    wings: "날개",
    "heart-cluster": "하트 묶음",
    flowers: "꽃 낙서",
    sparkles: "별 반짝이",
    bow: "리본",
    bubble: "구름 버블",
    rays: "팝 방사형",
    wheel: "바퀴 윤곽"
  };
  [...imagePropDefs, ...legacyRichPropDefs].forEach(def => { propLabels[def.id] = def.label; });

  function addPropType(type) {
    const historyBefore = beginMainChange();
    const prop = propDefaults(type, state.props.length);
    if (activeImagePropDefs.some(def => def.id === type)) {
      prop.scale = .86;
      prop.opacity = 1;
      prop.x = 146 + (state.props.length % 3 - 1) * 22;
      prop.y = 163;
    }
    state.props.push(prop);
    selectLayer("prop", state.props.length - 1);
    renderLayerList();
    syncPropControls();
    requestRender();
    commitMainChange(historyBefore);
  }

  function renderImagePropGallery() {
    const grid = document.getElementById("sigImagePropGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const filter = document.getElementById("sigPropCategoryFilter")?.value || "";
    const visibleDefs = activeImagePropDefs.filter(def => {
      if (!filter) return true;
      return (def.folder || "props") === filter;
    });
    visibleDefs.forEach(def => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sig-image-prop";
      button.title = `${def.category} · ${def.label} 추가`;
      button.innerHTML = `<img loading="lazy" src="${ASSET_DIR}${def.folder || "props"}/${def.file}" alt=""><span>${escapeHtml(def.label)}</span>`;
      button.addEventListener("click", () => addPropType(def.id));
      const thumbnail = button.querySelector("img");
      thumbnail.addEventListener("error", () => {
        button.classList.add("missing");
        button.disabled = true;
        button.title = `${def.label} 파일을 찾을 수 없어. 다른 소품은 계속 사용할 수 있어.`;
        thumbnail.removeAttribute("src");
      }, { once: true });
      grid.appendChild(button);
    });
  }

  function renderLayerList() {
    const list = document.getElementById("sigLayerList");
    if (!list) return;
    list.innerHTML = "";
    state.props.forEach((prop, index) => {
      const row = document.createElement("div");
      row.className = "sig-layer-row";
      const select = document.createElement("button");
      select.type = "button";
      select.textContent = `${prop.front ? "앞" : "뒤"} · ${propLabels[prop.type] || prop.type}`;
      select.classList.toggle("on", state.selected.kind === "prop" && state.selected.index === index);
      select.addEventListener("click", () => selectLayer("prop", index));
      const lock = document.createElement("button");
      lock.type = "button";
      lock.className = "sig-lock" + (prop.locked ? " is-locked" : "");
      lock.textContent = prop.locked ? "🔒" : "🔓";
      lock.title = prop.locked ? "잠금 해제" : "위치와 크기 잠금";
      lock.setAttribute("aria-pressed", String(!!prop.locked));
      lock.addEventListener("click", event => {
        event.stopPropagation();
        toggleLayerLocked({ kind: "prop", index });
      });
      const del = document.createElement("button");
      del.type = "button";
      del.className = "sig-del";
      del.textContent = "×";
      del.title = "소품 삭제";
      del.disabled = !!prop.locked;
      del.addEventListener("click", () => {
        if (prop.locked) return;
        const historyBefore = beginMainChange();
        const removed = state.props[index];
        state.props.splice(index, 1);
        if (removed?.customImage && !state.props.some(prop => prop.type === removed.type)) {
          delete propImages[removed.type];
          delete propLabels[removed.type];
        }
        state.selected = { kind: "character", index: -1 };
        renderLayerList();
        syncControls();
        requestRender();
        commitMainChange(historyBefore);
      });
      row.append(select, lock, del);
      list.appendChild(row);
    });
  }

  function selectLayer(kind, index = -1) {
    state.selected = { kind, index };
    renderLayerList();
    syncLayerLockControls();
    syncPropControls();
    requestRender();
  }

  function bindValue(id, target, key, parser = Number, after) {
    const el = document.getElementById(id);
    if (!el) return;
    let historyBefore = null;
    const handler = event => {
      if (target?.locked && ["x", "y", "scale", "size", "rot"].includes(key)) {
        el.value = target[key];
        return;
      }
      if (!historyBefore) historyBefore = beginMainChange();
      target[key] = parser(el.value);
      if (after) after();
      requestRender();
      if (event.type === "change") {
        commitMainChange(historyBefore);
        historyBefore = null;
      }
    };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
    el.addEventListener("blur", () => {
      if (!historyBefore) return;
      commitMainChange(historyBefore);
      historyBefore = null;
    });
  }

  function bindToggle(id, target, key, after) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("change", () => {
      const historyBefore = beginMainChange();
      target[key] = !!el.checked;
      if (after) after();
      requestRender();
      commitMainChange(historyBefore);
    });
  }

  function bindControls() {
    bindSigConfirm();
    document.getElementById("sigUndo").addEventListener("click", mainUndo);
    document.getElementById("sigRedo").addEventListener("click", mainRedo);
    document.getElementById("sigSelectedLayerLock").addEventListener("click", () => {
      if (layerTarget(state.selected)) toggleLayerLocked({ kind: state.selected.kind, index: state.selected.index });
    });
    const jumpToLayerList = () => {
      const target = document.getElementById("sigCoreLayerList")?.closest(".sig-section");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    ["sigJumpLayers", "sigLayerListJump"].forEach(id => document.getElementById(id)?.addEventListener("click", jumpToLayerList));
    document.getElementById("sigJumpOutput").addEventListener("click", () => {
      const section = document.getElementById("sigOutputSection");
      section.open = true;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      syncOutputProfileControls();
      requestOutputPreview(true);
    });
    document.getElementById("sigOutputSection").addEventListener("toggle", event => {
      if (event.currentTarget.open) {
        syncOutputProfileControls();
        requestOutputPreview(true);
      }
    });
    document.getElementById("sigOutputType").addEventListener("change", event => {
      commitOutputProfileEdit();
      outputPreviewType = OUTPUT_PROFILE_TYPES.includes(event.currentTarget.value) ? event.currentTarget.value : "mobile";
      syncOutputProfileControls();
      requestOutputPreview(true);
    });
    [["sigOutputXRange", "x"], ["sigOutputYRange", "y"], ["sigOutputScaleRange", "scale"]].forEach(([id, key]) => {
      const input = document.getElementById(id);
      input.addEventListener("input", () => setOutputProfileValue(key, input.value));
      input.addEventListener("change", commitOutputProfileEdit);
      input.addEventListener("blur", commitOutputProfileEdit);
    });
    [["sigOutputX", "x"], ["sigOutputY", "y"], ["sigOutputScale", "scale"]].forEach(([id, key]) => {
      const input = document.getElementById(id);
      let editPending = false;
      input.addEventListener("input", () => { editPending = true; });
      const commit = () => {
        editPending = false;
        setOutputProfileValue(key, input.value);
        commitOutputProfileEdit();
      };
      input.addEventListener("change", commit);
      input.addEventListener("blur", () => {
        if (editPending) commit();
      });
      input.addEventListener("keydown", event => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        input.blur();
      });
    });
    document.getElementById("sigOutputReset").addEventListener("click", resetOutputProfile);
    document.getElementById("sigPlacement").addEventListener("change", event => {
      applyPlacement(Number(event.target.value));
    });
    bindValue("sigCharX", state.character, "x");
    bindValue("sigCharY", state.character, "y");
    bindValue("sigCharScale", state.character, "scale");
    bindValue("sigCharRot", state.character, "rot");
    bindValue("sigPhraseText", state.phrase, "text", String);
    bindValue("sigPhraseX", state.phrase, "x");
    bindValue("sigPhraseY", state.phrase, "y");
    bindValue("sigPhraseSize", state.phrase, "size");
    bindValue("sigPhraseRot", state.phrase, "rot");
    bindValue("sigPhraseFont", state.phrase, "fontKey", String);
    bindValue("sigPhraseLineHeight", state.phrase, "lineHeight", value => Number(value) / 100, syncPhraseStyleControls);
    bindValue("sigPhraseFill", state.phrase, "fill", String);
    bindValue("sigPhraseStroke", state.phrase, "stroke", String);
    bindValue("sigPhraseInnerWidth", state.phrase, "innerStrokeWidth", value => Number(value) / 100, syncPhraseStyleControls);
    bindValue("sigPhraseMiddleStroke", state.phrase, "middleStroke", String);
    bindValue("sigPhraseMiddleWidth", state.phrase, "middleStrokeWidth", value => Number(value) / 100, syncPhraseStyleControls);
    bindValue("sigPhraseShadow", state.phrase, "shadow", String);
    bindValue("sigPhraseOuterWidth", state.phrase, "outerStrokeWidth", value => Number(value) / 100, syncPhraseStyleControls);
    bindToggle("sigPhraseInnerEnabled", state.phrase, "innerStrokeEnabled", syncPhraseStyleControls);
    bindToggle("sigPhraseMiddleEnabled", state.phrase, "middleStrokeEnabled", syncPhraseStyleControls);
    bindToggle("sigPhraseOuterEnabled", state.phrase, "outerStrokeEnabled", syncPhraseStyleControls);
    document.getElementById("sigPhraseFontFile").addEventListener("change", loadCustomPhraseFont);
    document.getElementById("sigPhraseToProp").addEventListener("click", event => cloneTextLayerToProp("phrase", event.currentTarget));
    document.getElementById("sigNum1ToProp").addEventListener("click", event => cloneTextLayerToProp("num1", event.currentTarget));
    document.getElementById("sigNum2ToProp").addEventListener("click", event => cloneTextLayerToProp("num2", event.currentTarget));
    bindValue("sigNum1Text", state.num1, "text", value => String(value).replace(/[^\d]/g, "").slice(0, 8));
    bindValue("sigNum1X", state.num1, "x");
    bindValue("sigNum1Y", state.num1, "y");
    bindValue("sigNum2Text", state.num2, "text", value => String(value).replace(/[^\d]/g, "").slice(0, 8));
    bindValue("sigNum2X", state.num2, "x");
    bindValue("sigNum2Y", state.num2, "y");
    const maskSelect = document.getElementById("sigBgMask");
    maskSelect.addEventListener("change", () => {
      setBackgroundMask(maskSelect.value);
    });
    document.querySelectorAll("[data-sig-mask]").forEach(button => {
      button.addEventListener("click", () => setBackgroundMask(button.dataset.sigMask));
    });
    bindValue("sigBgTop", state.background, "top");
    bindValue("sigBgCurve", state.background, "curve");
    bindValue("sigBgPaintMode", state.background, "maskPaintMode", String);
    bindValue("sigMaskFillColor", state.background, "maskFillColor", String);
    bindValue("sigMaskStrokeColor", state.background, "maskStrokeColor", String);
    bindValue("sigMaskStrokeWidth", state.background, "maskStrokeWidth");
    bindValue("sigMaskOuterColor", state.background, "maskOuterColor", String);
    bindValue("sigMaskOuterWidth", state.background, "maskOuterWidth");
    document.getElementById("sigMaskDoubleOutline").addEventListener("change", event => {
      const historyBefore = beginMainChange();
      state.background.maskDoubleOutline = event.target.checked;
      syncControls();
      requestRender();
      commitMainChange(historyBefore);
    });
    bindValue("sigBgImageScale", state.background, "imageScale");
    bindValue("sigBgOffsetX", state.background, "offsetX");
    bindValue("sigBgOffsetY", state.background, "offsetY");
    bindValue("sigBgPattern", state.background, "pattern", String);
    bindValue("sigBgPrimary", state.background, "primary", String);
    bindValue("sigBgSecondary", state.background, "secondary", String);
    bindValue("sigBgTintOpacity", state.background, "tintOpacity");
    bindValue("sigBgHue", state.background, "hue");
    bindValue("sigBgSaturation", state.background, "saturation");
    bindValue("sigBgBrightness", state.background, "brightness");

    const bgTextureSelect = document.getElementById("sigBgTexture");
    let bgTextureHistoryBefore = null;
    const changeBackgroundTexture = event => {
      if (!bgTextureHistoryBefore) bgTextureHistoryBefore = beginMainChange();
      const nextTexture = bgTextureSelect.value;
      if (nextTexture === "custom") {
        if (!activateCustomBackground()) {
          syncControls();
          if (event.type === "change") {
            commitMainChange(bgTextureHistoryBefore);
            bgTextureHistoryBefore = null;
          }
          return;
        }
        syncControls();
        requestRender();
        if (event.type === "change") {
          commitMainChange(bgTextureHistoryBefore);
          bgTextureHistoryBefore = null;
        }
        return;
      }
      state.background.texture = nextTexture;
      state.background.maskPaintMode = "theme";
      const theme = themes.find(item => item.texture === nextTexture);
      if (theme) {
        state.background.primary = theme.primary;
        state.background.secondary = theme.secondary;
        state.background.hue = theme.hue || 0;
        state.background.saturation = theme.saturation == null ? 100 : theme.saturation;
        state.background.brightness = theme.brightness == null ? 100 : theme.brightness;
        state.background.modern = !!theme.modern;
        state.background.surface = theme.surface || "none";
        state.background.motif = theme.motif || "none";
        state.background.tintOpacity = theme.modern || theme.simple || theme.key.startsWith("flat") ? 0 : 12;
        state.background.pattern = theme.pattern || "none";
      } else {
        state.background.modern = false;
        state.background.surface = "none";
        state.background.motif = "none";
      }
      syncControls();
      requestRender();
      if (event.type === "change") {
        commitMainChange(bgTextureHistoryBefore);
        bgTextureHistoryBefore = null;
      }
    };
    bgTextureSelect.addEventListener("input", changeBackgroundTexture);
    bgTextureSelect.addEventListener("change", changeBackgroundTexture);
    bgTextureSelect.addEventListener("blur", () => {
      if (!bgTextureHistoryBefore) return;
      commitMainChange(bgTextureHistoryBefore);
      bgTextureHistoryBefore = null;
    });
    document.getElementById("sigBgFile").addEventListener("change", loadCustomBackground);
    document.getElementById("sigBgRemove").addEventListener("click", clearCustomBackground);

    document.getElementById("sigCharFlip").addEventListener("change", event => {
      if (state.character.locked) return;
      const historyBefore = beginMainChange();
      state.character.flip = event.target.checked;
      requestRender();
      commitMainChange(historyBefore);
    });
    document.getElementById("sigNum2Enable").addEventListener("change", event => {
      const historyBefore = beginMainChange();
      state.num2.enabled = event.target.checked;
      syncControls();
      requestRender();
      commitMainChange(historyBefore);
    });
    document.getElementById("sigCharFile").addEventListener("change", loadCharacter);
    document.getElementById("sigCharRemove").addEventListener("click", () => {
      const historyBefore = beginMainChange();
      state.character.img = null;
      state.character.name = "";
      document.getElementById("sigCharFile").value = "";
      document.getElementById("sigCharStatus").textContent = "캐릭터를 지웠어.";
      requestRender();
      commitMainChange(historyBefore);
    });

    document.getElementById("sigPropAdd").addEventListener("click", () => {
      const type = document.getElementById("sigPropType").value;
      addPropType(type);
    });
    document.getElementById("sigPropCategoryFilter").addEventListener("change", renderImagePropGallery);
    document.getElementById("sigPropFile").addEventListener("change", loadCustomProps);
    bindValue("sigExportBaseName", state, "exportBaseName", String);

    bindPropControl("sigPropX", "x");
    bindPropControl("sigPropY", "y");
    bindPropControl("sigPropScale", "scale");
    bindPropControl("sigPropRot", "rot");
    bindPropControl("sigPropOpacity", "opacity");
    bindPropControl("sigPropHue", "hue");
    bindPropControl("sigPropSaturation", "saturation");
    bindPropControl("sigPropBrightness", "brightness");
    bindPropControl("sigPropColor1", "color1", String);
    bindPropControl("sigPropColor2", "color2", String);
    document.getElementById("sigPropFront").addEventListener("change", event => {
      const prop = selectedProp();
      if (!prop || prop.locked) return;
      const historyBefore = beginMainChange();
      prop.front = event.target.checked;
      renderLayerList();
      requestRender();
      commitMainChange(historyBefore);
    });

    document.querySelectorAll("[data-layer]").forEach(el => el.addEventListener("click", () => selectLayer(el.dataset.layer)));
    document.querySelectorAll("[data-layer-lock]").forEach(button => button.addEventListener("click", event => {
      event.stopPropagation();
      toggleLayerLocked({ kind: button.dataset.layerLock, index: -1 });
    }));
    document.getElementById("sigDark").addEventListener("click", toggleDark);
    document.getElementById("sigGuides").addEventListener("click", toggleGuides);
    document.getElementById("sigSnapEnabled").addEventListener("change", event => {
      const historyBefore = beginMainChange();
      state.snapEnabled = !!event.currentTarget.checked;
      activeSnapGuides = null;
      requestRender();
      commitMainChange(historyBefore);
    });
    document.getElementById("sigAutoFit").addEventListener("click", autoFitBackground);
    document.getElementById("sigExportMobile").addEventListener("click", event => exportFiles(["mobile"], event.currentTarget));
    document.getElementById("sigExportPc").addEventListener("click", event => exportFiles(["pc"], event.currentTarget));
    document.getElementById("sigExportBoth").addEventListener("click", event => exportFiles(["mobile", "pc"], event.currentTarget));
    document.getElementById("sigExportWeflab").addEventListener("click", event => exportFiles(["weflab"], event.currentTarget));
    document.getElementById("sigExportAll").addEventListener("click", event => exportFiles(["mobile", "pc", "weflab"], event.currentTarget));
    document.getElementById("sigProjectSave").addEventListener("click", () => saveSigProject());
    document.getElementById("sigProjectOpen").addEventListener("click", () => openSigProject());
    document.getElementById("sigProjectFile").addEventListener("change", loadBrowserSigProjectFile);
    bindMaskStudio();
    bindCanvasInteractions();
  }

  function bindPropControl(id, key, parser = Number) {
    const el = document.getElementById(id);
    let historyBefore = null;
    const handler = event => {
      const prop = selectedProp();
      if (!prop) return;
      if (prop.locked && ["x", "y", "scale", "rot"].includes(key)) return;
      if (!historyBefore) historyBefore = beginMainChange();
      prop[key] = parser(el.value);
      requestRender();
      if (event.type === "change") {
        commitMainChange(historyBefore);
        historyBefore = null;
      }
    };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
    el.addEventListener("blur", () => {
      if (!historyBefore) return;
      commitMainChange(historyBefore);
      historyBefore = null;
    });
  }

  function isSupportedFontFile(file) {
    if (!file) return false;
    const type = String(file.type || "").toLowerCase();
    if (["font/ttf", "font/otf", "font/woff", "font/woff2", "application/font-woff", "application/x-font-ttf", "application/x-font-opentype"].includes(type)) return true;
    return /\.(ttf|otf|woff2?)$/i.test(String(file.name || ""));
  }

  function fileAsArrayBuffer(file) {
    if (typeof file?.arrayBuffer === "function") return file.arrayBuffer();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("글꼴 파일을 읽지 못했어."));
      reader.onload = () => resolve(reader.result);
      reader.readAsArrayBuffer(file);
    });
  }

  function canonicalFontMime(buffer) {
    const bytes = new Uint8Array(buffer, 0, Math.min(4, buffer.byteLength));
    const magic = Array.from(bytes).map(value => String.fromCharCode(value)).join("");
    if (bytes.length === 4 && bytes[0] === 0 && bytes[1] === 1 && bytes[2] === 0 && bytes[3] === 0 || magic === "true") return "font/ttf";
    if (magic === "OTTO") return "font/otf";
    if (magic === "wOFF") return "font/woff";
    if (magic === "wOF2") return "font/woff2";
    throw new Error("지원하는 TTF, OTF, WOFF, WOFF2 글꼴 형식이 아니야.");
  }

  function blobAsDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("파일 데이터를 읽지 못했어."));
      reader.onload = () => resolve(String(reader.result || ""));
      reader.readAsDataURL(blob);
    });
  }

  async function loadCustomPhraseFont(event) {
    const input = event.currentTarget;
    const file = input.files && input.files[0];
    if (!file) return;
    const status = document.getElementById("sigPhraseFontStatus");
    const setStatus = (message, warn = false) => {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("warn", warn);
    };
    if (!isSupportedFontFile(file)) {
      setStatus("TTF, OTF, WOFF, WOFF2 글꼴만 추가할 수 있어.", true);
      input.value = "";
      return;
    }
    if (typeof FontFace !== "function" || !document.fonts?.add) {
      setStatus("이 브라우저에서는 사용자 글꼴을 불러올 수 없어.", true);
      input.value = "";
      return;
    }
    setStatus(`${file.name} 읽는 중…`);
    try {
      const buffer = await fileAsArrayBuffer(file);
      const mime = canonicalFontMime(buffer);
      const dataUrl = await blobAsDataUrl(new Blob([buffer], { type: mime }));
      customPhraseFontSequence += 1;
      const key = `user-font-${Date.now()}-${customPhraseFontSequence}`;
      const familyName = `SigUserFont_${customPhraseFontSequence}_${Date.now()}`;
      const face = new FontFace(familyName, buffer);
      await face.load();
      document.fonts.add(face);
      const historyBefore = beginMainChange();
      const cleanName = String(file.name || "내 글꼴").replace(/\.[^.]+$/, "") || "내 글꼴";
      customPhraseFonts.set(key, {
        key,
        label: `내 글꼴 · ${cleanName}`,
        family: `"${familyName}","Pretendard","Noto Sans KR",sans-serif`,
        face,
        fileName: file.name || "",
        mime,
        dataUrl
      });
      state.phrase.fontKey = key;
      renderPhraseFontOptions();
      syncControls();
      requestRender();
      commitMainChange(historyBefore);
      setStatus(`${cleanName} 적용 완료 · 프로젝트 저장 시 함께 보관돼.`);
    } catch (error) {
      setStatus(`글꼴 불러오기 실패 · ${error?.message || error}`, true);
    } finally {
      input.value = "";
    }
  }

  async function waitForTextFont(layer, numberStyle) {
    if (!document.fonts) return;
    const family = numberStyle ? '"SigJua","Arial Rounded MT Bold",sans-serif' : phraseFontFamily(layer);
    const sample = String(layer.text || "가Aa0").replace(/\s+/g, "").slice(0, 32) || "가Aa0";
    try {
      if (typeof document.fonts.load === "function") await document.fonts.load(`${layer.size}px ${family}`, sample);
      if (document.fonts.ready) await document.fonts.ready;
    } catch (_) {
      // 시스템 폰트의 load 확인을 지원하지 않아도 캔버스 fallback으로 계속 만든다.
    }
  }

  async function rasterizeTextLayer(layer, numberStyle = false) {
    await waitForTextFont(layer, numberStyle);
    const bounds = textLocalBounds(layer, numberStyle);
    const padding = 3;
    const logicalWidth = Math.max(1, bounds.right - bounds.left + padding * 2);
    const logicalHeight = Math.max(1, bounds.bottom - bounds.top + padding * 2);
    const renderScale = Math.max(1, Math.min(
      TEXT_PROP_RENDER_SCALE,
      TEXT_PROP_MAX_RASTER_SIZE / logicalWidth,
      TEXT_PROP_MAX_RASTER_SIZE / logicalHeight
    ));
    const raster = document.createElement("canvas");
    raster.width = Math.max(1, Math.ceil(logicalWidth * renderScale));
    raster.height = Math.max(1, Math.ceil(logicalHeight * renderScale));
    const rasterCtx = raster.getContext("2d", { alpha: true });
    rasterCtx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
    const drawLayer = Object.assign({}, layer, {
      x: padding - bounds.left,
      y: padding - bounds.top,
      rot: 0,
      enabled: true
    });
    drawOutlinedText(rasterCtx, drawLayer.text, drawLayer, numberStyle);
    const image = await imageFromDataUrl(raster.toDataURL("image/png"));
    return { image, bounds, logicalWidth, logicalHeight, renderScale };
  }

  async function cloneTextLayerToProp(kind, button) {
    const source = kind === "phrase" ? state.phrase : state[kind];
    const numberStyle = kind === "num1" || kind === "num2";
    const status = document.getElementById("sigTextPropStatus");
    const setStatus = (message, warn = false) => {
      if (!status) return;
      status.textContent = message;
      status.classList.toggle("warn", warn);
    };
    if (!source || !String(source.text || "").trim() || numberStyle && !source.enabled) {
      setStatus(numberStyle ? "사용 중인 숫자를 먼저 입력해줘." : "복제할 문구를 먼저 입력해줘.", true);
      return false;
    }
    if (button) button.disabled = true;
    setStatus("고해상도 투명 PNG 소품을 만드는 중…");
    try {
      const rendered = await rasterizeTextLayer(Object.assign({}, source), numberStyle);
      const historyBefore = beginMainChange();
      customPropSequence += 1;
      const type = `generated-text-${Date.now()}-${customPropSequence}`;
      const compactText = String(source.text).replace(/\\n|\n/g, " / ").replace(/\s+/g, " ").trim().slice(0, 22);
      const sourceLabel = kind === "phrase" ? "문구 PNG" : kind === "num1" ? "숫자 1 PNG" : "숫자 2 PNG";
      propImages[type] = rendered.image;
      propLabels[type] = `${sourceLabel} · ${compactText || "복제본"}`;
      const rotation = numberStyle ? 0 : Number(source.rot || 0);
      const angle = rotation * Math.PI / 180;
      const localCenterX = (rendered.bounds.left + rendered.bounds.right) / 2;
      const localCenterY = (rendered.bounds.top + rendered.bounds.bottom) / 2;
      const prop = Object.assign(propDefaults(type, state.props.length), {
        x: source.x + localCenterX * Math.cos(angle) - localCenterY * Math.sin(angle) + 10,
        y: source.y + localCenterX * Math.sin(angle) + localCenterY * Math.cos(angle) + 10,
        scale: clamp(Math.max(rendered.logicalWidth, rendered.logicalHeight) / 140, .2, 2.5),
        rot: rotation,
        opacity: 1,
        hue: 0,
        saturation: 100,
        brightness: 100,
        front: true,
        customImage: true,
        generatedText: true,
        textSourceKind: kind,
        textRenderScale: Math.round(rendered.renderScale * 100) / 100
      });
      state.props.push(prop);
      selectLayer("prop", state.props.length - 1);
      syncControls();
      requestRender();
      commitMainChange(historyBefore);
      setStatus(`${sourceLabel} 추가 완료 · 원본과 독립적으로 편집할 수 있어.`);
      return true;
    } catch (error) {
      setStatus(`PNG 소품 만들기 실패 · ${error?.message || error}`, true);
      return false;
    } finally {
      if (button) button.disabled = false;
    }
  }

  function isSupportedImageFile(file) {
    if (!file) return false;
    if (["image/png", "image/webp", "image/jpeg"].includes(String(file.type || "").toLowerCase())) return true;
    return /\.(png|webp|jpe?g)$/i.test(String(file.name || ""));
  }

  function imageFromFile(file) {
    return new Promise((resolve, reject) => {
      if (!isSupportedImageFile(file)) {
        reject(new Error("PNG, WebP, JPEG 파일만 사용할 수 있어."));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error(`${file.name || "이미지"} 파일을 읽지 못했어.`));
      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`${file.name || "이미지"} 형식을 해석하지 못했어.`));
        img.src = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    });
  }

  function activateCustomBackground() {
    if (!state.background.customImg || !state.background.customImg.naturalWidth) return false;
    if (state.background.texture !== "custom") {
      state.background.customBackup = {
        texture: state.background.texture,
        modern: state.background.modern,
        surface: state.background.surface,
        motif: state.background.motif,
        variant: state.background.variant
      };
    }
    state.background.texture = "custom";
    state.background.modern = false;
    state.background.surface = "none";
    state.background.motif = "none";
    state.background.maskPaintMode = state.background.customSourceCanvas ? "original" : "theme";
    return true;
  }

  async function loadCustomBackground(event) {
    const input = event.currentTarget;
    const file = input.files && input.files[0];
    if (!file) return;
    const note = document.getElementById("sigBgUploadName");
    if (note) note.textContent = `${file.name} 읽는 중…`;
    try {
      const img = await imageFromFile(file);
      blurActiveSigEditorField();
      const historyBefore = beginMainChange();
      state.background.customImg = img;
      state.background.customSourceCanvas = fitImageToCanvas(img);
      state.background.maskCanvas = fitImageToMaskCanvas(img);
      state.background.mask = "alpha-custom";
      state.background.customName = file.name;
      activateCustomBackground();
      syncControls();
      requestRender();
      commitMainChange(historyBefore);
    } catch (error) {
      if (note) note.textContent = `불러오기 실패 · ${error.message || error}`;
    } finally {
      input.value = "";
    }
  }

  function clearCustomBackground() {
    const historyBefore = beginMainChange();
    const wasActive = state.background.texture === "custom";
    const backup = state.background.customBackup;
    state.background.customImg = null;
    state.background.customSourceCanvas = null;
    state.background.customName = "";
    state.background.customBackup = null;
    if (wasActive) {
      if (backup && backup.texture && backup.texture !== "custom") {
        Object.assign(state.background, backup);
      } else {
        const fallback = themes.find(theme => theme.key === "modernPeach");
        Object.assign(state.background, {
          texture: fallback.texture,
          modern: true,
          surface: fallback.surface,
          motif: fallback.motif,
          variant: 0
        });
      }
    }
    state.background.maskPaintMode = "theme";
    const input = document.getElementById("sigBgFile");
    if (input) input.value = "";
    syncControls();
    requestRender();
    commitMainChange(historyBefore);
  }

  async function loadCustomProps(event) {
    const input = event.currentTarget;
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const status = document.getElementById("sigPropUploadStatus");
    if (status) status.textContent = `${files.length}개 읽는 중…`;
    let added = 0;
    let failed = 0;
    const decoded = [];
    for (const file of files) {
      try {
        const img = await imageFromFile(file);
        decoded.push({ file, img });
      } catch {
        failed += 1;
      }
    }
    if (decoded.length) blurActiveSigEditorField();
    const historyBefore = decoded.length ? beginMainChange() : null;
    for (const item of decoded) {
      try {
        customPropSequence += 1;
        const type = `custom-prop-${Date.now()}-${customPropSequence}`;
        const label = String(item.file.name || "내 소품").replace(/\.[^.]+$/, "") || "내 소품";
        propImages[type] = item.img;
        propLabels[type] = `내 소품 · ${label}`;
        const prop = Object.assign(propDefaults(type, state.props.length), {
          x: 146 + (state.props.length % 3 - 1) * 22,
          y: 163,
          scale: .78,
          opacity: 1,
          customImage: true
        });
        state.props.push(prop);
        added += 1;
      } catch {
        failed += 1;
      }
    }
    input.value = "";
    if (added) {
      selectLayer("prop", state.props.length - 1);
      renderLayerList();
      syncPropControls();
      requestRender();
    }
    commitMainChange(historyBefore);
    if (status) {
      status.textContent = added
        ? `${added}개 추가${failed ? ` · ${failed}개 실패` : ""}`
        : "추가 실패 · PNG, WebP, JPEG인지 확인해줘";
    }
  }

  async function loadCharacter(event) {
    const input = event.currentTarget;
    const file = input.files && input.files[0];
    if (!file) return;
    const status = document.getElementById("sigCharStatus");
    status.textContent = `${file.name} 읽는 중…`;
    try {
      const img = await imageFromFile(file);
      blurActiveSigEditorField();
      const historyBefore = beginMainChange();
      state.character.img = img;
      state.character.name = file.name;
      state.character.scale = .96;
      selectLayer("character");
      syncControls();
      autoFitBackground(false);
      commitMainChange(historyBefore);
      status.textContent = `${file.name} 불러오기 완료`;
      status.classList.remove("warn");
    } catch (error) {
      status.textContent = `불러오기 실패 · ${error.message || error}`;
      status.classList.add("warn");
    } finally {
      input.value = "";
    }
  }

  function toggleDark() {
    const historyBefore = beginMainChange();
    state.previewDark = !state.previewDark;
    stage.classList.toggle("dark", state.previewDark);
    document.getElementById("sigDark").textContent = state.previewDark ? "밝은 화면" : "어두운 화면";
    commitMainChange(historyBefore);
  }

  function toggleGuides() {
    const historyBefore = beginMainChange();
    state.showGuides = !state.showGuides;
    document.getElementById("sigGuides").textContent = state.showGuides ? "가이드 숨김" : "가이드 표시";
    requestRender();
    commitMainChange(historyBefore);
  }

  function autoFitBackground(recordHistory = true) {
    if (isAlphaMask()) {
      showExportStatus("직접 그린 배경판은 ‘배경판 직접 그리기’에서 모양을 수정해.");
      return false;
    }
    const historyBefore = recordHistory ? beginMainChange() : null;
    const b = state.character.img ? characterBounds() : null;
    const phraseFrame = String(state.phrase.text || "").trim() ? selectionFrame({ kind: "phrase", index: -1 }) : null;
    const phraseAngle = Math.abs((phraseFrame?.rotation || 0) * Math.PI / 180);
    const phraseTop = phraseFrame
      ? phraseFrame.cy - Math.abs(Math.sin(phraseAngle)) * phraseFrame.width / 2 - Math.abs(Math.cos(phraseAngle)) * phraseFrame.height / 2
      : Infinity;
    const charTop = b ? b.y + Math.min(20, b.h * .1) : Infinity;
    const contentTop = Math.min(charTop, phraseTop);
    if (!Number.isFinite(contentTop)) {
      showExportStatus("맞춰 자를 캐릭터나 문구가 없어.");
      return false;
    }
    state.background.top = Math.round(clamp(contentTop - 8, 84, 112));
    if (state.background.mask === "full") state.background.mask = "wave";
    syncControls();
    requestRender();
    if (recordHistory) commitMainChange(historyBefore);
    return true;
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * W / rect.width,
      y: (event.clientY - rect.top) * H / rect.height
    };
  }

  function selectedTarget() {
    return layerTarget(state.selected);
  }

  function bindCanvasInteractions() {
    canvas.addEventListener("pointerdown", event => {
      blurActiveSigEditorField();
      event.preventDefault();
      const point = canvasPoint(event);
      const selectedRef = { kind: state.selected.kind, index: state.selected.index };
      if (resizeHandleHit(selectedRef, point)) {
        const target = layerTarget(selectedRef);
        dragging = {
          mode: "resize",
          pointerId: event.pointerId,
          ref: selectedRef,
          target,
          historyBefore: beginMainChange(),
          startDistance: Math.max(6, Math.hypot(point.x - target.x, point.y - target.y)),
          startScale: target.scale,
          startSize: target.size
        };
      } else {
        // 현재 선택한 레이어에 한해 투명 여백도 손잡이처럼 쓸 수 있다.
        // 잠그면 이 우선권이 사라져 투명/불투명 영역 모두 뒤 레이어로 통과한다.
        const picked = selectionFrameContains(selectedRef, point) ? selectedRef : pickLayerAt(point);
        if (!picked) {
          dragging = null;
          selectLayer("none", -1);
          return;
        }
        const historyBefore = beginMainChange();
        if (!sameLayerRef(picked, state.selected)) selectLayer(picked.kind, picked.index);
        const target = layerTarget(picked);
        dragging = { mode: "move", pointerId: event.pointerId, ref: picked, target, point, startX: target.x, startY: target.y, historyBefore };
      }
      try { canvas.setPointerCapture(event.pointerId); } catch (_) { /* WebView가 캡처를 거부해도 현재 영역 입력은 유지 */ }
    });
    canvas.addEventListener("pointermove", event => {
      const point = canvasPoint(event);
      if (!dragging) {
        canvas.style.cursor = resizeHandleHit(state.selected, point) ? "nwse-resize" : selectionFrameContains(state.selected, point) ? "move" : "grab";
        return;
      }
      if (event.pointerId !== dragging.pointerId || dragging.target.locked) return;
      canvas.style.cursor = dragging.mode === "resize" ? "nwse-resize" : "grabbing";
      const target = dragging.target;
      if (dragging.mode === "resize") {
        const ratio = Math.max(.05, Math.hypot(point.x - target.x, point.y - target.y) / dragging.startDistance);
        if (dragging.ref.kind === "character") target.scale = Math.round(clamp(dragging.startScale * ratio, .15, 2.2) * 100) / 100;
        else if (dragging.ref.kind === "prop") target.scale = Math.round(clamp(dragging.startScale * ratio, .2, 2.5) * 100) / 100;
        else if (dragging.ref.kind === "phrase") target.size = Math.round(clamp(dragging.startSize * ratio, 12, 64));
        syncResizedTarget(dragging.ref);
      } else {
        target.x = Math.round((dragging.startX + point.x - dragging.point.x) * 10) / 10;
        target.y = Math.round((dragging.startY + point.y - dragging.point.y) * 10) / 10;
        snapMovedLayer(dragging.ref, event.altKey);
        syncMovedTarget(dragging.ref);
      }
      requestRender();
    });
    const stop = event => {
      if (!dragging || (event?.pointerId != null && event.pointerId !== dragging.pointerId)) return;
      const completed = dragging;
      try { if (canvas.hasPointerCapture?.(completed.pointerId)) canvas.releasePointerCapture(completed.pointerId); } catch (_) { /* already released */ }
      dragging = null;
      activeSnapGuides = null;
      canvas.style.cursor = "grab";
      requestRender();
      commitMainChange(completed.historyBefore);
    };
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);
    canvas.addEventListener("lostpointercapture", event => {
      if (dragging && event.pointerId === dragging.pointerId) stop(event);
    });
    window.addEventListener("blur", () => {
      if (dragging) stop({ pointerId: dragging.pointerId });
    });
    canvas.addEventListener("pointerleave", () => { if (!dragging) canvas.style.cursor = "default"; });
    canvas.addEventListener("wheel", event => {
      event.preventDefault();
      const target = selectedTarget();
      if (!target || layerLocked()) return;
      const direction = event.deltaY > 0 ? -.03 : .03;
      if (state.selected.kind === "num1" || state.selected.kind === "num2") {
        return;
      }
      beginMainHistoryBurst();
      if (state.selected.kind === "phrase") {
        target.size = clamp(target.size + direction * 120, 12, 64);
      } else if (state.selected.kind === "character") {
        target.scale = clamp(target.scale + direction, .15, 2.2);
      } else {
        target.scale = clamp(target.scale + direction, .2, 2.5);
      }
      syncControls();
      requestRender();
    }, { passive: false });

    window.addEventListener("keydown", event => {
      if (!document.body.classList.contains("sigOn")) return;
      const activeTag = document.activeElement?.tagName || "";
      const textEditing = /INPUT|SELECT|TEXTAREA/.test(activeTag) || document.activeElement?.isContentEditable;
      const key = String(event.key || "").toLowerCase();
      if ((event.ctrlKey || event.metaKey) && !event.altKey && (key === "s" || key === "o")) {
        event.preventDefault();
        if (projectIoBusy) return;
        if (key === "s") saveSigProject();
        else openSigProject();
        return;
      }
      if (projectIoBusy) {
        if (event.ctrlKey || event.metaKey || ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
          event.preventDefault();
        }
        return;
      }
      if ((event.ctrlKey || event.metaKey) && !event.altKey && (key === "z" || key === "y")) {
        if (textEditing || document.body.classList.contains("sig-mask-editing")) return;
        event.preventDefault();
        if (key === "y" || (key === "z" && event.shiftKey)) mainRedo();
        else mainUndo();
        return;
      }
      if (textEditing) return;
      const target = selectedTarget();
      if (!target || layerLocked()) return;
      const step = event.shiftKey ? 5 : 1;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      beginMainHistoryBurst();
      if (event.key === "ArrowLeft") target.x -= step;
      else if (event.key === "ArrowRight") target.x += step;
      else if (event.key === "ArrowUp") target.y -= step;
      else if (event.key === "ArrowDown") target.y += step;
      event.preventDefault();
      syncMovedTarget(state.selected);
      requestRender();
    });
  }

  function syncMovedTarget(sel = state.selected) {
    const cap = value => Math.round(value * 10) / 10;
    if (sel.kind === "character") {
      document.getElementById("sigCharX").value = cap(state.character.x);
      document.getElementById("sigCharY").value = cap(state.character.y);
    } else if (sel.kind === "phrase") {
      document.getElementById("sigPhraseX").value = cap(state.phrase.x);
      document.getElementById("sigPhraseY").value = cap(state.phrase.y);
    } else if (sel.kind === "num1" || sel.kind === "num2") {
      const prefix = sel.kind === "num1" ? "sigNum1" : "sigNum2";
      document.getElementById(prefix + "X").value = cap(state[sel.kind].x);
      document.getElementById(prefix + "Y").value = cap(state[sel.kind].y);
    } else if (sel.kind === "prop") {
      syncPropControls();
    }
  }

  function syncResizedTarget(sel = state.selected) {
    if (sel.kind === "character") document.getElementById("sigCharScale").value = state.character.scale;
    else if (sel.kind === "phrase") document.getElementById("sigPhraseSize").value = state.phrase.size;
    else if (sel.kind === "prop") syncPropControls();
  }

  function drawContentWithoutNumbers(c, preview = false) {
    state.props.filter(prop => !prop.front).forEach(prop => drawProp(c, prop));
    drawCharacter(c, preview);
    drawOutlinedText(c, state.phrase.text, Object.assign({ enabled: true }, state.phrase), false);
    state.props.filter(prop => prop.front).forEach(prop => drawProp(c, prop));
  }

  function applyContentProfileTransform(c, profile, pivotX, pivotY, translateScale = 1) {
    c.translate(profile.x * translateScale, profile.y * translateScale);
    c.translate(pivotX, pivotY);
    c.scale(profile.scale, profile.scale);
    c.translate(-pivotX, -pivotY);
  }

  function profiledPoint(x, y, profile, pivotX, pivotY, translateScale = 1) {
    return {
      x: pivotX + (x - pivotX) * profile.scale + profile.x * translateScale,
      y: pivotY + (y - pivotY) * profile.scale + profile.y * translateScale
    };
  }

  function drawProfiledNumber(c, source, profile, pivotX, pivotY, size, mapPoint = point => point) {
    if (!source.enabled || !String(source.text || "").trim()) return;
    const base = mapPoint({ x: source.x, y: source.y });
    const point = profiledPoint(base.x, base.y, profile, pivotX, pivotY);
    drawOutlinedText(c, source.text, Object.assign({}, source, { x: point.x, y: point.y, size }), true);
  }

  function makeProfiledMobileCanvas(profile) {
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const outCtx = out.getContext("2d", { alpha: true });
    outCtx.clearRect(0, 0, W, H);
    drawBackground(outCtx, state.background, true);
    outCtx.save();
    applyContentProfileTransform(outCtx, profile, W / 2, H);
    drawContentWithoutNumbers(outCtx, false);
    outCtx.restore();
    drawProfiledNumber(outCtx, state.num1, profile, W / 2, H, MOBILE_NUMBER_SIZE);
    drawProfiledNumber(outCtx, state.num2, profile, W / 2, H, MOBILE_NUMBER_SIZE);
    outCtx.clearRect(0, 0, W, H - CONTENT_H);
    return out;
  }

  function makeMasterCanvas() {
    const profile = outputProfile("mobile");
    if (!outputProfileIsIdentity(profile)) return makeProfiledMobileCanvas(profile);
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const outCtx = out.getContext("2d", { alpha: true });
    renderTo(outCtx, { preview: false, showSelection: false });
    // SOOP 모바일 가이드의 수정 불가 상단 84px은 어떤 레이어를 올려도 저장 때 비운다.
    outCtx.clearRect(0, 0, W, H - CONTENT_H);
    return out;
  }

  /* ── PC(195×145) 공식 구성 — SOOP 공식 PSD 템플릿 실측 ─────────────────
     아트 허용 영역은 위 0~109px 전폭, 하단은 채팅 글자가 앉는 "빈 흰 말풍선"
     (x5,y109~x190,y144 · #F0F0F0 위로 살짝 밝은 그라데이션 · 라운드 3px · 불투명).
     이 말풍선이 없으면 심사에서 반려된다(실반려: "PC이미지 하단에는 하얀색
     말풍선이 필요합니다"). 말풍선 안은 SOOP이 채우므로 우리 내용이 침범하면 안 됨. */
  const PC_ART_H = 109;
  const PC_BUBBLE = { x: 5, y: 109, w: 185, h: 35, r: 3 };
  function drawPcBubble(ctx) {
    const { x, y, w, h, r } = PC_BUBBLE;
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "#f3f3f3");
    g.addColorStop(1, "#f0f0f0");
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
  }
  function makePcCanvas(master) {
    const profile = outputProfile("pc");
    if (!outputProfileIsIdentity(profile)) {
      const out = document.createElement("canvas");
      out.width = 195;
      out.height = 145;
      const outCtx = out.getContext("2d", { alpha: true });
      const baseScale = Math.min(out.width / W, PC_ART_H / CONTENT_H);
      const drawW = W * baseScale;
      const drawH = CONTENT_H * baseScale;
      const offsetX = (out.width - drawW) / 2;
      const offsetY = PC_ART_H - drawH;
      outCtx.clearRect(0, 0, out.width, out.height);
      outCtx.imageSmoothingEnabled = true;
      outCtx.imageSmoothingQuality = "high";
      drawPcBubble(outCtx);

      // Identity 출력처럼 배경도 먼저 293×248 논리 작업면에 렌더한 뒤 같은 비율로
      // 축소한다(내용부만 잘라 아트 영역 0~109px 에). 출력별 내용 보정은 별도
      // 투명 레이어에만 적용해 배경 픽셀을 고정한다.
      const backgroundOnly = createLogicalCanvas();
      drawBackground(backgroundOnly.getContext("2d", { alpha: true }), state.background, true);
      outCtx.drawImage(backgroundOnly, 0, H - CONTENT_H, W, CONTENT_H, offsetX, offsetY, drawW, drawH);

      const contentOnly = createLogicalCanvas();
      const contentCtx = contentOnly.getContext("2d", { alpha: true });
      contentCtx.save();
      applyContentProfileTransform(contentCtx, profile, W / 2, H, 1 / baseScale);
      drawContentWithoutNumbers(contentCtx, false);
      contentCtx.restore();
      outCtx.drawImage(contentOnly, 0, H - CONTENT_H, W, CONTENT_H, offsetX, offsetY, drawW, drawH);
      const mapPcPoint = point => ({
        x: offsetX + point.x * baseScale,
        /* 숫자(중앙 앵커)는 아트 영역 안으로 — 말풍선 칸은 항상 비워 둔다(심사 기준) */
        y: Math.min(offsetY + (point.y - (H - CONTENT_H)) * baseScale, PC_ART_H - PC_NUMBER_SIZE * 0.65)
      });
      drawProfiledNumber(outCtx, state.num1, profile, out.width / 2, out.height, PC_NUMBER_SIZE, mapPcPoint);
      drawProfiledNumber(outCtx, state.num2, profile, out.width / 2, out.height, PC_NUMBER_SIZE, mapPcPoint);
      return out;
    }
    const out = document.createElement("canvas");
    out.width = 195;
    out.height = 145;
    const outCtx = out.getContext("2d", { alpha: true });
    outCtx.clearRect(0, 0, out.width, out.height);

    // 배경·캐릭터·문구는 같은 구성으로 축소하되, 숫자는 PC 공식 38pt로 다시 그린다.
    // 모바일 완성본을 통째로 줄이면 55pt 숫자가 약 32pt가 되어 공식 규격을 벗어난다.
    const withoutNumbers = document.createElement("canvas");
    withoutNumbers.width = W;
    withoutNumbers.height = H;
    renderTo(withoutNumbers.getContext("2d", { alpha: true }), {
      preview: false,
      showSelection: false,
      skipNumbers: true
    });
    // 마스터의 내용부(상단 84px 여백 아래 CONTENT_H)를 아트 영역(0~109px)에
    // contain으로 넣고 밑변을 말풍선 위에 붙인다. 말풍선을 먼저 깔아 아트가 위에 온다.
    const scale = Math.min(out.width / W, PC_ART_H / CONTENT_H);
    const drawW = W * scale;
    const drawH = CONTENT_H * scale;
    const offsetX = (out.width - drawW) / 2;
    const offsetY = PC_ART_H - drawH;
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = "high";
    drawPcBubble(outCtx);
    outCtx.drawImage(withoutNumbers, 0, H - CONTENT_H, W, CONTENT_H, offsetX, offsetY, drawW, drawH);

    const pcLayer = layer => Object.assign({}, layer, {
      x: offsetX + layer.x * scale,
      /* 숫자(중앙 앵커)는 아트 영역 안으로 — 말풍선 칸은 항상 비워 둔다(심사 기준) */
      y: Math.min(offsetY + (layer.y - (H - CONTENT_H)) * scale, PC_ART_H - PC_NUMBER_SIZE * 0.65),
      size: PC_NUMBER_SIZE,
      rot: 0
    });
    drawOutlinedText(outCtx, state.num1.text, pcLayer(state.num1), true);
    drawOutlinedText(outCtx, state.num2.text, pcLayer(state.num2), true);
    return out;
  }

  function makeWeflabCanvas() {
    const profile = outputProfile("weflab");
    if (!outputProfileIsIdentity(profile)) {
      const work = document.createElement("canvas");
      work.width = WEFLAB_WIDTH * WEFLAB_RENDER_SCALE;
      work.height = WEFLAB_HEIGHT * WEFLAB_RENDER_SCALE;
      const workCtx = work.getContext("2d", { alpha: true });
      const baseScale = Math.min(work.width / W, work.height / CONTENT_H);
      const tx = (work.width - W * baseScale) / 2;
      const ty = (work.height - CONTENT_H * baseScale) / 2 - (H - CONTENT_H) * baseScale;
      const pivotLogicalX = (work.width / 2 - tx) / baseScale;
      const pivotLogicalY = (work.height - ty) / baseScale;
      workCtx.setTransform(baseScale, 0, 0, baseScale, tx, ty);
      drawBackground(workCtx, state.background, true);
      workCtx.save();
      applyContentProfileTransform(workCtx, profile, pivotLogicalX, pivotLogicalY, WEFLAB_RENDER_SCALE / baseScale);
      drawContentWithoutNumbers(workCtx, false);
      workCtx.restore();
      const adjustedNumber = source => {
        const baseX = tx + source.x * baseScale;
        const baseY = ty + source.y * baseScale;
        const point = profiledPoint(baseX, baseY, profile, work.width / 2, work.height, WEFLAB_RENDER_SCALE);
        return Object.assign({}, source, { x: (point.x - tx) / baseScale, y: (point.y - ty) / baseScale, size: MOBILE_NUMBER_SIZE });
      };
      drawOutlinedText(workCtx, state.num1.text, adjustedNumber(state.num1), true);
      drawOutlinedText(workCtx, state.num2.text, adjustedNumber(state.num2), true);
      const out = document.createElement("canvas");
      out.width = WEFLAB_WIDTH;
      out.height = WEFLAB_HEIGHT;
      const outCtx = out.getContext("2d", { alpha: true });
      outCtx.imageSmoothingEnabled = true;
      outCtx.imageSmoothingQuality = "high";
      outCtx.drawImage(work, 0, 0, out.width, out.height);
      return out;
    }
    // SOOP 결과 비트맵을 확대하지 않고 state와 원본 레이어를 2배 작업면에 다시 렌더한다.
    const work = document.createElement("canvas");
    work.width = WEFLAB_WIDTH * WEFLAB_RENDER_SCALE;
    work.height = WEFLAB_HEIGHT * WEFLAB_RENDER_SCALE;
    const workCtx = work.getContext("2d", { alpha: true });
    const scale = Math.min(work.width / W, work.height / CONTENT_H);
    const tx = (work.width - W * scale) / 2;
    const ty = (work.height - CONTENT_H * scale) / 2 - (H - CONTENT_H) * scale;
    workCtx.setTransform(scale, 0, 0, scale, tx, ty);
    renderTo(workCtx, { preview: false, showSelection: false });

    const out = document.createElement("canvas");
    out.width = WEFLAB_WIDTH;
    out.height = WEFLAB_HEIGHT;
    const outCtx = out.getContext("2d", { alpha: true });
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = "high";
    outCtx.drawImage(work, 0, 0, out.width, out.height);
    return out;
  }

  function inspectCanvasAlpha(target, safeTopRows = 0) {
    const data = target.getContext("2d", { alpha: true, willReadFrequently: true })
      .getImageData(0, 0, target.width, target.height).data;
    let alphaMin = 255;
    let alphaMax = 0;
    let nonTransparentPixels = 0;
    let safeTopNonTransparentPixels = 0;
    for (let p = 3, pixel = 0; p < data.length; p += 4, pixel++) {
      const alpha = data[p];
      alphaMin = Math.min(alphaMin, alpha);
      alphaMax = Math.max(alphaMax, alpha);
      if (!alpha) continue;
      nonTransparentPixels++;
      if (safeTopRows && Math.floor(pixel / target.width) < safeTopRows) safeTopNonTransparentPixels++;
    }
    return { alphaMin, alphaMax, nonTransparentPixels, safeTopNonTransparentPixels };
  }

  function inspectCanvasPixels(target) {
    const data = target.getContext("2d", { alpha: true, willReadFrequently: true })
      .getImageData(0, 0, target.width, target.height).data;
    let checksum = 2166136261;
    let alphaChecksum = 2166136261;
    for (let index = 0; index < data.length; index++) {
      checksum = Math.imul(checksum ^ data[index], 16777619) >>> 0;
      if ((index & 3) === 3) alphaChecksum = Math.imul(alphaChecksum ^ data[index], 16777619) >>> 0;
    }
    return {
      width: target.width,
      height: target.height,
      checksum: checksum.toString(16).padStart(8, "0"),
      alphaChecksum: alphaChecksum.toString(16).padStart(8, "0")
    };
  }

  function validateOutputCanvas(type, target) {
    const expected = type === "mobile"
      ? { width: 293, height: 248, safeTopRows: 84, transparentRequired: true }
      : type === "pc"
        ? { width: 195, height: 145, safeTopRows: 0, transparentRequired: true }
        : { width: WEFLAB_WIDTH, height: WEFLAB_HEIGHT, safeTopRows: 0, transparentRequired: false };
    if (target.width !== expected.width || target.height !== expected.height) {
      throw new Error(`${type} 출력 치수가 ${expected.width}×${expected.height}가 아니야.`);
    }
    const alpha = inspectCanvasAlpha(target, expected.safeTopRows);
    if (!alpha.nonTransparentPixels) throw new Error(`${type} 출력에 보이는 내용이 없어.`);
    if (expected.transparentRequired && alpha.alphaMin !== 0) throw new Error(`${type} 출력에 투명 배경이 없어.`);
    if (alpha.safeTopNonTransparentPixels) throw new Error("모바일 상단 84px 안전영역에 내용이 남아 있어.");
    if (type === "pc") {
      /* PC는 하단 흰 말풍선이 항상 그려져 전체 픽셀 검사가 무의미하다 —
         아트 영역(위 0~109px)에 내용이 있는지 따로 확인해, 빈판+콘텐츠 전무 상태의
         '말풍선만 있는 PNG'(심사 반려각)가 무경고로 저장되지 않게 한다 */
      const artCtx = target.getContext("2d", { willReadFrequently: true });
      const art = artCtx.getImageData(0, 0, target.width, PC_ART_H).data;
      let artPixels = 0;
      for (let i = 3; i < art.length; i += 4) if (art[i] > 0) artPixels++;
      if (!artPixels) throw new Error("pc 출력의 아트 영역이 비어 있어. 캐릭터나 문구·소품을 하나는 넣어줘.");
    }
    return alpha;
  }

  function canvasBlob(target) {
    return new Promise(resolve => target.toBlob(resolve, "image/png"));
  }

  function quantizeCanvas(source, step, pixelRatio = 1) {
    const temp = document.createElement("canvas");
    temp.width = source.width;
    temp.height = source.height;
    const tempCtx = temp.getContext("2d", { alpha: true, willReadFrequently: true });
    tempCtx.clearRect(0, 0, temp.width, temp.height);
    if (pixelRatio < 1) {
      const small = document.createElement("canvas");
      small.width = Math.max(1, Math.round(source.width * pixelRatio));
      small.height = Math.max(1, Math.round(source.height * pixelRatio));
      const smallCtx = small.getContext("2d", { alpha: true });
      smallCtx.drawImage(source, 0, 0, small.width, small.height);
      tempCtx.imageSmoothingEnabled = false;
      tempCtx.drawImage(small, 0, 0, temp.width, temp.height);
    } else {
      tempCtx.drawImage(source, 0, 0);
    }
    const image = tempCtx.getImageData(0, 0, temp.width, temp.height);
    const data = image.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 10) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0;
        continue;
      }
      const isOfficialNumberColor =
        (data[i] === 255 && data[i + 1] === 0 && data[i + 2] === 0) ||
        (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) ||
        (data[i] <= 17 && data[i + 1] <= 17 && data[i + 2] <= 17);
      if (!isOfficialNumberColor) {
        data[i] = Math.round(data[i] / step) * step;
        data[i + 1] = Math.round(data[i + 1] / step) * step;
        data[i + 2] = Math.round(data[i + 2] / step) * step;
      }
      data[i + 3] = Math.round(data[i + 3] / Math.max(8, step / 2)) * Math.max(8, step / 2);
    }
    tempCtx.putImageData(image, 0, 0);
    return temp;
  }

  /* ── 50KB 팔레트 PNG ─────────────────────────────────────────────
     canvas.toBlob 의 트루컬러 PNG는 그라데이션 아트에서 50KB를 훌쩍 넘고,
     예전 step 양자화는 디더링이 없어 띠·블록 깨짐이 그대로 보였다(실고객 리포트 —
     모바일 버전 깨짐). 미디언컷 256색 + 가벼운 Floyd–Steinberg 디더로 진짜
     8비트 팔레트 PNG를 만든다. 압축은 브라우저 내장 CompressionStream('deflate')
     — 고객 exe(WebView2)와 크롬 계열엔 항상 있고, 없으면 예전 방식으로 폴백.
     공식 숫자 색(빨강·흰·#111 테두리)은 팔레트에 고정하고 디더 오차도 안 섞는다. */
  const PNG_CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function pngCrc(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = PNG_CRC_TABLE[(c ^ bytes[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function pngChunk(type, data) {
    const out = new Uint8Array(12 + data.length);
    const dv = new DataView(out.buffer);
    dv.setUint32(0, data.length);
    for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
    out.set(data, 8);
    dv.setUint32(8 + data.length, pngCrc(out.subarray(4, 8 + data.length)));
    return out;
  }
  async function deflateZlib(bytes) {
    const cs = new CompressionStream("deflate");
    const stream = new Blob([bytes]).stream().pipeThrough(cs);
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  function isOfficialColor(r, g, b) {
    return (r === 255 && g === 0 && b === 0) ||
      (r === 255 && g === 255 && b === 255) ||
      (r <= 17 && g <= 17 && b <= 17);
  }
  function buildPalette(data, maxColors) {
    /* 알파 포함 4차원 미디언컷. 0번은 완전투명 예약석, 공식 숫자 3색도 예약석. */
    const px = [];
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 10) continue;
      if (a > 245 && isOfficialColor(data[i], data[i + 1], data[i + 2])) continue;
      px.push([data[i], data[i + 1], data[i + 2], a]);
    }
    const reserved = [[0, 0, 0, 0], [255, 0, 0, 255], [255, 255, 255, 255], [17, 17, 17, 255]];
    const budget = Math.max(8, maxColors - reserved.length);
    let boxes = px.length ? [px] : [];
    while (boxes.length < budget) {
      let bi = -1, bw = 0;
      for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].length < 2) continue;
        const mn = [255, 255, 255, 255], mx = [0, 0, 0, 0];
        for (const p of boxes[i]) for (let c = 0; c < 4; c++) {
          if (p[c] < mn[c]) mn[c] = p[c];
          if (p[c] > mx[c]) mx[c] = p[c];
        }
        const spread = Math.max(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2], (mx[3] - mn[3]) * .5) *
          Math.log2(boxes[i].length + 1);
        if (spread > bw) { bw = spread; bi = i; }
      }
      if (bi < 0) break;
      const box = boxes[bi];
      const mn = [255, 255, 255, 255], mx = [0, 0, 0, 0];
      for (const p of box) for (let c = 0; c < 4; c++) {
        if (p[c] < mn[c]) mn[c] = p[c];
        if (p[c] > mx[c]) mx[c] = p[c];
      }
      let axis = 0, best = -1;
      for (let c = 0; c < 4; c++) {
        const s = (mx[c] - mn[c]) * (c === 3 ? .5 : 1);
        if (s > best) { best = s; axis = c; }
      }
      box.sort((a, b) => a[axis] - b[axis]);
      const mid = box.length >> 1;
      boxes.splice(bi, 1, box.slice(0, mid), box.slice(mid));
    }
    const pal = reserved.slice();
    for (const box of boxes) {
      if (!box.length) continue;
      let r = 0, g = 0, b = 0, a = 0;
      for (const p of box) { r += p[0]; g += p[1]; b += p[2]; a += p[3]; }
      const n = box.length;
      pal.push([Math.round(r / n), Math.round(g / n), Math.round(b / n), Math.round(a / n)]);
    }
    return pal.slice(0, maxColors);
  }
  async function paletteQuantizedPng(source, maxColors, ditherStrength, shared) {
    if (typeof CompressionStream !== "function") return null;
    const w = source.width, h = source.height;
    /* shared: 색 수를 바꿔가며 여러 번 시도할 때 픽셀 추출·팔레트 계산을 재사용
       (같은 소스·같은 색 수면 결과 완전 동일 — 계산만 아낀다) */
    let img = shared && shared.img;
    if (!img) {
      const work = document.createElement("canvas");
      work.width = w; work.height = h;
      const wc = work.getContext("2d", { alpha: true, willReadFrequently: true });
      wc.drawImage(source, 0, 0);
      img = wc.getImageData(0, 0, w, h);
      if (shared) shared.img = img;
    }
    const data = img.data;
    let pal = shared && shared.pals && shared.pals[maxColors];
    if (!pal) {
      pal = buildPalette(data, maxColors);
      if (shared) (shared.pals = shared.pals || {})[maxColors] = pal;
    }
    const palLen = pal.length;
    const cache = new Map();
    const nearest = (r, g, b, a) => {
      const key = ((r >> 2) << 18) | ((g >> 2) << 12) | ((b >> 2) << 6) | (a >> 2);
      let idx = cache.get(key);
      if (idx !== undefined) return idx;
      let bd = Infinity; idx = 0;
      for (let i = 0; i < palLen; i++) {
        const p = pal[i];
        const dr = r - p[0], dg = g - p[1], db = b - p[2], da = (a - p[3]) * 2;
        const d = dr * dr + dg * dg + db * db + da * da;
        if (d < bd) { bd = d; idx = i; }
      }
      cache.set(key, idx);
      return idx;
    };
    const idxBuf = new Uint8Array(w * h);
    let curR = new Float32Array(w + 2), curG = new Float32Array(w + 2), curB = new Float32Array(w + 2);
    let nxtR = new Float32Array(w + 2), nxtG = new Float32Array(w + 2), nxtB = new Float32Array(w + 2);
    const cl = v => v < 0 ? 0 : v > 255 ? 255 : v;
    for (let y = 0; y < h; y++) {
      nxtR.fill(0); nxtG.fill(0); nxtB.fill(0);
      for (let x = 0; x < w; x++) {
        const o = (y * w + x) * 4;
        const a0 = data[o + 3];
        if (a0 < 10) { idxBuf[y * w + x] = 0; continue; }
        const r0 = data[o], g0 = data[o + 1], b0 = data[o + 2];
        if (a0 > 245 && isOfficialColor(r0, g0, b0)) {
          idxBuf[y * w + x] = nearest(r0, g0, b0, 255);
          continue;
        }
        const r = cl(r0 + curR[x + 1]), g = cl(g0 + curG[x + 1]), b = cl(b0 + curB[x + 1]);
        const pi = nearest(r, g, b, a0);
        idxBuf[y * w + x] = pi;
        const p = pal[pi];
        const er = (r - p[0]) * ditherStrength, eg = (g - p[1]) * ditherStrength, eb = (b - p[2]) * ditherStrength;
        curR[x + 2] += er * 7 / 16; curG[x + 2] += eg * 7 / 16; curB[x + 2] += eb * 7 / 16;
        nxtR[x] += er * 3 / 16; nxtG[x] += eg * 3 / 16; nxtB[x] += eb * 3 / 16;
        nxtR[x + 1] += er * 5 / 16; nxtG[x + 1] += eg * 5 / 16; nxtB[x + 1] += eb * 5 / 16;
        nxtR[x + 2] += er * 1 / 16; nxtG[x + 2] += eg * 1 / 16; nxtB[x + 2] += eb * 1 / 16;
      }
      const tr = curR; curR = nxtR; nxtR = tr;
      const tg = curG; curG = nxtG; nxtG = tg;
      const tb = curB; curB = nxtB; nxtB = tb;
    }
    const raw = new Uint8Array(h * (w + 1));
    for (let y = 0; y < h; y++) {
      raw[y * (w + 1)] = 0;
      raw.set(idxBuf.subarray(y * w, y * w + w), y * (w + 1) + 1);
    }
    const idat = await deflateZlib(raw);
    const ihdr = new Uint8Array(13);
    const dv = new DataView(ihdr.buffer);
    dv.setUint32(0, w); dv.setUint32(4, h);
    ihdr[8] = 8; ihdr[9] = 3;   /* 8비트 · 팔레트 */
    const plte = new Uint8Array(palLen * 3);
    const trns = new Uint8Array(palLen);
    pal.forEach((p, i) => { plte[i * 3] = p[0]; plte[i * 3 + 1] = p[1]; plte[i * 3 + 2] = p[2]; trns[i] = p[3]; });
    const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const blob = new Blob([sig, pngChunk("IHDR", ihdr), pngChunk("PLTE", plte),
      pngChunk("tRNS", trns), pngChunk("IDAT", idat), pngChunk("IEND", new Uint8Array(0))], { type: "image/png" });
    /* 미리보기·후속 검증용 캔버스도 실제 양자화 픽셀로 복원해 파일과 화면을 일치시킨다 */
    const outImg = new ImageData(w, h); /* wc 없이도 동작(shared 재사용 경로) */
    for (let i = 0; i < idxBuf.length; i++) {
      const p = pal[idxBuf[i]];
      outImg.data[i * 4] = p[0]; outImg.data[i * 4 + 1] = p[1];
      outImg.data[i * 4 + 2] = p[2]; outImg.data[i * 4 + 3] = p[3];
    }
    const outCv = document.createElement("canvas");
    outCv.width = w; outCv.height = h;
    outCv.getContext("2d", { alpha: true }).putImageData(outImg, 0, 0);
    return { blob, canvas: outCv };
  }

  async function optimizedPng(source) {
    let bestBlob = await canvasBlob(source);
    let bestCanvas = source;
    if (bestBlob.size <= KB_LIMIT) return { blob: bestBlob, canvas: bestCanvas };
    /* 1순위: 팔레트 PNG — 디더를 줄이고 색을 줄여가며 50KB 안에 넣는다 */
    const palettePlans = [[256, .72], [256, .5], [192, .5], [128, .45], [96, .4], [64, .35]];
    const shared = {}; /* 플랜 간 픽셀·팔레트 재사용 — 같은 팔레트 2회 재계산 제거 */
    for (const [colors, dither] of palettePlans) {
      let candidate = null;
      try { candidate = await paletteQuantizedPng(source, colors, dither, shared); } catch (e) { candidate = null; }
      if (!candidate) break;   /* CompressionStream 없음 등 — 예전 방식으로 */
      if (candidate.blob.size < bestBlob.size) { bestBlob = candidate.blob; bestCanvas = candidate.canvas; }
      if (candidate.blob.size <= KB_LIMIT) return { blob: bestBlob, canvas: bestCanvas };
    }
    /* 마지막 안전판: 예전 step 양자화(팔레트 경로가 안 되는 환경 전용) */
    const attempts = [
      [12, 1], [20, 1], [28, 1], [36, 1],
      [44, .92], [56, .86], [72, .78], [96, .7]
    ];
    for (const [step, ratio] of attempts) {
      const candidate = quantizeCanvas(source, step, ratio);
      const blob = await canvasBlob(candidate);
      if (blob.size < bestBlob.size) {
        bestBlob = blob;
        bestCanvas = candidate;
      }
      if (blob.size <= KB_LIMIT) break;
    }
    return { blob: bestBlob, canvas: bestCanvas };
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function base64ToBlob(b64, mime = "image/png") {
    const binary = atob(String(b64 || ""));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  async function prepareSoopCanvas(source, variant) {
    validateOutputCanvas(variant, source);
    const api = window.pywebview && window.pywebview.api;
    if (api && typeof api.optimize_soop_png === "function") {
      const result = parseApiResult(await api.optimize_soop_png(JSON.stringify({
        variant,
        dataUrl: source.toDataURL("image/png")
      })));
      if (!result.ok || !result.withinLimit || !result.b64) {
        throw new Error(result.err || "50,000바이트 안에서 품질을 유지하지 못했어. 배경 패턴이나 소품 수를 조금 줄여줘.");
      }
      const blob = base64ToBlob(result.b64);
      if (blob.size > KB_LIMIT) throw new Error(`${variant} PNG가 50,000바이트를 넘었어.`);
      return { blob, method: result.method || "app-optimizer", meta: result };
    }
    const fallback = await optimizedPng(source);
    if (fallback.blob.size > KB_LIMIT) {
      /* v16 exe에선 이 폴백이 기본 경로라 '실행본이 필요하다'는 안내는 자기모순 —
         고객이 실제로 할 수 있는 해결책을 알려준다 */
      throw new Error("이미지가 너무 복잡해 50,000바이트 안에 못 들어갔어. 배경 패턴이나 소품 수를 조금 줄이고 다시 저장해줘.");
    }
    return { blob: fallback.blob, method: "browser-fallback", meta: null };
  }

  async function prepareWeflabCanvas(source) {
    validateOutputCanvas("weflab", source);
    const api = window.pywebview && window.pywebview.api;
    if (api && typeof api.prepare_weflab_png === "function") {
      const result = parseApiResult(await api.prepare_weflab_png(JSON.stringify({
        dataUrl: source.toDataURL("image/png")
      })));
      if (!result.ok || !result.b64) throw new Error(result.err || "위플랩 고화질 PNG를 준비하지 못했어.");
      const blob = base64ToBlob(result.b64);
      if (blob.size > WEFLAB_UPLOAD_LIMIT) throw new Error("위플랩 PNG가 업로드 한도 10MB를 넘었어.");
      return { blob, method: result.method || "lossless-rgba", meta: result };
    }
    const blob = await canvasBlob(source);
    if (!blob || blob.size > WEFLAB_UPLOAD_LIMIT) throw new Error("위플랩 PNG가 업로드 한도 10MB를 넘었어.");
    return { blob, method: "canvas-lossless", meta: null };
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function showExportStatus(message, warn = false) {
    const status = document.getElementById("sigExportStatus");
    status.textContent = message;
    status.classList.add("show");
    status.classList.toggle("warn", warn);
  }

  function parseApiResult(value) {
    if (typeof value !== "string") return value || {};
    const trimmed = value.trim();
    if (!trimmed) return {};
    try {
      return JSON.parse(trimmed);
    } catch {
      return { value: trimmed };
    }
  }

  function normalizeExportBaseName(value) {
    let name = String(value || "").trim().replace(/\.(?:png|pbsig(?:\.json)?)$/i, "");
    name = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").replace(/[. ]+$/g, "").trim();
    return (name || SIG_DEFAULT_EXPORT_BASE).slice(0, 80);
  }

  function cloneFiniteJson(value, path = "project", depth = 0) {
    if (depth > 80) throw new Error(`${path} 구조가 너무 깊어.`);
    if (value === null || typeof value === "string" || typeof value === "boolean") return value;
    if (typeof value === "number") {
      if (!Number.isFinite(value)) throw new Error(`${path}에 저장할 수 없는 숫자가 있어.`);
      return value;
    }
    if (Array.isArray(value)) return value.map((item, index) => cloneFiniteJson(item, `${path}[${index}]`, depth + 1));
    if (!value || typeof value !== "object" || Object.prototype.toString.call(value) !== "[object Object]") {
      throw new Error(`${path}에 저장할 수 없는 값이 있어.`);
    }
    const out = {};
    Object.keys(value).forEach(key => {
      if (["__proto__", "prototype", "constructor"].includes(key)) throw new Error(`${path}에 안전하지 않은 키가 있어.`);
      const item = value[key];
      if (item !== undefined) out[key] = cloneFiniteJson(item, `${path}.${key}`, depth + 1);
    });
    return out;
  }

  function imageDataUrl(image, label = "이미지") {
    if (!image) throw new Error(`${label} 자산이 없어.`);
    const source = String(image.currentSrc || image.src || "");
    if (/^data:image\/(?:png|jpeg|webp|gif|bmp);base64,[A-Za-z0-9+/]+=*$/i.test(source)) return source;
    const width = Number(image.naturalWidth || image.width);
    const height = Number(image.naturalHeight || image.height);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width * height > 50_000_000) {
      throw new Error(`${label} 크기가 올바르지 않아.`);
    }
    const raster = document.createElement("canvas");
    raster.width = width;
    raster.height = height;
    raster.getContext("2d", { alpha: true }).drawImage(image, 0, 0, width, height);
    return raster.toDataURL("image/png");
  }

  function canvasProjectRef(canvasSource, addAsset, label, metadata = null) {
    if (!canvasSource) return null;
    const width = Number(canvasSource.width);
    const height = Number(canvasSource.height);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width * height > 50_000_000) {
      throw new Error(`${label} 캔버스 크기가 올바르지 않아.`);
    }
    return Object.assign({ assetId: addAsset(canvasSource.toDataURL("image/png")), width, height }, metadata || {});
  }

  async function serializeSigProject() {
    commitOutputProfileEdit();
    flushMainHistoryBurst();
    blurActiveSigEditorField();
    const assets = {};
    const assetByDataUrl = new Map();
    let assetSequence = 0;
    const addAsset = dataUrl => {
      const value = String(dataUrl || "");
      if (!/^data:(?:image\/(?:png|jpeg|webp|gif|bmp)|font\/(?:ttf|otf|woff|woff2));base64,/i.test(value)) {
        throw new Error("프로젝트에 지원하지 않는 자산 형식이 있어.");
      }
      if (assetByDataUrl.has(value)) return assetByDataUrl.get(value);
      const id = `asset-${String(++assetSequence).padStart(4, "0")}`;
      assets[id] = value;
      assetByDataUrl.set(value, id);
      return id;
    };

    const { customImg, customSourceCanvas, maskCanvas, ...backgroundPlain } = state.background;
    const { img: characterImage, ...characterPlain } = state.character;
    const projectState = cloneFiniteJson({
      presetIndex: state.presetIndex,
      placementIndex: state.placementIndex,
      background: backgroundPlain,
      character: characterPlain,
      phrase: state.phrase,
      num1: state.num1,
      num2: state.num2,
      props: state.props,
      outputProfiles: state.outputProfiles,
      selected: state.selected,
      snapEnabled: state.snapEnabled !== false,
      showGuides: state.showGuides !== false,
      previewDark: !!state.previewDark,
      exportBaseName: String(state.exportBaseName || SIG_DEFAULT_EXPORT_BASE)
    }, "project.state");

    const refs = {
      character: characterImage ? { assetId: addAsset(imageDataUrl(characterImage, "캐릭터")) } : null,
      background: {
        original: customImg ? { assetId: addAsset(imageDataUrl(customImg, "커스텀 배경 원본")) } : null,
        source: canvasProjectRef(customSourceCanvas, addAsset, "커스텀 배경"),
        mask: canvasProjectRef(maskCanvas, addAsset, "배경 마스크", maskCanvas ? { maskScale: MASK_SCALE } : null)
      },
      props: [],
      fonts: []
    };

    const customTypes = new Set();
    state.props.forEach(prop => {
      if (!prop.customImage || customTypes.has(prop.type)) return;
      const image = propImages[prop.type];
      if (!image) throw new Error(`${propLabels[prop.type] || prop.type} 소품 원본을 찾지 못했어.`);
      customTypes.add(prop.type);
      refs.props.push({
        type: String(prop.type),
        assetId: addAsset(imageDataUrl(image, propLabels[prop.type] || "소품")),
        label: String(propLabels[prop.type] || prop.type),
        kind: prop.generatedText ? "baked-text" : "custom-image"
      });
    });

    customPhraseFonts.forEach(record => {
      if (!record.dataUrl || !record.mime) throw new Error(`${record.label || "사용자 글꼴"} 원본 데이터가 없어 프로젝트로 저장할 수 없어.`);
      refs.fonts.push({
        key: String(record.key),
        assetId: addAsset(record.dataUrl),
        label: String(record.label || "내 글꼴"),
        fileName: String(record.fileName || ""),
        mime: String(record.mime)
      });
    });

    return {
      schemaVersion: SIG_PROJECT_SCHEMA_VERSION,
      name: `${normalizeExportBaseName(state.exportBaseName)}.pbsig`,
      project: {
        projectVersion: SIG_PROJECT_VERSION,
        savedAt: new Date().toISOString(),
        canvas: { width: W, height: H, dpr: DPR, maskScale: MASK_SCALE, maskWidth: MASK_W, maskHeight: MASK_H },
        state: projectState,
        refs
      },
      assets
    };
  }

  function assertPlainProjectObject(value, label) {
    if (!value || typeof value !== "object" || Array.isArray(value) || Object.prototype.toString.call(value) !== "[object Object]") {
      throw new Error(`${label} 형식이 올바르지 않아.`);
    }
    return value;
  }

  function projectAssetData(assets, ref, label, kind = "image") {
    assertPlainProjectObject(ref, `${label} 참조`);
    const assetId = ref.assetId;
    if (typeof assetId !== "string" || !assetId || !Object.prototype.hasOwnProperty.call(assets, assetId)) {
      throw new Error(`${label} 자산을 찾지 못했어.`);
    }
    const dataUrl = assets[assetId];
    const prefix = kind === "font" ? /^data:font\/(?:ttf|otf|woff|woff2);base64,/ : /^data:image\/(?:png|jpeg|webp|gif|bmp);base64,/;
    if (typeof dataUrl !== "string" || dataUrl.length > 48 * 1024 * 1024 || !prefix.test(dataUrl)) {
      throw new Error(`${label} 자산 형식이 올바르지 않아.`);
    }
    return dataUrl;
  }

  function dataUrlArrayBuffer(dataUrl) {
    const comma = dataUrl.indexOf(",");
    if (comma < 0) throw new Error("자산 data URL이 올바르지 않아.");
    let binary;
    try {
      binary = atob(dataUrl.slice(comma + 1));
    } catch {
      throw new Error("자산 base64를 읽지 못했어.");
    }
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
    return bytes.buffer;
  }

  async function projectCanvasFromRef(assets, ref, label) {
    if (!ref) return null;
    const width = Number(ref.width);
    const height = Number(ref.height);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width * height > 50_000_000) {
      throw new Error(`${label} 크기가 올바르지 않아.`);
    }
    const image = await imageFromDataUrl(projectAssetData(assets, ref, label), `${label} 이미지를 읽지 못했어.`);
    if ((image.naturalWidth || image.width) !== width || (image.naturalHeight || image.height) !== height) {
      throw new Error(`${label} 크기 정보와 실제 이미지가 달라.`);
    }
    const restored = document.createElement("canvas");
    restored.width = width;
    restored.height = height;
    restored.getContext("2d", { alpha: true }).drawImage(image, 0, 0, width, height);
    return restored;
  }

  function normalizeLoadedProjectState(source) {
    const raw = cloneFiniteJson(assertPlainProjectObject(source, "프로젝트 상태"), "project.state");
    ["background", "character", "phrase", "num1", "num2", "selected"].forEach(key => assertPlainProjectObject(raw[key], `state.${key}`));
    if (!Array.isArray(raw.props) || raw.props.length > 256) throw new Error("소품 목록이 올바르지 않거나 너무 많아.");
    raw.props.forEach((prop, index) => {
      assertPlainProjectObject(prop, `소품 ${index + 1}`);
      if (typeof prop.type !== "string" || !prop.type || prop.type.length > 256) throw new Error(`소품 ${index + 1} 종류가 올바르지 않아.`);
    });
    if (!Number.isInteger(raw.presetIndex) || !Number.isInteger(raw.placementIndex)) throw new Error("프리셋 위치 정보가 올바르지 않아.");
    raw.presetIndex = Math.round(clamp(raw.presetIndex, 0, Math.max(0, presets.length - 1)));
    raw.placementIndex = Math.round(clamp(raw.placementIndex, 0, Math.max(0, placementLayouts.length - 1)));
    raw.num1.size = MOBILE_NUMBER_SIZE;
    raw.num1.rot = 0;
    raw.num2.size = MOBILE_NUMBER_SIZE;
    raw.num2.rot = 0;
    raw.outputProfiles = cloneOutputProfiles(assertPlainProjectObject(raw.outputProfiles || {}, "출력별 위치"));
    raw.snapEnabled = raw.snapEnabled !== false;
    raw.showGuides = raw.showGuides !== false;
    raw.previewDark = !!raw.previewDark;
    raw.exportBaseName = String(raw.exportBaseName || SIG_DEFAULT_EXPORT_BASE).slice(0, 80);
    const allowedKinds = new Set(["none", "character", "phrase", "num1", "num2", "prop"]);
    if (!allowedKinds.has(raw.selected.kind) || raw.selected.kind === "prop" && !raw.props[Number(raw.selected.index)]) {
      raw.selected = { kind: "character", index: -1 };
    } else {
      raw.selected.index = raw.selected.kind === "prop" ? Number(raw.selected.index) : -1;
    }
    return raw;
  }

  async function stageSigProjectEnvelope(envelope) {
    const root = assertPlainProjectObject(envelope, "프로젝트");
    if (root.schemaVersion !== SIG_PROJECT_SCHEMA_VERSION) throw new Error("지원하지 않는 시그풍 프로젝트 버전이야.");
    const project = assertPlainProjectObject(root.project, "project");
    const projectVersion = Number(project.projectVersion);
    if (projectVersion !== 1 && projectVersion !== SIG_PROJECT_VERSION) throw new Error("지원하지 않는 프로젝트 데이터 버전이야.");
    const assets = assertPlainProjectObject(root.assets || {}, "assets");
    if (Object.keys(assets).length > 256) throw new Error("프로젝트 자산이 너무 많아.");
    const refs = cloneFiniteJson(assertPlainProjectObject(project.refs, "project.refs"), "project.refs");
    const nextState = normalizeLoadedProjectState(project.state);
    const backgroundRefs = assertPlainProjectObject(refs.background || {}, "배경 자산");
    if (projectVersion === SIG_PROJECT_VERSION) {
      const canvasInfo = assertPlainProjectObject(project.canvas, "project.canvas");
      if (Number(canvasInfo.width) !== W || Number(canvasInfo.height) !== H
        || Number(canvasInfo.maskScale) !== MASK_SCALE
        || Number(canvasInfo.maskWidth) !== MASK_W || Number(canvasInfo.maskHeight) !== MASK_H) {
        throw new Error("프로젝트의 배경 마스크 해상도 정보가 올바르지 않아.");
      }
      if (backgroundRefs.mask && (Number(backgroundRefs.mask.width) !== MASK_W
        || Number(backgroundRefs.mask.height) !== MASK_H
        || Number(backgroundRefs.mask.maskScale) !== MASK_SCALE)) {
        throw new Error("프로젝트의 배경 마스크 자산 해상도가 올바르지 않아.");
      }
    }
    if (!Array.isArray(refs.props) || !Array.isArray(refs.fonts)) throw new Error("프로젝트 자산 참조가 올바르지 않아.");

    const customPropRefs = new Map();
    refs.props.forEach((ref, index) => {
      assertPlainProjectObject(ref, `소품 자산 ${index + 1}`);
      if (typeof ref.type !== "string" || !ref.type || customPropRefs.has(ref.type)) throw new Error("소품 자산 참조가 중복되거나 올바르지 않아.");
      customPropRefs.set(ref.type, ref);
    });
    const usedCustomTypes = new Set(nextState.props.filter(prop => prop.customImage).map(prop => prop.type));
    usedCustomTypes.forEach(type => {
      if (!customPropRefs.has(type)) throw new Error(`${type} 소품 이미지가 프로젝트에서 빠졌어.`);
    });
    customPropRefs.forEach((_ref, type) => {
      if (!usedCustomTypes.has(type)) throw new Error(`${type} 소품 자산이 레이어 목록과 맞지 않아.`);
    });

    const fontKeys = new Set();
    const stagedFontPromises = refs.fonts.map(async (ref, index) => {
      assertPlainProjectObject(ref, `글꼴 자산 ${index + 1}`);
      const key = String(ref.key || "");
      if (!key || fontKeys.has(key) || PHRASE_FONT_OPTIONS.some(font => font.key === key)) throw new Error("사용자 글꼴 키가 중복되거나 올바르지 않아.");
      fontKeys.add(key);
      const dataUrl = projectAssetData(assets, ref, ref.label || `글꼴 ${index + 1}`, "font");
      const mime = String(ref.mime || "");
      if (!dataUrl.startsWith(`data:${mime};base64,`)) throw new Error(`${ref.label || "사용자 글꼴"} MIME 정보가 실제 데이터와 달라.`);
      const buffer = dataUrlArrayBuffer(dataUrl);
      if (canonicalFontMime(buffer) !== mime) throw new Error(`${ref.label || "사용자 글꼴"} 파일 형식이 MIME과 달라.`);
      if (typeof FontFace !== "function" || !document.fonts?.add) throw new Error("이 브라우저에서는 프로젝트의 사용자 글꼴을 복원할 수 없어.");
      const familyName = `SigProjectFont_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}`;
      const face = new FontFace(familyName, buffer);
      await face.load();
      return {
        key,
        label: String(ref.label || "내 글꼴"),
        family: `"${familyName}","Pretendard","Noto Sans KR",sans-serif`,
        face,
        fileName: String(ref.fileName || ""),
        mime,
        dataUrl
      };
    });

    const characterPromise = refs.character
      ? imageFromDataUrl(projectAssetData(assets, refs.character, "캐릭터"), "캐릭터 이미지를 읽지 못했어.")
      : Promise.resolve(null);
    const backgroundOriginalPromise = backgroundRefs.original
      ? imageFromDataUrl(projectAssetData(assets, backgroundRefs.original, "커스텀 배경 원본"), "커스텀 배경 원본을 읽지 못했어.")
      : Promise.resolve(null);
    const backgroundSourcePromise = projectCanvasFromRef(assets, backgroundRefs.source, "커스텀 배경 캔버스");
    const maskPromise = projectCanvasFromRef(assets, backgroundRefs.mask, "배경 마스크")
      .then(mask => mask ? normalizeStoredMaskCanvas(mask) : null);
    const propPromises = Array.from(customPropRefs.entries()).map(async ([type, ref]) => [
      type,
      {
        image: await imageFromDataUrl(projectAssetData(assets, ref, ref.label || type), `${ref.label || type} 소품을 읽지 못했어.`),
        label: String(ref.label || type)
      }
    ]);

    const [character, backgroundOriginal, backgroundSource, maskCanvas, fonts, propEntries] = await Promise.all([
      characterPromise,
      backgroundOriginalPromise,
      backgroundSourcePromise,
      maskPromise,
      Promise.all(stagedFontPromises),
      Promise.all(propPromises)
    ]);
    if (nextState.background.mask === "alpha-custom" && !maskCanvas) throw new Error("적용 중인 배경 마스크 자산이 빠졌어.");
    if (nextState.background.texture === "custom" && (!backgroundOriginal || !backgroundSource)) throw new Error("적용 중인 커스텀 배경 자산이 빠졌어.");
    const availableFont = PHRASE_FONT_OPTIONS.some(font => font.key === nextState.phrase.fontKey) || fontKeys.has(nextState.phrase.fontKey);
    if (!availableFont) throw new Error("문구에 적용된 사용자 글꼴이 프로젝트에서 빠졌어.");
    return {
      state: nextState,
      character,
      backgroundOriginal,
      backgroundSource,
      maskCanvas,
      fonts,
      props: new Map(propEntries)
    };
  }

  function replaceProjectObject(target, source) {
    Object.keys(target).forEach(key => { delete target[key]; });
    Object.assign(target, source);
  }

  function commitStagedSigProject(staged, path = "") {
    const addedFaces = [];
    try {
      staged.fonts.forEach(record => {
        document.fonts.add(record.face);
        addedFaces.push(record.face);
      });
    } catch (error) {
      addedFaces.forEach(face => { try { document.fonts.delete?.(face); } catch (_) {} });
      throw error;
    }
    customPhraseFonts.forEach(record => { try { document.fonts.delete?.(record.face); } catch (_) {} });
    customPhraseFonts.clear();
    staged.fonts.forEach(record => customPhraseFonts.set(record.key, record));
    customPhraseFontSequence += staged.fonts.length;

    closeMaskStudio(true);
    const oldCustomTypes = new Set(state.props.filter(prop => prop.customImage).map(prop => prop.type));
    oldCustomTypes.forEach(type => {
      delete propImages[type];
      delete propLabels[type];
    });
    staged.props.forEach((asset, type) => {
      propImages[type] = asset.image;
      propLabels[type] = asset.label;
    });

    state.presetIndex = staged.state.presetIndex;
    state.placementIndex = staged.state.placementIndex;
    replaceProjectObject(state.background, Object.assign({}, staged.state.background, {
      customImg: staged.backgroundOriginal,
      customSourceCanvas: staged.backgroundSource,
      maskCanvas: staged.maskCanvas
    }));
    replaceProjectObject(state.character, Object.assign({}, staged.state.character, { img: staged.character }));
    replaceProjectObject(state.phrase, staged.state.phrase);
    replaceProjectObject(state.num1, staged.state.num1);
    replaceProjectObject(state.num2, staged.state.num2);
    state.props = staged.state.props.map(prop => Object.assign({}, prop));
    state.outputProfiles = cloneOutputProfiles(staged.state.outputProfiles);
    state.selected = Object.assign({}, staged.state.selected);
    state.snapEnabled = staged.state.snapEnabled;
    state.showGuides = staged.state.showGuides;
    state.previewDark = staged.state.previewDark;
    state.exportBaseName = staged.state.exportBaseName;
    activeSnapGuides = null;
    outputProfileHistoryBefore = null;
    resetMainHistory();
    mainHistoryReady = true;
    currentProjectPath = String(path || "");
    setProjectDirty(false);
    syncControls();
    renderLayerList();
    highlightPreset();
    requestRender();
  }

  async function confirmProjectReplacement() {
    if (!projectDirty && !maskStudioDirty()) return true;
    return askSigConfirm("저장하지 않은 시그풍 변경이 있어. 현재 작업을 버리고 다른 프로젝트를 열까?", {
      title: "다른 프로젝트 열기",
      confirmLabel: "버리고 열기"
    });
  }

  async function loadSigProjectEnvelope(envelope, options = {}) {
    if (!options.skipConfirm && !(await confirmProjectReplacement())) return { cancel: true };
    const manageBusy = options.manageBusy !== false;
    const token = ++projectIoGeneration;
    if (manageBusy) setProjectIoBusy(true, "프로젝트 여는 중…");
    try {
      const staged = await stageSigProjectEnvelope(envelope);
      if (token !== projectIoGeneration) throw new Error("더 최근 프로젝트 열기 요청이 있어 이전 요청을 취소했어.");
      commitStagedSigProject(staged, options.path || "");
      showExportStatus(`프로젝트 열기 완료 · ${projectDisplayName(options.path || "")}`);
      return { ok: true, assetCount: Object.keys(envelope.assets || {}).length };
    } catch (error) {
      console.error("[시그풍] 프로젝트 열기 실패", error);
      showExportStatus(`프로젝트 열기 실패: ${error.message || error}`, true);
      return { ok: false, err: error.message || String(error) };
    } finally {
      if (manageBusy) setProjectIoBusy(false);
    }
  }

  async function saveSigProject() {
    if (projectIoBusy) return { ok: false, busy: true };
    if (maskStudioDirty()) {
      if (!(await askSigConfirm("마스크 편집 내용이 아직 적용되지 않았어. 현재 마스크를 적용하고 프로젝트에 저장할까?", {
        title: "마스크도 함께 저장",
        confirmLabel: "적용 후 저장"
      }))) return { cancel: true };
      if (!applyMaskStudio()) return { ok: false, err: "마스크를 적용하지 못했어." };
    }
    setProjectIoBusy(true, "프로젝트 준비 중…");
    try {
      const envelope = await serializeSigProject();
      const api = window.pywebview && window.pywebview.api;
      if (api && typeof api.save_sig_project === "function") {
        setProjectIoBusy(true, "저장 위치 선택 중…");
        showExportStatus("프로젝트 저장 위치를 선택해 줘.");
        await nextPaint();
        const result = parseApiResult(await api.save_sig_project(JSON.stringify(envelope)));
        if (result.cancel) {
          showExportStatus("프로젝트 저장을 취소했어.");
          return result;
        }
        if (!result.ok) throw new Error(result.err || "프로젝트를 저장하지 못했어.");
        currentProjectPath = String(result.path || envelope.name);
        setProjectDirty(false);
        showExportStatus(`프로젝트 저장 완료 · ${projectDisplayName()}`);
        return result;
      }
      const fallbackName = `${normalizeExportBaseName(state.exportBaseName)}${SIG_PROJECT_BROWSER_SUFFIX}`;
      const fallbackJson = JSON.stringify(envelope);
      /* 옛 본체(save_sig_project 없음)에서도 save_png(임의 바이트 + 저장창)는 있다.
         이 WebView2 설정에선 blob 다운로드가 조용히 사라져 "완료"만 뜨는 사고가 나므로
         (2026-08-18 실측), 본체 저장창 경로를 우선 쓴다. */
      if (api && typeof api.save_png === "function" && typeof api.pick_dir === "function") {
        /* 저장창(파일 대화상자) 모드는 PNG 필터가 이름 끝에 .png 를 강제로 붙인다 —
           폴더만 고르게 하고 dir 모드로 정확한 이름을 쓴다(6칸 GIF 폴백과 같은 패턴). */
        setProjectIoBusy(true, "저장 폴더 선택 중…");
        showExportStatus("프로젝트를 저장할 폴더를 선택해 줘.");
        await nextPaint();
        const picked = parseApiResult(await api.pick_dir());
        if (!picked || !picked.dir) {
          showExportStatus("프로젝트 저장을 취소했어.");
          return { ok: false, cancel: true };
        }
        const bytes = new TextEncoder().encode(fallbackJson);
        let bin = "";
        for (let i = 0; i < bytes.length; i += 32768) {
          bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 32768));
        }
        const result = parseApiResult(await api.save_png(JSON.stringify({
          dir: picked.dir, name: fallbackName, b64: btoa(bin)
        })));
        if (result.err) throw new Error(result.err);
        if (!result.ok) {
          showExportStatus("프로젝트 저장을 취소했어.");
          return { ok: false, cancel: true };
        }
        currentProjectPath = result.path || fallbackName;
        setProjectDirty(false);
        showExportStatus(`프로젝트 JSON 저장 완료 · ${currentProjectPath}`);
        return { ok: true, legacyBridge: true, path: currentProjectPath };
      }
      downloadBlob(new Blob([fallbackJson], { type: "application/json" }), fallbackName);
      currentProjectPath = fallbackName;
      setProjectDirty(false);
      showExportStatus(`프로젝트 JSON 저장 완료 · ${fallbackName}`);
      return { ok: true, browser: true, path: fallbackName };
    } catch (error) {
      console.error("[시그풍] 프로젝트 저장 실패", error);
      showExportStatus(`프로젝트 저장 실패: ${error.message || error}`, true);
      return { ok: false, err: error.message || String(error) };
    } finally {
      setProjectIoBusy(false);
    }
  }

  async function openSigProject() {
    if (projectIoBusy) return;
    const api = window.pywebview && window.pywebview.api;
    if (!api || typeof api.load_sig_project !== "function") {
      const input = document.getElementById("sigProjectFile");
      input.value = "";
      input.click();
      return;
    }
    if (!(await confirmProjectReplacement())) return;
    setProjectIoBusy(true, "프로젝트 선택 중…");
    try {
      showExportStatus("열 프로젝트를 선택해 줘.");
      await nextPaint();
      const result = parseApiResult(await api.load_sig_project());
      if (result.cancel) {
        showExportStatus("프로젝트 열기를 취소했어.");
        return;
      }
      if (!result.ok) throw new Error(result.err || "프로젝트 파일을 열지 못했어.");
      await loadSigProjectEnvelope({ schemaVersion: result.schemaVersion, project: result.project, assets: result.assets }, {
        skipConfirm: true,
        manageBusy: false,
        path: result.path || ""
      });
    } catch (error) {
      console.error("[시그풍] 프로젝트 열기 실패", error);
      showExportStatus(`프로젝트 열기 실패: ${error.message || error}`, true);
    } finally {
      setProjectIoBusy(false);
    }
  }

  async function loadBrowserSigProjectFile(event) {
    const input = event.currentTarget;
    const file = input.files && input.files[0];
    input.value = "";
    if (!file || !(await confirmProjectReplacement())) return;
    if (file.size > SIG_PROJECT_MAX_BROWSER_BYTES) {
      showExportStatus("프로젝트 JSON이 허용 크기를 넘었어.", true);
      return;
    }
    setProjectIoBusy(true, "프로젝트 JSON 읽는 중…");
    try {
      const envelope = JSON.parse(await file.text());
      await loadSigProjectEnvelope(envelope, { skipConfirm: true, manageBusy: false, path: file.name });
    } catch (error) {
      console.error("[시그풍] 프로젝트 JSON 열기 실패", error);
      showExportStatus(`프로젝트 JSON 열기 실패: ${error.message || error}`, true);
    } finally {
      setProjectIoBusy(false);
    }
  }

  async function exportFiles(types, activeButton = null) {
    if (projectIoBusy) return { ok: false, busy: true };
    const buttons = Array.from(document.querySelectorAll("#sigExportMobile,#sigExportPc,#sigExportBoth,#sigExportWeflab,#sigExportAll"));
    const labels = new Map(buttons.map(button => [button, button.textContent]));
    buttons.forEach(button => { button.disabled = true; });
    const button = activeButton || document.getElementById("sigExportAll") || document.getElementById("sigExportBoth");
    if (button) button.textContent = "PNG 준비 중…";
    const savedResults = [];
    setProjectIoBusy(true, "PNG 준비 중…");
    showExportStatus("PNG를 준비하고 있어…");
    try {
      blurActiveSigEditorField();
      commitOutputProfileEdit();
      flushMainHistoryBurst();
      const requestedTypes = Array.from(new Set(types)).filter(type => OUTPUT_PROFILE_TYPES.includes(type));
      const baseName = normalizeExportBaseName(state.exportBaseName);
      const master = makeMasterCanvas();
      const files = [];
      if (requestedTypes.includes("mobile")) {
        const prepared = await prepareSoopCanvas(master, "mobile");
        files.push({ type: "mobile", name: `${baseName}-mobile-293x248.png`, blob: prepared.blob, width: 293, height: 248, method: prepared.method });
      }
      if (requestedTypes.includes("pc")) {
        const pc = makePcCanvas(master);
        const prepared = await prepareSoopCanvas(pc, "pc");
        files.push({ type: "pc", name: `${baseName}-pc-195x145.png`, blob: prepared.blob, width: 195, height: 145, method: prepared.method });
      }
      if (requestedTypes.includes("weflab")) {
        const weflab = makeWeflabCanvas();
        const prepared = await prepareWeflabCanvas(weflab);
        files.push({ type: "weflab", name: `${baseName}-weflab-668x374.png`, blob: prepared.blob, width: WEFLAB_WIDTH, height: WEFLAB_HEIGHT, method: prepared.method });
      }
      if (!files.length) throw new Error("저장할 PNG 종류가 없어.");

      const api = window.pywebview && window.pywebview.api;
      if (api && typeof api.save_png === "function") {
        let dir = null;
        if (files.length > 1) {
          if (typeof api.pick_dir !== "function") throw new Error("여러 PNG를 저장할 폴더 선택 기능을 사용할 수 없어.");
          setProjectIoBusy(true, "저장 폴더 선택 중…");
          showExportStatus(`${files.length}종을 저장할 폴더를 선택해 줘.`);
          await nextPaint();
          const picked = parseApiResult(await api.pick_dir());
          if (picked.err) throw new Error(`폴더 선택 실패: ${picked.err}`);
          if (picked.cancel) {
            showExportStatus("저장할 폴더 선택을 취소했어.");
            return { cancel: true, saved: [] };
          }
          dir = picked.dir || picked.path || picked.folder || picked.value || null;
          if (!dir) throw new Error("선택한 폴더 경로를 읽지 못했어.");
        }
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          const file = files[fileIndex];
          const b64 = await blobToBase64(file.blob);
          const payload = { name: file.name, b64 };
          if (dir) Object.assign(payload, { dir, collision: "unique" });
          setProjectIoBusy(true, files.length > 1 ? `PNG 저장 중 · ${fileIndex + 1}/${files.length}` : "PNG 저장 위치 선택 중…");
          showExportStatus(files.length > 1 ? `${fileIndex + 1}/${files.length} · ${file.name} 저장 중…` : `${file.name} 저장 위치를 선택해 줘.`);
          await nextPaint();
          const saved = parseApiResult(await api.save_png(JSON.stringify(payload)));
          if (saved.err) throw new Error(saved.err);
          if (saved.cancel) {
            if (!savedResults.length) {
              showExportStatus("PNG 저장을 취소했어.");
              return { cancel: true, saved: [] };
            }
            throw new Error(`${file.name} 저장을 취소했어.`);
          }
          if (saved.ok === false) throw new Error(saved.message || `${file.name} 저장에 실패했어.`);
          savedResults.push({
            type: file.type,
            requestedName: file.name,
            actualName: String(saved.actualName || file.name),
            renamed: !!saved.renamed,
            path: saved.path || ""
          });
        }
      } else {
        files.forEach(file => {
          downloadBlob(file.blob, file.name);
          savedResults.push({ type: file.type, requestedName: file.name, actualName: file.name, renamed: false, browser: true });
        });
      }
      const details = files.map(file => `${file.width}×${file.height} ${(file.blob.size / 1000).toFixed(1)}KB`).join(" · ");
      const actualNames = savedResults.map(saved => `${saved.actualName}${files.length > 1 && saved.renamed ? " (중복 이름 자동 변경)" : ""}`).join(" · ");
      showExportStatus(`저장 완료 · ${actualNames} · ${details}`, false);
      return { ok: true, saved: savedResults, files: files.map(({ type, name, width, height }) => ({ type, name, width, height })) };
    } catch (error) {
      console.error("[시그풍] PNG 저장 실패", error);
      const partial = savedResults.length ? `저장됨 ${savedResults.map(item => item.actualName).join(", ")} · 이어서 ` : "";
      showExportStatus(`${partial}저장 실패: ${error.message || error}`, true);
      return { ok: false, err: error.message || String(error), saved: savedResults };
    } finally {
      setProjectIoBusy(false);
      buttons.forEach(item => {
        item.disabled = projectIoBusy;
        item.textContent = labels.get(item);
      });
    }
  }

  function exposeQa() {
    const qa = {
      state,
      presets,
      render: requestRender,
      applyPreset,
      makeMasterCanvas,
      makePcCanvas,
      makeWeflabCanvas,
      optimizedPng,
      prepareSoopCanvas,
      prepareWeflabCanvas,
      inspectCanvasAlpha,
      inspectCanvasPixels,
      validateOutputCanvas,
      exportFiles,
      serializeProject: serializeSigProject,
      loadProjectEnvelope: loadSigProjectEnvelope,
      saveProject: saveSigProject,
      openProject: openSigProject,
      getProjectState() {
        return {
          dirty: projectDirty,
          busy: projectIoBusy,
          path: currentProjectPath,
          displayName: projectDisplayName(),
          exportBaseName: normalizeExportBaseName(state.exportBaseName)
        };
      },
      setProjectDirty,
      openMaskStudio,
      applyMaskStudio,
      maskUndo,
      maskRedo,
      mainUndo,
      mainRedo,
      getMainHistoryState() {
        return {
          undoCount: mainUndoStack.length,
          redoCount: mainRedoStack.length,
          burstPending: !!mainBurstBefore,
          limit: MAIN_HISTORY_LIMIT
        };
      },
      getPhraseFonts() {
        return [
          ...PHRASE_FONT_OPTIONS.map(({ key, label, family }) => ({ key, label, family, custom: false })),
          ...Array.from(customPhraseFonts.values()).map(({ key, label, family, fileName, mime, dataUrl }) => ({ key, label, family, fileName, mime, hasSource: !!dataUrl, custom: true }))
        ];
      },
      getPhraseTextMetrics() {
        const bounds = textLocalBounds(state.phrase, false);
        return {
          lines: String(state.phrase.text || "").split(/\\n|\n/).length,
          fontKey: state.phrase.fontKey,
          lineHeight: phraseLineHeight(state.phrase),
          bounds: Object.assign({}, bounds)
        };
      },
      cloneTextToProp(kind = "phrase") {
        return cloneTextLayerToProp(kind, null);
      },
      setStraightMask(top = 84) {
        state.background.top = clamp(top, 84, H);
        state.background.maskCanvas = createStraightMask(state.background.top);
        state.background.mask = "alpha-custom";
        syncControls();
        requestRender();
      },
      setTopLineMask(points) {
        const target = createMaskCanvas();
        if (!applyTopLine(points, target)) return false;
        state.background.maskCanvas = target;
        state.background.mask = "alpha-custom";
        syncControls();
        requestRender();
        return true;
      },
      getMaskStats(source = "applied") {
        const mask = source === "working" && maskWorkingCanvas
          ? maskWorkingCanvas
          : isAlphaMask() ? state.background.maskCanvas : rasterizeBackgroundMask(state.background);
        const data = mask.getContext("2d", { alpha: true, willReadFrequently: true }).getImageData(0, 0, MASK_W, MASK_H).data;
        let rawOpaquePixels = 0;
        let rawTopProtectedPixels = 0;
        let logicalOpaquePixels = 0;
        let logicalTopProtectedPixels = 0;
        let checksum = 2166136261;
        let minX = MASK_W;
        let minY = MASK_H;
        let maxX = -1;
        let maxY = -1;
        for (let y = 0; y < MASK_H; y++) {
          for (let x = 0; x < MASK_W; x++) {
            const alpha = data[(y * MASK_W + x) * 4 + 3];
            checksum = Math.imul(checksum ^ alpha, 16777619) >>> 0;
            if (!alpha) continue;
            rawOpaquePixels++;
            if (y < MASK_SAFE_TOP) rawTopProtectedPixels++;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            let maxAlpha = 0;
            for (let yy = 0; yy < MASK_SCALE; yy++) {
              for (let xx = 0; xx < MASK_SCALE; xx++) {
                maxAlpha = Math.max(maxAlpha, data[(((y * MASK_SCALE + yy) * MASK_W) + x * MASK_SCALE + xx) * 4 + 3]);
              }
            }
            if (maxAlpha) {
              logicalOpaquePixels++;
              if (y < SAFE_TOP) logicalTopProtectedPixels++;
            }
          }
        }
        const bounds = rawOpaquePixels ? {
          minX: minX / MASK_SCALE,
          minY: minY / MASK_SCALE,
          maxX: maxX / MASK_SCALE,
          maxY: maxY / MASK_SCALE
        } : null;
        return {
          active: isAlphaMask(),
          source: source === "working" && maskWorkingCanvas ? "working" : "applied",
          paintMode: state.background.maskPaintMode,
          opaquePixels: logicalOpaquePixels,
          logicalOpaquePixels,
          rawOpaquePixels,
          topProtectedPixels: logicalTopProtectedPixels,
          logicalTopProtectedPixels,
          rawTopProtectedPixels,
          checksum: checksum.toString(16).padStart(8, "0"),
          bounds,
          rawBounds: rawOpaquePixels ? { minX, minY, maxX, maxY } : null,
          width: MASK_W,
          height: MASK_H,
          scale: MASK_SCALE,
          historyLength: maskHistory.length,
          historyIndex: maskHistoryIndex,
          historyBytes: maskHistory.reduce((total, alpha) => total + (alpha?.byteLength || 0), 0)
        };
      },
      maskAlphaAt(x, y, source = "working") {
        const mask = source === "working" && maskWorkingCanvas
          ? maskWorkingCanvas
          : isAlphaMask() ? state.background.maskCanvas : rasterizeBackgroundMask(state.background);
        const px = Math.round(clamp(x * MASK_SCALE, 0, MASK_W - 1));
        const py = Math.round(clamp(y * MASK_SCALE, 0, MASK_H - 1));
        return mask.getContext("2d", { alpha: true, willReadFrequently: true }).getImageData(px, py, 1, 1).data[3];
      },
      getMaskSymmetry(source = "working") {
        const mask = source === "working" && maskWorkingCanvas
          ? maskWorkingCanvas
          : isAlphaMask() ? state.background.maskCanvas : rasterizeBackgroundMask(state.background);
        const data = mask.getContext("2d", { alpha: true, willReadFrequently: true }).getImageData(0, 0, MASK_W, MASK_H).data;
        let mismatchedPixels = 0;
        let maxDelta = 0;
        for (let y = MASK_SAFE_TOP; y < MASK_H; y++) {
          for (let x = 0; x < Math.floor(MASK_W / 2); x++) {
            const left = data[(y * MASK_W + x) * 4 + 3];
            const right = data[(y * MASK_W + (MASK_W - 1 - x)) * 4 + 3];
            const delta = Math.abs(left - right);
            if (delta) mismatchedPixels++;
            maxDelta = Math.max(maxDelta, delta);
          }
        }
        return { mismatchedPixels, maxDelta };
      },
      getMaskStudioState() {
        return {
          open: !document.getElementById("sigMaskStudio")?.hidden,
          tool: maskEditorTool,
          brushSize: maskBrushSize(),
          zoom: maskEditorZoom,
          mirror: maskMirrorEnabled(),
          dirty: maskStudioDirty(),
          pointerInside: maskPointerInside,
          cursorVisible: !document.getElementById("sigMaskCursor")?.hidden
        };
      },
      getMaskResolution() {
        return {
          logicalWidth: W,
          logicalHeight: H,
          width: MASK_W,
          height: MASK_H,
          scale: MASK_SCALE,
          safeTop: SAFE_TOP,
          rawSafeTop: MASK_SAFE_TOP,
          historyLimit: MASK_HISTORY_LIMIT,
          historyBytes: maskHistory.reduce((total, alpha) => total + (alpha?.byteLength || 0), 0)
        };
      },
      setMaskSeed: applyMaskSeed,
      getMaskSeedProfile(kind, values = null) {
        const seed = createMaskSeed(kind, values);
        const data = seed.getContext("2d", { alpha: true, willReadFrequently: true }).getImageData(0, 0, MASK_W, MASK_H).data;
        const top = [];
        for (let x = 0; x < W; x++) {
          let first = null;
          for (let y = 0; y < MASK_H; y++) {
            const left = data[(y * MASK_W + x * MASK_SCALE) * 4 + 3];
            const right = data[(y * MASK_W + Math.min(MASK_W - 1, x * MASK_SCALE + 1)) * 4 + 3];
            if (Math.max(left, right) >= 128) { first = (y + 1) / MASK_SCALE; break; }
          }
          top.push(first);
        }
        return Object.assign({ kind, top, center: top[Math.floor(W / 2)], left: top[0], right: top[W - 1], min: Math.min(...top.filter(Number.isFinite)), rawWidth: MASK_W, rawHeight: MASK_H, scale: MASK_SCALE }, inspectCanvasPixels(seed));
      },
      getMaskShapeState() {
        return maskShapeSession ? { kind: maskShapeSession.kind, values: Object.assign({}, maskShapeSession.values), dirty: maskShapeSession.dirty } : null;
      },
      setMaskShapeValue(key, value) {
        previewMaskShapeParameter(key, value);
        return this.getMaskShapeState();
      },
      confirmMaskShapeParameters,
      alignWorkingMask,
      pickLayerAt(x, y) {
        const ref = pickLayerAt({ x, y });
        return ref ? { kind: ref.kind, index: ref.index } : null;
      },
      selectLayer,
      setLayerLocked(kind, index = -1, locked = true) {
        setLayerLocked({ kind, index }, locked);
      },
      getLayerInteractionState() {
        const frame = selectionFrame();
        return {
          selected: { kind: state.selected.kind, index: state.selected.index },
          locked: layerLocked(),
          frame: frame ? { cx: frame.cx, cy: frame.cy, width: frame.width, height: frame.height, rotation: frame.rotation, resizable: canResizeLayer(frame.ref) } : null,
          dragging: dragging ? { mode: dragging.mode, kind: dragging.ref.kind, index: dragging.ref.index } : null
        };
      },
      getSnapState() {
        return { enabled: state.snapEnabled !== false, distance: SNAP_DISTANCE, active: activeSnapGuides ? { x: activeSnapGuides.x?.label || null, y: activeSnapGuides.y?.label || null } : null };
      },
      getOutputProfiles() {
        return cloneOutputProfiles();
      },
      setOutputProfile(type, values, recordHistory = true) {
        if (!OUTPUT_PROFILE_TYPES.includes(type)) throw new Error("지원하지 않는 출력 종류야.");
        const before = recordHistory ? beginMainChange() : null;
        state.outputProfiles[type] = normalizeOutputProfile(type, Object.assign({}, outputProfile(type), values || {}));
        syncOutputProfileControls();
        requestRender();
        if (recordHistory) commitMainChange(before);
        return Object.assign({}, state.outputProfiles[type]);
      },
      resetOutputProfiles(recordHistory = true) {
        const before = recordHistory ? beginMainChange() : null;
        state.outputProfiles = cloneOutputProfiles(null);
        syncOutputProfileControls();
        requestRender();
        if (recordHistory) commitMainChange(before);
        return cloneOutputProfiles();
      },
      getOutputPixelStats(type) {
        const target = type === "pc" ? makePcCanvas() : type === "weflab" ? makeWeflabCanvas() : makeMasterCanvas();
        return Object.assign(inspectCanvasPixels(target), validateOutputCanvas(type, target));
      },
      getBottomAlpha() {
        const c = makeMasterCanvas();
        const data = c.getContext("2d").getImageData(0, H - 1, W, 1).data;
        let transitions = 0;
        let previous = data[3] > 0;
        for (let i = 4; i < data.length; i += 4) {
          const current = data[i + 3] > 0;
          if (current !== previous) transitions++;
          previous = current;
        }
        return { transitions, opaquePixels: Array.from(data).filter((_, i) => i % 4 === 3 && data[i] > 0).length };
      },
      async exportSizes() {
        const master = makeMasterCanvas();
        const mobileCanvas = master;
        const pcCanvas = makePcCanvas(master);
        const weflabCanvas = makeWeflabCanvas();
        const mobile = await prepareSoopCanvas(mobileCanvas, "mobile");
        const pc = await prepareSoopCanvas(pcCanvas, "pc");
        const weflab = await prepareWeflabCanvas(weflabCanvas);
        return {
          mobile: { bytes: mobile.blob.size, width: mobileCanvas.width, height: mobileCanvas.height, alpha: validateOutputCanvas("mobile", mobileCanvas), method: mobile.method },
          pc: { bytes: pc.blob.size, width: pcCanvas.width, height: pcCanvas.height, alpha: validateOutputCanvas("pc", pcCanvas), method: pc.method },
          weflab: { bytes: weflab.blob.size, width: weflabCanvas.width, height: weflabCanvas.height, alpha: validateOutputCanvas("weflab", weflabCanvas), method: weflab.method }
        };
      }
    };
    try {
      window.SIGBALLOON_QA = qa;
    } catch {
      // Some embedded browsers lock the global object. QA exposure is optional.
    }
    try {
      document.documentElement.sigBalloonQa = qa;
    } catch {
      // DOM-side QA hook is a fallback for isolated browser worlds.
    }
  }

  async function init() {
    if (!createInterface()) return;
    bindControls();
    renderImagePropGallery();
    applyPreset(0, false);
    syncControls();
    renderLayerList();
    // 마스크/출력 QA는 무거운 이미지 에셋 로드가 끝나기 전에도 사용할 수 있게 먼저 노출한다.
    exposeQa();
    await loadImages();
    renderPresetGrid();
    requestRender();
    resetMainHistory();
    mainHistoryReady = true;
    setProjectDirty(false);
    syncProjectStatus();
    exposeQa();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(requestRender).catch(() => {});
    }
    window.addEventListener("beforeunload", event => {
      if (!projectDirty && !maskStudioDirty()) return;
      event.preventDefault();
      event.returnValue = "";
    });
  }

  init().catch(error => {
    try {
      window.SIGBALLOON_INIT_ERROR = {
        message: error && error.message ? error.message : String(error),
        stack: error && error.stack ? error.stack : ""
      };
    } catch {}
    console.error("[시그풍] 초기화 실패", error);
  });
})();
