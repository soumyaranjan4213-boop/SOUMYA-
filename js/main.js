/**
 * IMAVE Premium E-Commerce Website
 * Fully functional frontend with localStorage persistence
 */

(function() {
    'use strict';

    // =====================
    // State Management
    // =====================
    const state = {
        cart: JSON.parse(localStorage.getItem('imave_cart')) || [],
        uploads: JSON.parse(localStorage.getItem('imave_uploads')) || [],
        products: [],
        currentCategory: 'all',
        currentSort: 'featured',
        searchQuery: '',
        uploadData: {
            file: null,
            imageUrl: null,
            style: 'minimal',
            title: '',
            description: '',
            category: 'apparel',
            price: 0
        }
    };

    // =====================
    // Product Catalog
    // =====================
    const productCatalog = [
        {
            id: 1,
            title: 'Ethereal Abstract Tee',
            category: 'apparel',
            price: 45.00,
            rating: 4.9,
            reviews: 128,
            badge: 'bestseller',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=700&fit=crop',
            description: 'A premium cotton tee featuring an ethereal abstract design. Soft, breathable, and built for everyday creativity.'
        },
        {
            id: 2,
            title: 'Neon Dreams Hoodie',
            category: 'apparel',
            price: 89.00,
            rating: 4.8,
            reviews: 96,
            badge: 'new',
            image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=700&fit=crop',
            description: 'Ultra-soft fleece hoodie with a vibrant neon gradient design. Perfect for late-night creative sessions.'
        },
        {
            id: 3,
            title: 'Minimalist Mountain Poster',
            category: 'home',
            price: 35.00,
            rating: 4.7,
            reviews: 84,
            badge: 'ai',
            image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=700&fit=crop',
            description: 'A calming minimalist landscape poster printed on museum-quality matte paper.'
        },
        {
            id: 4,
            title: 'Cyberpunk Canvas',
            category: 'digital',
            price: 120.00,
            rating: 5.0,
            reviews: 42,
            badge: 'new',
            image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&h=700&fit=crop',
            description: 'High-resolution digital artwork inspired by futuristic cityscapes. Instant download available.'
        },
        {
            id: 5,
            title: 'Botanical Tote Bag',
            category: 'accessories',
            price: 28.00,
            rating: 4.6,
            reviews: 64,
            badge: '',
            image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=700&fit=crop',
            description: 'Eco-friendly canvas tote with a hand-drawn botanical illustration.'
        },
        {
            id: 6,
            title: 'Retro Wave Cap',
            category: 'accessories',
            price: 32.00,
            rating: 4.5,
            reviews: 51,
            badge: '',
            image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=700&fit=crop',
            description: 'Classic dad cap with a retro wave embroidered patch.'
        },
        {
            id: 7,
            title: 'Geometric Throw Pillow',
            category: 'home',
            price: 42.00,
            rating: 4.8,
            reviews: 73,
            badge: 'bestseller',
            image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=700&fit=crop',
            description: 'Velvet throw pillow featuring bold geometric patterns in premium fabric.'
        },
        {
            id: 8,
            title: 'Abstract Expression Print',
            category: 'digital',
            price: 65.00,
            rating: 4.9,
            reviews: 37,
            badge: 'ai',
            image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=700&fit=crop',
            description: 'Expressive digital print with layered textures and vivid colors.'
        }
    ];

    state.products = [...productCatalog];

    // =====================
    // DOM Utilities
    // =====================
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    function formatPrice(price) {
        return '$' + parseFloat(price).toFixed(2);
    }

    function generateId() {
        return 'imave_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // =====================
    // Toast Notifications
    // =====================
    function showToast(message, type = 'success') {
        const container = $('#toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-info-circle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    // =====================
    // Preloader
    // =====================
    function initPreloader() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                $('#preloader').classList.add('hidden');
            }, 600);
        });
    }

    // =====================
    // Header & Navigation
    // =====================
    function initHeader() {
        const header = $('#header');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile menu
        const hamburger = $('#hamburger');
        const navMenu = $('#nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu on link click
        $$('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Active nav link on scroll
        const sections = $$('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                if (scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            $$('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // =====================
    // Search
    // =====================
    function initSearch() {
        const toggle = $('#search-toggle');
        const bar = $('#search-bar');
        const close = $('#search-close');
        const input = $('#search-input');
        const btn = $('#search-btn');

        toggle.addEventListener('click', () => {
            bar.classList.add('active');
            input.focus();
        });

        close.addEventListener('click', () => {
            bar.classList.remove('active');
        });

        function performSearch() {
            state.searchQuery = input.value.trim().toLowerCase();
            renderProducts();
            bar.classList.remove('active');
            if (state.searchQuery) {
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
                showToast(`Showing results for "${input.value}"`, 'success');
            }
        }

        btn.addEventListener('click', performSearch);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // =====================
    // Cart
    // =====================
    function saveCart() {
        localStorage.setItem('imave_cart', JSON.stringify(state.cart));
        updateCartUI();
    }

    function addToCart(product, quantity = 1) {
        const existing = state.cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            state.cart.push({ ...product, quantity });
        }
        saveCart();
        showToast(`${product.title} added to cart`, 'success');
    }

    function removeFromCart(id) {
        state.cart = state.cart.filter(item => item.id !== id);
        saveCart();
        showToast('Item removed from cart', 'warning');
    }

    function updateQuantity(id, change) {
        const item = state.cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                saveCart();
            }
        }
    }

    function updateCartUI() {
        const count = $('#cart-count');
        const itemsContainer = $('#cart-items');
        const footer = $('#cart-footer');
        const subtotalEl = $('#cart-subtotal');
        const taxEl = $('#cart-tax');
        const totalEl = $('#cart-total');

        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        count.textContent = totalItems;

        if (state.cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                    <a href="#products" class="btn btn-primary" id="continue-shopping">Continue Shopping</a>
                </div>
            `;
            footer.style.display = 'none';
        } else {
            itemsContainer.innerHTML = state.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>${item.category}</p>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="qty-decrease" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                                <span>${item.quantity}</span>
                                <button class="qty-increase" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');

            footer.style.display = 'block';

            const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.08;
            const total = subtotal + tax;

            subtotalEl.textContent = formatPrice(subtotal);
            taxEl.textContent = formatPrice(tax);
            totalEl.textContent = formatPrice(total);

            // Bind cart item events
            $$('.qty-decrease').forEach(btn => {
                btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
            });
            $$('.qty-increase').forEach(btn => {
                btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
            });
            $$('.remove-item').forEach(btn => {
                btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
            });
        }
    }

    function initCart() {
        const toggle = $('#cart-toggle');
        const sidebar = $('#cart-sidebar');
        const overlay = $('#cart-overlay');
        const close = $('#cart-close');

        function open() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeCart() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', open);
        close.addEventListener('click', closeCart);
        overlay.addEventListener('click', closeCart);

        $('#checkout-btn').addEventListener('click', () => {
            if (state.cart.length === 0) return;
            closeCart();
            $('#checkout-modal').classList.add('active');
            state.cart = [];
            saveCart();
        });

        $('#checkout-modal-close').addEventListener('click', () => {
            $('#checkout-modal').classList.remove('active');
        });

        $('#checkout-done').addEventListener('click', () => {
            $('#checkout-modal').classList.remove('active');
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });

        updateCartUI();
    }

    // =====================
    // Products
    // =====================
    function getCategoryName(category) {
        const names = {
            apparel: 'Apparel',
            digital: 'Digital Art',
            home: 'Home Decor',
            accessories: 'Accessories'
        };
        return names[category] || category;
    }

    function getBadgeHTML(badge) {
        if (!badge) return '';
        const labels = { new: 'New', bestseller: 'Best Seller', ai: 'AI Generated' };
        return `<span class="product-badge ${badge}">${labels[badge]}</span>`;
    }

    function renderProducts() {
        let filtered = state.products;

        if (state.currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === state.currentCategory);
        }

        if (state.searchQuery) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(state.searchQuery) ||
                p.description.toLowerCase().includes(state.searchQuery) ||
                p.category.toLowerCase().includes(state.searchQuery)
            );
        }

        // Sorting
        switch (state.currentSort) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            default:
                filtered.sort((a, b) => a.id - b.id);
        }

        const grid = $('#products-grid');

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="uploads-empty" style="grid-column: 1 / -1;">
                    <div class="empty-icon"><i class="fas fa-search"></i></div>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    ${getBadgeHTML(product.badge)}
                    <div class="product-actions">
                        <button class="product-action-btn quick-view" data-id="${product.id}" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="product-action-btn add-to-cart" data-id="${product.id}" title="Add to Cart">
                            <i class="fas fa-shopping-bag"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-meta">
                        <span class="product-price">${formatPrice(product.price)}</span>
                        <div class="product-rating">
                            <i class="fas fa-star"></i>
                            <span>${product.rating} (${product.reviews})</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Bind events
        $$('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.product-action-btn')) {
                    openProductModal(card.dataset.id);
                }
            });
        });

        $$('.quick-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openProductModal(btn.dataset.id);
            });
        });

        $$('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const product = state.products.find(p => p.id == btn.dataset.id);
                if (product) addToCart(product);
            });
        });
    }

    function initProducts() {
        // Category filters
        $$('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentCategory = btn.dataset.category;
                renderProducts();
            });
        });

        // Sort
        $('#sort-select').addEventListener('change', (e) => {
            state.currentSort = e.target.value;
            renderProducts();
        });

        // Footer category links
        $$('.footer-links a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                state.currentCategory = category;
                $$('.filter-btn').forEach(b => {
                    b.classList.toggle('active', b.dataset.category === category);
                });
                renderProducts();
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            });
        });

        renderProducts();
    }

    function openProductModal(id) {
        const product = state.products.find(p => p.id == id);
        if (!product) return;

        const modal = $('#product-modal');
        const body = $('#modal-body');

        body.innerHTML = `
            <div class="product-modal-body">
                <div class="product-modal-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-modal-info">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h2>${product.title}</h2>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>${product.rating} (${product.reviews} reviews)</span>
                    </div>
                    <div class="product-modal-price">${formatPrice(product.price)}</div>
                    <p class="product-modal-description">${product.description}</p>
                    <ul class="product-features" style="margin-bottom: 28px; color: var(--gray);">
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--success); margin-right: 8px;"></i> Premium quality materials</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--success); margin-right: 8px;"></i> Worldwide shipping</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--success); margin-right: 8px;"></i> 30-day satisfaction guarantee</li>
                    </ul>
                    <div class="product-modal-actions">
                        <button class="btn btn-primary btn-lg add-modal-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-bag"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline btn-lg modal-close-btn">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        $('.add-modal-cart').addEventListener('click', () => {
            addToCart(product);
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });

        $('.modal-close-btn').addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    function initModalClose() {
        $('#modal-close').addEventListener('click', () => {
            $('#product-modal').classList.remove('active');
            document.body.style.overflow = '';
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // =====================
    // Upload Design Wizard
    // =====================
    function saveUploads() {
        localStorage.setItem('imave_uploads', JSON.stringify(state.uploads));
        renderUploads();
    }

    function goToStep(step) {
        $$('.wizard-step').forEach(el => el.classList.remove('active'));
        $(`.wizard-step[data-step="${step}"]`).classList.add('active');

        $$('.upload-steps .step').forEach(el => {
            const stepNum = parseInt(el.dataset.step);
            el.classList.remove('active', 'completed');
            if (stepNum < step) {
                el.classList.add('completed');
            } else if (stepNum === step) {
                el.classList.add('active');
            }
        });

        // Update review step if going to step 4
        if (step === 4) {
            updateReview();
        }
    }

    function updateReview() {
        const img = $('#review-image');
        const title = $('#review-title');
        const desc = $('#review-description');
        const style = $('#review-style');
        const category = $('#review-category');
        const price = $('#review-price');

        img.src = state.uploadData.imageUrl || 'https://via.placeholder.com/400x500?text=No+Image';
        title.textContent = state.uploadData.title || 'Untitled Design';
        desc.textContent = state.uploadData.description || 'No description provided.';
        style.textContent = state.uploadData.style.charAt(0).toUpperCase() + state.uploadData.style.slice(1);
        category.textContent = getCategoryName(state.uploadData.category);

        const priceVal = parseFloat(state.uploadData.price);
        price.textContent = priceVal > 0 ? formatPrice(priceVal) : 'Free';
    }

    function initUploadWizard() {
        const fileInput = $('#design-file');
        const uploadArea = $('#upload-area');
        const uploadPlaceholder = $('#upload-placeholder');
        const uploadPreview = $('#upload-preview');
        const previewImage = $('#preview-image');
        const browseBtn = $('#browse-btn');
        const changeFileBtn = $('#change-file');
        const step1Next = $('#step1-next');
        const termsCheck = $('#terms-check');
        const publishBtn = $('#publish-btn');

        // Drag & drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => {
                uploadArea.classList.remove('dragover');
            });
        });

        uploadArea.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length) handleFile(files[0]);
        });

        uploadArea.addEventListener('click', () => {
            if (!state.uploadData.file) fileInput.click();
        });

        browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) handleFile(e.target.files[0]);
        });

        changeFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        function handleFile(file) {
            if (!file.type.startsWith('image/')) {
                showToast('Please upload a valid image file', 'error');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                showToast('File size must be less than 10MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                state.uploadData.file = file;
                state.uploadData.imageUrl = e.target.result;
                previewImage.src = e.target.result;
                uploadPlaceholder.style.display = 'none';
                uploadPreview.style.display = 'block';
                step1Next.disabled = false;
                showToast('Image uploaded successfully', 'success');
            };
            reader.readAsDataURL(file);
        }

        step1Next.disabled = true;

        // Step navigation
        $$('.next-step').forEach(btn => {
            btn.addEventListener('click', () => {
                const nextStep = parseInt(btn.dataset.next);

                // Validation
                if (nextStep === 2 && !state.uploadData.file) {
                    showToast('Please upload an image first', 'warning');
                    return;
                }
                if (nextStep === 4) {
                    state.uploadData.title = $('#design-title').value.trim();
                    state.uploadData.description = $('#design-description').value.trim();
                    state.uploadData.category = $('#design-category').value;
                    state.uploadData.price = $('#design-price').value;
                    updateReview();
                }
                if (nextStep === 5) {
                    if (!state.uploadData.title) {
                        showToast('Please add a design title', 'warning');
                        return;
                    }
                }

                goToStep(nextStep);
            });
        });

        $$('.prev-step').forEach(btn => {
            btn.addEventListener('click', () => {
                goToStep(parseInt(btn.dataset.prev));
            });
        });

        // Step click on progress bar
        $$('.upload-steps .step').forEach(step => {
            step.addEventListener('click', () => {
                const targetStep = parseInt(step.dataset.step);
                if (targetStep === 1 || state.uploadData.file) {
                    goToStep(targetStep);
                }
            });
        });

        // Style selection
        $$('input[name="style"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                state.uploadData.style = e.target.value;
            });
        });

        // Terms and publish
        termsCheck.addEventListener('change', () => {
            publishBtn.disabled = !termsCheck.checked;
        });

        publishBtn.addEventListener('click', () => {
            if (!termsCheck.checked) return;

            const newUpload = {
                id: generateId(),
                title: state.uploadData.title || 'Untitled Design',
                description: state.uploadData.description || '',
                style: state.uploadData.style,
                category: state.uploadData.category,
                price: parseFloat(state.uploadData.price) || 0,
                imageUrl: state.uploadData.imageUrl,
                source: 'upload',
                createdAt: new Date().toISOString()
            };

            state.uploads.unshift(newUpload);
            saveUploads();

            // Reset wizard
            state.uploadData = {
                file: null,
                imageUrl: null,
                style: 'minimal',
                title: '',
                description: '',
                category: 'apparel',
                price: 0
            };

            fileInput.value = '';
            uploadPlaceholder.style.display = 'block';
            uploadPreview.style.display = 'none';
            $('#design-title').value = '';
            $('#design-description').value = '';
            $('#design-category').value = 'apparel';
            $('#design-price').value = '';
            $$('input[name="style"]')[0].checked = true;
            termsCheck.checked = false;
            publishBtn.disabled = true;
            step1Next.disabled = true;

            goToStep(1);
            showToast('Design published successfully! View it in My Uploads.', 'success');

            // Scroll to uploads
            document.getElementById('my-uploads').scrollIntoView({ behavior: 'smooth' });
        });
    }

    function renderUploads() {
        const grid = $('#uploads-grid');

        if (state.uploads.length === 0) {
            grid.innerHTML = `
                <div class="uploads-empty" id="uploads-empty">
                    <div class="empty-icon"><i class="fas fa-images"></i></div>
                    <h3>No uploads yet</h3>
                    <p>Start by uploading your first design in the Design Studio.</p>
                    <a href="#upload-design" class="btn btn-primary">Upload Design</a>
                </div>
            `;
            return;
        }

        grid.innerHTML = state.uploads.map(upload => `
            <div class="upload-card" data-id="${upload.id}">
                <div class="upload-card-image">
                    <img src="${upload.imageUrl}" alt="${upload.title}" loading="lazy">
                    <span class="upload-source-badge">Your Upload</span>
                    <button class="upload-delete" data-id="${upload.id}" title="Delete upload">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="upload-card-info">
                    <h4>${upload.title}</h4>
                    <p>${upload.description || 'No description'}</p>
                    <div class="upload-card-meta">
                        <span class="tag">${getCategoryName(upload.category)}</span>
                        <span class="upload-card-price">${upload.price > 0 ? formatPrice(upload.price) : 'Free'}</span>
                    </div>
                </div>
            </div>
        `).join('');

        $$('.upload-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                state.uploads = state.uploads.filter(u => u.id !== id);
                saveUploads();
                showToast('Upload removed', 'warning');
            });
        });
    }

    // =====================
    // AI Tools
    // =====================
    function initAITools() {
        const captions = [
            "Elevate your everyday look with this bold, statement-making design.",
            "Minimalist vibes meet maximum impact in this curated piece.",
            "A fresh take on modern aesthetics for the creative soul.",
            "Designed to stand out, crafted to last.",
            "Unleash your individuality with this one-of-a-kind creation."
        ];

        const tagSets = [
            ["#minimalist", "#moderndesign", "#homedecor", "#interiorstyle", "#aesthetic"],
            ["#abstractart", "#contemporary", "#wallart", "#creative", "#designinspo"],
            ["#vintagestyle", "#retro", "#uniquefinds", "#handmadevibes", "#boutique"],
            ["#natureinspired", "#botanical", "#organic", "#earthy", "#sustainable"],
            ["#urbanstyle", "#streetwear", "#bold", "#statement", "#trendy"]
        ];

        $('#generate-caption').addEventListener('click', () => {
            const topic = $('#caption-topic').value.trim();
            if (!topic) {
                showToast('Please enter a topic first', 'warning');
                return;
            }
            const result = $('#caption-result');
            result.style.display = 'block';
            result.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

            setTimeout(() => {
                const caption = captions[Math.floor(Math.random() * captions.length)];
                result.innerHTML = `<strong>AI Caption:</strong> ${caption}`;
                showToast('Caption generated!', 'success');
            }, 800);
        });

        $('#generate-tags').addEventListener('click', () => {
            const topic = $('#tag-topic').value.trim();
            if (!topic) {
                showToast('Please enter a topic first', 'warning');
                return;
            }
            const result = $('#tags-result');
            result.style.display = 'block';
            result.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

            setTimeout(() => {
                const tags = tagSets[Math.floor(Math.random() * tagSets.length)];
                result.innerHTML = `<strong>AI Tags:</strong> ${tags.join(' ')}`;
                showToast('Tags generated!', 'success');
            }, 800);
        });
    }

    // =====================
    // Contact & Newsletter
    // =====================
    function initContact() {
        $('#contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#contact-name').value.trim();
            const email = $('#contact-email').value.trim();
            const subject = $('#contact-subject').value;
            const message = $('#contact-message').value.trim();

            if (!name || !email || !subject || !message) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            // Simulate form submission
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                e.target.reset();
                showToast('Message sent! We\'ll get back to you soon.', 'success');
            }, 1500);
        });

        $('#newsletter-btn').addEventListener('click', () => {
            const email = $('#newsletter-email').value.trim();
            if (!email || !email.includes('@')) {
                showToast('Please enter a valid email', 'error');
                return;
            }
            $('#newsletter-email').value = '';
            showToast('Thanks for subscribing!', 'success');
        });
    }

    // =====================
    // User Toggle
    // =====================
    function initUserToggle() {
        $('#user-toggle').addEventListener('click', () => {
            showToast('Account feature coming soon. Demo mode active.', 'info');
        });
    }

    // =====================
    // Footer Year
    // =====================
    function initFooter() {
        $('#year').textContent = new Date().getFullYear();
    }

    // =====================
    // Initialize Everything
    // =====================
    function init() {
        initPreloader();
        initHeader();
        initSearch();
        initCart();
        initProducts();
        initModalClose();
        initUploadWizard();
        renderUploads();
        initAITools();
        initContact();
        initUserToggle();
        initFooter();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
