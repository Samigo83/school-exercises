"use strict";

function newpic() {
  const target = document.querySelector("#target");
  target.src = "img/picB.jpg"
}

function oldpic() {
  const target = document.querySelector("#target");
  target.src = "img/picA.jpg"
}

const hover = document.querySelector("#trigger");

hover.addEventListener('mouseover', newpic)
hover.addEventListener('mouseout', oldpic)