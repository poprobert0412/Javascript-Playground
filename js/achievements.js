// ============================================================================
// 🏆 achievements.js — Pagina de Achievements
// ============================================================================

(function () {
    // Definim toate achievement-urile cu detalii extinse
    const achievementsList = [
        {
            id: 'first-lesson',
            icon: '📖',
            name: 'Prima Lecție',
            desc: 'Ai completat prima lecție! Drumul de 1000 de mile începe cu un pas.',
            category: 'lessons',
            target: 1
        },
        {
            id: 'five-lessons',
            icon: '📚',
            name: 'Cititor Dedicat',
            desc: 'Ai completat 5 lecții! Ești pe drumul cel bun.',
            category: 'lessons',
            target: 5
        },
        {
            id: 'all-lessons',
            icon: '🏆',
            name: 'Maestru Lecțiilor',
            desc: 'Ai completat TOATE cele 19 lecții! Ești un adevărat maestru.',
            category: 'lessons',
            target: 19
        },
        {
            id: 'first-exercise',
            icon: '✏️',
            name: 'Primul Exercițiu',
            desc: 'Ai rezolvat primul exercițiu! Practica face perfecțiunea.',
            category: 'exercises',
            target: 1
        },
        {
            id: 'ten-exercises',
            icon: '💪',
            name: 'Antrenament Serios',
            desc: 'Ai rezolvat 10 exerciții! Mușchii tăi JS sunt puternici.',
            category: 'exercises',
            target: 10
        },
        {
            id: 'all-exercises',
            icon: '🥇',
            name: 'Expert Exerciții',
            desc: 'Ai rezolvat TOATE cele 18 exerciții! Nimic nu te poate opri.',
            category: 'exercises',
            target: 18
        },
        {
            id: 'first-quiz',
            icon: '❓',
            name: 'Primul Quiz',
            desc: 'Ai răspuns la primul quiz! Cunoștințele tale sunt testate.',
            category: 'quizzes',
            target: 1
        },
        {
            id: 'all-quizzes',
            icon: '🧠',
            name: 'Geniu la Quiz',
            desc: 'Ai terminat TOATE cele 15 quiz-uri! Creierul tău e o mașinărie JS.',
            category: 'quizzes',
            target: 15
        },
        {
            id: 'first-challenge',
            icon: '🎯',
            name: 'Prima Provocare',
            desc: 'Ai rezolvat prima provocare de cod! Challenge accepted.',
            category: 'challenges',
            target: 1
        },
        {
            id: 'all-challenges',
            icon: '🔥',
            name: 'Hacker Man',
            desc: 'Ai rezolvat TOATE cele 8 provocări! Ești un adevărat hacker.',
            category: 'challenges',
            target: 8
        },
    ];

    // Obține progresul curent
    function getProgress() {
        const data = localStorage.getItem('js-playground-progress');
        return data ? JSON.parse(data) : { lessons: [], exercises: [], quizzes: [], challenges: [] };
    }

    function getUnlocked() {
        const data = localStorage.getItem('js-playground-achievements');
        return data ? JSON.parse(data) : [];
    }

    // Randarea cardurilor
    function render() {
        const progress = getProgress();
        const unlocked = getUnlocked();
        const unlockedGrid = document.getElementById('unlockedGrid');
        const lockedGrid = document.getElementById('lockedGrid');
        const totalBadge = document.getElementById('totalBadge');
        const statsDiv = document.getElementById('stats');
        const lockedLabel = document.getElementById('lockedLabel');

        let unlockedHTML = '';
        let lockedHTML = '';
        let unlockedCount = 0;

        achievementsList.forEach(a => {
            const isUnlocked = unlocked.includes(a.id);
            const current = progress[a.category] ? progress[a.category].length : 0;
            const pct = Math.min(100, Math.round((current / a.target) * 100));

            const card = `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <span class="achievement-icon">${a.icon}</span>
                    <div class="achievement-name">${a.name}</div>
                    <div class="achievement-desc">${a.desc}</div>
                    <span class="achievement-status">${isUnlocked ? '✅ Deblocat!' : '🔒 Blocat'}</span>
                    ${!isUnlocked ? `
                        <div class="achievement-progress">
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: ${pct}%"></div>
                            </div>
                            <div class="progress-text">${current} / ${a.target} (${pct}%)</div>
                        </div>
                    ` : ''}
                </div>
            `;

            if (isUnlocked) {
                unlockedHTML += card;
                unlockedCount++;
            } else {
                lockedHTML += card;
            }
        });

        unlockedGrid.innerHTML = unlockedHTML || '<p style="color: var(--text-secondary); padding: 20px;">Niciun achievement deblocat încă. Începe să înveți! 🚀</p>';
        lockedGrid.innerHTML = lockedHTML;
        totalBadge.textContent = `${unlockedCount} / ${achievementsList.length} deblocate`;

        if (lockedHTML === '') {
            lockedLabel.style.display = 'none';
            lockedGrid.innerHTML = '<p style="color: var(--success); padding: 20px; font-weight: 600;">🎉 Ai deblocat TOATE achievement-urile! Ești legendă!</p>';
        }

        // Stats
        const totalLessons = progress.lessons.length;
        const totalExercises = progress.exercises.length;
        const totalQuizzes = progress.quizzes.length;
        const totalChallenges = progress.challenges.length;

        statsDiv.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${totalLessons}</div>
                <div class="stat-label">Lecții</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalExercises}</div>
                <div class="stat-label">Exerciții</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalQuizzes}</div>
                <div class="stat-label">Quiz-uri</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalChallenges}</div>
                <div class="stat-label">Provocări</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">🏅 ${unlockedCount}</div>
                <div class="stat-label">Achievements</div>
            </div>
        `;
    }

    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('⚠️ Sigur vrei să resetezi TOT progresul? Această acțiune nu poate fi anulată!')) {
            localStorage.removeItem('js-playground-progress');
            localStorage.removeItem('js-playground-achievements');
            render();
        }
    });

    render();
})();
