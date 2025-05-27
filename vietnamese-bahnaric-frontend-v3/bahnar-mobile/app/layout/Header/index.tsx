import React, { useCallback, useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import HeaderTail from '../../assets/svg/HeaderTail.svg';
import { IconBox, StyledText } from '../../components';
import { HEADER_VIEW_INITIAL_HEIGHT } from '../../constants';

import defaultStyles from './styles';

type HeaderProps = {
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  title: string;
  renderRightIcon?: () => React.ReactNode;
  renderLeftIcon?: () => React.ReactNode;
  expand?: boolean;
  renderExpandedComponent?: () => React.ReactNode;
};

export default function Header({
  expand = false,
  containerStyle = {},
  title,
  renderLeftIcon,
  renderRightIcon,
  renderExpandedComponent,
}: HeaderProps) {
  const height = useSharedValue(HEADER_VIEW_INITIAL_HEIGHT);

  const horizontalTransformStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      height.value,
      [HEADER_VIEW_INITIAL_HEIGHT, 344],
      [0, 100]
    );
    return {
      ...defaultStyles.backgroundShape,
      transform: [{ translateX }],
    };
  });

  const heightTransformStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const expandedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        height.value,
        [HEADER_VIEW_INITIAL_HEIGHT, 344],
        [0, 1]
      ),
      flex: 1,
    };
  });

  const moveDown = useCallback(() => {
    'worklet';
    height.value = withSpring(344, {
      mass: 0.75,
      velocity: 20,
    });
  }, [height]);

  const moveUp = useCallback(() => {
    'worklet';
    height.value = withSpring(HEADER_VIEW_INITIAL_HEIGHT, {
      mass: 0.75,
      velocity: 20,
    });
  }, [height]);

  useEffect(() => {
    if (expand) {
      runOnUI(moveDown)();
    } else {
      runOnUI(moveUp)();
    }
  }, [expand, moveDown, moveUp]);

  return (
    <Animated.View
      style={{
        ...defaultStyles.header,
        ...heightTransformStyle,
        ...containerStyle,
      }}
    >
      <Animated.View
        style={{
          ...horizontalTransformStyle,
        }}
      />
      <HeaderTail style={defaultStyles.headerTail} />

      <View style={defaultStyles.menuButton}>{renderLeftIcon?.()}</View>

      <View style={defaultStyles.innerHeader}>
        <StyledText style={defaultStyles.title}>{title}</StyledText>
        <IconBox style={defaultStyles.iconBox}>{renderRightIcon?.()}</IconBox>
      </View>

      <Animated.View style={expandedStyle}>
        {renderExpandedComponent && renderExpandedComponent()}
      </Animated.View>
    </Animated.View>
  );
}
