
import { DaySchedule, ChecklistItem, LocationDetail, UsefulLink, EmergencyContact } from './types';

// Google Apps Script URL for Expenses
export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzzUfpIKQr_chQfhyu_mUh718ZBomovQwmHebKd-M10WVCimYeaAFfHdGd_upZ0DvB4MA/exec';
// Optional: Google Sheet URL for direct access (Placeholder)
export const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1GxlqNNOFl6M7GkjXaAmaFiLY90Ia_irHyerJ6_v0258/edit?gid=1261285869#gid=1261285869';

export const PRE_TRIP_NOTES = [
  "機場很冷要帶外套",
  "注意手提、托運攜帶規定",
  "購物前先找好有沒有折價券",
  "護照每天都要隨身攜帶"
];

export const TODO_LIST: ChecklistItem[] = [
  { id: 'todo_1', text: 'eSIM (5日)' },
  { id: 'todo_2', text: '高速巴士預約 (東京到河口湖，一個月前)' },
  { id: 'todo_3', text: '高速巴士預約 (御殿場到東京，一個月前)' },
  { id: 'todo_4', text: 'Skyliner 車票' },
  { id: 'todo_5', text: '箱根周遊券' },
  { id: 'todo_6', text: '租車 (已預約 2/28)' },
];

export const PACKING_CARRY_ON: ChecklistItem[] = [
  { id: 'co_2', text: '充電用具 (手機、手錶、行充)' },
  { id: 'co_3', text: '台灣駕照' },
  { id: 'co_4', text: '駕照譯本' },
  { id: 'co_5', text: '護照' },
  { id: 'co_6', text: '信用卡' },
  { id: 'co_7', text: '錢包 (日幣)' },
  { id: 'co_8', text: '耳機' },
  { id: 'co_9', text: '行動電源' },
  { id: 'co_10', text: '保溫杯' },
  { id: 'co_11', text: '牙線棒' },
];

export const PACKING_CHECKED: ChecklistItem[] = [
  { id: 'ch_1', text: '護唇膏、雨傘、面紙' },
  { id: 'ch_2', text: '口罩、眼藥水' },
  { id: 'ch_3', text: '手機掛繩' },
  { id: 'ch_4', text: '浴巾、毛巾' },
  { id: 'ch_5', text: '破魔矢 (回程)' },
  { id: 'ch_6', text: '錢包 (台幣)' },
  { id: 'ch_7', text: '換洗衣物 (衣褲鞋襪)' },
  { id: 'ch_8', text: '行李袋 (備用)' },
  { id: 'ch_9', text: '保養品 (卸妝、洗面乳)' },
  { id: 'ch_10', text: '化妝品 (底妝、眼線、口紅)' },
  { id: 'ch_11', text: '防曬噴霧' },
  { id: 'ch_12', text: '護髮、定型液' },
  { id: 'ch_13', text: '牙刷牙膏' },
  { id: 'ch_14', text: '折疊衣架' },
  { id: 'ch_15', text: '髮夾、髮圈、梳子' },
  { id: 'ch_16', text: '睡衣' },
  { id: 'ch_17', text: '藥品 (內外用、痠痛藥)' },
  { id: 'ch_18', text: '小洗衣板' },
  { id: 'ch_19', text: '離子夾' },
  { id: 'ch_20', text: '指甲剪' },
];

export const USEFUL_LINKS: UsefulLink[] = [
  { title: 'Visit Japan Web (入境手續)', url: 'https://vjw-lp.digital.go.jp/zh-hant/' },
  { title: '箱根纜車', url: 'https://www.hakonenavi.jp/hakone-ropeway/' },
  { title: '逆富士預報', url: 'https://fujitiensan.com/kawaguchiko-sakasafuji/' },
  { title: '富士地區巴士', url: 'https://bus.fujikyu.co.jp/rosen/fujigoko' },
  { title: '御殿場 Outlet 地圖', url: 'https://platinumaps.jp/d/premiumoutlets-gotemba?culture=en&floor=2F' },
  { title: '河口湖 Live Camera', url: 'https://www.town.fujikawaguchiko.lg.jp/info/info.php?if_id=7' },
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { title: '警察', number: '110' },
  { title: '救護/火警', number: '119' },
  { title: '訪日外國人急難熱線 (JNTO)', number: '050-3816-2787', note: '24小時多語種對應' },
];

