"use strict";

let dices = prompt("How many dices would you like to roll?");
let number
let sum = 0

for (let i = 0; i < dices; i++) {
  number = Math.floor((Math.random() * 6) + 1)
  sum += number
}

document.querySelector("#target").innerHTML = `Sum of the rollen dice is ${sum}`;

