/**
 * Dark Mode Toggle
 * Supports two strategies:
 *   - 'class'     : toggles a CSS class on <html> or <body> (default: 'dark-mode' on body)
 *   - 'attribute' : toggles data-theme="dark" / "light" on the target element
 *
 * Usage:
 *   <script src="../shared/js/dark-mode.js"
 *           data-toggle-selector="#theme-toggle"
 *           data-strategy="class"
 *           data-class-name="dark-mode"
 *           data-target="body">
 *   </script>
 *
 * The toggle button is auto-bound via data-toggle-selector (CSS selector).
 * Persists user preference in localStorage.
 */

(function () {
    'use strict';

    var STORAGE_KEY = 'cc-dark-mode';

    function getScriptData() {
        var scripts = document.querySelectorAll('script[src*="dark-mode"]');
        var script = scripts[scripts.length - 1];
        if (!script) return {};
        return {
            toggleSelector: script.getAttribute('data-toggle-selector'),
            strategy: script.getAttribute('data-strategy'),
            className: script.getAttribute('data-class-name'),
            target: script.getAttribute('data-target')
        };
    }

    function initDarkMode(config) {
        config = config || {};
        var data = getScriptData();

        var strategy = config.strategy || data.strategy || 'class';
        var className = config.className || data.className || 'dark-mode';
        var targetSel = config.target || data.target || 'body';
        var toggleSelector = config.toggleSelector || data.toggleSelector;

        var targetEl = document.querySelector(targetSel) || document.body;

        function isDark() {
            if (strategy === 'attribute') {
                return targetEl.getAttribute('data-theme') === 'dark';
            }
            return targetEl.classList.contains(className);
        }

        function setDark(dark) {
            if (strategy === 'attribute') {
                targetEl.setAttribute('data-theme', dark ? 'dark' : 'light');
            } else {
                targetEl.classList.toggle(className, dark);
            }
            localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
        }

        function toggle() {
            setDark(!isDark());
        }

        // Restore saved preference
        var saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark') {
            setDark(true);
        } else if (saved === 'light') {
            setDark(false);
        }

        // Bind toggle button(s)
        if (toggleSelector) {
            var buttons = document.querySelectorAll(toggleSelector);
            buttons.forEach(function (btn) {
                btn.addEventListener('click', toggle);
            });
        }

        window.toggleDarkMode = toggle;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initDarkMode();
        });
    } else {
        initDarkMode();
    }

    window.initDarkMode = initDarkMode;
})();
