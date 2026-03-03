// ============================================================================
// 🔍 search.js — Search Logic
// ============================================================================

const searchData = [
    { title: "Variabile (let, const, var)", tags: ["lectie", "concept"], keywords: "variabile let const var declarare reasignare variabila", desc: "let = reasignabilă, const = constantă, var = vechi. Folosește const în mod normal, let doar când valoarea se schimbă.", link: "lectii.html#variabile" },
    { title: "Tipuri de Date", tags: ["lectie", "concept"], keywords: "tipuri date string number boolean null undefined typeof tip", desc: "string, number, boolean, null, undefined, object. typeof verifică tipul. Fun fact: typeof null === 'object' (bug vechi!).", link: "lectii.html#tipuri" },
    { title: "Condiții (if/else, switch, ternary)", tags: ["lectie", "concept"], keywords: "conditii if else switch ternary conditie conditionala", desc: "if/else = ramificare. switch = comparare multiplă. Ternary: condiție ? da : nu — pe o singură linie.", link: "lectii.html#conditii" },
    { title: "Bucle (for, while, for...of)", tags: ["lectie", "concept"], keywords: "bucle for while loop for of for in bucla iterare", desc: "for = știi câte iterații. while = condiție. for...of = parcurge array. break = stop, continue = skip.", link: "lectii.html#bucle" },
    { title: "Funcții (function, arrow =>)", tags: ["lectie", "concept"], keywords: "functii function arrow funcție return parametri callback", desc: "Bloc de cod reutilizabil. Arrow: (x) => x * 2. Callback = funcție trimisă ca parametru. return = returnează rezultat.", link: "lectii.html#functii" },
    { title: "Array-uri (.map, .filter, .reduce)", tags: ["lectie", "concept"], keywords: "array map filter reduce foreach push pop includes find sort reverse arrays", desc: ".map() transformă, .filter() filtrează, .reduce() combină, .forEach() parcurge. push/pop adaugă/scoate elemente.", link: "lectii.html#arrays" },
    { title: "Metode String", tags: ["lectie", "concept"], keywords: "string slice split replace includes toUpperCase toLowerCase trim indexOf startsWith metode", desc: ".slice() taie, .split() divide, .replace() înlocuiește, .includes() verifică, .trim() curăță spații.", link: "lectii.html#strings" },
    { title: "Obiecte", tags: ["lectie", "concept"], keywords: "obiecte object proprietati metode this keys values entries obiect", desc: "Perechi cheie-valoare. obj.prop sau obj['prop']. this = referință la obiectul curent. Object.keys/values/entries.", link: "lectii.html#obiecte" },
    { title: "Comparații & Logică", tags: ["lectie", "concept"], keywords: "comparatii egal strict == === && || ! ternary optional chaining nullish", desc: "=== strict egal. && AND, || OR, ! NOT. ?. optional chaining, ?? nullish coalescing.", link: "lectii.html#comparatii" },
    { title: "Error Handling (try/catch)", tags: ["lectie", "concept"], keywords: "error handling try catch finally throw eroare erori", desc: "try/catch prinde erori fără să crape pagina. finally se execută MEREU. throw new Error() aruncă eroare custom.", link: "lectii.html#errors" },
    { title: "Built-in Objects (Math, Date, JSON)", tags: ["lectie", "concept"], keywords: "math date json localstorage random floor ceil round parse stringify", desc: "Math.random(), Math.floor(), Date, JSON.parse/stringify, localStorage.setItem/getItem.", link: "lectii.html#builtin" },
    { title: "Scope & Closures", tags: ["lectie", "concept"], keywords: "scope closure global local block variabile private closures", desc: "Global/local/block scope. Closure = funcție care 'ține minte' variabilele din scope-ul extern.", link: "lectii.html#scope" },
    { title: "Destructuring & Spread", tags: ["lectie", "concept"], keywords: "destructuring spread rest ... operator parametri", desc: "const {name} = obj; const [a,b] = arr; ...spread copiază, ...rest captează restul.", link: "lectii.html#destructuring" },
    { title: "Classes (OOP)", tags: ["lectie", "concept"], keywords: "class constructor extends super mostenire oop clase", desc: "class + constructor + extends + super. Moștenire: clasa copil preia metodele părintelui.", link: "lectii.html#classes" },
    { title: "Promises & Async/Await", tags: ["lectie", "concept"], keywords: "promise async await then catch setTimeout asincron", desc: "Promise = operație asincronă. async/await = sintaxă curată. .then()/.catch() = chaining.", link: "lectii.html#promises" },
    { title: "Fetch API", tags: ["lectie", "concept"], keywords: "fetch api get post request response json http", desc: "fetch(url) → Promise. await response.json() parsează datele. GET/POST/PUT/DELETE.", link: "lectii.html#fetch" },
    { title: "DOM Manipulation", tags: ["lectie", "concept"], keywords: "dom document getElementById querySelector textContent innerHTML classList style createElement", desc: "Selectare: getElementById, querySelector. Modificare: textContent, innerHTML, style, classList.", link: "lectii.html#dom" },
    { title: "Events & Listeners", tags: ["lectie", "concept"], keywords: "events addEventListener click input keydown mouseover submit preventDefault eveniment", desc: "addEventListener('click', callback). Evenimente: click, input, keydown, mouseover, submit.", link: "lectii.html#events" },
    { title: "Chrome DevTools", tags: ["concept"], keywords: "devtools consola chrome f12 inspect debug console network", desc: "F12 deschide DevTools. Console = scrie JS live. Elements = inspectează HTML. Network = request-uri.", link: "devtools.html" },
    { title: "Debugging (Erori Comune)", tags: ["concept"], keywords: "debugging erori bug error referenceError typeError syntaxError", desc: "Cele 10 cele mai comune erori JS — cum arată, de ce apar și cum le repari.", link: "debugging.html" },
];

const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('searchResults');
const statsDiv = document.getElementById('searchStats');
const noResults = document.getElementById('noResults');

searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
        resultsDiv.innerHTML = '';
        statsDiv.textContent = '';
        noResults.style.display = 'none';
        return;
    }

    const matches = searchData.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.includes(q) ||
        item.desc.toLowerCase().includes(q)
    );

    if (matches.length === 0) {
        resultsDiv.innerHTML = '';
        noResults.style.display = 'block';
        statsDiv.textContent = `0 rezultate pentru "${q}"`;
        return;
    }

    noResults.style.display = 'none';
    statsDiv.textContent = `${matches.length} rezultat${matches.length > 1 ? 'e' : ''} pentru "${q}"`;
    resultsDiv.innerHTML = matches.map(m => `
        <a href="${m.link}" class="search-result" style="text-decoration:none; display:block;">
            <h4>${m.title}</h4>
            ${m.tags.map(t => `<span class="result-tag tag-${t}">${t}</span>`).join('')}
            <p>${m.desc}</p>
        </a>
    `).join('');
});
