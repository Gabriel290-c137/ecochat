import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.ecochat.myapp',
  appName: 'ecochat',
  webDir: 'www',
  plugins: {
    PushNotifications: {
      presentationOptions: ['alert', 'badge', 'sound'],
    },
    Keyboard: {
      resize: KeyboardResize.Body,
      resizeOnFullScreen: true,
    },
    GoogleAuth: {
      // Add your GoogleAuthPluginOptions here, e.g.:
      scopes: ['profile', 'email'],
      serverClientId: '213178519857-cj2o8phkkq3vohh1kcmoe49f5lpkvr38.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  },
};

export default config;
