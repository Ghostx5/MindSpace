const token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const categoryId = params.get("category");

/* ---------------- AUTO RESIZE ---------------- */
function autoResize(el) {
  const MAX_HEIGHT = 500;
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, MAX_HEIGHT) + "px";
}

document.addEventListener("input", e => {
  if (e.target.classList.contains("forums-textbox")) {
    autoResize(e.target);
  }
});

/* ---------------- LOAD THREADS ---------------- */
async function loadThreads() {
  const res = await fetch(`/api/threads?category=${categoryId}`);
  const threads = await res.json();

  const container = document.querySelector(".hero-forums");

  threads.forEach(t => {
    const wrapper = document.createElement("div");
    wrapper.className = "forums-post-wrapper";
    wrapper.dataset.threadId = t.id;

    wrapper.innerHTML = `
      <div class="forums-post">
        <div class="forums-post-userinfo">
          <img class="forums-post-pfp" src="path/to/profile.jpg">
          <div class="forums-post-details">
            <h1 class="forums-username">${t.username}</h1>
          </div>
        </div>
        <div class="forums-post-content">
          <p class="forums-post-text">${t.title}</p>
        </div>
        <hr class="post-divider">
        <div class="forums-post-actions">
          <button class="action-btn comment-btn">
            <img src="../assets/comment.svg">
          </button>
        </div>
      </div>

      <div class="forums-comments">
        <div class="comment-input hidden">
          <textarea class="forums-textbox" placeholder="Write a comment..."></textarea>
          <button class="submit-comment action-btn">Post</button>
        </div>
      </div>
    `;

    container.appendChild(wrapper);
  });
}

loadThreads();

/* ---------------- CREATE THREAD ---------------- */
document.getElementById("submit-forum-post").addEventListener("click", async () => {
  const textarea = document.querySelector(".forums-entry .forums-textbox");
  const content = textarea.value.trim();
  if (!content) return;

  await fetch("/api/threads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: content,
      content,
      categoryId
    })
  });

  textarea.value = "";
  location.reload();
});

/* ---------------- TOGGLE COMMENT BOX ---------------- */
document.addEventListener("click", e => {
  if (e.target.closest(".comment-btn")) {
    const wrapper = e.target.closest(".forums-post-wrapper");
    wrapper.querySelector(".comment-input").classList.toggle("hidden");
  }
});

/* ---------------- SUBMIT COMMENT ---------------- */
document.addEventListener("click", async e => {
  if (!e.target.classList.contains("submit-comment")) return;

  const wrapper = e.target.closest(".forums-post-wrapper");
  const textarea = wrapper.querySelector(".forums-comments textarea");
  const text = textarea.value.trim();
  if (!text) return;

  const threadId = wrapper.dataset.threadId;

  await fetch("/api/threads/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      threadId,
      content: text
    })
  });

  textarea.value = "";
  wrapper.querySelector(".comment-input").classList.add("hidden");
});
