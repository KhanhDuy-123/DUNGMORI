import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import ImageZoom from 'common/components/base/ImageZoom';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ShareDialog } from 'react-native-fbsdk';
import { captureRef } from 'react-native-view-shot';
import { connect } from 'react-redux';
import NavigationService from 'common/services/NavigationService';
import Dimension from 'common/helpers/Dimension';
import Time from 'common/helpers/Time';
import moment from 'moment';
import Funcs from 'common/helpers/Funcs';

const ContentText = (props) => {
  return (
    <View style={styles.wrapImpotant}>
      <BaseText style={styles.content}>{props.text1}</BaseText>
      <View style={styles.viewText}>
        <BaseText style={styles.impotant}>{props.text2}</BaseText>
        <View style={[styles.barStyle, props.barStyle1]} />
      </View>
      <BaseText style={{ ...styles.content, paddingLeft: 3 }}>,</BaseText>
      <View style={styles.viewText}>
        <BaseText style={styles.impotant}>{props.text3}</BaseText>
        <View style={[styles.barStyle, props.barStyle2]} />
      </View>
      <BaseText style={{ ...styles.content, paddingLeft: 3 }}>{props.text4}</BaseText>
    </View>
  );
};
class KaiwaCertidicateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false
    };
  }

  onBackPress = () => {
    const { success } = this.state;
    if (!success) {
      NavigationService.pop();
    }
  };
  onCapture = () => {
    captureRef(this.viewRef, {
      format: 'jpg',
      quality: 1.0
    }).then((uri) => {
      ImageZoom.show([uri]);
    });
  };

  onPressShareFacebook = () => {
    captureRef(this.viewRef, {
      format: 'jpg',
      width: Dimension.widthParent - 33,
      height: Dimension.widthParent / 2 + 55,
      quality: 1.0
    }).then((uri) => {
      const sharePhotoContent = {
        contentType: 'photo',
        photos: [{ imageUrl: uri, userGenerated: false }],
        commonParameters: { hashtag: '#dungmori #jlpt #hoctiengnhat' }
      };
      ShareDialog.canShow(sharePhotoContent)
        .then(function(canShow) {
          if (canShow) {
            return ShareDialog.show(sharePhotoContent);
          } else {
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
          }
        })
        .then(
          function(result) {
            if (result.isCancelled) {
              Funcs.log('Share cancelled');
            }
          },
          function(error) {
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
          }
        );
    });
  };

  onPressCertificate = () => {
    this.setState({ success: true });
  };

  onPressCertificateSuccess = () => {
    NavigationService.replace(ScreenNames.HomeScreen);
  };

  renderCertificate() {
    const { user } = this.props;
    const { from, to } = this.props.courseOwner;
    let infoUser = Funcs.jsonParse(user.certificate_receive_info);
    let birth = moment(infoUser.birth, 'DD/MM/YYYY').format();
    return (
      <View style={styles.container}>
        <BaseText style={styles.desStyle}>{Lang.calendarKaiwa.text_title_certificate_kaiwa}</BaseText>
        <View style={styles.preStyle}>
          <FastImage source={Resource.images.icZoom} style={styles.iconZoom} resizeMode={FastImage.resizeMode.contain} />
          <BaseText style={styles.textPreStyle}>{Lang.calendarKaiwa.text_click_image}</BaseText>
        </View>
        <TouchableOpacity style={styles.viewShot} onPress={this.onCapture}>
          <ImageBackground ref={(refs) => (this.viewRef = refs)} source={Resource.images.bgKaiwa} style={styles.background}>
            <View style={styles.wrapper}>
              <View style={styles.wrapperLeft}>
                <BaseText style={styles.textStyle}>No. 00660066</BaseText>
                <BaseText style={styles.text1Style}>Certificate of Completion</BaseText>
                <View style={styles.wrapperContent}>
                  <View style={styles.wrapImpotant}>
                    <BaseText style={styles.content}>This is to certifi that</BaseText>
                    <View style={styles.viewText}>
                      <BaseText style={styles.impotant}>{infoUser.name}</BaseText>
                      <View style={styles.barStyle} />
                    </View>
                  </View>
                  <ContentText
                    text1={'(Date of Birth'}
                    text2={Time.format(birth, 'DD - MM')}
                    text3={Time.format(birth, 'YYYY')}
                    text4={') has'}
                    barStyle1={{ width: 32 * Dimension.scale }}
                    barStyle2={{ width: 17 * Dimension.scale }}
                  />
                  <BaseText style={styles.content1}>completed all the requirements of</BaseText>
                  <BaseText style={styles.content1}>SamuraiChan Japanese Kaiwa Training Course</BaseText>
                  <BaseText style={styles.content1}>(100 Days)</BaseText>
                  <BaseText style={styles.content1}>IN WITNESS WHEREOF, this Certificate is given.</BaseText>
                  <ContentText
                    text1={'Date'}
                    text2={Time.format(infoUser.date, 'DD - MM')}
                    text3={Time.format(infoUser.date, 'YYYY')}
                    barStyle1={{ width: 45 * Dimension.scale }}
                    barStyle2={{ width: 25 * Dimension.scale }}
                  />
                  <View style={styles.wraSignature}>
                    <FastImage source={Resource.images.icSignature} style={styles.signatureStyle} />
                    <View style={[styles.barStyle, { width: 80 * Dimension.scale }]} />
                    <View style={styles.signature}>
                      <BaseText style={styles.content}>Signed</BaseText>
                      <BaseText style={{ ...styles.content, paddingLeft: 50 }}>Principal</BaseText>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.wrapperRight}>
                <BaseText style={[styles.textStyle, { paddingRight: Dimension.isIPad ? 30 * Dimension.scale : 10 * Dimension.scale }]}>No. 00660066</BaseText>
                <BaseText style={{ ...styles.text1Style, textAlign: 'center', paddingRight: 15, paddingBottom: 18 }}>終了証書</BaseText>
                <View style={styles.wrapperContent}>
                  <BaseText style={styles.nameStyle}>{infoUser.name.toUpperCase()}</BaseText>
                  <View style={[styles.barStyle, { width: Dimension.isIPad ? 160 * Dimension.scale : 110 * Dimension.scale, marginTop: 1 }]} />
                  <BaseText
                    style={{
                      ...styles.textStyle,
                      paddingRight: Dimension.isIPad ? 60 * Dimension.scale : 30 * Dimension.scale,
                      textDecorationLine: 'none',
                      paddingTop: 3
                    }}>
                    {Time.format(birth, 'YYYY')} 年 {Time.format(birth, 'MM')} 月 {Time.format(birth, 'DD')} 日生
                  </BaseText>
                  <View style={styles.wrapJapan}>
                    <BaseText style={{ ...styles.content, color: '#000' }}>あなたは、サムライチャンオンライン会話コース</BaseText>
                    <BaseText style={{ ...styles.content, color: '#000', paddingTop: 5 }}>（１００日準拠）を修了されましたので、これを証します。</BaseText>
                  </View>
                  <BaseText style={styles.content2}>
                    受講期間　令和 {Time.format(from, 'D')}　年 {Time.format(from, 'M')}　月 {Time.format(from, 'YY')}　日　〜　令和 {Time.format(to, 'D')}
                    　年 {Time.format(to, 'M')}　月 {Time.format(to, 'YY')}　日
                  </BaseText>
                  <FastImage source={Resource.images.icStamp} style={styles.stampStyle} resizeMode={FastImage.resizeMode.contain} />
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <View style={styles.viewButton}>
          <BaseButtonOpacity
            text={Lang.calendarKaiwa.text_share_facebook}
            icon={Resource.images.icFb}
            textStyle={styles.textFacebook}
            socialButtonStyle={[styles.socialButtonStyle, { backgroundColor: '#4267B2', borderColor: '#4267B2' }]}
            onPress={this.onPressShareFacebook}
          />
          <BaseButtonOpacity
            text={Lang.calendarKaiwa.text_button_complete}
            textStyle={styles.textButton}
            socialButtonStyle={styles.socialButtonStyle}
            onPress={this.onPressCertificate}
          />
        </View>
      </View>
    );
  }

  renderSuccess() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View style={[styles.container, { paddingTop: 0 }]}>
          <FastImage source={Resource.images.imCheckCircle} style={styles.stampStyle} resizeMode={FastImage.resizeMode.contain} />
          <BaseText style={styles.textSuccess}>{Lang.calendarKaiwa.text_certificate_content1_success}</BaseText>
          <BaseText style={{ ...styles.textSuccess, paddingTop: 10 }}>{Lang.calendarKaiwa.text_certificate_content2_success}</BaseText>
        </View>
        <BaseButtonOpacity
          text={Lang.calendarKaiwa.text_button_complete}
          textStyle={styles.textButton}
          socialButtonStyle={{ ...styles.socialButtonStyle, marginBottom: 20 }}
          onPress={this.onPressCertificateSuccess}
        />
      </View>
    );
  }

  render() {
    const { success } = this.state;
    return (
      <Container>
        <Header
          left
          text={Lang.try_do_test.hint_text_get_a_certificate}
          onBackPress={this.onBackPress}
          titleArea={styles.titleArea}
          titleStyle={styles.texTitle}
          headerStyle={{ backgroundColor: 'white' }}
        />
        {success ? this.renderSuccess() : this.renderCertificate()}
      </Container>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  courseOwner: state.lessonReducer.courseOwner
});
export default connect(mapStateToProps)(KaiwaCertidicateScreen);

