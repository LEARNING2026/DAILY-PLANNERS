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
    // SOCIAL SHARING
    // ============================================
    function addShareButtons() {
        if (!document.querySelector('.share-btn-container')) {
            const container = document.createElement('div');
            container.className = 'share-btn-container';
            container.innerHTML = `
                <button class="share-btn twitter" aria-label="Share on Twitter" onclick="window.open('https://twitter.com/intent/tweet?text=Check out PlanHub!&url='+encodeURIComponent(window.location.href), '_blank')">🐦</button>
                <button class="share-btn facebook" aria-label="Share on Facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(window.location.href), '_blank')">📘</button>
                <button class="share-btn linkedin" aria-label="Share on LinkedIn" onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(window.location.href), '_blank')">💼</button>
            `;
            document.body.appendChild(container);

            // Add styles dynamically
            const style = document.createElement('style');
            style.textContent = `
                .share-btn-container {
                    position: fixed;
                    left: 20px;
                    bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    z-index: 90;
                }
                .share-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    background: var(--bg-card);
                    box-shadow: var(--shadow-md);
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .share-btn:hover {
                    transform: scale(1.1);
                    box-shadow: var(--shadow-lg);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize Share Buttons after a delay
    setTimeout(addShareButtons, 3000);

    // ============================================
    // PROMOTIONAL POPUP (Exit Intent / Time)
    // ============================================
    function initPopup() {
        const popupHTML = `
            <div id="promo-popup" class="promo-popup-overlay">
                <div class="promo-popup">
                    <button class="close-popup" onclick="document.getElementById('promo-popup').style.display='none'">×</button>
                    <div class="popup-content">
                        <h3>🎁 50% Off Premium!</h3>
                        <p>Unlock all psychological tests and unlimited projects today. Limited time offer.</p>
                        <button class="btn btn-primary" onclick="App.switchToApp(); document.getElementById('settings-view').scrollIntoView();">Upgrade Now</button>
                    </div>
                </div>
            </div>
        `;

        // Append popup
        if (!document.getElementById('promo-popup')) {
            const div = document.createElement('div');
            div.innerHTML = popupHTML;
            document.body.appendChild(div.firstElementChild);

            // Styles
            const style = document.createElement('style');
            style.textContent = `
                .promo-popup-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    backdrop-filter: blur(4px);
                    z-index: 2000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }
                .promo-popup {
                    background: var(--bg-card);
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                    max-width: 400px;
                    text-align: center;
                    position: relative;
                    box-shadow: var(--shadow-xl);
                    animation: scaleIn 0.3s ease;
                }
                .close-popup {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    border: none;
                    background: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-secondary);
                }
            `;
            document.head.appendChild(style);
        }

        // Trigger after 15 seconds
        setTimeout(() => {
            const popup = document.getElementById('promo-popup');
            if (popup && !localStorage.getItem('popupDismissed')) {
                popup.style.display = 'flex';
                // Mark as shown so it doesn't annoy too much (session based)
                // localStorage.setItem('popupDismissed', 'true'); // Commented out for demo purposes
            }
        }, 15000);
    }

    initPopup();

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
