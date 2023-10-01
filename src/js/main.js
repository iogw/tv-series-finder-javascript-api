'use strict';

//CONSTANTS
const inputElement = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-button-search');
const searchResultsSection = document.querySelector('.js-results-section');
const favoritesSection = document.querySelector('.js-favorites');

//Default
const defaultImage =
  'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
const defaultUrl = 'https://api.tvmaze.com/search/shows?q=Neko';

const favMarkedColor = '#ffa600';

//  HTML-CSS CLASS
const searchCardClass = 'search-item-result';
const favCardClass = 'fav-item';
const deleteBtnClss = 'delete-btn';
const resetBtnClss = 'reset-btn';

let searchList = [];
let favList = [];

//LOCAL STORAGE
const savedDefaultPage = JSON.parse(localStorage.getItem('defaultPage'));
if (savedDefaultPage === null) {
  queryApiPrintResults(defaultUrl);
} else {
  searchList = savedDefaultPage;
  updateSearchList();
}

const savedLsFavs = JSON.parse(localStorage.getItem('favList'));
if (savedLsFavs !== null) {
  favList = savedLsFavs;
  updateFavsAndLS();
}

// FAVORITE FUNCTIONALITY
function handleClickInSearchCards(event) {
  const cardClicked = event.currentTarget;
  const indexinFavOfSelected = favList.findIndex(
    (item) => item.id === parseInt(cardClicked.id)
  );
  const copyOfCardSelected = searchList.find(
    (item) => item.id === parseInt(cardClicked.id)
  );

  //¿Is on fav list? Then add or delete
  if (indexinFavOfSelected === -1) {
    favList.push(copyOfCardSelected);
  } else {
    favList.splice(indexinFavOfSelected, 1);
  }
  updateFavsAndLS();
}
function handleDeleteFavButton(event) {
  const buttonClicked = event.currentTarget;
  const favToDelete = buttonClicked.parentElement;
  const indexinFavOfSelected = favList.findIndex(
    (item) => item.id === parseInt(favToDelete.id)
  );
  favList.splice(indexinFavOfSelected, 1);
  updateFavsAndLS();
}
function handleResetButton() {
  favList = [];
  updateFavsAndLS();
}

//ADD LISTENERS
function docQuerySel(toClass) {
  const classToSelect = `.${toClass}`;
  const elementsToSelect = document.querySelectorAll(classToSelect);
  return elementsToSelect;
}

function addClickListeners(toClass, handleFunction) {
  const elementsToListen = docQuerySel(toClass);
  for (const elementToListen of elementsToListen) {
    elementToListen.addEventListener('click', handleFunction);
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

//PRINT FUNCTIONS

function printList(whereToPrint, listToPrint, classOfItem) {
  whereToPrint.textContent = '';
  const newUlElement = document.createElement('ul');
  for (const itemOfList of listToPrint) {
    newUlElement.appendChild(renderSerieCard(itemOfList, classOfItem));
  }
  whereToPrint.appendChild(newUlElement);
}

function addDeleteFavButtons(toClass) {
  const liFavElements = docQuerySel(toClass);

  for (const liFavElement of liFavElements) {
    const newDeleteButton = document.createElement('button');
    const buttonContent = document.createTextNode('x');
    newDeleteButton.setAttribute('class', deleteBtnClss);
    newDeleteButton.appendChild(buttonContent);

    liFavElement.appendChild(newDeleteButton);
    addClickListeners(deleteBtnClss, handleDeleteFavButton);
  }
}

function addResetFavButton() {
  const newDeleteButton = document.createElement('button');
  const buttonContent = document.createTextNode('Eliminar todos tus favoritos');
  newDeleteButton.setAttribute('class', resetBtnClss);
  newDeleteButton.appendChild(buttonContent);
  if (favList.length === 0) {
    newDeleteButton.setAttribute('disabled', 'disabled');
  } else {
    newDeleteButton.removeAttribute('disabled');
  }
  favList.length === 0
    ? newDeleteButton.setAttribute('disabled', 'disabled')
    : newDeleteButton.removeAttribute('disabled');

  favoritesSection.firstElementChild.appendChild(newDeleteButton);
  addClickListeners(resetBtnClss, handleResetButton);
}
function markSearchCardOnFavs() {
  const liSearchEls = docQuerySel(searchCardClass);
  for (const elementOnList of liSearchEls) {
    const indexinFavOfSelected = favList.findIndex(
      (item) => item.id === parseInt(elementOnList.id)
    );

    if (indexinFavOfSelected === -1) {
      elementOnList.style.backgroundColor = '';
    } else {
      elementOnList.style.backgroundColor = favMarkedColor;
    }
  }
}

function updateFavsAndLS() {
  printList(favoritesSection, favList, favCardClass);
  addDeleteFavButtons(favCardClass);
  addResetFavButton();
  markSearchCardOnFavs();
  localStorage.setItem('favList', JSON.stringify(favList));
}
function updateSearchList() {
  printList(searchResultsSection, searchList, searchCardClass);
  addClickListeners(searchCardClass, handleClickInSearchCards);
  markSearchCardOnFavs();
}

function msgErrorApi(error) {
  const labelMsgError = document.querySelector('.js-msg-error');
  const errMsgContent = document.createTextNode(
    `Ha sucedido un error: ${error}`
  );
  labelMsgError.appendChild(errMsgContent);
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
      if (urlSearch === defaultUrl) {
        localStorage.setItem('defaultPage', JSON.stringify(searchList));
      }
      updateSearchList();
    })
    .catch((error) => {
      msgErrorApi(error);
    });
}

function urlUserSearch() {
  const userSearch = inputElement.value;
  const finalUrl = `//api.tvmaze.com/search/shows?q=${userSearch}`;
  return finalUrl;
}

function handleClickSearch(event) {
  event.preventDefault();
  queryApiPrintResults(urlUserSearch());
}

btnSearch.addEventListener('click', handleClickSearch);
