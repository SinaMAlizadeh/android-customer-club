import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../type';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://130.185.78.214:5000/gateway/auth/Authenticate/SignInOtp',
        {
          phoneNumber,
        },
      );
      const {token, fcmToken} = response.data;
      // Save token and navigate to WebView
      //navigation.navigate('WebView', {token, fcmToken});
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        placeholder="phoneNumber"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
