import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CategoriesList from '../../components/Consultation/Categories';
import DoctorsList from '../../components/Consultation/doctors';
import DoctorDetails from '../../components/Consultation/Doctordetails';
import AppointmentReceiptScreen from '../../components/Consultation/Receipt';
import VideoCallScreen from '../../components/Consultation/VideoScreen';
import HospitalMapScreen from '../../components/Consultation/Mapscreen';

const Stack = createNativeStackNavigator();

function ConsultationStack() {
  return (
    <Stack.Navigator
      initialRouteName="Cats"
      screenOptions={{
        headerShadowVisible: true,
        animation: 'none'
      }}>
<Stack.Screen
        name="Cats"
        component={CategoriesList}
        options={({navigation}) => ({
          title: 'Categories',
          headerTitleAlign: 'center'
        })}
      />
      <Stack.Screen
        name="Doctorslist"
        component={DoctorsList}
        options={({navigation}) => ({
          title: 'Doctors',
          headerTitleAlign: 'center'
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
       <Stack.Screen
        name="MapScreen"
        component={HospitalMapScreen}
        options={({navigation}) => ({
          title: null,
        })}
      />
    </Stack.Navigator>
  );
}

export default ConsultationStack;
