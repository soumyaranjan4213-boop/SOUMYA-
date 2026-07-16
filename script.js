/* Professional E-commerce + Upload Site Logic */

let currentStep = 1;
let uploadedFile = null;
let products = [];
let cart = [];
let currentQuickView = null;

// Initialize
function init() {
  document.getElementById('year').textContent = new Date().getFullYear();
  loadCart();
  loadProducts();
  loadUploads();
}

/* Navigation */
function toggleMenu() {
  const nav = document.querySelector('.primary-nav');
  const btn = document.querySelector('.mobile-menu-btn');
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

/* Products */
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (!res.ok || !data.success) return;
    products = data.products || [];
    renderProducts('All');
  } catch (e) {
    console.error('Could not load products:', e);
    showToast('Could not load products.');
  }
}

function renderProducts(category) {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  const list = category === 'All' ? products : products.filter(p => p.category === category);
  if (list.length === 0) {
    grid.innerHTML = '<p style="color:var(--ink-muted)">No products found in this category.</p>';
    return;
  }
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="#" class="product-img" onclick="openQuickView(${p.id}); return false;" aria-label="Quick view ${p.name}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <span class="product-tag">${p.tag}</span>
      </a>
      <div class="product-body">
        <h3><a href="#" onclick="openQuickView(${p.id}); return false;" style="text-decoration:none;color:inherit;">${p.name}</a></h3>
        <p>${p.description}</p>
        <div class="product-price">$${p.price.toFixed(2)}</div>
        <div class="product-actions">
          <a href="#" onclick="openQuickView(${p.id}); return false;" class="btn btn-sm btn-outline">Quick View</a>
          <button onclick="addToCart(${p.id})" class="btn btn-sm btn-primary">Add to Cart</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

/* Quick View */
function openQuickView(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;
  currentQuickView = p;
  document.getElementById('qv-img').src = p.image;
  document.getElementById('qv-img').alt = p.name;
  document.getElementById('qv-tag').textContent = p.tag;
  document.getElementById('qv-title').textContent = p.name;
  document.getElementById('qv-price').textContent = '$' + p.price.toFixed(2);
  document.getElementById('qv-desc').textContent = p.description;
  document.getElementById('quick-view').hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('quick-view').setAttribute('aria-hidden', 'false');
}

function closeQuickView() {
  document.getElementById('quick-view').hidden = true;
  document.body.style.overflow = '';
  document.getElementById('quick-view').setAttribute('aria-hidden', 'true');
}

function addToCartFromQuickView() {
  if (currentQuickView) addToCart(currentQuickView.id);
  closeQuickView();
}

/* Cart */
function loadCart() {
  try {
    const saved = localStorage.getItem('soumy_cart');
    if (saved) cart = JSON.parse(saved);
  } catch (e) { cart = []; }
  updateCartUI();
}

function saveCart() {
  try { localStorage.setItem('soumy_cart', JSON.stringify(cart)); } catch (e) {}
}

function addToCart(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;
  const existing = cart.find(item => item.id === p.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...p, quantity: 1 });
  saveCart();
  updateCartUI();
  showToast(p.name + ' added to cart');
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
}

function updateQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  document.getElementById('cart-count').textContent = count;
  const itemsContainer = document.getElementById('cart-items');
  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p style="color:var(--ink-muted)">Your cart is empty.</p>';
  } else {
    itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" aria-label="Cart item ${item.name}">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-body">
          <h4>${item.name}</h4>
          <p>Qty: ${item.quantity} · $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div style="display:flex;gap:6px;align-items:center;">
          <button onclick="updateQuantity(${item.id}, -1)" class="btn btn-sm btn-outline" aria-label="Decrease quantity">−</button>
          <button onclick="updateQuantity(${item.id}, 1)" class="btn btn-sm btn-outline" aria-label="Increase quantity">+</button>
          <button onclick="removeFromCart(${item.id})" class="btn btn-sm btn-outline" aria-label="Remove item" style="color:#c44;">×</button>
        </div>
      </div>
    `).join('');
  }
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
  // Also update checkout summary
  const checkoutItems = document.getElementById('checkout-items');
  if (checkoutItems) {
    checkoutItems.innerHTML = cart.map(item => `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="checkout-item-body">
          <h4>${item.name}</h4>
          <p>Qty: ${item.quantity} · $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `).join('');
    const checkoutTotal = document.getElementById('checkout-total');
    if (checkoutTotal) checkoutTotal.textContent = '$' + total.toFixed(2);
  }
}

function openCart() {
  document.getElementById('cart-sidebar').hidden = false;
  document.getElementById('cart-sidebar').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  updateCartUI();
}

function closeCart() {
  document.getElementById('cart-sidebar').hidden = true;
  document.getElementById('cart-sidebar').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* Checkout */
function openCheckout() {
  document.getElementById('checkout').hidden = false;
  document.getElementById('checkout').setAttribute('aria-hidden', 'false');
  window.scrollTo({ top: document.getElementById('checkout').offsetTop - 80, behavior: 'smooth' });
  updateCartUI();
}

function placeOrder(e) {
  e.preventDefault();
  if (cart.length === 0) {
    showToast('Your cart is empty.');
    return;
  }
  showToast('Order placed successfully! Thank you for shopping with Soumya Studio.');
  cart = [];
  saveCart();
  updateCartUI();
  setTimeout(() => {
    document.getElementById('checkout').hidden = true;
    document.getElementById('checkout-form').reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1500);
}

/* Wizard (upload design) */
function goToStep(step) {
  if (step < 1 || step > 5) return;
  currentStep = step;
  renderStep();
  window.scrollTo({ top: document.getElementById('upload-design').offsetTop - 80, behavior: 'smooth' });
}

function nextStep() { if (currentStep < 5) goToStep(currentStep + 1); }
function prevStep() { if (currentStep > 1) goToStep(currentStep - 1); }

function renderStep() {
  document.querySelectorAll('.step-tab').forEach(tab => {
    const tabId = parseInt(tab.getAttribute('aria-controls').replace('panel-step-', ''));
    tab.setAttribute('aria-selected', tabId === currentStep ? 'true' : 'false');
  });
  document.querySelectorAll('.wizard-panel').forEach(panel => {
    const panelId = parseInt(panel.id.replace('panel-step-', ''));
    panel.classList.toggle('active', panelId === currentStep);
    panel.hidden = panelId !== currentStep;
  });
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

function previewImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const previewArea = document.getElementById('preview-area');
    previewArea.innerHTML = `<img src="${e.target.result}" alt="Uploaded image preview" />`;
    document.getElementById('upload-btn').disabled = false;
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
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok || !data.success) {
      showToast('Upload failed: ' + (data.message || 'Unknown error'));
      return;
    }
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

async function publishDesign() {
  const title = document.getElementById('design-title').value || 'My Unique Design';
  if (!uploadedFile) {
    showToast('No design to publish. Please complete the upload step first.');
    return;
  }
  const uploadsGrid = document.getElementById('uploads-grid');
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
  setTimeout(() => {
    goToStep(1);
    document.getElementById('upload-form').reset();
    document.getElementById('preview-area').innerHTML = '';
    document.getElementById('upload-btn').disabled = true;
    uploadedFile = null;
  }, 1200);
}

/* Load uploads */
async function loadUploads() {
  try {
    const res = await fetch('/api/uploads');
    const data = await res.json();
    if (!res.ok || !data.success) return;
    if (!data.uploads || data.uploads.length === 0) return;
    const uploadsGrid = document.getElementById('uploads-grid');
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
