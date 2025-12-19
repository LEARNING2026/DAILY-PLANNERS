/**
 * LEARNING Platform - Single Page Application Logic
 * ------------------------------------------------
 * Architecture:
 * - Router: Handles navigation between 'views' (e.g., home, course, lesson).
 * - App: Manages state (user, progress) and actions.
 * - API: Communicates with backend (defined in api.js).
 */

// --- 1. Router System ---
const router = {
    // Navigate to a specific view
    navigate: (viewName, param = null) => {
        console.log(`Navigating to: ${viewName} with param: ${param}`);

        // Hide all views first (conceptually - we actually clear mainContent)
        const mainContent = document.getElementById('mainContent');

        // Render the requested view
        let contentHtml = '';

        switch (viewName) {
            case 'home':
                contentHtml = app.renderView('view-home');
                break;
            case 'login':
                contentHtml = app.renderView('view-login');
                break;
            case 'register':
                contentHtml = app.renderView('view-register');
                break;
            case 'dashboard':
                if (!app.currentUser) {
                    router.navigate('login');
                    return;
                }
                contentHtml = app.renderView('view-dashboard');
                setTimeout(() => app.loadDashboardData(), 100); // Load data after render
                break;
            case 'course':
                contentHtml = app.renderView('view-course');
                setTimeout(() => app.loadCourse(param), 100);
                break;
            case 'lesson':
                contentHtml = app.renderView('view-lesson');
                setTimeout(() => app.loadLesson(param), 100);
                break;
            default:
                contentHtml = '<h2>404 - Not Found</h2>';
        }

        mainContent.innerHTML = contentHtml;

        // Update Sidebar Active State
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('onclick')?.includes(`'${viewName}'`)) {
                // Approximate active check
                item.classList.add('active');
            }
        });

        // Close sidebar on mobile if open
        const sidebar = document.getElementById('appSidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    },

    // Go back (simple implementation)
    back: () => {
        // Default fallback to home or course depending on context
        // Ideally we'd have a history stack, but for this beginner app, we'll route to home
        router.navigate('home');
    }
};

