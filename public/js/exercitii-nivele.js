// === EXERCITII NIVELE — Level Unlock System ===
// Manages exercise level states: locked, unlocked, completed
// Uses localStorage key "exerciseLevels" to persist completion data

const EXERCISES = [
    { id: 'ex1', num: 1, icon: '➕', title: 'Calculează suma unui array', stars: 1 },
    { id: 'ex2', num: 2, icon: '🔍', title: 'Filtrează numerele pare', stars: 1 },
    { id: 'ex3', num: 3, icon: '🏗️', title: 'Creează un obiect', stars: 1 },
    { id: 'ex4', num: 4, icon: '📦', title: 'Variabile — let vs const', stars: 1 },
    { id: 'ex5', num: 5, icon: '🏷️', title: 'typeof — Ce tip are?', stars: 1 },
    { id: 'ex6', num: 6, icon: '✨', title: 'Template Literals', stars: 1 },
    { id: 'ex7', num: 7, icon: '🔢', title: 'Aritmetică și Modulo (%)', stars: 2 },
    { id: 'ex8', num: 8, icon: '⚙️', title: 'Funcții — Return vs No Return', stars: 2 },
    { id: 'ex9', num: 9, icon: '➡️', title: 'Arrow Functions', stars: 2 },
    { id: 'ex10', num: 10, icon: '🔀', title: 'if / else — Verifică un număr', stars: 2 },
    { id: 'ex11', num: 11, icon: '❓', title: 'Ternary Operator', stars: 2 },
    { id: 'ex12', num: 12, icon: '🔄', title: 'For Loop', stars: 2 },
    { id: 'ex13', num: 13, icon: '🗺️', title: 'Array .map() — EUR → RON', stars: 3 },
    { id: 'ex14', num: 14, icon: '🔍', title: 'Array .filter() — Doar majori', stars: 3 },
    { id: 'ex15', num: 15, icon: '📊', title: 'Array .reduce() — Coș cumpărături', stars: 3 },
    { id: 'ex16', num: 16, icon: '🧱', title: 'Obiecte — Profil complet', stars: 3 },
    { id: 'ex17', num: 17, icon: '🔗', title: 'Chaining — .filter() + .map()', stars: 4 },
    { id: 'ex18', num: 18, icon: '🏆', title: 'Magazin de Produse — BOSS FINAL', stars: 4, boss: true }
];

const STORAGE_KEY = 'exerciseLevels';

// ── Get completed exercises from localStorage ──
function getCompletedExercises() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

// ── Check if a level is unlocked ──
function isLevelUnlocked(num, completed) {
    if (num === 1) return true;
    return completed[`ex${num - 1}`] === true;
}

// ── Check if a level is completed ──
function isLevelCompleted(num, completed) {
    return completed[`ex${num}`] === true;
}

// ── Generate star HTML ──
function generateStars(count) {
    let html = '';
    for (let i = 1; i <= 4; i++) {
        html += `<span class="star${i > count ? ' dim' : ''}">⭐</span>`;
    }
    return html;
}

// ── Render all level cards ──
function renderLevels() {
    const grid = document.getElementById('levelsGrid');
    const completed = getCompletedExercises();

    let html = '';
    let completedCount = 0;
    let unlockedCount = 0;

    EXERCISES.forEach(ex => {
        const isDone = isLevelCompleted(ex.num, completed);
        const isOpen = isLevelUnlocked(ex.num, completed);

        if (isDone) completedCount++;
        if (isOpen) unlockedCount++;

        let state = 'locked';
        let statusText = '🔒 Rezolvă nivelul anterior';
        let clickAttr = '';
        let overlay = '<span class="lock-overlay">🔒</span>';

        if (isDone) {
            state = 'completed';
            statusText = '✅ Completat!';
            clickAttr = `onclick="goToExercise('${ex.id}')"`;
            overlay = '<span class="completed-check">✅</span>';
        } else if (isOpen) {
            state = 'unlocked';
            statusText = '▶ Începe exercițiul';
            clickAttr = `onclick="goToExercise('${ex.id}')"`;
            overlay = '';
        }

        const bossClass = ex.boss ? ' boss-card' : '';

        html += `
            <div class="level-card ${state}${bossClass}" ${clickAttr}>
                ${overlay}
                <div class="level-number">${ex.boss ? '🏆' : ex.num}</div>
                <span class="level-icon">${ex.icon}</span>
                <div class="level-title">${ex.title}</div>
                <div class="level-difficulty">${generateStars(ex.stars)}</div>
                <div class="level-status">${statusText}</div>
            </div>
        `;
    });

    grid.innerHTML = html;

    // Update progress
    const total = EXERCISES.length;
    const fill = document.getElementById('progressFill');
    const completedEl = document.getElementById('completedCount');
    const unlockedEl = document.getElementById('unlockedCount');

    if (fill) fill.style.width = `${(completedCount / total) * 100}%`;
    if (completedEl) completedEl.textContent = completedCount;
    if (unlockedEl) unlockedEl.textContent = unlockedCount;
}

// ── Navigate to exercise ──
function goToExercise(id) {
    const num = id.replace('ex', '');
    window.location.href = `exercitiu.html?ex=${num}`;
}

// ── Reset progress ──
function resetProgress() {
    if (confirm('Ești sigur că vrei să resetezi tot progresul? Toate nivelele vor fi blocate din nou (în afară de nivelul 1).')) {
        localStorage.removeItem(STORAGE_KEY);
        renderLevels();
    }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', renderLevels);
