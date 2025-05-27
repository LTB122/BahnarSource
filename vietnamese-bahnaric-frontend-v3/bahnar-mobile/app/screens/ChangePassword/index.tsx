import { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';

import { FormButton, Icon, StyledText } from '../../components';
import { Container, Header, ScreenLayout } from '../../layout';
import AuthService from '../../services/auth.service';
import { RootStackScreenProps } from '../../types/navigation';

const VN_SECTION_HEIGHT = 265;

export default function ChangePasswordScreen({
  navigation,
}: RootStackScreenProps<'ChangePassword'>) {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [retypeNewPassword, setRetypeNewPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const onSaveButtonPress = () => {
    if (!newPassword || !retypeNewPassword || !oldPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (newPassword !== retypeNewPassword) {
      setErrorMsg('Mật khẩu mới không khớp');
      return;
    }
    AuthService.changePassword(oldPassword, newPassword)
      .then(() => {
        navigation.pop();
      })
      .catch((err) => {
        setErrorMsg(err?.response?.data?.message || 'Đã có lỗi xảy ra');
      });
  };

  return (
    <ScreenLayout
      scrollEnabled
      style={{
        backgroundColor: '#F2F5FF',
      }}
      safeArea
    >
      <Header
        expand={false}
        title='Đổi mật khẩu'
        renderLeftIcon={() => (
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Icon.ArrowLeft fill='white' width={24} height={24} />
          </TouchableOpacity>
        )}
        renderRightIcon={() => (
          <Icon.CharacterCursorIbeam fill='black' width={28} height={28} />
        )}
      />
      <Container
        style={{
          minHeight: VN_SECTION_HEIGHT,
          maxHeight: VN_SECTION_HEIGHT,
        }}
      >
        <StyledText
          style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 16 }}
        >
          Mật khẩu cũ
        </StyledText>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder='Mật khẩu cũ'
          secureTextEntry={true}
          style={{
            borderRadius: 8,
            backgroundColor: 'white',
            paddingHorizontal: 16,
            minHeight: 52,

            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        />

        <StyledText
          style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 16 }}
        >
          Mật khẩu mới
        </StyledText>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder='Mật khẩu mới'
          secureTextEntry={true}
          style={{
            borderRadius: 8,
            backgroundColor: 'white',
            paddingHorizontal: 16,
            minHeight: 52,

            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        />

        <StyledText
          style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 16 }}
        >
          Nhập lại mật khẩu mới
        </StyledText>
        <TextInput
          value={retypeNewPassword}
          onChangeText={setRetypeNewPassword}
          placeholder='Nhập lại mật khẩu mới'
          secureTextEntry={true}
          style={{
            borderRadius: 8,
            backgroundColor: 'white',
            paddingHorizontal: 16,
            minHeight: 52,

            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        />

        {errorMsg && (
          <StyledText
            style={{
              fontSize: 12,
              color: 'red',
              marginTop: 8,
            }}
          >
            {errorMsg}
          </StyledText>
        )}
        <FormButton
          style={{
            width: 148,
            height: 52,
            marginTop: 24,
          }}
          onPress={onSaveButtonPress}
        >
          <StyledText style={{ color: 'white' }}>Lưu</StyledText>
        </FormButton>
      </Container>
    </ScreenLayout>
  );
}
