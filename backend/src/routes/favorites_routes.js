
import express from 'express';
import cors from 'cors';


app.get("/me/favorites", async (req, res) => {
    console.log("GET /me/favorites , récupérer tous les favoris d'un user")
    const query = await db.all('SELECT * FROM horse_bet ORDER BY date DESC');
    return res.status(200).send(query);
});