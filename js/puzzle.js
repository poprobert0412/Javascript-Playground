// ============================================================================
// 🧩 puzzle.js — Code Puzzle cu Drag & Drop
// ============================================================================

(function () {
    // 10 puzzle-uri cu linii de cod care trebuie aranjate corect
    const puzzles = [
        {
            title: '🧩 Sumă cu funcție',
            desc: 'Creează o funcție care adună două numere și afișează rezultatul.',
            expected: '8',
            lines: [
                'function aduna(a, b) {',
                '    return a + b;',
                '}',
                'const rezultat = aduna(3, 5);',
                'console.log(rezultat);',
            ]
        },
        {
            title: '🧩 Array Filter',
            desc: 'Filtrează numerele pare dintr-un array.',
            expected: '[2, 4, 6]',
            lines: [
                'const numere = [1, 2, 3, 4, 5, 6];',
                'const pare = numere.filter(n => {',
                '    return n % 2 === 0;',
                '});',
                'console.log(pare);',
            ]
        },
        {
            title: '🧩 For Loop',
            desc: 'Afișează numerele de la 1 la 5 folosind un for loop.',
            expected: '1 2 3 4 5',
            lines: [
                'let output = "";',
                'for (let i = 1; i <= 5; i++) {',
                '    output += i + " ";',
                '}',
                'console.log(output.trim());',
            ]
        },
        {
            title: '🧩 Obiect & Destructuring',
            desc: 'Creează un obiect și extrage proprietățile cu destructuring.',
            expected: 'Ana are 22 ani',
            lines: [
                'const student = {',
                '    name: "Ana",',
                '    age: 22',
                '};',
                'const { name, age } = student;',
                'console.log(`${name} are ${age} ani`);',
            ]
        },
        {
            title: '🧩 Array Map',
            desc: 'Dublează fiecare element dintr-un array cu .map().',
            expected: '[2, 4, 6, 8, 10]',
            lines: [
                'const numere = [1, 2, 3, 4, 5];',
                'const duble = numere.map(n => {',
                '    return n * 2;',
                '});',
                'console.log(duble);',
            ]
        },
        {
            title: '🧩 If/Else Condiție',
            desc: 'Verifică dacă o persoană este majoră.',
            expected: 'Major!',
            lines: [
                'const varsta = 20;',
                'if (varsta >= 18) {',
                '    console.log("Major!");',
                '} else {',
                '    console.log("Minor!");',
                '}',
            ]
        },
        {
            title: '🧩 Clasă JavaScript',
            desc: 'Creează o clasă Animal cu constructor.',
            expected: 'Rex spune: Ham!',
            lines: [
                'class Animal {',
                '    constructor(name, sound) {',
                '        this.name = name;',
                '        this.sound = sound;',
                '    }',
                '    speak() {',
                '        return `${this.name} spune: ${this.sound}`;',
                '    }',
                '}',
                'const dog = new Animal("Rex", "Ham!");',
                'console.log(dog.speak());',
            ]
        },
        {
            title: '🧩 Try/Catch',
            desc: 'Prinde o eroare și afișează mesajul.',
            expected: 'Eroare: x nu este definit',
            lines: [
                'try {',
                '    console.log(x);',
                '} catch (err) {',
                '    console.log("Eroare: x nu este definit");',
                '}',
            ]
        },
        {
            title: '🧩 Array Reduce',
            desc: 'Calculează suma tuturor elementelor cu .reduce().',
            expected: '15',
            lines: [
                'const numere = [1, 2, 3, 4, 5];',
                'const suma = numere.reduce((acc, n) => {',
                '    return acc + n;',
                '}, 0);',
                'console.log(suma);',
            ]
        },
        {
            title: '🧩 Spread & Rest',
            desc: 'Combină două array-uri cu spread operator.',
            expected: '[1, 2, 3, 4, 5, 6]',
            lines: [
                'const arr1 = [1, 2, 3];',
                'const arr2 = [4, 5, 6];',
                'const combinat = [...arr1, ...arr2];',
                'console.log(combinat);',
            ]
        },
    ];

    let currentPuzzle = 0;
    let score = 0;
    let streak = 0;
    let draggedEl = null;
    let solvedPuzzles = new Set();

    // Timer
    let timeLeft = 60;
    let timerInterval = null;

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 60;
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerTimeout();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function updateTimerDisplay() {
        const el = document.getElementById('timerBadge');
        if (!el) return;
        el.textContent = `⏱️ ${timeLeft}s`;
        if (timeLeft <= 10) {
            el.style.color = '#e94560';
            el.style.borderColor = '#e94560';
            el.style.background = 'rgba(233, 69, 96, 0.12)';
        } else {
            el.style.color = '';
            el.style.borderColor = '';
            el.style.background = '';
        }
    }

    function timerTimeout() {
        const result = document.getElementById('puzzleResult');
        const resultIcon = document.getElementById('resultIcon');
        const resultText = document.getElementById('resultText');
        const resultDesc = document.getElementById('resultDesc');
        streak = 0;
        result.className = 'puzzle-result show wrong-result';
        resultIcon.textContent = '⏰';
        resultText.textContent = 'Timpul a expirat!';
        resultDesc.textContent = 'Ai depășit 60 de secunde. Încearcă din nou!';
        document.getElementById('streakBadge').textContent = `🔥 Streak: ${streak}`;
    }

    // Fisher-Yates shuffle
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function renderPuzzleSelector() {
        const selector = document.getElementById('puzzleSelector');
        selector.innerHTML = puzzles.map((p, i) => {
            let cls = 'puzzle-select-btn';
            if (i === currentPuzzle) cls += ' active';
            if (solvedPuzzles.has(i)) cls += ' completed';
            return `<button class="${cls}" data-idx="${i}">${i + 1}</button>`;
        }).join('');

        selector.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPuzzle = parseInt(btn.dataset.idx);
                loadPuzzle();
            });
        });
    }

    function loadPuzzle() {
        const puzzle = puzzles[currentPuzzle];
        document.getElementById('puzzleTitle').textContent = puzzle.title;
        document.getElementById('puzzleDesc').textContent = puzzle.desc;
        document.getElementById('expectedText').textContent = puzzle.expected;
        document.getElementById('levelBadge').textContent = `Puzzle ${currentPuzzle + 1} / ${puzzles.length}`;
        document.getElementById('scoreBadge').textContent = `Scor: ${score}`;
        document.getElementById('streakBadge').textContent = `🔥 Streak: ${streak}`;

        // Hide result + next button
        document.getElementById('puzzleResult').className = 'puzzle-result';
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('checkBtn').style.display = '';

        // Shuffle lines
        const shuffled = shuffle(puzzle.lines);
        renderLines(shuffled);
        renderPuzzleSelector();

        // Start timer
        startTimer();
    }

    function renderLines(lines) {
        const area = document.getElementById('puzzleArea');
        area.innerHTML = '';

        lines.forEach((line, i) => {
            const el = document.createElement('div');
            el.className = 'puzzle-line';
            el.draggable = true;
            el.dataset.code = line;
            el.innerHTML = `
                <span class="drag-handle">⠿</span>
                <span class="line-number">${i + 1}</span>
                <span class="line-code">${escapeHtml(line)}</span>
            `;

            // Drag events
            el.addEventListener('dragstart', handleDragStart);
            el.addEventListener('dragend', handleDragEnd);
            el.addEventListener('dragover', handleDragOver);
            el.addEventListener('drop', handleDrop);
            el.addEventListener('dragenter', handleDragEnter);
            el.addEventListener('dragleave', handleDragLeave);

            // Touch support
            el.addEventListener('touchstart', handleTouchStart, { passive: false });
            el.addEventListener('touchmove', handleTouchMove, { passive: false });
            el.addEventListener('touchend', handleTouchEnd);

            area.appendChild(el);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- Drag & Drop Handlers ---
    function handleDragStart(e) {
        draggedEl = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        document.querySelectorAll('.puzzle-line').forEach(el => {
            el.classList.remove('drag-placeholder');
        });
        draggedEl = null;
        updateLineNumbers();
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDragEnter(e) {
        e.preventDefault();
        if (this !== draggedEl) {
            this.classList.add('drag-placeholder');
        }
    }

    function handleDragLeave() {
        this.classList.remove('drag-placeholder');
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-placeholder');

        if (draggedEl && draggedEl !== this) {
            const area = document.getElementById('puzzleArea');
            const lines = [...area.querySelectorAll('.puzzle-line')];
            const dragIdx = lines.indexOf(draggedEl);
            const dropIdx = lines.indexOf(this);

            if (dragIdx < dropIdx) {
                this.parentNode.insertBefore(draggedEl, this.nextSibling);
            } else {
                this.parentNode.insertBefore(draggedEl, this);
            }
            updateLineNumbers();
        }
    }

    // --- Touch Support ---
    let touchClone = null;
    let touchStartY = 0;

    function handleTouchStart(e) {
        e.preventDefault();
        draggedEl = this;
        this.classList.add('dragging');
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (!draggedEl) return;

        const touchY = e.touches[0].clientY;
        const area = document.getElementById('puzzleArea');
        const lines = [...area.querySelectorAll('.puzzle-line')];

        lines.forEach(line => {
            if (line === draggedEl) return;
            const rect = line.getBoundingClientRect();
            const midY = rect.top + rect.height / 2;

            if (Math.abs(touchY - midY) < rect.height / 2) {
                const dragIdx = lines.indexOf(draggedEl);
                const dropIdx = lines.indexOf(line);
                if (dragIdx < dropIdx) {
                    area.insertBefore(draggedEl, line.nextSibling);
                } else {
                    area.insertBefore(draggedEl, line);
                }
                updateLineNumbers();
            }
        });
    }

    function handleTouchEnd() {
        if (draggedEl) {
            draggedEl.classList.remove('dragging');
            draggedEl = null;
            updateLineNumbers();
        }
    }

    function updateLineNumbers() {
        const lines = document.querySelectorAll('.puzzle-line');
        lines.forEach((line, i) => {
            line.querySelector('.line-number').textContent = i + 1;
            line.classList.remove('correct', 'wrong');
        });
    }

    // Check answer
    function checkAnswer() {
        const puzzle = puzzles[currentPuzzle];
        const lines = document.querySelectorAll('.puzzle-line');
        const userOrder = [...lines].map(el => el.dataset.code);

        let allCorrect = true;
        lines.forEach((line, i) => {
            if (line.dataset.code === puzzle.lines[i]) {
                line.classList.add('correct');
                line.classList.remove('wrong');
            } else {
                line.classList.add('wrong');
                line.classList.remove('correct');
                allCorrect = false;
            }
        });

        const result = document.getElementById('puzzleResult');
        const resultIcon = document.getElementById('resultIcon');
        const resultText = document.getElementById('resultText');
        const resultDesc = document.getElementById('resultDesc');

        if (allCorrect) {
            stopTimer();
            const timeBonus = timeLeft > 0 ? timeLeft : 0;
            score += (streak + 1) * 10 + timeBonus;
            streak++;
            solvedPuzzles.add(currentPuzzle);

            result.className = 'puzzle-result show correct-result';
            resultIcon.textContent = '🎉';
            resultText.textContent = 'PERFECT!';
            resultDesc.textContent = `+${(streak) * 10} puncte + ${timeBonus}s bonus timp! Streak: ${streak} 🔥`;

            document.getElementById('nextBtn').style.display = '';
            document.getElementById('checkBtn').style.display = 'none';
        } else {
            streak = 0;
            result.className = 'puzzle-result show wrong-result';
            resultIcon.textContent = '😅';
            resultText.textContent = 'Nu e corect...';
            resultDesc.textContent = 'Liniile roșii sunt la poziția greșită. Mai încearcă!';
        }

        document.getElementById('scoreBadge').textContent = `Scor: ${score}`;
        document.getElementById('streakBadge').textContent = `🔥 Streak: ${streak}`;
        renderPuzzleSelector();
    }

    function nextPuzzle() {
        if (currentPuzzle < puzzles.length - 1) {
            currentPuzzle++;
        } else {
            // All done!
            currentPuzzle = 0;
        }
        loadPuzzle();
    }

    function shuffleCurrent() {
        const puzzle = puzzles[currentPuzzle];
        const shuffled = shuffle(puzzle.lines);
        renderLines(shuffled);
        document.getElementById('puzzleResult').className = 'puzzle-result';
    }

    // Button handlers
    document.getElementById('checkBtn').addEventListener('click', checkAnswer);
    document.getElementById('nextBtn').addEventListener('click', nextPuzzle);
    document.getElementById('shuffleBtn').addEventListener('click', shuffleCurrent);

    // Init
    loadPuzzle();
})();
