import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from 'react-native-track-player';

import Tail from '../../assets/svg/tail.svg';
import { Icon, StyledText, TextArea } from '../../components';
import {
  CONTENT_SPACING,
  HEADER_VIEW_INITIAL_HEIGHT,
  SCREEN_HEIGHT,
} from '../../constants';
import { Container, Header, ScreenLayout } from '../../layout';
import TranslateService from '../../services/translate.service';
import VoiceService from '../../services/voice.service';
import { useBoundStore, usePersistStore } from '../../store';
import { isAuthSelector } from '../../store/usePersistStore';
import { Profile } from '../../types';
import { MainBottomTabScreenProps } from '../../types/navigation';
import FetchUtils from '../../utils/FetchUtils';

import SavedSection from './SavedSection';
import styles from './styles';

const VN_SECTION_HEIGHT = 265;

const events: Event[] = [Event.PlaybackState, Event.PlaybackError];

export default function MainScreen({
  navigation,
  route,
}: MainBottomTabScreenProps<'Main'>) {
  const insets: EdgeInsets = useSafeAreaInsets();

  const BAHNAR_SECTION_HEIGHT = useMemo(() => {
    return (
      SCREEN_HEIGHT -
      (insets.top + CONTENT_SPACING) -
      HEADER_VIEW_INITIAL_HEIGHT -
      VN_SECTION_HEIGHT -
      38 -
      (insets.bottom + CONTENT_SPACING + 48) +
      (Platform?.select({
        ios: CONTENT_SPACING,
        android: -48,
      }) || 0)
    );
  }, [insets]);

  const SAVED_SECTION_CLOSE_BOTTOM = 0;
  const SAVED_SECTION_OPEN_BOTTOM = useMemo(
    () => BAHNAR_SECTION_HEIGHT - 52 * 2 + 28 - 4,
    [BAHNAR_SECTION_HEIGHT]
  );

  const params = route.params;
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [loading, setLoading] = useState<boolean>(false);

  const [vnText, setVnText] = useState<string>('');
  const [bahnarText, setBahnarText] = useState<string>('');

  const [speechLoading, setSpeechLoading] = useState<boolean>(false);

  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [genderSelectionOpen, setGenderSelectionOpen] =
    useState<boolean>(false);

  const [bottomTabOpen, setBottomTabOpen] = useState<boolean>(false);
  const [bottom] = useState<Animated.Value>(
    new Animated.Value(SAVED_SECTION_CLOSE_BOTTOM)
  );

  const isAuthenticated: boolean = usePersistStore(isAuthSelector);
  const { settings } = usePersistStore((state) => state);
  const profile: Profile | null = useBoundStore((state) => state.profile);

  /**
   * Copy bahnar text to clipboard
   */
  const handleCopy: () => void = useCallback(() => {
    if (bahnarText.length > 0) {
      Clipboard.setString(bahnarText);
    }
  }, [bahnarText]);

  /**
   * Calling API to translate text
   */
  const handleTranslate: () => void = useCallback(() => {
    setLoading(true);
    TranslateService.translate(vnText)
      .then((res) => {
        setBahnarText(res?.data?.tgt || '');
      })
      .catch((err) => {
        console.log(JSON.stringify(err.response));
      })
      .finally(() => setLoading(false));
  }, [vnText, setBahnarText]);

  /**
   * Calling API to get bahnar voice
   */
  const handleBahnarVoice: () => Promise<void> = useCallback(async () => {
    try {
      // Resetting the track player every time the user presses the voice button
      await TrackPlayer.reset();
      setSpeechLoading(true);
      if (bahnarText.length === 0) throw new Error('No text to speech');
      const { data } = await VoiceService.getBahnarVoice(
        bahnarText,
        gender,
        settings.region
      );

      const urls = JSON.parse(data).urls;

      console.log('Start polling');

      // Fetch until the audio is available
      for (let url of urls) {
        await FetchUtils.polling(() => axios.get(url), {
          interval: 2000,
          maxCount: 5,
          onError: () => {
            console.log("Can't fetch audio at ", url);
          },
        });

        await TrackPlayer.add({ url });
        console.log('Track ', url, ' added');
      }

      await TrackPlayer.play();

      setSpeechLoading(false);

      console.log('Track played!');
    } catch (error: unknown) {
      setTimeout(() => setSpeechLoading(false), 2000);
      Alert.alert('Lỗi', 'Không thể phát âm thanh');
    }
  }, [bahnarText, gender, settings]);

  /**
   * Navigate to Login screen if not authenticated
   */
  const handleUserProfilePress: () => Promise<void> = useCallback(async () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
    } else {
      navigation.navigate('Settings');
    }
  }, [isAuthenticated, navigation]);

  /**
   * Calling API to save translation
   */
  const handleSave: () => void = useCallback(async () => {
    if (vnText?.length === 0 || bahnarText?.length === 0) return;
    setLoading(true);
    console.log(vnText, bahnarText);
    try {
      await TranslateService.save(vnText, bahnarText);
      setBottomTabOpen(false);
    } catch (error: any) {
      console.log(JSON.stringify(error.response));
    } finally {
      setLoading(false);
      setBottomTabOpen(true);
    }
  }, [vnText, bahnarText, setBottomTabOpen]);

  /**
   * Reset all text & audio & states
   */
  const handleReset: () => void = useCallback(() => {
    setVnText('');
    setBahnarText('');
    setLoading(false);
    setSpeechLoading(false);
    TrackPlayer.reset();
  }, []);

  /**
   * Animation for Saved Section open/close mechanism
   */
  useEffect(() => {
    Animated.timing(bottom, {
      toValue: bottomTabOpen
        ? SAVED_SECTION_OPEN_BOTTOM
        : SAVED_SECTION_CLOSE_BOTTOM,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [bottomTabOpen, bottom, SAVED_SECTION_OPEN_BOTTOM]);

  /**
   * Initialize parameters listener
   */
  useFocusEffect(
    useCallback(() => {
      if (params?.imageText) {
        setVnText(params?.imageText);
      } else if (params?.filePath) {
        console.log('filePath', params?.filePath);
      }
    }, [params])
  );

  /**
   * Listen to TrackPlayer events and state for debugging
   */
  useTrackPlayerEvents(events, (event) => {
    if (event.type === Event.PlaybackError) {
      console.warn(
        'An error occured while playing the current track.',
        JSON.stringify(event)
      );
      Alert.alert('Lỗi', 'Không thể phát âm thanh');
    }
    if (event.type === Event.PlaybackState) {
      console.log('[TrackPlayer]', event.state);
    }
  });

  return (
    <ScreenLayout style={styles.container} safeArea>
      <Header
        expand={mode === 'voice'}
        title={mode === 'text' ? 'Dịch âm thanh' : 'Dịch văn bản'}
        renderLeftIcon={() => (
          <TouchableOpacity onPress={handleUserProfilePress}>
            {isAuthenticated ? (
              <Image
                source={
                  profile?.picture
                    ? { uri: profile?.picture }
                    : require('../../assets/images/user-placeholder.png')
                }
                style={styles.userPicture}
              />
            ) : (
              <Icon.Human fill='white' width={24} height={24} />
            )}
          </TouchableOpacity>
        )}
        renderRightIcon={() =>
          mode === 'text' ? (
            <Icon.CharacterCursorIbeam fill='black' width={28} height={28} />
          ) : (
            <Icon.WaveForm fill='black' width={28} height={28} />
          )
        }
        renderExpandedComponent={() => (
          <View
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => setMode('text')}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 52,
                width: 104,
                height: 104,
              }}
            >
              <Icon.MicFill width={44} height={44} />
            </TouchableOpacity>
          </View>
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

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {vnText.length !== 0 && (
              <TouchableOpacity
                style={{
                  marginLeft: 16,
                }}
                onPress={handleReset}
              >
                <Icon.XMark
                  fill={'#262664'}
                  fillOpacity={0.85}
                  width={20}
                  height={20}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TextArea
          style={{ flex: 1 }}
          value={vnText}
          setValue={setVnText}
          onFocus={() => setMode('text')}
          placeholder='Nhập văn bản'
          numberOfLines={10}
          underlineColorAndroid='transparent'
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <StyledText style={styles.textLength}>{vnText.length}</StyledText>
          <TouchableOpacity
            disabled={loading}
            onPress={handleTranslate}
            style={styles.translateButton}
          >
            <Icon.ArrowTurnUpRight fill={'white'} width={20} height={20} />
          </TouchableOpacity>
        </View>
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
                Ba-na (
                {settings.region === 'binhdinh'
                  ? 'Bình Định'
                  : settings.region === 'gialai'
                  ? 'Gia Lai'
                  : 'Kon Tum'}
                )
              </StyledText>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <View style={styles.voiceButtonContainer}>
                <TouchableOpacity
                  style={styles.voiceButton}
                  onPress={handleBahnarVoice}
                  disabled={speechLoading}
                >
                  {speechLoading ? (
                    <ActivityIndicator size='small' color={'#262664'} />
                  ) : (
                    <>
                      <Icon.Wave3Right
                        style={{ marginRight: 4 }}
                        width={10}
                        height={15}
                      />
                      <StyledText style={{ fontSize: 12 }}>
                        {gender === 'male' ? 'Nam' : 'Nữ'}
                      </StyledText>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGenderSelectionOpen(!genderSelectionOpen)}
                  style={styles.voiceSelectionButton}
                >
                  <Icon.ChevronLeft
                    style={{
                      transform: [
                        { rotateZ: genderSelectionOpen ? '90deg' : '-90deg' },
                      ],
                    }}
                    width={12}
                    height={12}
                    fill='#5F5F90'
                  />
                </TouchableOpacity>

                {genderSelectionOpen && (
                  <View style={styles.voiceSelection}>
                    <Pressable
                      style={styles.voiceSelectionItem}
                      onPress={() => {
                        setGenderSelectionOpen(false);
                        setGender('male');
                      }}
                    >
                      <StyledText>Nam</StyledText>
                    </Pressable>
                    <Pressable
                      style={styles.voiceSelectionItem}
                      onPress={() => {
                        setGenderSelectionOpen(false);
                        setGender('female');
                      }}
                    >
                      <StyledText>Nữ</StyledText>
                    </Pressable>
                  </View>
                )}
              </View>
              <TouchableOpacity style={{ marginLeft: 16 }} onPress={handleCopy}>
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
              bahnarKeyboardEnabled
              value={bahnarText}
              setValue={setBahnarText}
              onFocus={() => {
                setMode('text');
              }}
              style={{ flex: 1 }}
              placeholder='Bản dịch'
              numberOfLines={10}
              underlineColorAndroid='transparent'
            />
          )}

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <StyledText style={styles.textLength}>
              {bahnarText.length}
            </StyledText>
            {vnText.length !== 0 &&
              bahnarText.length !== 0 &&
              isAuthenticated && (
                <TouchableOpacity
                  disabled={loading}
                  onPress={handleSave}
                  style={styles.translateButton}
                >
                  {loading ? (
                    <ActivityIndicator size='small' color={'white'} />
                  ) : (
                    <Icon.SquareAndArrowDown
                      fill={'white'}
                      width={20}
                      height={20}
                    />
                  )}
                </TouchableOpacity>
              )}
          </View>
        </Container>
      </View>
      {/* SavedSection */}
      {isAuthenticated && (
        <Animated.View
          style={{
            backgroundColor: 'white',
            bottom: bottom,
            left: 0,
            width: '100%',
            height: SAVED_SECTION_OPEN_BOTTOM + 38,
            paddingHorizontal: 40,
          }}
        >
          <SavedSection
            disabled={!bottomTabOpen}
            setDisabled={(disabled) => setBottomTabOpen(!disabled)}
          />
        </Animated.View>
      )}
      <View style={{ height: SCREEN_HEIGHT / 2, backgroundColor: 'white' }} />
    </ScreenLayout>
  );
}
