import {
  GestureResponderEvent,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { Translate } from '../../types';
import StyledText from '../StyledText';

type TranslateProps = {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  translate: Translate;
  renderIcon?: (translation: Translate) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const defaultContainerStyle: StyleProp<ViewStyle> = {
  position: 'relative',
};

export default function TranslationBlock({
  onPress,
  translate,
  renderIcon,
  style,
}: TranslateProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[defaultContainerStyle, style]}>
      <StyledText style={{ fontSize: 14 }}>{translate.src}</StyledText>
      <StyledText style={{ fontSize: 14, color: '#BDBCCC' }}>
        {translate.tgt}
      </StyledText>
      {renderIcon && renderIcon(translate)}
    </TouchableOpacity>
  );
}
