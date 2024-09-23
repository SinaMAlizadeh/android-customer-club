import messaging from '@react-native-firebase/messaging';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  BackHandler,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import Contacts from 'react-native-contacts'; // Import contacts

import {getUniqueId} from 'react-native-device-info';
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import {useUpdateInfo} from '../services/fcm/hooks/useUpdateInfo';
import {RootStackParamList} from '../type';
import Geolocation from 'react-native-geolocation-service';

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
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const webviewRef = useRef<WebView>(null);
  const [imie, setImie] = useState<string>();
  const [fcm, setFcm] = useState<string>();

  const {mutate} = useUpdateInfo();

  // Function to display loading animation
  const LoadingIndicatorView = () => {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={require('../assets/loading2.json')}
          autoPlay
          loop
          style={styles.lottie}
          speed={0.5}
        />
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

  const requestContactPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'دسترسی دفترچه تلفن',
            message:
              'برای نمایش شماره تلفن های موجود در تلفن همراه لطفا دسترسی دفترچه تلفن را بدهید',
            buttonNeutral: 'بعدا سوال کنید',
            buttonNegative: 'خیر',
            buttonPositive: 'دسترسی میدم',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Contacts permission granted');
          return true;
        } else {
          console.log('Contacts permission denied');
          Alert.alert(
            'Permission Denied',
            'Cannot access contacts without permission.',
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS automatically handles permissions with the `Contacts` library
    }
  };

  const fetchContacts = async () => {
    const hasPermission = await requestContactPermission();
    if (hasPermission) {
      try {
        const contacts = await Contacts.getAll();
        const contactInfo = contacts?.map(x => ({
          firstName: x.givenName,
          lastName: x.familyName,
          displayName: x.displayName,
          phoneNumber: x.phoneNumbers[0]?.number,
        }));
        console.log('Contacts:', contactInfo);
        // Send contacts back to WebView
        webviewRef.current?.injectJavaScript(`
          window.handleContacts(${JSON.stringify(contactInfo)});
        `);
      } catch (error) {
        console.log('Error fetching contacts', error);
      }
    }
  };

  // Request Location Permission
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'دسترسی مکان',
            message: 'برای دسترسی به لوکیشن خود لطفا دسترسی لازم را بدهید.',
            buttonNeutral: 'بعدا سوال کنید',
            buttonNegative: 'خیر',
            buttonPositive: 'دسترسی میدم',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          return true;
        } else {
          console.log('Location permission denied');
          Alert.alert(
            'Permission Denied',
            'Cannot access location without permission.',
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS automatically handles permissions
    }
  };

  // Fetch User Location
  const fetchLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log('User Location:', latitude, longitude);
          // Inject location data into the WebView
          webviewRef.current?.injectJavaScript(`
          window.handleLocation(${JSON.stringify({latitude, longitude})});
        `);
        },
        error => {
          console.log('Error fetching location', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  const onMessage = async (event: WebViewMessageEvent) => {
    const messageData = event.nativeEvent.data;

    if (messageData === 'getContacts') {
      await fetchContacts();
    } else if (messageData === 'getLocation') {
      await fetchLocation();
    } else {
      Linking.openURL(messageData).catch(err => {
        Alert.alert('Error', 'Failed to open URL: ' + err.message);
      });
    }
  };

  // JavaScript to inject into the WebView
  const injectedJavaScript = `
    document.addEventListener('logout', function() {
      window.ReactNativeWebView.postMessage('logout');
    });

    window.addEventListener('message', function(event) {
      if (event.data.type === 'changeRoute') {
        window.location.href = event.data.route;
      }
    });

    // Listen for getContacts event from WebView
    document.addEventListener('getContacts', function() {
      window.ReactNativeWebView.postMessage('getContacts');
    });

    // Listen for getLocation event from WebView
    document.addEventListener('getLocation', function() {
       window.ReactNativeWebView.postMessage('getLocation');
    });
  `;

  useEffect(() => {
    const getToken = async () => {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          setFcm(fcmToken);
          const uniqueId = await getUniqueId();
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

  const url = `https://app.padix.ir/auth/login?platform=android&fcm=${fcm}&imie=${imie}`;

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
    backgroundColor: '#e7f5ff',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7f5ff',
  },
  lottie: {
    width: 300,
    height: 300,
  },
});
