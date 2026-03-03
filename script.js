// ============================================================================
// 📁 script.js — Fișierul JavaScript principal al paginii
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
// În index.html, am pus doar: <script src="script.js"></script>
// Asta îi spune browser-ului: "încarcă și execută codul din script.js"
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
// Primești acel element și poți face lucruri cu el! (citi textul, schimba stilul, etc.)
//
// E ca și cum ai spune: "Hei document, dă-mi elementul care are id-ul consoleInput"
//
// ============================================================================


// ============================================================================
// 🟢 SECȚIUNEA 1: CONSOLA INTERACTIVĂ
// ============================================================================
// Aceasta face ca input-ul din pagină să funcționeze ca o mini-consolă JS

// #CONST — Selectăm elementele din pagină și le salvăm în constante
// De ce const? Pentru că aceste variabile vor referi MEREU aceleași elemente
const consoleInput = document.getElementById('consoleInput');   // input-ul unde scrii cod
const consoleOutput = document.getElementById('consoleOutput'); // zona unde apare rezultatul
const runBtn = document.getElementById('runBtn');               // butonul "RUN"

// #LET — Acestea se schimbă pe parcurs, deci folosim "let"
let commandHistory = [];   // un ARRAY gol — aici salvăm comenzile anterioare
// [] = array gol, ca o listă goală
let historyIndex = -1;     // index-ul curent în istoric (-1 = nimic selectat)


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


// Funcție care adaugă o linie de text în zona de output (consola vizuală)
//
// PARAMETRI:
//   text = ce text să afișeze
//   type = tipul de mesaj: 'result' (verde), 'error' (roșu), 'info' (albastru)
//          "= 'result'" înseamnă VALOARE DEFAULT — dacă nu specifici type, va fi 'result'
function addOutput(text, type = 'result') {

    // document.createElement('div') = creează un element HTML nou: <div></div>
    // Încă NU apare pe pagină — doar l-am creat în memorie
    const line = document.createElement('div');

    // #CLASSNAME — setează clasele CSS ale elementului
    // Backtick-urile `...` sunt TEMPLATE LITERALS — permit inserarea variabilelor cu ${...}
    // Rezultat: class="output-line result" sau class="output-line error"
    line.className = `output-line ${type}`;

    // #TEXTCONTENT — setează textul vizibil al elementului
    // textContent e SAFE — tratează tot ca text simplu (nu execută HTML)
    line.textContent = text;

    // #APPENDCHILD — adaugă elementul NOU ca ultimul copil al consoleOutput
    // ACUM apare pe pagină! Înainte era doar în memorie, acum e în DOM
    consoleOutput.appendChild(line);

    // #SCROLLTOP — derulează automat în jos ca să vezi ultimul mesaj
    // scrollHeight = înălțimea totală a conținutului
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}


