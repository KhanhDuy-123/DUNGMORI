import Colors from 'assets/Colors';
import countries from 'assets/jsons/countries.json';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseInput from 'common/components/base/BaseInput';
import BaseText from 'common/components/base/BaseText';
import CheckBox from 'common/components/base/CheckBox';
import CountriesModal from 'common/components/base/CountriesModal';
import DropAlert from 'common/components/base/DropAlert';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import EncryptService from 'common/services/EncryptService';
import FacebookService from 'common/services/FacebookService';
import Google from 'common/services/GoogleService';
import NavigationService from 'common/services/NavigationService';
import StorageService from 'common/services/StorageService';
import AppConst from 'consts/AppConst';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as AppleSignIn from 'react-native-apple-sign-in';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppContextView from 'states/context/views/AppContextView';
import { onLogin, onLoginSocial } from 'states/redux/actions';
import Configs from 'utils/Configs';
import ButtonSocial from './ButtonSocial';
import Images from 'assets/Images';
const width = Dimension.widthParent;

class Login extends AppContextView {
  state = {
    disabled: false,
    email: Configs.testAccount.email,
    password: Configs.testAccount.password,
    isEmailLogin: false,
    countries: Funcs.getAllCountries(),
    countrySelected: 'VN',
    phone: '',
    showPassword: true
  };
  rememberAccount = true;

  async componentDidMount() {
    try {
      let accountInfo = await StorageService.get(Const.DATA.USER_LOGIN_INFO);
      if (accountInfo) {
        accountInfo = EncryptService.decrypt(accountInfo);
        let { email, password } = accountInfo;
        let phone = '';
        if (email.indexOf('@') < 0) {
          phone = email;
          email = '';
        }
        this.setState({
          email,
          phone,
          password,
          isEmailLogin: email.length > 0
        });
      }
    } catch (err) {
      Funcs.log('ERROR', err);
    }
  }

  onChangeUsername = (email) => {
    this.setState({ email });
  };
  onChangePhone = (phone) => {
    this.setState({ phone });
  };

  onChangePassword = (password) => {
    this.setState({ password });
  };

  onCountryPressed = (item) => () => {
    this.countriesModal.toggleModal(false);
    this.setState({ countrySelected: item.code });
  };

  onFlagPressed = () => {
    this.countriesModal.toggleModal(true);
  };

  onPressLogin = () => {
    const { email, password, phone, isEmailLogin } = this.state;
    let phoneNew = phone;
    if (phone.startsWith('0')) {
      phoneNew = phone.substring(1);
    }
    let phoneCheck = `+${countries[this.state.countrySelected].callingCode}${phoneNew}`;
    if (phoneCheck.startsWith('+84')) phoneCheck = phoneCheck.replace('+84', '0');

    let objectAccount = { email: isEmailLogin ? email : phoneCheck, password };
    if (!isEmailLogin) {
      if (!Funcs.validateAccount(phone)) {
        return;
      }
    } else {
      if (!Funcs.validateAccount(email)) {
        return;
      }
    }
    if (!Funcs.validatePass(password)) {
      return;
    }
    objectAccount = EncryptService.encrypt(objectAccount);
    this.props.onLogin(objectAccount, () => {
      if (this.rememberAccount) StorageService.save(Const.DATA.USER_LOGIN_INFO, objectAccount);
      else StorageService.save(Const.DATA.USER_LOGIN_INFO, '');
    });
  };

  onPressChangeLogin = () => {
    this.setState({ isEmailLogin: !this.state.isEmailLogin });
  };

  //Naviggate forgot password
  onPressForgotPassword = () => {
    NavigationService.navigate(ScreenNames.ForgotPasswordScreen);
  };

  //Naviggate SignUp
  onPressRegister = () => {
    NavigationService.navigate(ScreenNames.RegisterScreen);
  };

  //Login facebook
  onPressLoginFacebook = async () => {
    try {
      const isOk = await FacebookService.login();
      if (isOk) {
        const userInfo = await FacebookService.getUserInfo();
        userInfo.provider = Const.SOCIAL.FACEBOOK;
        this.props.onLoginSocial(userInfo);
      }
    } catch (err) {
      Funcs.log('ERROR', err);
    }
  };

