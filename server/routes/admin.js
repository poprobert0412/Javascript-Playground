const express = require('express');
const db = require('../database');

const router = express.Router();

function requireAdmin(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Nu ești autentificat' });
    }
    db.findUserById(req.session.userId).then(user => {
        if (!user || !user.is_admin) {
            return res.status(403).json({ error: 'Nu ai permisiuni de admin' });
        }
        req.adminUser = user;
        next();
    }).catch(() => res.status(500).json({ error: 'Eroare la server' }));
}

router.get('/stats', requireAdmin, async (req, res) => {
    try {
        const stats = await db.getAdminStats();
        res.json(stats);
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

router.get('/users', requireAdmin, async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.json({ users });
    } catch (err) {
        console.error('Admin users error:', err);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

router.delete('/users/:id', requireAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (userId === req.session.userId) {
            return res.status(400).json({ error: 'Nu-ți poți șterge propriul cont din admin' });
        }
        await db.deleteUser(userId);
        res.json({ message: 'Utilizator șters!' });
    } catch (err) {
        console.error('Admin delete user error:', err);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

router.put('/users/:id/admin', requireAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { isAdmin } = req.body;
        await db.setAdmin(userId, !!isAdmin);
        res.json({ message: isAdmin ? 'Admin acordat!' : 'Admin revocat!' });
    } catch (err) {
        console.error('Admin toggle error:', err);
        res.status(500).json({ error: 'Eroare la server' });
    }
});

module.exports = router;