export const LOCATION_DETAILS: Record<string, LocationDetail> = {
  'hotel_new_century': {
    id: 'hotel_new_century',
    title: '河口湖新世紀飯店',
    description: '位於河口湖畔的溫泉飯店，所有客房均面湖，可一覽富士山與河口湖的壯麗景色。提供日式傳統服務與懷石料理。',
    address: '山梨県南都留郡富士河口湖町くぬぎ平180-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+New+Century+Kawaguchiko',
    websiteUrl: 'http://www.hotel-newcentury.com/',
    carNaviPhone: '0555-72-1422'
  },
  'super_hotel_gotemba': {
    id: 'super_hotel_gotemba',
    title: '御殿場2號超級飯店 (Super Hotel)',
    description: '位於御殿場市中心的高CP值商務飯店，以提供天然溫泉「御胎内温泉」與健康營養的免費早餐聞名。距離御殿場 Outlet 與車站皆便利。',
    address: '静岡県御殿場市東田中1029-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Super+Hotel+Gotemba+2',
    websiteUrl: 'https://www.superhotel.co.jp/s_hotels/gotemba2/',
    carNaviPhone: '0550-84-9000',
    reservation: {
      id: '3124-5424-9496',
      sections: [
        {
          title: '預訂人資料',
          items: [
            { label: '預訂者', value: 'Shi Yi Chang' },
            { label: '預訂地址', value: '201003 台灣 2 F., No. 50, Huayuan 3rd St., Xinyi Dist., Keelung City', isFullWidth: true },
          ]
        },
        {
          title: '住宿者資訊',
          items: [
            { label: '代表人', value: 'Shi Yi Chang' },
            { label: '人數', value: '2人 (1男 1女)' },
            { label: '電話', value: '+886953735805' },
            { label: 'Email', value: 'sandy060321@gmail.com' },
          ]
        },
        {
          title: '預訂資料',
          items: [
            { label: '方案', value: '最優惠價格方案', isFullWidth: true },
            { label: '入住', value: '2026-03-01' },
            { label: '退房', value: '2026-03-02' },
            { label: '入住時間', value: '15:00 ～ 24:00' },
            { label: '退房時間', value: '10:00' },
            { label: '抵達時間', value: '21:00' },
            { label: '房型', value: '【禁菸】富士山觀景房', isFullWidth: true },
            { label: '付款方式', value: '現場支付' },
          ]
        },
        {
          title: '費用明細',
          items: [
            { label: '費用合計', value: '10,440 JPY (含稅)' },
            { label: '取消政策', value: '2/28前免費；入住當日/未到全額 (100%)', isFullWidth: true },
          ]
        }
      ]
    }
  },
  'skyliner': {
    id: 'skyliner',
    title: '京成 Skyliner',
    description: '連接成田機場與上野/日暮里最快速的交通工具，全車對號座，提供舒適快捷的移動體驗。',
    websiteUrl: 'https://www.keisei.co.jp/keisei/tetudou/skyliner/tc/traffic/skyliner.php'
  },
  'nippon_rentacar': {
    id: 'nippon_rentacar',
    title: '租車預約 (ニッポンレンタカー)',
    description: `【ご予約番号】
予約番号  ：119030360
予約パスワード：7992ff48

【お客様情報】
　　お名前：Chang Shi Yi
　　フリガナ：チョウ　シギ
　　メールアドレス：sandy060321@gmail.com
　　電話番号：0953735805 ※メールにてご連絡できない場合利用します
　　乗車人数：2

【ご予約内容】
　　貸出日時：2026年02月28日 (土) 09:30
　　返却日時：2026年02月28日 (土) 19:00

　　レンタカー会社名：ニッポンレンタカー
　　車種：禁煙車 フィット同等クラス（SS）
　　禁煙／喫煙の希望：禁煙車を希望する

　　出発店舗：河口湖駅前営業所
　　出発店舗住所：山梨県南都留郡富士河口湖町船津3647-1
　　ご連絡先：050-1712-2693
　　店舗情報：https://www.tabirai.net/car/yamanashi/company/nippon/branch/?PID=4573`,
    address: '山梨県南都留郡富士河口湖町船津3647-1',
    carNaviPhone: '050-1712-2693',
    websiteUrl: 'https://www.tabirai.net/car/yamanashi/company/nippon/branch/?PID=4573'
  },
  'golden_torii': {
    id: 'golden_torii',
    title: '富士山金鳥居',
    description: '位於富士吉田市區的標誌性景點（本町通），巨大的金色鳥居跨越道路，將商店街與背景的富士山框成一幅畫，是熱門的攝影地標。',
    address: '山梨県富士吉田市上吉田',
    mapUrl: 'https://maps.app.goo.gl/zh8fMj4S3hbSNnVn7',
    websiteUrl: 'https://tokyo.letsgojp.com/archives/745170/'
  },
  'oshino_hakkai': {
    id: 'oshino_hakkai',
    title: '忍野八海',
    description: '位於山中湖和河口湖之間的忍野村，由富士山融雪水經地下熔岩層過濾後湧出的八個清澈池塘組成，被列為國家天然紀念物。',
    address: '山梨県南都留郡忍野村忍草',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Oshino+Hakkai',
    websiteUrl: 'https://yamanakako.info/8lakes_top.php',
    carNaviPhone: '0555-84-3111'
  },
  'yamanakako': {
    id: 'yamanakako',
    title: '山中湖',
    description: '富士五湖中面積最大、海拔最高的湖泊。以能看見「鑽石富士」的景象聞名，周邊有豐富的自然景觀與咖啡廳。',
    address: '日本山梨縣南都留郡山中湖村',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lake+Yamanaka',
    websiteUrl: 'http://www.yamanakako.gr.jp/',
    carNaviPhone: '0555-62-3100'
  },
  'chureito_pagoda': {
    id: 'chureito_pagoda',
    title: '新倉山淺間公園',
    description: '世界知名的富士山觀景點，可以同時拍下五重塔（忠靈塔）、櫻花（季節性）與富士山的經典畫面，需攀登約400階樓梯。',
    address: '山梨県富士吉田市新倉3353-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chureito+Pagoda',
    websiteUrl: 'https://andyventure.com/japan-arakurayama-sengen-park/',
    carNaviPhone: '0555-23-2697'
  },
  'oishi_park': {
    id: 'oishi_park',
    title: '河口湖大石公園',
    description: '位於河口湖北岸，四季有不同的花卉盛開。著名的「花街道」全長350公尺，是眺望富士山的絕佳地點。',
    address: '山梨県南都留郡富士河口湖町大石2585',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Oishi+Park',
    websiteUrl: 'https://sliptojapan.com/fujisan-oishi-park/',
    carNaviPhone: '0555-76-8230'
  },
  'iyashi_no_sato': {
    id: 'iyashi_no_sato',
    title: '西湖療愈之里根場',
    description: '重現了20棟茅草屋頂的傳統村落，被譽為「富士山下的合掌村」。可在此體驗日本傳統工藝與穿著和服拍照。',
    address: '山梨県南都留郡富士河口湖町西湖根場2710',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Saiko+Iyashi-no-Sato+Nenba',
    websiteUrl: 'https://saikoiyashinosatonenba.jp/',
    carNaviPhone: '0555-20-4677'
  },
  'nakanokura_pass': {
    id: 'nakanokura_pass',
    title: '中ノ倉峠',
    description: '位於本栖湖畔的展望台，是日幣千圓紙鈔背面富士山圖案的取景地（逆富士）。需稍微登山健行才能抵達。',
    address: '山梨県南巨摩郡身延町中ノ倉川尻2926',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nakanokura+Pass+Observation+Point',
    websiteUrl: 'https://kanto.env.go.jp/to_2016/post_78.html',
    carNaviPhone: '0555-87-2518'
  },
  'hakone_museum': {
    id: 'hakone_museum',
    title: '箱根雕刻森林美術館',
    description: '日本第一座戶外美術館，在廣大的綠地中展示約120件近現代雕刻家作品。著名的「鴻運交響雕塑」塔樓內部彩繪玻璃令人驚艷。',
    address: '神奈川県足柄下郡箱根町二ノ平1121',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hakone+Open-Air+Museum',
    websiteUrl: 'https://www.hakone-oam.or.jp/'
  },
  'owakudani': {
    id: 'owakudani',
    title: '大涌谷',
    description: '約3000年前箱根火山爆發後形成的火山口遺跡，至今仍不斷噴發硫磺蒸氣。特產是用溫泉煮熟的「黑蛋」，傳說吃一顆能延壽七年。',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Owakudani',
    websiteUrl: 'http://www.owakudani.com/'
  },
  'pirate_ship': {
    id: 'pirate_ship',
    title: '箱根海賊觀光船',
    description: '航行於蘆之湖的觀光遊覽船，以中世紀歐洲戰艦為原型設計。可在船上飽覽蘆之湖風光與遠處的富士山。',
    address: '神奈川縣足柄下郡箱根町元箱根164',
    mapUrl: 'https://maps.app.goo.gl/dY286vdxb3APZnAZ8',
    websiteUrl: 'https://www.hakonenavi.jp/international/tw/station/togendai'
  },
  'hakone_shrine': {
    id: 'hakone_shrine',
    title: '箱根神社',
    description: '建於蘆之湖畔，擁有超過1200年歷史。矗立在湖水中的「平和的鳥居」是其標誌性景觀，充滿神秘莊嚴的氛圍。',
    address: '神奈川県足柄下郡箱根町元箱根80-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hakone+Shrine',
    websiteUrl: 'https://hakonejinja.or.jp/'
  },
  'gotemba_outlet': {
    id: 'gotemba_outlet',
    title: '御殿場 Premium Outlet',
    description: '日本國內規模最大的暢貨中心，擁有約290家店鋪。因為能一邊購物一邊眺望富士山而廣受歡迎。',
    address: '静岡県御殿場市深沢1312',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Gotemba+Premium+Outlets',
    websiteUrl: 'https://www.premiumoutlets.co.jp/gotemba/'
  },
  'asakusa_sensoji': {
    id: 'asakusa_sensoji',
    title: '淺草寺',
    description: '東京都內最古老的寺廟，供奉聖觀音。入口的「雷門」掛著巨大的紅燈籠，是東京最著名的地標之一。',
    address: '東京都台東区浅草2-3-1',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Senso-ji',
    websiteUrl: 'https://www.senso-ji.jp/'
  },
  'nakamise': {
    id: 'nakamise',
    title: '仲見世商店街',
    description: '連接雷門與淺草寺本堂的參道商店街，長約250公尺。兩旁排列著販賣人形燒、仙貝等傳統小吃與紀念品的店鋪。',
    address: '東京都台東区浅草',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Nakamise-dori+Street',
    websiteUrl: 'https://www.facebook.com/AsakusaNakamise/?ref=embed_page#'
  },
  'bus_to_museum': {
    id: 'bus_to_museum',
    title: '巴士轉乘資訊 (御殿場 → 彫刻の森)',
    description: `10:50 → 11:36 (46分)
總車資：1300円
轉乘：1回`,
    transitLegs: [
      {
        type: 'bus',
        transport: '小田急箱根高速巴士 [W線]',
        depTime: '10:50', depStop: '御殿場駅',
        arrTime: '11:11', arrStop: '箱根仙石',
        details: ['往箱根桃源台', '💰 730円', '下車：箱根仙石']
      },
      {
        type: 'walk',
        transport: '步行轉乘',
        depTime: '11:11', depStop: '箱根仙石',
        arrTime: '11:22', arrStop: '仙石',
        details: ['同站或對面', '⏱️ 11 分鐘', '前往：仙石']
      },
      {
        type: 'bus',
        transport: '箱根登山巴士 [M線]',
        depTime: '11:22', depStop: '仙石',
        arrTime: '11:36', arrStop: '彫刻の森美術館',
        details: ['往天悠', '💰 570円']
      }
    ]
  }
};

