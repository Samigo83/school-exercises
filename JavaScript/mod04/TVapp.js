'use strict';

async function searchForShow(show) {
  try {
    const url = `https://api.tvmaze.com/search/shows?q=${show}`;
    const promise = await fetch(url);
    return await promise.json();
  /*const h2 = document.querySelector('figure > h2');
    const img = document.querySelector('figure > img');
    const p = document.querySelector('figure > p');
    const figure = document.querySelector('figure');
    h2.innerHTML = result[0].show.name;
    p.innerHTML = `<a href=${result[0].show.url} target="_blank">${result[0].show.url}</a>`;
    img.src = result[0].show.image['medium'];
    figure.innerHTML += result[0].show.summary;*/
  //addToPage(result)
  } catch (error) {
    console.log(error.message)
  }
}

async function addToPage(result) {
  const resultSet = await result;
  const main = document.querySelector('main');

  for (let i = 0; i < resultSet.length; i++) {
    let newArticle = document.createElement('article');
    let newFigure = document.createElement('figure');
    let newIMG = document.createElement('img');
    let newH2 = document.createElement('h2');
    let newP = document.createElement('p');
    let newP2 = document.createElement('p');
    newP.innerHTML = `<a href=${resultSet[i].show.url} target="_blank">${resultSet[i].show.url}</a>`;
    newH2.innerHTML = resultSet[i].show.name;
    if (resultSet[i].show.image === null) {
      newIMG.src = "https://via.placeholder.com/100x200?text=text+here"
    } else {
        newIMG.src = resultSet[i].show.image.medium;
    }
    for (let j = 0; j < resultSet[i].show.genres.length; j++) {
      if (j+1 === resultSet[i].show.genres.length) {
        newP2.innerHTML += `${resultSet[i].show.genres[j]}`
      } else {
        newP2.innerHTML += `${resultSet[i].show.genres[j]} | `
      }
    }
    newFigure.appendChild(newH2);
    newFigure.appendChild(newIMG);
    newFigure.appendChild(newP);
    newFigure.appendChild(newP2);
    if (resultSet[i].show.summary === null) {
      newFigure.innerHTML += `There is no description for this show`
    } else {
      newFigure.innerHTML += resultSet[i].show.summary;
    }
    newArticle.appendChild(newFigure);
    main.appendChild(newArticle);

  }

  const allAs = document.querySelectorAll('a');
  const span = document.querySelector('span');

  for (let i = 0; i < allAs.length; i++) {
    allAs[i].addEventListener('click', openModal)
  }
  span.addEventListener('click', closeModal);
}

function deleteChildren() {
  const articles = document.querySelectorAll('article');
  for (let i = 0; i < articles.length; i++) {
    articles[i].remove();
  }
}

function openModal(evt) {
  evt.preventDefault();
  const dialog = document.querySelector('dialog');
  const iframe = document.querySelector('iframe');

  iframe.src=evt.currentTarget.getAttribute("href");
  dialog.showModal();
}

function closeModal() {
  const dialog = document.querySelector('dialog');
  dialog.close();
}

const submit = document.querySelector('input[type=submit]');
const query = document.getElementById('query');

submit.addEventListener('click', (evt) => {
  evt.preventDefault();
  deleteChildren();
  const result = searchForShow(query.value);
  addToPage(result);
});





