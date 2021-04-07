import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Base64 from 'common/components/base/Base64';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import DropAlert from 'common/components/base/DropAlert';
import Header from 'common/components/base/Header';
import ScreenNames from 'consts/ScreenName';
import UrlConst from 'consts/UrlConst';
import moment from 'moment';
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ShareDialog } from 'react-native-fbsdk';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NavigationService from 'common/services/NavigationService';
import Dimension from 'common/helpers/Dimension';
import Time from 'common/helpers/Time';

const RATIO = 248 / 340.8;
export default class SubmitSuccess extends Component {
  constructor(props) {
    super(props);
    moment.locale('en');
    this.state = {};
  }

  componentWillUnmount() {
    Time.updateTimeLocate();
  }

  checkPass = (course, score1, score2, score3, totalScore) => {
    if (score1 < 19 || score2 < 19 || score3 < 19) return false;
    if (course == 'N5' && totalScore >= 80) {
      return true;
    } else if (course == 'N4' && totalScore >= 90) {
      return true;
    } else if (course == 'N3' && totalScore >= 95) {
      return true;
    } else if (course == 'N2' && totalScore >= 90) {
      return true;
    } else if (course == 'N1' && totalScore >= 100) {
      return true;
    }
  };

  onShare = async () => {
    let resultID = this.props.params.id;
    resultID = Base64.encode(`${resultID}`);
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: UrlConst.API_JP_TEST + 'certificate/' + resultID,
      commonParameters: { hashtag: '#dungmori #jlpt #hoctiengnhat' }
    };
    try {
      let result = await ShareDialog.canShow(shareLinkContent);
      let response = null;
      if (result) {
        response = ShareDialog.show(shareLinkContent);
      }
      return response;
    } catch (error) {
      return error;
    }
  };

  onShareToFacebook = async () => {
    let response = await this.onShare();
    if (response) {
      DropAlert.success('', 'お疲れ様でした。');
    }
  };

  onPressGoHomePage = () => {
    NavigationService.reset(ScreenNames.HomeScreen);
  };

  render() {
    const data = this.props.params;
    const dob = Time.format(data.certificate_info.dob, 'DD/MM/YYYY');
    const dayTest = moment(data.updated_at).format('MMMM Do, YYYY');
    const year = Time.format(data.updated_at, 'YYYY');
    const month = Time.format(data.updated_at, 'MM');
    const day = Time.format(data.updated_at, 'DD');
    const checkResult = this.checkPass(data.course, data.score_1, data.score_2, data.score_3, data.total_score);
    let result = '不合格 NOT PASSED';
    if (checkResult) result = '合格 PASSED';
    let grammar = 'Grammar - Read';
    if (data.course == 'N1' || data.course == 'N2') grammar = 'Reading';
    return (
      <Container style={styles.container}>
        <Header text={Lang.try_do_test.try_do_test_jlpt} titleStyle={styles.titleStyle} />
        <ImageBackground source={Resource.images.imgDegree} style={styles.imgBackground} resizeMode="contain" imageStyle={styles.imgStyles}>
          <FastImage source={Resource.images.logoGreen} style={styles.imgLogo} />
          <BaseText style={styles.textJPTitle}>DUNGMORI日本語試験</BaseText>
          <BaseText style={styles.textJPTitle}>認定結果及び成績に関する証明書</BaseText>
          <BaseText style={styles.textDungmori}>DUNGMORI - JAPANESE TEST</BaseText>
          <BaseText style={styles.textCetificate}>CERTIFICATE OF RESULT AND SCORES</BaseText>
          <View style={styles.wrapperTitle}>
            <BaseText style={styles.textTitle}>
              <BaseText style={styles.textTitle}>Dungmori株式会社が</BaseText>
              <BaseText style={{ ...styles.textTitle, fontWeight: 'bold' }}>{`${year}年${month}月${day}日`}</BaseText>
              <BaseText style={styles.textTitle}>に実施した日本語試験に関し、</BaseText>
            </BaseText>
            <BaseText style={styles.textTitle}>認定結果及び成績を次のとおり証明します。</BaseText>
            <BaseText style={{ ...styles.textTitle, marginHorizontal: 20, marginTop: 5 * Dimension.scale, letterSpacing: -0.5 }}>
              This is certify the result and the scores of DungMori - Japanese Test
            </BaseText>
            <BaseText style={styles.textTitle}>
              <BaseText style={styles.textTitle}>given on </BaseText>
              <BaseText style={{ ...styles.textTitle, fontWeight: 'bold' }}>{dayTest}</BaseText>{' '}
              <BaseText style={styles.textTitle}>administered by Dung Mori Joint Stock Company</BaseText>
            </BaseText>
          </View>
          <View style={styles.wrapperInfo}>
            <View style={styles.wrapperInforContent}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.viewInfo}>
                  <View style={styles.japanTitle}>
                    <BaseText style={styles.textTitle}>氏名</BaseText>
                  </View>
                  <BaseText style={styles.textTitle}>Name</BaseText>
                </View>
                <View style={styles.viewData}>
                  <BaseText style={{ ...styles.textTitle, fontWeight: '600' }}>{data.certificate_info.fullname.toUpperCase()}</BaseText>
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={[styles.viewInfo, { borderTopWidth: 0 }]}>
                  <View style={styles.japanTitle}>
                    <BaseText style={styles.textTitle}>生年月日 </BaseText>
                  </View>
                  <BaseText style={styles.textTitle}>Date of birth (d/m/y)</BaseText>
                </View>
                <View style={[styles.viewData, { borderTopWidth: 0 }]}>
                  <BaseText style={{ ...styles.textTitle, fontWeight: '600' }}>{dob}</BaseText>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.wrapperInfo}>
            <View style={[styles.wrapperInforContent, { height: 46 * Dimension.scale }]}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.viewInfo}>
                  <View style={styles.japanTitle}>
                    <BaseText style={styles.textTitle}>レベル</BaseText>
                  </View>
                  <BaseText style={styles.textTitle}>Level</BaseText>
                </View>
                <View style={styles.viewData}>
                  <BaseText style={{ ...styles.textTitle, fontWeight: '600' }}>{data.courseName}</BaseText>
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={[styles.viewInfo, { borderTopWidth: 0 }]}>
                  <View style={styles.japanTitle}>
                    <BaseText style={styles.textTitle}>結果</BaseText>
                  </View>
                  <BaseText style={styles.textTitle}>Result</BaseText>
                </View>
                <View style={[styles.viewData, { borderTopWidth: 0 }]}>
                  <BaseText style={{ ...styles.textTitle, fontWeight: '600' }}>{result}</BaseText>
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={[styles.viewInfo, { borderTopWidth: 0 }]}>
                  <View style={styles.japanTitle}>
                    <BaseText style={styles.textTitle}>受験地</BaseText>
                  </View>
                  <BaseText style={styles.textTitle}>受験地 Test site</BaseText>
                </View>
                <View style={[styles.viewData, { borderTopWidth: 0 }]}>
                  <BaseText style={{ ...styles.textTitle, fontWeight: '600' }}>HTTPS://DUNGMORI.COM</BaseText>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.wrapperInfo}>
            <View style={styles.wrapperScore}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 3 }}>
                  <View style={styles.header}>
                    <BaseText style={styles.textTitle}>得点区分別得点 Scores by Scroring Section</BaseText>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={[styles.lessonview, { borderRightWidth: 0.5 }]}>
                      <BaseText style={{ ...styles.textTitle, textAlign: 'center' }}>言語知識（語彙/文法)</BaseText>
                      <BaseText style={{ ...styles.textTitle, textAlign: 'center' }}>Language Knowledge</BaseText>
                      <BaseText style={{ ...styles.textTitle, textAlign: 'center' }}>(Vocabulary/Grammar)</BaseText>
                    </View>
                    <View style={[styles.lessonview, { borderRightWidth: 0.5 }]}>
                      <BaseText style={styles.textTitle}>読解</BaseText>
                      <BaseText style={styles.textTitle}>{grammar}</BaseText>
                    </View>
                    <View style={styles.lessonview}>
                      <BaseText style={styles.textTitle}>聴解</BaseText>
                      <BaseText style={styles.textTitle}>Listening</BaseText>
                    </View>
                  </View>
                </View>
                <View style={styles.viewTotalScore}>
                  <BaseText style={styles.textTitle}>総合得点</BaseText>
                  <BaseText style={styles.textTitle}>Total scores</BaseText>
                </View>
              </View>
              <View style={styles.viewScore}>
                <View style={styles.scoreArea}>
                  <BaseText style={{ ...styles.textTitle, fontWeight: 'bold' }}>{`${data.score_1}/60`}</BaseText>
                </View>
                <View style={styles.scoreArea}>
                  <BaseText style={{ ...styles.textTitle, fontWeight: 'bold' }}>{`${data.score_2}/60`}</BaseText>
                </View>
                <View style={styles.scoreArea}>
                  <BaseText style={{ ...styles.textTitle, fontWeight: 'bold' }}>{`${data.score_3}/60`}</BaseText>
                </View>
                <View style={[styles.scoreArea, { borderRightWidth: 0 }]}>
                  <BaseText style={{ ...styles.textTitle, fontWeight: 'bold' }}>{`${data.total_score}/180`}</BaseText>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.wrapperAdmin}>
            <View style={styles.wrapperAdminContent}>
              <View>
                <BaseText style={{ fontSize: 10 }}>主催者</BaseText>
                <BaseText style={{ fontSize: 10 }}>Administrator</BaseText>
              </View>
              <View>
                <BaseText style={{ fontSize: 11 }}>Dungmori株式会社</BaseText>
                <BaseText style={{ fontSize: 14, fontWeight: 'bold' }}>DungMori Joint Stock Company</BaseText>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.viewCondau}>
                <FastImage source={Images.imgStampDungMori} style={styles.stamp} />
              </View>
            </View>
          </View>
          <View style={styles.wrapperButtonShare}>
            <TouchableOpacity style={styles.buttonShare} onPress={this.onShareToFacebook}>
              <BaseText style={styles.textButtonShare}>{Lang.try_do_test.share_result}</BaseText>
              <AntDesign name="facebook-square" size={14 * Dimension.scale} color="#0062F6" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={[styles.areaButton, { height: 50 * Dimension.scale }]}>
          <TouchableOpacity style={styles.button} onPress={this.onPressGoHomePage}>
            <BaseText style={{ color: 'white' }}>{`${Lang.try_do_test.back_home}`}</BaseText>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 18
  },
  areaButton: {
    height: 100,
    width: Dimension.widthParent,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 1,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: '80%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 5
  },
  imgBackground: {
    width: 320 * Dimension.scale,
    height: (320 * Dimension.scale) / RATIO,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  container: {
    // alignItems: 'center'
  },
  imgLogo: {
    width: 22.5 * Dimension.scale,
    height: 25 * Dimension.scale,
    marginTop: 15 * Dimension.scaleWidth
  },
  textDungmori: {
    fontSize: 7 * Dimension.scale,
    fontWeight: '500',
    marginTop: 5 * Dimension.scale
  },
  textCetificate: {
    fontSize: 6 * Dimension.scale,
    fontWeight: '500'
  },
  wrapperTitle: {
    marginTop: 5 * Dimension.scale,
    alignItems: 'center'
  },
  textTitle: {
    fontSize: 7 * Dimension.scale,
    letterSpacing: -0.5
  },
  wrapperInfo: {
    width: '95%',
    alignItems: 'center',
    marginTop: 10
  },
  wrapperInforContent: {
    width: '98%',
    height: 30 * Dimension.scaleHeight
  },
  viewInfo: {
    width: '45%',
    paddingLeft: 10,
    height: '100%',
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },
  viewData: {
    flex: 1,
    backgroundColor: '#E2E7E9',
    justifyContent: 'center',
    paddingLeft: 10,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5
  },
  wrapperScore: {
    width: '98%',
    height: 90 * Dimension.scale,
    borderWidth: 0.5,
    backgroundColor: 'white'
  },
  viewScore: {
    width: '100%',
    height: 15 * Dimension.scaleHeight,
    flexDirection: 'row'
  },
  header: {
    width: '100%',
    height: 15 * Dimension.scaleHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5
  },
  lessonview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreArea: {
    flex: 1,
    borderRightWidth: 0.5,
    borderTopWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewTotalScore: {
    flex: 1,
    borderLeftWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapperAdmin: {
    width: '93%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginTop: 5 * Dimension.scaleHeight
  },
  viewCondau: {
    width: 75 * Dimension.scale,
    height: 75 * Dimension.scale,
    alignSelf: 'flex-end',
    borderWidth: 0.5,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  textJPTitle: {
    fontSize: 8 * Dimension.scale,
    marginTop: 3,
    fontWeight: 'bold'
  },
  viewMailing: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    alignItems: 'center'
  },
  viewInfoMailing: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5 * Dimension.scale,
    flexDirection: 'row',
    alignItems: 'center'
  },
  wrapperTable: {
    width: '95%',
    height: '90%',
    borderWidth: 0.5
  },
  wrapperTableInfor: {
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableRow: {
    flex: 1,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  colTitle: {
    borderRightWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  viewSex: {
    width: 15 * Dimension.scale,
    height: '100%',
    borderRightWidth: 0.5
  },
  contentSex: {
    flex: 1,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewWrapperTel: {
    flex: 2.5,
    justifyContent: 'center',
    paddingLeft: 5
  },
  imgStyles: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  wrapperButtonShare: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '98%',
    paddingLeft: 10
  },
  buttonShare: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2
  },
  textButtonShare: {
    marginRight: 5,
    fontSize: 8 * Dimension.scale
  },
  stamp: {
    width: 50 * Dimension.scale,
    height: 50 * Dimension.scale,
    transform: [{ rotate: '-15deg' }]
  },
  wrapperAdminContent: {
    justifyContent: 'space-between',
    width: '70%',
    height: '80%'
  },
  japanTitle: {
    width: '30%'
  }
});
