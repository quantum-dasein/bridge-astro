#!/usr/bin/env python3
"""
Upgrade FIDIC chat assistant across all 3 pages:
- Streaming responses (real-time typing effect)
- Markdown rendering in bot messages
- Quick reply chips
- Better system prompts (per language)
- Fix textarea scrollbar "палочка"
- Online status dot
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

FILES = {
    'ru': 'public/index.html',
    'en': 'public/EN/index.html',
    'uz': 'public/UZ/index.html',
}

API_KEY = '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'

SYSTEM_PROMPTS = {
    'ru': (
        r'Вы — профессиональный FIDIC-ассистент компании Bridge Consult.'
        r'\n\nBridge Consult — независимый консалтинговый лидер по инфраструктурным контрактам в Центральной Азии: контрактный инжиниринг FIDIC/EPC, управление претензиями, разрешение строительных споров (DAB/DAAB/арбитраж), обучение FIDIC. Клиенты: МФО (АБР, Всемирный банк, ЕБРР), государственные заказчики, международные подрядчики. Контакт: +998 33 000 15 30 | info@bridgeconsult.uz.'
        r'\n\nВАША ЭКСПЕРТИЗА:\n'
        r'• FIDIC: Red Book (MDB Harmonised), Yellow Book, Silver Book, White Book, Gold Book, Green Book, Emerald Book\n'
        r'• Контракты: EPC, EPC+F, NEC3/NEC4, MDB Harmonised\n'
        r'• Претензии: уведомления FIDIC, Extension of Time (EOT), Loss & Expense\n'
        r'• Споры: DAB, DAAB, ICC/UNCITRAL арбитраж, медиация\n'
        r'• Форензик-анализ задержек (FDA): CPM, Windows, Time Impact Analysis (TIA)\n'
        r'• DAAB (FIDIC 2017): функции, назначение, процедуры, решения'
        r'\n\nСТИЛЬ:\n'
        r'— Чёткие вопросы: конкретный ответ 2–4 предложения\n'
        r'— Сравнения/списки: структурированный ответ с ключевыми различиями\n'
        r'— Расчёты, проверка документов, сложные правовые кейсы: рекомендовать консультацию +998 33 000 15 30\n'
        r'— Отвечать на языке вопроса. Без вступлений. Профессионально и по делу.'
    ),
    'en': (
        r'You are a professional FIDIC expert assistant for Bridge Consult.'
        r'\n\nBridge Consult is a leading independent consultancy in Central Asia specializing in infrastructure contract management, contract engineering, claims, dispute resolution (DAB/DAAB/arbitration), and FIDIC training. Clients include MDBs (ADB, World Bank, EBRD), government entities, and international contractors. Contact: +998 33 000 15 30 | info@bridgeconsult.uz.'
        r'\n\nYOUR EXPERTISE:\n'
        r'• FIDIC: Red Book (MDB Harmonised), Yellow Book, Silver Book, White Book, Gold Book, Green Book, Emerald Book\n'
        r'• Contracts: EPC, EPC+F, NEC3/NEC4, MDB Harmonised\n'
        r'• Claims: FIDIC notices, Extension of Time (EOT), Loss & Expense, Time at Large\n'
        r'• Disputes: DAB, DAAB, ICC/UNCITRAL arbitration, mediation, adjudication\n'
        r'• Forensic Delay Analysis (FDA): CPM, Windows, Time Impact Analysis (TIA), Collapsed As-Built\n'
        r'• DAAB (FIDIC 2017): functions, appointment, procedures, decisions'
        r'\n\nSTYLE:\n'
        r'— Clear technical questions: precise answer in 2–4 sentences\n'
        r'— Comparisons/lists: structured format with key points\n'
        r'— Document review, complex legal cases: recommend direct consultation +998 33 000 15 30\n'
        r'— Respond in the user\'s language. No preamble. Professional and to the point.'
    ),
    'uz': (
        r'Siz Bridge Consult kompaniyasining professional FIDIC ekspert yordamchisisiz.'
        r'\n\nBridge Consult — Markaziy Osiyodagi yetakchi mustaqil konsalting kompaniya: infratuzilma shartnomalarini boshqarish, FIDIC/EPC shartnoma muhandisligi, da\'volarni boshqarish, nizolarni hal etish (DAB/DAAB/arbitraj), FIDIC treninglari. Mijozlar: MDB (ADB, Jahon Banki, EBRD), davlat buyurtmachilari, xalqaro pudratchilar. Aloqa: +998 33 000 15 30 | info@bridgeconsult.uz.'
        r'\n\nMUTAXASSISLIK SOHALARI:\n'
        r'• FIDIC: Red Book (MDB Harmonised), Yellow Book, Silver Book, White Book, Gold Book, Green Book, Emerald Book\n'
        r'• Shartnomalar: EPC, EPC+F, NEC3/NEC4, MDB Harmonised\n'
        r'• Da\'volar: FIDIC bildirishnomalar, Muddatni uzaytirish (EOT), Zarar va Xarajatlar\n'
        r'• Nizolar: DAB, DAAB, ICC/UNCITRAL arbitraj, mediatsiya\n'
        r'• Kechikish tahlili (FDA): CPM, Windows tahlili, Time Impact Analysis (TIA)\n'
        r'• DAAB (FIDIC 2017): vazifalari, tayinlanishi, tartiblari'
        r'\n\nJAVOB USLUBI:\n'
        r'— Aniq savollarga: 2–4 jumlada professional javob\n'
        r'— Taqqoslash/ro\'yxatlar: asosiy farqlar ko\'rsatilgan tuzilma\n'
        r'— Murakkab huquqiy holatlar: Bridge Consult bilan maslahat tavsiya +998 33 000 15 30\n'
        r'— Foydalanuvchi tilida javob bering. Ortiqcha so\'zboshi yo\'q. Professional va lo\'nda.'
    ),
}

WELCOME_MSGS = {
    'ru': "Привет! Задайте любой вопрос о контрактах FIDIC — отвечу быстро. Для сложных кейсов помогу связаться с командой Bridge Consult.",
    'en': "Hello! Ask me anything about FIDIC contracts, dispute resolution, or Bridge Consult services. For complex cases, I'll connect you with our experts.",
    'uz': "Salom! FIDIC shartnomalari, nizo hal etish yoki Bridge Consult xizmatlari haqida savol bering. Murakkab holatlarda mutaxassislarimiz bilan bog'layman.",
}

QUICK_REPLIES = {
    'ru': [
        ("Red vs Yellow Book", "Чем Red Book отличается от Yellow Book?"),
        ("Что такое DAAB?", "Что такое DAAB и как он работает?"),
        ("Silver Book — когда?", "Когда применяется Silver Book?"),
    ],
    'en': [
        ("Red vs Yellow Book", "What is the difference between Red Book and Yellow Book?"),
        ("What is a DAAB?", "What is a DAAB and how does it work?"),
        ("When Silver Book?", "When is Silver Book used instead of Yellow?"),
    ],
    'uz': [
        ("Red vs Yellow Book", "Red Book va Yellow Book farqi nima?"),
        ("DAAB nima?", "DAAB nima va u qanday ishlaydi?"),
        ("Silver Book qachon?", "Silver Book qachon qo'llaniladi?"),
    ],
}

BTN_LABELS = {
    'ru': 'Ассистент',
    'en': 'Assistant',
    'uz': 'Yordamchi',
}

BTN_ARIA = {
    'ru': 'Задать вопрос о FIDIC',
    'en': 'Ask about FIDIC',
    'uz': 'FIDIC haqida savol bering',
}

PANEL_ARIA = {
    'ru': 'FIDIC чат-ассистент',
    'en': 'FIDIC chat assistant',
    'uz': 'FIDIC chat yordamchisi',
}

HEAD_TITLE = {
    'ru': 'FIDIC Ассистент',
    'en': 'FIDIC Assistant',
    'uz': 'FIDIC Yordamchi',
}

CLOSE_ARIA = {
    'ru': 'Закрыть',
    'en': 'Close',
    'uz': 'Yopish',
}

SEND_ARIA = {
    'ru': 'Отправить',
    'en': 'Send',
    'uz': 'Yuborish',
}

PLACEHOLDER = {
    'ru': 'Чем отличается Yellow Book от Red?',
    'en': 'How does Yellow Book differ from Red Book?',
    'uz': 'Yellow Book va Red Book farqi?',
}

ERR_CONN = {
    'ru': 'Ошибка связи. Позвоните нам: +998 33 000 15 30',
    'en': 'Connection error. Please call us: +998 33 000 15 30',
    'uz': 'Ulanish xatosi. Bizga qo\'ng\'iroq qiling: +998 33 000 15 30',
}

ERR_RESP = {
    'ru': 'Не удалось получить ответ. Позвоните нам: +998 33 000 15 30',
    'en': 'Could not get a response. Please call: +998 33 000 15 30',
    'uz': 'Javob olishning iloji bo\'lmadi. Qo\'ng\'iroq qiling: +998 33 000 15 30',
}


def build_assistant(lang):
    sys_prompt = SYSTEM_PROMPTS[lang]
    welcome = WELCOME_MSGS[lang].replace("'", "\\'")
    quick_replies = QUICK_REPLIES[lang]
    qr_html = '\n        '.join(
        f'<button class="bc-qr" onclick="bcQuickReply(\'{q[1]}\')">{q[0]}</button>'
        for q in quick_replies
    )

    err_conn = ERR_CONN[lang].replace("'", "\\'")
    err_resp = ERR_RESP[lang].replace("'", "\\'")

    css = """\
