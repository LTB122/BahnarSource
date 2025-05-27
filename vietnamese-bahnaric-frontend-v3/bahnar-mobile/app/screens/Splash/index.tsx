import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
import { Animated, Image, View } from 'react-native';

import { IconBox } from '../../components';
import { useBoundStore } from '../../store';

export default function SplashScreen() {
  const { updateSplash } = useBoundStore((state) => state);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        updateSplash(false);
      }, 1500);
    }, [updateSplash])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F2F5FF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <IconBox
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 40.625,
            backgroundColor: '#fff',
            width: 130,
            aspectRatio: 1,
            shadowColor: '#000',
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
          }}
        >
          <Image
            style={{
              width: 50,
            }}
            resizeMode='contain'
            source={require('../../assets/images/logo.png')}
          />
        </IconBox>
      </Animated.View>
    </View>
  );
}
