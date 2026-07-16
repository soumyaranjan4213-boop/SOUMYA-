/**
 * IMAVE Premium E-Commerce Website
 * Fully functional frontend with localStorage persistence
 * Features: cart, wishlist, checkout, orders, uploads, AI tools, account
 */

(function() {
    'use strict';

    // =====================
    // State Management
    // =====================
    const state = {
        cart: JSON.parse(localStorage.getItem('imave_cart')) || [],
        uploads: JSON.parse(localStorage.getItem('imave_uploads')) || [],
        wishlist: JSON.parse(localStorage.getItem('imave_wishlist')) || [],
        orders: JSON.parse(localStorage.getItem('imave_orders')) || [],
        recentlyViewed: JSON.parse(localStorage.getItem('imave_recently_viewed')) || [],
        account: JSON.parse(localStorage.getItem('imave_account')) || {
            name: '',
            email: '',
            phone: ''
        },
        products: [],
        currentCategory: 'all',
        currentSort: 'featured',
        searchQuery: '',
        coupon: JSON.parse(localStorage.getItem('imave_coupon')) || null,
        checkoutStep: 1,
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
            description: 'A premium cotton tee featuring an ethereal abstract design. Soft, breathable, and built for everyday creativity.',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['#000000', '#ffffff', '#6c5ce7']
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
            description: 'Ultra-soft fleece hoodie with a vibrant neon gradient design. Perfect for late-night creative sessions.',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['#1a1a2e', '#fd79a8']
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
            description: 'A calming minimalist landscape poster printed on museum-quality matte paper.',
            sizes: ['12x16', '18x24', '24x36'],
            colors: []
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
            description: 'High-resolution digital artwork inspired by futuristic cityscapes. Instant download available.',
            sizes: ['4K', '5K'],
            colors: []
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
            description: 'Eco-friendly canvas tote with a hand-drawn botanical illustration.',
            sizes: ['One Size'],
            colors: ['#f8f9fa', '#00b894']
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
            description: 'Classic dad cap with a retro wave embroidered patch.',
            sizes: ['One Size'],
            colors: ['#1a1a2e', '#fdcb6e']
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
            description: 'Velvet throw pillow featuring bold geometric patterns in premium fabric.',
            sizes: ['16x16', '20x20'],
            colors: ['#6c5ce7', '#fd79a8', '#00cec9']
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
            description: 'Expressive digital print with layered textures and vivid colors.',
            sizes: ['A4', 'A3', 'A2'],
            colors: []
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

    function generateOrderId() {
        return 'IMV-' + Date.now().toString().slice(-8);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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

        // Debounced live search
        let debounceTimer;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                state.searchQuery = input.value.trim().toLowerCase();
                renderProducts();
            }, 400);
        });
    }

    // =====================
    // Wishlist
    // =====================
    function saveWishlist() {
        localStorage.setItem('imave_wishlist', JSON.stringify(state.wishlist));
        updateWishlistUI();
    }

    function toggleWishlist(productId, event) {
        if (event) event.stopPropagation();
        const index = state.wishlist.indexOf(productId);
        const product = state.products.find(p => p.id == productId);

        if (index === -1) {
            state.wishlist.push(productId);
            showToast(product ? `${product.title} added to wishlist` : 'Added to wishlist', 'success');
        } else {
            state.wishlist.splice(index, 1);
            showToast('Removed from wishlist', 'warning');
        }
        saveWishlist();
    }

    function updateWishlistUI() {
        const count = $('#wishlist-count');
        count.textContent = state.wishlist.length;

        $$('.wishlist-btn').forEach(btn => {
            const id = parseInt(btn.dataset.id);
            btn.classList.toggle('active', state.wishlist.includes(id));
            btn.innerHTML = `<i class="${state.wishlist.includes(id) ? 'fas' : 'far'} fa-heart"></i>`;
        });
    }

    // =====================
    // Cart
    // =====================
    function saveCart() {
        localStorage.setItem('imave_cart', JSON.stringify(state.cart));
        updateCartUI();
    }

    function addToCart(product, quantity = 1, options = {}) {
        const existing = state.cart.find(item =>
            item.id === product.id &&
            item.size === (options.size || null) &&
            item.color === (options.color || null)
        );

        if (existing) {
            existing.quantity += quantity;
        } else {
            state.cart.push({
                ...product,
                quantity,
                size: options.size || null,
                color: options.color || null,
                cartId: generateId()
            });
        }
        saveCart();
        showToast(`${product.title} added to cart`, 'success');
    }

    function removeFromCart(cartId) {
        state.cart = state.cart.filter(item => item.cartId !== cartId);
        saveCart();
        showToast('Item removed from cart', 'warning');
    }

    function updateQuantity(cartId, change) {
        const item = state.cart.find(item => item.cartId === cartId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(cartId);
            } else {
                saveCart();
            }
        }
    }

    function calculateTotals() {
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discount = 0;

        if (state.coupon) {
            if (state.coupon.type === 'percent') {
                discount = subtotal * (state.coupon.value / 100);
            } else if (state.coupon.type === 'fixed') {
                discount = state.coupon.value;
            }
            discount = Math.min(discount, subtotal);
        }

        const taxable = subtotal - discount;
        const tax = taxable * 0.08;
        const total = taxable + tax;

        return { subtotal, discount, tax, total };
    }

    function updateCartUI() {
        const count = $('#cart-count');
        const itemsContainer = $('#cart-items');
        const footer = $('#cart-footer');
        const subtotalEl = $('#cart-subtotal');
        const taxEl = $('#cart-tax');
        const totalEl = $('#cart-total');
        const discountRow = $('#discount-row');
        const discountEl = $('#cart-discount');
        const couponCode = $('#coupon-code');

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
                        <p>${getCategoryName(item.category)}${item.size ? ` · Size ${item.size}` : ''}${item.color ? ` · Color` : ''}</p>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="qty-decrease" data-id="${item.cartId}"><i class="fas fa-minus"></i></button>
                                <span>${item.quantity}</span>
                                <button class="qty-increase" data-id="${item.cartId}"><i class="fas fa-plus"></i></button>
                            </div>
                            <button class="remove-item" data-id="${item.cartId}">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');

            footer.style.display = 'block';

            const totals = calculateTotals();
            subtotalEl.textContent = formatPrice(totals.subtotal);
            taxEl.textContent = formatPrice(totals.tax);
            totalEl.textContent = formatPrice(totals.total);

            if (state.coupon && totals.discount > 0) {
                discountRow.style.display = 'flex';
                discountEl.textContent = '-' + formatPrice(totals.discount);
                couponCode.textContent = `(${state.coupon.code})`;
            } else {
                discountRow.style.display = 'none';
            }

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

        // Coupon
        $('#apply-coupon').addEventListener('click', () => {
            const input = $('#coupon-input');
            const code = input.value.trim().toUpperCase();

            const coupons = {
                'SAVE10': { type: 'percent', value: 10 },
                'SAVE20': { type: 'percent', value: 20 },
                'IMV50': { type: 'fixed', value: 50 },
                'WELCOME': { type: 'percent', value: 15 }
            };

            if (coupons[code]) {
                state.coupon = { code, ...coupons[code] };
                localStorage.setItem('imave_coupon', JSON.stringify(state.coupon));
                saveCart();
                showToast(`Coupon ${code} applied!`, 'success');
            } else {
                showToast('Invalid coupon code', 'error');
            }
        });

        $('#checkout-btn').addEventListener('click', () => {
            if (state.cart.length === 0) return;
            closeCart();
            openCheckout();
        });

        updateCartUI();
    }

    // =====================
    // Checkout
    // =====================
    function openCheckout() {
        state.checkoutStep = 1;
        updateCheckoutStep();
        $('#checkout-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckout() {
        $('#checkout-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateCheckoutStep() {
        $$('.checkout-pane').forEach(pane => pane.classList.remove('active'));
        $(`.checkout-pane[data-pane="${state.checkoutStep}"]`).classList.add('active');

        $$('.checkout-step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.toggle('active', stepNum === state.checkoutStep);
        });

        if (state.checkoutStep === 3) {
            renderCheckoutSummary();
        }
    }

    function validateShipping() {
        const fields = ['ship-first', 'ship-last', 'ship-email', 'ship-address', 'ship-city', 'ship-zip', 'ship-country'];
        for (const field of fields) {
            const el = $('#' + field);
            if (!el.value.trim()) {
                el.focus();
                showToast('Please fill in all shipping fields', 'error');
                return false;
            }
        }
        if (!$('#ship-email').value.includes('@')) {
            showToast('Please enter a valid email', 'error');
            return false;
        }
        return true;
    }

    function validatePayment() {
        const method = document.querySelector('input[name="payment"]:checked').value;
        if (method !== 'card') return true;

        const cardName = $('#card-name').value.trim();
        const cardNumber = $('#card-number').value.replace(/\s/g, '');
        const expiry = $('#card-expiry').value;
        const cvc = $('#card-cvc').value;

        if (!cardName || cardNumber.length < 13 || expiry.length < 5 || cvc.length < 3) {
            showToast('Please enter valid card details', 'error');
            return false;
        }
        return true;
    }

    function renderCheckoutSummary() {
        const container = $('#checkout-summary');
        const totals = calculateTotals();

        container.innerHTML = `
            ${state.cart.map(item => `
                <div class="checkout-summary-item">
                    <div class="checkout-summary-thumb">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="checkout-summary-info">
                        <h5>${item.title}</h5>
                        <p>Qty: ${item.quantity}${item.size ? ` · Size ${item.size}` : ''}${item.color ? ` · Color` : ''}</p>
                    </div>
                    <span>${formatPrice(item.price * item.quantity)}</span>
                </div>
            `).join('')}
            ${state.coupon ? `<div class="checkout-summary-item"><div></div><span>Discount: -${formatPrice(totals.discount)}</span></div>` : ''}
            <div class="checkout-summary-total">
                <span>Total</span>
                <span>${formatPrice(totals.total)}</span>
            </div>
        `;
    }

    function initCheckout() {
        $('#checkout-modal-close').addEventListener('click', closeCheckout);
        $('#checkout-cancel').addEventListener('click', closeCheckout);

        $('#checkout-to-payment').addEventListener('click', () => {
            if (validateShipping()) {
                state.checkoutStep = 2;
                updateCheckoutStep();
            }
        });

        $('#checkout-back-shipping').addEventListener('click', () => {
            state.checkoutStep = 1;
            updateCheckoutStep();
        });

        $('#checkout-to-review').addEventListener('click', () => {
            if (validatePayment()) {
                state.checkoutStep = 3;
                updateCheckoutStep();
            }
        });

        $('#checkout-back-payment').addEventListener('click', () => {
            state.checkoutStep = 2;
            updateCheckoutStep();
        });

        $('#place-order-btn').addEventListener('click', () => {
            const totals = calculateTotals();
            const order = {
                id: generateOrderId(),
                date: new Date().toISOString(),
                items: state.cart.map(item => ({ ...item })),
                totals: totals,
                shipping: {
                    firstName: $('#ship-first').value,
                    lastName: $('#ship-last').value,
                    email: $('#ship-email').value,
                    address: $('#ship-address').value,
                    city: $('#ship-city').value,
                    zip: $('#ship-zip').value,
                    country: $('#ship-country').value
                },
                status: 'processing'
            };

            state.orders.unshift(order);
            localStorage.setItem('imave_orders', JSON.stringify(state.orders));

            // Clear cart and coupon
            state.cart = [];
            state.coupon = null;
            localStorage.removeItem('imave_coupon');
            saveCart();

            $('#order-id').textContent = 'Order ' + order.id;
            state.checkoutStep = 4;
            updateCheckoutStep();
            renderOrders();
            showToast('Order placed successfully!', 'success');
        });

        $('#checkout-done').addEventListener('click', () => {
            closeCheckout();
            document.getElementById('order-history').scrollIntoView({ behavior: 'smooth' });
        });

        // Card formatting
        $('#card-number').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });

        $('#card-expiry').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });

        $('#card-cvc').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }

    // =====================
    // Order History
    // =====================
    function renderOrders() {
        const container = $('#orders-list');

        if (state.orders.length === 0) {
            container.innerHTML = `
                <div class="orders-empty">
                    <div class="empty-icon"><i class="fas fa-box-open"></i></div>
                    <h3>No orders yet</h3>
                    <p>Complete a purchase to see your order history here.</p>
                    <a href="#products" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }

        container.innerHTML = state.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id-text">${order.id}</div>
                        <div class="order-date">${formatDate(order.date)}</div>
                    </div>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item-thumb" title="${item.title}">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <span>${order.items.reduce((sum, i) => sum + i.quantity, 0)} items</span>
                    <span class="order-total">${formatPrice(order.totals.total)}</span>
                </div>
            </div>
        `).join('');
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
            <div class="product-card reveal" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    ${getBadgeHTML(product.badge)}
                    <div class="product-actions">
                        <button class="product-action-btn wishlist-btn ${state.wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}" title="Add to Wishlist">
                            <i class="${state.wishlist.includes(product.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
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

        $$('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => toggleWishlist(btn.dataset.id, e));
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
        $$('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentCategory = btn.dataset.category;
                renderProducts();
            });
        });

        $('#sort-select').addEventListener('change', (e) => {
            state.currentSort = e.target.value;
            renderProducts();
        });

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

        // Track recently viewed
        addToRecentlyViewed(product);

        const modal = $('#product-modal');
        const body = $('#modal-body');

        const sizeOptions = product.sizes ? product.sizes.map((size, i) => `
            <label class="variant-option">
                <input type="radio" name="size" value="${size}" ${i === 0 ? 'checked' : ''}>
                <span class="variant-label">${size}</span>
            </label>
        `).join('') : '';

        const colorOptions = product.colors && product.colors.length ? product.colors.map((color, i) => `
            <label class="variant-option">
                <input type="radio" name="color" value="${color}" ${i === 0 ? 'checked' : ''}>
                <span class="variant-label color-label" style="background: ${color};"></span>
            </label>
        `).join('') : '';

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

                    ${sizeOptions ? `
                    <div class="product-variants">
                        <div class="variant-group">
                            <label>Size</label>
                            <div class="variant-options">${sizeOptions}</div>
                        </div>
                    </div>` : ''}

                    ${colorOptions ? `
                    <div class="product-variants">
                        <div class="variant-group">
                            <label>Color</label>
                            <div class="variant-options">${colorOptions}</div>
                        </div>
                    </div>` : ''}

                    <ul class="product-features" style="margin-bottom: 28px; color: var(--gray);">
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--success); margin-right: 8px;"></i> Premium quality materials</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--success); margin-right: 8px;"></i> Worldwide shipping</li>
                        <li style="margin-bottom: 8px;"><i class="fas fa-check" style="color: var(--success); margin-right: 8px;"></i> 30-day satisfaction guarantee</li>
                    </ul>
                    <div class="product-modal-actions">
                        <button class="btn btn-primary btn-lg add-modal-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-bag"></i> Add to Cart
                        </button>
                        <button class="btn btn-outline btn-lg modal-wishlist ${state.wishlist.includes(product.id) ? 'active' : ''}" data-id="${product.id}">
                            <i class="${state.wishlist.includes(product.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="btn btn-outline btn-lg modal-close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        $('.add-modal-cart').addEventListener('click', () => {
            const sizeEl = document.querySelector('input[name="size"]:checked');
            const colorEl = document.querySelector('input[name="color"]:checked');
            addToCart(product, 1, {
                size: sizeEl ? sizeEl.value : null,
                color: colorEl ? colorEl.value : null
            });
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });

        $('.modal-wishlist').addEventListener('click', function() {
            toggleWishlist(product.id);
            this.classList.toggle('active');
            this.querySelector('i').className = state.wishlist.includes(product.id) ? 'fas fa-heart' : 'far fa-heart';
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
    // Recently Viewed
    // =====================
    function addToRecentlyViewed(product) {
        state.recentlyViewed = state.recentlyViewed.filter(p => p.id !== product.id);
        state.recentlyViewed.unshift(product);
        if (state.recentlyViewed.length > 4) state.recentlyViewed.pop();
        localStorage.setItem('imave_recently_viewed', JSON.stringify(state.recentlyViewed));
        renderRecentlyViewed();
    }

    function renderRecentlyViewed() {
        const section = $('#recently-viewed');
        const grid = $('#recently-viewed-grid');

        if (state.recentlyViewed.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        grid.innerHTML = state.recentlyViewed.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    <div class="product-actions">
                        <button class="product-action-btn quick-view" data-id="${product.id}"><i class="fas fa-eye"></i></button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-meta">
                        <span class="product-price">${formatPrice(product.price)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        $$('#recently-viewed-grid .product-card').forEach(card => {
            card.addEventListener('click', () => openProductModal(card.dataset.id));
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

        if (step === 4) updateReview();
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

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'));
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'));
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

        $$('.next-step').forEach(btn => {
            btn.addEventListener('click', () => {
                const nextStep = parseInt(btn.dataset.next);

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
                if (nextStep === 5 && !state.uploadData.title) {
                    showToast('Please add a design title', 'warning');
                    return;
                }

                goToStep(nextStep);
            });
        });

        $$('.prev-step').forEach(btn => {
            btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.prev)));
        });

        $$('.upload-steps .step').forEach(step => {
            step.addEventListener('click', () => {
                const targetStep = parseInt(step.dataset.step);
                if (targetStep === 1 || state.uploadData.file) {
                    goToStep(targetStep);
                }
            });
        });

        $$('input[name="style"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                state.uploadData.style = e.target.value;
            });
        });

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
            <div class="upload-card reveal" data-id="${upload.id}">
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
    // Account
    // =====================
    function initAccount() {
        const toggle = $('#user-toggle');
        const modal = $('#account-modal');
        const close = $('#account-modal-close');

        toggle.addEventListener('click', () => {
            $('#account-name').value = state.account.name || '';
            $('#account-email').value = state.account.email || '';
            $('#account-phone').value = state.account.phone || '';
            updateAccountStats();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        close.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });

        $('#account-form').addEventListener('submit', (e) => {
            e.preventDefault();
            state.account = {
                name: $('#account-name').value.trim(),
                email: $('#account-email').value.trim(),
                phone: $('#account-phone').value.trim()
            };
            localStorage.setItem('imave_account', JSON.stringify(state.account));
            updateAccountStats();
            showToast('Profile saved successfully', 'success');
        });
    }

    function updateAccountStats() {
        $('#account-orders').textContent = state.orders.length;
        $('#account-uploads').textContent = state.uploads.length;
        $('#account-wishlist').textContent = state.wishlist.length;
    }

    // =====================
    // Back to Top
    // =====================
    function initBackToTop() {
        const btn = $('#back-to-top');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =====================
    // Cookie Consent
    // =====================
    function initCookieConsent() {
        const banner = $('#cookie-banner');
        const accepted = localStorage.getItem('imave_cookies');

        if (!accepted) {
            setTimeout(() => banner.classList.add('visible'), 1000);
        }

        $('#cookie-accept').addEventListener('click', () => {
            localStorage.setItem('imave_cookies', 'accepted');
            banner.classList.remove('visible');
        });

        $('#cookie-decline').addEventListener('click', () => {
            localStorage.setItem('imave_cookies', 'declined');
            banner.classList.remove('visible');
        });
    }

    // =====================
    // Scroll Reveal
    // =====================
    function initScrollReveal() {
        const reveals = $$('.reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(el => observer.observe(el));
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

            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                e.target.reset();
                showToast("Message sent! We'll get back to you soon.", 'success');
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
        initCheckout();
        initProducts();
        initModalClose();
        initUploadWizard();
        renderUploads();
        renderRecentlyViewed();
        renderOrders();
        initAITools();
        initAccount();
        initBackToTop();
        initCookieConsent();
        initScrollReveal();
        initContact();
        initFooter();
        updateWishlistUI();
        updateAccountStats();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
