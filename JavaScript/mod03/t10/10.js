"use strict";


function printOutname(evt) {
  evt.preventDefault();
  const fname = document.querySelector("input[name=firstname]");
  const lname = document.querySelector("input[name=lastname]");
  const target = document.querySelector("#target")

  target.innerHTML = `Your name is ${fname.value} ${lname.value}`;
}

const form = document.querySelector("#source");

form.addEventListener('submit', printOutname);