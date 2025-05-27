import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CONTENT_SPACING, SCREEN_WIDTH } from '../../constants';
import StyledText from '../StyledText';

const TABBAR_WIDTH: number = SCREEN_WIDTH - 40 * 2;

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets: EdgeInsets = useSafeAreaInsets();
  const width: number = TABBAR_WIDTH / state.routes.length;
  const currentIndex = useDerivedValue(() => state.index, [state.index]);

  const { tabBarActiveBackgroundColor: backgroundColor } =
    descriptors[state.routes[state.index].key].options || 'white';

  const indicatorAnimatedStyles = useAnimatedStyle(() => {
    const translateX: number = withTiming(currentIndex.value * width, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    return {
      width: width,
      transform: [{ translateX }],
    };
  });
  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          height: insets.bottom + CONTENT_SPACING + 48,
          backgroundColor,
        },
      ]}
    >
      <View style={styles.tabBar}>
        <Animated.View style={[styles.indicator, indicatorAnimatedStyles]} />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const labelComponent =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const TabBarIcon = options.tabBarIcon?.({
            focused: isFocused,
            color: isFocused ? 'white' : '#262664',
            size: 28,
          });

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({
                key: route.key,
                name: route.name,
                merge: true,
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole='button'
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabBarButton}
              key={route.key}
            >
              {TabBarIcon}
              {isFocused && typeof labelComponent === 'string' && (
                <StyledText
                  style={{
                    color: 'white',
                    marginLeft: 14,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  {labelComponent}
                </StyledText>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    alignItems: 'center',
  },
  tabBar: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 30,
    width: TABBAR_WIDTH,
    height: 48,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 35, // For Android
  },
  tabBarButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    height: 48,
    backgroundColor: '#1C45F9',
    borderRadius: 30,
  },
});
