import TimeAgo from "javascript-time-ago";
import en from 'javascript-time-ago/locale/en'
import {jwtDecode} from 'jwt-decode';


TimeAgo.addDefaultLocale(en);
export const timeAgo = new TimeAgo('en-US')
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};





































