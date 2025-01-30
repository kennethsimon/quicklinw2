import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import  Ionicons from 'react-native-vector-icons/Ionicons'; // For the call icon
import { Context as AuthContext } from '../../context/AppContext'; // Import AuthContext
import io from 'socket.io-client'; // Import socket.io-client
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Import useFocusEffect
import moment from 'moment'

const VideoCallList = () => {
  const [videoCalls, setVideoCalls] = useState([]); // State for video appointments
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { state } = useContext(AuthContext); // Access authentication state
  const [socket, setSocket] = useState(null); // Socket state
  const navigation = useNavigation();

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io('https://api.quickline.tech', {
      auth: {
        token: state?.user?.auth_token, // Authenticate with the user's token
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
      newSocket.disconnect(); // Clean up on unmount
    };
  }, []);

  // Fetch video appointments every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (socket) {
        // Emit an event to fetch user appointments
        socket.emit('fetchUserChats', state?.user?.user?._id);

        // Listen for the response containing the user's appointments
        socket.on('userChats', (chats) => {

          // Filter appointments to show only video appointments
          const filteredVideoCalls = chats.filter(
            (chat) => chat?.appointmentId?.appointmentType === 'video'
          );

          setVideoCalls(filteredVideoCalls); 
          setLoading(false); // Set loading to false
        });

        // Listen for errors
        socket.on('error', (error) => {
          console.error('WebSocket error:', error);
          setError(error.message); // Set error message
          setLoading(false); // Set loading to false
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

  // Render each video call item
  const renderItem = ({ item }) => (
    <View style={styles.videoCallItem}>
      {/* Avatar */}
      <Image
        source={{
          uri: 'https://placehold.jp/3d4070/ffffff/150x150.png?text=D',
        }}
        style={styles.avatar}
      />
      {/* Doctor Name and Date */}
      <View style={styles.detailsContainer}>
        <Text style={styles.doctorName}>
          {item?.participants?.find((p) => p?.participantModel === 'Doctors')
            ?.participantId?.full_name || 'Doctor'}
        </Text>
        <Text style={styles.date}>
          {moment(item?.appointmentId?.start_time).format('YYYY-MM-DD')}
        </Text>
      </View>
      {/* Call Icon */}
      <TouchableOpacity
        style={styles.callIconContainer}
        onPress={() => {
          // Navigate to the video call screen with Agora details
          navigation.navigate('ConsultationStack', {
            screen: 'VideoCallScreen', // Specify the screen within the stack
            params: {
              channelName: item?.appointmentId?.agoraChannelName || '', // Fallback to empty string if missing
              token: item?.appointmentId?.clientToken || '', // Fallback to empty string if missing
            },
          });
        }}
      >
        <Ionicons name="call" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
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

  // Render the list of video calls
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={videoCalls} // Use the filtered video appointments
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  videoCallItem: {
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
  detailsContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  callIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 161, 142, 1)', // #25A18E with full opacity
    justifyContent: 'center',
    alignItems: 'center',
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

export default VideoCallList;