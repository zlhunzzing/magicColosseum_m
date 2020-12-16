import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './redux';
import * as socketActions from './redux/Socket';
import * as Update from "expo-updates";
import * as battleActions from './redux/Battle';

const Stack = createStackNavigator();

/* pages */
import Intro from './page/Intro'
import Home from './page/Home'
import Room from './page/Room'
import SetTurn from './page/SetTurn'

function App() {
  const navigationRef: any = React.createRef();
  function navigate(name: any, params: any = null) {
    (navigationRef.current as any)?.navigate(name, params);
  }
  const socketServer = store.getState().Socket.socketServer

  React.useEffect(() => {
    socketServer.on('socketCheck', (userId: number, socketId: string) => {
      if (store.getState().Auth.userId === userId) {
        if (!store.getState().Socket.socketId) {
          store.dispatch(socketActions.set_socket_id({ socketId }));
        } else if (store.getState().Socket.socketId !== socketId) {
          Update.reloadAsync()
          // 이미 접속중인 아이디입니다.
        }
      }
    })

    socketServer.on('rooms', (rooms: any) => {
      store.dispatch(socketActions.set_rooms({ rooms }));
    });

    socketServer.on('getRoomInfo', (roomInfo: any) => {
      if (store.getState().Socket.roomId === roomInfo.id) {
        store.dispatch(socketActions.set_room_info({ roomInfo }));
      }
    });

    socketServer.on('gamestart', (roomInfo: any) => {
      if (roomInfo.player1 === store.getState().Auth.userId) {
        store.dispatch(
          battleActions.select_player2({ name: roomInfo.player2Character }),
        );
        navigate('SetTurn');
      }

      if (roomInfo.player2 === store.getState().Auth.userId) {
        store.dispatch(
          battleActions.select_player1({ name: roomInfo.player1Character }),
        );
        navigate('SetTurn');
      }
    });
  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef} >
        <Stack.Navigator initialRouteName="Intro" headerMode="none" >
          <Stack.Screen name="Intro" component={Intro} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Room" component={Room} />
          <Stack.Screen name="SetTurn" component={SetTurn} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;