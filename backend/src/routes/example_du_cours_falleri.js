'use strict;';

import express from 'express';
import { faker } from '@faker-js/faker';
import cors from 'cors';
import bodyParser from 'body-parser';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

sqlite3.verbose();

// Initialisation serveur
const app = express();
// Sécurité
app.use(cors());
// Configuration parser body
app.use(bodyParser.json());

// Configuration Faker
faker.locale = 'fr';

/* Routes Express */
// Route /
// TODO
app.get("/", (req, res) => {
    console.log("GET / , le serveur répond")
    return res.status(200).send("Le serveur répond");
});

// Récupération de tous les paris avec SQLite
// TODO
app.get("/paris", async (req, res) => {
    console.log("GET /paris , récupérer tous les paris")
    const query = await db.all('SELECT * FROM horse_bet ORDER BY date DESC');
    return res.status(200).send(query);
});

// Ajout d'un pari avec SQLite
// TODO
app.post("/paris", async (req, res) => { // Dans req on a les data de la requete qu'on recoit
    console.log("POST /paris , crée un paris") // ON recupere dans le body de la requete les data
    await db.run('INSERT INTO horse_bet (author, horse, date) VALUES (?, ?, ?)', req.body.author, req.body.horse, new Date().toISOString());
    return res.status(201).send("Pari créé");
});

// Génération de 10 paris aléatoires avec SQLite
// TODO
app.post("/paris/generate", async (req, res) => {
    console.log("POST /paris/generate , 10 Paris générés aléatoirement")
    var randomName = []
    var randomNumber = []
    
    for(let i = 0; i < 10; i++) {
        randomName[i] = faker.person.firstName();
        randomNumber[i] = faker.number.int({min: 1, max: 10});
        await db.run('INSERT INTO horse_bet (author, horse, date) VALUES (?, ?, ?)', randomName[i], randomNumber[i], new Date().toISOString());
    }

    console.log("Created fake names : " + randomName)
    console.log("Created fake numbers : " + randomNumber)
    return res.status(201).send("10 Paris générés aléatoirement");
});

// Suppression d'un pari avec SQLite
// TODO
app.delete("/paris/:id", async (req, res) => {
    console.log("DELETE /paris/:id , le serveur supprime un pari")
    await db.run('DELETE FROM horse_bet WHERE id = ?', req.params.id);
    return res.status(200).send("Pari supprimé");
});


/* Partie SQLite */
let db;
async function initDatabase() {
    // Connexion à la base de donnée avec SQLite
    db = await open({ filename: 'database-phe.db', driver: sqlite3.Database });

    // Initialisation de la table paris
    // TODO
    db.exec(`
        DROP TABLE horse_bet
    `);
    db.exec(`
        CREATE TABLE IF NOT EXISTS horse_bet(
            id INTEGER PRIMARY KEY,
            author TEXT,
            horse INTEGER,
            date TEXT
        )
    `);

    console.log('Base de donnée initialisée');
}


/* Démarrage BDD et serveur */
initDatabase().then(() =>
    app.listen(3000, () =>
        console.log('Serveur phe-backend démarré !'),
    ),
);
