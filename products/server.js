const express = require("express");
const morgan = require("morgan");

const PORT = 8000;
const app = express();
app.use(morgan("tiny"))
app.use(express.json({ urlencoded: true }))

const productsArray = [
    {
        "id": 1,
        "title": "towels"
      },
      {
        "id": 2,
        "title": "plates"
      },
      {
        "id": 3,
        "title": "cups"
      },
      {
        "id": 4,
        "title": "cooler"
      }
];


app.get("/products", (req, res) => {
    console.log("getProducts length", productsArray.length)
    res.send(productsArray);
})

app.listen(PORT, () => console.log('listening on', PORT));
