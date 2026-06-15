// ub-data.jsx — UBCAB Express mock data (logistics dispatch)
// Exposed on window.UB

const _now = Date.now();
const _h = 3600000; // 1 цаг ms-ээр

const UB_DRIVER = {
  name: 'Б. Бат-Эрдэнэ',
  id: 'UB-1042',
  phone: '9911 8240',
  vehicle: 'Toyota Probox · 1234 УБА',
  rating: 4.9,
  zone: 'Баянзүрх дүүрэг',
};

const UB_CS = {
  name: 'Э. Сараа',
  id: 'CS-07',
  role: 'Үйлчилгээний ажилтан',
};

// Today's pickup / return tasks (parsed from the daily returns Excel the CS uploads)
const UB_TASKS = [
  {
    id: 'R-2208', customer: 'Г. Энхжаргал', phone: '8801 4520',
    district: 'Баянзүрх', khoroo: '14-р хороо', addr: 'Нархан хотхон, 12-р байр, 34 тоот',
    items: 'Эмэгтэй гутал × 1', amount: 189000, window: '10:00–12:00',
    created: new Date(_now - 8 * _h).toISOString(),
    status: 'pending', note: '', lat: 47.918, lng: 106.945,
  },
  {
    id: 'R-2209', customer: 'Д. Тэмүүлэн', phone: '9905 7711',
    district: 'Сүхбаатар', khoroo: '1-р хороо', addr: 'Олимп хотхон, B блок, 1502 тоот',
    items: 'Цахилгаан бараа × 2', amount: 0, window: '11:00–13:00',
    created: new Date(_now - 16 * _h).toISOString(),
    status: 'enroute', note: 'Хаалганы код: 2208#', lat: 47.922, lng: 106.917,
  },
  {
    id: 'R-2210', customer: 'С. Алтанцэцэг', phone: '8819 0033',
    district: 'Хан-Уул', khoroo: '3-р хороо', addr: 'Зайсан, Гранд хотхон, 5-р байр',
    items: 'Хувцас × 3', amount: 245000, window: '13:00–15:00',
    created: new Date(_now - 28 * _h).toISOString(),
    status: 'pending', note: 'Хаяг өөрчлөгдсөн — CS-ээс мэдэгдэл ирсэн', lat: 47.888, lng: 106.913, changed: true,
  },
  {
    id: 'R-2211', customer: 'Б. Ганболд', phone: '9019 2245',
    district: 'Чингэлтэй', khoroo: '4-р хороо', addr: '5-р хороолол, 22-р байр, 8 тоот',
    items: 'Гэр ахуйн бараа × 1', amount: 79000, window: '14:00–16:00',
    created: new Date(_now - 40 * _h).toISOString(),
    status: 'picked', note: '', lat: 47.925, lng: 106.908,
  },
  {
    id: 'R-2212', customer: 'Н. Оюунчимэг', phone: '8855 6610',
    district: 'Баянгол', khoroo: '20-р хороо', addr: 'Долоон буудал, 45-р байр, 12 тоот',
    items: 'Гоо сайхан × 4', amount: 132000, window: '15:00–17:00',
    created: new Date(_now - 5 * _h).toISOString(),
    status: 'done', note: '', lat: 47.907, lng: 106.860,
  },
];

// Requests the driver sends to CS
const UB_REQUESTS = [
  {
    id: 'Q-501', type: 'goods', title: 'Бараа шивүүлэх хүсэлт',
    detail: 'R-2208 · Эмэгтэй гутал × 1 — системд бүртгүүлэх',
    ts: '09:42', status: 'received', // sent | received | done
  },
  {
    id: 'Q-502', type: 'salary', title: 'Цалингийн дутуу мэдээлэл',
    detail: '06-р сарын 5 · хүргэлтийн урамшуулал 18,000₮ дутуу',
    ts: '08:15', status: 'review', // sent | review (нягтлан) | done
  },
  {
    id: 'Q-503', type: 'goods', title: 'Бараа шивүүлэх хүсэлт',
    detail: 'R-2211 · Гэр ахуйн бараа × 1 — буцаалт бүртгэх',
    ts: 'Өчигдөр', status: 'done',
  },
];

