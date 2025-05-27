// // import TextRecognition from '@react-native-ml-kit/text-recognition';
// import { useIsFocused } from '@react-navigation/native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
// import {
//   GestureHandlerRootView,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native-gesture-handler';
// import {
//   ImagePickerResponse,
//   launchImageLibrary,
// } from 'react-native-image-picker';
// import Animated, {
//   SharedValue,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from 'react-native-reanimated';
// import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
// import {
//   Camera,
//   CameraDevice,
//   CameraDevices,
//   PhotoFile,
//   VideoFile,
//   useCameraDevices,
// } from 'react-native-vision-camera';

// const PILL_SHAPED_BUTTON_HEIGHT = 72;

// import {
//   BottomSheet,
//   CaptureButton,
//   Icon,
//   PillShapedButton,
//   StyledText,
// } from '../../components';
// import { CONTENT_SPACING, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constants';
// import useAppState from '../../hooks/useAppState';
// import { RootStackScreenProps } from '../../types/navigation';

// export default function CameraScreen({
//   navigation,
// }: RootStackScreenProps<'Camera'>) {
//   const insets: EdgeInsets = useSafeAreaInsets();
//   const camera = useRef<Camera>(null);

//   const [isCameraInitialized, setIsCameraInitialized] = useState(false);
//   const [imagePath, setImagePath] = useState<string | undefined>();
//   const [recognizedText, setRecognizedText] = useState<string | undefined>();
//   const [errorMsg, setErrorMsg] = useState<string | undefined>();

//   const devices: CameraDevices = useCameraDevices();
//   const device: CameraDevice | undefined = devices.back;

//   const pillShapedButtonY: SharedValue<number> = useSharedValue(
//     PILL_SHAPED_BUTTON_HEIGHT + 24
//   );
//   const pillShapedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: pillShapedButtonY.value }],
//   }));

//   const zoom: SharedValue<number> = useSharedValue(0);
//   const minZoom: number = device?.minZoom ?? 1;
//   const maxZoom: number = Math.min(device?.maxZoom ?? 1, 20);

//   const isFocussed: boolean = useIsFocused();
//   const { appState } = useAppState({});
//   const isForeground: boolean = appState === 'active';
//   const isActive: boolean = isFocussed && isForeground;

//   const textRecognized = useCallback(async (path: string) => {
//     try {
//       if (!TextRecognition?.recognize) {
//         throw new Error(
//           "No 'recognize' method found on TextRecognition module"
//         );
//       }
//       const { text } = await TextRecognition.recognize(path);
//       setRecognizedText(text);
//       console.log('text', text);
//     } catch (error) {
//       console.log(error);
//       setErrorMsg('Đã xảy ra lỗi, vui lòng thử lại!');
//     }
//   }, []);

//   const onMediaCaptured = useCallback(
//     (media: PhotoFile | VideoFile, type: 'photo' | 'video') => {
//       console.log(`Media captured! ${JSON.stringify(media)}`);
//       console.log(`Type: ${type}`);
//       setImagePath('file://' + media.path);
//       textRecognized('file://' + media.path);
//     },
//     [textRecognized]
//   );

//   const onImagePick = useCallback(async () => {
//     try {
//       const photo: ImagePickerResponse = await launchImageLibrary({
//         selectionLimit: 1,
//         mediaType: 'photo',
//         includeBase64: false,
//       });
//       textRecognized(photo?.assets?.[0].uri || '');
//       setImagePath(photo?.assets?.[0].uri || '');
//     } catch (error) {
//       console.log(error);
//     }
//   }, [textRecognized]);

//   const onInitialized = useCallback(() => {
//     console.log('Camera initialized!');
//     setIsCameraInitialized(true);
//   }, []);

//   const resetBottomSheet = useCallback(() => {
//     setImagePath(undefined);
//     setRecognizedText(undefined);
//     setErrorMsg(undefined);
//   }, []);

//   useEffect(() => {
//     const getAndRequestCameraPermission = async () => {
//       try {
//         const hasCameraPermission = await Camera.getCameraPermissionStatus();
//         if (hasCameraPermission !== 'authorized') {
//           await Camera.requestCameraPermission();
//         }
//       } catch (error) {
//         navigation.goBack();
//         console.log(error);
//       }
//     };

//     getAndRequestCameraPermission();
//   }, [navigation]);

//   useEffect(() => {
//     if (imagePath) {
//       pillShapedButtonY.value = withSpring(-24);
//     } else {
//       pillShapedButtonY.value = withSpring(PILL_SHAPED_BUTTON_HEIGHT + 24);
//     }
//   }, [imagePath, pillShapedButtonY]);

