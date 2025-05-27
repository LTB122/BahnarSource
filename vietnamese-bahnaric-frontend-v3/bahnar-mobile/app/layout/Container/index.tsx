import { View, ViewProps } from 'react-native';

const defaultStyles = {
  paddingHorizontal: 52,
  paddingVertical: 52,
};

type TranslateAreaProps = ViewProps;

export default function Container(props: TranslateAreaProps) {
  return <View {...props} style={[defaultStyles, props.style]} />;
}
