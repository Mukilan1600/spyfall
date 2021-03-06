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
  "Antarctica",
  "Sahara desert",
  "Amazon rain forest",
  "Space station",
  "Mars",
  "Strip club",
];

const roles = {
  "Cruise Ship": [
    "Manager",
    "Captain",
    "waiter",
    "cleaner",
    "passenger",
    "engineer",
    "lifeguard",
    "chef",
    "bartender",
  ],
  "5-Start Hotel": [
    "Manager",
    "Customer",
    "Owner",
    "Bartender",
    "Waiter",
    "Maid",
    "Chef",
    "Sous-chef",
    "cleaner",
    "receptionist",
    "Prep cook",
  ],
  "Local restaurant": [
    "Manager",
    "Waiter",
    "chef",
    "customer",
    "cleaner",
    "Barista",
    "Drive-thru Operator",
    "Cashier",
    "Dishwasher",
  ],
  "Police station": [
    "Police Chief",
    "Prisoner",
    "Detective",
    "Crime Scene Investigator",
    "Advocate",
    "Desk officer",
    "Patrol Officer",
    "Resource Officer",
  ],
  Mall: [
    "Janitor",
    "Security",
    "Electrician",
    "Manager",
    "visitor",
    "Receptionist",
    "Cashier",
    "Salesman",
    "Program Manager",
    "Software Engineer",
  ],
  Beach: [
    "Lifeguard",
    "fisher",
    "tourist",
    "Stall Owner",
    "Medic",
    "Horse-back Officer",
    "Hotdog vendor",
    "Fisherman",
    "Stunt Daredevil",
  ],
  "Water park": [
    "Lifeguard",
    "Engineer",
    "Tourist",
    "Ticket Collector",
    "Park Manager",
    "Mascot",
    "Clerk",
    "Event Manager",
    "Medic",
  ],
  "Movie studio": [
    "Actor",
    "Director",
    "Assistant Director",
    "Editor",
    "Camera Man",
    "Script Writer",
    "Assistant Editor",
    "Vfx Supervisor",
    "Stuntman",
  ],
  Theater: [
    "Cleaners",
    "Customer",
    "Cashier",
    "Engineer",
    "Usher",
    "Projectionist",
    "Ticket Seller",
    "Manager",
  ],
  Library: [
    "Librarian",
    "Library Technician",
    "Visitor",
    "Library Assistant",
    "Janitor,Archivist",
    "Library Director",
    "Media Specialist",
  ],
  University: [
    "Professor",
    "Student",
    "Principal",
    "Head of the Department",
    "Janitor",
    "Lab assistant",
    "Cook",
    "Exams supervisor",
  ],
  School: [
    "Cleaner",
    "Teacher",
    "Student",
    "Lab Assistant",
    "PE Teacher",
    "Librarian",
    "Janitor",
    "Counselor",
    "Principal",
    "Correspondent",
  ],
  "Gas station": [
    "Cleaner",
    "Worker",
    "Manager",
    "Janitor",
    "Supervisor",
    "Customer",
    "Assistant manager",
    "Pump mechanic",
  ],
  "Day spa": [
    "Customer",
    "Receptionist",
    "Therapist",
    "Janitor",
    "Masseuse",
    "Barber",
    "stylist",
    "trainee",
  ],
  Casino: [
    "host",
    "manager",
    "dealer",
    "cashier",
    "customer",
    "floor staff",
    "bouncer",
    "surveillance operator",
    "security officer",
    "clerk",
  ],
  Park: [
    "Park Manager",
    "Cleaner",
    "Visitor",
    "Security",
    "Gardener",
    "Maintenance worker",
    "Ticket Collector",
    "Event Manager",
    "Medic",
  ],
  "Grocery store": [
    "Owner",
    "Customer",
    "Employee",
    "Clerk",
    "Cashier",
    "Staff",
    "stock clerk",
    "sales associate",
  ],
  Bank: [
    "Clerk",
    "fund manager",
    "trade analyst",
    "customer",
    "trader",
    "compliance officer",
    "adviser",
    "operation analyst",
  ],
  Airport: [
    "security",
    "traveler",
    "customs",
    "military men",
    "Airport Manager",
    "pilot",
    "hostess",
    "air traffic controller",
    "Aeronautical Engineer",
    "cleaner",
  ],
  "Military base": [
    "Private",
    "Medic",
    "Sergeant",
    "Major",
    "Platoon Leader",
    "Air Force Pilot",
    "Marine Corp",
    "Navy Operations Specialist",
    "field medic",
  ],
  Antarctica: [
    "researcher",
    "polar bear",
    "traveler",
    "eskimo",
    "data scientist",
    "Biologist",
    "Antarctic scientist",
    "geologist",
  ],
  "Sahara desert": [
    "camel",
    "nomad",
    "explorer",
    "traveler",
    "travelling trader",
    "zoologist",
    "biologist",
    "desert engineer",
    "geologist",
  ],
  "Amazon rain forest": [
    "Native",
    "Tribe men",
    "Biologist",
    "Zoologist",
    "photographer",
    "explorer",
    "researcher",
    "forest ranger",
    "geologist",
    "traveler",
  ],
  "Space station": [
    "Astronaut",
    "Mission Specialist",
    "Payload Specialist",
    "Commander",
    "Sub-Commander",
    "Flight Engineer",
    "Spaceflight Participant",
    "Imposter",
  ],
  Mars: [
    "Astronaut",
    "Elon Musk",
    "Martian",
    "Biologist",
    "Curiosity rover",
    "Mission Specialist",
    "Commander",
    "Sub-Commander",
    "Communications Specialist",
  ],
  "Strip club": [
    "Dj",
    "Stripper",
    "Bartender",
    "Waiter",
    "Customer",
    "Room Attendant",
    "Customer Service Representative",
    "Bouncer",
  ],
};

