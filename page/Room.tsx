import * as React from 'react';
import { View, StyleSheet, Text, Image, BackHandler, Modal } from 'react-native';
import { useSelector } from 'react-redux';
import store from '../redux';
import * as socketActions from '../redux/Socket'
import { CustomButton } from '../component/CustumButton'
import * as battleActions from '../redux/Battle';
import { FlatList, TextInput } from 'react-native-gesture-handler';

export default function Room({ route, navigation, props }: any) {
  const socketServer = store.getState().Socket.socketServer
  const roomId = route.params[0];
  const userId = useSelector((state: any) => state.Auth.userId);
  const roomInfo = useSelector((state: any) => state.Socket.roomInfo);
  const [modalVisible, setModalVisible] = React.useState(false)
  const [character, setCharacter] = React.useState('');
  const [isReady, setIsReady] = React.useState(false)
  const [content, setContent] = React.useState('')
  const messages = useSelector((state: any) => state.Socket.messages)

  function outRoom() {
    store.dispatch(socketActions.reset_messages())
    socketServer.emit('outRoom', roomId, userId);
    socketServer.emit('rooms');
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
  function sendMessage() {
    let username
    if(roomInfo.player1 === userId) username = roomInfo.player1name
    if(roomInfo.player2 === userId) username = roomInfo.player2name
    socketServer.emit('sendMessage', roomId, content, username);
    // setContent('');
  }

  React.useEffect(() => {
    store.dispatch(socketActions.set_room_id({ roomId }))
    socketServer.emit('getRoomInfo', roomId, userId);

    let prevInfo = store.getState().Socket.roomInfo
    if (prevInfo) {
      // setIsReady(false)
      if (prevInfo.player1 === userId) setCharacter(prevInfo.player1Character)
      if (prevInfo.player2 === userId) setCharacter(prevInfo.player1Character)
    }

    BackHandler.addEventListener('hardwareBackPress', () => {
      setModalVisible(true)
      return true;
    })
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
        <View style={style.chatBar}>
          <View style={style.chatBox}>
            <FlatList
              data={messages}
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={({ item }: any) => (
                <Text>{`${item.username}: ${item.message}`}</Text>
              )}
            ></FlatList>
          </View>
            <TextInput
            style={style.chatInput}
            onChangeText={(content) => {
              setContent(content)
            }}
            ></TextInput>
          </View>

          <CustomButton
            title="채팅입력"
            onPress={() => sendMessage()}
            style={style.chatInputBtn}
          ></CustomButton>
          <View>
          <CustomButton
            title={roomInfo.host === userId
              ? '게임시작'
              : roomInfo.player1 === userId
                ? roomInfo.player1Ready
                  ? '준비해제'
                  : '준비하기'
                : roomInfo.player2Ready
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

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <Text>방을 나가시겠습니까?</Text>
            <CustomButton
              title='예'
              onPress={() => {
                setModalVisible(false)
                outRoom()
              }}
            ></CustomButton>
            <CustomButton
              title='아니오'
              onPress={() => {
                setModalVisible(false)
              }}
            ></CustomButton>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
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
    width: 80,
    height: 40,
    alignItems: 'center',
    backgroundColor: 'gray',
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  chatBar: {
    margin: 10,
    borderWidth: 1,
    width: 300,
    height: 100
  },
  chatBox: {
    width: 300,
    height: 75,
    borderBottomWidth: 1,
    padding: 3,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  chatInput: {
    textAlignVertical: 'top',
    width: 298,
    height: 23,
    padding: 5,
    backgroundColor: 'rgb(245, 245, 245)'
  },
  chatInputBtn: {
    borderWidth: 1,
    marginTop: 10,
    width: 30,
    height: 100
  }
});
