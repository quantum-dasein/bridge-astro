/**
 * Контент лендинга «Полное договорное сопровождение», английская версия.
 *
 * ВАЖНО: это перевод коммерческого предложения Ларисы
 * («КП_BRIDGE_Consult_подрядчикам_RU_расширенное_3.docx»), а не отдельный
 * документ. Русская версия — источник; при расхождении верна она. Перед
 * отправкой англоязычному подрядчику текст должна вычитать Лариса:
 * это коммерческое предложение с описанием границ ответственности.
 *
 * Биография и аккредитации взяты дословно из английской версии основного
 * сайта, кроме первого абзаца: он из самого предложения (там «более 30 лет»).
 */

export const offerEn = {
	lang: 'en',
	meta: {
		title: 'Full contract administration for projects — BRIDGE Consult for contractors',
		description:
			'Document control, financial administration of the contract and legal protection of the Contractor on infrastructure projects under FIDIC and output- and performance-based contracts.',
	},

	nav: [
		{ label: 'Directions', href: '#pillars' },
		{ label: 'What is included', href: '#scope' },
		{ label: 'How we work', href: '#process' },
		{ label: 'Formats', href: '#formats' },
		{ label: 'Team', href: '#team' },
	],
	cta: 'Discuss a project',
	langLinks: { ru: '/contract-support/', en: '/contract-support/en/', uz: '/contract-support/uz/' },

	hero: {
		eyebrow: 'For contractors · Commercial proposal',
		titleLines: ['Full contract', 'administration'],
		titleAccent: 'for projects',
		lead: 'Running the entire project document control, financial administration of the contract and legal protection of the Contractor on FIDIC projects and output- and performance-based contracts.',
		ctaPrimary: { label: 'Discuss a project', href: '#apply' },
		ctaSecondary: { label: 'What is included', href: '#scope' },
		credsText:
			'Led by <b>Larisa Belousova</b> — FCCE, FCCP, ADB Accredited Contract Management Specialist',
		image: 'academy-atmosphere',
		imageAlt: 'An infrastructure site — a major construction project',
		scrollCue: 'Scroll down',
	},

	stats: {
		items: [
			{ value: '3', mark: 'Directions', label: 'document control, project finance, legal protection' },
			{ value: '30', suffix: '+', mark: 'Positions', label: 'areas of work across the three parts of the proposal' },
			{ value: '4', mark: 'Formats', label: 'from setting up the system to a portfolio of several projects' },
			{ value: 'FIDIC', suffix: ' + OPBC', mark: 'Contracts', label: 'and output- and performance-based contracts' },
		],
		trainerNote:
			'Sector coverage: roads and railways, bridges and tunnels, airports, water supply and wastewater, irrigation and hydraulic structures, energy, and civil, industrial and social construction facilities.',
	},

	pillars: {
		id: 'pillars',
		mark: '01 · Directions',
		title: 'Three directions of work',
		lead: 'Documents, money and law are handled by one team: the claim, its calculation, the evidence and the legal position are prepared together and do not contradict one another.',
		items: [
			{
				roman: 'I',
				title: 'Document control and contractual procedures',
				text: 'Document forms and their approval with the Engineer; official correspondence and notices; submittals for approval; the Programme and reporting; quality and as-built documentation; measurement; taking-over and project close-out.',
				image: 'academy-mod-1',
				imageAlt: 'A drawing and dividers — project document control',
			},
			{
				roman: 'II',
				title: 'Project finance',
				text: 'Advance payment and bank guarantees; cash-flow forecast; interim payments (IPC) and control of payment periods; retention; price adjustment; currency and taxes; final statement.',
				image: 'academy-mod-2',
				imageAlt: 'Cost curves — financial administration of the contract',
			},
			{
				roman: 'III',
				title: 'Law and protection of interests',
				text: 'Legal analysis of the contract and a risk map; contracts with counterparties; variations and additional works; claims, EOT and Cost; compliance with the requirements of financing institutions; dispute avoidance, DAAB and arbitration.',
				image: 'academy-mod-4',
				imageAlt: 'A gavel and glass panels — legal protection and dispute resolution',
			},
		],
	},

	statement: {
		mark: '02 · Statement',
		lead: 'Flawless documents. Managed risk.',
		body: 'A protected result.',
		note: 'The price of the service is comparable to the price of a single mistake. One missed notice, one unrecorded Variation or one month of delayed payment costs more than administering the project.',
	},

	problems: {
		mark: '03 · Problems',
		title: 'The problems we solve',
		lead: 'Each of them begins not with a dispute, but with a document that was not served in time or not substantiated.',
		items: [
			'Unapproved forms and documents returned again and again',
			'Missed contractual periods for serving Notices and loss of contractual entitlement',
			'Unverified quantities and delayed Interim Payment Certificates (IPC)',
			'Cash gaps caused by late certification and payment',
			'Expired bank guarantees and unreleased retention',
			'Price adjustment not applied when resource costs rise',
			'Additional works carried out without being recorded',
			'Gaps in quality and as-built documentation',
			'No evidence base for delays, Variations and Claims',
		],
	},

	outcome: {
		mark: '04 · Outcome',
		title: 'The result for the Contractor',
		lead: 'The BRIDGE Consult solution is a single documentation office for the project: the whole cycle of project document control, the financial part of the contract and legal protection in one pair of hands.',
		rows: [
			{
				name: 'The money arrives on time',
				text: 'Interim payment applications are submitted on the contractual dates with a complete set of substantiation; certification and payment periods are under control, and the Employer’s delay is recorded with interest claimed.',
			},
			{
				name: 'Quantities are not lost',
				text: 'Every executed quantity is confirmed by measurement, records and quality documents at the time of execution, rather than reconstructed after the fact.',
			},
			{
				name: 'Additional works get paid',
				text: 'Instructions and events are recorded immediately, the Variation is issued before the work starts, and cost and time are agreed rather than left in dispute.',
			},
			{
				name: 'Contractual rights do not lapse',
				text: 'Notices are served within the periods set by the contract; claims for extension of time (EOT) and for cost rest on evidence, not on recollection.',
			},
			{
				name: 'Guarantees and retention under control',
				text: 'No bank guarantee expires unnoticed and no retention money is left stranded with the Employer after taking-over.',
			},
			{
				name: 'Fewer rejections and reworks',
				text: 'Forms are agreed with the Engineer once at the outset and serve the whole project; correspondence follows a single standard.',
			},
		],
	},

	scope: {
		id: 'scope',
		mark: '05 · Scope',
		title: 'What full administration covers',
		lead: 'The day-to-day work that would otherwise have to be kept in-house.',
		items: [
			'Receipt, registration and distribution of all incoming correspondence and control of its handling',
			'Preparation of outgoing letters, notices, requests, replies, submittals for approval, minutes and annexes',
			'Development, systematisation and approval with the Engineer of all forms of project, contractual, technical, as-built and payment documents',
			'Maintaining single registers of documents, approvals, instructions, variations, deadlines, payments, quality observations (NCR) and Claims',
			'Control of the contractual periods for serving notices, submittals and replies',
			'Building an electronic archive with clear coding and statuses that makes it possible to assemble evidence on any issue quickly',
			'Coordinating document preparation by designers, production units, the laboratory, quantity surveyors (QS), planners, subcontractors and suppliers',
			'Maintaining registers of bank guarantees, advances, retention, contracts with counterparties and open claims',
			'Control of contractual and payment periods, including certification, payment and the validity of securities',
			'Legal review of outgoing documents before they are signed by the Contractor’s authorised representative',
		],
	},

	tables: [
		{
			id: 'documents',
			mark: '06 · Documents',
			title: 'Document control and contractual procedures',
			rows: [
				{
					name: 'Document control management',
					text: 'Document Control Procedure; coding; registers; transmittals; statuses; deadline control; electronic archive; weekly summary for management.',
				},
				{
					name: 'Document forms',
					text: 'Full development, systematisation and approval with the Engineer of all forms of project, contractual, technical, as-built and payment documents: letters, notices, transmittals, submittals, MIR/WIR/RFI, ITP, Method Statements, checklists, records, laboratory forms, progress reports, measurement, IPC, Variations, Claims and the corresponding registers; revision in response to the Engineer’s comments and roll-out of the approved forms.',
				},
				{
					name: 'Contractual correspondence',
					text: 'All official correspondence with the Engineer and the Employer: notices, requests, replies, proposals, minutes, follow-up and control over the implementation of decisions taken.',
				},
				{
					name: 'Project contracts',
					text: 'Subcontracts, supply, lease and service agreements; flow-down of the main contract obligations to subcontractors; risk allocation; cost optimisation; securities, payments and liability; approval with the Engineer.',
				},
				{
					name: 'Submittals to the Engineer',
					text: 'Materials, sources (quarries and suppliers), methods of execution, personnel, plant, drawings, design solutions, samples and other documents; handling comments and controlling re-submissions.',
				},
				{
					name: 'Programme and progress',
					text: 'Baseline Programme, updates, recovery programme, look-ahead plans, WBS, logic links, resources, critical path, float, reporting and documenting of delays.',
				},
				{
					name: 'Quality and as-built documentation',
					text: 'ITP, Method Statements, MIR/WIR/RFI, laboratory reports, records, as-built drawings, NCR/CAR, checklists and final dossiers.',
				},
				{
					name: 'Measurement and payments',
					text: 'The IPC package: measurement, confirmed quantities, records, quality documents, approvals, variations, retention and the register of amounts claimed and paid.',
				},
				{
					name: 'Variations and additional works',
					text: 'Recording instructions and events; commercial quotations; build-up rates for new items; confirmation of resources and cost; Variation register; agreement of cost and time.',
				},
				{
					name: 'Notices, EOT and Claims',
					text: 'Timely (early) notices; contemporary records; analysis of cause and effect; substantiation of entitlement; evidence; extension of time (EOT); Cost; detailed Claims and support through the Determination procedure.',
				},
				{
					name: 'Taking-over and close-out',
					text: 'As-built dossier, tests, punch list, Taking-Over, outstanding works, the Defects Notification Period (DNP), the Final Statement and systematisation of the complete archive set.',
				},
			],
		},
		{
			id: 'finance',
			mark: '07 · Finance',
			title: 'Project financing and the Contractor’s cash flow',
			dark: true,
			note: 'Sub-clause numbering follows the standard FIDIC conditions; each project applies the Particular Conditions of its own contract, and the work is carried out under those.',
			rows: [
				{
					name: 'Advance Payment',
					text: 'Checking the advance payment terms in the Appendix to Tender; preparing the advance payment application and the advance payment guarantee in the contract form; controlling the validity and timely extension of the guarantee; verifying the correctness of deductions against the advance in each IPC; closing the advance and returning the guarantee.',
				},
				{
					name: 'Cash-flow planning',
					text: 'Preparing and updating the Cash-flow Forecast on the basis of the Programme and the bill of quantities; submission and agreement with the Engineer under Sub-Cl. 14.4; aligning the schedule of receipts with the works programme, supplies, mobilisation and obligations to subcontractors.',
				},
				{
					name: 'Interim payments (IPC)',
					text: 'Timely preparation of the complete Statement / IPA package; support through the Engineer’s issue of the IPC and handling of comments; control of the contractual certification and payment periods (Sub-Cl. 14.6–14.7); a single register of amounts claimed, certified, paid and disputed.',
				},
				{
					name: 'Retention',
					text: 'Control of the retention amount and of reaching the limit; preparing documents for the release of the first half on issue of the Taking-Over Certificate and of the second half on completion of the Defects Notification Period (Sub-Cl. 14.9); replacing retention with a bank guarantee where the contract allows.',
				},
				{
					name: 'Guarantees and securities',
					text: 'Performance Security, advance payment guarantee, guarantee for the Defects Notification Period, parent company guarantees: control of forms, amounts, validity, extensions, stepped reduction and timely return; preventing an unjustified call on a security.',
				},
				{
					name: 'Price adjustment and cost increases',
					text: 'Calculations under the price adjustment formula (Sub-Cl. 13.8): indices, weightings, base dates, sources of quotations; claims arising from changes in legislation and taxes (Sub-Cl. 13.7); documentary evidence of increases in the cost of materials, fuel and labour.',
				},
				{
					name: 'Currency, taxes and banking',
					text: 'Control of the currencies of payment and the exchange rates set by the contract; allocation of amounts between local and foreign currency; VAT, withholding tax, customs payments and exemptions on projects financed by international financial institutions; the supporting document set for the servicing bank.',
				},
				{
					name: 'Late payment by the Employer',
					text: 'Preparing notices of non-payment; calculating interest on delayed payment (Sub-Cl. 14.8); where necessary, the procedure for suspension of work or reduction of rate of progress (Sub-Cl. 16.1) in strict compliance with form and time limits; preserving entitlement to cost and to extension of time.',
				},
				{
					name: 'Financing of subcontracts and supplies',
					text: 'Aligning payments to subcontractors and suppliers with receipts under the IPC; control of securities, advances and retention under subcontracts; preventing a gap between the Contractor’s obligations and the actual financing of the project.',
				},
				{
					name: 'Final statement and close-out',
					text: 'Final Statement and Discharge (Sub-Cl. 14.11–14.12); closing the advance, retention and guarantees; reconciliation of all charges, deductions, penalties and liquidated damages; substantiation of unsettled amounts and their transfer into the claims procedure.',
				},
			],
		},
		{
			id: 'legal',
			mark: '08 · Legal',
			title: 'Legal support of the contract',
			rows: [
				{
					name: 'Contract analysis and risk map',
					text: 'Legal review of the General and Particular Conditions, appendices, specifications and bill of quantities; a map of the Contractor’s obligations and risks; a list of departures in the Particular Conditions from the FIDIC standard that worsen the Contractor’s position; a note on the time limits whose breach extinguishes entitlement.',
				},
				{
					name: 'Contractual strategy',
					text: 'Developing the Contractor’s position on contentious issues; choosing the proper procedure (notice, Variation, Claim, the Engineer’s Determination); legal reasoning of letters and submissions; avoiding waiver of rights and unfavourable admissions of fact in correspondence.',
				},
				{
					name: 'Contracts with counterparties',
					text: 'Legal review and preparation of subcontracts, supply, lease and service agreements, and of joint venture / consortium agreements; flow-down of the main contract obligations; securities, liability, force majeure, governing law and the dispute resolution procedure.',
				},
				{
					name: 'Compliance with the law of the Republic of Uzbekistan',
					text: 'Reconciling FIDIC conditions with the civil and urban development legislation of the Republic of Uzbekistan; permits, licences and approvals; labour and migration matters for foreign personnel; currency regulation and settlement requirements.',
				},
				{
					name: 'Requirements of financing institutions and compliance',
					text: 'Compliance with the rules of the Employer and the bank: procurement procedures, conflict of interest, anti-corruption and sanctions requirements, occupational safety, environmental and social obligations, reporting to the financing institution.',
				},
				{
					name: 'Claims work',
					text: 'Legal substantiation of Claims: the basis of entitlement, causation, evidence, calculation of amount and time; responses to the Employer’s counter-claims (liquidated damages, penalties, deductions); preparing the position for the Engineer’s Determination.',
				},
				{
					name: 'Dispute avoidance and pre-action settlement',
					text: 'Negotiations, records of disagreement, settlement agreements; support of a referral to a dispute board (DAB / DAAB): preparing the Referral, responses and annexes; support of the amicable settlement procedure.',
				},
				{
					name: 'Arbitration and court',
					text: 'Building the evidence base and the chronology of events; preparing procedural documents; coordination with external counsel and technical experts; support of international arbitration and of recognition and enforcement of awards.',
				},
				{
					name: 'Suspension and termination',
					text: 'Legal assessment of the grounds under Clauses 15 and 16 of the contract; preparing notices in compliance with form and time limits; recording executed quantities, cost, materials and equipment as at the date of termination; protection against wrongful termination and against a call on a security.',
				},
			],
		},
	],

	process: {
		id: 'process',
		mark: '09 · Process',
		title: 'How the work is organised',
		lead: 'Five stages: from checking the current state to a regular summary for management.',
		rows: [
			{
				name: 'Diagnosis',
				text: 'We check the main contract and the particular conditions, the team structure, the Programme, the registers, quality, the IPC and payment status, the advance, bank guarantees and retention, contracts with counterparties, open variations, claims and disputes, and the volume of accumulated documents.',
			},
			{
				name: 'Mobilisation',
				text: 'We develop the Document Control Procedure, the Contract Administration Plan, the responsibility matrix, the calendar of contractual, payment and guarantee deadlines, the register of contracts and the complete set of forms; and we run the process of their review, revision and approval with the Engineer.',
			},
			{
				name: 'Integration with the team',
				text: 'We define who provides the input data, who checks the technical and financial part, who gives the legal assessment, who approves and signs the document and who owns the deadline; we set up the interface with the Contractor’s production, finance and legal functions.',
			},
			{
				name: 'Day-to-day running',
				text: 'We prepare, register, issue and track documents; we assemble IPC packages and control payment; we run variations, notices and claims; we control replies, comments, re-submissions and closure of issues.',
			},
			{
				name: 'Reporting for management',
				text: 'We provide a regular summary: critical deadlines, overdue approvals, the state of cash flow, unpaid quantities and overdue payments, the status of guarantees and retention, variations, NCRs, claims, legal risks and the decisions required.',
			},
		],
	},

	formats: {
		id: 'formats',
		mark: '10 · Formats',
		title: 'Formats of cooperation',
		lead: 'From a one-off set-up of the system to an external project office for a portfolio of contracts.',
		items: [
			{
				roman: 'I',
				title: 'Setting up the system',
				image: 'academy-mod-1',
				imageAlt: 'A drawing and dividers — setting up the administration system',
				text: 'A one-off diagnosis and launch of the administration system: legal audit of the contract and a map of contractual risks, procedures, registers, the complete set of forms and their approval with the Engineer, the calendar of contractual, payment and guarantee deadlines, the responsibility matrix and training of the project team.',
			},
			{
				roman: 'II',
				title: 'Full running of one project',
				image: 'academy-mod-3',
				imageAlt: 'A plumb bob and a drawing — running one project',
				text: 'BRIDGE Consult takes on the day-to-day running of the entire document control of one project, the financial administration of the contract and legal support with an agreed team of specialists, including presence on site.',
			},
			{
				roman: 'III',
				title: 'A portfolio of several projects',
				image: 'academy-mod-2',
				imageAlt: 'Cost curves — a portfolio of projects',
				text: 'A single external project office for several of the Contractor’s contracts: unified procedures and registers, centralised control of deadlines, payments, guarantees and claims work, with separate work streams for each project.',
			},
			{
				roman: 'IV',
				title: 'A single task',
				image: 'academy-mod-4',
				imageAlt: 'A gavel and glass — a single task',
				text: 'Targeted engagement for a specific task: review of the contract before signature, preparation of a single Claim or a package of variations, reconstruction of documentation for a problem section, preparation of the position for the Engineer’s Determination or for a dispute board.',
			},
		],
	},

	pricing: {
		mark: '11 · Pricing',
		title: 'The price is set individually',
		lead: 'No specific amounts are fixed at this stage. Terms are set following an express diagnosis and depend on the number of projects, their value and stage; the volume of current and overdue documents; the number of contracts with counterparties; the presence of open variations, claims, disputes and overdue payments; the currency and payment terms of the contract; the number of lots and sections; the working languages; the need for presence on site and the composition of the team.',
		models: [
			'A fixed monthly fee for administering a project or a portfolio',
			'A one-off fee for setting up the system or for a single task',
			'A separate estimate for claims work and dispute support',
		],
		modelsNote: 'The models are combined.',
		note: 'Once brief information about the portfolio has been received, BRIDGE Consult will propose the optimal team structure, the allocation of functions, a mobilisation plan, the applicable payment model and a price calculation — separately for each project or for the whole portfolio.',
	},

	team: {
		id: 'team',
		mark: '12 · Team',
		title: 'Composition of the team',
		lead: 'Depending on the number of projects and the volume of work, the following specialists may be engaged:',
		items: [
			'Head of administration / lead Contract Manager',
			'Contracts and contractual work specialist',
			'Planner / Programme and delay analysis specialist',
			'Quality and as-built documentation specialist',
			'Document controller',
			'Quantity surveyor / measurement and payments specialist',
			'Two lawyers in international construction contracts and dispute resolution — holding LL.M. and PhD degrees in law',
			'Contract financial administration and cash-flow specialist',
			'Specialist technical, financial and legal experts on particular issues',
		],
	},

	boundaries: {
		mark: '13 · Boundaries',
		title: 'Boundaries of responsibility',
		principle:
			'BRIDGE Consult prepares documents, runs contractual and payment procedures and forms legal positions. The Contractor takes the decisions: all official documents are issued after approval and signature by an authorised representative on its behalf.',
		colA: 'BRIDGE Consult’s area of responsibility',
		colB: 'The Contractor’s area of responsibility',
		rows: [
			{
				a: 'Preparation, registration and maintenance of all project documents and registers; development of forms and their approval with the Engineer.',
				b: 'Execution of the works, technical and design solutions, the technologies applied and the organisation of construction.',
			},
			{
				a: 'Running contractual and payment procedures, control of contractual deadlines, preparation and support of the IPC.',
				b: 'Primary measurement, laboratory testing, quality control on site, occupational safety and industrial safety.',
			},
			{
				a: 'Legal analysis of the contract, contractual strategy, preparation and review of contracts with counterparties.',
				b: 'Completeness and accuracy of input data, primary documents, quantity calculations and supporting materials.',
			},
			{
				a: 'Substantiation of claims (Variation, EOT, Cost), building the evidence base and the legal positions.',
				b: 'Timely provision of documents and information within the agreed periods and in the agreed format.',
			},
			{
				a: 'Calculations for payments, retention, guarantees and price adjustment; control of certification and payment periods.',
				b: 'Accounting and tax records, disposal of funds, execution of payments and tax reporting.',
			},
			{
				a: 'Support of the Determination procedure, the dispute board (DAAB), mediation and arbitration.',
				b: 'Approval and signature of all outgoing documents; taking management and commercial decisions.',
			},
		],
		notes: [
			'Legal opinions, positions and calculations are formed on the basis of the documents and information provided by the Contractor. The Contractor is responsible for their completeness and accuracy.',
			'We are responsible for compliance with contractual procedures and for the quality of the documents and evidence prepared, but we do not guarantee the outcome of a claim: the decisions are taken by the Engineer, the Employer, the dispute board or arbitration.',
			'Financial administration of the contract does not include disposal of the Contractor’s funds, does not include accounting or tax records and does not replace an audit.',
			'Representation before the courts is carried out by advocates in the manner established by law. Where necessary we engage advocates and coordinate their work within the legal position developed.',
			'A conflict of interest check is carried out before work begins. BRIDGE Consult does not support a Contractor on a project where it acts as the Engineer, as a member of the dispute board or as the Employer’s consultant. Information received is confidential and used solely for the purposes of the project.',
		],
	},

	why: {
		mark: '14 · Why',
		title: 'Why BRIDGE Consult',
		rows: [
			{
				name: 'A ready team instead of recruitment',
				text: 'A contract manager, planner, quantity surveyor, quality specialist, document controller and lawyer join the project as an agreed team within weeks. Assembling such a team in-house in the Central Asian market takes months, and keeping it between projects is expensive.',
			},
			{
				name: 'Documents, money and law in one pair of hands',
				text: 'There is no need to hire a law firm, a planner and a quantity surveyor separately and then reconcile their work: the claim, its calculation, the evidence base and the legal position are prepared by one team and do not contradict one another.',
			},
			{
				name: 'We work on the Contractor’s side',
				text: 'We know how the Engineer reads a document and what the Employer checks, and we prepare materials so that they go through first time rather than come back for revision.',
			},
			{
				name: 'Competence recognised by those who finance the project',
				text: 'FIDIC qualifications (FCCE, FCCP), accreditation by the Asian Development Bank and experience on ADB, AIIB, World Bank and EBRD projects mean that our documents are built to a standard the Engineer and the financing institution accept without further explanation.',
			},
			{
				name: 'International standard and local practice at once',
				text: 'FIDIC contracts are applied in the environment of Uzbek legislation, permitting procedures and construction practice. We work at the junction of the two systems, not inside one of them.',
			},
			{
				name: 'The price of the service is comparable to the price of one mistake',
				text: 'One missed notice, one unrecorded Variation or one month of delayed payment costs more than administering the project.',
			},
			{
				name: 'Independence and confidentiality',
				text: 'We do not support both sides of the same project and we do not use the information received outside it.',
			},
		],
	},

	founder: {
		id: 'founder',
		label: 'The founder',
		name: 'Larisa Belousova',
		role: 'Infrastructure contracts · FIDIC · EPC/EPC+F · Procurement · Claims · Dispute Avoidance · International arbitration',
		photoAlt: 'Larisa Belousova',
		bio: [
			'An expert in infrastructure contracts, procurement, construction claims and dispute resolution. More than 30 years of management experience in manufacturing and construction, logistics and procurement, including more than 15 years of specialised experience in FIDIC contract management and infrastructure projects financed by international financial institutions.',
			'Her sector experience covers roads and highways, bridges and tunnels, transport and airport infrastructure, urban and public infrastructure, water supply and wastewater, energy and other major infrastructure projects.',
			'She specialises in FIDIC contract administration, EPC and EPC+F contract structuring, procurement and tender documentation, variation and claims management, delay and quantum analysis, contractual and commercial risk management, dispute avoidance and construction dispute resolution. She has practical experience with the FIDIC Red Book, Yellow Book, Silver Book, MDB Harmonised Editions, Subcontract Book and White Book.',
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
		cvLabel: 'Download CV (PDF)',
		moreLabel: 'Read more',
		lessLabel: 'Show less',
	},

	finalCta: {
		mark: '15 · Next step',
		lineOne: 'A dispute almost never begins with a dispute.',
		lineTwo: 'It begins with a document that was not served in time.',
		cta: 'Discuss a project',
		href: '#apply',
		note: 'We propose a working meeting and an express diagnosis across the project portfolio.',
	},

	apply: {
		id: 'apply',
		label: 'Next step',
		title: 'Express diagnosis across the project portfolio',
		lead: 'For a preliminary assessment it is enough to provide the list of projects, the main contracts with their particular conditions, the current Programme, the latest IPCs and their payment status, details of bank guarantees and retention, contracts with key subcontractors, and a short list of problems in document control, quality, approvals, deadlines, payments, variations and open claims.',
		listTitle: 'Following the diagnosis BRIDGE Consult will prepare',
		list: [
			'The proposed scope of services across the three directions — document control, project finance and legal protection',
			'The scheme for running the entire document control',
			'The composition of the team and the allocation of functions between BRIDGE Consult and the Contractor',
			'A mobilisation plan',
			'The payment model and a price calculation, separately for each project or for the whole portfolio',
		],
		mailNote: 'Or write to us directly:',
		source: 'Contract administration — for contractors (EN)',
		submit: 'Send request',
		signature: {
			name: 'Larisa K. Belousova',
			role: 'Founder and Director, BRIDGE Consult LLC',
		},
		states: {
			sending: 'Sending...',
			sendingNote: 'Sending your request.',
			sent: 'Request sent',
			successNote: 'Thank you. Your request has been sent — we will be in touch.',
			errorNote:
				'Automatic sending failed — an email to {email} will open, please send it. Or write to us on Telegram.',
			subject: 'Request — contract administration for a project',
			sentFrom: 'Sent from',
		},
		fields: {
			name: { label: 'Name and surname', placeholder: 'For example: Akmal Rakhimov' },
			role: { label: 'Position / organisation', placeholder: 'Contract manager, organisation' },
			contact: { label: 'Contact for a reply', placeholder: 'Phone, Telegram or email' },
			format: {
				label: 'Format of cooperation',
				options: [
					'Setting up the system',
					'Full running of one project',
					'A portfolio of several projects',
					'A single task',
					'Not decided yet — we need advice',
				],
			},
			projects: {
				label: 'Projects in progress',
				options: ['1 project', '2–3 projects', '4–6 projects', 'More than 6 projects'],
			},
			stage: {
				label: 'Stage',
				options: [
					'Tender / before contract signature',
					'Start of works, mobilisation',
					'Main construction stage',
					'Completion and taking-over',
					'Open claims or a dispute',
				],
			},
			message: {
				label: 'What is the concern right now',
				placeholder:
					'Overdue payments, unrecorded variations, the Engineer’s comments, open claims, guarantees, document control',
			},
		},
	},

	footer: {
		description:
			'Full contract administration for infrastructure and construction projects: document control, financial administration of the contract and legal protection of the Contractor’s interests.',
		navTitle: 'Navigation',
		nav: [
			{ label: 'Main site', href: 'https://www.bridgeconsult.uz/EN/' },
			{ label: 'Projects', href: 'https://www.bridgeconsult.uz/EN/projects.html' },
			{ label: 'News', href: 'https://www.bridgeconsult.uz/news/en/' },
			{ label: 'Training', href: 'https://www.bridgeconsult.uz/EN/#trainings' },
			{ label: 'BRIDGE Consult Academy', href: '/academy/en/' },
		],
		contactsTitle: 'Contact details',
		address:
			'100180, Republic of Uzbekistan,<br>Tashkent, Yunusabad district,<br>Ahmad Donish street, 12th quarter, 20A',
		rights: 'All rights reserved.',
		disclaimer:
			'All copyright in the FIDIC standard forms of contract, official publications, logos and other intellectual property belongs to the Fédération Internationale des Ingénieurs-Conseils (FIDIC) and/or the respective rights holders. Sub-clause numbering on this page follows the standard FIDIC conditions; each project applies the Particular Conditions of its own contract. BRIDGE Consult provides its own consulting services and does not act on behalf of FIDIC.',
	},
} as const;