// --- 2. Application Logic ---
const app = {
    currentUser: null,
    currentCourseData: null,
    currentLessonId: null,

    // Initialize the app
    init: () => {
        // Check for logged (persisted in localStorage from api.js logic)
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            app.currentUser = JSON.parse(savedUser);
            app.updateAuthUI();
        }

        // Start at Home
        router.navigate('home');
    },

    // Get HTML content from <template> tags
    renderView: (templateId) => {
        const template = document.getElementById(templateId);
        if (!template) return `<div>Error: Template ${templateId} not found</div>`;
        return template.innerHTML;
    },

    // --- Authentication Actions ---
    handleLogin: async (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const result = await AuthAPI.login(email, password);
            if (result.user) {
                app.currentUser = result.user;
                app.updateAuthUI();
                router.navigate('dashboard');
            }
        } catch (error) {
            alert("Login Failed: " + error.message);
        }
    },

    handleRegister: async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const result = await AuthAPI.register(name, email, password);
            if (result.user) {
                app.currentUser = result.user;
                app.updateAuthUI();
                router.navigate('dashboard');
            }
        } catch (error) {
            alert("Registration Failed: " + error.message);
        }
    },

    logout: () => {
        AuthAPI.logout();
        app.currentUser = null;
        app.updateAuthUI();
        alert("You have been logged out.");
        router.navigate('home');
    },

    // Mobile Sidebar Toggle
    toggleSidebar: () => {
        const sidebar = document.getElementById('appSidebar');
        sidebar.classList.toggle('open');
    },

    // Update Sidebar UI based on auth state
    updateAuthUI: () => {
        const authBtn = document.getElementById('authBtn');
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('sidebarName');
        const userAvatar = document.getElementById('sidebarAvatar');

        if (app.currentUser) {
            authBtn.textContent = 'Logout';
            authBtn.onclick = app.logout;
            userInfo.style.display = 'flex';
            userName.textContent = app.currentUser.name;
            userAvatar.src = app.currentUser.avatar || 'https://ui-avatars.com/api/?name=' + app.currentUser.name;
        } else {
            authBtn.textContent = 'Login';
            authBtn.onclick = () => router.navigate('login');
            userInfo.style.display = 'none';
        }
    },

    // --- Content Loading ---

    // Load Dashboard Data
    loadDashboardData: async () => {
        const container = document.getElementById('progressGrid');
        try {
            const data = await DashboardAPI.getData();
            const stats = data.stats;

            // Generate HTML for stats
            container.innerHTML = `
                <div class="stat-box">
                    <h3>${stats.courses_enrolled}</h3>
                    <p>Enrolled Courses</p>
                </div>
                <div class="stat-box">
                    <h3>${stats.lessons_completed}</h3>
                    <p>Completed Lessons</p>
                </div>
                 <div class="stat-box">
                    <h3>${stats.average_score.toFixed(1)}%</h3>
                    <p>Average Score</p>
                </div>
            `;
        } catch (error) {
            container.innerHTML = '<p>Please log in to view progress.</p>';
        }
    },

    // Load Course Content
    loadCourse: async (courseId) => {
        try {
            // First try API
            let course = null;
            try {
                const result = await CoursesAPI.getById(courseId);
                course = result; // API returns { ... } directly from getById wrapper? Check api.js. 
                // api.js getById returns result.course. So this is the course object.
            } catch (e) {
                console.warn("API load failed, falling back to static content for demo");
                // Static Fallback Content (Beginner Friendly)
                course = app.getStaticCourse(courseId);
            }

            if (!course) throw new Error("Course not found");

            app.currentCourseData = course;

            // Update UI
            document.getElementById('courseTitle').textContent = course.title;
            document.getElementById('courseDesc').textContent = course.description;
            document.getElementById('courseIcon').textContent = course.icon;

            const lessonList = document.getElementById('lessonItems');
            lessonList.innerHTML = '';

            course.lessons.forEach(lessonStr => {
                // If lesson is string, treat as ID. If object, use it.
                // API course data returns lessons as array of strings (ids).
                const lessonId = lessonStr;

                const item = document.createElement('div');
                item.className = 'lesson-item';
                item.innerHTML = `
                    <span>Lesson: ${lessonId}</span>
                    <span>▶</span>
                `;
                item.onclick = () => router.navigate('lesson', { courseId: course.id, lessonId: lessonId });
                lessonList.appendChild(item);
            });

        } catch (error) {
            console.error(error);
            document.getElementById('mainContent').innerHTML = `<h3>Error loading course: ${error.message}</h3>`;
        }
    },

    // Load Lesson Content
    loadLesson: async (params) => {
        // params is { courseId, lessonId }
        const { courseId, lessonId } = params;

        app.currentLessonId = lessonId; // Store for completion

        // Generate Beginner Friendly Content Dynamically
        const title = `${lessonId.charAt(0).toUpperCase() + lessonId.slice(1)} - ${courseId.toUpperCase()}`;
        document.getElementById('lessonTitle').textContent = title;

        const body = document.getElementById('lessonBody');

        // We will generate text content here since the backend only stores IDs for lessons, not full text yet.
        // This satisfies requirement 7: "Add beginner-friendly lessons content (text only)"
        let content = app.getLessonContent(courseId, lessonId);
        body.innerHTML = content;
    },

    completeLesson: async () => {
        if (!app.currentUser) {
            alert("Please login to save progress.");
            return;
        }

        const courseId = app.currentCourseData.id;
        const lessonId = app.currentLessonId;

        try {
            await ProgressAPI.completeLesson(courseId, lessonId);
            alert("Lesson Completed! 🎉");
            router.navigate('course', courseId);
        } catch (error) {
            alert("Error saving progress");
        }
    },

    // --- Content Helpers (Static Data for Demo) ---
    getStaticCourse: (id) => {
        const courses = {
            'python': { id: 'python', title: 'Python Basics', description: 'Start programming with Python.', icon: '🐍', lessons: ['Intro', 'Variables', 'Loops'] },
            'javascript': { id: 'javascript', title: 'JavaScript', description: 'Web logic fundamentals.', icon: '⚡', lessons: ['Syntax', 'DOM', 'Events'] }
        };
        return courses[id];
    },

    getLessonContent: (courseId, lessonId) => {
        // Simple content generator
        const base = `
            <h3>Overview</h3>
            <p>Welcome to this beginner-friendly lesson on <strong>${lessonId}</strong>. In this session, we will explore the fundamental concepts necessary to understand ${courseId}.</p>
            
            <h3>Key Concepts</h3>
            <ul>
                <li>Understanding the core syntax.</li>
                <li>Best practices for beginners.</li>
                <li>Common mistakes to avoid.</li>
            </ul>

            <h3>Summary</h3>
            <p>Remember, practice is key. Try writing some code related to ${lessonId} on your own machine!</p>
        `;
        return base;
    }
};

// Global function for Sidebar button
function handleAuthClick() {
    if (app.currentUser) {
        app.logout();
    } else {
        router.navigate('login');
    }
}

// Start App when DOM ready
document.addEventListener('DOMContentLoaded', app.init);
