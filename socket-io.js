const rooms = {};

const User = (name, id) => {
  return {
    name,
    id,
  };
};

const generateNewRoom = () => {
  const id = Math.random().toString(36).slice(2);
  while (id in rooms) {
    id = Math.random().toString(36).slice(2);
  }
  rooms[id] = [];
  return id;
};

const joinRoom = (room_id, name, user_id) => {
  if (room_id in rooms) rooms[room_id].push(User(name, user_id));
  console.log(rooms);
};

const leaveRoom = (room_id, user_id) => {
  if (room_id in rooms) {
    const index = rooms[room_id].findIndex((user) => user.id === user_id);
    if (index !== -1) {
      const user = rooms[room_id].splice(index, 1);
      if (rooms[room_id].length < 1) delete rooms[room_id];
      return user;
    }
  }
  return false;
};

const getUser = (room_id, user_id) => {
  if (room_id in rooms)
    return rooms[room_id].filter((user) => user.id === user_id);
  return false;
};

const roomExists = (room_id) => {
  return room_id in rooms;
};

const getRoomUsers = (room_id) => {
  if (room_id in rooms) return rooms[room_id];
  return false;
};

module.exports = {
  generateNewRoom,
  joinRoom,
  leaveRoom,
  getUser,
  roomExists,
  getRoomUsers,
};
