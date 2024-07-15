import React, {useEffect, useRef, useState} from 'react';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../type';

import {useRoute} from '@react-navigation/native';
import {I18nManager, Image, StyleSheet, View} from 'react-native';
import {ActivityIndicator, TextInput} from 'react-native-paper';
import useVerifyCode from '../services/auth/hooks/useVerifyCode';
import {persianNumber2english} from '../utilities/number';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CheckOtp'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const CheckOtp: React.FC<Props> = ({navigation}) => {
  const route = useRoute();
  const {phoneNumber} = route.params as {phoneNumber: string};

  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  // @ts-ignore
  const inputs = useRef<Array<TextInput | null>>([]);
  const {mutate, isPending} = useVerifyCode({navigation});

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input box if text is entered
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    // Move to previous input box if backspace is pressed and the box is empty
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const otpCode = otp.toString().split(',').join('');
    if (otpCode.length === 4) {
      mutate({
        otpCode: persianNumber2english(otpCode),
        phoneNumber: phoneNumber,
      });
    }
  }, [otp]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/customer-club.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.otpContainer}>
        {otp.map((_, index) => (
          <TextInput
            disabled={isPending}
            key={index}
            ref={(ref: any) => (inputs.current[index] = ref)}
            style={styles.input}
            mode="outlined"
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index]}
            onChangeText={text => handleChange(text, index)}
          />
        ))}
      </View>
      {isPending && (
        <ActivityIndicator style={{paddingTop: 20}} animating={true} />
      )}
    </View>
  );
};

export default CheckOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  imageContainer: {
    paddingVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },

  otpContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-evenly',
  },
  input: {
    textAlign: 'center',
    direction: 'ltr',
  },
});
