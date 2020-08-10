import {
  INITIALIZE_SOCKET,
  JOIN_ROOM,
  LEAVE_ROOM,
  GET_USERS,
  IS_LOADING,
  IS_LOADED,
  CREATE_ROOM,
} from "../actions/types";

const initial_state = {
  socket: null,
  room_id: null,
  name: null,
  users: [],
  isLoading: false,
  leader: false,
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case IS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case IS_LOADED:
      return {
        ...state,
        isLoading: false,
      };
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
    case CREATE_ROOM:
      return {
        ...state,
        leader: true,
      };
    case LEAVE_ROOM:
      return {
        ...state,
        room_id: null,
        name: null,
        chat: [],
        users: [],
        leader: false,
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
