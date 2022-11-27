"use strict";

const target = document.querySelector("#target");

let newLI = document.createElement("li");

let content = document.createTextNode("First item");

newLI.appendChild(content);
target.appendChild(newLI);

content = document.createTextNode("Second item");

newLI = document.createElement("li");
newLI.classList.add("my-item");
newLI.appendChild(content);
target.appendChild(newLI);


content = document.createTextNode("Third item");

newLI = document.createElement("li");
newLI.appendChild(content);
target.appendChild(newLI);