// CS-side: driver requests inbox (aggregated across drivers)
const UB_INBOX = [
  { id: 'Q-501', driver: 'Б. Бат-Эрдэнэ', type: 'goods', detail: 'R-2208 · Эмэгтэй гутал × 1', ts: '09:42', status: 'new' },
  { id: 'Q-510', driver: 'М. Төгөлдөр', type: 'goods', detail: 'R-3120 · Цахилгаан бараа × 1', ts: '09:38', status: 'new' },
  { id: 'Q-502', driver: 'Б. Бат-Эрдэнэ', type: 'salary', detail: 'Урамшуулал 18,000₮ дутуу', ts: '08:15', status: 'accountant' },
  { id: 'Q-498', driver: 'Г. Долгормаа', type: 'salary', detail: 'Түлшний нөхөн олговор', ts: '08:02', status: 'accountant' },
  { id: 'Q-495', driver: 'Т. Энхбаяр', type: 'goods', detail: 'R-3088 · Хувцас × 2', ts: 'Өчигдөр', status: 'done' },
];

// CS-side: daily returns Excel uploads
const UB_UPLOADS = [
  { id: 'U-0609', name: 'Буцаалт_2026-06-09.xlsx', rows: 48, assigned: 41, ts: '08:30', by: 'Э. Сараа' },
  { id: 'U-0608', name: 'Буцаалт_2026-06-08.xlsx', rows: 52, assigned: 52, ts: 'Өчигдөр 08:20', by: 'Б. Номин' },
  { id: 'U-0607', name: 'Буцаалт_2026-06-07.xlsx', rows: 39, assigned: 39, ts: '06-07 08:45', by: 'Э. Сараа' },
];

