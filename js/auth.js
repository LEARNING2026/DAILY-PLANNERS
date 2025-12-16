const Auth = {
    register(name, email, password) {
        const users = Store.getUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, message: LanguageManager.get('emailExists') };
        }

        // Basic user object
        const newUser = {
            id: Date.now(),
            name,
            email,
            password, // In real app, hash this!
            joined: new Date().toISOString(),
            progress: {}
        };

        users.push(newUser);
        Store.saveUsers(users); // Helper needed in Store

        return { success: true, message: LanguageManager.get('regSuccess') };
    },

    login(email, password) {
        const users = Store.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            Store.setCurrentUser(user);
            return { success: true, user };
        }
        return { success: false, message: LanguageManager.get('invalidCreds') };
    },

    logout() {
        Store.clearSession();
    },

    getCurrentUser() {
        return Store.getCurrentUser();
    },

    isAuthenticated() {
        return !!Store.getCurrentUser();
    }
};
