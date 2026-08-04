/* [Lab] SOOP 배너 확장팩 60테마 — 파일 기반 테마 아트 메타.
   url은 web/ 기준 상대경로. 편집기(bnSetThemeBg/bnAddProp)가 사용 시 dataURL로 변환한다.
   (PNG 내보내기의 SVG foreignObject 안에서는 상대경로가 안 풀리기 때문) */
window.BN_ART = window.BN_ART || { themes: {} };
(function () {
  var T = {
 "top_cherry_soda": {
  "n": "체리 소다",
  "type": "top",
  "bg": "bn/top/cherry_soda/bn_top_cherry_soda_bg.png",
  "props": [
   {
    "id": "cherry_pair",
    "n": "체리 두 알",
    "url": "bn/top/cherry_soda/bn_prop_cherry_pair.png"
   },
   {
    "id": "heart_straw",
    "n": "하트 빨대",
    "url": "bn/top/cherry_soda/bn_prop_heart_straw.png"
   },
   {
    "id": "soda_glass",
    "n": "소다 유리",
    "url": "bn/top/cherry_soda/bn_prop_soda_glass.png"
   }
  ]
 },
 "top_chrome_cyber": {
  "n": "크롬 사이버",
  "type": "top",
  "bg": "bn/top/chrome_cyber/bn_top_chrome_cyber_bg.png",
  "props": [
   {
    "id": "chrome_star",
    "n": "크롬 별",
    "url": "bn/top/chrome_cyber/bn_prop_chrome_star.png"
   },
   {
    "id": "cyber_frame",
    "n": "사이버 프레임",
    "url": "bn/top/chrome_cyber/bn_prop_cyber_frame.png"
   },
   {
    "id": "holographic_disc",
    "n": "홀로그램 디스크",
    "url": "bn/top/chrome_cyber/bn_prop_holographic_disc.png"
   }
  ]
 },
 "top_film_archive": {
  "n": "필름 아카이브",
  "type": "top",
  "bg": "bn/top/film_archive/bn_top_film_archive_bg.png",
  "props": [
   {
    "id": "film_clapper",
    "n": "필름 슬레이트",
    "url": "bn/top/film_archive/bn_prop_film_clapper.png"
   },
   {
    "id": "film_reel",
    "n": "필름 릴",
    "url": "bn/top/film_archive/bn_prop_film_reel.png"
   },
   {
    "id": "film_slide_frame",
    "n": "슬라이드 프레임",
    "url": "bn/top/film_archive/bn_prop_film_slide_frame.png"
   },
   {
    "id": "film_strip",
    "n": "필름 필름 띠",
    "url": "bn/top/film_archive/bn_prop_film_strip.png"
   },
   {
    "id": "film_viewfinder",
    "n": "필름 뷰파인더",
    "url": "bn/top/film_archive/bn_prop_film_viewfinder.png"
   }
  ]
 },
 "top_indie_ticket": {
  "n": "인디 티켓",
  "type": "top",
  "bg": "bn/top/indie_ticket/bn_top_indie_ticket_bg.png",
  "props": [
   {
    "id": "indie_arrow",
    "n": "인디 화살표",
    "url": "bn/top/indie_ticket/bn_prop_indie_arrow.png"
   },
   {
    "id": "indie_burst_badge",
    "n": "버스트 배지",
    "url": "bn/top/indie_ticket/bn_prop_indie_burst_badge.png"
   },
   {
    "id": "indie_star",
    "n": "인디 별",
    "url": "bn/top/indie_ticket/bn_prop_indie_star.png"
   },
   {
    "id": "indie_ticket_stub",
    "n": "티켓 티켓 조각",
    "url": "bn/top/indie_ticket/bn_prop_indie_ticket_stub.png"
   },
   {
    "id": "indie_zigzag",
    "n": "인디 지그재그",
    "url": "bn/top/indie_ticket/bn_prop_indie_zigzag.png"
   }
  ]
 },
 "top_lemon_picnic": {
  "n": "레몬 피크닉",
  "type": "top",
  "bg": "bn/top/lemon_picnic/bn_top_lemon_picnic_bg.png",
  "props": [
   {
    "id": "daisy_bloom",
    "n": "데이지 꽃송이",
    "url": "bn/top/lemon_picnic/bn_prop_daisy_bloom.png"
   },
   {
    "id": "lemon_slice",
    "n": "레몬 조각",
    "url": "bn/top/lemon_picnic/bn_prop_lemon_slice.png"
   },
   {
    "id": "picnic_basket",
    "n": "피크닉 바구니",
    "url": "bn/top/lemon_picnic/bn_prop_picnic_basket.png"
   }
  ]
 },
 "top_magazine": {
  "n": "매거진",
  "type": "top",
  "bg": "bn/top/magazine/bn_top_magazine_bg.png",
  "props": [
   {
    "id": "magazine_barcode",
    "n": "매거진 바코드",
    "url": "bn/top/magazine/bn_prop_magazine_barcode.png"
   },
   {
    "id": "magazine_corner",
    "n": "매거진 코너장식",
    "url": "bn/top/magazine/bn_prop_magazine_corner.png"
   },
   {
    "id": "magazine_index_tab",
    "n": "인덱스 탭",
    "url": "bn/top/magazine/bn_prop_magazine_index_tab.png"
   },
   {
    "id": "magazine_label",
    "n": "매거진 라벨",
    "url": "bn/top/magazine/bn_prop_magazine_label.png"
   },
   {
    "id": "magazine_page_pin",
    "n": "페이지 핀",
    "url": "bn/top/magazine/bn_prop_magazine_page_pin.png"
   }
  ]
 },
 "top_mint_blueprint": {
  "n": "민트 청사진",
  "type": "top",
  "bg": "bn/top/mint_blueprint/bn_top_mint_blueprint_bg.png",
  "props": [
   {
    "id": "blueprint_clip",
    "n": "청사진 클립",
    "url": "bn/top/mint_blueprint/bn_prop_blueprint_clip.png"
   },
   {
    "id": "blueprint_compass_badge",
    "n": "컴퍼스 배지",
    "url": "bn/top/mint_blueprint/bn_prop_blueprint_compass_badge.png"
   },
   {
    "id": "blueprint_plane",
    "n": "청사진 종이비행기",
    "url": "bn/top/mint_blueprint/bn_prop_blueprint_plane.png"
   }
  ]
 },
 "top_noir_editorial": {
  "n": "느와르",
  "type": "top",
  "bg": "bn/top/noir_editorial/bn_top_noir_editorial_bg.png",
  "props": [
   {
    "id": "noir_bow",
    "n": "느와르 리본",
    "url": "bn/top/noir_editorial/bn_prop_noir_bow.png"
   },
   {
    "id": "noir_oval_frame",
    "n": "타원 프레임",
    "url": "bn/top/noir_editorial/bn_prop_noir_oval_frame.png"
   },
   {
    "id": "noir_star",
    "n": "느와르 별",
    "url": "bn/top/noir_editorial/bn_prop_noir_star.png"
   }
  ]
 },
 "top_ocean_glass": {
  "n": "오션 글래스",
  "type": "top",
  "bg": "bn/top/ocean_glass/bn_top_ocean_glass_bg.png",
  "props": [
   {
    "id": "glass_starfish",
    "n": "유리 불가사리",
    "url": "bn/top/ocean_glass/bn_prop_glass_starfish.png"
   },
   {
    "id": "pearl_bubble_ring",
    "n": "버블 링",
    "url": "bn/top/ocean_glass/bn_prop_pearl_bubble_ring.png"
   },
   {
    "id": "scallop_shell",
    "n": "가리비 조개",
    "url": "bn/top/ocean_glass/bn_prop_scallop_shell.png"
   }
  ]
 },
 "top_paper_atelier": {
  "n": "페이퍼 아틀리에",
  "type": "top",
  "bg": "bn/top/paper_atelier/bn_top_paper_atelier_bg.png",
  "props": [
   {
    "id": "atelier_patch_heart",
    "n": "패치 하트",
    "url": "bn/top/paper_atelier/bn_prop_atelier_patch_heart.png"
   },
   {
    "id": "atelier_safety_pin",
    "n": "옷핀 핀",
    "url": "bn/top/paper_atelier/bn_prop_atelier_safety_pin.png"
   },
   {
    "id": "atelier_thread_spool",
    "n": "실 실패",
    "url": "bn/top/paper_atelier/bn_prop_atelier_thread_spool.png"
   }
  ]
 },
 "top_peach_decora": {
  "n": "피치 데코라",
  "type": "top",
  "bg": "bn/top/peach_decora/bn_top_peach_decora_bg.png",
  "props": [
   {
    "id": "decora_candy_tape",
    "n": "캔디 테이프",
    "url": "bn/top/peach_decora/bn_prop_decora_candy_tape.png"
   },
   {
    "id": "decora_flower",
    "n": "데코라 꽃",
    "url": "bn/top/peach_decora/bn_prop_decora_flower.png"
   },
   {
    "id": "decora_heart_pin",
    "n": "하트 핀",
    "url": "bn/top/peach_decora/bn_prop_decora_heart_pin.png"
   }
  ]
 },
 "top_pearl_ribbon": {
  "n": "펄 리본",
  "type": "top",
  "bg": "bn/top/pearl_ribbon/bn_top_pearl_ribbon_bg.png",
  "props": [
   {
    "id": "cameo_oval_frame",
    "n": "타원 프레임",
    "url": "bn/top/pearl_ribbon/bn_prop_cameo_oval_frame.png"
   },
   {
    "id": "pearl_bow",
    "n": "진주 리본",
    "url": "bn/top/pearl_ribbon/bn_prop_pearl_bow.png"
   },
   {
    "id": "pearl_heart",
    "n": "진주 하트",
    "url": "bn/top/pearl_ribbon/bn_prop_pearl_heart.png"
   }
  ]
 },
 "top_postage": {
  "n": "우표",
  "type": "top",
  "bg": "bn/top/postage/bn_top_postage_bg.png",
  "props": [
   {
    "id": "postage_airmail_tag",
    "n": "에어메일 태그",
    "url": "bn/top/postage/bn_prop_postage_airmail_tag.png"
   },
   {
    "id": "postage_paper_plane",
    "n": "종이비행기",
    "url": "bn/top/postage/bn_prop_postage_paper_plane.png"
   },
   {
    "id": "postage_postmark",
    "n": "우표 소인",
    "url": "bn/top/postage/bn_prop_postage_postmark.png"
   },
   {
    "id": "postage_seal",
    "n": "우표 실링",
    "url": "bn/top/postage/bn_prop_postage_seal.png"
   },
   {
    "id": "postage_stamp_frame",
    "n": "우표 프레임",
    "url": "bn/top/postage/bn_prop_postage_stamp_frame.png"
   }
  ]
 },
 "top_riso_collage": {
  "n": "리소 콜라주",
  "type": "top",
  "bg": "bn/top/riso_collage/bn_top_riso_collage_bg.png",
  "props": [
   {
    "id": "riso_burst",
    "n": "리소 버스트",
    "url": "bn/top/riso_collage/bn_prop_riso_burst.png"
   },
   {
    "id": "riso_tape",
    "n": "리소 테이프",
    "url": "bn/top/riso_collage/bn_prop_riso_tape.png"
   },
   {
    "id": "riso_ticket",
    "n": "리소 티켓",
    "url": "bn/top/riso_collage/bn_prop_riso_ticket.png"
   }
  ]
 },
 "top_royal_porcelain": {
  "n": "로열 포슬린",
  "type": "top",
  "bg": "bn/top/royal_porcelain/bn_top_royal_porcelain_bg.png",
  "props": [
   {
    "id": "blue_pearl_frame",
    "n": "진주 프레임",
    "url": "bn/top/royal_porcelain/bn_prop_blue_pearl_frame.png"
   },
   {
    "id": "cobalt_rose",
    "n": "코발트 장미",
    "url": "bn/top/royal_porcelain/bn_prop_cobalt_rose.png"
   },
   {
    "id": "royal_seal",
    "n": "로열 실링",
    "url": "bn/top/royal_porcelain/bn_prop_royal_seal.png"
   }
  ]
 },
 "top_sky_cloud": {
  "n": "하늘 구름",
  "type": "top",
  "bg": "bn/top/sky_cloud/bn_top_sky_cloud_bg.png",
  "props": [
   {
    "id": "sky_cloud",
    "n": "하늘 구름",
    "url": "bn/top/sky_cloud/bn_prop_sky_cloud.png"
   },
   {
    "id": "sky_sparkle",
    "n": "하늘 반짝이",
    "url": "bn/top/sky_cloud/bn_prop_sky_sparkle.png"
   },
   {
    "id": "sky_sun_halo",
    "n": "태양 헤일로",
    "url": "bn/top/sky_cloud/bn_prop_sky_sun_halo.png"
   },
   {
    "id": "sky_wave_ribbon",
    "n": "ribbon",
    "url": "bn/top/sky_cloud/bn_prop_sky_wave_ribbon.png"
   },
   {
    "id": "sky_wing",
    "n": "하늘 날개",
    "url": "bn/top/sky_cloud/bn_prop_sky_wing.png"
   }
  ]
 },
 "top_strawberry_milk": {
  "n": "딸기 우유",
  "type": "top",
  "bg": "bn/top/strawberry_milk/bn_top_strawberry_milk_bg.png",
  "props": [
   {
    "id": "gingham_bow",
    "n": "깅엄 리본",
    "url": "bn/top/strawberry_milk/bn_prop_gingham_bow.png"
   },
   {
    "id": "milk_bottle_blank",
    "n": "보틀 빈",
    "url": "bn/top/strawberry_milk/bn_prop_milk_bottle_blank.png"
   },
   {
    "id": "strawberry_cluster",
    "n": "딸기 클러스터",
    "url": "bn/top/strawberry_milk/bn_prop_strawberry_cluster.png"
   }
  ]
 },
 "top_sunset_wave": {
  "n": "선셋 웨이브",
  "type": "top",
  "bg": "bn/top/sunset_wave/bn_top_sunset_wave_bg.png",
  "props": [
   {
    "id": "coral_wave_ribbon",
    "n": "ribbon",
    "url": "bn/top/sunset_wave/bn_prop_coral_wave_ribbon.png"
   },
   {
    "id": "coral_wing",
    "n": "코랄 날개",
    "url": "bn/top/sunset_wave/bn_prop_coral_wing.png"
   },
   {
    "id": "sunset_halo_disc",
    "n": "헤일로 디스크",
    "url": "bn/top/sunset_wave/bn_prop_sunset_halo_disc.png"
   }
  ]
 },
 "top_violet_perfume": {
  "n": "바이올렛 퍼퓸",
  "type": "top",
  "bg": "bn/top/violet_perfume/bn_top_violet_perfume_bg.png",
  "props": [
   {
    "id": "crystal_fan_frame",
    "n": "부채 프레임",
    "url": "bn/top/violet_perfume/bn_prop_crystal_fan_frame.png"
   },
   {
    "id": "perfume_bottle_blank",
    "n": "보틀 빈",
    "url": "bn/top/violet_perfume/bn_prop_perfume_bottle_blank.png"
   },
   {
    "id": "violet_flower",
    "n": "바이올렛 꽃",
    "url": "bn/top/violet_perfume/bn_prop_violet_flower.png"
   }
  ]
 },
 "top_winter_crystal": {
  "n": "윈터 크리스탈",
  "type": "top",
  "bg": "bn/top/winter_crystal/bn_top_winter_crystal_bg.png",
  "props": [
   {
    "id": "crystal_pendant",
    "n": "크리스탈 펜던트",
    "url": "bn/top/winter_crystal/bn_prop_crystal_pendant.png"
   },
   {
    "id": "frosted_frame_corner",
    "n": "프레임 코너장식",
    "url": "bn/top/winter_crystal/bn_prop_frosted_frame_corner.png"
   },
   {
    "id": "ice_snowflake",
    "n": "아이스 눈꽃",
    "url": "bn/top/winter_crystal/bn_prop_ice_snowflake.png"
   }
  ]
 },
 "bot_angel_pastel": {
  "n": "엔젤 파스텔",
  "type": "bottom",
  "bg": "bn/bottom/angel_pastel/bn_bottom_angel_pastel_bg.png",
  "props": [
   {
    "id": "angel_bow",
    "n": "엔젤 리본",
    "url": "bn/bottom/angel_pastel/bn_prop_angel_bow.png"
   },
   {
    "id": "angel_crystal_drop",
    "n": "크리스탈 방울",
    "url": "bn/bottom/angel_pastel/bn_prop_angel_crystal_drop.png"
   },
   {
    "id": "angel_feather",
    "n": "엔젤 깃털",
    "url": "bn/bottom/angel_pastel/bn_prop_angel_feather.png"
   },
   {
    "id": "angel_halo_ring",
    "n": "헤일로 링",
    "url": "bn/bottom/angel_pastel/bn_prop_angel_halo_ring.png"
   },
   {
    "id": "angel_heart_gem",
    "n": "하트 보석",
    "url": "bn/bottom/angel_pastel/bn_prop_angel_heart_gem.png"
   }
  ]
 },
 "bot_aqua_bubble": {
  "n": "아쿠아 버블",
  "type": "bottom",
  "bg": "bn/bottom/aqua_bubble/bn_bottom_aqua_bubble_bg.png",
  "props": [
   {
    "id": "aqua_bubble_ring",
    "n": "버블 링",
    "url": "bn/bottom/aqua_bubble/bn_prop_aqua_bubble_ring.png"
   },
   {
    "id": "aqua_droplet",
    "n": "아쿠아 물방울",
    "url": "bn/bottom/aqua_bubble/bn_prop_aqua_droplet.png"
   },
   {
    "id": "aqua_shell",
    "n": "아쿠아 조개",
    "url": "bn/bottom/aqua_bubble/bn_prop_aqua_shell.png"
   }
  ]
 },
 "bot_autumn_velvet": {
  "n": "어텀 벨벳",
  "type": "bottom",
  "bg": "bn/bottom/autumn_velvet/bn_bottom_autumn_velvet_bg.png",
  "props": [
   {
    "id": "amber_rose",
    "n": "앰버 장미",
    "url": "bn/bottom/autumn_velvet/bn_prop_amber_rose.png"
   },
   {
    "id": "cocoa_leaf_sprig",
    "n": "잎사귀 가지",
    "url": "bn/bottom/autumn_velvet/bn_prop_cocoa_leaf_sprig.png"
   },
   {
    "id": "velvet_bow",
    "n": "벨벳 리본",
    "url": "bn/bottom/autumn_velvet/bn_prop_velvet_bow.png"
   }
  ]
 },
 "bot_botanical_lace": {
  "n": "보태니컬 레이스",
  "type": "bottom",
  "bg": "bn/bottom/botanical_lace/bn_bottom_botanical_lace_bg.png",
  "props": [
   {
    "id": "botanical_butterfly",
    "n": "보태니컬 나비",
    "url": "bn/bottom/botanical_lace/bn_prop_botanical_butterfly.png"
   },
   {
    "id": "botanical_lace_corner",
    "n": "레이스 코너장식",
    "url": "bn/bottom/botanical_lace/bn_prop_botanical_lace_corner.png"
   },
   {
    "id": "botanical_leaf_sprig",
    "n": "잎사귀 가지",
    "url": "bn/bottom/botanical_lace/bn_prop_botanical_leaf_sprig.png"
   },
   {
    "id": "botanical_pearl_frame",
    "n": "진주 프레임",
    "url": "bn/bottom/botanical_lace/bn_prop_botanical_pearl_frame.png"
   },
   {
    "id": "botanical_rose",
    "n": "보태니컬 장미",
    "url": "bn/bottom/botanical_lace/bn_prop_botanical_rose.png"
   }
  ]
 },
 "bot_candy_pop": {
  "n": "캔디 팝",
  "type": "bottom",
  "bg": "bn/bottom/candy_pop/bn_bottom_candy_pop_bg.png",
  "props": [
   {
    "id": "candy_donut",
    "n": "캔디 도넛",
    "url": "bn/bottom/candy_pop/bn_prop_candy_donut.png"
   },
   {
    "id": "candy_gummy_star",
    "n": "젤리 별",
    "url": "bn/bottom/candy_pop/bn_prop_candy_gummy_star.png"
   },
   {
    "id": "candy_lollipop",
    "n": "캔디 롤리팝",
    "url": "bn/bottom/candy_pop/bn_prop_candy_lollipop.png"
   },
   {
    "id": "candy_soda_bottle",
    "n": "소다 보틀",
    "url": "bn/bottom/candy_pop/bn_prop_candy_soda_bottle.png"
   },
   {
    "id": "candy_wrapped",
    "n": "캔디 캔디",
    "url": "bn/bottom/candy_pop/bn_prop_candy_wrapped.png"
   }
  ]
 },
 "bot_cherry_checker": {
  "n": "체리 체커",
  "type": "bottom",
  "bg": "bn/bottom/cherry_checker/bn_bottom_cherry_checker_bg.png",
  "props": [
   {
    "id": "checker_bow",
    "n": "체커 리본",
    "url": "bn/bottom/cherry_checker/bn_prop_checker_bow.png"
   },
   {
    "id": "checker_heart",
    "n": "체커 하트",
    "url": "bn/bottom/cherry_checker/bn_prop_checker_heart.png"
   },
   {
    "id": "cherry_pair_flat",
    "n": "두 알 플랫",
    "url": "bn/bottom/cherry_checker/bn_prop_cherry_pair_flat.png"
   }
  ]
 },
 "bot_cocoa_bakery": {
  "n": "코코아 베이커리",
  "type": "bottom",
  "bg": "bn/bottom/cocoa_bakery/bn_bottom_cocoa_bakery_bg.png",
  "props": [
   {
    "id": "chocolate_sweet",
    "n": "초콜릿 사탕",
    "url": "bn/bottom/cocoa_bakery/bn_prop_chocolate_sweet.png"
   },
   {
    "id": "cocoa_bottle",
    "n": "코코아 보틀",
    "url": "bn/bottom/cocoa_bakery/bn_prop_cocoa_bottle.png"
   },
   {
    "id": "cocoa_pastry_ring",
    "n": "페이스트리 링",
    "url": "bn/bottom/cocoa_bakery/bn_prop_cocoa_pastry_ring.png"
   }
  ]
 },
 "bot_coral_scrap": {
  "n": "코랄 스크랩",
  "type": "bottom",
  "bg": "bn/bottom/coral_scrap/bn_bottom_coral_scrap_bg.png",
  "props": [
   {
    "id": "coral_clip",
    "n": "코랄 클립",
    "url": "bn/bottom/coral_scrap/bn_prop_coral_clip.png"
   },
   {
    "id": "coral_label",
    "n": "코랄 라벨",
    "url": "bn/bottom/coral_scrap/bn_prop_coral_label.png"
   },
   {
    "id": "coral_tape",
    "n": "코랄 테이프",
    "url": "bn/bottom/coral_scrap/bn_prop_coral_tape.png"
   }
  ]
 },
 "bot_denim_patch": {
  "n": "데님 패치",
  "type": "bottom",
  "bg": "bn/bottom/denim_patch/bn_bottom_denim_patch_bg.png",
  "props": [
   {
    "id": "denim_bow",
    "n": "데님 리본",
    "url": "bn/bottom/denim_patch/bn_prop_denim_bow.png"
   },
   {
    "id": "denim_pin",
    "n": "데님 핀",
    "url": "bn/bottom/denim_patch/bn_prop_denim_pin.png"
   },
   {
    "id": "denim_star_patch",
    "n": "별 패치",
    "url": "bn/bottom/denim_patch/bn_prop_denim_star_patch.png"
   }
  ]
 },
 "bot_emerald_deco": {
  "n": "에메랄드 데코",
  "type": "bottom",
  "bg": "bn/bottom/emerald_deco/bn_bottom_emerald_deco_bg.png",
  "props": [
   {
    "id": "emerald_corner",
    "n": "에메랄드 코너장식",
    "url": "bn/bottom/emerald_deco/bn_prop_emerald_corner.png"
   },
   {
    "id": "emerald_fan",
    "n": "에메랄드 부채",
    "url": "bn/bottom/emerald_deco/bn_prop_emerald_fan.png"
   },
   {
    "id": "emerald_gem",
    "n": "에메랄드 보석",
    "url": "bn/bottom/emerald_deco/bn_prop_emerald_gem.png"
   }
  ]
 },
 "bot_honey_garden": {
  "n": "허니 가든",
  "type": "bottom",
  "bg": "bn/bottom/honey_garden/bn_bottom_honey_garden_bg.png",
  "props": [
   {
    "id": "amber_butterfly",
    "n": "앰버 나비",
    "url": "bn/bottom/honey_garden/bn_prop_amber_butterfly.png"
   },
   {
    "id": "cream_wildflower",
    "n": "크림 들꽃",
    "url": "bn/bottom/honey_garden/bn_prop_cream_wildflower.png"
   },
   {
    "id": "honey_rose",
    "n": "허니 장미",
    "url": "bn/bottom/honey_garden/bn_prop_honey_rose.png"
   }
  ]
 },
 "bot_lavender_postcard": {
  "n": "라벤더 엽서",
  "type": "bottom",
  "bg": "bn/bottom/lavender_postcard/bn_bottom_lavender_postcard_bg.png",
  "props": [
   {
    "id": "lavender_envelope",
    "n": "라벤더 편지봉투",
    "url": "bn/bottom/lavender_postcard/bn_prop_lavender_envelope.png"
   },
   {
    "id": "lavender_plane",
    "n": "라벤더 종이비행기",
    "url": "bn/bottom/lavender_postcard/bn_prop_lavender_plane.png"
   },
   {
    "id": "lavender_seal",
    "n": "라벤더 실링",
    "url": "bn/bottom/lavender_postcard/bn_prop_lavender_seal.png"
   }
  ]
 },
 "bot_lilac_ballet": {
  "n": "라일락 발레",
  "type": "bottom",
  "bg": "bn/bottom/lilac_ballet/bn_bottom_lilac_ballet_bg.png",
  "props": [
   {
    "id": "ballet_crystal_drop",
    "n": "크리스탈 방울",
    "url": "bn/bottom/lilac_ballet/bn_prop_ballet_crystal_drop.png"
   },
   {
    "id": "lilac_bow",
    "n": "라일락 리본",
    "url": "bn/bottom/lilac_ballet/bn_prop_lilac_bow.png"
   },
   {
    "id": "lilac_halo_ring",
    "n": "헤일로 링",
    "url": "bn/bottom/lilac_ballet/bn_prop_lilac_halo_ring.png"
   }
  ]
 },
 "bot_midnight_arc": {
  "n": "미드나잇 아크",
  "type": "bottom",
  "bg": "bn/bottom/midnight_arc/bn_bottom_midnight_arc_bg.png",
  "props": [
   {
    "id": "midnight_crescent",
    "n": "미드나잇 초승달",
    "url": "bn/bottom/midnight_arc/bn_prop_midnight_crescent.png"
   },
   {
    "id": "midnight_orbit",
    "n": "미드나잇 궤도",
    "url": "bn/bottom/midnight_arc/bn_prop_midnight_orbit.png"
   },
   {
    "id": "midnight_shard",
    "n": "미드나잇 조각",
    "url": "bn/bottom/midnight_arc/bn_prop_midnight_shard.png"
   }
  ]
 },
 "bot_mint_cafe": {
  "n": "민트 카페",
  "type": "bottom",
  "bg": "bn/bottom/mint_cafe/bn_bottom_mint_cafe_bg.png",
  "props": [
   {
    "id": "mint_bottle",
    "n": "민트 보틀",
    "url": "bn/bottom/mint_cafe/bn_prop_mint_bottle.png"
   },
   {
    "id": "mint_macaron_ring",
    "n": "마카롱 링",
    "url": "bn/bottom/mint_cafe/bn_prop_mint_macaron_ring.png"
   },
   {
    "id": "mint_sweet",
    "n": "민트 사탕",
    "url": "bn/bottom/mint_cafe/bn_prop_mint_sweet.png"
   }
  ]
 },
 "bot_monochrome_silver": {
  "n": "모노 실버",
  "type": "bottom",
  "bg": "bn/bottom/monochrome_silver/bn_bottom_monochrome_silver_bg.png",
  "props": [
   {
    "id": "checker_star",
    "n": "체커 별",
    "url": "bn/bottom/monochrome_silver/bn_prop_checker_star.png"
   },
   {
    "id": "chrome_heart",
    "n": "크롬 하트",
    "url": "bn/bottom/monochrome_silver/bn_prop_chrome_heart.png"
   },
   {
    "id": "silver_chain_loop",
    "n": "체인 고리",
    "url": "bn/bottom/monochrome_silver/bn_prop_silver_chain_loop.png"
   }
  ]
 },
 "bot_moon_dream": {
  "n": "문 드림",
  "type": "bottom",
  "bg": "bn/bottom/moon_dream/bn_bottom_moon_dream_bg.png",
  "props": [
   {
    "id": "moon_crescent",
    "n": "달 초승달",
    "url": "bn/bottom/moon_dream/bn_prop_moon_crescent.png"
   },
   {
    "id": "moon_crystal_cluster",
    "n": "크리스탈 클러스터",
    "url": "bn/bottom/moon_dream/bn_prop_moon_crystal_cluster.png"
   },
   {
    "id": "moon_planet",
    "n": "달 행성",
    "url": "bn/bottom/moon_dream/bn_prop_moon_planet.png"
   },
   {
    "id": "moon_shooting_star",
    "n": "유성 별",
    "url": "bn/bottom/moon_dream/bn_prop_moon_shooting_star.png"
   },
   {
    "id": "moon_star",
    "n": "달 별",
    "url": "bn/bottom/moon_dream/bn_prop_moon_star.png"
   }
  ]
 },
 "bot_peach_blossom": {
  "n": "복사꽃",
  "type": "bottom",
  "bg": "bn/bottom/peach_blossom/bn_bottom_peach_blossom_bg.png",
  "props": [
   {
    "id": "blossom_lace_corner",
    "n": "레이스 코너장식",
    "url": "bn/bottom/peach_blossom/bn_prop_blossom_lace_corner.png"
   },
   {
    "id": "peach_butterfly",
    "n": "피치 나비",
    "url": "bn/bottom/peach_blossom/bn_prop_peach_butterfly.png"
   },
   {
    "id": "peach_rose",
    "n": "피치 장미",
    "url": "bn/bottom/peach_blossom/bn_prop_peach_rose.png"
   }
  ]
 },
 "bot_prism_rain": {
  "n": "프리즘 레인",
  "type": "bottom",
  "bg": "bn/bottom/prism_rain/bn_bottom_prism_rain_bg.png",
  "props": [
   {
    "id": "pastel_rainbow_ring",
    "n": "무지개 링",
    "url": "bn/bottom/prism_rain/bn_prop_pastel_rainbow_ring.png"
   },
   {
    "id": "prism_cluster",
    "n": "프리즘 클러스터",
    "url": "bn/bottom/prism_rain/bn_prop_prism_cluster.png"
   },
   {
    "id": "prism_droplet",
    "n": "프리즘 물방울",
    "url": "bn/bottom/prism_rain/bn_prop_prism_droplet.png"
   }
  ]
 },
 "bot_retro_arcade": {
  "n": "레트로 아케이드",
  "type": "bottom",
  "bg": "bn/bottom/retro_arcade/bn_bottom_retro_arcade_bg.png",
  "props": [
   {
    "id": "arcade_controller",
    "n": "아케이드 게임패드",
    "url": "bn/bottom/retro_arcade/bn_prop_arcade_controller.png"
   },
   {
    "id": "arcade_joystick",
    "n": "아케이드 조이스틱",
    "url": "bn/bottom/retro_arcade/bn_prop_arcade_joystick.png"
   },
   {
    "id": "arcade_pixel_bolt",
    "n": "픽셀 번개",
    "url": "bn/bottom/retro_arcade/bn_prop_arcade_pixel_bolt.png"
   },
   {
    "id": "arcade_pixel_heart",
    "n": "픽셀 하트",
    "url": "bn/bottom/retro_arcade/bn_prop_arcade_pixel_heart.png"
   },
   {
    "id": "arcade_token",
    "n": "아케이드 토큰",
    "url": "bn/bottom/retro_arcade/bn_prop_arcade_token.png"
   }
  ]
 },
 "side_aqua_ripple": {
  "n": "아쿠아 리플",
  "type": "side",
  "bg": "bn/side/aqua_ripple/bn_side_aqua_ripple_bg.png",
  "props": [
   {
    "id": "aqua_ripple_ring",
    "n": "물결 링",
    "url": "bn/side/aqua_ripple/bn_prop_aqua_ripple_ring.png"
   }
  ]
 },
 "side_candy_mosaic": {
  "n": "캔디 모자이크",
  "type": "side",
  "bg": "bn/side/candy_mosaic/bn_side_candy_mosaic_bg.png",
  "props": [
   {
    "id": "candy_diamond",
    "n": "캔디 다이아",
    "url": "bn/side/candy_mosaic/bn_prop_candy_diamond.png"
   }
  ]
 },
 "side_citrus_stripe": {
  "n": "시트러스 스트라이프",
  "type": "side",
  "bg": "bn/side/citrus_stripe/bn_side_citrus_stripe_bg.png",
  "props": [
   {
    "id": "citrus_wedge",
    "n": "시트러스 조각",
    "url": "bn/side/citrus_stripe/bn_prop_citrus_wedge.png"
   }
  ]
 },
 "side_coral_bubble": {
  "n": "코랄 버블",
  "type": "side",
  "bg": "bn/side/coral_bubble/bn_side_coral_bubble_bg.png",
  "props": [
   {
    "id": "coral_bubble_cluster",
    "n": "버블 클러스터",
    "url": "bn/side/coral_bubble/bn_prop_coral_bubble_cluster.png"
   }
  ]
 },
 "side_film_archive": {
  "n": "필름 아카이브",
  "type": "side",
  "bg": "bn/side/film_archive/bn_side_film_archive_bg.png",
  "props": []
 },
 "side_forest_tile": {
  "n": "포레스트 타일",
  "type": "side",
  "bg": "bn/side/forest_tile/bn_side_forest_tile_bg.png",
  "props": [
   {
    "id": "forest_leaf_badge",
    "n": "잎사귀 배지",
    "url": "bn/side/forest_tile/bn_prop_forest_leaf_badge.png"
   }
  ]
 },
 "side_gold_arch": {
  "n": "골드 아치",
  "type": "side",
  "bg": "bn/side/gold_arch/bn_side_gold_arch_bg.png",
  "props": [
   {
    "id": "gold_arch_gem",
    "n": "아치 보석",
    "url": "bn/side/gold_arch/bn_prop_gold_arch_gem.png"
   }
  ]
 },
 "side_indie_ticket": {
  "n": "인디 티켓",
  "type": "side",
  "bg": "bn/side/indie_ticket/bn_side_indie_ticket_bg.png",
  "props": []
 },
 "side_indigo_checker": {
  "n": "인디고 체커",
  "type": "side",
  "bg": "bn/side/indigo_checker/bn_side_indigo_checker_bg.png",
  "props": [
   {
    "id": "indigo_checker_star",
    "n": "체커 별",
    "url": "bn/side/indigo_checker/bn_prop_indigo_checker_star.png"
   }
  ]
 },
 "side_ink_wave": {
  "n": "잉크 웨이브",
  "type": "side",
  "bg": "bn/side/ink_wave/bn_side_ink_wave_bg.png",
  "props": [
   {
    "id": "ink_wave_badge",
    "n": "웨이브 배지",
    "url": "bn/side/ink_wave/bn_prop_ink_wave_badge.png"
   }
  ]
 },
 "side_lilac_weave": {
  "n": "라일락 위브",
  "type": "side",
  "bg": "bn/side/lilac_weave/bn_side_lilac_weave_bg.png",
  "props": [
   {
    "id": "lilac_bow_badge",
    "n": "리본 배지",
    "url": "bn/side/lilac_weave/bn_prop_lilac_bow_badge.png"
   }
  ]
 },
 "side_magazine": {
  "n": "매거진",
  "type": "side",
  "bg": "bn/side/magazine/bn_side_magazine_bg.png",
  "props": []
 },
 "side_navy_airmail": {
  "n": "네이비 에어메일",
  "type": "side",
  "bg": "bn/side/navy_airmail/bn_side_navy_airmail_bg.png",
  "props": [
   {
    "id": "navy_plane",
    "n": "네이비 종이비행기",
    "url": "bn/side/navy_airmail/bn_prop_navy_plane.png"
   }
  ]
 },
 "side_neon_grid": {
  "n": "네온 그리드",
  "type": "side",
  "bg": "bn/side/neon_grid/bn_side_neon_grid_bg.png",
  "props": [
   {
    "id": "neon_diamond",
    "n": "네온 다이아",
    "url": "bn/side/neon_grid/bn_prop_neon_diamond.png"
   }
  ]
 },
 "side_postage": {
  "n": "우표",
  "type": "side",
  "bg": "bn/side/postage/bn_side_postage_bg.png",
  "props": []
 },
 "side_prism_herringbone": {
  "n": "프리즘 헤링본",
  "type": "side",
  "bg": "bn/side/prism_herringbone/bn_side_prism_herringbone_bg.png",
  "props": [
   {
    "id": "prism_shard",
    "n": "프리즘 조각",
    "url": "bn/side/prism_herringbone/bn_prop_prism_shard.png"
   }
  ]
 },
 "side_rose_marble": {
  "n": "로즈 마블",
  "type": "side",
  "bg": "bn/side/rose_marble/bn_side_rose_marble_bg.png",
  "props": [
   {
    "id": "marble_heart",
    "n": "마블 하트",
    "url": "bn/side/rose_marble/bn_prop_marble_heart.png"
   }
  ]
 },
 "side_sky_cloud": {
  "n": "하늘 구름",
  "type": "side",
  "bg": "bn/side/sky_cloud/bn_side_sky_cloud_bg.png",
  "props": []
 },
 "side_sunset_blocks": {
  "n": "선셋 블록",
  "type": "side",
  "bg": "bn/side/sunset_blocks/bn_side_sunset_blocks_bg.png",
  "props": [
   {
    "id": "sunset_gem",
    "n": "선셋 보석",
    "url": "bn/side/sunset_blocks/bn_prop_sunset_gem.png"
   }
  ]
 },
 "side_terracotta_mosaic": {
  "n": "테라코타 모자이크",
  "type": "side",
  "bg": "bn/side/terracotta_mosaic/bn_side_terracotta_mosaic_bg.png",
  "props": [
   {
    "id": "tile_medallion",
    "n": "타일 메달리온",
    "url": "bn/side/terracotta_mosaic/bn_prop_tile_medallion.png"
   }
  ]
 }
};
  for (var k in T) if (!window.BN_ART.themes[k]) window.BN_ART.themes[k] = T[k];
})();
