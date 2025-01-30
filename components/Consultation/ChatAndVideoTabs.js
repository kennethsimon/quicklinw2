import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomTabs from './CustomTabs';
import ChatList from './chats';
import VideoCallList from './VideoCallList';

const ChatAndVideoTabs = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <View style={styles.container}>
      <CustomTabs onTabChange={(tab) => setActiveTab(tab)} />
      {activeTab === 'chat' ? <ChatList navigation={navigation} /> : <VideoCallList />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ChatAndVideoTabs;