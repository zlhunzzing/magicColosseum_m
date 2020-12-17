import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function SetTurn() {
  const roomInfo = useSelector((state: any) => state.Socket.roomInfo);
  console.log(roomInfo)

  return (
    <View style={style.container}>
      <View style={style.status}>
        <View style={style.player1info}>
          <Text>NAME: {roomInfo.player1Character + `(${roomInfo.player1name})`}</Text>
        </View>
        <View style={style.player2info}>
          <Text>NAME: {roomInfo.player1Character + `(${roomInfo.player1name})`}</Text>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  status: {
    flexDirection: 'row',
    marginTop: 30,
  },
  player1info: {
    paddingHorizontal: 40,
  },
  player2info: {
    width: 400,
    alignItems: 'flex-end',
  },
});
