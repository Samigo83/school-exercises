"use strict";

function vote(votersNumber, users) {
  for (let i = 0; i < votersNumber; i++) {
  let userVote = prompt("Enter the name of candidate to vote");
  for (let j = 0; j < users.length; j++) {
    if (userVote === users[j].name) {
      users[j].votes++
      }
    }
  }
}

let userArray = []

let userNumber = prompt("Enter the number of candidates?")
userNumber = parseInt(userNumber)

for (let i = 1; i <= userNumber; i++) {
  let userName = prompt(`Name for candidate ${i}`);
  let userInfo = {name: userName, votes: 0};
  userArray.push(userInfo);
}

let voters = prompt("Enter the number of voters?");
voters = parseInt(voters);

vote(voters, userArray)

userArray.sort((a, b) => {
   return b.votes - a.votes;
});

const voteDif = parseInt(userArray[0].votes) - parseInt(userArray[1].votes)

console.log(`The winner is ${userArray[0].name} by ${voteDif} votes`);
console.log(`Results:`);
for (let user of userArray) {
  console.log(`${user.name}: ${user.votes} votes`);
}
