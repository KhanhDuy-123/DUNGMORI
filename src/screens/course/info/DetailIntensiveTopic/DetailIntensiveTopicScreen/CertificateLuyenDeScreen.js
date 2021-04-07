import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButton from 'common/components/base/BaseButton';
import BaseText from 'common/components/base/BaseText';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class CertificateLuyenDeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: ''
    };
  }

  // checkPass = (course, score1, score2, score3, totalScore) => {
  //   if (score1 < 19 || score2 < 19 || score3 < 19) return false;
  //   if (course == 'N5' && totalScore >= 80) {
  //     return true;
  //   } else if (course == 'N4' && totalScore >= 90) {
  //     return true;
  //   } else if (course == 'N3' && totalScore >= 95) {
  //     return true;
  //   } else if (course == 'N2' && totalScore >= 90) {
  //     return true;
  //   } else if (course == 'N1' && totalScore >= 100) {
  //     return true;
  //   }
  // };

  render() {
    // const { name, course, totalLes1, totalLes2, totalLes3, result } = this.props;
    // const scoreDoing = result.score_1 + result.score_2 + result.score_3;
    // const totalScore = totalLes1 + totalLes2 + totalLes3;
    // const checkResult = this.checkPass(course, result.score_1, result.score_2, result.score_3, scoreDoing);
    // let pass = '合格 PASSED';
    // if (!checkResult) pass = '不合格 NOT PASSED';
    // let grammar = 'Grammar - Read';
    // if (course == 'N1' || course == 'N2') grammar = 'Reading';
    return (
      <View style={styles.container}>
        <Header left={true} text={Lang.quick_test.result} titleStyle={styles.titleStyle} headerStyle={styles.headerStyle} />
        <View style={styles.wrapper}>
          <View style={{ flex: 1 }}>
            <ImageBackground source={Resource.images.intensive.imCertificate} style={styles.imageBackground} resizeMode="contain">
              <View style={{ paddingTop: 45 * Dimension.scale, alignItems: 'center' }}>
                <BaseText style={styles.textTitle}>MORI日本語試験</BaseText>
                <BaseText style={styles.textTitle}>認定結果及び成績に関する証明書</BaseText>
                <View style={styles.viewShowInfor}>
                  <View style={styles.wrapperTable}>
                    <View style={[styles.row, { borderBottomWidth: 0.5 }]}>
                      <View style={styles.titleArea}>
                        <BaseText style={styles.textContent}>氏名 Name</BaseText>
                      </View>
                      <View style={[styles.contentInfo, { borderLeftWidth: 0.5 }]}>
                        <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{'NGUYEN DUY KHANH'}</BaseText>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <View style={styles.titleArea}>
                        <BaseText style={styles.textContent}>レベル Level</BaseText>
                      </View>
                      <View style={[styles.contentInfo, { borderLeftWidth: 0.5 }]}>
                        <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{'N1'}</BaseText>
                      </View>
                    </View>
                    <View style={[styles.row, { borderTopWidth: 0.5 }]}>
                      <View style={styles.titleArea}>
                        <BaseText style={styles.textContent}>結果 Result</BaseText>
                      </View>
                      <View style={[styles.contentInfo, { borderLeftWidth: 0.5 }]}>
                        <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{'合格 PASSED'}</BaseText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.infoCompany}>
                    <BaseText style={styles.textContent}>主催者</BaseText>
                    <BaseText style={styles.textContent}>Administrator</BaseText>
                    <BaseText style={{ fontSize: 8, marginTop: 5 * Dimension.scale }}>Dungmori株式会社</BaseText>
                    <BaseText style={{ fontSize: 8, fontWeight: '600' }}>DungMori Joint Stock Company</BaseText>
                  </View>
                  <View style={styles.titleArea}>
                    <View style={styles.viewStamp}>
                      <FastImage source={Images.imgStampDungMori} style={styles.imgStamp} />
                    </View>
                  </View>
                </View>
                <View style={styles.wrapperInfo}>
                  <View style={styles.wrapperScore}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 3 }}>
                        <View style={styles.header}>
                          <BaseText style={styles.textContent}>得点区分別得点 Scores by Scroring Section</BaseText>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                          <View style={[styles.titleArea, { borderRightWidth: 0.5 }]}>
                            <BaseText style={styles.textContentTable}>言語知識（語彙/文法)</BaseText>
                            <BaseText style={styles.textContentTable}>Language Knowledge</BaseText>
                            <BaseText style={styles.textContentTable}>(Vocabulary/Grammar)</BaseText>
                          </View>
                          <View style={[styles.titleArea, { borderRightWidth: 0.5 }]}>
                            <BaseText style={styles.textContentTable}>読解</BaseText>
                            <BaseText style={styles.textContentTable}>{'Reading'}</BaseText>
                          </View>
                          <View style={styles.titleArea}>
                            <BaseText style={styles.textContentTable}>聴解</BaseText>
                            <BaseText style={styles.textContentTable}>Listening</BaseText>
                          </View>
                        </View>
                      </View>
                      <View style={styles.viewTotalScore}>
                        <BaseText style={styles.textContentTable}>総合得点</BaseText>
                        <BaseText style={styles.textContentTable}>Total scores</BaseText>
                      </View>
                    </View>
                    <View style={styles.viewScore}>
                      <View style={styles.scoreArea}>
                        <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{`10/60`}</BaseText>
                      </View>
                      <View style={styles.scoreArea}>
                        <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{`60/60`}</BaseText>
                      </View>
                      <View style={styles.scoreArea}>
                        <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{`30/60`}</BaseText>
                      </View>
                      <View style={[styles.scoreArea, { borderRightWidth: 0 }]}>
                        <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{`90/180`}</BaseText>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        </View>
        <BaseButton style={styles.wrapperButton}>
          <Icon name={'sync'} size={18 * Dimension.scale} color={'#FED291'} />
          <BaseText style={styles.textButton}>{Lang.quick_test.do_again}</BaseText>
        </BaseButton>

        <BaseButton text={Lang.intensive.textSeeTask} textStyle={styles.textStyle} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  wrapper: {
    width: 310 * Dimension.scale,
    height: 220 * Dimension.scale,
    alignSelf: 'center',
    marginTop: 20,
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  headerStyle: {
    backgroundColor: Colors.white100,
    shadowColor: '#777',
    shadowOffset: { x: 5, y: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    paddingTop: 15
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: '500'
  },
  imageBackground: {
    width: 310 * Dimension.scale,
    height: 310 * Dimension.scale,
    alignItems: 'center'
  },
  imgLogo: {
    width: 20.5 * Dimension.scale,
    height: 23 * Dimension.scale,
    marginTop: 10 * Dimension.scaleWidth,
    marginBottom: 5 * Dimension.scale,
    opacity: 0.6
  },
  textTitle: {
    fontSize: 12,
    fontWeight: '500'
  },
  viewShowInfor: {
    flexDirection: 'row',
    width: '100%',
    height: 46 * Dimension.scale,
    marginTop: 5 * Dimension.scale,
    paddingHorizontal: 5 * Dimension.scale
  },
  wrapperTable: {
    flex: 3,
    borderWidth: 0.5,
    backgroundColor: 'white'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  textContent: {
    fontSize: 8
  },
  titleArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentInfo: {
    flex: 2,
    backgroundColor: '#E2E7E9',
    justifyContent: 'center',
    paddingLeft: 5
  },
  infoCompany: {
    flex: 1.4,
    paddingLeft: 5,
    justifyContent: 'center'
  },
  viewStamp: {
    width: '90%',
    height: '90%',
    borderWidth: 0.5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapperInfo: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  wrapperInforContent: {
    width: '98%',
    height: 25 * Dimension.scaleHeight
  },
  viewInfo: {
    width: '45%',
    justifyContent: 'center',
    paddingLeft: 10,
    height: '100%',
    borderLeftWidth: 0.5,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    backgroundColor: 'white'
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
    width: '96.5%',
    height: 75 * Dimension.scale,
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
  textContentTable: {
    textAlign: 'center',
    fontSize: 7
  },
  imgStamp: {
    width: 32 * Dimension.scale,
    height: 32 * Dimension.scale,
    transform: [{ rotate: '-15deg' }]
  },
  wrapperButton: {
    width: 300 * Dimension.scale,
    height: 35 * Dimension.scale,
    borderRadius: 10,
    backgroundColor: Colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 25 * Dimension.scale
  },
  textButton: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '600',
    color: Colors.white100,
    paddingLeft: 10
  },
  textStyle: {
    textTransform: 'none',
    fontSize: 14 * Dimension.scale,
    fontWeight: '600',
    color: Colors.violet,
    marginTop: 15 * Dimension.scale,
    textDecorationLine: 'underline'
  }
});
