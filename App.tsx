import React, {useContext, useEffect, useState, useRef} from 'react';
// 1. import `NativeBaseProvider` component
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {Provider as AuthProvider} from './context/AppContext';
import {Context as AuthContext} from './context/AppContext';
import AuthCheck from './screens';
import Loadingscreen from './components/Loadingscreen';
import {navigationRef} from './context/navigationRef';
import RNBootSplash from 'react-native-bootsplash';
import ErrorAlert from './components/Alert/errorAlert';
import SuccessAlert from './components/Alert/successAlert';
import {useTranslation} from 'react-i18next';
import './utils/i18n.js';
import { PostHogProvider } from 'posthog-react-native'
import {fcmService} from './src/FCMService.js';
import {localNotificationService} from './src/LocalNotificationService.js';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const requestNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app needs access to your notifications',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  } else if (Platform.OS === 'ios') {
    PushNotificationIOS.requestPermissions().then((permissions) => {
      if (!permissions.alert && !permissions.sound && !permissions.badge) {
        Alert.alert(
          'Notification Permission',
          'This app needs access to your notifications',
          [{ text: 'OK' }]
        );
      }
    });
  }
};

function App({updatedroute}: any) {
  const {
    state,
    recentappointments,
    clearError,
    clearSuccessData,
    organizations,
    setTimeslots,
    savetoken,
    fcmtoken,
    visits
  } = useContext(AuthContext);
  const {i18n} = useTranslation();
  const navigation = useNavigation();

  const onClose = () => {
    clearError();
  };


  useEffect(() => {
    i18n.changeLanguage(state.language === 'english' ? 'en' : 'sw');
  }, [i18n, state.language]);

  useEffect(() => {
    requestNotificationPermission();
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification, navigation);
    localNotificationService.createChannel();
    function onRegister(token: any) {
      savetoken(token);
    }

    function onNotification(notify: any) {
      console.log('[App] onNotification: ', notify);
      const options = {
        soundName: 'default',
        playSound: true, //,
        largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
        smallIcon: 'ic_launcher', // add icon small for Android (Link: app/src/main/mipmap)
      };
      localNotificationService.showNotification(
        notify?.id,
        notify?.title,
        notify?.body,
        notify,
        options,
      );
    }

    function onOpenNotification(notify: any) {
      console.log('[App] onOpenNotification: ', notify);
      //  alert("Open Notification: " + notify.body)
    }

    return () => {
      //  console.log("[App] unRegister")
      fcmService.unRegister();
      localNotificationService.unregister();
    };
  }, []);

  useEffect(() => {
    if (state.user && state.fcmtoken) {
      fcmtoken(state.fcmtoken);
    }
  }, [state.fcmtoken, state.user]);

  const onCloseSuccess = () => {
    if (state?.success?.navigate) {
      clearSuccessData(state.success.navigate);
    } else {
      clearSuccessData();
    }
  };

  useEffect(() => {
    if (['Organization'].includes(updatedroute)) {
      organizations();
      // if(state.timeslots.length === 0){
      //   setTimeslots(timeslots())
      // }
    } else if(['Recentappointments'].includes(updatedroute)){
      recentappointments();
    }else if(['Visits'].includes(updatedroute)){
      visits();
    }
  }, [updatedroute]);

  useEffect(() => {
    RNBootSplash.hide();
  }, []);

  if (state.authloading) {
    return <Loadingscreen />;
  }

  return (
    <>
      <AuthCheck />
      <ErrorAlert
        headerTitle={state?.error?.title || 'Error'}
        content={state?.error?.message || JSON.stringify(state?.error)}
        open={state.error ? true : false}
        onClose={onClose}
      />
      <SuccessAlert
        headerTitle={state?.success?.title || 'Success'}
        content={state?.success?.content}
        open={state.success ? true : false}
        onClose={onCloseSuccess}
      />
    </>
  );
}

export default () => {
  // 2. Use at the root of your app
  const [updatedroute, setUpdateroute] = useState('');
  const routeNameRef = useRef();

  const onNavigationStateChanged = () => {
    const currentRouteName = navigationRef.current.getCurrentRoute().name;
    routeNameRef.current = currentRouteName;
    setUpdateroute(currentRouteName);
  };
  return (
    <AuthProvider>
      <NativeBaseProvider>
        <NavigationContainer
          ref={navigationRef}
          onStateChange={onNavigationStateChanged}
          onReady={() => RNBootSplash.hide()}>
             <PostHogProvider apiKey="phc_64HBE08FXlPsdDUIzBg8kc2Wuinw3z8EwlfGmjjRfAJ" options={{
      host: "https://app.posthog.com",
  }}>
     <App updatedroute={updatedroute} />
  </PostHogProvider>     
        </NavigationContainer>
      </NativeBaseProvider>
    </AuthProvider>
  );
};
