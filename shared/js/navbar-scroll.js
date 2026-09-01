/**
 * Navbar Scroll Effect
 * Adds/removes a class on the navbar when the user scrolls past a threshold.
 *
 * Usage:
 *   <script src="../shared/js/navbar-scroll.js"
 *           data-navbar-selector="header, nav, #navbar"
 *           data-scroll-class="scrolled"
 *           data-threshold="50">
 *   </script>
 *
 * Supports shrinking padding, adding background, and box-shadow on scroll.
 */

(function () {
    'use strict';

    function getScriptData() {
        var scripts = document.querySelectorAll('script[src*="navbar-scroll"]');
        var script = scripts[scripts.length - 1];
        if (!script) return {};
        return {
            navbarSelector: script.getAttribute('data-navbar-selector'),
            scrollClass: script.getAttribute('data-scroll-class'),
            threshold: script.getAttribute('data-threshold')
        };
    }

    function initNavbarScroll(config) {
        config = config || {};
        var data = getScriptData();

        var navbarSelector = config.navbarSelector || data.navbarSelector || 'header, nav, #navbar, .main-header, .nav-container';
        var scrollClass = config.scrollClass || data.scrollClass || 'scrolled';
        var threshold = parseInt(config.threshold || data.threshold, 10) || 50;

        var navbar = document.querySelector(navbarSelector);
        if (!navbar) return;

        function onScroll() {
            if (window.scrollY > threshold) {
                navbar.classList.add(scrollClass);
            } else {
                navbar.classList.remove(scrollClass);
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initNavbarScroll();
        });
    } else {
        initNavbarScroll();
    }

    window.initNavbarScroll = initNavbarScroll;
})();
