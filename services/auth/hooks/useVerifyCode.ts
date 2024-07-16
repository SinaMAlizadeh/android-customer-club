import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {useMutation} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {ToastAndroid} from 'react-native';
import authService from '..';
import {RootStackParamList} from '../../../type';
import {verifyOtpPayload} from '../type';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CheckOtp'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

function useVerifyCode({navigation}: Props) {
  return useMutation({
    mutationFn: (command: verifyOtpPayload) => {
      return authService.checkOtp(command);
    },
    onSuccess: async data => {
      await AsyncStorage.setItem('token', data?.data?.accessToken);
      navigation.navigate('WebView', {
        token: data?.data?.accessToken,
      });
    },
    onError(error: AxiosError) {
      ToastAndroid.show(
        (error?.response?.data as {message: string})?.message,
        ToastAndroid.TOP,
      );
    },
  });
}

export default useVerifyCode;
