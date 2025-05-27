import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type AppStateSettings = {
  onChange?: (state: string) => void;
  onForeground?: () => void;
  onBackground?: () => void;
};

function isValidFunction<T>(func: T) {
  return func && typeof func === 'function';
}

/**
 * useAppState typescript implementation of react-native-appstate-hook by amrlabib
 * @param settings
 * @returns {appState: AppStateStatus} app Status
 */
export default function useAppState({
  onChange,
  onForeground,
  onBackground,
}: AppStateSettings): {
  appState: AppStateStatus;
} {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState
  );

  useEffect(() => {
    function handleAppStateChange(nextAppState: AppStateStatus) {
      if (nextAppState === 'active' && appState !== 'active') {
        onForeground && isValidFunction(onForeground) && onForeground();
      } else if (
        appState === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        onBackground && isValidFunction(onBackground) && onBackground();
      }
      setAppState(nextAppState);
      onChange && isValidFunction(onChange) && onChange(nextAppState);
    }
    const eventSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => eventSubscription.remove();
  }, [onChange, onForeground, onBackground, appState]);

  return { appState };
}