// Shipment report data (from uploaded CSV / Excel)
// receivedAt = цаг бодоход хэрэглэнэ (ISO string)
const UB_SHIPMENTS = [
  { tracking: 'UBC41086277684900', status: 'Received', created: '2026-06-09', receivedAt: new Date(_now - 3 * _h).toISOString(), partner: 'temu', phone: '99118236', weight: 0.859, zip: '15010', district: 'Ulaanbaatar', addr: 'juulchin 12-2', khoroo: '1-Р Хороо' },
  { tracking: 'UBC61166346420150', status: 'Received', created: '2026-06-09', receivedAt: new Date(_now - 6 * _h).toISOString(), partner: 'temu', phone: '80979191', weight: 0.323, zip: '15050', district: 'Ulaanbaatar', addr: 'Лагаан гудамж чингэлтэй 5р хороо тэнгис 17р байр 2р орц 42тоот', khoroo: '5-Р Хороо' },
  { tracking: 'UBC26868406222290', status: 'Received', created: '2026-06-09', receivedAt: new Date(_now - 10 * _h).toISOString(), partner: 'temu', phone: '88002167', weight: 0.746, zip: '15170', district: 'Ulaanbaatar', addr: 'Сурагчийн 36 399', khoroo: '17-Р Хороо' },
  { tracking: 'UBC22918666709010', status: 'Received', created: '2026-06-09', receivedAt: new Date(_now - 14 * _h).toISOString(), partner: 'temu', phone: '88777487', weight: 1.236, zip: '15030', district: 'Ulaanbaatar', addr: 'Хүрээ Хотхон 23/2 9тоот 23', khoroo: '3-Р Хороо' },
  { tracking: 'UBC23306978134490', status: 'Received', created: '2026-06-09', receivedAt: new Date(_now - 20 * _h).toISOString(), partner: 'temu', phone: '90021390', weight: 1.203, zip: '15240', district: 'Ulaanbaatar', addr: 'Зуунмод зуслан 2-13', khoroo: '24-Р Хороо' },
  { tracking: 'UBC59929778181370', status: 'Received', created: '2026-06-08', receivedAt: new Date(_now - 26 * _h).toISOString(), partner: 'temu', phone: '99098381', weight: 0.321, zip: '15050', district: 'Ulaanbaatar', addr: 'самбуу 5-20', khoroo: '5-Р Хороо' },
  { tracking: 'UBC82562864492250', status: 'Received', created: '2026-06-08', receivedAt: new Date(_now - 30 * _h).toISOString(), partner: 'temu', phone: '89152949', weight: 0.385, zip: '15140', district: 'Ulaanbaatar', addr: 'Хайлааст 8 5-2', khoroo: '14-Р Хороо' },
  { tracking: 'UBC55799437813560', status: 'Received', created: '2026-06-07', receivedAt: new Date(_now - 38 * _h).toISOString(), partner: 'temu', phone: '94807411', weight: 0.511, zip: '15240', district: 'Ulaanbaatar', addr: 'Яргайтын богино төв зам дагуу Номадс супермаркет 401', khoroo: '24-Р Хороо' },
  { tracking: 'UBC24159589877650', status: 'Received', created: '2026-06-06', receivedAt: new Date(_now - 42 * _h).toISOString(), partner: 'temu', phone: '99968272', weight: 0.715, zip: '15230', district: 'Ulaanbaatar', addr: 'Зүрх уулын 2-583 б тоот', khoroo: '23-Р Хороо' },
  { tracking: 'UBC05510017884630', status: 'Received', created: '2026-06-06', receivedAt: new Date(_now - 50 * _h).toISOString(), partner: 'temu', phone: '96158787', weight: 0.024, zip: '15240', district: 'Ulaanbaatar', addr: 'Зуунмодны 2ын13тоот', khoroo: '24-Р Хороо' },
  { tracking: 'UBC26252603290720', status: 'Received', created: '2026-06-05', receivedAt: new Date(_now - 60 * _h).toISOString(), partner: 'temu', phone: '99143785', weight: 0.212, zip: '15040', district: 'Ulaanbaatar', addr: 'бага тойрог 41-р байр 33 тоот', khoroo: '4-Р Хороо' },
  { tracking: 'UBC87268270841770', status: 'Received', created: '2026-06-05', receivedAt: new Date(_now - 72 * _h).toISOString(), partner: 'temu', phone: '99245719', weight: 2.097, zip: '15060', district: 'Ulaanbaatar', addr: 'Бумцэнд гудамж Сан апартмент 47А байр', khoroo: '6-Р Хороо' },
  { tracking: 'UBC46441774964830', status: 'Received', created: '2026-06-04', receivedAt: new Date(_now - 96 * _h).toISOString(), partner: 'temu', phone: '88660886', weight: 0.08, zip: '15060', district: 'Ulaanbaatar', addr: 'СУИС баруун хойно, 58 байр, 3 орц, 101 тоот', khoroo: '6-Р Хороо' },
];

// CS-side: customer address / phone changes to push to drivers
const UB_CHANGES = [
  { id: 'R-2210', customer: 'С. Алтанцэцэг', field: 'Хаяг', from: 'Зайсан, 3-р байр', to: 'Зайсан, Гранд хотхон, 5-р байр', driver: 'Б. Бат-Эрдэнэ', status: 'sent' },
  { id: 'R-3120', customer: 'О. Мөнхзул', field: 'Утас', from: '8800 1122', to: '9911 4567', driver: 'М. Төгөлдөр', status: 'draft' },
];

