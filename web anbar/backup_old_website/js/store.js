const STORAGE_KEY = 'daily_planner_v2_data';

const initialTasks = [
    // Personal
    { id: 'p1', text: 'Wake up early', category: 'Personal', priority: 'medium', notes: 'Alarm 6:30 AM', completed: false, createdAt: new Date().toISOString() },
    { id: 'p2', text: 'Exercise 30 min', category: 'Personal', priority: 'high', notes: 'Home workout', completed: false, createdAt: new Date().toISOString() },
    { id: 'p3', text: 'Read 30 pages', category: 'Personal', priority: 'medium', notes: 'Favorite book', completed: false, createdAt: new Date().toISOString() },
    { id: 'p4', text: 'Drink 2L water', category: 'Personal', priority: 'low', notes: 'Reminder during day', completed: false, createdAt: new Date().toISOString() },
    { id: 'p5', text: 'Organize room', category: 'Personal', priority: 'low', notes: 'Make bed, clean table', completed: false, createdAt: new Date().toISOString() },

    // Work/Study
    { id: 'w1', text: 'Review lesson', category: 'Work', priority: 'high', notes: 'Focus on key points', completed: false, createdAt: new Date().toISOString() },
    { id: 'w2', text: 'Send report', category: 'Work', priority: 'high', notes: 'Before 3 PM', completed: false, createdAt: new Date().toISOString() },
    { id: 'w3', text: 'Prepare presentation', category: 'Work', priority: 'medium', notes: 'PowerPoint or Canva', completed: false, createdAt: new Date().toISOString() },
    { id: 'w4', text: 'Reply emails', category: 'Work', priority: 'medium', notes: '10 min per session', completed: false, createdAt: new Date().toISOString() },
    { id: 'w5', text: 'Organize weekly schedule', category: 'Work', priority: 'low', notes: 'Main tasks', completed: false, createdAt: new Date().toISOString() },

    // Learning
    { id: 'l1', text: 'Solve coding exercise', category: 'Learning', priority: 'high', notes: 'HTML/CSS/JS', completed: false, createdAt: new Date().toISOString() },
    { id: 'l2', text: 'Watch 30 min tutorial', category: 'Learning', priority: 'medium', notes: 'YouTube / learning site', completed: false, createdAt: new Date().toISOString() },
    { id: 'l3', text: 'Learn 10 new words', category: 'Learning', priority: 'high', notes: 'Language learning', completed: false, createdAt: new Date().toISOString() },
    { id: 'l4', text: 'Write daily note', category: 'Learning', priority: 'low', notes: 'Improve writing', completed: false, createdAt: new Date().toISOString() },

    // Fun
    { id: 'f1', text: 'Watch short movie', category: 'Fun', priority: 'low', notes: 'Light break', completed: false, createdAt: new Date().toISOString() },
    { id: 'f2', text: 'Drawing / Digital art', category: 'Fun', priority: 'medium', notes: '15 min creative', completed: false, createdAt: new Date().toISOString() },
    { id: 'f3', text: 'Listen to favorite music', category: 'Fun', priority: 'low', notes: 'During break', completed: false, createdAt: new Date().toISOString() },
    { id: 'f4', text: 'Play with pets', category: 'Fun', priority: 'low', notes: '10 min', completed: false, createdAt: new Date().toISOString() }
];

const defaultData = {
    tasks: initialTasks,
    points: 0,
    badges: [],
    settings: {
        username: 'User',
        theme: 'light'
    }
};

function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        saveData(defaultData);
        return defaultData;
    }
    return JSON.parse(raw);
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const Store = {
    getData: () => loadData(),

    saveData: (data) => saveData(data),

    getTasks: () => loadData().tasks,

    setTasks: (tasks) => {
        const data = loadData();
        data.tasks = tasks;
        saveData(data);
    },

    addTask: (taskObj) => {
        const data = loadData();
        const newTask = {
            id: Date.now().toString(),
            text: taskObj.text,
            category: taskObj.category || 'Personal',
            priority: taskObj.priority || 'medium',
            notes: taskObj.notes || '',
            completed: false,
            createdAt: new Date().toISOString()
        };
        data.tasks.unshift(newTask);
        saveData(data);
        return newTask;
    },

    deleteTask: (id) => {
        const data = loadData();
        // Check if task was completed to deduct points? optional.
        data.tasks = data.tasks.filter(t => t.id !== id);
        saveData(data);
    },

    toggleTask: (id) => {
        const data = loadData();
        const task = data.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;

            // Gamification Logic
            if (task.completed) {
                data.points += 10;
                checkBadges(data);
            } else {
                data.points = Math.max(0, data.points - 10);
            }

            saveData(data);
            return { completed: task.completed, points: data.points, badges: data.badges };
        }
    },

    reorderTasks: (newTasks) => {
        const data = loadData();
        data.tasks = newTasks;
        saveData(data);
    },

    updateSettings: (newSettings) => {
        const data = loadData();
        data.settings = { ...data.settings, ...newSettings };
        saveData(data);
    },

    clearData: () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
};

function checkBadges(data) {
    const points = data.points;
    const badges = data.badges;

    const newBadges = [];
    if (points >= 100 && !badges.includes('Beginner')) newBadges.push('Beginner');
    if (points >= 500 && !badges.includes('Pro')) newBadges.push('Pro');
    if (points >= 1000 && !badges.includes('Master')) newBadges.push('Master');

    if (newBadges.length > 0) {
        data.badges = [...badges, ...newBadges];
        // Could return new badges to trigger alerts
    }
}
