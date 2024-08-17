const express = require("express");
const morgan = require("morgan");

const PORT = 8000;
const app = express();
app.use(morgan("tiny"))
app.use(express.json({ urlencoded: true }))

let cart = [];

function generateCartItemId() {
    return parseInt(Math.random() * 100000000)
}

function deleteFromCart(id) {
    cart = cart.filter(item => {
        console.log(item, id);
        return item.id != id
    }
    );
}

app.get("/cart", (req, res) => {
    console.log("getCart length", cart.length);
    res.send(cart);
});

app.post("/cart", (req, res) => {
    const id = generateCartItemId();
    const item = { id, ...req.body }
    console.log("addItemToCart", item);
    cart.push(item);
    res.send(item);
});

app.delete("/cart/:id", (req, res) => {
    const { id } = req.params;
    console.log("deleteFromCart id:", id)
    deleteFromCart(id);
    res.sendStatus(202);
});

app.listen(PORT, () => console.log('listening on', PORT));
