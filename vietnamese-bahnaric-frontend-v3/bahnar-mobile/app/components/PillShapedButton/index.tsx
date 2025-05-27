import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

import StyledText from '../StyledText';

type PillShapedButtonProps = {
  onPress: () => void;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  text: string;
};

export default function PillShapedButton({
  onPress,
  textStyle,
  style,
  text,
}: PillShapedButtonProps) {
  return (
    <Pressable style={[styles.buttonContainer, style]} onPress={onPress}>
      <StyledText style={[styles.text, textStyle]}>{text}</StyledText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#1C45F9',
    borderRadius: 99,
    width: 360,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 25,
    shadowOffset: {
      width: 3,
      height: 0,
    },
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
