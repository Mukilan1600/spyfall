import { GET_ERROR, CLEAR_ERROR } from "./types";

export const get_error = (msg, priority = 0) => {
  return {
    type: GET_ERROR,
    payload: { msg, priority },
  };
};

export const clear_error = () => {
  return {
    type: CLEAR_ERROR,
  };
};
