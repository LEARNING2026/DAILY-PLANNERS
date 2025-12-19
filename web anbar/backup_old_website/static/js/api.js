/**
 * LearnHub API Client
 * Handles communication with the Flask backend or falls back to Mock Mode
 */

const API_BASE = 'http://localhost:5000/api';
let USE_MOCK = false;

// ============= Mock Data Store (LocalStorage Wrapper) =============
const MockDB = {
    getUsers: () => JSON.parse(localStorage.getItem('mock_users') || '[]'),
    saveUsers: (users) => localStorage.setItem('mock_users', JSON.stringify(users)),
    findUser: (email) => {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        return users.find(u => u.email === email);
    },
    addUser: (user) => {
        const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
        if (users.find(u => u.email === user.email)) throw new Error('Email already exists');
        users.push(user);
        localStorage.setItem('mock_users', JSON.stringify(users));
        return user;
    },
    getProgress: (userId) => {
        const key = `mock_progress_${userId}`;
        return JSON.parse(localStorage.getItem(key) || JSON.stringify({
            courses_enrolled: [],
            lessons_completed: [],
            exercises_completed: [],
            exam_scores: {},
            certificates: [],
            streak_days: 1
        }));
    },
    saveProgress: (userId, progress) => {
        localStorage.setItem(`mock_progress_${userId}`, JSON.stringify(progress));
    }
};

// ============= API Helper Functions =============

async function checkBackend() {
    try {
        await fetch(`${API_BASE}/courses`, { method: 'HEAD' });
        console.log("Backend connection established.");
        USE_MOCK = false;
        showNotification("Connected to Backend Server", "success");
    } catch (e) {
        console.warn("Backend unavailable. Switching to Demo Mode (Mock API).");
        USE_MOCK = true;
        showNotification("Backend not detected: Running in Demo Mode", "success");
    }
}

async function apiRequest(endpoint, method = 'GET', data = null) {
    // If not using mock, try real request
    if (!USE_MOCK) {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        };
        if (data) options.body = JSON.stringify(data);

        try {
            const response = await fetch(`${API_BASE}${endpoint}`, options);
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Request failed');
            return result;
        } catch (error) {
            // If connection fails (e.g. backend down/unreachable), switch to Mock Mode and retry
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                console.warn("Backend unavailable. Switching to Demo Mode (Mock API).");
                USE_MOCK = true;
                showNotification("Backend not detected: Switched to Demo Mode", "success");
                return handleMockRequest(endpoint, method, data);
            }
            throw error;
        }
    } else {
        // MOCK REQUEST HANDLER
        return handleMockRequest(endpoint, method, data);
    }
}

// ============= Mock Request Handler =============
async function handleMockRequest(endpoint, method, data) {
    console.log(`[MOCK API] ${method} ${endpoint}`, data);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    try {
        // --- Auth Mock ---
        if (endpoint === '/auth/login') {
            const user = MockDB.findUser(data.email);
            if (!user || user.password !== data.password) throw new Error('Invalid email or password');
            localStorage.setItem('currentUser', JSON.stringify(user));
            return { message: 'Login successful', user };
        }

        if (endpoint === '/auth/register') {
            const newUser = {
                id: data.email,
                name: data.name,
                email: data.email,
                password: data.password, // Insecure but fine for mock
                phone: data.phone || '',
                avatar: `https://ui-avatars.com/api/?name=${data.name}&background=2563eb&color=fff`,
                verified: false,
                created_at: new Date().toISOString()
            };
            MockDB.addUser(newUser);
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            return { message: 'Registration successful', user: newUser };
        }

        if (endpoint === '/auth/logout') {
            localStorage.removeItem('currentUser');
            return { message: 'Logged out successfully' };
        }

        if (endpoint === '/auth/me' || endpoint === '/user/profile') {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user) throw new Error('User not found');
            return { user };
        }

        // --- Progress Mock ---
        if (endpoint === '/progress') {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user) throw new Error('Auth required');
            return { progress: MockDB.getProgress(user.id) };
        }

        if (endpoint === '/progress/lesson') {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const progress = MockDB.getProgress(user.id);
            const lessonKey = `${data.course_id}:${data.lesson_id}`;

            if (!progress.lessons_completed.includes(lessonKey)) {
                progress.lessons_completed.push(lessonKey);
                if (!progress.courses_enrolled.includes(data.course_id)) {
                    progress.courses_enrolled.push(data.course_id);
                }
                MockDB.saveProgress(user.id, progress);
            }
            return { message: 'Lesson completed', lessons_completed: progress.lessons_completed.length };
        }

        // --- Dashboard Mock ---
        if (endpoint === '/dashboard') {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user) throw new Error('User not found');
            const progress = MockDB.getProgress(user.id);
            return {
                user,
                stats: {
                    courses_enrolled: progress.courses_enrolled.length,
                    lessons_completed: progress.lessons_completed.length,
                    certificates_earned: progress.certificates.length,
                    streak_days: 3, // Mock streak
                    average_score: 85 // Mock score
                }
            };
        }

        // --- Courses Mock (Shared) ---
        if (endpoint.startsWith('/courses')) {
            if (endpoint === '/courses') {
                // Use the static courses from script.js logic or duplicate here
                // For simplicity, we'll return a simple list or rely on the fact that script.js has a fallback
                return { courses: [] }; // script.js handles empty fallback
            }
        }

        throw new Error(`Mock endpoint not implemented: ${endpoint}`);

    } catch (e) {
        throw { error: e.message };
    }
}


