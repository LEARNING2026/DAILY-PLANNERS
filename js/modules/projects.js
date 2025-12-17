/* ============================================
   PROJECTS MODULE
   Personal & Team Project Management Platform
   
   Features:
   ✅ FREE: Personal projects, team collaboration, dashboard, 
           Gantt charts (basic), attachments, comments
   🔒 PRO: Real-time notifications, advanced analytics
   ============================================ */

const ProjectsModule = {
    currentProject: null,

    /**
     * Initialize the Projects module
     */
    init() {
        console.log('ProjectsModule: Initialized');
        // Load projects from Store
        this.projects = Store.getProjects();
    },

    /**
     * Render the main projects dashboard
     * Shows feature cards with Free/Pro indicators
     */
    renderDashboard() {
        const isPro = ProManager.isPro();
        const projects = Store.getProjects();

        // Calculate stats
        const totalProjects = projects.length;
        const activeTasks = projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status !== 'completed').length, 0);
        const totalTeamMembers = new Set(projects.flatMap(p => [...p.team, p.owner])).size;

        return `
            <div class="projects-dashboard">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h1 style="margin: 0; font-size: 2rem;">📊 Project Management</h1>
                    <button class="btn btn-primary" onclick="ProjectsModule.showNewProjectModal()">
                        ➕ New Project
                    </button>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid" style="margin-bottom: 3rem;">
                    <div class="card stat-card">
                        <h3>Total Projects</h3>
                        <div class="value">${totalProjects}</div>
                    </div>
                    <div class="card stat-card">
                        <h3>Active Tasks</h3>
                        <div class="value">${activeTasks}</div>
                    </div>
                    <div class="card stat-card">
                        <h3>Team Members</h3>
                        <div class="value">${totalTeamMembers}</div>
                    </div>
                </div>

                <!-- Feature Grid -->
                <h2 style="margin-bottom: 1.5rem;">Features</h2>
                <div class="features-grid">
                    ${this.renderFeatureCard('personal-projects', '📝', 'Personal Projects', 'Create and manage your personal projects with tasks and deadlines', false, isPro)}
                    ${this.renderFeatureCard('team-collaboration', '👥', 'Team Collaboration', 'Collaborate with team members on shared projects', false, isPro)}
                    ${this.renderFeatureCard('dashboard', '📊', 'Dashboard & Analytics', 'Track progress with basic analytics and insights', false, isPro)}
                    ${this.renderFeatureCard('gantt-charts', '📅', 'Gantt Charts & Timeline', 'Visualize project timelines with Gantt charts and table views', false, isPro)}
                    ${this.renderFeatureCard('attachments', '📎', 'Attachments & Comments', 'Add files and collaborate with comments', false, isPro)}
                    ${this.renderFeatureCard('notifications', '🔔', 'Real-time Notifications', 'Get instant updates on project activities and changes', true, isPro)}
                    ${this.renderFeatureCard('advanced-analytics', '📈', 'Advanced Analytics', 'Deep insights with detailed progress analysis and reports', true, isPro)}
                </div>

                <!-- Recent Projects -->
                <h2 style="margin: 3rem 0 1.5rem 0;">Recent Projects</h2>
                <div class="projects-list">
                    ${projects.map(p => this.renderProjectCard(p)).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Render a feature card with Pro/Free indicator
     */
    renderFeatureCard(featureId, icon, title, description, isPro, userIsPro) {
        const isLocked = isPro && !userIsPro;
        const lockedClass = isLocked ? 'locked' : 'unlocked';
        const clickHandler = isLocked
            ? `onclick="ProManager.showUpgradeModal('${title}')"`
            : `onclick="ProjectsModule.openFeature('${featureId}')"`;

        return `
            <div class="feature-card ${lockedClass}" ${clickHandler}>
                <div class="feature-icon">${icon}</div>
                <div class="feature-content">
                    <h3 class="feature-title">
                        ${title}
                        ${isPro ? '<span class="pro-badge">PRO</span>' : ''}
                    </h3>
                    <p class="feature-description">${description}</p>
                </div>
                ${isLocked ? '<div class="feature-lock-overlay"><span class="lock-icon">🔒</span></div>' : ''}
            </div>
        `;
    },

    /**
     * Render a project card
     */
    renderProjectCard(project) {
        const progressColor = project.progress > 75 ? '#16a34a' : project.progress > 40 ? '#f59e0b' : '#6366f1';
        const daysRemaining = Store.calculateDaysRemaining(project.deadline);
        const daysText = daysRemaining !== null
            ? daysRemaining > 0 ? `${daysRemaining} days left` : daysRemaining === 0 ? 'Due today!' : 'Overdue'
            : 'No deadline';

        return `
            <div class="card project-card" onclick="ProjectsModule.openProject('${project.id}')">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">${project.name}</h3>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">${project.description}</p>
                    </div>
                    <span class="badge" style="background: ${progressColor}20; color: ${progressColor};">${project.progress}%</span>
                </div>
                
                <div class="progress-container" style="margin-bottom: 1rem;">
                    <div class="progress-fill" style="width: ${project.progress}%; background: ${progressColor};"></div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--text-secondary);">
                    <span>📋 ${project.tasks.length} tasks</span>
                    <span>👥 ${project.team.length + 1} members</span>
                    <span>⏰ ${daysText}</span>
                </div>
            </div>
        `;
    },

    /**
     * Open a specific feature
     */
    openFeature(featureId) {
        const isPro = ProManager.isPro();

        switch (featureId) {
            case 'personal-projects':
                this.showProjectsList();
                break;
            case 'team-collaboration':
                this.showTeamView();
                break;
            case 'dashboard':
                this.showDashboardView();
                break;
            case 'gantt-charts':
                this.showGanttView();
                break;
            case 'attachments':
                this.showAttachmentsView();
                break;
            case 'notifications':
                // PRO feature - should be gated
                if (!ProManager.requirePro('Real-time Notifications')) return;
                this.showNotificationsView();
                break;
            case 'advanced-analytics':
                // PRO feature - should be gated
                if (!ProManager.requirePro('Advanced Analytics')) return;
                this.showAdvancedAnalytics();
                break;
            default:
                UI.showToast('Feature coming soon!', 'info');
        }
    },

    /**
     * Show new project modal
     */
    showNewProjectModal() {
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal-overlay active';
        modal.innerHTML = `
            <div class="upgrade-modal">
                <div class="upgrade-modal-header">
                    <h2>Create New Project</h2>
                </div>
                <form class="upgrade-modal-body" onsubmit="ProjectsModule.createProject(event)">
                    <input type="text" id="new-project-name" class="input-field" placeholder="Project Name" required style="margin-bottom: 1rem;">
                    <textarea id="new-project-desc" class="input-field" placeholder="Description" rows="3" style="margin-bottom: 1rem; resize: vertical;"></textarea>
                    <input type="date" id="new-project-deadline" class="input-field" style="margin-bottom: 1rem;">
                    
                    <div class="upgrade-modal-footer">
                        <button type="submit" class="btn btn-primary">Create Project</button>
                        <button type="button" class="btn" onclick="ProjectsModule.closeModal()">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    },

    /**
     * Create a new project
     */
    createProject(event) {
        event.preventDefault();

        const name = document.getElementById('new-project-name').value;
        const description = document.getElementById('new-project-desc').value;
        const deadline = document.getElementById('new-project-deadline').value;

        const newProject = Store.addProject({ name, description, deadline });

        UI.showToast(`Project "${name}" created successfully! 🎉`, 'success');
        this.closeModal();

        // Refresh the view
        UI.renderProjects();
    },

    /**
     * Open project details
     */
    openProject(projectId) {
        const projects = Store.getProjects();
        const project = projects.find(p => p.id === projectId);

        if (!project) {
            UI.showToast('Project not found', 'error');
            return;
        }

        this.currentProject = project;
        const container = document.getElementById('projects-view');

        container.innerHTML = `
            <div class="project-detail-view">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <div>
                        <button class="btn" onclick="UI.renderProjects()" style="margin-bottom: 1rem;">← Back to Projects</button>
                        <h1 style="margin: 0; font-size: 2rem;">${project.name}</h1>
                        <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">${project.description}</p>
                    </div>
                </div>

                <!-- Project Stats -->
                <div class="stats-grid" style="margin-bottom: 2rem;">
                    <div class="card">
                        <h3>Progress</h3>
                        <div class="value">${project.progress}%</div>
                        <div class="progress-container">
                            <div class="progress-fill" style="width: ${project.progress}%;"></div>
                        </div>
                    </div>
                    <div class="card">
                        <h3>Tasks</h3>
                        <div class="value">${project.tasks.length}</div>
                    </div>
                    <div class="card">
                        <h3>Team</h3>
                        <div class="value">${project.team.length + 1}</div>
                    </div>
                </div>

                <!-- Tasks -->
                <h2 style="margin-bottom: 1rem;">Tasks</h2>
                <div class="project-tasks">
                    ${project.tasks.map(task => this.renderTaskItem(project.id, task)).join('')}
                    <button class="btn" onclick="ProjectsModule.addTaskToProject('${project.id}')" style="margin-top: 1rem;">
                        ➕ Add Task
                    </button>
                </div>

                <!-- Comments Section (FREE Feature) -->
                <h2 style="margin: 2rem 0 1rem 0;">💬 Comments & Collaboration</h2>
                <div class="card">
                    <div class="comments-list" style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;">
                        ${project.comments.map(c => this.renderComment(c)).join('') || '<p style="color: var(--text-secondary);">No comments yet</p>'}
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="new-comment-${project.id}" class="input-field" placeholder="Add a comment...">
                        <button class="btn btn-primary" onclick="ProjectsModule.addComment('${project.id}')">Post</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderTaskItem(projectId, task) {
        const statusColors = {
            'completed': '#16a34a',
            'in-progress': '#f59e0b',
            'pending': '#6b7280'
        };
        const color = statusColors[task.status] || '#6b7280';

        return `
            <div class="card" style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 0.5rem 0;">${task.title}</h4>
                        <div style="font-size: 0.85rem; color: var(--text-secondary);">
                            <span>👤 ${task.assignee}</span>
                            <span style="margin-left: 1rem;">📅 ${task.deadline || 'No deadline'}</span>
                            <span style="margin-left: 1rem;">⚡ ${task.priority}</span>
                        </div>
                    </div>
                    <span class="badge" style="background: ${color}20; color: ${color};">${task.status}</span>
                </div>
            </div>
        `;
    },

    renderComment(comment) {
        const date = new Date(comment.timestamp).toLocaleString();
        return `
            <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">${comment.author}</div>
                <div style="color: var(--text-secondary); margin-bottom: 0.25rem;">${comment.text}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${date}</div>
            </div>
        `;
    },

    addComment(projectId) {
        const input = document.getElementById(`new-comment-${projectId}`);
        const text = input.value.trim();

        if (!text) {
            UI.showToast('Please enter a comment', 'error');
            return;
        }

        Store.addProjectComment(projectId, text);
        input.value = '';
        UI.showToast('Comment added! 💬', 'success');

        // Refresh the project view
        this.openProject(projectId);
    },

    addTaskToProject(projectId) {
        const taskTitle = prompt('Enter task title:');
        if (!taskTitle) return;

        Store.addProjectTask(projectId, { title: taskTitle });
        UI.showToast('Task added! ✅', 'success');
        this.openProject(projectId);
    },

    showProjectsList() {
        UI.showToast('Showing all projects', 'info');
        // Already shown in dashboard
    },

    showTeamView() {
        UI.showToast('Team collaboration view - Coming soon!', 'info');
    },

    showDashboardView() {
        UI.showToast('Dashboard view active', 'info');
    },

    showGanttView() {
        UI.showToast('Gantt chart view - Coming soon!', 'info');
    },

    showAttachmentsView() {
        UI.showToast('Attachments view - Coming soon!', 'info');
    },

    showNotificationsView() {
        // PRO ONLY
        UI.showToast('Real-time notifications enabled! 🔔', 'success');
    },

    showAdvancedAnalytics() {
        // PRO ONLY
        if (!this.currentProject) {
            UI.showToast('Please select a project first', 'info');
            return;
        }

        const analytics = Store.getProjectAnalytics(this.currentProject.id);

        alert(`Advanced Analytics for ${this.currentProject.name}:\n\n` +
            `Completion Rate: ${analytics.advanced.completionRate}%\n` +
            `Activity Score: ${analytics.advanced.activityScore}/100\n` +
            `Avg Tasks/Member: ${analytics.advanced.averageTasksPerMember}\n\n` +
            `Tasks by Priority:\n` +
            `  High: ${analytics.advanced.tasksByPriority.high}\n` +
            `  Medium: ${analytics.advanced.tasksByPriority.medium}\n` +
            `  Low: ${analytics.advanced.tasksByPriority.low}`);
    },

    closeModal() {
        const modal = document.querySelector('.upgrade-modal-overlay');
        if (modal) modal.remove();
    }
};

// Export to window
window.ProjectsModule = ProjectsModule;
