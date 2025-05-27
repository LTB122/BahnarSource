import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

type SettingItemProps = TouchableOpacityProps & {
  isFirstItem: boolean;
  isLastItem: boolean;
};

export default function SettingItem({
  isFirstItem,
  isLastItem,
  style,
  ...props
}: SettingItemProps) {
  return (
    <TouchableOpacity
      {...props}
      style={[
        {
          borderTopLeftRadius: isFirstItem ? 8 : 0,
          borderTopRightRadius: isFirstItem ? 8 : 0,
          borderBottomLeftRadius: isLastItem ? 8 : 0,
          borderBottomRightRadius: isLastItem ? 8 : 0,
          borderColor: 'rgba(38, 38, 100, 0.1)',
          borderBottomWidth: !isLastItem ? 1 : 0,

          backgroundColor: 'white',
          paddingHorizontal: 16,
          minHeight: 52,

          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {props.children}
    </TouchableOpacity>
  );
}
