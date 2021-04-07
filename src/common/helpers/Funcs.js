import countries from 'assets/jsons/countries.json';
import countryNameList from 'assets/jsons/countries_name.json';
import Lang from 'assets/Lang';
import DropAlert from 'common/components/base/DropAlert';
import json5 from 'json5';
import { Alert, Image, Keyboard, Linking, Platform, StatusBar } from 'react-native';
import Permissions from 'react-native-permissions';

const log = (() => {
  if (!__DEV__) return () => {};
  return Function.prototype.bind.call(console.log, console, '## LOG: ');
})();

const getAllCountries = () => {
  const countriesList = [];
  countryNameList.map((name) => {
    countriesList.push({ ...countries[name], code: name });
  });

  return countriesList;
};

function hideKeyboard() {
  Keyboard.dismiss();
}

function openStore(url) {
  Linking.openURL(url);
}

function jsonEscape(str) {
  return str
    .replace(/\n/g, '\\\\n')
    .replace(/\r/g, '\\\\r')
    .replace(/\t/g, '\\\\t');
}

function oneSignalSendTag(id) {
  // let user_id = id;
  // if (typeof id !== 'tring') {
  //   user_id = id.toString();
  // }
  // OneSignalService.sendTag('user_id', user_id);
}

function randomArray(data) {
  var ctr = data.length,
    temp,
    index;

  // While there are elements in the array
  while (ctr > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
    ctr--;
    // And swap the last element with it
    temp = data[ctr];
    data[ctr] = data[index];
    data[index] = temp;
  }
  return data;
}

function delay(time) {
  var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve();
      } catch (err) {
        reject({
          error: err
        });
      }
    }, time);
  });
  return promise;
}

function convertPhonenumber(phone) {
  if (!phone) return '';
  return phone.replace('+84', '0');
}

function convertPrice(num) {
  let moneyArr = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  moneyArr = moneyArr.split('.');
  let moneyTypes = ['', 'k', 'tr', 'tỷ'];
  let str = '';
  for (var i = 0; i < moneyArr.length; i += 1) {
    if (parseInt(moneyArr[i]) > 0) str += moneyArr[i] + moneyTypes[moneyArr.length - 1 - i];
  }

  if (num == 0) {
    str = 0;
  }

  return str;
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

function checkStringEmpty(string) {
  return /^ *$/.test(string);
}

async function checkPermission(permisison, showSetting = true) {
  // Check
  var response = await Permissions.check(permisison);
  if (response === 'authorized') return true;

  // Request
  response = await Permissions.request(permisison);
  if (response != 'authorized') {
    var buttonList = [
      {
        text: 'Cancel',
        onPress: () => {
          StatusBar.setHidden(false);
        }
      }
    ];
    if (Platform.OS === 'ios') {
      buttonList.push({
        text: 'Open setting',
        onPress: () => {
          StatusBar.setHidden(false);
          Permissions.openSettings();
        }
      });
    }
    if (showSetting) {
      Alert.alert('Permission require', 'This app need permisison camera to capture and record video.', buttonList, {
        cancelable: false
      });
    }
    return false;
  }
  return true;
}

function validateAccount(account) {
  let checkAccount = account.trimLeft().trimRight();
  if (account.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_not_empty_account);
    return false;
  }
  if (account.length < 5) {
    DropAlert.warn('', Lang.dropdownAlert.text_account_not_5_character);
    return false;
  }
  if (checkAccount.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_account_no_spaces);
    return false;
  }
  return true;
}

function validatePass(password) {
  let checkPass = password.trimLeft().trimRight();
  if (password.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_not_empty_password);
    return false;
  }
  if (password.length < 6) {
    DropAlert.warn('', Lang.dropdownAlert.text_password_not_6_charactor);
    return false;
  }
  if (checkPass.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_password_no_spaces);
    return false;
  }
  return true;
}

