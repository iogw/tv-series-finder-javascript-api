'use strict';

const inputElement = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-button-search');
const ulSearchResults = document.querySelector('.js-search-list');

// let seriesList = [];

function createNewLiElement(title, imgUrl, imgAlt) {
  const newImgElement = document.createElement('img');
  newImgElement.setAttribute('src', imgUrl);
  newImgElement.setAttribute('alt', imgAlt);

  const newTitleElement = document.createElement('p');
  const newTitle = document.createTextNode(title);
  newTitleElement.appendChild(newTitle);

  const newListElement = document.createElement('li');
  newListElement.appendChild(newImgElement);
  newListElement.appendChild(newTitleElement);

  return newListElement;
}

function renderSerie(serie) {
  const serieName = serie.show.name;
  const imgUrl =
    serie.show.image === null
      ? 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV'
      : serie.show.image.medium;
  const imgAlt =
    serie.show.image === null ? 'Serie sin imagen' : `Imagen de ${serieName}`;

  const newSerie = createNewLiElement(serieName, imgUrl, imgAlt);

  return newSerie;
}

function printSearchResults(list) {
  ulSearchResults.textContent = '';
  for (const element of list) {
    ulSearchResults.appendChild(renderSerie(element));
  }
}

function queryApiAndPrint(urlSearch) {
  fetch(urlSearch)
    .then((response) => response.json())
    .then((series) => {
      console.log(series);
      //   seriesList = series;
      printSearchResults(series);
    });
}

function urlSearch() {
  const userSearch = inputElement.value;
  const finalUrl = `//api.tvmaze.com/search/shows?q=${userSearch}`;
  return finalUrl;
}

function handleClickSearch(event) {
  event.preventDefault();
  queryApiAndPrint(urlSearch());
}

btnSearch.addEventListener('click', handleClickSearch);
