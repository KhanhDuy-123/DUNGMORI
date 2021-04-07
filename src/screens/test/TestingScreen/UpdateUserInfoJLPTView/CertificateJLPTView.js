import CameraRoll from '@react-native-community/cameraroll';
import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import ImageZoom from 'common/components/base/ImageZoom';
import LoadingModal from 'common/components/base/LoadingModal';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Time from 'common/helpers/Time';
import FacebookService from 'common/services/FacebookService';
import NavigationService from 'common/services/NavigationService';
import UIConst from 'consts/UIConst';
import UrlConst from 'consts/UrlConst';
import React, { PureComponent } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Permissions from 'react-native-permissions';
import { captureRef } from 'react-native-view-shot';
import Utils from 'utils/Utils';
import moment from 'moment';

const ImageLa = () => {
  return (
    <FastImage
      source={Images.icLa}
      tintColor={Colors.greenColorApp}
      style={{ width: 10 * Dimension.scaleWidth, height: 7 * Dimension.scaleHeight }}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};
const Table = (props) => {
  return (
    <View style={{ ...styles.viewTable, borderBottomWidth: props.border ? 0 : 1 }}>
      <View style={styles.viewTitle}>
        <BaseText style={styles.title}>{props.titleJapan}</BaseText>
        <BaseText style={{ ...styles.title, width: 65 * Dimension.scaleWidth }}>{props.titleEnglish}</BaseText>
      </View>
      <View style={styles.border} />
      <View style={styles.viewContent}>{props.hide && !props.isActive ? <ImageLa /> : <BaseText style={styles.content}>{props.content}</BaseText>}</View>
    </View>
  );
};

class CertificateJLPTView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isActive: props.isActive && !props.editable
    };
  }

  async componentDidMount() {
    // Nếu đã có thông tin rồi thì hiển thị bằng
    const { result, editable } = this.props;
    if (result.certificate_info && !editable) {
      let certificateInfo = Funcs.jsonParse(result.certificate_info);
      if (certificateInfo?.fullname && certificateInfo?.address && certificateInfo?.level && certificateInfo?.career) this.setState({ isActive: true });
    }
  }

  onPressSubmit = async () => {
    // Submit
    const { result, userData } = this.props;
    LoadingModal.show();
    let response = await Fetch.get(UrlConst.API_JP_TEST + 'certificate/' + result?.id, userData, true, null, true);
    if (response.status === 200) {
      this.setState({ isActive: true });
    }
    LoadingModal.hide();
  };

  onPressComplete = () => {
    if (this.props.onPressComplete) {
      this.props.onPressComplete();
      return;
    }
    NavigationService.back();
  };

  onPressDownload = async () => {
    var permisison = await Permissions.request('photo');
    if (permisison !== 'authorized') {
      Alert.alert('', Lang.permission.photo, [
        {
          text: 'Ok',
          onPress: () => {}
        }
      ]);
      return;
    }
    captureRef(this.viewRef, {
      format: 'jpg',
      quality: 1.0
    }).then((uri) => {
      CameraRoll.saveToCameraRoll(uri, 'photo')
        .then((res) => DropAlert.success('', Lang.chooseLession.alert_download_image_success))
        .catch((err) => console.log(err));
    });
  };

  onPressShare = () => {
    captureRef(this.viewRef, {
      format: 'jpg',
      width: 250 * Dimension.scaleWidth,
      height: Dimension.isIPad ? 400 * Dimension.scaleHeight : 350 * Dimension.scaleHeight,
      quality: 1.0
    }).then((uri) => {
      const sharePhotoContent = {
        contentType: 'photo',
        photos: [{ imageUrl: uri, userGenerated: false }],
        commonParameters: { hashtag: '#dungmori #jlpt #hoctiengnhat' }
      };
      FacebookService.share(sharePhotoContent);
    });
  };

  onCapture = () => {
    captureRef(this.viewRef, {
      format: 'jpg',
      quality: 1.0
    }).then((uri) => {
      ImageZoom.show([uri]);
    });
  };

  checkPass = () => {
    const { result = {} } = this.props;
    const { score_1, score_2, score_3, course, total_score } = result;
    if (score_1 < 19 || score_2 < 19 || score_3 < 19) return false;
    if (course == 'N5' && total_score >= 80) {
      return true;
    } else if (course == 'N4' && total_score >= 90) {
      return true;
    } else if (course == 'N3' && total_score >= 95) {
      return true;
    } else if (course == 'N2' && total_score >= 90) {
      return true;
    } else if (course == 'N1' && total_score >= 100) {
      return true;
    }

    return false;
  };

  formatTimeTesting = () => {
    moment.locale('en');
    const { result = {} } = this.props;
    const str = Time.format(result.created_at, 'll');
    Time.updateTimeLocate();
    return str;
  };

  render() {
    const { userData = {}, result = {} } = this.props;
    const { isActive } = this.state;
    let status = this.checkPass() ? 'PASSED' : 'NOT PASSED';
    let countResult = result.score_1 + result.score_2 + result.score_3;
    const isN123 = result.course === 'N1' || result.course === 'N2' || result.course === 'N3';

    // Get more info
    const addressInfo = Utils.listTestingAddress.find((e) => e.id == userData.address);
    const levelInfo = Utils.listTestingLevel.find((e) => e.id == userData.level);
    const careerInfo = Utils.listCareer.find((e) => e.id == userData.career);

    return (
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.2} style={styles.wrapper} onPress={this.onCapture}>
          <View ref={(refs) => (this.viewRef = refs)} style={styles.wrapper}>
            <FastImage source={Images.icBackgroundCerti} style={styles.background} resizeMode={FastImage.resizeMode.cover} />
            <FastImage source={Images.icHoaLeft} style={styles.iconStyle} tintColor={Colors.greenColorApp} resizeMode={FastImage.resizeMode.contain} />
            <FastImage
              source={Images.icCay}
              tintColor={Colors.greenColorApp}
              style={{ ...styles.iconStyle, left: (250 * Dimension.scaleWidth) / 2 - 15 * Dimension.scaleWidth }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <FastImage
              source={Images.icHoaRight}
              tintColor={Colors.greenColorApp}
              style={{ ...styles.iconStyle, left: null, right: 0 }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.wrapperView}>
              <BaseText style={styles.titleStyle}>MORI日本語試験</BaseText>
              <BaseText style={styles.titleStyle}>認定結果及び成績に関する証明書</BaseText>
              <BaseText style={{ ...styles.titleStyle1, paddingTop: 5 }}>MORI JAPANESE TEST</BaseText>
              <BaseText style={styles.titleStyle1}>CERTIFICATE OF RESULT AND SCORES</BaseText>
              <BaseText style={{ ...styles.titleStyle2, paddingTop: 3 }}>
                Dungmori<BaseText style={styles.titleStyle3}>株式会社が</BaseText>
                <BaseText style={{ ...styles.titleStyle3, fontWeight: 'bold' }}> {Time.format(result.created_at, 'YYYY年MM月DD日')}</BaseText>
                <BaseText style={styles.titleStyle3}>に実施した日本語試験に関し、</BaseText>
              </BaseText>
              <BaseText style={styles.titleStyle3}>結果及び成績を次のとおり証明します。</BaseText>
              <BaseText style={{ ...styles.titleStyle2, paddingTop: 3 }}>This is to certify the result and the scores of Mori Japanese Test</BaseText>
              <BaseText style={styles.titleStyle2}>
                given on <BaseText style={{ ...styles.titleStyle3, fontWeight: 'bold' }}> {this.formatTimeTesting()}</BaseText> administered by Dungmori Joint
                Stock Company
              </BaseText>
              <View style={styles.wrapperTable}>
                <Table content={userData.fullname} titleEnglish={'Name'} titleJapan={'氏名'} />
                <Table content={Time.format(userData.dob, 'DD/MM/YYYY')} titleEnglish={'Date of Birth (d/m/y)'} titleJapan={'生年月日'} />
                <Table content={userData.email} titleEnglish={'Email'} titleJapan={'メール'} />
                <Table content={userData.mobile} titleEnglish={'Tel'} titleJapan={'電話番号'} />
                <Table content={addressInfo?.name} titleEnglish={'Address'} titleJapan={'住所'} />
                <Table content={levelInfo?.name} titleEnglish={'My level'} titleJapan={'レベル'} />
                <Table content={careerInfo?.name} titleEnglish={'Career'} titleJapan={'職業'} border />
              </View>
              <View style={{ ...styles.wrapperTable, ...styles.wrapperTableTest }}>
                <Table content={result?.course} titleEnglish={'Test level'} titleJapan={'レベル'} />
                <Table content={status} isActive={isActive} hide titleEnglish={'Result'} titleJapan={'結果'} />
                <Table content={'HTTPS://DUNGMORI.COM'} titleEnglish={'Test site'} titleJapan={'受験地'} border />
              </View>
              <View style={{ ...styles.wrapperTable, ...styles.wrapperTableResult }}>
                <View style={styles.viewName}>
                  <View style={styles.viewResult1}>
                    <View style={styles.viewSection}>
                      <BaseText style={{ ...styles.result, paddingTop: 2 }}>得点区分別得点</BaseText>
                      <BaseText style={{ ...styles.result, paddingLeft: 7 }}>Scores by Scoring Section</BaseText>
                    </View>
                    <View style={styles.viewPoint}>
                      <View style={styles.textListen}>
                        <BaseText style={styles.result}>{isN123 ? '言語知識 (文字・語彙・文法)' : '言語知識 (文字・語彙)'}</BaseText>
                        <BaseText style={styles.result}>Language Knowledge</BaseText>
                        <BaseText style={styles.result}>{isN123 ? '(Vocabulary・Grammar)' : '(Vocabulary)'}</BaseText>
                      </View>
                      <View style={{ ...styles.border, height: 24 * Dimension.scaleHeight }} />
                      <View style={styles.textListen}>
                        <BaseText style={styles.result}>{isN123 ? '読解' : '文法・読解'}</BaseText>
                        <BaseText style={styles.result}>{isN123 ? 'Reading' : 'Grammar・Reading'}</BaseText>
                      </View>
                      <View style={{ ...styles.border, height: 24 * Dimension.scaleHeight }} />
                      <View style={styles.textListen}>
                        <BaseText style={styles.result}>聴解</BaseText>
                        <BaseText style={styles.result}>Listening</BaseText>
                      </View>
                    </View>
                  </View>
                  <View style={{ ...styles.border, height: 37 * Dimension.scaleHeight }} />
                  <View style={styles.viewResult2}>
                    <BaseText style={styles.result}>総合得点</BaseText>
                    <BaseText style={styles.result}>Total scores</BaseText>
                  </View>
                </View>
                <View style={styles.viewPoint}>
                  <View style={{ ...styles.viewResult1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ ...styles.textListen, flexDirection: 'row' }}>
                      {isActive ? (
                        <BaseText style={[styles.result, styles.point]}>{result.score_1}</BaseText>
                      ) : (
                        <>
                          <ImageLa />
                          <ImageLa />
                        </>
                      )}
                      <BaseText style={[styles.result, styles.point]}>/60</BaseText>
                    </View>
                    <View style={styles.borderResult} />
                    <View style={{ ...styles.textListen, flexDirection: 'row' }}>
                      {isActive ? (
                        <BaseText style={[styles.result, styles.point]}>{result.score_2}</BaseText>
                      ) : (
                        <>
                          <ImageLa />
                          <ImageLa />
                        </>
                      )}
                      <BaseText style={[styles.result, styles.point]}>/60</BaseText>
                    </View>
                    <View style={styles.borderResult} />
                    <View style={{ ...styles.textListen, flexDirection: 'row' }}>
                      {isActive ? (
                        <BaseText style={[styles.result, styles.point]}>{result.score_3}</BaseText>
                      ) : (
                        <>
                          <ImageLa />
                          <ImageLa />
                        </>
                      )}
                      <BaseText style={[styles.result, styles.point]}>/60</BaseText>
                    </View>
                  </View>
                  <View style={styles.borderResult} />
                  <View style={[styles.viewResult2, styles.viewResult]}>
                    {isActive ? (
                      <BaseText style={[styles.result, styles.point]}>{countResult}</BaseText>
                    ) : (
                      <>
                        <ImageLa />
                        <ImageLa />
                        <ImageLa />
                      </>
                    )}
                    <BaseText style={[styles.result, styles.point]}>/180</BaseText>
                  </View>
                </View>
              </View>
              <View style={styles.viewStamp}>
                <View>
                  <BaseText style={styles.textJapan}>主催者</BaseText>
                  <BaseText style={styles.textJapan}>Administrator</BaseText>
                  <BaseText style={{ ...styles.dungmori, paddingTop: 10 * Dimension.scaleHeight }}>Dungmori株式会社</BaseText>
                  <BaseText style={{ ...styles.dungmori, fontWeight: '700' }}>Dungmori Joint Stock Company</BaseText>
                </View>
                <View style={styles.viewStampDungmori}>
                  <FastImage
                    source={Images.imgStampDungMori}
                    style={{ width: 40 * Dimension.scaleWidth, height: 40 * Dimension.scaleWidth }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </View>
            </View>
          </View>
          {isActive ? null : (
            <View
              style={{
                ...styles.wrapper,
                marginTop: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: 'absolute',
                top: 10 * Dimension.scaleHeight,
                paddingBottom: 30
              }}>
              <FastImage source={Images.icEyes} style={{ width: 50, height: 30 }} resizeMode={FastImage.resizeMode.contain} />
              <BaseText style={styles.textEyes}>Xem mẫu chứng chỉ</BaseText>
              <BaseText style={styles.textEyes}>đã điền thông tin</BaseText>
            </View>
          )}
        </TouchableOpacity>
        {isActive ? (
          <View
            style={{
              ...styles.viewResult,
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: 20 * Dimension.scaleWidth,
              paddingTop: 30 * Dimension.scaleHeight
            }}>
            <BaseButtonOpacity
              onPress={this.onPressComplete}
              text={Lang.chooseLession.text_complete}
              socialButtonStyle={styles.completeStyle}
              textStyle={{ color: 'white', fontWeight: '500' }}
            />
            <BaseButtonOpacity
              onPress={this.onPressDownload}
              icon={Images.icDownload}
              tintColor={Colors.greenColorApp}
              styleImage={{ width: 18, height: 18, marginRight: 5 }}
              text={Lang.chooseLession.text_download}
              socialButtonStyle={{ ...styles.completeStyle, backgroundColor: 'white', borderWidth: 1, borderColor: Colors.greenColorApp }}
              textStyle={{ color: Colors.greenColorApp, fontWeight: '500' }}
            />
            <BaseButtonOpacity
              onPress={this.onPressShare}
              socialButtonStyle={styles.shareStyle}
              icon={Images.share}
              tintColor={Colors.white100}
              styleImage={{ width: 20, height: 20 }}
            />
          </View>
        ) : (
          <BaseButtonOpacity
            onPress={this.onPressSubmit}
            text={Lang.chooseLession.text_button_result_test}
            socialButtonStyle={styles.socialButtonStyle}
            textStyle={{ color: 'white', fontWeight: '500' }}
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white100,
    alignItems: 'center'
  },

  wrapper: {
    width: 250 * Dimension.scaleWidth,
    height: Dimension.isIPad ? 400 * Dimension.scaleHeight : 350 * Dimension.scaleHeight,
    marginTop: 20 * Dimension.scaleHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white100
  },
  wrapperView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 25 * Dimension.scaleHeight
  },
  background: {
    width: 250 * Dimension.scaleWidth,
    height: Dimension.isIPad ? 400 * Dimension.scaleHeight : 350 * Dimension.scaleHeight,
    opacity: 0.1,
    position: 'absolute',
    top: 0
  },
  iconStyle: {
    width: 30 * Dimension.scaleWidth,
    height: 30 * Dimension.scaleWidth,
    position: 'absolute',
    top: 5 * Dimension.scaleHeight,
    left: 0
  },
  titleStyle: {
    fontSize: 9 * Dimension.scaleWidth,
    fontWeight: 'bold'
  },
  titleStyle1: {
    fontSize: 7 * Dimension.scaleWidth,
    fontWeight: '500'
  },
  titleStyle2: {
    fontSize: 5 * Dimension.scaleWidth
  },
  titleStyle3: {
    fontSize: 6 * Dimension.scaleWidth
  },
  socialButtonStyle: {
    backgroundColor: Colors.greenColorApp,
    width: Dimension.widthParent - 40 * Dimension.scaleWidth,
    height: 37 * Dimension.scale,
    borderRadius: 10,
    marginTop: 15 * Dimension.scaleHeight
  },

  wrapperTable: {
    width: 240 * Dimension.scaleWidth,
    backgroundColor: Colors.white100,
    borderWidth: 1,
    borderColor: Colors.black5,
    marginTop: 7 * Dimension.scaleHeight
  },
  wrapperTableTest: {
    marginTop: 7 * Dimension.scaleHeight
  },
  wrapperTableResult: {
    marginTop: 7 * Dimension.scaleHeight
  },
  viewTable: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.black5
  },
  border: {
    width: 1,
    height: 11 * Dimension.scaleHeight,
    backgroundColor: Colors.black5
  },
  viewTitle: {
    flex: 2,
    height: 10 * Dimension.scaleHeight,
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    width: 25 * Dimension.scaleWidth,
    fontSize: 5 * Dimension.scaleWidth,
    marginLeft: 5 * Dimension.scaleWidth
  },
  viewContent: {
    flex: 3,
    backgroundColor: '#E6EAEC',
    height: 10 * Dimension.scaleHeight,
    paddingLeft: 10 * UIConst.SCALE,
    justifyContent: 'center'
  },
  content: {
    fontSize: 5 * Dimension.scaleWidth,
    fontWeight: '600'
  },
  viewName: {
    width: 239 * Dimension.scaleWidth,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.black5
  },
  viewResult: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  borderResult: {
    width: 1,
    height: 12 * Dimension.scaleHeight,
    backgroundColor: Colors.black5
  },
  point: {
    fontSize: 7 * UIConst.SCALE,
    fontWeight: '700'
  },
  viewResult1: {
    width: 190.5 * Dimension.scaleWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewResult2: {
    width: 50 * Dimension.scaleWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewSection: {
    width: '100%',
    height: 13 * Dimension.scaleHeight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  result: {
    fontSize: 5 * UIConst.SCALE
  },
  viewPoint: {
    width: 190 * Dimension.scaleWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textListen: {
    width: (187 * Dimension.scaleWidth) / 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewStamp: {
    width: 240 * Dimension.scaleWidth,
    paddingHorizontal: 5,
    paddingTop: 5 * Dimension.scaleHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  viewStampDungmori: {
    width: 45 * Dimension.scaleWidth,
    height: 45 * Dimension.scaleWidth,
    borderWidth: 1,
    borderColor: Colors.black7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textJapan: {
    fontSize: 6 * Dimension.scaleWidth
  },
  dungmori: {
    fontSize: 7 * Dimension.scaleWidth,
    paddingTop: 5
  },
  textEyes: {
    fontSize: 11 * Dimension.scaleWidth,
    color: Colors.white100
  },
  completeStyle: {
    width: 115 * Dimension.scaleWidth,
    height: 40 * UIConst.SCALE,
    borderRadius: 7,
    backgroundColor: Colors.greenColorApp
  },
  shareStyle: {
    width: 35 * Dimension.scaleWidth,
    height: 40 * UIConst.SCALE,
    borderRadius: 7,
    backgroundColor: Colors.greenColorApp
  }
});
export default CertificateJLPTView;
