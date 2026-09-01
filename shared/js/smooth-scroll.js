/**
 * Smooth Scroll for Anchor Links
 * Adds smooth scrolling behavior to all internal anchor links (href="#...").
 *
 * Usage:
 *   <script src="../shared/js/smooth-scroll.js"
 *           data-offset="80">
 *   </script>
 *
 * Options:
 *   offset – pixels to offset from the top (default 80, accounts for fixed navbars)
 */

(function () {
    'use strict';

    function getScriptData() {
        var scripts = document.querySelectorAll('script[src*="smooth-scroll"]');
        var script = scripts[scripts.length - 1];
        if (!script) return {};
        return {
            offset: script.getAttribute('data-offset')
        };
    }

    function initSmoothScroll(config) {
        config = config || {};
        var data = getScriptData();
        var offset = parseInt(config.offset || data.offset, 10) || 80;

        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var href = anchor.getAttribute('href');
                if (!href || href === '#') return;

                var target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initSmoothScroll();
        });
    } else {
        initSmoothScroll();
    }

    window.initSmoothScroll = initSmoothScroll;
})();
