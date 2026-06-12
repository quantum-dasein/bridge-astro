#!/usr/bin/env python3
"""
Comprehensive upgrade:
1. Fix EN/UZ services video poster path (white card bug)
2. Fix EN textarea rows=4 -> rows=3
3. Custom dropdown for request_type and project_stage (all 3 files)
4. FIDIC knowledge base + catch-block KB fallback (all 3 files)
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

# ─────────────────────────────────────────────────────
# DROPDOWN CSS (injected into form <style> before @keyframes)
# ─────────────────────────────────────────────────────
DROPDOWN_CSS = """
        /* ── Custom dropdown ─────────────────────── */
        .bc-custom-sel{position:relative;width:100%;box-sizing:border-box;}
        .bc-sel-trigger{display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.05);border-radius:0.75rem;padding:0.75rem 1rem;cursor:pointer;user-select:none;font-size:0.9rem;font-family:Inter,sans-serif;transition:border-color 0.2s,background 0.2s;}
        .bc-sel-trigger:hover,.bc-custom-sel.is-open .bc-sel-trigger{border-color:rgba(138,123,102,0.8)!important;background:rgba(138,123,102,0.1)!important;}
        .bc-sel-val{color:rgba(255,255,255,0.35);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
        .bc-custom-sel.has-val .bc-sel-val{color:#fff;}
        .bc-sel-ico{flex-shrink:0;width:16px;height:16px;stroke:rgba(255,255,255,0.3);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform 0.2s;}
        .bc-custom-sel.is-open .bc-sel-ico{transform:rotate(180deg);stroke:rgba(138,123,102,0.9);}
        .bc-sel-panel{position:absolute;top:calc(100% + 6px);left:0;right:0;z-index:200;background:#1e1c1a;border:1px solid rgba(138,123,102,0.25);border-radius:0.75rem;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.7);opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity 0.15s,transform 0.15s;}
        .bc-custom-sel.is-open .bc-sel-panel{opacity:1;transform:translateY(0);pointer-events:all;}
        .bc-sel-opt{padding:0.8rem 1.1rem;color:rgba(255,255,255,0.65);font-size:0.9rem;font-family:Inter,sans-serif;cursor:pointer;transition:background 0.15s,color 0.15s;white-space:normal;line-height:1.4;}
        .bc-sel-opt:hover{background:rgba(138,123,102,0.15);color:#fff;}
        .bc-sel-opt.bc-sel-active{background:rgba(138,123,102,0.1);color:#8A7B66;}
        .bc-sel-opt+.bc-sel-opt{border-top:1px solid rgba(255,255,255,0.04);}"""

# ─────────────────────────────────────────────────────
# DROPDOWN JS (injected before the change listener)
# ─────────────────────────────────────────────────────
DROPDOWN_JS = """
    // Custom dropdown init
    (function(){
        var sels=document.querySelectorAll('.bc-custom-sel');
        sels.forEach(function(sel){
            var trigger=sel.querySelector('.bc-sel-trigger');
            var valEl=sel.querySelector('.bc-sel-val');
            var native=document.getElementById(sel.getAttribute('data-native'));
            trigger.addEventListener('click',function(e){
                e.stopPropagation();
                sels.forEach(function(s){if(s!==sel)s.classList.remove('is-open');});
                sel.classList.toggle('is-open');
            });
            sel.querySelectorAll('.bc-sel-opt').forEach(function(opt){
                opt.addEventListener('click',function(){
                    valEl.textContent=opt.textContent;
                    sel.classList.add('has-val');
                    sel.classList.remove('is-open');
                    sel.querySelectorAll('.bc-sel-opt').forEach(function(o){o.classList.remove('bc-sel-active');});
                    opt.classList.add('bc-sel-active');
                    if(native){native.value=opt.getAttribute('data-val');native.dispatchEvent(new Event('change'));}
                });
            });
        });
        document.addEventListener('click',function(){sels.forEach(function(s){s.classList.remove('is-open');});});
    })();"""

# ─────────────────────────────────────────────────────
# KNOWLEDGE BASES per language (appended after BC_SYSTEM)
# ─────────────────────────────────────────────────────
KB_RU = r"""
    var BC_KB=[
        {k:['red book','красн','mdb harm'],a:'**Red Book (MDB Harmonised)** — применяется когда заказчик предоставляет детальный проект, а подрядчик только строит. Риски проектирования остаются у заказчика. Подходит для дорог, мостов, школ, больниц (МФО: АБР, Всемирный банк). Инженер ведёт надзор; подрядчик вправе требовать EOT и компенсацию при задержках/изменениях.'},
        {k:['yellow book','желт','design build'],a:'**Yellow Book** — контракт "проектирование и строительство" (Design & Build). Подрядчик отвечает за строительство И проектирование на основе Требований заказчика. Используется для промышленных объектов и сложной инфраструктуры. Риски проектирования переходят к подрядчику.'},
        {k:['silver book','серебр','epc','turnkey','под ключ'],a:'**Silver Book (EPC Turnkey)** — контракт "под ключ" с максимальными рисками для подрядчика. Цена фиксированная, заказчик минимально вмешивается. Идеален для нефтегазовых объектов и электростанций.'},
        {k:['gold book','dbo','operate'],a:'**Gold Book (DBO, 2008)** — контракт на проектирование, строительство и 20-летнюю эксплуатацию. Подрядчик остаётся ответственным за объект весь операционный период. Используется для ГЭС, водоочистных станций.'},
        {k:['daab','дааб','dispute avoidance','adjudication board'],a:'**DAAB** (Dispute Avoidance/Adjudication Board) — ключевой механизм разрешения споров FIDIC 2017. 1–3 независимых эксперта работают превентивно с начала проекта. Решения DAAB немедленно обязательны, но могут быть оспорены в арбитраже. Bridge Consult помогает организовать DAAB.'},
        {k:['dab','dispute adjudication'],a:'**DAB** (Dispute Adjudication Board) — механизм FIDIC 1999, заменённый DAAB в 2017 г. Принимает временно обязательные решения. Несогласие — в течение 28 дней, затем ICC-арбитраж.'},
        {k:['eot','extension of time','продление срока','задержк','delay'],a:'**Extension of Time (EOT)** — право подрядчика требовать продления срока завершения. Основания: Variations, форс-мажор, задержки заказчика, неблагоприятные условия (Sub-Clause 4.12). По FIDIC 1999 уведомление — в течение 28 дней. Опоздание может лишить права на EOT.'},
        {k:['notice','уведомлен','28 дней','28 days'],a:'**Уведомления (Notices)** — строгое требование FIDIC. По FIDIC 1999 — 28 дней после события; по FIDIC 2017 — "без разумной задержки". Ненадлежащее уведомление может лишить права на компенсацию. Bridge Consult помогает правильно оформлять уведомления.'},
        {k:['variation','изменен','вариац'],a:'**Variations** — изменения объёма работ, инициируемые Инженером. Подрядчик обязан выполнять. Право на корректировку цены и срока сохраняется даже при выполнении работ до согласования стоимости.'},
        {k:['forensic','delay analysis','fda','cpm','critical path','анализ задерж'],a:'**Forensic Delay Analysis (FDA)** — методологический анализ причин задержки строительства по SCL Protocol. Bridge Consult применяет Windows Analysis, Time Impact Analysis (TIA), Collapsed As-Built для обоснования Claims на EOT и возмещение потерь в арбитраже.'},
        {k:['loss','expense','убыт','потер','компенсац затрат'],a:'**Loss & Expense / Additional Costs** — право подрядчика требовать возмещения прямых убытков из-за действий заказчика (простои, ускорение, накладные расходы). Bridge Consult готовит Claims с детальной квантификацией.'},
        {k:['форс-мажор','форс мажор','force majeure'],a:'**Force Majeure** по FIDIC — исключительное событие вне контроля сторон. Даёт право на EOT, но не на компенсацию убытков. Уведомление — в течение 14 дней после начала.'},
        {k:['арбитраж','арбитр','icc','icsid'],a:'Большинство FIDIC-контрактов предусматривают **международный арбитраж** (ICC, ICSID) как финальный инструмент — после DAAB/DAB и переговоров. Bridge Consult сопровождает клиентов: подготовка позиции, экспертные заключения.'},
        {k:['услуг','bridge consult','чем занимаетесь','что делаете'],a:'**Bridge Consult** — ведущая компания по контрактному инжинирингу FIDIC в Центральной Азии. Услуги: FIDIC-консультации, Forensic Delay Analysis и Claims, сопровождение споров (DAAB/медиация/арбитраж ICC), сертифицированные тренинги FIDIC. Контакт: +998 33 000 15 30 | info@bridgeconsult.uz'},
        {k:['контакт','телефон','связаться','написать','позвонить'],a:'**Bridge Consult — контакты:**\n☎️ +998 33 000 15 30\n✉️ info@bridgeconsult.uz\n🌐 bridgeconsult.uz\n\nРаботаем по будням 09:00–18:00 UTC+5.'},
    ];
    function bcLocalSearch(q){
        q=q.toLowerCase();var best=null,bs=0;
        BC_KB.forEach(function(item){
            var s=0;item.k.forEach(function(kw){if(q.indexOf(kw.toLowerCase())>=0)s+=2;});
            if(s>bs){bs=s;best=item;}
        });
        return bs>=2?best:null;
    }"""

KB_EN = r"""
    var BC_KB=[
        {k:['red book','mdb harm'],a:'**Red Book (MDB Harmonised)** — used when the Employer provides a detailed design and the Contractor only constructs. Design risks remain with the Employer. Typical for roads, bridges, schools, hospitals financed by MDBs (ADB, World Bank). The Contractor can claim EOT and compensation for Employer-caused changes and delays.'},
        {k:['yellow book','design build','plant'],a:'**Yellow Book** — Design & Build contract. The Contractor is responsible for both construction and design based on the Employer\'s Requirements. Used for industrial facilities, factories, and complex infrastructure. Design risk transfers to the Contractor.'},
        {k:['silver book','epc','turnkey'],a:'**Silver Book (EPC Turnkey)** — a fixed-price "turn-key" contract placing maximum risk on the Contractor, who handles design, construction, and commissioning. Ideal for oil & gas facilities and power plants.'},
        {k:['gold book','dbo','design build operate'],a:'**Gold Book (DBO, 2008)** — covers design, construction, and 20 years of operation. The Contractor remains responsible throughout the operational period. Used for hydroelectric plants and water treatment facilities.'},
        {k:['daab','dispute avoidance','adjudication board'],a:'**DAAB** (Dispute Avoidance/Adjudication Board) — the key dispute mechanism in FIDIC 2017. 1–3 independent experts appointed at project start work proactively to prevent disputes. DAAB decisions are immediately binding but can be challenged in arbitration.'},
        {k:['dab','dispute adjudication'],a:'**DAB** (Dispute Adjudication Board) — the FIDIC 1999 predecessor of DAAB. Issues temporarily binding decisions; notice of dissatisfaction must be given within 28 days, after which ICC arbitration follows.'},
        {k:['eot','extension of time','delay','completion'],a:'**Extension of Time (EOT)** — the Contractor\'s right to extend the contract completion date. Grounds: Variations, force majeure, Employer delays, adverse physical conditions (Sub-Clause 4.12). Under FIDIC 1999, notice must be given within 28 days. Late notice may forfeit the right to EOT.'},
        {k:['notice','28 days','claim notice'],a:'**Notices** are a strict FIDIC requirement. Under FIDIC 1999, a claim notice must be given within 28 days of the triggering event; under FIDIC 2017, "without undue delay." Late or improperly formatted notices can bar compensation.'},
        {k:['variation','change order','variations'],a:'**Variations** — changes to the scope of work instructed by the Engineer or Employer. The Contractor must comply. Entitlement to price and time adjustments is preserved even when work is executed before cost is agreed.'},
        {k:['forensic','delay analysis','fda','cpm','critical path'],a:'**Forensic Delay Analysis (FDA)** — a methodological analysis of construction delays per the SCL Protocol. Bridge Consult applies Windows Analysis, Time Impact Analysis (TIA), and Collapsed As-Built to substantiate EOT and loss-recovery Claims in arbitration.'},
        {k:['loss','expense','additional cost','cost recovery'],a:'**Loss & Expense / Additional Costs** — the Contractor\'s right to recover direct losses caused by Employer actions (idling, acceleration, overhead). Bridge Consult prepares quantified Claim submissions.'},
        {k:['force majeure','exceptional','unforeseeable'],a:'**Force Majeure** under FIDIC — an exceptional event beyond the parties\' control. Entitles the Contractor to EOT, but not to cost recovery. Notice must be given within 14 days of the event.'},
        {k:['arbitration','icc','icsid','dispute resolution'],a:'Most FIDIC contracts provide for **international arbitration** (ICC, ICSID) as the final dispute resolution step — after DAAB/DAB and amicable settlement. Bridge Consult supports clients with position preparation, expert reports, and legal coordination.'},
        {k:['services','bridge consult','what do you do'],a:'**Bridge Consult** is Central Asia\'s leading FIDIC contract engineering firm. Services: FIDIC consulting (Red/Yellow/Silver Book), Forensic Delay Analysis and Claims, dispute support (DAAB/mediation/ICC arbitration), certified FIDIC training. Contact: +998 33 000 15 30 | info@bridgeconsult.uz'},
        {k:['contact','phone','email','reach'],a:'**Bridge Consult — Contact:**\n☎️ +998 33 000 15 30\n✉️ info@bridgeconsult.uz\n🌐 bridgeconsult.uz\n\nWe respond on working days (09:00–18:00 UTC+5).'},
    ];
    function bcLocalSearch(q){
        q=q.toLowerCase();var best=null,bs=0;
        BC_KB.forEach(function(item){
            var s=0;item.k.forEach(function(kw){if(q.indexOf(kw.toLowerCase())>=0)s+=2;});
            if(s>bs){bs=s;best=item;}
        });
        return bs>=2?best:null;
    }"""

KB_UZ = r"""
    var BC_KB=[
        {k:['red book','qizil kitob','mdb'],a:'**Red Book (MDB Harmonised)** — buyurtmachi batafsil loyihani taqdim etganda, pudratchi faqat qurilish bajarganda qo\'llaniladi. Loyihalash xatarlari buyurtmachida. Yo\'llar, ko\'priklar, maktablar, kasalxonalar uchun (ADB, Jahon Banki). Pudratchi o\'zgarishlar uchun EOT va kompensatsiya talab qilishi mumkin.'},
        {k:['yellow book','sariq kitob','design build'],a:'**Yellow Book** — "Loyihalash va qurilish" shartnomasi. Pudratchi ham qurilish, ham loyihalash uchun javobgar (buyurtmachining Talablariga asosan). Sanoat ob\'ektlari va murakkab infratuzilma uchun ishlatiladi.'},
        {k:['silver book','kumush kitob','epc','turnkey','kalit topshirish'],a:'**Silver Book (EPC Turnkey)** — "kalit topshirish" shartnomasi, maksimal xatarlar pudratchiga. Narx qat\'iy, buyurtmachi minimal aralashadi. Neft-gaz ob\'ektlari va elektrostansiyalar uchun ideal.'},
        {k:['daab','dispute avoidance','adjudication'],a:'**DAAB** (Nizolarni oldini olish va ko\'rib chiqish kengashi) — FIDIC 2017 asosiy mexanizmi. Loyiha boshida tayinlangan mustaqil ekspertlar proaktiv ishlaydi. Qarorlar darhol bajariladi, ammo arbitrajda e\'tiroz bildirish mumkin.'},
        {k:['dab','nizo'],a:'**DAB** (Nizo ko\'rib chiqish kengashi) — FIDIC 1999 mexanizmi (2017 da DAAB bilan almashtirildi). Vaqtincha majburiy qarorlar chiqaradi. Norozilik bildirish muddati — 28 kun, keyin ICC arbitraj.'},
        {k:['eot','extension of time','muddat uzaytirish','kechikish','delay'],a:'**Muddatni uzaytirish (EOT)** — pudratchining shartnoma tugash muddatini uzaytirish huquqi. Asoslar: Variatsiyalar, fors-major, buyurtmachi kechikishlari, noqulay sharoitlar. FIDIC 1999 — 28 kun ichida bildirishnoma. Kechikkan bildirishnoma EOT huquqini yo\'qotadi.'},
        {k:['notice','bildirishnoma','28 kun'],a:'**Bildirishnomalar** — FIDIC ning qat\'iy talabi. FIDIC 1999 — 28 kun ichida; FIDIC 2017 — "asossiz kechikmasdan". Kechikkan bildirishnoma kompensatsiya huquqini yo\'qotishi mumkin.'},
        {k:['variation','o\'zgartirish','variaciya'],a:'**Variatsiyalar** — muhandis tomonidan buyurilgan ish hajmidagi o\'zgarishlar. Pudratchi bajarishi shart. Narx kelishilgunga qadar ish bajarilsa ham kompensatsiya huquqi saqlanadi.'},
        {k:['forensic','delay analysis','fda','kechikish tahlili'],a:'**Forensic Delay Analysis (FDA)** — qurilish kechikishlarini SCL Protocol bo\'yicha tahlil qilish. Bridge Consult Windows Analysis, TIA va Collapsed As-Built usullarini qo\'llaydi. Arbitrajda EOT va yo\'qotishlar da\'volarini asoslash uchun ishlatiladi.'},
        {k:['loss','expense','yo\'qotish','kompensatsiya'],a:'**Yo\'qotishlar va qo\'shimcha xarajatlar** — buyurtmachi harakatlari natijasida pudratchining yo\'qotishlarini qoplash huquqi (majburiy to\'xtatish, jadallash, yuk xarajatlari). Bridge Consult miqdorlash tahlili bilan da\'vo paketini tayyorlaydi.'},
        {k:['fors-major','fors major','force majeure'],a:'**Fors-major** — tomonlarning nazoratidan tashqaridagi favqulodda hodisa. EOT ga haq beradi, lekin xarajat qoplanmaydi. 14 kun ichida bildirishnoma shart.'},
        {k:['arbitraj','icc','xalqaro arbitraj'],a:'Ko\'pchilik FIDIC shartnomalari **xalqaro arbitraj** (ICC, ICSID) ni yakuniy nizo hal etish usuli sifatida nazarda tutadi. Bridge Consult barcha bosqichlarda: pozitsiya tayyorlash, ekspert xulosalari.'},
        {k:['xizmatlar','bridge consult','nima qilasiz'],a:'**Bridge Consult** — Markaziy Osiyodagi FIDIC shartnoma injiniringi yetakchisi. Xizmatlar: FIDIC konsultatsiyalar, Forensic Delay Analysis va da\'volar, nizo ko\'rib chiqish (DAAB/mediatsiya/ICC), sertifikatlangan FIDIC treninglar. Aloqa: +998 33 000 15 30 | info@bridgeconsult.uz'},
        {k:['aloqa','telefon','bog\'lanish','qo\'ng\'iroq'],a:'**Bridge Consult — Aloqa:**\n☎️ +998 33 000 15 30\n✉️ info@bridgeconsult.uz\n🌐 bridgeconsult.uz\n\nIsh kunlari (09:00–18:00 UTC+5).'},
    ];
    function bcLocalSearch(q){
        q=q.toLowerCase();var best=null,bs=0;
        BC_KB.forEach(function(item){
            var s=0;item.k.forEach(function(kw){if(q.indexOf(kw.toLowerCase())>=0)s+=2;});
            if(s>bs){bs=s;best=item;}
        });
        return bs>=2?best:null;
    }"""

# ─────────────────────────────────────────────────────
# PER-LANGUAGE CONFIG
# ─────────────────────────────────────────────────────
LANGS = {
    'ru': {
        'file': 'public/index.html',
        'poster_fix': False,
        'textarea_fix': False,
        'keyframe': '        @keyframes spin { to { transform: rotate(360deg); } }',
        'change_marker': "    document.getElementById('ru-request-type').addEventListener('change', function() {",
        'system_marker': "    var BC_SYSTEM = 'Вы — профессиональный FIDIC-ассистент",
        'kb': KB_RU,
        'catch_msg': "bcAddMsg('bot', 'Ошибка связи. Позвоните нам: +998 33 000 15 30');",
        'catch_msg_new': "var _l=bcLocalSearch(text);if(_l){bcAddMsg('bot',_l.a);}else{bcAddMsg('bot','Ошибка связи. Позвоните нам: **+998 33 000 15 30**');}",
        'req_old': """<select name="request_type" id="ru-request-type" class="bc-input bc-sel" style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.05);border-radius:0.75rem;padding:0.75rem 1rem;color:rgba(255,255,255,0.35);font-size:0.9rem;font-family:Inter,sans-serif;outline:none;transition:all 0.3s ease;">
                                <option value="" disabled selected>Выберите тип запроса...</option>
                                <option value="FIDIC-консультация">FIDIC-консультация</option>
                                <option value="Разрешение спора">Разрешение спора</option>
                                <option value="Тренинг">Тренинг</option>
                                <option value="Другое">Другое</option>
                            </select>""",
        'req_new': """<select name="request_type" id="ru-request-type" style="display:none;">
                                <option value="" disabled selected></option>
                                <option value="FIDIC-консультация">FIDIC-консультация</option>
                                <option value="Разрешение спора">Разрешение спора</option>
                                <option value="Тренинг">Тренинг</option>
                                <option value="Другое">Другое</option>
                            </select>
                            <div class="bc-custom-sel" data-native="ru-request-type">
                                <div class="bc-sel-trigger">
                                    <span class="bc-sel-val">Выберите тип запроса...</span>
                                    <svg class="bc-sel-ico" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>
                                </div>
                                <div class="bc-sel-panel">
                                    <div class="bc-sel-opt" data-val="FIDIC-консультация">FIDIC-консультация</div>
                                    <div class="bc-sel-opt" data-val="Разрешение спора">Разрешение спора</div>
                                    <div class="bc-sel-opt" data-val="Тренинг">Тренинг</div>
                                    <div class="bc-sel-opt" data-val="Другое">Другое</div>
                                </div>
                            </div>""",
        'stg_old': """<select name="project_stage" class="bc-input bc-sel" style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.05);border-radius:0.75rem;padding:0.75rem 1rem;color:#fff;font-size:0.9rem;font-family:Inter,sans-serif;outline:none;transition:all 0.3s ease;">
                                        <option value="" disabled selected>Выберите стадию...</option>
                                        <option value="Строительство">Строительство</option>
                                        <option value="Завершение работ">Завершение работ</option>
                                        <option value="Гарантийный период">Гарантийный период</option>
                                        <option value="После завершения">После завершения</option>
                                    </select>""",
        'stg_new': """<select name="project_stage" id="ru-project-stage" style="display:none;">
                                        <option value="" disabled selected></option>
                                        <option value="Строительство">Строительство</option>
                                        <option value="Завершение работ">Завершение работ</option>
                                        <option value="Гарантийный период">Гарантийный период</option>
                                        <option value="После завершения">После завершения</option>
                                    </select>
                                    <div class="bc-custom-sel" data-native="ru-project-stage">
                                        <div class="bc-sel-trigger">
                                            <span class="bc-sel-val">Выберите стадию...</span>
                                            <svg class="bc-sel-ico" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>
                                        </div>
                                        <div class="bc-sel-panel">
                                            <div class="bc-sel-opt" data-val="Строительство">Строительство</div>
                                            <div class="bc-sel-opt" data-val="Завершение работ">Завершение работ</div>
                                            <div class="bc-sel-opt" data-val="Гарантийный период">Гарантийный период</div>
                                            <div class="bc-sel-opt" data-val="После завершения">После завершения</div>
                                        </div>
                                    </div>""",
    },
    'en': {
        'file': 'public/EN/index.html',
        'poster_fix': True,
        'textarea_fix': True,
        'keyframe': '        @keyframes spin-en { to { transform: rotate(360deg); } }',
        'change_marker': "    document.getElementById('en-request-type').addEventListener('change', function() {",
        'system_marker': "    var BC_SYSTEM = 'You are a professional FIDIC expert assistant",
        'kb': KB_EN,
        'catch_msg': "bcAddMsg('bot', 'Connection error. Please call us: +998 33 000 15 30');",
        'catch_msg_new': "var _l=bcLocalSearch(text);if(_l){bcAddMsg('bot',_l.a);}else{bcAddMsg('bot','Connection error. Please call: **+998 33 000 15 30**');}",
        'req_old': """<select name="request_type" id="en-request-type" class="bc-input-en bc-sel-en" style="width:100%;box-sizing:border-box;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:0.75rem;padding:0.75rem 1rem;color:rgba(255,255,255,0.35);font-size:0.9rem;font-family:Inter,sans-serif;outline:none;transition:border-color 0.2s,background 0.2s;">
                                <option value="" disabled selected>Select request type...</option>
                                <option value="FIDIC Consultation">FIDIC Consultation</option>
                                <option value="Dispute Resolution">Dispute Resolution</option>
                                <option value="Training">Training</option>
                                <option value="Other">Other</option>
                            </select>""",
        'req_new': """<select name="request_type" id="en-request-type" style="display:none;">
                                <option value="" disabled selected></option>
                                <option value="FIDIC Consultation">FIDIC Consultation</option>
                                <option value="Dispute Resolution">Dispute Resolution</option>
                                <option value="Training">Training</option>
                                <option value="Other">Other</option>
                            </select>
                            <div class="bc-custom-sel" data-native="en-request-type">
                                <div class="bc-sel-trigger">
                                    <span class="bc-sel-val">Select request type...</span>
                                    <svg class="bc-sel-ico" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>
                                </div>
                                <div class="bc-sel-panel">
                                    <div class="bc-sel-opt" data-val="FIDIC Consultation">FIDIC Consultation</div>
                                    <div class="bc-sel-opt" data-val="Dispute Resolution">Dispute Resolution</div>
                                    <div class="bc-sel-opt" data-val="Training">Training</div>
                                    <div class="bc-sel-opt" data-val="Other">Other</div>
                                </div>
                            </div>""",
        'stg_old': """<select name="project_stage" class="bc-input-en bc-sel-en" style="width:100%;box-sizing:border-box;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:0.75rem;padding:0.75rem 1rem;color:#fff;font-size:0.9rem;font-family:Inter,sans-serif;outline:none;transition:border-color 0.2s,background 0.2s;">
                                        <option value="" disabled selected>Select stage...</option>
                                        <option value="Construction">Construction</option>
                                        <option value="Completion">Completion</option>
                                        <option value="Defects Liability">Defects Liability Period</option>
                                        <option value="Post-completion">Post-completion</option>
                                    </select>""",
        'stg_new': """<select name="project_stage" id="en-project-stage" style="display:none;">
                                        <option value="" disabled selected></option>
                                        <option value="Construction">Construction</option>
                                        <option value="Completion">Completion</option>
                                        <option value="Defects Liability">Defects Liability Period</option>
                                        <option value="Post-completion">Post-completion</option>
                                    </select>
                                    <div class="bc-custom-sel" data-native="en-project-stage">
                                        <div class="bc-sel-trigger">
                                            <span class="bc-sel-val">Select stage...</span>
                                            <svg class="bc-sel-ico" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>
                                        </div>
                                        <div class="bc-sel-panel">
                                            <div class="bc-sel-opt" data-val="Construction">Construction</div>
                                            <div class="bc-sel-opt" data-val="Completion">Completion</div>
                                            <div class="bc-sel-opt" data-val="Defects Liability">Defects Liability Period</div>
                                            <div class="bc-sel-opt" data-val="Post-completion">Post-completion</div>
                                        </div>
                                    </div>""",
    },
    'uz': {
        'file': 'public/UZ/index.html',
        'poster_fix': True,
        'textarea_fix': False,
        'keyframe': '        @keyframes spin-uz { to { transform: rotate(360deg); } }',
        'change_marker': "    document.getElementById('uz-request-type').addEventListener('change', function() {",
        'system_marker': "    var BC_SYSTEM = 'Siz Bridge Consult kompaniyasining",
        'kb': KB_UZ,
        'catch_msg': "bcAddMsg('bot', 'Ulanish xatosi. Bizga qo\\'ng\\'iroq qiling: +998 33 000 15 30');",
        'catch_msg_new': "var _l=bcLocalSearch(text);if(_l){bcAddMsg('bot',_l.a);}else{bcAddMsg('bot','Ulanish xatosi. Qo\\'ng\\'iroq qiling: **+998 33 000 15 30**');}",
        'req_old': """<select name="request_type" id="uz-request-type" class="bc-input-uz bc-sel-uz" style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.05);border-radius:0.75rem;padding:0.75rem 1rem;color:rgba(255,255,255,0.35);font-size:0.9rem;font-family:Inter,sans-serif;outline:none;transition:all 0.3s ease;">
                                <option value="" disabled selected>So'rov turini tanlang...</option>
                                <option value="FIDIC-maslahat">FIDIC-maslahat</option>
                                <option value="Nizolarni hal etish">Nizolarni hal etish</option>
                                <option value="Treninglar">Treninglar</option>
                                <option value="Boshqa">Boshqa</option>
                            </select>""",
        'req_new': """<select name="request_type" id="uz-request-type" style="display:none;">
                                <option value="" disabled selected></option>
                                <option value="FIDIC-maslahat">FIDIC-maslahat</option>
                                <option value="Nizolarni hal etish">Nizolarni hal etish</option>
                                <option value="Treninglar">Treninglar</option>
                                <option value="Boshqa">Boshqa</option>
                            </select>
                            <div class="bc-custom-sel" data-native="uz-request-type">
                                <div class="bc-sel-trigger">
                                    <span class="bc-sel-val">So'rov turini tanlang...</span>
                                    <svg class="bc-sel-ico" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>
                                </div>
                                <div class="bc-sel-panel">
                                    <div class="bc-sel-opt" data-val="FIDIC-maslahat">FIDIC-maslahat</div>
                                    <div class="bc-sel-opt" data-val="Nizolarni hal etish">Nizolarni hal etish</div>
                                    <div class="bc-sel-opt" data-val="Treninglar">Treninglar</div>
                                    <div class="bc-sel-opt" data-val="Boshqa">Boshqa</div>
                                </div>
                            </div>""",
        'stg_old': """<select name="project_stage" class="bc-input-uz bc-sel-uz" style="width:100%;box-sizing:border-box;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.05);border-radius:0.75rem;padding:0.75rem 1rem;color:#fff;font-size:0.9rem;font-family:Inter,sans-serif;outline:none;transition:all 0.3s ease;">
                                        <option value="" disabled selected>Bosqichni tanlang...</option>
                                        <option value="Qurilish">Qurilish</option>
                                        <option value="Yakunlash">Yakunlash</option>
                                        <option value="Kafolat muddati">Kafolat muddati</option>
                                        <option value="Yakundan keyin">Yakundan keyin</option>
                                    </select>""",
        'stg_new': """<select name="project_stage" id="uz-project-stage" style="display:none;">
                                        <option value="" disabled selected></option>
                                        <option value="Qurilish">Qurilish</option>
                                        <option value="Yakunlash">Yakunlash</option>
                                        <option value="Kafolat muddati">Kafolat muddati</option>
                                        <option value="Yakundan keyin">Yakundan keyin</option>
                                    </select>
                                    <div class="bc-custom-sel" data-native="uz-project-stage">
                                        <div class="bc-sel-trigger">
                                            <span class="bc-sel-val">Bosqichni tanlang...</span>
                                            <svg class="bc-sel-ico" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="6 9 12 15 18 9"/></svg>
                                        </div>
                                        <div class="bc-sel-panel">
                                            <div class="bc-sel-opt" data-val="Qurilish">Qurilish</div>
                                            <div class="bc-sel-opt" data-val="Yakunlash">Yakunlash</div>
                                            <div class="bc-sel-opt" data-val="Kafolat muddati">Kafolat muddati</div>
                                            <div class="bc-sel-opt" data-val="Yakundan keyin">Yakundan keyin</div>
                                        </div>
                                    </div>""",
    },
}


def replace_once(content, old, new, label):
    if old not in content:
        print(f'  WARN: not found -> {label}')
        return content
    result = content.replace(old, new, 1)
    print(f'  OK: {label}')
    return result


for lang, cfg in LANGS.items():
    print(f'\n=== [{lang.upper()}] {cfg["file"]} ===')
    with open(cfg['file'], 'r', encoding='utf-8') as f:
        content = f.read()
    orig_len = len(content)

    # 1. Fix services video poster path (white card bug)
    if cfg['poster_fix']:
        content = replace_once(
            content,
            'poster="poster-ultra.jpg" class="absolute inset-0 w-full h-full object-cover z-0 opacity-40">',
            'poster="../poster-ultra.jpg" class="absolute inset-0 w-full h-full object-cover z-0 opacity-40">',
            'services video poster path'
        )
        content = replace_once(
            content,
            '<link rel="preload" as="image" href="poster-ultra.jpg">',
            '<link rel="preload" as="image" href="../poster-ultra.jpg">',
            'preload poster-ultra href'
        )

    # 2. Fix EN textarea rows=4 -> rows=3
    if cfg['textarea_fix']:
        content = replace_once(
            content,
            '<textarea name="message" required rows="4"',
            '<textarea name="message" required rows="3"',
            'textarea rows=4 -> rows=3'
        )

    # 3. Add dropdown CSS (before @keyframes)
    if 'bc-custom-sel' not in content:
        content = replace_once(
            content,
            cfg['keyframe'],
            DROPDOWN_CSS + '\n' + cfg['keyframe'],
            'dropdown CSS injection'
        )
    else:
        print('  SKIP: dropdown CSS already present')

    # 4. Replace request_type select with custom dropdown
    if f'data-native="{lang}-request-type"' not in content:
        content = replace_once(content, cfg['req_old'], cfg['req_new'], 'request_type custom dropdown')
    else:
        print('  SKIP: request_type dropdown already present')

    # 5. Replace project_stage select with custom dropdown
    if f'data-native="{lang}-project-stage"' not in content:
        content = replace_once(content, cfg['stg_old'], cfg['stg_new'], 'project_stage custom dropdown')
    else:
        print('  SKIP: project_stage dropdown already present')

    # 6. Add dropdown JS (before change listener)
    if '// Custom dropdown init' not in content:
        content = replace_once(
            content,
            cfg['change_marker'],
            DROPDOWN_JS + '\n\n' + cfg['change_marker'],
            'dropdown JS injection'
        )
    else:
        print('  SKIP: dropdown JS already present')

    # 7. Add knowledge base (after BC_SYSTEM line ends)
    if 'var BC_KB=' not in content:
        idx = content.find(cfg['system_marker'])
        if idx == -1:
            print('  WARN: BC_SYSTEM marker not found for KB injection')
        else:
            line_end = content.find('\n', idx)
            content = content[:line_end+1] + cfg['kb'] + '\n' + content[line_end+1:]
            print('  OK: knowledge base injection')
    else:
        print('  SKIP: knowledge base already present')

    # 8. Replace catch error messages with KB lookup (replaces ALL occurrences)
    if 'bcLocalSearch(text)' not in content:
        old_msg = cfg['catch_msg']
        new_msg = cfg['catch_msg_new']
        count = content.count(old_msg)
        if count == 0:
            print(f'  WARN: catch message not found for KB fallback')
        else:
            content = content.replace(old_msg, new_msg)
            print(f'  OK: catch KB fallback ({count} occurrence(s))')
    else:
        print('  SKIP: KB fallback already in catch blocks')

    with open(cfg['file'], 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  Saved: {orig_len} -> {len(content)} chars')

print('\nAll done.')
