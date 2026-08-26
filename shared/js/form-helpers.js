/**
 * Form Helpers & UI Utilities
 * Provides form validation, toast notifications, and common UI functions
 */

// ===================================
// NOTIFICATIONS / TOAST SYSTEM
// ===================================

class Notification {
    constructor(message, type = 'info', duration = 5000, position = 'top-right') {
        this.message = message;
        this.type = type; // 'success', 'error', 'warning', 'info'
        this.duration = duration;
        this.position = position;
        this.element = null;
    }

    show() {
        // Create notification element
        this.element = document.createElement('div');
        this.element.className = `notification ${this.type} ${this.position}`;
        
        // Add icon based on type
        const iconMap = {
            'success': '✓',
            'error': '✕',
            'warning': '⚠',
            'info': 'ℹ'
        };
        
        this.element.innerHTML = `
            <span style="font-size: 1.2em; font-weight: bold;">${iconMap[this.type]}</span>
            <span>${this.message}</span>
        `;
        
        document.body.appendChild(this.element);
        
        // Remove notification after duration
        if (this.duration > 0) {
            setTimeout(() => this.hide(), this.duration);
        }
        
        return this;
    }

    hide() {
        if (this.element) {
            this.element.remove();
        }
    }
}

// Global notification function
window.showNotification = (message, type = 'info', duration = 5000, position = 'top-right') => {
    return new Notification(message, type, duration, position).show();
};

// ===================================
// FORM VALIDATION
// ===================================

class FormValidator {
    constructor(formElement) {
        if (!formElement) {
            throw new Error('FormValidator: form element is required');
        }
        this.form = formElement;
        this.fields = {};
        this.isValid = true;
        this.init();
    }

    init() {
        // Get all form inputs
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (!input.name) return;
            this.fields[input.name] = input;
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('change', () => this.validateField(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        const type = field.type;
        const required = field.hasAttribute('required');
        const pattern = field.getAttribute('pattern');
        const minLength = field.getAttribute('minlength');
        const maxLength = field.getAttribute('maxlength');
        
        let error = null;

        // Check required
        if (required && !value) {
            error = `${name} è obbligatorio`;
        }
        // Check email
        else if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Email non valida';
            }
        }
        // Check phone
        else if (type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                error = 'Numero di telefono non valido';
            }
        }
        // Check pattern
        else if (pattern && value) {
            try {
                const regex = new RegExp(pattern);
                if (!regex.test(value)) {
                    error = 'Formato non valido';
                }
            } catch (e) {
                error = 'Formato non valido';
            }
        }
        // Check minlength
        else if (minLength && value.length < minLength) {
            error = `Minimo ${minLength} caratteri`;
        }
        // Check maxlength
        else if (maxLength && value.length > maxLength) {
            error = `Massimo ${maxLength} caratteri`;
        }

        this.displayError(field, error);
    }

    displayError(field, error) {
        // Remove existing error
        const existingError = field.parentElement.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        field.classList.remove('error');

        if (error) {
            field.classList.add('error');
            
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error show';
            errorElement.textContent = error;
            field.parentElement.appendChild(errorElement);
        }
    }

    validateAll() {
        this.isValid = true;
        Object.values(this.fields).forEach(field => {
            this.validateField(field);
            if (field.classList.contains('error')) {
                this.isValid = false;
            }
        });
        return this.isValid;
    }

    getFormData() {
        const formData = new FormData(this.form);
        return Object.fromEntries(formData);
    }

    reset() {
        this.form.reset();
        Object.values(this.fields).forEach(field => {
            field.classList.remove('error');
            const errorElement = field.parentElement.querySelector('.form-error');
            if (errorElement) {
                errorElement.remove();
            }
        });
    }
}

// Global form helper function
window.initFormValidator = (formSelector) => {
    const form = document.querySelector(formSelector);
    if (!form) {
        console.warn(`initFormValidator: form not found for selector "${formSelector}"`);
        return null;
    }
    return new FormValidator(form);
};

// ===================================
// LAZY LOADING IMAGES
// ===================================

class ImageLazyLoader {
    constructor() {
        this.init();
    }

    init() {
        // Use Intersection Observer for better performance
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            this.loadImagesImmediately();
        }
    }

    loadImagesImmediately() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }
}

// Initialize lazy loading on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ImageLazyLoader();
    });
} else {
    new ImageLazyLoader();
}

// ===================================
// SCROLL REVEAL ANIMATION
// ===================================

class ScrollReveal {
    constructor(selector = '.reveal-on-scroll', options = {}) {
        this.selector = selector;
        this.options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px',
            ...options
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, this.options);

        document.querySelectorAll(this.selector).forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize scroll reveal on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ScrollReveal();
    });
} else {
    new ScrollReveal();
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
window.debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for performance
window.throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Get URL parameters
window.getUrlParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

// Check if element is visible in viewport
window.isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

// Smooth scroll to element
window.smoothScrollTo = (selector, offset = 0) => {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const headerOffset = 80 + offset;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

// ===================================
// POLYFILL: HTML5 Form Validation
// ===================================

window.addEventListener('invalid', (e) => {
    e.preventDefault();
    if (e.target.matches('input, textarea, select')) {
        e.target.classList.add('error');
    }
}, true);

console.log('Form Helpers & UI Utilities loaded');
