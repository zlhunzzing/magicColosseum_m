import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import store from '../redux';

export default function Home() {
  const socketServer = store.getState().Socket.socketServer
  const userId = useSelector((state: any) => state.Auth.userId);

  React.useEffect(() => {
    socketServer.emit('socketCheck', userId);
  })

  return (
    <View style={style.container}>
      <Text>여기는 홈</Text>
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
