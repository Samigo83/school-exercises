let number = prompt("Enter a number:");
number = parseInt(number);

for (i = 2; i < 10; i++) {
  if (number % i === 0) {
    document.querySelector(
        "#target").innerHTML = `${number} WASN'T prime number`;
        break;
  } else {
    document.querySelector("#target").innerHTML = `${number} WAS prime number`;
  }
}




