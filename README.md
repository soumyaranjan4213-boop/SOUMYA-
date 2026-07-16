# IMAVE — Premium AI Design Marketplace

A fully functional, professional premium e-commerce website built for uploading designs, discovering unique products, and using AI-powered creative tools.

## Live Preview

Open `index.html` in any modern web browser, or serve the folder with a static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Features Implemented

### 1. Premium E-Commerce Experience
- Responsive, modern UI with premium gradients, animations, and professional typography
- Fixed glass-morphism header with smooth scroll navigation
- Hero section with floating product cards and statistics
- Curated product catalog with categories, badges, ratings, and prices
- Product quick-view modal with size/color variants
- Recently viewed products section
- Scroll reveal animations and back-to-top button
- Cookie consent banner

### 2. Functional Shopping Cart
- Add/remove products with size/color options
- Quantity controls
- Persistent cart using `localStorage`
- Coupon code support (`SAVE10`, `SAVE20`, `IMV50`, `WELCOME`)
- Tax calculation and multi-step checkout

### 3. Full Checkout Flow
- Step 1: Shipping information
- Step 2: Payment method (Card / PayPal / Apple Pay)
- Step 3: Order review
- Step 4: Confirmation with order ID
- Order history saved to `localStorage`

### 4. Upload Design Studio (5 Steps)
The upload flow has been rebuilt into exactly **5 steps** (previously 6):
1. **Upload** — drag & drop or browse image files
2. **Style** — select a design style
3. **Customize** — title, description, category, and price
4. **Review** — preview before publishing
5. **Publish** — save to My Uploads

- "Product availability" text sections have been removed.
- Published uploads are saved in `localStorage` and displayed in the **My Uploads** section.

### 5. My Uploads Fix
- User uploads are now clearly tagged as **"Your Upload"**.
- They are no longer mislabeled as AI-generated images.
- Upload cards are professional, hover-animated, and deletable.

### 6. AI Tools Section
- Dedicated AI Text & Design Tools section.
- Tools are clearly tagged as **"AI Generated"**.
- Caption generator and tag suggestion generator.

### 7. Wishlist
- Heart icon on product cards and in product modal
- Persistent wishlist using `localStorage`
- Wishlist count in header

### 8. User Account
- Account modal accessible from header user icon
- Save profile name, email, and phone
- Live stats: orders, uploads, wishlist count

### 9. Get in Touch / Email Support
- Email support icon and link point to `mailto:imaveofficial@gmail.com`.
- Fully functional contact form with validation and simulated submission.
- Social media links and studio address.

### 10. Debugged & Polished
- Smooth-scroll navigation with active states.
- All buttons and links functional (cart, search, filters, modals, forms).
- Mobile-responsive hamburger menu.
- Toast notifications for feedback.
- No broken placeholders.

## Test Coupons
Use these codes in the cart:
- `SAVE10` — 10% off
- `SAVE20` — 20% off
- `IMV50` — $50 off
- `WELCOME` — 15% off

## File Structure

```
SOUMYA-/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # Premium styling and responsive design
├── js/
│   └── main.js         # Frontend logic, cart, uploads, AI tools, forms
└── README.md           # This file
```

## Technologies Used
- HTML5
- CSS3 (custom properties, flexbox, grid, animations)
- Vanilla JavaScript (ES6+)
- Font Awesome icons
- Google Fonts (Inter + Playfair Display)
- localStorage for data persistence

## Browser Support
Works in all modern browsers including Chrome, Firefox, Safari, and Edge.

---

Built for the IMAVE brand by Arena.ai Agent Mode.
