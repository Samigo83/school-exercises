"use strict";

let yearNumber = prompt("Enter year:")

yearNumber = parseInt(yearNumber)
console.log(yearNumber % 4)

if ((yearNumber % 4 === 0 && yearNumber % 100 !== 0) || (yearNumber % 100 === 0 && yearNumber % 400 === 0))  {
  document.querySelector("#target").innerHTML = `${yearNumber} is a leap year.`
}
else {
  document.querySelector("#target").innerHTML = `${yearNumber} is NOT a leap year.`
}

