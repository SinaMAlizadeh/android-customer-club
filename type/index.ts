export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  CheckOtp: {phoneNumber: string};
  WebView: {token: string};
};

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}
