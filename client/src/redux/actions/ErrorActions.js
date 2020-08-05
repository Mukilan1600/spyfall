import { GET_ERROR, CLEAR_ERROR } from "./types";

export const get_error = (msg, error = null, type = 0, priority = 0) => {
  return {
    type: GET_ERROR,
    payload: { error, msg, type, priority },
  };
};

export const clear_error = () => {
  return {
    type: CLEAR_ERROR,
  };
};
