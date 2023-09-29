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
      ulSearchElement.innerHTML = '';

      for (const serie of series) {
        const serieName = serie.show.name;
        let urlImg = '';
        let altImg = '';

        if (serie.show.image === null) {
          urlImg = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
          altImg = 'Sin imagen';
        } else {
          urlImg = serie.show.image.medium;
          altImg = `Imagen de ${serieName}`;
        }
        
        const nuevaSerie = `<li>
            <img src="${urlImg}" alt="${altImg}">
            <p>${serieName}</p>
           </li>`;

        ulSearchElement.innerHTML += nuevaSerie;
      }
    });
}

btnSearch.addEventListener('click', handleClickSearch);
