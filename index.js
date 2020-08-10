const http = require("http");
const express = require("express");
const path = require("path");
const helmet = require("helmet");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

const socketio = require("socket.io");
const io = socketio(server);
const {
  resetRoom,
  endRound,
  generateNewRoom,
  joinRoom,
  leaveRoom,
  getUser,
  roomExists,
  getRoomUsers,
  Message,
  startGame,
  delete_room,
  checkSpyGuess,
  getQuesPair,
  onNextRoundVote,
  isSpy,
  voteForSpy,
  endGame,
} = require("./socket-io");

io.on("connection", (socket) => {
  socket.on("create_room", (fn) => {
    const new_room_id = generateNewRoom(socket.id);
    fn(new_room_id);
  });

  socket.on("join_room", (room_id, name, fn) => {
    const { success, reason } = joinRoom(room_id, name, socket.id);
    fn(success, reason);
    if (success) {
      socket.join(room_id);
      socket
        .to(room_id)
        .broadcast.emit(
          "recieve_msg",
          Message("Bot", `${name} has connected!`)
        );
      const users_in_room = getRoomUsers(room_id);
      io.to(room_id).emit("room_users", users_in_room);
    }
  });

  socket.on("send_msg", (msg) => {
    const room_id = Object.keys(socket.rooms)[1];
    const user = getUser(room_id, socket.id)[0];
    io.to(room_id).emit("recieve_msg", Message(user.name, msg));
  });

  socket.on("spy_guess", (location, room_id) => {
    const { success, spy, actual_location } = checkSpyGuess(
      location,
      room_id,
      socket.id
    );
    if (success) {
      socket.emit(
        "game_over",
        "You won!",
        `All the agents that were in ${location} has been killed.`,
        1,
        0
      );
      socket
        .to(room_id)
        .broadcast.emit(
          "game_over",
          "Oh no!",
          `All the agents have been killed by the enemy spy ${spy.name}`,
          0,
          0
        );
    } else {
      socket.emit(
        "game_over",
        "Oh No!",
        `All the agents were in ${actual_location}. You have exposed yourself!`,
        0,
        0
      );
      socket
        .to(room_id)
        .broadcast.emit(
          "game_over",
          "You won!",
          `The spy had just bombed the ${location} and exposed himself to be ${spy.name}!`,
          1,
          0
        );
    }
    resetRoom(room_id);
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
      const { user, end_game, reason } = leaveRoom(room_id, socket.id);
      if (user) {
        socket
          .to(room_id)
          .emit("recieve_msg", Message("Bot", `${user[0].name} has left!`));
        const users_in_room = getRoomUsers(room_id);
        io.to(room_id).emit("room_users", users_in_room);
        if (end_game) {
          io.to(room_id).emit("game_over", "Error", reason, 0, 1);
          delete_room(room_id);
        } else {
          socket.emit("game_over", null, null, null, 1);
        }
      }
    }
  };

  socket.on("check_room_exists", (room_id, fn) => {
    if (roomExists(room_id)) fn(true, room_id);
    else fn(false);
  });

  socket.on("next_ques", (room_id, next_round) => {
    if (next_round) {
      io.to(room_id).emit("prompt_next_round");
    } else {
      const { currQues, end } = getQuesPair(room_id, socket.id, next_round);
      if (currQues) {
        io.to(room_id).emit("ques_pair", currQues, end);
      }
    }
  });

  socket.on("next_round", (room_id) => {
    const { currQues, end } = getQuesPair(room_id, socket.id, true);
    if (currQues) {
      nextRound(room_id);
      io.to(room_id).emit("ques_pair", currQues, end);
    }
  });

  socket.on("next_round_vote", (room_id) => {
    onNextRoundVote(room_id);
  });

  socket.on("spy_vote", (room_id, user_id) => {
    voteForSpy(room_id, user_id, socket.id);
  });

  socket.on("end_game", (room_id) => {
    if (isSpy(room_id, socket.id)) onEndGame(room_id);
  });

  const onEndGame = (room_id) => {
    const { spy_won, max_voted_user, spy } = endGame(room_id);
    const users = getRoomUsers(room_id);
    if (spy_won) {
      if (max_voted_user) {
        users.map((user) => {
          if (user.id === spy.id)
            io.to(user.id).emit(
              "game_over",
              "You Won!",
              `Majority of the people voted for ${max_voted_user.name}`,
              1,
              0
            );
          else
            io.to(user.id).emit(
              "game_over",
              "Oh No!",
              `Majority of the people voted for ${max_voted_user.name}, ${spy.name} was the real spy`,
              0,
              0
            );
        });
      } else {
        users.map((user) => {
          if (user.id === spy.id)
            io.to(user.id).emit(
              "game_over",
              "You Won!",
              `None of the people voted for you`,
              1,
              0
            );
          else
            io.to(user.id).emit(
              "game_over",
              "Oh No!",
              `None voted for the real spy ${spy.name}`,
              0,
              0
            );
        });
      }
    } else {
      users.map((user) => {
        if (user.id === spy.id)
          io.to(user.id).emit(
            "game_over",
            "Oh No!",
            `Majority of the agents voted for you and you have been exposed`,
            0,
            0
          );
        else
          io.to(user.id).emit(
            "game_over",
            "You Won!",
            `Majority of the agents voted for the real spy ${spy.name}`,
            1,
            0
          );
      });
    }
  };

  const nextRound = (room_id) => {
    const { end_game, round, spy_won, max_voted_user, spy } = endRound(room_id);
    if (end_game) {
      const users = getRoomUsers(room_id);
      if (spy_won) {
        if (max_voted_user) {
          users.map((user) => {
            if (user.id === spy.id)
              io.to(user.id).emit(
                "game_over",
                "You Won!",
                `Majority of the people voted for ${max_voted_user.name}`,
                1,
                0
              );
            else
              io.to(user.id).emit(
                "game_over",
                "Oh No!",
                `Majority of the people voted for ${max_voted_user.name}, ${spy.name} was the real spy`,
                0,
                0
              );
          });
        } else {
          users.map((user) => {
            if (user.id === spy.id)
              io.to(user.id).emit(
                "game_over",
                "You Won!",
                `None of the people voted for you`,
                1,
                0
              );
            else
              io.to(user.id).emit(
                "game_over",
                "Oh No!",
                `None voted for the real spy ${spy.name}`,
                0,
                0
              );
          });
        }
      } else {
        users.map((user) => {
          if (user.id === spy.id)
            io.to(user.id).emit(
              "game_over",
              "Oh No!",
              `Majority of the agents voted for you and you have been exposed`,
              0,
              0
            );
          else
            io.to(user.id).emit(
              "game_over",
              "You Won!",
              `Majority of the agents voted for the real spy ${spy.name}`,
              1,
              0
            );
        });
      }
    }
    if (!end_game) io.to(room_id).emit("start_next_round", round);
  };

  socket.on("start_game", () => {
    const room_id = Object.keys(socket.rooms)[1];
    const { time, users, spy, location, all_locations, currQues } = startGame(
      room_id,
      socket.id
    );
    if (time)
      for (user of users)
        if (user.id === spy.id)
          io.to(user.id).emit("game_started", {
            time,
            spy: true,
            location: null,
            all_locations,
            currQues,
          });
        else
          io.to(user.id).emit("game_started", {
            time,
            spy: false,
            location,
            all_locations: null,
            currQues,
          });
  });
});

app.use(helmet());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "client", "build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
