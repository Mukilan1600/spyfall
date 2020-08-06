import {
  INITIALIZE_SOCKET,
  JOIN_ROOM,
  LEAVE_ROOM,
  RECIEVE_MSG,
  GET_USERS,
  IS_LOADING,
  IS_LOADED,
  CREATE_ROOM,
} from "./types";
import { startGame, getCurrQues } from "./GameActions";
import { get_error } from "./ErrorActions";
import io from "socket.io-client";

export const initializeSocket = () => {
  const socket = io();
  return {
    type: INITIALIZE_SOCKET,
    payload: socket,
  };
};

export const joinRoom = (socket, room_id, name, history) => (dispatch) => {
  dispatch({ type: IS_LOADING });
  socket.emit("check_room_exists", room_id, (exists, room_id) => {
    dispatch({ type: IS_LOADED });
    if (exists) {
      socket.emit("join_room", room_id, name, (success, reason) => {
        if (success) {
          socket.on("ques_pair", (currQues) => {
            dispatch(getCurrQues(currQues));
          });
          socket.on("recieve_msg", (msg) => {
            dispatch(recieveMsg(msg));
          });

          socket.on("game_over", (error, reason, type) => {
            dispatch(clear_room_details());
            if (reason) dispatch(get_error(reason, error, type, 1));
          });
          socket.on("room_users", (users) => {
            dispatch(getRoomUsers(users));
          });
          socket.on(
            "game_started",
            ({ time, spy, location, all_locations, currQues }) => {
              dispatch(startGame(time, spy, location, all_locations, currQues));
            }
          );
          dispatch({
            type: JOIN_ROOM,
            payload: {
              room_id,
              name,
            },
          });
          history.push({
            pathname: `/room/${room_id}`,
            state: {
              room_id,
              name,
            },
          });
        } else {
          dispatch(get_error(reason));
        }
      });
    } else {
      dispatch(
        get_error("The given room ID is invalid or the room doesn't exist")
      );
    }
  });
};

export const createRoom = (socket, name, history) => (dispatch) => {
  dispatch({ type: IS_LOADING });
  socket.emit("create_room", (room_id) => {
    dispatch({ type: CREATE_ROOM });
    dispatch(joinRoom(socket, room_id, name, history));
  });
};

export const leaveRoom = (socket) => (dispatch) => {
  socket.emit("leave_room");
};

export const clear_room_details = () => {
  return {
    type: LEAVE_ROOM,
  };
};

export const sendMsg = (socket, msg) => (dispatch) => {
  socket.emit("send_msg", msg);
};

export const recieveMsg = (msg) => {
  return {
    type: RECIEVE_MSG,
    payload: msg,
  };
};

export const getRoomUsers = (users) => {
  return {
    type: GET_USERS,
    payload: users,
  };
};
