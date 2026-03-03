// ============================================================================
// 📁 script.js — Fișierul JavaScript principal (PARTAJAT pe toate paginile)
// ============================================================================
//
// 🎓 DE CE E ÎNTR-UN FIȘIER SEPARAT?
// -----------------------------------
// În HTML, poți pune cod JavaScript în 2 moduri:
//
//   1. INLINE (direct în HTML):    <script> cod aici </script>
//   2. EXTERN (fișier separat):    <script src="script.js"></script>
//
// Metoda 2 (externă) e MAI BUNĂ pentru că:
//   ✅ Separi structura (HTML) de logică (JS) — cod mai curat
//   ✅ Poți reutiliza același JS pe mai multe pagini
//   ✅ Browser-ul poate CACHE-ui fișierul JS (pagina se încarcă mai rapid)
//   ✅ E mai ușor de citit și depanat (debug)
//
// Acest fișier e folosit de: playground.html, lectii.html, exercitii.html
// Fiecare pagină are doar elementele de care are nevoie.
//
// ============================================================================


// ============================================================================
// #CONST — Ce înseamnă "const"?
// ============================================================================
//
// "const" vine de la CONSTANT (constantă)
// Când declari o variabilă cu "const", valoarea EI nu poate fi schimbată
//
//   const nume = "Robert";  
//   nume = "Ion";  // ❌ ERROR! Nu poți reasigna un const
//
// Dar ATENȚIE: dacă const-ul e un OBIECT sau ARRAY, poți modifica conținutul!
//   const lista = [1, 2, 3];
//   lista.push(4);  // ✅ OK! Modifici conținutul, nu variabila în sine
//   lista = [5, 6]; // ❌ ERROR! Încerci să reasignezi variabila
//
// REGULA: Folosește CONST pentru tot ceea ce NU trebuie reasignat
//         Folosește LET doar când valoarea se schimbă (ex: contoare)
//         Nu folosi VAR — e o metodă veche cu probleme
//
// ============================================================================


// ============================================================================
// #LET — Ce înseamnă "let"?
// ============================================================================
//
// "let" declară o variabilă care POATE fi reasignată (schimbată)
//
//   let varsta = 25;
//   varsta = 26;  // ✅ OK! let permite reasignarea
//
//   let contor = 0;
//   contor++;     // ✅ OK! contor devine 1
//   contor++;     // ✅ OK! contor devine 2
//
// Folosești "let" când valoarea SE SCHIMBĂ pe parcurs (contoare, stări, etc.)
//
// ============================================================================


// ============================================================================
// #DOCUMENT.GETELEMENTBYID — Cum selectezi un element din pagină?
// ============================================================================
//
// document = PAGINA ta HTML, reprezentată ca un obiect JavaScript
// getElementById("id") = caută un element cu id-ul specificat
//
// Exemplu: dacă în HTML ai <input id="consoleInput">
// Și în JS scrii: document.getElementById("consoleInput")
// Primești acel element și poți face lucruri cu el!
//
// DACĂ ELEMENTUL NU EXISTĂ pe pagină, primești NULL
// De aceea verificăm cu "if (element)" înainte de a-l folosi
//
// ============================================================================


// ============================================================================
// 🟢 SECȚIUNEA 1: CONSOLA INTERACTIVĂ
// ============================================================================
// Această secțiune rulează DOAR pe paginile care au consolă (playground.html)
// Verificăm cu "if" dacă elementele există pe pagină

const consoleInput = document.getElementById('consoleInput');
const consoleOutput = document.getElementById('consoleOutput');
const runBtn = document.getElementById('runBtn');

// Variabile pentru istoricul de comenzi
let commandHistory = [];
let historyIndex = -1;


