import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';
import CARD_DICTIONARY from '../common/CardDictionary';

export default function SetTurn() {
  const roomInfo = useSelector((state: any) => state.Socket.roomInfo);
  const player1 = useSelector((state: any) => state.Battle.player1)
  const player2 = useSelector((state: any) => state.Battle.player2)
  const [hand, setHand] = React.useState([CARD_DICTIONARY.NONE, CARD_DICTIONARY.NONE, CARD_DICTIONARY.NONE])
  const userId = useSelector((state: any) => state.Auth.userId);
  const [usedMana, setUsedMana] = React.useState(
    roomInfo.player1 === userId ? player1.mp : player2.mp,
  );

  return (
    <View style={style.container}>
      <View style={style.status}>
        <View style={style.player1info}>
          <Text>NAME: {roomInfo.player1Character + `(${roomInfo.player1name})`}</Text>
          <Text>HP: {player1.hp}</Text>
          <Text>
            MP: {roomInfo.player1 === userId ? `${usedMana}/` : null}{player1.mp}
          </Text>
        </View>
        <View style={style.player2info}>
          <Text>NAME: {roomInfo.player1Character + `(${roomInfo.player1name})`}</Text>
          <Text>HP: {player2.hp}</Text>
          <Text>
            MP: {roomInfo.player2 === userId ? `${usedMana}/` : null}{player1.mp}
          </Text>
        </View>
      </View>
      <View style={style.deck}>
        {player1.deck.slice(0, 5).map((card:any, id: number) => (
          <TouchableHighlight
            key={id}
            onPress={() => {
              for(let e in hand) {
                if(hand[e].type === 'NONE' && usedMana >= card.cost) {
                  hand[e] = card;
                  setHand(hand.slice(0, 3))
                  setUsedMana(usedMana - card.cost);
                  break;
                }
              }
            }}
          >
          <Image
            style={style.card}
            source={usedMana < card.cost ? card.darkImage : card.image}
          ></Image>
        </TouchableHighlight>
        ))}
      </View>
      <View style={style.deck}>
        {player1.deck.slice(5, 10).map((card:any, id: number) => (
          <TouchableHighlight
            key={id}
            onPress={() => {
              for(let e in hand) {
                if(hand[e].type === 'NONE' && usedMana >= card.cost) {
                  hand[e] = card;
                  setHand(hand.slice(0, 3))
                  setUsedMana(usedMana - card.cost);
                  break;
                }
              }
            }}
          >
            <Image
              style={style.card}
              source={usedMana < card.cost ? card.darkImage : card.image}
            ></Image>
          </TouchableHighlight>
        ))}
      </View>
      <View style={style.deck}>
        {hand.map((card: any, id: number) => (
          <TouchableHighlight
            key={id}
            onPress={() => {
              if(card.type !== 'NONE') {
                hand[id] = CARD_DICTIONARY.NONE;
                setHand(hand.slice(0, 3))
                setUsedMana(usedMana + card.cost);
              }
          }}>
            <Image
              style={style.card}
              source={card.image}
            ></Image>
          </TouchableHighlight>
        ))}
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
