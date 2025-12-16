/* ============================================
   PRO MANAGER MODULE
   Handles PRO subscription status and feature access
   ============================================ */

const ProManager = {
    // Storage key for PRO status
    PRO_KEY: 'planhub_pro_status',

    /**
     * Initialize PRO system
     * Sets default PRO status if not already set
     */
    init() {
        const stored = localStorage.getItem(this.PRO_KEY);
        if (stored === null) {
            // Default: FREE user
            this.setPro(false);
        }
    },

    /**
     * Check if current user has PRO access
     * @returns {boolean} - true if PRO, false if FREE
     */
    isPro() {
        const status = localStorage.getItem(this.PRO_KEY);
        return status === 'true';
    },

    /**
     * Update PRO status
     * @param {boolean} status - true for PRO, false for FREE
     */
    setPro(status) {
        localStorage.setItem(this.PRO_KEY, status.toString());
        // Trigger UI update event
        window.dispatchEvent(new CustomEvent('pro-status-changed', {
            detail: { isPro: status }
        }));
    },

    /**
     * Toggle PRO status (for testing/development)
     */
    togglePro() {
        const current = this.isPro();
        this.setPro(!current);
        UI.showToast(
            `PRO Mode: ${!current ? 'ENABLED ✨' : 'DISABLED'}`,
            !current ? 'success' : 'info'
        );
        return !current;
    },

    /**
     * Check PRO access for a feature
     * If user is not PRO, show upgrade modal
     * @param {string} featureName - Name of the feature requiring PRO
     * @returns {boolean} - true if access granted, false if blocked
     */
    requirePro(featureName) {
        if (this.isPro()) {
            return true;
        }

        // User is not PRO - show upgrade modal
        this.showUpgradeModal(featureName);
        return false;
    },

    /**
     * Display upgrade modal with feature-specific messaging
     * @param {string} featureName - Feature that triggered the upgrade prompt
     */
    showUpgradeModal(featureName) {
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal-overlay';
        modal.innerHTML = `
            <div class="upgrade-modal">
                <div class="upgrade-modal-header">
                    <span class="upgrade-icon">🔒</span>
                    <h2>PRO Feature</h2>
                </div>
                <div class="upgrade-modal-body">
                    <p class="upgrade-feature-name">${featureName}</p>
                    <p class="upgrade-description">
                        This feature is available exclusively for PRO users.
                        Upgrade to unlock advanced capabilities and take your productivity to the next level.
                    </p>
                    <div class="upgrade-benefits">
                        <div class="benefit-item">
                            <span class="benefit-icon">✨</span>
                            <span>Access all PRO features</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">🚀</span>
                            <span>Advanced project management</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">📊</span>
                            <span>Personality assessments</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-icon">🎯</span>
                            <span>Priority support</span>
                        </div>
                    </div>
                </div>
                <div class="upgrade-modal-footer">
                    <button class="btn btn-primary upgrade-btn" onclick="ProManager.handleUpgrade()">
                        Upgrade to PRO ✨
                    </button>
                    <button class="btn close-modal-btn" onclick="ProManager.closeUpgradeModal()">
                        Maybe Later
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeUpgradeModal();
            }
        });

        // Animate in
        setTimeout(() => modal.classList.add('active'), 10);
    },

    /**
     * Close the upgrade modal
     */
    closeUpgradeModal() {
        const modal = document.querySelector('.upgrade-modal-overlay');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    },

    /**
     * Handle upgrade button click
     * In production, this would redirect to payment/subscription page
     * For now, it's a placeholder
     */
    handleUpgrade() {
        // TODO: Implement actual upgrade flow (payment, subscription, etc.)
        UI.showToast('Upgrade feature coming soon! 🚀', 'info');
        this.closeUpgradeModal();

        // For development: offer to enable PRO mode for testing
        setTimeout(() => {
            if (confirm('Enable PRO mode for testing purposes?')) {
                this.setPro(true);
                UI.showToast('PRO mode enabled! ✨', 'success');
                // Refresh current view
                if (typeof handleHash === 'function') {
                    handleHash();
                }
            }
        }, 500);
    },

    /**
     * Get PRO badge HTML
     * @returns {string} - HTML for PRO badge
     */
    getBadgeHTML() {
        return '<span class="pro-badge">PRO</span>';
    },

    /**
     * Get lock icon HTML
     * @returns {string} - HTML for lock icon
     */
    getLockIconHTML() {
        return '<span class="lock-icon">🔒</span>';
    }
};

// Export to window
window.ProManager = ProManager;
