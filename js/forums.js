/* FIX: Add polyfill for Element.closest() for older browsers */
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.msMatchesSelector || 
        Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

function autoResize(el) {
    const MAX_HEIGHT = 500; // px
    el.style.height = 'auto';
    if (el.scrollHeight > MAX_HEIGHT) {
        el.style.height = MAX_HEIGHT + 'px';
        el.style.overflowY = 'auto';
    } else {
        el.style.height = el.scrollHeight + 'px';
        el.style.overflowY = 'hidden';
    }
}

// Initialize existing textareas
var textareas = document.querySelectorAll('.forums-textbox');
for (var i = 0; i < textareas.length; i++) { // FIX: Use for loop instead of forEach
    textareas[i].addEventListener('input', function() {
        autoResize(this);
    });
    autoResize(textareas[i]);
}

// --- Toggle comment input box ---
function toggleCommentInput(postWrapper) {
    const commentInput = postWrapper.querySelector('.comment-input');
    if (commentInput) {
        commentInput.classList.toggle('hidden');
        const textarea = commentInput.querySelector('textarea');
        if (textarea) textarea.focus();
    }
}

// Delegate comment button clicks
document.addEventListener('click', function(e) { // FIX: Traditional function
    var target = e.target;
    var actionBtn = target.closest('.action-btn');
    if (actionBtn && actionBtn.querySelector('img[src*="comment"]')) {
        const postWrapper = actionBtn.closest('.forums-post-wrapper');
        if (postWrapper) toggleCommentInput(postWrapper);
    }
});

// --- Submit comment ---
document.addEventListener('click', function(e) { // FIX: Traditional function
    if (e.target.classList.contains('submit-comment')) {
        const btn = e.target;
        const inputBox = btn.previousElementSibling.querySelector('textarea');
        const text = inputBox.value.trim();
        if (!text) return;

        const postWrapper = btn.closest('.forums-post-wrapper');
        const commentsContainer = postWrapper.querySelector('.forums-comments');

        const comment = document.createElement('div');
        comment.className = 'comment';
        comment.innerHTML = `
            <div class="forums-post-userinfo">
                <img class="forums-post-pfp" src="path/to/profile.jpg" alt="Profile Picture">
                <div class="forums-post-details">
                    <h1 class="forums-username">Username</h1>
                    <p class="forums-time">Just now</p>
                </div>
            </div>
            <div class="forums-post-content">
                <p class="forums-post-text">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
        `;

        commentsContainer.appendChild(comment);
        inputBox.value = '';
        btn.parentElement.classList.add('hidden');
    }
});

// --- Submit new forum post ---
const postBtn = document.querySelector('.forums-postbutton .action-btn');
if (postBtn) {
    postBtn.addEventListener('click', function() { // FIX: Traditional function
        const entryWrapper = postBtn.closest('.forums-entry');
        const textarea = entryWrapper.querySelector('.forums-textbox');
        const text = textarea.value.trim();
        if (!text) return;

        const forumPostsContainer = document.querySelector('.hero-forums');

        // Create post wrapper
        const postWrapper = document.createElement('div');
        postWrapper.className = 'forums-post-wrapper';
        postWrapper.innerHTML = `
            <div class="forums-post">
                <div class="forums-post-userinfo">
                    <img class="forums-post-pfp" src="path/to/profile.jpg" alt="Profile Picture">
                    <div class="forums-post-details">
                        <h1 class="forums-username">Username</h1>
                        <p class="forums-time">Just now</p>
                    </div>
                </div>
                <div class="forums-post-content">
                    <p class="forums-post-text">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                </div>
                <hr class="post-divider">
                <div class="forums-post-actions">
                    <button class="action-btn">
                        <img class="action-btn-img" src="../assets/like.svg">
                        <span class="count">0</span>
                    </button>
                    <button class="action-btn">
                        <img class="action-btn-img" src="../assets/comment.svg">
                        <span class="count">0</span>
                    </button>
                    <button class="action-btn">
                        <img class="action-btn-img" src="../assets/img-upload.svg">
                        <span class="count">0</span>
                    </button>
                </div>
            </div>
            <div class="forums-comments">
                <div class="comment-input hidden">
                    <div class="forums-post-userinfo">
                        <img class="forums-post-pfp" src="path/to/profile.jpg" alt="Profile Picture">
                        <div class="forums-post-details">
                            <h1 class="forums-username">Username</h1>
                            <p class="forums-time">Just now</p>
                        </div>
                    </div>
                    <div class="forums-post-content">
                        <textarea class="forums-textbox" placeholder="Share your thoughts..."></textarea>
                    </div>
                    <button class="submit-comment action-btn" type="button">
                    <img class="action-btn-img" id="submit-comment-post-arrow" src="../assets/arrow.svg">
                    </button>
                </div>
            </div>
        `;

        forumPostsContainer.appendChild(postWrapper);

        // Reset textarea
        textarea.value = '';
        autoResize(textarea);
    });
}