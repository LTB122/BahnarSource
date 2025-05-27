import { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';

import { FormButton, Icon, StyledText } from '../../components';
import { Container, Header, ScreenLayout } from '../../layout';
import UserService from '../../services/user.service';
import { RootStackScreenProps } from '../../types/navigation';

const VN_SECTION_HEIGHT = 265;

/**
 * ChangeInputScreen
 * @param props
 * @returns
 */
export default function ChangeInputScreen({
  navigation,
  route,
}: RootStackScreenProps<'ChangeInput'>) {
  const { title, value, userProp, keyboardType } = route.params;
  const [_value, _setValue] = useState<string>(value);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const onSaveButtonPress = () => {
    UserService.updateProfile({ [userProp]: _value })
      .then(() => {
        navigation.pop();
      })
      .catch((error: any) => {
        if (error.response) setErrorMsg(error.response.data.message);
        else setErrorMsg('Đã có lỗi xảy ra');
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
        title={title}
        renderLeftIcon={() => (
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Icon.ArrowLeft fill='white' width={24} height={24} />
          </TouchableOpacity>
        )}
        renderRightIcon={() => (
          <Icon.CharacterCursorIbeam fill='black' width={28} height={28} />
        )}
      />
      {/* Vietnamese Section */}
      <Container
        style={{
          minHeight: VN_SECTION_HEIGHT,
          maxHeight: VN_SECTION_HEIGHT,
        }}
      >
        <StyledText
          style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}
        >
          {title}
        </StyledText>
        <TextInput
          value={_value}
          onChangeText={(text: string) => _setValue(text)}
          keyboardType={keyboardType}
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
