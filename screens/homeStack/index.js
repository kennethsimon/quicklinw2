import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Organizationscreen from '../../components/Orgnanization';
import Categories from '../../components/categories';
import Choicescreen from '../../components/choicescreen';
import Doctors from '../../components/doctors';
import Successscreen from '../../components/successscreen';
import Qrcode from '../../components/qrcode/qrcode';
import Ticketscreen from '../../components/ticketscreen';
import ImageUploadComponent from '../../components/photoupload';
import Clienttype from '../../components/chooseclienttype';
import Calenderscreen from '../../components/appointment';
import Timeslots from '../../components/timeslots';
import HomeComponent from '../../components/Homecomponent/HomeComponent';


const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShadowVisible: false,
        animation: 'none'
      }}>
         <Stack.Screen
        name="HomeScreen"
        component={HomeComponent}
        options={({navigation}) => ({
          title: "Home",
          headerTitleAlign: 'center',
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
       <Stack.Screen
        name="Organization"
        component={Organizationscreen}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
       <Stack.Screen
        name="Categories"
        component={Categories}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
        <Stack.Screen
        name="Choice"
        component={Choicescreen}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />

<Stack.Screen
        name="Doctors"
        component={Doctors}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
       <Stack.Screen
        name="Imageupload"
        component={ImageUploadComponent}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
       <Stack.Screen
        name="Clienttype"
        component={Clienttype}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
        <Stack.Screen
        name="successscreen"
        component={Successscreen}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />

<Stack.Screen
        name="Ticketscreen"
        component={Ticketscreen}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
       <Stack.Screen
        name="Appointment"
        component={Calenderscreen}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
       <Stack.Screen
        name="timeslots"
        component={Timeslots}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />

<Stack.Screen
        name="qrcode"
        component={Qrcode}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      />
      {/* <Stack.Screen
        name="Changepassword"
        component={Changepassword}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      /> */}
      {/* <Stack.Screen
        name="Newpassword"
        component={Newpassword}
        options={({navigation}) => ({
          title: null,
          // headerLeft: () => <Materialicon name="x" size={30} color="black" />,
          // headerRight: () => (
          //   <Materialicon name="help-circle" size={30} color="black" />
          // ),
        })}
      /> */}
    </Stack.Navigator>
  );
}

export default HomeStack;
