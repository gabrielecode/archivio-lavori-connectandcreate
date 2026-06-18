/**
 * WhatsApp Floating Widget
 * Creates a fixed-position WhatsApp chat button.
 *
 * Usage:
 *   <script src="../shared/js/whatsapp-widget.js"
 *           data-phone="41790000000"
 *           data-position="left"
 *           data-message="Ciao! Vorrei informazioni.">
 *   </script>
 *
 * Options (via data-* on the script tag or config object):
 *   phone     – WhatsApp number (required)
 *   position  – 'left' (default) or 'right'
 *   size      – pixel size of the button (default 56)
 *   message   – pre-filled message (optional)
 */

(function () {
    'use strict';

    var WHATSAPP_SVG =
        '<svg viewBox="0 0 24 24" fill="white">' +
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099' +
        '-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223' +
        '-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761' +
        '-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446' +
        '-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075' +
        '-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008' +
        '-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016' +
        '-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 ' +
        '5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871' +
        '.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413' +
        '-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 ' +
        '01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 ' +
        '9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 ' +
        '5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45' +
        '-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 ' +
        '0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L' +
        '.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 ' +
        '0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
        '</svg>';

    function getScriptData() {
        var scripts = document.querySelectorAll('script[src*="whatsapp-widget"]');
        var script = scripts[scripts.length - 1];
        if (!script) return {};
        return {
            phone: script.getAttribute('data-phone'),
            position: script.getAttribute('data-position'),
            size: script.getAttribute('data-size'),
            message: script.getAttribute('data-message')
        };
    }

    function initWhatsAppWidget(config) {
        config = config || {};
        var data = getScriptData();

        var phone = config.phone || data.phone;
        if (!phone) return;

        var position = config.position || data.position || 'left';
        var size = parseInt(config.size || data.size, 10) || 56;
        var message = config.message || data.message || '';

        var href = 'https://wa.me/' + phone;
        if (message) href += '?text=' + encodeURIComponent(message);

        var iconSize = Math.round(size * 0.5);

        var link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.setAttribute('aria-label', 'Contattaci su WhatsApp');
        link.className = 'cc-whatsapp-widget';

        link.style.cssText =
            'position:fixed;bottom:25px;z-index:1500;' +
            'width:' + size + 'px;height:' + size + 'px;' +
            'background:#25D366;border-radius:50%;' +
            'display:flex;align-items:center;justify-content:center;' +
            'box-shadow:0 4px 15px rgba(0,0,0,0.15);' +
            'transition:transform 0.3s ease;text-decoration:none;' +
            (position === 'right' ? 'right:25px;' : 'left:25px;');

        link.innerHTML =
            '<span style="width:' + iconSize + 'px;height:' + iconSize +
            'px;display:flex;align-items:center;justify-content:center">' +
            WHATSAPP_SVG + '</span>';

        link.addEventListener('mouseenter', function () {
            link.style.transform = 'scale(1.1)';
        });
        link.addEventListener('mouseleave', function () {
            link.style.transform = 'scale(1)';
        });

        document.body.appendChild(link);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initWhatsAppWidget();
        });
    } else {
        initWhatsAppWidget();
    }

    window.initWhatsAppWidget = initWhatsAppWidget;
})();
