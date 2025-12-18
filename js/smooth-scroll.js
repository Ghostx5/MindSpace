/* FIX: Smooth scroll polyfill for browsers without scrollBehavior support */
if (!('scrollBehavior' in document.documentElement.style)) {
    // Store original scrollTo function
    var originalScrollTo = window.scrollTo;
    
    // Override window.scrollTo to handle smooth behavior
    window.scrollTo = function() {
        // Check if options object with behavior: 'smooth' is passed
        if (arguments[0] && typeof arguments[0] === 'object' && arguments[0].behavior === 'smooth') {
            var options = arguments[0];
            var start = window.pageYOffset;
            var change = options.top - start;
            var increment = 20;
            var currentTime = 0;
            var duration = 300;
            
            // Easing function
            function easeInOutQuad(t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            }
            
            function animateScroll() {
                currentTime += increment;
                var val = easeInOutQuad(currentTime, start, change, duration);
                originalScrollTo.call(window, 0, val);
                if (currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            }
            animateScroll();
            return;
        }
        // Call original for non-smooth scrolling
        originalScrollTo.apply(window, arguments);
    };
}

document.addEventListener('DOMContentLoaded', function() { // FIX: Traditional function

  const option3Link = document.querySelector('#your-option3-link');
  if (option3Link) {
    option3Link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('option3');
      if (target) {
        // FIX: Use feature detection for smooth scrolling
        if ('scrollBehavior' in document.documentElement.style) {
            target.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback for older browsers
            var headerHeight = document.querySelector('.navbar') ? 
                              document.querySelector('.navbar').offsetHeight : 0;
            var targetY = target.getBoundingClientRect().top + 
                         window.pageYOffset - headerHeight - 12;
            window.scrollTo({ top: targetY, left: 0 });
        }
      }
    });
  }

  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < anchorLinks.length; i++) { // FIX: Use for loop
    anchorLinks[i].addEventListener('click', function(e) {
      var id = this.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();

      var headerHeight = document.querySelector('.navbar') ? 
                        document.querySelector('.navbar').offsetHeight : 0;

      var targetY = el.getBoundingClientRect().top +
                   window.pageYOffset -
                   headerHeight -
                   12;

      // FIX: Use our polyfilled scrollTo for smooth scrolling
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    });
  }

});