// Tarea de arrays - funciones basicas de JS

let numeros = [5, 12, 8, 1, 9, 3];

// agrega un elemento al final
numeros.push(20);
console.log(numeros);

// quita el ultimo elemento
let ultimo = numeros.pop();
console.log(ultimo, numeros);

// agrega al inicio
numeros.unshift(0);
console.log(numeros);

// quita el primero
let primero = numeros.shift();
console.log(primero, numeros);

// splice sirve para meter o sacar elementos en la mitad
// aqui saco 2 y meto otros 2 desde la posicion 1
let sacados = numeros.splice(1, 2, 100, 200);
console.log(sacados, numeros);

// ordenar de menor a mayor
numeros.sort((a, b) => a - b);
console.log(numeros);

// invertir el orden
numeros.reverse();
console.log(numeros);

let frutas = ["manzana", "pera", "uva", "banano", "pera"];

// slice saca una parte pero no daña el array original
console.log(frutas.slice(1, 3));

// concat junta dos arrays
console.log(frutas.concat(["kiwi", "mango"]));

// join vuelve el array un string
console.log(frutas.join(" - "));

// indexOf busca la posicion de algo
console.log(frutas.indexOf("pera"));

// includes dice si esta o no
console.log(frutas.includes("uva"));

// find trae el primero que cumpla la condicion
console.log(frutas.find(f => f.length > 5));

// filter trae todos los que cumplan
console.log(frutas.filter(f => f.startsWith("p")));

// map transforma cada elemento
console.log(frutas.map(f => f.toUpperCase()));

// reduce lo vuelve un solo valor, aqui sumo las letras de cada fruta
let total = frutas.reduce((acc, f) => acc + f.length, 0);
console.log(total);

// forEach recorre el array
frutas.forEach(f => console.log(f));

// some pregunta si al menos uno cumple
console.log(frutas.some(f => f === "uva"));

// every pregunta si todos cumplen
console.log(frutas.every(f => f.length > 2));

// flat aplana arrays que tienen arrays adentro
let anidado = [1, [2, 3], [4, [5, 6]]];
console.log(anidado.flat(2));

// at trae un elemento por posicion, con negativos cuenta desde el final
console.log(frutas.at(-1));

// Array.isArray revisa si algo es un array
console.log(Array.isArray(frutas));

// Array.from convierte algo en array
console.log(Array.from("hola"));