const log_details = () => {
  var no_of_users = 0,
    no_of_rooms = 0;
  Object.values(rooms).forEach((room) => {
    no_of_users += room.users.length;
    no_of_rooms++;
  });
  if (no_of_rooms > 0 && no_of_users > 0)
    console.log(`[+++] Rooms: ${no_of_rooms}, Users: ${no_of_users}`);
};

const User = (name, id, leader) => {
  return {
    name,
    id,
    leader,
    vote: null,
    role: null,
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

const generateNewRoom = (round_time, user_id) => {
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
    location: null,
    currQues: [],
    currQuesArr: [],
    currQuesIdx: null,
    nextRoundVote: 0,
    round: 1,
    prevSpy: null,
    round_time,
  };
  return { id, round_time };
};

const joinRoom = (room_id, name, user_id) => {
  if (room_id in rooms) {
    if (rooms[room_id].started)
      return { success: false, reason: "The game has already started" };
    if (rooms[room_id].users.length >= 10)
      return { success: false, reason: "The room is full" };
    const exists = rooms[room_id].users.findIndex((user) => user.name === name);
    if (exists !== -1)
      return { success: false, reason: "The name is already taken" };
    const leader = rooms[room_id].leader === user_id;
    rooms[room_id].users.push(User(name, user_id, leader));
    return {
      success: true,
      reason: null,
      round_time: rooms[room_id].round_time,
    };
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
      if (user_id === rooms[room_id].leader) {
        end_game = true;
        reason = "The leader has left the game";
      } else if (rooms[room_id].started) {
        if (user_id === rooms[room_id].spy.id) {
          end_game = true;
          reason = "The spy has left the game";
        } else if (rooms[room_id].users.length < 3) {
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
  return [];
};

const startGame = (room_id, user_id) => {
  const room = rooms[room_id];
  if (room) {
    if (room.leader === user_id && room.users.length >= 3) {
      room.location =
        location_list[Math.floor(Math.random() * location_list.length)];
      console.log(room.location, roles[room.location]);
      while (roles[room.location].length < room.users.length)
        room.location =
          location_list[Math.floor(Math.random() * location_list.length)];
      room.started = true;
      room.start_time = Date.now();
      var quesArr = [];
      var rolesArr = roles[room.location].splice(0, room.users.length);
      rolesArr.sort(() => Math.random() - 0.5);
      for (var i = 0; i < room.users.length; i++) {
        room.users[i].role = rolesArr[i];
        quesArr.push(i);
      }
      quesArr.sort(() => Math.random() - 0.5);
      room.currQuesArr = quesArr;
      room.currQuesIdx = 1;

      room.prevSpy = room.spy;
      if (room.prevSpy)
        while (room.spy.id === room.prevSpy.id)
          room.spy = room.users[Math.floor(Math.random() * room.users.length)];
      else room.spy = room.users[Math.floor(Math.random() * room.users.length)];

      room.currQues = [room.users[quesArr[0]], room.users[quesArr[1]]];
      return {
        time: room.start_time,
        users: room.users,
        spy: room.spy,
        location: room.location,
        all_locations: location_list,
        currQues: room.currQues,
        round_time: room.round_time,
      };
    }
  }
};

const updateDetails = (details, room_id) => {
  Object.keys(details).forEach((key) => {
    rooms[room_id][key] = details[key];
  });
};

const onNextRoundVote = (room_id) => {
  if (rooms[room_id]) {
    rooms[room_id].nextRoundVote += 1;
  }
};

const resetRoom = (room_id) => {
  rooms[room_id].prevSpy = rooms[room_id].spy;
  rooms[room_id].spy = null;
  rooms[room_id].started = false;
};

const endGame = (room_id) => {
  const { users, spy } = rooms[room_id];
  var votes = {};
  users.map((user) => {
    const { vote } = user;
    if (vote)
      if (votes[vote]) votes[vote]++;
      else votes[vote] = 1;
  });
  resetRoom(room_id);
  if (Object.keys(votes).length === 0)
    return {
      end_game: true,
      round: null,
      spy_won: true,
      max_voted_user: null,
      spy,
    };
  else {
    const max_voted = Object.keys(votes).reduce((a, b) =>
      votes[a] > votes[b] || votes[a] === votes[b] ? a : b
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
      const max_voted_user = users.filter((user) => user.id === max_voted)[0];
      return {
        end_game: true,
        round: null,
        spy_won: true,
        max_voted_user,
        spy,
      };
    }
  }
};

const endRound = (room_id) => {
  if (rooms[room_id]) {
    const { round, nextRoundVote, users } = rooms[room_id];
    rooms[room_id].nextRoundVote = 0;
    rooms[room_id].round++;
    if (nextRoundVote >= users.length / 2) {
      return endGame(room_id);
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

const getQuesPair = (room_id, user_id, next_round) => {
  if (!rooms[room_id]) return { currQues: null, end: false };
  if (rooms[room_id].currQues[0].id !== user_id)
    return { currQues: null, end: false };
  if (next_round) {
    var quesArr = [];
    for (var i = 0; i < rooms[room_id].users.length; i++) quesArr.push(i);
    quesArr.sort(() => Math.random() - 0.5);
    rooms[room_id].currQuesArr = quesArr;
    rooms[room_id].currQuesIdx = 0;
  }
  const { currQuesArr, currQuesIdx, users } = rooms[room_id];
  const end = currQuesIdx >= users.length - 1;
  const currQues = [
    users[currQuesArr[currQuesIdx]],
    users[currQuesArr[(currQuesIdx + 1) % users.length]],
  ];
  rooms[room_id].currQues = currQues;
  rooms[room_id].currQuesIdx++;
  return { currQues, end };
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
  endGame,
  resetRoom,
  log_details,
  updateDetails,
};
