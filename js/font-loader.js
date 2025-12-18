// font-loader.js - Force Safari to show text immediately
(function() {
    'use strict';
    
    // Safari detection
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari) {
        // 1. IMMEDIATELY make everything visible
        document.documentElement.style.opacity = '1';
        document.documentElement.style.visibility = 'visible';
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';
        
        // 2. Force all text elements to use system fonts first
        var style = document.createElement('style');
        style.textContent = `
            * {
                opacity: 1 !important;
                visibility: visible !important;
            }
            body, p, h1, h2, h3, h4, h5, h6, span, div, a, li, button, input {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                           Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            }
        `;
        document.head.appendChild(style);
        
        // 3. Load fonts asynchronously
        setTimeout(function() {
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(function() {
                    // Switch to custom fonts once loaded
                    var fontStyle = document.createElement('style');
                    fontStyle.textContent = `
                        body, p, h1, h2, h3, h4, h5, h6, span, div, a, li, button, input {
                            font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 
                                       'Segoe UI', Roboto, sans-serif !important;
                        }
                        .navbar *, .login-btn-wrapper, .schedule-button, 
                        .info p, .info a, .textbox, .login-btn {
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
                                       'Segoe UI', Roboto, sans-serif !important;
                        }
                    `;
                    document.head.appendChild(fontStyle);
                });
            }
        }, 0);
        
        // 4. Force a re-render (this is what your debug command did)
        setTimeout(function() {
            var body = document.body;
            var display = body.style.display;
            body.style.display = 'none';
            body.offsetHeight; // Trigger reflow
            body.style.display = display;
        }, 100);
    }
})();