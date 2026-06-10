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

    const animateCounters = () => {
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
    }

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