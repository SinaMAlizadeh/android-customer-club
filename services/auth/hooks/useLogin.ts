import {useMutation} from '@tanstack/react-query';
import authService from '..';
import {loginPayload} from '../type';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../type';
import {ToastAndroid} from 'react-native';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

function useMutateSignIn({navigation}: Props) {
  return useMutation({
    mutationFn: (command: loginPayload) => {
      return authService.login(command);
    },
    onSuccess: (_, variables) => {
      ToastAndroid.show('کد یک بار مصرف ارسال گردید', ToastAndroid.TOP);
      navigation.navigate('CheckOtp', {
        phoneNumber: variables?.phoneNumber,
      });
    },
  });
}

export default useMutateSignIn;
