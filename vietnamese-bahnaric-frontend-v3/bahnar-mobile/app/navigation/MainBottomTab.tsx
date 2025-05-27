import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon, TabBar } from '../components';
import { MainScreen, SettingScreen } from '../screens';
import { MainBottomTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainBottomTabParamList>();

export default function MainBottomTab() {
  return (
    <Tab.Navigator
      // eslint-disable-next-line react/no-unstable-nested-components
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name='Main'
        component={MainScreen}
        initialParams={{}}
        options={{
          tabBarLabel: 'Trang chủ',
          // ESLint false positive: https://github.com/react-navigation/react-navigation/issues/11536#issuecomment-1682119691
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <Icon.HouseFill fill={color} width={size} height={size} />
            ) : (
              <Icon.House fill={color} width={size} height={size} />
            ),
          tabBarActiveBackgroundColor: 'white',
        }}
      />
      <Tab.Screen
        name='Settings'
        component={SettingScreen}
        options={{
          tabBarLabel: 'Cài đặt',
          // ESLint false positive: https://github.com/react-navigation/react-navigation/issues/11536#issuecomment-1682119691
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ focused, color, size }) =>
            focused ? (
              <Icon.GearShapeFill fill={color} width={size} height={size} />
            ) : (
              <Icon.GearShape fill={color} width={size} height={size} />
            ),
          tabBarActiveBackgroundColor: '#F2F5FF',
        }}
      />
    </Tab.Navigator>
  );
}
