// ============================================================================
// 🏠 index.js — Landing Page Typing Animation
// ============================================================================

const phrases = [
    'console.log("Salut, lume!");',
    'let varsta = 25; varsta++;',
    '[1,2,3].map(n => n * 10);',
    'document.getElementById("demo");',
    'const suma = (a, b) => a + b;'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingDemo');

function typeLoop() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 30 : 60;

    if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 400;
    }

    setTimeout(typeLoop, speed);
}
typeLoop();
