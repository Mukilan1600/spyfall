import { START_GAME, LEAVE_GAME } from "./types";

export const startGame = (start_time, spy, location, all_locations) => {
  return {
    type: START_GAME,
    payload: { start_time, spy, location, all_locations },
  };
};

export const leaveGame = () => {
  return {
    type: LEAVE_GAME,
  };
};
