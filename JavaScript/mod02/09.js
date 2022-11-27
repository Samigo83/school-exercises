"use strict";

function even(array) {
  let evenArray = [];
  for (let number of array) {
    if (number % 2 === 0) {
      evenArray.push(number)
    }
  }
  return evenArray;
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let evenNumbers = even(numbers)

console.log(numbers)
console.log(evenNumbers)


