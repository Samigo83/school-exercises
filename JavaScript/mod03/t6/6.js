"use strict";

function popup(event) {
  alert(`Element ${event.currentTarget.tagName} was clicked`);
}

const target = document.querySelector("button");

target.addEventListener('click', popup);