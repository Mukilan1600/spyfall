import {
  START_GAME,
  LEAVE_GAME,
  CURR_QUES,
  START_NEXT_ROUND,
} from "../actions/types";

const initialState = {
  game_started: false,
  start_time: null,
  spy: false,
  location: null,
  all_locations: null,
  currQues: null,
  round: null,
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
        round: 1,
      };
    case START_NEXT_ROUND:
      return {
        ...state,
        ...action.payload,
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
