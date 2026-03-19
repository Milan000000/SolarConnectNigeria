import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'solar-connect-secret-key';
const ADMIN_PASSWORD = 'milan000000';

// Initialize Database
const db = new Database('solarconnect.db');
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    propertyType TEXT NOT NULL,
    budget TEXT NOT NULL,
    systemType TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'new',
    installerNotes TEXT,
    assignedInstallerId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS installers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    businessName TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    location TEXT NOT NULL,
    subscriptionStatus TEXT DEFAULT 'inactive',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for rate-limiting behind Nginx
  app.set('trust proxy', 1);

  // Security & Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for easier Vite integration
  }));
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Rate limiting for lead submission
  const leadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
  });

  // Auth Middleware
  const authenticateAdmin = (req: any, res: any, next: any) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // --- API ROUTES ---

  // Admin Login
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
      res.cookie('admin_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });
      return res.json({ success: true });
    }
    res.status(401).json({ error: 'Invalid password' });
  });

  app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
  });

  app.get('/api/admin/check', (req, res) => {
    const token = req.cookies.admin_token;
    if (!token) return res.json({ authenticated: false });
    try {
      jwt.verify(token, JWT_SECRET);
      res.json({ authenticated: true });
    } catch (err) {
      res.json({ authenticated: false });
    }
  });

  // Public: Get Recommended Installers (First 3)
  app.get('/api/installers/recommended', (req, res) => {
    try {
      const installers = db.prepare('SELECT id, businessName FROM installers ORDER BY createdAt ASC LIMIT 3').all();
      res.json(installers);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch recommended installers' });
    }
  });

  // Public: Submit Lead
  app.post('/api/leads', leadLimiter, (req, res) => {
    const { name, phone, location, propertyType, budget, systemType, notes, assignedInstallerId } = req.body;
    
    if (!name || !phone || !location || !propertyType || !budget || !systemType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO leads (name, phone, location, propertyType, budget, systemType, notes, assignedInstallerId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(name, phone, location, propertyType, budget, systemType, notes, assignedInstallerId || null);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to submit lead' });
    }
  });

  // Admin: Get Stats
  app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
    const totalLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get() as any;
    const todayLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE date(createdAt) = date('now')").get() as any;
    const weekLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE date(createdAt) >= date('now', '-7 days')").get() as any;
    
    res.json({
      total: totalLeads.count,
      today: todayLeads.count,
      week: weekLeads.count
    });
  });

  // Admin: Lead Management
  app.get('/api/admin/leads', authenticateAdmin, (req, res) => {
    const leads = db.prepare('SELECT * FROM leads ORDER BY createdAt DESC').all();
    res.json(leads);
  });

  app.patch('/api/admin/leads/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const { status, installerNotes, assignedInstallerId } = req.body;
    
    try {
      const stmt = db.prepare(`
        UPDATE leads 
        SET status = COALESCE(?, status), 
            installerNotes = COALESCE(?, installerNotes),
            assignedInstallerId = COALESCE(?, assignedInstallerId)
        WHERE id = ?
      `);
      stmt.run(status, installerNotes, assignedInstallerId, id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  });

  app.delete('/api/admin/leads/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM leads WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Admin: Installer Management
  app.get('/api/admin/installers', authenticateAdmin, (req, res) => {
    const installers = db.prepare('SELECT * FROM installers ORDER BY createdAt DESC').all();
    res.json(installers);
  });

  app.post('/api/admin/installers', authenticateAdmin, (req, res) => {
    const { businessName, phone, email, location, subscriptionStatus } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO installers (businessName, phone, email, location, subscriptionStatus)
        VALUES (?, ?, ?, ?, ?)
      `);
      stmt.run(businessName, phone, email, location, subscriptionStatus || 'inactive');
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add installer' });
    }
  });

  app.patch('/api/admin/installers/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const { businessName, phone, email, location, subscriptionStatus } = req.body;
    try {
      const stmt = db.prepare(`
        UPDATE installers 
        SET businessName = COALESCE(?, businessName),
            phone = COALESCE(?, phone),
            email = COALESCE(?, email),
            location = COALESCE(?, location),
            subscriptionStatus = COALESCE(?, subscriptionStatus)
        WHERE id = ?
      `);
      stmt.run(businessName, phone, email, location, subscriptionStatus, id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Update failed' });
    }
  });

  app.delete('/api/admin/installers/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM installers WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Admin: Export CSV
  app.get('/api/admin/export', authenticateAdmin, (req, res) => {
    const leads = db.prepare('SELECT * FROM leads ORDER BY createdAt DESC').all() as any[];
    const headers = ['ID', 'Name', 'Phone', 'Location', 'Property', 'Budget', 'System', 'Status', 'Date'];
    const rows = leads.map(l => [
      l.id, l.name, l.phone, l.location, l.propertyType, l.budget, l.systemType, l.status, l.createdAt
    ]);
    
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csvContent);
  });

  // --- VITE MIDDLEWARE ---

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
    console.log(`SolarConnect Server running on http://localhost:${PORT}`);
  });
}

startServer();
