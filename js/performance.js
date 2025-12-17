/* ============================================
   LAZY LOADING & PERFORMANCE UTILITIES
   Optimizes image loading and performance
   ============================================ */

/**
 * Lazy Loading Observer
 * Loads images only when they enter the viewport
 */
(function initLazyLoading() {
    'use strict';

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {

        // Create observer for lazy loading images
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Load the actual image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');

                        // Remove data-src after loading
                        img.removeAttribute('data-src');

                        // Stop observing this image
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            // Load images 50px before they enter viewport
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));

        // Watch for dynamically added images
        const mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IMG' && node.dataset.src) {
                        imageObserver.observe(node);
                    }
                    if (node.querySelectorAll) {
                        const newLazyImages = node.querySelectorAll('img[data-src]');
                        newLazyImages.forEach(img => imageObserver.observe(img));
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

    } else {
        // Fallback for browsers without IntersectionObserver
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
})();

/**
 * Network-Aware Loading
 * Adjusts behavior based on connection speed
 */
(function initNetworkAwareLoading() {
    'use strict';

    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        function updateConnectionStatus() {
            const effectiveType = connection.effectiveType;

            // Slow connection (2G, slow-2g)
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                document.body.classList.add('slow-connection');
                console.log('⚠️ Slow connection detected - Reducing animations');
            } else {
                document.body.classList.remove('slow-connection');
            }

            // Save data mode
            if (connection.saveData) {
                document.body.classList.add('save-data');
                console.log('💾 Save-Data mode enabled');
            }
        }

        // Check on load
        updateConnectionStatus();

        // Monitor connection changes
        connection.addEventListener('change', updateConnectionStatus);
    }
})();

/**
 * Passive Event Listeners
 * Improves scroll performance
 */
(function optimizeEventListeners() {
    'use strict';

    // Check if passive is supported
    let passiveSupported = false;
    try {
        const options = {
            get passive() {
                passiveSupported = true;
                return false;
            }
        };
        window.addEventListener('test', null, options);
        window.removeEventListener('test', null, options);
    } catch (err) {
        passiveSupported = false;
    }

    // Store passive option
    window.passiveEventOption = passiveSupported ? { passive: true } : false;

    console.log(`✅ Passive event listeners: ${passiveSupported ? 'Supported' : 'Not supported'}`);
})();

/**
 * Debounce Function
 * Limits function execution rate for performance
 */
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle Function
 * Ensures function runs at most once per interval
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Request Animation Frame Throttle
 * Syncs with browser's repaint for smooth animations
 */
function rafThrottle(func) {
    let rafId = null;
    return function throttled(...args) {
        if (rafId === null) {
            rafId = requestAnimationFrame(() => {
                func.apply(this, args);
                rafId = null;
            });
        }
    };
}

/**
 * Optimize Scroll Performance
 * Uses passive listeners and throttling
 */
(function optimizeScrolling() {
    'use strict';

    const scrollContainers = document.querySelectorAll('.main-content, .sidebar');

    scrollContainers.forEach(container => {
        // Use passive listener for better performance
        container.addEventListener('scroll', throttle(() => {
            // Scroll handling logic here
            // This is throttled to run max once per 100ms
        }, 100), window.passiveEventOption);
    });
})();

/**
 * Preload Critical Resources
 * Loads important resources early
 */
(function preloadCriticalResources() {
    'use strict';

    // Preload critical fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.as = 'font';
    fontPreload.type = 'font/woff2';
    fontPreload.crossOrigin = 'anonymous';
    fontPreload.href = 'https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4W61O4a0Ew.woff2';
    document.head.appendChild(fontPreload);
})();

/**
 * Memory Management
 * Cleans up unused resources
 */
(function manageMemory() {
    'use strict';

    // Clear old caches periodically
    if ('caches' in window) {
        setInterval(() => {
            caches.keys().then(names => {
                names.forEach(name => {
                    if (!name.includes('planhub-v2')) {
                        caches.delete(name);
                        console.log('🗑️ Deleted old cache:', name);
                    }
                });
            });
        }, 3600000); // Every hour
    }
})();

/**
 * Detect and Handle Low Battery
 * Reduces performance-heavy features on low battery
 */
(function handleBatteryStatus() {
    'use strict';

    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            function updateBatteryStatus() {
                if (battery.level < 0.2 && !battery.charging) {
                    document.body.classList.add('low-battery');
                    console.log('🔋 Low battery mode activated');
                } else {
                    document.body.classList.remove('low-battery');
                }
            }

            updateBatteryStatus();
            battery.addEventListener('levelchange', updateBatteryStatus);
            battery.addEventListener('chargingchange', updateBatteryStatus);
        });
    }
})();

/**
 * Optimize for Reduced Motion
 * Respects user's motion preferences
 */
(function respectMotionPreferences() {
    'use strict';

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleMotionPreference(e) {
        if (e.matches) {
            document.body.classList.add('reduce-motion');
            console.log('♿ Reduced motion enabled');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }

    handleMotionPreference(mediaQuery);
    mediaQuery.addEventListener('change', handleMotionPreference);
})();

/**
 * Image Loading Optimization
 * Converts images to WebP if supported
 */
(function optimizeImageFormats() {
    'use strict';

    // Check WebP support
    const webpSupported = document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;

    if (webpSupported) {
        document.documentElement.classList.add('webp-supported');
    }

    console.log(`🖼️ WebP support: ${webpSupported ? 'Yes' : 'No'}`);
})();

/**
 * Performance Observer
 * Monitors and logs performance metrics
 */
(function monitorPerformance() {
    'use strict';

    if ('PerformanceObserver' in window) {
        // Monitor long tasks (>50ms)
        try {
            const longTaskObserver = new PerformanceObserver(list => {
                list.getEntries().forEach(entry => {
                    if (entry.duration > 50) {
                        console.warn('⚠️ Long task detected:', entry.duration.toFixed(2) + 'ms');
                    }
                });
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // Long task API not supported
        }

        // Monitor layout shifts
        try {
            const layoutShiftObserver = new PerformanceObserver(list => {
                list.getEntries().forEach(entry => {
                    if (entry.value > 0.1) {
                        console.warn('⚠️ Layout shift detected:', entry.value.toFixed(4));
                    }
                });
            });
            layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            // Layout shift API not supported
        }
    }
})();

// Export utilities for global use
window.performanceUtils = {
    debounce,
    throttle,
    rafThrottle
};

console.log('✅ Performance utilities loaded');
