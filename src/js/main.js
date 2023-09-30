'use strict';

const inputElement = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-button-search');
const searchResultsSection = document.querySelector('.js-results-section');
const favoritesSection = document.querySelector('.js-favorites');

const defaultImage =
  'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

let searchList = [];
let favList = [];

// FAVORITE FUNCTIONALITY (IN PROGRESS)

function printFavoritesList(favoriteList) {
  // favoritesSection.removeChild()
  // favoritesSection.replaceChild()
  // favoritesSection.textContent = '';
  const newUlElement = document.createElement('ul');

  for (const serieFav of favoriteList) {
    newUlElement.appendChild(serieFav);
  }
  favoritesSection.appendChild(newUlElement);
  console.log(searchList);
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

// RENDER AND PRINT LIST CARDS
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

function renderSerieCard(item, cardClass) {
  //Content and atributes for every serie-card
  const serieID = item.id;
  const serieName = item.title;
  const imgUrl = item.image;
  const imgAlt =
    item.image === defaultImage ? 'Serie sin imagen' : `Imagen de ${serieName}`;

  //Create serie-card
  const newSerieCard = createNewLiElement(
    cardClass,
    serieID,
    serieName,
    imgUrl,
    imgAlt
  );
  return newSerieCard;
}

function printList(wheretoPrint, listToPrint, classOfItem) {
  wheretoPrint.textContent = '';
  const newUlElement = document.createElement('ul');
  for (const itemOfList of listToPrint) {
    newUlElement.appendChild(renderSerieCard(itemOfList, classOfItem));
  }
  wheretoPrint.appendChild(newUlElement);
  // addSerieClickListeners();
}

function queryApiAndPrintResults(urlSearch) {
  searchList = [];
  fetch(urlSearch)
    .then((response) => response.json())
    .then((series) => {
      for (const serie of series) {
        let serieObject = {};
        serieObject.id = serie.show.id;
        serieObject.title = serie.show.name;
        serieObject.image =
          serie.show.image === null ? defaultImage : serie.show.image.medium;
        searchList.push(serieObject);
      }
      printList(searchResultsSection, searchList, 'search-item-result');
    });
}

function urlSearch() {
  const userSearch = inputElement.value;
  const finalUrl = `//api.tvmaze.com/search/shows?q=${userSearch}`;
  return finalUrl;
}

function handleClickSearch(event) {
  event.preventDefault();
  queryApiAndPrintResults(urlSearch());

  // activateFavoriteFunctionality();
}

btnSearch.addEventListener('click', handleClickSearch);
