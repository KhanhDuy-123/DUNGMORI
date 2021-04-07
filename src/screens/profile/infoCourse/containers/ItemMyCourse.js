import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Time from 'common/helpers/Time';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const width = Dimension.widthParent;
const fontSize = 10 * Dimension.scale;
const fontSizeTextName = 11 * Dimension.scale;
const heightViewInfor = 63 * Dimension.scale;
const heightImage = 58 * Dimension.scale;
export default class ItemMyCourse extends PureComponent {
  onPressDetailChooseLession = () => {
    const { item } = this.props;
    const timeBuy = moment(item.course_buy_day).valueOf();
    const timeDefault = moment(Const.MIN_TIME_SHOW_ADDITION_COURSE, 'YYYY-MM-DD').valueOf();
    let params = {
      ...item,
      owned: true,
      name: item.title.charAt(0).toUpperCase() + item.title.slice(1),
      showAddition: timeBuy >= timeDefault
    };
    if (params.premium === 1) {
      NavigationService.navigate(ScreenNames.CourseProgressScreen, { params });
    } else {
      NavigationService.navigate(ScreenNames.ChooseLessionScreen, { params });
    }
  };

  render() {
    const { item } = this.props;
    let dayFomat = Time.format(item.watch_expired_day, 'DD-MM-YYYY');
    let currentTime = Time.timeStamp(new Date());
    let expiredTime = Time.timeStamp(item.watch_expired_day);
    let courseFree = item.price === 0;
    const icon = Images.getIconBuyCourse(item.course_id);
    return (
      <View style={styles.containers}>
        <View style={styles.containerInfor}>
          <View style={styles.viewInforCourse}>
            <View style={styles.emptyView} />
            <FastImage resizeMode={FastImage.resizeMode.stretch} source={icon} style={styles.imgCourse} />
            <View style={styles.inforViewCourse}>
              <View style={styles.showInforCourse}>
                <BaseText style={styles.textNameCourse}>
                  {Lang.profile.text_course} <BaseText style={styles.textTitle}>{item.title}</BaseText>
                </BaseText>
                <View style={styles.courseView}>
                  <BaseText style={styles.titlePrice}>
                    {Lang.profile.text_duration}
                    {':'}
                  </BaseText>
                  <BaseText style={styles.textPrice}>{courseFree ? Lang.profile.text_course_free : dayFomat}</BaseText>
                </View>
              </View>
              {currentTime < expiredTime || courseFree ? (
                <TouchableOpacity onPress={this.onPressDetailChooseLession} style={styles.buttonLearn}>
                  <BaseText style={styles.textButton}>{Lang.profile.button_learn_now}</BaseText>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity disabled={true} style={styles.buttonLearns}>
                  <BaseText style={styles.textButton}>{Lang.profile.button_expired}</BaseText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containers: {
    flex: 1,
    paddingHorizontal: 20 * Dimension.scale,
    marginBottom: 10
  },
  imgCourse: {
    width: heightImage,
    aspectRatio: 1 / 1,
    borderRadius: 7 * Dimension.scale,
    position: 'absolute',
    top: -17 * Dimension.scale,
    left: -17 * Dimension.scale,
    borderWidth: 0.5,
    borderColor: Resource.colors.border
  },
  containerInfor: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 10 * Dimension.scale
  },
  viewInforCourse: {
    flex: 1,
    width: width - 55 * Dimension.scale,
    height: heightViewInfor,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Resource.colors.borderWidth,
    backgroundColor: Resource.colors.white100,
    flexDirection: 'row',
    marginTop: 10 * Dimension.scale,
    paddingVertical: 12,
    shadowColor: Resource.colors.grey600,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 6 : 4,
    elevation: Platform.OS === 'ios' ? 0.3 : 4,
    marginVertical: 5
  },
  emptyView: {
    width: 50 * Dimension.scale
  },
  inforViewCourse: {
    flex: 1,
    marginLeft: 5,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  showInforCourse: {
    width: '60%',
    justifyContent: 'center'
  },
  textNameCourse: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '500',
    color: Resource.colors.black1,
    marginRight: 5
  },
  textTitle: {
    flex: 1,
    fontSize: 13 * Dimension.scale,
    fontWeight: '500',
    paddingLeft: 5,
    color: Resource.colors.black1
  },
  courseView: {
    flexDirection: 'row',
    marginTop: 5,
    width: '100%'
  },
  titlePrice: {
    fontSize: fontSize,
    marginRight: 5,
    color: Resource.colors.black1
  },
  textPrice: {
    color: Resource.colors.greenColorApp,
    fontSize: fontSize
  },
  buttonLearn: {
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  buttonLearns: {
    backgroundColor: Resource.colors.inactiveButton,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  textButton: {
    textAlign: 'center',
    color: Resource.colors.white100,
    fontSize: fontSizeTextName,
    fontWeight: '600'
  }
});
