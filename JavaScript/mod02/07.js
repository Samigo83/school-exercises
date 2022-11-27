"use strict";

function rolldice(diceSides) {
  let diceResult;
  diceResult = Math.floor(Math.random() * diceSides) + 1;
  return diceResult;
}

let dice = 0;
let userInput;

userInput = prompt("Enter the maximum number of dice")
userInput = parseInt(userInput)

while (dice !== userInput) {
  dice = rolldice(userInput);
  let newLi = document.createElement('li');
  newLi.appendChild(document.createTextNode(`The dice result was ${dice}`));
  document.querySelector("#target").appendChild(newLi);
}