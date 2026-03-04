const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const db = require('../database');

const router = express.Router();
const SALT_ROUNDS = 10;

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'public', 'uploads', 'avatars'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${req.session.userId}-${Date.now()}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    }
});

let emailTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    });
}

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
            if (err) console.error('Session save error:', err);
            res.status(201).json({
                message: 'Cont creat cu succes!',
                user: { id: user.id, username: user.username, email: user.email }
            });
        });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).json({ error: 'Eroare la server. Încearcă din nou.' });
    }
});

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
            if (err) console.error('Session save error:', err);
            res.json({
                message: 'Autentificare reușită!',
                user: { id: user.id, username: user.username, email: user.email }
            });
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Eroare la server. Încearcă din nou.' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Eroare la logout' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Te-ai delogat cu succes!' });
    });
});

router.get('/me', async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Nu ești autentificat' });
    }
    try {
        const user = await db.findUserById(req.session.userId);
        if (!user) return res.status(404).json({ error: 'User negăsit' });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Eroare la server' });
    }
});

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

        res.json({ message: 'Profil actualizat!', user });
    } catch (err) {
        console.error('Profile update error:', err.message);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

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

        const profile = await db.findUserById(req.session.userId);
        if (!profile) return res.status(404).json({ error: 'User negăsit' });
        const user = await db.findUserByUsername(profile.username);

        const valid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Parola curentă este incorectă' });
        }

        const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await db.updatePassword(req.session.userId, newHash);

        res.json({ message: 'Parola a fost schimbată!' });
    } catch (err) {
        console.error('Password change error:', err.message);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

router.post('/avatar', upload.single('avatar'), async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Nu ești autentificat' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'Niciun fișier trimis sau format invalid. Acceptăm: JPG, PNG, GIF, WebP (max 2MB)' });
    }

    try {
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        await db.updateAvatar(req.session.userId, avatarUrl);
        res.json({ message: 'Avatar actualizat!', avatarUrl });
    } catch (err) {
        console.error('Avatar upload error:', err.message);
        res.status(500).json({ error: 'Eroare la upload' });
    }
});

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

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        await db.createResetToken(user.id, token, expiresAt);

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const resetLink = `${baseUrl}/login.html?reset=${token}`;

        if (emailTransporter && user.email) {
            try {
                await emailTransporter.sendMail({
                    from: process.env.SMTP_FROM || process.env.SMTP_USER,
                    to: user.email,
                    subject: 'JS Playground — Resetare Parolă',
                    html: `
                        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
                            <h2 style="color:#00d2ff;">JS Playground</h2>
                            <p>Salut <strong>${user.username}</strong>,</p>
                            <p>Ai solicitat resetarea parolei. Click pe butonul de mai jos:</p>
                            <a href="${resetLink}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#00d2ff,#533483);color:white;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">Resetează Parola</a>
                            <p style="font-size:0.85rem;color:#888;">Link-ul expiră în 1 oră. Dacă nu ai cerut resetarea, ignoră acest email.</p>
                        </div>
                    `
                });
                return res.json({ message: 'Email de resetare trimis! Verifică-ți inbox-ul.', emailSent: true });
            } catch (emailErr) {
                console.error('Email send error:', emailErr.message);
            }
        }

        res.json({
            message: 'Link de resetare generat! Copiază-l și folosește-l în maxim 1 oră.',
            resetLink,
            emailSent: false
        });
    } catch (err) {
        console.error('Forgot password error:', err.message);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

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

        res.json({ message: 'Parola a fost resetată cu succes! Poți te loga acum.' });
    } catch (err) {
        console.error('Reset password error:', err.message);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

module.exports = router;
