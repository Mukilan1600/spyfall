import { START_GAME, LEAVE_GAME, CURR_QUES } from "../actions/types";
import moment from "moment";

const initialState = {
  game_started: false,
  start_time: null,
  spy: false,
  location: null,
  all_locations: null,
  currQues: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CURR_QUES:
      return {
        ...state,
        currQues: action.payload,
      };
    case START_GAME:
      return {
        ...state,
        ...action.payload,
        game_started: true,
        start_time: moment(action.payload.start_time, "h:mm:ss"),
      };
    case LEAVE_GAME:
      return {
        ...state,
        game_started: false,
        start_time: null,
        spy: false,
        location: null,
      };
    default:
      return state;
  }
}
