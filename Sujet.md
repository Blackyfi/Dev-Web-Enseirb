# Projet Web R&I 2A – Sujet de projet
## Application SeenFlix

---

## 1. Présentation générale

**SeenFlix** est une application web permettant à des utilisateurs inscrits de :

- Créer un compte et se connecter
- Rechercher des films et séries via une API externe
- Consulter les fiches détaillées des œuvres
- Gérer une liste personnelle de favoris
- (Optionnel) Noter et commenter des films/séries

Le projet vise à réaliser **une application complète** :
- un **backend** Node.js / Express, robuste, testé et documenté
- un **frontend** Vue.js consommant cette API.

---

## 2. Organisation pratique

- Travail en **trinômes**
  - Essayez de mixer les spécialités (réseau, génie logiciel, etc.).
- Un **dépôt Git** par groupe (préférence : GitHub).
  - Ajoutez moi en collaborateur : **@Systemofalam**
- Vous développerez **en continu** sur ce dépôt (commits réguliers, branches, PR encouragées).

### Calendrier & encadrement

- Les séances de R&I sont utilisées pour :
  - Concevoir l’architecture
  - Implémenter progressivement backend puis frontend
  - Travailler les tests et la qualité
- Je passerai régulièrement dans les groupes pour :
  - Débloquer des points techniques
  - Discuter de vos choix d’architecture

---

## 3. Modalités d’évaluation

L’évaluation aura lieu **lors de la dernière séance**.

Chaque groupe présentera :

1. **Démonstration fonctionnelle**
   - Parcours utilisateur : inscription, connexion, recherche, gestion des favoris
   - Stabilité de l’application, gestion des erreurs basiques

2. **Présentation technique**
   - Architecture globale (schéma simple frontend / backend / DB / API externe)
   - Organisation du code
   - Gestion de l’authentification et de la persistance
   - Stratégie de tests et de gestion des erreurs

3. **Qualité d’ingénierie**
   - Clarté du README
   - Git (structuration, messages de commit, branches)
   - Documentation d’API (OpenAPI/Swagger)
   - (Bonus) Intégration continue

Une grille de critères sera utilisée (fonctionnel / technique / qualité / présentation).

---

## 4. Objectifs pédagogiques

À l’issue du projet, vous aurez manipulé :

- **Côté serveur (backend)**
  - Conception et implémentation d’une **API REST**
  - Gestion d’une **base de données** (modèle simple mais réel)
  - **Authentification** avec tokens
  - **Validation** robuste des entrées
  - Structuration du code (routes, services, middlewares)
  - Mise en place de **tests unitaires**
  - Documentation d’API avec **OpenAPI/Swagger**

- **Côté client (frontend)**
  - Application **Vue.js**
  - **Routing** (Vue Router)
  - Gestion d’état globale (Vuex ou Pinia)
  - Appels HTTP vers le backend, gestion de la session

- **Pratiques d’ingénierie logicielle**
  - Utilisation de Git de manière structurée
  - Documentation technique (README, openapi.yaml)
  - (Bonus) CI basique (lint, tests, coverage)

Certaines notions (authentification JWT, validation JSON, tests unitaires, etc.) n’ont pas été vues en détail en cours :
du **matériel de départ** (exemples, liens, squelette minimal) vous sera fourni pour vous aider.

---

## 5. Description fonctionnelle de SeenFlix

### 5.1. Rôles & périmètre

**Utilisateur non authentifié :**

- Consulter une page d’accueil
- Rechercher des films/séries via un champ de recherche
- Consulter la fiche d’un film / d’une série

**Utilisateur authentifié :**

- Créer un compte
- Se connecter / se déconnecter
- Gérer une liste personnelle de favoris
- (Optionnel) Associer une note et/ou un commentaire aux œuvres

### 5.2. User stories minimales

- En tant qu’utilisateur, je peux **créer un compte** avec une adresse e-mail et un mot de passe.
- En tant qu’utilisateur, je peux **me connecter** et rester authentifié.
- En tant qu’utilisateur, je peux **rechercher** un film ou une série par mot-clé.
- En tant qu’utilisateur connecté, je peux **ajouter une œuvre à mes favoris**.
- En tant qu’utilisateur connecté, je peux **consulter la liste de mes favoris**.
- En tant qu’utilisateur connecté, je peux **retirer une œuvre de mes favoris**.

### 5.3. Fonctionnalités optionnelles

- Attribuer une **note** (ex. sur 5) aux favoris.
- Ajouter un **commentaire court**.
- Filtrer/trier les favoris (par type, note, date d’ajout).
- Page de profil utilisateur (résumé de l’activité).

---

## 6. Architecture technique globale

### 6.1. Vue d’ensemble

L’architecture minimale attendue :

