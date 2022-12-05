const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const app = express();

const allergensList = path.join(`${__dirname}/allergens.json`);

const port = 9001;

app.get("/", (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/api/pizza", (req, res) => {

})

app.get("/api/allergens", async (req, res) => {
    const list = await fs.readFile(allergensList)

    res.send(JSON.parse(list))
})

app.get("/pizza/list", (req, res) => {

})







app.listen(port, () => console.log(`http://127.0.0.1:${port}`));