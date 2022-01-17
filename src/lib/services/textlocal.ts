import axios from 'axios';
import {textLocalConfig} from "../../config";

export const sendMessage = (to: string, body: string) => {
  const env = process.env.NODE_ENV;
  if(env=='development') return {proceed:true};
  console.log(to, body,textLocalConfig.apiKey,'hi');
  return axios.get('https://api.textlocal.in/send/', {
    params: {
      apiKey:"jkhljkhkljhkljhkljh7i87gho87y8y8",
      // sender: 'SENDER',
      numbers: '91' + to,
      message: body
    }
  }).then((response) => {
    const responseJson = response.data;
    console.log(responseJson);
    if (responseJson.status === 'success') {
      console.log(`Send OTP Success to ${to}`);
      return {proceed: true};
    } else {
      console.log("Error Sending OTP");
      console.log(responseJson);
      return {proceed: false};
    }
  }).catch(e => {
    console.log("Error Sending OTP");
    console.log(e);
    return {proceed: false};
  });
};
