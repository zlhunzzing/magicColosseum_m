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
import Field from './page/Field';

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

    socketServer.on('setHand', (roomId: number, userId: number, hand: any) => {
      if (
        store.getState().Socket.roomInfo &&
        roomId === store.getState().Socket.roomInfo.id
      ) {
        if (userId === store.getState().Socket.roomInfo.player1) {
          store.dispatch(
            battleActions.set_player1_hand({
              hand: hand.slice(0, 3),
            }),
          );
        } else {
          store.dispatch(
            battleActions.set_player2_hand({
              hand: hand.slice(0, 3),
            }),
          );
        }
      }
    });

    socketServer.on('setTurn', (roomId: number, roomInfo: any) => {
      if (
        store.getState().Socket.roomInfo &&
        roomId === store.getState().Socket.roomInfo.id
      ) {
        if (roomInfo.player1set && roomInfo.player2set) {
          navigate('Field')
        }
      }
    });
    
    socketServer.on('sendMessage', (roomId: number, content: string, username: string) => {
      if (
        store.getState().Socket.roomInfo &&
        store.getState().Socket.roomInfo.id === Number(roomId)
      ) {
        const message = {
          id: store.getState().Socket.messageId,
          message: content,
          username
        }
        const messages = store.getState().Socket.messages;
        messages.unshift(message)
        store.dispatch(socketActions.set_messages({ messages: messages.slice() }))
        store.dispatch(socketActions.add_message_id())
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
          <Stack.Screen name="Field" component={Field} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;