import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.javier.fisiko',
  appName: 'Fisiko',
  webDir: 'public', // se puede dejar así aunque no se use

  server: {
    url: 'https://studio--studio-7503491982-a84d8.us-central1.hosted.app',
    cleartext: true
  }
};

export default config;