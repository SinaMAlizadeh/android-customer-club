import React, {useEffect, useRef, useState} from 'react';

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../type';

import {useRoute} from '@react-navigation/native';
import {Alert, I18nManager, Image, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Button, Text, TextInput} from 'react-native-paper';
import useVerifyCode from '../services/auth/hooks/useVerifyCode';
import {persianNumber2english} from '../utilities/number';
import CountDown from '../components/countDown';
import CountdownTimer from '../components/countDown';
import useMutateSignIn from '../services/auth/hooks/useLogin';

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
  const [showCountDown, setShowCountDown] = useState<boolean>(true);
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const {mutate: sendOtpAgain, isPending: sneOtpAginPending} = useMutateSignIn({
    navigation,
  });
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

  const handleFinish = () => {
    setShowCountDown(false);
  };

  const handleReset = () => {
    setShowCountDown(true);
    sendOtpAgain({
      phoneNumber: phoneNumber,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/customer-club.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.titleContainer}>
        <Text> کد ارسال شده را وارد نمایید</Text>
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
      {showCountDown ? (
        <CountdownTimer
          initialSeconds={10}
          onFinish={handleFinish}
          onReset={handleReset}
        />
      ) : (
        <View style={styles.resetBtnContainer}>
          <Button
            style={styles.resetBtn}
            mode="outlined"
            onPress={handleReset}
            loading={sneOtpAginPending}>
            ارسال دوباره
          </Button>
        </View>
      )}

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

  titleContainer: {
    paddingVertical: 20,
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

  resetBtnContainer: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resetBtn: {
    width: 120,
    borderRadius: 50,
    fontSize: 12,
  },
});
