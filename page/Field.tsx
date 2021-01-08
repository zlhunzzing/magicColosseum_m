import * as React from 'react';
import { View, Text, StyleSheet, Image, Modal, BackHandler } from 'react-native';
import { useSelector } from 'react-redux';
import store from '../redux';
import { CARD_DICTIONARY } from '../common/CardDictionary';
import * as battleActions from '../redux/Battle'
import { PhaseNumber } from '../common/interface/BattleInterface';
import { cardRanges } from '../common/CardDictionary'
import { CustomButton } from '../component/CustumButton'

export default function Field({ navigation }: any) {
  const roomInfo = useSelector((state: any) => state.Socket.roomInfo);
  const player1 = useSelector((state: any) => state.Battle.player1)
  const player2 = useSelector((state: any) => state.Battle.player2)
  const [field, setField] = React.useState(store.getState().Battle.field);
  const [modalVisible, setModalVisible] = React.useState(false)
  const [modalText, setModalText] = React.useState('')
  function turn() {
    let firstPhase = false;
    let middlePhase = false;
    let lastPhase = false;
    let continueTurn = false;

    firstPhase = !firstPhase;
    if (firstPhase) phase(PhaseNumber.FIRST)

    setTimeout(() => {
      middlePhase = turnCheck()
      if (middlePhase) {
        phase(PhaseNumber.MIDDLE)
      }
    }, 2000)

    setTimeout(() => {
      lastPhase = turnCheck()
      if (lastPhase) {
        phase(PhaseNumber.LAST)

      }
    }, 4000)

    setTimeout(() => {
      continueTurn = turnCheck()
      if (continueTurn) navigation.navigate('SetTurn')
    }, 6000)
  }
  function turnCheck() {
    if(player1.hp <= 0 && player2.hp <= 0) {
      setModalText('무승부')
      setModalVisible(true)
      return false
    }
    if(player1.hp <= 0) {
      setModalText(`${player1.name} 승리`)
      setModalVisible(true)
      return false
    }
    if(player2.hp <= 0) {
      setModalText(`${player2.name} 승리`)
      setModalVisible(true)
      return false
    }
    return true
  }
  function phase(phaseNumber: PhaseNumber) {
    let firstUser: any
    let lastUser: any
    let firstActing: any
    let lastActing: any
    if (player1.hand[phaseNumber].speed <= player2.hand[phaseNumber].speed) {
      firstUser = player1
      lastUser = player2
      firstActing = player1Acting
      lastActing = player2Acting
    } else {
      firstUser = player2
      lastUser = player1
      firstActing = player2Acting
      lastActing = player1Acting
    }
    cardAction(
      firstUser.hand[phaseNumber],
      firstUser,
      firstActing,
      lastUser,
      lastActing
    );
    setTimeout(
      () =>
        cardAction(
          lastUser.hand[phaseNumber],
          lastUser,
          lastActing,
          firstUser,
          firstActing
        ),
      1000,
    );
  }
  function cardAction(
    card: any,
    user: any,
    userActing: any,
    eneme: any,
    enemeActing: any,
  ) {
    switch (card.type) {
      case CARD_DICTIONARY.UP.type:
        user.position.y = user.position.y - 1;
        if (user.position.y < 0) user.position.y = 0;
        userActing(user)
        break;
      case CARD_DICTIONARY.DOWN.type:
        user.position.y = user.position.y + 1;
        if (user.position.y > 2) user.position.y = 2;
        userActing(user)
        break;
      case CARD_DICTIONARY.LEFT.type:
        user.position.x = user.position.x - 1;
        if (user.position.x < 0) user.position.x = 0;
        userActing(user)
        break;
      case CARD_DICTIONARY.RIGHT.type:
        user.position.x = user.position.x + 1;
        if (user.position.x > 3) user.position.x = 3;
        userActing(user)
        break;
      case 'ATT':
        user.mp = user.mp - card.cost;
        userActing(user)
        const cardRange = (cardRanges as any)[card.range]
        for (let i = 0; i < cardRange.length; i++) {
          let targetX = user.position.x + cardRange[i][0];
          let targetY = user.position.y + cardRange[i][1];
          if (targetX === eneme.position.x && targetY === eneme.position.y) {
            eneme.hp = eneme.hp - (card.power - eneme.def)
            eneme.def = 0
            enemeActing(eneme)
          }
        }
        break;
      case CARD_DICTIONARY.MANA_UP.type:
        user.mp += 15
        if (user.mp >= 100) user.mp = 100;
        userActing(user)
        break;
      case CARD_DICTIONARY.GUARD.type:
        user.def = 15
        userActing(user)
        break;
    }
  }
  function player1Acting(patch: any) {
    store.dispatch(battleActions.set_player1({ player1: patch }))
  }
  function player2Acting(patch: any) {
    store.dispatch(battleActions.set_player2({ player2: patch }))
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return false
    })
    
    turn()
  }, [])

  return (
    <View style={style.container}>
      {roomInfo ? (
        <View style={style.status}>
          <View style={style.player1info}>
            <Text>NAME: {roomInfo.player1Character + `(${roomInfo.player1name})`}</Text>
            <Text>HP: {player1.hp}</Text>
            <Text>
              MP: {player1.mp}
            </Text>
          </View>
          <View style={style.player2info}>
            <Text>NAME: {roomInfo.player2Character + `(${roomInfo.player2name})`}</Text>
            <Text>HP: {player2.hp}</Text>
            <Text>
              MP: {player2.mp}
            </Text>
          </View>
        </View>
       ) : null}

      <View style={style.field}>
        {field
          ? field.map((floor: any, floorId: number) => (
              <View key={floorId}>
                {floor.map((room: any, roomId: number) => (
                  <View
                    key={roomId}
                    style={style.room}
                  >
                    <View style={{ width: 60, alignItems: 'flex-start' }}>
                      {player1.position.x === floorId &&
                        player1.position.y === roomId ? (
                          <Image
                            style={{ width: 40, height: 40 }}
                            source={
                              player1.name === '세키'
                              ? require('../image/characterImg/Seki.gif')
                              : require('../image/characterImg/Reti.gif')
                            }
                          ></Image>
                      ) : null}
                      </View>
                      <View style={{ width: 60, alignItems: 'flex-end' }}>
                        {player2.position.x === floorId &&
                          player2.position.y === roomId ? (
                            <Image
                              style={{ width: 40, height: 40 }}
                              source={
                                player2.name === '세키'
                                ? require('../image/characterImg/Seki.gif')
                                : require('../image/characterImg/Reti.gif')
                              }
                            ></Image>
                        ) : null}
                      </View>
                  </View>
                ))}
              </View>
            )) 
          : null}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => {
          alert("창이 열려있습니다.");
        }}
      >
        <View style={style.centeredView}>
          <View style={style.modalView}>
            <Text>{modalText}</Text>
            <CustomButton
              title='확인'
              onPress={() => {
                // setModalVisible(false)
                navigation.navigate('Room')
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
    backgroundColor: 'white',
    alignItems:'center'
  },
  status: {
    flexDirection: 'row',
    marginTop: 30,
  },
  player1info: {
    // paddingHorizontal: 40,
    alignItems: 'flex-start',
  },
  player2info: {
    width: 400,
    alignItems: 'flex-end',
  },
  field: {
    flexDirection: 'row',
    margin: 20,
  },
  room: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    width: 145,
    height: 50
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
});
