import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseForgot from 'common/components/base/BaseForgot';
import DropAlert from 'common/components/base/DropAlert';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import LoadingModal from 'common/components/base/LoadingModal';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { PureComponent } from 'react';
import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import NavigationService from 'common/services/NavigationService';
import { onSignUp } from 'states/redux/actions';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';

class ConfirmOTPScreen extends PureComponent {
  isAithAndroid = false;
  constructor(props) {
    super(props);
    this.state = {
      confirmResult: null,
      count: 60
    };
  }

  componentDidMount() {
    let firebaseAuth = firebase.auth();
    const { typeHeader, data, phoneNumber } = this.props.navigation.state.params;
    if (Platform.OS === 'android') {
      firebaseAuth.onAuthStateChanged(async (user) => {
        let firebaseToken = await firebaseAuth.currentUser.getIdToken(true);
        if (phoneNumber == user._user.phoneNumber) {
          if (typeHeader === 'typeHeader') {
            let username = data.username;
            let email = data.email;
            let phone = data.phone;
            let password = data.password;
            let gender_name = data.gender_name;

            let objectData = {
              firebaseToken,
              username,
              email,
              phone,
              password,
              gender_name
            };
            this.props.onSignUp(objectData);
          } else {
            NavigationService.navigate(ScreenNames.CreateNewPasswordScreen, {
              firebaseToken
            });
          }
        }
      });
    }
    this.verifyPhoneNumber();
  }

  componentWillUnmount() {
    clearInterval(this.counts);
  }

  verifyPhoneNumber = () => {
    const { phoneNumber, type } = this.props.navigation.state.params;
    if (!type) {
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber)
        .then((confirmResult) => {
          Funcs.log(confirmResult, '####confirmResult');
          clearInterval(this.counts);
          this.counts = setInterval(() => {
            if (this.state.count > 0) {
              this.setState({ count: this.state.count - 1 });
            } else {
              this.setState({ count: 0 });
            }
          }, 1000);
          this.setState({ confirmResult });
        })
        .catch((error) => {
          Funcs.log(error, '####error');
          clearInterval(this.counts);
          this.counts = setInterval(() => {
            if ((this.state, this.count > 0)) {
              this.setState({ count: this.state.count - 1 });
            } else {
              this.setState({ count: 0 });
            }
          }, 1000);
          return error;
        });
    }
  };

  onPressReSendCode = () => {
    const { phoneNumber } = this.props.navigation.state.params;
    if (this.state.count === 0) {
      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber)
        .then(() => {
          this.setState({ count: 60 });
          this.inputConfirmRef.inputRef1.reset();
          DropAlert.warn(Lang.profile.text_notify, Lang.forgotPassword.hint_code_resend);
        })
        .catch((error) => {
          Funcs.log(error, 'errorResend');
          this.setState({ count: 60 });
          this.inputConfirmRef.inputRef1.reset();
          DropAlert.warn(Lang.profile.text_notify, Lang.forgotPassword.hint_not_resend_code);
        });
    } else {
      this.inputConfirmRef.inputRef1.reset();
      DropAlert.warn(Lang.profile.text_notify, Lang.forgotPassword.hint_wait_60s);
    }
  };

  onPressConfirmOTP = async () => {
    const { typeHeader, data, phoneOrEmail, type } = this.props.navigation.state.params;
    const { confirmResult } = this.state;
    let objData = {};
    if (type) {
      objData = {
        email: phoneOrEmail,
        code: this.inputConfirmRef.inputRef1.getText()
      };
    } else {
      objData = {
        code: this.inputConfirmRef.inputRef1.getText(),
        firebaseVerifyId: confirmResult._verificationId
      };
    }
    LoadingModal.show();
    let res = await Fetch.post(Const.API.USER.VERYFY_OPT, objData);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      DropAlert.success('', Lang.forgotPassword.hint_confirm_OTP_success);
      if (typeHeader === 'typeHeader') {
        let username = data.username;
        let email = data.email;
        let phone = data.phone;
        let password = data.password;
        let gender_name = data.gender_name;
        let firebaseToken = res.data.firebaseToken;

        let objectData = {
          code: this.inputConfirmRef.inputRef1.getText(),
          firebaseToken,
          username,
          email,
          phone,
          password,
          gender_name
        };
        this.props.onSignUp(objectData);
      } else {
        NavigationService.navigate(ScreenNames.CreateNewPasswordScreen, {
          firebaseToken: res.data.firebaseToken,
          phoneOrEmail,
          type,
          code: this.inputConfirmRef.inputRef1.getText()
        });
      }
    } else if (res.status === Fetch.Status.NOT_EXITS) {
      DropAlert.warn('', Lang.forgotPassword.hint_code_OTP_not_exist);
    } else if (res.status === Fetch.Status.NETWORK_ERROR) {
      DropAlert.warn(Lang.NoInternetComponent.no_internet_connection, Lang.NoInternetComponent.pls_check_your_internet_connection);
    }
  };

  render() {
    const { typeHeader, type } = this.props.navigation.state.params;
    return (
      <KeyboardHandle>
        <BaseForgot
          ref={(ref) => (this.inputConfirmRef = ref)}
          type={type}
          source={Resource.images.imPregnant1}
          source2={Resource.images.iconConfirmCode}
          titleHeader={typeHeader && Lang.register.hint_text_header_check_phone}
          textContent={Lang.forgotPassword.hint_confirm_code}
          textContent1={typeHeader ? Lang.register.hint_content : Lang.forgotPassword.hint_content}
          placeholder={Lang.forgotPassword.hint_placeholder_code}
          keyboardType="phone-pad"
          textButton={Lang.register.text_button_confirm}
          count={Lang.register.resend_code_count(this.state.count)}
          numberCount={this.state.count}
          onPressReSendCode={this.onPressReSendCode}
          onPress={this.onPressConfirmOTP}
        />
      </KeyboardHandle>
    );
  }
}

const mapDispatchToProps = { onSignUp };
export default connect(
  null,
  mapDispatchToProps
)(ConfirmOTPScreen);
