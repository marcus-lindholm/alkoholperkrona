import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'se.apkrona.app',
  appName: 'APKrona',
  webDir: 'out',
  server: {
    // Load the live website directly — the app acts as a native wrapper
    url: 'https://www.apkrona.se',
    androidScheme: 'https',
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'APKrona',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
