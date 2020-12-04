import axios from 'axios';

// const serverIp = 'localhost:3000';
const serverIp = '10.0.2.2:3000';

export function signin(email: string, password: string, navigation: any) {
  return axios
    .post(`http://${serverIp}/user/signin`, {
      email,
      password,
    })
    .then((res) => {
      // store.dispatch(authActions.setToken({ token: res.data.token }));
      // store.dispatch(authActions.user_sign_in());
      // store.dispatch(authActions.set_user_id({ userId: res.data.id }));
      // history.push('/channel');
      console.log("?", res)
    })
    .catch((err) => console.log(err.response.data));
}