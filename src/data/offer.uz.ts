/**
 * Контент лендинга «Полное договорное сопровождение», узбекская версия.
 *
 * ВАЖНО: это перевод коммерческого предложения Ларисы
 * («КП_BRIDGE_Consult_подрядчикам_RU_расширенное_3.docx»), а не отдельный
 * документ. Русская версия — источник; при расхождении верна она. Перед
 * отправкой узбекоязычному подрядчику текст должна вычитать Лариса:
 * это коммерческое предложение с описанием границ ответственности.
 *
 * Биография и аккредитации взяты дословно из узбекской версии основного
 * сайта, кроме первого абзаца: он из самого предложения (там «более 30 лет»).
 */

export const offerUz = {
	lang: 'uz',
	meta: {
		title: "To'liq shartnomaviy qo'llab-quvvatlash — pudratchilar uchun BRIDGE Consult",
		description:
			"FIDIC va natijaga asoslangan shartnomalar bo'yicha infratuzilma loyihalarida hujjat aylanishi, shartnomani moliyaviy administratsiya qilish va Pudratchi manfaatlarini huquqiy himoya qilish.",
	},

	nav: [
		{ label: "Yo'nalishlar", href: '#pillars' },
		{ label: 'Nimalar kiradi', href: '#scope' },
		{ label: 'Qanday ishlaymiz', href: '#process' },
		{ label: 'Formatlar', href: '#formats' },
		{ label: 'Jamoa', href: '#team' },
	],
	cta: 'Loyihani muhokama qilish',
	langLinks: { ru: '/contract-support/', en: '/contract-support/en/', uz: '/contract-support/uz/' },

	hero: {
		eyebrow: 'Pudratchilarga · Tijorat taklifi',
		titleLines: ["To'liq shartnomaviy", "qo'llab-quvvatlash"],
		titleAccent: 'loyihalar uchun',
		lead: "FIDIC va natijaga asoslangan shartnomalar bo'yicha loyihalarda butun loyiha hujjat aylanishini yuritish, shartnomani moliyaviy administratsiya qilish va Pudratchi manfaatlarini huquqiy himoya qilish.",
		ctaPrimary: { label: 'Loyihani muhokama qilish', href: '#apply' },
		ctaSecondary: { label: 'Nimalar kiradi', href: '#scope' },
		credsText:
			"Dasturni <b>Larisa Belousova</b> olib boradi — FCCE, FCCP, OTB akkreditatsiyasidan o'tgan shartnomalarni boshqarish mutaxassisi",
		image: 'academy-atmosphere',
		imageAlt: 'Infratuzilma obyekti — yirik qurilish loyihasi maydoni',
		scrollCue: 'Pastga suring',
	},

	stats: {
		items: [
			{ value: '3', mark: 'Directions', label: 'hujjat aylanishi, loyiha moliyasi, huquqiy himoya' },
			{ value: '30', suffix: '+', mark: 'Positions', label: "taklifning uch bo'limidagi ish yo'nalishlari" },
			{ value: '4', mark: 'Formats', label: "tizimni sozlashdan bir necha loyiha portfeligacha" },
			{ value: 'FIDIC', suffix: ' + OPBC', mark: 'Contracts', label: 'va natijaga asoslangan shartnomalar' },
		],
		trainerNote:
			"Tarmoq qamrovi: avtomobil va temir yo'llar, ko'priklar va tunnellar, aeroportlar, suv ta'minoti va oqova suv, irrigatsiya va gidrotexnika inshootlari, energetika, fuqarolik, sanoat va ijtimoiy qurilish obyektlari.",
	},

	pillars: {
		id: 'pillars',
		mark: '01 · Directions',
		title: "Uchta ish yo'nalishi",
		lead: "Hujjatlar, pul va huquqni bitta jamoa yuritadi: talab, uning hisobi, dalillar bazasi va huquqiy pozitsiya birga tayyorlanadi va bir-biriga zid kelmaydi.",
		items: [
			{
				roman: 'I',
				title: 'Hujjat aylanishi va shartnomaviy tartiblar',
				text: "Hujjat shakllari va ularni Muhandis bilan kelishish; rasmiy yozishmalar va xabarnomalar; kelishuvga taqdim etishlar; Programme va hisobot; sifat va ijro hujjatlari; o'lchovlar; qabul qilish va loyihani yopish.",
				image: 'academy-mod-1',
				imageAlt: 'Chizma va sirkul — loyiha hujjat aylanishi',
			},
			{
				roman: 'II',
				title: 'Loyiha moliyasi',
				text: "Avans to'lovi va bank kafolatlari; pul oqimi prognozi; oraliq to'lovlar (IPC) va to'lov muddatlari nazorati; ushlab qolishlar; narx korreksiyasi; valyuta va soliqlar; yakuniy hisob-kitob.",
				image: 'academy-mod-2',
				imageAlt: 'Xarajat egri chiziqlari — shartnomani moliyaviy administratsiya qilish',
			},
			{
				roman: 'III',
				title: 'Huquq va manfaatlarni himoya qilish',
				text: "Shartnomaning huquqiy tahlili va risklar xaritasi; kontragentlar bilan shartnomalar; o'zgartirishlar va qo'shimcha ishlar; da'volar, EOT va Cost; moliyalashtiruvchi institutlar talablariga muvofiqlik; nizolarning oldini olish, DAAB va arbitraj.",
				image: 'academy-mod-4',
				imageAlt: "Bolg'acha va shisha panellar — huquqiy himoya va nizolarni hal qilish",
			},
		],
	},

	statement: {
		mark: '02 · Statement',
		lead: 'Benuqson hujjatlar. Boshqariladigan risklar.',
		body: 'Himoyalangan natija.',
		note: "Xizmat narxi bitta xato narxi bilan taqqoslanadi. Bitta o'tkazib yuborilgan xabarnoma, bitta rasmiylashtirilmagan Variation yoki bir oylik to'lov kechikishi loyihani qo'llab-quvvatlashdan qimmatroqqa tushadi.",
	},

	problems: {
		mark: '03 · Problems',
		title: 'Biz hal qiladigan muammolar',
		lead: "Ularning har biri nizodan emas, o'z vaqtida topshirilmagan yoki tasdiqlanmagan hujjatdan boshlanadi.",
		items: [
			"Kelishilmagan shakllar va hujjatlarning qayta-qayta qaytarilishi",
			"Xabarnomalarni (Notices) topshirishning shartnomaviy muddatlarini o'tkazib yuborish va shartnomaviy huquqlarning yo'qolishi",
			"Tasdiqlanmagan hajmlar va oraliq to'lov sertifikatlarining (IPC) kechikishi",
			"Sertifikatlash va to'lovning kechikishi tufayli kassa uzilishlari",
			"Muddati o'tgan bank kafolatlari va yopilmagan ushlab qolishlar",
			"Resurslar qimmatlashganda narx korreksiyasining qo'llanilmasligi",
			"Rasmiylashtirilmagan qo'shimcha ishlar",
			'Sifat hujjatlari va ijro hujjatlaridagi bo‘shliqlar',
			"Kechikishlar, o'zgartirishlar (Variations) va da'volar (Claims) bo'yicha dalillar bazasining yo'qligi",
		],
	},

	outcome: {
		mark: '04 · Outcome',
		title: 'Pudratchi uchun natija',
		lead: "BRIDGE Consult yechimi — loyihaning yagona hujjat ofisi: loyiha hujjat aylanishining butun sikli, shartnomaning moliyaviy bloki va huquqiy himoya bir qo'lda.",
		rows: [
			{
				name: "Pul o'z vaqtida keladi",
				text: "Oraliq to'lov arizalari shartnomaviy sanalarda to'liq asoslar to'plami bilan topshiriladi; sertifikatlash va to'lov muddatlari nazorat ostida, Buyurtmachining kechikishi foizlar hisoblanishi bilan rasmiylashtiriladi.",
			},
			{
				name: "Hajmlar yo'qolmaydi",
				text: "Bajarilgan har bir hajm bajarilgan paytda o'lchovlar, dalolatnomalar va sifat hujjatlari bilan tasdiqlanadi, keyinchalik qayta tiklanmaydi.",
			},
			{
				name: "Qo'shimcha ishlar to'lanadi",
				text: "Ko'rsatmalar va hodisalar darhol qayd etiladi, Variation ishlar boshlanishidan oldin rasmiylashtiriladi, qiymat va muddat kelishiladi, nizo predmeti bo'lib qolmaydi.",
			},
			{
				name: "Shartnomaviy huquqlar yonmaydi",
				text: "Xabarnomalar shartnomada belgilangan muddatlarda topshiriladi; muddatni uzaytirish (EOT) va xarajatlarni qoplash (Cost) talablari xotiralarga emas, dalillarga tayanadi.",
			},
			{
				name: 'Kafolatlar va ushlab qolishlar nazoratda',
				text: "Birorta bank kafolatining muddati o'tib ketmaydi, qabul qilishdan keyin birorta ushlab qolish summasi Buyurtmachida qolib ketmaydi.",
			},
			{
				name: 'Kamroq qaytarish va qayta ishlash',
				text: "Shakllar Muhandis bilan boshida bir marta kelishiladi va butun loyiha davomida ishlaydi; yozishmalar yagona standartda yuritiladi.",
			},
		],
	},

	scope: {
		id: 'scope',
		mark: '05 · Scope',
		title: "To'liq qo'llab-quvvatlashga nimalar kiradi",
		lead: "Aks holda shtatda saqlash kerak bo'lgan kundalik ish.",
		items: [
			"Barcha kiruvchi yozishmalarni qabul qilish, ro'yxatga olish, taqsimlash va ijrosini nazorat qilish",
			"Chiquvchi xatlar, xabarnomalar, so'rovlar, javoblar, kelishuvga taqdim etishlar, bayonnomalar va ilovalarni tayyorlash",
			"Qo'llaniladigan barcha loyiha, shartnomaviy, texnik, ijro va to'lov hujjatlari shakllarini ishlab chiqish, tizimlashtirish va Muhandis bilan kelishish",
			"Hujjatlar, kelishuvlar, ko'rsatmalar, o'zgartirishlar, muddatlar, to'lovlar, sifat bo'yicha izohlar (NCR) va da'volar (Claims) yagona reestrlarini yuritish",
			"Xabarnomalar, taqdim etishlar va javoblarni yuborishning shartnomaviy muddatlarini nazorat qilish",
			"Har qanday masala bo'yicha dalillarni tez yig'ish imkonini beruvchi tushunarli kodlash va statuslarga ega elektron arxiv shakllantirish",
			"Loyihachilar, ishlab chiqarish bo'linmalari, laboratoriya, smetachilar (QS), rejalashtiruvchilar (planners), subpudratchilar va yetkazib beruvchilar tomonidan hujjatlar tayyorlanishini muvofiqlashtirish",
			"Bank kafolatlari, avanslar, ushlab qolishlar, kontragentlar bilan shartnomalar va ochiq da'volar reestrlarini yuritish",
			"Shartnomaviy va to'lov muddatlarini, shu jumladan sertifikatlash, to'lov va ta'minotlar amal qilish muddatlarini nazorat qilish",
			"Chiquvchi hujjatlarni Pudratchining vakolatli shaxsi imzolashidan oldin huquqiy tekshirish",
		],
	},

	tables: [
		{
			id: 'documents',
			mark: '06 · Documents',
			title: 'Hujjat aylanishi va shartnomaviy tartiblar',
			rows: [
				{
					name: 'Hujjat aylanishini boshqarish',
					text: "Document Control Procedure; kodlash; reestrlar; hamrohlik varaqalari (transmittals); statuslar; muddatlar nazorati; elektron arxiv; rahbariyat uchun haftalik sarhisob.",
				},
				{
					name: 'Hujjat shakllari',
					text: "Qo'llaniladigan barcha loyiha, shartnomaviy, texnik, ijro va to'lov hujjatlari shakllarini to'liq ishlab chiqish, tizimlashtirish va Muhandis bilan kelishish: xatlar, xabarnomalar, transmittals, submittals, MIR/WIR/RFI, ITP, Method Statements, chek-varaqalar, dalolatnomalar, laboratoriya shakllari, ishlar borishi hisobotlari, o'lchovlar, IPC, Variations, Claims va tegishli reestrlar; Muhandis izohlari bo'yicha qayta ishlash va tasdiqlangan shakllarni joriy etish.",
				},
				{
					name: 'Shartnomaviy yozishmalar',
					text: "Muhandis va Buyurtmachi bilan barcha rasmiy yozishmalar: xabarnomalar (notices), so'rovlar, javoblar, takliflar, bayonnomalar, follow-up va qabul qilingan qarorlar ijrosini nazorat qilish.",
				},
				{
					name: 'Loyiha shartnomalari',
					text: "Subpudrat, yetkazib berish, ijara va xizmat shartnomalari; asosiy shartnoma majburiyatlarini subpudratchilarga o'tkazish (flow-down); risklarni taqsimlash; xarajatlarni optimallashtirish; kafolatlar, to'lovlar va javobgarlik; Muhandis bilan kelishish.",
				},
				{
					name: 'Muhandisga taqdim etishlar (Submittals)',
					text: "Materiallar, manbalar (karerlar va yetkazib beruvchilar), ish bajarish usullari, xodimlar, texnika, chizmalar, loyiha yechimlari, namunalar va boshqa hujjatlar; izohlarni ishlab chiqish va qayta topshirishlarni nazorat qilish.",
				},
				{
					name: 'Programme va ishlar borishi',
					text: "Baseline Programme, yangilanishlar, quvib yetish dasturi (recovery programme), look-ahead plans, WBS, bog'lanishlar mantig'i, resurslar, kritik yo'l, vaqt zaxiralari (float), hisobot va kechikishlarni hujjatlashtirish.",
				},
				{
					name: 'Sifat va ijro hujjatlari',
					text: 'ITP, Method Statements, MIR/WIR/RFI, laboratoriya bayonnomalari, dalolatnomalar, ijro chizmalari, NCR/CAR, chek-varaqalar va yakuniy dosyelar.',
				},
				{
					name: "O'lchovlar va to'lovlar",
					text: "IPC to'plami: o'lchovlar, tasdiqlangan hajmlar, dalolatnomalar, sifat hujjatlari, kelishuvlar, o'zgartirishlar, ushlab qolishlar va da'vo qilingan / to'langan summalar reestri.",
				},
				{
					name: "O'zgartirishlar va qo'shimcha ishlar",
					text: "Ko'rsatmalar va hodisalarni qayd etish; tijorat hisob-kitoblari (quotations); yangi narxlarni kalkulyatsiya qilish (build-up rates); resurslar va xarajatlarni tasdiqlash; o'zgartirishlar reestri (Variation register); qiymat va muddatlarni kelishish.",
				},
				{
					name: "Xabarnomalar, EOT va Claims",
					text: "O'z vaqtidagi (erta) xabarnomalar; joriy yozuvlarni yuritish (contemporary records); sabab-oqibat bog'lanishlari tahlili; talab huquqini asoslash (entitlement); dalillar; muddatni uzaytirish (EOT); xarajatlar (Cost); batafsil Claims va qaror tartibini (Determination) qo'llab-quvvatlash.",
				},
				{
					name: 'Qabul qilish va loyihani yopish',
					text: "Ijro dosyesi (as-built), sinovlar, kamchiliklar ro'yxati (punch list), qabul qilish (Taking-Over), tugallanmagan ishlar, kafolat majburiyatlari davri (DNP), yakuniy hisob-kitob (Final Statement) va to'liq arxiv to'plamini tizimlashtirish.",
				},
			],
		},
		{
			id: 'finance',
			mark: '07 · Finance',
			title: 'Loyihani moliyalashtirish va Pudratchining pul oqimi',
			dark: true,
			note: "Bandlar raqamlanishi FIDIC namunaviy shartlari bo'yicha keltirilgan; har bir loyihada aniq shartnomaning Maxsus shartlari (Particular Conditions) qo'llaniladi va ish ular bo'yicha olib boriladi.",
			rows: [
				{
					name: "Avans to'lovi (Advance Payment)",
					text: "Ofertaga ilova bo'yicha avans shartlarini tekshirish; avans arizasi va shartnoma shakli bo'yicha avansni qaytarish bank kafolatini tayyorlash; kafolat amal qilish muddati va o'z vaqtida uzaytirilishini nazorat qilish; har bir IPC da avansni qoplash hisobiga ushlab qolishlar to'g'riligini tekshirish; avansni yopish va kafolatni qaytarish.",
				},
				{
					name: 'Pul oqimini rejalashtirish',
					text: "Programme va hajmlar qaydnomasi asosida pul oqimi prognozini (Cash-flow Forecast) shakllantirish va yangilash; 14.4-band tartibida Muhandis bilan taqdim etish va kelishish; tushumlar jadvalini ishlar jadvali, yetkazib berishlar, mobilizatsiya va subpudratchilar oldidagi majburiyatlar bilan bog'lash.",
				},
				{
					name: "Oraliq to'lovlar (IPC)",
					text: "To'liq Statement / IPA to'plamini o'z vaqtida tayyorlash; Muhandis tomonidan IPC chiqarilishini qo'llab-quvvatlash va izohlarni ishlab chiqish; sertifikatlash va to'lovning shartnomaviy muddatlarini nazorat qilish (14.6–14.7-bandlar); da'vo qilingan, sertifikatlangan, to'langan va bahsli summalarning yagona reestri.",
				},
				{
					name: 'Ushlab qolishlar (Retention)',
					text: "Ushlab qolishlar hajmi va chegaraviy summaga yetishini nazorat qilish; Taking-Over Certificate berilganda birinchi yarmini va kafolat majburiyatlari davri tugagach ikkinchi yarmini bo'shatish uchun hujjatlar tayyorlash (14.9-band); shartnoma ruxsat bersa, ushlab qolishlarni bank kafolati bilan almashtirish.",
				},
				{
					name: "Kafolatlar va ta'minotlar",
					text: "Performance Security, avansni qaytarish kafolati, kafolat majburiyatlari davri kafolati, ona kompaniya kafolatlari: shakllar, summalar, muddatlar, uzaytirishlar, bosqichma-bosqich kamaytirish va o'z vaqtida qaytarishni nazorat qilish; ta'minot bo'yicha asossiz talab qo'yilishining oldini olish.",
				},
				{
					name: "Narx korreksiyasi va xarajatlar o'sishi",
					text: "Narx korreksiyasi formulasi bo'yicha hisob-kitoblar (13.8-band): indekslar, vaznli koeffitsiyentlar, bazaviy sanalar, kotirovka manbalari; qonunchilik va soliqlar o'zgarishi bilan bog'liq talablar (13.7-band); materiallar, YOM va ishchi kuchi qimmatlashganini hujjatli tasdiqlash.",
				},
				{
					name: 'Valyuta, soliqlar va bank rasmiylashtiruvi',
					text: "Shartnomada belgilangan to'lov valyutalari va kurslarni nazorat qilish; summalarni mahalliy va xorijiy valyuta o'rtasida taqsimlash; QQS, manbadagi soliq, bojxona to'lovlari va xalqaro moliya institutlari loyihalari bo'yicha imtiyozlar; xizmat ko'rsatuvchi bank uchun tasdiqlovchi hujjatlar to'plami.",
				},
				{
					name: "Buyurtmachining to'lov kechikishi",
					text: "To'lanmaganlik haqida xabarnomalar tayyorlash; o'z vaqtida to'lanmagan to'lov uchun foizlarni hisoblash (14.8-band); zarur bo'lsa — ishlarni to'xtatib turish yoki sur'atni pasaytirish tartibi (16.1-band) shakl va muddatlarga qat'iy rioya qilgan holda; xarajatlar va muddatni uzaytirish huquqlarini saqlash.",
				},
				{
					name: 'Subpudrat va yetkazib berishlarni moliyalashtirish',
					text: "Subpudratchilar va yetkazib beruvchilarga to'lovlarni IPC bo'yicha tushumlar bilan bog'lash; subpudrat shartnomalari bo'yicha ta'minotlar, avanslar va ushlab qolishlarni nazorat qilish; Pudratchi majburiyatlari va loyihaning haqiqiy moliyalanishi o'rtasidagi uzilishning oldini olish.",
				},
				{
					name: 'Yakuniy hisob-kitob va yopish',
					text: "Final Statement va Discharge (14.11–14.12-bandlar); avans, ushlab qolishlar va kafolatlarni yopish; barcha hisoblanmalar, ushlab qolishlar, jarima sanksiyalari va likvid zararlarni solishtirish; hal qilinmagan summalarni asoslash va ularni da'vo tartibiga o'tkazish.",
				},
			],
		},
		{
			id: 'legal',
			mark: '08 · Legal',
			title: "Shartnomani huquqiy qo'llab-quvvatlash",
			rows: [
				{
					name: 'Shartnoma tahlili va risklar xaritasi',
					text: "General va Particular Conditions, ilovalar, spetsifikatsiyalar va hajmlar qaydnomasining huquqiy tahlili; Pudratchi majburiyatlari va risklari xaritasi; Particular Conditions ning FIDIC standartidan Pudratchi holatini yomonlashtiruvchi chetlanishlari ro'yxati; o'tkazib yuborilishi talab huquqidan mahrum qiladigan muddatlar bo'yicha eslatma.",
				},
				{
					name: 'Shartnomaviy strategiya',
					text: "Bahsli masalalarda Pudratchi pozitsiyasini ishlab chiqish; tegishli tartibni tanlash (xabarnoma, Variation, Claim, Muhandis qarori); xatlar va taqdim etishlarning huquqiy asoslanishi; huquqlardan voz kechish (waiver) va yozishmalarda noqulay faktlarni tan olishga yo'l qo'ymaslik.",
				},
				{
					name: 'Kontragentlar bilan shartnomalar',
					text: "Subpudrat, yetkazib berish, ijara, xizmat shartnomalari, shuningdek qo'shma faoliyat to'g'risidagi bitimlarni (JV / Consortium) huquqiy ekspertizadan o'tkazish va tayyorlash; asosiy shartnoma majburiyatlarini o'tkazish (flow-down); ta'minot, javobgarlik, fors-major, qo'llaniladigan huquq va nizolarni hal qilish tartibi.",
				},
				{
					name: "O'zbekiston Respublikasi qonunchiligiga muvofiqlik",
					text: "FIDIC shartlarini O'zbekiston Respublikasining fuqarolik va shaharsozlik qonunchiligi bilan solishtirish; ruxsat hujjatlari, litsenziyalar va ruxsatnomalar; xorijiy xodimlarning mehnat va migratsiya masalalari; valyutani tartibga solish va hisob-kitoblarga qo'yiladigan talablar.",
				},
				{
					name: 'Moliyalashtiruvchi institutlar talablari va komplayens',
					text: "Buyurtmachi va bank qoidalariga rioya qilish: xarid tartiblari, manfaatlar to'qnashuvi, korrupsiyaga qarshi va sanksiya talablari, mehnat muhofazasi, ekologik va ijtimoiy majburiyatlar, moliyalashtiruvchi institut oldidagi hisobot.",
				},
				{
					name: "Da'vo ishi",
					text: "Claims ning huquqiy asoslanishi: talab huquqi asosi, sabab-oqibat bog'lanishi, dalillar, summa va muddat hisobi; Buyurtmachining qarshi talablariga javoblar (likvid zararlar, jarimalar, ushlab qolishlar); Muhandis qaroriga pozitsiya tayyorlash.",
				},
				{
					name: 'Nizolarning oldini olish va sudgacha hal qilish',
					text: "Muzokaralar, kelishmovchiliklar bayonnomalari, sulh bitimlari; nizolar kengashiga (DAB / DAAB) murojaatni qo'llab-quvvatlash: Referral, javoblar va ilovalarni tayyorlash; do'stona hal qilish (amicable settlement) tartibini qo'llab-quvvatlash.",
				},
				{
					name: 'Arbitraj va sud',
					text: "Dalillar bazasi va hodisalar xronologiyasini shakllantirish; protsessual hujjatlarni tayyorlash; tashqi advokatlar va texnik ekspertlar bilan muvofiqlashtirish; xalqaro arbitrajni hamda qarorlarni tan olish va ijro etishni qo'llab-quvvatlash.",
				},
				{
					name: "To'xtatib turish va bekor qilish",
					text: "Shartnomaning 15 va 16-bo'limlari bo'yicha asoslarni huquqiy baholash; shakl va muddatlarga rioya qilgan holda xabarnomalar tayyorlash; tugatish sanasidagi bajarilgan hajmlar, xarajatlar, materiallar va uskunalarni qayd etish; noqonuniy bekor qilishdan va ta'minot bo'yicha talab qo'yilishidan himoya.",
				},
			],
		},
	],

	process: {
		id: 'process',
		mark: '09 · Process',
		title: 'Ish qanday tashkil etilgan',
		lead: "Besh bosqich: joriy holatni tekshirishdan rahbariyat uchun muntazam sarhisobgacha.",
		rows: [
			{
				name: 'Diagnostika',
				text: "Asosiy shartnoma va maxsus shartlarni, jamoa tuzilmasini, Programme, reestrlarni, sifatni, IPC va to'lov holatini, avansni, bank kafolatlari va ushlab qolishlarni, kontragentlar bilan shartnomalarni, ochiq o'zgartirishlarni, da'volar va nizolarni, shuningdek to'planib qolgan hujjatlar hajmini tekshiramiz.",
			},
			{
				name: 'Mobilizatsiya',
				text: "Document Control Procedure, Contract Administration Plan, javobgarlik matritsasi, shartnomaviy, to'lov va kafolat muddatlari kalendari, shartnomalar reestri va to'liq shakllar to'plamini ishlab chiqamiz; ularni ko'rib chiqish, qayta ishlash va Muhandis bilan kelishish jarayonini yuritamiz.",
			},
			{
				name: 'Jamoa bilan integratsiya',
				text: "Kim boshlang'ich ma'lumot beradi, kim texnik va moliyaviy qismni tekshiradi, kim huquqiy baho beradi, kim hujjatni kelishadi va imzolaydi hamda muddat kimga biriktirilganini aniqlaymiz; Pudratchining ishlab chiqarish, moliya va yuridik xizmatlari bilan o'zaro ishlashni yo'lga qo'yamiz.",
			},
			{
				name: 'Kundalik yuritish',
				text: "Hujjatlarni tayyorlaymiz, ro'yxatga olamiz, yuboramiz va kuzatamiz; IPC to'plamlarini shakllantiramiz va to'lovni nazorat qilamiz; o'zgartirishlar, xabarnomalar va da'volarni yuritamiz; javoblar, izohlar, qayta topshirishlar va masalalarning yopilishini nazorat qilamiz.",
			},
			{
				name: 'Rahbariyat uchun nazorat',
				text: "Muntazam sarhisob taqdim etamiz: kritik muddatlar, muddati o'tgan kelishuvlar, pul oqimi holati, to'lanmagan hajmlar va muddati o'tgan to'lovlar, kafolatlar va ushlab qolishlar holati, o'zgartirishlar, NCR, da'volar, huquqiy risklar va talab qilinadigan qarorlar.",
			},
		],
	},

	formats: {
		id: 'formats',
		mark: '10 · Formats',
		title: 'Hamkorlik formatlari',
		lead: "Tizimni bir martalik sozlashdan shartnomalar portfeli uchun tashqi loyiha ofisigacha.",
		items: [
			{
				roman: 'I',
				title: 'Tizimni sozlash',
				image: 'academy-mod-1',
				imageAlt: "Chizma va sirkul — qo'llab-quvvatlash tizimini sozlash",
				text: "Bir martalik diagnostika va qo'llab-quvvatlash tizimini ishga tushirish: shartnomaning huquqiy auditi va shartnomaviy risklar xaritasi, tartiblar, reestrlar, to'liq shakllar to'plami va ularni Muhandis bilan kelishish, shartnomaviy, to'lov va kafolat muddatlari kalendari, javobgarlik matritsasi va loyiha jamoasini o'qitish.",
			},
			{
				roman: 'II',
				title: "Bitta loyihani to'liq yuritish",
				image: 'academy-mod-3',
				imageAlt: 'Shovun va chizma — bitta loyihani yuritish',
				text: "BRIDGE Consult bitta loyihaning butun hujjat aylanishini kundalik yuritishni, shartnomani moliyaviy administratsiya qilishni va huquqiy qo'llab-quvvatlashni kelishilgan mutaxassislar tarkibi bilan, qurilish maydonida ishtirok etgan holda o'z zimmasiga oladi.",
			},
			{
				roman: 'III',
				title: 'Bir necha loyiha portfeli',
				image: 'academy-mod-2',
				imageAlt: 'Xarajat egri chiziqlari — loyihalar portfeli',
				text: "Pudratchining bir necha shartnomasi uchun yagona tashqi loyiha ofisi: unifikatsiyalangan tartiblar va reestrlar, muddatlar, to'lovlar, kafolatlar va da'vo ishining markazlashgan nazorati, har bir loyiha bo'yicha alohida ish oqimlari.",
			},
			{
				roman: 'IV',
				title: 'Alohida vazifa',
				image: 'academy-mod-4',
				imageAlt: "Bolg'acha va shisha — alohida vazifa",
				text: "Aniq vazifa uchun nuqtali jalb qilish: imzolashdan oldin shartnoma ekspertizasi, alohida talab (Claim) yoki o'zgartirishlar to'plamini tayyorlash, muammoli uchastka bo'yicha hujjatlarni tiklash, Muhandis qaroriga yoki nizolar kengashida ko'rib chiqishga pozitsiya tayyorlash.",
			},
		],
	},

	pricing: {
		mark: '11 · Pricing',
		title: 'Narx individual belgilanadi',
		lead: "Ushbu bosqichda aniq summalar belgilanmaydi. Shartlar ekspress-diagnostika natijalari bo'yicha aniqlanadi va loyihalar soni, ularning qiymati va bosqichiga; joriy va muddati o'tgan hujjatlar hajmiga; kontragentlar bilan shartnomalar soniga; ochiq o'zgartirishlar, da'volar, nizolar va muddati o'tgan to'lovlar mavjudligiga; shartnoma bo'yicha valyuta va to'lov shartlariga; lotlar va uchastkalar soniga; ish tillariga; obyektda bo'lish zarurati va jamoa tarkibiga bog'liq.",
		models: [
			"Loyiha yoki portfelni qo'llab-quvvatlashning belgilangan oylik qiymati",
			"Tizimni sozlash yoki alohida vazifa uchun bir martalik qiymat",
			"Da'vo ishi va nizolarni qo'llab-quvvatlash bo'yicha alohida smeta",
		],
		modelsNote: 'Modellar birlashtiriladi.',
		note: "Portfel haqida qisqacha ma'lumot olingandan so'ng BRIDGE Consult jamoaning optimal tuzilmasini, funksiyalar taqsimotini, mobilizatsiya rejasini, qo'llaniladigan to'lov modelini va narx hisobini taklif qiladi — har bir loyiha bo'yicha alohida yoki butun portfelga.",
	},

	team: {
		id: 'team',
		mark: '12 · Team',
		title: 'Jamoa tarkibi',
		lead: "Loyihalar soni va ish hajmiga qarab quyidagi mutaxassislar jalb qilinishi mumkin:",
		items: [
			"Qo'llab-quvvatlash rahbari / yetakchi Contract Manager",
			'Shartnomalar va shartnomaviy ish bo‘yicha mutaxassis',
			'Rejalashtiruvchi (planner) / Programme va kechikishlar tahlili bo‘yicha mutaxassis',
			'Sifat va ijro hujjatlari bo‘yicha mutaxassis',
			'Hujjat nazoratchisi (document controller)',
			"Quantity surveyor / o'lchovlar va to'lovlar bo'yicha mutaxassis",
			"Xalqaro qurilish shartnomalari va nizolarni hal qilish bo'yicha ikki yurist — huquq sohasida LL.M. va PhD darajalari bilan",
			"Shartnomani moliyaviy administratsiya qilish va pul oqimi bo'yicha mutaxassis",
			'Alohida masalalar bo‘yicha profilli texnik, moliyaviy va yuridik ekspertlar',
		],
	},

	boundaries: {
		mark: '13 · Boundaries',
		title: 'Javobgarlik chegaralari',
		principle:
			"BRIDGE Consult hujjatlarni tayyorlaydi, shartnomaviy va to'lov tartiblarini yuritadi hamda huquqiy pozitsiyalarni shakllantiradi. Qarorlarni Pudratchi qabul qiladi: barcha rasmiy hujjatlar uning nomidan vakolatli shaxs tomonidan kelishilgan va imzolangandan keyin chiqariladi.",
		colA: 'BRIDGE Consult javobgarlik zonasi',
		colB: 'Pudratchi javobgarlik zonasi',
		rows: [
			{
				a: "Loyihaning barcha hujjatlari va reestrlarini tayyorlash, ro'yxatga olish va yuritish; shakllarni ishlab chiqish va ularni Muhandis bilan kelishish.",
				b: 'Ishlarni bajarish, texnik va loyiha yechimlari, qo‘llaniladigan texnologiyalar va qurilishni tashkil etish.',
			},
			{
				a: "Shartnomaviy va to'lov tartiblarini yuritish, shartnomaviy muddatlarni nazorat qilish, IPC tayyorlash va qo'llab-quvvatlash.",
				b: "Birlamchi o'lchovlar, laboratoriya sinovlari, maydonda sifat nazorati, mehnat muhofazasi va sanoat xavfsizligi.",
			},
			{
				a: 'Shartnomaning huquqiy tahlili, shartnomaviy strategiya, kontragentlar bilan shartnomalarni tayyorlash va ekspertizadan o‘tkazish.',
				b: "Boshlang'ich ma'lumotlar, birlamchi hujjatlar, hajmlar hisobi va tasdiqlovchi materiallarning to'liqligi va ishonchliligi.",
			},
			{
				a: 'Talablarni (Variation, EOT, Cost) asoslash, dalillar bazasi va huquqiy pozitsiyalarni shakllantirish.',
				b: "Hujjatlar va ma'lumotlarni kelishilgan muddatlarda va kelishilgan formatda o'z vaqtida taqdim etish.",
			},
			{
				a: "To'lovlar, ushlab qolishlar, kafolatlar va narx korreksiyasi bo'yicha hisob-kitoblar; sertifikatlash va to'lov muddatlarini nazorat qilish.",
				b: "Buxgalteriya va soliq hisobi, pul mablag'larini tasarruf etish, to'lovlarni bajarish va soliq hisoboti.",
			},
			{
				a: "Determination tartibi, nizolar kengashi (DAAB), mediatsiya va arbitrajni qo'llab-quvvatlash.",
				b: 'Barcha chiquvchi hujjatlarni kelishish va imzolash; boshqaruv va tijorat qarorlarini qabul qilish.',
			},
		],
		notes: [
			"Huquqiy xulosalar, pozitsiyalar va hisob-kitoblar Pudratchi taqdim etgan hujjatlar va ma'lumotlar asosida shakllantiriladi. Ularning to'liqligi va ishonchliligi uchun Pudratchi javob beradi.",
			"Biz shartnomaviy tartiblarga rioya qilish, tayyorlangan hujjatlar va dalillar bazasining sifati uchun javob beramiz, lekin talablarni ko'rib chiqish natijasini kafolatlamaymiz: qarorlarni Muhandis, Buyurtmachi, nizolar kengashi yoki arbitraj qabul qiladi.",
			"Shartnomani moliyaviy administratsiya qilish Pudratchining pul mablag'larini tasarruf etishni, buxgalteriya va soliq hisobini yuritishni o'z ichiga olmaydi va auditni almashtirmaydi.",
			"Sudlarda vakillik qonunchilikda belgilangan tartibda advokatlar tomonidan amalga oshiriladi. Zarur bo'lganda biz advokatlarni jalb qilamiz va ishlab chiqilgan huquqiy pozitsiya doirasida ularning ishini muvofiqlashtiramiz.",
			"Ish boshlanishidan oldin manfaatlar to'qnashuviga tekshiruv o'tkaziladi. BRIDGE Consult o'zi Muhandis, nizolar kengashi a'zosi yoki Buyurtmachi konsultanti sifatida ishtirok etayotgan loyihada Pudratchini qo'llab-quvvatlamaydi. Olingan ma'lumot maxfiy va faqat loyiha maqsadlarida ishlatiladi.",
		],
	},

	why: {
		mark: '14 · Why',
		title: 'Nima uchun BRIDGE Consult',
		rows: [
			{
				name: "Yollash o'rniga tayyor jamoa",
				text: "Contract manager, rejalashtiruvchi, quantity surveyor, sifat bo'yicha mutaxassis, document controller va yurist loyihaga kelishilgan tarkibda bir necha hafta ichida chiqadi. Markaziy Osiyo bozorida bunday tarkibni shtatga yig'ish oylar oladi, loyihalar orasida uni saqlash esa qimmat.",
			},
			{
				name: "Hujjatlar, pul va huquq bir qo'lda",
				text: "Alohida yuridik firma, rejalashtiruvchi va smetachi yollash hamda ularning ishini bir-biriga moslash shart emas: talab, uning hisobi, dalillar bazasi va huquqiy pozitsiya bitta jamoa tomonidan tayyorlanadi va bir-biriga zid kelmaydi.",
			},
			{
				name: 'Biz Pudratchi tomonida ishlaymiz',
				text: "Muhandis hujjatni qanday o'qishini va Buyurtmachi nimani tekshirishini bilamiz, materiallarni birinchi martadanoq o'tadigan qilib tayyorlaymiz, qayta ishlashga qaytarilmaydigan qilib.",
			},
			{
				name: "Loyihani moliyalashtiruvchilar tan olgan kompetensiya",
				text: "FIDIC malakalari (FCCE, FCCP), Osiyo taraqqiyot banki akkreditatsiyasi va OTB, AIIB, Jahon banki hamda EBRD loyihalaridagi tajriba bizning hujjatlarimiz Muhandis va moliyalashtiruvchi institut qo'shimcha izohsiz qabul qiladigan standart bo'yicha qurilganini anglatadi.",
			},
			{
				name: 'Xalqaro standart va mahalliy amaliyot bir vaqtda',
				text: "FIDIC shartnomalari o'zbek qonunchiligi, ruxsat tartiblari va qurilish amaliyoti muhitida qo'llaniladi. Biz ikki tizim tutashgan joyda ishlaymiz, ulardan birining ichida emas.",
			},
			{
				name: 'Xizmat narxi bitta xato narxi bilan taqqoslanadi',
				text: "Bitta o'tkazib yuborilgan xabarnoma, bitta rasmiylashtirilmagan Variation yoki bir oylik to'lov kechikishi loyihani qo'llab-quvvatlashdan qimmatroqqa tushadi.",
			},
			{
				name: 'Mustaqillik va maxfiylik',
				text: "Biz bitta loyihaning ikkala tomonini qo'llab-quvvatlamaymiz va olingan ma'lumotni undan tashqarida ishlatmaymiz.",
			},
		],
	},

	founder: {
		id: 'founder',
		label: 'Asoschi haqida',
		name: 'Larisa Belousova',
		role: "Infratuzilma shartnomalari · FIDIC · EPC/EPC+F · Xaridlar · Claims · Dispute Avoidance · Xalqaro arbitraj",
		photoAlt: 'Larisa Belousova',
		photoCaption: 'Larisa Belousova',
		bio: [
			"Infratuzilma shartnomalari, xaridlar, qurilish talablari va nizolarni hal qilish bo'yicha ekspert. Ishlab chiqarish va qurilish, logistika va xaridlar sohalarida 30 yildan ortiq boshqaruv tajribasi, shu jumladan FIDIC shartnomalarini boshqarish va xalqaro moliya institutlari moliyalashtiradigan infratuzilma loyihalarida 15 yildan ortiq ixtisoslashgan tajriba.",
			"Uning tarmoq tajribasi avtomobil yo'llari va yo'l infratuzilmasi, ko'priklar va tunnellar, transport va aeroport infratuzilmasi, shahar va ijtimoiy infratuzilma, suv ta'minoti va oqova suv tizimlari, energetika hamda boshqa yirik infratuzilma loyihalarini qamrab oladi.",
			"U FIDIC shartnomalarini boshqarish, EPC va EPC+F shartnomalarini tuzish, xarid va tender hujjatlarini tayyorlash, o'zgartirishlar va da'volarni boshqarish, kechikishlar va da'volar qiymatini tahlil qilish, shartnomaviy va tijorat risklarini boshqarish, nizolarning oldini olish va qurilish nizolarini hal etishga ixtisoslashgan. Red Book, Yellow Book, Silver Book, MDB Harmonised Editions, Subcontract Book va White Book shakllarini qo'llash bo'yicha amaliy tajribaga ega.",
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
		cvLabel: 'CV yuklab olish (PDF)',
		moreLabel: "Davomini o'qish",
		lessLabel: 'Yopish',
	},

	finalCta: {
		mark: '15 · Next step',
		lineOne: 'Nizo deyarli hech qachon nizodan boshlanmaydi.',
		lineTwo: "U o'z vaqtida topshirilmagan hujjatdan boshlanadi.",
		cta: 'Loyihani muhokama qilish',
		href: '#apply',
		note: "Loyihalar portfeli bo'yicha ishchi uchrashuv va ekspress-diagnostika o'tkazishni taklif qilamiz.",
	},

	apply: {
		id: 'apply',
		label: 'Keyingi qadam',
		title: "Loyihalar portfeli bo'yicha ekspress-diagnostika",
		lead: "Dastlabki baholash uchun loyihalar ro'yxati, maxsus shartlari bilan asosiy shartnomalar, amaldagi Programme, so'nggi IPC va ularning to'lov holati, bank kafolatlari va ushlab qolishlar to'g'risidagi ma'lumotlar, asosiy subpudratchilar bilan shartnomalar, shuningdek hujjat aylanishi, sifat, kelishuvlar, muddatlar, to'lovlar, o'zgartirishlar va ochiq da'volar bo'yicha muammolarning qisqacha ro'yxatini taqdim etish yetarli.",
		listTitle: "Diagnostika yakunlari bo'yicha BRIDGE Consult tayyorlaydi",
		list: [
			"Uchta yo'nalish bo'yicha taklif etilayotgan xizmatlar hajmi — hujjat aylanishi, loyiha moliyasi va huquqiy himoya",
			'Butun hujjat aylanishini yuritish sxemasi',
			"Jamoa tarkibi va BRIDGE Consult bilan Pudratchi o'rtasida funksiyalar taqsimoti",
			'Mobilizatsiya rejasi',
			"To'lov modeli va narx hisobi — har bir loyiha bo'yicha alohida yoki butun portfelga",
		],
		mailNote: "Yoki to'g'ridan-to'g'ri yozing:",
		source: 'Shartnomaviy qo‘llab-quvvatlash — pudratchilarga (UZ)',
		submit: 'So‘rov yuborish',
		signature: {
			name: 'Larisa K. Belousova',
			role: '«BRIDGE Consult» MChJ asoschisi va direktori',
		},
		states: {
			sending: 'Yuborilmoqda...',
			sendingNote: 'So‘rov yuborilmoqda.',
			sent: 'So‘rov yuborildi',
			successNote: "Rahmat! So'rov yuborildi — biz siz bilan bog'lanamiz.",
			errorNote:
				"Avtomatik yuborishning iloji bo'lmadi — {email} manziliga xat ochiladi, uni yuboring. Yoki bizga Telegramda yozing.",
			subject: "So'rov — loyihani shartnomaviy qo'llab-quvvatlash",
			sentFrom: 'Sahifadan yuborildi',
		},
		fields: {
			name: { label: 'Ism va familiya', placeholder: 'Masalan: Akmal Rahimov' },
			role: { label: 'Lavozim / tashkilot', placeholder: 'Shartnoma menejeri, tashkilot' },
			contact: { label: 'Javob uchun kontakt', placeholder: 'Telefon, Telegram yoki email' },
			format: {
				label: 'Hamkorlik formati',
				options: [
					'Tizimni sozlash',
					"Bitta loyihani to'liq yuritish",
					'Bir necha loyiha portfeli',
					'Alohida vazifa',
					'Hali hal qilmadik — maslahat kerak',
				],
			},
			projects: {
				label: 'Ishdagi loyihalar',
				options: ['1 loyiha', '2–3 loyiha', '4–6 loyiha', '6 dan ortiq loyiha'],
			},
			stage: {
				label: 'Bosqich',
				options: [
					'Tender / shartnoma imzolangunga qadar',
					'Ishlar boshlanishi, mobilizatsiya',
					'Asosiy qurilish bosqichi',
					'Yakunlash va qabul qilish',
					"Ochiq da'volar yoki nizo",
				],
			},
			message: {
				label: 'Hozir nima tashvishlantirmoqda',
				placeholder:
					"Muddati o'tgan to'lovlar, rasmiylashtirilmagan o'zgartirishlar, Muhandis izohlari, ochiq da'volar, kafolatlar, hujjat aylanishi",
			},
		},
	},

	footer: {
		description:
			"Infratuzilma va qurilish loyihalarini to'liq shartnomaviy qo'llab-quvvatlash: hujjat aylanishi, shartnomani moliyaviy administratsiya qilish va Pudratchi manfaatlarini huquqiy himoya qilish.",
		navTitle: 'Navigatsiya',
		nav: [
			{ label: 'Asosiy sayt', href: 'https://www.bridgeconsult.uz/UZ/' },
			{ label: 'Loyihalar', href: 'https://www.bridgeconsult.uz/UZ/projects.html' },
			{ label: 'Yangiliklar', href: 'https://www.bridgeconsult.uz/news/uz/' },
			{ label: "Ta'lim", href: 'https://www.bridgeconsult.uz/UZ/#trainings' },
			{ label: 'BRIDGE Consult Academy', href: '/academy/uz/' },
		],
		contactsTitle: "Kontakt ma'lumotlari",
		address:
			"100180, O'zbekiston Respublikasi,<br>Toshkent shahri, Yunusobod tumani,<br>Ahmad Donish ko'chasi, 12-kvartal, 20A",
		rights: 'Barcha huquqlar himoyalangan.',
		disclaimer:
			"FIDIC standart shartnoma shakllari, rasmiy nashrlari, logotiplari va boshqa intellektual mulk obyektlariga bo'lgan barcha mualliflik huquqlari Fédération Internationale des Ingénieurs-Conseils (FIDIC) va/yoki tegishli huquq egalariga tegishli. Ushbu sahifadagi bandlar raqamlanishi FIDIC namunaviy shartlari bo'yicha keltirilgan; har bir loyihada aniq shartnomaning Maxsus shartlari qo'llaniladi. BRIDGE Consult o'zining konsalting xizmatlarini ko'rsatadi va FIDIC nomidan ish ko'rmaydi.",
	},
} as const;
