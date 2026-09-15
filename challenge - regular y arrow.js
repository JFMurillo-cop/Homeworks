/**
 * CHALLENGE - Arrow Functions vs Regular Functions
 * ---------------------------------------------------
 * Diferencias principales investigadas:
 *
 * 1. Sintaxis
 *    - Regular function: function nombre(params) { ... }
 *    - Arrow function:   const nombre = (params) => { ... }
 *
 * 2. "this" (contexto)
 *    - Una función regular tiene su PROPIO "this", que depende de
 *      CÓMO se llama la función (puede cambiar según el objeto que la invoque).
 *    - Una arrow function NO tiene su propio "this": hereda el "this"
 *      del contexto donde fue definida (this léxico). Por eso son muy
 *      útiles dentro de callbacks, para no perder la referencia a "this".
 *
 * 3. Objeto "arguments"
 *    - Las funciones regulares tienen acceso al objeto especial "arguments"
 *      (lista de todos los argumentos recibidos).
 *    - Las arrow functions NO tienen su propio "arguments"; si lo usan,
 *      toman el de la función normal más cercana que las contenga.
 *
 * 4. Uso como constructores
 *    - Las funciones regulares pueden usarse con "new" para crear objetos.
 *    - Las arrow functions NO pueden usarse con "new" (lanzan error).
 *
 * 5. Hoisting
 *    - Las declaraciones de función regular (function nombre(){})
 *      se "elevan" (hoisting) y pueden llamarse antes de su declaración.
 *    - Las arrow functions asignadas a una constante/variable siguen
 *      las reglas de "let"/"const": no se pueden usar antes de declararse.
 *
 * 6. Retorno implícito
 *    - Las arrow functions permiten un retorno implícito de una sola
 *      expresión sin necesidad de llaves ni de la palabra "return":
 *      const doble = n => n * 2;
 */

// Regular function
function checkNumberRegular(number) {
  if (number % 2 === 0) {
    console.log(`${number} es PAR (función regular)`);
  } else {
    console.log(`${number} es IMPAR (función regular)`);
  }
}

// Arrow function
const checkNumberArrow = (number) => {
  if (number % 2 === 0) {
    console.log(`${number} es PAR (arrow function)`);
  } else {
    console.log(`${number} es IMPAR (arrow function)`);
  }
};


// Pruebas

checkNumberRegular(7);
checkNumberRegular(10);

checkNumberArrow(3);
checkNumberArrow(8);
