import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SetTurn() {
  return (
    <View style={style.container}>
      <Text>턴을 준비한다.</Text>
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
});
