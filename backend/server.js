const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const port = 9001;

app.get("/", (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});







app.listen(port, () => console.log(`http://127.0.0.1:${port}`));