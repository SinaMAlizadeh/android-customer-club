import React, {useEffect, useRef, useState} from 'react';
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../type';
import {BackHandler, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {getUniqueId, getManufacturer} from 'react-native-device-info';

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

  const LoadingIndicatorView = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator style={{paddingTop: 20}} animating={true} />
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
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Authorization status:', authStatus);
      }
    };

    const getToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        setFcm(fcmToken);
        console.log('Your Firebase Cloud Messaging Token:', fcmToken);
      } else {
        console.log('Failed to get FCM token');
      }
    };
    requestUserPermission();
    getToken();
  }, []);

  getUniqueId().then(uniqueId => {
    // iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
    // Android: "dd96dec43fb81c97"
    // Windows: "{2cf7cb3c-da7a-d508-0d7f-696bb51185b4}"
    console.log(uniqueId);
    setImie(uniqueId);
  });

  const url = `http://130.185.78.214/auth/login?platform=android&fcm=${fcm}&imie=${imie}`;
  return (
    <>
      <Text>{imie}</Text>
      <Text>{fcm}</Text>
      <WebView
        ref={webviewRef}
        source={{uri: url}}
        startInLoadingState={true}
        renderLoading={LoadingIndicatorView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.flex}
        onMessage={onMessage}
        onNavigationStateChange={onNavigationStateChange}
        injectedJavaScript={injectedJavaScript}
      />
    </>
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
});
