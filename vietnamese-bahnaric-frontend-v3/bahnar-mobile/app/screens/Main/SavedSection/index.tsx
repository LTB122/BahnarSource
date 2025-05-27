import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import {
  NavigationState,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';

import { StyledText } from '../../../components';

import Favorite from './Favorite';
import Saved from './Saved';
import styles from './styles';

type SavedSectionProps = {
  disabled: boolean;
  setDisabled: Dispatch<SetStateAction<boolean>>;
};

type RouteType = {
  key: string;
  title: string;
};

const SavedTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<RouteType>;
    setDisabled: Dispatch<SetStateAction<boolean>>;
  } & SavedSectionProps
) => {
  const routes: RouteType[] = props.navigationState.routes;

  // Width of indicator: 2/3 of tabbar width
  const width: number = ((props.layout.width / routes.length) * 2) / 3;

  const inputRange: number[] = routes.map((_, i) => i);
  const outputRange: number[] = routes.reduce<number[]>((acc, _, i) => {
    const tabbarWidth: number = props.layout.width / routes.length;
    const offset: number = tabbarWidth * i + (tabbarWidth - width) / 2;
    acc.push(offset);
    return acc;
  }, []);

  const translateX = props.position.interpolate({
    inputRange,
    outputRange,
    extrapolate: 'clamp',
  });

  return (
    <View
      style={[styles.tabbar, { borderBottomWidth: props.disabled ? 0 : 1 }]}
    >
      {props.navigationState.routes.map((route, i) => (
        <TouchableOpacity
          key={route.key}
          style={styles.tab}
          onPress={() => {
            props.jumpTo(route.key);
            if (props.disabled || i === props.navigationState.index)
              props.setDisabled(!props.disabled);
          }}
        >
          <StyledText
            style={{
              color: props.disabled
                ? '#BDBCCC'
                : props.navigationState.index === i
                ? '#1C45F9'
                : '#262664',
            }}
          >
            {route.title}
          </StyledText>
          <View />
        </TouchableOpacity>
      ))}

      {/* Indicator */}
      {!props.disabled && <View style={styles.bottomBorder} />}
      <Animated.View
        style={[
          styles.indicator,
          { width },
          {
            display: props.disabled ? 'none' : 'flex',
          },
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

export default function SavedSection({
  disabled,
  setDisabled = () => {},
}: SavedSectionProps) {
  // Should always be 0 by default
  // because the props.position by default is 0.
  // If it's not 0, the indicator will be translated
  const [index, setIndex] = useState(0);
  const [routes] = useState<RouteType[]>([
    { key: 'favorite', title: 'Yêu thích' },
    { key: 'saved', title: 'Đã Lưu' },
  ]);

  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<RouteType>;
      }
    ) => {
      return (
        <SavedTabBar {...props} disabled={disabled} setDisabled={setDisabled} />
      );
    },
    [disabled, setDisabled]
  );

  const renderScene = useCallback(
    ({ route }: { route: RouteType }) => {
      if (disabled) return null;
      switch (route.key) {
        case 'favorite':
          return <Favorite />;
        case 'saved':
          return <Saved />;
        default:
          return null;
      }
    },
    [disabled]
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{
        height: 300,
      }}
    />
  );
}
