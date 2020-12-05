import { createAction } from 'redux-actions';

const SET_TOKEN = 'App/Auth/SET_TOKEN';
const USER_SIGN_IN = 'App/Auth/USER_SIGN_IN';
const SET_USER_ID = 'App/Auth/SET_USER_ID';

export const setToken = createAction(SET_TOKEN);
// payload: {token: token}
export const user_sign_in = createAction(USER_SIGN_IN);
export const set_user_id = createAction(SET_USER_ID);

const initialState = {
  token: null,
  isUser: false,
  userId: null,
};

export default function Auth(state: any = initialState, action: any) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
      };
    case USER_SIGN_IN:
      return {
        ...state,
        isUser: true,
      };
    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload.userId,
      };
    default:
      return state;
  }
}
