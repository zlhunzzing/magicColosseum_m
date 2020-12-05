import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home() {

  return (
    <View style={style.container}>
      <Text>여기는 홈</Text>
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
