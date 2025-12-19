/* ============================================
   SECTION MODAL HANDLER
   معالج نافذة وصف الأقسام
   ============================================ */

(function initSectionModal() {
    'use strict';

    // Section descriptions in Arabic
    const sectionDescriptions = {
        'home': {
            icon: '🏠',
            title: 'الرئيسية',
            description: 'مركز التحكم الخاص بك! تابع تقدمك اليومي، وأنجز مهامك، واحصل على نظرة شاملة على إنجازاتك.',
            isPro: false
        },
        'tasks': {
            icon: '✅',
            title: 'المهام',
            description: 'نظّم يومك بذكاء! أضف مهامك، رتّب أولوياتك، وحقق أهدافك خطوة بخطوة مع نظام إدارة مهام متقدم.',
            isPro: false
        },
        'projects': {
            icon: '📊',
            title: 'المشاريع',
            description: 'حوّل أفكارك إلى واقع! خطط لمشاريعك الكبيرة، تابع تقدمها، وأنجزها باحترافية. ميزة حصرية للأعضاء المميزين.',
            isPro: true
        },
        'tests': {
            icon: '🧠',
            title: 'الاختبارات',
            description: 'اختبر ذكاءك وقدراتك! تحديات تفاعلية ممتعة تساعدك على اكتشاف نقاط قوتك وتطوير مهاراتك. ميزة حصرية للأعضاء المميزين.',
            isPro: true
        },
        'languages': {
            icon: '🌍',
            title: 'اللغات',
            description: 'تعلم لغات جديدة بطريقة تفاعلية! دروس منظمة من A1 إلى C2 في الإنجليزية، الفرنسية، الإسبانية، الألمانية، والصينية.',
            isPro: false
        },
        'books': {
            icon: '📚',
            title: 'الكتب',
            description: 'مكتبتك الرقمية! اكتشف كتباً ملهمة في التطوير الذاتي، الإنتاجية، والنجاح. اقرأ، تعلم، وطوّر نفسك.',
            isPro: false
        },
        'progress': {
            icon: '📈',
            title: 'التقدم',
            description: 'شاهد إنجازاتك تنمو! تتبع تقدمك في المهام، الاختبارات، واللغات مع إحصائيات تفصيلية ورسوم بيانية واضحة.',
            isPro: false
        },
        'settings': {
            icon: '⚙️',
            title: 'الإعدادات',
            description: 'خصّص تجربتك! غيّر اللغة، المظهر، والإعدادات لتناسب احتياجاتك الشخصية.',
            isPro: false
        },
        'cv-builder': {
            icon: '📄',
            title: 'بناء السيرة الذاتية',
            description: 'أنشئ سيرة ذاتية احترافية في دقائق! قوالب جاهزة، تصميم تفاعلي، وتصدير بصيغة PDF.',
            isPro: false
        }
    };

    let currentSection = null;
    let modalOverlay = null;

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        createModalHTML();
        attachEventListeners();
        console.log('✅ Section modal initialized');
    });

    // Create modal HTML structure
    function createModalHTML() {
        const modalHTML = `
            <div class="section-modal-overlay" id="section-modal-overlay">
                <div class="section-modal">
                    <div class="section-modal-header">
                        <button class="section-modal-close" id="modal-close-btn">×</button>
                        <div class="section-modal-icon" id="modal-icon">🏠</div>
                        <h2 class="section-modal-title" id="modal-title">القسم</h2>
                    </div>
                    <div class="section-modal-body">
                        <div id="modal-pro-badge" style="text-align: center; display: none;">
                            <span class="section-modal-badge">⭐ ميزة PRO</span>
                        </div>
                        <p class="section-modal-description" id="modal-description">
                            وصف القسم
                        </p>
                    </div>
                    <div class="section-modal-footer">
                        <button class="section-modal-btn section-modal-btn-primary" id="modal-continue-btn">
                            استمرار ←
                        </button>
                        <button class="section-modal-btn section-modal-btn-secondary" id="modal-cancel-btn">
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modalOverlay = document.getElementById('section-modal-overlay');
    }

    // Attach event listeners
    function attachEventListeners() {
        // Sidebar navigation links
        const navLinks = document.querySelectorAll('#sidebar .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });

        // Modal close buttons
        document.getElementById('modal-close-btn').addEventListener('click', closeModal);
        document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
        document.getElementById('modal-continue-btn').addEventListener('click', continueToSection);

        // Close on overlay click
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Handle navigation link click
    function handleNavLinkClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const href = this.getAttribute('href');
        if (!href || href === '#') return;

        // Extract section name from href (e.g., #tasks -> tasks)
        const sectionName = href.replace('#', '');
        currentSection = sectionName;

        // Show modal with section info
        showModal(sectionName);
    }

    // Show modal
    function showModal(sectionName) {
        const sectionData = sectionDescriptions[sectionName];

        if (!sectionData) {
            // If no description, navigate directly
            navigateToSection(sectionName);
            return;
        }

        // Update modal content
        document.getElementById('modal-icon').textContent = sectionData.icon;
        document.getElementById('modal-title').textContent = sectionData.title;
        document.getElementById('modal-description').textContent = sectionData.description;

        // Show/hide PRO badge
        const proBadge = document.getElementById('modal-pro-badge');
        if (sectionData.isPro) {
            proBadge.style.display = 'block';
        } else {
            proBadge.style.display = 'none';
        }

        // Show modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    // Close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
        currentSection = null;
    }

    // Continue to section
    function continueToSection() {
        console.log('🔵 Continue button clicked, currentSection:', currentSection);

        if (currentSection) {
            closeModal();

            // Small delay for smooth transition
            setTimeout(() => {
                console.log('🔵 Navigating to:', currentSection);
                navigateToSection(currentSection);

                // Close sidebar on mobile
                const sidebar = document.getElementById('sidebar');
                if (sidebar && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    console.log('🔵 Sidebar closed');
                }
            }, 200);
        } else {
            console.error('❌ currentSection is null or undefined!');
        }
    }

    // Navigate to section
    function navigateToSection(sectionName) {
        console.log('🔵 Setting location.hash to:', '#' + sectionName);
        location.hash = '#' + sectionName;
        console.log('✅ Navigation complete. Current hash:', location.hash);
    }

    // Export functions
    window.SectionModal = {
        show: showModal,
        close: closeModal
    };

})();
