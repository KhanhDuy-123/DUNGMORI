import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Theme from 'assets/Theme';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import CourseConst from 'consts/CourseConst';
import ScreenNames from 'consts/ScreenName';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { Animated, Easing, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import HomeActionCreator from 'states/redux/actionCreators/HomeActionCreator';
import CourseActionCreator from 'states/redux/actionCreators/CourseActionCreator';

const Courses = (props) => {
  let { item, onPress, iconStyle, wrapperContainer } = props;
  let icon = '';
  let text = item.name;
  let textLock = Lang.homeScreen.text_lock;
  icon = Images[`img${item.name}`];
  text = textLock + ' ' + item.name;
  if (item.id == CourseConst.SPECIAL.ID) {
    icon = Images.icFlashcard;
    text = item.name;
  } else if (item.id == CourseConst.KAIWA.ID) {
    icon = Images.icKaiwaNormal;
    text = item.name;
  } else if (item.id == CourseConst.KAIWA_SOCAP.ID) {
    icon = Images.icKaiwaSoCap;
    text = item.name;
  } else if (item.id == CourseConst.KAIWA_TRUNGCAP.ID) {
    icon = Images.icKaiwaTrungCap;
    text = item.name;
  } else if (item.id == CourseConst.EJU_TOAN.ID) {
    icon = Images.ejuMath;
    text = item.name;
  } else if (item.id == CourseConst.EJU_TN.ID) {
    icon = Images.ejuJapan;
    text = item.name;
  } else if (item.id == CourseConst.EJU_XHTH.ID) {
    icon = Images.ejuSocial;
    text = item.name;
  } else if (item.id == CourseConst.N4_PRACTICE.ID) {
    icon = Images.icon.icPracticeN4;
    text = item.name;
    iconStyle = { width: 25 * Dimension.scaleWidth, height: 25 * Dimension.scaleWidth };
  }
  return (
    <TouchableOpacity style={styles.viewCourse} onPress={onPress(item)}>
      <View style={[styles.iconCourse, styles.wrapperIcon, wrapperContainer]}>
        <FastImage source={icon} style={[styles.iconStyle, iconStyle]} resizeMode={FastImage.resizeMode.contain} />
        <Label item={item} />
      </View>
      {text !== '' && <BaseText style={styles.nameStyle}>{text}</BaseText>}
    </TouchableOpacity>
  );
};

const Label = (props) => {
  let { item } = props;
  let text = '';
  if (item.price == 0 || item.name?.toUpperCase() == 'N5') {
    text = Lang.homeScreen.text_free;
  } else if (item.owned == 1) {
    text = Lang.homeScreen.text_bought;
  }
  let backgroundColor = 'red';
  if (item.price == 0) backgroundColor = '#F2994A';
  if (!(item.owned == 1 || item.price == 0)) return <View />;
  return (
    <View style={[styles.viewBadge, { backgroundColor }]}>
      <BaseText style={styles.textBadge}>{text}</BaseText>
    </View>
  );
};
class LayoutCourses extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.translateAnimated = new Animated.Value(0);
  }

  async componentDidMount() {
    await Funcs.delay(200);
    if (this.props.delay) await Funcs.delay(this.props.delay);
    Animated.timing(this.translateAnimated, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1))
    }).start();
  }

  onPressDetailLesson = (item) => () => {
    if (item.id == CourseConst.N4_PRACTICE.ID) {
      CourseActionCreator.getListCourse(item.id);
      NavigationService.navigate(ScreenNames.DetailIntensiveTopic, item);
      return;
    }
    if (item.price == 0 || item.owned) {
      const timeBuy = moment(item.course_buy_day).valueOf();
      const timeDefault = moment(Const.MIN_TIME_SHOW_ADDITION_COURSE, 'YYYY-MM-DD').valueOf();
      let params = { ...item, showAddition: timeBuy >= timeDefault && item.owned };
      params.course_id = item.id;
      if (params.premium === 1) {
        NavigationService.navigate(ScreenNames.CourseProgressScreen, { params, updateData: this.onUpdateData });
      } else {
        NavigationService.navigate(ScreenNames.ChooseLessionScreen, { params, updateData: this.onUpdateData });
      }
    } else {
      let type = Const.COURSE_TYPE.JLPT;
      if (item.id == 21 || item.id == 25 || item.id == 26) {
        type = Const.COURSE_TYPE.KAIWA;
      } else if (item.id == 8 || item.id == 9 || item.id == 10) {
        type = Const.COURSE_TYPE.EJU;
      }
      if (item.premium === 1) {
        NavigationService.navigate(ScreenNames.DetailCourseNewScreen, { item, type, updateData: this.onUpdateData });
      } else {
        NavigationService.navigate(ScreenNames.DetailCourseScreen, { item, type, updateData: this.onUpdateData });
      }
    }
  };
  onUpdateData = () => {
    HomeActionCreator.getHomeLesson();
  };

  render() {
    const { title, colors, style, data, height, iconStyle, wrapperContainer } = this.props;
    let scale = this.translateAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
    let opacity = this.translateAnimated.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [0, 0, 1]
    });
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.wrapper, style, { opacity, transform: [{ scale }] }, height ? { height } : {}]}>
          <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={colors} style={styles.headerStyle}>
            <Image source={Theme.get(this.props.image1)} style={[styles.logo, { left: 0 }, this.props.logo1]} resizeMode={FastImage.resizeMode.contain} />
            <BaseText style={styles.textHeader}>{title}</BaseText>
            <Image source={Theme.get(this.props.image2)} style={[styles.logo, { right: 0 }, this.props.logo2]} resizeMode={FastImage.resizeMode.contain} />
          </LinearGradient>
          <View style={styles.viewMap}>
            {data &&
              data.map((item, index) => {
                return <Courses key={index} item={item} onPress={this.onPressDetailLesson} wrapperContainer={wrapperContainer} iconStyle={iconStyle} />;
              })}
          </View>
        </Animated.View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerStyle: {
    width: '100%',
    height: 38 * Dimension.scale,
    borderTopLeftRadius: 15 * Dimension.scale,
    borderTopRightRadius: 15 * Dimension.scale,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  logo: {
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0
  },
  wrapper: {
    width: Dimension.widthParent - 20 * Dimension.scaleWidth,
    marginTop: 20 * Dimension.scaleWidth,
    backgroundColor: Colors.white100,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 15 * Dimension.scale,
    shadowColor: '#000',
    shadowOffset: { x: 3, y: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3
  },
  iconCourse: {
    backgroundColor: Colors.white100,
    borderWidth: 0.5,
    borderColor: '#DDD',
    borderRadius: 15 * Dimension.scale,
    shadowColor: '#000',
    shadowOffset: { x: 3, y: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12 * Dimension.scale,
    color: Colors.white100,
    fontWeight: '600'
  },
  viewCourse: {
    alignItems: 'center'
  },
  nameStyle: {
    fontSize: 8 * Dimension.scale,
    fontWeight: '500',
    paddingTop: 7,
    textAlign: 'center'
  },
  viewMap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingBottom: 25 * Dimension.scale
  },
  wrapperIcon: {
    width: 45 * Dimension.scaleWidth,
    height: 45 * Dimension.scaleWidth,
    marginHorizontal: 10 * Dimension.scaleWidth,
    marginTop: 25 * Dimension.scale
  },
  iconStyle: {
    width: 40 * Dimension.scaleWidth,
    height: 40 * Dimension.scaleWidth
  },
  viewBadge: {
    paddingHorizontal: 5 * Dimension.scaleWidth,
    borderRadius: 7 * Dimension.scaleWidth,
    fontWeight: '500',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -6,
    left: (55 * Dimension.scaleWidth) / 2,
    zIndex: 1000
  },
  textBadge: {
    fontSize: 5 * Dimension.scaleWidth,
    color: Colors.white100,
    paddingVertical: 2
  }
});
export default LayoutCourses;
