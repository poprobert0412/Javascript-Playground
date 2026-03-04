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
// 🟢 SECȚIUNEA 6: NAVBAR — HAMBURGER MENU + DARK/LIGHT MODE TOGGLE
// ============================================================================

(function initNavbar() {
    // --- Theme: aplică preferința salvată ---
    const saved = localStorage.getItem('js-playground-theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
    }

    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // --- Logo clickabil → duce la Home ---
    const logo = navbar.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => { window.location.href = 'index.html'; });
    }

    // --- Creăm overlay-ul (fundal întunecat când meniul e deschis) ---
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    // --- Creăm butonul hamburger (☰ / ✕) ---
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.id = 'hamburgerBtn';
    hamburger.setAttribute('aria-label', 'Deschide meniul');
    hamburger.innerHTML = '<span></span><span></span><span></span>';

    const navLinks = navbar.querySelector('.nav-links');

    // 🔧 FIX: Mutăm nav-links din navbar → body
    // Navbar are backdrop-filter care creează un "stacking context" propriu.
    // Asta face ca z-index-ul panoului (150) să fie RELATIV la navbar (z-100),
    // nu la pagină. Overlay-ul (z-140 pe body) acoperă tot — ecran negru!
    // Soluția: mutăm panoul pe body = z-index global → funcționează corect.
    document.body.appendChild(navLinks);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        overlay.classList.toggle('show');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Închide meniul când dai click pe un link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Închide cu Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            toggleMenu();
        }
    });

    // --- Creăm wrapper-ul din dreapta (hamburger + theme toggle) ---
    const rightControls = document.createElement('div');
    rightControls.style.cssText = 'display:flex; align-items:center; gap:10px; position:relative; z-index:200;';

    // Theme toggle
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

    rightControls.appendChild(toggle);

    // --- Lo-Fi Beat Music Player ---
    let audioCtx = null;
    let musicPlaying = false;
    let beatInterval = null;

    function createLoFiBeat() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const master = audioCtx.createGain();
        master.gain.value = 0.08;
        const comp = audioCtx.createDynamicsCompressor();
        comp.threshold.value = -20;
        comp.ratio.value = 4;
        master.connect(comp);
        comp.connect(audioCtx.destination);

        // Vinyl crackle
        const cLen = audioCtx.sampleRate * 4;
        const cBuf = audioCtx.createBuffer(1, cLen, audioCtx.sampleRate);
        const cD = cBuf.getChannelData(0);
        for (let i = 0; i < cLen; i++) cD[i] = Math.random() > 0.997 ? (Math.random() - 0.5) * 0.3 : (Math.random() - 0.5) * 0.008;
        const cSrc = audioCtx.createBufferSource();
        cSrc.buffer = cBuf; cSrc.loop = true;
        const cF = audioCtx.createBiquadFilter();
        cF.type = 'bandpass'; cF.frequency.value = 4000;
        const cG = audioCtx.createGain(); cG.gain.value = 0.5;
        cSrc.connect(cF); cF.connect(cG); cG.connect(master); cSrc.start();

        function kick(t) {
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(150, t);
            o.frequency.exponentialRampToValueAtTime(30, t + 0.15);
            g.gain.setValueAtTime(0.8, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.4);
        }

        function hihat(t, open) {
            const len = audioCtx.sampleRate * (open ? 0.15 : 0.05);
            const b = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
            const d = b.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
            const s = audioCtx.createBufferSource(); s.buffer = b;
            const f = audioCtx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000;
            const g = audioCtx.createGain();
            g.gain.setValueAtTime(open ? 0.12 : 0.08, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.15 : 0.05));
            s.connect(f); f.connect(g); g.connect(master); s.start(t);
        }

        function snare(t) {
            const len = audioCtx.sampleRate * 0.12;
            const b = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
            const d = b.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
            const s = audioCtx.createBufferSource(); s.buffer = b;
            const nF = audioCtx.createBiquadFilter(); nF.type = 'bandpass'; nF.frequency.value = 3000;
            const nG = audioCtx.createGain();
            nG.gain.setValueAtTime(0.2, t);
            nG.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            s.connect(nF); nF.connect(nG); nG.connect(master); s.start(t);
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = 'triangle'; o.frequency.value = 180;
            g.gain.setValueAtTime(0.25, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.08);
        }

        const chords = [
            { pad: [220, 261.63, 329.63], bass: 110 },
            { pad: [196, 246.94, 293.66], bass: 98 },
            { pad: [174.61, 220, 261.63], bass: 87.31 },
            { pad: [196, 233.08, 293.66], bass: 98 },
            { pad: [220, 261.63, 329.63], bass: 110 },
            { pad: [174.61, 220, 277.18], bass: 87.31 },
            { pad: [164.81, 196, 246.94], bass: 82.41 },
            { pad: [196, 246.94, 293.66], bass: 98 },
        ];

        const BPM = 75;
        const beatLen = 60 / BPM;
        let beat = 0, chordIdx = 0;

        function tick() {
            if (!musicPlaying || !audioCtx) return;
            const t = audioCtx.currentTime + 0.05;
            const b = beat % 8;
            if ([0, 3, 4, 6].includes(b)) kick(t);
            if ([2, 6].includes(b)) snare(t);
            hihat(t, b === 1 || b === 5);

            if (b === 0) {
                const c = chords[chordIdx % chords.length]; chordIdx++;
                c.pad.forEach((freq, i) => {
                    const o = audioCtx.createOscillator(), g = audioCtx.createGain(), f = audioCtx.createBiquadFilter();
                    o.type = 'triangle'; o.frequency.value = freq; o.detune.value = (Math.random() - 0.5) * 15;
                    f.type = 'lowpass'; f.frequency.value = 500 + Math.random() * 300;
                    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2, t + 0.8);
                    g.gain.setValueAtTime(0.2, t + beatLen * 6); g.gain.linearRampToValueAtTime(0, t + beatLen * 8);
                    o.connect(f); f.connect(g); g.connect(master);
                    o.start(t + i * 0.1); o.stop(t + beatLen * 8.5);
                });
                const bs = audioCtx.createOscillator(), bG = audioCtx.createGain();
                bs.type = 'sine'; bs.frequency.value = c.bass;
                bG.gain.setValueAtTime(0, t); bG.gain.linearRampToValueAtTime(0.4, t + 0.3);
                bG.gain.setValueAtTime(0.4, t + beatLen * 6); bG.gain.linearRampToValueAtTime(0, t + beatLen * 8);
                bs.connect(bG); bG.connect(master); bs.start(t); bs.stop(t + beatLen * 8.5);

                if (Math.random() > 0.3) {
                    const mN = c.pad[Math.floor(Math.random() * 3)] * 2;
                    const m = audioCtx.createOscillator(), mG = audioCtx.createGain();
                    m.type = 'sine'; m.frequency.value = mN;
                    const mT = t + beatLen * (1 + Math.floor(Math.random() * 3));
                    mG.gain.setValueAtTime(0, mT); mG.gain.linearRampToValueAtTime(0.06, mT + 0.2);
                    mG.gain.linearRampToValueAtTime(0, mT + 1.5);
                    m.connect(mG); mG.connect(master); m.start(mT); m.stop(mT + 2);
                }
            }
            beat++;
        }

        beatInterval = setInterval(tick, beatLen * 1000);
        tick();
    }

    function stopMusic() {
        musicPlaying = false;
        if (beatInterval) { clearInterval(beatInterval); beatInterval = null; }
        if (audioCtx) { audioCtx.close().catch(() => {}); audioCtx = null; }
    }

    function startMusic() {
        if (musicPlaying) return;
        musicPlaying = true;
        createLoFiBeat();
        musicBtn.textContent = '🔊';
        musicBtn.title = 'Lo-Fi Beat (On)';
        musicBtn.style.opacity = '1';
    }

    const musicBtn = document.createElement('button');
    musicBtn.className = 'theme-toggle';
    musicBtn.id = 'musicToggle';
    musicBtn.textContent = '🎵';
    musicBtn.title = 'Lo-Fi Beat (Off)';
    musicBtn.style.opacity = '0.5';

    musicBtn.addEventListener('click', () => {
        if (musicPlaying) {
            stopMusic();
            musicBtn.textContent = '🎵';
            musicBtn.title = 'Lo-Fi Beat (Off)';
            musicBtn.style.opacity = '0.5';
            localStorage.setItem('js-playground-music', 'off');
        } else {
            startMusic();
            localStorage.setItem('js-playground-music', 'on');
        }
    });

    // Auto-resume across pages
    if (localStorage.getItem('js-playground-music') === 'on') {
        try {
            const test = new (window.AudioContext || window.webkitAudioContext)();
            if (test.state === 'running') { test.close(); startMusic(); }
            else {
                test.close();
                const resume = () => { if (!musicPlaying) startMusic(); };
                document.addEventListener('click', resume, { once: true });
                document.addEventListener('scroll', resume, { once: true, passive: true });
                musicBtn.textContent = '⏸️'; musicBtn.title = 'Click/scroll to resume'; musicBtn.style.opacity = '0.8';
            }
        } catch (e) {
            document.addEventListener('click', () => { if (!musicPlaying) startMusic(); }, { once: true });
        }
    }

    rightControls.appendChild(musicBtn);
    rightControls.appendChild(hamburger);
    navbar.appendChild(rightControls);

    // Ctrl+K hint badge
    const hint = document.createElement('div');
    hint.className = 'ctrl-k-hint';
    hint.innerHTML = '<kbd>Ctrl</kbd> + <kbd>K</kbd> Caută';
    document.body.appendChild(hint);

    // --- Scroll to Top Button ---
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scrollToTopBtn';
    scrollBtn.innerHTML = '↑';
    scrollBtn.title = 'Înapoi sus';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.style.cssText = 'position:fixed!important;bottom:30px!important;right:30px!important;width:48px!important;height:48px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,0.15)!important;background:rgba(30,30,50,0.9)!important;color:#00d2ff!important;font-size:1.3rem!important;cursor:pointer!important;z-index:99999!important;opacity:0;pointer-events:none;transition:opacity 0.3s ease;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:0 4px 20px rgba(0,0,0,0.4)!important;';
    document.documentElement.appendChild(scrollBtn);

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function checkScroll() {
        const s = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        scrollBtn.style.opacity = s > 300 ? '1' : '0';
        scrollBtn.style.pointerEvents = s > 300 ? 'all' : 'none';
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    document.addEventListener('scroll', checkScroll, { passive: true });
    setInterval(checkScroll, 300);

    // Hover glow on scroll button
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.background = 'rgba(0, 210, 255, 0.2)';
        scrollBtn.style.borderColor = '#00d2ff';
        scrollBtn.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.4)';
    });
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.background = 'rgba(30, 30, 50, 0.9)';
        scrollBtn.style.borderColor = 'rgba(255,255,255,0.15)';
        scrollBtn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
    });

    // --- Scroll Progress Bar ---
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgressBar';
    progressBar.style.cssText = 'position:fixed!important;top:0!important;left:0!important;height:3px!important;width:0%!important;background:linear-gradient(90deg,#00d2ff,#7b2ff7,#ff6b9d)!important;z-index:100001!important;transition:width 0.1s linear!important;pointer-events:none!important;';
    document.documentElement.appendChild(progressBar);

    function updateProgress() {
        const s = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
        const percent = docHeight > 0 ? Math.min((s / docHeight) * 100, 100) : 0;
        progressBar.style.width = percent + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    document.addEventListener('scroll', updateProgress, { passive: true });
    setInterval(updateProgress, 300);

    // --- Reading Time Badge ---
    const mainContent = document.querySelector('main');
    if (mainContent) {
        const textContent = mainContent.textContent || '';
        const wordCount = textContent.trim().split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words/min

        const badge = document.querySelector('.badge');
        if (badge) {
            badge.textContent += ` • ⏱️ ${readingTime} min citire`;
        } else {
            // Create reading time badge if no badge exists
            const pageHeader = document.querySelector('.page-header');
            if (pageHeader) {
                const timeBadge = document.createElement('span');
                timeBadge.className = 'badge';
                timeBadge.textContent = `⏱️ ${readingTime} min citire`;
                timeBadge.style.cssText = 'display:inline-block;margin-top:14px;padding:5px 14px;background:rgba(0,210,255,0.1);border:1px solid rgba(0,210,255,0.3);border-radius:20px;font-size:0.82rem;color:#00d2ff;font-weight:500;';
                pageHeader.appendChild(timeBadge);
            }
        }
    }

    // --- Copy Button on Code Blocks ---
    document.querySelectorAll('.code-block').forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '📋 Copiază';
        copyBtn.title = 'Copiază codul';
        copyBtn.style.cssText = 'position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#ccc;border-radius:8px;padding:6px 14px;font-size:0.85rem;cursor:pointer;opacity:0.7;transition:opacity 0.2s ease, background 0.2s ease;z-index:10;';

        // Make code-block relative for absolute positioning
        block.style.position = 'relative';

        block.addEventListener('mouseenter', () => { copyBtn.style.opacity = '1'; copyBtn.style.background = 'rgba(0,210,255,0.15)'; });
        block.addEventListener('mouseleave', () => { copyBtn.style.opacity = '0.7'; copyBtn.style.background = 'rgba(255,255,255,0.1)'; });

        copyBtn.addEventListener('click', async () => {
            // Get clean text (without the lang-tag)
            const langTag = block.querySelector('.lang-tag');
            const cloned = block.cloneNode(true);
            const clonedTag = cloned.querySelector('.lang-tag');
            if (clonedTag) clonedTag.remove();
            const text = cloned.textContent.trim();

            try {
                await navigator.clipboard.writeText(text);
                copyBtn.textContent = '✅ Copiat!';
                setTimeout(() => { copyBtn.textContent = '📋 Copiază'; }, 1500);
            } catch {
                // Fallback for older browsers
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                copyBtn.textContent = '✅';
                setTimeout(() => { copyBtn.textContent = '📋'; }, 1500);
            }
        });

        block.appendChild(copyBtn);
    });

    // --- Citatul Zilei ---
    const quotes = [
        { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
        { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
        { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
        { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
        { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
        { text: "Fix the cause, not the symptom.", author: "Steve Maguire" },
        { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
        { text: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" },
        { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
        { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
        { text: "Debugging is twice as hard as writing the code in the first place.", author: "Brian Kernighan" },
        { text: "It's not a bug — it's an undocumented feature.", author: "Anonymous" },
        { text: "JavaScript is the world's most misunderstood programming language.", author: "Douglas Crockford" },
    ];

    const pageHeader = document.querySelector('.page-header');
    if (pageHeader && !window.location.pathname.includes('index.html') && !window.location.pathname.endsWith('/')) {
        const todayIndex = new Date().getDate() % quotes.length;
        const q = quotes[todayIndex];
        const quoteEl = document.createElement('div');
        quoteEl.style.cssText = 'margin-top:16px;font-style:italic;color:var(--text-secondary);font-size:0.85rem;opacity:0.7;';
        quoteEl.innerHTML = `💬 <em>"${q.text}"</em> — <strong>${q.author}</strong>`;
        pageHeader.appendChild(quoteEl);
    }

    // =========================================================================
    // 🎨 PREMIUM UI EFFECTS
    // =========================================================================

    // --- 1. Smooth Page Transitions ---
    const pageTransitionStyle = document.createElement('style');
    pageTransitionStyle.textContent = `
        body { animation: pageSlideIn 0.4s ease-out; }
        @keyframes pageSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        body.page-leaving { animation: pageFadeOut 0.25s ease-in forwards; }
        @keyframes pageFadeOut { to { opacity: 0; transform: translateY(-8px); } }
    `;
    document.head.appendChild(pageTransitionStyle);

    // Intercept nav link clicks for smooth transition
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || link.classList.contains('active')) return;
            e.preventDefault();
            document.body.classList.add('page-leaving');
            setTimeout(() => { window.location.href = href; }, 250);
        });
    });

    // --- 2. Particle Sparkles on Card Hover ---
    document.querySelectorAll('.feature-card, .card').forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            for (let i = 0; i < 6; i++) {
                const spark = document.createElement('span');
                spark.textContent = ['✨', '⚡', '💫', '🌟'][Math.floor(Math.random() * 4)];
                spark.style.cssText = `position:absolute;font-size:${10 + Math.random() * 8}px;pointer-events:none;z-index:50;opacity:1;transition:all 0.8s ease-out;`;
                const rect = card.getBoundingClientRect();
                spark.style.left = (Math.random() * rect.width) + 'px';
                spark.style.top = (Math.random() * rect.height) + 'px';
                card.style.position = card.style.position || 'relative';
                card.appendChild(spark);
                requestAnimationFrame(() => {
                    spark.style.opacity = '0';
                    spark.style.transform = `translateY(-${30 + Math.random() * 40}px) scale(0.3)`;
                });
                setTimeout(() => spark.remove(), 900);
            }
        });
    });

    // --- 3. Custom Cursor Glow ---
    const cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursorGlow';
    cursorGlow.style.cssText = 'position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(0,210,255,0.04) 0%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:opacity 0.3s ease;opacity:0;';
    document.documentElement.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
        cursorGlow.style.opacity = '1';
    });
    document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });

    // --- 4. Skeleton Loading ---
    const skeletonStyle = document.createElement('style');
    skeletonStyle.textContent = `
        .skeleton-overlay { position: fixed; inset: 0; z-index: 100000; background: var(--bg-primary, #0a0a1a); display: flex; flex-direction: column; padding: 80px 30px 30px; gap: 20px; animation: skeletonFadeOut 0.4s ease-out 0.3s forwards; pointer-events: none; }
        .skeleton-bar { height: 20px; border-radius: 8px; background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        .skeleton-bar.wide { width: 60%; height: 32px; margin-bottom: 10px; }
        .skeleton-bar.medium { width: 80%; }
        .skeleton-bar.short { width: 40%; }
        .skeleton-bar.block { width: 100%; height: 120px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes skeletonFadeOut { to { opacity: 0; visibility: hidden; } }
    `;
    document.head.appendChild(skeletonStyle);

    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-overlay';
    skeleton.innerHTML = '<div class="skeleton-bar wide"></div><div class="skeleton-bar medium"></div><div class="skeleton-bar short"></div><div class="skeleton-bar block"></div><div class="skeleton-bar medium"></div><div class="skeleton-bar short"></div>';
    document.body.appendChild(skeleton);
    setTimeout(() => skeleton.remove(), 800);

    // --- 5. Active Section Highlight (lectii.html) ---
    if (window.location.pathname.includes('lectii')) {
        const sections = document.querySelectorAll('.lesson-section, .card[id]');
        const tocLinks = document.querySelectorAll('.table-of-contents a, .toc a');

        if (sections.length > 0) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id || entry.target.dataset.lesson;
                        if (id) {
                            tocLinks.forEach(l => l.style.borderLeft = '');
                            tocLinks.forEach(l => {
                                if (l.getAttribute('href') === '#' + id) {
                                    l.style.borderLeft = '3px solid #00d2ff';
                                    l.style.paddingLeft = '8px';
                                }
                            });
                        }
                    }
                });
            }, { threshold: 0.3, rootMargin: '-60px 0px -40% 0px' });

            sections.forEach(s => sectionObserver.observe(s));
        }
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


