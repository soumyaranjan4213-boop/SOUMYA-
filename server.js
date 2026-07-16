const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|bmp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Serve static files from root

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded or invalid file type.' });
  }
  res.json({
    success: true,
    message: 'Image uploaded successfully',
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size
    }
  });
});

// List uploads endpoint
app.get('/api/uploads', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not read uploads.' });
    }
    const imageFiles = files.filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext);
    });
    const uploads = imageFiles.map(file => ({
      filename: file,
      url: `/uploads/${file}`,
      originalname: file,
      timestamp: fs.statSync(path.join(uploadDir, file)).mtimeMs
    }));
    res.json({ success: true, uploads });
  });
});

// Product catalog
const products = [
  { id: 1, name: "Lumina Art Print", category: "Art", price: 48.00, image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=600&fit=crop&q=80", tag: "Bestseller", description: "A high-quality museum-grade art print on archival paper." },
  { id: 2, name: "Aether Studio Lamp", category: "Decor", price: 128.00, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop&q=80", tag: "New", description: "Minimalist ceramic studio lamp with warm LED glow." },
  { id: 3, name: "Meridian Ceramic Vase", category: "Decor", price: 85.00, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&q=80", tag: "Unique", description: "Hand-thrown stoneware vase with matte charcoal finish." },
  { id: 4, name: "Crest Linen Throw", category: "Textiles", price: 62.00, image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop&q=80", tag: "Popular", description: "Organic linen throw in natural oat with subtle texture." },
  { id: 5, name: "Nocturne Abstract Canvas", category: "Art", price: 220.00, image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=600&fit=crop&q=80", tag: "Limited", description: "Large format abstract painting with deep navy and gold accents." },
  { id: 6, name: "Terra Planter Set", category: "Decor", price: 72.00, image: "https://images.unsplash.com/photo-1466692476868-aef5ae4a5584?w=600&h=600&fit=crop&q=80", tag: "New", description: "Hand-painted terracotta planters with drainage saucers." },
  { id: 7, name: "Sable Wool Rug", category: "Textiles", price: 340.00, image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=600&fit=crop&q=80", tag: "Bestseller", description: "Hand-tufted wool rug with abstract geometric pattern." },
  { id: 8, name: "Aurora Glass Sculpture", category: "Art", price: 195.00, image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=600&fit=crop&q=80", tag: "Unique", description: "Blown glass sculpture with iridescent amber and cobalt tones." }
];

app.get('/api/products', (req, res) => {
  res.json({ success: true, products });
});

// Simple in-memory cart state (optional)
let cart = [];

app.get('/api/cart', (req, res) => {
  res.json({ success: true, cart });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  res.json({ success: true, cart });
});

app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload endpoint: POST /api/upload`);
  console.log(`Uploads folder: ${uploadDir}`);
});
