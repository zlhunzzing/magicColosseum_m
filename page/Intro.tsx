import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as api from '../api/Auth'

export default function Intro({ navigation }: any) {
  const [isSignup, setIsSignup] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={{ fontSize: 30 }}>검투의 요정</Text>
      </View>
      {!isSignup ? (
        <View style={style.form}>
        <Text style={{ fontSize: 20 }}>로그인</Text>
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
          title="로그인"
          onPress={() => {
            api.signin(email, password, navigation)
          }}
        />
        <View style={{ margin: 3 }}></View>
        <Button
          title="회원가입"
          onPress={() => {
            setIsSignup(true)
          }}
          />
      </View>
      ) : (
        <View style={style.form}>
        <Text style={{ fontSize: 20 }}>회원가입</Text>
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
        <TextInput
          style={style.input}
          placeholder="username"
          onChangeText={(username) => {
            setUsername(username)
          }}
        ></TextInput>
        <Button
          title="뒤로가기"
          onPress={() => {
            setIsSignup(false)
          }}
        />
        <View style={{ margin: 3 }}></View>
        <Button
          title="가입하기"
          onPress={() => {
            api.signup(email, password, username, setIsSignup)
          }}
        />
        </View>
     )}
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
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    flex: 2,
    alignItems: 'center',
  },
  input: {
    margin: 3,
    textAlignVertical: 'top',
    borderWidth: 1,
    width: 250,
    height: 30,
    padding: 5,
    backgroundColor: 'rgb(245, 245, 245)'
  },
});
