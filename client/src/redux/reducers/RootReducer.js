import { combineReducers } from "redux";
import SocketReducer from "./SocketReducer";
import ErrorReducer from "./ErrorReducer";
import GameReducer from "./GameReducer";

export default combineReducers({
  socket: SocketReducer,
  error: ErrorReducer,
  game: GameReducer,
});
