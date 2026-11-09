// Логика сайта

const THEME_STORAGE_KEY = 'bc-theme';

function isDarkTheme() {
    return document.documentElement.classList.contains('dark-theme');
}

function applyTheme(theme) {
    const dark = theme === 'dark';
    document.documentElement.classList.toggle('dark-theme', dark);
    localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
    updateThemeIcons();
}

function updateThemeIcons() {
    const dark = isDarkTheme();
    const pairs = [
        ['theme-toggle-dark-icon', 'theme-toggle-light-icon'],
        ['mobile-theme-toggle-dark-icon', 'mobile-theme-toggle-light-icon'],
    ];
    pairs.forEach(([moonId, sunId]) => {
        const moon = document.getElementById(moonId);
        const sun = document.getElementById(sunId);
        if (moon) moon.classList.toggle('hidden', dark);
        if (sun) sun.classList.toggle('hidden', !dark);
    });
}

function initThemeToggle() {
    updateThemeIcons();

    const toggle = () => applyTheme(isDarkTheme() ? 'light' : 'dark');

    document.getElementById('theme-toggle')?.addEventListener('click', toggle);
    document.getElementById('mobile-theme-toggle')?.addEventListener('click', toggle);
}

function initPortfolioPhotoToggle() {
    document.querySelectorAll('#portfolio .portfolio-photo-card').forEach((card) => {
        const photoWrap = card.querySelector('.relative.overflow-hidden');
        if (!photoWrap) return;

        photoWrap.addEventListener('click', (e) => {
            e.stopPropagation();
            card.classList.toggle('photo-bw');
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initPortfolioPhotoToggle();

    // Умная шапка (сжимается при скролле; в тёмной теме не подменяем фон на белый)
    const header = document.querySelector('header');
    if (header) {
        // Классы трогаем только когда состояние реально сменилось и не чаще кадра:
        // раньше обработчик дёргал DOM на каждое событие прокрутки.
        let scrolled = null;
        let queued = false;
        const sync = () => {
            queued = false;
            const now = window.scrollY > 50;
            if (now === scrolled) return;
            scrolled = now;
            header.classList.toggle('header-scrolled', now);
            if (isDarkTheme()) return;
            if (now) header.classList.replace('bg-white/95', 'bg-white');
            else header.classList.replace('bg-white', 'bg-white/95');
        };
        window.addEventListener('scroll', () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(sync);
        }, { passive: true });
        sync();
    }
});

// Запуск «после прелоадера»: пока он на экране, анимации под ним не проигрываем
function bcAfterPreloader(fn) {
    let done = false;
    const run = () => { if (done) return; done = true; fn(); };
    if (document.documentElement.classList.contains('pl-on')) {
        window.addEventListener('bc:reveal', run);
        setTimeout(run, 7000);
    } else {
        run();
    }
}

// Плавная анимация для аккордеона
document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion-btn');

    accordions.forEach(button => {
        button.addEventListener('click', () => {
            const item = button.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.vertical-line');
            
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('is-open')) {
                    otherItem.classList.remove('is-open');
                    otherItem.querySelector('.accordion-content').style.gridTemplateRows = '0fr';
                    otherItem.querySelector('.vertical-line').style.transform = 'scaleY(1)';
                    otherItem.classList.remove('border-bridge-taupe');
                }
            });

            if (item.classList.contains('is-open')) {
                item.classList.remove('is-open');
                content.style.gridTemplateRows = '0fr';
                icon.style.transform = 'scaleY(1)';
                item.classList.remove('border-bridge-taupe');
            } else {
                item.classList.add('is-open');
                content.style.gridTemplateRows = '1fr';
                icon.style.transform = 'scaleY(0)'; 
                item.classList.add('border-bridge-taupe');
            }
        });
    });
});

