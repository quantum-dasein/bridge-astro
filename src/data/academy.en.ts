/**
 * Контент лендинга BRIDGE Consult Academy, английская версия.
 *
 * Форма объекта — ровно как в academy.ru.ts, компоненты одни и те же.
 *
 * Биография Ларисы и список аккредитаций перенесены ДОСЛОВНО из английской
 * версии основного сайта (public/EN/index.html) — их сверяют, переписывать
 * и сокращать нельзя. Названия модулей и тем взяты из опубликованной
 * английской новости (src/content/news/en-fidic-training-practical-issues.mdx).
 */

export const academyEn = {
	lang: 'en',
	meta: {
		title: 'Advanced Contract Management — online programme, BRIDGE Consult Academy',
		description:
			'18 modules and more than 40 practical cases across the 1999 and 2017 editions. Live online sessions, the recording stays with the participant, Uzbek subtitles.',
	},

	nav: [
		{ label: 'Programme', href: '#programme' },
		{ label: 'Method', href: '#method' },
		{ label: 'Modules', href: '#modules' },
		{ label: 'Who it is for', href: '#audience' },
		{ label: 'Trainer', href: '#trainer' },
	],
	cta: 'Apply',
	langLinks: { ru: '/academy/', en: '/academy/en/', uz: '/academy/uz/' },

	hero: {
		eyebrow: 'Bridge Consult Academy · Online programme · 01',
		titleLines: ['Advanced contract', 'management'],
		titleAccent: 'online',
		lead: 'Not a clause-by-clause walkthrough, but a working through of the situations that turn into claims, delays and disputes on site. The 1999 and 2017 editions, side by side.',
		ctaPrimary: { label: 'Apply', href: '#apply' },
		ctaSecondary: { label: 'See all 18 modules', href: '#modules' },
		credsText:
			'Delivered by <b>Larisa Belousova</b> — FCCE, FCCP, member of the FIDIC Integrity Management Committee',
		imageAlt: 'A mountain highway at sunset — an infrastructure project',
		scrollCue: 'Scroll down',
	},

	stats: {
		items: [
			{ count: 18, value: '18', mark: 'Modules', label: 'from contract administration to arbitration' },
			{ count: 40, value: '40', suffix: '+', mark: 'Cases', label: 'situations that genuinely occur on site' },
			{ value: '1999', suffix: ' / 2017', mark: 'Editions', label: 'two editions side by side — not the text, but the change of logic' },
			{ value: 'RU', suffix: ' + UZ', mark: 'Language', label: 'sessions in Russian, materials and subtitles in Uzbek' },
		],
		trainerNote:
			'Delivered by <b>Larisa Belousova</b> — FCCE, FCCP, member of the FIDIC Integrity Management Committee',
	},

	statement: {
		mark: '02 · Statement',
		lead: 'FIDIC is not studied in order to know the clauses.',
		body: 'It is studied in order to know what to do when something on the project has not gone to plan.',
		note: 'The programme is deliberately not structured as a sequential reading of the conditions of contract. It is built around the situations that turn into claims, delays and disputes.',
	},

	// Ссылки на подпункты стоят только там, где они уже опубликованы на
	// сайте. Для DAAB и арбитража их нет намеренно — подтверждает Лариса.
	contractSystem: {
		mark: '03 · System',
		title: 'A contract is not a text, it is a chain',
		lead: 'Every link depends on the one before it. A missed notice brings down everything that follows, however well founded the claim may be on its merits.',
		steps: [
			{ name: 'Event', note: 'Something on site has not gone to plan' },
			{ name: 'Notice', note: 'The Engineer is notified within the contractual period', ref: '1999 Sub-Cl. 20.1 · 2017 Sub-Cl. 20.1–20.2' },
			{ name: 'Claim', note: 'Extension of time or additional cost' },
			{ name: 'Substantiation', note: 'The records kept as the works proceeded' },
			{ name: "Engineer's Determination", note: 'A decision that has to withstand review', ref: '1999 Sub-Cl. 3.5 · 2017 Sub-Cl. 3.7' },
			{ name: 'DAAB', note: 'Dispute Avoidance and Adjudication Board' },
			{ name: 'Arbitration', note: 'When avoidance has already failed' },
		],
	},

	// ВНИМАНИЕ: содержание раздела подтверждает Лариса. Здесь только те
	// отличия, в которых нет догадок.
	editions: {
		mark: '04 · Editions',
		title: 'Two editions side by side',
		lead: 'The point of the comparison is not that the text was rewritten, but that the logic of managing the contract changed. Sub-clause references are always checked against the Particular Conditions of the specific project.',
		rows: [
			{
				topic: 'Claims',
				old: "The Employer's and the Contractor's claims sit in different places in the contract and follow different procedures.",
				now: 'Claims of both parties are brought into a single clause and follow a symmetrical procedure.',
			},
			{
				topic: 'Notice',
				old: 'Sub-Cl. 20.1: notify the Engineer "as soon as practicable" and no later than 28 days.',
				now: 'Sub-Cl. 20.1–20.2: the same time-bar logic, but the steps of a claim are set out explicitly.',
			},
			{
				topic: 'Engineer',
				old: 'Sub-Cl. 3.5: the Engineer determines, having first consulted with the parties.',
				now: 'Sub-Cl. 3.7: the determination is split into agreement and the decision itself, with a period for each step.',
			},
			{
				topic: 'Dispute board',
				old: 'DAB — a dispute adjudication board: engaged once a dispute has already arisen.',
				now: 'DAAB — avoidance is added to adjudication: the board is engaged on the project throughout.',
			},
		],
	},

	caseWall: {
		mark: '07 · Archive',
		value: '40',
		suffix: '+',
		title: 'Working through the situations that genuinely occur on site',
		lead: 'Every case follows one format: the scenario, the time and cost impact, the applicable sub-clauses, and the mistakes each party typically makes.',
		topics: [
			'Contract administration',
			'Programme management',
			'Time management',
			'Extension of Time',
			'Delay analysis',
			'Variations',
			'Claims',
			'Payments',
			'Cost control',
			"The Engineer's role",
			"Employer's obligations",
			"Contractor's obligations",
			'Site management',
			'Contemporary records',
			'Risk allocation',
			'Dispute avoidance',
			'DAAB',
			'Arbitration',
		],
	},

	finalCta: {
		mark: '11 · Apply',
		lineOne: 'A contract does not end when it is signed.',
		lineTwo: 'It begins when something goes wrong on the project.',
		cta: 'Apply',
		href: '#apply',
		note: 'We will send the 18-module programme and the dates of the next intake. Every enquiry is answered personally.',
	},

	programme: {
		label: 'The programme',
		title: 'What makes this programme different',
		paragraphs: [
			'The programme is deliberately <b>not</b> structured as a clause-by-clause study of the conditions of contract. Its purpose is to work through the real, recurring problems that Employers, Engineers, Contractors and public authorities meet in practice, and to build the ability to recognise and remove those problems <b>before</b> they turn into an extension of time claim, an additional cost claim, a Variation dispute or a formal dispute referred to the DAAB or arbitration.',
			'The programme is based on the FIDIC Conditions of Contract 1999 and 2017, international practice on projects financed by multilateral development banks (World Bank, ADB, AIIB, EBRD), the SCL Delay and Disruption Protocol and established construction claims practice.',
		],
		pullquote:
			'A dispute almost never begins with a dispute. It begins with a notice that was not served in time.',
	},

	method: {
		label: 'Method',
		title: 'One format for every case',
		lead: 'Every practical issue is worked through against the same set of headings. That moves the conversation from "what the contract says" to the management decision — and makes the analysis repeatable: the participant applies the same format to their own project afterwards.',
		rows: [
			{ key: 'Practical issue', value: 'the specific problem' },
			{ key: 'Typical scenario', value: 'what usually happens on site' },
			{ key: 'Time impact', value: 'effect on the programme and completion' },
			{ key: 'Cost impact', value: 'effect on cost and cash flow' },
			{ key: 'Relevant FIDIC provisions', value: 'applicable sub-clauses of the 1999 and 2017 editions' },
			{ key: 'Common mistakes', value: 'set out separately for Employer, Engineer and Contractor' },
			{ key: 'Learning objective', value: 'the competence the participant gains' },
			{ key: 'Worked example', value: 'a scenario for group work' },
		],
	},

	modules: {
		label: 'Contents',
		title: 'Eighteen modules, <i class="text-academy-taupe">four streams</i>',
		groups: [
			{
				roman: 'I',
				title: 'Time and programme',
				note: 'How the contract is run from day one decides whether a party has any entitlement at all.',
				image: 'academy-mod-1',
				imageAlt: 'A Gantt chart and dividers — managing time and the programme of works',
				items: [
					'Contract administration',
					'Programme management',
					'Time management',
					'Extension of Time for Completion',
					'Delay analysis',
				],
			},
			{
				roman: 'II',
				title: 'Money and change',
				note: 'Where a project loses value — and the moment at which it can still be stopped.',
				image: 'academy-mod-2',
				imageAlt: 'Cost curves on glass — managing variations and cost',
				items: ['Variations', 'Claims', 'Payments', 'Cost control'],
			},
			{
				roman: 'III',
				title: 'Roles and the site',
				note: 'Who is obliged to do what under the contract, and what evidences it in the project records.',
				image: 'academy-mod-3',
				imageAlt: 'A drawing and a plumb bob — the roles of the parties and site management',
				items: [
					"The Engineer's role",
					"The Employer's obligations",
					"The Contractor's obligations",
					'Construction site management',
					'Contemporary records',
				],
			},
			{
				roman: 'IV',
				title: 'Risk and disputes',
				note: 'What to do once avoidance has failed — and how not to lose on procedure.',
				image: 'academy-mod-4',
				imageAlt: 'Glass panels and a gavel — risk, dispute avoidance and arbitration',
				items: ['Risk allocation', 'Dispute avoidance', 'DAAB', 'Arbitration'],
			},
		],
	},

	caseStudy: {
		label: 'A worked case',
		title: 'Compliance with time-bars for notices',
		lead: 'One of the key issues in the first module. This is what each of the forty-plus cases in the programme looks like — and how the participant then works through their own situations.',
		docTitle: 'Case 01.3',
		clauses: ['1999 — Sub-Cl. 20.1', '2017 — Sub-Cl. 20.1–20.2'],
		blocks: [
			{
				heading: 'Typical situation',
				text: 'Site staff know of an event affecting time or cost, but the Engineer is not notified within the contractual period — an oral report or a mention at a meeting is assumed to be enough.',
			},
			{
				heading: 'Result',
				text: 'The entitlement to an extension of time (EOT) is put at risk regardless of the merits of the claim, and the dispute shifts from the event itself to the missed deadline.',
			},
			{
				heading: 'Practical conclusion',
				text: 'Keep a live register of notices and distinguish the "as soon as practicable" requirement from the 28-day condition precedent.',
				key: true,
			},
		],
	},

	audience: {
		mark: '06 · Audience',
		title: 'For those who are answerable for the contract, not only reading it',
		lead: 'For the public authorities and public employers of Uzbekistan delivering infrastructure projects, and for project employers, engineers, consultants and project managers.',
		rows: [
			{
				title: 'Employer',
				text: "To understand which of the Employer's obligations create grounds for the Contractor's claims, and to remove them before a claim is made.",
				image: 'academy-mod-3',
			},
			{
				title: 'Engineer',
				text: 'To make determinations under <span class="academy-clause">Sub-Cl. 3.5 / 3.7</span> that will withstand review by a DAAB and in arbitration.',
				image: 'academy-mod-1',
			},
			{
				title: 'Contractor',
				text: 'Not to lose entitlement to time and additional cost through a failure of the notice procedure and an absence of records.',
				image: 'academy-mod-2',
			},
			{
				title: 'Public authority',
				text: 'To see the connection between the programme of works, the records kept on site and the cash flow of the project.',
				image: 'academy-mod-4',
			},
		],
	},

	format: {
		label: 'Format',
		title: 'Live online sessions — the recording stays with the participant',
		lead: 'The programme is delivered as a workshop with cases worked through in groups. Sub-clause references are given in parallel for the 1999 (Red and Yellow Books; the numbering is broadly applicable to the Silver Book as well) and 2017 editions, always to be checked against the Particular Conditions of the specific project — it is those that most often modify the General Conditions.',
		items: [
			{
				title: 'Sessions in Russian',
				text: 'Live, with questions and analysis of the participants’ own situations. Every session is recorded.',
			},
			{
				title: 'Materials in two languages',
				text: 'Slides, handouts and the FIDIC terminology glossary are prepared in Russian and Uzbek.',
			},
			{
				title: 'Uzbek subtitles for the recordings',
				text: 'The translation is reviewed by a contracts specialist rather than a general translator: in FIDIC, precision of terminology is the substance.',
			},
			{
				title: 'A programme built for the organisation',
				text: 'The selection of modules and cases can be assembled around a specific project and the employer’s contract.',
			},
		],
	},

	trainer: {
		label: 'Trainer',
		name: 'Larisa Belousova',
		role: 'Infrastructure contracts · FIDIC · EPC/EPC+F · Procurement · Claims · Dispute Avoidance · International arbitration',
		photoAlt: 'Larisa Belousova',
		photoCaption: 'Larisa Belousova',
		bio: [
			'Larisa Belousova is an international infrastructure contracts, procurement and construction disputes specialist with 27 years of management experience in manufacturing, construction, logistics and procurement, including more than 15 years of specialised experience in FIDIC contract management and IFI-financed infrastructure projects.',
			'Her sector experience covers roads and highways, bridges and tunnels, transport and airport infrastructure, urban and public infrastructure, water supply and wastewater, energy and other major infrastructure projects.',
			'She specialises in FIDIC contract administration, EPC and EPC+F contract structuring, procurement and tender documentation, variation and claims management, delay and quantum analysis, contractual and commercial risk management, dispute avoidance and construction dispute resolution.',
			'Larisa is a FIDIC Certified Consulting Engineer (FCCE) and FIDIC Certified Consulting Professional (FCCP). She has practical experience with the FIDIC Red Book, Yellow Book, Silver Book, MDB Harmonised Editions, Subcontract Book and White Book. She is also an ADB Accredited Contract Management and Dispute Avoidance Specialist.',
			'As Founder and Director of BRIDGE Consult LLC, she advises government authorities, employers, contractors, engineers and consulting firms on the preparation and administration of infrastructure contracts, procurement, claims, contractual and commercial risks, dispute avoidance and preparation for arbitration proceedings across Central Asia.',
		],
		credsTitle: 'Professional accreditations and memberships',
		creds: [
			'Member of the FCCE Certification Committee, FIDIC Credentialing',
			'<a rel="noopener" href="https://fidic.org/node/777" target="_blank">Member of the FIDIC Integrity Management Committee</a>',
			'FCCE — FIDIC Certified Consulting Engineer',
			'FCCP — FIDIC Certified Consulting Professional',
			'ADB Accredited Contract Management and Dispute Avoidance Specialist',
			'MCIArb — Member of the Chartered Institute of Arbitrators',
			'Member of the LCIA European Users&rsquo; Council',
			'ICAA Next Generation Member',
			'Arbitrator, International Commercial Arbitration Court under the Chamber of Commerce and Industry of the Republic of Uzbekistan (ICAC Uzbekistan)',
			'Member of the Austrian Arbitration Association',
			'DRBF Emerging Markets Licensed Professional and Dispute Board Practitioner',
			'Independent Mediator registered with the Ministry of Justice of the Republic of Uzbekistan',
			'Full Member of the Kazakhstan National Association of Professional Engineers and Consultants (KNAPEK)',
			'Board Member of the Uzbekistan Road Association',
			'Member of the Project Management Institute (PMI)',
			'PCQI — Practitioner of the Chartered Quality Institute (CQI), UK',
			'ICAgile Certified Professional (ICP)',
		],
		moreLabel: 'Read more',
		lessLabel: 'Show less',
		cvLabel: 'Download CV (PDF)',
	},

	apply: {
		label: 'Apply',
		title: 'We will send the programme and the dates of the next intake',
		lead: 'Tell us who the training is for and which contractual situations you would like to work through. Every enquiry is answered personally.',
		list: [
			'The full 18-module programme as a PDF',
			'Dates and schedule of the next intake',
			'Terms for a group from a single organisation',
			'Invoice and contract for payment by bank transfer',
		],
		mailNote: 'Or write to us directly:',
		source: 'Advanced Contract Management (BRIDGE Consult Academy)',
		submit: 'Send enquiry',
		states: {
			sending: 'Sending...',
			sendingNote: 'Sending your enquiry.',
			sent: 'Enquiry sent',
			successNote: 'Thank you. Your enquiry has been sent — we will be in touch.',
			errorNote:
				'Automatic sending failed — an email to {email} will open, please send it. Or write to us on Telegram.',
			subject: 'Enquiry — Advanced Contract Management online',
			sentFrom: 'Sent from',
		},
		fields: {
			name: { label: 'Name and surname', placeholder: 'For example: Akmal Rakhimov' },
			role: { label: 'Position / organisation', placeholder: 'Contract manager, organisation' },
			contact: { label: 'Contact for a reply', placeholder: 'Phone, Telegram or email' },
			programme: {
				label: 'Format of participation',
				options: [
					'Full programme, 18 modules',
					'Selected modules',
					'Corporate programme for an organisation',
					'Not decided yet — we need advice',
				],
			},
			participants: {
				label: 'Number of participants',
				options: ['1 participant', '2–5 participants', '6–15 participants', 'More than 15 participants'],
			},
			language: {
				label: 'Language of instruction',
				options: ['Russian', 'Russian + Uzbek subtitles and materials', 'Predominantly Uzbek'],
			},
			cases: {
				label: 'Cases to work through',
				placeholder:
					'Are there situations, claims, delays or contractual questions you would like to work through on the programme?',
			},
			message: { label: 'Comment', placeholder: 'Anything to clarify: dates, invoice, terms of participation' },
		},
	},

	footer: {
		description:
			'Advanced Contract Management — a practical programme on contract management, claims, delay analysis and dispute resolution for employers, engineers, consultants and contractors in Uzbekistan.',
		navTitle: 'Navigation',
		nav: [
			{ label: 'Main site', href: 'https://www.bridgeconsult.uz/EN/' },
			{ label: 'Projects', href: 'https://www.bridgeconsult.uz/EN/projects.html' },
			{ label: 'News', href: 'https://www.bridgeconsult.uz/news/en/' },
			{ label: 'Training', href: 'https://www.bridgeconsult.uz/EN/#trainings' },
			{ label: 'Media and publications', href: 'https://www.bridgeconsult.uz/EN/#media' },
		],
		contactsTitle: 'Contact details',
		address:
			'100180, Republic of Uzbekistan,<br>Tashkent, Yunusabad district,<br>Ahmad Donish street, 12th quarter, 20A',
		rights: 'All rights reserved.',
		disclaimer:
			'All copyright in the FIDIC standard forms of contract, official publications, logos and other intellectual property belongs to the Fédération Internationale des Ingénieurs-Conseils (FIDIC) and/or the respective rights holders. Contract provisions are cited as references to the relevant sub-clauses and short extracts necessary for the purposes of study. The programme, cases, working forms and methodological materials are the intellectual property of BRIDGE Consult LLC. BRIDGE Consult delivers its own training programme and does not act on behalf of FIDIC.',
	},
} as const;
