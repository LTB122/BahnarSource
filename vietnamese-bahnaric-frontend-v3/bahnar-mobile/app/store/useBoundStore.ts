import { StoreApi, UseBoundStore, create } from 'zustand';

import { Profile } from '../types';

interface GlobalState {
  isSideMenuOpen: boolean;
  updateSideMenuOpen: (isSideMenuOpen: boolean) => void;
  isSplash: boolean;
  updateSplash: (isSplash: boolean) => void;
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
}

const useBoundStore: UseBoundStore<StoreApi<GlobalState>> = create((set) => ({
  isSideMenuOpen: false,
  updateSideMenuOpen: (isSideMenuOpen: boolean) => set({ isSideMenuOpen }),
  isSplash: true,
  updateSplash: (isSplash: boolean) => set({ isSplash }),
  profile: null,
  setProfile: (profile: Profile | null) => set({ profile }),
}));

export default useBoundStore;
