const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

if (db.IS_PRODUCTION) {
    app.set('trust proxy', 1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Prea multe cereri. Încearcă din nou în 15 minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { error: 'Prea multe încercări de autentificare. Așteaptă 15 minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

async function start() {
    await db.init();

    let store;
    if (db.IS_PRODUCTION) {
        const pgSession = require('connect-pg-simple')(session);
        store = new pgSession({
            pool: db.pgPool(),
            createTableIfMissing: true,
        });
    } else {
        const FileStore = require('session-file-store')(session);
        store = new FileStore({
            path: path.join(__dirname, 'sessions'),
            ttl: 7 * 24 * 60 * 60,
            retries: 0,
            logFn: function () { },
        });
    }

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

    app.use(express.static(path.join(__dirname, '..', 'public')));

    app.use('/api/login', authLimiter);
    app.use('/api/register', authLimiter);
    app.use('/api/forgot-password', authLimiter);
    app.use('/api', apiLimiter);

    app.use('/api', authRoutes);
    app.use('/api/progress', progressRoutes);
    app.use('/api/admin', adminRoutes);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Mode: ${db.IS_PRODUCTION ? 'production' : 'development'}`);
    });
}

start().catch(err => {
    console.error('Server startup error:', err);
    process.exit(1);
});
