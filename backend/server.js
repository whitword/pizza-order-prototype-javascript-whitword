const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const port = 9001;

app.use(express.static('frontend'));    //static files
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/api/pizza", (req, res) => {
    fs.readFile(path.join(`${__dirname}/pizza.json`), (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error")
        } else {
            console.log("DONE");
            res.send(JSON.parse(data))
        }
    })
})

app.get("/api/order", (req, res) => {
    fs.readFile(path.join(`${__dirname}/order.json`), (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error")
        } else {
            console.log("DONE");
            res.send(JSON.parse(data).orders)
        }
    })
})

app.get("/api/allergens", (req, res) => {
    fs.readFile(path.join(`${__dirname}/allergens.json`), (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error")
        } else {
            console.log("DONE");
            res.send(JSON.parse(data))
        }
    })
})
app.get("/pizza/allergens", (req, res) => {
            res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
    })

app.get("/pizza/list", (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

/*app.get("/order", (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});*/

app.post("/api/order", (req, res) => {
    if (!req.body) { res.status(400).send("Error"); }
    else {
        fs.readFile(path.join(`${__dirname}/order.json`), (err, orderData) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error")
            } else {
                console.log("hello" +orderData)
                let content = req.body;
                // content = content.trim();
                orderData = JSON.parse(orderData);
                orderData.orders.push(content);
                fs.writeFile(`${__dirname}/order.json`, JSON.stringify(orderData, null, 2), err => {
                    if (err) {
                        console.error(err);
                    }
                });
                res.send("DONE");
            }
        })
    }
})

app.listen(port, () => console.log(`http://127.0.0.1:${port}`));



