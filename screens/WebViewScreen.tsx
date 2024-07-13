import React from 'react';
import {WebView} from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../type';

type WebViewScreenRouteProp = RouteProp<RootStackParamList, 'WebView'>;

type Props = {
  route: WebViewScreenRouteProp;
};

const WebViewScreen: React.FC<Props> = ({route}) => {
  const {token, fcmToken} = route.params;
  const url = `https://yourwebsite.com?token=${token}&fcmToken=${fcmToken}`;

  return <WebView source={{uri: url}} />;
};

export default WebViewScreen;
