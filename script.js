// Interactive functionality for Hello World UK static page
document.addEventListener('DOMContentLoaded', function() {
    
    // Animation configurations
    const animationConfig = {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    };

    // Initialize all interactive features
    initializeAnimations();
    initializeTimeDisplay();
    initializeThemeToggle();
    initializeAccessibility();
    initializeInteractiveElements();

    /**
     * Initialize entrance animations for page elements
     */
    function initializeAnimations() {
        const elements = document.querySelectorAll('.animate-in');
        
        // Create intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });

        // Stagger animation for main content
        const mainElements = ['.hero-title', '.hero-subtitle', '.welcome-message', '.features'];
        mainElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.classList.add('fade-in');
                }, index * 200);
            }
        });
    }

    /**
     * Initialize real-time clock display
     */
    function initializeTimeDisplay() {
        const timeElement = document.getElementById('current-time');
        if (!timeElement) return;

        function updateTime() {
            try {
                const now = new Date();
                const options = {
                    timeZone: 'Europe/London',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                };
                
                const timeString = now.toLocaleTimeString('en-GB', options);
                const dateString = now.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                timeElement.innerHTML = `
                    <div class="time-display">
                        <span class="time">${timeString}</span>
                        <span class="date">${dateString}</span>
                    </div>
                `;
            } catch (error) {
                console.warn('Time display error:', error);
                timeElement.textContent = 'Time unavailable';
            }
        }

        updateTime();
        setInterval(updateTime, 1000);
    }

    /**
     * Initialize theme toggle functionality
     */
    function initializeThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeToggleIcon(savedTheme);

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Add transition class for smooth theme change
            document.body.classList.add('theme-transition');
            
            setTimeout(() => {
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeToggleIcon(newTheme);
                
                // Remove transition class after animation
                setTimeout(() => {
                    document.body.classList.remove('theme-transition');
                }, 300);
            }, 50);
        });
    }

    /**
     * Update theme toggle button icon
     */
    function updateThemeToggleIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const icon = theme === 'dark' ? '☀️' : '🌙';
        const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        
        themeToggle.innerHTML = icon;
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('title', label);
    }

    /**
     * Initialize accessibility features
     */
    function initializeAccessibility() {
        // Keyboard navigation for interactive elements
        const interactiveElements = document.querySelectorAll('.card, .feature-item, button');
        
        interactiveElements.forEach(element => {
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });

        // Focus management
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        }
    }

    /**
     * Initialize interactive elements and effects
     */
    function initializeInteractiveElements() {
        // Card hover effects
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Feature items interaction
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // Add ripple effect
                createRippleEffect(this, event);
                
                // Highlight selected item
                featureItems.forEach(fi => fi.classList.remove('active'));
                this.classList.add('active');
                
                // Show related content or perform action
                showFeatureDetails(index);
            });
        });

        // Initialize counter animation
        initializeCounters();
    }

    /**
     * Create ripple effect on click
     */
    function createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        ripple.classList.add('ripple');
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Show feature details
     */
    function showFeatureDetails(index) {
        const features = [
            { title: 'Modern Design', description: 'Clean and contemporary UK-focused design' },
            { title: 'Responsive Layout', description: 'Perfect display on all devices' },
            { title: 'Fast Loading', description: 'Optimized for quick page loads' },
            { title: 'Accessible', description: 'Built with accessibility in mind' }
        ];

        const feature = features[index];
        if (feature) {
            showNotification(`${feature.title}: ${feature.description}`);
        }
    }

    /**
     * Initialize number counters
     */
    function initializeCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            // Start counter when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(counter);
        });
    }

    /**
     * Show notification message
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        `;

        document.body.appendChild(notification);

        // Position notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-color);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            display: flex;
            align-items: center;
            gap: 1rem;
        `;

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    /**
     * Handle page visibility changes
     */
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // Page became visible - resume animations
            document.body.classList.add('page-visible');
        } else {
            // Page hidden - pause heavy operations
            document.body.classList.remove('page-visible');
        }
    });

    /**
     * Handle errors gracefully
     */
    window.addEventListener('error', function(e) {
        console.error('Script error:', e.error);
        // Could show user-friendly error message here
    });

    // Add CSS for dynamic styles
    const dynamicStyles = `
        .ripple {
            animation: ripple 0.6s ease-out;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .fade-in {
            opacity: 1;
            transform: translateY(0);
            transition: all ${animationConfig.duration}ms ${animationConfig.easing};
        }
        
        .theme-transition * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
        }
        
        .keyboard-navigation *:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
        }
        
        .animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;

    // Inject dynamic styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);

    // Initialize complete - show welcome message
    setTimeout(() => {
        showNotification('Welcome to Hello World UK! 🇬🇧', 'success');
    }, 1000);
});