export const ITINERARY: DaySchedule[] = [
  {
    date: '2/27',
    weekday: '星期四',
    title: '抵達日本 → 河口湖溫泉',
    accommodation: '河口湖新世紀飯店',
    accommodationMapUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+New+Century+Kawaguchiko',
    mapUrl: 'https://www.google.com/maps/dir/Narita+Airport/Ueno+Station/Tokyo+Station/Kawaguchiko+Station/Hotel+New+Century',
    events: [
      { time: '10:35', description: '抵達成田機場並辦理入境手續', note: '預計 1 小時' },
      { time: '11:39', description: '搭乘 Skyliner 前往上野', note: '下一班 11:59', locationId: 'skyliner' },
      { time: '12:30', description: '抵達上野站，轉乘 JR 山手線至東京車站' },
      { time: '13:00', description: '抵達東京車站，購買午餐' },
      { time: '14:10', description: '搭乘高速巴士前往河口湖站', isHighlight: true, note: '預計 16:10 抵達' },
      { time: '16:30', description: '抵達河口湖站，聯繫飯店接駁' },
      { time: '17:00', description: 'Check-in 新世紀飯店，整理行李', locationId: 'hotel_new_century' },
      { time: '18:00', description: '前往富士山金鳥居一帶逛街+晚餐', locationId: 'golden_torii' },
      { time: '晚上', description: '回飯店泡湯' },
    ]
  },
  {
    date: '2/28',
    weekday: '星期五',
    title: '河口湖景點一日自駕',
    accommodation: '河口湖新世紀飯店',
    accommodationMapUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+New+Century+Kawaguchiko',
    mapUrl: 'https://www.google.com/maps/dir/Hotel+New+Century/Nippon+Rent-A-Car/Oshino+Hakkai/Yamanakako/Chureito+Pagoda/Oishi+Park/Saiko+Iyashi-no-Sato+Nenba/Nakanokura+Pass/Hotel+New+Century',
    events: [
      { time: '06:30', description: '於飯店房間內或湖畔看逆富士', isHighlight: true },
      { time: '08:30', description: '享用飯店早餐' },
      { time: '10:00', description: '前往河口湖站租車', note: 'ニッポンレンタカー (點擊查看預約)', locationId: 'nippon_rentacar' },
      { time: '10:20', description: '忍野八海', note: '停留 40 分鐘', locationId: 'oshino_hakkai' },
      { time: '11:20', description: '山中湖 + 咖啡廳/點心', locationId: 'yamanakako' },
      { time: '12:50', description: '新倉山淺間公園', isHighlight: true, note: '停留 1 小時', locationId: 'chureito_pagoda' },
      { time: '14:10', description: '河口湖大石公園', note: '停留 40 分鐘', locationId: 'oishi_park' },
      { time: '15:30', description: '西湖療愈之里根場', note: '停留 1 小時', locationId: 'iyashi_no_sato' },
      { time: '16:10', description: '中ノ倉峠', locationId: 'nakanokura_pass' },
      { time: '19:00', description: '回河口湖站還車' },
      { time: '晚上', description: '回飯店休息' }
    ]
  },
  {
    date: '3/01',
    weekday: '星期六',
    title: '箱根經典環線一日遊',
    accommodation: '御殿場2號超級飯店',
    accommodationMapUrl: 'https://www.google.com/maps/search/?api=1&query=Super+Hotel+Gotemba+2',
    mapUrl: 'https://www.google.com/maps/dir/Hotel+New+Century/Kawaguchiko+Station/Gotemba+Station/The+Hakone+Open-Air+Museum/Gora+Station/Owakudani/Togendai+Station/Hakone+Shrine/Gotemba+Station/Super+Hotel+Gotemba+2',
    events: [
      { time: '08:00', description: '早餐並退房，前往河口湖站' },
      { time: '09:00', description: '搭乘富士急巴士前往御殿場站', isHighlight: true },
      { time: '10:30', description: '抵達御殿場站，寄放行李' },
      { time: '10:50', description: '搭巴士至箱根雕刻森林美術館', locationId: 'bus_to_museum' },
      { time: '11:36', description: '參觀箱根雕刻森林美術館', note: '1.5 - 2 小時', locationId: 'hakone_museum' },
      { time: '13:30', description: '前往強羅站' },
      { time: '13:45', description: '搭乘登山纜車至早雲山，換空中纜車' },
      { time: '14:20', description: '大涌谷短暫停留', locationId: 'owakudani' },
      { time: '15:00', description: '抵達桃源台港，乘坐海賊觀光船', locationId: 'pirate_ship' },
      { time: '15:45', description: '抵達元箱根港，步行至箱根神社', isHighlight: true, locationId: 'hakone_shrine' },
      { time: '17:00', description: '搭乘巴士返回御殿場站' },
      { time: '18:00', description: '領取行李' },
      { time: '18:30', description: '步行至御殿場2號超級飯店 Check-in', locationId: 'super_hotel_gotemba' }
    ]
  },
  {
    date: '3/02',
    weekday: '星期日',
    title: '御殿場 Outlet → 東京淺草',
    accommodation: '淺草超級飯店',
    accommodationMapUrl: 'https://www.google.com/maps/search/?api=1&query=Super+Hotel+Asakusa',
    mapUrl: 'https://www.google.com/maps/dir/Super+Hotel+Gotemba+2/Gotemba+Premium+Outlets/Tokyo+Station/Asakusa/Super+Hotel+Asakusa',
    events: [
      { time: '09:00', description: '享用早餐，辦理退房' },
      { time: '10:00', description: '前往御殿場 Premium Outlet 購物', locationId: 'gotemba_outlet' },
      { time: '13:00', description: 'Outlet 或周邊享用午餐' },
      { time: '下午', description: '繼續 Outlet 購物 (預計停留 3-5 小時)' },
      { time: '17:00', description: '搭乘高速巴士返回東京' },
      { time: '19:30', description: '抵達東京，轉乘地鐵至淺草 Check-in' },
      { time: '晚上', description: '淺草飯店附近晚餐' }
    ]
  },
  {
    date: '3/03',
    weekday: '星期一',
    title: '淺草散策 → 桃園回程',
    accommodation: '溫暖的家',
    mapUrl: 'https://www.google.com/maps/dir/Super+Hotel+Asakusa/Senso-ji/Nakamise-dori/Kappabashi/Sumida+Park/Ueno+Station/Narita+Airport',
    events: [
      { time: '09:00', description: '淺草寺參拜，逛仲見世商店街', locationId: 'asakusa_sensoji' },
      { time: '11:00', description: '逛淺草周邊 (合羽橋道具街或隅田公園)', locationId: 'nakamise' },
      { time: '12:30', description: '淺草周邊午餐' },
      { time: '14:00', description: '搭地鐵前往上野站' },
      { time: '15:00', description: '抵達上野站，辦理登機，搭 Skyliner 至成田' },
      { time: '20:25', description: '登機回桃園 (IT203)', note: '23:30 抵達' }
    ]
  }
];
