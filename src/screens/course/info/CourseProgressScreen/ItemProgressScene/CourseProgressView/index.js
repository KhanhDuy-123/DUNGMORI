import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import ProgressBar from 'common/components/base/ProgressBar';
import TextPercentProgress from 'common/components/base/TextPercentProgress';
import Dimension from 'common/helpers/Dimension';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CircleProgress from './CircleProgress';
import { connect } from 'react-redux';

class CourseProgressView extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.totalProgress !== this.props.totalProgress || nextProps.categories !== this.props.categories;
  }

  renderRightContent = (item, index) => {
    let percent = Math.round((item.example_progress + item.video_progress) / 2);
    return (
      <View style={styles.wrapperProgressBar} key={item.id}>
        <View style={styles.wrapperHeader}>
          <View style={{ width: '85%' }}>
            <BaseText style={styles.textProgress}>{`${item.title}`}</BaseText>
          </View>
          <TextPercentProgress percent={percent} textStyle={[styles.textProgress, { color: Colors.greenColorApp }]} />
        </View>
        <ProgressBar containerStyles={styles.progressArea} percent={percent} sliderBar={styles.sliderBar} />
      </View>
    );
  };

  render() {
    const { categories, courseName, index, totalProgress, stages } = this.props;
    let category = categories;
    if (!index) category = categories.slice(1, categories.length);
    return (
      <View style={styles.container}>
        <View style={styles.containerLeft}>
          <BaseText style={{ ...styles.textTitleProgress, marginBottom: 5 }}>{`${Lang.course_info.text_process} ${courseName}`}</BaseText>
          <CircleProgress percent={totalProgress} />
        </View>
        <View style={styles.containerRight}>
          <BaseText style={styles.textStep}> {stages?.length === 1 ? '' : `CHẶNG ${index + 1}`}</BaseText>
          {category.map(this.renderRightContent)}
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  stages: state.courseReducer.stages
});

export default connect(mapStateToProps)(CourseProgressView);
const styles = StyleSheet.create({
  container: {
    minHeight: 155 * Dimension.scale,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    marginTop: 10
  },
  containerLeft: {
    width: '40%',
    marginRight: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    backgroundColor: '#FFFFFF',
    elevation: 5
  },
  containerRight: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    shadowRadius: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    paddingVertical: 10
  },
  textTitleProgress: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.greenColorApp,
    letterSpacing: -0.5
  },
  progressArea: {
    width: '80%',
    height: 3 * Dimension.scaleWidth,
    backgroundColor: '#B5B5B5',
    borderRadius: 5
  },
  sliderBar: {
    borderRadius: 5
  },
  textProgress: {
    fontSize: 9 * Dimension.scale
  },
  wrapperHeader: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
    alignItems: 'flex-end'
  },
  wrapperProgressBar: {
    width: '100%',
    marginBottom: 5,
    alignItems: 'center'
  },
  textStep: {
    color: Colors.greenColorApp,
    fontWeight: '600'
  }
});
