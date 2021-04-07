import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseForgot from 'common/components/base/BaseForgot';
import DropAlert from 'common/components/base/DropAlert';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import LoadingModal from 'common/components/base/LoadingModal';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { PureComponent } from 'react';
import { Alert, StyleSheet, Platform } from 'react-native';
import NavigationService from 'common/services/NavigationService';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import firebase from 'react-native-firebase';

const width = Dimension.widthParent;

export class ForgotPasswordScreen extends PureComponent {
  componentWillUnmount() {
    clearTimeout(this.timeShowConfirm);
  }

  onPressSendPassword = async () => {
    let phoneOrEmail = this.inputForgotRef.inputRef1.getText();
    let reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const str = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    if (!str.test(phoneOrEmail)) {
      if (phoneOrEmail.length === 0) {
        DropAlert.warn('', Lang.forgotPassword.hint_phone_not_empty);
        return false;
      } else if (phoneOrEmail.length < 10) {
        DropAlert.warn('', Lang.forgotPassword.hint_phone_cannot_less_10_characters);
        return false;
      } else if (!reg.test(phoneOrEmail)) {
        if (!reg.test(phoneOrEmail)) {
          DropAlert.warn('', Lang.forgotPassword.hint_email_wrong_format);
          return false;
        }
      }
    }

    if (str.test(phoneOrEmail)) {
      // check phone number
      LoadingModal.show();
      let res = await Fetch.post(Const.API.USER.CHECK_ACCOUNT_EXIST, { phone: phoneOrEmail });
      LoadingModal.hide();
      if (res.status === Fetch.Status.SUCCESS) {
        let phoneNumber = phoneOrEmail;
        if (phoneOrEmail.startsWith('0')) {
          phoneNumber = phoneOrEmail.replace('0', '+84');
        }
        let firebaseAuth = firebase.auth();
        firebaseAuth.onAuthStateChanged(async (user) => {
          if (user) {
            let firebaseToken = await firebaseAuth.currentUser.getIdToken(true);
            if (phoneNumber == user._user.phoneNumber) {
              NavigationService.navigate(ScreenNames.CreateNewPasswordScreen, {
                firebaseToken
              });
            } else {
              NavigationService.navigate(ScreenNames.ConfirmOTPScreen, { phoneNumber });
            }
          } else {
            NavigationService.navigate(ScreenNames.ConfirmOTPScreen, { phoneNumber });
          }
        });
      } else if (res.status === Fetch.Status.NOT_FOUND) {
        DropAlert.warn('', Lang.forgotPassword.hint_phone_does_not_exits);
      } else if (res.status === Fetch.Status.NETWORK_ERROR) {
        DropAlert.warn(Lang.NoInternetComponent.no_internet_connection, Lang.NoInternetComponent.pls_check_your_internet_connection);
      }
    } else if (reg.test(phoneOrEmail)) {
      // check email
      LoadingModal.show();
      let res = await Fetch.post(Const.API.USER.FORGOT_PASSWORD, { email: phoneOrEmail });
      LoadingModal.hide();
      if (res.status === Fetch.Status.SUCCESS) {
        this.timeShowConfirm = setTimeout(() => {
          Alert.alert(
            Lang.alert.text_title,
            Lang.alert.hint_content_forgot_check_mail,
            [
              {
                text: Lang.forgotPassword.text_button_create_password,
                onPress: this.onConfirmOTP,
                style: 'destructive'
              }
            ],
            { cancelable: false }
          );
        }, 500);
      } else if (res.status === Fetch.Status.NOT_FOUND) {
        DropAlert.warn('', res.data.message);
      }
    }
  };

  onConfirmOTP = () => {
    let phoneOrEmail = this.inputForgotRef.inputRef1.getText();
    NavigationService.navigate(ScreenNames.ConfirmOTPScreen, { type: 'confirmEmail', phoneOrEmail });
  };
  render() {
    return (
      <KeyboardHandle>
        <BaseForgot
          ref={(ref) => (this.inputForgotRef = ref)}
          source={Resource.images.imPregnant1}
          source2={Resource.images.iconForgotPass}
          viewInputStyle={styles.viewInputStyle}
          textInputStyle={styles.textInputStyle}
          imageInput={styles.imageInput}
          socialButtonStyle={styles.socialButtonStyle}
          textContent={Lang.forgotPassword.hint_user}
          textContent1={Lang.forgotPassword.hint_content}
          placeholder={Lang.forgotPassword.hint_placeholder_email_or_phone}
          textButton={Lang.forgotPassword.text_button_send_password}
          onPress={this.onPressSendPassword}
        />
      </KeyboardHandle>
    );
  }
}
const styles = StyleSheet.create({
  socialButtonStyle: {
    borderRadius: 30 * Dimension.scale
  },
  imageInput: {
    width: width * Dimension.scale,
    height: 130 * Dimension.scale
  },
  viewInputStyle: {
    flex: 1,
    borderBottomWidth: 0.5,
    height: 50 * Dimension.scale,
    borderRadius: 0,
    borderBottomColor: Resource.colors.inactiveButton
  },
  textInputStyle: {
    fontSize: 12 * Dimension.scale,
    paddingTop: 10 * Dimension.scale,
    color: Resource.colors.black1
  }
});
export default ForgotPasswordScreen;
