# Descripción del ejercicio

### Buscador de series de TV
Este ejercicio consistía en realizar una aplicación web que te permita buscar series de TV y marcar tus favoritas. Las series favoritas se almacenan en el almacenamiento local del navegador para que puedas acceder a ellas incluso después de recargar la página.

Propuesta gráfica:

![Captura de pantalla de la propuesta inicial](./src/images/screenshot-layout-proposal.png)

Resultado final:

![Captura de pantalla de la aplicación web](./src/images/screenshot-web-app.png)

## Funcionalidades

- Buscar series de TV por título.
- Marcar y desmarcar series como favoritas.
- Listar tus series favoritas en la barra lateral.
- Almacenar tus series favoritas en el almacenamiento local del navegador.
- Borrar favoritos individualmente o todos a la vez.

## Cómo usar la aplicación

1. Ingresa el título de una serie en el campo de búsqueda.
2. Haz clic en el botón "Buscar".
3. Aparecerá una lista de series coincidentes.
4. Haz clic en una serie para marcarla como favorita o desmarcarla si ya es una favorita.
5. Tus series favoritas se mostrarán en la barra lateral.

## Tecnologías utilizadas

- HTML5
- CSS3 (Sass)
- JavaScript
- Almacenamiento local (localStorage)
- [API de TVMaze](https://www.tvmaze.com/api)


## Herramientas utilizadas
- Visual Studio Code
- [Adalab web starter kit](https://github.com/Adalab/adalab-web-starter-kit)

## Cómo arrancar el proyecto

### La primera vez que lo arranques:
> **NOTA:** Necesitas tener instalado [Node JS](https://nodejs.org/)
1. Clona este repositorio en tu ordenador.
2. Instala las dependencias desde tu terminal con el siguiente comando:
```bash
npm install
```
> No te asustes, se creará una carpeta llamada `node_modules\`, son las dependencias.
3. Arranca el proyecto con:
```bash
npm start
```
> Con este comando se creará la carpeta `public\`, donde se encuentran los archivos compilados automáticamente de `src\`

### Cada vez que lo quieras arrancar de nuevo:

- Simplemente abre el repositorio en tu editor de código favorito y ejecuta:
```bash
npm start
```
> Para finalizar la ejecución en terminal prueba con `ctrl+C` 



## Nota de la autora

Gracias por interesarte por mi proyecto, cualquier duda o sugerencia mándame un DM &#129299;

Y si quieres contribuir a este proyecto, ¡no dudes en enviar un pull request!

[Irene García Wodak](https://github.com/irenegwodak)