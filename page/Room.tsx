import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import store from '../redux';
import * as socketActions from '../redux/Socket'

export default function Room({ route }: any) {
  const socketServer = store.getState().Socket.socketServer
  const roomId = route.params[0];
  const userId = useSelector((state: any) => state.Auth.userId);
  const roomInfo = useSelector((state: any) => state.Socket.roomInfo);

  React.useEffect(() => {
    store.dispatch(socketActions.set_room_id({ roomId }))
    socketServer.emit('getRoomInfo', roomId, userId);
  }, [])

  return roomInfo ? (
    <View style={style.container}>
      <View style={style.halfContainer}>
        <Text style={style.roomInfo}>
          {roomId ? roomId: null}번방 ({roomInfo.headcount}/{roomInfo.maxHeadcount}) {roomInfo.roomname}
        </Text>
        <View style={{ borderBottomWidth: 1 }}></View>
        <View style={{ flexDirection: 'row' }}>
          <View style={style.seat}>
            <Text style={style.userInfo}>{roomInfo.player1name}</Text>
            <Text style={style.userInfo}>{roomInfo.player1Character ? `${roomInfo.player1Character}` : ''}</Text>
            <Text style={style.userInfo}>{roomInfo.player1Ready ? '준비완료' : ''}</Text>
          </View>
          <View style={style.seat}>
            <Text style={style.userInfo}>{roomInfo.player2name}</Text>
            <Text style={style.userInfo}>{roomInfo.player2Character ? `${roomInfo.player2Character}` : ''}</Text>
            <Text style={style.userInfo}>{roomInfo.player2Ready ? '준비완료' : ''}</Text>
          </View>
        </View>
      </View>
      {/* <View style={style.halfContainer}></View> */}
    </View>
  ) : (
    <Text>여기는 {roomId ? roomId: null}번방 입니다.</Text>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  halfContainer: {
    flex: 1,
    width: 450,
  },
  roomInfo: {
    color: 'black',
    marginTop: 35,
    marginBottom: 5
  },
  seat: {
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    width: 110,
    height: 130,

  },
  userInfo: {
    color: 'black',
  },
  select: {
    borderWidth: 1,
    width: 100,
    height: 140,
  }
});
