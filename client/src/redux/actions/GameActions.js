import {
  START_GAME,
  LEAVE_GAME,
  CURR_QUES,
  START_NEXT_ROUND,
  PROMPT_NEXT,
} from "./types";

export const startNextRound = (round) => {
  return {
    type: START_NEXT_ROUND,
    payload: { round },
  };
};

export const onNextRound = (frag) => {
  return {
    type: PROMPT_NEXT,
    payload: frag,
  };
};

export const startGame = (
  start_time,
  spy,
  location,
  all_locations,
  currQues
) => {
  return {
    type: START_GAME,
    payload: { start_time, spy, location, all_locations, currQues },
  };
};

export const leaveGame = () => {
  return {
    type: LEAVE_GAME,
  };
};

export const getCurrQues = (currQues, end) => {
  return { type: CURR_QUES, payload: { currQues, end } };
};
