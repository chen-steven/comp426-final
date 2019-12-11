import {setToken} from "./token.js";
import {getAxiosInstance} from "./Axios.js";

const axios = getAxiosInstance('/account');

export async function login({name, pass}) {
  try {
    
    const res = await axios.post(`/login`, {name, pass});
    const jwt = res.data.jwt;
    setToken(jwt);
    return true;
  } catch (error) {
    return false;
  }
}

export async function createAccount({username, pass}) {
  try {
    await axios.post(`/create`, {name: username, pass: pass});
    return true;
  } catch (error) {
    return false;
  }
}

export async function getStatus() {
  try {
    return (await axios.get(`/status`)).data;
  } catch (error) {
    return false;
  }
}

