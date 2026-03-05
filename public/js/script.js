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

    // --- ✨ SUPER MEGA COMPLEX HAPPY LO-FI BEAT ✨ ---
    let audioCtx = null;
    let musicPlaying = false;
    let beatInterval = null;
    let masterGain = null;

    function createConvolver(ctx) {
        const convolver = ctx.createConvolver();
        const rate = ctx.sampleRate;
        const length = rate * 3;
        const impulse = ctx.createBuffer(2, length, rate);
        for (let ch = 0; ch < 2; ch++) {
            const data = impulse.getChannelData(ch);
            for (let i = 0; i < length; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.2);
            }
        }
        convolver.buffer = impulse;
        return convolver;
    }

    function createDelay(ctx, delayTime, feedback) {
        const delay = ctx.createDelay(2);
        delay.delayTime.value = delayTime;
        const fb = ctx.createGain();
        fb.gain.value = feedback;
        const filt = ctx.createBiquadFilter();
        filt.type = 'lowpass';
        filt.frequency.value = 2500;
        delay.connect(filt);
        filt.connect(fb);
        fb.connect(delay);
        return delay;
    }

    function createLoFiBeat() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        const savedVol = parseFloat(localStorage.getItem('js-playground-volume') || '0.08');
        masterGain.gain.value = savedVol;

        // Master chain: compression + saturation
        const comp = audioCtx.createDynamicsCompressor();
        comp.threshold.value = -16;
        comp.ratio.value = 5;
        comp.knee.value = 12;
        comp.attack.value = 0.003;
        comp.release.value = 0.15;

        // Stereo reverb
        const reverb = createConvolver(audioCtx);
        const reverbGain = audioCtx.createGain();
        reverbGain.gain.value = 0.3;
        const dryGain = audioCtx.createGain();
        dryGain.gain.value = 0.7;

        // Stereo ping-pong delay
        const delayL = createDelay(audioCtx, 0.375, 0.3);
        const delayR = createDelay(audioCtx, 0.5, 0.25);
        const delayGain = audioCtx.createGain();
        delayGain.gain.value = 0.12;
        const merger = audioCtx.createChannelMerger(2);

        // Lo-fi tape wobble
        const wobbleOsc = audioCtx.createOscillator();
        wobbleOsc.type = 'sine';
        wobbleOsc.frequency.value = 0.4;
        const wobbleGain = audioCtx.createGain();
        wobbleGain.gain.value = 3;

        // Routing
        masterGain.connect(dryGain);
        dryGain.connect(comp);
        masterGain.connect(reverb);
        reverb.connect(reverbGain);
        reverbGain.connect(comp);
        masterGain.connect(delayL);
        masterGain.connect(delayR);
        delayL.connect(merger, 0, 0);
        delayR.connect(merger, 0, 1);
        merger.connect(delayGain);
        delayGain.connect(comp);
        comp.connect(audioCtx.destination);
        wobbleOsc.start();

        // ═══ VINYL CRACKLE + TAPE HISS ═══
        const cLen = audioCtx.sampleRate * 6;
        const cBuf = audioCtx.createBuffer(2, cLen, audioCtx.sampleRate);
        for (let ch = 0; ch < 2; ch++) {
            const cD = cBuf.getChannelData(ch);
            for (let i = 0; i < cLen; i++) {
                const pop = Math.random() > 0.998 ? (Math.random() - 0.5) * 0.2 : 0;
                const hiss = (Math.random() - 0.5) * 0.004;
                cD[i] = pop + hiss;
            }
        }
        const cSrc = audioCtx.createBufferSource();
        cSrc.buffer = cBuf; cSrc.loop = true;
        const cF = audioCtx.createBiquadFilter();
        cF.type = 'bandpass'; cF.frequency.value = 3500; cF.Q.value = 0.4;
        const cGn = audioCtx.createGain(); cGn.gain.value = 0.35;
        cSrc.connect(cF); cF.connect(cGn); cGn.connect(masterGain); cSrc.start();

        // ═══ WARM SUB-BASS LAYER ═══
        const subOsc = audioCtx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.value = 50;
        const subGain = audioCtx.createGain();
        subGain.gain.value = 0.05;
        const subLFO = audioCtx.createOscillator();
        subLFO.type = 'sine';
        subLFO.frequency.value = 0.12;
        const subLFOGain = audioCtx.createGain();
        subLFOGain.gain.value = 6;
        subLFO.connect(subLFOGain);
        subLFOGain.connect(subOsc.frequency);
        const subFilter = audioCtx.createBiquadFilter();
        subFilter.type = 'lowpass';
        subFilter.frequency.value = 90;
        subOsc.connect(subFilter);
        subFilter.connect(subGain);
        subGain.connect(masterGain);
        subOsc.start();
        subLFO.start();

        // ═══ WIND CHIMES BACKGROUND ═══
        function windChime() {
            if (!musicPlaying || !audioCtx) return;
            const chimeFreqs = [1318.51, 1567.98, 1760, 2093, 2349.32, 2637.02];
            const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
            const t = audioCtx.currentTime;
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            const f = audioCtx.createBiquadFilter();
            o.type = 'sine';
            o.frequency.value = freq;
            f.type = 'bandpass';
            f.frequency.value = freq;
            f.Q.value = 15;
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.008, t + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
            o.connect(f);
            f.connect(g);
            g.connect(masterGain);
            o.start(t);
            o.stop(t + 3.5);
            setTimeout(windChime, 2000 + Math.random() * 6000);
        }
        setTimeout(windChime, 3000);

        // ═══ FM SYNTHESIS — HAPPY RHODES ═══
        function rhodesNote(freq, t, dur) {
            const carrier = audioCtx.createOscillator();
            const mod = audioCtx.createOscillator();
            const modG = audioCtx.createGain();
            const carG = audioCtx.createGain();
            const filt = audioCtx.createBiquadFilter();

            carrier.type = 'sine';
            carrier.frequency.value = freq;
            mod.type = 'sine';
            mod.frequency.value = freq * 2;
            modG.gain.setValueAtTime(freq * 2, t);
            modG.gain.exponentialRampToValueAtTime(freq * 0.2, t + dur * 0.5);

            filt.type = 'lowpass';
            filt.frequency.value = 1200 + Math.random() * 600;
            filt.Q.value = 0.3;

            carG.gain.setValueAtTime(0, t);
            carG.gain.linearRampToValueAtTime(0.10, t + 0.05);
            carG.gain.setValueAtTime(0.08, t + dur * 0.3);
            carG.gain.exponentialRampToValueAtTime(0.001, t + dur);

            mod.connect(modG);
            modG.connect(carrier.frequency);
            carrier.connect(filt);
            filt.connect(carG);
            carG.connect(masterGain);

            carrier.start(t);
            mod.start(t);
            carrier.stop(t + dur + 0.1);
            mod.stop(t + dur + 0.1);
        }

        // ═══ GLOCKENSPIEL/BELL SYNTH ═══
        function bellNote(freq, t, dur) {
            const o1 = audioCtx.createOscillator();
            const o2 = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            const f = audioCtx.createBiquadFilter();
            o1.type = 'sine';
            o1.frequency.value = freq;
            o2.type = 'sine';
            o2.frequency.value = freq * 3.01; // Slight inharmonic for bell character
            const g2 = audioCtx.createGain();
            g2.gain.value = 0.3;
            f.type = 'highpass';
            f.frequency.value = 400;
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.035, t + 0.01);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o1.connect(f);
            o2.connect(g2);
            g2.connect(f);
            f.connect(g);
            g.connect(masterGain);
            o1.start(t); o2.start(t);
            o1.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
        }

        // ═══ PLUCK SYNTH (for bass) ═══
        function pluckBass(freq, t, dur) {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            const f = audioCtx.createBiquadFilter();
            o.type = 'sawtooth';
            o.frequency.value = freq;
            f.type = 'lowpass';
            f.frequency.setValueAtTime(600, t);
            f.frequency.exponentialRampToValueAtTime(150, t + dur * 0.6);
            f.Q.value = 2;
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.28, t + 0.02);
            g.gain.setValueAtTime(0.22, t + dur * 0.3);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.connect(f); f.connect(g); g.connect(masterGain);
            o.start(t); o.stop(t + dur + 0.05);
        }

        // ═══ DRUMS ═══
        function kick(t) {
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(170, t);
            o.frequency.exponentialRampToValueAtTime(30, t + 0.14);
            g.gain.setValueAtTime(0.65, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.4);
            // Click transient
            const cl = audioCtx.createOscillator(), clG = audioCtx.createGain();
            cl.type = 'square';
            cl.frequency.setValueAtTime(900, t);
            cl.frequency.exponentialRampToValueAtTime(80, t + 0.015);
            clG.gain.setValueAtTime(0.06, t);
            clG.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
            cl.connect(clG); clG.connect(masterGain); cl.start(t); cl.stop(t + 0.03);
        }

        function hihat(t, open, vel) {
            vel = vel || 1;
            const len = audioCtx.sampleRate * (open ? 0.2 : 0.035);
            const b = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
            const d = b.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
            const s = audioCtx.createBufferSource(); s.buffer = b;
            const f1 = audioCtx.createBiquadFilter(); f1.type = 'highpass'; f1.frequency.value = 8000;
            const f2 = audioCtx.createBiquadFilter(); f2.type = 'highpass'; f2.frequency.value = 9500;
            const g = audioCtx.createGain();
            g.gain.setValueAtTime((open ? 0.08 : 0.05) * vel, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.2 : 0.035));
            s.connect(f1); f1.connect(f2); f2.connect(g); g.connect(masterGain); s.start(t);
        }

        function snare(t) {
            const len = audioCtx.sampleRate * 0.15;
            const b = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
            const d = b.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
            const s = audioCtx.createBufferSource(); s.buffer = b;
            const nF = audioCtx.createBiquadFilter(); nF.type = 'bandpass'; nF.frequency.value = 4000; nF.Q.value = 0.6;
            const nG = audioCtx.createGain();
            nG.gain.setValueAtTime(0.16, t);
            nG.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            s.connect(nF); nF.connect(nG); nG.connect(masterGain); s.start(t);
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = 'triangle'; o.frequency.value = 190;
            g.gain.setValueAtTime(0.18, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
            o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.08);
        }

        function shaker(t) {
            const len = audioCtx.sampleRate * 0.03;
            const b = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
            const d = b.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
            const s = audioCtx.createBufferSource(); s.buffer = b;
            const f = audioCtx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 11000;
            const g = audioCtx.createGain();
            g.gain.setValueAtTime(0.04, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
            s.connect(f); f.connect(g); g.connect(masterGain); s.start(t);
        }

        function rimClick(t) {
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = 'square';
            o.frequency.value = 1200;
            g.gain.setValueAtTime(0.06, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
            o.connect(g); g.connect(masterGain); o.start(t); o.stop(t + 0.02);
        }

        function softCymbal(t) {
            const len = audioCtx.sampleRate * 1.5;
            const b = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
            const d = b.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
            const s = audioCtx.createBufferSource(); s.buffer = b;
            const f = audioCtx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 5000;
            const f2 = audioCtx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = 12000;
            const g = audioCtx.createGain();
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.03, t + 0.3);
            g.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
            s.connect(f); f.connect(f2); f2.connect(g); g.connect(masterGain); s.start(t);
        }

        // ═══ HAPPY ARPEGGIATED MELODIES ═══
        function happyArpeggio(baseFreq, t, beatLen) {
            // Major pentatonic intervals (happy!)
            const majorPenta = [1, 1.125, 1.25, 1.5, 1.667, 2];
            const noteCount = 4 + Math.floor(Math.random() * 4);
            const pattern = Math.random() > 0.5 ? 'up' : 'updown';
            for (let i = 0; i < noteCount; i++) {
                let idx;
                if (pattern === 'updown') {
                    idx = i < noteCount / 2 ? i % majorPenta.length : (noteCount - 1 - i) % majorPenta.length;
                } else {
                    idx = i % majorPenta.length;
                }
                const ratio = majorPenta[idx];
                const octave = i >= majorPenta.length ? 2 : 1;
                const freq = baseFreq * ratio * octave;
                const noteT = t + i * beatLen * 0.375;
                const noteDur = beatLen * 0.7;

                // Use bell synth for sparkle
                bellNote(freq, noteT, noteDur);
            }
        }

        // ═══ CHORD PROGRESSIONS — HAPPY MAJOR 7TH ═══
        const chords = [
            // I: Cmaj7 voicing
            { pad: [261.63, 329.63, 392, 493.88], bass: 130.81, name: 'Cmaj7' },
            // IV: Fmaj7  
            { pad: [349.23, 440, 523.25, 659.25], bass: 174.61, name: 'Fmaj7' },
            // V: G7
            { pad: [392, 493.88, 587.33, 698.46], bass: 196, name: 'G7' },
            // vi: Am7
            { pad: [220, 261.63, 329.63, 392], bass: 110, name: 'Am7' },
            // I: Cmaj7 (different voicing)
            { pad: [523.25, 659.25, 783.99, 987.77], bass: 130.81, name: 'Cmaj7h' },
            // ii: Dm7
            { pad: [293.66, 349.23, 440, 523.25], bass: 146.83, name: 'Dm7' },
            // V: G7 (different voicing)
            { pad: [196, 246.94, 293.66, 349.23], bass: 98, name: 'G7l' },
            // IV: Fmaj7 (lower)
            { pad: [174.61, 220, 261.63, 329.63], bass: 87.31, name: 'Fmaj7l' },
        ];

        const BPM = 78; // Slightly faster for happy feel
        const beatLen = 60 / BPM;
        const swingAmount = 0.03;
        let beat = 0, chordIdx = 0;
        let subBeat = 0; // For 16th note patterns

        function tick() {
            if (!musicPlaying || !audioCtx) return;
            const swing = (beat % 2 === 1) ? swingAmount : 0;
            const t = audioCtx.currentTime + 0.05 + swing;
            const b = beat % 16; // 16-beat loop for more variation!

            // ──── KICK PATTERN (syncopated & bouncy) ────
            if ([0, 5, 8, 11].includes(b)) kick(t);

            // ──── SNARE (on 4 and 12 with ghost on 7) ────
            if ([4, 12].includes(b)) snare(t);
            if (b === 7 && Math.random() > 0.4) {
                const ghostSnareG = audioCtx.createGain();
                ghostSnareG.gain.value = 0.4;
                snare(t);
            }

            // ──── HI-HAT (16th note pattern with velocity) ────
            const hhVel = [1, 0.4, 0.7, 0.35, 1, 0.3, 0.65, 0.4, 1, 0.35, 0.7, 0.3, 1, 0.4, 0.6, 0.35];
            const isOpen = b === 2 || b === 6 || b === 10 || b === 14;
            hihat(t, isOpen, hhVel[b]);

            // ──── SHAKER (every other beat for groove) ────
            if (b % 2 === 1) shaker(t);

            // ──── RIM CLICK (sparse syncopation) ────
            if ((b === 3 || b === 9) && Math.random() > 0.5) rimClick(t);

            // ──── SOFT CYMBAL SWELL (every 16 beats) ────
            if (b === 0 && Math.random() > 0.6) softCymbal(t);

            // ──── GHOST HI-HATS (random humanization) ────
            if (Math.random() > 0.8) {
                hihat(t + beatLen * 0.5, false, 0.2);
            }

            // ──── CHORD CHANGES (every 8 beats = half bar) ────
            if (b === 0 || b === 8) {
                const cI = (b === 0) ? chordIdx : chordIdx;
                const c = chords[cI % chords.length];
                if (b === 0) chordIdx++;

                // Rhodes FM chords — wider voicings with humanized timing
                const chordDur = beatLen * 7.5;
                c.pad.forEach((freq, i) => {
                    const humanize = (Math.random() - 0.5) * 0.04;
                    rhodesNote(freq, t + i * 0.06 + humanize, chordDur);
                });

                // Extra upper harmony note for brightness
                if (Math.random() > 0.3) {
                    const topNote = c.pad[c.pad.length - 1] * 2;
                    rhodesNote(topNote, t + 0.35, chordDur * 0.6);
                }

                // Pluck bass with rhythmic pattern
                pluckBass(c.bass, t, beatLen * 1.8);
                // Octave bass jump at beat 4
                if (b === 0) {
                    pluckBass(c.bass * 2, t + beatLen * 4, beatLen * 1.2);
                    pluckBass(c.bass * 1.5, t + beatLen * 6, beatLen * 1.2);
                }

                // Happy arpeggios — play often for complexity!
                if (Math.random() > 0.25) {
                    const arpDelay = beatLen * (2 + Math.floor(Math.random() * 3));
                    happyArpeggio(c.pad[0], t + arpDelay, beatLen);
                }

                // Glockenspiel melody accent (uplifting!)
                if (Math.random() > 0.3) {
                    const melodyNotes = c.pad.slice(1, 3).map(f => f * 2);
                    const noteIdx = Math.floor(Math.random() * melodyNotes.length);
                    const mT = t + beatLen * (1 + Math.floor(Math.random() * 4));
                    bellNote(melodyNotes[noteIdx], mT, beatLen * 2.5);
                }

                // Second bell note for call-and-response
                if (Math.random() > 0.5) {
                    const respFreq = c.pad[0] * 4;
                    bellNote(respFreq, t + beatLen * (3 + Math.random() * 2), beatLen * 1.5);
                }

                // Melodic sine accent (dreamy)
                if (Math.random() > 0.4) {
                    const mN = c.pad[Math.floor(Math.random() * c.pad.length)] * 2;
                    const m = audioCtx.createOscillator(), mG = audioCtx.createGain();
                    const mF = audioCtx.createBiquadFilter();
                    m.type = 'sine'; m.frequency.value = mN;
                    mF.type = 'lowpass'; mF.frequency.value = 1200;
                    const mT = t + beatLen * (1 + Math.random() * 3);
                    mG.gain.setValueAtTime(0, mT);
                    mG.gain.linearRampToValueAtTime(0.04, mT + 0.1);
                    mG.gain.exponentialRampToValueAtTime(0.001, mT + 2);
                    m.connect(mF); mF.connect(mG); mG.connect(masterGain);
                    m.start(mT); m.stop(mT + 2.5);
                }

                // Warm pad layer (adds thickness)
                c.pad.slice(0, 2).forEach((freq) => {
                    const pad = audioCtx.createOscillator();
                    const padG = audioCtx.createGain();
                    const padF = audioCtx.createBiquadFilter();
                    pad.type = 'triangle';
                    pad.frequency.value = freq / 2;
                    pad.detune.value = (Math.random() - 0.5) * 12;
                    padF.type = 'lowpass';
                    padF.frequency.value = 350;
                    padG.gain.setValueAtTime(0, t);
                    padG.gain.linearRampToValueAtTime(0.06, t + 1.5);
                    padG.gain.setValueAtTime(0.05, t + chordDur * 0.7);
                    padG.gain.linearRampToValueAtTime(0, t + chordDur);
                    pad.connect(padF); padF.connect(padG); padG.connect(masterGain);
                    pad.start(t); pad.stop(t + chordDur + 0.2);
                });
            }

            // ──── WALKING BASS FILLS (on beats 2, 6, 10, 14) ────
            if ([2, 6, 10, 14].includes(b)) {
                const c = chords[chordIdx % chords.length];
                if (Math.random() > 0.5) {
                    const fillFreq = c.bass * (Math.random() > 0.5 ? 1.5 : 1.333);
                    pluckBass(fillFreq, t, beatLen * 0.8);
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
        if (audioCtx) { audioCtx.close().catch(() => { }); audioCtx = null; }
        masterGain = null;
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

    // Volume slider
    const volContainer = document.createElement('div');
    volContainer.className = 'volume-slider-container';
    volContainer.style.display = 'none';
    const volSlider = document.createElement('input');
    volSlider.type = 'range';
    volSlider.min = '0';
    volSlider.max = '100';
    volSlider.value = Math.round((parseFloat(localStorage.getItem('js-playground-volume') || '0.08')) * 500);
    volSlider.className = 'volume-slider';
    volSlider.title = 'Volum muzică';
    volSlider.addEventListener('input', () => {
        const vol = volSlider.value / 500;
        if (masterGain) masterGain.gain.value = vol;
        localStorage.setItem('js-playground-volume', vol.toString());
    });
    volContainer.appendChild(volSlider);

    musicBtn.addEventListener('click', () => {
        if (musicPlaying) {
            stopMusic();
            musicBtn.textContent = '🎵';
            musicBtn.title = 'Lo-Fi Beat (Off)';
            musicBtn.style.opacity = '0.5';
            volContainer.style.display = 'none';
            localStorage.setItem('js-playground-music', 'off');
        } else {
            startMusic();
            volContainer.style.display = 'flex';
            localStorage.setItem('js-playground-music', 'on');
        }
    });

    // Auto-resume across pages
    if (localStorage.getItem('js-playground-music') === 'on') {
        try {
            const test = new (window.AudioContext || window.webkitAudioContext)();
            if (test.state === 'running') { test.close(); startMusic(); volContainer.style.display = 'flex'; }
            else {
                test.close();
                const resume = () => { if (!musicPlaying) { startMusic(); volContainer.style.display = 'flex'; } };
                document.addEventListener('click', resume, { once: true });
                document.addEventListener('scroll', resume, { once: true, passive: true });
                musicBtn.textContent = '⏸️'; musicBtn.title = 'Click/scroll to resume'; musicBtn.style.opacity = '0.8';
            }
        } catch (e) {
            document.addEventListener('click', () => { if (!musicPlaying) { startMusic(); volContainer.style.display = 'flex'; } }, { once: true });
        }
    }

    rightControls.appendChild(volContainer);
    rightControls.appendChild(musicBtn);
    rightControls.appendChild(hamburger);
    navbar.appendChild(rightControls);

    // --- Ripple effect on buttons ---
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.cta-btn, .demo-btn, .btn-run');
        if (!btn) return;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });

    // --- Animated stat counters on homepage ---
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0 && (window.location.pathname.includes('index') || window.location.pathname.endsWith('/'))) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const finalText = el.textContent;
                    const finalNum = parseInt(finalText);
                    if (!isNaN(finalNum) && finalNum > 0) {
                        el.textContent = '0';
                        const duration = 1200;
                        const start = performance.now();
                        function animate(now) {
                            const elapsed = now - start;
                            const progress = Math.min(elapsed / duration, 1);
                            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                            el.textContent = Math.round(finalNum * eased);
                            if (progress < 1) requestAnimationFrame(animate);
                            else el.textContent = finalText; // restore original (might have ∞)
                        }
                        requestAnimationFrame(animate);
                    }
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        statNumbers.forEach(s => countObserver.observe(s));
    }

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
