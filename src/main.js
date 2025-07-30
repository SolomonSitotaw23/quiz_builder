import './style.css';

const iframe = document.getElementById('preview');
const applyBtn = document.getElementById('applyConfig');
const toggleBtn = document.getElementById('toggleMobile');
const previewContainer = document.getElementById('previewContainer');
const textarea = document.getElementById('config');
const themeSelect = document.getElementById('themeSelect'); // Optional dropdown

// Manual apply
applyBtn.onclick = () => {
  try {
    const config = JSON.parse(textarea.value);
    iframe.contentWindow.postMessage(config, '*');
  } catch (e) {
    alert('Invalid JSON: ' + e.message);
  }
};

// Mobile toggle
toggleBtn.onclick = () => {
  previewContainer.classList.toggle('w-[375px]');
  previewContainer.classList.toggle('w-full');
};

// Live sync with debounce
let timeout;
textarea.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    try {
      const config = JSON.parse(textarea.value);
      iframe.contentWindow.postMessage(config, '*');
    } catch {
      // silently ignore if JSON is invalid during typing
    }
  }, 500);
});

// Theme selector
if (themeSelect) {
  themeSelect.addEventListener('change', (e) => {
    try {
      const config = JSON.parse(textarea.value);
      config.theme = e.target.value;
      textarea.value = JSON.stringify(config, null, 2);
      iframe.contentWindow.postMessage(config, '*');
    } catch (e) {
      alert('Invalid JSON while changing theme.');
    }
  });
}
