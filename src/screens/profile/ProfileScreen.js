import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Sounds from 'assets/Sounds';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import ImageZoom from 'common/components/base/ImageZoom';
import LoginRequire from 'common/components/base/LoginRequire';
import ChangelogModal from 'common/components/modal/ChangelogModal';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import FacebookService from 'common/services/FacebookService';
import * as Google from 'common/services/GoogleService';
import NavigationService from 'common/services/NavigationService';
import OneSignalService from 'common/services/OneSignalService';
import StorageService from 'common/services/StorageService';
import AppConst from 'consts/AppConst';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import FastImage from 'react-native-fast-image';
import PushNotification from 'react-native-push-notification';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import AppContextView from 'states/context/views/AppContextView';
import { changeLanguage, onCountConversation, onCountNotify, onUpdateUser, userLogout } from 'states/redux/actions';
import Configs from 'utils/Configs';
import Utils from 'utils/Utils';
import ButtonControlProfile from './containers/ButtonControlProfile';
import ModalChooseInfo from './myProfile/containers/ModalChooseInfo';
import CourseOfflineScreen from './offlineCourse/CourseOfflineScreen';

class ProfileScreen extends AppContextView {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      activePolicy: [],
      multipleSelect: true,
      multipleSelectPolicy: true,
      category: [
        {
          icon: Resource.images.icCource,
          title: Lang.profile.text_course_information,
          content: [Lang.profile.text_my_course, Lang.profile.text_test_history, Lang.profile.text_payment_history]
        }
      ],
      policy: [
        {
          icon: Resource.images.icSecurity,
          title: Lang.profile.text_policy,
          content: [Lang.profile.text_exchange_policy, Lang.profile.text_terms_of_use, Lang.profile.text_information_security_policy]
        }
      ],
      dataLang: [{ id: 0, name: Lang.flashcard.text_vietnam_language }, { id: 1, name: Lang.flashcard.text_english_language }],
      langId: null
    };
  }

  shouldComponentUpdate(nextProps, nextStates) {
    if (nextProps.language !== this.props.language) {
      this.setState({
        category: [
          {
            icon: Resource.images.icCource,
            title: Lang.profile.text_course_information,
            content: [Lang.profile.text_my_course, Lang.profile.text_test_history, Lang.profile.text_payment_history]
          }
        ],
        policy: [
          {
            icon: Resource.images.icSecurity,
            title: Lang.profile.text_policy,
            content: [Lang.profile.text_exchange_policy, Lang.profile.text_terms_of_use, Lang.profile.text_information_security_policy]
          }
        ],
        dataLang: [{ id: 0, name: Lang.flashcard.text_vietnam_language }, { id: 1, name: Lang.flashcard.text_english_language }]
      });
    }
    return true;
  }

  onPressAlert = () => {
    Alert.alert(
      Lang.alert.text_title,
      Lang.alert.hint_content_logout,
      [
        {
          text: Lang.alert.text_button_cancel,
          style: 'cancel'
        },
        { text: Lang.alert.text_button_logout, onPress: this.onPressLogout, style: 'destructive' }
      ],
      { cancelable: false }
    );
  };
  onPressLogout = () => {
    PushNotification.cancelAllLocalNotifications();
    this.props.userLogout();
    this.props.onUpdateUser({});
    StorageService.remove(Const.DATA.KEY_USER);
    StorageService.remove(Const.DATA.KEY_USER_TOKEN);
    StorageService.remove(Const.DATA.REMEMBER_FLASHCARD);
    StorageService.remove(Const.DATA.UNFINISH_FLASHCARD);
    StorageService.remove(Const.DATA.OLD_LESSON);
    StorageService.remove(Const.DATA.OLD_LESSON_NEW);
    StorageService.remove(Const.DATA.LESSON_PROGRESS);
    StorageService.remove(Const.DATA.TRY_DO_TEST);
    StorageService.remove(Const.DATA.NOTIFY_TRY_TEST);
    StorageService.remove(Const.DATA.HISTORY_LESSON);
    Utils.user = {};
    FacebookService.logout();
    Google.logout();
    OneSignalService.countNotify = 0;
    OneSignalService.countNotifyChat = 0;
    this.props.onCountNotify(0);
    this.props.onCountConversation(0);
    Funcs.oneSignalSendTag('');
    OneSignalService.removeDeviceId();
    Utils.token = '';
    NavigationService.reset(ScreenNames.HomeScreen);
  };

  updateSections = (activeSections) => {
    this.setState({ activeSections });
  };

  updatePolicy = (activePolicy) => {
    this.setState({ activePolicy });
  };

  onPressMyProfile = () => {
    NavigationService.navigate(ScreenNames.MyProfileScreen);
  };

  onPressMyCource = () => {
    NavigationService.navigate(ScreenNames.MyCourseScreen);
  };

  onPressHistoryTestScreen = () => {
    NavigationService.navigate(ScreenNames.HistoryTestScreen);
  };

  onPressVideoDownload = () => {
    NavigationService.navigate(ScreenNames.CourseOfflineScreen);
  };
  onPressEnterCode = () => {
    NavigationService.navigate(ScreenNames.EnterCodeScreen);
  };
  onPressChangePassword = () => {
    NavigationService.navigate(ScreenNames.ChangePasswordScreen);
  };

  onPressPaymentHistory = () => {
    NavigationService.navigate(ScreenNames.PaymentHistoryScreen);
  };

  onPressExchangePolicy = () => {
    NavigationService.navigate(ScreenNames.ExchangePolicyScreen);
  };
  onPressTermsOfUse = () => {
    NavigationService.navigate(ScreenNames.TermOfUseScreen);
  };
  onPressSecurityPolicy = () => {
    NavigationService.navigate(ScreenNames.SecurityPolicyScreen);
  };
  onPressChangeLang = () => {
    this.onLangRef.showModal();
  };

  onPressReviewOnFacebook = () => {
    const sharePhotoContent = {
      contentType: 'link',
      contentUrl: 'http://dungmori.com',
      commonParameters: { hashtag: AppConst.IS_ANDROID ? '#dungmori #jlpt #hoctiengnhat' : '#dungmori' }
    };
    FacebookService.share(sharePhotoContent);
  };

  onPressZoomImage = (image) => () => {
    let Image = image && image.uri ? image.uri : '';
    ImageZoom.show([Image]);
  };

  onPressVersion = () => {
    if (!AppConst.IS_DEV_BUILD) return;
    if (!this.countPressVersion) this.countPressVersion = 0;
    if (!this.lastPressVersion) this.lastPressVersion = 0;
    if (Date.now() - this.lastPressVersion <= 500) {
      this.countPressVersion++;
    } else {
      this.countPressVersion = 0;
    }
    if (this.countPressVersion >= 5) {
      Sounds.play('correct');
      ChangelogModal.show();
    }
    this.lastPressVersion = Date.now();
  };

  onPressCommentKaiwa = () => {
    NavigationService.navigate(ScreenNames.KaiwaForTeacherScreen);
  };

  onChangeLanguage = (value) => {
    this.setState({ langId: value.id }, () => {
      const language = value.id === 0 ? Const.LANGUAGE.VI : Const.LANGUAGE.EN;
      this.props.changeLanguage(language);
      StorageService.save(Const.DATA.CHANGE_LANG, language);
    });
  };

  renderLanguage() {
    const { dataLang, langId } = this.state;
    return (
      <ModalChooseInfo
        ref={(refs) => (this.onLangRef = refs)}
        value={langId}
        title={Lang.profile.text_choose_language}
        data={dataLang}
        onChangeOption={this.onChangeLanguage}
        changeLanguage={'changeLanguage'}
      />
    );
  }

  render() {
    const { activeSections, activePolicy, multipleSelect, multipleSelectPolicy, category, policy } = this.state;
    const { user } = this.props;
    let avatar = Resource.images.icAvatar;
    if (user?.avatar) avatar = { uri: Const.RESOURCE_URL.AVATAR.DEFAULT + user.avatar };
    const isPolicy = true;
    const { internet } = this.context || {};
    if (!internet) return <CourseOfflineScreen />;
    if (!user || !user.id) return <LoginRequire />;
    return (
      <Container style={styles.container}>
        <Header text={Lang.profile.text_title_profile} headerStyle={styles.headerStyle} titleStyle={styles.titleStyle} />
        <ScrollView contentContainerStyle={styles.userInfo}>
          <TouchableOpacity onPress={this.onPressMyProfile}>
            <View style={styles.wrapperInfo}>
              <TouchableOpacity onPress={this.onPressZoomImage(avatar)}>
                <FastImage source={avatar} style={styles.avatarStyle} />
              </TouchableOpacity>
              <View style={styles.viewName}>
                <BaseText numberOfLines={2} style={styles.nameStyle}>
                  {this.props.user.name}
                </BaseText>
                <BaseText style={styles.infoStyle}>{Lang.profile.text_info_personal}</BaseText>
              </View>
            </View>
          </TouchableOpacity>
          <Accordion
            sections={category}
            activeSections={activeSections}
            expandMultiple={multipleSelect}
            touchableComponent={TouchableOpacity}
            renderHeader={this.renderHeader}
            renderContent={this.renderContent(null)}
            onChange={this.updateSections}
            underlayColor={Resource.colors.white100}
          />
          {Configs.enabledFeature.downloadVideo ? (
            <ButtonControlProfile source={Resource.images.imVideoDownload} lang={Lang.profile.text_video_download} onPress={this.onPressVideoDownload} />
          ) : null}
          {Configs.enabledFeature.purchase ? (
            <ButtonControlProfile
              textInfoUser={styles.textInfoUser}
              source={Resource.images.icCode}
              lang={Lang.profile.text_enter_activation_code}
              onPress={this.onPressEnterCode}
            />
          ) : null}
          <ButtonControlProfile source={Resource.images.icChangePass} lang={Lang.profile.text_change_password} onPress={this.onPressChangePassword} />
          {Configs.enabledFeature.commentKaiwaForTeacher && user.is_tester ? (
            <ButtonControlProfile
              textInfoUser={styles.textInfoUser}
              source={Resource.images.icCode}
              lang={'KAIWA dành cho giáo viên'}
              onPress={this.onPressCommentKaiwa}
            />
          ) : null}
          <Accordion
            sections={policy}
            activeSections={activePolicy}
            expandMultiple={multipleSelectPolicy}
            touchableComponent={TouchableOpacity}
            renderHeader={this.renderHeader}
            renderContent={this.renderContent(isPolicy)}
            onChange={this.updatePolicy}
            underlayColor={Resource.colors.white100}
          />
          <ButtonControlProfile source={Resource.images.icLang} lang={Lang.profile.text_language} onPress={this.onPressChangeLang} />
          {Configs.enabledFeature.reviewViaFacebook && (
            <ButtonControlProfile source={Resource.images.icAdmin} lang={Lang.calendarKaiwa.text_share_facebook} onPress={this.onPressReviewOnFacebook} />
          )}
          <ButtonControlProfile source={Resource.images.icLogout} lang={Lang.profile.text_enter_logout} onPress={this.onPressAlert} />
          <BaseText style={styles.textVersion} onPress={this.onPressVersion}>
            {Lang.profile.text_version} {(AppConst.IS_DEV_BUILD ? (__DEV__ ? 'DEBUG_' : 'DEV_') : '') + AppConst.VERSION + '-p' + AppConst.PATCH}
          </BaseText>
        </ScrollView>
        {this.renderLanguage()}
        <ChangelogModal />
      </Container>
    );
  }

  renderHeader = (item, index, isActive) => {
    return (
      <View style={styles.menuDropdown}>
        <View style={styles.menu}>
          <FastImage source={item.icon} style={styles.iconStyle} resizeMode={FastImage.resizeMode.contain} />
          <BaseText style={styles.textSummaryItem}>{item.title}</BaseText>
        </View>
        <Ionicons style={styles.icon} name={isActive ? 'ios-arrow-up' : 'ios-arrow-down'} size={20} color={Resource.colors.black1} />
      </View>
    );
  };

  renderContent = (isPolicy) => (item) => {
    return (
      <View>
        {item.content.map((val, index) => {
          let onPress = null;
          if (!isPolicy) {
            if (index === 0) {
              onPress = this.onPressMyCource;
            } else if (index === 1) {
              onPress = this.onPressHistoryTestScreen;
            } else {
              onPress = this.onPressPaymentHistory;
            }
          } else {
            if (index === 0) {
              onPress = this.onPressExchangePolicy;
            } else if (index === 1) {
              onPress = this.onPressTermsOfUse;
            } else {
              onPress = this.onPressSecurityPolicy;
            }
          }
          return (
            <TouchableOpacity onPress={onPress} key={index} style={styles.itemSummaryBox}>
              <BaseText style={styles.textItemSummary}>{val}</BaseText>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Resource.colors.white100
  },
  titleStyle: {
    width: '100%',
    fontSize: 18 * Dimension.scale,
    fontWeight: '600',
    textAlign: 'center'
  },
  container: {
    backgroundColor: Resource.colors.white100
  },
  userInfo: {
    backgroundColor: Resource.colors.white100,
    paddingTop: 10,
    paddingBottom: 40
  },
  wrapperInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15
  },
  avatarStyle: {
    marginTop: 2 * Dimension.scale,
    width: 35 * Dimension.scale,
    aspectRatio: 1 / 1,
    borderRadius: 25
  },
  viewName: {
    marginLeft: 15,
    flex: 1
  },
  nameStyle: {
    fontWeight: '600',
    fontSize: 15 * Dimension.scale,
    color: Resource.colors.black1
  },
  infoStyle: {
    fontSize: 13 * Dimension.scale,
    color: Resource.colors.black3,
    paddingTop: 5
  },
  summary: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Resource.colors.white100,
    borderBottomColor: Resource.colors.borderWidth,
    borderBottomWidth: 1
  },
  textInfoUser: {
    color: Resource.colors.red700
  },
  textEnterCode: {
    paddingLeft: 15,
    fontSize: 15 * Dimension.scale,
    color: Resource.colors.activeColor
  },
  textSummaryItem: {
    paddingLeft: 15,
    color: Resource.colors.black1,
    fontSize: 15 * Dimension.scale,
    fontWeight: '600'
  },
  textItemSummary: {
    paddingLeft: 30 * Dimension.scale,
    fontSize: 15 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '500'
  },
  itemSummaryBox: {
    paddingLeft: 35,
    paddingVertical: 9 * Dimension.scale
  },
  menuDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textLogout: {
    marginLeft: 15,
    fontSize: 16 * Dimension.scale,
    color: Resource.colors.red700
  },
  iconStyle: {
    width: 35 * Dimension.scale,
    aspectRatio: 1 / 1
  },
  textVersion: {
    fontSize: 13 * Dimension.scale,
    textAlign: 'center',
    marginBottom: 30 * Dimension.scale,
    marginTop: 30 * Dimension.scale
  }
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  totalNotify: state.countNotifyReducers.totalNotify,
  language: state.languageReducer.language
});

const mapDispatchToProps = { onUpdateUser, onCountNotify, onCountConversation, changeLanguage, userLogout };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreen);
