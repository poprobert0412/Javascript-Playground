// ============================================================================
// 🗄️ database.js — Bază de date DUAL: JSON (local) + PostgreSQL (Render)
// ============================================================================
//
// Dacă există variabila DATABASE_URL (setată automat de Render),
// folosim PostgreSQL. Altfel, folosim fișierul JSON local.
//
// ============================================================================

const fs = require('fs');
const path = require('path');

const IS_PRODUCTION = !!process.env.DATABASE_URL;

// ============================================================================
// VARIANTA 1: PostgreSQL (pentru Render / producție)
// ============================================================================

let pgPool = null;

async function initPostgres() {
    const { Pool } = require('pg');
    pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    // Creăm tabelele dacă nu există
    await pgPool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS progress (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            progress_data JSONB DEFAULT '{}',
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);

    console.log('  ✅ PostgreSQL conectat și tabele create');
}

const pgDB = {
    async createUser(username, email, passwordHash) {
        const res = await pgPool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
            [username, email, passwordHash]
        );
        return res.rows[0];
    },
    async findUserByUsername(username) {
        const res = await pgPool.query('SELECT * FROM users WHERE username = $1', [username]);
        return res.rows[0] || null;
    },
    async findUserByEmail(email) {
        const res = await pgPool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rows[0] || null;
    },
    async findUserById(id) {
        const res = await pgPool.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [id]);
        return res.rows[0] || null;
    },
    async getProgress(userId) {
        const res = await pgPool.query('SELECT progress_data, updated_at FROM progress WHERE user_id = $1', [userId]);
        if (!res.rows[0]) return null;
        return { data: res.rows[0].progress_data, updated_at: res.rows[0].updated_at };
    },
    async saveProgress(userId, progressData) {
        await pgPool.query(`
            INSERT INTO progress (user_id, progress_data, updated_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                progress_data = $2,
                updated_at = NOW()
        `, [userId, JSON.stringify(progressData)]);
    },
};

// ============================================================================
// VARIANTA 2: JSON File (pentru dezvoltare locală)
// ============================================================================

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const DEFAULT_DB = { users: [], progress: {}, nextId: 1 };

if (!IS_PRODUCTION && !fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDB() {
    try {
        if (fs.existsSync(DB_PATH)) return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (err) { console.error('⚠️ DB read error:', err.message); }
    return { ...DEFAULT_DB };
}

function saveDB(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

const jsonDB = {
    async createUser(username, email, passwordHash) {
        const db = loadDB();
        const id = db.nextId++;
        const user = { id, username, email, password_hash: passwordHash, created_at: new Date().toISOString() };
        db.users.push(user);
        saveDB(db);
        return user;
    },
    async findUserByUsername(username) {
        return loadDB().users.find(u => u.username === username) || null;
    },
    async findUserByEmail(email) {
        return loadDB().users.find(u => u.email === email) || null;
    },
    async findUserById(id) {
        const user = loadDB().users.find(u => u.id === id);
        if (!user) return null;
        const { password_hash, ...safe } = user;
        return safe;
    },
    async getProgress(userId) {
        return loadDB().progress[userId] || null;
    },
    async saveProgress(userId, progressData) {
        const db = loadDB();
        db.progress[userId] = { data: progressData, updated_at: new Date().toISOString() };
        saveDB(db);
    },
};

// ============================================================================
// EXPORT — selectăm automat varianta potrivită
// ============================================================================

const database = IS_PRODUCTION ? pgDB : jsonDB;
database.init = IS_PRODUCTION ? initPostgres : async () => { console.log('  ✅ JSON DB local (server/data/db.json)'); };
database.IS_PRODUCTION = IS_PRODUCTION;
database.pgPool = IS_PRODUCTION ? () => pgPool : null;

module.exports = database;
