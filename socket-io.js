const moment = require("moment");

const rooms = {};
const location_list = ["Home", "Spa", "Theatre"];

const User = (name, id, leader) => {
  return {
    name,
    id,
    leader,
  };
};

const Message = (name, msg) => {
  return {
    name,
    msg,
    time: moment().format("h:mm"),
  };
};

const delete_room = (room_id) => {
  if (rooms[room_id]) delete rooms[room_id];
};

const generateNewRoom = (user_id) => {
  const id = Math.random().toString(36).slice(2);
  while (id in rooms) {
    id = Math.random().toString(36).slice(2);
  }
  rooms[id] = {
    start_time: null,
    started: false,
    leader: user_id,
    users: [],
    spy: null,
    location: location_list[Math.floor(Math.random() * 3)],
    votes: {},
  };
  return id;
};

const joinRoom = (room_id, name, user_id) => {
  if (room_id in rooms) {
    if (rooms[room_id].started) return false;
    const leader = rooms[room_id].leader === user_id;
    rooms[room_id].users.push(User(name, user_id, leader));
    return true;
  }
};

const leaveRoom = (room_id, user_id) => {
  if (room_id in rooms) {
    const index = rooms[room_id].users.findIndex((user) => user.id === user_id);
    if (index !== -1) {
      const user = rooms[room_id].users.splice(index, 1);
      var end_game = false,
        reason = "";
      if (user_id === rooms[room_id].leader) {
        end_game = true;
        reason = "The leader has left the game";
      } else if (user_id === rooms[room_id].spy) {
        end_game = true;
        reason = "The spy has left the game";
      } else if (rooms[room_id].users.length < 3 && rooms[room_id].started) {
        end_game = true;
        reason = "There is not enough people to continue the game";
      }
      if (rooms[room_id].length < 1) delete rooms[room_id];
      return { user, end_game, reason };
    }
  }
  return false;
};

const getUser = (room_id, user_id) => {
  if (room_id in rooms)
    return rooms[room_id].users.filter((user) => user.id === user_id);
  return false;
};

const roomExists = (room_id) => {
  return room_id in rooms;
};

const getRoomUsers = (room_id) => {
  if (room_id in rooms) return rooms[room_id].users;
  return false;
};

const startGame = (room_id, user_id) => {
  const room = rooms[room_id];
  if (room) {
    if (room.leader === user_id && room.users.length >= 3) {
      room.started = true;
      room.start_time = moment().format("h:mm:ss");
      room.spy = room.users[Math.floor(Math.random() * room.users.length)];
      return {
        time: room.start_time,
        users: room.users,
        spy: room.spy,
        location: room.location,
      };
    }
  }
};

module.exports = {
  generateNewRoom,
  joinRoom,
  leaveRoom,
  getUser,
  roomExists,
  getRoomUsers,
  Message,
  startGame,
  delete_room,
};
