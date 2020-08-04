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
  Message,
  startGame,
} = require("./socket-io");

io.on("connection", (socket) => {
  socket.on("create_room", () => {
    const new_room_id = generateNewRoom(socket.id);
    socket.emit("room_id_generated", new_room_id);
  });

  socket.on("join_room", (room_id, name) => {
    joinRoom(room_id, name, socket.id);
    socket.join(room_id);
    socket
      .to(room_id)
      .broadcast.emit("recieve_msg", Message("Bot", `${name} has connected!`));
    const users_in_room = getRoomUsers(room_id);
    io.to(room_id).emit("room_users", users_in_room);
  });

  socket.on("send_msg", (msg) => {
    const room_id = Object.keys(socket.rooms)[1];
    const user = getUser(room_id, socket.id)[0];
    io.to(room_id).emit("recieve_msg", Message(user.name, msg));
  });

  socket.on("leave_room", () => {
    leave_room();
  });

  socket.on("disconnecting", () => {
    leave_room();
  });

  const leave_room = () => {
    const room_id = Object.keys(socket.rooms)[1];
    if (room_id) {
      socket.leave(room_id);
      const user = leaveRoom(room_id, socket.id);
      if (user) {
        socket
          .to(room_id)
          .emit("recieve_msg", Message("Bot", `${user[0].name} has left!`));
        const users_in_room = getRoomUsers(room_id);
        io.to(room_id).emit("room_users", users_in_room);
      }
    }
  };

  socket.on("check_room_exists", (room_id) => {
    if (roomExists(room_id)) socket.emit("room_exists", room_id);
    else socket.emit("room_no_exist");
  });

  socket.on("start_game", () => {
    const room_id = Object.keys(socket.rooms)[1];
    const time = startGame(room_id, socket.id);
    if (time) io.to(room_id).emit("game_started", time);
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
