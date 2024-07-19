import axios from 'axios';
import {UpdateInfoPayload} from './type';

const updateInfo = async (payload: UpdateInfoPayload) =>
  await axios.post('http://130.185.78.214:5000/gateway/auth/AppInfo', payload);

const infoService = {
  updateInfo,
};

export default infoService;
