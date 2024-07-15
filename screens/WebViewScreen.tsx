import React, {useEffect, useRef, useState} from 'react';
import {WebView, WebViewNavigation} from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../type';
import {BackHandler, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';

type WebViewScreenRouteProp = RouteProp<RootStackParamList, 'WebView'>;

type Props = {
  route: WebViewScreenRouteProp;
};

const WebViewScreen: React.FC<Props> = ({route}) => {
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
      return false;
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

  return (
    <WebView
      ref={webviewRef}
      source={{uri: url}}
      startInLoadingState={true}
      renderLoading={LoadingIndicatorView}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      style={styles.flex}
      onNavigationStateChange={onNavigationStateChange}
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
