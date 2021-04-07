import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

export default class CourseInfoView extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      statusData: {}
    };
  }

  renderExperiod = () => {
    const { course } = this.props;
    return (
      <View style={styles.infoExpired}>
        <View style={styles.viewExpired}>
          <BaseText style={styles.textExpired}>{Lang.saleLesson.text_course_duration}</BaseText>
          <View style={styles.viewExpiredDay}>
            {course?.price === 0 ? (
              <BaseText style={styles.textValue}>{Lang.saleLesson.text_course_free}</BaseText>
            ) : (
              <BaseText style={styles.textValueExpired}>
                {course?.watch_expired} {Lang.saleLesson.text_day}
                <BaseText style={styles.textValue}> {Lang.saleLesson.text_active_day}</BaseText>{' '}
              </BaseText>
            )}
          </View>
        </View>
        <View style={styles.viewExpired}>
          <BaseText style={styles.textExpired}>{Lang.saleLesson.text_lecturers}</BaseText>
          <BaseText style={styles.textTeacher}>{course?.teacher}</BaseText>
        </View>
      </View>
    );
  };

  render() {
    const { course } = this.props;
    const price = course?.price ? Funcs.convertPrice(course.price) : 0;
    let jpy = course?.jpy_price ? Funcs.formatNumber(course.jpy_price) : 0;
    let bg = Images.buyCourse;
    if (course?.type === Const.COURSE_TYPE.EJU) bg = Images.bgEju;
    if (course?.name == 'N5') jpy = 0;
    return (
      <View style={styles.container}>
        <View style={styles.containerLeft}>
          <FastImage source={bg} style={styles.imgBanner} />
          <View style={styles.parentBox}>
            <View style={styles.boxInfo}>
              <View style={styles.info}>
                <BaseText style={styles.titleInfo}>{Lang.learn.text_videos}</BaseText>
                <BaseText style={styles.titleValue}>{course?.stats_data ? course.stats_data?.video : 0}</BaseText>
              </View>
              <View style={styles.boderInfo} />
              <View style={styles.info}>
                <BaseText style={styles.titleInfo}>{Lang.learn.text_lesson}</BaseText>
                <BaseText style={styles.titleValue}>{course?.stats_data ? course.stats_data?.lesson : 0}</BaseText>
              </View>
              <View style={styles.boderInfo} />
              <View style={styles.info}>
                <BaseText style={styles.titleInfo}>{Lang.learn.text_price}</BaseText>
                <BaseText style={styles.titleValue}>{price}</BaseText>
                <BaseText style={styles.titleValue}>{`${jpy}¥`}</BaseText>
              </View>
            </View>
            {this.renderExperiod()}
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { height: 400, flexDirection: 'row', marginBottom: 20 },
  containerLeft: { flex: 1 },
  imgBanner: { width: Dimension.widthParent, height: 250, position: 'absolute' },
  boxInfo: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
    // alignItems: 'center'
  },
  info: {
    width: Dimension.widthParent / 3 - 20
  },
  boderInfo: {
    height: 22 * Dimension.scale,
    width: 1,
    backgroundColor: Colors.border
  },
  titleInfo: {
    fontSize: 12 * Dimension.scale,
    textAlign: 'center',
    color: Colors.black3
  },
  titleValue: {
    fontSize: 12 * Dimension.scale,
    marginTop: 5,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.greenColorApp
  },
  parentBox: {
    width: Dimension.widthParent - 30,
    borderRadius: 5,
    paddingBottom: 10,
    marginRight: 20,
    borderWidth: 1,
    borderColor: Colors.borderWidth,
    backgroundColor: Colors.white100,
    shadowColor: Colors.grey600,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center'
  },
  infoExpired: {
    marginTop: 5,
    paddingHorizontal: 20
  },
  viewExpired: {
    // flex: 1,
    flexDirection: 'row',
    marginBottom: 10
  },
  viewExpiredDay: {
    flex: 1,
    flexDirection: 'row'
  },
  textExpired: {
    flex: 1,
    fontSize: 11 * Dimension.scale,
    color: Colors.black3,
    marginRight: 5
  },
  textTeacher: {
    flex: 1,
    fontSize: 11 * Dimension.scale,
    lineHeight: 18 * Dimension.scale,
    color: Colors.black1
  },
  textValue: {
    fontSize: 11 * Dimension.scale,
    marginRight: 5,
    fontWeight: '400',
    color: Colors.black1
  },
  textValueExpired: {
    fontSize: 11 * Dimension.scale,
    marginRight: 5,
    fontWeight: '500',
    color: Colors.black1
  }
});
