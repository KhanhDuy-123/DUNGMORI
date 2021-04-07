import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import NavigationService from 'common/services/NavigationService';
import CourseConst from 'consts/CourseConst';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default class ButtonAdditionalCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.animatedAddition = new Animated.Value(0);
  }

  onAnimatedAddition = (direction) => {
    Animated.timing(this.animatedAddition, {
      toValue: direction == 'up' ? 0 : 1,
      duration: 400
    }).start();
  };

  onPressNavigateToChooseLesson = () => {
    const { courseName } = this.props;
    let courseId = CourseConst.N2_ADDITIONAL?.ID;
    if (courseName === 'N3') courseId = CourseConst.N4_ADDITIONAL.ID;
    else if (courseName === 'N2') courseId = CourseConst.N3_ADDITIONAL.ID;
    const params = {
      course_id: courseId
    };
    NavigationService.navigate(ScreenNames.ChooseLessionScreen, { params });
  };

  render() {
    const scaleX = this.animatedAddition.interpolate({
      inputRange: [0, 1],
      outputRange: [160, 50]
    });
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPressNavigateToChooseLesson}>
        <Animated.View style={[styles.wrapperButton, { width: scaleX }]}>
          <View style={{ marginLeft: 20 }}>
            <BaseText numberOfLines={1} style={styles.text}>
              {Lang.ChooseLessonNew.text_addition}
            </BaseText>
            <BaseText numberOfLines={1} style={styles.text}>
              {Lang.ChooseLessonNew.text_knowledge}
            </BaseText>
          </View>
          <View style={styles.wrapperImage}>
            <Image source={Images.icAddition} style={styles.icAddition} />
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  wrapperButton: {
    width: 50,
    height: 50,
    backgroundColor: 'orange',
    borderRadius: 100,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  icAddition: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
    position: 'absolute',
    right: 10,
    backfaceVisibility: 'hidden'
  },
  wrapperImage: {
    position: 'absolute',
    right: 0,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    borderRadius: 100
  },
  text: {
    color: 'white',
    fontWeight: '600'
  }
});
