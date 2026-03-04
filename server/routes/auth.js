// ============================================================================
// 🔐 auth.js — Rute de autentificare + profil + reset parolă
// ============================================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../database');

const router = express.Router();
const SALT_ROUNDS = 10;

// ============================================================================
// POST /api/register
// ============================================================================
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii' });
        }
        if (username.length < 3) {
            return res.status(400).json({ error: 'Username-ul trebuie să aibă minim 3 caractere' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Parola trebuie să aibă minim 6 caractere' });
        }

        if (await db.findUserByUsername(username)) {
            return res.status(409).json({ error: 'Acest username este deja folosit' });
        }
        if (await db.findUserByEmail(email)) {
            return res.status(409).json({ error: 'Acest email este deja înregistrat' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await db.createUser(username, email, passwordHash);

        req.session.userId = user.id;
        req.session.save((err) => {
            if (err) console.error('[Register] Session save error:', err);
            res.status(201).json({
                message: 'Cont creat cu succes! 🎉',
                user: { id: user.id, username: user.username, email: user.email }
            });
        });
    } catch (err) {
        console.error('[Register] Error:', err.message);
        res.status(500).json({ error: 'Eroare la server. Încearcă din nou.' });
    }
});

// ============================================================================
// POST /api/login
// ============================================================================
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username-ul și parola sunt obligatorii' });
        }

        const user = await db.findUserByUsername(username);
        if (!user) return res.status(401).json({ error: 'Username sau parolă incorectă' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Username sau parolă incorectă' });

        req.session.userId = user.id;
        req.session.save((err) => {
            if (err) console.error('[Login] Session save error:', err);
            res.json({
                message: 'Autentificare reușită! 🚀',
                user: { id: user.id, username: user.username, email: user.email }
            });
        });
    } catch (err) {
        console.error('[Login] Error:', err.message);
        res.status(500).json({ error: 'Eroare la server. Încearcă din nou.' });
    }
});

// ============================================================================
// POST /api/logout
// ============================================================================
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Eroare la logout' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Te-ai delogat cu succes!' });
    });
});

// ============================================================================
// GET /api/me
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

// ============================================================================
// PUT /api/profile — Editare profil (username, email)
// ============================================================================
router.put('/profile', async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Nu ești autentificat' });
    }

    try {
        const { username, email } = req.body;
        const userId = req.session.userId;

        if (!username && !email) {
            return res.status(400).json({ error: 'Trimite cel puțin un câmp de actualizat' });
        }

        if (username) {
            if (username.length < 3) {
                return res.status(400).json({ error: 'Username-ul trebuie să aibă minim 3 caractere' });
            }
            const existing = await db.findUserByUsername(username);
            if (existing && existing.id !== userId) {
                return res.status(409).json({ error: 'Acest username este deja folosit' });
            }
        }

        if (email) {
            const existing = await db.findUserByEmail(email);
            if (existing && existing.id !== userId) {
                return res.status(409).json({ error: 'Acest email este deja folosit' });
            }
        }

        await db.updateUser(userId, { username, email });
        const user = await db.findUserById(userId);

        res.json({ message: 'Profil actualizat! ✅', user });
    } catch (err) {
        console.error('[Profile] Error:', err.message);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

// ============================================================================
// PUT /api/password — Schimbare parolă
// ============================================================================
router.put('/password', async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Nu ești autentificat' });
    }

    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Parola curentă și cea nouă sunt obligatorii' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Parola nouă trebuie să aibă minim 6 caractere' });
        }

        const user = await db.findUserByUsername(
            (await db.findUserById(req.session.userId)).username
        );

        const valid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Parola curentă este incorectă' });
        }

        const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await db.updatePassword(req.session.userId, newHash);

        res.json({ message: 'Parola a fost schimbată! 🔒' });
    } catch (err) {
        console.error('[Password] Error:', err.message);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

// ============================================================================
// POST /api/forgot-password — Generare token de reset
// ============================================================================
router.post('/forgot-password', async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'Introdu username-ul' });
        }

        const user = await db.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'Username negăsit' });
        }

        // Generăm un token unic
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(); // 1 oră

        await db.createResetToken(user.id, token, expiresAt);

        // Returnăm link-ul de reset (fără email, userul îl copiază)
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const resetLink = `${baseUrl}/login.html?reset=${token}`;

        res.json({
            message: 'Link de resetare generat! Copiază-l și folosește-l în maxim 1 oră.',
            resetLink
        });
    } catch (err) {
        console.error('[ForgotPassword] Error:', err.message);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

// ============================================================================
// POST /api/reset-password — Resetare parolă cu token
// ============================================================================
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token-ul și parola nouă sunt obligatorii' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Parola trebuie să aibă minim 6 caractere' });
        }

        const resetData = await db.findResetToken(token);
        if (!resetData) {
            return res.status(400).json({ error: 'Token invalid sau expirat' });
        }

        if (new Date(resetData.expires_at) < new Date()) {
            return res.status(400).json({ error: 'Token-ul a expirat. Generează unul nou.' });
        }

        const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await db.updatePassword(resetData.user_id, newHash);
        await db.deleteResetToken(token);

        res.json({ message: 'Parola a fost resetată cu succes! 🎉 Poți te loga acum.' });
    } catch (err) {
        console.error('[ResetPassword] Error:', err.message);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

module.exports = router;
