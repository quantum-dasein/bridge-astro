/**
 * Контент лендинга BRIDGE Consult Academy, узбекская версия.
 *
 * Форма объекта — ровно как в academy.ru.ts, компоненты одни и те же.
 *
 * Биография Ларисы и список аккредитаций перенесены ДОСЛОВНО из узбекской
 * версии основного сайта (public/UZ/index.html) — их сверяют, переписывать
 * и сокращать нельзя. Названия модулей и тем взяты из опубликованной
 * узбекской новости (src/content/news/uz-fidic-training-practical-issues.mdx).
 */

export const academyUz = {
	lang: 'uz',
	meta: {
		title: "Ilg'or shartnoma menejmenti — onlayn dastur, BRIDGE Consult Academy",
		description:
			"1999 va 2017 tahrirlar bo'yicha 18 ta modul va 40 dan ortiq amaliy keys. Jonli onlayn mashg'ulotlar, yozuv ishtirokchida qoladi, o'zbekcha subtitrlar.",
	},

	nav: [
		{ label: 'Dastur', href: '#programme' },
		{ label: 'Metod', href: '#method' },
		{ label: 'Modullar', href: '#modules' },
		{ label: 'Kimlar uchun', href: '#audience' },
		{ label: "O'qituvchi", href: '#trainer' },
	],
	cta: 'Ariza qoldirish',
	langLinks: { ru: '/academy/', en: '/academy/en/', uz: '/academy/uz/' },

	hero: {
		eyebrow: 'Bridge Consult Academy · Onlayn dastur · 01',
		titleLines: ["Ilg'or shartnoma", 'menejmenti'],
		titleAccent: 'onlayn',
		lead: "Shartnoma shartlarini band-band o'qish emas, balki obyektda talab, kechikish va nizoga aylanadigan vaziyatlarni tahlil qilish. 1999 va 2017 tahrirlari — yonma-yon.",
		ctaPrimary: { label: 'Ariza qoldirish', href: '#apply' },
		ctaSecondary: { label: "18 ta modulni ko'rish", href: '#modules' },
		credsText:
			"Dasturni <b>Larisa Belousova</b> olib boradi — FCCE, FCCP, FIDIC Yaxlitlikni boshqarish qo'mitasi a'zosi",
		imageAlt: "Quyosh botishida tog'dagi avtomagistral — infratuzilma loyihasi",
		scrollCue: 'Pastga suring',
	},

	stats: {
		items: [
			{ count: 18, value: '18', mark: 'Modules', label: "shartnomani administratsiya qilishdan arbitrajgacha" },
			{ count: 40, value: '40', suffix: '+', mark: 'Cases', label: "obyektda haqiqatan yuz beradigan vaziyatlar" },
			{ value: '1999', suffix: ' / 2017', mark: 'Editions', label: "ikki tahrir yonma-yon — matn emas, mantiq o'zgarishi ko'rinadi" },
			{ value: 'RU', suffix: ' + UZ', mark: 'Language', label: "mashg'ulotlar rus tilida, materiallar va subtitrlar o'zbek tilida" },
		],
		trainerNote:
			"Dasturni <b>Larisa Belousova</b> olib boradi — FCCE, FCCP, FIDIC Yaxlitlikni boshqarish qo'mitasi a'zosi",
	},

	statement: {
		mark: '02 · Statement',
		lead: "FIDIC bandlarni bilish uchun o'rganilmaydi.",
		body: "U loyihada nimadir rejadan chetga chiqqanda nima qilish kerakligini bilish uchun o'rganiladi.",
		note: "Dastur ataylab shartnoma shartlarini ketma-ket o'qish tarzida qurilmagan. U talab, kechikish va nizoga aylanadigan vaziyatlar atrofida yig'ilgan.",
	},

	// Ссылки на подпункты стоят только там, где они уже опубликованы на
	// сайте. Для DAAB и арбитража их нет намеренно — подтверждает Лариса.
	contractSystem: {
		mark: '03 · System',
		title: "Shartnoma — matn emas, zanjir",
		lead: "Har bir bo'g'in oldingisiga bog'liq. O'tkazib yuborilgan xabarnoma undan keyingi hamma narsani quladi — talab mohiyatan qanchalik asosli bo'lishidan qat'i nazar.",
		steps: [
			{ name: 'Hodisa', note: "Obyektda nimadir rejadan chetga chiqdi" },
			{ name: 'Xabarnoma', note: 'Muhandis shartnomaviy muddatda xabardor qilinadi', ref: '1999 20.1-band · 2017 20.1–20.2-bandlar' },
			{ name: 'Talab', note: "Muddatni uzaytirish yoki qo'shimcha xarajatlar" },
			{ name: 'Asoslash', note: 'Ishlar davomida yuritilgan yozuvlar' },
			{ name: "Muhandis qarori", note: "Tekshiruvga bardosh beradigan qaror", ref: '1999 3.5-band · 2017 3.7-band' },
			{ name: 'DAAB', note: "Nizolarning oldini olish va hal qilish kengashi" },
			{ name: 'Arbitraj', note: "Oldini olish endi mumkin bo'lmaganda" },
		],
	},

	// ВНИМАНИЕ: содержание раздела подтверждает Лариса.
	editions: {
		mark: '04 · Editions',
		title: 'Ikki tahrir yonma-yon',
		lead: "Taqqoslashning mohiyati matn qayta yozilganida emas, balki shartnomani boshqarish mantiqi o'zgarganida. Bandlarga havolalar har doim aniq loyihaning Maxsus shartlari bilan solishtiriladi.",
		rows: [
			{
				topic: 'Talablar',
				old: "Buyurtmachi va Pudratchining talablari shartnomaning turli joylarida turadi va turli tartibda ko'riladi.",
				now: "Ikkala tomonning talablari bitta bandga jamlangan va simmetrik tartibdan o'tadi.",
			},
			{
				topic: 'Xabarnoma',
				old: "20.1-band: Muhandisni «amalda imkon bo'lishi bilan» va 28 kundan kechiktirmay xabardor qilish.",
				now: "20.1–20.2-bandlar: xuddi shu qat'iy muddat mantiqi, ammo talab bosqichlari aniq ajratilgan.",
			},
			{
				topic: 'Muhandis',
				old: "3.5-band: Muhandis tomonlar bilan dastlabki maslahatlashuvdan so'ng qaror qabul qiladi.",
				now: "3.7-band: qaror kelishuv va qarorning o'ziga ajratilgan, har bosqich uchun muddat belgilangan.",
			},
			{
				topic: 'Nizolar kengashi',
				old: "DAB — nizolarni hal qilish kengashi: nizo yuzaga kelganidan keyin jalb qilinadi.",
				now: "DAAB — hal qilishga oldini olish qo'shildi: kengash loyihada doimiy ishlaydi.",
			},
		],
	},

	caseWall: {
		mark: '07 · Archive',
		value: '40',
		suffix: '+',
		title: "Obyektda haqiqatan yuz beradigan vaziyatlar tahlili",
		lead: "Har bir keys bitta format bo'yicha tahlil qilinadi: ssenariy, muddat va xarajatga ta'siri, qo'llaniladigan bandlar, tomonlarning tipik xatolari.",
		topics: [
			'Shartnomani administratsiya qilish',
			'Ishlar dasturini boshqarish',
			'Muddatlarni boshqarish',
			'Tugatish muddatini uzaytirish',
			'Kechikishlar tahlili',
			"O'zgartirishlar",
			"Da'volar",
			"To'lovlar",
			'Xarajatlar nazorati',
			'Muhandis roli',
			'Buyurtmachi majburiyatlari',
			'Pudratchi majburiyatlari',
			'Qurilish maydonini boshqarish',
			'Ishlar davomidagi yozuvlar',
			'Risklarni taqsimlash',
			'Nizolarning oldini olish',
			'DAAB',
			'Arbitraj',
		],
	},

	finalCta: {
		mark: '11 · Ariza',
		lineOne: "Shartnoma imzolanganda tugamaydi.",
		lineTwo: 'U loyihada muammo yuzaga kelganda boshlanadi.',
		cta: 'Ariza qoldirish',
		href: '#apply',
		note: "18 modullik dastur va eng yaqin oqim sanalarini yuboramiz. Har bir arizaga shaxsan javob beramiz.",
	},

	programme: {
		label: 'Dastur haqida',
		title: "Bu dastur nimasi bilan farq qiladi",
		paragraphs: [
			"Dastur ataylab shartnoma shartlarini band-band o'rganish tarzida <b>qurilmagan</b>. Uning maqsadi — Buyurtmachilar, Muhandislar, Pudratchilar va davlat organlari amaliyotda muntazam duch keladigan real muammolarni tahlil qilish hamda ularni muddatni uzaytirish talabiga, qo'shimcha xarajat talabiga, O'zgartirish bo'yicha nizoga yoki DAAB hamda arbitrajga o'tkaziladigan rasmiy nizoga aylanishidan <b>oldin</b> aniqlash va bartaraf etish ko'nikmasini shakllantirish.",
			"Dastur asosini FIDIC 1999 va 2017 shartnoma shartlari, ko'p tomonlama taraqqiyot banklari (Jahon banki, OTB, AIIB, EBRD) moliyalashtiradigan loyihalardagi xalqaro amaliyot, kechikishlar va uzilishlar bo'yicha SCL Protokoli hamda qurilish talablarini taqdim etishning shakllangan amaliyoti tashkil etadi.",
		],
		pullquote:
			"Nizo deyarli hech qachon nizodan boshlanmaydi. U o'z vaqtida yuborilmagan xabarnomadan boshlanadi.",
	},

	method: {
		label: 'Metod',
		title: 'Keyslarni tahlil qilishning yagona formati',
		lead: "Har bir amaliy masala bir xil pozitsiyalar to'plami bo'yicha tahlil qilinadi. Bu suhbatni «shartnomada nima yozilgan» tekisligidan boshqaruv qarori tekisligiga o'tkazadi va tahlilni takrorlanadigan qiladi: ishtirokchi o'qishdan keyin xuddi shu formatni o'z loyihasiga qo'llaydi.",
		rows: [
			{ key: 'Amaliy masala', value: 'aniq muammo' },
			{ key: 'Tipik ssenariy', value: "obyektda odatda nima sodir bo'ladi" },
			{ key: "Muddatga ta'siri", value: "ishlar dasturi va tugatishga ta'siri" },
			{ key: "Xarajatga ta'siri", value: "qiymat va pul oqimiga ta'siri" },
			{ key: "Tegishli FIDIC bandlari", value: "1999 va 2017 tahrirlarining qo'llaniladigan kichik bandlari" },
			{ key: 'Tipik xatolar', value: 'Buyurtmachi, Muhandis va Pudratchi uchun alohida' },
			{ key: "O'quv maqsadi", value: 'ishtirokchi egallaydigan kompetensiya' },
			{ key: 'Amaliy misol', value: 'guruhda ishlash uchun ssenariy' },
		],
	},

	modules: {
		label: 'Mundarija',
		title: "O'n sakkiz modul, <i class=\"text-academy-taupe\">to'rt oqim</i>",
		groups: [
			{
				roman: 'I',
				title: 'Muddatlar va dastur',
				note: "Shartnoma birinchi kundan qanday yuritilishi tomonda umuman talab huquqi bo'lishini hal qiladi.",
				image: 'academy-mod-1',
				imageAlt: "Gantt diagrammasi va sirkul — muddatlar va ishlar dasturini boshqarish",
				items: [
					'Shartnomani administratsiya qilish',
					'Ishlar dasturini boshqarish',
					'Muddatlarni boshqarish',
					'Tugatish muddatini uzaytirish',
					'Kechikishlar tahlili',
				],
			},
			{
				roman: 'II',
				title: "Pul va o'zgartirishlar",
				note: "Loyiha qiymatni qayerda yo'qotadi — va buni qaysi paytda hali to'xtatish mumkin.",
				image: 'academy-mod-2',
				imageAlt: "Shishadagi xarajat egri chiziqlari — o'zgartirishlar va xarajatlarni boshqarish",
				items: ["O'zgartirishlar", "Da'volar", "To'lovlar", 'Xarajatlar nazorati'],
			},
			{
				roman: 'III',
				title: 'Rollar va maydon',
				note: "Shartnoma bo'yicha kim nimaga majbur va bu loyiha hujjatlarida nima bilan tasdiqlanadi.",
				image: 'academy-mod-3',
				imageAlt: "Chizma va shovun — tomonlar rollari va maydonni boshqarish",
				items: [
					'Muhandis roli',
					'Buyurtmachi majburiyatlari',
					'Pudratchi majburiyatlari',
					'Qurilish maydonini boshqarish',
					'Ishlar bajarilishi davomidagi yozuvlar',
				],
			},
			{
				roman: 'IV',
				title: 'Risklar va nizolar',
				note: "Oldini olishning imkoni bo'lmaganda nima qilish kerak — va tartibda yutqazmaslik.",
				image: 'academy-mod-4',
				imageAlt: "Shisha panellar va bolg'acha — risklar, nizolarning oldini olish va arbitraj",
				items: ['Risklarni taqsimlash', 'Nizolarning oldini olish', 'DAAB', 'Arbitraj'],
			},
		],
	},

	caseStudy: {
		label: 'Tahlil namunasi',
		title: "Xabarnoma uchun qat'iy muddatlarga rioya qilish",
		lead: "Birinchi modulning asosiy masalalaridan biri. Dasturdagi qirqdan ortiq keysning har biri shunday ko'rinadi — va ishtirokchi keyinchalik o'z vaziyatlarini shunday tahlil qiladi.",
		docTitle: 'Keys 01.3',
		clauses: ['1999 — 20.1-band', '2017 — 20.1–20.2-bandlar'],
		blocks: [
			{
				heading: 'Tipik vaziyat',
				text: "Maydondagi xodimlar muddat yoki xarajatga ta'sir qiluvchi hodisadan xabardor, lekin Muhandis shartnomaviy muddatda xabardor qilinmaydi — og'zaki xabar yoki yig'ilishda tilga olish yetarli deb hisoblanadi.",
			},
			{
				heading: 'Natija',
				text: "Muddatni uzaytirish (EOT) huquqi talabning asosliligidan qat'i nazar xavf ostida qoladi, nizo predmeti esa hodisaning o'zidan muddatni o'tkazib yuborishga siljiydi.",
			},
			{
				heading: 'Amaliy xulosa',
				text: "Xabarnomalarning dolzarb reestrini yuritish va «amalda imkon bo'lishi bilan» talabini 28 kunlik dastlabki shartdan farqlash.",
				key: true,
			},
		],
	},

	audience: {
		mark: '06 · Audience',
		title: "Shartnomani faqat o'qibgina qolmay, unga javob beradiganlar uchun",
		lead: "Infratuzilma loyihalarini amalga oshirayotgan O'zbekiston davlat hokimiyati organlari va davlat buyurtmachilari, shuningdek loyiha buyurtmachilari, muhandislar, konsultantlar va loyiha rahbarlari uchun.",
		rows: [
			{
				title: 'Buyurtmachi',
				text: "Buyurtmachining qaysi majburiyatlari Pudratchi talablari uchun asos yaratishini tushunish va talab qo'yilgunga qadar ularni bartaraf etish.",
				image: 'academy-mod-3',
			},
			{
				title: 'Muhandis',
				text: "<span class=\"academy-clause\">3.5 / 3.7-bandlar</span> bo'yicha qarorlarni DAAB va arbitrajda tekshiruvga bardosh beradigan qilib qabul qilish.",
				image: 'academy-mod-1',
			},
			{
				title: 'Pudratchi',
				text: "Xabarnoma tartibining buzilishi va yozuvlarning yo'qligi tufayli muddat va qo'shimcha xarajat huquqini yo'qotmaslik.",
				image: 'academy-mod-2',
			},
			{
				title: 'Davlat organi',
				text: "Ishlar dasturi, maydondagi yozuvlar va loyihaning pul oqimi o'rtasidagi bog'liqlikni ko'rish.",
				image: 'academy-mod-4',
			},
		],
	},

	format: {
		label: 'Format',
		title: "Jonli onlayn mashg'ulotlar — yozuv ishtirokchida qoladi",
		lead: "Dastur guruhlarda keyslarni tahlil qilish bilan amaliyot formatida o'tkaziladi. Bandlarga havolalar 1999 (Qizil va Sariq kitoblar, raqamlash umuman Kumush kitobga ham tegishli) va 2017 tahrirlari uchun parallel beriladi va aniq loyihaning Maxsus shartlari bilan majburiy solishtiriladi — aynan ular ko'pincha Umumiy shartlarni o'zgartiradi.",
		items: [
			{
				title: "Mashg'ulotlar — rus tilida",
				text: "Jonli efirda, savollar va ishtirokchilar vaziyatlarini tahlil qilish bilan. Har bir mashg'ulot yozib olinadi.",
			},
			{
				title: 'Materiallar — ikki tilda',
				text: "Slaydlar, tarqatma materiallar va FIDIC atamalari lug'ati rus va o'zbek tillarida tayyorlanadi.",
			},
			{
				title: "Yozuvlarga o'zbekcha subtitrlar",
				text: "Tarjimani umumiy profildagi tarjimon emas, shartnomalar bo'yicha mutaxassis tekshiradi: FIDIC'da atamaning aniqligi mazmunning o'zidir.",
			},
			{
				title: 'Tashkilot uchun dastur',
				text: "Modullar va keyslar tarkibini aniq loyiha va buyurtmachi shartnomasi ostida yig'ish mumkin.",
			},
		],
	},

	trainer: {
		label: "O'qituvchi",
		name: 'Larisa Belousova',
		role: "Infratuzilma shartnomalari · FIDIC · EPC/EPC+F · Xaridlar · Claims · Dispute Avoidance · Xalqaro arbitraj",
		photoAlt: 'Larisa Belousova',
		bio: [
			"Larisa Belousova — infratuzilma shartnomalari, xaridlar va qurilish nizolari bo'yicha xalqaro ekspert. U ishlab chiqarish, qurilish, logistika va xaridlar sohalarida 27 yillik boshqaruv tajribasiga, shu jumladan FIDIC shartnomalarini boshqarish va xalqaro moliya institutlari tomonidan moliyalashtiriladigan infratuzilma loyihalarida 15 yildan ortiq ixtisoslashgan tajribaga ega.",
			"Uning tarmoq tajribasi avtomobil yo'llari va yo'l infratuzilmasi, ko'priklar va tunnellar, transport va aeroport infratuzilmasi, shahar va ijtimoiy infratuzilma, suv ta'minoti va oqova suv tizimlari, energetika hamda boshqa yirik infratuzilma loyihalarini qamrab oladi.",
			"U FIDIC shartnomalarini boshqarish, EPC va EPC+F shartnomalarini tuzish, xarid va tender hujjatlarini tayyorlash, o'zgartirishlar va da'volarni boshqarish, kechikishlar va da'volar qiymatini tahlil qilish, shartnomaviy va tijorat risklarini boshqarish, nizolarning oldini olish va qurilish nizolarini hal etishga ixtisoslashgan.",
			"Larisa FIDIC Certified Consulting Engineer (FCCE) va FIDIC Certified Consulting Professional (FCCP) malakalariga ega. U FIDIC Red Book, Yellow Book, Silver Book, MDB Harmonised Editions, Subcontract Book va White Book shakllari bo'yicha amaliy tajribaga ega. Shuningdek, u ADB Accredited Contract Management and Dispute Avoidance Specialist hisoblanadi.",
			"BRIDGE Consult LLC asoschisi va direktori sifatida u Markaziy Osiyoda davlat organlari, buyurtmachilar, pudratchilar, muhandislar va konsalting kompaniyalariga infratuzilma shartnomalarini tayyorlash va boshqarish, xaridlar, da'volar, shartnomaviy va tijorat risklari, nizolarning oldini olish hamda arbitraj jarayonlariga tayyorgarlik ko'rish masalalari bo'yicha maslahat beradi.",
		],
		credsTitle: "Kasbiy akkreditatsiyalar va a'zoliklar",
		creds: [
			"FCCE Sertifikatsiya qo'mitasi a'zosi, FIDIC Credentialing",
			"<a rel=\"noopener\" href=\"https://fidic.org/node/777\" target=\"_blank\">FIDIC Yaxlitlikni boshqarish qo'mitasi (IMC) a'zosi</a>",
			'FCCE — FIDIC sertifikatlangan muhandis-konsultanti',
			'FCCP — FIDIC sertifikatlangan professional konsultanti',
			"OTB (ADB) akkreditatsiyasidan o'tgan shartnomalarni boshqarish va nizolarning oldini olish bo'yicha mutaxassis",
			"MCIArb — Qirollik arbitrlari instituti a'zosi",
			"LCIA Yevropa foydalanuvchilari kengashi a'zosi",
			"ICAA Next Generation dasturi a'zosi",
			"O'zbekiston Respublikasi Savdo-sanoat palatasi huzuridagi Xalqaro tijorat arbitraj sudi arbitri (ICAC Uzbekistan)",
			"Avstriya arbitraj assotsiatsiyasi a'zosi",
			"DRBF — Litsenziyalangan professional (rivojlanayotgan bozorlar) va Nizolar bo'yicha kengash (DB) amaliyotchisi",
			"O'zbekiston Respublikasi Adliya vazirligida ro'yxatdan o'tgan mustaqil mediator",
			"Qozog'iston professional muhandislar va konsultantlar milliy assotsiatsiyasining to'liq a'zosi (KNAPEK)",
			"O'zbekiston avtomobil yo'llari assotsiatsiyasi Kengashi a'zosi",
			"Loyihalarni boshqarish instituti a'zosi (PMI)",
			'PCQI — Qirollik sifat instituti (CQI) amaliyotchisi, Buyuk Britaniya',
			'ICAgile sertifikatlangan professionali (ICP)',
		],
		moreLabel: "Davomini o'qish",
		lessLabel: 'Yopish',
		cvLabel: 'CV yuklab olish (PDF)',
	},

	apply: {
		label: 'Ariza',
		title: 'Dastur va eng yaqin oqim sanalarini yuboramiz',
		lead: "O'qish kimlar uchun va qanday shartnomaviy vaziyatlarni tahlil qilmoqchi ekaningizni yozing. Har bir arizaga shaxsan javob beramiz.",
		list: [
			'18 modullik to‘liq dastur PDF formatida',
			'Eng yaqin oqim sanalari va jadvali',
			'Bitta tashkilotdan guruh uchun shartlar',
			"Pul o'tkazish orqali to'lov uchun hisob-faktura va shartnoma",
		],
		mailNote: "Yoki to'g'ridan-to'g'ri yozing:",
		source: "Ilg'or shartnoma menejmenti (BRIDGE Consult Academy)",
		submit: 'Arizani yuborish',
		states: {
			sending: 'Yuborilmoqda...',
			sendingNote: 'Ariza yuborilmoqda.',
			sent: 'Ariza yuborildi',
			successNote: "Rahmat! Ariza yuborildi — biz siz bilan bog'lanamiz.",
			errorNote:
				"Avtomatik yuborishning iloji bo'lmadi — {email} manziliga xat ochiladi, uni yuboring. Yoki bizga Telegramda yozing.",
			subject: "Ariza — Ilg'or shartnoma menejmenti onlayn",
			sentFrom: 'Sahifadan yuborildi',
		},
		fields: {
			name: { label: 'Ism va familiya', placeholder: 'Masalan: Akmal Rahimov' },
			role: { label: 'Lavozim / tashkilot', placeholder: 'Shartnoma menejeri, tashkilot' },
			contact: { label: 'Javob uchun kontakt', placeholder: 'Telefon, Telegram yoki email' },
			programme: {
				label: 'Ishtirok etish formati',
				options: [
					"To'liq dastur, 18 ta modul",
					'Alohida modullar',
					'Tashkilot uchun korporativ dastur',
					"Hali hal qilmadik — maslahat kerak",
				],
			},
			participants: {
				label: 'Ishtirokchilar soni',
				options: ['1 ishtirokchi', '2–5 ishtirokchi', '6–15 ishtirokchi', '15 dan ortiq ishtirokchi'],
			},
			language: {
				label: "O'qitish tili",
				options: ['Rus tili', "Rus tili + o'zbekcha subtitr va materiallar", "Asosan o'zbek tili"],
			},
			cases: {
				label: 'Tahlil uchun keyslar',
				placeholder:
					"Dasturda tahlil qilmoqchi bo'lgan vaziyatlar, talablar, kechikishlar yoki shartnomaviy savollar bormi?",
			},
			message: { label: 'Izoh', placeholder: "Nimani aniqlashtirish muhim: sanalar, hisob, ishtirok shartlari" },
		},
	},

	footer: {
		description:
			"«Ilg'or shartnoma menejmenti» — O'zbekiston buyurtmachilari, muhandislari, konsultantlari va pudratchilari uchun shartnomalarni boshqarish, da'volar, kechikishlar tahlili va nizolarni hal qilish bo'yicha amaliy dastur.",
		navTitle: 'Navigatsiya',
		nav: [
			{ label: 'Asosiy sayt', href: 'https://www.bridgeconsult.uz/UZ/' },
			{ label: 'Loyihalar', href: 'https://www.bridgeconsult.uz/UZ/projects.html' },
			{ label: 'Yangiliklar', href: 'https://www.bridgeconsult.uz/news/uz/' },
			{ label: "Ta'lim", href: 'https://www.bridgeconsult.uz/UZ/#trainings' },
			{ label: 'OAV va nashrlar', href: 'https://www.bridgeconsult.uz/UZ/#media' },
		],
		contactsTitle: "Kontakt ma'lumotlari",
		address:
			"100180, O'zbekiston Respublikasi,<br>Toshkent shahri, Yunusobod tumani,<br>Ahmad Donish ko'chasi, 12-kvartal, 20A",
		rights: 'Barcha huquqlar himoyalangan.',
		disclaimer:
			"FIDIC standart shartnoma shakllari, rasmiy nashrlari, logotiplari va boshqa intellektual mulk obyektlariga bo'lgan barcha mualliflik huquqlari Fédération Internationale des Ingénieurs-Conseils (FIDIC) va/yoki tegishli huquq egalariga tegishli. Shartnoma qoidalari o'quv tahlili uchun zarur bo'lgan tegishli kichik bandlarga havolalar va qisqa parchalar ko'rinishida keltiriladi. Dastur, keyslar, ish shakllari va uslubiy ishlanmalar BRIDGE Consult LLC intellektual mulki hisoblanadi. BRIDGE Consult o'zining shaxsiy o'quv dasturini o'tkazadi va FIDIC nomidan ish ko'rmaydi.",
	},
} as const;
