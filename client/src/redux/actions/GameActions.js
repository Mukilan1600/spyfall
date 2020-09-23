import {
  START_GAME,
  LEAVE_GAME,
  CURR_QUES,
  START_NEXT_ROUND,
  PROMPT_NEXT,
  GAME_CHANGE,
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
  currQues,
  round_time,
  role
) => {
  return {
    type: START_GAME,
    payload: {
      start_time,
      spy,
      location,
      all_locations,
      currQues,
      round_time,
      role,
    },
  };
};

export const leaveGame = () => {
  return {
    type: LEAVE_GAME,
  };
};

export const gameDetailsChanged = (details) => {
  return {
    type: GAME_CHANGE,
    payload: details,
  };
};

export const getCurrQues = (currQues, end) => {
  return { type: CURR_QUES, payload: { currQues, end } };
};
