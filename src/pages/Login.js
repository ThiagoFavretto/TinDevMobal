import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import logo from '../assets/logo.png';
import api from '../services/api';
import AssyncStorage from '@react-native-community/async-storage';

export default function Login({navigation}) {
  const [user, setUser] = useState('');

  useEffect(() => {
    AssyncStorage.getItem('user').then(user => {
      if (user) {
        navigation.navigate('Main', {user});
      }
    });
  }, []);

  const handleLogin = async () => {
    const response = await api.post('/devs', {
      username: user,
    });

    const {_id} = response.data;

    await AssyncStorage.setItem('user', _id);

    navigation.navigate('Main', {user: _id});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      enabled={Platform.OS === 'ios'}>
      <Image source={logo}></Image>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite seu usúario do GitHub"
        placeholderTextColor="#999"
        style={styles.input}
        value={user}
        onChangeText={setUser}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  input: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ddd',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    marginTop: 20,
    paddingHorizontal: 15,
  },

  button: {
    height: 46,
    alignSelf: 'stretch',
    backgroundColor: '#df4723',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
