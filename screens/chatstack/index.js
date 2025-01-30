import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ChatScreen from '../../components/Consultation/Chatscreen';
import ChatAndVideoTabs from '../../components/Consultation/ChatAndVideoTabs';
// import ChatScreen from '../../components/Consultation/Chatscreen';

const Stack = createNativeStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator
      initialRouteName="Chat"
      screenOptions={{
        headerShadowVisible: false,
        animation: 'none'
      }}>
<Stack.Screen
        name="Chat"
        component={ChatAndVideoTabs}
        options={({navigation}) => ({
          title: null,
        })}
      />
      <Stack.Screen
        name="Chatscreen"
        component={ChatScreen}
        options={({navigation}) => ({
          title: null,
        })}
      />
    </Stack.Navigator>
  );
}

export default ChatStack;
