class Category {
	/* Pour céer une instance de Category, quatre arguments sont nécessaires : 
	    - title = une string qui correspondra au titre de la catégorie qui sera affiché sur la page.
	    - isFeatured = un booléen. true si un film de cette catégorie doit être mis en vedette.
	    - url = une string qui correspond à la requête à effectuer sur l'API.
	    - divName = une string qui correspond à l'une des sous divs de "allCategories" du fichier 
	    html. Cette div peut être : "firstCategory", "secondCategory", "thirdCategory" ou "fourthCategory".*/
	constructor(title, isFeatured, url, divName) {
		this.title = title;
		this.isFeatured = isFeatured;
		this.url = url;
		this.divName = divName;

		this.page1Response = {};
		this.page2Response = {};

		this.sevenMoviesUrl = [];
		this.sevenMoviesImageUrl = [];
		this.featuredMovieDetails = [];
		this.modalMovieDetails = [];
		this.start_process();
	}

	start_process() {
		/*Cette méthode permet de lancer le processus à savoir : 
		    - appeler la méthode addTitleToCategory
		    - appeler la méthode makeFirstRequest*/
		this.addTitleToCategory();
		this.makeFirstRequest();
	}

	addTitleToCategory() {
		/* Cette méthode permet d'inscire le titre de la catégorie 
		dans la div choisie du fichier html.*/
		let title = document.createElement("h1");
		let myTitle = document.createTextNode(this.title);
		title.appendChild(myTitle);
		document.querySelector("#" + this.divName).prepend(title);
	}

	makeFirstRequest() {
		/*Cette méthode permet de lancer la première requête, c'est à dire
		lancer une requête Ajax sur l'adresse url de la première page d'une
		recherche. L'adresse url correspond à l'attribut url l'ors de la 
		création de la catégorie. 
		La réponse de la requête est enregistrée dans this.page1Response.
		Une fois la réponse sauvagardée, la méthode makeSecondRequest est lancée.*/
		fetch(this.url)
			.then(response => response.json())
			.then(data => {
				if (data === {}) {
					alert("La requête s'est terminée en échec.");
				} else {
					this.page1Response = data;
					this.makeSecondRequest();
				}
			})
			.catch(function(error) {
				alert("La requête s'est terminée en échec.");
			});
	}

	makeSecondRequest() {
		/* Cette méthode permet de lancer la seconde requête, c'est à dire
		lancer une requête Ajax sur la deuxième page de la recherche.
		L'adresse url correspond à la clé "next" de this.page1Response.
		La réponse de la requête est enregistrée dans this.page2Response.
		Une fois la réponse sauvagardée, la méthode getSevenMoviesUrlAndImages
		est lancée.*/
		fetch(this.page1Response.next)
			.then(response => response.json())
			.then(data => {
				if (data === {}) {
					alert("La requête s'est terminée en échec.");
				} else {
					this.page2Response = data;
					this.getSevenMoviesUrlAndImages();
				}
			})
			.catch(function(error) {
				alert("La requête s'est terminée en échec.");
			});
	}

	getSevenMoviesUrlAndImages() {
		/* Cette méthode permet de trouver et garder en mémoire les adresses url
		des sept premiers films correspondant à la recherche, ainsi que les adresses 
		url des images de film.
		Ces informations sont gardées dans : this.sevenMoviesUrl et this.sevenMoviesImageUrl.

		Attention si cette catégorie contient le film qui doit être mis en vedette : 
		    - la méthode getFeaturedMovieDetails est lancée
		    - les adresses url et url d'images des films sont ceux des sept films suivant le premier 
		    (le premier sera traité dans getFeaturedMovieDetails)
		*/
		if (this.isFeatured) {
			this.getFeaturedMovieDetails();
			for (let i = 1; i <= 4; i++) {
				this.sevenMoviesUrl.push(this.page1Response.results[i].url);
				this.sevenMoviesImageUrl.push(this.page1Response.results[i].image_url);
			}
			for (let i = 0; i <= 2; i++) {
				this.sevenMoviesUrl.push(this.page2Response.results[i].url);
				this.sevenMoviesImageUrl.push(this.page2Response.results[i].image_url);
			}
		} else {
			for (let movie of this.page1Response.results) {
				this.sevenMoviesUrl.push(movie.url);
				this.sevenMoviesImageUrl.push(movie.image_url);
			}
			for (let i = 0; i <= 1; i++) {
				this.sevenMoviesUrl.push(this.page2Response.results[i].url);
				this.sevenMoviesImageUrl.push(this.page2Response.results[i].image_url);
			}
		}
		this.addFourButtons();
	}

	getFeaturedMovieDetails() {
		/* Cette méthode permet de lancer une requête sur le film qui doit être mis en vedette
		(c'est-à-dire le premier résultat de la recherche).
		Les informations recueillies sont stockées dans this.featuredMovieDetails
		La méthode createFeaturedMovieButton est lancée.
		*/
		fetch(this.page1Response.results[0].url)
			.then(response => response.json())
			.then(data => {
				if (data === {}) {
					alert("La requête s'est terminée en échec.");
				} else {
					this.featuredMovieDetails = data;
					this.createFeaturedMovieButton();
					this.writeInFeaturedMovie();
				}
			})
			.catch(function(error) {
				alert("La requête s'est terminée en échec.");
			});
	}

