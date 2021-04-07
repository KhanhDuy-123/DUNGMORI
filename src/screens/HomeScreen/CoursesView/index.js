import Lang from 'assets/Lang';
import Theme from 'assets/Theme';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { connect } from 'react-redux';
import LayoutCourses from './LayoutCourses';
import LinearGradient from 'react-native-linear-gradient';
import BaseText from 'common/components/base/BaseText';
import Colors from 'assets/Colors';
import FastImage from 'react-native-fast-image';
import Images from 'assets/Images';
import CourseConst from 'consts/CourseConst';
import NavigationService from 'common/services/NavigationService';
import ScreenNames from 'consts/ScreenName';
import Const from 'consts/Const';
import HomeActionCreator from 'states/redux/actionCreators/HomeActionCreator';

const Courses = (props) => {
  let { item, onPress } = props;
  let icon = '';
  let text = item.name;
  let textLock = Lang.homeScreen.text_lock;
  icon = Images[`img${item.name}`];
  text = textLock + ' ' + item.name;
  if (item.id == CourseConst.SPECIAL.ID) {
    icon = Images.icFlashcard;
    text = item.name;
  }
  return (
    <TouchableOpacity onPress={onPress(item)}>
      <View style={[styles.iconCourse, styles.wrapperIcon]}>
        <FastImage source={icon} style={styles.iconStyle} resizeMode={FastImage.resizeMode.contain} />
        <Label />
      </View>
      <BaseText style={styles.nameStyle}>{text}</BaseText>
    </TouchableOpacity>
  );
};

const Label = () => {
  let text = Lang.homeScreen.text_free;
  let backgroundColor = '#F2994A';
  return (
    <View style={[styles.viewBadge, { backgroundColor }]}>
      <BaseText style={styles.textBadge}>{text}</BaseText>
    </View>
  );
};
class CoursesView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.layoutAnimated = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this.layoutAnimated, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1))
    }).start();
  }

  onLayout = ({ nativeEvent }) => {
    this.props.onSetHeightScreenTab(nativeEvent.layout.height, 0);
  };

  onPressDetailLesson = (item) => () => {
    if (item.price == 0) {
      let params = { ...item };
      params.course_id = item.id;
      if (params.premium === 1) {
        NavigationService.navigate(ScreenNames.CourseProgressScreen, { params, updateData: this.onUpdateData });
      } else {
        NavigationService.navigate(ScreenNames.ChooseLessionScreen, { params, updateData: this.onUpdateData });
      }
    } else {
      let type = Const.COURSE_TYPE.JLPT;
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
    const { listCourse, listEju, listKaiwa } = this.props;
    let scale = this.layoutAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });
    let opacity = this.layoutAnimated.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [0, 0, 1]
    });
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <Animated.View style={[styles.viewContainer, { opacity, transform: [{ scale }] }]}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 0.8, y: 1.0 }}
            locations={[0, 0.6, 1]}
            colors={['#9BF4A4', '#84C4FF', '#BCA5FF']}
            style={styles.linearGradient}>
            <View style={styles.viewText}>
              <BaseText style={styles.title}>{Lang.profile.text_course.toUpperCase()}</BaseText>
              <BaseText style={{ ...styles.title, fontWeight: 'bold', fontSize: 17 }}>{Lang.saleLesson.text_Free}</BaseText>
            </View>
          </LinearGradient>
          <View style={styles.viewWrapper}>
            {listCourse &&
              listCourse.map((item, index) => {
                if (item.price == 0 && item.id !== 30) {
                  return <Courses key={index} item={item} onPress={this.onPressDetailLesson} />;
                }
              })}
          </View>
        </Animated.View>
        <LayoutCourses
          delay={200}
          colors={Theme.get('colors1')}
          image1={'ic_left_1'}
          image2={'ic_right_1'}
          title={Lang.saleLesson.text_header_JLPT}
          data={listCourse && listCourse.filter((item) => item.id === 30 || item.price !== 0)}
          height={230 * Dimension.scaleWidth}
        />
        <LayoutCourses
          delay={400}
          colors={Theme.get('colors2')}
          iconStyle={styles.iconStyle1}
          wrapperContainer={styles.wrapperContainer}
          image1={'ic_left_2'}
          image2={'ic_right_2'}
          title={Lang.saleLesson.text_header_KAIWA}
          data={listKaiwa}
          height={150 * Dimension.scaleWidth}
        />
        <LayoutCourses
          delay={600}
          style={[styles.viewCourse]}
          iconStyle={styles.iconStyle1}
          wrapperContainer={styles.wrapperContainer}
          colors={Theme.get('colors3')}
          image1={'ic_left_3'}
          image2={'ic_right_3'}
          title={Lang.saleLesson.text_header_EJU}
          data={listEju}
          height={150 * Dimension.scaleWidth}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'white'
  },
  viewCourse: {
    marginBottom: 40 * Dimension.scale
  },
  viewContainer: {
    width: Dimension.widthParent - 20 * Dimension.scaleWidth,
    height: 85 * Dimension.scale,
    marginHorizontal: 10 * Dimension.scaleWidth,
    flexDirection: 'row',
    alignItems: 'center',
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
  linearGradient: {
    width: 125 * Dimension.scale,
    height: '100%',
    borderRadius: 15 * Dimension.scale,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewText: {
    width: '75%',
    height: '60%',
    borderWidth: 2,
    borderColor: Colors.white100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: Colors.white100,
    fontWeight: '500'
  },
  viewWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapperIcon: {
    width: 45 * Dimension.scaleWidth,
    height: 45 * Dimension.scaleWidth,
    marginHorizontal: 12 * Dimension.scaleWidth,
    marginTop: 5 * Dimension.scaleWidth
  },
  wrapperContainer: {
    marginHorizontal: 20 * Dimension.scaleWidth
  },
  iconCourse: {
    backgroundColor: Colors.white100,
    borderWidth: 0.5,
    borderColor: '#DDD',
    borderRadius: 15 * Dimension.scale,
    shadowColor: '#000',
    shadowOffset: { x: 1, y: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconStyle: {
    width: 40 * Dimension.scaleWidth,
    height: 40 * Dimension.scaleWidth
  },
  iconStyle1: {
    width: 30 * Dimension.scaleWidth,
    height: 30 * Dimension.scaleWidth
  },
  nameStyle: {
    fontSize: 8 * Dimension.scale,
    fontWeight: '500',
    paddingTop: 7,
    textAlign: 'center'
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
const mapStateToProps = (state) => ({
  listCourse: state.courseReducer.listCourse,
  listEju: state.courseReducer.listEju,
  listKaiwa: state.courseReducer.listKaiwa
});
export default connect(mapStateToProps)(CoursesView);
