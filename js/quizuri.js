// ============================================================================
// ❓ quizuri.js — Quiz Logic
// ============================================================================

const answers = {
    q1: 1, q2: 2, q3: 1, q4: 0, q5: 1,
    q6: 2, q7: 1, q8: 0, q9: 1, q10: 1,
    q11: 1, q12: 1, q13: 2, q14: 2, q15: 1
};
let score = 0;
let answered = new Set();

function answer(qId, el, idx) {
    if (answered.has(qId)) return;
    answered.add(qId);

    const card = document.getElementById(qId);
    const options = card.querySelectorAll('.quiz-option');
    const explanations = card.querySelectorAll('.quiz-explanation');
    const isCorrect = idx === answers[qId];

    options.forEach(o => o.classList.add('disabled'));

    if (isCorrect) {
        el.classList.add('correct');
        card.classList.add('completed-correct');
        explanations[0].classList.add('show');
        score++;
    } else {
        el.classList.add('wrong');
        options[answers[qId]].classList.add('correct');
        card.classList.add('completed-wrong');
        explanations[1].classList.add('show');
    }

    document.getElementById('scoreDisplay').textContent = `${score} / 15`;

    // Track progress
    if (typeof JSProgress !== 'undefined') {
        JSProgress.markDone('quizzes', qId);
    }
}
