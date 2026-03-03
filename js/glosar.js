// ============================================================================
// 📖 glosar.js — JavaScript Glossary Data & Logic
// ============================================================================

const terms = [
    // === A ===
    { term: "Abstract", def: "Concept OOP — o clasă abstractă nu poate fi instanțiată direct, servește doar ca bază pentru alte clase." },
    { term: "API", def: "Application Programming Interface — un set de reguli prin care două programe comunică. Ex: Fetch API, DOM API, Web Storage API." },
    { term: "Arguments", def: "Valorile trimise unei funcții la apelarea ei. Ex: în <code>suma(3, 5)</code>, 3 și 5 sunt arguments." },
    { term: "Arguments Object", def: "Obiect special (array-like) disponibil în funcții non-arrow: <code>function f() { console.log(arguments); }</code>." },
    { term: "Arithmetic Operators", def: "Operatori matematici: <code>+ - * / % **</code>. <code>**</code> = putere (ex: <code>2**3 = 8</code>)." },
    { term: "Array", def: "O listă ordonată de valori. Se declară cu <code>[]</code>. Ex: <code>[1, 'text', true]</code>. Indexul începe de la 0." },
    { term: "Array.from()", def: "Creează un array dintr-un obiect iterabil. Ex: <code>Array.from('abc')</code> → <code>['a','b','c']</code>." },
    { term: "Array.isArray()", def: "Verifică dacă o valoare e array: <code>Array.isArray([1,2])</code> → true. typeof [] dă 'object'!" },
    { term: "Arrow Function", def: "Funcție scurtă cu <code>=></code>. Ex: <code>const f = (x) => x * 2</code>. Nu are propriul <code>this</code> sau <code>arguments</code>." },
    { term: "Assignment Operators", def: "<code>= += -= *= /= %= **= &&= ||= ??=</code>. Ex: <code>x += 5</code> e echivalent cu <code>x = x + 5</code>." },
    { term: "Async/Await", def: "<code>async</code> declară o funcție asincronă. <code>await</code> așteaptă un Promise să se rezolve. Alternativă curată la .then()." },
    { term: "Asynchronous", def: "Cod care NU blochează execuția — pornește o operație și continuă imediat. setTimeout, fetch, Promises sunt asincrone." },

    // === B ===
    { term: "BigInt", def: "Tip de date pentru numere întregi mai mari decât Number.MAX_SAFE_INTEGER. Se creează cu <code>123n</code> sau <code>BigInt(123)</code>." },
    { term: "Bitwise Operators", def: "Operatori pe biți: <code>& | ^ ~ << >></code>. Rar folosiți în cod obișnuit." },
    { term: "Block Scope", def: "Variabilele <code>let</code>/<code>const</code> sunt vizibile DOAR în blocul <code>{ }</code> unde sunt declarate." },
    { term: "Block Statement", def: "Un grup de instrucțiuni între acolade <code>{ }</code>. Folosit cu if, for, while, funcții." },
    { term: "Boolean", def: "Tip de date cu 2 valori: <code>true</code> sau <code>false</code>. Folosit în condiții și comparații." },
    { term: "Break", def: "Oprește o buclă sau un switch. Ex: <code>if (found) break;</code>" },
    { term: "Browser Object Model (BOM)", def: "API-uri ale browserului: <code>window</code>, <code>navigator</code>, <code>location</code>, <code>history</code>, <code>screen</code>." },
    { term: "Bubbling", def: "Propagarea evenimentelor de la elementul copil spre părinte. Ex: click pe buton → div → body → document." },

    // === C ===
    { term: "Cache", def: "Stocare temporară pentru acces rapid. Browser-ul cache-uiește fișiere CSS/JS pentru viteză." },
    { term: "Callback", def: "O funcție trimisă ca argument altei funcții. Ex: <code>arr.map(x => x * 2)</code> — arrow function-ul e callback-ul." },
    { term: "Callback Hell", def: "Callbacks imbricate care fac codul greu de citit. Rezolvat prin Promises și async/await." },
    { term: "Call Stack", def: "Structură LIFO care ține evidența funcțiilor în execuție. Eroarea 'Maximum call stack size exceeded' = recursie infinită." },
    { term: "Camel Case", def: "Convenție de denumire: <code>myVariableName</code>. Prima literă mică, fiecare cuvânt nou cu majusculă." },
    { term: "Chaining", def: "Apelarea multiplelor metode una după alta: <code>arr.filter(...).map(...).sort()</code>." },
    { term: "charAt()", def: "Returnează caracterul de la o poziție: <code>'hello'.charAt(0)</code> → <code>'h'</code>." },
    { term: "Class", def: "Tipar (blueprint) pentru crearea obiectelor cu <code>constructor</code> și metode. Ex: <code>class Dog { }</code>." },
    { term: "classList", def: "Proprietate DOM pentru gestionarea claselor CSS: <code>.add()</code>, <code>.remove()</code>, <code>.toggle()</code>, <code>.contains()</code>." },
    { term: "clearInterval()", def: "Oprește un timer creat cu setInterval. Ex: <code>clearInterval(timerId)</code>." },
    { term: "clearTimeout()", def: "Anulează un timer creat cu setTimeout. Ex: <code>clearTimeout(timerId)</code>." },
    { term: "Closure", def: "O funcție care 'ține minte' variabilele din scope-ul extern chiar și după ce acel scope s-a terminat." },
    { term: "Coercion (Type)", def: "Conversie automată de tip. <code>'5' + 3</code> → <code>'53'</code> (string). <code>'5' - 3</code> → <code>2</code> (number)." },
    { term: "Comma Operator", def: "Evaluează ambele expresii și returnează a doua: <code>(1, 2)</code> → 2. Rar folosit." },
    { term: "Comparison Operators", def: "<code>== != === !== > < >= <=</code>. Folosește MEREU <code>===</code> (strict)." },
    { term: "concat()", def: "Unește arrays/strings: <code>[1].concat([2])</code> → <code>[1,2]</code>. <code>'a'.concat('b')</code> → <code>'ab'</code>." },
    { term: "Conditional (Ternary)", def: "Condiție pe o linie: <code>x > 0 ? 'pozitiv' : 'negativ'</code>." },
    { term: "Console", def: "<code>console.log()</code> afișează în DevTools. Alte metode: <code>.warn()</code>, <code>.error()</code>, <code>.table()</code>, <code>.time()</code>, <code>.group()</code>." },
    { term: "const", def: "Declară o variabilă care NU poate fi reasignată. Conținutul unui obiect/array const POATE fi modificat." },
    { term: "Constructor", def: "Metoda specială <code>constructor()</code> din clase, apelată automat la <code>new ClassName()</code>." },
    { term: "continue", def: "Sare la următoarea iterație a buclei (skip). Ex: <code>if (x === 3) continue;</code>" },
    { term: "CORS", def: "Cross-Origin Resource Sharing — mecanism de securitate care controlează cererile HTTP între domenii diferite." },
    { term: "createElement()", def: "Creează un element DOM nou: <code>document.createElement('div')</code>. Nu-l adaugă automat — trebuie appendChild." },
    { term: "CSS", def: "Cascading Style Sheets — limbajul care stilizează HTML. Controlează culori, fonturi, layout, animații." },

    // === D ===
    { term: "Data Types", def: "7 tipuri primitive: string, number, boolean, null, undefined, symbol, bigint + object (arrays, funcții = obiecte)." },
    { term: "Date", def: "Obiect built-in pentru lucrul cu date/timp: <code>new Date()</code>, <code>.getFullYear()</code>, <code>.toLocaleDateString()</code>." },
    { term: "Debounce", def: "Tehnică care amână execuția unei funcții până când utilizatorul termină de acționat (ex: search as you type)." },
    { term: "Debugging", def: "Procesul de găsire și reparare a erorilor din cod. Unealtele: console.log, DevTools debugger, breakpoints." },
    { term: "Declaration", def: "Crearea unei variabile/funcții: <code>const x = 5</code>, <code>function f() {}</code>. Spre deosebire de expresie." },
    { term: "Deep Copy", def: "Copie completă a unui obiect (inclusiv nested): <code>structuredClone(obj)</code> sau <code>JSON.parse(JSON.stringify(obj))</code>." },
    { term: "Default Parameters", def: "Parametri cu valoare implicită: <code>function f(x = 10) {}</code>. Se folosesc dacă argumentul lipsește." },
    { term: "delete", def: "Șterge o proprietate dintr-un obiect: <code>delete obj.prop</code>. NU funcționează pe variabile." },
    { term: "Destructuring", def: "Extrage valori din obiecte/arrays în variabile: <code>const {name} = obj</code>, <code>const [a,b] = arr</code>." },
    { term: "DevTools", def: "Unealtele de dezvoltare ale browser-ului (F12). Console, Elements, Network, Sources, Performance." },
    { term: "do...while", def: "Buclă care execută blocul CEL PUȚIN O DATĂ, apoi verifică condiția: <code>do { } while (cond)</code>." },
    { term: "DOM", def: "Document Object Model — reprezentarea HTML-ului ca un arbore de obiecte JavaScript pe care le poți manipula." },
    { term: "DOMContentLoaded", def: "Event declanșat când HTML-ul e complet parsat (fără CSS/imagini). Mai rapid decât 'load'." },
    { term: "Dot Notation", def: "Accesul la proprietăți cu punct: <code>obj.name</code>. Alternativa: bracket notation <code>obj['name']</code>." },

    // === E ===
    { term: "ECMAScript", def: "Standardul oficial al limbajului JavaScript. ES6 (2015) a adus let/const, arrow functions, classes, promises." },
    { term: "Element", def: "Un nod HTML din DOM: <code>div</code>, <code>p</code>, <code>button</code>. Accesat cu querySelector, getElementById etc." },
    { term: "Encapsulation", def: "Principiu OOP — ascunderea datelor interne ale unui obiect, expunând doar interfața publică." },
    { term: "endsWith()", def: "Verifică dacă un string se termină cu un text: <code>'hello'.endsWith('lo')</code> → true." },
    { term: "entries()", def: "Returnează perechi [cheie, valoare]: <code>Object.entries({a:1})</code> → <code>[['a',1]]</code>." },
    { term: "Error Types", def: "TypeError, ReferenceError, SyntaxError, RangeError, URIError, EvalError. Fiecare are message + stack." },
    { term: "eval()", def: "Execută un string ca cod JS: <code>eval('2+2')</code> → 4. ⚠️ PERICULOS — nu folosi în producție!" },
    { term: "Event", def: "O acțiune care se întâmplă în browser: click, keydown, scroll, input, submit. Ascultate cu addEventListener." },
    { term: "Event Delegation", def: "Pune un singur listener pe părinte în loc de pe fiecare copil. Folosește <code>e.target</code> pentru a identifica sursa." },
    { term: "Event Listener", def: "Cod care 'ascultă' un eveniment: <code>el.addEventListener('click', fn)</code>." },
    { term: "Event Loop", def: "Mecanismul care gestionează execuția asincronă: call stack → microtask queue → macrotask queue." },
    { term: "every()", def: "Verifică dacă TOATE elementele respectă condiția: <code>[2,4,6].every(n => n%2===0)</code> → true." },
    { term: "Execution Context", def: "Mediul în care se execută codul JS. Conține variabilele, scope-ul și valoarea this." },
    { term: "export", def: "Exportă o funcție/variabilă dintr-un modul: <code>export const x = 5</code> sau <code>export default fn</code>." },
    { term: "Expression", def: "Orice cod care returnează o valoare. Ex: <code>2 + 2</code>, <code>x > 5</code>, <code>fn()</code>." },
    { term: "extends", def: "Moștenire de clase: <code>class Dog extends Animal { }</code>. Dog primește toate metodele Animal." },

    // === F ===
    { term: "Falsy", def: "Valori care devin false: <code>false, 0, -0, 0n, '', null, undefined, NaN</code>. Restul sunt truthy." },
    { term: "Fetch", def: "Funcție nativă pentru HTTP requests. Returnează un Promise. Ex: <code>await fetch(url)</code>." },
    { term: "fill()", def: "Umple un array cu o valoare: <code>[1,2,3].fill(0)</code> → <code>[0,0,0]</code>." },
    { term: "filter()", def: "Returnează un array NOU cu elementele care trec testul: <code>[1,2,3].filter(n => n > 1)</code> → <code>[2,3]</code>." },
    { term: "finally", def: "Bloc din try/catch care se execută MEREU, indiferent de succes sau eroare." },
    { term: "find()", def: "Returnează PRIMUL element care trece testul: <code>[1,2,3].find(n => n > 1)</code> → 2." },
    { term: "findIndex()", def: "Returnează INDEX-UL primului element care trece testul: <code>[1,2,3].findIndex(n => n > 1)</code> → 1." },
    { term: "flat()", def: "Aplatizează un array nested: <code>[[1,2],[3]].flat()</code> → <code>[1,2,3]</code>." },
    { term: "flatMap()", def: "Map + flat într-un singur pas: <code>[1,2].flatMap(n => [n, n*2])</code> → <code>[1,2,2,4]</code>." },
    { term: "for", def: "Buclă clasică: <code>for (let i = 0; i < n; i++) { }</code>. Când știi câte iterații." },
    { term: "for...in", def: "Iterează CHEILE unui obiect: <code>for (const key in obj) { }</code>. ⚠️ Nu folosi pe arrays!" },
    { term: "for...of", def: "Iterează VALORILE unui iterable: <code>for (const item of arr) { }</code>. Funcționează cu arrays, strings, Maps, Sets." },
    { term: "forEach()", def: "Execută o funcție pentru fiecare element. NU returnează nimic (spre deosebire de map). Nu se poate opri cu break." },
    { term: "freeze()", def: "<code>Object.freeze(obj)</code> — face un obiect complet imutabil. Nu poți adăuga, șterge sau modifica proprietăți." },
    { term: "Function", def: "Bloc de cod reutilizabil. Poate primi parametri și returna o valoare: <code>function add(a,b) { return a+b; }</code>." },
    { term: "Function Expression", def: "Funcție asignată unei variabile: <code>const f = function() { }</code>. Nu este hoisted." },
    { term: "Function Scope", def: "Variabilele declarate cu <code>var</code> au function scope — vizibile în toată funcția." },

    // === G ===
    { term: "Garbage Collection", def: "JS eliberează automat memoria pentru obiectele care nu mai sunt referite. Nu trebuie să faci manual." },
    { term: "Generator", def: "Funcție care poate fi suspendată și reluată: <code>function* gen() { yield 1; yield 2; }</code>." },
    { term: "get / set", def: "Accessors de proprietate în clasă/obiect: <code>get name() { return this._name; }</code>." },
    { term: "getAttribute()", def: "Citește un atribut HTML: <code>el.getAttribute('href')</code>. Alternativa: <code>el.href</code> (pentru atribute standard)." },
    { term: "getElementById()", def: "Selectează un element după ID: <code>document.getElementById('myId')</code>. Returnează null dacă nu există." },
    { term: "Global Scope", def: "Variabilele declarate în afara oricărei funcții/bloc sunt globale — accesibile de oriunde." },
    { term: "globalThis", def: "Referință universală la obiectul global: <code>window</code> în browser, <code>global</code> în Node.js." },

    // === H ===
    { term: "hasOwnProperty()", def: "Verifică dacă un obiect are o proprietate proprie (nu moștenită): <code>obj.hasOwnProperty('name')</code>." },
    { term: "Hoisting", def: "JS 'mută' declarațiile de funcții și var în sus. let/const = temporal dead zone. Arrow functions NU sunt hoisted." },
    { term: "HTML", def: "HyperText Markup Language — definește STRUCTURA unei pagini web (titluri, paragrafe, butoane)." },
    { term: "HTTP", def: "Protocol de comunicare web. Metode: GET (citește), POST (trimite), PUT (actualizează), DELETE (șterge)." },
    { term: "HTTP Status Codes", def: "200 = OK, 301 = redirect, 400 = bad request, 401 = unauthorized, 404 = not found, 500 = server error." },

    // === I ===
    { term: "if/else", def: "Structură condițională: dacă condiția e true → if; altfel → else. Se pot înlănțui cu else if." },
    { term: "IIFE", def: "Immediately Invoked Function Expression: <code>(function() { })();</code> — se auto-execută la declarare." },
    { term: "Immutable", def: "Nu poate fi modificat. Stringurile sunt immutable: <code>'abc'[0] = 'x'</code> nu funcționează. Numerele la fel." },
    { term: "import", def: "Importă dintr-un modul: <code>import { x } from './file.js'</code> sau <code>import x from './file.js'</code>." },
    { term: "in operator", def: "Verifică dacă o proprietate există: <code>'name' in obj</code> → true/false." },
    { term: "includes()", def: "Verifică dacă un array/string conține o valoare: <code>[1,2].includes(2)</code> → true." },
    { term: "indexOf()", def: "Poziția primei apariții: <code>'hello'.indexOf('l')</code> → 2. Returnează -1 dacă nu găsește." },
    { term: "Infinity", def: "Valoare specială: <code>1/0</code> → Infinity. <code>-1/0</code> → -Infinity." },
    { term: "Inheritance", def: "Moștenire OOP — o clasă copil preia proprietățile/metodele clasei părinte (extends)." },
    { term: "innerHTML", def: "Citește/setează conținutul HTML al unui element. ⚠️ Risc XSS — preferă <code>textContent</code> pentru text." },
    { term: "innerText", def: "Similar cu textContent dar ia în calcul stilul CSS (nu afișează text ascuns)." },
    { term: "instanceof", def: "Verifică dacă un obiect e instanță a unei clase: <code>dog instanceof Animal</code> → true/false." },
    { term: "isNaN()", def: "Verifică dacă o valoare e NaN: <code>isNaN('abc')</code> → true. Prefer <code>Number.isNaN()</code> (mai strict)." },
    { term: "Iterable", def: "Obiect care poate fi parcurs cu for...of: Arrays, Strings, Maps, Sets, NodeLists." },
    { term: "Iterator", def: "Obiect cu metoda <code>next()</code> care returnează <code>{value, done}</code>." },

    // === J ===
    { term: "JavaScript", def: "Limbajul de programare al web-ului. Rulează în browser (frontend) și pe server (Node.js). Creat în 1995 de Brendan Eich." },
    { term: "join()", def: "Unește elementele array-ului într-un string: <code>['a','b','c'].join('-')</code> → <code>'a-b-c'</code>." },
    { term: "JSON", def: "JavaScript Object Notation — format text pentru date. <code>JSON.stringify()</code> = obj→text, <code>JSON.parse()</code> = text→obj." },
    { term: "JSON.parse()", def: "Convertește un string JSON într-un obiect JavaScript: <code>JSON.parse('{\"a\":1}')</code> → <code>{a:1}</code>." },
    { term: "JSON.stringify()", def: "Convertește un obiect JS într-un string JSON: <code>JSON.stringify({a:1})</code> → <code>'{\"a\":1}'</code>." },

    // === K ===
    { term: "keys()", def: "<code>Object.keys(obj)</code> returnează un array cu cheile obiectului: <code>Object.keys({a:1, b:2})</code> → <code>['a','b']</code>." },
    { term: "Keydown / Keyup", def: "Evenimente de tastatură. keydown = tasta apăsată. keyup = tasta eliberată. <code>e.key</code> dă caracterul." },

    // === L ===
    { term: "label", def: "Dă un nume unei bucle pentru a fi folosit cu break/continue: <code>outer: for (...) { break outer; }</code>." },
    { term: "lastIndexOf()", def: "Poziția ultimei apariții: <code>'hello'.lastIndexOf('l')</code> → 3." },
    { term: "length", def: "Proprietate care dă lungimea: <code>'abc'.length</code> → 3. <code>[1,2,3].length</code> → 3." },
    { term: "let", def: "Declară o variabilă reasignabilă cu block scope. Folosește-l când valoarea se schimbă." },
    { term: "Lexical Scope", def: "Scope-ul e determinat de UNDE e scris codul, nu de unde e apelat. Baza closures." },
    { term: "Local Storage", def: "Stocare persistentă în browser (chiar după închidere). <code>localStorage.setItem(key, val)</code>, <code>.getItem(key)</code>." },
    { term: "Logical Operators", def: "<code>&&</code> AND, <code>||</code> OR, <code>!</code> NOT, <code>??</code> nullish coalescing." },
    { term: "Loop", def: "Execută un bloc de mai multe ori. Tipuri: for, while, do...while, for...of, for...in, forEach." },

    // === M ===
    { term: "Map (Data Structure)", def: "<code>new Map()</code> — colecție de perechi cheie-valoare. Cheia poate fi ORICE tip (spre deosebire de Object)." },
    { term: "map() (Array)", def: "Transformă fiecare element și returnează un array NOU: <code>[1,2,3].map(x => x*2)</code> → <code>[2,4,6]</code>." },
    { term: "Math", def: "Obiect built-in cu funcții matematice: <code>.random()</code>, <code>.floor()</code>, <code>.ceil()</code>, <code>.round()</code>, <code>.max()</code>, <code>.min()</code>, <code>.abs()</code>, <code>.PI</code>." },
    { term: "Method", def: "O funcție care aparține unui obiect sau clase: <code>arr.push()</code>, <code>str.split()</code>, <code>obj.greet()</code>." },
    { term: "Modules (ES)", def: "Sistem de import/export: <code>export function f(){}</code> + <code>import {f} from './file.js'</code>. Fiecare fișier = un modul." },
    { term: "Mutation", def: "Modificarea directă. <code>.push()</code>, <code>.sort()</code>, <code>.reverse()</code>, <code>.splice()</code> MUTEAZĂ array-ul. Spread <code>[...arr]</code> face copie." },

    // === N ===
    { term: "NaN", def: "Not a Number — rezultat la operații invalide: <code>'abc' * 2</code> → NaN. <code>NaN !== NaN</code> (unic!)." },
    { term: "new", def: "Creează o instanță nouă: <code>new Date()</code>, <code>new Map()</code>, <code>new ClassName()</code>." },
    { term: "Node", def: "Orice element din arborele DOM: element nodes, text nodes, comment nodes." },
    { term: "Node.js", def: "Runtime JavaScript pe server (nu în browser). Permite servere web, API-uri, și scripturi cu JS." },
    { term: "NodeList", def: "Lista de elemente DOM returnată de <code>querySelectorAll()</code>. Similară cu un array dar NU e uno — folosește forEach sau Array.from()." },
    { term: "null", def: "Valoare specială = 'nimic, intenționat'. typeof null === 'object' (bug vechi). Diferit de undefined." },
    { term: "Nullish Coalescing (??)", def: "Returnează dreapta dacă stânga e null/undefined: <code>x ?? 'default'</code>. NU se activează pentru 0 sau ''." },
    { term: "Number", def: "Tip de date numeric. Include integers și floats. Limite: <code>Number.MAX_SAFE_INTEGER</code> = 2^53-1." },
    { term: "Number Methods", def: "<code>parseInt()</code>, <code>parseFloat()</code>, <code>.toFixed(2)</code>, <code>Number.isInteger()</code>, <code>Number.isNaN()</code>." },

    // === O ===
    { term: "Object", def: "Colecție de perechi cheie:valoare: <code>{name: 'Ana', age: 22}</code>." },
    { term: "Object.assign()", def: "Copiază proprietăți din surse în target: <code>Object.assign({}, obj1, obj2)</code>. Shallow copy." },
    { term: "Object.entries()", def: "Returnează perechi [cheie, valoare]: <code>Object.entries({a:1})</code> → <code>[['a',1]]</code>." },
    { term: "Object.freeze()", def: "Înghiță un obiect — NU mai poți modifica/adăuga/șterge proprietăți." },
    { term: "Object.keys()", def: "Returnează array cu cheile: <code>Object.keys({a:1, b:2})</code> → <code>['a','b']</code>." },
    { term: "Object.values()", def: "Returnează array cu valorile: <code>Object.values({a:1, b:2})</code> → <code>[1,2]</code>." },
    { term: "onclick", def: "Atribut HTML pentru event handler: <code>&lt;button onclick='fn()'&gt;</code>. Prefer addEventListener." },
    { term: "Operator Precedence", def: "Ordinea evaluării operatorilor. <code>*</code> se execută înaintea <code>+</code>: <code>2 + 3 * 4</code> = 14, nu 20." },
    { term: "Optional Chaining (?.)", def: "Acces sigur la proprietăți nested: <code>obj?.prop?.sub</code>. Returnează undefined în loc de eroare." },

    // === P ===
    { term: "padStart() / padEnd()", def: "Adaugă caractere: <code>'5'.padStart(3, '0')</code> → <code>'005'</code>." },
    { term: "Parameter", def: "Variabila din definiția funcției: <code>function f(x)</code>, <code>x</code> e parametrul. La apel, trimiti un argument." },
    { term: "parseInt() / parseFloat()", def: "Convertesc string → number: <code>parseInt('42px')</code> → 42. <code>parseFloat('3.14')</code> → 3.14." },
    { term: "pop()", def: "Scoate ULTIMUL element din array și îl returnează: <code>[1,2,3].pop()</code> → 3. Mutează array-ul." },
    { term: "Polymorphism", def: "Principiu OOP — aceeași metodă se comportă diferit în clase diferite (override)." },
    { term: "preventDefault()", def: "Oprește comportamentul default al browser-ului: <code>e.preventDefault()</code>. Ex: nu naviga la link, nu trimite form." },
    { term: "Primitive", def: "Valoare simplă, imutabilă: string, number, boolean, null, undefined, symbol, bigint. Nu sunt obiecte." },
    { term: "Promise", def: "Obiect pentru operații asincrone — va fi resolved (succes) sau rejected (eșec). Consumat cu .then()/.catch() sau await." },
    { term: "Promise.all()", def: "Așteaptă TOATE promisiunile: <code>await Promise.all([p1, p2, p3])</code>. Eșuează dacă oricare eșuează." },
    { term: "Promise.race()", def: "Returnează rezultatul PRIMEI promisiuni finalizate (succes sau eșec)." },
    { term: "Prototype", def: "Mecanismul de moștenire. Fiecare obiect are un __proto__ de la care moștenește metode." },
    { term: "push()", def: "Adaugă la SFÂRȘITUL array-ului: <code>[1,2].push(3)</code> → <code>[1,2,3]</code>. Returnează noua lungime." },

    // === Q ===
    { term: "querySelector()", def: "Selectează primul element matching: <code>document.querySelector('.btn')</code>. Suportă orice selector CSS." },
    { term: "querySelectorAll()", def: "Selectează TOATE elementele matching: <code>document.querySelectorAll('li')</code>. Returnează NodeList." },

    // === R ===
    { term: "Recursion", def: "Funcție care se apelează pe ea însăși: <code>function f(n) { if(n<=0) return; f(n-1); }</code>. Necesită condiție de oprire!" },
    { term: "reduce()", def: "Combină elementele într-o singură valoare: <code>[1,2,3].reduce((sum,n) => sum+n, 0)</code> → 6." },
    { term: "RegExp", def: "Regular Expression — pattern pentru căutarea/validarea textului: <code>/[a-z]+/gi</code>. Metode: .test(), .match(), .replace()." },
    { term: "removeChild()", def: "Șterge un element copil din DOM: <code>parent.removeChild(child)</code>. Alternativa modernă: <code>el.remove()</code>." },
    { term: "removeEventListener()", def: "Șterge un event listener. Funcția trebuie să fie aceeași referință ca cea din addEventListener." },
    { term: "repeat()", def: "Repetă un string: <code>'abc'.repeat(3)</code> → <code>'abcabcabc'</code>." },
    { term: "replace()", def: "Înlocuiește text: <code>'abc'.replace('b', 'x')</code> → <code>'axc'</code>. /regex/g pentru toate aparițiile." },
    { term: "replaceAll()", def: "Înlocuiește TOATE aparițiile: <code>'aaa'.replaceAll('a', 'b')</code> → <code>'bbb'</code>." },
    { term: "Rest (...)", def: "Captează restul argumentelor: <code>function f(a, ...rest) {}</code>. rest e un array real." },
    { term: "return", def: "Returnează o valoare din funcție și oprește execuția. Fără return → funcția returnează undefined." },
    { term: "reverse()", def: "Inversează un array IN PLACE: <code>[1,2,3].reverse()</code> → <code>[3,2,1]</code>. ⚠️ Mutează originalul!" },

    // === S ===
    { term: "Scope", def: "Zona de vizibilitate a variabilelor. Global, Local (function), Block. Determină unde poți accesa o variabilă." },
    { term: "Scope Chain", def: "Lanțul de scope-uri prin care JS caută variabile: local → outer → ... → global." },
    { term: "Semicolon", def: "JS adaugă automat ; (ASI). Dar e bine să le pui explicit pentru claritate." },
    { term: "Session Storage", def: "Ca localStorage dar datele se șterg la închiderea tab-ului: <code>sessionStorage.setItem(key, val)</code>." },
    { term: "Set", def: "<code>new Set()</code> — colecție de valori UNICE. <code>new Set([1,1,2,3])</code> → <code>{1,2,3}</code>." },
    { term: "setAttribute()", def: "Setează un atribut HTML: <code>el.setAttribute('class', 'active')</code>." },
    { term: "setInterval()", def: "Execută o funcție repetat la fiecare N ms: <code>setInterval(fn, 1000)</code>. Oprește cu clearInterval." },
    { term: "setTimeout()", def: "Execută o funcție DUPĂ un delay: <code>setTimeout(fn, 2000)</code>. Se execută o singură dată." },
    { term: "Shallow Copy", def: "Copie superficială — obiectele nested rămân referite: <code>{...obj}</code>, <code>Object.assign()</code>." },
    { term: "shift()", def: "Scoate PRIMUL element din array: <code>[1,2,3].shift()</code> → 1. Array devine <code>[2,3]</code>." },
    { term: "Short-circuit", def: "<code>&&</code> returnează prima valoare falsy. <code>||</code> returnează prima valoare truthy. Util pentru defaults." },
    { term: "slice()", def: "Taie o porțiune (FĂRĂ mutare): <code>[1,2,3,4].slice(1,3)</code> → <code>[2,3]</code>. Funcționează și pe strings." },
    { term: "some()", def: "Verifică dacă CEL PUȚIN UN element trece testul: <code>[1,2,3].some(n => n > 2)</code> → true." },
    { term: "sort()", def: "Sortează un array. ⚠️ MUTEAZĂ originalul! <code>[...arr].sort((a,b) => a-b)</code> pentru copie sortată." },
    { term: "splice()", def: "Adaugă/șterge elemente: <code>arr.splice(1, 2)</code> = șterge 2 de la index 1. ⚠️ MUTEAZĂ." },
    { term: "Spread (...)", def: "Expandează un array/obiect: <code>[...arr, 4]</code>, <code>{...obj, new: 'val'}</code>. Opusul REST." },
    { term: "startsWith()", def: "Verifică dacă un string începe cu un text: <code>'hello'.startsWith('he')</code> → true." },
    { term: "Static method", def: "Metodă apelată pe CLASĂ, nu pe instanță: <code>static create() { }</code>. Ex: <code>Array.isArray()</code>." },
    { term: "stopPropagation()", def: "Oprește propagarea unui eveniment (bubbling/capturing): <code>e.stopPropagation()</code>." },
    { term: "Strict Mode", def: "<code>'use strict';</code> — activează reguli mai stricte: variabile nedeclarate = eroare, this = undefined, etc." },
    { term: "String", def: "Tip de date text. Ghilimele: <code>'text'</code>, <code>\"text\"</code>, backticks <code>`text ${var}`</code>. Immutable." },
    { term: "structuredClone()", def: "Deep copy nativ: <code>structuredClone(obj)</code>. Copiază totul inclusiv nested objects." },
    { term: "super", def: "Apelează constructorul/metodele clasei părinte: <code>super(args)</code> în constructor, <code>super.method()</code>." },
    { term: "switch", def: "Comparări multiple. Alternativă la if/else if chain. NECESITĂ break după fiecare case!" },
    { term: "Symbol", def: "Tip primitiv unic și imutabil: <code>Symbol('desc')</code>. Folosit ca cheie de proprietate unică." },
    { term: "Synchronous", def: "Cod care se execută linie cu linie, blocând execuția până termină fiecare instrucțiune." },

    // === T ===
    { term: "Template Literal", def: "String cu backticks + interpolare: <code>`Salut, ${name}!`</code>. Suportă multi-linie și expresii." },
    { term: "Temporal Dead Zone", def: "Zona dintre începutul scope-ului și declararea let/const. Accesul în TDZ → ReferenceError." },
    { term: "Ternary Operator", def: "<code>condiție ? dacă_true : dacă_false</code>. Ex: <code>x > 0 ? 'pozitiv' : 'negativ'</code>." },
    { term: "textContent", def: "Proprietate DOM pentru textul unui element (fără HTML). Mai sigură decât innerHTML." },
    { term: "this", def: "Referință la contextul curent. În metode = obiectul. În arrow functions = contextul exterior. În global = window." },
    { term: "throw", def: "Aruncă o eroare custom: <code>throw new Error('Mesaj')</code>. Prinsă cu try/catch." },
    { term: "Throttle", def: "Limitează frecvența execuției unei funcții (max 1 per interval). Util pentru scroll/resize events." },
    { term: "toFixed()", def: "Rotunjește la N zecimale (returnează string): <code>(3.14159).toFixed(2)</code> → <code>'3.14'</code>." },
    { term: "toLowerCase() / toUpperCase()", def: "Convertește: <code>'Hello'.toLowerCase()</code> → <code>'hello'</code>. <code>'Hello'.toUpperCase()</code> → <code>'HELLO'</code>." },
    { term: "trim()", def: "Elimină spațiile de la capete: <code>' hello '.trim()</code> → <code>'hello'</code>. Variante: trimStart, trimEnd." },
    { term: "Truthy", def: "Orice valoare care NU e falsy. Ex: 1, 'text', [], {}, -1, ' ' (spațiu) — toate sunt truthy." },
    { term: "try/catch", def: "Prinde erori: try = cod riscant, catch = gestionare, finally = mereu. Codul continuă după catch." },
    { term: "typeof", def: "Returnează tipul ca string: <code>typeof 42</code> → 'number'. ⚠️ <code>typeof null</code> → 'object' (bug)." },

    // === U ===
    { term: "undefined", def: "Valoare default pentru variabile nedefinite, parametri lipsă, funcții fără return. Diferit de null." },
    { term: "Unicode", def: "Standard pentru codificarea caracterelor. JS folosește UTF-16 intern." },
    { term: "unshift()", def: "Adaugă la ÎNCEPUTUL array-ului: <code>[2,3].unshift(1)</code> → <code>[1,2,3]</code>." },
    { term: "URL", def: "Uniform Resource Locator — adresa web. <code>new URL('https://...')</code> parsează componentele." },
    { term: "use strict", def: "Mod strict: variabile nedeclarate = eroare, this = undefined în funcții, și alte restricții utile." },

    // === V ===
    { term: "values()", def: "<code>Object.values(obj)</code> returnează array cu valorile: <code>Object.values({a:1, b:2})</code> → <code>[1,2]</code>." },
    { term: "var", def: "Declarare veche cu function scope. ❌ NU o folosi — folosește let/const. Probleme: hoisting, fără block scope." },
    { term: "Variable", def: "Container cu nume care stochează o valoare. <code>const</code> (constantă), <code>let</code> (reasignabilă), <code>var</code> (vechi)." },
    { term: "void", def: "Operator care evaluează o expresie și returnează undefined: <code>void 0</code> → undefined." },

    // === W ===
    { term: "WeakMap", def: "Ca Map dar cheile sunt obiecte slab referite. Permite garbage collection. Fără iterare." },
    { term: "WeakSet", def: "Ca Set dar doar cu obiecte slab referite. Permite garbage collection. Fără iterare." },
    { term: "Web API", def: "API-uri furnizate de browser: DOM, Fetch, Canvas, WebSocket, Geolocation, ServiceWorker, etc." },
    { term: "while", def: "Buclă: repetă CÂT TIMP condiția e true. <code>while (i < 10) { i++; }</code>. ⚠️ Atenție la infinite loops!" },
    { term: "Window", def: "Obiectul global al browser-ului. Conține: document, console, localStorage, setTimeout, fetch, alert, etc." },

    // === X, Y, Z ===
    { term: "XMLHttpRequest", def: "Metoda veche de a face HTTP requests (înainte de Fetch). Încă funcționează dar Fetch e mai simplu." },
    { term: "yield", def: "Pausează un generator și returnează o valoare: <code>function* gen() { yield 1; yield 2; }</code>." },
    { term: "Zero-based Index", def: "Arrays și strings încep de la 0: <code>'abc'[0]</code> → 'a'. <code>[10,20,30][0]</code> → 10." },
];