// Real driver data from Excel (130 жолооч)
const UB_FLEET = [
  { name: 'П. Ууганбаяр', phone: '88205537', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 4 },
  { name: 'Г. Лхагвадорж', phone: '96616565', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 3 },
  { name: 'Т. Нандинболд', phone: '80805960', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 8 },
  { name: 'Ц. Чингэс', phone: '99049861', zone: 'Баянзүрх дүүрэг', status: 'break', active: 0, done: 6 },
  { name: 'Б. Содхүү', phone: '88075951', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 7 },
  { name: 'З. Ичинхорлоо', phone: '88074758', zone: 'Баянзүрх дүүрэг', status: 'online', active: 4, done: 5 },
  { name: 'Г. Содхүү', phone: '99807373', zone: 'Баянзүрх дүүрэг', status: 'online', active: 2, done: 6 },
  { name: 'Б. Үзмээ', phone: '99197256', zone: 'Баянзүрх дүүрэг', status: 'break', active: 0, done: 5 },
  { name: 'Д. Наранчимэг', phone: '89765354', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 2 },
  { name: 'С. Солонго', phone: '99979033', zone: 'Баянзүрх дүүрэг', status: 'online', active: 3, done: 2 },
  { name: 'И. Даваахорлоо', phone: '99177437', zone: 'Баянзүрх дүүрэг', status: 'online', active: 1, done: 9 },
  { name: 'М. Сугар', phone: '80048348', zone: 'Баянзүрх дүүрэг', status: 'break', active: 0, done: 5 },
  { name: 'Ч. Бат-Эрдэнэ', phone: '96543434', zone: 'Баянзүрх дүүрэг', status: 'online', active: 1, done: 2 },
  { name: 'Г. Мөнхбаяр', phone: '96162520', zone: 'Баянзүрх дүүрэг', status: 'online', active: 2, done: 9 },
  { name: 'Д. Алтантуяа', phone: '89893685', zone: 'Баянзүрх дүүрэг', status: 'online', active: 1, done: 9 },
  { name: 'Т. Золзаяа', phone: '89894879', zone: 'Баянзүрх дүүрэг', status: 'break', active: 0, done: 8 },
  { name: 'Ч. Зулцэцэг', phone: '89059394', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 6 },
  { name: 'Д. Мөнхжаргал', phone: '94528428', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 9 },
  { name: 'Т. Наранчимэг', phone: '88021086', zone: 'Баянзүрх дүүрэг', status: 'online', active: 2, done: 4 },
  { name: 'Ч. Чойндонжамц', phone: '88040234', zone: 'Баянзүрх дүүрэг', status: 'break', active: 0, done: 2 },
  { name: 'Ц. Хашбат', phone: '88046913', zone: 'Баянзүрх дүүрэг', status: 'online', active: 1, done: 5 },
  { name: 'Э. Пүрэвцэцэг', phone: '86304070', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 3 },
  { name: 'Б. Батпүрэв', phone: '86024139', zone: 'Баянзүрх дүүрэг', status: 'online', active: 3, done: 4 },
  { name: 'Д. Гүнсэлмаа', phone: '96100070', zone: 'Баянзүрх дүүрэг', status: 'break', active: 0, done: 6 },
  { name: 'Б. Төртогтох', phone: '97156000', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 9 },
  { name: 'Х. Лхагвасүрэн', phone: '86886468', zone: 'Баянзүрх дүүрэг', status: 'online', active: 1, done: 8 },
  { name: 'Б. Алтанзул', phone: '86163035', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 8 },
  { name: 'Ш. Мөнхтуяа', phone: '91012733', zone: 'Баянзүрх дүүрэг', status: 'break', active: 0, done: 8 },
  { name: 'С. Баяржавхлан', phone: '60094865', zone: 'Баянзүрх дүүрэг', status: 'online', active: 2, done: 4 },
  { name: 'М. Өсөхбаяр', phone: '99853895', zone: 'Баянзүрх дүүрэг', status: 'online', active: 4, done: 4 },
  { name: 'Л. Батцэнгэл', phone: '88102483', zone: 'Баянзүрх дүүрэг', status: 'online', active: 3, done: 3 },
  { name: 'Э. Алтантуяа', phone: '96016108', zone: 'Баянзүрх дүүрэг', status: 'break', active: 0, done: 2 },
  { name: 'Б. Мягмаржаргал', phone: '95797973', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 9 },
  { name: 'Ц. Намуунцэцэг', phone: '99622730', zone: 'Баянзүрх дүүрэг', status: 'online', active: 5, done: 2 },
  { name: 'Д. Мухамеджан', phone: '91100034', zone: 'Хан-Уул дүүрэг', status: 'online', active: 2, done: 2 },
  { name: 'Ж. Уугантуяа', phone: '95555486', zone: 'Хан-Уул дүүрэг', status: 'break', active: 0, done: 9 },
  { name: 'Б. Сүхбат', phone: '94453646', zone: 'Хан-Уул дүүрэг', status: 'online', active: 3, done: 2 },
  { name: 'Б. Амарзаяа', phone: '99539935', zone: 'Хан-Уул дүүрэг', status: 'online', active: 1, done: 9 },
  { name: 'О. Амин-Од', phone: '89118798', zone: 'Хан-Уул дүүрэг', status: 'online', active: 2, done: 4 },
  { name: 'Б. Мөнхсугар', phone: '88061692', zone: 'Хан-Уул дүүрэг', status: 'break', active: 0, done: 7 },
  { name: 'М. Нурболат', phone: '99017774', zone: 'Хан-Уул дүүрэг', status: 'online', active: 2, done: 2 },
  { name: 'Ц. Адъяа', phone: '80099099', zone: 'Хан-Уул дүүрэг', status: 'online', active: 5, done: 6 },
  { name: 'Г. Сарантуяа', phone: '88163990', zone: 'Хан-Уул дүүрэг', status: 'online', active: 1, done: 2 },
  { name: 'Х. Жамъяндорж', phone: '89090309', zone: 'Хан-Уул дүүрэг', status: 'break', active: 0, done: 3 },
  { name: 'Б. Наранбаатар', phone: '96331948', zone: 'Хан-Уул дүүрэг', status: 'online', active: 4, done: 9 },
  { name: 'Д. Уртнасан', phone: '98095455', zone: 'Хан-Уул дүүрэг', status: 'online', active: 2, done: 6 },
  { name: 'Э. Минжирмаа', phone: '99263636', zone: 'Хан-Уул дүүрэг', status: 'online', active: 3, done: 9 },
  { name: 'М. Одонгариг', phone: '94956455', zone: 'Хан-Уул дүүрэг', status: 'break', active: 0, done: 6 },
  { name: 'Л. Мөнхбаяр', phone: '86434999', zone: 'Хан-Уул дүүрэг', status: 'online', active: 4, done: 9 },
  { name: 'Ч. Цэгмид', phone: '98081212', zone: 'Хан-Уул дүүрэг', status: 'online', active: 4, done: 5 },
  { name: 'Э. Урангоо', phone: '99495931', zone: 'Хан-Уул дүүрэг', status: 'online', active: 3, done: 4 },
  { name: 'С. Одсүрэн', phone: '80006279', zone: 'Хан-Уул дүүрэг', status: 'break', active: 0, done: 4 },
  { name: 'А. Алинзул', phone: '99161117', zone: 'Хан-Уул дүүрэг', status: 'online', active: 5, done: 4 },
  { name: 'Т. Баттөгс', phone: '80111433', zone: 'Хан-Уул дүүрэг', status: 'online', active: 2, done: 8 },
  { name: 'Ж. Дааманцогзол', phone: '80047787', zone: 'Хан-Уул дүүрэг', status: 'online', active: 3, done: 9 },
  { name: 'Ц. Нямхүү', phone: '88203758', zone: 'Хан-Уул дүүрэг', status: 'break', active: 0, done: 5 },
  { name: 'Ц. Туяа', phone: '88341686', zone: 'Хан-Уул дүүрэг', status: 'online', active: 2, done: 3 },
  { name: 'С. Энэрэл', phone: '86011552', zone: 'Хан-Уул дүүрэг', status: 'online', active: 3, done: 9 },
  { name: 'П. Одсүрэн', phone: '89073027', zone: 'Хан-Уул дүүрэг', status: 'online', active: 5, done: 3 },
  { name: 'М. Дуламсүрэн', phone: '91222144', zone: 'Хан-Уул дүүрэг', status: 'break', active: 0, done: 2 },
  { name: 'Т. Батболд', phone: '89151104', zone: 'Хан-Уул дүүрэг', status: 'online', active: 3, done: 4 },
  { name: 'Ц. Цэвээнпүрэв', phone: '96232373', zone: 'Хан-Уул дүүрэг', status: 'online', active: 3, done: 6 },
  { name: 'Э. Энхбаяр', phone: '99255485', zone: 'Хан-Уул дүүрэг', status: 'online', active: 3, done: 5 },
  { name: 'Л. Балжинням', phone: '95382222', zone: 'Баянгол дүүрэг', status: 'break', active: 0, done: 3 },
  { name: 'Ш. Пагмаа', phone: '80010652', zone: 'Баянгол дүүрэг', status: 'online', active: 5, done: 2 },
  { name: 'Д. Баярмаа', phone: '88207940', zone: 'Баянгол дүүрэг', status: 'online', active: 5, done: 4 },
  { name: 'А. Пүрэвсүрэн', phone: '86160909', zone: 'Баянгол дүүрэг', status: 'online', active: 2, done: 9 },
  { name: 'З. Отгонтөгс', phone: '88006941', zone: 'Баянгол дүүрэг', status: 'break', active: 0, done: 2 },
  { name: 'Х. Баярцэцэг', phone: '88212448', zone: 'Баянгол дүүрэг', status: 'online', active: 5, done: 3 },
  { name: 'Д. Лхагвасүрэн', phone: '99377309', zone: 'Баянгол дүүрэг', status: 'online', active: 4, done: 8 },
  { name: 'О. Ганчимэг', phone: '98099890', zone: 'Баянгол дүүрэг', status: 'online', active: 4, done: 3 },
  { name: 'Г. Ганхуяг', phone: '86053561', zone: 'Баянгол дүүрэг', status: 'break', active: 0, done: 9 },
  { name: 'Б. Халиун', phone: '86003937', zone: 'Баянгол дүүрэг', status: 'online', active: 2, done: 8 },
  { name: 'Ш. Болормаа', phone: '96551948', zone: 'Баянгол дүүрэг', status: 'online', active: 5, done: 8 },
  { name: 'Ж. Эрдэнэчимэг', phone: '80062996', zone: 'Баянгол дүүрэг', status: 'online', active: 2, done: 7 },
  { name: 'С. Цэвээнсүрэн', phone: '88148308', zone: 'Баянгол дүүрэг', status: 'break', active: 0, done: 5 },
  { name: 'М. Энхжаргал', phone: '88558064', zone: 'Баянгол дүүрэг', status: 'online', active: 5, done: 4 },
  { name: 'Л. Ганчимэг', phone: '99987495', zone: 'Баянгол дүүрэг', status: 'online', active: 4, done: 3 },
  { name: 'Б. Наранбагана', phone: '99013689', zone: 'Баянгол дүүрэг', status: 'online', active: 5, done: 4 },
  { name: 'Ш. Ариунцэцэг', phone: '94905689', zone: 'Баянгол дүүрэг', status: 'break', active: 0, done: 8 },
  { name: 'Т. Намхайдорж', phone: '80110616', zone: 'Баянгол дүүрэг', status: 'online', active: 3, done: 5 },
  { name: 'Б. Баянтөгс', phone: '99837777', zone: 'Баянгол дүүрэг', status: 'online', active: 4, done: 7 },
  { name: 'Б. Одонтуяа', phone: '88027571', zone: 'Баянгол дүүрэг', status: 'online', active: 1, done: 3 },
  { name: 'Н. Дуламсүрэн', phone: '88072380', zone: 'Баянгол дүүрэг', status: 'break', active: 0, done: 8 },
  { name: 'И. Улам-Ундрах', phone: '99014688', zone: 'Баянгол дүүрэг', status: 'online', active: 4, done: 2 },
  { name: 'М. Алтантуяа', phone: '88151991', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 4, done: 8 },
  { name: 'С. Бямбасүрэн', phone: '91910956', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 1, done: 8 },
  { name: 'Ц. Энхжаргал', phone: '99870554', zone: 'Сонгинохайрхан дүүрэг', status: 'break', active: 0, done: 4 },
  { name: 'Ө. Балжинням', phone: '92130335', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 1, done: 4 },
  { name: 'Б. Өнөртулга', phone: '96110162', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 5, done: 9 },
  { name: 'М. Батхишиг', phone: '95648865', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 3, done: 5 },
  { name: 'Б. Хишгээ', phone: '80211268', zone: 'Сонгинохайрхан дүүрэг', status: 'break', active: 0, done: 2 },
  { name: 'Б. Энхтуул', phone: '88942388', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 3, done: 5 },
  { name: 'Б. Мөнх-Од', phone: '99725031', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 2, done: 3 },
  { name: 'О. Энхтөгс', phone: '89482424', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 3, done: 2 },
  { name: 'Я. Сумъяабазар', phone: '89086769', zone: 'Сонгинохайрхан дүүрэг', status: 'break', active: 0, done: 6 },
  { name: 'Ч. Цогтбаатар', phone: '99878489', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 5, done: 9 },
  { name: 'Д. Лхагвадулам', phone: '91181807', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 4, done: 2 },
  { name: 'С. Мөнгөнчимэг', phone: '96633811', zone: 'Сонгинохайрхан дүүрэг', status: 'online', active: 3, done: 7 },
  { name: 'М. Наранцэцэг', phone: '90060009', zone: 'Сүхбаатар дүүрэг', status: 'break', active: 0, done: 9 },
  { name: 'С. Энхжин', phone: '99283504', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 4, done: 6 },
  { name: 'С. Ууганбаяр', phone: '80971201', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 3, done: 8 },
  { name: 'Н. Түмэнжаргал', phone: '96661654', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 1, done: 5 },
  { name: 'Ж. Батбаатар', phone: '95664607', zone: 'Сүхбаатар дүүрэг', status: 'break', active: 0, done: 3 },
  { name: 'Б. Эрдэнэ-Очир', phone: '88645979', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 3, done: 7 },
  { name: 'Б. Уламбаяр', phone: '86630989', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 3, done: 6 },
  { name: 'Ц. Наранбаяр', phone: '99076756', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 3, done: 6 },
  { name: 'С. Чинзориг', phone: '96011781', zone: 'Сүхбаатар дүүрэг', status: 'break', active: 0, done: 2 },
  { name: 'С. Бадмаа', phone: '99257655', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 1, done: 2 },
  { name: 'Б. Болортуяа', phone: '88098108', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 5, done: 8 },
  { name: 'М. Анужин', phone: '80135115', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 3, done: 2 },
  { name: 'М. Төгөлдөр', phone: '95238888', zone: 'Сүхбаатар дүүрэг', status: 'break', active: 0, done: 8 },
  { name: 'У. Ууганбат', phone: '95483772', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 4, done: 5 },
  { name: 'Д. Баясгалан', phone: '80792222', zone: 'Сүхбаатар дүүрэг', status: 'online', active: 3, done: 9 },
  { name: 'П. Мөнхтогоо', phone: '91538182', zone: 'Чингэлтэй дүүрэг', status: 'online', active: 2, done: 4 },
  { name: 'Б. Цолмон', phone: '99662858', zone: 'Чингэлтэй дүүрэг', status: 'break', active: 0, done: 4 },
  { name: 'Д. Отгонцэцэг', phone: '90721616', zone: 'Чингэлтэй дүүрэг', status: 'online', active: 2, done: 8 },
  { name: 'Ө. Гантулга', phone: '95901997', zone: 'Чингэлтэй дүүрэг', status: 'online', active: 5, done: 3 },
  { name: 'А. Бат-Эрдэнэ', phone: '95114996', zone: 'Чингэлтэй дүүрэг', status: 'online', active: 1, done: 5 },
  { name: 'Б. Батцэцэг', phone: '89458926', zone: 'Чингэлтэй дүүрэг', status: 'break', active: 0, done: 6 },
  { name: 'В. Хишиг', phone: '80111696', zone: 'Чингэлтэй дүүрэг', status: 'online', active: 3, done: 5 },
  { name: 'Б. Баттулга', phone: '85718411', zone: 'Чингэлтэй дүүрэг', status: 'online', active: 1, done: 3 },
  { name: 'Г. Хатансайхан', phone: '96614900', zone: 'Чингэлтэй дүүрэг', status: 'online', active: 3, done: 2 },
  { name: 'Э. Төрмөнх', phone: '88744951', zone: 'Налайх дүүрэг', status: 'break', active: 0, done: 6 },
  { name: 'О. Азбилэг', phone: '88061065', zone: 'Багануур дүүрэг', status: 'online', active: 4, done: 2 },
  { name: 'Д. Мөнхцэцэг', phone: '96071637', zone: 'Багахангай дүүрэг', status: 'online', active: 4, done: 7 },
];



