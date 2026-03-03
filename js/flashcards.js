// ============================================================================
// 🃏 flashcards.js — Flashcards pentru memorare rapidă
// ============================================================================

(function () {
    const cards = [
        // Variabile & Tipuri
        { term: 'let', def: 'Declară o variabilă care poate fi reasignată (schimbată).', example: 'let x = 5;\nx = 10; // OK', cat: 'Variabile' },
        { term: 'const', def: 'Declară o variabilă constantă — nu poate fi reasignată.', example: 'const PI = 3.14;\nPI = 5; // ❌ Error', cat: 'Variabile' },
        { term: 'var', def: 'Mod vechi de a declara variabile. Evită — folosește let/const.', example: 'var x = 5; // ❌ vechi', cat: 'Variabile' },
        { term: 'typeof', def: 'Operator care returnează tipul unei valori ca string.', example: 'typeof 42     // "number"\ntypeof "abc"  // "string"', cat: 'Tipuri' },
        { term: 'string', def: 'Tip de date: text, între ghilimele sau backticks.', example: '"Hello"\n\'World\'\n`Salut ${name}`', cat: 'Tipuri' },
        { term: 'number', def: 'Tip de date: orice număr (întreg sau zecimal).', example: '42, 3.14, -7, Infinity, NaN', cat: 'Tipuri' },
        { term: 'boolean', def: 'Tip de date: true sau false. Folosit în condiții.', example: 'let activ = true;\nlet gata = false;', cat: 'Tipuri' },
        { term: 'null', def: 'Valoare specială: „golul intenționat" — variabila există dar e goală.', example: 'let x = null;', cat: 'Tipuri' },
        { term: 'undefined', def: 'Variabila a fost declarată dar nu i s-a dat o valoare.', example: 'let x;\nconsole.log(x); // undefined', cat: 'Tipuri' },

        // Funcții
        { term: 'function', def: 'Bloc de cod reutilizabil. O definești o dată, o chemi de câte ori vrei.', example: 'function salut(n) {\n  return "Hi " + n;\n}', cat: 'Funcții' },
        { term: 'return', def: 'Returnează un rezultat din funcție și oprește execuția ei.', example: 'function dublu(n) {\n  return n * 2;\n}', cat: 'Funcții' },
        { term: 'Arrow Function', def: 'Sintaxă scurtă pentru funcții: (params) => expresie.', example: 'const add = (a, b) => a + b;\nadd(2, 3); // 5', cat: 'Funcții' },
        { term: 'callback', def: 'O funcție pasată ca argument altei funcții.', example: 'arr.forEach(item => {\n  console.log(item);\n});', cat: 'Funcții' },

        // Arrays
        { term: '.push()', def: 'Adaugă un element la SFÂRȘITUL unui array.', example: 'let a = [1, 2];\na.push(3); // [1, 2, 3]', cat: 'Arrays' },
        { term: '.pop()', def: 'Scoate și returnează ULTIMUL element din array.', example: 'let a = [1, 2, 3];\na.pop(); // 3', cat: 'Arrays' },
        { term: '.map()', def: 'Creează un array NOU transformând fiecare element.', example: '[1,2,3].map(n => n * 2)\n// [2, 4, 6]', cat: 'Arrays' },
        { term: '.filter()', def: 'Creează un array NOU doar cu elementele care trec testul.', example: '[1,2,3,4].filter(n => n > 2)\n// [3, 4]', cat: 'Arrays' },
        { term: '.reduce()', def: 'Reduce un array la o singură valoare (sumă, produs, etc).', example: '[1,2,3].reduce((s, n) => s + n, 0)\n// 6', cat: 'Arrays' },
        { term: '.forEach()', def: 'Execută o funcție pentru FIECARE element (nu returnează nimic).', example: '[1,2,3].forEach(n => {\n  console.log(n);\n});', cat: 'Arrays' },
        { term: '.find()', def: 'Returnează PRIMUL element care trece testul.', example: '[1,5,3].find(n => n > 2)\n// 5', cat: 'Arrays' },
        { term: '.includes()', def: 'Verifică dacă un element EXISTĂ în array. Returnează boolean.', example: '[1,2,3].includes(2) // true\n[1,2,3].includes(5) // false', cat: 'Arrays' },
        { term: 'spread ...', def: 'Despachetează elementele unui array/obiect.', example: 'const a = [1, 2];\nconst b = [...a, 3]; // [1,2,3]', cat: 'Arrays' },

        // Obiecte
        { term: 'Object', def: 'Colecție de proprietăți cheie-valoare.', example: 'const obj = {\n  name: "Ana",\n  age: 22\n};', cat: 'Obiecte' },
        { term: 'destructuring', def: 'Extrage valori din obiecte/array-uri în variabile separate.', example: 'const {name, age} = student;\nconst [a, b] = [1, 2];', cat: 'Obiecte' },
        { term: 'this', def: 'Referință la obiectul curent în care te afli.', example: 'const obj = {\n  name: "X",\n  say() { return this.name; }\n};', cat: 'Obiecte' },
        { term: 'JSON', def: 'Format text pentru date (JavaScript Object Notation).', example: 'JSON.stringify(obj) // → text\nJSON.parse(text)    // → obiect', cat: 'Obiecte' },

        // DOM
        { term: 'getElementById', def: 'Selectează un element HTML după id-ul său.', example: 'document.getElementById("btn")', cat: 'DOM' },
        { term: 'querySelector', def: 'Selectează PRIMUL element care se potrivește cu selectorul CSS.', example: 'document.querySelector(".card")\ndocument.querySelector("#id")', cat: 'DOM' },
        { term: 'textContent', def: 'Citește/setează textul unui element (safe, fără HTML).', example: 'el.textContent = "Salut!";', cat: 'DOM' },
        { term: 'classList', def: 'Gestionează clasele CSS ale unui element (add, remove, toggle).', example: 'el.classList.add("activ");\nel.classList.toggle("open");', cat: 'DOM' },
        { term: 'createElement', def: 'Creează un element HTML nou în memorie.', example: 'const div = document.createElement("div");\ndiv.textContent = "Nou!";', cat: 'DOM' },
        { term: 'appendChild', def: 'Adaugă un element copil la sfârșitul unui element părinte.', example: 'parent.appendChild(child);', cat: 'DOM' },

        // Events
        { term: 'addEventListener', def: 'Atașează o funcție care reacționează la un eveniment.', example: 'btn.addEventListener("click",\n  () => alert("Click!")\n);', cat: 'Events' },
        { term: 'preventDefault', def: 'Oprește comportamentul default al browser-ului.', example: 'form.addEventListener("submit",\n  (e) => e.preventDefault()\n);', cat: 'Events' },
        { term: 'event.target', def: 'Elementul pe care s-a făcut click/acțiunea.', example: 'el.addEventListener("click",\n  (e) => console.log(e.target)\n);', cat: 'Events' },

        // Async
        { term: 'Promise', def: 'Obiect care reprezintă un rezultat viitor (async).', example: 'fetch(url)\n  .then(r => r.json())\n  .catch(err => ...)', cat: 'Async' },
        { term: 'async/await', def: 'Sintaxă modernă pentru Promise-uri — cod asincron care arată sincron.', example: 'async function getData() {\n  const r = await fetch(url);\n  const data = await r.json();\n}', cat: 'Async' },
        { term: 'fetch()', def: 'Funcție nativă pentru a face cereri HTTP (GET, POST, etc).', example: 'const res = await fetch(url);\nconst data = await res.json();', cat: 'Async' },

        // Altele
        { term: 'try/catch', def: 'Prinde erorile fără să crape pagina.', example: 'try {\n  riskyCode();\n} catch (err) {\n  console.log(err.message);\n}', cat: 'Erori' },
        { term: 'localStorage', def: 'Stocare persistentă în browser (cheie-valoare, string).', example: 'localStorage.setItem("k", "v");\nlocalStorage.getItem("k");', cat: 'Browser' },
        { term: 'setTimeout', def: 'Execută cod DUPĂ un delay specificat (în milisecunde).', example: 'setTimeout(() => {\n  alert("3 sec!");\n}, 3000);', cat: 'Browser' },
        { term: 'template literal', def: 'String cu backticks care permite interpolarea variabilelor.', example: 'const name = "Ana";\n`Salut, ${name}!`', cat: 'Tipuri' },
        { term: '=== (strict)', def: 'Compară valoare ȘI tip. Folosește MEREU === în loc de ==.', example: '5 === "5"  // false\n5 == "5"   // true (❌ evită)', cat: 'Operatori' },
        { term: 'ternary ?:', def: 'Condiție pe o singură linie: condiție ? da : nu.', example: 'const msg = age >= 18\n  ? "Major"\n  : "Minor";', cat: 'Operatori' },
    ];

    let currentIndex = 0;
    let known = new Set();
    let dontKnow = new Set();
    let filteredCards = [...cards];
    let activeCategory = 'Toate';

    function getCategories() {
        const cats = new Set(cards.map(c => c.cat));
        return ['Toate', ...cats];
    }

    function renderCategories() {
        const container = document.getElementById('categories');
        container.innerHTML = getCategories().map(cat =>
            `<button class="fc-cat-btn ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
        ).join('');

        container.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                activeCategory = btn.dataset.cat;
                filterCards();
                renderCategories();
            });
        });
    }

    function filterCards() {
        if (activeCategory === 'Toate') {
            filteredCards = [...cards];
        } else {
            filteredCards = cards.filter(c => c.cat === activeCategory);
        }
        currentIndex = 0;
        renderCard();
    }

    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function renderCard() {
        if (filteredCards.length === 0) return;

        const card = filteredCards[currentIndex];
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.remove('flipped');

        document.getElementById('fcTerm').textContent = card.term;
        document.getElementById('fcCategory').textContent = card.cat;
        document.getElementById('fcDefinition').textContent = card.def;
        document.getElementById('fcExample').textContent = card.example;

        document.getElementById('countBadge').textContent = `${currentIndex + 1} / ${filteredCards.length}`;
        document.getElementById('knownBadge').textContent = `✅ Știu: ${known.size}`;
        document.getElementById('remainingBadge').textContent = `❌ Nu știu: ${dontKnow.size}`;
    }

    function flip() {
        document.getElementById('flashcard').classList.toggle('flipped');
    }

    function next() {
        if (currentIndex < filteredCards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        renderCard();
    }

    function prev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = filteredCards.length - 1;
        }
        renderCard();
    }

    function markKnown() {
        const term = filteredCards[currentIndex].term;
        known.add(term);
        dontKnow.delete(term);
        next();
    }

    function markDontKnow() {
        const term = filteredCards[currentIndex].term;
        dontKnow.add(term);
        known.delete(term);
        next();
    }

    function shuffleCards() {
        filteredCards = shuffle(filteredCards);
        currentIndex = 0;
        renderCard();
    }

    // Event listeners
    document.getElementById('flashcard').addEventListener('click', flip);
    document.getElementById('nextBtn').addEventListener('click', next);
    document.getElementById('prevBtn').addEventListener('click', prev);
    document.getElementById('knowBtn').addEventListener('click', markKnown);
    document.getElementById('dontKnowBtn').addEventListener('click', markDontKnow);
    document.getElementById('shuffleBtn').addEventListener('click', shuffleCards);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === '1') markKnown();
        if (e.key === '2') markDontKnow();
    });

    // Init
    renderCategories();
    renderCard();
})();
