#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rebuild the FIDIC.uz section in RU/EN/UZ landing pages.

The section is designed as a premium professional portal hero: a strong message,
compact entry modules, a substantial live product mockup, typed search, AI answer
preview, source chips, related materials, and hover linkage between the left
modules and right-side product panels.
"""
import html
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")


LANGS = {
    "public/index.html": {
        "home": "https://fidic.uz/",
        "eyebrow": "Наша экосистема",
        "h_accent": "FIDIC.uz",
        "h_rest": " — единая точка входа в FIDIC, EPC, Claims и DAAB",
        "p": "Профессиональный портал Bridge Consult: практические материалы, глоссарий, подготовка к сертификации, FIDIC AI и прямой маршрут к экспертной консультации.",
        "cta": "Открыть FIDIC.uz",
        "typed": [
            "Search FIDIC, EPC, Claims, DAAB...",
            "Delay claim по Yellow Book",
            "продление сроков (EOT)",
            "роль DAAB в споре",
        ],
        "query": "Delay claim по Yellow Book",
        "ask": "Задать вопрос FIDIC AI",
        "answer_title": "AI-ответ с опорой на источники",
        "answer": [
            "Проверить notice to the Engineer и срок 28 дней по Sub-Clause 20.1.",
            "Связать событие задержки с критическим путём и обновлённой программой.",
            "Подготовить доказательства EOT, costs и позицию для Engineer/DAAB.",
        ],
        "sources": ["Article", "Glossary", "Expert note"],
        "related": "Popular insights",
        "rels": [
            "Sub-Clause 20.1: процедура претензий",
            "Concurrent delay: подходы и практика",
            "DAAB: когда подключать совет",
        ],
        "consult": "Запросить экспертную консультацию",
        "portal_entries": "Входы в портал",
        "coverage": "Охват",
        "modules": [
            ("knowledge", "База знаний", "Статьи, кейсы и практические разборы", "knowledge"),
            ("glossary", "Глоссарий", "Термины FIDIC, EPC, Claims и DAAB", "glossary"),
            ("certification", "Подготовка к сертификации", "Тесты, темы и экзаменационные треки", "certification"),
            ("ai", "FIDIC AI", "Экспертный ответ с source links", ""),
        ],
    },
    "public/EN/index.html": {
        "home": "https://fidic.uz/en/",
        "eyebrow": "Our ecosystem",
        "h_accent": "FIDIC.uz",
        "h_rest": " — a single entry point to FIDIC, EPC, Claims and DAAB",
        "p": "A Bridge Consult professional portal: practical materials, glossary, certification prep, FIDIC AI and a direct path to expert consultation.",
        "cta": "Open FIDIC.uz",
        "typed": [
            "Search FIDIC, EPC, Claims, DAAB...",
            "Delay claim under Yellow Book",
            "extension of time (EOT)",
            "the role of DAAB",
        ],
        "query": "Delay claim under Yellow Book",
        "ask": "Ask FIDIC AI",
        "answer_title": "AI answer grounded in sources",
        "answer": [
            "Check notice to the Engineer and the 28-day period under Sub-Clause 20.1.",
            "Link the delay event to the critical path and updated programme.",
            "Prepare EOT, cost evidence and the position for Engineer/DAAB review.",
        ],
        "sources": ["Article", "Glossary", "Expert note"],
        "related": "Popular insights",
        "rels": [
            "Sub-Clause 20.1: claims procedure",
            "Concurrent delay: approaches and practice",
            "DAAB: when to involve the board",
        ],
        "consult": "Request expert consultation",
        "portal_entries": "Portal entries",
        "coverage": "Coverage",
        "modules": [
            ("knowledge", "Knowledge base", "Articles, cases and practical explainers", "knowledge"),
            ("glossary", "Glossary", "FIDIC, EPC, Claims and DAAB terms", "glossary"),
            ("certification", "Certification prep", "Tests, topics and exam tracks", "certification"),
            ("ai", "FIDIC AI", "Expert answer with source links", ""),
        ],
    },
    "public/UZ/index.html": {
        "home": "https://fidic.uz/uz/",
        "eyebrow": "Bizning ekotizim",
        "h_accent": "FIDIC.uz",
        "h_rest": " — FIDIC, EPC, Claims va DAAB ga yagona kirish nuqtasi",
        "p": "Bridge Consult professional portali: amaliy materiallar, lug'at, sertifikatsiyaga tayyorgarlik, FIDIC AI va ekspert konsultatsiyasiga tez yo'l.",
        "cta": "FIDIC.uz'ni ochish",
        "typed": [
            "Search FIDIC, EPC, Claims, DAAB...",
            "Yellow Book bo'yicha delay claim",
            "muddatni uzaytirish (EOT)",
            "DAAB roli",
        ],
        "query": "Yellow Book bo'yicha delay claim",
        "ask": "FIDIC AI ga savol berish",
        "answer_title": "Manbalarga tayangan AI javob",
        "answer": [
            "20.1-band bo'yicha Muhandisga bildirishnoma va 28 kunlik muddatni tekshirish.",
            "Kechikish sababini kritik yo'l va yangilangan dastur bilan bog'lash.",
            "EOT, xarajatlar va Engineer/DAAB uchun pozitsiyani tayyorlash.",
        ],
        "sources": ["Maqola", "Lug'at", "Ekspert izohi"],
        "related": "Mashhur materiallar",
        "rels": [
            "20.1-band: da'volar tartibi",
            "Concurrent delay: yondashuvlar va amaliyot",
            "DAAB: kengashni qachon jalb qilish",
        ],
        "consult": "Ekspert konsultatsiyasini so'rash",
        "portal_entries": "Portal yo'nalishlari",
        "coverage": "Qamrov",
        "modules": [
            ("knowledge", "Bilimlar bazasi", "Maqolalar, keyslar va amaliy tahlillar", "knowledge"),
            ("glossary", "Lug'at", "FIDIC, EPC, Claims va DAAB atamalari", "glossary"),
            ("certification", "Sertifikatsiyaga tayyorgarlik", "Testlar, mavzular va imtihon treklari", "certification"),
            ("ai", "FIDIC AI", "Source links bilan ekspert javobi", ""),
        ],
    },
}

CHIPS = ["Red Book", "Yellow Book", "Claims", "DAAB", "EPC", "Procurement"]

ICONS = {
    "knowledge": "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    "glossary": "M4 6h16M4 12h16M4 18h10",
    "certification": "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
    "ai": "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
}


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def href(home: str, slug: str) -> str:
    return home + slug if slug else home


def icon(name: str, cls: str = "w-4 h-4") -> str:
    return (
        f'<svg class="{cls}" fill="none" stroke="currentColor" viewBox="0 0 24 24">'
        f'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="{ICONS[name]}"/></svg>'
    )


def modules(cfg: dict) -> str:
    out = []
    for i, (key, title, desc, slug) in enumerate(cfg["modules"], start=1):
        active = " fh-active" if key == "knowledge" else ""
        out.append(
            f'''                    <a href="{href(cfg["home"], slug)}" target="_blank" rel="noopener" data-fh-target="{key}" class="bridge-feature-card fh-module{active} group/m relative flex items-start focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-taupe/70">
                        <span class="fh-module-index absolute -left-2 top-3 w-5 h-5 rounded-full border border-bridge-taupe/35 bg-bridge-dark text-[9px] font-bold text-bridge-taupe flex items-center justify-center">{i}</span>
                        <span class="bridge-icon-box">{icon(key, "w-[18px] h-[18px]")}</span>
                        <span class="min-w-0">
                            <span class="bridge-feature-title">{esc(title)}</span>
                            <span class="bridge-feature-desc">{esc(desc)}</span>
                        </span>
                        <svg class="w-3.5 h-3.5 ml-auto mt-1 text-gray-600 group-hover/m:text-bridge-taupe group-hover/m:translate-x-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </a>'''
        )
    return "\n".join(out)


def chips() -> str:
    return "\n".join(
        f'                            <button type="button" class="bridge-badge fh-chip cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-taupe/60">{chip}</button>'
        for chip in CHIPS
    )


def answer(cfg: dict) -> str:
    return "\n".join(
        f'''                                <li class="flex items-start gap-2 text-[12.5px] text-gray-200 font-light leading-snug">
                                    <span class="w-1.5 h-1.5 rounded-full bg-bridge-taupe mt-1.5 shrink-0"></span>
                                    <span>{esc(item)}</span>
                                </li>'''
        for item in cfg["answer"]
    )


def sources(cfg: dict) -> str:
    src_icons = [
        "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        "M12 6.253v13",
        "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    ]
    out = []
    for i, item in enumerate(cfg["sources"]):
        out.append(
            f'''                                <span class="inline-flex items-center gap-1.5 text-[10px] font-semibold text-bridge-taupe px-2.5 py-1 rounded-full bg-bridge-taupe/12 border border-bridge-taupe/25">
                                    <svg style="width:11px;height:11px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="{src_icons[i]}"/></svg>{esc(item)}
                                </span>'''
        )
    return "\n".join(out)


def related(cfg: dict) -> str:
    out = []
    for item in cfg["rels"]:
        out.append(
            f'''                            <a href="{cfg["home"]}" target="_blank" rel="noopener" class="group/r flex items-center gap-2.5 py-2.5 border-b border-white/6 last:border-0 text-gray-300 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-taupe/60">
                                <span class="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/8 flex items-center justify-center text-bridge-taupe shrink-0">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </span>
                                <span class="text-[12px] font-light leading-snug">{esc(item)}</span>
                                <svg class="w-3 h-3 ml-auto text-gray-600 group-hover/r:text-bridge-taupe transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                            </a>'''
        )
    return "\n".join(out)


TPL = '''
<!-- ============ FIDIC.UZ — KNOWLEDGE HUB ============ -->
<section id="fidic-hub" class="bridge-dark-section bridge-dark-section--hub scroll-mt-24 -mt-px">
    <div class="bridge-section-bg">
        <div class="absolute -top-[12%] -left-[8%] w-[46vw] h-[46vw] bg-bridge-taupe/20 rounded-full mix-blend-screen filter blur-[110px] animate-blob"></div>
        <div class="absolute top-[8%] right-[-10%] w-[42vw] h-[42vw] bg-white/[0.075] rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-20%] left-[25%] w-[52vw] h-[52vw] bg-bridge-taupe/10 rounded-full mix-blend-screen filter blur-[135px] animate-blob animation-delay-4000"></div>
    </div>

    <div class="bridge-section-shell">
        <div class="bridge-section-kicker" data-aos="fade-right">
            <div class="bridge-section-kicker-line"></div>
            <span>@@EYEBROW@@</span>
        </div>

        <div class="bridge-section-grid bridge-section-grid--reverse">
            <div class="bridge-section-copy lg:order-2" data-aos="fade-left" data-aos-delay="100">
                <h2 class="bridge-section-heading">
                    <span class="bridge-heading-primary">@@HACC@@</span>
                    <span class="bridge-heading-secondary">@@HREST@@</span>
                </h2>
                <p class="bridge-section-lead">@@P@@</p>

                <div class="relative mb-8">
                    <div class="hidden sm:block absolute left-[8px] top-5 bottom-5 w-px bg-gradient-to-b from-bridge-taupe/0 via-bridge-taupe/30 to-bridge-taupe/0 pointer-events-none"></div>
                    <div class="bridge-feature-grid bridge-feature-grid--compact">
@@MODULES@@
                    </div>
                </div>

                <a href="@@HOME@@" target="_blank" rel="noopener" class="bridge-primary-cta group focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-taupe/70">
                    @@CTA@@
                    <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
            </div>

            <div class="bridge-section-media lg:order-1" data-aos="fade-right" data-aos-delay="150">
                <div class="bridge-media-frame bridge-media-frame--portal fh-product">
                    <div class="absolute -inset-px rounded-2xl pointer-events-none" style="background:linear-gradient(135deg,rgba(138,123,102,0.45),rgba(255,255,255,0.04),rgba(138,123,102,0.16)); opacity:.42; mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); padding:1px; -webkit-mask-composite:xor; mask-composite:exclude;"></div>
                    <div class="flex items-center gap-2 px-2 pb-3 text-[11px] text-gray-300 font-medium tracking-wide">
                        <span class="w-2 h-2 rounded-full bg-bridge-taupe shadow-[0_0_16px_rgba(138,123,102,0.85)]"></span>
                        <span>fidic.uz</span>
                        <span class="ml-auto text-[10px] uppercase tracking-widest text-gray-500">Knowledge Hub</span>
                    </div>

                    <div class="grid md:grid-cols-[0.82fr_1.34fr] gap-2.5">
                        <aside class="order-2 md:order-none rounded-xl bg-white/[0.035] border border-white/8 p-3">
                            <div class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2.5">@@PORTAL_ENTRIES@@</div>
                            <div class="space-y-2">
                                <a href="@@HOME@@knowledge" target="_blank" rel="noopener" data-panel="knowledge" class="fh-side-panel fh-panel-active flex items-center gap-2.5 p-2.5 rounded-lg border border-bridge-taupe/30 bg-bridge-taupe/12 text-white transition-all duration-300">
                                    <span class="text-bridge-taupe">@@ICON_KNOWLEDGE@@</span><span class="text-[12px] font-semibold">@@SIDE_KNOWLEDGE@@</span>
                                </a>
                                <a href="@@HOME@@glossary" target="_blank" rel="noopener" data-panel="glossary" class="fh-side-panel flex items-center gap-2.5 p-2.5 rounded-lg border border-white/8 bg-white/[0.03] text-gray-300 transition-all duration-300">
                                    <span class="text-bridge-taupe">@@ICON_GLOSSARY@@</span><span class="text-[12px] font-semibold">@@SIDE_GLOSSARY@@</span>
                                </a>
                                <a href="@@HOME@@certification" target="_blank" rel="noopener" data-panel="certification" class="fh-side-panel flex items-center gap-2.5 p-2.5 rounded-lg border border-white/8 bg-white/[0.03] text-gray-300 transition-all duration-300">
                                    <span class="text-bridge-taupe">@@ICON_CERTIFICATION@@</span><span class="text-[12px] font-semibold">@@SIDE_CERTIFICATION@@</span>
                                </a>
                                <a href="@@HOME@@" target="_blank" rel="noopener" data-panel="ai" class="fh-side-panel flex items-center gap-2.5 p-2.5 rounded-lg border border-white/8 bg-white/[0.03] text-gray-300 transition-all duration-300">
                                    <span class="text-bridge-taupe">@@ICON_AI@@</span><span class="text-[12px] font-semibold">FIDIC AI</span>
                                </a>
                            </div>
                            <div class="mt-3 rounded-lg border border-white/8 bg-bridge-dark/50 p-2.5">
                                <div class="text-[10px] font-bold uppercase tracking-[0.18em] text-bridge-taupe mb-2">@@COVERAGE@@</div>
                                <div class="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                                    <span>FIDIC</span><span>EPC</span><span>Claims</span><span>DAAB</span>
                                </div>
                            </div>
                        </aside>

                        <main class="order-1 md:order-none rounded-xl bg-white/[0.045] border border-white/10 p-3">
                            <div class="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-bridge-dark/75 border border-white/14 mb-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                                <svg class="w-4 h-4 text-bridge-taupe shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"/></svg>
                                <span class="text-[13px] text-gray-100 font-light truncate"><span class="fh-type"></span><span class="fh-caret text-bridge-taupe">|</span></span>
                            </div>

                            <div class="flex flex-wrap gap-1.5 mb-3">
@@CHIPS@@
                            </div>

                            <a href="@@HOME@@" target="_blank" rel="noopener" data-panel="ai" class="fh-main-panel block rounded-xl bg-bridge-dark/58 border border-bridge-taupe/24 p-3.5 mb-3 transition-all duration-300 hover:border-bridge-taupe/55 hover:bg-bridge-taupe/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-taupe/70">
                                <div class="flex items-center gap-2 mb-2.5">
                                    <span class="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#16140f] bg-bridge-taupe px-2 py-1 rounded-md">FIDIC AI</span>
                                    <span class="text-[12px] text-gray-100 font-medium truncate">@@QUERY@@</span>
                                </div>
                                <div class="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2">@@ANSWER_TITLE@@</div>
                                <ul class="space-y-2 mb-3">
@@ANSWER@@
                                </ul>
                                <div class="flex flex-wrap gap-1.5">
@@SOURCES@@
                                </div>
                            </a>

                            <div data-panel="knowledge" class="fh-main-panel rounded-xl border border-white/8 bg-white/[0.035] p-3 mb-3 transition-all duration-300">
                                <div class="flex items-center gap-2 mb-1.5">
                                    <span class="w-6 h-6 rounded-lg bg-bridge-taupe/12 border border-bridge-taupe/25 flex items-center justify-center text-bridge-taupe">@@ICON_KNOWLEDGE@@</span>
                                    <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">@@RELATED@@</span>
                                </div>
@@RELATED_LINKS@@
                            </div>

                            <a href="#contact-form" class="group/c flex items-center justify-center gap-2.5 w-full py-3 rounded-xl border border-bridge-taupe/45 bg-bridge-taupe/10 text-bridge-taupe text-[12px] font-bold uppercase tracking-widest transition-all duration-300 hover:bg-bridge-taupe hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-bridge-taupe/70">
                                @@CONSULT@@
                                <svg class="w-4 h-4 group-hover/c:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                            </a>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <style>
        #fidic-hub .fh-grid {
            background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
            background-size: 50px 50px;
            mask-image: radial-gradient(ellipse at center, black 14%, transparent 78%);
            -webkit-mask-image: radial-gradient(ellipse at center, black 14%, transparent 78%);
            animation: fh-grid-drift 18s linear infinite;
        }
        #fidic-hub .fh-active,
        #fidic-hub .fh-module:hover {
            background: rgba(138,123,102,0.13);
            border-color: rgba(138,123,102,0.48);
            box-shadow: 0 18px 42px -30px rgba(138,123,102,0.85);
        }
        #fidic-hub .fh-active .fh-module-index {
            background: #8A7B66;
            color: #fff;
        }
        #fidic-hub .fh-panel-active {
            border-color: rgba(138,123,102,0.48) !important;
            background: rgba(138,123,102,0.14) !important;
            color: #fff !important;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 16px 34px -28px rgba(138,123,102,0.9);
        }
        #fidic-hub .fh-main-active {
            border-color: rgba(138,123,102,0.52) !important;
            background: rgba(138,123,102,0.11) !important;
        }
        @keyframes fh-grid-drift {
            0% { transform: translate3d(0,0,0); }
            100% { transform: translate3d(50px,50px,0); }
        }
        @media (prefers-reduced-motion: reduce) {
            #fidic-hub .fh-grid { animation: none; }
            #fidic-hub * { scroll-behavior: auto; }
        }
        @media (max-width: 767px) {
            #fidic-hub .fh-grid { animation: none; opacity: .12; }
        }
    </style>

    <script>
    (function(){
        var root=document.getElementById('fidic-hub'); if(!root) return;
        var typeEl=root.querySelector('.fh-type');
        var queries=[@@TYPED@@];
        if(typeEl){
            if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){
                typeEl.textContent=queries[0];
            } else {
                var i=0,j=0,del=false;
                function tick(){
                    var word=queries[i];
                    typeEl.textContent=del?word.slice(0,j--):word.slice(0,j++);
                    var delay=del?38:78;
                    if(!del&&j>word.length){del=true;delay=1450;}
                    else if(del&&j<0){del=false;j=0;i=(i+1)%queries.length;delay=320;}
                    setTimeout(tick,delay);
                }
                setTimeout(tick,500);
            }
        }
        var modules=[].slice.call(root.querySelectorAll('.fh-module'));
        var panels=[].slice.call(root.querySelectorAll('[data-panel]'));
        function activate(key){
            modules.forEach(function(item){ item.classList.toggle('fh-active', item.getAttribute('data-fh-target')===key); });
            panels.forEach(function(item){
                var match=item.getAttribute('data-panel')===key;
                item.classList.toggle('fh-panel-active', match && item.classList.contains('fh-side-panel'));
                item.classList.toggle('fh-main-active', match && item.classList.contains('fh-main-panel'));
            });
        }
        modules.forEach(function(item){
            item.addEventListener('mouseenter', function(){ activate(item.getAttribute('data-fh-target')); });
            item.addEventListener('focus', function(){ activate(item.getAttribute('data-fh-target')); });
        });
        root.addEventListener('mouseleave', function(){ activate('knowledge'); });
    })();
    </script>
</section>
'''


def section(cfg: dict) -> str:
    typed = ", ".join(f'"{q.replace(chr(34), r"\"")}"' for q in cfg["typed"])
    replacements = {
        "@@EYEBROW@@": esc(cfg["eyebrow"]),
        "@@HACC@@": esc(cfg["h_accent"]),
        "@@HREST@@": esc(cfg["h_rest"]),
        "@@P@@": esc(cfg["p"]),
        "@@MODULES@@": modules(cfg),
        "@@HOME@@": cfg["home"],
        "@@CTA@@": esc(cfg["cta"]),
        "@@CHIPS@@": chips(),
        "@@QUERY@@": esc(cfg["query"]),
        "@@ASK@@": esc(cfg["ask"]),
        "@@ANSWER_TITLE@@": esc(cfg["answer_title"]),
        "@@ANSWER@@": answer(cfg),
        "@@SOURCES@@": sources(cfg),
        "@@RELATED@@": esc(cfg["related"]),
        "@@RELATED_LINKS@@": related(cfg),
        "@@CONSULT@@": esc(cfg["consult"]),
        "@@PORTAL_ENTRIES@@": esc(cfg["portal_entries"]),
        "@@COVERAGE@@": esc(cfg["coverage"]),
        "@@SIDE_KNOWLEDGE@@": esc(cfg["modules"][0][1]),
        "@@SIDE_GLOSSARY@@": esc(cfg["modules"][1][1]),
        "@@SIDE_CERTIFICATION@@": esc(cfg["modules"][2][1]),
        "@@TYPED@@": typed,
        "@@ICON_KNOWLEDGE@@": icon("knowledge", "w-4 h-4"),
        "@@ICON_GLOSSARY@@": icon("glossary", "w-4 h-4"),
        "@@ICON_CERTIFICATION@@": icon("certification", "w-4 h-4"),
        "@@ICON_AI@@": icon("ai", "w-4 h-4"),
    }
    output = TPL
    for key, value in replacements.items():
        output = output.replace(key, value)
    return output


def rebuild(path: str, cfg: dict) -> None:
    with open(path, "r", encoding="utf-8") as handle:
        content = handle.read()
    content = re.sub(
        r"\n?<!-- ============ FIDIC\.UZ — KNOWLEDGE HUB ============ -->\n<section id=\"fidic-hub\".*?</section>\n?",
        "\n",
        content,
        flags=re.DOTALL,
    )
    content = re.sub(r"<section id=\"fidic-hub\".*?</section>\n?", "", content, flags=re.DOTALL)
    anchor = '<section id="media"'
    if anchor not in content:
        raise RuntimeError(f"media anchor missing in {path}")
    content = content.replace(anchor, section(cfg) + anchor, 1)
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(content)


for page, config in LANGS.items():
    rebuild(page, config)
    print(f"{page}: fidic-hub rebuilt")

print("Done.")
