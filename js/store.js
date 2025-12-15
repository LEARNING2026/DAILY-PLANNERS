const STORAGE_KEY = 'daily_planner_spa_v1';
const LANGUAGE_PROGRESS_KEY = 'daily_planner_lang_progress_v1';

/* --- EXISTING DATA --- */
const initialTasks = [
    { id: '1', text: 'Wake up early', category: 'Personal', priority: 'medium', notes: '6:30 AM', completed: false, createdAt: new Date().toISOString() },
    { id: '2', text: 'Exercise 30 min', category: 'Personal', priority: 'high', notes: 'Home workout', completed: false, createdAt: new Date().toISOString() },
    { id: '3', text: 'Review lesson', category: 'Work', priority: 'high', notes: 'Focus on key points', completed: false, createdAt: new Date().toISOString() },
    { id: '4', text: 'Drink 2L water', category: 'Personal', priority: 'low', notes: 'Hydrate', completed: false, createdAt: new Date().toISOString() },
    { id: '5', text: 'Solve coding exercise', category: 'Learning', priority: 'high', notes: 'JS Algo', completed: false, createdAt: new Date().toISOString() },
];

const defaultData = {
    tasks: initialTasks,
    points: 0,
    badges: [],
    settings: { username: 'User', theme: 'light' }
};

/* --- LANGUAGE DATA --- */
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
];

