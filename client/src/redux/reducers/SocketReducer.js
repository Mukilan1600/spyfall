import {
  INITIALIZE_SOCKET,
  JOIN_ROOM,
  LEAVE_ROOM,
  RECIEVE_MSG,
  GET_USERS,
} from "../actions/types";

const initial_state = {
  socket: null,
  room_id: null,
  name: null,
  chat: [],
  users: [],
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case INITIALIZE_SOCKET:
      return {
        ...state,
        socket: action.payload,
      };
    case JOIN_ROOM:
      return {
        ...state,
        ...action.payload,
      };
    case LEAVE_ROOM:
      return {
        ...state,
        room_id: null,
        name: null,
        chat: [],
        users: [],
      };
    case RECIEVE_MSG:
      return {
        ...state,
        chat: [...state.chat, action.payload],
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
}