// ============================================================================
// 🟢 SECȚIUNEA 9: EXPORT / IMPORT PROGRES
// ============================================================================

window.exportProgress = function () {
    const data = {
        progress: JSON.parse(localStorage.getItem('js-playground-progress') || '{}'),
        achievements: JSON.parse(localStorage.getItem('js-playground-achievements') || '[]'),
        theme: localStorage.getItem('js-playground-theme') || 'dark',
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `js-playground-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
};

window.importProgress = function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.progress) localStorage.setItem('js-playground-progress', JSON.stringify(data.progress));
                if (data.achievements) localStorage.setItem('js-playground-achievements', JSON.stringify(data.achievements));
                if (data.theme) localStorage.setItem('js-playground-theme', data.theme);
                alert('✅ Progres importat cu succes! Pagina se va reîncărca.');
                location.reload();
            } catch (err) {
                alert('❌ Fișier invalid! Selectează un backup JSON valid.');
            }
        };
        reader.readAsText(file);
    });
    input.click();
};


// ============================================================================
// 🟢 SECȚIUNEA 10: CONFETTI ANIMATION 🎊
// ============================================================================

window.launchConfetti = function () {
    const colors = ['#e94560', '#00d2ff', '#533483', '#00e676', '#ffab40', '#ffd700', '#ff6b6b', '#b388ff'];
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
    document.body.appendChild(container);

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        const size = Math.random() * 10 + 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const duration = Math.random() * 2 + 2;
        const rotation = Math.random() * 720 - 360;
        const shapes = ['50%', '0%', '30%'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        piece.style.cssText = `
            position:absolute; top:-20px; left:${left}%;
            width:${size}px; height:${size}px;
            background:${color}; border-radius:${shape};
            opacity:1;
            animation: confettiFall ${duration}s ease-in ${delay}s forwards;
        `;
        container.appendChild(piece);
    }

    setTimeout(() => container.remove(), 4000);
};


// ============================================================================
// 🟢 SECȚIUNEA 11: SOUND EFFECTS 🔊
// ============================================================================

const SoundFX = {
    ctx: null,
    getCtx() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        return this.ctx;
    },
    play(type) {
        try {
            const ctx = this.getCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'correct') {
                osc.frequency.setValueAtTime(523, ctx.currentTime);     // C5
                osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
                osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.5);
            } else if (type === 'wrong') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
            } else if (type === 'click') {
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                gain.gain.setValueAtTime(0.05, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.08);
            }
        } catch (e) { /* AudioContext not supported */ }
    }
};

window.SoundFX = SoundFX;


// ============================================================================
// 🟢 SECȚIUNEA 12: CTRL+K GLOBAL SEARCH SHORTCUT
// ============================================================================

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        window.location.href = 'search.html';
    }
});


// ============================================================================
// 🟢 SECȚIUNEA 13: PAGE LOAD ANIMATION (Fade In)
// ============================================================================


(function pageLoadAnimation() {
    // Create transition bar
    const bar = document.createElement('div');
    bar.className = 'page-transition-bar';
    document.body.appendChild(bar);

    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(8px)';
    document.body.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

    function reveal() {
        requestAnimationFrame(function () {
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        });
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', reveal);
    } else {
        reveal();
    }
})();


// ============================================================================
// 🟢 SECŢIUNEA 14: SMOOTH PAGE TRANSITIONS
// ============================================================================

document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || link.target === '_blank') return;

    e.preventDefault();

    // Activate loading bar
    var bar = document.querySelector('.page-transition-bar');
    if (bar) bar.classList.add('loading');

    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(-8px)';

    setTimeout(function () {
        if (bar) bar.classList.add('done');
        setTimeout(function () { window.location.href = href; }, 150);
    }, 250);
});


// ============================================================================
// 🟢 SECŢIUNEA 15: SCROLL ANIMATIONS (Intersection Observer)
// ============================================================================

(function initScrollAnimations() {
    var variantMap = {
        '.page-header': 'scroll-fade-down',
        '.landing-card:nth-child(odd)': 'scroll-fade-left',
        '.landing-card:nth-child(even)': 'scroll-fade-right',
        '.overview-card': 'scroll-scale-up',
        '.achievement-card:nth-child(odd)': 'scroll-fade-left',
        '.achievement-card:nth-child(even)': 'scroll-fade-right',
        '.level-card': 'scroll-scale-up',
        '.error-page': 'scroll-scale-up'
    };

    var defaultSelectors = '.card, .progress-section, .recent-activity, .roadmap-item, .prof-note, .puzzle-container, .flashcard-container';

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    function observeElements() {
        // Apply specific directional variants
        Object.entries(variantMap).forEach(function (pair) {
            document.querySelectorAll(pair[0]).forEach(function (el, i) {
                if (!el.classList.contains('scroll-animated')) {
                    el.classList.add('scroll-animated', pair[1]);
                    el.style.transitionDelay = Math.min(i * 0.08, 0.5) + 's';
                    observer.observe(el);
                }
            });
        });

        // Apply default fade-up to remaining elements
        document.querySelectorAll(defaultSelectors).forEach(function (el, i) {
            if (!el.classList.contains('scroll-animated')) {
                el.classList.add('scroll-animated', 'scroll-fade-up');
                el.style.transitionDelay = Math.min(i * 0.08, 0.5) + 's';
                observer.observe(el);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeElements);
    } else {
        observeElements();
    }

    setTimeout(observeElements, 500);
})();


// ============================================================================
// 🟢 SECȚIUNEA 16: TOOLTIP SYSTEM
// ============================================================================

(function initTooltips() {
    // Tooltip data for navigation links
    const tooltipMap = {
        '🏠 Acasă': 'Pagina principală',
        '📖 Lecții': '19 lecții interactive JavaScript',
        '✏️ Exerciții': '18 exerciții practice cu editor',
        '❓ Quiz': '15 quiz-uri pentru testare',
        '📋 Cheatsheet': 'Referință rapidă concepte JS',
        '🔧 DevTools': 'Ghid Chrome Developer Tools',
        '🎯 Provocări': '8 provocări avansate',
        '🚀 Proiecte': '3 mini-proiecte reale',
        '🐛 Debug': 'Tehnici de debugging JS',
        '📖 Glosar': 'Dicționar de termeni',
        '🔍 Caută': 'Caută în tot conținutul',
        '💻 Playground': 'Consolă JS interactivă',
        '🏆 Achievements': '10 badge-uri de colectat',
        '📊 Dashboard': 'Progresul tău global',
        '🧩 Code Puzzle': '10 puzzle-uri drag & drop',
        '🃏 Flashcards': '44 termeni cu flip 3D'
    };

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'js-tooltip';
    tooltip.style.cssText = `
        position: fixed; z-index: 9999;
        padding: 6px 12px; border-radius: 8px;
        background: rgba(0, 0, 0, 0.85); color: #e0e0e0;
        font-size: 0.75rem; font-weight: 500;
        pointer-events: none; opacity: 0;
        transition: opacity 0.2s ease, transform 0.2s ease;
        transform: translateY(4px);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        white-space: nowrap;
        font-family: 'Inter', sans-serif;
    `;
    document.body.appendChild(tooltip);

    // Apply tooltips to nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        const text = link.textContent.trim();
        if (tooltipMap[text]) {
            link.setAttribute('data-tooltip', tooltipMap[text]);
        }
    });

    // Global tooltip handlers
    document.addEventListener('mouseover', (e) => {
        const el = e.target.closest('[data-tooltip]');
        if (!el) return;

        tooltip.textContent = el.getAttribute('data-tooltip');
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';

        const rect = el.getBoundingClientRect();
        const tipRect = tooltip.getBoundingClientRect();
        let left = rect.left + rect.width / 2 - tipRect.width / 2;
        let top = rect.top - tipRect.height - 8;

        // Keep in viewport
        if (left < 8) left = 8;
        if (left + tipRect.width > window.innerWidth - 8) left = window.innerWidth - tipRect.width - 8;
        if (top < 8) top = rect.bottom + 8; // flip below

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    });

    document.addEventListener('mouseout', (e) => {
        const el = e.target.closest('[data-tooltip]');
        if (!el) return;
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateY(4px)';
    });
})();
