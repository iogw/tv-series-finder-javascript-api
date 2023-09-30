'use strict';

const inputElement = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-button-search');
const searchResultsSection = document.querySelector('.js-results-section');
const favoritesSection = document.querySelector('.js-favorites');

const defaultImage =
  'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
const searchCardClass = 'search-item-result';
const favCardClass = 'fav-item';
const favSearchColor = '#ffa600';
const deleteBtnClss = 'delete-btn';

let searchList = [];
let favList = [];

//LOCAL STORAGE
const savedLsFavs = JSON.parse(localStorage.getItem('favList'));
if (savedLsFavs !== null) {
  updateFavsAndLS(savedLsFavs);
  favList = savedLsFavs;
}

// FAVORITE FUNCTIONALITY

function handleFavSelection(event) {
  const serieClicked = event.currentTarget;
  const cardSelected = searchList.find(
    (item) => item.id === parseInt(serieClicked.id)
  );
  const indexinFavOfSelected = favList.findIndex(
    (item) => item.id === cardSelected.id
  );

  if (indexinFavOfSelected === -1) {
    serieClicked.style.backgroundColor = favSearchColor;
    favList.push(cardSelected);
  }
  updateFavsAndLS(favList);
}
function handleDeleteButton(event) {
  console.log("hola botón");
  const buttonClicked = event.currentTarget;
  const favToDelete = buttonClicked.parentElement;
  console.log(favToDelete);
}
//ADD LISTENERS

function addClickListeners(toClass, handleFunction) {
  const classToListen = `.${toClass}`;
  const elementsToListen = document.querySelectorAll(classToListen);
  for (const elementToListen of elementsToListen) {
    elementToListen.addEventListener('click', handleFunction);
  }
}

// RENDER AND PRINT LIST CARDS
function createNewLiElement(liClass, liID, title, imgUrl, imgAlt, isItFav) {
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
  newListElement.appendChild(newTitleElement);
  if (isItFav === 'yes') {
    const newDeleteButton = document.createElement('button');
    newDeleteButton.setAttribute('class', deleteBtnClss);
    const buttonContent = document.createTextNode('x');
    newDeleteButton.appendChild(buttonContent);

    newListElement.appendChild(newDeleteButton);
  }

  return newListElement;
}

function renderSerieCard(item, cardClass, isItFav) {
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
    imgAlt,
    isItFav
  );
  return newSerieCard;
}

//PRINT FUNCTIONS

function printList(wheretoPrint, listToPrint, classOfItem, isItFav) {
  wheretoPrint.textContent = '';
  const newUlElement = document.createElement('ul');
  for (const itemOfList of listToPrint) {
    newUlElement.appendChild(renderSerieCard(itemOfList, classOfItem, isItFav));
  }
  wheretoPrint.appendChild(newUlElement);
}

function updateFavsAndLS(updatedFavList) {
  printList(favoritesSection, updatedFavList, favCardClass, 'yes');
  addClickListeners(deleteBtnClss, handleDeleteButton);
  localStorage.setItem('favList', JSON.stringify(updatedFavList));
}

function queryApiPrintResults(urlSearch) {
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
      printList(searchResultsSection, searchList, searchCardClass, 'no');
      addClickListeners(searchCardClass, handleFavSelection);
    });
}

function urlSearch() {
  const userSearch = inputElement.value;
  const finalUrl = `//api.tvmaze.com/search/shows?q=${userSearch}`;
  return finalUrl;
}

function handleClickSearch(event) {
  event.preventDefault();
  queryApiPrintResults(urlSearch());
}

btnSearch.addEventListener('click', handleClickSearch);
