import { combineReducers } from "redux";
import SocketReducer from "./SocketReducer";

export default combineReducers({
  socket: SocketReducer,
});
