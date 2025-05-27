import { StyleSheet, TextInput, TextInputProps } from 'react-native';

const defaultStyles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderColor: '#BDBCCC',
    borderStyle: 'solid',
    borderWidth: 1,
    height: 56,
    borderRadius: 8,
    fontSize: 16,
    color: '#262664',
    paddingHorizontal: 16,
  },
});

export default function FormInput(props: TextInputProps) {
  return (
    <TextInput
      numberOfLines={1}
      placeholderTextColor={'#BDBCCC'}
      {...props}
      style={[defaultStyles.input, props.style]}
    />
  );
}
