import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('chat');

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
        onPress={() => handleTabPress('chat')}
      >
        <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'video' && styles.activeTab]}
        onPress={() => handleTabPress('video')}
      >
        <Text style={[styles.tabText, activeTab === 'video' && styles.activeTabText]}>Video Calls</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#25A18E', // Green background for the tab container
    paddingVertical: 0,
    width: '100%'
  },
  tab: {
    padding: 10,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeTab: {
    borderBottomWidth: 3,
    marginVertical: 0,
    flex: 1,
    borderBottomColor: '#FFFFFF', // White bottom border for the active tab
  },
  tabText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#FFFFFF', // White text color for inactive tabs
  },
  activeTabText: {
    marginVertical: 5,
    fontWeight: 'bold', // Bold text for the active tab
  },
});

export default CustomTabs;