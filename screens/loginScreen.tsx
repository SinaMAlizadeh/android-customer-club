import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../type';
import {Controller, useForm} from 'react-hook-form';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TextInput} from 'react-native-paper';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

interface FormData {
  phoneNumber: string;
}

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>();

  const onSubmit = async (values: FormData) => {
    try {
      const response = await axios.post(
        'http://130.185.78.214:5000/gateway/auth/Authenticate/SignInOtp',
        {
          phoneNumber: values?.phoneNumber,
        },
      );
      // const {token, fcmToken} = response.data;
      // Save token and navigate to WebView
      navigation.navigate('CheckOtp', {PhoneNumber: values?.phoneNumber});
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const validatePhoneNumber = (value: string) => {
    const iranPhoneNumberRegex = /^(\+98|0)?9\d{9}$/;
    return iranPhoneNumberRegex.test(value) || 'Invalid phone number';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ورود به اپلیکیشن 123456</Text>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            label="Phone Number"
            mode="outlined"
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            style={styles.input}
            error={!!errors.phoneNumber}
          />
        )}
        name="phoneNumber"
        rules={{
          required: 'Phone number is required',
          validate: validatePhoneNumber,
        }}
        defaultValue=""
      />
      {errors.phoneNumber && (
        <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'IRANSansMobileFaNum',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default LoginScreen;
