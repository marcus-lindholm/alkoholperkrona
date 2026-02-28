import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'se.apkrona.app',
  appName: 'APKrona',
  webDir: 'out',
  server: {
    // Allow navigation and XHR to your production API
    allowNavigation: ['www.apkrona.se', 'apkrona.se'],
    // Android scheme (https://localhost by default in Cap 8)
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
