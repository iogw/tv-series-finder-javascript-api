'use strict';

const inputElement = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-button-search');

function handleClickSearch(event) {
  event.preventDefault();
  const userSearch = inputElement.value;
  const urlSearch = `//api.tvmaze.com/search/shows?q=${userSearch}`;

  fetch(urlSearch)
    .then((response) => response.json())
    .then((series) => {
      const ulSearchElement = document.querySelector('.js-search-list');
      ulSearchElement.textContent = '';

      for (const serie of series) {
        const serieName = serie.show.name;
        const urlImg =
          serie.show.image === null
            ? 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV'
            : serie.show.image.medium;
        const altImg =
          serie.show.image === null
            ? 'Serie sin imagen'
            : `Imagen de ${serieName}`;

        const newImgElement = document.createElement('img');
        newImgElement.setAttribute('src', urlImg);
        newImgElement.setAttribute('alt', altImg);

        const newTitleElement = document.createElement('p');
        const newTitle = document.createTextNode(serieName);
        newTitleElement.appendChild(newTitle);

        const newListElement = document.createElement('li');
        newListElement.appendChild(newImgElement);
        newListElement.appendChild(newTitleElement);

        ulSearchElement.appendChild(newListElement);
      }
    });
}

btnSearch.addEventListener('click', handleClickSearch);
