import AsyncStorage from '@react-native-community/async-storage';
import { Platform, Alert } from 'react-native';
import Funcs from '../helpers/Funcs';
import FBSDK, { ShareDialog, ShareContent } from 'react-native-fbsdk';
import Lang from 'assets/Lang';

const { LoginManager, AccessToken, GraphRequest, GraphRequestManager } = FBSDK;
const FB_USER_DATA = 'FB_USER_DATA';

export async function login(isTryLogin) {
  try {
    LoginManager.logOut();
    if (Platform.OS === 'android') LoginManager.setLoginBehavior('native_with_fallback');
    var result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) return false;
    return true;
  } catch (err) {
    if (!isTryLogin) {
      return login(true);
    } else {
      Funcs.log('FbLogin fail with error: ', err);
      return false;
    }
  }
}

export function logout(callback) {
  LoginManager.logOut();
  if (callback) callback();
}

async function getUserInfo() {
  var accessToken = await AccessToken.getCurrentAccessToken();
  return new Promise((resolve, reject) => {
    const infoRequest = new GraphRequest('/me?fields=id,name,email,picture', null, (err, user) => {
      if (!err) {
        var user = {
          id: accessToken.userID,
          token: accessToken.accessToken,
          name: user.name,
          email: user.email,
          avatar: user.picture.data.url
        };

        // Save storage
        AsyncStorage.setItem(FB_USER_DATA, JSON.stringify(user));
        resolve(user);
      } else {
        Funcs.log('Error', err);
        reject(err);
      }
    });

    // Start the graph request.
    new GraphRequestManager().addRequest(infoRequest).start();
  });
}

async function share(sharePhotoContent) {
  try {
    const canShow = await ShareDialog.canShow(sharePhotoContent);
    if (canShow) {
      const result = await ShareDialog.show(sharePhotoContent);
      if (result.isCancelled) {
        Funcs.log('Share cancelled');
        return false;
      }
      return true;
    }
  } catch (error) {
    Funcs.log('ERROR', error);
  }
  Alert.alert(
    Lang.alert.text_title,
    Lang.alert.text_noti_download_app_facebook,
    [
      {
        text: Lang.alert.text_button_understand,
        style: 'cancel'
      }
    ],
    { cancelable: false }
  );
  return false;
}

export default {
  logout,
  login,
  share,
  getUserInfo
};
