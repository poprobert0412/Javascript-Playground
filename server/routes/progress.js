const express = require('express');
const db = require('../database');

const router = express.Router();

function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Trebuie să fii autentificat' });
    }
    next();
}

router.get('/', requireAuth, async (req, res) => {
    try {
        const record = await db.getProgress(req.session.userId);
        if (!record) return res.json({ progress: {} });
        res.json({ progress: record.data, updatedAt: record.updated_at });
    } catch (err) {
        console.error('Get progress error:', err);
        res.status(500).json({ error: 'Eroare la citirea progresului' });
    }
});

router.post('/', requireAuth, async (req, res) => {
    try {
        const { progress } = req.body;
        if (!progress || typeof progress !== 'object') {
            return res.status(400).json({ error: 'Datele de progres sunt invalide' });
        }
        await db.saveProgress(req.session.userId, progress);
        res.json({ message: 'Progresul a fost salvat!', updatedAt: new Date().toISOString() });
    } catch (err) {
        console.error('Save progress error:', err);
        res.status(500).json({ error: 'Eroare la salvarea progresului' });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await db.getLeaderboard();
        res.json({ leaderboard });
    } catch (err) {
        console.error('Leaderboard error:', err);
        res.status(500).json({ error: 'Eroare la încărcarea clasamentului' });
    }
});

module.exports = router;
