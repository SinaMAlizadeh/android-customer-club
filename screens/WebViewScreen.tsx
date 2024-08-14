import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import {Text} from 'react-native-paper';
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import {useUpdateInfo} from '../services/fcm/hooks/useUpdateInfo';
import {RootStackParamList} from '../type';

type WebViewScreenRouteProp = RouteProp<RootStackParamList, 'WebView'>;
type WebViewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'WebView'
>;

type Props = {
  route: WebViewScreenRouteProp;
  navigation: WebViewScreenNavigationProp;
};

const WebViewScreen: React.FC<Props> = ({route, navigation}) => {
  // const {token} = route.params;

  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const webviewRef = useRef<WebView>(null);
  const [imie, setImie] = useState<string>();
  const [fcm, setFcm] = useState<string>();

  const {mutate} = useUpdateInfo();

  const LoadingIndicatorView = () => {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingHeader}> مشتریه من </Text>
        <LottieView
          source={require('../assets/loading.json')}
          autoPlay
          loop
          style={styles.lottie}
          speed={0.5}
        />
        <Text style={styles.loadingText}> در حال بارگزاری اطلاعات</Text>
      </View>
    );
  };

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true;
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const onNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
  };

  const onMessage = async (event: WebViewMessageEvent) => {
    if (event.nativeEvent.data === 'logout') {
      // Navigate to the logout page
      await AsyncStorage.removeItem('token');
      navigation.navigate('Login');
    }
  };

  const injectedJavaScript = `
    document.addEventListener('logout', function() {
      window.ReactNativeWebView.postMessage('logout');
    });
  `;

  useEffect(() => {
    const getToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          setFcm(fcmToken);
          const uniqueId = await getUniqueId();
          console.log(uniqueId);
          setImie(uniqueId);
          mutate({
            imei: uniqueId,
            pushToken: fcmToken,
          });
          console.log('Your Firebase Cloud Messaging Token:', fcmToken);
        } else {
          console.log('Failed to get FCM token');
        }
      } catch (error) {
        console.error('Error getting FCM token', error);
      }
    };

    getToken();
  }, [mutate]);

  const url = `http://130.185.78.214/auth/login?platform=android&fcm=${fcm}&imie=${imie}`;
  return (
    <WebView
      ref={webviewRef}
      source={{uri: url}}
      cacheEnabled={false}
      cacheMode="LOAD_NO_CACHE"
      originWhitelist={['*']}
      startInLoadingState={true}
      renderLoading={LoadingIndicatorView}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      style={styles.flex}
      onMessage={onMessage}
      onNavigationStateChange={onNavigationStateChange}
      injectedJavaScript={injectedJavaScript}
    />
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    flexDirection: 'row',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingHeader: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingText: {
    color: 'black',
  },
  lottie: {
    width: 300,
    height: 300,
  },
});
