/*
Cette fonction fait une reqûete Ajax sur les films triés par score.
Lorsque la requête est effectuée, deux fonctions sont appelées : 
    - getTheBestMovieDetails
    - getSevenNextBestMoviesURL
*/
$(document).ready(function(){
    $.ajax({
        url: "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score",
        method: "GET",
        datatype: "json",
    })
    .done(function(response){
        let theBestMovie = response.results[0];
        let theBestMovieUrl = theBestMovie.url;
        getTheBestMovieDetails(theBestMovieUrl);
        getBestMoviesPage2(response);
    })
    .fail(function(error){
        alert("La requête s'est terminée en échec.");
    });
});

/*
Cette fonction fait une requête Ajax sur le film ayant le score le plus élevé.
Lorsque la requête est effectuée, la fonction createTheBestFilmButton est appelée.
*/
function getTheBestMovieDetails(url){
    $.ajax({
        url: url,
        method: "GET",
        datatype:"json",
    })
    .done(function(response){
        createTheBestFilmButton(response);
    })
    .fail(function(error){
        alert("La requête s'est terminée en échec.");
    });
};

/*
Cette fonction permet de créer un bouton cliquable pour le film ayant le score le plus élevé.
*/
function createTheBestFilmButton(response){
    let button = document.createElement("button");
    let img = document.createElement("img");
    img.src = response.image_url;
    img.alt = "Image de film.";
    let style = "background: url(" + img.src + ")";
    button.classList.add("button")
    button.setAttribute('style', style);
    button.addEventListener("click", function(){
        createModal()
        getMovieDetails(response.url);
    });
    let myContent = '<h1>' + response.title + '</h1>' +
                    '<p>' + response.description + '</p>';
    let writableContent = document.createElement("div");
    $(writableContent).append(myContent);
    button.appendChild(writableContent);
    $("#theBestMovie").append(button);
};

/*
Cette fonction permet de faire une requête Ajax sur la deuxième page des films ayant le plus haut score.
*/
function getBestMoviesPage2(bestMoviesPage1){
    $.ajax({
        url: bestMoviesPage1.next,
        method: "GET",
        datatype:"json",
    })
    .done(function(bestMoviesPage2){
        getSevenNextBestMoviesURL(bestMoviesPage1, bestMoviesPage2)    
    })
    .fail(function(error){
        alert("La requête s'est terminée en échec.");
    });
};

/*
Cette fonction permet de récupérer les adresses url des sept prochains films ayant un plus haut score
ainsi que l'adresse url de leurs images respectives.
*/
function getSevenNextBestMoviesURL(bestMoviesPage1, bestMoviesPage2){
    let sevenNextBestMoviesUrl = []
    let sevenNextBestMoviesImageUrl = []
    for (let i=1; i<=4; i++){
        sevenNextBestMoviesUrl.push(bestMoviesPage1.results[i].url);
        sevenNextBestMoviesImageUrl.push(bestMoviesPage1.results[i].image_url);
    };
    for (let i=0; i<=3; i++){
        sevenNextBestMoviesUrl.push(bestMoviesPage2.results[i].url);
        sevenNextBestMoviesImageUrl.push(bestMoviesPage2.results[i].image_url);
    };
    addSevenButtons("byScore-Movies", sevenNextBestMoviesImageUrl, sevenNextBestMoviesUrl);
};

/*
Cette fonction permet de créer sept boutons.
Arg :
    nameOfDiv : nom de la div dans laquelle doivent être créé les boutons.
    imagesUrl : table contenant des adresses url d'images de films.
    detailedUrl : table contenant les adresses url de fiches détaillées de films.

Lorsque que l'on clique sur un bouton, deux fonctions sont appelées : 
    - createModal()
    - getMovieDetails()
*/
function addSevenButtons(nameOfDiv, imagesUrl, detailedUrl){
    for (let i=0; i<=6; i++){
        let button = document.createElement("button");
        let img = document.createElement("img");
        img.src = imagesUrl[i];
        img.alt = "Image de film.";
        let style = "background: url(" + img.src + ")";
        button.classList.add("button")
        button.setAttribute('style', style);
        button.addEventListener("click", function(){
            createModal()
            getMovieDetails(detailedUrl[i]);
        });
        document.querySelector("#" + nameOfDiv).appendChild(button);
    };
};

