import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure directories exist
const uploadDirs = ['uploads/products', 'uploads/feed'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Product storage configuration
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    // Renaming to fit the product name
    // We expect the product name in req.body.name
    const productName = req.body.name || 'product';
    const sanitizedName = productName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const ext = path.extname(file.originalname);
    cb(null, `${sanitizedName}_${Date.now()}${ext}`);
  }
});

// Feed storage configuration
const feedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/feed');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `feed_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`);
  }
});

export const productUpload = multer({ storage: productStorage });
export const feedUpload = multer({ storage: feedStorage });
