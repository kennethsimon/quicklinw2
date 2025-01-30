import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from '../homeStack';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Context as AuthContext} from '../../context/AppContext';
import { useContext } from 'react';
import AppointmentStack from '../appointmentStack';
import { RFValue } from 'react-native-responsive-fontsize';
import VisitsStack from '../visitsStack';
import ConsultationStack from '../consultationStack';
import ChatStack from '../chatstack';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  const {
    state
  } = useContext(AuthContext);
  return (
    <Tab.Navigator  tabBarOptions={{
      activeTintColor: '#25A18E', // Change the color for active tabs
      inactiveTintColor: '#25A18E', // Change the color for inactive tabs
    }}>
      <Tab.Screen name="HomeStack" component={HomeStack}  options={{
            tabBarIcon: ({ color, size }) => (
              <Entypo name="home" color={color} size={size} />
            ),
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarLabelStyle: { fontSize: RFValue(14) }, 
          }} />
      <Tab.Screen name="AppointmentStack" component={AppointmentStack}  options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="text-search" color={color} size={size} />
            ),
            headerShown: false,
            tabBarLabel: 'Appointment',
            tabBarLabelStyle: { fontSize: RFValue(14) }, 
          }}/>
           <Tab.Screen name="VisitsStack" component={VisitsStack}  options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="human-queue" color={color} size={size} />
            ),
            headerShown: false,
            tabBarLabel: 'Visits',
            tabBarLabelStyle: { fontSize: RFValue(14) }, 
          }}/>
           <Tab.Screen name="ConsultationStack" component={ConsultationStack}  options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="video" color={color} size={size} />
            ),
            headerShown: false,
            tabBarLabel: 'Virtual',
            tabBarLabelStyle: { fontSize: RFValue(14) }, 
          }}/>
          <Tab.Screen name="ChatStack" component={ChatStack}  options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chat" color={color} size={size} />
            ),
            headerShown: false,
            tabBarLabel: 'inbox',
            tabBarLabelStyle: { fontSize: RFValue(14) }, 
          }}/>
    </Tab.Navigator>
  );
}

export default HomeTabs