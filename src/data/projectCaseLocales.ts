import { projectCases } from './projectCases';

export type ProjectLang = 'ru' | 'en' | 'uz';
export type ProjectSlug = (typeof projectCases)[number]['slug'];

type BaseProjectCase = (typeof projectCases)[number];

export interface LocalizedProjectCase {
	slug: string;
	number: string;
	title: string;
	shortTitle: string;
	category: string;
	period: string;
	contract: string;
	client: string;
	institution: string;
	image: string;
	video?: string;
	metaTitle: string;
	metaDescription: string;
	summary: string;
	context: string;
	scope: readonly string[];
	focus: readonly string[];
	outcome: string;
	urls: Record<ProjectLang, string>;
}

type ProjectText = Partial<Omit<LocalizedProjectCase, 'slug' | 'number' | 'image' | 'video' | 'urls'>>;

const text: Record<'en' | 'uz', Record<ProjectSlug, ProjectText>> = {
	en: {
		'olympic-city': {
			title: 'Olympic City in Tashkent',
			shortTitle: 'Olympic City',
			category: 'Sports infrastructure',
			client: 'Ministry of Construction and Housing and Communal Services of Uzbekistan',
			institution: 'Public infrastructure project',
			metaTitle: 'Olympic City in Tashkent | Bridge Consult Case Study',
			metaDescription:
				'Bridge Consult case study: Olympic City in Tashkent, EPC+F sports infrastructure for the IV Asian Youth Games.',
			summary:
				'Construction of modern sports facilities for the IV Asian Youth Games in Tashkent. The project combines sports, engineering and energy infrastructure under an EPC+F model.',
			context:
				'Olympic City is one of Tashkent’s most visible infrastructure projects. For this type of facility, timing and cost are only part of the challenge: international sports standards, engineering coordination and operational resilience are equally important.',
			scope: [
				'Integration of BIPV and VAPV photovoltaic panels on roofs and parking areas.',
				'A 50-metre competition swimming pool to FINA standards and a UCI-standard velodrome.',
				'Rainwater collection, ecological pools and landscaped sunken public spaces.',
			],
			focus: [
				'EPC+F contract logic for a major public facility.',
				'Management of quality, time and coordination requirements across project participants.',
				'Preparation of project information that is clear for the employer, engineer and contractor.',
			],
			outcome:
				'The case demonstrates Bridge Consult’s experience at the intersection of infrastructure construction, contract engineering and international requirements for sports facilities.',
		},
		'tashkent-invest-company': {
			title: 'JSC Tashkent Invest Company',
			shortTitle: 'Tashkent Invest Company',
			category: 'Institutional development',
			period: '2025 - present',
			client: 'JSC Tashkent Invest Company',
			institution: 'Tashkent urban infrastructure',
			metaTitle: 'Tashkent Invest Company | EPC+F Procurement and Contract Management',
			metaDescription:
				'Bridge Consult case study: procurement and contract management system for Tashkent Invest Company infrastructure projects under EPC+F.',
			summary:
				'Development and implementation of procurement and contract management approaches for EPC+F infrastructure projects, including EPC contracts and engineering consultancy agreements.',
			context:
				'Institutional projects require more than individual contracts. They need a durable system: how procurement is run, how risks are allocated, how changes are managed and how participants’ responsibilities are recorded.',
			scope: [
				'Procurement approach for urban infrastructure projects.',
				'Work with EPC contracts and engineering consultancy services.',
				'Contract structure for projects where time, budget and risk control are critical.',
			],
			focus: [
				'Systematic contract management instead of fragmented procedures.',
				'Application of FIDIC White Book and EPC+F logic to urban projects.',
				'Documenting decisions so they withstand audit and further project administration.',
			],
			outcome:
				'The case strengthens Bridge Consult’s position as a consultant not only for disputes, but also for building manageable contract systems for infrastructure employers.',
		},
		'srrp-road-reconstruction': {
			title: 'SRRP Road Reconstruction',
			shortTitle: 'SRRP Road Reconstruction',
			category: 'Road construction',
			client: 'Azerbaijani company',
			institution: 'Asian Development Bank (ADB)',
			metaTitle: 'SRRP Road Reconstruction | FIDIC Red Book and ADB',
			metaDescription:
				'Bridge Consult case study: reconstruction of 107 km of roads 4R105 and 4R100 under the FIDIC Red Book with ADB financing.',
			summary:
				'SRRP/CW/Lot 1, SRRP/CW/Lot 2 and SRRP/CW/Lot 3: reconstruction of 107 km of road 4R105 (km 5-70) and road 4R100 (km 128-174).',
			context:
				'Road projects under the FIDIC Red Book are shaped by measurement, variations, time control, work quality and strict correspondence between the contractor, engineer and employer.',
			scope: [
				'Three reconstruction lots within the SRRP programme.',
				'107 km of roads 4R105 and 4R100.',
				'ADB financing and application of the FIDIC Red Book.',
			],
			focus: [
				'Control of contractual time limits and notices.',
				'Work with quantities, variations and supporting records.',
				'Preparation of the contractor’s position in a format expected by the FIDIC engineer.',
			],
			outcome:
				'The project shows Bridge Consult’s practical experience in road construction, where contract discipline directly affects payment, time and the strength of a party’s position in a dispute.',
		},
		'a373-kamchik-pass': {
			title: 'A-373 Highway, Kamchik Pass',
			shortTitle: 'A-373 Kamchik',
			category: 'Transport corridor',
			client: 'JSC EVRASCON',
			institution: 'CAREC Corridor 2',
			metaTitle: 'A-373 Kamchik Pass Highway | FIDIC MDB Harmonised',
			metaDescription:
				'Bridge Consult case study: reconstruction of the A-373 Tashkent-Osh highway at Kamchik Pass, CAREC Corridor 2.',
			summary:
				'CAREC Corridor 2: reconstruction of the A-373 Tashkent-Osh highway section at Kamchik Pass.',
			context:
				'Kamchik Pass is a strategic transport section for Uzbekistan. Projects of this type depend on geology, traffic safety, seasonality and precise management of contractual changes.',
			scope: [
				'Reconstruction of a section of the A-373 Tashkent-Osh highway.',
				'Work within the logic of CAREC Corridor 2.',
				'FIDIC MDB Harmonised contract model.',
			],
			focus: [
				'Alignment of engineering and contractual decisions on a complex road section.',
				'Documentation of risks, changes and grounds for contractual claims.',
				'Support for a project participant’s position under an international contract.',
			],
			outcome:
				'The case highlights Bridge Consult’s experience in major transport projects where FIDIC is used as a practical risk-management tool rather than a formality.',
		},
		'samarkand-water-supply': {
			title: 'Samarkand Region Water Supply',
			shortTitle: 'Samarkand Water Supply',
			category: 'Water supply',
			client: 'Suv-Taraqqiyot LLC',
			institution: 'Asian Development Bank (ADB)',
			metaTitle: 'Samarkand Region Water Supply | FIDIC and ADB',
			metaDescription:
				'Bridge Consult case study: construction of water supply systems and water intake facilities in Samarkand Region under ADB ICB contracts.',
			summary:
				'Construction of water supply systems and water intake facilities for settlements in Samarkand Region under ADB-standard ICB contracts.',
			context:
				'Water projects require a tight connection between engineering, procurement and contract control. Assets are geographically distributed, and the impact of changes on time and budget may appear gradually.',
			scope: [
				'Water supply systems and water intake facilities.',
				'KWSP/4.1 and KWSP/3.1 projects in Samarkand Region.',
				'ICB contracts and ADB standards.',
			],
			focus: [
				'Contract support for distributed infrastructure.',
				'Work with changes, quantities and supporting records.',
				'Alignment of employer, engineer and financing institution requirements.',
			],
			outcome:
				'The case shows Bridge Consult’s competence in water supply projects where international financial institution requirements meet local construction practice.',
		},
		'a380-carec-corridor': {
			title: 'A-380 Highway, CAREC Corridor 2',
			shortTitle: 'A-380 CAREC 2',
			category: 'Transport corridor',
			client: 'POSCO Engineering · GP Papenburg',
			institution: 'Asian Development Bank (ADB)',
			metaTitle: 'A-380 Highway, CAREC Corridor 2 | Bridge Consult Case Study',
			metaDescription:
				'Bridge Consult case study: reconstruction of the A-380 Tashkent-Bukhara-Nukus-Beyneu highway on CAREC Corridor 2 with ADB financing.',
			summary:
				'Reconstruction of the A-380 Tashkent-Bukhara-Nukus-Beyneu highway, part of CAREC Corridor 2, with ADB financing.',
			context:
				'Corridor road projects demand strong discipline in programme management, variations, interim payments and communication with the engineer.',
			scope: [
				'Sections of the A-380 highway on the Tashkent-Bukhara-Nukus-Beyneu corridor.',
				'Coordination of international contractors and ADB financing.',
				'One of Bridge Consult’s early project references dating back to 2010.',
			],
			focus: [
				'Application of FIDIC MDB Harmonised in road infrastructure.',
				'Preparation of contractual positions on time, payment and variations.',
				'Work with project documentation within an international financing framework.',
			],
			outcome:
				'The case shows the historical depth of Bridge Consult’s project experience in Uzbekistan and its work with transport corridors of international importance.',
		},
		'smart-city-nurafshon': {
			title: 'Smart City Nurafshon',
			shortTitle: 'Smart City Nurafshon',
			category: 'Digital infrastructure',
			client: 'JSC Evrascon',
			institution: 'Urban engineering infrastructure',
			metaTitle: 'Smart City Nurafshon | EPC Case Study by Bridge Consult',
			metaDescription:
				'Bridge Consult case study: development of Smart City Nurafshon infrastructure under an EPC model, integrating urban engineering and digital systems.',
			summary:
				'Development of Smart City Nurafshon infrastructure under an EPC model: integration of urban engineering and digital systems.',
			context:
				'Smart City projects require the construction, engineering and digital parts to be aligned. Mistakes at responsibility boundaries quickly turn into disputes over time, quality and scope.',
			scope: [
				'Infrastructure for Smart City Nurafshon.',
				'Integration of urban engineering and digital systems.',
				'Use of the EPC model for a complex urban project.',
			],
			focus: [
				'Allocation of responsibility in an EPC contract.',
				'Control of requirements for engineering and digital system integration.',
				'Recording design decisions that affect time and cost.',
			],
			outcome:
				'The case expands Bridge Consult’s portfolio beyond roads and water supply into digital urban infrastructure and complex EPC projects.',
		},
		'energy-metering-adb': {
			title: 'Automated Electricity Metering',
			shortTitle: 'Energy Metering (ADB)',
			category: 'Energy',
			client: 'KT-Corporation (Korea)',
			institution: 'Asian Development Bank (ADB)',
			metaTitle: 'Automated Electricity Metering | Bridge Consult Case Study',
			metaDescription:
				'Bridge Consult case study: automated electricity monitoring and metering system for Bukhara, Jizzakh and Samarkand regions with ADB participation.',
			summary:
				'Implementation of an automated electricity monitoring and metering system for consumers in Bukhara, Jizzakh and Samarkand regions.',
			context:
				'Energy projects with a digital component require precise definition of the result: what counts as supply, what counts as implementation, how operability is confirmed and how stages are accepted.',
			scope: [
				'Automated monitoring and metering of electricity.',
				'Coverage of Bukhara, Jizzakh and Samarkand regions.',
				'International contractor involvement and ADB participation.',
			],
			focus: [
				'Contract management of technology supply and implementation.',
				'Recording acceptance criteria and proof of results.',
				'Managing risks at the intersection of equipment, software and operation.',
			],
			outcome:
				'The case demonstrates Bridge Consult’s experience in energy infrastructure and projects where construction logic is combined with technology implementation.',
		},
	},
	uz: {
		'olympic-city': {
			title: 'Toshkent Olimpiya shaharchasi',
			shortTitle: 'Olimpiya shaharchasi',
			category: 'Sport infratuzilmasi',
			client: 'O‘zbekiston Qurilish va uy-joy kommunal xo‘jaligi vazirligi',
			institution: 'Davlat infratuzilma loyihasi',
			metaTitle: 'Toshkent Olimpiya shaharchasi | Bridge Consult keysi',
			metaDescription:
				'Bridge Consult keysi: Toshkent Olimpiya shaharchasi, EPC+F, IV Osiyo o‘smirlar o‘yinlari uchun sport infratuzilmasi.',
			summary:
				'Toshkentda IV Osiyo o‘smirlar o‘yinlari uchun zamonaviy sport obyektlarini qurish. Loyiha sport, muhandislik va energetika infratuzilmasini EPC+F modelida birlashtiradi.',
			context:
				'Olimpiya shaharchasi Toshkentdagi eng ko‘zga ko‘ringan infratuzilma loyihalaridan biridir. Bunday obyektlarda muddat va narx bilan birga xalqaro sport standartlari, muhandislik tizimlari koordinatsiyasi va ekspluatatsiya barqarorligi ham muhim.',
			scope: [
				'Tomlar va avtoturargohlarda BIPV hamda VAPV fotoelektr panellarini integratsiya qilish.',
				'FINA standartidagi 50 metrli musobaqa basseyni va UCI standartidagi velotrek.',
				'Yomg‘ir suvini yig‘ish tizimi, ekologik basseynlar va yashil pastki jamoat hududlari.',
			],
			focus: [
				'Yirik davlat obyekti uchun EPC+F shartnoma logikasi.',
				'Sifat, muddat va ishtirokchilar koordinatsiyasi talablarini boshqarish.',
				'Buyurtmachi, muhandis va pudratchi uchun tushunarli loyiha axborotini tayyorlash.',
			],
			outcome:
				'Keys Bridge Consultning infratuzilma qurilishi, shartnoma injiniringi va sport obyektlariga qo‘yiladigan xalqaro talablar kesishmasidagi tajribasini ko‘rsatadi.',
		},
		'tashkent-invest-company': {
			title: 'AJ Tashkent Invest Company',
			shortTitle: 'Tashkent Invest Company',
			category: 'Institutsional rivojlanish',
			period: '2025 - hozirgacha',
			client: 'AJ Tashkent Invest Company',
			institution: 'Toshkent shahar infratuzilmasi',
			metaTitle: 'Tashkent Invest Company | EPC+F xaridlar va shartnoma boshqaruvi',
			metaDescription:
				'Bridge Consult keysi: Tashkent Invest Company infratuzilma loyihalari uchun EPC+F modeli bo‘yicha xaridlar va shartnomalarni boshqarish tizimi.',
			summary:
				'EPC+F modelidagi infratuzilma loyihalari uchun xaridlar va shartnoma boshqaruvi yondashuvlarini ishlab chiqish, jumladan EPC shartnomalari va muhandislik-konsalting xizmatlari.',
			context:
				'Institutsional loyihalarda alohida shartnomalar yetarli emas. Barqaror tizim kerak: xarid qanday o‘tkaziladi, xatarlar qanday taqsimlanadi, o‘zgarishlar qanday boshqariladi va ishtirokchilar javobgarligi qanday qayd etiladi.',
			scope: [
				'Shahar infratuzilma loyihalari uchun xaridlar yondashuvini sozlash.',
				'EPC shartnomalari va muhandislik-konsalting xizmatlari bilan ishlash.',
				'Muddat, budjet va xatar nazorati muhim bo‘lgan loyihalar uchun shartnoma tuzilmasi.',
			],
			focus: [
				'Tarqoq protseduralar o‘rniga tizimli shartnoma boshqaruvi.',
				'FIDIC White Book va EPC+F logikasini shahar loyihalariga qo‘llash.',
				'Audit va keyingi boshqaruvga bardosh beradigan qarorlarni hujjatlashtirish.',
			],
			outcome:
				'Keys Bridge Consultni nafaqat nizolar bo‘yicha, balki infratuzilma buyurtmachilari uchun boshqariladigan shartnoma tizimini qurish bo‘yicha ham maslahatchi sifatida kuchaytiradi.',
		},
		'srrp-road-reconstruction': {
			title: 'SRRP yo‘llarini rekonstruksiya qilish',
			shortTitle: 'SRRP yo‘llari rekonstruksiyasi',
			category: 'Yo‘l qurilishi',
			client: 'Ozarbayjon kompaniyasi',
			institution: 'Osiyo taraqqiyot banki (OTB)',
			metaTitle: 'SRRP yo‘llari rekonstruksiyasi | FIDIC Red Book va OTB',
			metaDescription:
				'Bridge Consult keysi: OTB moliyalashtiruvida FIDIC Red Book bo‘yicha 4R105 va 4R100 yo‘llarining 107 km qismini rekonstruksiya qilish.',
			summary:
				'SRRP/CW/Lot 1, SRRP/CW/Lot 2 va SRRP/CW/Lot 3: 4R105 avtomobil yo‘lining 107 km qismi (5-70 km) va 4R100 yo‘li (128-174 km) rekonstruksiyasi.',
			context:
				'FIDIC Red Book bo‘yicha yo‘l loyihalari odatda o‘lchovlar, hajm o‘zgarishlari, muddatlar, ish sifati va pudratchi, muhandis hamda buyurtmachi o‘rtasidagi qat’iy hujjat aylanishiga tayanadi.',
			scope: [
				'SRRP dasturi doirasida uchta rekonstruksiya loti.',
				'4R105 va 4R100 avtomobil yo‘llarining 107 km qismi.',
				'OTB moliyalashtiruvi va FIDIC Red Book qo‘llanilishi.',
			],
			focus: [
				'Shartnomaviy muddatlar va bildirishnomalarni nazorat qilish.',
				'Hajmlar, o‘zgarishlar va tasdiqlovchi yozuvlar bilan ishlash.',
				'Pudratchi pozitsiyasini FIDIC muhandisi kutadigan formatda tayyorlash.',
			],
			outcome:
				'Loyiha Bridge Consultning yo‘l qurilishidagi amaliy tajribasini ko‘rsatadi: bu yerda shartnoma intizomi to‘lov, muddat va nizodagi pozitsiya barqarorligiga bevosita ta’sir qiladi.',
		},
		'a373-kamchik-pass': {
			title: 'A-373 avtomobil yo‘li, Qamchiq dovoni',
			shortTitle: 'A-373 Qamchiq',
			category: 'Transport koridori',
			client: 'AJ EVRASCON',
			institution: 'CAREC 2',
			metaTitle: 'A-373 Qamchiq dovoni avtomobil yo‘li | FIDIC MDB Harmonised',
			metaDescription:
				'Bridge Consult keysi: A-373 Toshkent-O‘sh avtomobil yo‘lining Qamchiq dovoni qismida rekonstruksiya, CAREC 2 transport koridori.',
			summary:
				'CAREC 2 transport koridori: A-373 Toshkent-O‘sh avtomobil yo‘lining Qamchiq dovoni qismida rekonstruksiya.',
			context:
				'Qamchiq dovoni O‘zbekiston uchun strategik transport uchastkasidir. Bunday loyihalarda geologiya, harakat xavfsizligi, mavsumiylik va shartnomaviy o‘zgarishlarni aniq boshqarish muhim.',
			scope: [
				'A-373 Toshkent-O‘sh avtomobil yo‘li uchastkasini rekonstruksiya qilish.',
				'CAREC 2 transport koridori logikasida ish olib borish.',
				'FIDIC MDB Harmonised shartnoma modeli.',
			],
			focus: [
				'Murakkab yo‘l uchastkasida muhandislik va shartnomaviy qarorlarni uyg‘unlashtirish.',
				'Xatarlar, o‘zgarishlar va shartnomaviy talablar asoslarini hujjatlashtirish.',
				'Xalqaro shartnoma formatida loyiha ishtirokchisi pozitsiyasini qo‘llab-quvvatlash.',
			],
			outcome:
				'Keys Bridge Consultning yirik transport loyihalaridagi tajribasini ta’kidlaydi: FIDIC bu yerda formal hujjat emas, balki xatarlarni boshqarishning ishchi vositasidir.',
		},
		'samarkand-water-supply': {
			title: 'Samarqand viloyati suv ta’minoti',
			shortTitle: 'Samarqand suv ta’minoti',
			category: 'Suv ta’minoti',
			client: 'Suv-Taraqqiyot LLC',
			institution: 'Osiyo taraqqiyot banki (OTB)',
			metaTitle: 'Samarqand viloyati suv ta’minoti | FIDIC va OTB',
			metaDescription:
				'Bridge Consult keysi: OTB ICB shartnomalari bo‘yicha Samarqand viloyatida suv ta’minoti tizimlari va suv olish inshootlarini qurish.',
			summary:
				'Samarqand viloyati aholi punktlari uchun OTB standartidagi ICB shartnomalari bo‘yicha suv ta’minoti tizimlari va suv olish inshootlarini qurish.',
			context:
				'Suv loyihalari muhandislik, xaridlar va shartnoma nazoratining uzviy bog‘lanishini talab qiladi. Obyektlar hudud bo‘ylab taqsimlangan, o‘zgarishlarning muddat va budjetga ta’siri esa darhol ko‘rinmasligi mumkin.',
			scope: [
				'Suv ta’minoti tizimlari va suv olish inshootlari.',
				'Samarqand viloyatidagi KWSP/4.1 va KWSP/3.1 loyihalari.',
				'ICB shartnomalari va OTB standartlari.',
			],
			focus: [
				'Taqsimlangan infratuzilmani shartnomaviy qo‘llab-quvvatlash.',
				'O‘zgarishlar, hajmlar va tasdiqlovchi yozuvlar bilan ishlash.',
				'Buyurtmachi, muhandis va moliyalashtiruvchi institut talablarini uyg‘unlashtirish.',
			],
			outcome:
				'Keys Bridge Consultning suv ta’minoti loyihalaridagi kompetensiyasini ko‘rsatadi, bu yerda xalqaro moliya institutlari talablari mahalliy qurilish amaliyoti bilan kesishadi.',
		},
		'a380-carec-corridor': {
			title: 'A-380 avtomobil yo‘li, CAREC 2',
			shortTitle: 'A-380 CAREC 2',
			category: 'Transport koridori',
			client: 'POSCO Engineering · GP Papenburg',
			institution: 'Osiyo taraqqiyot banki (OTB)',
			metaTitle: 'A-380 avtomobil yo‘li, CAREC 2 | Bridge Consult keysi',
			metaDescription:
				'Bridge Consult keysi: OTB moliyalashtiruvida A-380 Toshkent-Buxoro-Nukus-Beyneu avtomobil yo‘li, CAREC 2 transport koridori rekonstruksiyasi.',
			summary:
				'OTB moliyalashtiruvida A-380 Toshkent-Buxoro-Nukus-Beyneu avtomobil yo‘li, CAREC 2 transport koridori rekonstruksiyasi.',
			context:
				'Koridor yo‘l loyihalari ish dasturi, o‘zgarishlar, oraliq to‘lovlar va muhandis bilan kommunikatsiyada yuqori intizomni talab qiladi.',
			scope: [
				'Toshkent-Buxoro-Nukus-Beyneu koridoridagi A-380 avtomobil yo‘li uchastkalari.',
				'Bir nechta xalqaro pudratchilar va OTB moliyalashtiruvini uyg‘unlashtirish.',
				'Bridge Consultning 2010 yildan boshlangan ilk loyiha tajribalaridan biri.',
			],
			focus: [
				'Yo‘l infratuzilmasida FIDIC MDB Harmonised qo‘llanilishi.',
				'Muddatlar, to‘lovlar va o‘zgarishlar bo‘yicha shartnomaviy pozitsiyani tayyorlash.',
				'Xalqaro moliyalashtirish logikasida loyiha hujjatlari bilan ishlash.',
			],
			outcome:
				'Keys Bridge Consultning O‘zbekistondagi loyiha tajribasi chuqurligini va xalqaro ahamiyatdagi transport koridorlari bilan ishlashini ko‘rsatadi.',
		},
		'smart-city-nurafshon': {
			title: 'Smart City Nurafshon',
			shortTitle: 'Smart City Nurafshon',
			category: 'Raqamli infratuzilma',
			client: 'AJ Evrascon',
			institution: 'Shahar muhandislik infratuzilmasi',
			metaTitle: 'Smart City Nurafshon | Bridge Consult EPC keysi',
			metaDescription:
				'Bridge Consult keysi: EPC modeli bo‘yicha Nurafshon smart city infratuzilmasini rivojlantirish, shahar muhandisligi va raqamli tizimlarni integratsiya qilish.',
			summary:
				'EPC modeli bo‘yicha Nurafshon “aqlli shahar” infratuzilmasini rivojlantirish: shahar muhandisligi va raqamli tizimlarni integratsiya qilish.',
			context:
				'Smart City loyihalari qurilish, muhandislik va raqamli qismlarning kelishilgan bo‘lishini talab qiladi. Javobgarlik chegaralaridagi xatolar tezda muddat, sifat va ish hajmi bo‘yicha nizolarga aylanadi.',
			scope: [
				'Nurafshon aqlli shahar infratuzilmasi.',
				'Shahar muhandisligi va raqamli tizimlarni integratsiya qilish.',
				'Kompleks shahar loyihasi uchun EPC modelidan foydalanish.',
			],
			focus: [
				'EPC shartnomasida javobgarlikni chegaralash.',
				'Muhandislik va raqamli tizimlar integratsiyasi talablarini nazorat qilish.',
				'Muddat va qiymatga ta’sir qiladigan loyiha qarorlarini qayd etish.',
			],
			outcome:
				'Keys Bridge Consult portfelini klassik yo‘l va suv ta’minoti loyihalaridan tashqariga, raqamli shahar infratuzilmasi va kompleks EPC loyihalari tomon kengaytiradi.',
		},
		'energy-metering-adb': {
			title: 'Avtomatlashtirilgan elektr energiyasi hisobi',
			shortTitle: 'Energiya hisobi (OTB)',
			category: 'Energetika',
			client: 'KT-Corporation (Koreya)',
			institution: 'Osiyo taraqqiyot banki (OTB)',
			metaTitle: 'Avtomatlashtirilgan elektr energiyasi hisobi | Bridge Consult keysi',
			metaDescription:
				'Bridge Consult keysi: OTB ishtirokida Buxoro, Jizzax va Samarqand viloyatlari uchun elektr energiyasini monitoring va hisobga olish avtomatlashtirilgan tizimi.',
			summary:
				'Buxoro, Jizzax va Samarqand viloyatlari iste’molchilari uchun elektr energiyasini monitoring va hisobga olish avtomatlashtirilgan tizimini joriy etish.',
			context:
				'Raqamli komponentga ega energetika loyihalari natijani aniq ta’riflashni talab qiladi: nima yetkazib berish, nima joriy etish hisoblanadi, tizim ishlashi qanday tasdiqlanadi va bosqichlar qanday qabul qilinadi.',
			scope: [
				'Elektr energiyasini avtomatlashtirilgan monitoring va hisobga olish.',
				'Buxoro, Jizzax va Samarqand viloyatlarini qamrab olish.',
				'Xalqaro pudratchi ishtiroki va OTB moliyalashtiruvi.',
			],
			focus: [
				'Texnologik tizimni yetkazib berish va joriy etishni shartnomaviy boshqarish.',
				'Qabul qilish mezonlari va natijani tasdiqlash tartibini qayd etish.',
				'Uskuna, dasturiy qism va ekspluatatsiya kesishmasidagi xatarlar bilan ishlash.',
			],
			outcome:
				'Keys Bridge Consultning energetika infratuzilmasi va qurilish logikasi texnologik joriy etish bilan birlashadigan loyihalardagi tajribasini ko‘rsatadi.',
		},
	},
};

export function getProjectLangUrls(slug: string): Record<ProjectLang, string> {
	return {
		ru: `/projects/${slug}/`,
		en: `/EN/projects/${slug}/`,
		uz: `/UZ/projects/${slug}/`,
	};
}

export function getProjectCases(lang: ProjectLang): LocalizedProjectCase[] {
	return projectCases.map((project) => localizeProject(project, lang));
}

export function getProjectCase(lang: ProjectLang, slug: string): LocalizedProjectCase | undefined {
	return getProjectCases(lang).find((project) => project.slug === slug);
}

function localizeProject(project: BaseProjectCase, lang: ProjectLang): LocalizedProjectCase {
	const override = lang === 'ru' ? {} : text[lang][project.slug];
	return {
		...project,
		...override,
		urls: getProjectLangUrls(project.slug),
	} as LocalizedProjectCase;
}