// Логика переключения мобильного меню
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('translate-x-0');
            if (isOpen) {
                mobileMenu.classList.replace('translate-x-0', 'translate-x-full');
                document.body.style.overflow = 'auto';
                
                document.querySelector('.burger-line-1').style.transform = 'none';
                document.querySelector('.burger-line-2').style.opacity = '1';
                document.querySelector('.burger-line-3').style.transform = 'none';
            } else {
                mobileMenu.classList.replace('translate-x-full', 'translate-x-0');
                document.body.style.overflow = 'hidden';
                
                document.querySelector('.burger-line-1').style.transform = 'rotate(45deg) scaleX(1.2)';
                document.querySelector('.burger-line-2').style.opacity = '0';
                document.querySelector('.burger-line-3').style.transform = 'rotate(-45deg) scaleX(1.2)';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.replace('translate-x-0', 'translate-x-full');
                document.body.style.overflow = 'auto';
                document.querySelector('.burger-line-1').style.transform = 'none';
                document.querySelector('.burger-line-2').style.opacity = '1';
                document.querySelector('.burger-line-3').style.transform = 'none';
            });
        });
    }
});

// Анимация счетчиков
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2500;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!counters.length) return;

    // Каждый счётчик считает один раз и только свой. Раньше появление любого
    // из них перезапускало все четыре — на телефоне цифры прыгали обратно к нулю.
    const animateCounter = (counter) => {
        if (counter.dataset.counted) return;
        counter.dataset.counted = '1';
        const target = +counter.getAttribute('data-target');
        if (prefersReduced) { counter.textContent = target; return; }
        const startTime = performance.now();

        const step = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / animationDuration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const value = String(progress < 1 ? Math.floor(easeProgress * target) : target);
            if (counter.textContent !== value) counter.textContent = value;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    bcAfterPreloader(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => observer.observe(counter));
    });
});

/// --- ЛОГИКА КНОПКИ "ЧИТАТЬ ПОЛНОСТЬЮ" ДЛЯ МОБИЛЬНЫХ ---
document.addEventListener('DOMContentLoaded', () => {
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const container = e.target.closest('.team-desc-container');
            const content = container.querySelector('.team-content');
            const overlay = container.querySelector('.fade-overlay');
            
            const textMore = btn.getAttribute('data-more') || 'Читать полностью ↓';
            const textLess = btn.getAttribute('data-less') || 'Скрыть ↑';
            
            if (content.classList.contains('max-h-[140px]')) {
                content.classList.remove('max-h-[140px]');
                content.classList.add('max-h-[2000px]');
                overlay.style.opacity = '0';
                e.target.innerHTML = textLess;
            } else {
                content.classList.remove('max-h-[2000px]');
                content.classList.add('max-h-[140px]');
                overlay.style.opacity = '1';
                e.target.innerHTML = textMore;
                
                setTimeout(() => {
                    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    });
}); // <--- ТУТ БЫЛА СИНТАКСИЧЕСКАЯ ОШИБКА, СЕЙЧАС ВСЕ ЧИСТО

// Прогресс-бар прокрутки страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('scroll-progress-bar')) return;

    const bar = document.createElement('div');
    bar.id = 'scroll-progress-bar';
    bar.style.cssText = [
        'position:fixed',
        'top:0',
        'left:0',
        'height:3px',
        'width:100%',
        'transform:scaleX(0)',
        'transform-origin:0 50%',
        'background:linear-gradient(90deg,#8A7B66,#D4C3A3)',
        'z-index:2147483647',
        'pointer-events:none',
        'will-change:transform'
    ].join(';');
    document.body.appendChild(bar);

    let ticking = false;
    function update() {
        const doc = document.documentElement;
        const scrollable = (doc.scrollHeight - doc.clientHeight) || 1;
        const ratio = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
        bar.style.transform = 'scaleX(' + ratio + ')';
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
});

// Плавающая кнопка Telegram
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tg-float-btn')) return;

    const btn = document.createElement('a');
    btn.id = 'tg-float-btn';
    btn.href = 'https://t.me/fidicuzb';
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', 'Telegram-канал FIDIC Uzbekistan');
    btn.style.cssText = [
        'position:fixed',
        'right:24px',
        'bottom:80px',
        'width:48px',
        'height:48px',
        'border-radius:50%',
        'border:1px solid rgba(138,123,102,0.35)',
        'background:rgba(26,24,22,0.72)',
        '-webkit-backdrop-filter:blur(8px)',
        'backdrop-filter:blur(8px)',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'cursor:pointer',
        'z-index:99989',
        'box-shadow:0 8px 24px -8px rgba(0,0,0,0.5)',
        'transition:background .3s ease',
        'text-decoration:none'
    ].join(';');
    btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#D4C3A3" style="position:relative;z-index:1"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>';
    document.body.appendChild(btn);

    btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(138,123,102,0.9)'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(26,24,22,0.72)'; });
});

