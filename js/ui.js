const UI = {
    /* --- HELPERS --- */
    showToast(msg, type = 'info') {
        const con = document.getElementById('notification-container');
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerText = msg;
        con.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    },

    /* --- EXISTING UI METHODS --- */
    renderHome() {
        const data = Store.getData();
        const pending = data.tasks.filter(t => !t.completed).length;
        const container = document.getElementById('home-view');

        container.innerHTML = `
            <div class="stats-grid">
                <div class="card stat-card">
                    <h3>Pending</h3>
                    <div class="value">${pending}</div>
                </div>
                <div class="card stat-card">
                    <h3>Points</h3>
                    <div class="value" style="color:var(--primary-color)">${data.points}</div>
                </div>
                <div class="card stat-card">
                    <h3>Badges</h3>
                    <div class="value" style="font-size:1.5rem">${data.badges.length ? data.badges.join(' 🏅 ') : 'None'}</div>
                </div>
            </div>
            
            <div class="card">
                <h3>Recent Activity</h3>
                <ul class="task-list" style="margin-top:1rem">
                    ${data.tasks.slice(0, 5).map(t => this.createTaskHTML(t, false)).join('') || '<p style="color:var(--text-secondary)">No tasks yet.</p>'}
                </ul>
            </div>
        `;
    },

    renderProgress() {
        const stats = Store.getGlobalStats();
        const langs = Store.getLanguages();
        const langData = Store.getLanguageData();

        document.getElementById('progress-view').innerHTML = `
            <!-- Profile Header -->
            <div class="card profile-header-struct">
                <div class="profile-avatar">${stats.username.charAt(0).toUpperCase()}</div>
                <div style="flex:1;">
                    <h2 style="margin:0; font-size:1.5rem;">${stats.username}</h2>
                    <p style="color:var(--text-secondary); margin:0;">${stats.rank} Lerning</p>
                </div>
                <div style="text-align:right;">
                    <h2 style="margin:0; color:var(--primary-color);">Level ${Math.floor(stats.totalXP / 1000) + 1}</h2>
                    <p style="color:var(--text-secondary); margin:0;">${stats.totalXP} XP</p>
                </div>
            </div>

            <!-- Streak & Stats -->
            <div style="display:grid; grid-template-columns: 2fr 1fr; gap:1.5rem; margin-bottom:2rem;" class="stat-section">
                <!-- Streak Calendar (Visual Only Mock) -->
                <div class="card">
                    <h3>🔥 Learning Streak</h3>
                    <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
                        <span style="font-size:3rem; font-weight:800; color:#f59e0b">${stats.streak}</span>
                        <div>
                            <p style="margin:0; font-weight:bold;">Day Streak!</p>
                            <p style="margin:0; color:var(--text-secondary); font-size:0.9rem;">Keep it up!</p>
                        </div>
                    </div>
                    <!-- Heatmap Grid -->
                    <div style="display:flex; gap:0.25rem; flex-wrap:wrap;">
                        ${Array(30).fill(0).map((_, i) =>
            `<div style="width:1.5rem; height:1.5rem; border-radius:0.25rem; background:${Math.random() > 0.3 ? 'var(--success-color)' : 'var(--bg-body)'}; opacity:${Math.random() > 0.3 ? Math.random() : 1};"></div>`
        ).join('')}
                    </div>
                </div>

                <!-- Simpler Stats -->
                <div class="card">
                    <h3>🏆 Achievements</h3>
                    <h2 style="margin: 1rem 0 0 0;">${stats.lvlCount}</h2>
                    <p style="color:var(--text-secondary);">Levels Completed</p>
                    <hr style="border:0; border-top:1px solid var(--border-color); margin:1rem 0;">
                    <h2 style="margin:0;">${stats.langCount}</h2>
                    <p style="color:var(--text-secondary);">Languages Started</p>
                </div>
            </div>

            <!-- Detailed Language Breakdown -->
            <h3 style="margin-bottom:1rem;">Language Progress</h3>
            <div style="display:grid; gap:1rem;">
                ${langs.map(lang => {
            const lData = langData[lang.code] || {};
            // Calculate avg completion
            const levels = Store.getLevels();
            let totalP = 0;
            levels.forEach(l => totalP += (lData[l] || 0));
            const avg = Math.round(totalP / levels.length);

            return `
                    <div class="card" style="display:flex; align-items:center; gap:1rem;">
                        <span style="font-size:2rem;">${lang.flag}</span>
                        <div style="flex:1;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                                <strong>${lang.name}</strong>
                                <span style="font-size:0.9rem; color:var(--text-secondary);">${avg}% Mastered</span>
                            </div>
                            <div style="height:0.5rem; background:var(--bg-body); border-radius:1rem; overflow:hidden;">
                                <div style="width:${avg}%; background:var(--primary-color); height:100%"></div>
                            </div>
                        </div>
                    </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    createTaskHTML(task, draggable = true) {
        return `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}" ${draggable ? 'draggable="true"' : ''}>
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} ${!draggable ? 'disabled' : ''}>
            <div style="flex:1">
                <span class="task-text">${task.text}</span>
                <div style="font-size:0.8rem; color:var(--text-secondary); display:flex; gap:0.5rem; align-items:center; margin-top:0.2rem">
                    <span class="badge badge-category">${task.category}</span>
                    <span class="badge badge-priority-${task.priority}">${task.priority.toUpperCase()}</span>
                    ${task.notes ? `<span>📝 ${task.notes}</span>` : ''}
                </div>
            </div>
            ${draggable ? `
            <div style="margin-left:auto; display:flex; gap:0.5rem">
                <button class="btn-icon delete-btn" style="background:none; border:none; cursor:pointer">🗑️</button>
                <span style="cursor:grab; opacity:0.5">⋮⋮</span>
            </div>` : ''}
        </li>`;
    },

    renderTaskList(filter = 'all', search = '') {
        let tasks = Store.getTasks();
        if (filter === 'completed') tasks = tasks.filter(t => t.completed);
        if (filter === 'pending') tasks = tasks.filter(t => !t.completed);
        if (search) tasks = tasks.filter(t => t.text.toLowerCase().includes(search.toLowerCase()));

        const html = tasks.map(t => this.createTaskHTML(t)).join('') || '<p style="text-align:center; color:var(--text-secondary)">No tasks found.</p>';
        document.getElementById('task-list').innerHTML = html;
        if (filter === 'all' && !search && window.setupDragAndDrop) window.setupDragAndDrop();
    },

    /* --- LANGUAGE LEARNING UI --- */
    renderLanguagesHub() {
        const langs = Store.getLanguages();
        const progressData = Store.getLanguageData();
        const container = document.getElementById('languages-view');

        // Language Selection Page
        let html = `
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.5rem;">
                ${langs.map(lang => {
            const prog = progressData[lang.code] || {};
            // Calculate total progress avg
            return `
                    <div class="card lang-card" onclick="window.location.hash = '#languages/${lang.code}'" style="cursor:pointer; transition:transform 0.2s;">
                        <div style="font-size:3rem; margin-bottom:1rem;">${lang.flag}</div>
                        <h3 style="margin:0 0 0.5rem 0;">${lang.name}</h3>
                        <p style="color:var(--text-secondary); font-size:0.9rem;">Click to start learning</p>
                    </div>
                    `;
        }).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    renderLevels(langCode) {
        const lang = Store.getLanguages().find(l => l.code === langCode);
        if (!lang) return;

        const levels = Store.getLevels();
        const progressData = Store.getLanguageData()[langCode] || {};
        const container = document.getElementById('languages-view');

        const levelColors = {
            'A1': 'var(--success-color)', 'A2': '#3b82f6',
            'B1': 'var(--warning-color)', 'B2': '#f97316',
            'C1': 'var(--danger-color)', 'C2': '#7e22ce'
        };

        const html = `
            <div style="margin-bottom:2rem;">
                <button onclick="window.location.hash='#languages'" class="btn" style="margin-bottom:1rem;">← Back to Languages</button>
                <h2>${lang.flag} ${lang.name} - Select Level</h2>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:1.5rem;">
                ${levels.map(lvl => {
            const p = progressData[lvl] || 0;
            return `
                    <div class="card level-card" style="border-top: 4px solid ${levelColors[lvl]}" onclick="window.location.hash = '#languages/${langCode}/${lvl}'">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                            <h2 style="margin:0; color:${levelColors[lvl]}">${lvl}</h2>
                            <span style="font-size:0.9rem; font-weight:600; color:${p === 100 ? 'var(--success-color)' : 'var(--text-secondary)'}">${p}% Completed</span>
                        </div>
                        <div style="height:0.5rem; background:var(--bg-body); border-radius:1rem; overflow:hidden; margin-bottom:1rem;">
                            <div style="width:${p}%; background:${levelColors[lvl]}; height:100%"></div>
                        </div>
                        <button class="btn" style="width:100%; justify-content:center;">Start Lessons</button>
                    </div>
                    `;
        }).join('')}
            </div>
        `;
        container.innerHTML = html;
    },

    renderLessonDashboard(langCode, level) {
        const lang = Store.getLanguages().find(l => l.code === langCode);
        const content = Store.getLevelContent(langCode, level);
        const container = document.getElementById('languages-view');

        const html = `
            <div style="margin-bottom:2rem; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <button onclick="window.location.hash='#languages/${langCode}'" class="btn" style="margin-bottom:1rem;">← Back to Levels</button>
                    <h2>${lang.flag} ${lang.name} - Level ${level}</h2>
                </div>
                <button class="btn btn-primary" onclick="UI.downloadLessonPDF('${langCode}', '${level}')">
                    📄 Download PDF
                </button>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:2rem;">
                <!-- Vocabulary -->
                <div class="card">
                    <h3>📖 Vocabulary</h3>
                    <p style="color:var(--text-secondary); margin-bottom:1rem;">Learn core words.</p>
                    <button class="btn btn-primary" onclick="UI.startFlashcards('vocab', '${langCode}', '${level}')">Start Flashcards</button>
                </div>

                <!-- Phrases -->
                <div class="card">
                    <h3>💬 Phrases</h3>
                    <p style="color:var(--text-secondary); margin-bottom:1rem;">Common daily expressions.</p>
                    <button class="btn btn-primary" onclick="UI.startFlashcards('phrases', '${langCode}', '${level}')">Start Flashcards</button>
                </div>

                <!-- Grammar -->
                <div class="card">
                    <h3>📐 Grammar</h3>
                    <p style="color:var(--text-secondary); margin-bottom:1rem;">Rules and structures.</p>
                    <button class="btn btn-primary" onclick="UI.showGrammar('${langCode}', '${level}')">View Rules</button>
                </div>

                <!-- Exercises -->
                <div class="card">
                    <h3>📝 Exercises</h3>
                    <p style="color:var(--text-secondary); margin-bottom:1rem;">Test your knowledge.</p>
                    <button class="btn btn-primary" onclick="UI.startExercise('${langCode}', '${level}')">Start Quiz</button>
                </div>
            </div>
            
            <div id="lesson-content-area" style="margin-top:2rem;"></div>
        `;
        container.innerHTML = html;
    },

    async downloadLessonPDF(langCode, level) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const lang = Store.getLanguages().find(l => l.code === langCode);
        const content = Store.getLevelContent(langCode, level);

        // Title
        doc.setFontSize(22);
        doc.text(`${lang.name} - Level ${level}`, 20, 20);

        doc.setFontSize(12);
        doc.text(`Generated by Daily Planner`, 20, 30);

        let y = 40;

        // Vocabulary
        doc.setFontSize(16);
        doc.text('Vocabulary', 20, y);
        y += 10;

        const vocabData = content.vocab.map(v => [v.word, v.translation]);
        doc.autoTable({
            head: [['Word', 'Translation']],
            body: vocabData,
            startY: y,
            theme: 'striped'
        });

        y = doc.lastAutoTable.finalY + 20;

        // Phrases
        doc.text('Phrases', 20, y);
        y += 10;

        const phraseData = content.phrases.map(p => [p.text, p.translation]);
        doc.autoTable({
            head: [['Phrase', 'Translation']],
            body: phraseData,
            startY: y,
            theme: 'striped'
        });

        y = doc.lastAutoTable.finalY + 20;

        // Grammar
        doc.text('Grammar', 20, y);
        y += 10;

        content.grammar.rules.forEach((rule, i) => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`${i + 1}. ${rule.title}`, 20, y);
            y += 7;
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);

            const splitText = doc.splitTextToSize(rule.content, 170);
            doc.text(splitText, 20, y);
            y += (splitText.length * 5) + 5;
        });

        doc.save(`${lang.name}_${level}_Lesson.pdf`);
        UI.showToast('PDF Downloaded!', 'success');
    },

    /* --- LESSON MODES --- */
    startFlashcards(type, langCode, level) {
        const content = Store.getLevelContent(langCode, level);
        const items = type === 'vocab' ? content.vocab : content.phrases;
        const area = document.getElementById('lesson-content-area');

        let currentIndex = 0;

        const renderCard = () => {
            const item = items[currentIndex];
            const frontText = type === 'vocab' ? item.word : item.text;
            const backText = item.translation;
            const image = item.image ? `<img src="${item.image}" alt="${frontText}" style="width:100px; height:100px; object-fit:contain; margin-bottom:1rem;">` : '';

            area.innerHTML = `
                <div class="card" style="max-width:500px; margin:0 auto; text-align:center; min-height:300px; display:flex; flex-direction:column; justify-content:center; align-items:center; perspective: 1000px;" id="flashcard-container">
                    <div class="flashcard-inner" style="width:100%; transition: transform 0.6s; transform-style: preserve-3d; cursor:pointer;" onclick="this.classList.toggle('flipped')">
                        <!-- Front -->
                        <div class="flashcard-front" style="backface-visibility: hidden; position: absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                            ${image}
                            <h2 style="font-size:2rem;">${frontText}</h2>
                            <p style="color:var(--text-secondary);">Tap to flip</p>
                        </div>
                        <!-- Back -->
                        <div class="flashcard-back" style="backface-visibility: hidden; transform: rotateY(180deg); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem;">
                            <h2 style="font-size:2rem; color:var(--primary-color)">${backText}</h2>
                        </div>
                    </div>
                </div>
                
                <div style="display:flex; justify-content:center; gap:1rem; margin-top:2rem;">
                    <button class="btn" onclick="if(${currentIndex} > 0) { ${currentIndex}--; UI.renderCurrentCard(); }">Previous</button>
                    <span style="display:flex; align-items:center;">${currentIndex + 1} / ${items.length}</span>
                    <button class="btn btn-primary" onclick="if(${currentIndex} < ${items.length - 1}) { ${currentIndex}++; UI.renderCurrentCard(); } else { UI.finishLesson('${langCode}', '${level}'); }">
                        ${currentIndex === items.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>

                <style>
                    .flashcard-inner.flipped { transform: rotateY(180deg); }
                    #flashcard-container { height: 300px; }
                    .flashcard-front, .flashcard-back { height:300px; width:100%; background:var(--bg-card); position:absolute; top:0; left:0; border-radius:0.75rem; border:1px solid var(--border-color); }
                </style>
            `;

            // Re-bind helper for buttons since we are replacing innerHTML
            UI.renderCurrentCard = renderCard;
        };

        renderCard();
    },

    showGrammar(langCode, level) {
        const content = Store.getLevelContent(langCode, level).grammar;
        const area = document.getElementById('lesson-content-area');

        area.innerHTML = `
            <div class="card">
                <h2 style="border-bottom:1px solid var(--border-color); padding-bottom:1rem; margin-bottom:1rem;">${content.title}</h2>
                ${content.rules.map((rule, idx) => `
                    <div style="margin-bottom:1.5rem;">
                        <h3 style="color:var(--primary-color); margin-bottom:0.5rem;">${idx + 1}. ${rule.title}</h3>
                        <p style="line-height:1.6;">${rule.content}</p>
                    </div>
                `).join('')}
                <button class="btn btn-primary" onclick="UI.finishLesson('${langCode}', '${level}')">Mark as Read</button>
            </div>
        `;
    },

    startExercise(langCode, level) {
        const area = document.getElementById('lesson-content-area');
        // Simple mock quiz
        area.innerHTML = `
            <div class="card" style="text-align:center;">
                <h3>Placement Test / Exercise</h3>
                <p>What is the translation for "Hello"?</p>
                <div style="display:flex; justify-content:center; gap:1rem; margin:2rem 0;">
                    <button class="btn" onclick="alert('Correct!'); UI.finishLesson('${langCode}', '${level}')">Mornin</button>
                    <button class="btn" onclick="alert('Correct!'); UI.finishLesson('${langCode}', '${level}')">Hola/Bonjour/etc</button>
                    <button class="btn" onclick="alert('Incorrect!');">Bye</button>
                </div>
            </div>
        `;
    },

    finishLesson(langCode, level) {
        Store.saveLanguageProgress(langCode, level, 100);
        UI.showToast('Lesson Completed! Progress saved.', 'success');
        UI.renderLevels(langCode); // Go back to levels
    }
};

window.UI = UI;
