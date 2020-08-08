const express = require("express");
const app = express();
const server = require("http").Server(app);
const uuid = require("uuid");
const io = require("socket.io")(server);
const peer = require('peer');
const peerServer = peer.ExpressPeerServer(server, {
    debug: true
})

io.on("connection", (socket) => {
  console.log("Socket connect");
  socket.on("disconnect", () => {
    console.log("Socket disconnect");
  });

  socket.emit("message", "Hello");

  socket.on("join-room", (roomId, userId) => {
      console.log("Request to join room: " + roomId, "with userId: " + userId)
      socket.join(roomId);
      socket.to(roomId).broadcast.emit("user-connected", userId);
  })
});

const PORT = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuid.v4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});
console.log("Server is listening on " + PORT);
server.listen(PORT);