// Кнопка "Наверх" с кольцом прогресса прокрутки
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('back-to-top')) return;

    const RADIUS = 21;
    const CIRC = 2 * Math.PI * RADIUS;

    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Наверх');
    btn.style.cssText = [
        'position:fixed',
        'right:24px',
        'bottom:24px',
        'width:48px',
        'height:48px',
        'border-radius:50%',
        'border:1px solid rgba(138,123,102,0.35)',
        'background:rgba(26,24,22,0.72)',
        '-webkit-backdrop-filter:blur(8px)',
        'backdrop-filter:blur(8px)',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'cursor:pointer',
        'opacity:0',
        'visibility:hidden',
        'transform:translateY(12px)',
        'transition:opacity .35s ease, transform .35s ease, visibility .35s ease',
        'z-index:99990',
        'box-shadow:0 8px 24px -8px rgba(0,0,0,0.5)'
    ].join(';');

    btn.innerHTML =
        '<svg width="48" height="48" viewBox="0 0 48 48" style="position:absolute;inset:0;transform:rotate(-90deg);">' +
        '<circle cx="24" cy="24" r="' + RADIUS + '" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2"></circle>' +
        '<circle id="btt-ring" cx="24" cy="24" r="' + RADIUS + '" fill="none" stroke="#8A7B66" stroke-width="2" stroke-linecap="round" stroke-dasharray="' + CIRC + '" stroke-dashoffset="' + CIRC + '" style="transition:stroke-dashoffset .1s linear"></circle>' +
        '</svg>' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4C3A3" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="position:relative;z-index:1;"><path d="M12 19V5"></path><path d="M5 12l7-7 7 7"></path></svg>';

    document.body.appendChild(btn);

    const ring = btn.querySelector('#btt-ring');
    const footer = document.querySelector('footer');

    function updateBtn() {
        const doc = document.documentElement;
        const scrollable = (doc.scrollHeight - doc.clientHeight) || 1;
        const ratio = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
        if (ring) ring.style.strokeDashoffset = (CIRC * (1 - ratio)).toString();

        let nearFooter = false;
        if (footer) {
            nearFooter = footer.getBoundingClientRect().top < window.innerHeight - 40;
        }
        const show = window.scrollY > 400 && !nearFooter;
        if (show) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
            btn.style.transform = 'translateY(0)';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
            btn.style.transform = 'translateY(12px)';
        }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => { updateBtn(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });
    window.addEventListener('resize', updateBtn, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(138,123,102,0.9)'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(26,24,22,0.72)'; });
    updateBtn();
});

// Scrollspy — подсветка активного раздела в nav при прокрутке
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!navLinks.length) return;

    const targets = [...navLinks]
        .map(l => document.getElementById(l.getAttribute('href').slice(1)))
        .filter(Boolean);
    if (!targets.length) return;

    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
            });
        });
    }, { threshold: 0.25, rootMargin: '-80px 0px -55% 0px' });

    targets.forEach(t => spy.observe(t));
});

// Копирование телефона/email в буфер обмена
function showCopyToast(msg) {
    const prev = document.getElementById('copy-toast');
    if (prev) prev.remove();
    const toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.textContent = msg;
    toast.style.cssText = [
        'position:fixed',
        'bottom:160px',
        'right:24px',
        'background:#8A7B66',
        'color:#fff',
        'padding:8px 18px',
        'border-radius:20px',
        'font-size:13px',
        'font-weight:500',
        'font-family:Inter,sans-serif',
        'z-index:99999',
        'opacity:0',
        'transform:translateY(8px)',
        'transition:opacity .25s,transform .25s',
        'pointer-events:none',
        'white-space:nowrap',
        'box-shadow:0 4px 16px rgba(0,0,0,0.3)'
    ].join(';');
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-copy]').forEach(el => {
        el.style.cursor = 'copy';
        el.addEventListener('click', () => {
            const text = el.getAttribute('data-copy');
            const label = el.getAttribute('data-copy-label') || 'Скопировано ✓';
            if (!navigator.clipboard) return;
            navigator.clipboard.writeText(text).then(() => showCopyToast(label)).catch(() => {});
        });
    });
});

