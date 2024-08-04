import { config } from "./dbconfig.js";
import express from "express";
import cors from "cors";
import pkg from "pg";

const { Client } = pkg;

const app = express();
const PORT = 8000;

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/about", (req, res) => {
    res.send("About route 🎉 ");
});

app.get("/artistas", async (req, res) => {
    const client = new Client(config);
    await client.connect();
    let result = await client.query("SELECT * FROM artistas");
    await client.end();
    console.log(result.rows);
    res.send(result.rows);
});

app.get("/albumes", async (req, res) => {
    const client = new Client(config);
    await client.connect();
    let result = await client.query(
        `SELECT 
            albumes.*, 
            artistas.nombre AS nombre_artista 
        FROM albumes
        INNER JOIN artistas ON albumes.artista = artistas.id`
    );
    await client.end();
    console.log(result.rows);
    res.send(result.rows);
});

app.get("/canciones", async (req, res) => {
    const client = new Client(config);
    await client.connect();
    let result = await client.query(
        `SELECT 
            canciones.*, 
            albumes.nombre AS nombre_album, 
            artistas.nombre nombre_artista 
        FROM canciones
        INNER JOIN albumes ON canciones.album = albumes.id
        INNER JOIN artistas ON albumes.artista = artistas.id`
    );
    await client.end();
    console.log(result.rows);
    res.send(result.rows);
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
