// ============================================================================
// 🚀 proiecte.js — Mini Projects Logic (To-Do, Quiz Game, Weather)
// ============================================================================

// ============ TO-DO LIST ============
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const todoAdd = document.getElementById('todoAdd');
const todoCount = document.getElementById('todoCount');
const todoClear = document.getElementById('todoClear');
let todos = [];

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;
    todos.push({ text, done: false });
    todoInput.value = '';
    renderTodos();
    todoInput.focus();
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, i) => {
        const div = document.createElement('div');
        div.className = `todo-item ${todo.done ? 'done' : ''}`;
        div.innerHTML = `
            <span class="todo-check" onclick="toggleTodo(${i})">✓</span>
            <span class="todo-text">${todo.text}</span>
            <button class="todo-delete" onclick="deleteTodo(${i})">✕</button>
        `;
        todoList.appendChild(div);
    });
    const doneCount = todos.filter(t => t.done).length;
    todoCount.textContent = `${todos.length} sarcini (${doneCount} complete)`;
}

function toggleTodo(i) { todos[i].done = !todos[i].done; renderTodos(); }
function deleteTodo(i) { todos.splice(i, 1); renderTodos(); }

todoAdd.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTodo(); });
todoClear.addEventListener('click', () => {
    todos = todos.filter(t => !t.done);
    renderTodos();
});


// ============ QUIZ GAME ============
const quizQuestions = [
    { q: "Câte continente sunt pe Pământ?", a: ["5", "6", "7", "8"], c: 2 },
    { q: "Ce limbaj de programare rulează nativ în browser?", a: ["Python", "JavaScript", "C++", "Java"], c: 1 },
    { q: "Ce returnează typeof [] în JavaScript?", a: ["\"array\"", "\"object\"", "\"list\"", "\"undefined\""], c: 1 },
    { q: "Ce an a fost creat JavaScript?", a: ["1991", "1995", "2000", "2005"], c: 1 },
    { q: "Ce face .push() pe un array?", a: ["Scoate primul", "Adaugă la sfârșit", "Sortează", "Inversează"], c: 1 },
    { q: "Ce e DOM în JavaScript?", a: ["O bază de date", "Un framework", "Reprezentarea HTML ca obiect", "Un protocol"], c: 2 },
    { q: "Ce returnează 0.1 + 0.2 === 0.3?", a: ["true", "false", "Error", "undefined"], c: 1 },
    { q: "Care metodă oprește propagarea unui event?", a: ["stopEvent()", "preventDefault()", "stopPropagation()", "cancelEvent()"], c: 2 },
];

let miniQIdx = -1, miniScore = 0, miniTotal = 0;
let miniQuizActive = false;
const btnIds = ['mqA', 'mqB', 'mqC', 'mqD'];

function startMiniQuiz() {
    miniQIdx = 0; miniScore = 0; miniTotal = 0;
    miniQuizActive = true;
    document.getElementById('miniQuizStart').textContent = '🔄 Restart';
    showMiniQ();
}

function showMiniQ() {
    if (miniQIdx >= quizQuestions.length) {
        document.getElementById('miniQuizQ').textContent = `🏆 Terminat! Scor: ${miniScore}/${quizQuestions.length}`;
        btnIds.forEach(id => { document.getElementById(id).textContent = '—'; document.getElementById(id).className = 'quiz-answer-btn'; });
        miniQuizActive = false;
        return;
    }
    const q = quizQuestions[miniQIdx];
    document.getElementById('miniQuizQ').textContent = q.q;
    q.a.forEach((ans, i) => {
        const btn = document.getElementById(btnIds[i]);
        btn.textContent = ans;
        btn.className = 'quiz-answer-btn';
    });
    document.getElementById('miniQuizScore').textContent = `Scor: ${miniScore} / ${miniTotal}`;
}

function miniQuizAnswer(idx) {
    if (!miniQuizActive || miniQIdx >= quizQuestions.length) return;
    const correct = quizQuestions[miniQIdx].c;
    miniTotal++;

    btnIds.forEach((id, i) => {
        const btn = document.getElementById(id);
        if (i === correct) btn.classList.add('correct-ans');
        if (i === idx && i !== correct) btn.classList.add('wrong-ans');
    });

    if (idx === correct) miniScore++;
    document.getElementById('miniQuizScore').textContent = `Scor: ${miniScore} / ${miniTotal}`;

    setTimeout(() => {
        miniQIdx++;
        showMiniQ();
    }, 800);
}


// ============ WEATHER APP ============
const weatherBtn = document.getElementById('weatherBtn');
const weatherInput = document.getElementById('weatherInput');

async function getWeather(city) {
    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        if (!response.ok) throw new Error('Orașul nu a fost găsit!');
        const data = await response.json();
        const condition = data.current_condition[0];

        document.getElementById('weatherResult').style.display = 'block';
        document.getElementById('weatherCity').textContent = `📍 ${city}`;
        document.getElementById('weatherTemp').textContent = `${condition.temp_C}°C`;
        document.getElementById('weatherDetails').textContent =
            `${condition.weatherDesc[0].value} • Umiditate: ${condition.humidity}% • Vânt: ${condition.windspeedKmph} km/h`;
    } catch (err) {
        document.getElementById('weatherResult').style.display = 'block';
        document.getElementById('weatherCity').textContent = '❌ Eroare';
        document.getElementById('weatherTemp').textContent = '—';
        document.getElementById('weatherDetails').textContent = err.message;
    }
}

weatherBtn.addEventListener('click', () => {
    const city = weatherInput.value.trim();
    if (city) getWeather(city);
});
weatherInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const city = weatherInput.value.trim();
        if (city) getWeather(city);
    }
});
