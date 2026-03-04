// ============================================================================
// 🔐 auth.js — Rute de autentificare (Register / Login / Logout)
// ============================================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');

const router = express.Router();

const SALT_ROUNDS = 10;

// ============================================================================
// POST /api/register — Creare cont nou
// ============================================================================
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii (username, email, parolă)' });
        }
        if (username.length < 3) {
            return res.status(400).json({ error: 'Username-ul trebuie să aibă minim 3 caractere' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Parola trebuie să aibă minim 6 caractere' });
        }

        const existingUser = await db.findUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Acest username este deja folosit' });
        }
        const existingEmail = await db.findUserByEmail(email);
        if (existingEmail) {
            return res.status(409).json({ error: 'Acest email este deja înregistrat' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        console.log('[Register] Creating user:', username);
        const user = await db.createUser(username, email, passwordHash);
        console.log('[Register] User created with id:', user.id);

        req.session.userId = user.id;

        // Salvăm sesiunea explicit înainte de a răspunde
        req.session.save((err) => {
            if (err) {
                console.error('[Register] Session save error:', err);
                // Răspundem oricum cu succes — user-ul e creat
            }
            res.status(201).json({
                message: 'Cont creat cu succes! 🎉',
                user: { id: user.id, username: user.username, email: user.email }
            });
        });
    } catch (err) {
        console.error('[Register] Error:', err.message, err.stack);
        res.status(500).json({ error: 'Eroare la server. Încearcă din nou.' });
    }
});

// ============================================================================
// POST /api/login — Autentificare
// ============================================================================
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username-ul și parola sunt obligatorii' });
        }

        const user = await db.findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Username sau parolă incorectă' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Username sau parolă incorectă' });
        }

        req.session.userId = user.id;

        req.session.save((err) => {
            if (err) console.error('[Login] Session save error:', err);
            res.json({
                message: 'Autentificare reușită! 🚀',
                user: { id: user.id, username: user.username, email: user.email }
            });
        });
    } catch (err) {
        console.error('[Login] Error:', err.message, err.stack);
        res.status(500).json({ error: 'Eroare la server. Încearcă din nou.' });
    }
});

// ============================================================================
// POST /api/logout — Delogare
// ============================================================================
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Eroare la logout' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Te-ai delogat cu succes!' });
    });
});

// ============================================================================
// GET /api/me — Info despre user-ul curent
// ============================================================================
router.get('/me', async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Nu ești autentificat' });
    }
    try {
        const user = await db.findUserById(req.session.userId);
        if (!user) return res.status(404).json({ error: 'User negăsit' });
        res.json({ user });
    } catch (err) {
        console.error('[Me] Error:', err.message);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

module.exports = router;
