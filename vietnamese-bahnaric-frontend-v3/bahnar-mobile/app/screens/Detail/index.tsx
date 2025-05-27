import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Tail from '../../assets/svg/tail.svg';
import { Icon, StyledText, TextArea } from '../../components';
import {
  CONTENT_SPACING,
  HEADER_VIEW_INITIAL_HEIGHT,
  SCREEN_HEIGHT,
} from '../../constants';
import { Container, Header, ScreenLayout } from '../../layout';
import TranslateService from '../../services/translate.service';
import { Translate } from '../../types';
import { RootStackScreenProps } from '../../types/navigation';

import styles from './styles';

const VN_SECTION_HEIGHT = 265;

export default function DetailScreen({
  route,
  navigation,
}: RootStackScreenProps<'Detail'>) {
  const insets = useSafeAreaInsets();
  const BAHNAR_SECTION_HEIGHT =
    SCREEN_HEIGHT -
    (insets.top + CONTENT_SPACING) -
    HEADER_VIEW_INITIAL_HEIGHT -
    VN_SECTION_HEIGHT -
    38 -
    (insets.bottom + CONTENT_SPACING + 48) +
    (Platform?.select({
      ios: CONTENT_SPACING,
      android: -48,
    }) || 0);

  const params = route.params;
  const translationId: string | null = params.translationId;

  const [loading, setLoading] = useState<boolean>(false);
  const [translation, setTranslation] = useState<Translate | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!translationId) return;
      setLoading(true);
      TranslateService.findById(translationId)
        .then((res) => {
          setTranslation(res.data.payload);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoading(false));
    }, [translationId])
  );

  const handleCopy: (text: string) => void = useCallback((text: string) => {
    Clipboard.setString(text);
  }, []);

  return (
    <ScreenLayout scrollEnabled style={styles.container} safeArea>
      <Header
        expand={false}
        title='Dịch văn bản'
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
        <View style={styles.toolbar}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <StyledText style={styles.translateTitle}>Tiếng Việt</StyledText>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              onPress={() => handleCopy(translation?.src || '')}
            >
              <Icon.DocOnDoc
                fill={'#262664'}
                fillOpacity={0.85}
                width={20}
                height={20}
              />
            </TouchableOpacity>
          </View>
        </View>
        {loading ? (
          <ActivityIndicator size='small' color={'#262664'} />
        ) : (
          <TextArea
            style={{ flex: 1 }}
            editable={false}
            selectTextOnFocus={false}
            value={translation?.src}
            setValue={() => {}}
            numberOfLines={10}
            underlineColorAndroid='transparent'
          />
        )}
      </Container>

      {/* Bahnar Section */}
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 70,
          height: BAHNAR_SECTION_HEIGHT,
        }}
      >
        <Tail style={{ position: 'absolute', top: -52, right: 0 }} />
        <Container style={{ paddingBottom: 20, flex: 1 }}>
          <View style={styles.toolbar}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <StyledText style={styles.translateTitle}>
                Tiếng Bahnar
              </StyledText>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <TouchableOpacity
                style={{ marginLeft: 16 }}
                onPress={() => handleCopy(translation?.tgt || '')}
              >
                <Icon.DocOnDoc
                  fill={'#262664'}
                  fillOpacity={0.85}
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
            </View>
          </View>
          {loading ? (
            <ActivityIndicator size='small' color={'#262664'} />
          ) : (
            <TextArea
              style={{ flex: 1 }}
              value={translation?.tgt}
              setValue={() => {}}
              numberOfLines={10}
              editable={false}
              selectTextOnFocus={false}
              underlineColorAndroid='transparent'
            />
          )}
        </Container>
      </View>

      <View
        style={{
          flex: 1,
          height: SCREEN_HEIGHT,
          backgroundColor: 'white',
        }}
      />
    </ScreenLayout>
  );
}