// Клавиша Escape — закрыть модальное окно и мобильное меню
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    const modal = document.getElementById('projectModal');
    if (modal && !modal.classList.contains('hidden') && typeof window.closeModal === 'function') {
        window.closeModal();
    }

    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('translate-x-0')) {
        mobileMenu.classList.replace('translate-x-0', 'translate-x-full');
        document.body.style.overflow = 'auto';
        const l1 = document.querySelector('.burger-line-1');
        const l2 = document.querySelector('.burger-line-2');
        const l3 = document.querySelector('.burger-line-3');
        if (l1) l1.style.transform = 'none';
        if (l2) { l2.style.opacity = '1'; l2.style.transform = 'none'; }
        if (l3) l3.style.transform = 'none';
    }
});

// Lazy-load карты (IntersectionObserver — src проставляется только при попадании в экран)
document.addEventListener('DOMContentLoaded', () => {
    const mapIframe = document.getElementById('map-iframe');
    if (!mapIframe) return;
    new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            mapIframe.src = mapIframe.dataset.src || '';
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.1 }).observe(mapIframe);
});

// Lazy-load model-viewer (откладывает загрузку GLB до появления элемента в экране)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('model-viewer[data-src]').forEach(mv => {
        new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                mv.setAttribute('src', mv.dataset.src);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.1 }).observe(mv);
    });
});

// ── Cookie consent + Google Analytics (GDPR) ──────────────────────────────
(function () {
    var GA_ID = 'G-E5LN1D6KVN';
    var STORAGE_KEY = 'bc-cookie';

    function loadGA() {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '1') loadGA();

    window.cookieAccept = function () {
        localStorage.setItem(STORAGE_KEY, '1');
        var b = document.getElementById('cookie-banner');
        if (b) { b.style.opacity = '0'; setTimeout(function () { b.remove(); }, 300); }
        loadGA();
    };
    window.cookieDecline = function () {
        localStorage.setItem(STORAGE_KEY, '0');
        var b = document.getElementById('cookie-banner');
        if (b) { b.style.opacity = '0'; setTimeout(function () { b.remove(); }, 300); }
    };

    if (!stored) {
        document.addEventListener('DOMContentLoaded', function () {
            var b = document.getElementById('cookie-banner');
            if (b) { b.style.display = 'flex'; }
        });
    }
}());

// ══ Главная v2: живые эффекты. Работают только на body.bc-home ══════════════