// ============================================================================
// Funcția principală: EXECUTE CODE (execută codul scris de utilizator)
// ============================================================================
//
// #EVAL — Ce face eval()?
// eval() ia un STRING (text) și îl EXECUTĂ ca și cod JavaScript
//
//   eval("2 + 2")       → returnează 4
//   eval("alert('Salut')")  → execută alert
//
// ⚠️ eval() e PERICULOS în producție! Poate executa cod malițios.
// Aici e OK pentru că e o pagină de învățare locală, doar tu o folosești.
//
// ============================================================================
function executeCode(code) {

    // #TRIM — .trim() elimină spațiile de la început și sfârșit
    // #NEGARE — "!" neagă valoarea: !true = false, !false = true
    // Deci: dacă codul e gol (doar spații), ieși din funcție, nu face nimic
    if (!code.trim()) return;

    // Afișează codul introdus (cu simbolul ❯ în față) ca linie de info
    addOutput(`❯ ${code}`, 'info');

    // #UNSHIFT — .unshift() adaugă un element la ÎNCEPUTUL array-ului
    // (opusul lui .push() care adaugă la SFÂRȘIT)
    // Salvăm comanda în istoric ca să poți naviga cu ⬆️⬇️
    commandHistory.unshift(code);
    historyIndex = -1;  // resetăm index-ul la "nimic selectat"


    // ======================================================================
    // #ORIGINALLOG — De ce salvăm console.log?
    // ======================================================================
    //
    // Noi vrem ca atunci când utilizatorul scrie console.log("ceva")
    // rezultatul să apară pe PAGINA noastră, nu în consola browser-ului.
    //
    // Strategia:
    // 1. Salvăm console.log ORIGINAL într-o variabilă (originalLog)
    // 2. Înlocuim console.log cu PROPRIA noastră funcție
    //    (care salvează textul într-un array)
    // 3. Executăm codul utilizatorului (eval) — acum console.log e al nostru
    // 4. Afișăm rezultatele pe pagină
    // 5. Restaurăm console.log ORIGINAL (punem la loc ce era)
    //
    // E ca și cum ai fura temporar telecomanda, schimbi canalul,
    // și apoi o pui la loc exact unde era.
    //
    // ======================================================================
    const originalLog = console.log;  // Pasul 1: Salvăm originalul

    // #OUTPUTS — un array gol unde vom colecta mesajele
    // De fiecare dată când codul cheamă console.log(), 
    // mesajul ajunge AICI în loc de consola browser-ului
    const outputs = [];


    // ======================================================================
    // #ARROW_FUNCTION — Ce e (...args) => { ... } ?
    // ======================================================================
    //
    // E o ARROW FUNCTION (funcție săgeată) — sintaxă modernă pentru funcții
    //
    //   Forma clasică:    function(x) { return x * 2; }
    //   Forma arrow:      (x) => x * 2
    //
    // Sunt echivalente! Arrow e doar o scriere mai scurtă.
    //
    // #SPREAD (...args) — "..." se numește SPREAD/REST operator
    // Când e în parametri, înseamnă "captează TOATE argumentele într-un array"
    //
    //   console.log("a", "b", "c")  →  args = ["a", "b", "c"]
    //   console.log(42)              →  args = [42]
    //
    // ======================================================================


    // Pasul 2: Înlocuim console.log cu funcția noastră custom
    console.log = (...args) => {

        // args.map() = trece prin fiecare argument și îl transformă
        // #MAP — .map() creează un ARRAY NOU transformând fiecare element
        //
        //   [1, 2, 3].map(n => n * 2)  →  [2, 4, 6]
        //
        // Aici: transformăm fiecare argument în text (string)
        outputs.push(args.map(a => {

            // #TYPEOF — typeof verifică TIPUL unei valori
            //   typeof "salut"  → "string"
            //   typeof 42       → "number"
            //   typeof true     → "boolean"
            //   typeof {}       → "object"
            //   typeof []       → "object"  (da, array-urile sunt obiecte!)

            // ================================================================
            // #TRIPLU_EGAL (===) — Ce înseamnă === (strict equality)?
            // ================================================================
            //
            // JavaScript are 2 moduri de comparare:
            //
            //   ==  (egal LAX)    — compară VALORI, convertind tipurile automat
            //       "5" == 5      → TRUE (convertește string-ul în number)
            //       0 == false    → TRUE (convertește false în 0)
            //       null == undefined → TRUE
            //
            //   === (egal STRICT)  — compară VALOARE + TIP, fără conversie
            //       "5" === 5     → FALSE (string vs number = tipuri diferite!)
            //       0 === false   → FALSE (number vs boolean = tipuri diferite!)
            //       5 === 5       → TRUE  (același tip, aceeași valoare)
            //
            // 🏆 REGULA DE AUR: Folosește MEREU === în loc de ==
            //    Cu == poți avea surprize neplăcute!
            //
            // Opusul lui === e !== (strict NOT equal)
            //    5 !== "5"  → TRUE (sunt diferite ca tip)
            //
            // ================================================================

            if (typeof a === 'object') return JSON.stringify(a, null, 2);
            //   ↑ Dacă e obiect/array, îl transformă în text JSON frumos formatat
            //   JSON.stringify(obiect, null, 2) = convertește obiect → string JSON
            //     - null = nu filtrăm nimic
            //     - 2 = indentare de 2 spații (formatare frumoasă)

            return String(a);
            //   ↑ Pentru orice altceva (number, boolean, string), îl facem string
            //   String(42) → "42", String(true) → "true"

        }).join(' '));
        //   ↑ #JOIN — .join(' ') unește toate elementele dintr-un array cu un spațiu
        //   ["Salut", "lume"].join(' ')  →  "Salut lume"
        //   [1, 2, 3].join(', ')  →  "1, 2, 3"
    };


    // ======================================================================
    // #TRY_CATCH — Gestionarea erorilor
    // ======================================================================
    //
    // try { ... } catch (err) { ... }
    //
    // "try" = ÎNCEARCĂ să execuți acest cod
    // Dacă totul merge bine → continuă normal
    // Dacă apare o EROARE → sare imediat în "catch"
    //
    //   try {
    //       let x = cevaCeNuExista;  // ❌ eroare!
    //   } catch (err) {
    //       console.log(err.message);  // "cevaCeNuExista is not defined"
    //   }
    //
    // fără try-catch, eroarea ar CRASHA toată pagina
    // cu try-catch, o PRINDEM și o afișăm frumos
    //
    // "err" = obiectul de eroare, are proprietatea .message cu textul erorii
    //
    // ======================================================================

    try {
        // Pasul 3: Executăm codul utilizatorului
        const result = eval(code);
        // eval("2 + 2") → result = 4
        // eval("console.log('salut')") → result = undefined (dar outputs[] are "salut")

        // #FOREACH — trece prin fiecare element și apelează funcția
        // Diferența față de .map(): forEach NU returnează un array nou
        outputs.forEach(o => addOutput(o, 'result'));

        // #UNDEFINED — Ce e undefined?
        // undefined = "valoarea lipsește" sau "nu a fost definită"
        //   let x;           // x = undefined (declarat dar fără valoare)
        //   function f() {}  // f() returnează undefined (nu are return)
        //
        // #AND (&&) — "și" logic
        //   true && true   → true
        //   true && false  → false
        //   Ambele condiții trebuie să fie adevărate!
        //
        // !== = strict NOT equal (opusul lui ===)
        if (result !== undefined && outputs.length === 0) {
            addOutput(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result), 'result');
            // ↑ #TERNARY OPERATOR — condiție ? dacă_da : dacă_nu
            //   E un IF/ELSE scris pe o singură linie:
            //   typeof result === 'object' ? JSON.stringify(...) : String(result)
            //   Tradus: ESTE obiect? → transformă în JSON : altfel → transformă în String
        }
    } catch (err) {
        // Dacă codul utilizatorului are o eroare, o afișăm frumos cu ❌
        addOutput(`❌ ${err.message}`, 'error');
    }

    // Pasul 5: Restaurăm console.log ORIGINAL
    // Acum console.log funcționează din nou normal
    console.log = originalLog;
}