// ============= Authentication API =============

const AuthAPI = {
    async register(name, email, password, phone = '') {
        const result = await apiRequest('/auth/register', 'POST', {
            name, email, password, phone
        });
        return result;
    },

    async login(email, password) {
        const result = await apiRequest('/auth/login', 'POST', {
            email, password
        });
        return result;
    },

    async logout() {
        await apiRequest('/auth/logout', 'POST');
    }, // fixed missing comma logic in original was handled inside apiRequest but we standardized

    async getCurrentUser() {
        try {
            const result = await apiRequest('/auth/me');
            return result.user;
        } catch {
            return null;
        }
    },

    async verifyEmail(code) {
        return await apiRequest('/auth/verify-email', 'POST', { code });
    }
};

// ============= User API =============

const UserAPI = {
    async getProfile() {
        const result = await apiRequest('/user/profile');
        return result.user;
    },

    async updateProfile(data) {
        const result = await apiRequest('/user/profile', 'PUT', data);
        if (result.user) {
            localStorage.setItem('currentUser', JSON.stringify(result.user));
        }
        return result;
    }
};

// ============= Progress API =============

const ProgressAPI = {
    async getProgress() {
        const result = await apiRequest('/progress');
        return result.progress;
    },

    async completeLesson(courseId, lessonId) {
        return await apiRequest('/progress/lesson', 'POST', {
            course_id: courseId,
            lesson_id: lessonId
        });
    },

    async completeExercise(exerciseId, score) {
        return await apiRequest('/progress/exercise', 'POST', {
            exercise_id: exerciseId,
            score
        });
    },

    async submitExam(examId, score) {
        return await apiRequest('/progress/exam', 'POST', {
            exam_id: examId,
            score
        });
    }
};

// ============= Dashboard API =============

const DashboardAPI = {
    async getData() {
        return await apiRequest('/dashboard');
    }
};

// ============= Courses API =============

const CoursesAPI = {
    async getAll() {
        const result = await apiRequest('/courses');
        return result.courses;
    },

    async getById(courseId) {
        const result = await apiRequest(`/courses/${courseId}`);
        return result.course;
    }
};

// ============= UI Helper Functions =============

function checkAuthAndUpdateUI() {
    const userStr = localStorage.getItem('currentUser');
    const authButtons = document.getElementById('authButtons'); // Note: ID in index.html is authBtn container?
    // index.html has button id="authBtn" and div id="userInfo"

    // We'll let script.js handle the main UI updates to avoid conflicts, 
    // but we can ensure global state is correct.
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        background: ${type === 'success' ? '#10b981' : '#f59e0b'};
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// ============= Initialize on Page Load =============

// Run check on load
checkBackend();

// Export for use in other scripts
window.AuthAPI = AuthAPI;
window.UserAPI = UserAPI;
window.ProgressAPI = ProgressAPI;
window.DashboardAPI = DashboardAPI;
window.CoursesAPI = CoursesAPI;
window.showNotification = showNotification;
