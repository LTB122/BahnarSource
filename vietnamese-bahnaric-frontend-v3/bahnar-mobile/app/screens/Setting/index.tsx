import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';
import React, { useCallback } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';

import { FormButton, Icon, SettingItem, StyledText } from '../../components';
import { Container, Header, ScreenLayout } from '../../layout';
import AuthService from '../../services/auth.service';
import UserService from '../../services/user.service';
import { useBoundStore, usePersistStore } from '../../store';
import { isAuthSelector } from '../../store/usePersistStore';
import { Settings } from '../../types';
import { MainBottomTabScreenProps } from '../../types/navigation';

import styles from './styles';

export default function SettingScreen({
  navigation,
}: MainBottomTabScreenProps<'Settings'>) {
  const { profile, setProfile } = useBoundStore((state) => state);
  const { settings, setSettings } = usePersistStore((state) => state);
  const isAuthenticated = usePersistStore(isAuthSelector);

  const changeSetting = _.debounce(async (data: Partial<Settings>) => {
    try {
      if (isAuthenticated)
        await UserService.updateProfile({ settings: { ...settings, ...data } });
      setSettings({ ...settings, ...data });
    } catch (error: any) {
      console.log(JSON.stringify(error.response.data));
    }
  }, 100);

  const deleteAccount = async () => {
    try {
      await UserService.deleteAccount();
      AuthService.logout();
    } catch (error: any) {
      console.log(JSON.stringify(error.response.data));
    }
  };

  const handleDeleteAccountPress: () => void = useCallback(() => {
    Alert.alert(
      'Xoá tài khoản',
      'Bạn có chắc muốn xoá tài khoản của mình? Toàn bộ dữ liệu của bạn sẽ bị xoá.',
      [
        {
          text: 'Xoá',
          onPress: deleteAccount,
          style: 'destructive',
        },
        {
          text: 'Không xoá',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        try {
          /**
           * This has to be the first call to the API,
           * as it will initialize axios instance with the token
           */
          const { data } = await AuthService.getUser();
          const { payload: user } = data;
          setSettings(user.settings);
          setProfile(user);
        } catch (error) {
          console.log(error);
        }
      };
      fetch();
    }, [setProfile, setSettings])
  );

  return (
    <ScreenLayout scrollEnabled style={styles.container} safeArea>
      <Header
        expand={false}
        title={'Cài đặt'}
        renderLeftIcon={() => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate({
                name: 'Main',
                merge: true,
                params: {},
              })
            }
          >
            <Icon.House fill='white' width={24} height={24} />
          </TouchableOpacity>
        )}
        renderRightIcon={() => (
          <Icon.GearShape fill='black' width={28} height={28} />
        )}
      />
      <Container style={{ flex: 1, gap: 16 }}>
        {/* Account */}
        <StyledText style={{ fontSize: 16, fontWeight: 'bold' }}>
          Thông tin cá nhân
        </StyledText>
        <View style={{ gap: 16 }}>
          {isAuthenticated ? (
            <>
              <SettingItem
                isFirstItem={true}
                isLastItem={true}
                onPress={() =>
                  navigation.navigate('ChangeInput', {
                    title: 'Tên hiển thị',
                    value: profile?.name || '',
                    userProp: 'name',
                  })
                }
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <Icon.TextFormat fill='#15294B' width={16} height={16} />
                  <StyledText style={{ fontSize: 16 }}>Tên hiển thị</StyledText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  {profile?.name && (
                    <StyledText style={{ opacity: 0.2 }}>
                      {profile.name.slice(0, 15) +
                        (profile.name.length > 15 ? '...' : '')}
                    </StyledText>
                  )}
                  <Icon.ChevronLeft
                    style={{ transform: [{ rotateZ: '180deg' }] }}
                    fill='#15294B'
                    width={13}
                    height={20}
                  />
                </View>
              </SettingItem>

              <SettingItem
                isFirstItem={true}
                isLastItem={true}
                onPress={() =>
                  navigation.navigate('ChangeInput', {
                    title: 'Email',
                    value: profile?.email || '',
                    userProp: 'email',
                    keyboardType: 'email-address',
                  })
                }
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <Icon.At fill='#15294B' width={16} height={16} />
                  <StyledText style={{ fontSize: 16 }}>Email</StyledText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <StyledText style={{ opacity: 0.2 }}>
                    {profile?.email
                      ? profile.email.slice(0, 15) +
                        (profile.email.length > 15 ? '...' : '')
                      : 'Không có'}
                  </StyledText>
                  <Icon.ChevronLeft
                    style={{ transform: [{ rotateZ: '180deg' }] }}
                    fill='#15294B'
                    width={13}
                    height={20}
                  />
                </View>
              </SettingItem>

              <SettingItem
                isFirstItem={true}
                isLastItem={true}
                onPress={() =>
                  navigation.navigate('ChangeInput', {
                    title: 'Số điện thoại',
                    value: profile?.phone || '',
                    userProp: 'phone',
                    keyboardType: 'number-pad',
                  })
                }
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <Icon.Phone fill='#15294B' width={16} height={16} />
                  <StyledText style={{ fontSize: 16 }}>
                    Số điện thoại
                  </StyledText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <StyledText style={{ opacity: 0.2 }}>
                    {profile?.phone
                      ? profile.phone.slice(0, 15) +
                        (profile.phone.length > 15 ? '...' : '')
                      : 'Không có'}
                  </StyledText>
                  <Icon.ChevronLeft
                    style={{ transform: [{ rotateZ: '180deg' }] }}
                    fill='#15294B'
                    width={13}
                    height={20}
                  />
                </View>
              </SettingItem>

              <SettingItem
                isFirstItem={true}
                isLastItem={true}
                onPress={() => navigation.navigate('ChangePassword')}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <Icon.LockFill fill='#15294B' width={16} height={16} />
                  <StyledText style={{ fontSize: 16 }}>Mật khẩu</StyledText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  {profile?.username && (
                    <StyledText style={{ opacity: 0.2 }}>********</StyledText>
                  )}
                  <Icon.ChevronLeft
                    style={{ transform: [{ rotateZ: '180deg' }] }}
                    fill='#15294B'
                    width={13}
                    height={20}
                  />
                </View>
              </SettingItem>

              <SettingItem isFirstItem={true} isLastItem={true} disabled>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <Icon.TextFormat fill='#15294B' width={16} height={16} />
                  <StyledText style={{ fontSize: 16 }}>
                    Tên người dùng
                  </StyledText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  {profile?.username && (
                    <StyledText style={{ opacity: 0.2 }}>
                      {profile.username.slice(0, 10) +
                        (profile.username.length > 10 ? '...' : '')}
                    </StyledText>
                  )}
                </View>
              </SettingItem>
            </>
          ) : (
            <>
              <StyledText style={{ fontSize: 12 }}>
                Bạn chưa đăng nhập! Hãy đăng nhập để có thể sao lưu các bản dịch
                và chỉnh sửa thông tin cá nhân.
              </StyledText>
              <FormButton
                style={{
                  width: 148,
                  height: 52,
                  marginTop: 24,
                }}
                onPress={() => navigation.navigate('Login')}
              >
                <StyledText style={{ color: 'white' }}>Đăng nhập</StyledText>
              </FormButton>
            </>
          )}
        </View>
        {/* Settings */}
        <StyledText style={{ fontSize: 16, fontWeight: 'bold' }}>
          Phương ngữ
        </StyledText>
        <View style={{ marginBottom: 16 }}>
          <SettingItem
            isFirstItem={true}
            isLastItem={false}
            onPress={() => changeSetting({ region: 'binhdinh' })}
          >
            <StyledText style={{ fontSize: 14 }}>Bình Định</StyledText>
            {settings.region === 'binhdinh' && (
              <Icon.CheckMark fill='black' width={12} height={13} />
            )}
          </SettingItem>
          <SettingItem
            isFirstItem={false}
            isLastItem={false}
            onPress={() => changeSetting({ region: 'gialai' })}
          >
            <StyledText style={{ fontSize: 14 }}>Gia Lai</StyledText>
            {settings.region === 'gialai' && (
              <Icon.CheckMark fill='black' width={12} height={13} />
            )}
          </SettingItem>
          <SettingItem
            isFirstItem={false}
            isLastItem={true}
            onPress={() => changeSetting({ region: 'kontum' })}
          >
            <StyledText style={{ fontSize: 14 }}>Kon Tum</StyledText>
            {settings.region === 'kontum' && (
              <Icon.CheckMark fill='black' width={12} height={13} />
            )}
          </SettingItem>
        </View>

        {/* Logout */}

        {isAuthenticated && (
          <SettingItem
            isFirstItem={true}
            isLastItem={true}
            onPress={AuthService.logout}
            style={{ marginTop: 16 }}
          >
            <StyledText style={{ fontSize: 14, color: 'red' }}>
              Đăng xuất
            </StyledText>
            <Icon.Logout fill='red' width={16} height={16} />
          </SettingItem>
        )}

        {/* Danger zone */}
        {isAuthenticated && (
          <>
            <StyledText
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginTop: 32,
                color: 'red',
              }}
            >
              Vùng nguy hiểm
            </StyledText>
            <View>
              <SettingItem
                isFirstItem={true}
                isLastItem={true}
                style={{
                  borderWidth: 1,
                  borderColor: 'red',
                  borderBottomWidth: 1,
                }}
                onPress={handleDeleteAccountPress}
              >
                <StyledText style={{ fontSize: 14, color: 'red' }}>
                  Xoá tài khoản
                </StyledText>
                <Icon.XMark fill='red' width={16} height={16} />
              </SettingItem>
            </View>
          </>
        )}
      </Container>
    </ScreenLayout>
  );
}
