import * as React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux';
import store from '../redux';
import { CustomButton } from '../component/CustumButton'

export default function Home() {
  const socketServer = store.getState().Socket.socketServer
  const userId = useSelector((state: any) => state.Auth.userId);
  const rooms = useSelector((state: any) => state.Socket.rooms);

  React.useEffect(() => {
    socketServer.emit('socketCheck', userId);
    socketServer.emit('rooms');
  }, [])

  return (
    <View style={style.container}>
      <View style={style.rooms}>
      {rooms
        ? rooms.map((room: any) => (
          <CustomButton
            key={room.id}
            title={`${room.id}번방/(${room.headcount}/${room.maxHeadcount})/${room.roomname}`}
            onPress={() => {
              // api...
            }}
            style={style.room}
          ></CustomButton>
          ))
        : null}
      </View>
      <View style={style.makeRoom}>
        <Button
          title="방만들기"
          onPress={() => {
            // api...
          }}
        />
        </View>
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
  rooms: {
    flex: 1,
    padding: 30,
  },
  room: {
    borderWidth: 1,
    width: 200,
    height: 30
  },
  makeRoom: {
    alignItems: "flex-start",
  }
});
