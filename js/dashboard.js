// ============================================================================
// 📊 dashboard.js — Dashboard de Progres
// ============================================================================

(function () {
    const TOTALS = {
        lessons: 19,
        exercises: 18,
        quizzes: 15,
        challenges: 8
    };

    const LEVELS = [
        { name: 'Începător', icon: '🌱', min: 0, desc: 'Abia ai pășit în lumea JavaScript!' },
        { name: 'Explorator', icon: '🗺️', min: 5, desc: 'Explorezi conceptele de bază.' },
        { name: 'Practicant', icon: '⚡', min: 15, desc: 'Practici serios și crești rapid!' },
        { name: 'Avansat', icon: '🔥', min: 30, desc: 'Cunoștințe solide de JavaScript!' },
        { name: 'Expert', icon: '💎', min: 45, desc: 'Aproape un maestru JavaScript!' },
        { name: 'Maestru', icon: '👑', min: 55, desc: 'Ai stăpânit JavaScript complet!' },
        { name: 'Legendă', icon: '🏆', min: 60, desc: 'LEGENDA! Totul completat!' },
    ];

    function getProgress() {
        const data = localStorage.getItem('js-playground-progress');
        return data ? JSON.parse(data) : { lessons: [], exercises: [], quizzes: [], challenges: [] };
    }

    function getUnlocked() {
        const data = localStorage.getItem('js-playground-achievements');
        return data ? JSON.parse(data) : [];
    }

    function getLevel(xp) {
        let level = LEVELS[0];
        for (let i = LEVELS.length - 1; i >= 0; i--) {
            if (xp >= LEVELS[i].min) {
                level = LEVELS[i];
                break;
            }
        }
        return level;
    }

    function getNextLevel(xp) {
        for (const l of LEVELS) {
            if (xp < l.min) return l;
        }
        return null;
    }

    function render() {
        const progress = getProgress();
        const unlocked = getUnlocked();
        const totalXP = progress.lessons.length + progress.exercises.length +
            progress.quizzes.length + progress.challenges.length;
        const maxXP = TOTALS.lessons + TOTALS.exercises + TOTALS.quizzes + TOTALS.challenges;
        const overallPct = Math.round((totalXP / maxXP) * 100);
        const level = getLevel(totalXP);
        const nextLevel = getNextLevel(totalXP);

        // Level Card
        const levelCard = document.getElementById('levelCard');
        levelCard.innerHTML = `
            <div class="level-card">
                <span class="level-icon">${level.icon}</span>
                <div class="level-name">Nivel: ${level.name}</div>
                <div class="level-desc">${level.desc}</div>
                <div class="progress-bar-wrap" style="max-width: 400px; margin: 0 auto; height: 10px;">
                    <div class="progress-bar overall" style="width: ${Math.min(100, (totalXP / maxXP) * 100)}%"></div>
                </div>
                <div class="level-xp">${totalXP} / ${maxXP} XP total${nextLevel ? ` — Următor: ${nextLevel.icon} ${nextLevel.name} (${nextLevel.min} XP)` : ' — NIVEL MAXIM! 🎉'}</div>
            </div>
        `;

        // Overview Grid
        const categories = [
            { key: 'lessons', icon: '📖', label: 'Lecții', total: TOTALS.lessons },
            { key: 'exercises', icon: '✏️', label: 'Exerciții', total: TOTALS.exercises },
            { key: 'quizzes', icon: '❓', label: 'Quiz-uri', total: TOTALS.quizzes },
            { key: 'challenges', icon: '🎯', label: 'Provocări', total: TOTALS.challenges },
            { key: 'overall', icon: '🏆', label: 'Total', total: maxXP, current: totalXP },
        ];

        const overviewGrid = document.getElementById('overviewGrid');
        overviewGrid.innerHTML = categories.map(c => {
            const current = c.key === 'overall' ? c.current : progress[c.key].length;
            const total = c.total;
            const pct = Math.round((current / total) * 100);
            return `
                <div class="overview-card ${c.key}">
                    <span class="overview-icon">${c.icon}</span>
                    <div class="overview-number">${current}</div>
                    <div class="overview-label">${c.label}</div>
                    <div class="overview-pct">${pct}% completat (din ${total})</div>
                </div>
            `;
        }).join('');

        // Progress Bars
        const progressSection = document.getElementById('progressSection');
        const bars = [
            { key: 'lessons', label: '📖 Lecții', total: TOTALS.lessons },
            { key: 'exercises', label: '✏️ Exerciții', total: TOTALS.exercises },
            { key: 'quizzes', label: '❓ Quiz-uri', total: TOTALS.quizzes },
            { key: 'challenges', label: '🎯 Provocări', total: TOTALS.challenges },
        ];

        progressSection.innerHTML = `
            <h3>📈 Progres Detaliat</h3>
            ${bars.map(b => {
            const current = progress[b.key].length;
            const pct = Math.round((current / b.total) * 100);
            return `
                    <div class="progress-row">
                        <span class="progress-label">${b.label}</span>
                        <div class="progress-bar-wrap">
                            <div class="progress-bar ${b.key}" style="width: ${pct}%"></div>
                        </div>
                        <span class="progress-pct">${pct}%</span>
                    </div>
                `;
        }).join('')}
            <div class="progress-row" style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border);">
                <span class="progress-label" style="font-weight: 700;">🏆 Overall</span>
                <div class="progress-bar-wrap">
                    <div class="progress-bar overall" style="width: ${overallPct}%"></div>
                </div>
                <span class="progress-pct" style="color: var(--warning);">${overallPct}%</span>
            </div>
        `;

        // Recent Activity
        const recentActivity = document.getElementById('recentActivity');
        const allItems = [];
        const labelMap = {
            lessons: { icon: '📖', tag: 'lesson', label: 'Lecție' },
            exercises: { icon: '✏️', tag: 'exercise', label: 'Exercițiu' },
            quizzes: { icon: '❓', tag: 'quiz', label: 'Quiz' },
            challenges: { icon: '🎯', tag: 'challenge', label: 'Provocare' },
        };

        Object.keys(labelMap).forEach(cat => {
            const items = progress[cat] || [];
            items.forEach(id => {
                allItems.push({ category: cat, id, ...labelMap[cat] });
            });
        });

        const recent = allItems.slice(-8).reverse();

        recentActivity.innerHTML = `
            <h3>📋 Activitate Recentă</h3>
            ${recent.length > 0 ? recent.map(r => `
                <div class="activity-item">
                    <span class="activity-icon">${r.icon}</span>
                    <span class="activity-text">${r.label}: ${r.id}</span>
                    <span class="activity-tag ${r.tag}">${r.label}</span>
                </div>
            `).join('') : '<p style="color: var(--text-secondary); padding: 16px;">Nicio activitate încă. Începe cu o lecție! 🚀</p>'}
        `;

        // Achievements Preview
        const achievementsPreview = document.getElementById('achievementsPreview');
        achievementsPreview.innerHTML = `
            <div class="recent-activity">
                <h3>🏅 Achievements (${unlocked.length} / 10)</h3>
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; text-align: center;">
                    ${getAchievementIcons(unlocked)}
                </div>
                <a href="achievements.html" style="display: block; text-align: center; margin-top: 16px; color: var(--accent-4); font-weight: 600; font-size: 0.9rem;">
                    Vezi toate →
                </a>
            </div>
        `;
    }

    function getAchievementIcons(unlocked) {
        const all = [
            { id: 'first-lesson', icon: '📖' },
            { id: 'five-lessons', icon: '📚' },
            { id: 'all-lessons', icon: '🏆' },
            { id: 'first-exercise', icon: '✏️' },
            { id: 'ten-exercises', icon: '💪' },
            { id: 'all-exercises', icon: '🥇' },
            { id: 'first-quiz', icon: '❓' },
            { id: 'all-quizzes', icon: '🧠' },
            { id: 'first-challenge', icon: '🎯' },
            { id: 'all-challenges', icon: '🔥' },
        ];

        return all.map(a => {
            const isUnlocked = unlocked.includes(a.id);
            return `
                <div style="font-size: 1.8rem; padding: 8px; border-radius: 10px; border: 1px solid ${isUnlocked ? 'rgba(0, 210, 255, 0.3)' : 'var(--border)'}; background: ${isUnlocked ? 'rgba(0, 210, 255, 0.08)' : 'rgba(0,0,0,0.15)'}; ${!isUnlocked ? 'filter: grayscale(1); opacity: 0.4;' : ''} transition: all 0.2s;" title="${a.id}">
                    ${a.icon}
                </div>
            `;
        }).join('');
    }

    render();
})();
