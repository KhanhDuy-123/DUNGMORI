import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import ImageBackground from 'common/components/base/ImageBackground';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import StorageService from 'common/services/StorageService';
import NavigationService from 'common/services/NavigationService';
import OneSignalService from 'common/services/OneSignalService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { PureComponent } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { changeLanguage, onUpdateUser } from 'states/redux/actions';
import Utils from 'utils/Utils';
import EncryptFileService from 'common/services/EncryptFileService';
import IPhoneXHelper from 'common/helpers/IPhoneXHelper';

const width = Dimension.widthParent;
class SplashScreen extends PureComponent {
  async componentDidMount() {
    await IPhoneXHelper.init();
    this.navigate();
  }

  navigate = async () => {
    const token = await StorageService.get(Const.DATA.KEY_USER_TOKEN);
    const deviceId = await StorageService.get(Const.DATA.DEVICE_ID);
    const lang = await StorageService.get(Const.DATA.CHANGE_LANG);
    if (lang) {
      this.props.changeLanguage(lang);
    }
    if (token && deviceId) {
      Utils.token = token;
      Utils.deviceId = deviceId;
      EncryptFileService.addSalt(deviceId);
      let res = await Fetch.post(Const.API.USER.AUTO_LOGIN, null, true);
      if (res.status === Fetch.Status.SUCCESS) {
        OneSignalService.updateDeviceId();
        Utils.user = res.data;
        this.props.onUpdateUser({ ...res.data });
        Funcs.oneSignalSendTag(res.data.id);
        NavigationService.reset(ScreenNames.HomeScreen);
      } else {
        DropAlert.warn('', Lang.splash.text_session_expired);
        NavigationService.reset(ScreenNames.ParentAuthenticateScreen);
      }
    } else {
      let keyIntro = await StorageService.get(Const.DATA.KEY_INTRODCUCING_APP);
      this.timer = setTimeout(() => {
        if (keyIntro === Const.DATA.SHOW_INTRO_APP) {
          NavigationService.reset(ScreenNames.HomeScreen);
        } else {
          NavigationService.reset(ScreenNames.IntroAppScreen);
        }
      }, 1000);
    }
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <ImageBackground nameImage={Resource.images.logo} />
        <BaseText style={styles.textStyle}>{Lang.splash.text_intro_app}</BaseText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  textStyle: {
    color: Resource.colors.greenColorApp,
    fontSize: 14,
    textAlign: 'center',
    width: width / 2 + 70
  }
});
const mapStateToProps = (state) => ({
  language: state.languageReducer.language
});
const mapDispatchToProps = { onUpdateUser, changeLanguage };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreen);
