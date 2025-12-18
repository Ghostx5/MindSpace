// POLYFILL for classList operations (simplified version)
if (!Element.prototype.classList && Object.defineProperty) {
    Element.prototype.classList = {
        add: function(className) {
            if (this.className.indexOf(className) === -1) {
                this.className += ' ' + className;
            }
        },
        remove: function(className) {
            this.className = this.className.replace(
                new RegExp('(^|\\s)' + className + '(\\s|$)', 'g'), 
                ' '
            ).trim();
        },
        contains: function(className) {
            return new RegExp('(^|\\s)' + className + '(\\s|$)').test(this.className);
        }
    };
}

// Get elements - use compatible methods
const wrappers = document.querySelectorAll('.disorder-wrapper');
const dots = document.querySelectorAll('.dot');
const upArrow = document.getElementById('up-arrow');
const downArrow = document.getElementById('down-arrow');

// Find current index - compatible method (no findIndex)
let currentIndex = -1;
for (let i = 0; i < wrappers.length; i++) {
    if (wrappers[i].classList.contains('active')) {
        currentIndex = i;
        break;
    }
}

// Helper function to show a box with smooth animation
function showBox(index) {
    if (index < 0 || index >= wrappers.length || index === currentIndex) return;

    const currentBox = wrappers[currentIndex];
    const nextBox = wrappers[index];

    // Animate current box out
    currentBox.style.opacity = 0;
    currentBox.style.transform = 'translateY(20px)';
    currentBox.style.webkitTransform = 'translateY(20px)'; // FIX: Safari prefix
    setTimeout(function() {
        currentBox.style.display = 'none';
        currentBox.classList.remove('active');
    }, 600);

    // Animate next box in
    nextBox.style.display = 'block';
    setTimeout(function() {
        nextBox.style.opacity = 1;
        nextBox.style.transform = 'translateY(0)';
        nextBox.style.webkitTransform = 'translateY(0)'; // FIX: Safari prefix
        nextBox.classList.add('active');
    }, 600);

    // Update dots
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
    if (dots[index]) dots[index].classList.add('active');

    currentIndex = index;
}

// Arrow clicks - use traditional function syntax for compatibility
if (upArrow) {
    upArrow.addEventListener('click', function() {
        var prevIndex = currentIndex - 1;
        if (prevIndex < 0) prevIndex = wrappers.length - 1;
        showBox(prevIndex);
    });
}

if (downArrow) {
    downArrow.addEventListener('click', function() {
        var nextIndex = currentIndex + 1;
        if (nextIndex >= wrappers.length) nextIndex = 0;
        showBox(nextIndex);
    });
}

// Dot clicks - use compatible loop (no forEach on NodeList in old IE)
for (var i = 0; i < dots.length; i++) {
    (function(index) {
        dots[index].addEventListener('click', function() {
            showBox(index);
        });
    })(i);
}

// Add this to your main.js or create a new file
document.addEventListener('DOMContentLoaded', function() {
    // Force image loading
    var images = document.querySelectorAll('img');
    images.forEach(function(img) {
        if (img.complete) return;
        img.loading = 'eager';
        // Force reload if broken
        if (!img.naturalWidth && img.src) {
            var src = img.src;
            img.src = '';
            img.src = src;
        }
    });
});