// ============================================================================
// #FUNCTION — Ce înseamnă o funcție?
// ============================================================================
//
// O funcție e un BLOC DE COD REUTILIZABIL
// O definești o dată, o apelezi (chemi) de câte ori vrei
//
//   function salut(nume) { return `Bună, ${nume}!`; }
//   salut("Robert");  // → "Bună, Robert!"
//   salut("Maria");   // → "Bună, Maria!"
//
// Parametrii (ce pui între paranteze) sunt "ingredientele" funcției
// "return" returnează un rezultat (ca la matematică: f(x) = x + 1)
//
// ============================================================================


// Funcție care adaugă o linie de text în consola vizuală
function addOutput(text, type = 'result') {
    // Dacă nu există consola pe pagină, ieși
    if (!consoleOutput) return;

    const line = document.createElement('div');
    line.className = `output-line ${type}`;
    line.textContent = text;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}


// ============================================================================
// #EVAL — Funcția EXECUTE CODE
// ============================================================================
//
// eval() ia un STRING (text) și îl EXECUTĂ ca și cod JavaScript
//   eval("2 + 2")       → returnează 4
// ⚠️ eval() e PERICULOS în producție! Aici e OK pentru învățare locală.
//
// #ORIGINALLOG — De ce salvăm console.log?
// Vrem ca console.log() să afișeze pe pagina noastră, nu în consola browser-ului.
// Strategia: salvăm originalul → înlocuim → executăm → restaurăm
//
// ============================================================================
function executeCode(code) {
    if (!code.trim()) return;

    addOutput(`❯ ${code}`, 'info');
    commandHistory.unshift(code);
    historyIndex = -1;

    const originalLog = console.log;
    const outputs = [];

    // #ARROW_FUNCTION — (...args) => { ... } = funcție săgeată
    // #SPREAD — ...args captează TOATE argumentele într-un array
    console.log = (...args) => {
        // #MAP — transformă fiecare element, #TYPEOF — verifică tipul
        // #TRIPLU_EGAL (===) — compară valoare + tip (strict equality)
        outputs.push(args.map(a => {
            if (typeof a === 'object') return JSON.stringify(a, null, 2);
            return String(a);
        }).join(' '));
    };

    // #TRY_CATCH — prinde erorile fără să crape pagina
    try {
        const result = eval(code);
        outputs.forEach(o => addOutput(o, 'result'));
        if (result !== undefined && outputs.length === 0) {
            addOutput(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result), 'result');
        }
    } catch (err) {
        addOutput(`❌ ${err.message}`, 'error');
    }

    console.log = originalLog;
}


// Funcție pentru butoanele "▶ Încearcă"
function tryCode(code) {
    if (!consoleInput) return;
    consoleInput.value = code;
    executeCode(code);
    consoleInput.value = '';
    consoleInput.focus();
}


// ============================================================================
// #ADDEVENTLISTENER — Ascultăm evenimentele (DOAR dacă elementele există)
// ============================================================================

if (runBtn) {
    runBtn.addEventListener('click', () => {
        executeCode(consoleInput.value);
        consoleInput.value = '';
    });
}

if (consoleInput) {
    consoleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCode(consoleInput.value);
            consoleInput.value = '';
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                consoleInput.value = commandHistory[historyIndex];
            }
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                consoleInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = -1;
                consoleInput.value = '';
            }
        }
    });
}


// ============================================================================
// 🟢 SECȚIUNEA 2: EXERCIȚII — Rulează codul din textarea
// ============================================================================

function runExercise(id) {
    const code = document.getElementById(id).value;
    const outputEl = document.getElementById(`${id}-output`);
    outputEl.style.display = 'block';
    outputEl.innerHTML = '';

    const originalLog = console.log;
    const outputs = [];

    console.log = (...args) => {
        outputs.push(args.map(a => {
            if (typeof a === 'object') return JSON.stringify(a);
            return String(a);
        }).join(' '));
    };

    try {
        eval(code);
        if (outputs.length > 0) {
            outputEl.innerHTML = outputs.map(o =>
                `<div class="output-line result">✅ ${o}</div>`
            ).join('');
        } else {
            outputEl.innerHTML = '<div class="output-line info">ℹ️ Codul a rulat, dar nu a afișat nimic. Adaugă console.log()!</div>';
        }
    } catch (err) {
        outputEl.innerHTML = `<div class="output-line error">❌ ${err.message}</div>`;
    }

    console.log = originalLog;
}