	createFeaturedMovieButton() {
		/* Cette méthode permet de créer un bouton pour le film mis en vedette. Ce bouton
		est créé dans une sous div intitulée featuredMovie-TextBlock.
		Si l'on clique sur le bouton : les fonctions showModal et writeMovieDetailsOnModal
		sont appelées.
		*/
		let divFeaturedMovieTextBlock = document.createElement("div");
		divFeaturedMovieTextBlock.id = "featuredMovie-TextBlock"
		document.querySelector("#featuredMovie").appendChild(divFeaturedMovieTextBlock);
		let button = document.createElement("img");
		button.src = "pictures/bouton_play.png";
		button.alt = "Bouton Play.";
		button.addEventListener("click", () => {
			showModal();
			writeMovieDetailsOnModal(this.featuredMovieDetails);
		});
		document.querySelector("#featuredMovie-TextBlock").appendChild(button);
	}

	writeInFeaturedMovie() {
		/* Cette méthode permet d'ajouter le titre et la description du film mis en vedette dans 
		la sous div featuredMovie-TextBlock.
		Une seconde sous-div featuredMovie-ImageBlock est créée dans laquelle l'image du film mis 
		en vedette est ajoutéée.
		*/
		let divFeaturedMovieImageBlock = document.createElement("div");
		divFeaturedMovieImageBlock.id = "featuredMovie-ImageBlock"
		document.querySelector("#featuredMovie").appendChild(divFeaturedMovieImageBlock);
		let img = document.createElement("img");
		img.src = this.featuredMovieDetails.image_url;
		img.alt = "Image de film.";
		document.querySelector("#featuredMovie-ImageBlock").appendChild(img);
		document.getElementById("featuredMovie-Background").style.backgroundImage = "url(" + this.featuredMovieDetails.image_url + ")";

		let title = document.createElement("h1");
		let myTitle = document.createTextNode(this.featuredMovieDetails.title);
		title.appendChild(myTitle);
		document.querySelector("#featuredMovie-TextBlock").prepend(title);

		let description = document.createElement("p");
		let mydescription = document.createTextNode(this.featuredMovieDetails.description);
		description.appendChild(mydescription);
		document.querySelector("#featuredMovie-TextBlock").appendChild(description);
	}

	addFourButtons() {
		/* Cette méthode permet de créer sept boutons qui sont ajoutés à la div choisie dans 
		le fichier html.
		Sur chaque bouton s'affiche l'image d'un film de la table this.sevenMoviesImageUrl.
		Lorsque l'on clique sur un de ces boutons, les fonctions showModal et getMovieDetails
		sont appelées.
		Les méthodes moveToLeftLeftButton et MoveToRightButton sont par défaut appelées. 
		*/
		for (let i = 0; i <= 3; i++) {
			let button = document.createElement("button");
			let img = document.createElement("img");
			img.src = this.sevenMoviesImageUrl[i];
			img.alt = "Image de film.";
			let style = "background: url(" + img.src + ")";
			button.classList.add("button");
			button.setAttribute('style', style);
			button.addEventListener("click", () => {
				showModal();
				this.getMovieDetails(this.sevenMoviesUrl[i]);
			});
			document.querySelector("#" + this.divName + "-Movies").appendChild(button);
		}
		this.moveToLeftButton();
		this.moveToRightButton();
	}

	moveToLeftButton() {
		/* Cette méthode permet de créer un bouton sur la gauche du caroussel. 
		Lorsque l'on clique sur ce bouton la méthode moveToLeft, puis addFourButtons sont appelées. 
		*/
		let button = document.createElement("img");
		button.src = "pictures/left_arrow.png";
		button.alt = "Left arrow.";
		button.classList.add("arrow");
		button.addEventListener("click", () => {
			this.moveToLeft();
			this.addFourButtons();
		});
		document.querySelector("#" + this.divName + "-Movies").prepend(button);
	}

	moveToRightButton() {
		/* Cette méthode permet de créer un bouton sur la droite du caroussel. 
		Lorsque l'on clique sur ce bouton la méthode moveToLeft, puis addFourButtons sont appelées. 
		*/
		let button = document.createElement("img");
		button.src = "pictures/right_arrow.png";
		button.alt = "Right arrow.";
		button.classList.add("arrow");
		button.addEventListener("click", () => {
			this.moveToRight();
			this.addFourButtons();
		});
		document.querySelector("#" + this.divName + "-Movies").appendChild(button);
	}

	moveToLeft() {
		/* Cette méthode permet de remanier l'ordre des listes this.sevenMoviesUrl et
		this.sevenMoviesImageUrl. 
		Le premier élément de la liste est enlevé puis et ajouté à la fin. */
		document.querySelector("#" + this.divName + "-Movies").replaceChildren();
		let firstMovieUrl = this.sevenMoviesUrl.shift();
		this.sevenMoviesUrl.push(firstMovieUrl);
		let firstMovieImageUrl = this.sevenMoviesImageUrl.shift();
		this.sevenMoviesImageUrl.push(firstMovieImageUrl);
	}

