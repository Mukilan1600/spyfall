const moment = require("moment");

const rooms = {};

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
  };
  return id;
};

const joinRoom = (room_id, name, user_id) => {
  if (room_id in rooms) {
    const leader = rooms[room_id].leader === user_id;
    rooms[room_id].users.push(User(name, user_id, leader));
  }
};

const leaveRoom = (room_id, user_id) => {
  if (room_id in rooms) {
    const index = rooms[room_id].users.findIndex((user) => user.id === user_id);
    if (index !== -1) {
      const user = rooms[room_id].users.splice(index, 1);
      if (rooms[room_id].length < 1) delete rooms[room_id];
      return user;
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
      return room.start_time;
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
};
