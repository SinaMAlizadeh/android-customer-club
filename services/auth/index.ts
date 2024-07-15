import axios from 'axios';
import {loginPayload, verifyOtpPayload} from './type';
import {ContentType} from '../../type';

const login = async (payload: loginPayload) =>
  await axios.post(
    'http://130.185.78.214:5000/gateway/auth/Authenticate/SignInOtp',
    {
      phoneNumber: payload?.phoneNumber,
    },
  );

const checkOtp = async (payload: verifyOtpPayload) => {
  const response = await axios.post(
    'http://130.185.78.214:5000/gateway/auth/Authenticate/VerifyOtp',
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response; // Handle the response as needed
};

const authService = {
  login,
  checkOtp,
};

export default authService;
