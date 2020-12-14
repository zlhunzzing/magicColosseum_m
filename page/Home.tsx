import * as React from 'react';
import { View, StyleSheet, Button, Modal, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import store from '../redux';
import { CustomButton } from '../component/CustumButton'
import { TextInput } from 'react-native-gesture-handler';
import * as api from '../api/Room'

export default function Home({ navigation }: any) {
  const socketServer = store.getState().Socket.socketServer
  const userId = useSelector((state: any) => state.Auth.userId);
  const rooms = useSelector((state: any) => state.Socket.rooms);
  const [modalVisible, setModalVisible] = React.useState(false)
  const [roomname, setRoomname] = React.useState('')

  function createRoom() {
    api.createRoom(roomname, navigation)
    socketServer.emit('rooms');
  }
  function inRoom(roomId: number) {
    api.inRoom(roomId, navigation);
    socketServer.emit('rooms');
  }

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
              inRoom(room.id)
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
            setModalVisible(true)
          }}
        />
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          Alert.alert("창이 열려있습니다.");
        }}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <TextInput
              style={style.input}
              placeholder="방제목"
              onChangeText={(roomname) => {
                setRoomname(roomname)
              }}
            ></TextInput>
            <CustomButton
              title='방만들기'
              onPress={() => {
                setModalVisible(false)
                createRoom()
              }}
            ></CustomButton>
            <View style={{ margin: 3 }}></View>
            <CustomButton
              title='취소'
              onPress={() => {
                setModalVisible(false)
                setRoomname('')
              }}
            ></CustomButton>
          </View>
        </View>
      </Modal>
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
  input: {
    margin: 3,
    textAlignVertical: 'top',
    borderWidth: 1,
    width: 200,
    height: 30,
    padding: 5,
    backgroundColor: 'rgb(245, 245, 245)',
  },
  placeholder: {
    alignItems: 'center'
  }
});
