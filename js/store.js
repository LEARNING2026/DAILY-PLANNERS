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
                { id: 1, text: "Complete Project Proposal", completed: false, category: "Work", priority: "high", notes: "Due Friday" },
                { id: 2, text: "Buy Groceries", completed: true, category: "Personal", priority: "medium", notes: "Milk, Bread, Eggs" }
            ],
            settings: { theme: 'light', username: 'Guest' },
            books: [],
            points: 1250,
            badges: ["🚀 Starter", "📚 Bookworm"]
        };
        return JSON.parse(localStorage.getItem(this.getKey()) || JSON.stringify(defaultData));
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
    }
};
