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