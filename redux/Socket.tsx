import { createAction } from 'redux-actions';
import io from 'socket.io-client'
import { envServer } from '../env'

const serverIp = envServer

const SET_SOCKET_ID = 'App/Socket/SET_SOCKET_ID';
const SET_ROOMS = 'App/Socket/SET_ROOMS';
const SET_ROOM_ID = 'App/Socket/SET_ROOM_ID';
const SET_ROOM_INFO = 'App/Socket/SET_ROOM_INFO';
const SET_MESSAGES = 'App/Socket/SET_MESSAGES'
const ADD_MESSAGE_ID = 'App/Socket/ADD_MESSAGE_ID'
const RESET_MESSAGES = 'App/Socket/RESET_MESSAGES'

export const set_socket_id = createAction(SET_SOCKET_ID);
// payload: {socketId: }
export const set_rooms = createAction(SET_ROOMS);
// payload: {rooms: }
export const set_room_id = createAction(SET_ROOM_ID);
// paload: {roomId: }
export const set_room_info = createAction(SET_ROOM_INFO);
// // payload: {roomInfo: }
export const set_messages = createAction(SET_MESSAGES)
// payload: [{ id: <number>, message: <string>, username: <string> }, ...]
export const add_message_id = createAction(ADD_MESSAGE_ID)
export const reset_messages = createAction(RESET_MESSAGES)

const initialState = {
  socketServer: io(`http://${serverIp}`),
  socketId: null,
  rooms: [],
  roomId: 0,
  roomInfo: null,
  messages: [],
  messageId: 0,
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
    case SET_ROOM_ID:
      return {
        ...state,
        roomId: action.payload.roomId,
      };  
    case SET_ROOM_INFO:
      return {
        ...state,
        roomInfo: action.payload.roomInfo,
      };
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.payload.messages,
      };
    case ADD_MESSAGE_ID:
      return {
        ...state,
        messageId: state.messageId + 1
      };  
    case RESET_MESSAGES:
      return {
        ...state,
        messages: []
      };
    default:
      return state;
  }
}
