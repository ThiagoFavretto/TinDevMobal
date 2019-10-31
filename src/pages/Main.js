import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png';

export default function Main({navigation}) {
  const id = navigation.getParam('user');
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState();

  useEffect(() => {
    const loadUsers = async () => {
      const response = await api.get('/devs', {
        headers: {
          user: id,
        },
      });
      setUsers(response.data);
    };

    loadUsers();
  }, [id]);

  useEffect(() => {
    const socket = io('http://localhost:3333', {
      query: {user: id},
    });
    console.log(socket);
    socket.on('match', dev => {
      console.log('dev');
      setMatchDev(dev);
    });
  }, [id]);

  const handleLike = async () => {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/likes`, null, {
      headers: {user: id},
    });
    setUsers(rest);
  };

  const handleDisLike = async () => {
    const [user, ...rest] = users;

    await api.post(`/devs/${user._id}/dislikes`, null, {
      headers: {user: id},
    });

    setUsers(rest);
  };

  const handleLogaut = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogaut}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      <View style={styles.cardContainer}>
        {users.length === 0 ? (
          <Text style={styles.end}>Vazio ;-;</Text>
        ) : (
          users.map((user, i) => (
            <View key={i} style={[styles.card, {zIndex: users.length - i}]}>
              <Image style={styles.avatar} source={{uri: user.avatar}} />
              <View style={styles.footer}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.bio} numberOfLines={3}>
                  {user.bio}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDisLike}>
            <Image source={dislike} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like} />
          </TouchableOpacity>
        </View>
      )}

      {matchDev && (
        <View style={styles.matchContainer}>
          <Image source={itsamatch} alt="matchDev" style={styles.matchImage} />
          <Image
            source={{uri: matchDev.avatar}}
            alt="matchDevAvatar"
            style={styles.matchAvatar}
          />
          <Text>{matchDev.name}</Text>
          <Text>{matchDev.bio}</Text>
          <TouchableOpacity onPress={() => setMatchDev(false)}>
            <Text style={styles.closeMatch}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  avatar: {
    backgroundColor: '#fff',
    flex: 1,
    height: 300,
  },

  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18,
  },

  logo: {
    marginTop: 30,
  },

  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  end: {
    alignSelf: 'center',
    color: '#999',
    fontSize: 24,
    fontWeight: 'bold',
  },

  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, 0.8)',
  },

  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: '#fff',
    marginVertical: 30,
  },

  matchName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },

  matchImage: {
    resizeMode: 'contain',
    height: 60,
  },

  matchBio: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 30,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  closeMatch: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
});
