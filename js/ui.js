const UI = {
    showToast(msg, type = 'info') {
        const con = document.getElementById('notification-container');
        if (!con) return;

        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerText = LanguageManager.get(msg) || msg;
        con.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    },

    /* --- AUTH VIEWS --- */
    renderLogin() {
        const con = document.getElementById('languages-view');
        con.innerHTML = `
            <div class="auth-container">
                <div style="font-size:3rem; margin-bottom:1rem;">🔐</div>
                <h2 style="text-align:center; margin-bottom:2rem;">${LanguageManager.get('login')}</h2>
                <div style="margin-bottom:1.5rem; text-align:left;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:600;">${LanguageManager.get('email')}</label>
                    <input type="email" id="login-email" class="input-field" placeholder="Enter your email">
                </div>
                <div style="margin-bottom:2rem; text-align:left;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:600;">${LanguageManager.get('password')}</label>
                    <input type="password" id="login-pass" class="input-field" placeholder="Enter your password">
                </div>
                <button class="btn btn-primary" style="width:100%; justify-content:center;" onclick="app.handlers.login()">
                    ${LanguageManager.get('login')}
                </button>
                <p style="text-align:center; margin-top:1.5rem; font-size:0.9rem;">
                    ${LanguageManager.get('newUser')} <a href="#signup" style="color:var(--primary-color); font-weight:600;">${LanguageManager.get('registerHere')}</a>
                </p>
            </div>
        `;
    },

    renderSignup() {
        const con = document.getElementById('languages-view');
        con.innerHTML = `
             <div class="auth-container">
                <div style="font-size:3rem; margin-bottom:1rem;">✨</div>
                <h2 style="text-align:center; margin-bottom:2rem;">${LanguageManager.get('createAccount')}</h2>
                <div style="margin-bottom:1.5rem; text-align:left;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:600;">${LanguageManager.get('fullName')}</label>
                    <input type="text" id="reg-name" class="input-field" placeholder="John Doe">
                </div>
                <div style="margin-bottom:1.5rem; text-align:left;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:600;">${LanguageManager.get('email')}</label>
                    <input type="email" id="reg-email" class="input-field" placeholder="john@example.com">
                </div>
                <div style="margin-bottom:2rem; text-align:left;">
                    <label style="display:block; margin-bottom:0.5rem; font-weight:600;">${LanguageManager.get('password')}</label>
                    <input type="password" id="reg-pass" class="input-field" placeholder="******">
                </div>
                <button class="btn btn-primary" style="width:100%; justify-content:center;" onclick="app.handlers.register()">
                    ${LanguageManager.get('register')}
                </button>
                <p style="text-align:center; margin-top:1.5rem; font-size:0.9rem;">
                    ${LanguageManager.get('alreadyAccount')} <a href="#login" style="color:var(--primary-color); font-weight:600;">${LanguageManager.get('loginHere')}</a>
                </p>
            </div>
        `;
    },

    /* --- BASIC VIEWS --- */
    renderHome() {
        const user = Auth.getCurrentUser();
        // Update Hero
        const heroName = document.getElementById('hero-username');
        if (heroName) heroName.innerText = user ? user.name : LanguageManager.get('guest');

        // Get dynamic stats
        const data = Store.getData();
        const pending = data.tasks.filter(t => !t.completed).length;
        const totalPoints = data.points || 0;
        const totalBadges = data.badges ? data.badges.length : 0;
        const isPro = ProManager.isPro();

        const homeView = document.getElementById('home-view');
        if (homeView) {
            homeView.innerHTML = `
                <div class="stats-grid">
                    <div class="card stat-card">
                        <h3>Total Points</h3>
                        <div class="value" style="color:var(--primary-color)" id="points-display">${totalPoints}</div>
                        <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem;">+10 per task, +15 per lesson</p>
                    </div>
                    <div class="card stat-card">
                        <h3>Pending Tasks</h3>
                        <div class="value">${pending}</div>
                        <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem;">Complete to earn points</p>
                    </div>
                    <div class="card stat-card">
                        <h3>Badges Earned</h3>
                        <div class="value" style="color:var(--success-color)">${totalBadges}</div>
                        <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.5rem;">${9 - totalBadges} more to unlock</p>
                    </div>
                </div>
                
                <h3 style="margin-bottom:1rem;">Quick Actions</h3>
                <div style="display:flex; gap:1rem; flex-wrap:wrap;">
                    <button class="btn btn-primary" onclick="location.hash='#tasks'">View Tasks</button>
                    <button class="btn" style="background:var(--bg-card); border:1px solid var(--border-color);" onclick="location.hash='#languages'">Start Learning</button>
                    <button class="btn" style="background:var(--bg-card); border:1px solid var(--border-color);" onclick="ProManager.togglePro()">
                        ${isPro ? '⭐ PRO Mode: ON' : '🔒 Enable PRO Mode'}
                    </button>
                </div>

                <h3 style="margin: 2.5rem 0 1rem 0;">PRO Features ${isPro ? '✨' : '🔒'}</h3>
                <div class="lang-grid">
                    <!-- Projects Card -->
                    <div class="card pro-feature-card ${!isPro ? 'locked' : ''}" onclick="location.hash='#projects'">
                        <div style="font-size:3rem; margin-bottom:1rem;">🚀</div>
                        <h3 style="display:flex; align-items:center; justify-content:center; gap:0.5rem;">
                            أداة تخطيط المشاريع
                            <span class="pro-badge">PRO</span>
                            ${!isPro ? '<span class="lock-icon">🔒</span>' : ''}
                        </h3>
                        <p style="color:var(--text-secondary); margin:0.75rem 0;">
                            احصل على خطة عمل احترافية لمشروعك مع خارطة طريق مفصلة وأدوات مقترحة
                        </p>
                        <div style="margin-top:1rem; padding:0.5rem; background:rgba(99, 102, 241, 0.1); border-radius:0.5rem; font-size:0.85rem; color:var(--primary-color); font-weight:600;">
                            ✨ متاح الآن!
                        </div>
                    </div>

                    <!-- Tests Card -->
                    <div class="card pro-feature-card ${!isPro ? 'locked' : ''}" onclick="location.hash='#tests'">
                        <div style="font-size:3rem; margin-bottom:1rem;">🧠</div>
                        <h3 style="display:flex; align-items:center; justify-content:center; gap:0.5rem;">
                            Personality Tests
                            <span class="pro-badge">PRO</span>
                            ${!isPro ? '<span class="lock-icon">🔒</span>' : ''}
                        </h3>
                        <p style="color:var(--text-secondary); margin:0.75rem 0;">
                            Take psychological self-assessments with detailed personality analysis
                        </p>
                        <div class="maintenance-badge" style="margin-top:1rem;">
                            <span class="maintenance-icon">🛠</span>
                            <span>Under Maintenance</span>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /* --- TASKS RENDER --- */
    renderTaskList() {
        const tasks = Store.getTasks();
        const el = document.getElementById('task-list');
        if (!el) return;

        el.innerHTML = '';

        if (tasks.length === 0) {
            el.innerHTML = `<div style="text-align:center; color:var(--text-secondary); padding:2rem;">No tasks found. Add one!</div>`;
            return;
        }

        tasks.forEach(t => {
            const li = document.createElement('li');
            li.className = `task-item ${t.completed ? 'completed' : ''}`;

            // Priority Badge Class
            const prioClass = t.priority === 'high' ? 'badge-high' : t.priority === 'medium' ? 'badge-medium' : 'badge-low';

            // Category Icon/Color
            let catIcon = '📝';
            let catClass = 'cat-personal';
            if (t.category === 'Work') { catIcon = '💼'; catClass = 'cat-work'; }
            if (t.category === 'Learning') { catIcon = '📚'; catClass = 'cat-learning'; }
            if (t.category === 'Fun') { catIcon = '🎮'; catClass = 'cat-fun'; }

            li.innerHTML = `
                <div class="task-icon ${catClass}">${catIcon}</div>
                <div class="task-content">
                    <span class="task-text">${t.text}</span>
                    <div class="task-meta">
                        <span class="badge ${prioClass}">${LanguageManager.get('prio' + t.priority.charAt(0).toUpperCase() + t.priority.slice(1)) || t.priority}</span>
                        <span>• ${LanguageManager.get('cat' + t.category) || t.category}</span>
                    </div>
                </div>
                <input type="checkbox" class="checkbox" ${t.completed ? 'checked' : ''} onchange="app.handlers.toggleTask(${t.id}, this)">
            `;
            el.appendChild(li);
        });
    },

    // Trigger Confetti
    triggerConfetti(x, y) {
        for (let i = 0; i < 10; i++) {
            const el = document.createElement('div');
            el.className = 'confetti-pop';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.backgroundColor = ['#EF476F', '#FFD166', '#06D6A0', '#118AB2'][Math.floor(Math.random() * 4)];
            el.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 600);
        }
    },

    /* --- LANGUAGES RENDER (With PRO) --- */
    renderLanguagesHub() {
        const langs = Store.getLanguages();
        const container = document.getElementById('languages-view');
        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">
                <h2>${LanguageManager.get('pickLanguage')}</h2>
                <div class="pro-badge">PRO ENABLED</div> 
            </div>
            
            <div class="lang-grid">
                ${langs.map(l => `
                    <div class="card lang-card" onclick="location.hash='#languages/${l.code}'">
                        <div class="lang-flag">${l.flag}</div>
                        <h3>${l.name}</h3>
                        <div class="progress-container">
                            <div class="progress-fill" style="width: 30%"></div>
                        </div>
                        <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.5rem">30% Complete</p>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderLevels(langCode) {
        const levels = Store.getLevels();
        const container = document.getElementById('languages-view');
        const lang = Store.getLanguages().find(l => l.code === langCode);

        container.innerHTML = `
            <div style="margin-bottom:2rem;">
                <button onclick="location.hash='#languages'" class="btn" style="margin-bottom:1rem;">← ${LanguageManager.get('back')}</button>
                <h2>${lang.flag} ${lang.name} <span style="font-weight:400; color:var(--text-secondary);">${LanguageManager.get('levels')}</span></h2>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1.5rem;">
                ${levels.map(lvl => `
                    <div class="card level-card" onclick="location.hash='#languages/${langCode}/${lvl}'" style="text-align:center; padding:2rem 1.5rem; cursor:pointer;">
                        <h2 style="color:var(--primary-color); font-size:2.5rem; margin-bottom:0.5rem;">${lvl}</h2>
                        <p style="color:var(--text-secondary)">${LanguageManager.get('beginnerToAdvanced')}</p>
                    </div>
                `).join('')}
                
                <!-- PRO Level -->
                <div class="card" style="text-align:center; padding:2rem 1.5rem; opacity:0.7; border:1px dashed var(--warning-color); position:relative;">
                    <div style="position:absolute; top:10px; right:10px; font-size:1.2rem;">🔒</div>
                    <h2 style="color:var(--text-secondary); font-size:2.5rem; margin-bottom:0.5rem;">Business</h2>
                    <p style="color:var(--warning-color); font-weight:700;">PRO ONLY</p>
                </div>
            </div>
        `;
    },

    renderLessonsList(langCode, level) {
        const lessons = Store.getLessonsList(langCode, level);
        const container = document.getElementById('languages-view');
        const lang = Store.getLanguages().find(l => l.code === langCode);
        const user = Auth.getCurrentUser() || { progress: {} };

        container.innerHTML = `
            <div style="margin-bottom:2rem;">
                <button onclick="location.hash='#languages/${langCode}'" class="btn" style="margin-bottom:1rem;">← ${LanguageManager.get('backToLevels')}</button>
                <h2>${lang.flag} ${lang.name} • ${level} Plan</h2>
            </div>
            <div style="display:flex; flex-direction:column; gap:1rem;">
                ${lessons.map((lesson, index) => { // Fixed index param
            const isDone = user.progress[lesson.id];
            return `
                    <div class="card" style="display:flex; align-items:center; justify-content:space-between; cursor:pointer; padding:1.25rem 2rem;" onclick="location.hash='#languages/${langCode}/${level}/${lesson.id}'">
                        <div style="display:flex; align-items:center; gap:1rem;">
                            <div style="background:${isDone ? 'var(--success-color)' : 'var(--bg-body)'}; color:${isDone ? 'white' : 'var(--text-secondary)'}; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold;">
                                ${isDone ? '✓' : index + 1}
                            </div>
                            <div>
                                <h3 style="margin:0 0 0.25rem 0;">${lesson.title}</h3>
                                <p style="color:var(--text-secondary); margin:0; font-size:0.9rem;">${LanguageManager.get('clickToStart')}</p>
                            </div>
                        </div>
                        ${isDone ? `<span class="badge" style="background:var(--priority-low); color:var(--priority-low-text);">${LanguageManager.get('completed')}</span>` : `<span style="font-size:1.5rem; color:var(--text-mute)">›</span>`}
                    </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    renderLessonDetail(langCode, level, lessonId) {
        const lesson = Store.getLessonDetail(langCode, level, lessonId);
        const container = document.getElementById('languages-view');
        const lang = Store.getLanguages().find(l => l.code === langCode);

        container.innerHTML = `
            <div style="margin-bottom:2rem;">
                <button onclick="location.hash='#languages/${langCode}/${level}'" class="btn" style="margin-bottom:1rem;">← ${LanguageManager.get('backToPlan')}</button>
                <h2>${lesson.title}</h2>
                <div style="font-size:0.9rem; color:var(--text-secondary);">${lang.name} • ${level}</div>
            </div>

            <div class="card" style="line-height:1.8; font-size:1.1rem; max-width:800px; margin:0 auto; padding:3rem;">
                <h3 style="color:var(--primary-color); margin-bottom:1.5rem;">${LanguageManager.get('overview')}</h3>
                ${lesson.intro}

                <h3 style="color:var(--primary-color); margin:2.5rem 0 1.5rem 0;">${LanguageManager.get('dialogue')}</h3>
                ${lesson.dialogue.map(line => `
                    <div style="margin-bottom:1rem; padding:1.5rem; background:var(--bg-body); border-radius:1rem; border-left:4px solid var(--primary-color);">
                        <strong>${line.speaker}:</strong> ${line.text}
                    </div>
                `).join('')}

                <h3 style="color:var(--primary-color); margin:2.5rem 0 1.5rem 0;">${LanguageManager.get('keyTakeaways')}</h3>
                <ul style="padding-left:1.5rem;">
                    ${lesson.keyPoints.map(pt => `<li style="margin-bottom:0.75rem;">${pt}</li>`).join('')}
                </ul>

                <button class="btn btn-primary" style="margin-top:3rem; width:100%; padding:1rem; font-size:1.1rem;" onclick="app.handlers.completeLesson('${lesson.id}')">
                   ✅ ${LanguageManager.get('markCompleted')}
                </button>
            </div>
        `;
    },

    /* --- Fallbacks --- */
    renderBooks() {
        const el = document.getElementById('books-grid');
        if (el) el.innerHTML = `<p style="text-align:center;">Library feature coming soon with new design.</p>`;
    },

    renderProgress() {
        const el = document.getElementById('progress-view');
        if (el) el.innerHTML = `
            <div class="card">
                <h2>${LanguageManager.get('progress')}</h2>
                <p>Detailed charts coming soon.</p>
            </div>
         `;
    },

    /* --- Ads --- */
    renderAds() {
        const ads = Store.getAdContent();
        // Simple Sidebar Ad
        const adEl = document.getElementById('ad-sidebar');
        if (adEl && ads.length > 0) {
            const ad = ads[0];
            adEl.innerHTML = `
                <div class="card" style="border:none; background: var(--priority-medium);">
                    <img src="${ad.image}" style="width:100%; border-radius:0.5rem; margin-bottom:0.5rem;">
                    <h4 style="margin:0.5rem 0;">${ad.title}</h4>
                    <p style="font-size:0.85rem; margin-bottom:1rem;">${ad.text}</p>
                    <button class="btn btn-primary" style="width:100%; font-size:0.8rem;">Learn More</button>
                </div>
            `;
            adEl.classList.remove('hidden');
        }
    },

    /* --- PRO FEATURES --- */

    /**
     * Render Project Kickoff Tool (Interactive Planning Tool)
     */
    renderProjects() {
        const container = document.getElementById('projects-view');
        if (!container) return;

        container.innerHTML = `
            <div class="project-kickoff-tool">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 3rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🚀</div>
                    <h1 style="margin: 0 0 1rem 0; font-size: 2.5rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        أداة تخطيط المشاريع
                    </h1>
                    <p style="color: var(--text-secondary); font-size: 1.1rem; max-width: 600px; margin: 0 auto;">
                        احصل على خطة عمل احترافية لمشروعك في ثوانٍ! أدخل تفاصيل مشروعك وسنقوم بإنشاء خارطة طريق مفصلة لك.
                    </p>
                </div>

                <!-- Input Form -->
                <div class="card project-form-card" id="project-form-card">
                    <h2 style="margin: 0 0 2rem 0; text-align: center; color: var(--primary-color);">
                        📋 معلومات المشروع
                    </h2>
                    
                    <form id="project-kickoff-form" onsubmit="UI.generateProjectRoadmap(event)">
                        <!-- Project Name -->
                        <div class="form-group-modern" style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">
                                📌 اسم المشروع
                            </label>
                            <input 
                                type="text" 
                                id="project-name" 
                                class="input-field" 
                                placeholder="مثال: تطبيق إدارة المهام الذكي"
                                required
                                style="width: 100%;"
                            >
                        </div>

                        <!-- Project Type -->
                        <div class="form-group-modern" style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">
                                🎯 نوع المشروع
                            </label>
                            <select 
                                id="project-type" 
                                class="input-field" 
                                required
                                style="width: 100%;"
                            >
                                <option value="">اختر نوع المشروع...</option>
                                <option value="web">💻 تطوير ويب</option>
                                <option value="mobile">📱 تطبيق موبايل</option>
                                <option value="ai">🤖 ذكاء اصطناعي</option>
                                <option value="ecommerce">🛒 تجارة إلكترونية</option>
                            </select>
                        </div>

                        <!-- Budget -->
                        <div class="form-group-modern" style="margin-bottom: 2rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">
                                💰 الميزانية المتوقعة
                            </label>
                            <input 
                                type="text" 
                                id="project-budget" 
                                class="input-field" 
                                placeholder="مثال: 5000 دولار"
                                required
                                style="width: 100%;"
                            >
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem; justify-content: center;">
                            ✨ أنشئ خطتي
                        </button>
                    </form>
                </div>

                <!-- Results Container (Hidden Initially) -->
                <div id="project-roadmap-results" style="display: none;">
                    <!-- Will be populated by JavaScript -->
                </div>
            </div>
        `;
    },

    /**
     * Render Progress View
     * Shows real progress data calculated from completed tasks and lessons
     */
    renderProgress() {
        const el = document.getElementById('progress-view');
        if (!el) return;

        // Get real progress data from Store
        const progress = Store.getProgressData();

        // Format last activity date
        let lastActivityText = 'No activity yet';
        if (progress.lastActivity) {
            const date = new Date(progress.lastActivity);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) {
                lastActivityText = 'Just now';
            } else if (diffMins < 60) {
                lastActivityText = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
            } else if (diffHours < 24) {
                lastActivityText = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else if (diffDays === 1) {
                lastActivityText = 'Yesterday';
            } else if (diffDays < 7) {
                lastActivityText = `${diffDays} days ago`;
            } else {
                lastActivityText = date.toLocaleDateString();
            }
        }

        // Get feedback message based on progress
        const getFeedbackMessage = (percentage) => {
            if (percentage === 0) return 'Start learning to see your progress!';
            if (percentage < 25) return 'Great start! Keep going! 🌱';
            if (percentage < 50) return 'You\'re making good progress! 💪';
            if (percentage < 75) return 'Excellent work! You\'re over halfway! 🎯';
            if (percentage < 100) return 'Almost there! You\'re doing amazing! 🚀';
            return 'Congratulations! You\'ve completed everything! 🎉';
        };

        // Render empty state if no progress
        if (!progress.hasProgress) {
            el.innerHTML = `
                <div class="card" style="text-align: center; padding: 4rem 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1.5rem;">📊</div>
                    <h2 style="margin: 0 0 1rem 0;">No Progress Yet</h2>
                    <p style="color: var(--text-secondary); margin: 0 0 2rem 0; max-width: 500px; margin-left: auto; margin-right: auto;">
                        Start completing tasks and lessons to track your progress here.
                        Your achievements will be displayed with detailed statistics and visualizations.
                    </p>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="location.hash='#tasks'">
                            View Tasks
                        </button>
                        <button class="btn" onclick="location.hash='#languages'">
                            Start Learning
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Render progress dashboard with real data
        el.innerHTML = `
            <div class="progress-dashboard">
                <!-- Header -->
                <div style="margin-bottom: 2rem;">
                    <h1 style="margin: 0 0 0.5rem 0;">📊 Your Progress</h1>
                    <p style="margin: 0; color: var(--text-secondary);">Track your learning journey and achievements</p>
                </div>

                <!-- Overall Progress Card -->
                <div class="card" style="margin-bottom: 2rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1)); border: 2px solid var(--primary-color);">
                    <h3 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                        <span>🎯</span>
                        <span>Overall Progress</span>
                    </h3>
                    
                    <!-- Progress Bar -->
                    <div class="progress-container" style="height: 40px; margin-bottom: 1rem; border-radius: 20px; overflow: hidden; background: var(--border-color);">
                        <div class="progress-fill" style="width: ${progress.overall.percentage}%; height: 100%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 1.1rem; transition: width 0.5s ease;">
                            ${progress.overall.percentage}%
                        </div>
                    </div>

                    <!-- Stats -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">${progress.overall.completed}</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Completed</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--text-secondary);">${progress.overall.total - progress.overall.completed}</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Remaining</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--success-color);">${progress.streak}</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Day Streak</div>
                        </div>
                    </div>

                    <!-- Feedback Message -->
                    <div style="text-align: center; padding: 1rem; background: rgba(255, 255, 255, 0.5); border-radius: 0.5rem;">
                        <strong>${getFeedbackMessage(progress.overall.percentage)}</strong>
                    </div>
                </div>

                <!-- Detailed Stats Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                    <!-- Tasks Progress -->
                    <div class="card">
                        <h3 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>✅</span>
                            <span>Tasks</span>
                        </h3>
                        <div class="progress-container" style="margin-bottom: 1rem;">
                            <div class="progress-fill" style="width: ${progress.tasks.percentage}%;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                            <span style="color: var(--text-secondary);">Completed:</span>
                            <strong>${progress.tasks.completed} / ${progress.tasks.total}</strong>
                        </div>
                        <div style="text-align: center; margin-top: 1rem; font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">
                            ${progress.tasks.percentage}%
                        </div>
                    </div>

                    <!-- Lessons Progress -->
                    <div class="card">
                        <h3 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>📚</span>
                            <span>Lessons</span>
                        </h3>
                        <div class="progress-container" style="margin-bottom: 1rem;">
                            <div class="progress-fill" style="width: ${progress.lessons.percentage}%;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                            <span style="color: var(--text-secondary);">Completed:</span>
                            <strong>${progress.lessons.completed} / ${progress.lessons.total}</strong>
                        </div>
                        <div style="text-align: center; margin-top: 1rem; font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">
                            ${progress.lessons.percentage}%
                        </div>
                    </div>
                </div>

                <!-- Activity Info -->
                <div class="card">
                    <h3 style="margin: 0 0 1rem 0;">📅 Activity</h3>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Last Activity</div>
                            <div style="font-weight: 600;">${lastActivityText}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Current Streak</div>
                            <div style="font-weight: 600; color: var(--success-color);">${progress.streak} ${progress.streak === 1 ? 'day' : 'days'} 🔥</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render Settings Panel
     * Displays user preferences and configuration options
     */
    renderSettings() {
        const container = document.getElementById('settings-view');
        if (!container) return;

        const data = Store.getData();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const currentLang = LanguageManager.currentLang || 'en';

        container.innerHTML = `
            <div class="settings-container">
                <!-- Header -->
                <div style="margin-bottom: 2rem;">
                    <h1 style="margin: 0 0 0.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                        <span>⚙️</span>
                        <span>${LanguageManager.get('settings')}</span>
                    </h1>
                    <p style="margin: 0; color: var(--text-secondary);">Customize your experience</p>
                </div>

                <!-- Settings Cards -->
                <div style="display: grid; gap: 1.5rem;">
                    
                    <!-- Appearance Settings -->
                    <div class="card">
                        <h3 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>🎨</span>
                            <span>Appearance</span>
                        </h3>
                        
                        <!-- Theme Toggle -->
                        <div class="setting-item">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 0.25rem;">Theme</div>
                                <div style="font-size: 0.9rem; color: var(--text-secondary);">Choose your preferred color scheme</div>
                            </div>
                            <div class="theme-toggle-container">
                                <button class="theme-option ${currentTheme === 'light' ? 'active' : ''}" 
                                        onclick="UI.changeTheme('light')"
                                        data-theme-toggle="light">
                                    <span>☀️</span>
                                    <span>Light</span>
                                </button>
                                <button class="theme-option ${currentTheme === 'dark' ? 'active' : ''}" 
                                        onclick="UI.changeTheme('dark')"
                                        data-theme-toggle="dark">
                                    <span>🌙</span>
                                    <span>Dark</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Language Settings -->
                    <div class="card">
                        <h3 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>🌍</span>
                            <span>Language</span>
                        </h3>
                        
                        <div class="setting-item">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 0.25rem;">Interface Language</div>
                                <div style="font-size: 0.9rem; color: var(--text-secondary);">Select your preferred language</div>
                            </div>
                            <select class="setting-select" onchange="LanguageManager.setLanguage(this.value)">
                                <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                                <option value="es" ${currentLang === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
                                <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
                                <option value="de" ${currentLang === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
                                <option value="ar" ${currentLang === 'ar' ? 'selected' : ''}>🇸🇦 العربية</option>
                            </select>
                        </div>
                    </div>

                    <!-- Notifications Settings -->
                    <div class="card">
                        <h3 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>🔔</span>
                            <span>Notifications</span>
                        </h3>
                        
                        <div class="setting-item">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 0.25rem;">Task Reminders</div>
                                <div style="font-size: 0.9rem; color: var(--text-secondary);">Get notified about upcoming tasks</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" ${data.settings?.notifications !== false ? 'checked' : ''} 
                                       onchange="UI.toggleSetting('notifications', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

                        <div class="setting-item" style="margin-top: 1rem;">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 0.25rem;">Sound Effects</div>
                                <div style="font-size: 0.9rem; color: var(--text-secondary);">Play sounds for actions</div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" ${data.settings?.sounds !== false ? 'checked' : ''} 
                                       onchange="UI.toggleSetting('sounds', this.checked)">
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <!-- Data Management -->
                    <div class="card">
                        <h3 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>💾</span>
                            <span>Data Management</span>
                        </h3>
                        
                        <div style="display: grid; gap: 1rem;">
                            <button class="btn" onclick="UI.exportData()" style="justify-content: center;">
                                <span>📤</span>
                                <span>Export Data</span>
                            </button>
                            <button class="btn" onclick="UI.importData()" style="justify-content: center;">
                                <span>📥</span>
                                <span>Import Data</span>
                            </button>
                            <button class="btn" onclick="UI.clearAllData()" 
                                    style="justify-content: center; border-color: var(--danger-color); color: var(--danger-color);">
                                <span>🗑️</span>
                                <span>Clear All Data</span>
                            </button>
                        </div>
                    </div>

                    <!-- About -->
                    <div class="card">
                        <h3 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>ℹ️</span>
                            <span>About</span>
                        </h3>
                        
                        <div style="color: var(--text-secondary); line-height: 1.8;">
                            <p style="margin: 0 0 0.5rem 0;"><strong>PlanHub</strong> - Your Ultimate Productivity Platform</p>
                            <p style="margin: 0 0 0.5rem 0;">Version: 2.0.0</p>
                            <p style="margin: 0;">Built with modern web technologies</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Change theme
     * @param {string} theme - 'light' or 'dark'
     */
    changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = theme;

        // Save to localStorage
        const data = Store.getData();
        data.settings = data.settings || {};
        data.settings.theme = theme;
        Store.saveData(data);

        // Update active state
        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-theme-toggle="${theme}"]`)?.classList.add('active');

        this.showToast(`Theme changed to ${theme}`, 'success');
    },

    /**
     * Toggle a setting
     * @param {string} setting - Setting name
     * @param {boolean} value - Setting value
     */
    toggleSetting(setting, value) {
        const data = Store.getData();
        data.settings = data.settings || {};
        data.settings[setting] = value;
        Store.saveData(data);

        this.showToast(`${setting} ${value ? 'enabled' : 'disabled'}`, 'success');
    },

    /**
     * Export user data
     */
    exportData() {
        const data = Store.getData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `planhub-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.showToast('Data exported successfully', 'success');
    },

    /**
     * Import user data
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    Store.saveData(data);
                    this.showToast('Data imported successfully! Refreshing...', 'success');
                    setTimeout(() => location.reload(), 1500);
                } catch (error) {
                    this.showToast('Invalid data file', 'error');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    },

    /**
     * Clear all data
     */
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
            localStorage.clear();
            this.showToast('All data cleared! Refreshing...', 'success');
            setTimeout(() => location.reload(), 1500);
        }
    },

    /**
     * Generate Project Roadmap
     * Creates a dynamic roadmap based on user input
     */
    generateProjectRoadmap(event) {
        event.preventDefault();

        // Get form values
        const projectName = document.getElementById('project-name').value;
        const projectType = document.getElementById('project-type').value;
        const projectBudget = document.getElementById('project-budget').value;

        // Get project type details
        const projectTypes = {
            web: {
                name: 'تطوير ويب',
                icon: '💻',
                phases: [
                    { name: 'التخطيط والتصميم', duration: '2-3 أسابيع', tasks: ['تحديد المتطلبات', 'تصميم واجهة المستخدم', 'اختيار التقنيات'] },
                    { name: 'التطوير', duration: '4-6 أسابيع', tasks: ['بناء الواجهة الأمامية', 'تطوير الخلفية', 'ربط قاعدة البيانات'] },
                    { name: 'الاختبار', duration: '1-2 أسبوع', tasks: ['اختبار الوظائف', 'اختبار الأمان', 'اختبار الأداء'] },
                    { name: 'الإطلاق', duration: '1 أسبوع', tasks: ['نشر الموقع', 'إعداد النطاق', 'المراقبة والصيانة'] }
                ],
                tools: [
                    { name: 'لابتوب برمجة احترافي', price: '1200$', link: '#', icon: '💻' },
                    { name: 'كتاب: تطوير الويب الحديث', price: '45$', link: '#', icon: '📚' },
                    { name: 'شاشة إضافية 27 بوصة', price: '250$', link: '#', icon: '🖥️' }
                ]
            },
            mobile: {
                name: 'تطبيق موبايل',
                icon: '📱',
                phases: [
                    { name: 'التخطيط والتصميم', duration: '2-3 أسابيع', tasks: ['دراسة السوق', 'تصميم UX/UI', 'اختيار منصة التطوير'] },
                    { name: 'التطوير', duration: '6-8 أسابيع', tasks: ['بناء الواجهات', 'تطوير الميزات', 'دمج APIs'] },
                    { name: 'الاختبار', duration: '2-3 أسابيع', tasks: ['اختبار على أجهزة مختلفة', 'اختبار الأداء', 'Beta Testing'] },
                    { name: 'الإطلاق', duration: '1-2 أسبوع', tasks: ['رفع على المتاجر', 'التسويق', 'جمع التقييمات'] }
                ],
                tools: [
                    { name: 'MacBook Pro للتطوير', price: '2500$', link: '#', icon: '💻' },
                    { name: 'دورة: تطوير تطبيقات الموبايل', price: '99$', link: '#', icon: '🎓' },
                    { name: 'جهاز اختبار Android', price: '400$', link: '#', icon: '📱' }
                ]
            },
            ai: {
                name: 'ذكاء اصطناعي',
                icon: '🤖',
                phases: [
                    { name: 'البحث والتخطيط', duration: '3-4 أسابيع', tasks: ['تحديد حالة الاستخدام', 'جمع البيانات', 'اختيار النماذج'] },
                    { name: 'التطوير والتدريب', duration: '8-12 أسبوع', tasks: ['تنظيف البيانات', 'تدريب النماذج', 'تحسين الأداء'] },
                    { name: 'التقييم', duration: '2-3 أسابيع', tasks: ['اختبار الدقة', 'تحليل النتائج', 'التحسينات'] },
                    { name: 'النشر', duration: '2 أسبوع', tasks: ['نشر النموذج', 'إنشاء API', 'المراقبة المستمرة'] }
                ],
                tools: [
                    { name: 'GPU قوي للتدريب', price: '1500$', link: '#', icon: '🎮' },
                    { name: 'كتاب: التعلم العميق', price: '60$', link: '#', icon: '📚' },
                    { name: 'اشتراك Cloud Computing', price: '200$/شهر', link: '#', icon: '☁️' }
                ]
            },
            ecommerce: {
                name: 'تجارة إلكترونية',
                icon: '🛒',
                phases: [
                    { name: 'التخطيط', duration: '2-3 أسابيع', tasks: ['اختيار المنتجات', 'دراسة المنافسين', 'تحديد المنصة'] },
                    { name: 'الإعداد والتطوير', duration: '4-6 أسابيع', tasks: ['إنشاء المتجر', 'إضافة المنتجات', 'إعداد الدفع'] },
                    { name: 'التسويق', duration: '3-4 أسابيع', tasks: ['SEO', 'حملات إعلانية', 'وسائل التواصل'] },
                    { name: 'الإطلاق والنمو', duration: 'مستمر', tasks: ['إطلاق المتجر', 'خدمة العملاء', 'تحليل المبيعات'] }
                ],
                tools: [
                    { name: 'كاميرا لتصوير المنتجات', price: '800$', link: '#', icon: '📷' },
                    { name: 'دورة: التجارة الإلكترونية', price: '149$', link: '#', icon: '🎓' },
                    { name: 'برنامج إدارة المخزون', price: '50$/شهر', link: '#', icon: '📦' }
                ]
            }
        };

        const typeData = projectTypes[projectType];

        // Hide form and show results with animation
        const formCard = document.getElementById('project-form-card');
        const resultsContainer = document.getElementById('project-roadmap-results');

        formCard.style.opacity = '0';
        formCard.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            formCard.style.display = 'none';
            resultsContainer.style.display = 'block';
            resultsContainer.style.opacity = '0';

            // Generate results HTML
            resultsContainer.innerHTML = `
                <div class="roadmap-results">
                    <!-- Success Header -->
                    <div class="card" style="text-align: center; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1)); border: 2px solid var(--primary-color); margin-bottom: 2rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                        <h2 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">تم إنشاء خطتك بنجاح!</h2>
                        <p style="margin: 0; color: var(--text-secondary);">
                            خطة عمل شاملة لمشروع: <strong>${projectName}</strong>
                        </p>
                    </div>

                    <!-- Project Summary -->
                    <div class="card" style="margin-bottom: 2rem;">
                        <h3 style="margin: 0 0 1.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            <span>${typeData.icon}</span>
                            <span>ملخص المشروع</span>
                        </h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                            <div>
                                <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">اسم المشروع</div>
                                <div style="font-weight: 600;">${projectName}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">نوع المشروع</div>
                                <div style="font-weight: 600;">${typeData.icon} ${typeData.name}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">الميزانية</div>
                                <div style="font-weight: 600; color: var(--success-color);">${projectBudget}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Roadmap Phases -->
                    <h2 style="margin: 0 0 1.5rem 0; text-align: center;">🗺️ خارطة الطريق</h2>
                    <div class="roadmap-timeline">
                        ${typeData.phases.map((phase, index) => `
                            <div class="card roadmap-phase" style="margin-bottom: 1.5rem; border-left: 4px solid var(--primary-color); animation: fadeInUp 0.5s ease ${index * 0.1}s both;">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                                    <div>
                                        <h3 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">
                                            المرحلة ${index + 1}: ${phase.name}
                                        </h3>
                                        <div style="font-size: 0.9rem; color: var(--text-secondary);">
                                            ⏱️ المدة المتوقعة: ${phase.duration}
                                        </div>
                                    </div>
                                    <span class="badge" style="background: var(--primary-color); color: white;">
                                        ${index + 1}/4
                                    </span>
                                </div>
                                <div>
                                    <strong style="display: block; margin-bottom: 0.75rem;">المهام الرئيسية:</strong>
                                    <ul style="margin: 0; padding-right: 1.5rem; line-height: 1.8;">
                                        ${phase.tasks.map(task => `<li>${task}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Recommended Tools Section -->
                    <div class="card" style="margin-top: 3rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1)); border: 2px solid var(--warning-color);">
                        <h2 style="margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem; color: var(--warning-color);">
                            <span>🛠️</span>
                            <span>أدوات مقترحة لمشروعك</span>
                        </h2>
                        <p style="margin: 0 0 2rem 0; color: var(--text-secondary);">
                            هذه الأدوات ستساعدك على إنجاز مشروعك بكفاءة أعلى
                        </p>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                            ${typeData.tools.map(tool => `
                                <div class="tool-card" style="padding: 1.5rem; background: var(--bg-card); border-radius: 1rem; border: 1px solid var(--border-color); transition: transform 0.3s ease, box-shadow 0.3s ease;">
                                    <div style="font-size: 2.5rem; margin-bottom: 1rem; text-align: center;">${tool.icon}</div>
                                    <h4 style="margin: 0 0 0.5rem 0; text-align: center;">${tool.name}</h4>
                                    <div style="text-align: center; font-size: 1.25rem; font-weight: 700; color: var(--success-color); margin-bottom: 1rem;">
                                        ${tool.price}
                                    </div>
                                    <a href="${tool.link}" class="btn btn-primary" style="width: 100%; justify-content: center; text-decoration: none;" target="_blank">
                                        🛒 عرض المنتج
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(245, 158, 11, 0.1); border-radius: 0.5rem; text-align: center; font-size: 0.9rem; color: var(--text-secondary);">
                            💡 <strong>ملاحظة:</strong> يمكنك استبدال روابط المنتجات بروابط Amazon Affiliate الخاصة بك
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 3rem; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="UI.resetProjectForm()">
                            ➕ إنشاء خطة جديدة
                        </button>
                        <button class="btn" onclick="window.print()">
                            🖨️ طباعة الخطة
                        </button>
                    </div>
                </div>
            `;

            // Fade in results
            setTimeout(() => {
                resultsContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                resultsContainer.style.opacity = '1';
                resultsContainer.style.transform = 'translateY(0)';
            }, 50);

            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);

        // Show success toast
        this.showToast('تم إنشاء خطة المشروع بنجاح! 🎉', 'success');
    },

    /**
     * Reset Project Form
     * Shows the form again for creating a new roadmap
     */
    resetProjectForm() {
        const formCard = document.getElementById('project-form-card');
        const resultsContainer = document.getElementById('project-roadmap-results');

        resultsContainer.style.opacity = '0';

        setTimeout(() => {
            resultsContainer.style.display = 'none';
            formCard.style.display = 'block';
            formCard.style.opacity = '0';
            formCard.style.transform = 'translateY(20px)';

            // Reset form
            document.getElementById('project-kickoff-form').reset();

            setTimeout(() => {
                formCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                formCard.style.opacity = '1';
                formCard.style.transform = 'translateY(0)';
            }, 50);

            // Scroll to form
            formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    },

    /**
     * Render Psychological Tests Platform
     * Displays the full tests dashboard with all features
     */
    renderTests() {
        const container = document.getElementById('tests-view');
        if (!container) return;

        // Render the complete tests dashboard from TestsModule
        container.innerHTML = TestsModule.renderDashboard();
    }
};
window.UI = UI;
