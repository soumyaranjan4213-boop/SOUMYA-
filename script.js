/* Modern frontend logic for Soumya Design Studio */

let currentStep = 1;
let uploadedFile = null;

// Initialize
function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  loadUploads();
}

/* Navigation */
function toggleMenu() {
  const nav = document.querySelector('.primary-nav');
  const btn = document.querySelector('.mobile-menu-btn');
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

/* Wizard */
function goToStep(step) {
  if (step < 1 || step > 5) return;
  currentStep = step;
  renderStep();
  window.scrollTo({ top: document.getElementById('upload-design').offsetTop - 80, behavior: 'smooth' });
}

function nextStep() {
  if (currentStep < 5) goToStep(currentStep + 1);
}

function prevStep() {
  if (currentStep > 1) goToStep(currentStep - 1);
}

function renderStep() {
  // Update tabs
  document.querySelectorAll('.step-tab').forEach(tab => {
    const tabId = parseInt(tab.getAttribute('aria-controls').replace('panel-step-', ''));
    tab.setAttribute('aria-selected', tabId === currentStep ? 'true' : 'false');
  });
  // Update panels
  document.querySelectorAll('.wizard-panel').forEach(panel => {
    const panelId = parseInt(panel.id.replace('panel-step-', ''));
    panel.classList.toggle('active', panelId === currentStep);
    panel.hidden = panelId !== currentStep;
  });
  // Update preview images from uploaded file
  if (uploadedFile && uploadedFile.url) {
    ['process-img', 'preview-img', 'publish-img'].forEach(id => {
      const img = document.getElementById(id);
      if (img) img.src = uploadedFile.url;
    });
    document.getElementById('process-filename').textContent = uploadedFile.name || '—';
    document.getElementById('process-size').textContent = uploadedFile.size ? formatSize(uploadedFile.size) : '—';
    document.getElementById('publish-title').textContent = document.getElementById('design-title').value || 'My Unique Design';
  }
}

function formatSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/* Upload */
function previewImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewArea = document.getElementById('preview-area');
    previewArea.innerHTML = `<img src="${e.target.result}" alt="Uploaded image preview" />`;
    document.getElementById('upload-btn').disabled = false;
    // Store file info temporarily
    uploadedFile = { url: e.target.result, name: file.name, size: file.size };
  };
  reader.readAsDataURL(file);
}

async function handleUpload(e) {
  e.preventDefault();
  const fileInput = document.getElementById('image-input');
  if (!fileInput.files || fileInput.files.length === 0) {
    showToast('Please select an image to upload.');
    return;
  }
  const formData = new FormData();
  formData.append('image', fileInput.files[0]);
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      showToast('Upload failed: ' + (data.message || 'Unknown error'));
      return;
    }
    // Store uploaded info for wizard
    uploadedFile = {
      url: data.file.path ? data.file.path : URL.createObjectURL(fileInput.files[0]),
      name: data.file.originalname,
      size: data.file.size,
      serverPath: data.file.path,
      serverFilename: data.file.filename
    };
    showToast('Upload successful. Moving to process step...');
    nextStep();
  } catch (err) {
    console.error('Upload error:', err);
    showToast('Upload error. Please try again.');
  }
}

/* Publish */
async function publishDesign() {
  const title = document.getElementById('design-title').value || 'My Unique Design';
  const notes = document.getElementById('design-notes').value || '';
  if (!uploadedFile) {
    showToast('No design to publish. Please complete the upload step first.');
    return;
  }
  // Create a professional unique card HTML
  const uploadsGrid = document.getElementById('uploads-grid');
  // Remove placeholder cards if present
  document.querySelectorAll('.upload-card.placeholder').forEach(el => el.remove());

  const card = document.createElement('article');
  card.className = 'upload-card';
  card.innerHTML = `
    <a href="#" class="upload-card-inner" onclick="showToast('Design details opening...'); return false;" aria-label="View ${title}">
      <div class="upload-img-wrapper">
        <img src="${uploadedFile.url}" alt="${title}" loading="lazy" />
        <span class="unique-badge" aria-label="Unique design badge">Unique</span>
      </div>
      <div class="upload-card-body">
        <h3>${title}</h3>
        <p>Published just now. Professional, original design.</p>
        <span class="btn btn-sm btn-outline">View Details</span>
      </div>
    </a>
  `;
  uploadsGrid.prepend(card);

  showToast('Design published successfully!');
  // Reset wizard after brief delay
  setTimeout(() => {
    goToStep(1);
    document.getElementById('upload-form').reset();
    document.getElementById('preview-area').innerHTML = '';
    document.getElementById('upload-btn').disabled = true;
    uploadedFile = null;
  }, 1200);
}

/* Load existing uploads */
async function loadUploads() {
  try {
    const res = await fetch('/api/uploads');
    const data = await res.json();
    if (!res.ok || !data.success) return;
    if (!data.uploads || data.uploads.length === 0) return;
    const uploadsGrid = document.getElementById('uploads-grid');
    // Clear placeholders
    document.querySelectorAll('.upload-card.placeholder').forEach(el => el.remove());
    data.uploads.forEach(file => {
      const card = document.createElement('article');
      card.className = 'upload-card';
      card.innerHTML = `
        <a href="#" class="upload-card-inner" onclick="showToast('Design details opening...'); return false;" aria-label="View design">
          <div class="upload-img-wrapper">
            <img src="${file.url}" alt="Uploaded design" loading="lazy" />
            <span class="unique-badge" aria-label="Unique design badge">Unique</span>
          </div>
          <div class="upload-card-body">
            <h3>${file.originalname ? file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Published Design'}</h3>
            <p>Professional and unique upload.</p>
            <span class="btn btn-sm btn-outline">View Details</span>
          </div>
        </a>
      `;
      uploadsGrid.appendChild(card);
    });
  } catch (e) {
    console.error('Could not load uploads:', e);
  }
}

/* Toast */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* Initialize */
window.addEventListener('DOMContentLoaded', init);
