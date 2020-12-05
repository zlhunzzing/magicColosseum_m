import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

/* pages */
import Intro from './page/Intro'
import Home from './page/Home'


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro" headerMode="none" >
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;