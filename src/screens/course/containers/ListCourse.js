import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Animated, Easing, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScreenNames from 'consts/ScreenName';
import Const from 'consts/Const';

const width = Dimension.widthParent;
const itemWidth = 90 * Dimension.scale;
export default class ListCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: []
    };
    this.moveJLPT = new Animated.Value(-width);
    this.moveEJU = new Animated.Value(-width);
    this.moveKAIWA = new Animated.Value(-width);
  }

  onMoveView = (animated) => {
    return Animated.timing(animated, {
      toValue: 0,
      duration: 1200,
      easing: Easing.elastic(1.0),
      useNativeDriver: true
    });
  };

  onPressNavigateListCourse = (type) => () => {
    let params = [];
    const { course } = this.state;
    if (type == Const.COURSE_TYPE.JLPT) {
      params = course[0];
    } else if (type == Const.COURSE_TYPE.EJU) {
      params = course[1];
    } else {
      params = course[2];
    }
    NavigationService.navigate(ScreenNames.BuyCourseScreen, { params });
  };

  render() {
    const { course } = this.state;
    return (
      <View style={styles.container}>
        <BaseText style={styles.textCategory}>{Lang.learn.text_course_dung_mori}</BaseText>
        <View>
          {course[0] && course[0].combo ? (
            <Animated.View style={[styles.parentContent, { transform: [{ translateX: this.moveJLPT }] }]}>
              <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={this.onPressNavigateListCourse(Const.COURSE_TYPE.JLPT)}>
                <FastImage source={Resource.images.icJLPT} style={styles.icon} />
                <View style={styles.viewTitle}>
                  <BaseText style={styles.textTitle}>{Lang.learn.text_jlpt}</BaseText>
                  <BaseText style={styles.textContent}>{Lang.learn.text_content_jlpt}</BaseText>
                </View>
                <View style={styles.arrowButton}>
                  <AntDesign name="arrowright" size={18} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : null}
          {course[1] && course[1].combo ? (
            <Animated.View style={[styles.parentContent, { transform: [{ translateX: this.moveEJU }] }]}>
              <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={this.onPressNavigateListCourse(Const.COURSE_TYPE.EJU)}>
                <FastImage source={Resource.images.icEJU} style={styles.icon} />
                <View style={styles.viewTitle}>
                  <BaseText style={styles.textTitle}>{Lang.learn.text_eju}</BaseText>
                  <BaseText style={styles.textContent}>{Lang.learn.text_content_eju}</BaseText>
                </View>
                <View style={styles.arrowButton}>
                  <AntDesign name="arrowright" size={18} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : null}
          {course[2] && course[2].combo ? (
            <Animated.View style={[styles.parentContent, { transform: [{ translateX: this.moveKAIWA }] }]}>
              <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={this.onPressNavigateListCourse(Const.COURSE_TYPE.KAIWA)}>
                <FastImage source={Resource.images.icKAIWA} style={styles.icon} />
                <View style={styles.viewTitle}>
                  <BaseText style={styles.textTitle}>{Lang.learn.text_kaiwa}</BaseText>
                  <BaseText style={styles.textContent}>{Lang.learn.text_content_kaiwa}</BaseText>
                </View>
                <View style={styles.arrowButton}>
                  <AntDesign name="arrowright" size={18} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resource.colors.white100
  },
  textCategory: {
    fontSize: 16 * Dimension.scale,
    marginLeft: 20,
    fontWeight: '500',
    marginTop: 15,
    color: Resource.colors.black1,
    marginBottom: 20
  },
  content: {
    width: width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 9 * Dimension.scale,
    marginTop: 15
  },
  wrapper: {
    width: itemWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingRight: 5,
    margin: 5
  },
  viewColor: {
    width: '50%',
    aspectRatio: 1 / 1,
    borderRadius: 100,
    backgroundColor: '#7ADFBF'
  },
  imageStyle: {
    width: '80%',
    aspectRatio: 1 / 1,
    position: 'absolute',
    top: 3,
    right: -7
  },
  contentText: {
    paddingTop: 5,
    alignItems: 'center',
    height: 45
  },
  nameStyle: {
    paddingTop: 2,
    fontSize: 12 * Dimension.scale,
    fontWeight: '500'
  },
  nameStyleCourse: {
    paddingTop: 5,
    fontSize: 12 * Dimension.scale,
    fontWeight: '500',
    marginHorizontal: 10,
    textAlign: 'center'
  },
  nameStyleCombo: {
    fontSize: 9 * Dimension.scale,
    fontWeight: '500'
  },
  swiper: {
    height: (itemWidth + 20) * 2
  },
  parentContent: {
    width: '88%',
    height: 65 * Dimension.scale,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginBottom: 18,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: 'grey',
    marginVertical: 10,
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 4 : 8
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingLeft: 15
  },
  arrowButton: {
    width: 30 * Dimension.scale,
    height: 30 * Dimension.scale,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    right: 10 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 4 : 8,
    elevation: Platform.OS === 'ios' ? 0.3 : 5,
    borderRadius: 20
  },
  icon: {
    width: 38 * Dimension.scale,
    height: 43 * Dimension.scale,
    marginRight: 15
  },
  viewTitle: {
    flex: 1
  },
  textTitle: {
    width: '80%',
    fontSize: 18 * Dimension.scale,
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
    marginBottom: 3 * Dimension.scale,
    fontStyle: 'italic'
  },
  textContent: {
    fontSize: 8 * Dimension.scale
  }
});