//   if (!device)
//     return (
//       <View style={styles.container}>
//         <Text>
//           <ActivityIndicator size='small' color={'#262664'} />;
//         </Text>
//       </View>
//     );
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         <TouchableOpacity
//           containerStyle={[
//             styles.goBackButton,
//             {
//               top: insets.top + CONTENT_SPACING + 24,
//               left: insets.left + CONTENT_SPACING + 16,
//             },
//           ]}
//           onPress={() =>
//             navigation.navigate('MainBottomTab', {
//               screen: 'Main',
//               params: {},
//             })
//           }
//         >
//           <Icon.ChevronLeft fill={'white'} width={24} height={24} />
//         </TouchableOpacity>
//         <Camera
//           ref={camera}
//           onInitialized={onInitialized}
//           device={device}
//           photo={true}
//           style={StyleSheet.absoluteFill}
//           isActive={true}
//         />
//         <CaptureButton
//           style={[
//             styles.captureButton,
//             {
//               bottom: insets.bottom + CONTENT_SPACING,
//             },
//           ]}
//           camera={camera}
//           onMediaCaptured={onMediaCaptured}
//           cameraZoom={zoom}
//           minZoom={minZoom}
//           maxZoom={maxZoom}
//           flash={'off'}
//           enabled={isCameraInitialized && isActive}
//           setIsPressingButton={() => {}}
//         />
//         <View
//           style={[
//             styles.bottomRow,
//             {
//               bottom: insets.bottom + CONTENT_SPACING,
//             },
//           ]}
//         >
//           <TouchableOpacity
//             containerStyle={[styles.button]}
//             onPress={onImagePick}
//           >
//             <Icon.PhotoFill fill={'white'} width={20} height={20} />
//           </TouchableOpacity>
//         </View>

//         <BottomSheet isOpen={!!imagePath}>
//           {imagePath ? (
//             <View style={styles.imageContainer}>
//               <Image
//                 source={{ uri: imagePath }}
//                 style={styles.image}
//                 resizeMode='contain'
//               />

//               <ScrollView
//                 contentContainerStyle={styles.textContainer}
//                 style={{
//                   marginTop: 16,
//                 }}
//               >
//                 {!!recognizedText || !!errorMsg ? (
//                   <>
//                     <StyledText style={styles.text}>
//                       {recognizedText || ''}
//                     </StyledText>
//                     <StyledText
//                       style={[styles.text, { color: 'red', marginTop: 32 }]}
//                     >
//                       {errorMsg || ''}
//                     </StyledText>
//                   </>
//                 ) : (
//                   <ActivityIndicator size='small' color={'#262664'} />
//                 )}
//               </ScrollView>
//             </View>
//           ) : (
//             <View
//               style={[
//                 styles.imageContainer,
//                 {
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                 },
//               ]}
//             >
//               <Text>
//                 <ActivityIndicator size='small' color={'#262664'} />
//               </Text>
//             </View>
//           )}
//         </BottomSheet>

//         <Animated.View
//           style={[
//             pillShapedStyle,
//             {
//               position: 'absolute',
//               elevation: 4,
//               zIndex: 4,
//               bottom: 0,
//               alignSelf: 'center',
//               justifyContent: 'space-between',
//               flexDirection: 'row',
//             },
//           ]}
//         >
//           <PillShapedButton
//             text='Chụp lại'
//             style={{
//               height: PILL_SHAPED_BUTTON_HEIGHT,
//               width: (SCREEN_WIDTH - 64) / 2 - 4,
//               backgroundColor: 'white',
//             }}
//             textStyle={{ color: '#1C45F9' }}
//             onPress={resetBottomSheet}
//           />
//           <PillShapedButton
//             text='Sử dụng'
//             style={{
//               height: PILL_SHAPED_BUTTON_HEIGHT,
//               width: (SCREEN_WIDTH - 64) / 2 - 4,
//             }}
//             onPress={() => {
//               navigation.navigate('MainBottomTab', {
//                 screen: 'Main',
//                 params: {
//                   imageText: recognizedText,
//                 },
//               });
//             }}
//           />
//         </Animated.View>
//       </View>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//     position: 'relative',
//   },
//   captureButton: {
//     position: 'absolute',
//     alignSelf: 'center',
//   },
//   goBackButton: {
//     position: 'absolute',
//     elevation: 2,
//     zIndex: 2,
//     width: 40,
//     height: 40,
//     borderRadius: 40 / 2,
//     backgroundColor: 'rgba(140, 140, 140, 0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bottomRow: {
//     position: 'absolute',
//     flexDirection: 'row',
//   },
//   button: {
//     marginBottom: 16,
//     marginHorizontal: 60,
//     width: 40,
//     height: 40,
//     borderRadius: 40 / 2,
//     backgroundColor: 'rgba(140, 140, 140, 0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageContainer: {
//     display: 'flex',
//     flex: 1,
//     flexDirection: 'column',
//     padding: 16,
//   },
//   image: {
//     height: SCREEN_HEIGHT / 3,
//   },
//   text: {
//     fontSize: 16,
//     textAlign: 'justify',
//   },
//   textContainer: {
//     padding: 16,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
