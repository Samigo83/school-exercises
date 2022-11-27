'use strict';
let number1 = prompt('Type number one?');
let number2 = prompt('Type number two?');
let number3 = prompt('Type number three?');

number1 = parseInt(number1);
number2 = parseInt(number2);
number3 = parseInt(number3);

let sum = number1 + number2 + number3;
let product = number1 * number2 * number3;
let average = (parseFloat(number1) + parseFloat(number2) +
    parseFloat(number3)) / 3;

console.log(
    `The sum of those numbers is ${sum}, product is ${product} and average is ${average}`);
