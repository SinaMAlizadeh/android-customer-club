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
  const {token} = route.params;
  const url = `http://130.185.78.214/auth/login?token=${token}&platform=android`;
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const webviewRef = useRef<WebView>(null);

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

  return (
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