// Sample Content Generator for demonstration
// In a real app, this would be a much larger database or fetched from an API
const generateContent = (langCode, level) => {
    const isBeginner = level === 'A1' || level === 'A2';

    // Core Vocabulary
    const vocab = [
        { id: 1, word: 'Hello', translation: 'مرحبا', image: 'https://cdn-icons-png.flaticon.com/512/2665/2665448.png' },
        { id: 2, word: 'Book', translation: 'كتاب', image: 'https://cdn-icons-png.flaticon.com/512/3330/3330314.png' },
        { id: 3, word: 'Cat', translation: 'قطة', image: 'https://cdn-icons-png.flaticon.com/512/616/616408.png' },
        { id: 4, word: 'Sun', translation: 'شمس', image: 'https://cdn-icons-png.flaticon.com/512/869/869869.png' },
        { id: 5, word: 'Water', translation: 'ماء', image: 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png' }
    ];

    // Phrases
    const phrases = [
        { id: 1, text: 'How are you?', translation: 'كيف حالك؟' },
        { id: 2, text: 'My name is...', translation: 'اسمي...' },
        { id: 3, text: 'Where is the station?', translation: 'أين المحطة؟' },
        { id: 4, text: 'I would like a coffee.', translation: 'أريد قهوة.' }
    ];

    // Grammar
    const grammar = {
        title: `${level} Grammar Basics`,
        rules: [
            { title: 'Personal Pronouns', content: 'I, You, He/She/It, We, They...' },
            { title: 'Present Tense', content: 'Usage of simple present actions.' },
            { title: 'Articles', content: 'Definite (The) and Indefinite (A/An).' }
        ]
    };

    // Specific localization hacks for demo purposes
    if (langCode === 'fr') {
        vocab[0].word = 'Bonjour'; vocab[1].word = 'Livre'; vocab[2].word = 'Chat'; vocab[3].word = 'Soleil'; vocab[4].word = 'Eau';
        phrases[0].text = 'Comment allez-vous?'; phrases[1].text = 'Je m\'appelle...'; phrases[2].text = 'Où est la gare?'; phrases[3].text = 'Je voudrais un café.';
    } else if (langCode === 'es') {
        vocab[0].word = 'Hola'; vocab[1].word = 'Libro'; vocab[2].word = 'Gato'; vocab[3].word = 'Sol'; vocab[4].word = 'Agua';
        phrases[0].text = '¿Cómo estás?'; phrases[1].text = 'Me llamo...'; phrases[2].text = '¿Dónde está la estación?'; phrases[3].text = 'Quisiera un café.';
    } else if (langCode === 'de') {
        vocab[0].word = 'Hallo'; vocab[1].word = 'Buch'; vocab[2].word = 'Katze'; vocab[3].word = 'Sonne'; vocab[4].word = 'Wasser';
        phrases[0].text = 'Wie geht es Ihnen?'; phrases[1].text = 'Ich heiße...'; phrases[2].text = 'Wo ist der Bahnhof?'; phrases[3].text = 'Ich hätte gern einen Kaffee.';
    } else if (langCode === 'zh') {
        vocab[0].word = '你好'; vocab[1].word = '书'; vocab[2].word = '猫'; vocab[3].word = '太阳'; vocab[4].word = '水';
        phrases[0].text = '你好吗？'; phrases[1].text = '我叫...'; phrases[2].text = '学站在哪里？'; phrases[3].text = '我想要一杯咖啡。';
    }

    return { vocab, phrases, grammar };
};


const Store = {
    /* --- EXISTING METHODS --- */
    getData() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            this.saveData(defaultData);
            return defaultData;
        }
        return JSON.parse(raw);
    },
    saveData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); },

    getTasks() { return this.getData().tasks; },

    addTask(taskObj) {
        const data = this.getData();
        const newTask = {
            id: Date.now().toString(),
            text: taskObj.text,
            category: taskObj.category,
            priority: taskObj.priority,
            notes: taskObj.notes || '',
            completed: false,
            createdAt: new Date().toISOString()
        };
        data.tasks.unshift(newTask);
        this.saveData(data);
        return newTask;
    },

    deleteTask(id) {
        const data = this.getData();
        data.tasks = data.tasks.filter(t => t.id !== id);
        this.saveData(data);
    },

    toggleTask(id) {
        const data = this.getData();
        const task = data.tasks.find(t => t.id === id);
        let earnedPoints = 0;
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                data.points += 10;
                earnedPoints = 10;
                if (data.points >= 100 && !data.badges.includes('Beginner')) data.badges.push('Beginner');
                if (data.points >= 500 && !data.badges.includes('Pro')) data.badges.push('Pro');
            } else {
                data.points = Math.max(0, data.points - 10);
            }
            this.saveData(data);
        }
        return { completed: task.completed, earnedPoints };
    },

    reorderTasks(tasks) {
        const data = this.getData();
        data.tasks = tasks;
        this.saveData(data);
    },

    updateSettings(newSet) {
        const data = this.getData();
        data.settings = { ...data.settings, ...newSet };
        this.saveData(data);
    },

    clearData() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LANGUAGE_PROGRESS_KEY);
        location.reload();
    },

    /* --- NEW LANGUAGE METHODS --- */
    getLanguageData() {
        const raw = localStorage.getItem(LANGUAGE_PROGRESS_KEY);
        if (!raw) return {};
        return JSON.parse(raw); // Structure: { 'en': { 'A1': 50, 'A2': 0 }, 'fr': ... }
    },

    saveLanguageProgress(langCode, level, progress) {
        const data = this.getLanguageData();
        if (!data[langCode]) data[langCode] = {};
        data[langCode][level] = progress;
        localStorage.setItem(LANGUAGE_PROGRESS_KEY, JSON.stringify(data));
    },

    getLanguages() { return LANGUAGES; },
    getLevels() { return LEVELS; },

    // In a real app, this would be async fetch
    getLevelContent(langCode, level) {
        return generateContent(langCode, level);
    },

    getGlobalStats() {
        const langData = this.getLanguageData();
        const settings = this.getData().settings;

        let totalXP = 0;
        let totalLevelsCompleted = 0;
        let startedLangs = 0;

        // Calculate stats from Lang Data
        Object.keys(langData).forEach(lang => {
            startedLangs++;
            const levels = langData[lang];
            Object.values(levels).forEach(progress => {
                if (progress === 100) {
                    totalXP += 1000; // 1000 XP per level
                    totalLevelsCompleted++;
                } else {
                    totalXP += (progress * 5);
                }
            });
        });

        // Add Task XP
        const taskData = this.getData();
        totalXP += taskData.points;

        // Calculate Rank
        let rank = 'Novice';
        if (totalXP > 1000) rank = 'Apprentice';
        if (totalXP > 5000) rank = 'Intermediate';
        if (totalXP > 10000) rank = 'Advanced';
        if (totalXP > 25000) rank = 'Polyglot';
        if (totalXP > 50000) rank = 'Master';

        return {
            username: settings.username,
            totalXP,
            lvlCount: totalLevelsCompleted,
            langCount: startedLangs,
            rank,
            streak: 3 // Mock streak for demo
        };
    }
};

// Expose to window for other modules
window.Store = Store;
window.LANGUAGES = LANGUAGES;
window.LEVELS = LEVELS;
