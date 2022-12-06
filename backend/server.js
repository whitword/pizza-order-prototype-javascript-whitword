const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const port = 9001;

app.use(express.static('frontend')); //static files

app.get("/", (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/api/pizza", (req, res) => {
    fs.readFile(path.join(`${__dirname}/pizza.json`), (err, data) =>{
        if (err) {
            console.log(err);
            res.status(500).send("Error")
        } else {
            console.log("DONE");
            res.send(JSON.parse(data))
        }
    })
})

app.get("/api/allergens", (req, res) => {
    fs.readFile(path.join(`${__dirname}/allergens.json`), (err, data) =>{
        if (err) {
            console.log(err);
            res.status(500).send("Error")
        } else {
            console.log("DONE");
            res.send(JSON.parse(data))
        }
    })
})

app.get("/pizza/list", (req, res) => {

})







app.listen(port, () => console.log(`http://127.0.0.1:${port}`));