import axios from 'axios';
import store from '../redux';
import { envServer } from '../env'

const serverIp = envServer

export function createRoom(roomname: string, navigation: any) {
  return axios
    .post(
      `http://${serverIp}/user/channel`,
      {
        roomname,
      },
      {
        headers: {
          Authorization: store.getState().Auth.token,
        },
      },
    )
    .then((res) => {
      navigation.navigate('Room', [res.data.id]);
    })
    .catch((err) => console.log(err.response));
}

export function inRoom(roomId: number, navigation: any) {
  return axios
    .post(
      `http://${serverIp}/user/greenroom/${roomId}`,
      {},
      {
        headers: {
          Authorization: store.getState().Auth.token,
        },
      },
    )
    .then((res) => {
      navigation.navigate('Room', [roomId]);
    })
    .catch((err) => console.log(err.response));
}
