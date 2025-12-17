/* ============================================
   MODERN WEBSITE ENHANCEMENTS
   Smooth Animations and Interactive Features
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Observe all scroll-reveal elements
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // Observe all cards for staggered animation
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // ============================================
    // BUTTON RIPPLE EFFECT
    // ============================================
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ============================================
    // SMOOTH SCROLL FOR NAVIGATION
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================
    // PARALLAX EFFECT FOR BACKGROUND
    // ============================================
    const animatedBg = document.querySelector('.animated-bg');
    if (animatedBg) {
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.3;
            animatedBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // ============================================
    // ENHANCED CARD INTERACTIONS
    // ============================================
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ============================================
    // LAZY LOADING FOR IMAGES
    // ============================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // ============================================
    // ANIMATED COUNTERS (for stats)
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Observe stat counters
    const statCounters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    });

    statCounters.forEach(counter => counterObserver.observe(counter));

    // ============================================
    // THEME TOGGLE ENHANCEMENT
    // ============================================
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Add transition class
            document.body.classList.add('theme-transitioning');

            // Change theme
            document.documentElement.setAttribute('data-theme', newTheme);
            document.body.className = newTheme;

            // Remove transition class after animation
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 300);
        });
    }

    // ============================================
    // LOADING ANIMATION
    // ============================================
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');

        // Trigger initial animations
        setTimeout(() => {
            document.querySelectorAll('.fade-in-on-load').forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    });

    // ============================================
    // CONSOLE BRANDING
    // ============================================
    console.log('%c🚀 PlanHub - Modern & Professional', 'font-size: 20px; color: #6366f1; font-weight: bold;');
    console.log('%cWebsite enhanced with modern animations and interactions', 'font-size: 12px; color: #64748b;');
});
