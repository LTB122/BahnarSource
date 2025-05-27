import _ from 'lodash';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  TextInputFocusEventData,
  TextInputProps,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';

import { BahnarEvent } from '../../utils/events';

export type BahnarKeyboardBaseProps = Omit<
  TextInputProps,
  'selection' | 'onChangeText' | 'onSelectionChange'
> & {
  bahnarKeyboardEnabled?: boolean;
  /**
   * @deprecated Use {@link BahnarKeyboardBaseProps.setValue} instead
   */
  onChangeText?: (text: string) => void;
  setValue: Dispatch<SetStateAction<string>>;
};

/**
 * @abstract
 * @private
 * @description Base component for Bahnar text input. However, this component will take setValue
 * as a props, as to normal onChangeText method. This solve two issues that we have in React Native:
 * - Double rendering when using onChangeText with useState
 * - onChangeText not firing when invoking setValue inside the controlled components. Reference: https://github.com/facebook/react-native/issues/23578
 * @caution use setValue instead of onChangeText
 */
function BahnarKeyboardBase({
  bahnarKeyboardEnabled = false,
  value,
  setValue,
  onFocus,
  onEndEditing,
  ...props
}: BahnarKeyboardBaseProps & TextInputProps) {
  /* Unique identifier for each input, let the Bahnar keyboard knows which text input to manipulate its javascript */
  const [keyboardRegisterEventId] = useState<string>(_.uniqueId(''));

  const [selection, setSelection] = useState<{
    start: number;
    end?: number;
  }>({
    start: 0,
    end: 0,
  });

  const inputRef = useRef<TextInput>(null);

  const _onFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      /* Trigger bahnar special keyboard if this is a bahnar text input */
      if (bahnarKeyboardEnabled) {
        EventRegister.emit(
          BahnarEvent.BAHNAR_KEYBOARD_OPEN,
          keyboardRegisterEventId
        );
      }
      onFocus?.(e);
    },
    [bahnarKeyboardEnabled, onFocus, keyboardRegisterEventId]
  );

  const _onEndEditing = useCallback(
    (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
      /* Close the Bahnar special keyboard if this is a bahnar text input */
      if (bahnarKeyboardEnabled) {
        EventRegister.emit(BahnarEvent.BAHNAR_KEYBOARD_CLOSE);
      }
      onEndEditing?.(e);
    },
    [bahnarKeyboardEnabled, onEndEditing]
  );

  const onChangeText = useCallback(
    (text: string) => {
      setValue(text);
    },
    [setValue]
  );

  const onSelectionChange = useCallback(
    (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      setSelection(e.nativeEvent.selection);
    },
    []
  );

  useEffect(() => {
    if (bahnarKeyboardEnabled) {
      /**
       * If this is a Bahnar text input, register a listener to listen for keyboard events,
       */
      const clientKeyRegisterId: string | boolean =
        EventRegister.addEventListener(keyboardRegisterEventId, (key) => {
          setValue(
            (prevValue) =>
              prevValue.slice(0, selection?.start) +
              key +
              prevValue.slice(selection?.end)
          );
        });

      return () => {
        clientKeyRegisterId &&
          EventRegister.removeEventListener(
            typeof clientKeyRegisterId === 'string'
              ? clientKeyRegisterId
              : keyboardRegisterEventId
          );
      };
    }
  }, [bahnarKeyboardEnabled, keyboardRegisterEventId, setValue, selection]);

  return (
    <TextInput
      {..._.omit(props, ['onChangeText', 'selection', 'onSelectionChange'])}
      ref={inputRef}
      value={value}
      onFocus={_onFocus}
      onEndEditing={_onEndEditing}
      onChangeText={onChangeText}
      autoCorrect={false}
      onSelectionChange={onSelectionChange}
    />
  );
}

export default BahnarKeyboardBase;
