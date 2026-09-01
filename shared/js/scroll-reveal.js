/**
 * Scroll Reveal Animations
 * Uses IntersectionObserver to animate elements when they enter the viewport.
 *
 * Usage:
 *   <script src="../shared/js/scroll-reveal.js"
 *           data-selector=".service-card, .testimonial-card, .reveal-on-scroll"
 *           data-threshold="0.1"
 *           data-stagger="100">
 *   </script>
 *
 * Elements matching the selector fade in and slide up when scrolled into view.
 * Set data-stagger="0" to disable staggered delays.
 */

(function () {
    'use strict';

    function getScriptData() {
        var scripts = document.querySelectorAll('script[src*="scroll-reveal"]');
        var script = scripts[scripts.length - 1];
        if (!script) return {};
        return {
            selector: script.getAttribute('data-selector'),
            threshold: script.getAttribute('data-threshold'),
            stagger: script.getAttribute('data-stagger'),
            rootMargin: script.getAttribute('data-root-margin')
        };
    }

    function initScrollReveal(config) {
        config = config || {};
        var data = getScriptData();

        var selector = config.selector || data.selector || '.reveal-on-scroll, .service-card, .testimonial-card, .glass-panel, .test-card, .review-card';
        var threshold = parseFloat(config.threshold || data.threshold) || 0.1;
        var stagger = parseInt(config.stagger || data.stagger, 10);
        if (isNaN(stagger)) stagger = 100;
        var rootMargin = config.rootMargin || data.rootMargin || '0px 0px -50px 0px';

        var elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        elements.forEach(function (el, i) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition =
                'opacity 0.8s ease-out ' + (stagger * i) + 'ms, ' +
                'transform 0.8s ease-out ' + (stagger * i) + 'ms';
        });

        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: threshold, rootMargin: rootMargin });

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initScrollReveal();
        });
    } else {
        initScrollReveal();
    }

    window.initScrollReveal = initScrollReveal;
})();
