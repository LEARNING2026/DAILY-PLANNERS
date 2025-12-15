import { Store } from './store.js';
import { UI } from './ui.js';

// Determine Page
const path = window.location.pathname;
let page = 'home';
if (path.includes('tasks.html')) page = 'tasks';
if (path.includes('progress.html')) page = 'progress';
if (path.includes('settings.html')) page = 'settings';

// Initialize Layout
function init() {
    // 1. Render Sidebar
    const sidebarEl = document.getElementById('sidebar');
    if (sidebarEl) sidebarEl.innerHTML = UI.renderSidebar(page);

    // 2. Render Page Content
    const contentEl = document.getElementById('main-content');
    const titleEl = document.getElementById('page-title');
    const dateEl = document.getElementById('current-date');

    // Date
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Theme Check
    const settings = Store.getData().settings;
    document.documentElement.setAttribute('data-theme', settings.theme);

    // Page Specifics
    if (page === 'home') {
        if (titleEl) titleEl.textContent = 'Dashboard';
        contentEl.innerHTML = UI.renderHome();
    }
    else if (page === 'tasks') {
        if (titleEl) titleEl.textContent = 'My Tasks';
        renderTasksView();
    }
    else if (page === 'progress') {
        if (titleEl) titleEl.textContent = 'Progress Checker';
        contentEl.innerHTML = UI.renderProgressPage();
    }
    else if (page === 'settings') {
        if (titleEl) titleEl.textContent = 'Settings';
        contentEl.innerHTML = UI.renderSettingsPage();
    }

    bindGlobalEvents();
}

// Tasks View State
let currentFilter = 'all';
let searchQuery = '';

function renderTasksView() {
    const contentEl = document.getElementById('main-content');
    contentEl.innerHTML = UI.renderTasksPage(currentFilter, searchQuery);
    setupDragAndDrop();

    // Bind Inputs
    const searchInput = document.getElementById('search-input'); // if we added search bar
}

// Global Event Handler
function bindGlobalEvents() {
    document.body.addEventListener('click', async (e) => {
        // --- Tasks ---
        if (e.target.id === 'add-btn') {
            const text = document.getElementById('task-text').value.trim();
            const category = document.getElementById('task-category').value;
            const priority = document.getElementById('task-priority').value;
            // Notes input could be added to UI or prompts

            if (text) {
                Store.addTask({ text, category, priority, notes: '' }); // Simplified notes for now
                UI.showNotification('Task Added! + Points', 'success');
                if (page === 'tasks') renderTasksView();
                else if (page === 'home') init(); // Refresh home stats
            }
        }

        if (e.target.classList.contains('checkbox')) {
            const id = e.target.closest('.task-item').dataset.id;
            const res = Store.toggleTask(id);
            const item = e.target.closest('.task-item');
            item.classList.toggle('completed');

            if (res.completed) {
                UI.showNotification('Task Completed! +10 Points', 'success');
                // Check badges
                if (res.badges.length > Store.getData().badges.length) { // Simple check, ideally store returns new badges
                    // Actually store.js toggleTask return creates new badges list, we should just reload badges visuals if needed
                    UI.showNotification(`New Badge Unlocked! 🏅`, 'success');
                }
            }
            if (page === 'home' || page === 'progress') init();
        }

        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.closest('.task-item').dataset.id;
            if (confirm('Are you sure you want to delete this task?')) {
                Store.deleteTask(id);
                UI.showNotification('Task Deleted', 'danger');
                if (page === 'tasks') renderTasksView();
                if (page === 'home') init();
            }
        }

        // Filters
        if (e.target.classList.contains('filter-btn')) {
            currentFilter = e.target.dataset.filter;
            if (page === 'tasks') renderTasksView();
        }

        // --- Settings ---
        if (e.target.id === 'toggle-theme') {
            const current = Store.getData().settings.theme;
            const newTheme = current === 'light' ? 'dark' : 'light';
            Store.updateSettings({ theme: newTheme });
            document.documentElement.setAttribute('data-theme', newTheme);
            if (page === 'settings') init(); // Re-render button text
        }

        if (e.target.id === 'clear-data') {
            if (confirm('Delete ALL data? This cannot be undone.')) {
                Store.clearData();
            }
        }

        // --- Mobile Sidebar ---
        if (e.target.closest('.mobile-toggle')) {
            document.getElementById('sidebar').classList.toggle('open');
        }
    });

    // Inputs
    document.body.addEventListener('input', (e) => {
        if (e.target.id === 'settings-username') {
            Store.updateSettings({ username: e.target.value });
            init(); // Update sidebar name real-time
        }
    });

    // Keypress
    document.body.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.id === 'task-text') {
            document.getElementById('add-btn').click();
        }
    });
}

// Drag & Drop
function setupDragAndDrop() {
    const list = document.getElementById('task-list');
    if (!list) return;

    list.addEventListener('dragstart', (e) => {
        e.target.classList.add('dragging');
    });

    list.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        // Save Order
        const newIds = Array.from(list.children).map(li => li.dataset.id);
        const allTasks = Store.getTasks();
        const sorted = newIds.map(id => allTasks.find(t => t.id === id)).filter(Boolean);
        // We might lose filtered tasks if we only save visible ones. 
        // Correct approach: Only reorder if filter is 'all'.
        if (currentFilter === 'all') {
            Store.reorderTasks(sorted);
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

// Boot
window.document.addEventListener('DOMContentLoaded', init);
