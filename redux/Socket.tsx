import { createAction } from 'redux-actions';
import io from 'socket.io-client'
import { envServer } from '../env'

const serverIp = envServer

const SET_SOCKET_ID = 'App/Socket/SET_SOCKET_ID';
const SET_ROOMS = 'App/Socket/SET_ROOMS';
const SET_ROOM_INFO = 'App/Socket/SET_ROOM_INFO';
const SET_IS_CHAT = 'App/Socket/SET_IS_CHAT';

export const set_socket_id = createAction(SET_SOCKET_ID);
// payload: {socketId: }
export const set_rooms = createAction(SET_ROOMS);
// payload: {rooms: }
export const set_room_info = createAction(SET_ROOM_INFO);
// payload: {roomInfo: }
export const set_is_chat = createAction(SET_IS_CHAT);

const initialState = {
  socketServer: io(`http://${serverIp}`),
  socketId: null,
  rooms: [],
  roomInfo: null,
  isChat: true,
};

export default function Socket(state: any = initialState, action: any) {
  switch (action.type) {
    case SET_SOCKET_ID:
      return {
        ...state,
        socketId: action.payload.socketId,
      };
    case SET_ROOMS:
      return {
        ...state,
        rooms: action.payload.rooms,
      };
    case SET_ROOM_INFO:
      return {
        ...state,
        roomInfo: action.payload.roomInfo,
      };
    case SET_IS_CHAT:
      return {
        ...state,
        isChat: false,
      };
    default:
      return state;
  }
}
