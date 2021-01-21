import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, Alert, BackHandler } from 'react-native';
import { useSelector } from 'react-redux';
import CARD_DICTIONARY from '../common/CardDictionary';
import * as battleActions from '../redux/Battle'
import { CustomButton } from '../component/CustumButton'
import store from '../redux';
import { imageRequires } from '../common/CardDictionary'

export default function SetTurn() {
  const roomInfo = useSelector((state: any) => state.Socket.roomInfo);
  const player1 = useSelector((state: any) => state.Battle.player1)
  const player2 = useSelector((state: any) => state.Battle.player2)
  const userId = useSelector((state: any) => state.Auth.userId);
  const deck = roomInfo.player1 === userId ? player1.deck : player2.deck
  const hand = useSelector((state: any) => state.Battle.hand)
  const [usedMana, setUsedMana] = React.useState(
    roomInfo.player1 === userId ? player1.mp : player2.mp,
  );
  const [isSet, setIsSet] = React.useState(false)
  const socketServer = store.getState().Socket.socketServer
  const field = useSelector((state: any) => state.Battle.field)
  function checkHand(card: any) {
    for (let i = 0; i < hand.length; i++) {
      if (hand[i].id === card.id) {
        return true;
      }
    }
    return false;
  }
  function emitSetTurn() {
    socketServer.emit('setHand', roomInfo.id, userId, hand)
    socketServer.emit('setTurn', roomInfo.id, userId);
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return false
    })
  })

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

      <View style={style.deck}>
        {deck.slice(0, 5).map((card:any, id: number) => (
          <TouchableHighlight
            key={id}
            onPress={() => {
              for(let e in hand) {
                if(hand[e].type === 'NONE' &&
                  usedMana >= card.cost &&
                  !checkHand(card)
                ) {
                  hand[e] = card;
                  store.dispatch(battleActions.set_hand({ hand: hand.slice() }))
                  setUsedMana(usedMana - card.cost);
                  break;
                }
              }
            }}
            activeOpacity={checkHand(card) ? 0 : 1}
          >
          <Image
            style={checkHand(card) ? { ...style.card, opacity: 0 } : style.card}
            source={usedMana < card.cost
              ? (imageRequires as any)[card.darkImage]
              : (imageRequires as any)[card.image]}
          ></Image>
        </TouchableHighlight>
        ))}
      </View>
      <View style={style.deck}>
        {deck.slice(5, 10).map((card:any, id: number) => (
          <TouchableHighlight
            key={id}
            onPress={() => {
              for(let e in hand) {
                if(hand[e].type === 'NONE' &&
                  usedMana >= card.cost &&
                  !checkHand(card)
                ) {
                  hand[e] = card;
                  store.dispatch(battleActions.set_hand({ hand: hand.slice() }))
                  setUsedMana(usedMana - card.cost);
                  break;
                }
              }
            }}
            activeOpacity={checkHand(card) ? 0 : 1}
          >
            <Image
              style={checkHand(card) ? { ...style.card, opacity: 0 } : style.card}
              source={usedMana < card.cost
                ? (imageRequires as any)[card.darkImage]
                : (imageRequires as any)[card.image]}
            ></Image>
          </TouchableHighlight>
        ))}
      </View>

      <View style={style.bottomContainer}>
        <View style={style.setTurn}>
          <View style={{ alignItems: 'center' }}>
            <View style={style.deck}>
              {hand.map((card: any, id: number) => (
                <TouchableHighlight
                  key={id}
                  onPress={() => {
                    if(card.type !== 'NONE' && !isSet) {
                      hand[id] = CARD_DICTIONARY.NONE;
                      store.dispatch(battleActions.set_hand({ hand: hand.slice() }))
                      setUsedMana(usedMana + card.cost);
                    }
                }}>
                  <Image
                    style={style.card}
                    source={(imageRequires as any)[card.image]}
                  ></Image>
                </TouchableHighlight>
              ))}
            </View>
            {!isSet ? (
              <CustomButton
                title='준비완료'
                onPress={() => {
                  for(let e in hand) {
                    if(hand[e].type === 'NONE') {
                      Alert.alert('카드 세장을 선택해주세요.')
                      return;
                    }
                  }
                  // setIsSet(true)
                  emitSetTurn()
                }}
                style={{ margin: 5, borderWidth: 1, width: 75, alignItems: 'center' }}
              ></CustomButton>
            ) : (
              <Text style={{ margin: 10 }}>상대가 준비중입니다...</Text>
            )}
          </View>
        </View>

        <View style={style.field}>
          {field
            ? field.map((floor: any, floorId: number) => (
                <View key={floorId}>
                  {floor.map((room: any, roomId: number) => (
                    <View
                      key={roomId}
                      style={style.room}
                    >
                      <View style={{ alignItems: 'flex-start' }}>
                        {player1.position.x === floorId &&
                          player1.position.y === roomId ? (
                            <Text>{player1.name}</Text>
                        ) : null}
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          {player2.position.x === floorId &&
                            player2.position.y === roomId ? (
                              <Text>{player2.name}</Text>
                          ) : null}
                        </View>
                    </View>
                  ))}
                </View>
              ))
            : null}
        </View>
      </View>

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
  deck: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    margin: 2,
    width: 50,
    height: 65,
  },
  bottomContainer: { 
    marginTop: 15,
    flexDirection: 'row',
    width: 500
  },
  setTurn: {
    alignItems: 'flex-end',
    width: 330
  },
  field: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'flex-end',
  },
  room: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 0.5,
    width: 40,
    height: 30
  },
});
