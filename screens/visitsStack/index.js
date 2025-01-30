import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Visits from '../../components/Visits';


const Stack = createNativeStackNavigator();

function VisitsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Visits"
      screenOptions={{
        headerShadowVisible: false,
        animation: 'none'
      }}>
       <Stack.Screen
        name="Visits"
        component={Visits}
        options={({navigation}) => ({
          title: 'Visits',
          headerTitleAlign: 'center',
        })}
      />
    </Stack.Navigator>
  );
}

export default VisitsStack;
