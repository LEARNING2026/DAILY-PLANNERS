/* --- APP LOGIC --- */
// State
let currentView = 'home';
let currentFilter = 'all';
let currentSearch = '';

// Init
function init() {
    const data = Store.getData();
    applyTheme(data.settings.theme);
    if (document.getElementById('sidebar-username')) document.getElementById('sidebar-username').innerText = data.settings.username;
    if (document.getElementById('username-input')) document.getElementById('username-input').value = data.settings.username;
    if (document.getElementById('current-date')) document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    // Hash Routing
    window.addEventListener('hashchange', handleHash);
    handleHash(); // Initial load
}

function handleHash() {
    const hash = window.location.hash.slice(1) || 'home';

    // Parse complex routes like languages/en/A1
    if (hash.startsWith('languages')) {
        const parts = hash.split('/');
        // languages (hub) -> parts[0]
        // languages/en -> parts[1]
        // languages/en/A1 -> parts[2]

        showView('languages');

        if (parts.length === 3) {
            UI.renderLessonDashboard(parts[1], parts[2]);
        } else if (parts.length === 2) {
            UI.renderLevels(parts[1]);
        } else {
            UI.renderLanguagesHub();
        }
        return;
    }

    showView(hash);
}

function showView(viewName) {
    currentView = viewName;
    // Sidebar active state
    document.querySelectorAll('.nav-link').forEach(l => {
        const href = l.getAttribute('href').replace('#', '');
        // Simple check if viewName starts with the href link (for languages nested routes)
        if (viewName.startsWith(href)) {
            l.classList.add('active');
        } else {
            l.classList.remove('active');
        }
    });

    // Show Section
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`${viewName.split('/')[0]}-view`); // handle nested routes for ID lookup
    if (target) target.classList.add('active');

    // Update Title
    const title = viewName.charAt(0).toUpperCase() + viewName.slice(1).split('/')[0];
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.innerText = title === 'Home' ? 'Dashboard' : title;

    // Close Mobile Sidebar
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');

    // Render Content
    if (viewName === 'home') UI.renderHome();
    if (viewName === 'tasks') UI.renderTaskList(currentFilter, currentSearch);
    if (viewName === 'progress') UI.renderProgress();
    // Languages rendered by handleHash specific logic
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

function setupDragAndDrop() {
    const list = document.getElementById('task-list');
    if (!list) return; // Guard for other views

    list.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('task-item')) {
            e.target.classList.add('dragging');
        }
    });

    list.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('task-item')) {
            e.target.classList.remove('dragging');
            // Save logic here if needed (reorder)
        }
    });

    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (afterElement == null) {
            list.appendChild(dragging);
        } else {
            list.insertBefore(dragging, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Global Event Listeners
document.body.addEventListener('click', (e) => {
    // Add Task
    if (e.target.id === 'add-btn') {
        const input = document.getElementById('task-input');
        const text = input.value.trim();
        if (text) {
            Store.addTask({
                text,
                category: document.getElementById('task-category').value,
                priority: document.getElementById('task-priority').value
            });
            input.value = '';
            UI.showToast('Task added!', 'success');
            if (currentView === 'tasks') UI.renderTaskList(currentFilter, currentSearch);
        }
    }

    // Checkbox
    if (e.target.classList.contains('checkbox') && !e.target.disabled) {
        const id = e.target.closest('.task-item').dataset.id;
        const res = Store.toggleTask(id);
        e.target.closest('.task-item').classList.toggle('completed');
        if (res.completed && res.earnedPoints) UI.showToast(`+${res.earnedPoints} Points!`, 'success');

        // Refresh whole view if we are filtering or on home
        if (currentFilter !== 'all' || currentView === 'home') {
            setTimeout(() => {
                if (currentView === 'tasks') UI.renderTaskList(currentFilter, currentSearch);
                else if (currentView === 'home') UI.renderHome();
            }, 300);
        }
    }

    // Delete
    if (e.target.closest('.delete-btn')) {
        const id = e.target.closest('.task-item').dataset.id;
        Store.deleteTask(id);
        UI.showToast('Task deleted');
        if (currentView === 'tasks') UI.renderTaskList(currentFilter, currentSearch);
        else if (currentView === 'home') UI.renderHome();
    }

    // Mobile Toggle
    if (e.target.id === 'mobile-toggle') {
        document.getElementById('sidebar').classList.toggle('open');
    }

    // Theme Toggle
    if (e.target.id === 'theme-toggle') {
        const currentData = Store.getData();
        const newTheme = currentData.settings.theme === 'light' ? 'dark' : 'light';
        Store.updateSettings({ theme: newTheme });
        applyTheme(newTheme);
    }

    // Clear Data
    if (e.target.id === 'clear-data') {
        if (confirm('Are you sure? This will assume factory defaults.')) {
            Store.clearData();
        }
    }

    // Filters
    if (e.target.classList.contains('filter-btn')) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        UI.renderTaskList(currentFilter, currentSearch);
    }
});

// Search input
document.addEventListener('input', (e) => {
    if (e.target.id === 'search-input') {
        currentSearch = e.target.value;
        UI.renderTaskList(currentFilter, currentSearch);
    }

    if (e.target.id === 'username-input') {
        Store.updateSettings({ username: e.target.value });
        document.getElementById('sidebar-username').innerText = e.target.value;
    }
});

// Init on load
document.addEventListener('DOMContentLoaded', init);
