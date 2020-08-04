import { GET_ERROR, CLEAR_ERROR } from "../actions/types";

const initialState = {
  error: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERROR:
      return {
        error: action.payload,
      };
    case CLEAR_ERROR:
      return {
        error: null,
      };
    default:
      return state;
  }
}
