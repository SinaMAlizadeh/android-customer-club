import axios from 'axios';
import {UpdateInfoPayload} from './type';

const updateInfo = async (payload: UpdateInfoPayload) =>
  await axios.post('https://api.padix.ir/gateway/auth/AppInfo', payload);

const infoService = {
  updateInfo,
};

export default infoService;
