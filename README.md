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
- Product quick-view modal with add-to-cart functionality

### 2. Functional Shopping Cart
- Add/remove products
- Quantity controls
- Persistent cart using `localStorage`
- Tax calculation and checkout confirmation modal

### 3. Upload Design Studio (5 Steps)
The upload flow has been rebuilt into exactly **5 steps** (previously 6):
1. **Upload** — drag & drop or browse image files
2. **Style** — select a design style
3. **Customize** — title, description, category, and price
4. **Review** — preview before publishing
5. **Publish** — save to My Uploads

- "Product availability" text sections have been removed.
- Published uploads are saved in `localStorage` and displayed in the **My Uploads** section.

### 4. My Uploads Fix
- User uploads are now clearly tagged as **"Your Upload"**.
- They are no longer mislabeled as AI-generated images.
- Upload cards are interactive, deletable, and professionally styled.

### 5. AI Tools Section
- Dedicated AI Text & Design Tools section.
- Tools are clearly tagged as **"AI Generated"**.
- Caption generator and tag suggestion generator.

### 6. Get in Touch / Email Support
- Email support icon and link point to `mailto:imaveofficial@gmail.com`.
- Fully functional contact form with validation and simulated submission.
- Social media links and studio address.

### 7. Debugged & Polished
- All navigation links scroll smoothly to the correct sections.
- Buttons and interactive elements have hover/focus states.
- Search bar toggles and filters products.
- Product filters and sorting work correctly.
- Mobile-responsive hamburger menu.
- Toast notifications for user feedback.
- No broken links or placeholder dead ends.

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
