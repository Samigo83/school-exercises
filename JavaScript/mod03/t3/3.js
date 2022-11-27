'use strict';
const names = ['John', 'Paul', 'Jones'];

const target = document.querySelector("#target");

for (let i = 0; i < names.length; i++) {
  let newLi = document.createElement("li");
  newLi.appendChild(document.createTextNode(`${names[i]}`));
  target.appendChild(newLi);
}