function validatePassword(password, confirmPassword) {
  let checkPass = password.trimLeft().trimRight();
  let checkConfirmPass = confirmPassword.trimLeft().trimRight();
  if (checkPass.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_password_no_spaces);
    return false;
  }
  if (checkConfirmPass.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_confirm_password_not_empty);
    return false;
  }
  if (password.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_not_empty_password);
    return false;
  }
  if (password.length < 6) {
    DropAlert.warn('', Lang.dropdownAlert.text_password_not_6_charactor);
    return false;
  }
  if (password !== confirmPassword) {
    DropAlert.warn('', Lang.dropdownAlert.text_confirm_password_incorrectly);
    return false;
  }
  return true;
}
function validateUserName(username) {
  let checkUser = username.trimLeft().trimRight();
  if (username.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_your_name_not_empty);
    return false;
  }
  if (checkUser.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_your_name_no_spaces);
    return false;
  }
  return true;
}
function validatePhoneOrEmail(phone, email) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const str = /^[\+]?[(]?[0-9]{4,5}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  let checkPhone = phone.trimLeft().trimRight();
  let checkEmail = email.trimLeft().trimRight();
  if (phone.length == 0) {
    if (email.length === 0) {
      DropAlert.warn('', Lang.dropdownAlert.text_phonenumber_or_email_not_empty);
      return false;
    } else if (checkEmail.length === 0) {
      DropAlert.warn('', Lang.dropdownAlert.text_email_no_spaces);
      return false;
    } else if (!reg.test(checkEmail)) {
      DropAlert.warn('', Lang.dropdownAlert.text_email_is_malformed);
      return false;
    }
  } else if (checkPhone.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_phone_no_spaces);
    return false;
  } else if (phone.length < 9) {
    DropAlert.warn('', Lang.dropdownAlert.text_phone_not_10_charactor);
    return false;
  } else if (email.length > 0 && !reg.test(checkEmail)) {
    DropAlert.warn('', Lang.dropdownAlert.text_email_is_malformed);
    return false;
  }
  return true;
}

function validatePhone(phone) {
  let checkPhone = phone.trimLeft().trimRight();
  const str = /^[\+]?[(]?[0-9]{4,5}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,5}$/im;
  if (phone.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_phone_not_empty);
  } else if (checkPhone.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_phone_no_spaces);
    return false;
  } else if (phone.length < 9) {
    DropAlert.warn('', Lang.dropdownAlert.text_phone_not_10_charactor);
    return false;
  } else if (!str.test(phone)) {
    DropAlert.warn('', Lang.dropdownAlert.text_phone_is_malformed);
    return false;
  }
  return true;
}

function validateChangePass(newPassword, confirmNewPassword) {
  if (newPassword.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_new_password_not_empty);
    return false;
  }
  if (newPassword.length < 6) {
    DropAlert.warn('', Lang.dropdownAlert.text_new_password_not_6_charactor);
    return false;
  }
  if (newPassword !== confirmNewPassword) {
    DropAlert.warn('', Lang.dropdownAlert.text_confirm_password_incorrectly);
    return false;
  }
  return true;
}

function validateEmail(email) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let checkEmail = email.trimLeft().trimRight();
  if (email.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_email_not_empty);
    return false;
  } else if (checkEmail.length === 0) {
    DropAlert.warn('', Lang.dropdownAlert.text_email_no_spaces);
    return false;
  } else if (!reg.test(email)) {
    DropAlert.warn('', Lang.dropdownAlert.text_email_is_malformed);
    return false;
  }
  return true;
}

function random(from, to) {
  var add = from === 0 || to === 0 ? 1 : 0;
  return Math.floor(Math.random() * (to + add) + from);
}

function getImageSize(uri) {
  var promise = new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => {
        let selectedImageSize = {
          width,
          height
        };
        resolve(selectedImageSize);
      },
      () => {
        reject({
          error: 'Can not get image size of ' + uri
        });
      }
    );
  });
  return promise;
}

function jsonParse(str) {
  try {
    return json5.parse(str);
  } catch (err) {
    log('ERROR', err);
  }
  return null;
}

export default {
  log,
  countries,
  getAllCountries,
  delay,
  random,
  hideKeyboard,
  jsonEscape,
  openStore,
  convertPhonenumber,
  formatNumber,
  checkStringEmpty,
  checkPermission,
  validateAccount,
  validatePass,
  validatePassword,
  validateUserName,
  validatePhoneOrEmail,
  validatePhone,
  validateChangePass,
  validateEmail,
  oneSignalSendTag,
  convertPrice,
  randomArray,
  getImageSize,
  jsonParse
};
