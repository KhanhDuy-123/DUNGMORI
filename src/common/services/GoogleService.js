import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import Funcs from '../helpers/Funcs';

export async function login(callback) {
  GoogleSignin.configure();
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const token = await GoogleSignin.getTokens();
    callback(true, {
      id: userInfo.user.id,
      email: userInfo.user.email,
      name: userInfo.user.name,
      avatar: userInfo.user.photo,
      token: token.accessToken
    });
  } catch (error) {
    Funcs.log('GGLogin fail with error: ', error);
    callback(false, error);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (f.e. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
}

export async function logout(callback) {
  try {
    await GoogleSignin.signOut();
    if (callback) callback();
  } catch (error) {
    Funcs.log(error);
  }
}

export default {
  logout,
  login
};