// ============================================================================
// Funcție: tryCode — apelată de butoanele "▶ Încearcă" din pagină
// ============================================================================
// Când apeși un buton "Încearcă", el apelează tryCode("codul de exemplu")
// Funcția pune codul în input, îl execută, și apoi golește input-ul
function tryCode(code) {
    consoleInput.value = code;        // .value = valoarea curentă a input-ului
    executeCode(code);                // execută codul
    consoleInput.value = '';          // golește input-ul
    consoleInput.focus();             // #FOCUS — mută cursorul pe input
}


// ============================================================================
// #ADDEVENTLISTENER — Ascultăm evenimentele
// ============================================================================
//
// element.addEventListener("tip_event", funcție_handler)
//
// TRADUCERE: "Hei element, ASCULTĂ pentru un EVENT de tip 'click'.
//            Când se întâmplă, execută această FUNCȚIE."
//
// Tipuri de evenimente:
//   "click"     — click pe element
//   "keydown"   — o tastă e apăsată
//   "keyup"     — o tastă e eliberată
//   "input"     — text scris într-un input
//   "mouseover" — mouse-ul intră pe element
//   "mouseout"  — mouse-ul iese de pe element
//   "submit"    — un formular e trimis
//   "scroll"    — pagina e derulată
//
// ============================================================================

