const fs = require('fs');
const path = require('path');

const IS_PRODUCTION = !!process.env.DATABASE_URL;

let pgPool = null;

async function initPostgres() {
    const { Pool } = require('pg');
    pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    const client = await pgPool.connect();
    console.log('PostgreSQL connected');
    client.release();

    await pgPool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
    await pgPool.query(`
        CREATE TABLE IF NOT EXISTS progress (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            progress_data JSONB DEFAULT '{}',
            updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
    await pgPool.query(`
        CREATE TABLE IF NOT EXISTS password_resets (
            token TEXT PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            expires_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `);
    console.log('Tables ready');
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

    async updateUser(id, { username, email }) {
        if (username && email) {
            await pgPool.query('UPDATE users SET username=$1, email=$2 WHERE id=$3', [username, email, id]);
        } else if (username) {
            await pgPool.query('UPDATE users SET username=$1 WHERE id=$2', [username, id]);
        } else if (email) {
            await pgPool.query('UPDATE users SET email=$1 WHERE id=$2', [email, id]);
        }
    },

    async updatePassword(id, hash) {
        await pgPool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, id]);
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
            ON CONFLICT (user_id) DO UPDATE SET progress_data = $2, updated_at = NOW()
        `, [userId, JSON.stringify(progressData)]);
    },

    async createResetToken(userId, token, expiresAt) {
        await pgPool.query('DELETE FROM password_resets WHERE user_id = $1', [userId]);
        await pgPool.query(
            'INSERT INTO password_resets (token, user_id, expires_at) VALUES ($1, $2, $3)',
            [token, userId, expiresAt]
        );
    },

    async findResetToken(token) {
        const res = await pgPool.query('SELECT * FROM password_resets WHERE token = $1', [token]);
        return res.rows[0] || null;
    },

    async deleteResetToken(token) {
        await pgPool.query('DELETE FROM password_resets WHERE token = $1', [token]);
    },

    async getLeaderboard() {
        const res = await pgPool.query(`
            SELECT u.id, u.username, u.created_at, p.progress_data
            FROM users u
            LEFT JOIN progress p ON u.id = p.user_id
            ORDER BY u.created_at ASC
        `);
        return res.rows.map(row => {
            const data = row.progress_data || {};
            const pd = data['js-playground-progress'] ? JSON.parse(data['js-playground-progress']) : {};
            const achievements = data['js-playground-achievements'] ? JSON.parse(data['js-playground-achievements']) : [];
            return {
                id: row.id,
                username: row.username,
                lessons: pd.lessons ? pd.lessons.length : 0,
                exercises: pd.exercises ? pd.exercises.length : 0,
                quizzes: pd.quizzes ? pd.quizzes.length : 0,
                challenges: pd.challenges ? pd.challenges.length : 0,
                achievements: achievements.length,
                totalScore: (pd.lessons ? pd.lessons.length * 10 : 0)
                    + (pd.exercises ? pd.exercises.length * 15 : 0)
                    + (pd.quizzes ? pd.quizzes.length * 10 : 0)
                    + (pd.challenges ? pd.challenges.length * 20 : 0)
                    + (achievements.length * 25),
                joinedAt: row.created_at,
            };
        }).sort((a, b) => b.totalScore - a.totalScore);
    },
};

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const DEFAULT_DB = { users: [], progress: {}, resetTokens: [], nextId: 1 };

if (!IS_PRODUCTION && !fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDB() {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
            if (!data.resetTokens) data.resetTokens = [];
            return data;
        }
    } catch (err) { console.error('DB read error:', err.message); }
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

    async updateUser(id, { username, email }) {
        const db = loadDB();
        const user = db.users.find(u => u.id === id);
        if (!user) return;
        if (username) user.username = username;
        if (email) user.email = email;
        saveDB(db);
    },

    async updatePassword(id, hash) {
        const db = loadDB();
        const user = db.users.find(u => u.id === id);
        if (user) {
            user.password_hash = hash;
            saveDB(db);
        }
    },

    async getProgress(userId) {
        return loadDB().progress[userId] || null;
    },

    async saveProgress(userId, progressData) {
        const db = loadDB();
        db.progress[userId] = { data: progressData, updated_at: new Date().toISOString() };
        saveDB(db);
    },

    async createResetToken(userId, token, expiresAt) {
        const db = loadDB();
        db.resetTokens = db.resetTokens.filter(t => t.user_id !== userId);
        db.resetTokens.push({ token, user_id: userId, expires_at: expiresAt });
        saveDB(db);
    },

    async findResetToken(token) {
        return loadDB().resetTokens.find(t => t.token === token) || null;
    },

    async deleteResetToken(token) {
        const db = loadDB();
        db.resetTokens = db.resetTokens.filter(t => t.token !== token);
        saveDB(db);
    },

    async getLeaderboard() {
        const db = loadDB();
        return db.users.map(user => {
            const record = db.progress[user.id];
            const data = record ? record.data : {};
            const pd = data['js-playground-progress'] ? JSON.parse(data['js-playground-progress']) : {};
            const achievements = data['js-playground-achievements'] ? JSON.parse(data['js-playground-achievements']) : [];
            return {
                id: user.id,
                username: user.username,
                lessons: pd.lessons ? pd.lessons.length : 0,
                exercises: pd.exercises ? pd.exercises.length : 0,
                quizzes: pd.quizzes ? pd.quizzes.length : 0,
                challenges: pd.challenges ? pd.challenges.length : 0,
                achievements: achievements.length,
                totalScore: (pd.lessons ? pd.lessons.length * 10 : 0)
                    + (pd.exercises ? pd.exercises.length * 15 : 0)
                    + (pd.quizzes ? pd.quizzes.length * 10 : 0)
                    + (pd.challenges ? pd.challenges.length * 20 : 0)
                    + (achievements.length * 25),
                joinedAt: user.created_at,
            };
        }).sort((a, b) => b.totalScore - a.totalScore);
    },
};

const database = IS_PRODUCTION ? pgDB : jsonDB;
database.init = IS_PRODUCTION ? initPostgres : async () => { console.log('Using local JSON DB'); };
database.IS_PRODUCTION = IS_PRODUCTION;
database.pgPool = IS_PRODUCTION ? () => pgPool : null;

module.exports = database;
