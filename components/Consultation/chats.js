import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Context as AuthContext } from '../../context/AppContext';
import { ScrollView } from 'native-base';
import io from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  console.log(chats[0]?.appointmentId);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io('https://api.quickline.tech', {
      auth: {
        token: state?.user?.auth_token,
      },
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch chats every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (socket) {
        // Emit an event to fetch user chats
        socket.emit('fetchUserChats', state?.user?.user?._id);

        // Listen for the response containing the user's chats
        socket.on('userChats', (chats) => {
          setChats(chats);
          setLoading(false);
        });

        // Listen for errors
        socket.on('error', (error) => {
          console.error('WebSocket error:', error);
          setError(error.message);
          setLoading(false);
        });
      }

      // Clean up the event listeners when the screen loses focus
      return () => {
        if (socket) {
          socket.off('userChats');
          socket.off('error');
        }
      };
    }, [socket])
  );

  // Filter chats to show only those with appointmentType === 'chat'
  const filteredChats = chats.filter(
    (chat) => chat.appointmentId?.appointmentType === 'chat'
  );

  // Render each chat item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('Chatscreen', {
          chat: item,
          doctorId: item?.participants?.find(
            (app) => app?.participantModel === 'Doctors'
          )?._id,
        })
      }
    >
      <Image
        source={{
          uri:
            item.participants.find((p) => p.participantModel === 'Doctors')
              ?.participantId?.avatar ||
            'https://placehold.jp/3d4070/ffffff/150x150.png?text=D',
        }}
        style={styles.avatar}
      />
      <View style={styles.chatDetails}>
        <Text style={styles.name}>
          {item.participants.find((p) => p.participantModel === 'Doctors')
            ?.participantId?.full_name || 'Doctor'}
        </Text>
        <Text style={styles.recentMessage}>
          {item.messages.length > 0
            ? item.messages[item.messages.length - 1].message
            : 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Render the list of chats
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView horizontal={false}>
        <FlatList
          data={filteredChats} // Use the filtered chats
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  chatDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  recentMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default ChatList;