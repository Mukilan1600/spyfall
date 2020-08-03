import {
  INITIALIZE_SOCKET,
  JOIN_ROOM,
  LEAVE_ROOM,
  RECIEVE_MSG,
  GET_USERS,
} from "./types";
import io from "socket.io-client";

export const initializeSocket = () => {
  const socket = io();
  return {
    type: INITIALIZE_SOCKET,
    payload: socket,
  };
};

export const joinRoom = (socket, room_id, name, history) => (dispatch) => {
  socket.emit("check_room_exists", room_id);
  socket.on("room_exists", (id) => {
    socket.emit("join_room", room_id, name);
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
  });
};

export const createRoom = (socket, name, history) => (dispatch) => {
  socket.emit("create_room");
  socket.on("room_id_generated", (id) => {
    dispatch(joinRoom(socket, id, name, history));
  });
};

export const leaveRoom = (socket) => (dispatch) => {
  if (socket.hasListeners("room_exists")) socket.removeListener("room_exists");
  socket.emit("leave_room");
  dispatch({
    type: LEAVE_ROOM,
  });
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