// Sortăm alfabetic
terms.sort((a, b) => a.term.localeCompare(b.term));

// Generăm filtrele de litere
const letters = [...new Set(terms.map(t => t.term[0].toUpperCase()))].sort();
const filterDiv = document.getElementById('letterFilter');
const allBtn = document.createElement('button');
allBtn.textContent = 'TOATE (' + terms.length + ')';
allBtn.className = 'active';
allBtn.onclick = () => {
    renderTerms();
    document.querySelectorAll('.glossary-filter button').forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
};
filterDiv.appendChild(allBtn);

letters.forEach(l => {
    const count = terms.filter(t => t.term[0].toUpperCase() === l).length;
    const btn = document.createElement('button');
    btn.textContent = `${l} (${count})`;
    btn.onclick = () => {
        renderTerms(l);
        document.querySelectorAll('.glossary-filter button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };
    filterDiv.appendChild(btn);
});

function renderTerms(filterLetter = null) {
    const list = document.getElementById('glossaryList');
    const filtered = filterLetter ? terms.filter(t => t.term[0].toUpperCase() === filterLetter) : terms;

    let html = '';
    let currentLetter = '';
    filtered.forEach(t => {
        const letter = t.term[0].toUpperCase();
        if (letter !== currentLetter) {
            currentLetter = letter;
            html += `<div class="letter-header">${letter}</div>`;
        }
        html += `<div class="glossary-item"><div class="term">${t.term}</div><div class="definition">${t.def}</div></div>`;
    });
    list.innerHTML = html;
}

renderTerms();
