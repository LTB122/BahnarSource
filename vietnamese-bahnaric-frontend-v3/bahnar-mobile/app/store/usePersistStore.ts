import EncryptedStorage from 'react-native-encrypted-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Settings } from '../types';

interface PersistState {
  token: string;
  setToken: (_token: string) => void;
  settings: Settings;
  setSettings: (_settings: Settings) => void;
}

const usePersistStore = create(
  persist<PersistState>(
    (set) => ({
      token: '',
      setToken: (_token: string) => set({ token: _token }),
      setSettings: (_settings: Settings) => set({ settings: _settings }),
      settings: {
        region: 'binhdinh',
      },
    }),
    {
      name: 'persist-store',
      storage: createJSONStorage(() => EncryptedStorage),
      skipHydration: true,
    }
  )
);

export const isAuthSelector = (state: PersistState) => !!state.token;

export default usePersistStore;
