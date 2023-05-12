const express = require("express");
const router = express.Router();
const http = require("http").createServer(router);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("offer", (data) => {
    console.log("offer", data);
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    console.log("answer", data);
    socket.broadcast.emit("answer", data);
  });

  socket.on("candidate", (data) => {
    console.log("candidate", data);
    socket.broadcast.emit("candidate", data);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});

module.exports = router;