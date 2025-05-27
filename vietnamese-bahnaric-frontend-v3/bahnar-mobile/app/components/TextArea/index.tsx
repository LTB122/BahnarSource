import { StyleProp, StyleSheet, TextStyle } from 'react-native';

import BahnarKeyboardBase, {
  BahnarKeyboardBaseProps,
} from '../BahnarInputBase';

const BalooChettan2Font = {
  normal: 'Regular',
  bold: 'Bold',
  '100': 'Regular',
  '200': 'Regular',
  '300': 'Regular',
  '400': 'Regular',
  '500': 'SemiBold',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'ExtraBold',
};

const defaultStyles: StyleProp<TextStyle> = {
  color: '#262664',
};

const disableStyles: StyleProp<TextStyle> = {
  fontStyle: 'normal',
};

type TextAreaProps = BahnarKeyboardBaseProps;

export default function TextArea(props: TextAreaProps) {
  const { fontWeight = '400' } = StyleSheet.flatten(props.style || {});

  const fontFamily = `BalooChettan2-${BalooChettan2Font[fontWeight]}`;

  return (
    <BahnarKeyboardBase
      {...props}
      style={[defaultStyles, props.style, { fontFamily }, disableStyles]}
      multiline={true}
      textAlignVertical='top'
      accessibilityLanguage={props.accessibilityLanguage || 'vi'}
      numberOfLines={props.numberOfLines || 4}
      placeholderTextColor={
        props.placeholderTextColor || 'rgba(38, 38, 100, 0.5)'
      }
    />
  );
}
