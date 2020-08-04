import { START_GAME, LEAVE_GAME } from "../actions/types";
import moment from "moment";

const initialState = {
  game_started: false,
  start_time: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case START_GAME:
      return {
        ...state,
        game_started: true,
        start_time: moment(action.payload, "h:mm:ss"),
      };
    case LEAVE_GAME:
      return {
        ...state,
        game_started: false,
        start_time: null,
      };
    default:
      return state;
  }
}