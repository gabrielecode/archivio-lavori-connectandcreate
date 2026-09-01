/**
 * Cookie Consent Banner
 * Shows a cookie banner if the user has not yet accepted cookies.
 *
 * Usage:
 *   <script src="../shared/js/cookie-banner.js"
 *           data-banner-selector="#cookie-banner"
 *           data-active-class="active"
 *           data-delay="1000">
 *   </script>
 *
 * The banner element should exist in the HTML; this script controls its visibility.
 */

(function () {
    'use strict';

    var STORAGE_KEY = 'cc-cookies-accepted';

    function getScriptData() {
        var scripts = document.querySelectorAll('script[src*="cookie-banner"]');
        var script = scripts[scripts.length - 1];
        if (!script) return {};
        return {
            bannerSelector: script.getAttribute('data-banner-selector'),
            activeClass: script.getAttribute('data-active-class'),
            delay: script.getAttribute('data-delay')
        };
    }

    function initCookieBanner(config) {
        config = config || {};
        var data = getScriptData();

        var bannerSelector = config.bannerSelector || data.bannerSelector || '#cookie-banner';
        var activeClass = config.activeClass || data.activeClass || 'active';
        var delay = parseInt(config.delay || data.delay, 10) || 1000;

        var banner = document.querySelector(bannerSelector);
        if (!banner) return;

        if (localStorage.getItem(STORAGE_KEY)) return;

        setTimeout(function () {
            banner.classList.add(activeClass);
        }, delay);
    }

    function acceptCookies(bannerSelector, activeClass) {
        bannerSelector = bannerSelector || '#cookie-banner';
        activeClass = activeClass || 'active';
        localStorage.setItem(STORAGE_KEY, 'true');
        var banner = document.querySelector(bannerSelector);
        if (banner) banner.classList.remove(activeClass);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initCookieBanner();
        });
    } else {
        initCookieBanner();
    }

    window.initCookieBanner = initCookieBanner;
    window.acceptCookies = acceptCookies;
})();
