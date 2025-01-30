import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CategoriesList from '../../components/Consultation/Categories';
import DoctorsList from '../../components/Consultation/doctors';
import DoctorDetails from '../../components/Consultation/Doctordetails';
import AppointmentReceiptScreen from '../../components/Consultation/Receipt';
import VideoCallScreen from '../../components/Consultation/VideoScreen';

const Stack = createNativeStackNavigator();

function ConsultationStack() {
  return (
    <Stack.Navigator
      initialRouteName="Cats"
      screenOptions={{
        headerShadowVisible: false,
        animation: 'none'
      }}>
<Stack.Screen
        name="Cats"
        component={CategoriesList}
        options={({navigation}) => ({
          title: null,
        })}
      />
      <Stack.Screen
        name="Doctorslist"
        component={DoctorsList}
        options={({navigation}) => ({
          title: null,
        })}
      />
        <Stack.Screen
        name="Doctorsdetails"
        component={DoctorDetails}
        options={({navigation}) => ({
          title: null,
        })}
      />
       <Stack.Screen
        name="Receipt"
        component={AppointmentReceiptScreen}
        options={({navigation}) => ({
          title: null,
        })}
      />
      <Stack.Screen
        name="VideoCallScreen"
        component={VideoCallScreen}
        options={({navigation}) => ({
          title: null,
        })}
      />
    </Stack.Navigator>
  );
}

export default ConsultationStack;
