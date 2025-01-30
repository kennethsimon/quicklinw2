// src/index.js
import { AppRegistry } from 'react-native';
import App from '../App'; // The entry component of your app
import { name as appName } from '../app.json';

AppRegistry.registerComponent(appName, () => App);

// If you want to enable React Native Web, add the following lines:
if (window.document) {
  const rootTag = document.getElementById('root') || document.getElementById('app');
  AppRegistry.runApplication(appName, { rootTag });
}
