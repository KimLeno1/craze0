import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { db } from './api/db';

// Import Routers
import authRouter from './api/auth';
import supplierRouter from './api/suppliers';
import productRouter from './api/products';
import orderRouter from './api/orders';
import userRouter from './api/users';
import socialRouter from './api/social';
import payForMeRouter, { processExpiredRequests } from './api/pay-for-me';
import adminRouter from './api/admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- Modular API Routes ---
  app.use('/api', authRouter);
  app.use('/api', userRouter);
  app.use('/api/social', socialRouter);
  app.use('/api/suppliers', supplierRouter);
  app.use('/api/products', productRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/pay-for-me', payForMeRouter);
  app.use('/api/admin', adminRouter);

  // Process expired sponsorship requests every hour
  setInterval(processExpiredRequests, 60 * 60 * 1000);
  processExpiredRequests(); // Run once on startup

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
