import './style.css';

import './style.css';

const iframe = document.getElementById('preview');
const applyBtn = document.getElementById('applyConfig');
const toggleBtn = document.getElementById('toggleMobile');
const previewContainer = document.getElementById('previewContainer');

applyBtn.onclick = () => {
  try {
    const config = JSON.parse(document.getElementById('config').value);
    iframe.contentWindow.postMessage(config, '*');
  } catch (e) {
    alert('Invalid JSON: ' + e.message);
  }
};

toggleBtn.onclick = () => {
  previewContainer.classList.toggle('w-[375px]');
  previewContainer.classList.toggle('w-full');
};
