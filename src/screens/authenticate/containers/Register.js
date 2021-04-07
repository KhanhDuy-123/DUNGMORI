import countries from 'assets/jsons/countries.json';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseInput from 'common/components/base/BaseInput';
import BaseText from 'common/components/base/BaseText';
import CountriesModal from 'common/components/base/CountriesModal';
import DropAlert from 'common/components/base/DropAlert';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import NavigationService from 'common/services/NavigationService';
import { onSignUp } from 'states/redux/actions';
import Dimension from 'common/helpers/Dimension';
import Configs from 'utils/Configs';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';

const width = Dimension.widthParent;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: Funcs.getAllCountries(),
      countrySelected: 'VN',
      phone: '',
      showPassword: true,
      showConfirmPassword: true
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timeDropError);
    clearTimeout(this.timeDropSuuces);
  }

  onChangePhone = (phone) => {
    this.setState({ phone });
  };

  onCountryPressed = (item) => () => {
    this.countriesModal.toggleModal(false);
    this.setState({ countrySelected: item.code });
  };

  onFlagPressed = () => {
    this.countriesModal.toggleModal(true);
  };

  onPressSignUp = async () => {
    let username = this.inputNameRef.getText();
    let phone = this.state.phone;
    let email = this.inputEmailRef.getText();
    let password = this.inputPassRef.getText();
    let confirmPassword = this.inputConfirmPassRef.getText();
    if (!Funcs.validateUserName(username)) {
      return;
    }
    if (!Funcs.validatePhoneOrEmail(phone, email)) {
      return;
    }
    if (!Funcs.validatePassword(password, confirmPassword)) {
      return;
    }
    if (phone.startsWith('0')) {
      phone = phone.substring(1);
    }
    let phoneCheck = `+${countries[this.state.countrySelected].callingCode}${phone}`;
    if (phoneCheck.startsWith('+84')) {
      phoneCheck = phoneCheck.replace('+84', '0');
    }
    let data = { username, phone: phone.length > 0 ? phoneCheck : '', email, password };
    let res = await Fetch.post(Const.API.USER.CHECK_ACCOUNT_EXIST, { phone: phoneCheck, email });
    if (res.status === Fetch.Status.SUCCESS) {
      this.timeDropSuuces = setTimeout(() => {
        if (res.data.field == 'phone') {
          DropAlert.warn('', Lang.register.hint_check_phone_number);
        } else {
          DropAlert.warn('', Lang.register.hint_check_email);
        }
      }, 300);
    } else if (res.status === Fetch.Status.NOT_FOUND) {
      if (phone.length > 0) {
        let phoneNumber = `+${countries[this.state.countrySelected].callingCode}${phone}`;
        NavigationService.navigate(ScreenNames.ConfirmOTPScreen, { phoneNumber, data, typeHeader: 'typeHeader' });
      } else {
        //upgrade data in redux
        this.props.onSignUp(data);
      }
    } else if (res.status === Fetch.Status.NETWORK_ERROR) {
      this.timeDropError = setTimeout(() => {
        DropAlert.warn(Lang.NoInternetComponent.no_internet_connection, Lang.NoInternetComponent.pls_check_your_internet_connection);
      }, 300);
    }
  };

  onPressShowPass = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  onPressShowConfirmPass = () => {
    this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.viewContent}>
          <View style={styles.boxImage}>
            <View style={styles.wrapperLinear}>
              <TouchableOpacity style={styles.viewTextLogin} onPress={this.props.onPress}>
                <BaseText style={{ ...styles.titleStyle, color: Resource.colors.black1 }}>{Lang.authen.text_header_login}</BaseText>
              </TouchableOpacity>
              <View style={styles.viewTextRgister}>
                <BaseText style={styles.titleStyle}>{Lang.authen.text_header_register}</BaseText>
              </View>
            </View>

            <View style={styles.viewWrapper}>
              <View style={styles.wrapperContent}>
                <FastImage source={Resource.images.imRegister} style={styles.imageBackground} />
                <BaseInput
                  ref={(ref) => (this.inputNameRef = ref)}
                  viewInputStyle={styles.viewInputStyle}
                  textInputStyle={styles.textInputStyle}
                  placeholder={Lang.register.hint_placeholder_username}
                />
                <View style={styles.containerEnterPhone}>
                  <TouchableOpacity onPress={this.onFlagPressed}>
                    <FastImage resizeMode="contain" source={{ uri: countries[this.state.countrySelected].flag }} style={styles.imageCountryFlag} />
                  </TouchableOpacity>

                  <BaseText style={{ color: 'black', fontSize: 12 * Dimension.scale }}>
                    {`+${countries[this.state.countrySelected].callingCode || ''}`}
                  </BaseText>
                  <BaseInput
                    onChangeText={this.onChangePhone}
                    viewInputStyle={styles.viewInputStyle1}
                    textInputStyle={[styles.textInputStyle, { paddingTop: Platform.OS === 'android' ? 15 : 10 }]}
                    keyboardType="phone-pad"
                    maxLength={this.state.countrySelected === 'VN' ? 10 : 11}
                  />
                </View>
                <BaseInput
                  ref={(ref) => (this.inputEmailRef = ref)}
                  viewInputStyle={styles.viewInputStyle}
                  textInputStyle={styles.textInputStyle}
                  placeholder={Lang.register.hint_placeholder_email}
                  keyboardType="email-address"
                />
                <BaseInput
                  showEye
                  ref={(ref) => (this.inputPassRef = ref)}
                  viewInputStyle={styles.viewInputStyle}
                  textInputStyle={styles.textInputStyle}
                  placeholder={Lang.login.hint_placeholder_password}
                  secureTextEntry={this.state.showPassword}
                  onPressShowPass={this.onPressShowPass}
                />
                <BaseInput
                  showEye
                  ref={(ref) => (this.inputConfirmPassRef = ref)}
                  viewInputStyle={styles.viewInputStyle}
                  textInputStyle={styles.textInputStyle}
                  placeholder={Lang.register.hint_placeholder_confirm_password}
                  secureTextEntry={this.state.showConfirmPassword}
                  onPressShowPass={this.onPressShowConfirmPass}
                />
              </View>
              <View style={styles.triagle} />
              <View style={styles.wrapperButton}>
                <BaseButtonOpacity
                  text={Lang.authen.text_header_register}
                  socialButtonStyle={styles.socialButtonStyle}
                  textStyle={styles.textStyle}
                  onPress={this.onPressSignUp}
                />
              </View>
            </View>
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
    paddingBottom: 50 * Dimension.scale
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
    marginLeft: 10 * Dimension.scale
  },
  viewTextRgister: {
    marginRight: 10 * Dimension.scale
  },
  titleStyle: {
    fontSize: 17 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.white100,
    paddingHorizontal: 30,
    paddingVertical: 10
  },
  imageBackground: {
    width: Platform.OS === 'android' ? 279 * Dimension.scale : 280 * Dimension.scale,
    height: 55 * Dimension.scale,
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  wrapper: {
    width: 250 * Dimension.scale,
    position: 'absolute',
    top: 55 * Dimension.scale,
    left: 22 * Dimension.scale,
    paddingHorizontal: 15,
    paddingTop: 10
  },
  viewInputStyle: {
    height: 45 * Dimension.scale,
    borderRadius: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: Resource.colors.inactiveButton,
    marginTop: 5,
    width: 240 * Dimension.scale,
    alignSelf: 'center'
  },
  viewInputStyle1: {
    height: 43 * Dimension.scale,
    borderRadius: 0,
    width: 150 * Dimension.scale,
    alignSelf: 'center',
    marginLeft: 5
  },
  textInputStyle: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1
  },
  socialButtonStyle: {
    width: 120 * Dimension.scale,
    height: 27 * Dimension.scale,
    borderRadius: 15 * Dimension.scale,
    backgroundColor: Resource.colors.greenColorApp,
    position: 'absolute',
    right: 87 * Dimension.scale,
    bottom: 28 * Dimension.scale
  },
  textStyle: {
    color: Resource.colors.white100,
    fontWeight: '600',
    fontSize: 12 * Dimension.scale
  },
  viewText: {
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50
  },
  textRuleStyle: {
    textAlign: 'center',
    marginHorizontal: 80,
    paddingTop: 40
  },
  offsetStyle: {
    top: 15,
    left: 10,
    bottom: 20
  },
  pickerStyle: {
    borderRadius: 10 * Dimension.scale
  },
  viewWrapper: {
    width: 300 * Dimension.scale,
    paddingTop: 10,
    height: 370 * Dimension.scale,
    alignSelf: 'center',
    alignItems: 'center'
  },
  wrapperContent: {
    width: 280 * Dimension.scale,
    height: 330 * Dimension.scale,
    backgroundColor: 'white',
    borderRadius: 25,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 25,
    shadowOpacity: 0.3,
    marginTop: 35 * Dimension.scale,
    paddingTop: 10,
    borderWidth: Platform.OS == 'android' ? 0.2 : 0,
    borderColor: 'grey'
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
    right: 38 * Dimension.scale,
    top: 15 * Dimension.scale,
    borderBottomColor: 'white',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 0.3,
    position: 'absolute',
    elevation: 0
  },
  wrapperButton: {
    position: 'absolute',
    bottom: -(45 * Dimension.scale) / 2 + 5,
    right: 0
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
  }
});

const mapDispatchToProps = { onSignUp };
export default connect(
  (state) => ({
    language: state.languageReducer.language
  }),
  mapDispatchToProps
)(Register);
