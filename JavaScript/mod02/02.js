"use strict";

const participants = prompt("Number of participants?");
const names = [];

for (let i = 0; i < parseInt(participants); i++) {
  let name = prompt("Name of participant?")
  names.push(name)
}

for (let name of names) {
  let newLi = document.createElement('li')
  newLi.appendChild(document.createTextNode(name))
  document.querySelector("#target").appendChild(newLi)
}
