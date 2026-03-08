// ═══════════════════════════════════════════════════════
// ⚙️ Lesson Levels Manager — lectii-nivele.js
// ═══════════════════════════════════════════════════════

const LESSONS = [
    { id: 'lectie1', num: 1, icon: '📦', title: 'Variabile', stars: 1, desc: 'let, const, var' },
    { id: 'lectie2', num: 2, icon: '🏷️', title: 'Tipuri de Date', stars: 1, desc: 'string, number, boolean, null, undefined' },
    { id: 'lectie3', num: 3, icon: '🔀', title: 'Condiții', stars: 1, desc: 'if, else, switch, ternary' },
    { id: 'lectie4', num: 4, icon: '🔄', title: 'Bucle', stars: 1, desc: 'for, while, for...of, for...in' },
    { id: 'lectie5', num: 5, icon: '⚙️', title: 'Funcții', stars: 2, desc: 'function, return, arrow =>' },
    { id: 'lectie6', num: 6, icon: '📋', title: 'Array-uri', stars: 2, desc: '.map(), .filter(), .reduce()' },
    { id: 'lectie7', num: 7, icon: '📝', title: 'Metode String', stars: 2, desc: '.split(), .includes(), .slice()' },
    { id: 'lectie8', num: 8, icon: '🧱', title: 'Obiecte', stars: 2, desc: 'proprietăți, metode, this' },
    { id: 'lectie9', num: 9, icon: '⚖️', title: 'Comparații & Logică', stars: 2, desc: '==, ===, &&, ||, !' },
    { id: 'lectie10', num: 10, icon: '🛡️', title: 'Error Handling', stars: 2, desc: 'try, catch, finally, throw' },
    { id: 'lectie11', num: 11, icon: '🧰', title: 'Built-in Objects', stars: 2, desc: 'Math, Date, JSON, localStorage' },
    { id: 'lectie12', num: 12, icon: '🔒', title: 'Scope & Closures', stars: 3, desc: 'global, local, block, closure' },
    { id: 'lectie13', num: 13, icon: '📦', title: 'Destructuring & Spread', stars: 3, desc: 'extrage, combină, copiază' },
    { id: 'lectie14', num: 14, icon: '🏛️', title: 'Classes (OOP)', stars: 3, desc: 'class, constructor, extends' },
    { id: 'lectie15', num: 15, icon: '⏳', title: 'Promises & Async/Await', stars: 3, desc: '.then(), async, await' },
    { id: 'lectie16', num: 16, icon: '🌍', title: 'Fetch API', stars: 3, desc: 'HTTP GET, POST, JSON' },
    { id: 'lectie17', num: 17, icon: '🌐', title: 'DOM Manipulation', stars: 3, desc: 'getElementById, querySelector' },
    { id: 'lectie18', num: 18, icon: '🎯', title: 'Events & Listeners', stars: 3, desc: 'addEventListener, click, keydown' },
    { id: 'lectie19', num: 19, icon: '🎮', title: 'Demo-uri Live', stars: 4, desc: 'events în acțiune!', boss: true }
];

const STORAGE_KEY = 'lessonLevels';

// ── LocalStorage Helpers ──
function getCompletedLessons() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (e) { return {}; }
}

function isLessonUnlocked(lesson) {
    if (lesson.num === 1) return true;
    const completed = getCompletedLessons();
    return completed[`lectie${lesson.num - 1}`] === true;
}

function isLessonCompleted(lesson) {
    return getCompletedLessons()[lesson.id] === true;
}

function generateStars(count) {
    let html = '';
    for (let i = 1; i <= 4; i++) {
        html += `<span class="star${i > count ? ' dim' : ''}">⭐</span>`;
    }
    return html;
}

// ── Render Levels ──
function renderLevels() {
    const grid = document.getElementById('levelsGrid');
    const completed = getCompletedLessons();
    let completedCount = 0;
    let unlockedCount = 0;

    grid.innerHTML = '';

    LESSONS.forEach(lesson => {
        const done = isLessonCompleted(lesson);
        const unlocked = isLessonUnlocked(lesson);
        if (done) completedCount++;
        if (unlocked) unlockedCount++;

        let stateClass = '', statusHTML = '', clickHandler = '';

        if (done) {
            stateClass = 'completed';
            statusHTML = `<div class="level-status completed">✅ Completat!</div>`;
            clickHandler = `onclick="goToLesson('${lesson.id}')"`;
        } else if (unlocked) {
            stateClass = 'unlocked';
            statusHTML = `<div class="level-status unlocked">▶ Începe lecția</div>`;
            clickHandler = `onclick="goToLesson('${lesson.id}')"`;
        } else {
            stateClass = 'locked';
            statusHTML = `<div class="level-status locked">🔒 Rezolvă nivelul anterior</div>`;
        }

        const bossClass = lesson.boss ? ' boss' : '';

        grid.innerHTML += `
            <div class="level-card ${stateClass}${bossClass}" ${clickHandler}>
                ${done ? '<div class="level-check">✅</div>' : ''}
                ${!unlocked && !done ? '<div class="level-lock">🔒</div>' : ''}
                <div class="level-number${bossClass}">${lesson.boss ? '🎮' : lesson.num}</div>
                <div class="level-icon">${lesson.icon}</div>
                <div class="level-title">${lesson.title}</div>
                <div class="level-desc">${lesson.desc}</div>
                <div class="difficulty">${generateStars(lesson.stars)}</div>
                ${statusHTML}
            </div>
        `;
    });

    // Update stats
    document.getElementById('statCompleted').textContent = completedCount;
    document.getElementById('statUnlocked').textContent = unlockedCount;
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = `${(completedCount / LESSONS.length) * 100}%`;
}

// ── Navigate to lesson ──
function goToLesson(id) {
    const num = id.replace('lectie', '');
    window.location.href = `lectie.html?lectie=${num}`;
}

// ── Reset progress ──
function resetProgress() {
    if (confirm('🔄 Sigur vrei să resetezi progresul la lecții? Vei pierde tot!')) {
        localStorage.removeItem(STORAGE_KEY);
        renderLevels();
    }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', renderLevels);