const styles = StyleSheet.create({
  titleArea: {
    marginLeft: 20,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  texTitle: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: '500'
  },
  container: {
    flex: 1,
    paddingTop: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  desStyle: {
    fontSize: 15 * Dimension.scale,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    paddingHorizontal: 20
  },
  preStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15
  },
  iconZoom: {
    width: 16 * Dimension.scale,
    height: 16 * Dimension.scale
  },
  barStyle: {
    width: Dimension.isIPad ? 75 * Dimension.scale : 55 * Dimension.scale,
    height: 0.5,
    backgroundColor: '#000'
  },
  textPreStyle: {
    fontSize: 13 * Dimension.scale,
    color: Colors.greenColorApp,
    paddingLeft: 5
  },
  viewShot: {
    width: Dimension.widthParent - 33,
    height: Dimension.widthParent / 2 + 55
  },
  background: {
    width: Dimension.widthParent - 33,
    height: Dimension.widthParent / 2 + 55,
    shadowColor: '#222',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5
  },
  wrapper: {
    flexDirection: 'row'
  },
  wrapperLeft: {
    flex: 1,
    alignItems: 'center',
    height: Dimension.widthParent / 2 + 20,
    marginTop: 24 * Dimension.scale
  },
  wrapperRight: {
    flex: 1,
    alignItems: 'center',
    height: Dimension.widthParent / 2 + 20,
    marginTop: 24 * Dimension.scale
  },
  textStyle: {
    width: (Dimension.widthParent - 65) / 2,
    textDecorationLine: 'underline',
    fontSize: Dimension.isIPad ? 7 * Dimension.scale : 3 * Dimension.scale,
    fontWeight: '100',
    textAlign: 'center',
    paddingTop: 5,
    paddingLeft: 70 * Dimension.scale
  },
  text1Style: {
    width: (Dimension.widthParent - 65) / 2,
    fontSize: Dimension.isIPad ? 13 * Dimension.scale : 8 * Dimension.scale,
    fontWeight: '300',
    color: '#003F78',
    paddingTop: 20,
    paddingBottom: 25,
    textAlign: 'center'
  },
  wrapperContent: {
    alignItems: 'center'
  },
  content: {
    fontSize: Dimension.isIPad ? 7 * Dimension.scale : 4 * Dimension.scale,
    color: '#222',
    fontWeight: '400'
  },
  content2: {
    fontSize: Dimension.isIPad ? 6 * Dimension.scale : 3 * Dimension.scale,
    color: '#222',
    paddingTop: 5
  },
  impotant: {
    fontSize: Dimension.isIPad ? 7 * Dimension.scale : 5 * Dimension.scale,
    color: '#222',
    fontWeight: '300',
    paddingBottom: 2 * Dimension.scale
  },
  content1: {
    fontSize: Dimension.isIPad ? 7 * Dimension.scale : 4 * Dimension.scale,
    color: '#222',
    fontWeight: '400',
    marginBottom: 5 * Dimension.scale
  },
  wraSignature: {
    alignItems: 'center',
    marginTop: 7
  },
  signature: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  nameStyle: {
    fontSize: 8 * Dimension.scale,
    fontWeight: '400',
    paddingBottom: 2
  },
  stampStyle: {
    width: Dimension.widthParent / 3,
    height: 50 * Dimension.scale,
    marginLeft: 15 * Dimension.scale,
    marginTop: 15 * Dimension.scale
  },
  socialButtonStyle: {
    height: 35 * Dimension.scale,
    backgroundColor: Colors.greenColorApp,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.greenColorApp,
    marginBottom: 7
  },
  viewButton: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20
  },
  textFacebook: {
    paddingHorizontal: 10,
    fontSize: 11 * Dimension.scale,
    color: Colors.white100
  },
  textButton: {
    fontSize: 12 * Dimension.scale,
    color: Colors.white100,
    fontWeight: '500'
  },
  viewText: {
    paddingLeft: 3,
    marginBottom: 7,
    alignItems: 'center'
  },
  wrapImpotant: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  signatureStyle: {
    width: 25 * Dimension.scale,
    height: 20 * Dimension.scale
  },
  textSuccess: {
    color: Colors.greenColorApp,
    fontSize: 10 * Dimension.scale,
    paddingTop: 25,
    fontWeight: '500'
  },
  wrapJapan: {
    width: Dimension.isIPad ? 180 * Dimension.scale : 120 * Dimension.scale,
    alignItems: 'center',
    paddingTop: 25
  }
});
