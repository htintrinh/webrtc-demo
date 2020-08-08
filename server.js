const express = require('express');
const app = express();
const server = require('http').Server(app);

const PORT = 3000;
app.set("view engine", "ejs");
app.get('/', (req, res) => {
    res.render('room');
});
console.log("Server is listening on " + PORT);
server.listen(PORT);