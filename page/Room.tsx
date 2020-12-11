import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
// import { useSelector } from 'react-redux';
// import store from '../redux';

export default function Room({ route }: any) {
  // const socketServer = store.getState().Socket.socketServer
  const roomId = route.params;
  // const userId = useSelector((state: any) => state.Auth.userId);

  React.useEffect(() => {
    // socketServer.emit('getRoomInfo', roomId, userId);
  }, [])

  return (
    <View style={style.container}>
      <Text>
        여기는 {roomId ? roomId: null}번방 입니다.
      </Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