<style>
#bc-chat-btn{position:fixed;bottom:9rem;right:1.5rem;z-index:9980;display:flex;align-items:center;gap:.5rem;background:#292724;color:#F5F4F2;border:1px solid rgba(138,123,102,.4);border-radius:9999px;padding:.65rem 1.1rem .65rem .85rem;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,.35);transition:background .25s,border-color .25s,transform .2s;user-select:none;}
#bc-chat-btn:hover{background:#8A7B66;border-color:#8A7B66;transform:translateY(-2px);}
#bc-chat-btn svg{flex-shrink:0;opacity:.85;}
#bc-chat-panel{position:fixed;bottom:0;right:1.5rem;z-index:9981;width:360px;max-width:calc(100vw - 2rem);background:#1e1c1a;border:1px solid rgba(138,123,102,.25);border-bottom:none;border-radius:1.25rem 1.25rem 0 0;box-shadow:0 -12px 60px rgba(0,0,0,.5);display:none;flex-direction:column;overflow:hidden;font-family:inherit;}
#bc-chat-head{display:flex;align-items:center;gap:.75rem;padding:.875rem 1.1rem;background:#292724;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0;}
#bc-chat-head-ico{width:32px;height:32px;border-radius:9999px;background:rgba(138,123,102,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;}
#bc-chat-head-ico::after{content:'';position:absolute;bottom:1px;right:1px;width:8px;height:8px;background:#4ade80;border-radius:9999px;border:2px solid #292724;box-shadow:0 0 5px rgba(74,222,128,.5);}
#bc-chat-head-title{flex:1;min-width:0;}
#bc-chat-head-title b{display:block;color:#F5F4F2;font-size:13px;font-weight:700;}
#bc-chat-head-title span{color:rgba(245,244,242,.4);font-size:10px;font-weight:500;letter-spacing:.04em;}
#bc-chat-close{background:none;border:none;color:rgba(245,244,242,.4);cursor:pointer;padding:4px;border-radius:6px;display:flex;transition:color .2s;}
#bc-chat-close:hover{color:#F5F4F2;}
#bc-chat-msgs{flex:1;overflow-y:auto;padding:.875rem 1rem;display:flex;flex-direction:column;gap:.6rem;min-height:280px;max-height:320px;scroll-behavior:smooth;}
#bc-chat-msgs::-webkit-scrollbar{width:3px;}
#bc-chat-msgs::-webkit-scrollbar-track{background:transparent;}
#bc-chat-msgs::-webkit-scrollbar-thumb{background:transparent;border-radius:9999px;transition:background .3s;}
#bc-chat-msgs:hover::-webkit-scrollbar-thumb{background:rgba(138,123,102,.3);}
.bc-msg{max-width:88%;padding:.6rem .875rem;border-radius:1rem;font-size:13px;line-height:1.55;animation:bcMsgIn .2s ease;}
.bc-msg-bot{align-self:flex-start;background:#2e2b28;color:rgba(245,244,242,.85);border-bottom-left-radius:.25rem;}
.bc-msg-user{align-self:flex-end;background:#8A7B66;color:#fff;border-bottom-right-radius:.25rem;}
.bc-msg-bot ul,.bc-msg-bot ol{padding-left:1.3em;margin:.3em 0 .3em;}
.bc-msg-bot li{margin-bottom:.2em;}
.bc-msg-bot strong{color:#F5F4F2;font-weight:700;}
.bc-msg-typing{align-self:flex-start;display:flex;gap:4px;align-items:center;padding:.6rem .875rem;background:#2e2b28;border-radius:1rem;border-bottom-left-radius:.25rem;}
.bc-dot{width:6px;height:6px;background:rgba(245,244,242,.4);border-radius:9999px;animation:bcDot 1.2s infinite;}
.bc-dot:nth-child(2){animation-delay:.2s;}.bc-dot:nth-child(3){animation-delay:.4s;}
@keyframes bcDot{0%,80%,100%{transform:scale(.8);opacity:.4;}40%{transform:scale(1);opacity:1;}}
@keyframes bcMsgIn{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}
#bc-quick{padding:.5rem 1rem .65rem;display:flex;flex-wrap:wrap;gap:.4rem;border-bottom:1px solid rgba(255,255,255,.05);}
.bc-qr{background:rgba(138,123,102,.12);border:1px solid rgba(138,123,102,.25);color:rgba(245,244,242,.7);font-size:11px;padding:.35rem .7rem;border-radius:9999px;cursor:pointer;transition:all .2s;font-family:inherit;line-height:1.3;}
.bc-qr:hover{background:rgba(138,123,102,.28);border-color:#8A7B66;color:#F5F4F2;}
#bc-chat-foot{padding:.6rem .75rem;border-top:1px solid rgba(255,255,255,.07);display:flex;gap:.5rem;align-items:flex-end;flex-shrink:0;}
#bc-chat-input{flex:1;background:#2e2b28;border:1px solid rgba(138,123,102,.2);border-radius:.75rem;padding:.55rem .8rem;color:#F5F4F2;font-family:inherit;font-size:13px;resize:none;max-height:90px;min-height:38px;outline:none;transition:border-color .2s;overflow-y:auto;scrollbar-width:none;}
#bc-chat-input::-webkit-scrollbar{display:none;}
#bc-chat-input:focus{border-color:rgba(138,123,102,.5);}
#bc-chat-input::placeholder{color:rgba(245,244,242,.3);}
#bc-chat-send{background:#8A7B66;border:none;color:#fff;width:36px;height:36px;border-radius:.625rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s,transform .15s;}
#bc-chat-send:hover{background:#7a6d5b;transform:scale(1.05);}
#bc-chat-send:disabled{background:rgba(138,123,102,.3);cursor:default;transform:none;}
</style>"""

    btn_label = BTN_LABELS[lang]
    btn_aria = BTN_ARIA[lang]
    panel_aria = PANEL_ARIA[lang]
    head_title = HEAD_TITLE[lang]
    close_aria = CLOSE_ARIA[lang]
    send_aria = SEND_ARIA[lang]
    placeholder = PLACEHOLDER[lang]

    html = f"""\
<button id="bc-chat-btn" aria-label="{btn_aria}" onclick="bcToggle()">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    {btn_label}
</button>

<div id="bc-chat-panel" role="dialog" aria-label="{panel_aria}">
    <div id="bc-chat-head">
        <div id="bc-chat-head-ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A7B66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div id="bc-chat-head-title">
            <b>{head_title}</b>
            <span>Bridge Consult · Powered by Claude</span>
        </div>
        <button id="bc-chat-close" onclick="bcToggle()" aria-label="{close_aria}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
    </div>
    <div id="bc-chat-msgs" aria-live="polite"></div>
    <div id="bc-quick">
        {qr_html}
    </div>
    <div id="bc-chat-foot">
        <textarea id="bc-chat-input" placeholder="{placeholder}" rows="1" onkeydown="bcKey(event)" oninput="bcAutoSize(this)"></textarea>
        <button id="bc-chat-send" onclick="bcSend()" aria-label="{send_aria}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
    </div>
</div>"""

    js = f"""\
<script>
(function(){{
    var BC_API_KEY = '{API_KEY}';
    var BC_MODEL = 'claude-haiku-4-5';
    var BC_SYSTEM = '{sys_prompt}';
    var msgs = [], open = false;
    var panel = document.getElementById('bc-chat-panel');
    var msgsEl = document.getElementById('bc-chat-msgs');

    function bcInit() {{
        if (msgsEl.children.length === 0) bcAddMsg('bot', '{welcome}');
    }}

    window.bcToggle = function() {{
        open = !open;
        panel.style.display = open ? 'flex' : 'none';
        document.body.classList.toggle('chat-open', open);
        if (open) {{ bcInit(); setTimeout(function(){{ document.getElementById('bc-chat-input').focus(); }}, 100); }}
    }};

    window.bcKey = function(e) {{ if (e.key === 'Enter' && !e.shiftKey) {{ e.preventDefault(); bcSend(); }} }};

    window.bcAutoSize = function(el) {{
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 90) + 'px';
    }};

    window.bcQuickReply = function(text) {{
        var qr = document.getElementById('bc-quick');
        if (qr) qr.style.display = 'none';
        var input = document.getElementById('bc-chat-input');
        input.value = text;
        bcSend();
    }};

    function bcMarkdown(text) {{
        var s = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        s = s.replace(/\\*\\*(.*?)\\*\\*/gs,'<strong>$1</strong>');
        s = s.replace(/\\*(.*?)\\*/gs,'<em>$1</em>');
        s = s.replace(/^[\\u2022\\-]\\s(.+)/gm,'<li>$1</li>');
        s = s.replace(/((?:<li>.*<\\/li>\\n?)+)/g,'<ul>$1</ul>');
        s = s.replace(/\\n\\n+/g,'<br><br>');
        s = s.replace(/\\n/g,'<br>');
        return s;
    }}

    window.bcSend = function() {{
        var qr = document.getElementById('bc-quick');
        if (qr) qr.style.display = 'none';
        var input = document.getElementById('bc-chat-input');
        var text = input.value.trim();
        if (!text) return;
        if (!BC_API_KEY) {{ bcAddMsg('bot', '{err_resp}'); return; }}
        bcAddMsg('user', text);
        msgs.push({{ role: 'user', content: text }});
        input.value = ''; input.style.height = 'auto';
        document.getElementById('bc-chat-send').disabled = true;
        var typingId = bcAddTyping();
        fetch('https://api.anthropic.com/v1/messages', {{
            method: 'POST',
            headers: {{
                'Content-Type': 'application/json',
                'x-api-key': BC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-allow-browser': 'true'
            }},
            body: JSON.stringify({{ model: BC_MODEL, max_tokens: 800, system: BC_SYSTEM, messages: msgs.slice(-10), stream: true }})
        }})
        .then(function(response) {{
            bcRemoveTyping(typingId);
            if (!response.ok) {{
                bcAddMsg('bot', '{err_resp}');
                document.getElementById('bc-chat-send').disabled = false;
                document.getElementById('bc-chat-input').focus();
                return;
            }}
            var reader = response.body.getReader();
            var decoder = new TextDecoder();
            var msgEl = bcAddMsg('bot', '');
            var fullText = '', buf = '';
            function read() {{
                reader.read().then(function(res) {{
                    if (res.done) {{
                        if (fullText) msgs.push({{ role: 'assistant', content: fullText }});
                        document.getElementById('bc-chat-send').disabled = false;
                        document.getElementById('bc-chat-input').focus();
                        return;
                    }}
                    buf += decoder.decode(res.value, {{ stream: true }});
                    var lines = buf.split('\\n'); buf = lines.pop();
                    lines.forEach(function(line) {{
                        if (!line.startsWith('data: ')) return;
                        var d = line.slice(6).trim();
                        if (!d || d === '[DONE]') return;
                        try {{
                            var ev = JSON.parse(d);
                            if (ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta') {{
                                fullText += ev.delta.text;
                                msgEl.innerHTML = bcMarkdown(fullText);
                                msgsEl.scrollTop = msgsEl.scrollHeight;
                            }}
                        }} catch(e) {{}}
                    }});
                    read();
                }}).catch(function() {{
                    document.getElementById('bc-chat-send').disabled = false;
                    document.getElementById('bc-chat-input').focus();
                    if (!fullText && msgEl.parentNode) {{
                        msgEl.parentNode.removeChild(msgEl);
                        bcAddMsg('bot', '{err_conn}');
                    }}
                }});
            }}
            read();
        }})
        .catch(function() {{
            bcRemoveTyping(typingId);
            bcAddMsg('bot', '{err_conn}');
            document.getElementById('bc-chat-send').disabled = false;
            document.getElementById('bc-chat-input').focus();
        }});
    }};

    function bcAddMsg(type, text) {{
        var el = document.createElement('div');
        el.className = 'bc-msg bc-msg-' + (type === 'bot' ? 'bot' : 'user');
        if (type === 'bot') el.innerHTML = bcMarkdown(text);
        else el.textContent = text;
        msgsEl.appendChild(el);
        msgsEl.scrollTop = msgsEl.scrollHeight;
        return el;
    }}

    function bcAddTyping() {{
        var id = 'bc-typing-' + Date.now();
        var el = document.createElement('div');
        el.className = 'bc-msg-typing'; el.id = id;
        el.innerHTML = '<span class="bc-dot"></span><span class="bc-dot"></span><span class="bc-dot"></span>';
        msgsEl.appendChild(el);
        msgsEl.scrollTop = msgsEl.scrollHeight;
        return id;
    }}

    function bcRemoveTyping(id) {{
        var el = document.getElementById(id);
        if (el) el.remove();
    }}
}})();
</script>"""

    return css + '\n\n' + html + '\n\n' + js


# Find and replace the assistant block in each file
START_MARKER = '<style>\n#bc-chat-btn{'
# The old (minified) marker in EN/UZ
START_MARKER_MINIFIED = '<style>\n#bc-chat-btn{'

COOKIE_MARKER = '\n<!-- Cookie consent banner -->'

for lang, path in FILES.items():
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find start of assistant block (the <style> just before #bc-chat-btn)
    # We look for the CSS block that starts with #bc-chat-btn
    idx_start = content.find('<style>\n#bc-chat-btn{')
    if idx_start == -1:
        print(f'[{lang}] WARN: could not find assistant CSS start marker')
        continue

    # Find end: the </script> that is followed by Cookie banner
    idx_cookie = content.find(COOKIE_MARKER)
    if idx_cookie == -1:
        print(f'[{lang}] WARN: could not find cookie banner marker')
        continue

    # Find the last </script> before the cookie banner
    idx_end = content.rfind('</script>', idx_start, idx_cookie)
    if idx_end == -1:
        print(f'[{lang}] WARN: could not find </script> before cookie banner')
        continue

    idx_end += len('</script>')

    old_block = content[idx_start:idx_end]
    new_block = build_assistant(lang)

    content = content[:idx_start] + new_block + content[idx_end:]

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f'[{lang}] Upgraded assistant ({len(old_block)} chars -> {len(new_block)} chars). Saved {path}')

print('\nAll done.')
