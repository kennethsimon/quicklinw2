import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RecentAppointment from './recentAppointment';
import Appointment from '../../components/appointment';

const Stack = createNativeStackNavigator();

function AppointmentStack() {
  return (
    <Stack.Navigator
      initialRouteName="Recentappointments"
      screenOptions={{
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="Recentappointments"
        component={RecentAppointment}
        options={({navigation}) => ({
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: 'Appointments',
        })}
      />
       <Stack.Screen
        name="Recentappointmentcalender"
        component={Appointment}
        options={({navigation}) => ({
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitle: 'Settings',
        })}
      />  
    </Stack.Navigator>
  );
}

export default AppointmentStack;