  onPressShowPass = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  //Login Google
  onPressLoginGoogle = () => {
    Google.login(async (isOk, res) => {
      if (isOk) {
        res.provider = Const.SOCIAL.GOOGLE;
        // Get app_id
        let deviceId = null;
        const appId = deviceId;
        if (appId !== null) {
          res.app_id = appId;
        }
        this.props.onLoginSocial(res);
      }
    });
  };

  onPressLoginApple = async () => {
    AppleSignIn.signIn({
      onSuccess: (res) => {
        Funcs.log('icloud login success', res);
        let { user, fullName, email, identityToken } = res;
        let givenName = fullName && fullName.givenName;
        let userInfo = {
          provider: Const.SOCIAL.APPLE,
          email,
          token: identityToken,
          name: givenName ? givenName : 'Học viên',
          id: user
        };
        this.props.onLoginSocial(userInfo);
      },
      onError: (error) => {
        if (error && error.indexOf('ios below 13')) {
          DropAlert.error('', Lang.login.text_noti_support_ios);
        }
        Funcs.log(error);
      }
    });
  };

  onPressRememberAccount = () => {
    this.refs.checkBoxRememberAccount.onPress();
  };

  onChangeRememberAccount = (value) => {
    this.rememberAccount = value;
  };

  onPressVideoOffline = () => {
    NavigationService.navigate(ScreenNames.CourseOfflineScreen);
  };