- **Frontend** : Vue.js
  - SPA avec Vue Router, gestion d’état (Vuex/Pinia)
  - Appels HTTP vers le backend pour auth, favoris, recherche

- **Backend** : Node.js / Express
  - API REST sécurisée
  - Connexion à une base de données
  - Proxy vers une API externe de films/séries (ex. TMDB)
  - Validation, logs, documentation

- **Base de données**
  - SQL ou NoSQL, au choix
  - Persistance des utilisateurs, favoris, éventuellement notes/commentaires

- **API externe**
  - Requêtes vers TMDB (ou équivalent)
  - Mise en cache côté serveur (LRU, TTL ≈ 10 min)

---

## 7. Spécifications backend détaillées

### 7.1. Stack technique

- **Runtime** : Node.js **18+**
- **Framework HTTP** : Express.js
- **Base de données** (au choix) :
  - SQL :
    - Prisma + SQLite (fichier local)
  - NoSQL :
    - Mongoose + MongoDB
- **Authentification** :
  - JWT access token (durée de vie courte)
  - JWT refresh token (durée plus longue)
  - Hash des mots de passe avec **bcrypt**
- **Validation** :
  - Zod, Joi ou Yup pour valider toutes les entrées (body, params, query)
- **API externe** :
  - Proxy vers TMDB (ou API similaire)
  - Cache LRU avec TTL d’environ **10 minutes**
  - Journalisation des HIT/MISS de cache
- **Logs & erreurs** :
  - `morgan` pour les logs HTTP
  - Logger applicatif (pino ou winston)
  - Gestion centralisée des erreurs avec réponses JSON homogènes
- **Documentation** :
  - Fichier `openapi.yaml`
  - Route `/docs` exposant la doc (Swagger UI ou équivalent)

### 7.2. Modèle de données minimal (suggestion)

Vous êtes libres d’adapter, mais un modèle minimal pourrait inclure :

- **User**
  - `id`
  - `email` (unique)
  - `passwordHash`
  - `createdAt`
- **Favorite**
  - `id`
  - `userId` (FK)
  - `tmdbId` (ou équivalent)
  - `type` (`"movie"` | `"tv"`)
  - (optionnel) `rating`
  - (optionnel) `comment`
  - `createdAt`

### 7.3. Endpoints REST minimum

#### Authentification

| Méthode | URL             | Description                            | Statuts principaux         |
|--------:|-----------------|----------------------------------------|----------------------------|
| POST    | `/auth/register`| Inscription d’un nouvel utilisateur    | 201, 400, 409              |
| POST    | `/auth/login`   | Authentification                       | 200, 400, 401              |
| POST    | `/auth/refresh` | Renouvellement de l’access token       | 200, 401                   |

**Contrat minimal :**

- `POST /auth/register`
  - Entrée : `{ email, password }`
  - Contraintes :
    - email unique
    - mot de passe hashé
  - Réponse : informations non sensibles de l’utilisateur (ou message de succès)

- `POST /auth/login`
  - Entrée : `{ email, password }`
  - Réponse : `{ accessToken, refreshToken }`

- `POST /auth/refresh`
  - Entrée : refresh token (dans body ou header, à définir clairement)
  - Réponse : nouveaux tokens (rotation du refresh token attendue)

#### Favoris (routes protégées)

| Méthode | URL                     | Description                            | Statuts principaux        |
|--------:|-------------------------|----------------------------------------|---------------------------|
| GET     | `/me/favorites`         | Liste des favoris de l’utilisateur     | 200, 401                  |
| POST    | `/me/favorites`         | Ajout d’un favori                      | 201, 400, 401, 409        |
| DELETE  | `/me/favorites/:id`     | Suppression d’un favori                | 204, 401, 404             |

**Contrat minimal :**

- `GET /me/favorites`
  - Réponse : liste de favoris pour l’utilisateur authentifié

- `POST /me/favorites`
  - Entrée : `{ tmdbId, type: 'movie' | 'tv' }` (+ champs optionnels)
  - Contrainte : pas de doublon pour un même utilisateur / tmdbId / type
  - Réponse :
    - 201 en cas de succès
    - 409 si le favori existe déjà

- `DELETE /me/favorites/:id`
  - Supprime un favori appartenant à l’utilisateur authentifié
  - 204 en cas de succès

#### Recherche films/séries

| Méthode | URL                  | Description                           | Statuts principaux        |
|--------:|----------------------|---------------------------------------|---------------------------|
| GET     | `/movies/search`     | Recherche de films/séries             | 200, 400, 500             |

- `GET /movies/search?q=…`
  - Paramètre : `q` (query string)
  - Fonctionnement :
    - Appel l’API externe si la requête n’est **pas** en cache
    - Stocke la réponse en cache LRU (clé basée sur `q`)
    - Retourne les résultats
    - Log expliquant si la requête est un **HIT** ou un **MISS** dans le cache

