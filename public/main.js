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
        window.addEventListener('scroll', () => {
            if (isDarkTheme()) {
                header.classList.toggle('header-scrolled', window.scrollY > 50);
                return;
            }
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
                header.classList.replace('bg-white/95', 'bg-white');
            } else {
                header.classList.remove('header-scrolled');
                header.classList.replace('bg-white', 'bg-white/95');
            }
        });
    }
});

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

    const animateCounters = () => {
        if (prefersReduced) {
            counters.forEach(counter => { counter.innerText = counter.getAttribute('data-target'); });
            return;
        }
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const startTime = performance.now();

            const step = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / animationDuration, 1);
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                counter.innerText = Math.floor(easeProgress * target);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(step);
        });
    };

    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
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
        'bottom:84px',
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