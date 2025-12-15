const textarea = document.querySelector('#forums-textbox');

const MAX_HEIGHT = 500; // px — adjust as needed

function autoResize(el) {
  el.style.height = 'auto';

  if (el.scrollHeight > MAX_HEIGHT) {
    el.style.height = MAX_HEIGHT + 'px';
    el.style.overflowY = 'auto'; // start scrolling
  } else {
    el.style.height = el.scrollHeight + 'px';
    el.style.overflowY = 'hidden';
  }
}

textarea.addEventListener('input', () => autoResize(textarea));
autoResize(textarea);
