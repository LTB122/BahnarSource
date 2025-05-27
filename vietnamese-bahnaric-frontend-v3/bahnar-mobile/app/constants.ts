import { Dimensions, Platform } from 'react-native';

export const CONTENT_SPACING = 16;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android: Dimensions.get('screen').height,
  ios: Dimensions.get('window').height,
}) as number;

export const HEADER_VIEW_INITIAL_HEIGHT = 83;

export const BAHNAR_KEYBOARD_HEIGHT = 52;
