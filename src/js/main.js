'use strict';

const inputElement = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-button-search');
const searchResultsSection = document.querySelector('.js-results-section');
const favoritesSection = document.querySelector('.js-favorites');

let seriesSearchList = [];
let favList = [];

function printFavoritesList(favoriteList) {
  // favoritesSection.removeChild()
  // favoritesSection.replaceChild()
  // favoritesSection.textContent = '';
  const newUlElement = document.createElement('ul');

  for (const serieFav of favoriteList) {
    newUlElement.appendChild(serieFav);
  }
  favoritesSection.appendChild(newUlElement);
  console.log(seriesSearchList);
  console.log(favList);
}

function handleFavSelection(event) {
  const color = '#ffa600';
  const serieClicked = event.currentTarget;

  serieClicked.style.backgroundColor = color;
  favList.push(serieClicked);
  console.log(favList);
  printFavoritesList(favList);
}

function addSerieClickListeners() {
  const seriesPrinted = document.querySelectorAll('.li-search-serie-result');
  for (const seriePrinted of seriesPrinted) {
    seriePrinted.addEventListener('click', handleFavSelection);
  }
}

function createNewLiElement(liClass, liID, title, imgUrl, imgAlt) {
  const newImgElement = document.createElement('img');
  newImgElement.setAttribute('src', imgUrl);
  newImgElement.setAttribute('alt', imgAlt);

  const newTitleElement = document.createElement('p');
  const newTitle = document.createTextNode(title);
  newTitleElement.appendChild(newTitle);

  const newListElement = document.createElement('li');
  newListElement.setAttribute('class', liClass);
  newListElement.setAttribute('id', liID);
  newListElement.appendChild(newImgElement);
  newListElement.appendChild(newTitleElement);

  return newListElement;
}

function renderSerieCard(serie) {
  //Content and atributes for every serie-card
  const serieID = serie.show.id;
  const serieName = serie.show.name;
  const imgUrl =
    serie.show.image === null
      ? 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV'
      : serie.show.image.medium;
  const imgAlt =
    serie.show.image === null ? 'Serie sin imagen' : `Imagen de ${serieName}`;

  //Create serie-card
  const newSerieCard = createNewLiElement(
    'li-search-serie-result',
    serieID,
    serieName,
    imgUrl,
    imgAlt
  );
  return newSerieCard;
}

function printSearchResults(resultsList) {
  searchResultsSection.textContent = '';
  const newUlElement = document.createElement('ul');
  for (const result of resultsList) {
    newUlElement.appendChild(renderSerieCard(result));
  }
  searchResultsSection.appendChild(newUlElement);
  addSerieClickListeners();
}

function queryApiAndPrint(urlSearch) {
  fetch(urlSearch)
    .then((response) => response.json())
    .then((series) => {
      console.log(series);
      seriesSearchList = series;
      printSearchResults(seriesSearchList);
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
