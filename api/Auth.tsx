import axios from 'axios';
import store from '../redux';
import * as authActions from '../redux/Auth';
import { envServer } from '../env'

const serverIp = envServer
// const serverIp = '10.0.2.2:3000';

export function signin(email: string, password: string, navigation: any) {
  return axios
    .post(`http://${serverIp}/user/signin`, {
      email,
      password,
    })
    .then((res) => {
      store.dispatch(authActions.setToken({ token: res.data.token }));
      store.dispatch(authActions.user_sign_in());
      store.dispatch(authActions.set_user_id({ userId: res.data.id }));
      navigation.navigate('Home');
    })
    .catch((err) => console.log(err.response));
}

export function signup(
  email: string,
  password: string,
  username: string,
  navigation: any,
) {
  return axios
    .post(`http://${serverIp}/user/signup`, {
      email,
      password,
      username,
    })
    .then((res) => {
      navigation.navigate('Intro');
    })
    .catch((err) => console.log(err.response));
}