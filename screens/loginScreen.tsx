import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../type';
import {Controller, useForm} from 'react-hook-form';

import {Button, Text, TextInput} from 'react-native-paper';
import {loginPayload} from '../services/auth/type';
import useMutateSignIn from '../services/auth/hooks/useLogin';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<loginPayload>();

  const {mutate, isPending, isSuccess, data} = useMutateSignIn({navigation});

  const onSubmit = async (values: loginPayload) => {
    mutate({...values});
  };

  const validatePhoneNumber = (value: string) => {
    const iranPhoneNumberRegex = /^(\+98|0)?9\d{9}$/;
    return (
      iranPhoneNumberRegex.test(value) ||
      'شماره تلفن همراه را به درستی وارد نمایید'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/customer-club.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              label="شماره تلفن همراه"
              mode="outlined"
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
              value={value}
              style={styles.input}
              maxLength={11}
              error={!!errors.phoneNumber}
            />
          )}
          name="phoneNumber"
          rules={{
            required: 'شماره همراه الزامی می باشد',
            validate: validatePhoneNumber,
          }}
          defaultValue=""
        />
        {errors?.phoneNumber && (
          <Text style={styles?.errorText}>{errors?.phoneNumber?.message}</Text>
        )}
        <Button
          mode="contained"
          style={styles.button}
          disabled={isPending}
          loading={isPending}
          onPress={handleSubmit(onSubmit)}>
          ارسال کد فعال سازی
        </Button>
      </View>
    </View>
  );
};

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
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'IRANSansMobileFaNum',
  },
  input: {
    textAlign: 'left',
  },

  button: {
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 50,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
  },
});

export default LoginScreen;
