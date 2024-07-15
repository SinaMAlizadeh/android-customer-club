import {useMutation} from '@tanstack/react-query';
import authService from '..';
import {loginPayload, verifyOtpPayload} from '../type';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../type';
import {ToastAndroid} from 'react-native';
import {AxiosError} from 'axios';
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
    onSuccess: data => {
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
