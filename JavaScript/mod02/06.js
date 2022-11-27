"use strict";

function rolldice() {
  let diceResult;
  diceResult = Math.floor(Math.random() * 6) + 1;
  return diceResult;
}

let dice = 0;

while (dice !== 6) {
  dice = rolldice();
  let newLi = document.createElement('li');
  newLi.appendChild(document.createTextNode(`The dice result was ${dice}`));
  document.querySelector("#target").appendChild(newLi);
}