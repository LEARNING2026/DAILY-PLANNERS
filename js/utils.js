const Utils = {
    // Format a date string to locale
    formatDate(dateStr) {
        if (!dateStr) return '';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(LanguageManager.currentLang || 'en', options);
    },

    // Capitalize first letter
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Simple ID generator
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};
window.Utils = Utils;
