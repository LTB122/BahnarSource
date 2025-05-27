import { useCallback, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';

import { BAHNAR_KEYBOARD_HEIGHT, CONTENT_SPACING } from '../../constants';
import { BahnarEvent } from '../../utils/events';
import Icon from '../Icon';
import KeyboardAvoidingView from '../KeyboardAvoidingView';
import StyledText from '../StyledText';

import characters from './characters';

export default function BahnarKeyboard() {
  const [bahnarKeyboardOpen, setBahnarKeyboardOpen] = useState<boolean>(false);
  const [keyboardRegisterEventId, setKeyboardRegisterEventId] =
    useState<string>('');
  const [endIndex, setEndIndex] = useState<number>(3);

  const setControlledEndIndex: (index: number) => void = (index: number) => {
    if (index < 3) {
      setEndIndex(3);
      return;
    }

    if (index > characters.length) {
      setEndIndex(Math.max(characters.length, 3));
      return;
    }

    setEndIndex(index);
  };

  const handleBahnarKeyPress: (key: string) => void = useCallback(
    (key: string) => {
      EventRegister.emit(keyboardRegisterEventId, key);
    },
    [keyboardRegisterEventId]
  );

  useEffect(() => {
    const keyboardOpenId: string | boolean =
      EventRegister.addEventListener(
        BahnarEvent.BAHNAR_KEYBOARD_OPEN,
        (clientInputId) => {
          console.log('keyboard open');
          setBahnarKeyboardOpen(true);
          setKeyboardRegisterEventId(clientInputId);
        }
      ) || '';

    const keyboardCloseId: string | boolean = EventRegister.addEventListener(
      BahnarEvent.BAHNAR_KEYBOARD_CLOSE,
      () => {
        console.log('keyboard close');
        setBahnarKeyboardOpen(false);
        setKeyboardRegisterEventId('');
      }
    );

    /**
     * Don't use keyboardWillHide event because it's not working on Android
     * since it cannot listen to the keyboard down button (position of the Back Button).
     */
    Keyboard.addListener('keyboardDidHide', () => {
      console.log('keyboard hide');
      setBahnarKeyboardOpen(false);
      setKeyboardRegisterEventId('');
    });

    return () => {
      keyboardOpenId &&
        EventRegister.removeEventListener(
          typeof keyboardOpenId === 'string'
            ? keyboardOpenId
            : BahnarEvent.BAHNAR_KEYBOARD_OPEN
        );

      keyboardCloseId &&
        EventRegister.removeEventListener(
          typeof keyboardCloseId === 'string'
            ? keyboardCloseId
            : BahnarEvent.BAHNAR_KEYBOARD_CLOSE
        );

      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={[
        { display: bahnarKeyboardOpen ? 'flex' : 'none' },
        styles.container,
      ]}
    >
      <TouchableOpacity onPress={() => setControlledEndIndex(endIndex - 1)}>
        <Icon.ChevronLeft width={20} height={20} fill='#5F5F90' />
      </TouchableOpacity>
      <View
        style={{
          height: BAHNAR_KEYBOARD_HEIGHT,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          minWidth: 274,
        }}
      >
        {characters.slice(endIndex - 3, endIndex).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.key}
            onPress={() => handleBahnarKeyPress(item.uncapitalized)}
          >
            <StyledText>{item.uncapitalized}</StyledText>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={() => setControlledEndIndex(endIndex + 1)}>
        <Icon.ChevronLeft
          style={{ transform: [{ rotateZ: '180deg' }] }}
          width={20}
          height={20}
          fill='#5F5F90'
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F5FF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  key: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#5F5F90',
    borderWidth: 1,
    borderRadius: 8,
    height: 28,
    width: 70,
    marginHorizontal: CONTENT_SPACING,
  },
});
