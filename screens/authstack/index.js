import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from '../../components/welcomescreens';
import Loginscreen from '../../components/loginscreen';
import Phoneauthscreen from '../../components/Phoneinputscreen';
import Verificationscreen from '../../components/verificationscreen';
import Basicdetailsscreen from '../../components/basicdetailscreen';
import Passwordscreen from '../../components/passwordscreen';
import Newpassword from '../../components/newpassword';
import Registerscreen from '../../components/registerscreen';
import Confirmcode from '../../components/confirmcode';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcomescreen"
      screenOptions={{
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="Welcomescreen"
        component={WelcomeScreen}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
       <Stack.Screen
        name="Register"
        component={Registerscreen}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Loginscreen"
        component={Loginscreen}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
       <Stack.Screen
        name="Confirmcode"
        component={Confirmcode}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
      <Stack.Screen
        name="Newpassword"
        component={Newpassword}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
      <Stack.Screen
        name="Phoneauthscreen"
        component={Phoneauthscreen}
        options={({navigation}) => ({
          title: null,
        })}
      />
      <Stack.Screen
        name="Verificationscreen"
        component={Verificationscreen}
        options={({navigation}) => ({
          title: null,
        })}
      />
      <Stack.Screen
        name="Basicdetailsscreen"
        component={Basicdetailsscreen}
        options={({navigation}) => ({
          title: null,
        })}
      />
      <Stack.Screen
        name="Passwordscreen"
        component={Passwordscreen}
        options={({navigation}) => ({
          title: null,
        })}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
