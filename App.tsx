import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './redux';
import * as socketActions from './redux/Socket';
import * as Update from "expo-updates";

const Stack = createStackNavigator();

/* pages */
import Intro from './page/Intro'
import Home from './page/Home'
import Room from './page/Room'

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
  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef} >
        <Stack.Navigator initialRouteName="Intro" headerMode="none" >
          <Stack.Screen name="Intro" component={Intro} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Room" component={Room} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;