// Când apeși butonul RUN → execută codul din input
runBtn.addEventListener('click', () => {
    executeCode(consoleInput.value);  // ia valoarea din input și o execută
    consoleInput.value = '';          // golește input-ul după
});

// Ascultăm tastatura pe input — pentru Enter și navigare istorie
consoleInput.addEventListener('keydown', (e) => {
    // "e" (sau "event") = OBIECTUL EVENT — conține info despre ce s-a întâmplat
    // e.key = tasta apăsată ("Enter", "ArrowUp", "a", "Shift", etc.)

    if (e.key === 'Enter') {
        executeCode(consoleInput.value);
        consoleInput.value = '';
    }

    if (e.key === 'ArrowUp') {
        // #PREVENTDEFAULT — oprește comportamentul default al browser-ului
        // Fără asta, ArrowUp ar muta cursorul la începutul textului
        e.preventDefault();

        // Navigăm ÎN SUS prin istoricul de comenzi
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;       // ++ = incrementare (adaugă 1)
            consoleInput.value = commandHistory[historyIndex];
            // commandHistory[0] = ultima comandă, [1] = penultima, etc.
        }
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();

        // Navigăm ÎN JOS prin istoricul de comenzi
        if (historyIndex > 0) {
            historyIndex--;       // -- = decrementare (scade 1)
            consoleInput.value = commandHistory[historyIndex];
        } else {
            historyIndex = -1;    // am ajuns la capăt, resetăm
            consoleInput.value = '';  // golim input-ul
        }
    }
});


// ============================================================================
// 🟢 SECȚIUNEA 2: EXERCIȚII — Rulează codul scris de utilizator în textarea
// ============================================================================

function runExercise(id) {
    // #PARAMETER "id" — vine din HTML: onclick="runExercise('ex1')"
    // Deci id = "ex1", "ex2", sau "ex3"

    // Luăm textarea-ul cu id-ul respectiv și citim valoarea (codul scris)
    const code = document.getElementById(id).value;

    // Construim id-ul elementului de output: "ex1" → "ex1-output"
    // #TEMPLATE_LITERAL — `${id}-output` înlocuiește ${id} cu valoarea reală
    const outputEl = document.getElementById(`${id}-output`);

    // #STYLE — accesăm și modificăm stilurile CSS direct din JS
    // display: 'block' = arată elementul (inițial era ascuns cu display: none)
    outputEl.style.display = 'block';

    // #INNERHTML — setează conținutul HTML al elementului
    // '' = string gol → golim output-ul anterior
    // ⚠ innerHTML e diferit de textContent:
    //   textContent = text simplu (safe)
    //   innerHTML = poate conține tag-uri HTML (<strong>, <em>, etc.)
    outputEl.innerHTML = '';

    // Aceeași strategie ca mai sus: intercepăm console.log
    const originalLog = console.log;
    const outputs = [];

    console.log = (...args) => {
        outputs.push(args.map(a => {
            if (typeof a === 'object') return JSON.stringify(a);
            return String(a);
        }).join(' '));
    };

    try {
        eval(code);  // Rulăm codul din textarea

        if (outputs.length > 0) {
            // #MAP + JOIN — transformăm array-ul de rezultate în HTML
            // .map() creează un div pentru fiecare output
            // .join('') le lipește laolaltă fără separator
            outputEl.innerHTML = outputs.map(o =>
                `<div class="output-line result">✅ ${o}</div>`
            ).join('');
        } else {
            outputEl.innerHTML = '<div class="output-line info">ℹ️ Codul a rulat, dar nu a afișat nimic. Adaugă console.log()!</div>';
        }
    } catch (err) {
        outputEl.innerHTML = `<div class="output-line error">❌ ${err.message}</div>`;
    }

    console.log = originalLog;  // restaurăm console.log original
}


