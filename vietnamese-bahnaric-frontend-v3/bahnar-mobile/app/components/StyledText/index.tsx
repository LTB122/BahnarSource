import * as React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

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

type TextProps = Text['props'];

export default function StyledText(props: TextProps) {
  const { fontWeight = '400' } = StyleSheet.flatten(props.style || {});

  const fontFamily = `BalooChettan2-${BalooChettan2Font[fontWeight]}`;

  return (
    <Text
      {...props}
      style={[defaultStyles, props.style, { fontFamily }, disableStyles]}
    />
  );
}