---

## 8. Tests & qualité backend

### 8.1. Tests

- **Framework** : Jest ou Vitest (au choix)
- **Cibles prioritaires** :
  - Service d’authentification
  - Service de gestion des favoris
  - Service d’accès à l’API externe + cache
- **Base de données de test** :
  - SQLite fichier dédié aux tests (Prisma)
    ou
  - `mongodb-memory-server` (Mongoose)
- **Objectif de couverture** :
  - ≥ **50 %** de couverture de code sur le backend
  - Affichage du rapport de couverture (en local et/ou CI)

### 8.2. Gestion des erreurs

- Utiliser un middleware d’erreur Express centralisé
- Toujours répondre en JSON avec une structure cohérente (ex. `{ error: { message, code } }`)
- Gérer au minimum :
  - 400 (requête invalide)
  - 401 (non authentifié)
  - 404 (ressource non trouvée)
  - 500 (erreur serveur)

---

## 9. Spécifications frontend (Vue.js)

### 9.1. Stack

- Vue 3
- Vue Router
- Vuex ou Pinia pour la gestion d’état
- Axios ou fetch pour les appels HTTP

### 9.2. Écrans minimaux

- **Page d’accueil**
  - Présentation courte de SeenFlix
  - Liens vers login / inscription / recherche

- **Page d’inscription / connexion**
  - Formulaire d’inscription (email, password)
  - Formulaire de connexion
  - Affichage des erreurs de validation / auth

- **Page de recherche**
  - Champ de recherche
  - Liste de résultats avec informations clés
  - Bouton “Ajouter aux favoris” (visible si utilisateur connecté)

- **Page “Mes favoris”**
  - Affichage de la liste des favoris de l’utilisateur
  - Bouton pour supprimer un favori
  - (Optionnel) affichage de la note / commentaire

### 9.3. Comportement attendu

- Persistance de la session (stockage des tokens côté client)
- Redirection automatique vers la page de login si une page protégée est consultée sans être connecté
- Messages d’erreur simples mais clairs

---

## 10. Niveaux de priorité / roadmap

Pour tenir compte des différences de niveau entre groupes, les fonctionnalités sont priorisées :

### Niveau 1 – Socle minimal (à faire par tous)

- Inscription / connexion basique (même sans refresh token au début)
- Persistance des utilisateurs et favoris
- Recherche via API externe (sans cache au début si nécessaire)
- Frontend minimal avec parcours :
  - Inscription / connexion
  - Recherche
  - Ajout / suppression de favoris

### Niveau 2 – Qualité et robustesse

- Validation systématique des entrées (Zod/Joi/Yup)
- Gestion centralisée des erreurs
- Mise en place des tests unitaires sur les services principaux
- Mise en cache de la recherche (LRU avec TTL ~10 min)
- Documentation OpenAPI + route `/docs`

### Niveau 3 – Extension & bonus

- Authentification complète avec access + refresh tokens
- Tests d’intégration simples
- CI GitHub/GitLab (lint + tests + coverage)
- Notes et commentaires sur les favoris
- UI améliorée, filtres sur la liste des favoris

---

## 11. Livrables attendus

### 11.1. Code & structure

- Backend :
  - Code structuré dans `src/` (routes, services, middlewares, modèles, etc.)
  - Fichier `openapi.yaml`
  - Route `/docs` exposant la documentation de l’API
  - Dossier `tests/` avec des tests unitaires
- Frontend :
  - Application Vue.js fonctionnelle
  - Utilisation de Vue Router
  - Gestion d’état (Vuex ou Pinia)

### 11.2. Documentation & scripts

- **`README.md`** clair contenant :
  - Prérequis (Node, DB, etc.)
  - Instructions d’installation et de lancement (en ≤ 5 minutes)
  - Description rapide de l’architecture
- **`.env.example`** listant les variables d’environnement nécessaires :
  - Secret JWT, URL DB, clé API externe, etc.
- Scripts :
  - Script de seed de la base
  - Script `db:reset` ou équivalent
  - Fournir un **compte de démo** :
    - `alice@example.org / Passw0rd!`

### 11.3. Preuves & qualité

- Exemple de logs de cache montrant des **HIT/MISS**
- Rapport de couverture de tests (≥ 50 % recommandé)
- (Bonus) Fichier de configuration CI (GitHub Actions ou GitLab CI)

L’objectif n’est pas que tout soit parfait, mais que vous :

- fassiez des **choix argumentés**,
- maitrisiez les **bases** de l’architecture web moderne,
- soyez capables d’**expliquer** ce que vous avez fait.

Bon projet, et bienvenue dans l’univers de SeenFlix !