// Сетка узлов на 2D-canvas — замена three.js + Vanta в блоке FAQ.
// Рисует только пока блок на экране и вкладка активна.
function bcNet(host, reduce) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const LINK = 165;
    const section = host.closest('section') || host;
    let w = 0, h = 0, nodes = [], raf = 0, sizeRaf = 0, onScreen = false, last = 0;
    let px = -9999, py = -9999;

    const make = () => {
        const z = 0.35 + Math.random() * 0.65; // «глубина»: дальние узлы мельче, бледнее и медленнее
        const a = Math.random() * Math.PI * 2;
        const sp = (0.07 + Math.random() * 0.17) * z;
        return { x: Math.random() * w, y: Math.random() * h, z, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp };
    };

    function draw(dt) {
        ctx.clearRect(0, 0, w, h);
        for (const n of nodes) {
            n.x += n.vx * dt; n.y += n.vy * dt;
            if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
            if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
            const dx = n.x - px, dy = n.y - py, d2 = dx * dx + dy * dy;
            if (d2 < 16900 && d2 > 1) { // курсор мягко расталкивает узлы
                const d = Math.sqrt(d2), f = (130 - d) / 130 * 0.7 * dt;
                n.x += dx / d * f; n.y += dy / d * f;
            }
        }
        // Поверх холста лежит затемняющий градиент секции, поэтому рисуем
        // светлым акцентом палитры — на экране он читается как приглушённый тауп
        ctx.lineWidth = 1.2;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            ctx.strokeStyle = '#D4C3A3';
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                if (dx > LINK || dx < -LINK || dy > LINK || dy < -LINK) continue;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d > LINK) continue;
                ctx.globalAlpha = (1 - d / LINK) * (0.3 + 0.7 * Math.min(a.z, b.z));
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            }
            const cx = a.x - px, cy = a.y - py;
            if (cx < 190 && cx > -190 && cy < 190 && cy > -190) {
                const cd = Math.sqrt(cx * cx + cy * cy);
                if (cd < 190) { // связи тянутся к курсору
                    ctx.globalAlpha = 1 - cd / 190;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(px, py); ctx.stroke();
                }
            }
        }
        ctx.fillStyle = '#D4C3A3';
        for (const n of nodes) {
            ctx.globalAlpha = 0.45 + n.z * 0.55;
            ctx.beginPath(); ctx.arc(n.x, n.y, 1.2 + n.z * 1.8, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function resize() {
        sizeRaf = 0;
        const r = host.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        if (Math.abs(r.width - w) < 1 && Math.abs(r.height - h) < 1) return;
        w = r.width; h = r.height;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const want = Math.max(22, Math.min(120, Math.round(w * h / 15000)));
        while (nodes.length < want) nodes.push(make());
        nodes.length = want;
        for (const n of nodes) { if (n.x > w + 20) n.x = Math.random() * w; if (n.y > h + 20) n.y = Math.random() * h; }
        draw(0);
    }
    const queueResize = () => { if (!sizeRaf) sizeRaf = requestAnimationFrame(resize); };

    function frame(t) {
        raf = 0;
        if (!onScreen || document.hidden) return;
        const dt = last ? Math.min((t - last) / 16.67, 3) : 1;
        last = t;
        draw(dt);
        raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!raf && onScreen && !reduce && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };

    new IntersectionObserver((entries) => {
        onScreen = entries[entries.length - 1].isIntersecting;
        if (onScreen) start();
    }, { rootMargin: '120px 0px' }).observe(host);
    document.addEventListener('visibilitychange', start);
    // Секция растёт, когда открывают ответ, — холст подстраивается под неё
    if (window.ResizeObserver) new ResizeObserver(queueResize).observe(host);
    else window.addEventListener('resize', queueResize, { passive: true });

    section.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const r = host.getBoundingClientRect();
        px = e.clientX - r.left; py = e.clientY - r.top;
    }, { passive: true });
    section.addEventListener('pointerleave', () => { px = py = -9999; });

    resize();
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.classList.contains('bc-home')) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // 1. Фоновые видео играют только пока их секция на экране.
    //    Раньше оба ролика декодировались всё время, даже в самом низу страницы.
    if (!reduce) {
        document.querySelectorAll('video[data-bc-autoplay]').forEach((video) => {
            new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const p = video.play();
                        if (p && p.catch) p.catch(() => {}); // режим энергосбережения — остаётся постер
                    } else {
                        video.pause();
                    }
                });
            }, { rootMargin: '200px 0px' }).observe(video);
        });
    }

    // 2. Секции вне экрана ставят свои бесконечные CSS-анимации на паузу
    const offIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle('bc-off', !entry.isIntersecting));
    }, { rootMargin: '250px 0px' });
    document.querySelectorAll('section, .bc-marquee').forEach((el) => offIO.observe(el));

    // 3. Сетка в FAQ
    document.querySelectorAll('.bc-net').forEach((el) => bcNet(el, reduce));

    // 4. Свет за курсором на тёмных карточках (один обработчик на документ)
    if (fine) {
        const SPOT = '.glass-card, .bc-why-card, .accordion-item, .faq-item, #hp-news-grid > a';
        let spotEl = null, sx = 0, sy = 0, spotRaf = 0;
        document.addEventListener('pointermove', (e) => {
            const el = e.target && e.target.closest ? e.target.closest(SPOT) : null;
            if (!el) return;
            spotEl = el; sx = e.clientX; sy = e.clientY;
            if (spotRaf) return;
            spotRaf = requestAnimationFrame(() => {
                spotRaf = 0;
                const r = spotEl.getBoundingClientRect();
                spotEl.style.setProperty('--mx', Math.round(sx - r.left) + 'px');
                spotEl.style.setProperty('--my', Math.round(sy - r.top) + 'px');
            });
        }, { passive: true });
    }

    // 5. Наклон фото в команде — свой, без библиотеки
    if (fine && !reduce && !window.VanillaTilt) {
        document.querySelectorAll('.tilt-card').forEach((card) => {
            const glare = document.createElement('span');
            glare.className = 'bc-glare';
            glare.setAttribute('aria-hidden', 'true');
            card.appendChild(glare);
            let rect = null, raf = 0, rx = 0, ry = 0, gx = 50, gy = 50;
            const apply = () => {
                raf = 0;
                card.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale3d(1.03,1.03,1.03)';
                glare.style.background = 'radial-gradient(circle at ' + gx.toFixed(0) + '% ' + gy.toFixed(0) + '%, rgba(255,255,255,.26), transparent 62%)';
            };
            card.addEventListener('pointerenter', () => { rect = card.getBoundingClientRect(); card.classList.add('bc-tilting'); });
            card.addEventListener('pointermove', (e) => {
                if (!rect) return;
                const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
                const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
                ry = (x - 0.5) * 10; rx = (0.5 - y) * 10; gx = x * 100; gy = y * 100;
                if (!raf) raf = requestAnimationFrame(apply);
            });
            card.addEventListener('pointerleave', () => {
                rect = null;
                if (raf) { cancelAnimationFrame(raf); raf = 0; }
                card.classList.remove('bc-tilting');
                card.style.transform = '';
            });
        });
    }

    // 6. «Магнитные» кнопки. Двигаем свойством translate — оно складывается
    //    с transform, которым Tailwind приподнимает кнопку при наведении.
    if (fine && !reduce) {
        document.querySelectorAll('.bc-magnet').forEach((el) => {
            let rect = null;
            el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });
            el.addEventListener('pointermove', (e) => {
                if (!rect) return;
                const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
                const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
                el.style.translate = (x * 12).toFixed(1) + 'px ' + (y * 9).toFixed(1) + 'px';
            });
            el.addEventListener('pointerleave', () => { rect = null; el.style.translate = ''; });
        });
    }

    // 7. Первый экран: фон отстаёт от прокрутки, за курсором идёт мягкий свет
    const heroBg = document.querySelector('.bc-hero-bg');
    const hero = heroBg && heroBg.parentElement;
    if (hero && !reduce) {
        if (window.innerWidth >= 768) {
            let queued = false, heroH = hero.offsetHeight;
            const move = () => {
                queued = false;
                const y = window.scrollY;
                if (y <= heroH) heroBg.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0)';
            };
            window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(move); } }, { passive: true });
            window.addEventListener('resize', () => { heroH = hero.offsetHeight; }, { passive: true });
        }
        if (fine) {
            const glow = document.createElement('div');
            glow.className = 'bc-hero-glow';
            glow.setAttribute('aria-hidden', 'true');
            hero.insertBefore(glow, heroBg.nextSibling);
            let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, top = 0, left = 0;
            const tick = () => {
                cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
                glow.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
                raf = (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) ? requestAnimationFrame(tick) : 0;
            };
            hero.addEventListener('pointerenter', () => {
                const r = hero.getBoundingClientRect();
                top = r.top + window.scrollY; left = r.left;
            });
            hero.addEventListener('pointermove', (e) => {
                tx = e.clientX - left; ty = e.pageY - top;
                if (!glow.classList.contains('is-on')) { cx = tx; cy = ty; glow.classList.add('is-on'); }
                if (!raf) raf = requestAnimationFrame(tick);
            }, { passive: true });
            hero.addEventListener('pointerleave', () => glow.classList.remove('is-on'));
        }
    }

    // 8. Если окно расширили до десктопа с открытым мобильным меню — закрываем его,
    //    иначе страница оставалась с заблокированной прокруткой
    const desktop = window.matchMedia('(min-width: 1200px)');
    const closeMenu = () => {
        const menu = document.getElementById('mobile-menu');
        const btn = document.getElementById('mobile-menu-btn');
        if (desktop.matches && menu && btn && menu.classList.contains('translate-x-0')) btn.click();
    };
    if (desktop.addEventListener) desktop.addEventListener('change', closeMenu);
    else if (desktop.addListener) desktop.addListener(closeMenu);
});