// Funcție: arată/ascunde hint-ul
function showHint(id) {
    const hint = document.getElementById(id);
    hint.style.display = hint.style.display === 'block' ? 'none' : 'block';
}


// ============================================================================
// 🟢 SECȚIUNEA 3: MESAJ DE BUN VENIT (doar pe paginile cu consolă)
// ============================================================================
if (consoleOutput) {
    addOutput('🚀 Bine ai venit! Scrie cod JavaScript și apasă Enter sau ▶ RUN.', 'info');
    addOutput('💡 Încearcă: 2 + 2, "salut".toUpperCase(), [1,2,3].map(n => n * 10)', 'info');
}


// ============================================================================
// 🟢 SECȚIUNEA 4: DEMO-URI INTERACTIVE (doar pe lectii.html)
// ============================================================================
// Toate demo-urile verifică dacă elementele există cu "if (element)"
// Așa putem folosi ACELAȘI fișier JS pe TOATE paginile fără erori!

// #DEMO_COUNTER — Counter cu click
const counterBtn = document.getElementById('counterBtn');
if (counterBtn) {
    let clickCount = 0;
    const counterDisplay = document.getElementById('counterDisplay');
    const counterLog = document.getElementById('counterLog');

    counterBtn.addEventListener('click', () => {
        clickCount++;
        counterDisplay.textContent = clickCount;
        counterDisplay.classList.add('bump');
        setTimeout(() => counterDisplay.classList.remove('bump'), 200);
        counterLog.textContent = `Click #${clickCount} — addEventListener("click") a fost apelat!`;
    });
}

// #DEMO_INPUT — Input în timp real
const liveInput = document.getElementById('liveInput');
if (liveInput) {
    const liveInputOutput = document.getElementById('liveInputOutput');

    liveInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.length === 0) {
            liveInputOutput.innerHTML = 'Textul tău: <em>nimic încă</em>';
        } else {
            liveInputOutput.textContent = `Ai scris: "${val}" (${val.length} caractere)`;
        }
    });
}

// #DEMO_KEYDOWN — Detector de taste
const keyArea = document.getElementById('keyArea');
if (keyArea) {
    const keyDisplay = document.getElementById('keyDisplay');
    const keyInfo = document.getElementById('keyInfo');

    keyArea.addEventListener('keydown', (e) => {
        e.preventDefault();
        keyDisplay.textContent = e.key === ' ' ? 'Space' : e.key;
        keyDisplay.classList.add('pressed');
        keyInfo.textContent = `key: "${e.key}" | code: "${e.code}" | keyCode: ${e.keyCode}`;
    });

    keyArea.addEventListener('keyup', () => {
        keyDisplay.classList.remove('pressed');
    });
}

// #DEMO_HOVERBOX — Hover cu mouse-ul
const hoverBox = document.getElementById('hoverBox');
if (hoverBox) {
    const hoverLog = document.getElementById('hoverLog');
    const colors = ['#e94560', '#00d2ff', '#533483', '#00e676', '#ffab40', '#ff6b6b'];
    let colorIndex = 0;

    // #MODULO (%) — ciclăm prin array: (index + 1) % array.length
    hoverBox.addEventListener('mouseover', () => {
        colorIndex = (colorIndex + 1) % colors.length;
        hoverBox.style.background = colors[colorIndex];
        hoverBox.style.transform = 'scale(1.2) rotate(10deg)';
        hoverBox.style.borderRadius = '20px';
        hoverLog.textContent = `mouseover → culoare: ${colors[colorIndex]}, scale(1.2)`;
    });

    hoverBox.addEventListener('mouseout', () => {
        hoverBox.style.background = '#e94560';
        hoverBox.style.transform = 'scale(1)';
        hoverBox.style.borderRadius = '12px';
        hoverLog.textContent = 'mouseout → revenit la normal';
    });
}

