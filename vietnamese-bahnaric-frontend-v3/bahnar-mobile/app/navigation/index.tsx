import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  ChangeInputScreen,
  ChangePasswordScreen,
  DetailScreen,
  LoginScreeen,
  SignupScreeen,
  SplashScreen,
} from '../screens';
// import CameraScreen from '../screens/Camera';
import { useBoundStore, usePersistStore } from '../store';
import { isAuthSelector } from '../store/usePersistStore';
import { RootStackParamList } from '../types/navigation';

import MainBottomTab from './MainBottomTab';

const RootStack = createStackNavigator<RootStackParamList>();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F2F5FF',
    background: '#F2F5FF',
  },
};

export default function Navigator() {
  const isAuthenticated = usePersistStore(isAuthSelector);
  const isSplash: boolean = useBoundStore((state) => state.isSplash);

  return (
    <NavigationContainer theme={AppTheme}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isSplash ? (
          <RootStack.Screen
            name='Splash'
            component={SplashScreen}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        ) : (
          <>
            <RootStack.Screen name='MainBottomTab' component={MainBottomTab} />
            {/* <RootStack.Screen name='Camera' component={CameraScreen} /> */}
            <RootStack.Screen
              name='Login'
              component={LoginScreeen}
              options={{
                animationTypeForReplace: !isAuthenticated ? 'push' : 'pop',
              }}
            />
            <RootStack.Screen
              name='Detail'
              component={DetailScreen}
              options={{
                animationTypeForReplace: 'pop',
              }}
            />
            <RootStack.Screen name='Signup' component={SignupScreeen} />
            <RootStack.Screen
              name='ChangeInput'
              component={ChangeInputScreen}
              options={{
                animationTypeForReplace: 'pop',
              }}
            />
            <RootStack.Screen
              name='ChangePassword'
              component={ChangePasswordScreen}
              options={{
                animationTypeForReplace: 'pop',
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
