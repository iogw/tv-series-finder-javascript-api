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
      console.log(series);
      const ulSearchElement = document.querySelector('.js-search-list');
      ulSearchElement.innerHTML = '';
      for (const serie of series) {
        console.log(serie); //info neta del api
        console.log(serie.show.name);
        console.log(serie.show.image.medium);
        // por cada serie de series se crea un li que contiene la imagen y el título
        // Si no hay imagen se tiene que ver esta: https://via.placeholder.com/210x295/ffffff/666666/?text=TV
        const enlaceImagen = serie.show.image.medium;
        console.log(enlaceImagen);
        const nombreSerie = serie.show.name;
        console.log(nombreSerie);

        const nuevaSerie = `<li>
            <img src="${enlaceImagen}" alt="Imagen de ${nombreSerie}">
            <p>${nombreSerie}</p>
           </li>`;
        console.log(nuevaSerie);


        ulSearchElement.innerHTML += nuevaSerie;
      }
    });
}

btnSearch.addEventListener('click', handleClickSearch);
