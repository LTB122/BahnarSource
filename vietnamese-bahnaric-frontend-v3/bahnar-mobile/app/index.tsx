import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';

import Navigator from './navigation';
import UserService from './services/user.service';
import { useBoundStore, usePersistStore } from './store';

LogBox.ignoreAllLogs();
(console as any).disableYellowBox = true;

const AppStyle = {
  flex: 1,
};

export default function App() {
  useEffect(() => {
    /**
     * Initialize the app:
     * - rehydrate the persist store
     * - get user's profile from token
     */
    const init = async () => {
      try {
        await usePersistStore.persist.rehydrate();

        /**
         * This has to be the first call to the API,
         * as it will initialize axios instance with the token
         */
        const { data } = await UserService.getProfile();
        const { payload: user } = data;
        usePersistStore.getState().setSettings(user.settings);
        useBoundStore.getState().setProfile(user);
      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    TrackPlayer.setupPlayer()
      .then(() => console.log('Track Player ready!!'))
      .catch((error) => console.log('Track Player error', error));
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={AppStyle}>
        <Navigator />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
