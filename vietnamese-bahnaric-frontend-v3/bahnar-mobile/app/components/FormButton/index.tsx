import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

const defaultStyles = StyleSheet.create({
  button: {
    backgroundColor: '#1D46F8',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function FormButton(props: TouchableOpacityProps) {
  return (
    <TouchableOpacity {...props} style={[defaultStyles.button, props.style]} />
  );
}
