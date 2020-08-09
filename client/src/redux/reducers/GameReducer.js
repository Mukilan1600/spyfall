import {
  START_GAME,
  LEAVE_GAME,
  CURR_QUES,
  START_NEXT_ROUND,
  PROMPT_NEXT,
} from "../actions/types";

const initialState = {
  game_started: false,
  start_time: null,
  spy: false,
  location: null,
  all_locations: null,
  currQues: null,
  round: null,
  end: false,
  nextRoundResFrag: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PROMPT_NEXT:
      return {
        ...state,
        nextRoundResFrag: action.payload,
      };
    case CURR_QUES:
      return {
        ...state,
        ...action.payload,
        nextRoundResFrag: false,
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
        end: false,
        nextRoundResFrag: false,
      };
    case LEAVE_GAME:
      return {
        ...state,
        game_started: false,
        start_time: null,
        spy: false,
        location: null,
        end: false,
        nextRoundResFrag: false,
      };
    default:
      return state;
  }
}
