"use strict";

const dogNames = [];

for (let i = 1; i < 7; i++) {
  let name = prompt(`Name of dog ${i}?`);
  dogNames.push(name);
}

dogNames.reverse()

for (let name of dogNames) {
  let newLi = document.createElement('li');
  newLi.appendChild(document.createTextNode(name));
  document.querySelector("#target").appendChild(newLi);
}