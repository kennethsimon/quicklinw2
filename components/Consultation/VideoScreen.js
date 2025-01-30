import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';

const VideoCallScreen = ({ route, navigation }) => {
  const { channelName, token } = route.params; // Get channelName and token from navigation params
  const [videoCall, setVideoCall] = useState(true); // Automatically start the call

  // Agora connection data
  const connectionData = {
    appId: '299bcbd0fa314689854ed9f963d4bffd', // Replace with your Agora App ID
    channel: channelName, // Dynamic channel name
    token: token, // Dynamic token
  };


  // Callback for ending the call
  const rtcCallbacks = {
    EndCall: () => {
      setVideoCall(false); // Set videoCall to false when the call ends
      // Optionally, navigate back to the previous screen
      navigation.goBack();
    },
  };

  // Check for missing channelName or token
  if (!channelName || !token) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Invalid video call details. Please try again.
        </Text>
      </View>
    );
  }

  return channelName ? (
        // Render Agora UIKit if videoCall is true
        <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
      ) : (
        // Render a message if the call has ended
        <Text style={styles.endCallText}>Call ended.</Text>
      )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  endCallText: {
    fontSize: 18,
    color: '#333',
  },
});

export default VideoCallScreen;