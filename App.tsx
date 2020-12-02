import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

/* pages */
import Intro from './page/Intro'

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro" headerMode="none" >
        <Stack.Screen name="Intro" component={Intro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;