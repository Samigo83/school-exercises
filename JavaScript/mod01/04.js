"use strict";

let name = prompt("What is your name?");

let randNumber = Math.floor(Math.random() * 4) + 1;

if (randNumber === 1) {
  document.querySelector("#target").innerHTML = `${name}, you are Daredevil.`
}
  else if (randNumber === 2) {
    document.querySelector("#target").innerHTML = `${name}, you are Slytherin.`
}
  else if (randNumber === 3) {
    document.querySelector("#target").innerHTML = `${name}, you are Hufflepuff.`
}  else {
    document.querySelector("#target").innerHTML = `${name}, you are Ravenclaw.`;
}