// Funcție care arată/ascunde hint-ul unui exercițiu
function showHint(id) {
    const hint = document.getElementById(id);

    // #TERNARY pe display — dacă e 'block' (vizibil) → ascunde-l ('none')
    //                        dacă nu e 'block' → arată-l ('block')
    hint.style.display = hint.style.display === 'block' ? 'none' : 'block';
}


// ============================================================================
// 🟢 SECȚIUNEA 3: MESAJ DE BUN VENIT
// ============================================================================
addOutput('🚀 Bine ai venit! Scrie cod JavaScript și apasă Enter sau ▶ RUN.', 'info');
addOutput('💡 Încearcă: 2 + 2, "salut".toUpperCase(), [1,2,3].map(n => n * 10)', 'info');


// ============================================================================
// 🟢 SECȚIUNEA 4: DEMO-URI INTERACTIVE (Event Listeners în acțiune!)
// ============================================================================
//
// Toate demo-urile de mai jos folosesc EXACT ceea ce ai învățat:
// 1. SELECTEZI elementul → document.getElementById(...)
// 2. ASCULȚI un event → element.addEventListener("tip", funcție)
// 3. REACȚIONEZI → modifici DOM-ul în funcția handler
//
// ============================================================================


// ======================================================================
// #DEMO_COUNTER — Counter cu click
// ======================================================================
// Exemplu clasic: un buton pe care apeși și un număr crește

let clickCount = 0;  // let, nu const! Valoarea se schimbă la fiecare click

const counterBtn = document.getElementById('counterBtn');         // butonul
const counterDisplay = document.getElementById('counterDisplay'); // afișajul numărului
const counterLog = document.getElementById('counterLog');         // mesajul explicativ

// Ascultăm click-ul pe buton
counterBtn.addEventListener('click', () => {
    clickCount++;  // ++ = incrementare (clickCount = clickCount + 1)

    // Actualizăm textul afișat cu noul număr
    counterDisplay.textContent = clickCount;

    // #CLASSLIST — gestionarea claselor CSS ale unui element
    // .add('bump')    = adaugă clasa CSS 'bump' (face animația de mărire)
    // .remove('bump') = scoate clasa 'bump' (revine la normal)
    // .toggle('bump') = dacă o are o scoate, dacă n-o are o pune
    counterDisplay.classList.add('bump');

    // #SETTIMEOUT — execută ceva DUPĂ un delay (în milisecunde)
    // setTimeout(funcție, milisecunde)
    //   1000ms = 1 secundă
    //   200ms = 0.2 secunde
    // Aici: după 200ms, scoatem clasa 'bump' (animația se termină)
    setTimeout(() => counterDisplay.classList.remove('bump'), 200);

    // Afișăm un mesaj explicativ
    counterLog.textContent = `Click #${clickCount} — addEventListener("click") a fost apelat!`;
});


// ======================================================================
// #DEMO_INPUT — Input în timp real
// ======================================================================
// Detectează fiecare caracter tastat într-un input

const liveInput = document.getElementById('liveInput');
const liveInputOutput = document.getElementById('liveInputOutput');

// "input" event = se declanșează la FIECARE caracter tastat
// NU la Enter (ca "keydown"), ci la orice modificare a textului
liveInput.addEventListener('input', (e) => {
    // #EVENT_TARGET — e.target = elementul pe care s-a întâmplat event-ul
    // e.target.value = valoarea curentă a input-ului (textul scris)
    const val = e.target.value;

    // #LENGTH — .length = numărul de caractere / elemente
    //   "salut".length → 5
    //   [1, 2, 3].length → 3
    if (val.length === 0) {
        liveInputOutput.innerHTML = 'Textul tău: <em>nimic încă</em>';
    } else {
        liveInputOutput.textContent = `Ai scris: "${val}" (${val.length} caractere)`;
    }
});


