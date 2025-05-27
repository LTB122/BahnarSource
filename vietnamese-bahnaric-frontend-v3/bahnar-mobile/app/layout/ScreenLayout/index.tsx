import { Platform, ViewProps } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BahnarKeyboard } from '../../components';
import { CONTENT_SPACING } from '../../constants';

type ScreenLayoutProps = {
  safeArea?: boolean;
  scrollEnabled?: boolean;
} & ViewProps;

/**
 * Bascic layout for main screens with added support for:
 * - Safe area
 * - Bahnar virtual keyboard
 * - Keyboard avoiding view
 * @param props
 * @returns
 */
export default function ScreenLayout({
  safeArea,
  children,
  style,
  scrollEnabled = false,
}: ScreenLayoutProps) {
  const insets: EdgeInsets = useSafeAreaInsets();
  return (
    <>
      <KeyboardAwareScrollView
        // extraScrollHeight={BAHNAR_KEYBOARD_HEIGHT}
        style={[{ flex: 1, position: 'relative' }]}
        scrollEnabled={scrollEnabled}
        enableOnAndroid
        enableAutomaticScroll={Platform.OS === 'ios'}
        contentContainerStyle={[
          style,
          safeArea && {
            paddingTop:
              insets.top +
              (Platform?.select({ ios: 0, android: CONTENT_SPACING }) || 0),
            paddingBottom: insets.bottom,
          },
        ]}
        keyboardShouldPersistTaps='handled'
      >
        {children}
      </KeyboardAwareScrollView>
      <BahnarKeyboard />
    </>
  );
}
