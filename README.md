# La Flamme Limouxine - Site Web

Ce repository contient le site web de **La Flamme Limouxine**, développé en **React**. Le site récupère dynamiquement les données depuis un backend développé avec **Strapi** [ici](https://github.com/tristannavez/laflammelimouxine_website_backend).

## Table des matières

- [Technologies](#technologies)
- [Installation](#installation)
- [Scripts disponibles](#scripts-disponibles)
- [Configuration](#configuration)
- [Déploiement](#déploiement)

## Technologies

- **React** : Bibliothèque JavaScript pour construire l'interface utilisateur.
- **React Router** : Gestion de la navigation et du routage.
- **Bootstrap** : Framework CSS pour un design responsive.
- **Sass** : Préprocesseur CSS pour une gestion avancée des styles.
- **EmailJS** : Envoi d'emails via le formulaire de contact.
- **Autres dépendances** :
    - `html-react-parser`
    - `react-cart-lightgallery`
    - `react-modal-image`
    - `react-ripples`
    - `react-slick`
    - `react-water-wave`
    - `swiper`
    - ...et bien d'autres (voir le fichier `package.json` pour la liste complète).

- **Backend** : API développée avec [Strapi](https://strapi.io) (repository séparé).

## Installation

1. **Cloner le repository**

2. **Installer les dépendances**

   ```bash
   npm install
   ```

## Scripts disponibles

- **Développement**

  Lance l'application en mode développement avec rechargement automatique :

  ```bash
  npm run develop
  ```

- **Build**

  Compile l'application pour la production dans le dossier `build` :

  ```bash
  npm run build
  ```

- **Start**

  Démarre un serveur de production statique à partir du dossier `build` (utilise `serve`) :

  ```bash
  npm start
  ```

- **Heroku Postbuild**

  Script utilisé par Heroku pour construire l'application après le déploiement :

  ```bash
  npm run heroku-postbuild
  ```

## Configuration

Pour que le site fonctionne correctement, assure-toi de :

- Avoir déployé et configuré le backend Strapi.
- Ajouter un fichier `.env` à la racine du projet avec les variables suivantes :

  ```env
  REACT_APP_EMAILJS_PUBLIC_KEY=yourPublicKeyEmailJs
  REACT_APP_EMAILJS_SERVICE_ID=yourServiceIdEmailJs
  REACT_APP_EMAILJS_TEMPLATE_ID=yourTemplateIdEmailJs
  REACT_APP_STRAPI_URL=yourBackendStrapiUrl
  ```

## Déploiement

Ce projet est prêt à être déployé sur **Heroku**.
Pour Heroku, le script `heroku-postbuild` se charge de compiler l'application après le déploiement.
