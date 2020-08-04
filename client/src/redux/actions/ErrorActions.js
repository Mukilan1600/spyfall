import { GET_ERROR, CLEAR_ERROR } from "./types";

export const get_error = (err) => {
  return {
    type: GET_ERROR,
    payload: err,
  };
};

export const clear_error = () => {
  return {
    type: CLEAR_ERROR,
  };
};