  render() {
    const { isEmailLogin } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.viewContent}>
          <View style={styles.boxImage}>
            <View style={styles.wrapperLinear}>
              <View style={styles.viewTextLogin}>
                <BaseText style={styles.titleStyle}>{Lang.authen.text_header_login}</BaseText>
              </View>
              <TouchableOpacity style={styles.viewTextRgister} onPress={this.props.onPress}>
                <BaseText style={{ ...styles.titleStyle, color: Resource.colors.black1 }}>{Lang.authen.text_header_register}</BaseText>
              </TouchableOpacity>
            </View>
            <View style={styles.viewWrapper}>
              <View style={styles.wrapperContent}>
                <FastImage source={Resource.images.imRegister} style={styles.imBackground} />
                <View style={styles.wrapper}>
                  {!isEmailLogin ? (
                    <View style={styles.containerEnterPhone}>
                      <TouchableOpacity onPress={this.onFlagPressed}>
                        <FastImage resizeMode="contain" source={{ uri: countries[this.state.countrySelected].flag }} style={styles.imageCountryFlag} />
                      </TouchableOpacity>

                      <BaseText style={{ color: 'black', fontSize: 12 * Dimension.scale }}>
                        {`+${countries[this.state.countrySelected].callingCode || ''}`}
                      </BaseText>
                      <BaseInput
                        onSubmitEditing={() => {
                          this.passwordInputRef && this.passwordInputRef.focus();
                        }}
                        value={this.state.phone}
                        onChangeText={this.onChangePhone}
                        returnKeyType="next"
                        viewInputStyle={styles.viewInputStyle1}
                        textInputStyle={[styles.textInputStyle, { paddingTop: Platform.OS === 'android' ? 17 : 10 }]}
                        keyboardType="phone-pad"
                        maxLength={this.state.countrySelected === 'VN' ? 10 : 11}
                      />
                    </View>
                  ) : (
                    <BaseInput
                      ref={(ref) => (this.nameInputRef = ref)}
                      onSubmitEditing={() => {
                        this.passwordInputRef && this.passwordInputRef.focus();
                      }}
                      keyboardType="email-address"
                      returnKeyType="next"
                      viewInputStyle={[styles.viewInputStyle]}
                      textInputStyle={styles.textInputStyle}
                      value={this.state.email}
                      onChangeText={this.onChangeUsername}
                      placeholder={Lang.login.hint_placeholder_account}
                    />
                  )}
                  <BaseInput
                    showEye
                    onSubmitEditing={this.onPressLogin}
                    ref={(ref) => (this.passwordInputRef = ref)}
                    viewInputStyle={styles.viewInputStyle}
                    textInputStyle={styles.textInputStyle2}
                    placeholder={Lang.login.hint_placeholder_password}
                    returnKeyType="done"
                    secureTextEntry={this.state.showPassword}
                    value={this.state.password}
                    onChangeText={this.onChangePassword}
                    onPress={this.onPressForgotPassword}
                    onPressShowPass={this.onPressShowPass}
                  />
                  <TouchableOpacity style={styles.viewLogin} onPress={this.onPressChangeLogin}>
                    <BaseText style={styles.textTitleLogin}>
                      {Lang.login.hint_title_login}
                      {isEmailLogin ? Lang.login.hint_login_phone_number : Lang.login.hint_login_email}
                    </BaseText>
                    <BaseText style={styles.rowStyle}>{`>`}</BaseText>
                  </TouchableOpacity>
                  <View style={styles.viewForgot}>
                    <TouchableOpacity style={styles.buttonRemember} onPress={this.onPressRememberAccount} activeOpacity={0.85}>
                      <CheckBox color={'gray'} onChange={this.onChangeRememberAccount} ref={'checkBoxRememberAccount'} default={this.rememberAccount} />
                      <BaseText style={styles.textForgot}>{Lang.login.hint_remember_account}</BaseText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonRemember} onPress={this.onPressForgotPassword} activeOpacity={0.85}>
                      <BaseText style={styles.textForgot}>{Lang.login.hint_forgot_password}</BaseText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.triagle} />
              <View style={styles.viewButton}>
                <BaseButtonOpacity
                  text={Lang.authen.text_header_login}
                  socialButtonStyle={styles.socialButtonStyle}
                  textStyle={styles.textStyle}
                  onPress={this.onPressLogin}
                />
                <BaseButtonOpacity
                  text={Lang.login.video_downloaded}
                  icon={Resource.images.icDownload}
                  styleImage={styles.styleImage}
                  tintColor={Colors.greenColorApp}
                  socialButtonStyle={styles.socialButtonLeftStyle}
                  textStyle={styles.textStyleLeft}
                  onPress={this.onPressVideoOffline}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.Linear}>
          <BaseText style={styles.textLogin}>{Lang.login.hint_login}</BaseText>
          <View style={styles.viewSocial}>
            <ButtonSocial name="facebook-f" button={{ backgroundColor: '#3B5997' }} onPress={this.onPressLoginFacebook} />
            <TouchableOpacity onPress={this.onPressLoginGoogle} style={styles.buttonGG}>
              <FastImage source={Images.icGoogle} style={styles.iconGG} resizeMode={FastImage.resizeMode.contain} />
            </TouchableOpacity>
            {AppConst.IS_IOS && (
              <ButtonSocial
                icon={<Ionicons name={'logo-apple'} size={24 * Dimension.scale} color={'white'} />}
                button={{ backgroundColor: 'black' }}
                onPress={this.onPressLoginApple}
              />
            )}
          </View>
        </View>
        <CountriesModal
          onCountryPressed={this.onCountryPressed}
          countries={this.state.countries}
          ref={(ref) => {
            this.countriesModal = ref;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 25,
    alignItems: 'center'
  },
  viewContent: {
    flex: 1,
    width: width,
    alignItems: 'center'
  },
  boxImage: {
    marginTop: 23 * Dimension.scale,
    width: 300 * Dimension.scale
  },
  wrapperLinear: {
    width: 300 * Dimension.scale,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  viewTextLogin: {
    marginLeft: 8 * Dimension.scale
  },
  viewTextRgister: {
    marginRight: 10 * Dimension.scale
  },
  titleStyle: {
    fontSize: 17 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.white100,
    paddingVertical: 10,
    paddingHorizontal: 30
  },
  rowStyle: {
    fontSize: 18,
    paddingBottom: 2,
    fontWeight: 'bold',
    color: Resource.colors.grey600,
    paddingLeft: 5
  },
  wrapper: {
    width: 250 * Dimension.scale,
    paddingTop: 20,
    height: 120,
    alignSelf: 'center'
  },
  socialButtonStyle: {
    width: 120 * Dimension.scale,
    height: 27 * Dimension.scale,
    borderRadius: 30 * Dimension.scale,
    backgroundColor: Resource.colors.greenColorApp
  },
  socialButtonLeftStyle: {
    width: 120 * Dimension.scale,
    height: 27 * Dimension.scale,
    borderWidth: 0.5,
    borderColor: Resource.colors.greenColorApp,
    borderRadius: 30 * Dimension.scale,
    backgroundColor: Resource.colors.white100,
    marginLeft: 7
  },
  viewInputStyle: {
    borderBottomWidth: 0.5,
    height: 45 * Dimension.scale,
    borderRadius: 0,
    borderBottomColor: Resource.colors.inactiveButton,
    alignSelf: 'center',
    width: 230 * Dimension.scale,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textInputStyle: {
    flex: 1,
    color: Resource.colors.black1,
    fontSize: 12 * Dimension.scale
  },
  textInputStyle2: {
    flex: 1,
    color: Resource.colors.black1,
    fontSize: 12 * Dimension.scale,
    width: 190 * Dimension.scale
  },
  viewForgot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10 * Dimension.scale
  },
  viewLogin: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  textTitleLogin: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.grey600,
    fontWeight: 'bold'
  },
  textForgot: {
    fontSize: 11 * Dimension.scale,
    color: Resource.colors.grey500,
    marginHorizontal: 3
  },
  Linear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 75 * Dimension.scale,
    marginBottom: 30
  },
  textLogin: {
    paddingHorizontal: 10,
    fontSize: 12 * Dimension.scale
  },
  viewSocial: {
    flexDirection: 'row'
  },
  textStyle: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.white100,
    fontWeight: '600'
  },
  textStyleLeft: {
    fontSize: 10 * Dimension.scale,
    color: Resource.colors.greenColorApp
  },
  viewWrapper: {
    width: 300 * Dimension.scale,
    height: 280 * Dimension.scale
  },
  triagle: {
    width: 0,
    height: 0,
    borderLeftWidth: 25 * Dimension.scale,
    borderRightWidth: 25 * Dimension.scale,
    borderBottomWidth: 30 * Dimension.scale,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginLeft: 38 * Dimension.scale,
    top: 12 * Dimension.scale,
    borderBottomColor: 'white',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 0.3,
    position: 'absolute'
  },
  wrapperContent: {
    width: 280 * Dimension.scale,
    height: 240 * Dimension.scale,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 25,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 25,
    shadowOpacity: 0.3,
    marginTop: 40 * Dimension.scale,
    borderWidth: Platform.OS == 'android' ? 0.2 : 0,
    borderColor: 'grey'
  },
  imBackground: {
    width: Platform.OS == 'android' ? 279 * Dimension.scale : 280 * Dimension.scale,
    height: 90 * Dimension.scale,
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  imageCountryFlag: {
    width: 40,
    height: 25,
    marginRight: 5
  },
  containerEnterPhone: {
    height: 45 * Dimension.scale,
    width: 240 * Dimension.scale,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Resource.colors.inactiveButton,
    alignSelf: 'center'
  },
  viewInputStyle1: {
    flex: 1,
    height: 43 * Dimension.scale,
    borderRadius: 0,
    width: 150 * Dimension.scale,
    alignSelf: 'center',
    marginLeft: 5
  },
  buttonRemember: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    marginTop: 5
  },
  viewButton: {
    flexDirection: 'row',
    width: 300 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 5 * Dimension.scale
  },
  styleImage: {
    width: 12,
    height: 12,
    marginRight: 5
  },
  buttonGG: {
    height: 35 * Dimension.scale,
    width: 35 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5 * Dimension.scale,
    backgroundColor: Colors.white100,
    shadowColor: '#000',
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  },
  iconGG: {
    height: 30 * Dimension.scale,
    width: 30 * Dimension.scale
  }
});
const mapDispatchToProp = { onLogin, onLoginSocial };
export default connect(
  (state) => ({
    language: state.languageReducer.language
  }),
  mapDispatchToProp
)(Login);
