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
import {useUpdateInfo} from '../services/fcm/hooks/useUpdateInfo';

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

    requestUserPermission();
    getToken();
  }, [mutate]);

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