	moveToRight() {
		/* Cette méthode permet de remanier l'ordre des listes this.sevenMoviesUrl et
		this.sevenMoviesImageUrl. 
		Le dernier élément de la liste est enlevé puis et ajouté au début. */
		document.querySelector("#" + this.divName + "-Movies").replaceChildren();
		let lastMovieUrl = this.sevenMoviesUrl.pop();
		this.sevenMoviesUrl.unshift(lastMovieUrl);
		let lastMovieImageUrl = this.sevenMoviesImageUrl.pop();
		this.sevenMoviesImageUrl.unshift(lastMovieImageUrl);
	}

	getMovieDetails(url) {
		/* Cette méthode permet de faire une requête Ajax sur l'url menant à la fiche détaillée
		d'un film.
		Les informations retournées sont sauvegardées dans this.modalMovieDetail.
		La fonction writeMovieDetailsOnModal est appelée.
		*/
		fetch(url)
			.then(response => response.json())
			.then(data => {
				if (data === {}) {
					alert("La requête s'est terminée en échec.");
				} else {
					this.modalMovieDetail = data;
					writeMovieDetailsOnModal(this.modalMovieDetail);
				}
			})
			.catch(function(error) {
				alert("La requête s'est terminée en échec.");
			});
	}
}

function writeMovieDetailsOnModal(response) {
    /* Cette fonction permet d'inscrire dans la div ayant pour id "myModalContent" des 
    informations pour un film donné. 
    Les informations proviennent soit de this.modalMovieDetail soit de this.featuredMovieDetails.*/
	let myModal = document.querySelector("#myModalContent")
	
	let title = document.createElement("h1");
	let myTitle = document.createTextNode(response.title);
	title.appendChild(myTitle);
	myModal.appendChild(title);

	let image = document.createElement("img");
	image.src = response.image_url;
	image.alt = "Picture of Movie.";
	myModal.appendChild(image);

	let gender = document.createElement("p");
	let movieGender = document.createTextNode('Genre : ' + response.genres);
	gender.appendChild(movieGender);
	myModal.appendChild(gender);

	let date = document.createElement("p");
	let movieDate = document.createTextNode('Date de sortie : ' + response.year);
	date.appendChild(movieDate);
	myModal.appendChild(date);

	let rated = document.createElement("p");
	let movieRated = document.createTextNode('Rated : ' + response.rated);
	rated.appendChild(movieRated);
	myModal.appendChild(rated);

	let score = document.createElement("p");
	let movieScore = document.createTextNode('Score Imdb : ' + response.imdb_score);
	score.appendChild(movieScore);
	myModal.appendChild(score);

	let directors = document.createElement("p");
	let movieDirectors = document.createTextNode('Réalisateurs : ' + response.directors);
	directors.appendChild(movieDirectors);
	myModal.appendChild(directors);
	
	let actors = document.createElement("p");
	let movieActors = document.createTextNode('Acteurs ' + response.actors);
	directors.appendChild(movieActors);
	myModal.appendChild(actors);

	let duration = document.createElement("p");
	let movieDuration = document.createTextNode('Durée : ' +response.duration + ' minutes');
	duration.appendChild(movieDuration);
	myModal.appendChild(duration);

	let countries = document.createElement("p");
	let movieCountries = document.createTextNode('Pays d\'origine : ' + response.countries);
	countries.appendChild(movieCountries);
	myModal.appendChild(countries);

	let worldwideGrossIncome = document.createElement("p");
	let movieWorldwideGrossIncome = document.createTextNode('Résultat au Box Office : ' + response.worldwide_gross_income);
	worldwideGrossIncome.appendChild(movieWorldwideGrossIncome);
	myModal.appendChild(worldwideGrossIncome);

	let description = document.createElement("p");
	let movieDescription = document.createTextNode('Résumé : ' + response.description);
	description.appendChild(movieDescription);
	myModal.appendChild(description);
}

function showModal() {
    /* Cette fonction permet de faire en sorte que la div myModal soit affichée. 
    Pour plus de détails, voir dans le fichier css la partie relative à la modale.
    */
    let modalWindow = document.getElementById("myModal");
    modalWindow.style.display = "block";
    let myModalContent = document.getElementById("myModalContent");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modalWindow.style.display = "none";
        myModalContent.replaceChildren();
    };
}

const moviesByScoreUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
const moviesComedyByScoreUrl = "http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score"
const movies1960ByScoreUrl = "http://localhost:8000/api/v1/titles/?year=&min_year=1960&max_year=1969&sort_by=-imdb_score"
const moviesFrenchByScoreUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&country=france"

new Category("Les films les mieux notés", isFeatured = true, moviesByScoreUrl, "firstCategory");
new Category("Les meilleures comédies", isFeatured = false, moviesComedyByScoreUrl, "secondCategory");
new Category("Les meilleurs films des années 60", isFeatured = false, movies1960ByScoreUrl, "thirdCategory");
new Category("Les meilleurs films d'origine française", isFeatured = false, moviesFrenchByScoreUrl, "fourthCategory");