// ============================================================================
// 🖥️ server.js — Serverul principal Express
// ============================================================================
//
// PORNIRE LOCAL:  npm start  →  http://localhost:3000
// PE RENDER:      Pornește automat cu DATABASE_URL setat
//
// ============================================================================

const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./database');

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Trust proxy (necesar pe Render pentru secure cookies prin HTTPS)
if (db.IS_PRODUCTION) {
    app.set('trust proxy', 1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// PORNIRE SERVER
// ============================================================================

async function start() {
    // Inițializăm baza de date
    await db.init();

    // Session store: PostgreSQL pe Render, fișiere local
    let store;
    if (db.IS_PRODUCTION) {
        const pgSession = require('connect-pg-simple')(session);
        store = new pgSession({
            pool: db.pgPool(),
            createTableIfMissing: true,
        });
        console.log('  📦 Sesiuni: PostgreSQL');
    } else {
        const FileStore = require('session-file-store')(session);
        store = new FileStore({
            path: path.join(__dirname, 'sessions'),
            ttl: 7 * 24 * 60 * 60,
            retries: 0,
            logFn: function () { },
        });
        console.log('  📦 Sesiuni: Fișiere locale');
    }

    // Configurăm sesiunile ÎNAINTE de rute
    app.use(session({
        store,
        secret: process.env.SESSION_SECRET || 'js-playground-secret-key-2026',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax',
            secure: db.IS_PRODUCTION,
        }
    }));

    // Servim fișierele statice
    app.use(express.static(path.join(__dirname, '..')));

    // Rute API (DUPĂ session middleware!)
    app.use('/api', authRoutes);
    app.use('/api/progress', progressRoutes);

    app.listen(PORT, () => {
        console.log('');
        console.log('  ⚡ JS Playground Server');
        console.log('  ========================');
        console.log(`  🌐 URL:      http://localhost:${PORT}`);
        console.log(`  🔐 Login:    http://localhost:${PORT}/login.html`);
        console.log(`  🌍 Mode:     ${db.IS_PRODUCTION ? 'PRODUCȚIE (PostgreSQL)' : 'LOCAL (JSON file)'}`);
        console.log('');
        if (!db.IS_PRODUCTION) {
            console.log('  Apasă Ctrl+C pentru a opri serverul.');
            console.log('');
        }
    });
}

start().catch(err => {
    console.error('❌ Eroare la pornirea serverului:', err);
    process.exit(1);
});
