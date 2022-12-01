# Interface utilisateur pour une application web de streaming vidéo

## Description
Ce programme est une interface utilisateur qui permet de consulter des fiches de films présentant les meilleurs scores Imdb. 

Les données sont extraites d'une API dont la version locale est fournie ici.

Les données sont récupérées à l'aide de requêtes Ajax et sont ensuite affichée sur une interface web. 

## Procédure d'installation

### Import du dépôt Github
Dans un dossier de travail, importez le dépôt github puis, changez de répertoire courant pour vous positionner dans le répertoire contenant l'API. 
```sh
$ git clone https://github.com/lcourdes/Interface-utilisateur-pour-une-application-web-Python.git
$ cd Interface-utilisateur-pour-une-application-web-Python/OCMovies-API-EN-FR
```
N.B. L'API est également disponible [ici](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR).

### Création d'un environnement virtuel
Il est recommandé d'installer un environnement virtuel. Pour ce faire, suivez les instructions 
ci-dessous :

- S'il ne l'est pas déjà, installez le package *virtualenv* :
```sh
$ pip install virtualenv
```

- Créez un environnement de travail et activez-le :
```sh
$ virtualenv env
$ source env/bin/activate
```

### Installation des librairies
Installez les librairies nécessaires au bon fonctionnement du programme à l'aide du fichier requirements.txt :
```sh
$ pip install -r requirements.txt
```

### Création de la base de données
Créez la base de données :
```sh
$ python3 manage.py create_db
```

## Utilisation du programme
Assurez-vous lors de toute utilisation que l'environnement virtuel est activé.

### Lancement du serveur
Démarrez le serveur : 

```sh
$ python3 manage.py runserver
```

### Visualisation de l'interface
Lors du clone du dépôt, un dossier 'Front' a été créé dans le dossier 'Interface-utilisateur-pour-une-application-web-Python'. 
Dans ce dossier Front, le fichier index.html peut être ouvert sur un navigateur internet pour visualiser l'interface. 

![Interface JustStreamIt](README_pictures/JustStreamIt_webPage.png)

### Contenu de l'interface
- La description du film mis en vedette du site peut être consultée en cliquant sur le bouton 'Video'. Ainsi, une fenêtre modale s'ouvre contenant les informations suivantes :
    - Le Titre du film
    - Le genre complet du film
    - Sa date de sortie
    - Son Rated
    - Son score Imdb
    - Son réalisateur
    - La liste des acteurs
    - Sa durée
    - Le pays d’origine
    - Le résultat au Box Office
    - Le résumé du film

- Pour accéder à ces informations pour n'importe quel autre film de la page, il suffit de cliquer sur l'image d'un des films présenté. 

Exemple de fenêtre modale : 

![Fenêtre modale](README_pictures/JustStreamIt_modale.png)

- Pour les catégories présentées sous le film mis en vedette, il est possible de faire défiler les films en cliquant sur la flèche de gauche ou la flèche de droite. Ainsi, sept films sont au total présentés par catégorie. 

Exemple de défilement sur la droite : 

![Fenêtre modale](README_pictures/catégorie_1.png)

![Fenêtre modale](README_pictures/catégorie_1_to_right.png)

## Lien Github

[![github_icone](README_pictures/github.png)](https://github.com/lcourdes/Interface-utilisateur-pour-une-application-web-Python)