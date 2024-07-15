export interface loginPayload {
  phoneNumber: string;
}

export interface verifyOtpPayload {
  phoneNumber?: string;
  otpCode?: string;
}
