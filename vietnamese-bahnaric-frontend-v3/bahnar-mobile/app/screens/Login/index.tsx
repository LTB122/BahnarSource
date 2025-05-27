import { useState } from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import Subtract from '../../assets/svg/subtract.svg';
import {
  FormButton,
  FormInput,
  KeyboardAvoidingView,
  StyledText,
} from '../../components';
import { SCREEN_WIDTH } from '../../constants';
import AuthService from '../../services/auth.service';
import { usePersistStore } from '../../store';
import { RootStackScreenProps } from '../../types/navigation';

import styles from './styles';

export default function LoginScreeen({
  navigation,
}: RootStackScreenProps<'Login'>) {
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | undefined>();

  const login = async () => {
    try {
      const res = await AuthService.login(username, password);
      const { payload } = res.data;
      const { token } = payload;

      usePersistStore.setState({ token });

      navigation.navigate('MainBottomTab', {
        screen: 'Main',
        params: {},
      });
    } catch (error: any) {
      if (typeof error?.response?.data?.message === 'string') {
        console.log(error.response.data);
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Đã có lỗi xảy ra');
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <StatusBar barStyle='light-content' />
        <ImageBackground
          style={{
            height: 300,
            position: 'relative',
          }}
          resizeMode='cover'
          source={require('../../assets/images/bg.jpg')}
        >
          {/* Overlay */}
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: '#1D46F8',
              opacity: 0.85,
              zIndex: 1,
              elevation: 1,
            }}
          />
          <Subtract
            style={{
              position: 'absolute',
              bottom: -2,
              left: -2, // Dimension error += 2
              width: SCREEN_WIDTH + 2, // Dimension error += 2
              aspectRatio: 430 / 83.7,
              zIndex: 2,
              elevation: 2,
            }}
          />
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                style={{
                  width: 56,
                }}
                resizeMode='contain'
                source={require('../../assets/images/logo.png')}
              />
            </View>
            <StyledText style={styles.title}>Ngôn ngữ Bahnar</StyledText>
          </View>
        </ImageBackground>
        <View style={styles.form}>
          <StyledText style={styles.formTitle}>Đăng nhập</StyledText>
          <FormInput
            style={{ marginTop: 24, width: '100%' }}
            value={username}
            onChangeText={setUsername}
            placeholder='Username'
          />
          <FormInput
            style={{ marginTop: 24, width: '100%' }}
            value={password}
            onChangeText={setPassword}
            placeholder='Mật khẩu'
            secureTextEntry={true}
          />

          {errorMsg && (
            <StyledText style={{ color: 'red' }}>{errorMsg}</StyledText>
          )}

          <FormButton
            style={{
              width: 148,
              height: 52,
              marginTop: 24,
            }}
            onPress={login}
          >
            <StyledText style={{ color: 'white' }}>Đăng nhập</StyledText>
          </FormButton>
          <View
            style={{ marginTop: 24, display: 'flex', flexDirection: 'row' }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MainBottomTab', {
                  screen: 'Main',
                  params: {},
                })
              }
            >
              <StyledText>Bỏ qua</StyledText>
            </TouchableOpacity>
          </View>
          <View
            style={{ marginTop: 24, display: 'flex', flexDirection: 'row' }}
          >
            <StyledText>Bạn chưa có tài khoản? </StyledText>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <StyledText style={{ fontWeight: 'bold' }}>Đăng ký</StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
