import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Dimension from 'common/helpers/Dimension';
import ViewShot from 'react-native-view-shot';
import Funcs from 'common/helpers/Funcs';
import Images from 'assets/Images';

const RATIO = 248 / 340.8;
export default class DegreeShareFacebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: ''
    };
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.onCapture();
    }, 500);
  }

  getUri = () => {
    return this.state.uri;
  };

  onCapture = () => {
    this.ViewShot.capture()
      .then((uri) => {
        this.setState({ uri });
      })
      .catch((error) => {
        Funcs.log(error);
      });
  };

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

  render() {
    const { name, course, totalLes1, totalLes2, totalLes3, result } = this.props;
    const scoreDoing = result.score_1 + result.score_2 + result.score_3;
    const totalScore = totalLes1 + totalLes2 + totalLes3;
    const checkResult = this.checkPass(course, result.score_1, result.score_2, result.score_3, scoreDoing);
    let pass = '合格 PASSED';
    if (!checkResult) pass = '不合格 NOT PASSED';
    let grammar = 'Grammar - Read';
    if (course == 'N1' || course == 'N2') grammar = 'Reading';
    return (
      <View style={styles.container}>
        <ViewShot ref={(refs) => (this.ViewShot = refs)} options={{ format: 'jpg' }} style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <ImageBackground source={Resource.images.imgDegree} style={styles.imageBackground}>
              <FastImage source={Resource.images.logoGreen} style={styles.imgLogo} />
              <BaseText style={styles.textTitle}>DUNGMORI日本語試験</BaseText>
              <BaseText style={styles.textTitle}>認定結果及び成績に関する証明書</BaseText>
              <View style={styles.viewShowInfor}>
                <View style={styles.wrapperTable}>
                  <View style={[styles.row, { borderBottomWidth: 0.5 }]}>
                    <View style={styles.titleArea}>
                      <BaseText style={styles.textContent}>氏名 Name</BaseText>
                    </View>
                    <View style={[styles.contentInfo, { borderLeftWidth: 0.5 }]}>
                      <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{name}</BaseText>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.titleArea}>
                      <BaseText style={styles.textContent}>レベル Level</BaseText>
                    </View>
                    <View style={[styles.contentInfo, { borderLeftWidth: 0.5 }]}>
                      <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{course}</BaseText>
                    </View>
                  </View>
                  <View style={[styles.row, { borderTopWidth: 0.5 }]}>
                    <View style={styles.titleArea}>
                      <BaseText style={styles.textContent}>結果 Result</BaseText>
                    </View>
                    <View style={[styles.contentInfo, { borderLeftWidth: 0.5 }]}>
                      <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{pass}</BaseText>
                    </View>
                  </View>
                </View>
                <View style={styles.infoCompany}>
                  <BaseText style={styles.textContent}>主催者</BaseText>
                  <BaseText style={styles.textContent}>Administrator</BaseText>
                  <BaseText style={{ fontSize: 8, marginTop: 5 * Dimension.scale }}>Dungmori株式会社</BaseText>
                  <BaseText style={{ fontSize: 8, fontWeight: '600' }}>DungMori Joint Stock Company</BaseText>
                </View>
                <View style={styles.wrapperStamp}>
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
                        <View style={[styles.lessonview, { borderRightWidth: 0.5 }]}>
                          <BaseText style={styles.textContentTable}>言語知識（語彙/文法)</BaseText>
                          <BaseText style={styles.textContentTable}>Language Knowledge</BaseText>
                          <BaseText style={styles.textContentTable}>(Vocabulary/Grammar)</BaseText>
                        </View>
                        <View style={[styles.lessonview, { borderRightWidth: 0.5 }]}>
                          <BaseText style={styles.textContentTable}>読解</BaseText>
                          <BaseText style={styles.textContentTable}>{grammar}</BaseText>
                        </View>
                        <View style={styles.lessonview}>
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
                      <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{`${result.score_1}/${totalLes1}`}</BaseText>
                    </View>
                    <View style={styles.scoreArea}>
                      <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{`${result.score_2}/${totalLes2}`}</BaseText>
                    </View>
                    <View style={styles.scoreArea}>
                      <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{`${result.score_3}/${totalLes3}`}</BaseText>
                    </View>
                    <View style={[styles.scoreArea, { borderRightWidth: 0 }]}>
                      <BaseText style={{ ...styles.textContent, fontWeight: 'bold' }}>{`${scoreDoing}${'/'}${totalScore}`}</BaseText>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        </ViewShot>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 310 * Dimension.scale,
    height: (310 * Dimension.scale) / 1.5,
    alignSelf: 'center',
    marginTop: 20,
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  imageBackground: {
    width: 310 * Dimension.scale,
    height: (310 * Dimension.scale) / RATIO,
    alignItems: 'center'
  },
  imgLogo: {
    width: 20.5 * Dimension.scale,
    height: 23 * Dimension.scale,
    marginTop: 10 * Dimension.scaleWidth,
    marginBottom: 5 * Dimension.scale
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
  wrapperStamp: {
    flex: 1,
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
    // backgroundColor:'red'
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
  textContentTable: {
    textAlign: 'center',
    fontSize: 7
  },
  imgStamp: {
    width: 32 * Dimension.scale,
    height: 32 * Dimension.scale,
    transform: [{ rotate: '-15deg' }]
  }
});
