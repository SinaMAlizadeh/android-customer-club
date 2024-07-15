export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  CheckOtp: {PhoneNumber: string};
  WebView: {token: string; fcmToken: string};
};
