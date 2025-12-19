/* --- STORE (DATA MANAGER) --- */
const Store = {
    getKey: () => 'daily_planner_data',
    getAuthKey: () => 'daily_planner_users',
    getSessionKey: () => 'daily_planner_session',

    /* --- DATA ACCESS --- */
    getUsers() {
        return JSON.parse(localStorage.getItem(this.getAuthKey()) || '[]');
    },

    saveUsers(users) {
        localStorage.setItem(this.getAuthKey(), JSON.stringify(users));
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.getSessionKey()) || 'null');
    },

    setCurrentUser(user) {
        localStorage.setItem(this.getSessionKey(), JSON.stringify(user));
    },

    clearSession() {
        localStorage.removeItem(this.getSessionKey());
    },

    updateUserProgress(lessonId, isCompleted = true) {
        const user = this.getCurrentUser();
        if (!user) return; // Should be logged in

        user.progress = user.progress || {};
        user.progress[lessonId] = isCompleted;

        // Update Session
        this.setCurrentUser(user);

        // Update DB
        const users = this.getUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx] = user;
            this.saveUsers(users);
        }
    },

    /* --- MAIN DATA --- */
    getData() {
        const defaultData = {
            tasks: [
                // Work Tasks
                { id: 1, text: "Complete Project Proposal", completed: false, category: "Work", priority: "high", notes: "Due Friday" },
                { id: 2, text: "Review Team Performance Reports", completed: false, category: "Work", priority: "high", notes: "Quarterly review" },
                { id: 3, text: "Prepare Presentation Slides", completed: false, category: "Work", priority: "high", notes: "Client meeting Monday" },
                { id: 4, text: "Send Weekly Status Email", completed: false, category: "Work", priority: "medium", notes: "To manager" },
                { id: 5, text: "Update Project Documentation", completed: false, category: "Work", priority: "medium", notes: "Add new features" },
                { id: 6, text: "Schedule Team Meeting", completed: false, category: "Work", priority: "medium", notes: "Next week planning" },
                { id: 7, text: "Review Code Pull Requests", completed: false, category: "Work", priority: "medium", notes: "3 pending PRs" },
                { id: 8, text: "Respond to Client Emails", completed: false, category: "Work", priority: "low", notes: "Non-urgent" },
                { id: 9, text: "Organize Desktop Files", completed: false, category: "Work", priority: "low", notes: "Clean up workspace" },
                { id: 10, text: "Update LinkedIn Profile", completed: false, category: "Work", priority: "low", notes: "Add recent projects" },

                // Personal Tasks
                { id: 11, text: "Buy Groceries", completed: true, category: "Personal", priority: "medium", notes: "Milk, Bread, Eggs" },
                { id: 12, text: "Pay Electricity Bill", completed: false, category: "Personal", priority: "high", notes: "Due tomorrow" },
                { id: 13, text: "Schedule Doctor Appointment", completed: false, category: "Personal", priority: "high", notes: "Annual checkup" },
                { id: 14, text: "Call Mom", completed: false, category: "Personal", priority: "medium", notes: "Birthday next week" },
                { id: 15, text: "Water Plants", completed: false, category: "Personal", priority: "medium", notes: "Every 3 days" },
                { id: 16, text: "Organize Closet", completed: false, category: "Personal", priority: "low", notes: "Donate old clothes" },
                { id: 17, text: "Fix Leaky Faucet", completed: false, category: "Personal", priority: "medium", notes: "Buy wrench" },
                { id: 18, text: "Renew Car Insurance", completed: false, category: "Personal", priority: "high", notes: "Expires this month" },
                { id: 19, text: "Clean Garage", completed: false, category: "Personal", priority: "low", notes: "Weekend project" },
                { id: 20, text: "Update Emergency Contacts", completed: false, category: "Personal", priority: "medium", notes: "Phone and email" },

                // Health & Fitness
                { id: 21, text: "Morning Workout - 30 mins", completed: false, category: "Health", priority: "high", notes: "Cardio + Stretching" },
                { id: 22, text: "Drink 8 Glasses of Water", completed: false, category: "Health", priority: "medium", notes: "Track daily" },
                { id: 23, text: "Prepare Healthy Lunch", completed: false, category: "Health", priority: "medium", notes: "Meal prep Sunday" },
                { id: 24, text: "Evening Walk - 20 mins", completed: false, category: "Health", priority: "low", notes: "After dinner" },
                { id: 25, text: "Take Vitamins", completed: false, category: "Health", priority: "medium", notes: "Morning routine" },
                { id: 26, text: "Yoga Session", completed: false, category: "Health", priority: "low", notes: "15 mins before bed" },
                { id: 27, text: "Track Calories", completed: false, category: "Health", priority: "low", notes: "Use fitness app" },
                { id: 28, text: "Meditation - 10 mins", completed: false, category: "Health", priority: "medium", notes: "Morning mindfulness" },

                // Learning & Development
                { id: 29, text: "Read 30 Pages of Book", completed: false, category: "Learning", priority: "medium", notes: "Current: Atomic Habits" },
                { id: 30, text: "Complete Online Course Module", completed: false, category: "Learning", priority: "high", notes: "JavaScript Advanced" },
                { id: 31, text: "Practice Spanish - 20 mins", completed: false, category: "Learning", priority: "medium", notes: "Duolingo streak" },
                { id: 32, text: "Watch Educational Video", completed: false, category: "Learning", priority: "low", notes: "TED Talk" },
                { id: 33, text: "Write in Journal", completed: false, category: "Learning", priority: "low", notes: "Daily reflection" },
                { id: 34, text: "Learn New Recipe", completed: false, category: "Learning", priority: "low", notes: "Try pasta carbonara" },
                { id: 35, text: "Practice Guitar - 30 mins", completed: false, category: "Learning", priority: "medium", notes: "New song practice" },

                // Social & Family
                { id: 36, text: "Plan Weekend Trip", completed: false, category: "Social", priority: "medium", notes: "With family" },
                { id: 37, text: "Send Birthday Card to Friend", completed: false, category: "Social", priority: "high", notes: "Birthday on 20th" },
                { id: 38, text: "Video Call with Sister", completed: false, category: "Social", priority: "medium", notes: "Catch up time" },
                { id: 39, text: "Organize Game Night", completed: false, category: "Social", priority: "low", notes: "Invite 6 friends" },
                { id: 40, text: "Help Kid with Homework", completed: false, category: "Social", priority: "high", notes: "Math assignment" },

                // Finance
                { id: 41, text: "Review Monthly Budget", completed: false, category: "Finance", priority: "high", notes: "Track expenses" },
                { id: 42, text: "Pay Credit Card Bill", completed: false, category: "Finance", priority: "high", notes: "Due in 3 days" },
                { id: 43, text: "Update Expense Tracker", completed: false, category: "Finance", priority: "medium", notes: "Last week's receipts" },
                { id: 44, text: "Research Investment Options", completed: false, category: "Finance", priority: "low", notes: "Stocks vs bonds" },
                { id: 45, text: "Set Savings Goal", completed: false, category: "Finance", priority: "medium", notes: "Vacation fund" },

                // Home & Maintenance
                { id: 46, text: "Vacuum Living Room", completed: false, category: "Home", priority: "medium", notes: "Weekly cleaning" },
                { id: 47, text: "Change Air Filter", completed: false, category: "Home", priority: "low", notes: "Every 3 months" },
                { id: 48, text: "Wash Car", completed: false, category: "Home", priority: "low", notes: "Weekend task" },
                { id: 49, text: "Check Smoke Detectors", completed: false, category: "Home", priority: "high", notes: "Safety first" },
                { id: 50, text: "Backup Computer Files", completed: false, category: "Home", priority: "high", notes: "Weekly backup" }
            ],
            settings: { theme: 'light', username: 'Guest' },
            books: [],
            points: 0,  // Start at 0 for new users
            badges: [],  // Start with no badges
            stats: {
                tasksCompleted: 0,
                lessonsCompleted: 0,
                testsCompleted: 0,
                totalPoints: 0,
                lastActivity: null,
                streak: 0
            }
        };
        const data = JSON.parse(localStorage.getItem(this.getKey()) || JSON.stringify(defaultData));

        // Data migration for existing users with hardcoded values
        if (data.points === 1250 && !data.stats) {
            console.log('📊 Migrating to new stats system...');
            data.points = 0;
            data.badges = [];
            data.stats = {
                tasksCompleted: 0,
                lessonsCompleted: 0,
                testsCompleted: 0,
                totalPoints: 0,
                lastActivity: null,
                streak: 0
            };
            this.saveData(data);
        }

        // Ensure stats object exists
        if (!data.stats) {
            data.stats = {
                tasksCompleted: 0,
                lessonsCompleted: 0,
                testsCompleted: 0,
                totalPoints: 0,
                lastActivity: null,
                streak: 0
            };
        }

        return data;
    },

    saveData(data) {
        localStorage.setItem(this.getKey(), JSON.stringify(data));
    },

    /* --- TASKS --- */
    getTasks() { return this.getData().tasks; },

    addTask(task) {
        const data = this.getData();
        task.id = Date.now();
        task.completed = false;
        data.tasks.unshift(task);
        this.saveData(data);
    },

    updateTaskStatus(id, completed) {
        // Helper for toggleTask (separated logic for clarity)
        const data = this.getData();
        const t = data.tasks.find(x => x.id == id);
        if (t) {
            t.completed = completed;
            this.saveData(data);
        }
    },

    toggleTask(id) {
        // Legacy support if needed, or used by App
        const data = this.getData();
        const t = data.tasks.find(x => x.id == id);
        if (t) {
            t.completed = !t.completed;
            let earned = 0;
            if (t.completed) {
                earned = t.priority === 'high' ? 50 : t.priority === 'medium' ? 30 : 10;
                data.points += earned;
            } else {
                data.points = Math.max(0, data.points - 10);
            }
            this.saveData(data);
            return { completed: t.completed, earnedPoints: earned };
        }
        return {};
    },

    deleteTask(id) {
        const data = this.getData();
        data.tasks = data.tasks.filter(t => t.id != id);
        this.saveData(data);
    },

    updateSettings(newSettings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...newSettings };
        this.saveData(data);
    },

    clearData() {
        localStorage.removeItem(this.getKey());
        location.reload();
    },

    /* --- POINTS & BADGES SYSTEM --- */

    /**
     * Badge definitions with earning conditions
     */
    BADGES: {
        FIRST_TASK: {
            id: 'first_task',
            name: '🎯 First Step',
            description: 'Complete your first task',
            points: 10,
            condition: (stats) => stats.tasksCompleted >= 1
        },
        TASK_MASTER_5: {
            id: 'task_master_5',
            name: '✅ Task Starter',
            description: 'Complete 5 tasks',
            points: 25,
            condition: (stats) => stats.tasksCompleted >= 5
        },
        TASK_MASTER_10: {
            id: 'task_master_10',
            name: '✅ Task Master',
            description: 'Complete 10 tasks',
            points: 50,
            condition: (stats) => stats.tasksCompleted >= 10
        },
        LEARNER: {
            id: 'learner',
            name: '📚 Learner',
            description: 'Complete 5 lessons',
            points: 25,
            condition: (stats) => stats.lessonsCompleted >= 5
        },
        SCHOLAR: {
            id: 'scholar',
            name: '🎓 Scholar',
            description: 'Complete 20 lessons',
            points: 100,
            condition: (stats) => stats.lessonsCompleted >= 20
        },
        TESTER: {
            id: 'tester',
            name: '🧠 Brain Teaser',
            description: 'Complete 3 tests',
            points: 50,
            condition: (stats) => stats.testsCompleted >= 3
        },
        POINTS_100: {
            id: 'points_100',
            name: '💯 Century',
            description: 'Earn 100 points',
            points: 0,
            condition: (stats) => stats.totalPoints >= 100
        },
        POINTS_500: {
            id: 'points_500',
            name: '⭐ Rising Star',
            description: 'Earn 500 points',
            points: 0,
            condition: (stats) => stats.totalPoints >= 500
        },
        STREAK_7: {
            id: 'streak_7',
            name: '🔥 Week Warrior',
            description: '7-day streak',
            points: 30,
            condition: (stats) => stats.streak >= 7
        }
    },

    /**
     * Add points to user's total
     * @param {number} amount - Points to add
     * @param {string} reason - Reason for points (for logging)
     * @returns {number} New total points
     */
    addPoints(amount, reason = '') {
        const data = this.getData();
        data.points = (data.points || 0) + amount;
        data.stats.totalPoints = (data.stats.totalPoints || 0) + amount;
        this.saveData(data);
        console.log(`✨ +${amount} points: ${reason} (Total: ${data.points})`);
        return data.points;
    },

    /**
     * Get current points
     * @returns {number} Current points
     */
    getPoints() {
        const data = this.getData();
        return data.points || 0;
    },

    /**
     * Update stats when user completes an activity
     * @param {string} type - 'task', 'lesson', or 'test'
     */
    updateStats(type) {
        const data = this.getData();

        if (type === 'task') {
            data.stats.tasksCompleted = (data.stats.tasksCompleted || 0) + 1;
        } else if (type === 'lesson') {
            data.stats.lessonsCompleted = (data.stats.lessonsCompleted || 0) + 1;
        } else if (type === 'test') {
            data.stats.testsCompleted = (data.stats.testsCompleted || 0) + 1;
        }

        this.saveData(data);
        console.log(`📊 Stats updated: ${type} completed`);
    },

    /**
     * Check and award badges based on current stats
     * @returns {Array} Newly earned badges
     */
    checkAndAwardBadges() {
        const data = this.getData();
        const currentBadgeIds = data.badges.map(b => typeof b === 'string' ? b : b.id);
        const newBadges = [];

        Object.values(this.BADGES).forEach(badge => {
            // Check if badge not already earned and condition is met
            if (!currentBadgeIds.includes(badge.id) && badge.condition(data.stats)) {
                data.badges.push({
                    id: badge.id,
                    name: badge.name,
                    description: badge.description,
                    earnedAt: new Date().toISOString()
                });
                newBadges.push(badge);

                // Award bonus points for badge
                if (badge.points > 0) {
                    data.points = (data.points || 0) + badge.points;
                    data.stats.totalPoints = (data.stats.totalPoints || 0) + badge.points;
                    console.log(`🏆 Badge earned: ${badge.name} (+${badge.points} bonus points)`);
                } else {
                    console.log(`🏆 Badge earned: ${badge.name}`);
                }
            }
        });

        if (newBadges.length > 0) {
            this.saveData(data);
        }

        return newBadges;
    },

    /**
     * Get all badges (earned and locked)
     * @returns {Object} { earned: [], locked: [] }
     */
    getBadges() {
        const data = this.getData();
        const earnedBadgeIds = data.badges.map(b => typeof b === 'string' ? b : b.id);

        const earned = data.badges;
        const locked = Object.values(this.BADGES).filter(badge =>
            !earnedBadgeIds.includes(badge.id)
        );

        return { earned, locked };
    },

    /* --- BOOKS --- */
    getBooksData() {
        const data = this.getData();
        const books = [];
        if (!data.books || data.books.length === 0) {
            for (let i = 1; i <= 50; i++) books.push({ id: `b${i}`, type: 'book', title: `Book Title ${i}`, author: 'Author Name', category: 'book', genre: 'History', year: 2020, description: 'A great book about history.', coverUrl: 'https://via.placeholder.com/150', fileUrl: '#' });
            for (let i = 1; i <= 50; i++) books.push({ id: `n${i}`, type: 'novel', title: `Novel Title ${i}`, author: 'Novelist Name', category: 'novel', genre: 'Drama', year: 2021, description: 'A dramatic story.', coverUrl: 'https://via.placeholder.com/150', fileUrl: '#' });
            data.books = books;
            data.favorites = [];
            this.saveData(data);
        }
        return { books: data.books, favorites: data.favorites || [] };
    },

    toggleBookFavorite(id) {
        const data = this.getData();
        data.favorites = data.favorites || [];
        const idx = data.favorites.indexOf(id);
        if (idx > -1) data.favorites.splice(idx, 1);
        else data.favorites.push(id);
        this.saveData(data);
        return data.favorites.includes(id);
    },

    /* --- ADS --- */
    getAdContent() {
        return [
            { id: 'ad1', title: 'Go Pro Today!', text: 'Unlock all languages and features with our Pro plan.', link: '#pro', image: 'https://via.placeholder.com/300x150?text=Go+Pro' },
            { id: 'ad2', title: 'Learn Faster', text: 'Get our exclusive ebook on rapid learning techniques.', link: '#ebook', image: 'https://via.placeholder.com/300x150?text=Ebook' }
        ];
    },

    /* --- LANGUAGES --- */
    getLanguages() {
        return [
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'fr', name: 'French', flag: '🇫🇷' },
            { code: 'ar', name: 'العربية', flag: '🇸🇦' }
        ];
    },

    getLevels() { return ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']; },

    getLessonsList(langCode, level) {
        return [
            { id: 'l1', title: 'Introduction & Greetings' },
            { id: 'l2', title: 'Numbers & Days' },
            { id: 'l3', title: 'Basic Verbs (To Be)' },
            { id: 'l4', title: 'Family & Friends' },
            { id: 'l5', title: 'Food & Ordering' }
        ];
    },

    getLessonDetail(langCode, level, lessonId) {
        let content = {
            id: lessonId,
            title: 'Unknown Lesson',
            intro: 'Content pending.',
            dialogue: [],
            keyPoints: []
        };

        if (lessonId === 'l1') {
            content = {
                id: 'l1',
                title: 'Introduction & Greetings',
                intro: `
                    <p>Welcome to your first lesson! Learning how to greet people is the foundation of any language. In this lesson, we will cover formal and informal greetings, introductions, and basic farewells.</p>
                    <p>In <strong>${langCode === 'en' ? 'English' : langCode === 'fr' ? 'French' : 'Spanish'}</strong>, the way you speak to a friend is different from how you speak to a boss or stranger. Pay attention to the context!</p>
                `,
                dialogue: [
                    { speaker: 'Sarah', text: 'Hello! My name is Sarah. Nice to meet you.' },
                    { speaker: 'John', text: 'Hi Sarah! I am John. Nice to meet you too.' },
                    { speaker: 'Sarah', text: 'Where are you from?' },
                    { speaker: 'John', text: 'I am from London. And you?' }
                ],
                keyPoints: [
                    'Use "Hello" for formal and "Hi" for informal situations.',
                    'Always smile when introducing yourself!',
                    'Key phrase: "Nice to meet you".'
                ]
            };
        } else if (lessonId === 'l2') {
            content = {
                id: 'l2',
                title: 'Numbers & Days',
                intro: `<p>Numbers are used everywhere: prices, time, dates. Today we will learn counting from 1 to 10 and the days of the week.</p>`,
                dialogue: [
                    { speaker: 'Shopkeeper', text: 'That will be 5 dollars please.' },
                    { speaker: 'You', text: 'Here are 10 dollars.' },
                    { speaker: 'Shopkeeper', text: 'Thank you. Here is 5 dollars change.' }
                ],
                keyPoints: ['One, Two, Three...', 'Monday, Tuesday, Wednesday...']
            };
        } else {
            content = {
                id: lessonId,
                title: `Lesson ${lessonId.replace('l', '')}`,
                intro: `<p>This is a placeholder for lesson content. We will cover advanced grammar and vocabulary relevant to the <strong>${level}</strong> level.</p>`,
                dialogue: [{ speaker: 'Teacher', text: 'Ready for the next lesson?' }],
                keyPoints: ['Practice makes perfect.', 'Review previous notes.']
            };
        }
        return content;
    },

    /* --- PROJECTS --- */
    getProjects() {
        const data = this.getData();
        if (!data.projects) {
            // Initialize with sample projects
            data.projects = [
                {
                    id: 'proj_1',
                    name: 'Website Redesign',
                    description: 'Complete overhaul of company website with modern design',
                    owner: 'current_user',
                    team: ['user1@example.com', 'user2@example.com'],
                    tasks: [
                        { id: 'task_1', title: 'Design mockups', assignee: 'user1@example.com', deadline: '2025-12-20', status: 'completed', priority: 'high' },
                        { id: 'task_2', title: 'Develop frontend', assignee: 'user2@example.com', deadline: '2025-12-25', status: 'in-progress', priority: 'high' },
                        { id: 'task_3', title: 'Backend API', assignee: 'current_user', deadline: '2025-12-28', status: 'pending', priority: 'medium' }
                    ],
                    attachments: [
                        { id: 'att_1', name: 'design-specs.pdf', url: '#', uploadedBy: 'user1@example.com', uploadedAt: '2025-12-10' }
                    ],
                    comments: [
                        { id: 'com_1', author: 'user1@example.com', text: 'Mockups are ready for review!', timestamp: '2025-12-15T10:30:00' },
                        { id: 'com_2', author: 'current_user', text: 'Great work! Moving to development phase.', timestamp: '2025-12-15T14:20:00' }
                    ],
                    createdAt: '2025-12-01',
                    deadline: '2025-12-31',
                    progress: 45
                },
                {
                    id: 'proj_2',
                    name: 'Mobile App Development',
                    description: 'iOS and Android app for customer engagement',
                    owner: 'current_user',
                    team: ['dev1@example.com'],
                    tasks: [
                        { id: 'task_4', title: 'Setup project structure', assignee: 'dev1@example.com', deadline: '2025-12-18', status: 'completed', priority: 'high' },
                        { id: 'task_5', title: 'Implement authentication', assignee: 'dev1@example.com', deadline: '2025-12-22', status: 'in-progress', priority: 'high' }
                    ],
                    attachments: [],
                    comments: [],
                    createdAt: '2025-12-05',
                    deadline: '2026-01-15',
                    progress: 20
                }
            ];
            this.saveData(data);
        }
        return data.projects || [];
    },

    addProject(projectData) {
        const data = this.getData();
        if (!data.projects) data.projects = [];

        const newProject = {
            id: `proj_${Date.now()}`,
            name: projectData.name || 'Untitled Project',
            description: projectData.description || '',
            owner: 'current_user',
            team: projectData.team || [],
            tasks: [],
            attachments: [],
            comments: [],
            createdAt: new Date().toISOString().split('T')[0],
            deadline: projectData.deadline || '',
            progress: 0
        };

        data.projects.push(newProject);
        this.saveData(data);
        return newProject;
    },

    updateProject(projectId, updates) {
        const data = this.getData();
        if (!data.projects) return null;

        const project = data.projects.find(p => p.id === projectId);
        if (project) {
            Object.assign(project, updates);
            this.saveData(data);
            return project;
        }
        return null;
    },

    deleteProject(projectId) {
        const data = this.getData();
        if (!data.projects) return false;

        data.projects = data.projects.filter(p => p.id !== projectId);
        this.saveData(data);
        return true;
    },

    addProjectTask(projectId, taskData) {
        const data = this.getData();
        if (!data.projects) return null;

        const project = data.projects.find(p => p.id === projectId);
        if (project) {
            const newTask = {
                id: `task_${Date.now()}`,
                title: taskData.title || 'Untitled Task',
                assignee: taskData.assignee || 'current_user',
                deadline: taskData.deadline || '',
                status: taskData.status || 'pending',
                priority: taskData.priority || 'medium'
            };

            project.tasks.push(newTask);
            this.saveData(data);
            return newTask;
        }
        return null;
    },

    updateProjectTask(projectId, taskId, updates) {
        const data = this.getData();
        if (!data.projects) return null;

        const project = data.projects.find(p => p.id === projectId);
        if (project) {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                Object.assign(task, updates);
                // Recalculate project progress
                const completedTasks = project.tasks.filter(t => t.status === 'completed').length;
                project.progress = Math.round((completedTasks / project.tasks.length) * 100);
                this.saveData(data);
                return task;
            }
        }
        return null;
    },

    addProjectComment(projectId, commentText) {
        const data = this.getData();
        if (!data.projects) return null;

        const project = data.projects.find(p => p.id === projectId);
        if (project) {
            const newComment = {
                id: `com_${Date.now()}`,
                author: 'current_user',
                text: commentText,
                timestamp: new Date().toISOString()
            };

            project.comments.push(newComment);
            this.saveData(data);
            return newComment;
        }
        return null;
    },

    getProjectAnalytics(projectId) {
        const data = this.getData();
        if (!data.projects) return null;

        const project = data.projects.find(p => p.id === projectId);
        if (!project) return null;

        // Basic analytics (available to all users)
        const basicAnalytics = {
            totalTasks: project.tasks.length,
            completedTasks: project.tasks.filter(t => t.status === 'completed').length,
            inProgressTasks: project.tasks.filter(t => t.status === 'in-progress').length,
            pendingTasks: project.tasks.filter(t => t.status === 'pending').length,
            progress: project.progress,
            teamSize: project.team.length + 1, // +1 for owner
            daysRemaining: this.calculateDaysRemaining(project.deadline)
        };

        // Advanced analytics (PRO only - will be gated in UI)
        const advancedAnalytics = {
            ...basicAnalytics,
            tasksByPriority: {
                high: project.tasks.filter(t => t.priority === 'high').length,
                medium: project.tasks.filter(t => t.priority === 'medium').length,
                low: project.tasks.filter(t => t.priority === 'low').length
            },
            completionRate: project.tasks.length > 0
                ? ((project.tasks.filter(t => t.status === 'completed').length / project.tasks.length) * 100).toFixed(1)
                : 0,
            averageTasksPerMember: ((project.tasks.length / (project.team.length + 1)).toFixed(1)),
            upcomingDeadlines: project.tasks
                .filter(t => t.deadline && t.status !== 'completed')
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .slice(0, 5),
            activityScore: this.calculateActivityScore(project)
        };

        return { basic: basicAnalytics, advanced: advancedAnalytics };
    },

    calculateDaysRemaining(deadline) {
        if (!deadline) return null;
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    },

    calculateActivityScore(project) {
        // Simple activity score based on comments and recent task updates
        const recentComments = project.comments.filter(c => {
            const commentDate = new Date(c.timestamp);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return commentDate > weekAgo;
        }).length;

        const score = Math.min(100, (recentComments * 10) + (project.progress / 2));
        return Math.round(score);
    },

    /* --- PSYCHOLOGICAL TESTS --- */
    getTestCategories() {
        return [
            {
                id: 'personality',
                name: 'Personality Assessment',
                icon: '🧠',
                description: 'Discover your personality type and traits',
                color: '#6366f1',
                testCount: 1
            },
            {
                id: 'intelligence',
                name: 'Intelligence Test',
                icon: '💡',
                description: 'Assess your cognitive abilities and problem-solving skills',
                color: '#f59e0b',
                testCount: 1
            },
            {
                id: 'emotional',
                name: 'Emotional Intelligence',
                icon: '❤️',
                description: 'Evaluate your emotional awareness and regulation',
                color: '#ec4899',
                testCount: 1
            }
        ];
    },

    getTest(testId) {
        const tests = {
            'personality_test': {
                id: 'personality_test',
                title: 'Personality Assessment',
                category: 'personality',
                description: 'Discover your personality type through 20 carefully designed questions',
                duration: '10 minutes',
                questions: [
                    { id: 'q1', text: 'I enjoy meeting new people and making friends', type: 'extroversion' },
                    { id: 'q2', text: 'I prefer to plan things in advance rather than be spontaneous', type: 'conscientiousness' },
                    { id: 'q3', text: 'I often worry about things that might go wrong', type: 'neuroticism' },
                    { id: 'q4', text: 'I am comfortable expressing my emotions to others', type: 'openness' },
                    { id: 'q5', text: 'I try to be helpful and considerate to others', type: 'agreeableness' },
                    { id: 'q6', text: 'I feel energized after spending time with groups of people', type: 'extroversion' },
                    { id: 'q7', text: 'I pay attention to details and like things to be organized', type: 'conscientiousness' },
                    { id: 'q8', text: 'I remain calm under pressure', type: 'neuroticism' },
                    { id: 'q9', text: 'I enjoy trying new experiences and learning new things', type: 'openness' },
                    { id: 'q10', text: 'I am willing to compromise to avoid conflict', type: 'agreeableness' },
                    { id: 'q11', text: 'I prefer working in teams rather than alone', type: 'extroversion' },
                    { id: 'q12', text: 'I complete tasks thoroughly and on time', type: 'conscientiousness' },
                    { id: 'q13', text: 'I bounce back quickly from setbacks', type: 'neuroticism' },
                    { id: 'q14', text: 'I appreciate art, music, and creative expression', type: 'openness' },
                    { id: 'q15', text: 'I trust others and believe people are generally good', type: 'agreeableness' },
                    { id: 'q16', text: 'I speak up in group discussions', type: 'extroversion' },
                    { id: 'q17', text: 'I set goals and work systematically to achieve them', type: 'conscientiousness' },
                    { id: 'q18', text: 'I handle stress well without getting overwhelmed', type: 'neuroticism' },
                    { id: 'q19', text: 'I enjoy abstract thinking and philosophical discussions', type: 'openness' },
                    { id: 'q20', text: 'I put others\' needs before my own', type: 'agreeableness' }
                ]
            },
            'intelligence_test': {
                id: 'intelligence_test',
                title: 'Intelligence Assessment',
                category: 'intelligence',
                description: 'Evaluate your cognitive abilities through logical reasoning questions',
                duration: '15 minutes',
                questions: [
                    { id: 'q1', text: 'If all roses are flowers and some flowers fade quickly, can we conclude that some roses fade quickly?', type: 'logical' },
                    { id: 'q2', text: 'What comes next in the sequence: 2, 4, 8, 16, __?', type: 'pattern' },
                    { id: 'q3', text: 'I can solve complex problems by breaking them down into smaller parts', type: 'analytical' },
                    { id: 'q4', text: 'I quickly understand new concepts and ideas', type: 'comprehension' },
                    { id: 'q5', text: 'I can see connections between seemingly unrelated things', type: 'creative' },
                    { id: 'q6', text: 'I remember information easily after reading it once', type: 'memory' },
                    { id: 'q7', text: 'I can explain complex ideas in simple terms', type: 'verbal' },
                    { id: 'q8', text: 'I enjoy solving puzzles and brain teasers', type: 'problem-solving' },
                    { id: 'q9', text: 'I can visualize objects rotating in three dimensions', type: 'spatial' },
                    { id: 'q10', text: 'I learn new skills quickly', type: 'learning' },
                    { id: 'q11', text: 'I can identify patterns in data or information', type: 'pattern' },
                    { id: 'q12', text: 'I think critically before accepting information as true', type: 'critical' },
                    { id: 'q13', text: 'I can focus on complex tasks for extended periods', type: 'concentration' },
                    { id: 'q14', text: 'I come up with creative solutions to problems', type: 'creative' },
                    { id: 'q15', text: 'I understand mathematical concepts easily', type: 'mathematical' },
                    { id: 'q16', text: 'I can adapt my thinking when faced with new information', type: 'flexibility' },
                    { id: 'q17', text: 'I notice details that others often miss', type: 'observation' },
                    { id: 'q18', text: 'I can reason through cause-and-effect relationships', type: 'logical' },
                    { id: 'q19', text: 'I have a good vocabulary and use words precisely', type: 'verbal' },
                    { id: 'q20', text: 'I can hold multiple ideas in my mind simultaneously', type: 'working-memory' }
                ]
            },
            'emotional_test': {
                id: 'emotional_test',
                title: 'Emotional Intelligence Assessment',
                category: 'emotional',
                description: 'Measure your ability to understand and manage emotions',
                duration: '10 minutes',
                questions: [
                    { id: 'q1', text: 'I can accurately identify my own emotions', type: 'self-awareness' },
                    { id: 'q2', text: 'I understand how my emotions affect my behavior', type: 'self-awareness' },
                    { id: 'q3', text: 'I can control my emotional reactions in difficult situations', type: 'self-regulation' },
                    { id: 'q4', text: 'I stay motivated even when facing obstacles', type: 'motivation' },
                    { id: 'q5', text: 'I can sense how others are feeling', type: 'empathy' },
                    { id: 'q6', text: 'I handle conflicts calmly and constructively', type: 'social-skills' },
                    { id: 'q7', text: 'I recognize my emotional triggers', type: 'self-awareness' },
                    { id: 'q8', text: 'I can calm myself down when upset', type: 'self-regulation' },
                    { id: 'q9', text: 'I set meaningful goals for myself', type: 'motivation' },
                    { id: 'q10', text: 'I listen actively when others share their feelings', type: 'empathy' },
                    { id: 'q11', text: 'I build positive relationships with others', type: 'social-skills' },
                    { id: 'q12', text: 'I reflect on my emotions to understand them better', type: 'self-awareness' },
                    { id: 'q13', text: 'I manage stress effectively', type: 'self-regulation' },
                    { id: 'q14', text: 'I maintain a positive attitude', type: 'motivation' },
                    { id: 'q15', text: 'I can see situations from others\' perspectives', type: 'empathy' },
                    { id: 'q16', text: 'I communicate my feelings clearly', type: 'social-skills' },
                    { id: 'q17', text: 'I am aware of my strengths and weaknesses', type: 'self-awareness' },
                    { id: 'q18', text: 'I think before acting on my emotions', type: 'self-regulation' },
                    { id: 'q19', text: 'I persevere through challenges', type: 'motivation' },
                    { id: 'q20', text: 'I respond appropriately to others\' emotions', type: 'empathy' }
                ]
            }
        };
        return tests[testId] || null;
    },

    saveTestResult(result) {
        const data = this.getData();
        if (!data.testResults) data.testResults = [];

        result.id = `result_${Date.now()}`;
        result.timestamp = new Date().toISOString();

        data.testResults.push(result);
        this.saveData(data);
        return result;
    },

    getTestHistory() {
        const data = this.getData();
        return data.testResults || [];
    },

    getTestResult(resultId) {
        const history = this.getTestHistory();
        return history.find(r => r.id === resultId) || null;
    },

    calculateTestScore(testId, answers) {
        // Calculate score based on answers (1-5 scale)
        const values = Object.values(answers);
        const total = values.reduce((sum, val) => sum + val, 0);
        const maxScore = values.length * 5;
        const percentage = (total / maxScore) * 100;
        return Math.round(percentage);
    },

    getTestAnalysis(testId, score, answers) {
        const basicAnalysis = this.getBasicAnalysis(testId, score);
        const detailedAnalysis = this.getDetailedAnalysis(testId, score, answers);

        return {
            basic: basicAnalysis,
            detailed: detailedAnalysis // PRO only
        };
    },

    getBasicAnalysis(testId, score) {
        const analyses = {
            'personality_test': {
                ranges: [
                    { min: 80, max: 100, type: 'Highly Extroverted', summary: 'You are outgoing, energetic, and thrive in social situations. You gain energy from being around others.' },
                    { min: 60, max: 79, type: 'Moderately Extroverted', summary: 'You enjoy social interaction but also value your alone time. You balance social and solitary activities well.' },
                    { min: 40, max: 59, type: 'Ambivert', summary: 'You are balanced between introversion and extroversion. You adapt well to different social situations.' },
                    { min: 20, max: 39, type: 'Moderately Introverted', summary: 'You prefer smaller groups and meaningful conversations. You recharge through quiet time alone.' },
                    { min: 0, max: 19, type: 'Highly Introverted', summary: 'You are thoughtful, reserved, and prefer solitude or small groups. You find large social gatherings draining.' }
                ]
            },
            'intelligence_test': {
                ranges: [
                    { min: 80, max: 100, type: 'Exceptional', summary: 'You demonstrate exceptional cognitive abilities. You excel at problem-solving and abstract thinking.' },
                    { min: 60, max: 79, type: 'Above Average', summary: 'You have strong analytical and reasoning skills. You learn quickly and adapt well to new challenges.' },
                    { min: 40, max: 59, type: 'Average', summary: 'You have solid cognitive abilities and can handle most intellectual tasks effectively.' },
                    { min: 20, max: 39, type: 'Developing', summary: 'You have room to develop your cognitive skills through practice and learning.' },
                    { min: 0, max: 19, type: 'Emerging', summary: 'Focus on building foundational cognitive skills through consistent practice and learning.' }
                ]
            },
            'emotional_test': {
                ranges: [
                    { min: 80, max: 100, type: 'Highly Emotionally Intelligent', summary: 'You have excellent emotional awareness and regulation. You understand and manage emotions effectively.' },
                    { min: 60, max: 79, type: 'Good Emotional Intelligence', summary: 'You have strong emotional skills. You generally handle emotions well and empathize with others.' },
                    { min: 40, max: 59, type: 'Moderate Emotional Intelligence', summary: 'You have adequate emotional awareness. There is room to develop your emotional management skills.' },
                    { min: 20, max: 39, type: 'Developing Emotional Intelligence', summary: 'Focus on building emotional awareness and regulation skills through practice and reflection.' },
                    { min: 0, max: 19, type: 'Emerging Emotional Intelligence', summary: 'Work on recognizing and understanding your emotions as a foundation for emotional growth.' }
                ]
            }
        };

        const testAnalyses = analyses[testId];
        if (!testAnalyses) return { type: 'Unknown', summary: 'Analysis not available' };

        const range = testAnalyses.ranges.find(r => score >= r.min && score <= r.max);
        return range || testAnalyses.ranges[testAnalyses.ranges.length - 1];
    },

    getDetailedAnalysis(testId, score, answers) {
        // PRO feature - detailed analysis
        return {
            strengths: this.identifyStrengths(testId, answers),
            areasForGrowth: this.identifyGrowthAreas(testId, answers),
            recommendations: this.generateRecommendations(testId, score),
            detailedBreakdown: this.getDetailedBreakdown(testId, answers)
        };
    },

    identifyStrengths(testId, answers) {
        // Analyze answers to identify top strengths
        const strengths = [];
        const avgScore = Object.values(answers).reduce((a, b) => a + b, 0) / Object.keys(answers).length;

        if (avgScore >= 4) {
            strengths.push('Strong self-awareness and understanding');
            strengths.push('Excellent ability to self-reflect');
        }
        if (avgScore >= 3.5) {
            strengths.push('Good emotional regulation');
            strengths.push('Positive interpersonal skills');
        }

        return strengths.length > 0 ? strengths : ['Developing foundational skills'];
    },

    identifyGrowthAreas(testId, answers) {
        const areas = [];
        const avgScore = Object.values(answers).reduce((a, b) => a + b, 0) / Object.keys(answers).length;

        if (avgScore < 3) {
            areas.push('Building confidence in abilities');
            areas.push('Developing consistent practice habits');
        }
        if (avgScore < 4) {
            areas.push('Enhancing self-awareness');
            areas.push('Strengthening emotional regulation');
        }

        return areas.length > 0 ? areas : ['Continue maintaining current strengths'];
    },

    generateRecommendations(testId, score) {
        const recommendations = [];

        if (score < 60) {
            recommendations.push('Practice mindfulness and self-reflection daily');
            recommendations.push('Keep a journal to track your thoughts and feelings');
            recommendations.push('Seek feedback from trusted friends or mentors');
        } else if (score < 80) {
            recommendations.push('Continue developing your skills through practice');
            recommendations.push('Challenge yourself with new experiences');
            recommendations.push('Share your knowledge with others');
        } else {
            recommendations.push('Mentor others in developing similar skills');
            recommendations.push('Explore advanced topics in this area');
            recommendations.push('Apply your strengths to help your community');
        }

        return recommendations;
    },

    getDetailedBreakdown(testId, answers) {
        // Group answers by type and calculate subscores
        const test = this.getTest(testId);
        if (!test) return {};

        const breakdown = {};
        test.questions.forEach((q, index) => {
            const type = q.type;
            if (!breakdown[type]) {
                breakdown[type] = { total: 0, count: 0 };
            }
            breakdown[type].total += answers[q.id] || 0;
            breakdown[type].count += 1;
        });

        // Calculate averages
        Object.keys(breakdown).forEach(type => {
            breakdown[type].average = (breakdown[type].total / breakdown[type].count).toFixed(1);
        });

        return breakdown;
    },

    /* --- PROGRESS TRACKING --- */
    /**
     * Get comprehensive progress data
     * Calculates real progress from completed tasks and lessons
     * @returns {Object} Progress data with percentages and counts
     */
    getProgressData() {
        const data = this.getData();
        const user = Auth.getCurrentUser();

        // Calculate task progress
        const tasks = data.tasks || [];
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const taskPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Calculate lesson progress
        const userProgress = user ? (user.progress || {}) : {};
        const completedLessons = Object.keys(userProgress).filter(key => userProgress[key]).length;

        // Total available lessons (3 languages × 6 levels × 5 lessons = 90 lessons)
        const totalLessons = 90;
        const lessonPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        // Overall progress (combined tasks and lessons)
        const totalItems = totalTasks + totalLessons;
        const completedItems = completedTasks + completedLessons;
        const overallPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        // Get last activity date
        const lastActivity = this.getLastActivity();

        // Calculate streak (days with activity)
        const streak = this.calculateStreak();

        return {
            tasks: {
                total: totalTasks,
                completed: completedTasks,
                percentage: taskPercentage
            },
            lessons: {
                total: totalLessons,
                completed: completedLessons,
                percentage: lessonPercentage
            },
            overall: {
                total: totalItems,
                completed: completedItems,
                percentage: overallPercentage
            },
            lastActivity: lastActivity,
            streak: streak,
            hasProgress: completedItems > 0
        };
    },

    /**
     * Update last activity timestamp
     * Called whenever user completes a task or lesson
     */
    updateLastActivity() {
        const data = this.getData();
        if (!data.activityLog) data.activityLog = [];

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Add today to activity log if not already present
        if (!data.activityLog.includes(today)) {
            data.activityLog.push(today);
        }

        data.lastActivity = new Date().toISOString();
        this.saveData(data);
    },

    /**
     * Get last activity date
     * @returns {string|null} ISO date string or null
     */
    getLastActivity() {
        const data = this.getData();
        return data.lastActivity || null;
    },

    /**
     * Calculate activity streak (consecutive days)
     * @returns {number} Number of consecutive days with activity
     */
    calculateStreak() {
        const data = this.getData();
        const activityLog = data.activityLog || [];

        if (activityLog.length === 0) return 0;

        // Sort dates in descending order
        const sortedDates = activityLog.sort().reverse();

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedDates.length; i++) {
            const activityDate = new Date(sortedDates[i]);
            activityDate.setHours(0, 0, 0, 0);

            const expectedDate = new Date(today);
            expectedDate.setDate(expectedDate.getDate() - i);
            expectedDate.setHours(0, 0, 0, 0);

            if (activityDate.getTime() === expectedDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    },

    /**
     * Get progress by category
     * @returns {Object} Progress breakdown by task category
     */
    getProgressByCategory() {
        const tasks = this.getTasks();
        const categories = {};

        tasks.forEach(task => {
            const cat = task.category || 'Other';
            if (!categories[cat]) {
                categories[cat] = { total: 0, completed: 0 };
            }
            categories[cat].total++;
            if (task.completed) {
                categories[cat].completed++;
            }
        });

        // Calculate percentages
        Object.keys(categories).forEach(cat => {
            const data = categories[cat];
            data.percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
        });

        return categories;
    }
};
