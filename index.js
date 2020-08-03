const http = require("http");
const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

const socketio = require("socket.io");
const io = socketio(server);
const {
  generateNewRoom,
  joinRoom,
  leaveRoom,
  getUser,
  roomExists,
  getRoomUsers,
} = require("./socket-io");

io.on("connection", (socket) => {
  socket.on("create_room", () => {
    const new_room_id = generateNewRoom();
    socket.emit("room_id_generated", new_room_id);
  });

  socket.on("join_room", (room_id, name) => {
    joinRoom(room_id, name, socket.id);
    socket.join(room_id);
    socket.to(room_id).broadcast.emit("recieve_msg", {
      name: "Bot",
      msg: `${name} has connected!`,
    });
    const users_in_room = getRoomUsers(room_id);
    io.to(room_id).emit("room_users", users_in_room);
  });

  socket.on("send_msg", (msg) => {
    const room_id = Object.keys(socket.rooms)[1];
    const user = getUser(room_id, socket.id)[0];
    console.log(user);
    io.to(room_id).emit("recieve_msg", {
      name: user.name,
      msg,
    });
  });

  socket.on("disconnecting", () => {
    const room_id = Object.keys(socket.rooms)[1];
    const user = leaveRoom(room_id, socket.id);
    if (user) {
      socket
        .to(room_id)
        .emit("recieve_msg", { name: "Bot", msg: `${user[0].name} has left!` });
    }
  });

  socket.on("check_room_exists", (room_id) => {
    if (roomExists(room_id)) socket.emit("room_exists");
    else socket.emit("room_no_exist");
  });
});

app.use(express.static("client/build"));
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