// ============================================================================
// 🟢 SECȚIUNEA 5: DOM DEMO (doar pe lectii.html)
// ============================================================================
const demoTarget = document.getElementById('demoTarget');
if (demoTarget) {
    window.demoChangeText = function () {
        demoTarget.textContent = '✅ Textul a fost schimbat cu textContent!';
    };
    window.demoChangeStyle = function () {
        demoTarget.style.color = '#00d2ff';
        demoTarget.style.fontSize = '1.3rem';
        demoTarget.style.fontWeight = '700';
    };
    window.demoChangeHTML = function () {
        demoTarget.innerHTML = '🔥 Acum am <strong style="color:#e94560;">HTML</strong> înăuntru!';
    };
    window.demoReset = function () {
        demoTarget.textContent = 'Eu sunt un paragraf. Modifică-mă cu butoanele de mai jos!';
        demoTarget.style.color = '';
        demoTarget.style.fontSize = '';
        demoTarget.style.fontWeight = '';
    };
}


// ============================================================================
// 🎓 RECAPITULARE — CE AI ÎNVĂȚAT ÎN ACEST FIȘIER:
// ============================================================================
//
// #CONST      = variabilă constantă (nu poate fi reasignată)
// #LET        = variabilă care poate fi reasignată
// #FUNCTION   = bloc de cod reutilizabil
// #ARROW      = (x) => x * 2  —  funcție scurtă (arrow function)
// #DOCUMENT   = pagina HTML ca obiect JavaScript
// #GETELEMENTBYID = găsește un element după id
// #TEXTCONTENT = textul unui element (safe)
// #INNERHTML   = conținutul HTML al unui element (permite tag-uri)
// #CLASSLIST   = gestionarea claselor CSS (.add, .remove, .toggle)
// #APPENDCHILD = adaugă un element copil
// #STYLE       = modifică stiluri CSS din JS
// #ADDEVENTLISTENER = ascultă un eveniment și reacționează
// #PREVENTDEFAULT   = oprește comportamentul default al browser-ului
// #EVAL        = execută un string ca cod JS (⚠️ periculos în producție!)
// #TRYCATCH    = prinde erorile fără să crape pagina
// #TYPEOF      = verifică tipul unei valori
// #TRIPLU_EGAL = === compară valoare + tip (strict equality)
// #TERNARY     = condiție ? dacă_da : dacă_nu
// #MAP         = .map() transformă fiecare element dintr-un array
// #FILTER      = .filter() filtrează elementele unui array
// #FOREACH     = .forEach() execută o funcție pentru fiecare element
// #JOIN        = .join() unește elementele unui array într-un string
// #PUSH        = .push() adaugă la sfârșitul unui array
// #UNSHIFT     = .unshift() adaugă la începutul unui array
// #SETTIMEOUT  = execută cod după un delay
// #MODULO      = % returnează restul împărțirii
// #SPREAD      = ...args captează toate argumentele într-un array
// #LENGTH      = numărul de caractere/elemente
// #TRIM        = elimină spațiile de la capete
// #FOCUS       = mută cursorul pe un element
// #SCROLLTOP   = controlează poziția de scroll
//
// ============================================================================


// ============================================================================
// 🟢 SECȚIUNEA 6: DARK/LIGHT MODE TOGGLE
// ============================================================================
// Salvăm preferința în localStorage ca să persisteze între sesiuni

