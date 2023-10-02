'use strict';

//Selectors of html elements
const inputElement = document.querySelector('.js-search-input');
const btnSearch = document.querySelector('.js-search-button');
const labelMsgError = document.querySelector('.js-msg-error');
const favoritesSection = document.querySelector('.js-favorites');
const searchResultsSection = document.querySelector('.js-results-section');
//html-css-listeners CLASS
const searchCardClass = 'search-item-result';
const favCardClass = 'fav-item';
const removeBtnClass = 'remove-btn';
const resetBtnClass = 'reset-btn';
//Colors on search cards
const favMarkedBgColor = '#ffa600';
const favMarkedTextColor = '#fff';
// Lists of cards
let searchList = [];
let favList = [];
//Default page
const defaultImage = './assets/images/img-not-found.png';
const defaultUrl = 'https://api.tvmaze.com/search/shows?q=Neko';

//// FUNCTIONS ////
//LOCAL STORAGE
function savedDefaultPageLocalStorage() {
  const savedDefaultPage = JSON.parse(localStorage.getItem('defaultPage'));
  if (savedDefaultPage === null) {
    queryApiPrintResults(defaultUrl);
  } else {
    searchList = savedDefaultPage;
    reprintSearchList();
  }
}
function savedFavsLocalStorage() {
  const savedFavs = JSON.parse(localStorage.getItem('favList'));
  if (savedFavs !== null) {
    favList = savedFavs;
    reprintFavsUpdtLocStrg();
  }
}

//Generic
function docQuerySelAll(toClass) {
  const classToSelect = `.${toClass}`;
  const elementsToSelect = document.querySelectorAll(classToSelect);
  return elementsToSelect;
}
function addClickListeners(toClass, handleFunction) {
  const elementsToListen = docQuerySelAll(toClass);
  for (const elementToListen of elementsToListen) {
    elementToListen.addEventListener('click', handleFunction);
  }
}
function indexInFav(elementToFind) {
  const idxinFav = favList.findIndex(
    (item) => item.id === parseInt(elementToFind.id)
  );
  return idxinFav;
}
function findInSearchList(elementToFind) {
  const elementFinded = searchList.find(
    (item) => item.id === parseInt(elementToFind.id)
  );
  return elementFinded;
}

//Render and print lists cards
function createNewCard(liClass, liID, title, imgUrl, imgAlt) {
  //set up img
  const newImgElement = document.createElement('img');
  newImgElement.setAttribute('src', imgUrl);
  newImgElement.setAttribute('alt', imgAlt);

  //setup title
  const newTitleElement = document.createElement('p');
  const newTitle = document.createTextNode(title);
  newTitleElement.appendChild(newTitle);

  //join in a container
  const newListElement = document.createElement('li');
  newListElement.setAttribute('class', liClass);
  newListElement.setAttribute('id', liID);
  newListElement.appendChild(newImgElement);
  newListElement.appendChild(newTitleElement);
  return newListElement;
}
function renderSerieCard(item, cardClass) {
  //Create content and attributes for every serie-card
  const serieID = item.id;
  const serieName = item.title;
  const imgUrl = item.image;
  const imgAlt =
    item.image === defaultImage ? 'Serie sin imagen' : `Imagen de ${serieName}`;

  //Create serie-card
  const newCard = createNewCard(cardClass, serieID, serieName, imgUrl, imgAlt);
  return newCard;
}
function printList(whereToPrint, listToPrint, classOfItem) {
  whereToPrint.textContent = '';
  const newUlElement = document.createElement('ul');
  for (const itemOfList of listToPrint) {
    const newCard = renderSerieCard(itemOfList, classOfItem);
    newUlElement.appendChild(newCard);
  }
  whereToPrint.appendChild(newUlElement);
}

//Add buttons on favorite list
function createButton(textInside, buttonClass) {
  const newButton = document.createElement('button');
  const buttonContent = document.createTextNode(textInside);
  newButton.setAttribute('class', buttonClass);
  newButton.appendChild(buttonContent);
  return newButton;
}
function addRemoveFavButtons(toClass) {
  const liFavElements = docQuerySelAll(toClass);
  for (const liFavElement of liFavElements) {
    const removeButton = createButton('x', removeBtnClass);
    liFavElement.appendChild(removeButton);
    addClickListeners(removeBtnClass, handleRemoveFavButton);
  }
}
function addResetFavButton() {
  const resetButton = createButton(
    'Eliminar todos tus favoritos',
    resetBtnClass
  );
  favList.length === 0
    ? resetButton.setAttribute('disabled', 'disabled')
    : resetButton.removeAttribute('disabled');
  favoritesSection.firstElementChild.appendChild(resetButton);
  addClickListeners(resetBtnClass, handleResetButton);
}

//Reprint Lists
function checkAndColorSrchCardsInFavs() {
  const liSearchEls = docQuerySelAll(searchCardClass);
  for (const elementOnList of liSearchEls) {
    const idxInFav = indexInFav(elementOnList);

    if (idxInFav !== -1) {
      elementOnList.style.backgroundColor = favMarkedBgColor;
      elementOnList.style.color = favMarkedTextColor;
    } else {
      elementOnList.style.color = '';
      elementOnList.style.backgroundColor = '';
    }
  }
}
function reprintFavsUpdtLocStrg() {
  printList(favoritesSection, favList, favCardClass);
  addRemoveFavButtons(favCardClass);
  addResetFavButton();
  checkAndColorSrchCardsInFavs();
  localStorage.setItem('favList', JSON.stringify(favList));
}
function reprintSearchList() {
  printList(searchResultsSection, searchList, searchCardClass);
  addClickListeners(searchCardClass, handleClickInSearchCards);
  checkAndColorSrchCardsInFavs();
}

//Search and API functions
function msgError(error) {
  const errMsgContent = document.createTextNode(
    `Ha sucedido un error: ${error}`
  );
  labelMsgError.appendChild(errMsgContent);
}
function urlUserSearch() {
  labelMsgError.textContent = '';
  const userSearch = inputElement.value;
  const finalUrl = `//api.tvmaze.com/search/shows?q=${userSearch}`;
  if (userSearch === '') {
    msgError('¡No has buscado nada!');
  }
  return finalUrl;
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
      reprintSearchList();
    })
    .catch((error) => {
      msgError(error);
    });
}

//Handle functions
function handleClickInSearchCards(event) {
  const cardClicked = event.currentTarget;
  const copyOfCardSelected = findInSearchList(cardClicked);
  const idxInFav = indexInFav(cardClicked);
  idxInFav === -1
    ? favList.push(copyOfCardSelected)
    : favList.splice(idxInFav, 1);
  reprintFavsUpdtLocStrg();
}
function handleRemoveFavButton(event) {
  const buttonClicked = event.currentTarget;
  const favToRemove = buttonClicked.parentElement;
  const idxInFav = indexInFav(favToRemove);
  favList.splice(idxInFav, 1);
  reprintFavsUpdtLocStrg();
}
function handleResetButton() {
  favList = [];
  reprintFavsUpdtLocStrg();
}
function handleClickSearch(event) {
  event.preventDefault();
  queryApiPrintResults(urlUserSearch());
}

btnSearch.addEventListener('click', handleClickSearch);

//Functions to execute on page load
savedDefaultPageLocalStorage();
savedFavsLocalStorage();
