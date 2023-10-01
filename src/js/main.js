'use strict';

//CONSTANTS
const inputElement = document.querySelector('.js-search-input');
const btnSearch = document.querySelector('.js-search-button');
const labelMsgError = document.querySelector('.js-msg-error');
const favoritesSection = document.querySelector('.js-favorites');
const searchResultsSection = document.querySelector('.js-results-section');

//Default
const defaultImage = './assets/images/img-not-found.png';
const defaultUrl = 'https://api.tvmaze.com/search/shows?q=Neko';

const favMarkedBgColor = '#ffa600';
const favMarkedTextColor = '#fff';

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

// FUNCTIONS
//Generic
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

//Render and print lists cards
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
function printList(whereToPrint, listToPrint, classOfItem) {
  whereToPrint.textContent = '';
  const newUlElement = document.createElement('ul');
  for (const itemOfList of listToPrint) {
    newUlElement.appendChild(renderSerieCard(itemOfList, classOfItem));
  }
  whereToPrint.appendChild(newUlElement);
}

//Add buttons on favorites lists
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
//Update Lists
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

// API functions
function msgError(error) {
  const errMsgContent = document.createTextNode(
    `Ha sucedido un error: ${error}`
  );
  labelMsgError.appendChild(errMsgContent);
}
function urlUserSearch() {
  const userSearch = inputElement.value;
  labelMsgError.textContent = '';
  if (userSearch === '') {
    msgError('¡No has buscado nada!');
  }
  const finalUrl = `//api.tvmaze.com/search/shows?q=${userSearch}`;
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
      updateSearchList();
    })
    .catch((error) => {
      msgError(error);
    });
}

// Handle functions
function handleClickInSearchCards(event) {
  const cardClicked = event.currentTarget;
  const copyOfCardSelected = findInSearchList(cardClicked);
  const idxInFav = indexInFav(cardClicked);
  idxInFav === -1
    ? favList.push(copyOfCardSelected)
    : favList.splice(idxInFav, 1);

  updateFavsAndLS();
}
function handleDeleteFavButton(event) {
  const buttonClicked = event.currentTarget;
  const favToDelete = buttonClicked.parentElement;
  const idxInFav = indexInFav(favToDelete);
  favList.splice(idxInFav, 1);
  updateFavsAndLS();
}
function handleResetButton() {
  favList = [];
  updateFavsAndLS();
}
function handleClickSearch(event) {
  event.preventDefault();
  queryApiPrintResults(urlUserSearch());
}

btnSearch.addEventListener('click', handleClickSearch);
