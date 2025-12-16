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

        // Recent stats dashboard
        const data = Store.getData();
        const pending = data.tasks.filter(t => !t.completed).length;
        const totalPoints = data.points || 0;

        const homeView = document.getElementById('home-view');
        if (homeView) {
            homeView.innerHTML = `
                <div class="stats-grid">
                    <div class="card stat-card">
                        <h3>Pending Tasks</h3>
                        <div class="value">${pending}</div>
                    </div>
                    <div class="card stat-card">
                        <h3>Total Points</h3>
                        <div class="value" style="color:var(--primary-color)">${totalPoints}</div>
                    </div>
                    <div class="card stat-card">
                        <h3>Badges</h3>
                        <div class="value">${data.badges ? data.badges.length : 0}</div>
                    </div>
                </div>
                
                <h3 style="margin-bottom:1rem;">Quick Actions</h3>
                <div style="display:flex; gap:1rem;">
                    <button class="btn btn-primary" onclick="location.hash='#tasks'">View Tasks</button>
                    <button class="btn" style="background:var(--bg-card); border:1px solid var(--border-color);" onclick="location.hash='#languages'">Start Learning</button>
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
    }
};
window.UI = UI;
