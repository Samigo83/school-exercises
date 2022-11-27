const numberList = [];

for (let i = 1; i < 6; i++) {
  let number = prompt(`Enter number ${i}`);
  numberList.push(number);
}

numberList.reverse()

for (let number of numberList) {
  console.log(number);
}