/* --- APP LOGIC --- */
let currentView = 'home';

// Auth & Event Handlers
const handlers = {
    login() {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-pass').value;
        const res = Auth.login(email, pass); // Used Auth module
        if (res.success) {
            UI.showToast(`${LanguageManager.get('welcomeBack')}, ${res.user.name}!`, 'success');
            updateSideProfile(res.user);
            location.hash = '#home';
            UI.showToast(res.message, 'success');
            location.hash = '#home';
            UI.renderHome(); // Re-render home to show dashboard
        } else {
            UI.showToast(res.message, 'error');
        }
    },

    register(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name')?.value || document.getElementById('reg-name-modern')?.value;
        const email = document.getElementById('reg-email')?.value || document.getElementById('reg-email-modern')?.value;
        const pass = document.getElementById('reg-pass')?.value || document.getElementById('reg-password-modern')?.value;
        if (!name || !email || !pass) return UI.showToast(LanguageManager.get('fillAllFields'), 'error');

        const res = Auth.register(name, email, pass); // Used Auth module
        if (res.success) {
            UI.showToast(res.message, 'success');
            location.hash = '#login';
        } else {
            UI.showToast(res.message, 'error');
        }
    },

    logout() {
        Auth.logout();
        updateSideProfile(null);
        UI.showToast(LanguageManager.get('loggedOut'));
        location.hash = '#login';
    },

    completeLesson(lessonId) {
        Store.updateUserProgress(lessonId, true);
        Store.updateLastActivity(); // Track activity

        // Add points and update stats
        Store.updateStats('lesson');
        Store.addPoints(15, 'Lesson completed');
        const newBadges = Store.checkAndAwardBadges();

        UI.showToast(LanguageManager.get('lessonCompleted'), 'success');

        // Show badge notification if earned
        if (newBadges.length > 0) {
            newBadges.forEach(badge => {
                setTimeout(() => {
                    UI.showToast(`🏆 ${badge.name} earned!`, 'success');
                }, 500);
            });
        }
    },

    toggleTask(id, el) {
        const completed = el.checked;
        Store.updateTaskStatus(id, completed);

        // Track activity when completing (not uncompleting)
        if (completed) {
            Store.updateLastActivity();

            // Add points and update stats
            Store.updateStats('task');
            Store.addPoints(10, 'Task completed');
            const newBadges = Store.checkAndAwardBadges();

            // Show badge notifications
            if (newBadges.length > 0) {
                newBadges.forEach(badge => {
                    setTimeout(() => {
                        UI.showToast(`🏆 ${badge.name} earned!`, 'success');
                    }, 500);
                });
            }
        }

        // Visuals
        const li = el.closest('.task-item');
        if (completed) {
            li.classList.add('completed');
            // Trigger Confetti
            const rect = el.getBoundingClientRect();
            UI.triggerConfetti(rect.left + 20, rect.top);
            UI.showToast('Task Completed! 🎉', 'success');
        } else {
            li.classList.remove('completed');
        }

        // Refresh Home stats if valid
        if (currentView === 'home') UI.renderHome();
    }
};

function init() {
    const data = Store.getData(); // General data
    const user = Auth.getCurrentUser();

    // Apply theme
    document.documentElement.setAttribute('data-theme', data.settings.theme);

    // Init PRO System
    ProManager.init();

    // Init Side Profile
    updateSideProfile(user);

    // Routes
    window.addEventListener('hashchange', handleHash);
    handleHash();

    // Start Ads (Experimental)
    UI.renderAds();

    // Init Language
    LanguageManager.init();
}

function updateSideProfile(user) {
    const el = document.getElementById('user-profile-area');
    if (!el) return;

    if (user) {
        el.innerHTML = `
            <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">${LanguageManager.get('signedInAs')}</p>
            <p style="font-weight:700; margin:0 0 0.5rem 0;">${user.name}</p>
            <button class="auth-btn" style="border-color:var(--danger-color); color:var(--danger-color);" onclick="app.handlers.logout()">${LanguageManager.get('logout')}</button>
        `;
    } else {
        el.innerHTML = `
            <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">${LanguageManager.get('guest')}</p>
            <button class="auth-btn" onclick="location.hash='#login'">${LanguageManager.get('login')}</button>
            <button class="auth-btn" style="margin-top:0.5rem" onclick="location.hash='#signup'">${LanguageManager.get('signup')}</button>
        `;
    }
}

function handleHash() {
    const hash = location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    const root = parts[0]; // languages, home, login...

    // Auth Routes
    if (root === 'login') {
        showView('languages'); // reuse container
        UI.renderLogin();
        return;
    }
    if (root === 'signup') {
        showView('languages');
        UI.renderSignup();
        return;
    }

    // Protection for Languages
    if (root === 'languages') {
        if (!Auth.isAuthenticated()) {
            UI.showToast(LanguageManager.get('pleaseLogin'), 'error');
            location.hash = '#login';
            return;
        }

        showView('languages');

        // Router for Language Section
        if (parts.length === 1) {
            UI.renderLanguagesHub();
        } else if (parts.length === 2) {
            // languages/en
            UI.renderLevels(parts[1]);
        } else if (parts.length === 3) {
            // languages/en/A1 -> List of Lessons
            UI.renderLessonsList(parts[1], parts[2]);
        } else if (parts.length === 4) {
            // languages/en/A1/l1 -> Specific Lesson
            UI.renderLessonDetail(parts[1], parts[2], parts[3]);
        }
        return;
    }

    // PRO Features - Projects
    if (root === 'projects') {
        showView('projects');
        // Check PRO access
        if (!ProManager.requirePro('Projects Platform')) {
            // User is not PRO - modal shown, redirect to home
            location.hash = '#home';
            return;
        }
        // User has PRO access - show maintenance page
        UI.renderProjects();
        return;
    }

    // PRO Features - Tests
    if (root === 'tests') {
        showView('tests');
        // Check PRO access
        if (!ProManager.requirePro('Personality Tests Platform')) {
            // User is not PRO - modal shown, redirect to home
            location.hash = '#home';
            return;
        }
        // User has PRO access - show maintenance page
        UI.renderTests();
        return;
    }

    // NEW: CV Builder
    if (root === 'cv-builder') {
        showView('cv-builder');
        if (window.CVBuilder) {
            window.CVBuilder.init();
        } else {
            console.error('CVBuilder module not loaded');
        }
        return;
    }

    // Default Views
    showView(root);
    if (root === 'home') UI.renderHome();
    if (root === 'tasks') UI.renderTaskList();
    if (root === 'books') UI.renderBooks();
    if (root === 'progress') UI.renderProgress();
    if (root === 'settings') UI.renderSettings(); // Settings handler
}

function showView(viewName) {
    currentView = viewName;
    // Sidebar active class
    document.querySelectorAll('.nav-link').forEach(a => {
        const href = a.getAttribute('href').replace('#', '');
        a.classList.toggle('active', viewName.startsWith(href));
    });

    // Show Container
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    // Map viewName to ID (languages uses languages-view, home uses home-view)
    const containerId = viewName + '-view';
    const el = document.getElementById(containerId);
    if (el) el.classList.add('active');
}

// Global App Object
const app = {
    handlers,
    init
};
window.app = app;

document.addEventListener('DOMContentLoaded', init);
