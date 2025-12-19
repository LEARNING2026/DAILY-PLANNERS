/* ============================================
   MOBILE EVENT HANDLERS - FIXED VERSION
   معالج الأحداث - النسخة المصلحة
   ============================================ */

(function initMobileHandlers() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        // 1. معالجة أزرار التطبيق الرئيسية فقط
        document.body.addEventListener('click', function (e) {
            const target = e.target.closest('button, a');
            if (!target) return;

            const text = target.textContent.trim();

            // فقط الأزرار المحددة - لا نستخدم preventDefault على كل شيء
            if (text.includes('Launch App') || text.includes('Get Started') || text.includes('ابدأ الآن')) {
                e.preventDefault();
                e.stopPropagation();
                switchToApp();
                return;
            }

            if (text.includes('Log In') || text.includes('تسجيل الدخول')) {
                e.preventDefault();
                e.stopPropagation();
                switchToApp();
                return;
            }

            if (text.includes('Learn More') || text.includes('اعرف المزيد')) {
                e.preventDefault();
                e.stopPropagation();
                const featuresSection = document.getElementById('features');
                if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
                return;
            }

            // زر Mobile Toggle
            if (target.classList.contains('mobile-toggle')) {
                e.preventDefault();
                e.stopPropagation();
                toggleSidebar();
                return;
            }

            // زر Exit App
            if (target.classList.contains('exit-app-btn') || text.includes('Exit App')) {
                e.preventDefault();
                e.stopPropagation();
                switchToLanding();
                return;
            }

            // لا تفعل شيء للأزرار الأخرى - دعها تعمل بشكل طبيعي
        });

        // 2. إغلاق Sidebar عند الضغط خارجها
        document.addEventListener('click', function (e) {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.querySelector('.mobile-toggle');

            if (sidebar && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && (!mobileToggle || !mobileToggle.contains(e.target))) {
                    sidebar.classList.remove('open');
                }
            }
        });

        // 3. إغلاق Sidebar عند الضغط على روابط القائمة
        const sidebarLinks = document.querySelectorAll('#sidebar .nav-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function () {
                const sidebar = document.getElementById('sidebar');
                if (sidebar && sidebar.classList.contains('open')) {
                    setTimeout(() => {
                        sidebar.style.transition = 'transform 0.3s ease';
                        sidebar.classList.remove('open');
                    }, 150);
                }
            });
        });

        // 4. معالجة Swipe للـ Sidebar (الهواتف فقط)
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar) return;

            if (touchEndX > touchStartX + 50 && touchStartX < 50) {
                sidebar.classList.add('open');
            }

            if (touchStartX > touchEndX + 50 && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }

        // 5. تأثيرات اللمس للأزرار (تحسين تجربة المستخدم)
        const buttons = document.querySelectorAll('.btn, button');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', function () {
                this.style.opacity = '0.8';
            }, { passive: true });

            btn.addEventListener('touchend', function () {
                this.style.opacity = '1';
            }, { passive: true });
        });

        // 6. Lazy Loading للصور
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }

        console.log('✅ Mobile handlers initialized successfully');
    });

    // الدوال الأساسية
    function switchToApp() {
        const landingView = document.getElementById('landing-view');
        const appContainer = document.getElementById('app-container');

        if (landingView && appContainer) {
            landingView.style.display = 'none';
            appContainer.style.display = 'flex';
            window.dispatchEvent(new Event('resize'));
            console.log('✅ Switched to App');
        } else {
            console.error('❌ Could not find landing-view or app-container');
        }
    }

    function switchToLanding() {
        const landingView = document.getElementById('landing-view');
        const appContainer = document.getElementById('app-container');

        if (landingView && appContainer) {
            appContainer.style.display = 'none';
            landingView.style.display = 'block';
            console.log('✅ Switched to Landing');
        } else {
            console.error('❌ Could not find landing-view or app-container');
        }
    }

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
            console.log('✅ Sidebar:', sidebar.classList.contains('open') ? 'Opened' : 'Closed');
        } else {
            console.error('❌ Could not find sidebar');
        }
    }

    // تصدير الدوال
    window.MobileHandler = {
        switchToApp,
        switchToLanding,
        toggleSidebar
    };

    // دعم App namespace
    if (!window.App) {
        window.App = {};
    }
    window.App.switchToApp = switchToApp;
    window.App.switchToLanding = switchToLanding;
    window.App.toggleSidebar = toggleSidebar;

})();
