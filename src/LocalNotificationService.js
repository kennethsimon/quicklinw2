import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class LocalNotificationService {
  configure = (onOpenNotification, navigation) => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('[LocalNotificationService] onRegister:', token);
      },
      onNotification: function (notification) {
        console.log('[LocalNotificationService] onNotification:', notification);
        if (!notification?.data) {
          return;
        }

        notification.userInteraction = true;

        const data = Platform.OS === 'ios' ? notification.data.item : notification.data;

        // Call the onOpenNotification callback
        onOpenNotification(data);

        // Navigate to the specific screen when the notification is clicked
        if (data) {
          navigation.navigate('Chat');
        }

        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'not1',
        channelName: 'Channel',
      },
      created => console.log(`createChannel returned '${created}'`)
    );
  };

  unregister = () => {
    PushNotification.unregister();
  };

  showNotification = (id, title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      ...this.buildAndroidNotification(id, title, message, data, options),
      ...this.buildIOSNotification(id, title, message, data, options),
      channelId: 'not1',
      title: title || '',
      message: message || '',
      playSound: options?.playSound || false,
      soundName: options?.soundName || 'default',
      userInteraction: false,
    });
  };

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: "0",
      autoCancel: true,
      largeIcon: options?.largeIcon || 'ic_launcher',
      smallIcon: options?.smallIcon || 'ic_notification',
      bigText: message || '',
      subText: title || '',
      vibrate: true,
      vibration: 300,
      priority: 'high',
      importance: 'high',
      data: data,
    };
  };

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return {
      alertAction: options?.alertAction || 'view',
      category: options?.category || '',
      userInfo: {
        id: id,
        item: data,
      },
    };
  };

  cancelAllLocalNotifications = () => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };

  removeDeliveredNotificationByID = notificationId => {
    console.log('[LocalNotificationService] removeDeliveredNotificationByID: ', notificationId);
    PushNotification.cancelLocalNotifications({ id: `${notificationId}` });
  };
}

export const localNotificationService = new LocalNotificationService();