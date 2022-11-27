'use strict';

let posResults = 0;

let dices = prompt('How many dices to simulate probability');

let maxSum = dices * 6;

let userSum = prompt(`Enter the sum of dices between ${dices} - ${maxSum}`);

if (dices <= userSum <= maxSum) {
  for (let i = 0; i < 10000; i++) {
    let diceSum = 0;
    for (let j = 0; j < dices; j++) {
      let diceResult = Math.floor(Math.random() * 6) + 1;
      diceSum += diceResult;
    }
    if (diceSum === parseInt(userSum)) {
      posResults++;
    }
  }
}
  else {
    alert("Incorrect value.")
}

let probability = (posResults / 10000 * 100).toFixed(1);

document.querySelector(
    '#target').innerHTML = `Probability for ${userSum} with ${dices} dices is ${probability} % `;
