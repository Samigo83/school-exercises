'use strict';

let startYear = prompt('Enter start year:');
let endYear = prompt('Enter end year:');
let leapYear

startYear = parseInt(startYear);
endYear = parseInt(endYear);

for (endYear; endYear >= startYear; endYear -= 1) {
  if ((endYear % 4 === 0 && endYear % 100 !== 0) || (endYear % 100 === 0 && endYear % 400 === 0)) {
    const newLi = document.createElement("li");
    leapYear = document.createTextNode(`${endYear} is a leap year`);
    newLi.appendChild(leapYear);
    document.querySelector("#target").appendChild(newLi);
  }
}
