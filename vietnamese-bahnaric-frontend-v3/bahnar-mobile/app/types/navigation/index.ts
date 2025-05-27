import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import { DrawerScreenProps } from '@react-navigation/drawer';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { KeyboardTypeOptions } from 'react-native';

import { User } from '..';

export type RootStackParamList = {
  MainBottomTab: NavigatorScreenParams<MainBottomTabParamList>;
  Camera: undefined;
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  SideMenu: undefined;
  Detail: {
    translationId: string | null;
  };
  ChangePassword: undefined;
  ChangeInput: {
    title: string;
    value: string;
    userProp: Exclude<
      keyof User,
      '_id' | 'username' | 'settings' | 'createdAt' | 'updatedAt' | 'password'
    >;
    keyboardType?: KeyboardTypeOptions;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type MainBottomTabParamList = {
  Main: {
    imageText?: string;
    filePath?: string;
  };
  Settings: undefined;
};

export type MainBottomTabScreenProps<T extends keyof MainBottomTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainBottomTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;