(function initTheme() {
    const saved = localStorage.getItem('js-playground-theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
    }

    // Adaugă butonul de toggle în navbar (dacă există)
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.id = 'themeToggle';
        toggle.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
        toggle.title = 'Schimbă tema Dark/Light';
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            toggle.textContent = isLight ? '🌙' : '☀️';
            localStorage.setItem('js-playground-theme', isLight ? 'light' : 'dark');
        });
        navbar.appendChild(toggle);
    }
})();


// ============================================================================
// 🟢 SECȚIUNEA 7: PROGRESS TRACKER (localStorage)
// ============================================================================
// Salvează ce lecții, exerciții și quiz-uri ai completat

const JSProgress = {
    getAll() {
        const data = localStorage.getItem('js-playground-progress');
        return data ? JSON.parse(data) : { lessons: [], exercises: [], quizzes: [], challenges: [] };
    },
    save(data) {
        localStorage.setItem('js-playground-progress', JSON.stringify(data));
    },
    markDone(category, id) {
        const data = this.getAll();
        if (!data[category].includes(id)) {
            data[category].push(id);
            this.save(data);
            Achievements.check(data);
        }
        return data;
    },
    isCompleted(category, id) {
        return this.getAll()[category].includes(id);
    },
    getCount(category) {
        return this.getAll()[category].length;
    },
    reset() {
        localStorage.removeItem('js-playground-progress');
        localStorage.removeItem('js-playground-achievements');
    }
};

// Expune în window ca sa poata fi accesat de alte pagini
window.JSProgress = JSProgress;


// ============================================================================
// 🟢 SECȚIUNEA 8: ACHIEVEMENTS SYSTEM
// ============================================================================

const Achievements = {
    list: [
        { id: 'first-lesson', name: '📖 Prima Lecție', desc: 'Ai completat prima lecție!', check: d => d.lessons.length >= 1 },
        { id: 'five-lessons', name: '📚 Cititor Dedicat', desc: 'Ai completat 5 lecții!', check: d => d.lessons.length >= 5 },
        { id: 'all-lessons', name: '🏆 Maestru Lecțiilor', desc: 'Ai completat TOATE lecțiile!', check: d => d.lessons.length >= 19 },
        { id: 'first-exercise', name: '✏️ Primul Exercițiu', desc: 'Ai rezolvat primul exercițiu!', check: d => d.exercises.length >= 1 },
        { id: 'ten-exercises', name: '💪 Antrenament Serios', desc: 'Ai rezolvat 10 exerciții!', check: d => d.exercises.length >= 10 },
        { id: 'all-exercises', name: '🥇 Expert Exerciții', desc: 'Ai rezolvat TOATE exercițiile!', check: d => d.exercises.length >= 18 },
        { id: 'first-quiz', name: '❓ Primul Quiz', desc: 'Ai răspuns la primul quiz!', check: d => d.quizzes.length >= 1 },
        { id: 'all-quizzes', name: '🧠 Geniu la Quiz', desc: 'Ai terminat TOATE quiz-urile!', check: d => d.quizzes.length >= 15 },
        { id: 'first-challenge', name: '🎯 Prima Provocare', desc: 'Ai rezolvat prima provocare!', check: d => d.challenges.length >= 1 },
        { id: 'all-challenges', name: '🔥 Hacker Man', desc: 'Ai rezolvat TOATE provocările!', check: d => d.challenges.length >= 8 },
    ],

    getUnlocked() {
        const data = localStorage.getItem('js-playground-achievements');
        return data ? JSON.parse(data) : [];
    },

    check(progressData) {
        const unlocked = this.getUnlocked();
        this.list.forEach(a => {
            if (!unlocked.includes(a.id) && a.check(progressData)) {
                unlocked.push(a.id);
                localStorage.setItem('js-playground-achievements', JSON.stringify(unlocked));
                this.showToast(a);
            }
        });
    },

    showToast(achievement) {
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.textContent = `🏅 Achievement: ${achievement.name} — ${achievement.desc}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
};

window.Achievements = Achievements;
