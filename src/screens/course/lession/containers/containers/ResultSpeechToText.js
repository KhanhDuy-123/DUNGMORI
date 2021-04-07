import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
const width = Dimension.widthParent;
class ResultSpeechToText extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { item } = this.props;
    if (!item) return null;
    const { totalQuestion = 0, totalScore = 0, totalCorrect = 0 } = item;
    let resource = Resource.images.imgHightPoint;
    if (Math.round(totalCorrect / (totalQuestion - 1)) < 0.5) {
      resource = Resource.images.imgLowPoint;
    }
    return (
      <View style={styles.wrapperContainer}>
        <View style={styles.container}>
          <FastImage source={resource} style={{ width: 180 * Dimension.scale, height: 180 * Dimension.scale }} />
          <View style={styles.wrapper}>
            <BaseText style={styles.titleText}>
              {Lang.detailLesson.result_test_lesson} <BaseText style={styles.contentText}>{`${totalCorrect}/${totalQuestion - 1}`}</BaseText>
            </BaseText>
            <BaseText style={styles.titleText}>
              {Lang.detailLesson.text_final_grade} <BaseText style={styles.contentText}>{`${totalScore} ${Lang.test.text_point}`}</BaseText>
            </BaseText>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 280 * Dimension.scale,
    height: 280 * Dimension.scale,
    backgroundColor: Resource.colors.white100,
    shadowColor: Resource.colors.grey600,
    marginHorizontal: 20 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    marginVertical: 10,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 5 : 4,
    elevation: Platform.OS === 'ios' ? 0.3 : 5,
    alignItems: 'center',
    paddingVertical: 20
  },
  wrapper: {
    width: 280 * Dimension.scale,
    paddingHorizontal: 30
  },
  titleText: {
    fontSize: 15,
    color: Resource.colors.black3,
    paddingTop: 10
  },
  contentText: {
    fontSize: 15,
    color: 'red',
    fontWeight: '700'
  },
  wrapperContainer: {
    width,
    marginVertical: 10,
    alignItems: 'center'
  }
});
export default ResultSpeechToText;