/*
Cette fonction permet d'afficher et fermer une fenêtre modale.
*/
function createModal(){
    let modalWindow = document.getElementById("myModal");
        modalWindow.style.display = "block";
        let myModalContent = document.getElementById("myModalContent");
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function(){
            modalWindow.style.display = "none";
            myModalContent.replaceChildren();
        };
};

/*
Cette fonction permet de faire une requête Ajax sur une fiche détaillée de film.
*/
function getMovieDetails(detailedUrl){
    $.ajax({
        url: detailedUrl,
        method: "GET",
        datatype: "json",
    })
    .done(function(response){
        writeMovieDetailsOnModal(response)
    })
    .fail(function(error){
        alert("La requête s'est terminée en échec.");
    });
};

/*
Cette fonction permet de récupérer les informations détaillées d'un film et de les inscrire sur la fenêtre modale.
*/
function writeMovieDetailsOnModal(response){
    let myContent = '<h1>' + response.title + '</h1>' +
                    '<img alt="Picture of Movie." src=' + response.image_url + '>' +
                    '<p>Genre : ' + response.genres + '</p>' +
                    '<p>Date de sortie : ' + response.year + '</p>' +
                    '<p>Rated : ' + response.rated + '</p>' +
                    '<p>Score Imdb : ' + response.imdb_score + '</p>' +
                    '<p>Réalisateur : ' + response.directors + '</p>' +
                    '<p>Acteurs : ' + response.actors + '</p>' +
                    '<p>Durée : ' + response.duration + ' minutes</p>' +
                    '<p>Pays d\'origine : ' + response.countries + '</p>' +
                    '<p>Résultat au Box Office : ' + '????????' + '</p>' +
                    '<p>Résumé : ' + response.description + '</p>';
    $(myModalContent).append(myContent);
};

$(document).ready(function(){
    $.ajax({
        url: "http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score",
        method: "GET",
        datatype: "json",
    })
    .done(function(bestComedyMoviesPage1){
        getMovies(bestComedyMoviesPage1, "byScoreComedy-Movies");
    })
    .fail(function(error){
        alert("La requête s'est terminée en échec.");
    });
});

//a remplacer par getSevenMoviesUrl mais il faut la page 2
function getMovies(urlPage1, divName){
    let sevenMoviesUrl = []
    let sevenMoviesImageUrl = []
    $.ajax({
        url: urlPage1.next,
        method: "GET",
        datatype:"json",
    })
    .done(function(urlPage2){
        for (let movie of urlPage1.results){
            sevenMoviesUrl.push(movie.url);
            sevenMoviesImageUrl.push(movie.image_url);
        };
        for (let i=0; i<=2; i++){
            sevenMoviesUrl.push(urlPage2.results[i].url);
            sevenMoviesImageUrl.push(urlPage2.results[i].image_url);
        };
        addSevenButtons(divName, sevenMoviesImageUrl, sevenMoviesUrl);
    })
    .fail(function(error){
        alert("La requête s'est terminée en échec.");
    });
};

/*
Cette fonction permet de récupérer les adresses url des sept premiers films d'une requête
ainsi que l'adresse url de leurs images respectives.
*/
function getSevenMoviesUrl(urlPage1, urlPage2, divName){
    let sevenMoviesUrl = []
    let sevenMoviesImageUrl = []
    for (let movie of urlPage1.results){
        sevenMoviesUrl.push(movie.url);
        sevenMoviesImageUrl.push(movie.image_url);
    };
    for (let i=0; i<=2; i++){
        sevenMoviesUrl.push(urlPage2.results[i].url);
        sevenMoviesImageUrl.push(urlPage2.results[i].image_url);
    };
    addSevenButtons(divName, sevenMoviesImageUrl, sevenMoviesUrl);
};