import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import ProgressBar from 'common/components/base/ProgressBar';
import TextPercentProgress from 'common/components/base/TextPercentProgress';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
const width = Dimension.widthParent;
// const { width, height } = Dimensions.get('window');
export default class HeaderProgressChooseLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.widthValue = new Animated.Value(0);
  }

  render() {
    const { totalProgress } = this.props;
    if (!totalProgress) return null;
    return (
      <View style={styles.percentComplete}>
        <View style={styles.areaTextPercent}>
          <BaseText style={styles.textTitlePercent}>{Lang.chooseLession.text_percent_lession_complete}</BaseText>
          <TextPercentProgress percent={totalProgress} textStyle={styles.textTitlePercent} />
        </View>
        <ProgressBar containerStyles={styles.progressArea} sliderBar={styles.slider} percent={totalProgress} widthParent={width - 80} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  percentComplete: {
    width: width - 20,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Resource.colors.white100,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: 'grey',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 1
  },
  areaTextPercent: {
    width: width - 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  textTitlePercent: {
    fontSize: 16,
    color: Resource.colors.black1
  },
  progress: {
    height: 7,
    borderRadius: 2,
    backgroundColor: Resource.colors.greyProgress,
    width: '85%'
  },
  viewProgress: {
    position: 'absolute',
    height: 7,
    width: '10%',
    backgroundColor: Resource.colors.greenComplete,
    borderRadius: 2
  },
  progressArea: {
    backgroundColor: Resource.colors.greyProgress,
    width: width - 80,
    height: 7,
    borderRadius: 2
  },
  slider: {
    borderRadius: 2,
    backgroundColor: Resource.colors.greenColorApp
  }
});
