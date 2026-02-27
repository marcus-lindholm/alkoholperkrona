import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'se.apkrona.app',
  appName: 'APKrona',
  webDir: 'out',
  server: {
    // Allow loading from your production API
    allowNavigation: ['www.apkrona.se', 'apkrona.se'],
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
