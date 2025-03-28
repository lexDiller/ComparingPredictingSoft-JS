// src/server/index.js
import express from 'express';
import pg from 'pg';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

////////////////////////////////////////
// 1. Определяем __dirname в ESM
////////////////////////////////////////
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

////////////////////////////////////////
// 2. Создаём Express-приложение
////////////////////////////////////////
const app = express();
const PORT = process.env.SERVER_PORT || 5000;

////////////////////////////////////////
// 3. Настраиваем CORS
////////////////////////////////////////
const corsOptions = {
  origin: ['http://localhost:5005', 'http://localhost:5000', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

////////////////////////////////////////
// 4. Middleware
////////////////////////////////////////
app.use(express.json());

// Логируем все запросы
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

////////////////////////////////////////
// 5. Настройка PostgreSQL
////////////////////////////////////////
const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
  host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'marbling_db',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
  port: process.env.DB_PORT || process.env.POSTGRES_PORT || 4444,
});

// Тестовое подключение
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connection successful at:', res.rows[0].now);
  }
});

////////////////////////////////////////
// 6. API-роуты
////////////////////////////////////////
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/carcass', async (req, res) => {
  try {
    console.log('GET /api/carcass - Fetching all carcass data');
    const result = await pool.query('SELECT * FROM carcass_analysis');
    console.log(`Retrieved ${result.rows.length} records`);
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/carcass/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/carcass/${id} - Fetching carcass detail`);
    const result = await pool.query('SELECT * FROM carcass_analysis WHERE carcass_id = $1', [id]);
    if (result.rows.length === 0) {
      console.log(`Carcass ${id} not found`);
      return res.status(404).json({ error: 'Carcass not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching carcass ${id}:`, err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Пример check-images
app.get('/api/check-images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/check-images/${id} - Checking image availability`);

    const extensions = ['.png', '.jpg', '.jpeg', '.bmp', '.webp'];
    const checkFileWithExtensions = (basePath) => {
      for (const ext of extensions) {
        const fullPath = `${basePath}${ext}`;
        console.log(`Checking path: ${fullPath}`);
        if (fs.existsSync(fullPath)) {
          return { exists: true, path: fullPath, extension: ext };
        }
      }
      return { exists: false, path: null, extension: null };
    };

    const rawBasePath = path.join(__dirname, '../../public/images/original_images', id);
    const origBasePath = path.join(__dirname, '../../public/images/legacy_images', id);
    const newBasePath = path.join(__dirname, '../../public/images/processed_images', id);

    const rawResult = checkFileWithExtensions(rawBasePath);
    const origResult = checkFileWithExtensions(origBasePath);
    const newResult = checkFileWithExtensions(newBasePath);

    const images = {
      raw: rawResult.exists,
      orig: origResult.exists,
      new: newResult.exists,
      paths: {
        raw: rawResult.exists ? `${id}${rawResult.extension}` : null,
        orig: origResult.exists ? `${id}${origResult.extension}` : null,
        new: newResult.exists ? `${id}${newResult.extension}` : null
      }
    };

    app.use(
      '/images',
      express.static(path.join(__dirname, '../../public/images'))
    );

    console.log('Image availability:', images);
    res.json(images);
  } catch (err) {
    console.error(`Error checking images for ${req.params.id}:`, err);
    res.status(500).json({ error: 'Error checking images' });
  }
});

////////////////////////////////////////
// 7. Раздача статики (Production only)
////////////////////////////////////////
if (process.env.NODE_ENV === 'production') {
  // Папка dist находится на два уровня выше src/server/
  app.use(express.static(path.join(__dirname, '../../dist')));

  // Все остальные запросы -> index.html из dist
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
} else {
  console.log('Development mode: фронтенд обслуживается Vite Dev Server.');
}

////////////////////////////////////////
// 8. Запуск сервера
////////////////////////////////////////
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Frontend (production) will be available at http://localhost:${PORT}`);
});
