/* ============================================
   PSYCHOLOGICAL TESTS MODULE
   Self-Assessment Platform with Free/Pro Features
   ============================================ */

const TestsModule = {
    currentTest: null,
    currentAnswers: {},
    currentQuestionIndex: 0,

    /**
     * Initialize the Tests module
     */
    init() {
        console.log('TestsModule: Initialized');
        this.currentTest = null;
        this.currentAnswers = {};
        this.currentQuestionIndex = 0;
    },

    /**
     * Render the main tests dashboard
     */
    renderDashboard() {
        const isPro = ProManager.isPro();
        const categories = Store.getTestCategories();
        const history = Store.getTestHistory();

        return `
            <div class="tests-dashboard">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <h1 style="margin: 0 0 0.5rem 0; font-size: 2rem;">🧠 Psychological Assessments</h1>
                        <p style="margin: 0; color: var(--text-secondary);">Discover insights about yourself through scientifically-designed tests</p>
                    </div>
                </div>

                <!-- Stats -->
                <div class="stats-grid" style="margin-bottom: 3rem;">
                    <div class="card stat-card">
                        <h3>Tests Completed</h3>
                        <div class="value">${history.length}</div>
                    </div>
                    <div class="card stat-card">
                        <h3>Available Tests</h3>
                        <div class="value">${categories.length}</div>
                    </div>
                    <div class="card stat-card">
                        <h3>Account Type</h3>
                        <div class="value" style="font-size: 1.5rem;">${isPro ? '⭐ PRO' : '🆓 FREE'}</div>
                    </div>
                </div>

                <!-- Test Categories -->
                <h2 style="margin-bottom: 1.5rem;">Available Assessments</h2>
                <div class="test-categories-grid">
                    ${categories.map(cat => this.renderCategoryCard(cat)).join('')}
                </div>

                <!-- PRO Features Section -->
                <h2 style="margin: 3rem 0 1.5rem 0;">PRO Features ${isPro ? '✨' : '🔒'}</h2>
                <div class="features-grid">
                    ${this.renderProFeatureCard('detailed-analysis', '📊', 'Detailed Analysis', 'Get in-depth psychological insights and personalized recommendations', !isPro)}
                    ${this.renderProFeatureCard('test-history', '📈', 'Test History & Tracking', 'Compare your results over time and track your progress', !isPro)}
                    ${this.renderProFeatureCard('pdf-export', '📄', 'PDF Report Export', 'Download professional reports of your assessment results', !isPro)}
                </div>

                <!-- Test History -->
                ${history.length > 0 ? `
                    <h2 style="margin: 3rem 0 1.5rem 0;">Recent Tests</h2>
                    <div class="test-history-list">
                        ${history.slice(-3).reverse().map(result => this.renderHistoryItem(result, isPro)).join('')}
                    </div>
                    ${history.length > 3 && isPro ? `
                        <button class="btn" onclick="TestsModule.viewFullHistory()" style="margin-top: 1rem;">
                            View Full History
                        </button>
                    ` : ''}
                    ${history.length > 3 && !isPro ? `
                        <div class="pro-feature-notice" style="margin-top: 1rem; padding: 1rem; background: rgba(251, 191, 36, 0.1); border-radius: 0.5rem; text-align: center;">
                            <span style="margin-right: 0.5rem;">🔒</span>
                            <span>View full test history with <strong>PRO</strong></span>
                        </div>
                    ` : ''}
                ` : `
                    <div class="card" style="margin-top: 3rem; text-align: center; padding: 3rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                        <h3 style="margin-bottom: 0.5rem;">No Tests Taken Yet</h3>
                        <p style="color: var(--text-secondary); margin: 0;">Start your first assessment above to begin your journey of self-discovery</p>
                    </div>
                `}
            </div>
        `;
    },

    /**
     * Render a test category card
     */
    renderCategoryCard(category) {
        return `
            <div class="card test-category-card" onclick="TestsModule.showTestInfo('${category.id}_test')" style="cursor: pointer; border-left: 4px solid ${category.color};">
                <div class="test-category-icon" style="font-size: 3rem; margin-bottom: 1rem;">${category.icon}</div>
                <h3 style="margin: 0 0 0.5rem 0; color: ${category.color};">${category.name}</h3>
                <p style="margin: 0 0 1rem 0; color: var(--text-secondary); font-size: 0.9rem;">${category.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-secondary);">
                    <span>⏱️ 10-15 minutes</span>
                    <span>📝 20 questions</span>
                </div>
            </div>
        `;
    },

    /**
     * Render PRO feature card
     */
    renderProFeatureCard(featureId, icon, title, description, isLocked) {
        const clickHandler = isLocked
            ? `onclick="ProManager.showUpgradeModal('${title}')"`
            : `onclick="TestsModule.accessProFeature('${featureId}')"`;

        return `
            <div class="feature-card ${isLocked ? 'locked' : 'unlocked'}" ${clickHandler}>
                <div class="feature-icon">${icon}</div>
                <div class="feature-content">
                    <h3 class="feature-title">
                        ${title}
                        <span class="pro-badge">PRO</span>
                    </h3>
                    <p class="feature-description">${description}</p>
                </div>
                ${isLocked ? '<div class="feature-lock-overlay"><span class="lock-icon">🔒</span></div>' : ''}
            </div>
        `;
    },

    /**
     * Render test history item
     */
    renderHistoryItem(result, isPro) {
        const test = Store.getTest(result.testId);
        const date = new Date(result.timestamp).toLocaleDateString();
        const time = new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `
            <div class="card" style="cursor: pointer;" onclick="TestsModule.viewResult('${result.id}')">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 0.5rem 0;">${test ? test.title : 'Unknown Test'}</h4>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">
                            ${date} at ${time}
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <div class="badge" style="background: var(--primary-color)20; color: var(--primary-color); font-size: 1.25rem; padding: 0.5rem 1rem;">
                            ${result.score}%
                        </div>
                        ${!isPro ? '<div style="margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-secondary);">🔒 Full details in PRO</div>' : ''}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Show test information modal
     */
    showTestInfo(testId) {
        const test = Store.getTest(testId);
        if (!test) {
            UI.showToast('Test not found', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'upgrade-modal-overlay active';
        modal.innerHTML = `
            <div class="upgrade-modal">
                <div class="upgrade-modal-header" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                    <h2>${test.title}</h2>
                </div>
                <div class="upgrade-modal-body">
                    <p style="font-size: 1.1rem; margin-bottom: 1.5rem;">${test.description}</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
                        <div class="card" style="text-align: center; padding: 1rem;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📝</div>
                            <div style="font-weight: 600;">${test.questions.length} Questions</div>
                        </div>
                        <div class="card" style="text-align: center; padding: 1rem;">
                            <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏱️</div>
                            <div style="font-weight: 600;">${test.duration}</div>
                        </div>
                    </div>

                    <div class="card" style="background: var(--bg-body); padding: 1.5rem; margin-bottom: 1.5rem;">
                        <h4 style="margin: 0 0 1rem 0;">What You'll Discover:</h4>
                        <ul style="margin: 0; padding-left: 1.5rem;">
                            <li style="margin-bottom: 0.5rem;">Your unique ${test.category} profile</li>
                            <li style="margin-bottom: 0.5rem;">Personalized insights and analysis</li>
                            <li style="margin-bottom: 0.5rem;">Strengths and areas for growth</li>
                            <li>Actionable recommendations</li>
                        </ul>
                    </div>

                    <div class="upgrade-modal-footer">
                        <button class="btn btn-primary" onclick="TestsModule.startTest('${testId}')">
                            Start Assessment
                        </button>
                        <button class="btn" onclick="TestsModule.closeModal()">
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    /**
     * Start a test
     */
    startTest(testId) {
        this.closeModal();

        const test = Store.getTest(testId);
        if (!test) {
            UI.showToast('Test not found', 'error');
            return;
        }

        this.currentTest = test;
        this.currentAnswers = {};
        this.currentQuestionIndex = 0;

        this.renderTestInterface();
    },

    /**
     * Render the test-taking interface
     */
    renderTestInterface() {
        const container = document.getElementById('tests-view');
        const test = this.currentTest;
        const question = test.questions[this.currentQuestionIndex];
        const progress = ((this.currentQuestionIndex + 1) / test.questions.length) * 100;

        container.innerHTML = `
            <div class="test-interface">
                <!-- Header -->
                <div style="margin-bottom: 2rem;">
                    <button class="btn" onclick="if(confirm('Are you sure you want to exit? Your progress will be lost.')) { UI.renderTests(); }">
                        ← Exit Test
                    </button>
                    <h2 style="margin: 1rem 0 0.5rem 0;">${test.title}</h2>
                    <p style="margin: 0; color: var(--text-secondary);">Question ${this.currentQuestionIndex + 1} of ${test.questions.length}</p>
                </div>

                <!-- Progress Bar -->
                <div class="progress-container" style="margin-bottom: 3rem; height: 8px;">
                    <div class="progress-fill" style="width: ${progress}%;"></div>
                </div>

                <!-- Question Card -->
                <div class="card" style="max-width: 800px; margin: 0 auto; padding: 3rem;">
                    <h3 style="font-size: 1.5rem; margin-bottom: 2rem; line-height: 1.6;">
                        ${question.text}
                    </h3>

                    <!-- Answer Options -->
                    <div class="answer-options">
                        ${this.renderAnswerOptions(question.id)}
                    </div>

                    <!-- Navigation -->
                    <div style="display: flex; justify-content: space-between; margin-top: 3rem;">
                        <button class="btn" onclick="TestsModule.previousQuestion()" ${this.currentQuestionIndex === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            ← Previous
                        </button>
                        <button class="btn btn-primary" onclick="TestsModule.nextQuestion()" id="next-btn" disabled style="opacity: 0.5;">
                            ${this.currentQuestionIndex === test.questions.length - 1 ? 'Finish Test' : 'Next →'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render answer options (1-5 scale)
     */
    renderAnswerOptions(questionId) {
        const options = [
            { value: 5, text: 'Strongly Agree', emoji: '💯' },
            { value: 4, text: 'Agree', emoji: '👍' },
            { value: 3, text: 'Neutral', emoji: '😐' },
            { value: 2, text: 'Disagree', emoji: '👎' },
            { value: 1, text: 'Strongly Disagree', emoji: '❌' }
        ];

        const currentAnswer = this.currentAnswers[questionId];

        return options.map(opt => `
            <div class="answer-option ${currentAnswer === opt.value ? 'selected' : ''}" 
                 onclick="TestsModule.selectAnswer('${questionId}', ${opt.value})">
                <div class="answer-emoji">${opt.emoji}</div>
                <div class="answer-text">${opt.text}</div>
                <div class="answer-radio ${currentAnswer === opt.value ? 'checked' : ''}"></div>
            </div>
        `).join('');
    },

    /**
     * Select an answer
     */
    selectAnswer(questionId, value) {
        this.currentAnswers[questionId] = value;

        // Re-render options to show selection
        const optionsContainer = document.querySelector('.answer-options');
        if (optionsContainer) {
            optionsContainer.innerHTML = this.renderAnswerOptions(questionId);
        }

        // Enable next button
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
        }
    },

    /**
     * Go to next question
     */
    nextQuestion() {
        const currentQuestion = this.currentTest.questions[this.currentQuestionIndex];

        if (!this.currentAnswers[currentQuestion.id]) {
            UI.showToast('Please select an answer', 'error');
            return;
        }

        if (this.currentQuestionIndex < this.currentTest.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderTestInterface();
        } else {
            // Test complete
            this.finishTest();
        }
    },

    /**
     * Go to previous question
     */
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderTestInterface();
        }
    },

    /**
     * Finish test and show results
     */
    finishTest() {
        const score = Store.calculateTestScore(this.currentTest.id, this.currentAnswers);
        const analysis = Store.getTestAnalysis(this.currentTest.id, score, this.currentAnswers);

        const result = {
            testId: this.currentTest.id,
            answers: this.currentAnswers,
            score: score,
            analysis: analysis
        };

        // Save result
        const savedResult = Store.saveTestResult(result);

        // Show results
        this.displayResults(savedResult);
    },

    /**
     * Display test results
     */
    displayResults(result) {
        const isPro = ProManager.isPro();
        const test = Store.getTest(result.testId);
        const container = document.getElementById('tests-view');

        container.innerHTML = `
            <div class="test-results">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 3rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                    <h1 style="margin: 0 0 0.5rem 0;">Assessment Complete!</h1>
                    <p style="margin: 0; color: var(--text-secondary);">${test.title}</p>
                </div>

                <!-- Score Card -->
                <div class="card" style="max-width: 600px; margin: 0 auto 2rem auto; text-align: center; padding: 3rem; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));">
                    <h3 style="margin: 0 0 1rem 0; color: var(--text-secondary); font-size: 1rem; text-transform: uppercase; letter-spacing: 0.1em;">Your Score</h3>
                    <div style="font-size: 4rem; font-weight: 700; color: var(--primary-color); margin-bottom: 1rem;">${result.score}%</div>
                    <div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem;">${result.analysis.basic.type}</div>
                    <p style="margin: 0; color: var(--text-secondary); line-height: 1.6;">${result.analysis.basic.summary}</p>
                </div>

                <!-- FREE: Basic Results -->
                <div class="card" style="max-width: 800px; margin: 0 auto 2rem auto; padding: 2rem;">
                    <h3 style="margin: 0 0 1.5rem 0;">📊 Your Results</h3>
                    <p style="line-height: 1.8; color: var(--text-secondary);">
                        Based on your responses, you demonstrate ${result.analysis.basic.type.toLowerCase()} characteristics. 
                        This assessment provides insights into your ${test.category} profile.
                    </p>
                </div>

                <!-- PRO: Detailed Analysis (Locked for Free Users) -->
                <div class="card ${!isPro ? 'pro-feature-card locked' : ''}" style="max-width: 800px; margin: 0 auto 2rem auto; padding: 2rem; position: relative;" ${!isPro ? 'onclick="ProManager.showUpgradeModal(\'Detailed Analysis\')"' : ''}>
                    ${!isPro ? '<div class="feature-lock-overlay"><span class="lock-icon">🔒</span></div>' : ''}
                    
                    <div style="${!isPro ? 'filter: blur(4px); pointer-events: none;' : ''}">
                        <h3 style="margin: 0 0 1.5rem 0;">
                            🎯 Detailed Analysis
                            ${!isPro ? '<span class="pro-badge" style="margin-left: 0.5rem;">PRO</span>' : ''}
                        </h3>
                        
                        ${isPro ? `
                            <div style="margin-bottom: 2rem;">
                                <h4 style="color: var(--success-color); margin-bottom: 1rem;">💪 Your Strengths:</h4>
                                <ul style="margin: 0; padding-left: 1.5rem;">
                                    ${result.analysis.detailed.strengths.map(s => `<li style="margin-bottom: 0.5rem;">${s}</li>`).join('')}
                                </ul>
                            </div>

                            <div style="margin-bottom: 2rem;">
                                <h4 style="color: var(--warning-color); margin-bottom: 1rem;">🌱 Areas for Growth:</h4>
                                <ul style="margin: 0; padding-left: 1.5rem;">
                                    ${result.analysis.detailed.areasForGrowth.map(a => `<li style="margin-bottom: 0.5rem;">${a}</li>`).join('')}
                                </ul>
                            </div>

                            <div>
                                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">💡 Recommendations:</h4>
                                <ul style="margin: 0; padding-left: 1.5rem;">
                                    ${result.analysis.detailed.recommendations.map(r => `<li style="margin-bottom: 0.5rem;">${r}</li>`).join('')}
                                </ul>
                            </div>
                        ` : `
                            <p style="color: var(--text-secondary);">Unlock detailed insights including your strengths, growth areas, and personalized recommendations...</p>
                        `}
                    </div>
                </div>

                <!-- PRO: PDF Export -->
                <div class="card ${!isPro ? 'pro-feature-card locked' : ''}" style="max-width: 800px; margin: 0 auto 2rem auto; padding: 2rem; text-align: center;" ${!isPro ? 'onclick="ProManager.showUpgradeModal(\'PDF Export\')"' : ''}>
                    ${!isPro ? '<div class="feature-lock-overlay"><span class="lock-icon">🔒</span></div>' : ''}
                    <h3 style="margin: 0 0 1rem 0;">
                        📄 Export Report
                        ${!isPro ? '<span class="pro-badge" style="margin-left: 0.5rem;">PRO</span>' : ''}
                    </h3>
                    <p style="margin: 0 0 1.5rem 0; color: var(--text-secondary);">Download a professional PDF report of your assessment</p>
                    <button class="btn btn-primary" onclick="TestsModule.exportToPDF('${result.id}')" ${!isPro ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                        📥 Download PDF Report
                    </button>
                </div>

                <!-- Actions -->
                <div style="max-width: 800px; margin: 0 auto; display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="UI.renderTests()">
                        Back to Tests
                    </button>
                    <button class="btn" onclick="TestsModule.startTest('${result.testId}')">
                        Retake Test
                    </button>
                </div>
            </div>
        `;

        UI.showToast('Test completed successfully! 🎉', 'success');
    },

    /**
     * View a past result
     */
    viewResult(resultId) {
        const isPro = ProManager.isPro();

        if (!isPro) {
            ProManager.showUpgradeModal('Test History');
            return;
        }

        const result = Store.getTestResult(resultId);
        if (result) {
            this.displayResults(result);
        }
    },

    /**
     * Access PRO feature
     */
    accessProFeature(featureId) {
        const isPro = ProManager.isPro();

        if (!isPro) {
            ProManager.showUpgradeModal('PRO Feature');
            return;
        }

        switch (featureId) {
            case 'detailed-analysis':
                UI.showToast('Detailed analysis is included in your results', 'info');
                break;
            case 'test-history':
                this.viewFullHistory();
                break;
            case 'pdf-export':
                UI.showToast('PDF export is available after completing a test', 'info');
                break;
        }
    },

    /**
     * View full test history (PRO)
     */
    viewFullHistory() {
        if (!ProManager.requirePro('Test History')) return;

        const history = Store.getTestHistory();
        const container = document.getElementById('tests-view');

        container.innerHTML = `
            <div class="test-history-view">
                <button class="btn" onclick="UI.renderTests()" style="margin-bottom: 2rem;">← Back to Tests</button>
                <h1 style="margin-bottom: 2rem;">📈 Test History</h1>
                
                ${history.length > 0 ? `
                    <div class="test-history-list">
                        ${history.reverse().map(result => this.renderHistoryItem(result, true)).join('')}
                    </div>
                ` : `
                    <div class="card" style="text-align: center; padding: 3rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                        <h3>No Test History</h3>
                        <p style="color: var(--text-secondary);">Complete your first test to start tracking your progress</p>
                    </div>
                `}
            </div>
        `;
    },

    /**
     * Export results to PDF (PRO)
     */
    exportToPDF(resultId) {
        if (!ProManager.requirePro('PDF Export')) return;

        const result = Store.getTestResult(resultId);
        const test = Store.getTest(result.testId);

        // Create printable content
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${test.title} - Assessment Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                    h1 { color: #6366f1; border-bottom: 3px solid #6366f1; padding-bottom: 10px; }
                    .score { font-size: 48px; color: #6366f1; text-align: center; margin: 30px 0; }
                    .section { margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
                    ul { line-height: 1.8; }
                    .footer { margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <h1>${test.title} - Assessment Report</h1>
                <p><strong>Date:</strong> ${new Date(result.timestamp).toLocaleDateString()}</p>
                
                <div class="score">Score: ${result.score}%</div>
                
                <div class="section">
                    <h2>${result.analysis.basic.type}</h2>
                    <p>${result.analysis.basic.summary}</p>
                </div>

                <div class="section">
                    <h3>💪 Strengths</h3>
                    <ul>
                        ${result.analysis.detailed.strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>

                <div class="section">
                    <h3>🌱 Areas for Growth</h3>
                    <ul>
                        ${result.analysis.detailed.areasForGrowth.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                </div>

                <div class="section">
                    <h3>💡 Recommendations</h3>
                    <ul>
                        ${result.analysis.detailed.recommendations.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>

                <div class="footer">
                    <p>This report was generated by PlanHub Psychological Assessment Platform</p>
                    <p>For more information, visit your dashboard</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();

        // Trigger print dialog
        setTimeout(() => {
            printWindow.print();
        }, 500);

        UI.showToast('PDF report opened in new window', 'success');
    },

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.querySelector('.upgrade-modal-overlay');
        if (modal) modal.remove();
    }
};

// Export to window
window.TestsModule = TestsModule;
