import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as api from '../api/Auth'

export default function Intro({ navigation }: any) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <View style={style.container}>
      <Text style={style.title}>검투의 요정</Text>
      <View style={style.form}>
        <TextInput
          style={style.input}
          placeholder="example@example.com"
          onChangeText={(email) => {
            setEmail(email)
          }}
        ></TextInput>
        <TextInput
          style={style.input}
          placeholder="password"
          onChangeText={(password) => {
            setPassword(password)
          }}
        ></TextInput>
        <Button
          title="log in"
          onPress={() => {
            console.log(email,password)
            api.signin(email, password, navigation)
          }}
        />
      </View>
      <View style={{ margin: 3 }}></View>
      <Button
        title="sign up"
        onPress={()=> {
          // e.preventDefault()
        }}></Button>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    padding: 60,
    fontSize: 30,
  },
  form: {
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'rgb(245, 245, 245)',
    width: 300,
    height: 140,
  },
  input: {
    margin: 3,
    textAlignVertical: 'top',
    borderWidth: 1,
    width: 280,
    height: 40,
    padding: 5,
  },
});
