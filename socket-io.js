const moment = require("moment");

const rooms = {};
const location_list = [
  "Cruise Ship",
  "5-Start Hotel",
  "Local restaurant",
  "Police station",
  "Mall",
  "Beach",
  "Water park",
  "Movie studio",
  "Theater",
  "Library",
  "University",
  "School",
  "Gas station",
  "Day spa",
  "Casino",
  "Park",
  "Grocery store",
  "Bank",
  "Airport",
  "Military base",
  "Antartica",
  "Sahara desert",
  "Amazon rain forest",
  "Space station",
  "Mars",
];

const User = (name, id, leader) => {
  return {
    name,
    id,
    leader,
    vote: null,
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
    location: location_list[Math.floor(Math.random() * location_list.length)],
    votes: {},
    currQues: [],
    nextRoundVote: 0,
    round: 1,
  };
  return id;
};

const joinRoom = (room_id, name, user_id) => {
  if (room_id in rooms) {
    if (rooms[room_id].started)
      return { success: false, reason: "The game has already started" };
    const exists = rooms[room_id].users.findIndex((user) => user.name === name);
    if (exists !== -1)
      return { success: false, reason: "The name is already taken" };
    const leader = rooms[room_id].leader === user_id;
    rooms[room_id].users.push(User(name, user_id, leader));
    return { success: true, reason: null };
  }
};

const checkSpyGuess = (location, room_id, user_id) => {
  const room = rooms[room_id];
  if (room && room.spy.id === user_id) {
    if (room.location === location)
      return { success: true, spy: room.spy, actual_location: room.location };
    else
      return { success: false, spy: room.spy, actual_location: room.location };
  }
};

const leaveRoom = (room_id, user_id) => {
  if (room_id in rooms) {
    const index = rooms[room_id].users.findIndex((user) => user.id === user_id);
    if (index !== -1) {
      const user = rooms[room_id].users.splice(index, 1);
      var end_game = false,
        reason = "";
      if (rooms[room_id].started) {
        if (user_id === rooms[room_id].leader) {
          end_game = true;
          reason = "The leader has left the game";
        } else if (user_id === rooms[room_id].spy.id) {
          end_game = true;
          reason = "The spy has left the game";
        } else if (rooms[room_id].users.length < 3 && rooms[room_id].started) {
          end_game = true;
          reason = "There is not enough people to continue the game";
        }
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
      room.start_time = Date.now();
      room.spy = room.users[Math.floor(Math.random() * room.users.length)];
      var user1 = room.users[Math.floor(Math.random() * room.users.length)],
        user2 = room.users[Math.floor(Math.random() * room.users.length)];
      while (user1 === user2)
        user1 = room.users[Math.floor(Math.random() * room.users.length)];
      room.currQues = [user1, user2];
      return {
        time: room.start_time,
        users: room.users,
        spy: room.spy,
        location: room.location,
        all_locations: location_list,
        currQues: room.currQues,
      };
    }
  }
};

const onNextRoundVote = (room_id) => {
  if (rooms[room_id]) {
    rooms[room_id].nextRoundVote += 1;
  }
};

const endRound = (room_id) => {
  if (rooms[room_id]) {
    const { round, nextRoundVote, users } = rooms[room_id];
    rooms[room_id].nextRoundVote = 0;
    rooms[room_id].round++;
    if (round >= 8 || nextRoundVote >= users.length / 2) {
      const { users, spy } = rooms[room_id];
      var votes = {};
      users.map((user) => {
        const { vote } = user;
        if (vote)
          if (votes[vote]) votes[vote]++;
          else votes[vote] = 1;
      });

      if (votes.length < 1)
        return {
          end_game: true,
          round: null,
          spy_won: true,
          max_voted_user: null,
          spy,
        };
      else {
        const max_voted = Object.keys(votes).reduce((a, b) =>
          votes[a] > votes[b] ? a : b
        );
        if (max_voted === spy.id) {
          return {
            end_game: true,
            round: null,
            spy_won: false,
            max_voted_user: spy,
            spy,
          };
        } else {
          const max_voted_user = users.filter((user) => user.id === max_voted);
          return {
            end_game: true,
            round: null,
            spy_won: true,
            max_voted_user,
            spy,
          };
        }
      }
    } else
      return {
        end_game: false,
        round,
        spy_won: null,
        max_voted_user: null,
        spy: null,
      };
  }
};

const getQuesPair = (room_id, user_id) => {
  if (!rooms[room_id]) return null;
  if (rooms[room_id].currQues[0].id === user_id) return null;
  const { users, currQues } = rooms[room_id];
  var user1 = users[Math.floor(Math.random() * users.length)],
    user2 = users[Math.floor(Math.random() * users.length)];
  while (
    user1.id === user2.id ||
    currQues[0].id === user1.id ||
    currQues[1].id === user2.id
  ) {
    user1 = users[Math.floor(Math.random() * users.length)];
    user2 = users[Math.floor(Math.random() * users.length)];
  }
  rooms[room_id].currQues = [user1, user2];
  return [user1, user2];
};

const isSpy = (room_id, user_id) => {
  if (rooms[room_id]) return rooms[room_id].spy.id === user_id;
  return false;
};

const voteForSpy = (room_id, user_id, voter_id) => {
  if (rooms[room_id]) {
    const idx = rooms[room_id].users.findIndex((user) => user.id === voter_id);
    if (idx !== -1) {
      rooms[room_id].users[idx].vote = user_id;
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
  checkSpyGuess,
  getQuesPair,
  onNextRoundVote,
  endRound,
  isSpy,
  voteForSpy,
};
