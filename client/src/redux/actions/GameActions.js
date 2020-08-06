import { START_GAME, LEAVE_GAME, CURR_QUES } from "./types";

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

export const getCurrQues = (currQues) => {
  return { type: CURR_QUES, payload: currQues };
};
