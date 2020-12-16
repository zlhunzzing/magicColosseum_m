import * as React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useSelector } from 'react-redux';
import store from '../redux';
import * as socketActions from '../redux/Socket'
import { CustomButton } from '../component/CustumButton'
import * as battleActions from '../redux/Battle';

export default function Room({ route, navigation }: any) {
  const socketServer = store.getState().Socket.socketServer
  const roomId = route.params[0];
  const userId = useSelector((state: any) => state.Auth.userId);
  const roomInfo = useSelector((state: any) => state.Socket.roomInfo);
  const [character, setCharacter] = React.useState('');
  const [isReady, setIsReady] = React.useState(false)

  function outRoom() {
    socketServer.emit('outRoom', roomId, userId);
    navigation.navigate('Home');
  }
  function select(name: string) {
    if (roomInfo.player1 === userId) {
      store.dispatch(battleActions.select_player1({ name }));
    } else {
      store.dispatch(battleActions.select_player2({ name }));
    }
    socketServer.emit('select', roomId, userId, name);
  }
  function ready() {
    socketServer.emit('ready', roomId, userId);
    setIsReady(!isReady)
  }
  function gamestart() {
    socketServer.emit('gamestart', roomId, userId);
  }

  React.useEffect(() => {
    store.dispatch(socketActions.set_room_id({ roomId }))
    socketServer.emit('getRoomInfo', roomId, userId);
  }, [])

  return roomInfo ? (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.roomInfo}>
          {roomId ? roomId: null}번방 ({roomInfo.headcount}/{roomInfo.maxHeadcount}) {roomInfo.roomname}
        </Text>
        <View style={{ borderBottomWidth: 1 }}></View>
      </View>
      <View style={style.halfContainer}>
        <View style={style.seat}>
          <Text style={style.userInfo}>{roomInfo.player1name}{roomInfo.host}</Text>
          <Text style={style.userInfo}>{roomInfo.player1Character ? `${roomInfo.player1Character}` : ''}</Text>
          <Text style={style.userInfo}>
            {roomInfo.host === roomInfo.player1
              ? '방장'
              : roomInfo.player1
              ? roomInfo.player1Ready
                ? '준비완료'
                : '준비안됨'
              : ''}
          </Text>
          <Image
            style={{ width: 70, height: 70 }}
            source={roomInfo.player1Character === '세키'
              ? require('../image/characterImg/Seki.gif')
              : roomInfo.player1Character === '레티'
                ? require('../image/characterImg/Reti.gif')
                : null}
          ></Image>
        </View>
        <View style={style.seat}>
          <Text style={style.userInfo}>{roomInfo.player2name}</Text>
          <Text style={style.userInfo}>{roomInfo.player2Character ? `${roomInfo.player2Character}` : ''}</Text>
          <Text style={style.userInfo}>
            {roomInfo.host === roomInfo.player2
              ? '방장'
              : roomInfo.player2
              ? roomInfo.player2Ready
                ? '준비완료'
                : '준비안됨'
              : ''}
          </Text>
          <Image
            style={{ width: 70, height: 70 }}
            source={roomInfo.player2Character === '세키'
              ? require('../image/characterImg/Seki.gif')
              : roomInfo.player2Character === '레티'
                ? require('../image/characterImg/Reti.gif')
                : null}
          ></Image>
        </View>
        <View style={style.select}>
          <Text>캐릭터 선택</Text>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <CustomButton
                title="세키"
                onPress={() => {
                  setCharacter('세키')
                  select('세키')
                }}
                style={style.selectButton}
              ></CustomButton>
            </View>
            <View>
              <CustomButton
                title="레티"
                onPress={() => {
                  setCharacter('레티')
                  select('레티')
                }}
                style={style.selectButton}
              ></CustomButton>
            </View>
          </View>
          <Image
            style={{ width: 165, height: 55 }}
            source={character === '세키'
              ? require('../image/characterImg/01_info.png')
              : character === '레티'
                ? require('../image/characterImg/02_info.png')
                : null}
          ></Image>
        </View>
      </View>
      <View style={style.halfContainer}>
        <CustomButton
          title={roomInfo.host === userId
            ? '게임시작'
            : isReady
              ? '준비해제'
              : '준비하기'}
          onPress={() => {
            if (character) {
              if (roomInfo.host === userId) {
                gamestart();
              } else {
                ready();
              }
            } else {
              alert('캐릭터를 선택해주세요.');
            }
          }}
          style={style.exit}
        ></CustomButton>
        <CustomButton
          title="방나가기"
          onPress={() => outRoom()}
          style={style.exit}
        ></CustomButton>
      </View>
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
  header: {
    flex: 0.4,
    width: 450,
  },
  halfContainer: {
    flex: 1,
    width: 450,
    flexDirection: 'row'
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
  exit: {
    borderWidth: 1,
    margin: 10,
    width: 100,
    height: 60,
    alignItems: 'center',
    backgroundColor: 'gray'
  },
  select: {
    alignItems: 'center',
    margin: 10,
    // borderWidth: 1,
    width: 170,
    height: 130,
  },
  selectButton: {
    margin: 3,
    borderWidth: 2,
    width: 40,
    height: 40
  }
});
