import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'se.apkrona.app',
  appName: 'APKrona',
  webDir: 'out',
  server: {
    // Load the live website directly inside the WebView
    url: 'https://www.apkrona.se',
    androidScheme: 'https',
    // Keep all navigation within the app (don't open system browser)
    allowNavigation: ['*.apkrona.se', 'apkrona.se', 'www.apkrona.se'],
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
