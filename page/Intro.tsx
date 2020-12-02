import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';

export default function Intro({ navigation }: any) {
  return (
    <View style={style.container}>
      <Text>Home Screen</Text>
      {/* <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      /> */}
      </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
