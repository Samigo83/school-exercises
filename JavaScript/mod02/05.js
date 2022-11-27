"use strict";

let numbers = [];
let userNumber;
let check = true;

function checkArray (array, userInput) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === userInput) {
      return false
    }
  }
  return true
}

userNumber = prompt("Enter a number?");

while (check === true) {
  numbers.push(userNumber);
  userNumber = prompt("Enter a number?");
  check = checkArray(numbers, userNumber);
}

numbers.sort((a,b) => a-b);

for (let value of numbers) {
  console.log(value)
}
