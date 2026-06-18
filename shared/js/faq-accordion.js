/**
 * FAQ Accordion
 * Toggles FAQ answers open/closed. Supports both custom button-based
 * accordions and native <details>/<summary> elements.
 *
 * Usage:
 *   <script src="../shared/js/faq-accordion.js"
 *           data-trigger-selector=".faq-trigger"
 *           data-content-selector=".faq-content"
 *           data-single-open="true">
 *   </script>
 *
 * For custom elements:
 *   <button class="faq-trigger">Question <span>+</span></button>
 *   <div class="faq-content"><p>Answer</p></div>
 *
 * For native <details>:
 *   The script auto-enhances <details> elements with single-open behavior
 *   when data-single-open="true".
 */

(function () {
    'use strict';

    function getScriptData() {
        var scripts = document.querySelectorAll('script[src*="faq-accordion"]');
        var script = scripts[scripts.length - 1];
        if (!script) return {};
        return {
            triggerSelector: script.getAttribute('data-trigger-selector'),
            contentSelector: script.getAttribute('data-content-selector'),
            singleOpen: script.getAttribute('data-single-open')
        };
    }

    function initFaqAccordion(config) {
        config = config || {};
        var data = getScriptData();

        var triggerSelector = config.triggerSelector || data.triggerSelector || '.faq-trigger';
        var contentSelector = config.contentSelector || data.contentSelector || '.faq-content';
        var singleOpen = (config.singleOpen || data.singleOpen || 'true') === 'true';

        var triggers = document.querySelectorAll(triggerSelector);

        if (triggers.length) {
            triggers.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var content = btn.nextElementSibling;
                    if (!content) return;

                    var isOpen = content.style.maxHeight;

                    if (singleOpen) {
                        document.querySelectorAll(contentSelector).forEach(function (c) {
                            c.style.maxHeight = null;
                        });
                        document.querySelectorAll(triggerSelector + ' span').forEach(function (s) {
                            s.textContent = '+';
                        });
                    }

                    if (!isOpen) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        var icon = btn.querySelector('span');
                        if (icon) icon.textContent = '-';
                    }
                });
            });
        }

        // Enhance native <details> with single-open behavior
        if (singleOpen) {
            var detailsElements = document.querySelectorAll('details');
            detailsElements.forEach(function (detail) {
                detail.addEventListener('toggle', function () {
                    if (detail.open) {
                        detailsElements.forEach(function (other) {
                            if (other !== detail && other.open) {
                                other.removeAttribute('open');
                            }
                        });
                    }
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initFaqAccordion();
        });
    } else {
        initFaqAccordion();
    }

    window.initFaqAccordion = initFaqAccordion;
    window.toggleFaq = function (btn) {
        var content = btn.nextElementSibling;
        if (!content) return;
        var isOpen = content.style.maxHeight;
        document.querySelectorAll('.faq-content').forEach(function (c) {
            c.style.maxHeight = null;
        });
        document.querySelectorAll('.faq-trigger span').forEach(function (s) {
            s.textContent = '+';
        });
        if (!isOpen) {
            content.style.maxHeight = content.scrollHeight + 'px';
            var icon = btn.querySelector('span');
            if (icon) icon.textContent = '-';
        }
    };
})();
