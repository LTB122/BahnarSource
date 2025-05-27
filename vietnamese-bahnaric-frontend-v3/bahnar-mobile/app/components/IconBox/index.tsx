import { StyleProp, View, ViewStyle } from 'react-native';

import baseStyles from './styles';

type IconBoxProps = {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode | React.ReactNode;
};

export default function IconBox({ children, style }: IconBoxProps) {
  return <View style={[baseStyles.iconBorder, style]}>{children}</View>;
}
