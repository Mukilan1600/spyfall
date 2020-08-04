import { START_GAME, LEAVE_GAME } from "./types";

export const startGame = (start_time) => {
  return {
    type: START_GAME,
    payload: start_time,
  };
};

export const leaveGame = () => {
  return {
    type: LEAVE_GAME,
  };
};
