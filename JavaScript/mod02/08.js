"use strict";

function concat(array) {
  let string = "";
  for (let i=0; i < array.length; i++) {
    string += array[i]
  }
  return string
}

const strArray = ["Sami", "Erno", "Vladimir", "Laura"];

let string = concat(strArray);

document.querySelector("#target").innerHTML = string;

