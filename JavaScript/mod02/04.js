const numbers = [];
let number;

while (number !== 0) {
  number = prompt('Enter a number or 0 to exit?');
  number = parseInt(number);
  if (number !== 0) {
    numbers.push(number);
  } else {
    break;
  }
}

numbers.sort((a,b) => b-a);



for (let number of numbers) {
  console.log(number);
}