/**
 * Image Lazy Loading Module
 * Standalone module for progressive image loading
 */

class LazyImageLoader {
    constructor(config = {}) {
        this.config = {
            selector: 'img[data-src]',
            loadingClass: 'loading',
            loadedClass: 'loaded',
            errorClass: 'error',
            threshold: 0.1,
            rootMargin: '50px',
            ...config
        };
        
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            this.loadAllImages();
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => this.onIntersection(entries),
            {
                threshold: this.config.threshold,
                rootMargin: this.config.rootMargin
            }
        );

        document.querySelectorAll(this.config.selector).forEach(img => {
            observer.observe(img);
        });
    }

    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');
        const sizes = img.getAttribute('data-sizes');

        if (!src) return;

        // Add loading class
        img.classList.add(this.config.loadingClass);

        // Create a temporary image to preload
        const tempImg = new Image();

        tempImg.onload = () => {
            img.src = src;
            if (srcset) img.srcset = srcset;
            if (sizes) img.sizes = sizes;
            
            img.classList.remove(this.config.loadingClass);
            img.classList.add(this.config.loadedClass);
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
        };

        tempImg.onerror = () => {
            img.classList.remove(this.config.loadingClass);
            img.classList.add(this.config.errorClass);
            img.removeAttribute('data-src');
            console.warn(`LazyImageLoader: failed to load image "${src}"`);
        };

        // Set source and trigger load
        tempImg.srcset = srcset || '';
        tempImg.sizes = sizes || '';
        tempImg.src = src;
    }

    loadAllImages() {
        document.querySelectorAll(this.config.selector).forEach(img => {
            this.loadImage(img);
        });
    }

    // Manually trigger load for a specific image
    loadImageByElement(element) {
        if (element.hasAttribute('data-src')) {
            this.loadImage(element);
        }
    }

    // Manually trigger load for selector
    loadImagesBySelector(selector) {
        document.querySelectorAll(selector).forEach(img => {
            if (img.hasAttribute('data-src')) {
                this.loadImage(img);
            }
        });
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.lazyImageLoader = new LazyImageLoader();
    });
} else {
    window.lazyImageLoader = new LazyImageLoader();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyImageLoader;
}
