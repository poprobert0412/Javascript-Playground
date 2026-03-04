// ============================================================================
// 🔷 TypeScript Examples — Concepte de bază
// ============================================================================

// === 1. TIPURI DE BAZĂ ===
let age: number = 25;
let userName: string = "Robert";
let isStudent: boolean = true;
let scores: number[] = [10, 9, 8, 7];

// Tip explicit vs inferență (TypeScript ghicește tipul!)
const city = "București"; // TypeScript știe că e string
const pi = 3.14159;       // TypeScript știe că e number

// === 2. INTERFACES — definești structura unui obiect ===
interface User {
    nume: string;
    varsta: number;
    email: string;
    premium?: boolean; // opțional (poate lipsi)
}

const user: User = {
    nume: "Robert",
    varsta: 25,
    email: "robert@example.com",
    // premium nu e obligatoriu
};

// === 3. FUNCȚII CU TIPURI ===
function aduna(a: number, b: number): number {
    return a + b;
}

const saluta = (nume: string): string => {
    return `Salut, ${nume}!`;
};

// Funcție cu parametru opțional
function createUser(name: string, age: number, role?: string): User {
    return {
        nume: name,
        varsta: age,
        email: `${name.toLowerCase()}@example.com`,
    };
}

// === 4. UNION TYPES — o variabilă poate fi MAI MULTE tipuri ===
type ID = string | number;

let userId: ID = "abc123";
userId = 42; // OK — poate fi și number

// === 5. LITERAL TYPES — valori exacte ca tip ===
type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction): void {
    console.log(`Moving ${direction}`);
}
move("up");    // ✅ OK
// move("diagonal"); // ❌ Error: nu e în union!

// === 6. ENUMS — constante cu nume ===
enum Status {
    Active = "ACTIVE",
    Inactive = "INACTIVE",
    Pending = "PENDING",
}

const currentStatus: Status = Status.Active;
console.log(currentStatus); // "ACTIVE"

// === 7. GENERICS — tipuri flexibile și refolosibile ===
function firstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

const firstNum = firstElement([10, 20, 30]);    // number
const firstStr = firstElement(["a", "b", "c"]); // string

// Generic interface
interface ApiResponse<T> {
    data: T;
    success: boolean;
    message: string;
}

const response: ApiResponse<User> = {
    data: user,
    success: true,
    message: "User loaded",
};

// === 8. TYPE GUARDS — verificări inteligente de tip ===
function printId(id: ID): void {
    if (typeof id === "string") {
        console.log(`String ID: ${id.toUpperCase()}`);
    } else {
        console.log(`Number ID: ${id.toFixed(0)}`);
    }
}

// === 9. UTILITY TYPES — tipuri derivate ===
type PartialUser = Partial<User>;   // toate proprietățile devin opționale
type ReadonlyUser = Readonly<User>; // toate proprietățile devin readonly
type UserName = Pick<User, "nume" | "email">; // doar anumite proprietăți

// === 10. CLASSES CU TYPESCRIPT ===
class Student {
    // Declarare + inițializare directă în constructor
    constructor(
        public name: string,
        public grade: number,
        private id: string = Math.random().toString(36).slice(2)
    ) { }

    getInfo(): string {
        return `${this.name} (Nota: ${this.grade})`;
    }
}

const student = new Student("Ana", 9.5);
console.log(student.getInfo()); // "Ana (Nota: 9.5)"

// === 11. ASYNC CU TIPURI ===
interface Post {
    id: number;
    title: string;
    body: string;
}

async function fetchPosts(): Promise<Post[]> {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    const data: Post[] = await response.json();
    return data;
}

// === RULARE ===
console.log(aduna(3, 5));           // 8
console.log(saluta(userName));      // "Salut, Robert!"
printId("abc");                     // "String ID: ABC"
printId(42);                        // "Number ID: 42"
console.log(student.getInfo());     // "Ana (Nota: 9.5)"
console.log("Status:", currentStatus); // "Status: ACTIVE"