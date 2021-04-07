import countries from 'assets/jsons/countries.json';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import StorageService from 'common/services/StorageService';
import FacebookService from 'common/services/FacebookService';
import GoogleService from 'common/services/GoogleService';
import NavigationService from 'common/services/NavigationService';
import OneSignalService from 'common/services/OneSignalService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { changeLanguage, onUpdateUser } from 'states/redux/actions';
import Utils from 'utils/Utils';
import Login from './containers/Login';
import Register from './containers/Register';

const width = Dimension.widthParent;

export class ParentAuthenticateScreen extends Component {
  moveView = new Animated.Value(0);
  opacLogin = new Animated.Value(1);
  opacRegister = new Animated.Value(0);
  state = {
    isActive: false,
    changeLang: false
  };

  async componentDidMount() {
    let langNew = await StorageService.get(Const.DATA.CHANGE_LANG);
    if (langNew) {
      this.setState({ changeLang: langNew === 'en' ? true : false });
      this.props.changeLanguage(langNew);
    }
  }

  onLogin = () => {
    this.setState({ isActive: !this.state.isActive }, () => {
      Animated.sequence([this.movetoLeft(), this.turnLogin(), this.turnRight()]).start();
    });
  };
  onRegister = () => {
    this.setState({ isActive: !this.state.isActive }, () => {
      Animated.sequence([this.movetoRight(), this.turnRegister(), this.turnLeft()]).start();
    });
  };

  onPressBack = () => {
    this.props.onUpdateUser({});
    StorageService.remove(Const.DATA.KEY_USER);
    StorageService.remove(Const.DATA.KEY_USER_TOKEN);
    StorageService.remove(Const.DATA.REMEMBER_FLASHCARD);
    StorageService.remove(Const.DATA.UNFINISH_FLASHCARD);
    StorageService.remove(Const.DATA.OLD_LESSON);
    StorageService.remove(Const.DATA.OLD_LESSON_NEW);
    StorageService.remove(Const.DATA.LESSON_PROGRESS);
    Utils.token = '';
    Utils.user = {};
    FacebookService.logout();
    GoogleService.logout();
    OneSignalService.countNotify = 0;
    OneSignalService.countNotifyChat = 0;
    Funcs.oneSignalSendTag('');
    OneSignalService.removeDeviceId();
    NavigationService.reset(ScreenNames.HomeScreen);
  };

  onPressChangeLang = () => {
    const changeLang = !this.state.changeLang;
    this.setState({ changeLang });
    const language = changeLang ? Const.LANGUAGE.EN : Const.LANGUAGE.VI;
    this.props.changeLanguage(language);
    StorageService.save(Const.DATA.CHANGE_LANG, language);
  };

  movetoRight = () => {
    return Animated.timing(this.moveView, {
      toValue: width - (width / 2 - 10 * Dimension.scale),
      duration: 300
    });
  };

  movetoLeft = () => {
    return Animated.timing(this.moveView, {
      toValue: 0,
      duration: 300
    });
  };

  turnLogin = () => {
    return Animated.timing(this.opacLogin, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true
    });
  };

  turnRegister = () => {
    return Animated.timing(this.opacRegister, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true
    });
  };

  turnRight = () => {
    return Animated.timing(this.opacRegister, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true
    });
  };

  turnLeft = () => {
    return Animated.timing(this.opacLogin, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true
    });
  };
  render() {
    const { language } = this.props;
    return (
      <KeyboardHandle>
        <ScrollView>
          <Container style={{ backgroundColor: Resource.colors.white100 }} barStyle="dark-content">
            <View style={styles.container}>
              <TouchableOpacity onPress={this.onPressBack} style={styles.viewIcon}>
                <Icon name="ios-arrow-back" size={20 * Dimension.scale} color={Resource.colors.white100} />
              </TouchableOpacity>
              <FastImage
                source={Resource.images.logo}
                style={{ width: 100 * Dimension.scale, height: 60 * Dimension.scale }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <TouchableOpacity onPress={this.onPressChangeLang} style={styles.langStyle}>
                <FastImage
                  resizeMode="contain"
                  source={{ uri: language !== 'en' ? countries['VN'].flag : countries['GB'].flag }}
                  style={styles.imageCountryFlag}
                />
                <BaseText style={styles.lang}>{language !== 'en' ? 'Tiếng Việt' : 'English'}</BaseText>
              </TouchableOpacity>
            </View>
            <View style={{ paddingBottom: 100 }}>
              <Animated.View style={{ marginLeft: this.moveView }}>
                {!this.state.isActive ? (
                  <LinearGradient colors={['#4FB23F', '#6ACA54', '#79D861']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearLeft} />
                ) : null}
                {this.state.isActive ? (
                  <LinearGradient colors={['#4FB23F', '#6ACA54', '#79D861']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.linearRight} />
                ) : null}
              </Animated.View>
              <View style={styles.viewLogin}>
                {!this.state.isActive ? (
                  <Animated.View style={[{ flex: 1 }, { opacity: this.opacLogin }]}>
                    <Login onPress={this.onRegister} />
                  </Animated.View>
                ) : null}
                {this.state.isActive ? (
                  <Animated.View style={[{ flex: 1 }, { opacity: this.opacRegister }]}>
                    <Register onPress={this.onLogin} />
                  </Animated.View>
                ) : null}
              </View>
            </View>
          </Container>
        </ScrollView>
      </KeyboardHandle>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20 * Dimension.scale,
    paddingBottom: 20 * Dimension.scale,
    backgroundColor: '#FFFFFF'
  },
  viewIcon: {
    width: 30 * Dimension.scale,
    height: 30 * Dimension.scale,
    borderRadius: 15 * Dimension.scale,
    backgroundColor: Resource.colors.greenColorApp,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1
  },
  langStyle: {
    height: 30 * Dimension.scale,
    borderWidth: 0.5,
    borderColor: Resource.colors.greenColorApp,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    flexDirection: 'row',
    paddingHorizontal: 5
  },
  lang: {
    color: Resource.colors.greenColorApp,
    fontSize: 12
  },
  containerView: {
    paddingBottom: 100
  },
  tabBarUnderlineStyle: {
    backgroundColor: Resource.colors.greenColorApp,
    height: 1
  },
  tabBarTextStyle: {
    fontSize: 15 * Dimension.scale
  },
  linearLeft: {
    width: width / 2 - 10 * Dimension.scale,
    height: 380 * Dimension.scale,
    borderTopRightRadius: 50 * Dimension.scale,
    borderBottomRightRadius: 50 * Dimension.scale,
    paddingLeft: 30
  },
  linearRight: {
    width: width / 2 - 10 * Dimension.scale,
    height: 380 * Dimension.scale,
    borderTopLeftRadius: 50 * Dimension.scale,
    borderBottomLeftRadius: 50 * Dimension.scale,
    paddingRight: 30
  },
  viewLogin: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  imageCountryFlag: {
    width: 25,
    height: 15,
    marginRight: 5
  }
});

const mapStateToProps = (state) => ({
  language: state.languageReducer.language
});

const mapDispatchToProps = { onUpdateUser, changeLanguage };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParentAuthenticateScreen);
