/**
 * Mobile Menu Toggle
 * Handles burger button + sliding mobile menu overlay.
 *
 * Usage:
 *   <script src="../shared/js/mobile-menu.js"
 *           data-burger-selector=".burger-btn"
 *           data-menu-selector="#mobileMenu"
 *           data-active-class="active">
 *   </script>
 *
 * The menu is toggled by clicking the burger button.
 * Clicking any <a> inside the menu auto-closes it.
 * Body overflow is locked while the menu is open.
 */

(function () {
    'use strict';

    function getScriptData() {
        var scripts = document.querySelectorAll('script[src*="mobile-menu"]');
        var script = scripts[scripts.length - 1];
        if (!script) return {};
        return {
            burgerSelector: script.getAttribute('data-burger-selector'),
            menuSelector: script.getAttribute('data-menu-selector'),
            activeClass: script.getAttribute('data-active-class')
        };
    }

    function initMobileMenu(config) {
        config = config || {};
        var data = getScriptData();

        var burgerSelector = config.burgerSelector || data.burgerSelector || '.burger-btn, .burger, [data-mobile-toggle]';
        var menuSelector = config.menuSelector || data.menuSelector || '.mobile-menu, .mobile-nav, #mobileMenu, #mobileNav';
        var activeClass = config.activeClass || data.activeClass || 'active';

        var burger = document.querySelector(burgerSelector);
        var menu = document.querySelector(menuSelector);
        if (!burger || !menu) return;

        function isOpen() {
            return menu.classList.contains(activeClass);
        }

        function toggle() {
            burger.classList.toggle(activeClass);
            menu.classList.toggle(activeClass);
            document.body.style.overflow = isOpen() ? 'hidden' : '';
        }

        function close() {
            burger.classList.remove(activeClass);
            menu.classList.remove(activeClass);
            document.body.style.overflow = '';
        }

        burger.addEventListener('click', toggle);

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', close);
        });

        window.toggleMobileMenu = toggle;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initMobileMenu();
        });
    } else {
        initMobileMenu();
    }

    window.initMobileMenu = initMobileMenu;
})();
