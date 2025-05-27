import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CONTENT_SPACING } from '../../constants';

type KeyboardAvoidingViewProps = {
  children?: React.ReactNode | React.ReactNode[];
  style?: StyleProp<ViewStyle>;
  extraHeight?: number;
};

/**
 * Source: https://stackoverflow.com/a/64599004/21080445
 * Note: Make sure to also set keyboardHidesTabBar: (Platform.OS == "ios" ? false : true) as a prop on Tab.Navigator.
 */
export default function KeyboardAvoidingView({
  children,
  style = {},
  extraHeight = 0,
}: KeyboardAvoidingViewProps) {
  const insets = useSafeAreaInsets();
  const [_bottomPadding, setBottomPadding] = useState(
    insets.bottom + CONTENT_SPACING
  );
  const [_topPadding, setTopPadding] = useState(insets.top + CONTENT_SPACING);

  useEffect(() => {
    // This useEffect is needed because insets are undefined at first for some reason
    // https://github.com/th3rdwave/react-native-safe-area-context/issues/54
    setBottomPadding(insets.bottom + CONTENT_SPACING);
    setTopPadding(insets.top + CONTENT_SPACING);
  }, [insets.bottom, insets.top]);

  return (
    <RNKeyboardAvoidingView
      keyboardVerticalOffset={extraHeight}
      style={style}
      behavior={'padding'}
    >
      {children}
    </RNKeyboardAvoidingView>
  );
}
