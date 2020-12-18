import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';

export default function SetTurn() {
  const roomInfo = useSelector((state: any) => state.Socket.roomInfo);
  const player1 = useSelector((state: any) => state.Battle.player1)
  const player2 = useSelector((state: any) => state.Battle.player2)
  console.log(player1.deck)

  return (
    <View style={style.container}>
      <View style={style.status}>
        <View style={style.player1info}>
          <Text>NAME: {roomInfo.player1Character + `(${roomInfo.player1name})`}</Text>
          <Text>HP: {player1.hp}</Text>
          <Text>MP: {player1.mp}</Text>
        </View>
        <View style={style.player2info}>
          <Text>NAME: {roomInfo.player1Character + `(${roomInfo.player1name})`}</Text>
          <Text>HP: {player2.hp}</Text>
          <Text>MP: {player2.mp}</Text>
        </View>
      </View>
      <View style={style.deck}>
        {player1.deck.slice(0, 5).map((card:any, id: number) => (
          <Image
            key={id}
            style={style.card}
            source={card.image}
          ></Image>
        ))}
      </View>
      <View style={style.deck}>
        {player1.deck.slice(5, 10).map((card:any, id: number) => (
          <Image
            key={id}
            style={style.card}
            source={card.image}
          ></Image>
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
