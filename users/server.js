const express = require("express");
const morgan = require("morgan");

const PORT = 8000;
const app = express();
app.use(morgan("tiny"))
app.use(express.json({ urlencoded: true }))

app.get("/users", (req, res) => {
    res.send({ body: "hello from users" });
})

const user1 = {
    "id": 1,
    "username": "keagan",
    "email": "k@g.n"
}

app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    console.log("id", id);
    console.log(("userById", user1));
    res.send(user1);
})

app.listen(PORT, () => console.log('listening on', PORT));
