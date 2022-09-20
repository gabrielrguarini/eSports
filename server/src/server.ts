import express from "express";

const app = express();

app.get("/ads", (req, res) => {
    return res.send("Acessou ads");
});

app.listen(3333);