const UB_EARNINGS = {
  today: 84000, week: 612000, month: 2480000,
  trips: [
    { id: 'R-2212', label: 'Хүргэлт дуусгасан', amount: 6000, ts: '16:20' },
    { id: 'R-2207', label: 'Буцаалт авсан', amount: 6000, ts: '15:05' },
    { id: 'BONUS', label: 'Өдрийн урамшуулал', amount: 12000, ts: '14:00' },
    { id: 'R-2205', label: 'Хүргэлт дуусгасан', amount: 6000, ts: '12:40' },
  ],
};

// ── Driver registrations (pending / approved / rejected) ────────
const UB_REGISTRATIONS = [
  { id: 'REG-001', name: 'Д. Мөнхбат', phone: '9901 2233', vehicle: 'Porter H100 · 5678 УБА', district: 'Баянзүрх', method: 'phone', email: '', password: '••••••', status: 'pending', ts: '2026-06-12 09:30' },
  { id: 'REG-002', name: 'Б. Тэмүүлэн', phone: '8811 4455', vehicle: 'Toyota HiAce · 9012 УБА', district: 'Сүхбаатар', method: 'gmail', email: 'temuulen@gmail.com', password: '••••••', status: 'pending', ts: '2026-06-12 08:15' },
  { id: 'REG-003', name: 'О. Ганбаатар', phone: '9955 6677', vehicle: 'Hyundai Porter · 3456 УБА', district: 'Хан-Уул', method: 'gmail', email: 'ganbaatar@gmail.com', password: '••••••', status: 'approved', ts: '2026-06-11 14:20' },
  { id: 'REG-004', name: 'Ц. Батсүх', phone: '9922 3344', vehicle: 'Damas · 7890 УБА', district: 'Чингэлтэй', method: 'phone', email: '', password: '••••••', status: 'approved', ts: '2026-06-10 11:05' },
  { id: 'REG-005', name: 'Л. Энхтүвшин', phone: '8899 5566', vehicle: 'Porter II · 2345 УБА', district: 'Баянгол', method: 'phone', email: '', password: '••••••', status: 'rejected', ts: '2026-06-09 16:40' },
];

// ── CS / Admin staff ────────────────────────────────────────────
const UB_STAFF = [
  { id: 'CS-07', name: 'Э. Сараа', phone: '9900 1122', role: 'CS ажилтан', status: 'active' },
  { id: 'CS-08', name: 'Б. Номин', phone: '9933 4455', role: 'CS ажилтан', status: 'active' },
  { id: 'CS-09', name: 'Г. Оюунчимэг', phone: '9944 5566', role: 'CS ажилтан', status: 'active' },
  { id: 'ADM-01', name: 'Т. Ганбаатар', phone: '9911 0000', role: 'Админ', status: 'active' },
];

window.UB = {
  driver: UB_DRIVER, cs: UB_CS, tasks: UB_TASKS, requests: UB_REQUESTS,
  inbox: UB_INBOX, uploads: UB_UPLOADS, shipments: UB_SHIPMENTS, changes: UB_CHANGES, fleet: UB_FLEET,
  earnings: UB_EARNINGS, registrations: UB_REGISTRATIONS, staff: UB_STAFF,
};
