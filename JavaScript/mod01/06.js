'use strict';

let selection = confirm('Should I calculate the square root?');

if (selection === true) {
  let number = prompt('Please, Input number:');
  if (number >= 0) {
    let result = parseInt(Math.sqrt(number));
    document.querySelector('#target').innerHTML = `The square root is ${result}`;
  } else {
    document.querySelector(
        '#target').innerHTML = `The square root of a negative number is not defined`;
  }
} else {
  document.querySelector(
      '#target').innerHTML = `The square root is not calculated`;
}