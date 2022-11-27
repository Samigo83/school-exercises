'use strict';
const students = [
  {
    name: 'John',
    id: '2345768',
  },
  {
    name: 'Paul',
    id: '2134657',
  },
  {
    name: 'Jones',
    id: '5423679',
  },
];

const target = document.querySelector("#target");

for (let info of students) {
  let newOption = document.createElement("option");
  newOption.value = info['id'];
  newOption.appendChild(document.createTextNode(info['name']));
  target.appendChild(newOption)
}
