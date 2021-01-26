import * as React from 'react';
import { View, Text, StyleSheet, Image, Modal, BackHandler } from 'react-native';
import { useSelector } from 'react-redux';
import store from '../redux';
import { CARD_DICTIONARY } from '../common/CardDictionary';
import * as battleActions from '../redux/Battle'
import { PhaseNumber } from '../common/interface/BattleInterface';
import { cardRanges } from '../common/CardDictionary'
import { CustomButton } from '../component/CustumButton'
import { imageRequires } from '../common/CardDictionary'
// import { Audio } from 'expo-av'

export default function Field({ navigation }: any) {
  const roomInfo = useSelector((state: any) => state.Socket.roomInfo);
  const player1 = useSelector((state: any) => state.Battle.player1)
  const player2 = useSelector((state: any) => state.Battle.player2)
  const field = useSelector((state: any) => state.Battle.field)
  const [modalVisible, setModalVisible] = React.useState(false)
  const [modalText, setModalText] = React.useState('')
  const usingCard = useSelector((state: any) => state.Battle.usingCard);
  const [isUsing, setIsUsing] = React.useState([
    [false, false],
    [false, false],
    [false, false],
  ]);
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
      if (continueTurn) {
        player1.mp += 15
        player1Acting(player1)
        player2.mp += 15
        player2Acting(player2)
        navigation.navigate('SetTurn')
      }
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
    const isUsings = [
      [
        [false, true],
        [false, false],
        [true, false],
      ],
      [
        [false, false],
        [true, true],
        [false, false],
      ],
      [
        [true, false],
        [false, false],
        [false, true],
      ],
    ];
    setIsUsing(isUsings[phaseNumber].slice());
    player1.def = 0
    player1Acting(player1)
    player2.def = 0
    player2Acting(player2)
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
    store.dispatch(battleActions.clear_field())
    store.dispatch(battleActions.set_using_card({ usingCard: card }))
    eneme.isAction = false;
    enemeActing(eneme)
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
        user.isAction = true
        user.mp = user.mp - card.cost;
        userActing(user)
        const cardRange = (cardRanges as any)[card.range]
        for (let i = 0; i < cardRange.length; i++) {
          let targetX = user.position.x + cardRange[i][0];
          let targetY = user.position.y + cardRange[i][1];
          if (
            targetX <= 3 &&
            targetX >= 0 &&
            targetY <= 2 &&
            targetY >= 0 &&
            field[targetX][targetY]
          ) {
            const field2 = store.getState().Battle.field.slice()
            field2[targetX][targetY].effect = true;
            store.dispatch(battleActions.set_field({ field: field2.slice() }))
            if (targetX === eneme.position.x && targetY === eneme.position.y) {
              eneme.hp = eneme.hp - (card.power - eneme.def)
              enemeActing(eneme)
            }
          }
        }
        break;
      case CARD_DICTIONARY.MANA_UP.type:
        user.isAction = true
        user.mp += 15
        if (user.mp >= 100) user.mp = 100;
        userActing(user)
        break;
      case CARD_DICTIONARY.GUARD.type:
        user.isAction = true
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
  // const [recording, setRecording] = React.useState<any>();
  // async function startRecording() {
  //   try {
  //     console.log('Requesting permissions..');
  //     await Audio.requestPermissionsAsync();
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     }); 
  //     console.log('Starting recording..');
  //     const recording = new Audio.Recording();
  //     await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
  //     await recording.startAsync(); 
  //     setRecording(recording);
  //     console.log('Recording started');
  //   } catch (err) {
  //     console.error('Failed to start recording', err);
  //   }
  // }

  // async function stopRecording() {
  //   console.log('Stopping recording..');
  //   setRecording(undefined);
  //   await recording.stopAndUnloadAsync();
  //   const uri = recording.getURI(); 
  //   console.log('Recording stopped and stored at', uri);
  // }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return false
    })
    turn()
  }, [])

  // const [sound, setSound] = React.useState<any>()
  // const playSound = async () => {
  //   sound.playAsync();
  // }
  // React.useEffect(() => {
  //   Audio.setAudioModeAsync({
  //     allowsRecordingIOS: false,
  //     interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  //     playsInSilentModeIOS: true,
  //     interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
  //     shouldDuckAndroid: true,
  //     staysActiveInBackground: true,
  //     playThroughEarpieceAndroid: true
  //   })

  //   const sound = new Audio.Sound()

  //   const status = { shouldPlay: false }

  //   sound.loadAsync(require('../assets/soso.mp3'))

  //   setSound(sound)
  // }, [])


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
                    style={room.effect
                      ? { ...style.room, backgroundColor: 'coral' }
                      : style.room}
                  >
                    <View style={{ width: 60, alignItems: 'flex-start' }}>
                      {player1.position.x === floorId &&
                        player1.position.y === roomId ? (
                          <Image
                            style={
                              player1.isAction
                                ? style.action
                                : { width: 40, height: 40 }
                            }
                            source={
                              player1.isAction
                                ? (imageRequires as any)[usingCard.actionImage]
                                : player1.name === '세키'
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
                              style={
                                player2.isAction
                                  ? style.action
                                  : { width: 40, height: 40 }
                              }
                              source={
                                player2.isAction
                                  ? (imageRequires as any)[usingCard.actionImage]
                                  : player2.name === '세키'
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

      <View style={{ flexDirection: 'row'}}>
        <View style={{ flexDirection: 'row', paddingRight: 20 }}>
          {player1.hand
            .slice()
            .reverse()
            .map((card: any, id: number) => (
            <Image
              key={id}
              style={{ margin: 2, width: 50, height: 65 }}
              source={isUsing[id][0]
                ? (imageRequires as any)[card.image]
                :  (imageRequires as any)[CARD_DICTIONARY.NONE.image]}
            ></Image>
          ))}
        </View>
        <View style={{ flexDirection: 'row'}}>
          {player2.hand.map((card: any, id: number) => (
            <Image
              key={id}
              style={{ margin: 2, width: 50, height: 65 }}
              source={isUsing[id][1]
                ? (imageRequires as any)[card.image]
                :  (imageRequires as any)[CARD_DICTIONARY.NONE.image]}
            ></Image>
          ))}
        </View>
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
  action: {
    width: 70,
    height: 70,
    transform: [{ translateY: -40 }]
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