// ======================================================================
// #DEMO_KEYDOWN — Detector de taste
// ======================================================================
// Afișează ce tastă ai apăsat și informațiile despre ea

const keyArea = document.getElementById('keyArea');
const keyDisplay = document.getElementById('keyDisplay');
const keyInfo = document.getElementById('keyInfo');

// "keydown" = se declanșează când APEȘI o tastă
keyArea.addEventListener('keydown', (e) => {
    e.preventDefault();  // oprește comportamentul default (scroll, etc.)

    // e.key = caracterul vizual al tastei
    //   Tasta A → e.key = "a"
    //   Tasta Enter → e.key = "Enter"
    //   Tasta Spațiu → e.key = " "
    //   Tasta Shift → e.key = "Shift"

    // #TERNARY — dacă tasta e spațiu, afișăm "Space" în loc de " " (gol)
    keyDisplay.textContent = e.key === ' ' ? 'Space' : e.key;

    // Adaugăm clasa 'pressed' pentru efect vizual (tasta se "apasă")
    keyDisplay.classList.add('pressed');

    // e.code = codul FIZIC al tastei (independent de limbă/layout)
    //   Tasta A → e.code = "KeyA"
    //   Tasta 1 → e.code = "Digit1"
    // e.keyCode = cod numeric (deprecated, dar util pentru exemplu)
    keyInfo.textContent = `key: "${e.key}" | code: "${e.code}" | keyCode: ${e.keyCode}`;
});

// "keyup" = se declanșează când ELIBEREZI tasta
keyArea.addEventListener('keyup', () => {
    keyDisplay.classList.remove('pressed');  // scoatem efectul vizual
});


// ======================================================================
// #DEMO_HOVERBOX — Hover cu mouse-ul (mouseover / mouseout)
// ======================================================================
// Pătratul își schimbă culoarea și forma când treci cu mouse-ul peste el

const hoverBox = document.getElementById('hoverBox');
const hoverLog = document.getElementById('hoverLog');

// Un array de culori prin care ciclăm
const colors = ['#e94560', '#00d2ff', '#533483', '#00e676', '#ffab40', '#ff6b6b'];

let colorIndex = 0;  // let! se schimbă la fiecare hover

// "mouseover" = mouse-ul INTRĂ pe element
hoverBox.addEventListener('mouseover', () => {

    // #MODULO (%) — operatorul MODULO returnează RESTUL împărțirii
    //   10 % 3 = 1  (10 / 3 = 3 rest 1)
    //   6 % 6 = 0   (6 / 6 = 1 rest 0)
    //
    // Folosim % pentru a CICLA prin array:
    //   Dacă colorIndex = 5 și colors.length = 6:
    //   (5 + 1) % 6 = 0 → revine la început!
    //   Fără %, ar ieși din array (index 6 nu există)
    colorIndex = (colorIndex + 1) % colors.length;

    // #STYLE — modificăm stilul CSS direct din JavaScript
    // Notă: în CSS e "background-color", în JS e "backgroundColor" (camelCase)
    //       în CSS e "border-radius", în JS e "borderRadius"
    hoverBox.style.background = colors[colorIndex];
    hoverBox.style.transform = 'scale(1.2) rotate(10deg)';
    hoverBox.style.borderRadius = '20px';

    hoverLog.textContent = `mouseover → culoare: ${colors[colorIndex]}, scale(1.2)`;
});

// "mouseout" = mouse-ul IESE de pe element
hoverBox.addEventListener('mouseout', () => {
    hoverBox.style.background = '#e94560';
    hoverBox.style.transform = 'scale(1)';
    hoverBox.style.borderRadius = '12px';
    hoverLog.textContent = 'mouseout → revenit la normal';
});


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
