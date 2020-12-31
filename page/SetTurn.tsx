import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import CARD_DICTIONARY from '../common/CardDictionary';
import { CustomButton } from '../component/CustumButton'
import store from '../redux';
import { imageRequires } from '../common/CardDictionary'

export default function SetTurn() {
  const roomInfo = useSelector((state: any) => state.Socket.roomInfo);
  const player1 = useSelector((state: any) => state.Battle.player1)
  const player2 = useSelector((state: any) => state.Battle.player2)
  const userId = useSelector((state: any) => state.Auth.userId);
  const deck = roomInfo.player1 === userId ? player1.deck : player2.deck
  const [hand, setHand] = React.useState([CARD_DICTIONARY.NONE, CARD_DICTIONARY.NONE, CARD_DICTIONARY.NONE])
  const [usedMana, setUsedMana] = React.useState(
    roomInfo.player1 === userId ? player1.mp : player2.mp,
  );
  const [isSet, setIsSet] = React.useState(false)
  const socketServer = store.getState().Socket.socketServer
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
                  setHand(hand.slice(0, 3))
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
                  setHand(hand.slice(0, 3))
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
        {hand.map((card: any, id: number) => (
          <TouchableHighlight
            key={id}
            onPress={() => {
              if(card.type !== 'NONE' && !isSet) {
                hand[id] = CARD_DICTIONARY.NONE;
                setHand(hand.slice(0, 3))
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
            style={{ margin: 10, borderWidth: 1, width: 75, alignItems: 'center' }}
          ></CustomButton>
        ) : (
          <Text style={{ margin: 10 }}>상대가 준비중입니다...</Text>
        )}
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
  }
});
