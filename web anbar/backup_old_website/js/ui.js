import { Store } from './store.js';

export const UI = {
    // --- Layout ---
    renderSidebar: (activePage) => {
        const settings = Store.getData().settings;
        return `
            <div class="brand">
                <span class="icon">📅</span> Daily Planner
            </div>
            <nav class="nav-links">
                <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">
                    <span class="icon">🏠</span> Home
                </a>
                <a href="tasks.html" class="nav-link ${activePage === 'tasks' ? 'active' : ''}">
                    <span class="icon">✅</span> Tasks
                </a>
                <a href="progress.html" class="nav-link ${activePage === 'progress' ? 'active' : ''}">
                    <span class="icon">📊</span> Progress
                </a>
                <a href="settings.html" class="nav-link ${activePage === 'settings' ? 'active' : ''}">
                    <span class="icon">⚙️</span> Settings
                </a>
            </nav>
            <div class="user-profile">
                <p style="font-size: 0.9rem; color: var(--text-secondary);">Welcome back,</p>
                <p style="font-weight: 600;">${settings.username}</p>
            </div>
        `;
    },

    // --- Components ---
    showNotification: (msg, type = 'info') => {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerHTML = `<span>${msg}</span>`;
        container.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    },

    // --- Pages ---
    renderHome: () => {
        const data = Store.getData();
        const pending = data.tasks.filter(t => !t.completed).length;
        const total = data.tasks.length;

        return `
            <div class="stats-grid">
                <div class="card stat-card">
                    <h3>Tasks Pending</h3>
                    <div class="value">${pending}</div>
                </div>
                <div class="card stat-card">
                    <h3>Total Points</h3>
                    <div class="value" style="color: var(--primary-color)">${data.points}</div>
                </div>
                <div class="card stat-card">
                    <h3>Badges</h3>
                    <div class="value" style="font-size: 1.5rem;">${data.badges.length > 0 ? data.badges.join(' 🏅 ') : 'None yet'}</div>
                </div>
            </div>
            <div class="card">
                <h3>Recent Activity</h3>
                ${data.tasks.length === 0 ? 'No tasks yet.' : UI.renderTaskList(data.tasks.slice(0, 5), false)}
            </div>
        `;
    },

    renderTasksPage: (filter = 'all', searchQuery = '') => {
        let tasks = Store.getTasks();

        // Filter
        if (filter === 'completed') tasks = tasks.filter(t => t.completed);
        if (filter === 'pending') tasks = tasks.filter(t => !t.completed);

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            tasks = tasks.filter(t => t.text.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
        }

        return `
            <div class="add-task-form">
                <div class="input-group">
                    <input type="text" id="task-text" class="input-field" placeholder="Review lesson..." required>
                </div>
                <div class="input-group">
                    <select id="task-category" class="input-field">
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                        <option value="Learning">Learning</option>
                        <option value="Fun">Fun</option>
                    </select>
                </div>
                <div class="input-group">
                    <select id="task-priority" class="input-field">
                        <option value="high">High Priority</option>
                        <option value="medium" selected>Medium</option>
                        <option value="low">Low Priority</option>
                    </select>
                </div>
                <button id="add-btn" class="btn btn-primary">Add Task</button>
            </div>

            <div class="task-filters">
                <button class="filter-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                <button class="filter-btn ${filter === 'pending' ? 'active' : ''}" data-filter="pending">Pending</button>
                <button class="filter-btn ${filter === 'completed' ? 'active' : ''}" data-filter="completed">Completed</button>
            </div>
            
            <ul class="task-list" id="task-list">
                ${UI.renderTaskList(tasks, true)}
            </ul>
        `;
    },

    renderTaskList: (tasks, editable = true) => {
        if (tasks.length === 0) return '<p style="color:var(--text-secondary); text-align:center;">No tasks found.</p>';

        return tasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}" ${editable ? 'draggable="true"' : ''}>
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} ${!editable ? 'disabled' : ''}>
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    <div class="task-meta">
                        <span class="badge badge-category">${task.category}</span>
                        <span class="badge badge-priority-${task.priority}">${task.priority.toUpperCase()}</span>
                        ${task.notes ? `<span>📝 ${task.notes}</span>` : ''}
                    </div>
                </div>
                ${editable ? `
                <div class="task-actions">
                    <button class="action-btn delete-btn" title="Delete">🗑️</button>
                    <span class="action-btn drag-handle" title="Drag">⋮⋮</span>
                </div>
                ` : ''}
            </li>
        `).join('');
    },

    renderProgressPage: () => {
        const tasks = Store.getTasks();
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

        return `
            <div class="card" style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; font-weight: 800; color: var(--primary-color);">${percent}%</div>
                <p style="color: var(--text-secondary); margin-bottom: 2rem;">Completion Rate</p>
                <div style="height: 1rem; background: var(--border-color); border-radius: 1rem; overflow: hidden;">
                    <div style="width: ${percent}%; background: var(--success-color); height: 100%;"></div>
                </div>
                <div style="margin-top: 2rem; display: flex; justify-content: space-around;">
                    <div>
                        <h3>${completed}</h3>
                        <p>Done</p>
                    </div>
                    <div>
                        <h3>${total - completed}</h3>
                        <p>Pending</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderSettingsPage: () => {
        const settings = Store.getData().settings;
        return `
            <div class="card">
                <div class="input-group" style="margin-bottom: 1.5rem;">
                    <label style="margin-bottom: 0.5rem; display: block; font-weight: 600;">Username</label>
                    <input type="text" id="settings-username" class="input-field" value="${settings.username}">
                </div>
                <div class="input-group" style="margin-bottom: 1.5rem;">
                    <label style="margin-bottom: 0.5rem; display: block; font-weight: 600;">Theme</label>
                    <button id="toggle-theme" class="btn" style="border: 1px solid var(--border-color);">
                        Toggle ${settings.theme === 'light' ? 'Dark' : 'Light'} Mode
                    </button>
                </div>
                <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 2rem 0;">
                <button id="clear-data" class="btn btn-danger">⚠️ Clear All Data</button>
            </div>
        `;
    }
};
