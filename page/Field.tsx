import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Field() {
  return (
    <View style={style.container}>
      <Text>this is field</Text>
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
