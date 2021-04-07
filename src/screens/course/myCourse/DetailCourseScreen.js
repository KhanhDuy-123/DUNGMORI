import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import EventService from 'common/services/EventService';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import InputComment from 'screens/components/comment/InputComment';
import ListComment from 'screens/components/comment/ListComment';
import DetailedCourseInfo from 'screens/components/course/DetailedCourseInfo';
import ChooseLesson from 'screens/components/lession/ChooseLesson';
import CourseActionCreator from 'states/redux/actionCreators/CourseActionCreator';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';
import { onResetCourse } from 'states/redux/actions/CourseAction';
import { onChangeSpeedPlayVideo } from 'states/redux/actions/SpeedVideoAction';
import Utils from 'utils/Utils';
import ListLessonHorizon from '../containers/ListLessonHorizon';

const width = Dimension.widthParent;
const itemWidth = width - 40;
var courseId = '';

let dataSwiper = [
  { id: 1, resourse: Resource.images.bannerKaiwa1 },
  { id: 2, resourse: Resource.images.bannerKaiwa2 },
  { id: 3, resourse: Resource.images.bannerKaiwa3 },
  { id: 4, resourse: Resource.images.bannerKaiwa4 }
];

class DetailCourseScreen extends Component {
  scrollY = new Animated.Value(0);
  constructor(props) {
    super(props);

    let { data, item, typeNotify } = props.navigation.state.params;
    this.dataNotify = {};
    let dataPass = { ...item };
    if (typeNotify) {
      courseId = item.table_id;
    } else {
      courseId = item ? item.id : data.services.courses[0];
    }

    try {
      if (typeNotify && item) {
        this.dataNotify = dataPass;
        this.dataNotify.dataNoti = JSON.parse(dataPass.dataNoti);
      }
    } catch (error) {
      Funcs.log(error);
    }

    this.typeNotify = typeNotify;
    this.heightHeaderContent = 0;
    this.heightComent = 0;
    this.isStillTime = false;
    this.params = NavigationService.getParams();
  }

  componentDidMount() {
    CourseActionCreator.getListCourse(courseId);
    LessonActionCreator.getListLesson(courseId);
    EventService.add(Const.EVENT.RECIEVE_NOTIFY, this.onRecieveNotifyListener);
  }

  componentWillUnmount() {
    clearTimeout(this.timeScrollComent);
    clearTimeout(this.timeScrollToList);
    this.props.onResetCourse();
    EventService.remove(Const.EVENT.RECIEVE_NOTIFY, this.onRecieveNotifyListener);
  }

  onRecieveNotifyListener = (item) => {
    if (item.table_name !== 'course') return;
    this.dataNotify = {};
    let dataPass = { ...item };
    try {
      if (item) {
        this.dataNotify = dataPass;
        this.dataNotify.dataNoti = JSON.parse(dataPass.data);
      }
    } catch (error) {
      Funcs.log(error);
    }

    this.typeNotify = true;
  };

  //navigation detail choose lesson
  onPressDetailChooseLesson = () => {
    const { course } = this.props;
    if (course.premium === 1) {
      NavigationService.navigate(ScreenNames.CourseProgressScreen, { course });
    } else {
      NavigationService.navigate(ScreenNames.ChooseLessionScreen, { course });
    }
  };

  //navigation detail buy course
  onPressDetailBuyCourse = () => {
    const { course } = this.props;
    let buyCourse = course;
    if (!Utils.user || !Utils.user.id) ModalLoginRequiment.show();
    else NavigationService.navigate(ScreenNames.DetailBuyCourseScreen, { buyCourse, type: 'buyCourse' });
  };

  onPressBack = () => {
    NavigationService.pop();
  };

  onPressBackground = () => {
    this.refs.InputComment.hideContent();
  };

  getHeaderBackgroundColor = () => {
    return this.scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: ['rgba(255,255,255,0.0)', 'white'],
      extrapolate: 'clamp',
      useNativeDriver: true
    });
  };

  getHeaderBorderColor = () => {
    return this.scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: ['rgba(255,255,255,0.0)', '#eee'],
      extrapolate: 'clamp',
      useNativeDriver: true
    });
  };

  onBlurInputComment = () => {};

  onFocusInputComment = () => {};

  getHeightComent = (event) => {
    this.heightComent = event.nativeEvent.layout.height;
  };

  onScrollToLesson = (activeSections) => {
    const contentHeight = this.heightComent + this.heightHeaderContent;
    const section = activeSections * 60;
    this.ScrollView.scrollTo({ y: Math.round(contentHeight) + section - 20, x: 0, animated: true });
  };

  onGetHeightContentHeader = (event) => {
    this.heightHeaderContent = event.nativeEvent.layout.height;
  };

  onScrollToComment = () => {
    if (this.typeNotify) {
      this.timeScrollComent = setTimeout(() => {
        this.ScrollView && this.ScrollView.scrollTo({ y: this.heightHeaderContent - 40, x: 0, animated: true });
      }, 800);
    }
  };

  onScrollToList = () => {
    const totalHeight = this.heightHeaderContent + this.heightComent;
    this.timeScrollToList = setTimeout(() => {
      this.ScrollView.scrollTo({ y: totalHeight - 40, x: 0, animated: true });
    }, 250);
  };

  onUpdateProgressLesson = async (videoProgress, examProgress, lessonId, lessonGroupId, selected) => {
    const data = {
      videoProgress: videoProgress,
      exampleProgress: examProgress,
      lessonId: lessonId,
      lessonGroupId,
      selected,
      courseId
    };
    LessonActionCreator.updateLesson(data);
    this.props.onChangeSpeedPlayVideo(Const.VIDEO_SPEED['1x']);
  };

  updateSpeedPlay = () => {
    this.props.onChangeSpeedPlayVideo(Const.VIDEO_SPEED['1x']);
  };

  onNavigateDetailLesson = (item) => {
    const { isStillTime, course } = this.props;
    let value = this.props.navigation.state.params.item;
    if (isStillTime) {
      NavigationService.navigate(ScreenNames.DetailLessonScreen, {
        item,
        updateProgressLesson: this.onUpdateProgressLesson,
        courseName: course.name,
        owned: value.owned
      });
    } else {
      NavigationService.push(ScreenNames.DetailLessonScreen, {
        item,
        courseName: course.name,
        owned: value.owned,
        updateSpeedPlay: this.updateSpeedPlay
      });
    }
  };

  onShowSelecSpecLesson = (section) => {
    if (!this.props.isStillTime) return null;
  };

  renderSwiper = () => {
    let bg = Images.buyCourse;
    let isKaiwa = this.params?.type === Const.COURSE_TYPE.KAIWA;
    if (this.params?.type === Const.COURSE_TYPE.EJU) bg = Images.bgEju;
    else if (isKaiwa) bg = Images.icKaiwaBanner;
    return <FastImage resizeMode={FastImage.resizeMode.contain} style={styles.imageThumb} source={bg} />;
  };

  renderContent = () => {
    const { course, lesson } = this.props;
    const { type, item } = this.props.navigation.state.params;
    let isKaiwa = this.params?.type === Const.COURSE_TYPE.KAIWA;
    return (
      <View style={styles.content} onLayout={this.onGetHeightContentHeader}>
        <View>
          {this.renderSwiper()}
          <View style={styles.boxInfo}>
            <DetailedCourseInfo params={course} isKaiwa={isKaiwa} />
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
          </View>
        </View>
        <View style={styles.lessons}>
          <BaseText style={{ ...styles.textCategory, marginLeft: 20 }}>{Lang.saleLesson.text_title_lesson}</BaseText>
          <View style={styles.listLessons}>
            <ListLessonHorizon isKaiwa={isKaiwa} type={type} dataList={lesson} owned={item.owned} course={course} updateSpeedPlay={this.updateSpeedPlay} />
          </View>
        </View>
        <View style={styles.viewButton}>
          {course?.price === 0 || course?.name == 'Chuyên Ngành' ? (
            <TouchableOpacity onPress={this.onPressDetailChooseLesson} style={[styles.buttonByCourse, { backgroundColor: isKaiwa ? '#ffb629' : '#d6902e' }]}>
              <BaseText style={styles.titleButton}>{Lang.saleLesson.button_learn_now}</BaseText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={this.onPressDetailBuyCourse} style={[styles.buttonByCourse, { backgroundColor: isKaiwa ? '#ffb629' : '#d6902e' }]}>
              <BaseText style={styles.titleButton}>{Lang.saleLesson.button_buy_course}</BaseText>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 15 }} onPress={this.onScrollToList}>
          <BaseText style={[styles.textViewMore, { color: isKaiwa ? '#ffb629' : '#d6902e' }]}>{Lang.saleLesson.text_seemore_course}</BaseText>
        </TouchableOpacity>
      </View>
    );
  };

  renderLesson = () => {
    const { isStillTime, listLesson, listSpecLesson } = this.props;
    const { type, item } = this.props.navigation.state.params;
    return (
      <View style={styles.courseProgress}>
        <BaseText style={styles.titlecourseProgress}>{Lang.saleLesson.text_course_progress}</BaseText>
        <ChooseLesson
          courseName={item?.name}
          data={listLesson}
          typeRead={type}
          onScrollToCotent={this.onScrollToLesson}
          onNavigateDetailLesson={this.onNavigateDetailLesson}
          isStillExpired={isStillTime}
        />
        {listSpecLesson?.length > 0 && (
          <View style={styles.specArea}>
            <View style={styles.header}>
              <BaseText style={styles.textSpec}>{Lang.chooseLession.text_spec.toUpperCase()}</BaseText>
            </View>
            <ChooseLesson
              data={listSpecLesson}
              courseId={4}
              onNavigateDetailLesson={this.onNavigateDetailLesson}
              typeRead={type}
              isStillExpired={isStillTime}
              headerStyles={styles.headerStyles}
              parentHeaderStyle={styles.parentHeaderStyle}
              onShowSelecSpecLesson={this.onShowSelecSpecLesson}
            />
          </View>
        )}
      </View>
    );
  };

  render() {
    const { item } = this.props.navigation.state.params;
    const headerBackgroundColor = this.getHeaderBackgroundColor();
    const heardBorderColor = this.getHeaderBorderColor();
    let course = '';
    if (this.typeNotify) {
      course = this.dataNotify.dataNoti.courseName;
    } else if (item.course_name || item.courseName) {
      course = item.course_name ? item.course_name : item.courseName;
    } else {
      course = item?.name;
    }
    return (
      <KeyboardHandle>
        <Container>
          <Animated.View
            style={[
              styles.headerStyle,
              {
                backgroundColor: headerBackgroundColor,
                borderBottomColor: heardBorderColor,
                borderBottomWidth: 1
              }
            ]}>
            <TouchableOpacity onPress={this.onPressBack} style={styles.buttonback}>
              <Ionicons name="ios-arrow-back" size={23 * Dimension.scale} color={Resource.colors.black1} />
              <View style={styles.boxtitle}>
                <BaseText style={styles.title}>
                  {Lang.saleLesson.text_course_details} {course}
                </BaseText>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <ScrollView
            style={styles.container}
            ref={(refs) => (this.ScrollView = refs)}
            overScrollMode={'never'}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollY } } }])}>
            {this.renderContent()}
            <View style={styles.viewComent} onLayout={this.getHeightComent}>
              <ListComment
                objectId={courseId}
                type={'course'}
                data={this.dataNotify.data}
                onScrollToComment={this.onScrollToComment}
                dataReply={this.dataNotify.dataNoti}
              />
            </View>
            {this.renderLesson()}
          </ScrollView>
          {this.props.showInput && (
            <InputComment
              ref={'InputComment'}
              objectId={courseId}
              type={'course'}
              onFocusInputComment={this.onFocusInputComment}
              onBlurInputComment={this.onBlurInputComment}
            />
          )}
        </Container>
      </KeyboardHandle>
    );
  }
}

const mapStateToProps = (state) => ({
  showInput: state.inputCommentReducer.showInput,
  lesson: state.courseReducer.lesson,
  course: state.courseReducer.course,
  isStillTime: state.courseReducer.isStillTime,
  listLesson: state.lessonReducer.listLesson,
  listSpecLesson: state.lessonReducer.listSpecLesson
});

const mapDispatchToProps = { onChangeSpeedPlayVideo, onResetCourse };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(DetailCourseScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Resource.colors.grey100
  },
  headerStyle: {
    width,
    height: Platform.OS === 'ios' ? getStatusBarHeight() + 40 : 50,
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    left: 0,
    zIndex: 1000,
    justifyContent: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.2
  },
  buttonback: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15
  },
  content: {
    flex: 1,
    backgroundColor: Resource.colors.white100
  },
  imageThumb: {
    width: width,
    height: 250,
    position: 'absolute',
    top: 20
  },
  boxInfo: {
    width: itemWidth,
    borderRadius: 5,
    paddingBottom: 10,
    marginTop: 224,
    marginLeft: 20,
    marginRight: 20,
    borderWidth: 1,
    borderColor: Resource.colors.borderWidth,
    backgroundColor: Resource.colors.white100,
    shadowColor: Resource.colors.grey600,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 5,
    shadowRadius: Platform.OS === 'ios' ? 10 : 4,
    elevation: Platform.OS === 'ios' ? 0.3 : 5
  },
  infoExpired: {
    marginTop: 5,
    paddingHorizontal: 20
  },
  viewExpired: {
    flex: 1,
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
    color: Resource.colors.black3,
    marginRight: 5
  },
  textTeacher: {
    flex: 1,
    fontSize: 11 * Dimension.scale,
    lineHeight: 20 * Dimension.scale,
    color: Resource.colors.black1
  },
  textValue: {
    fontSize: 11 * Dimension.scale,
    marginRight: 5,
    fontWeight: '400',
    color: Resource.colors.black1
  },
  textValueExpired: {
    fontSize: 11 * Dimension.scale,
    marginRight: 5,
    fontWeight: '500',
    color: Resource.colors.black1
  },
  boxtitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    width: width - 50 * Dimension.scale,
    fontStyle: 'italic',
    fontSize: 20 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.black1,
    marginLeft: 7
  },
  titleNameCourse: {
    flex: 1,
    fontSize: 20 * Dimension.scale,
    fontStyle: 'italic',
    fontWeight: '600',
    color: Resource.colors.black1,
    marginLeft: 7
  },
  lessons: {
    marginTop: 5,
    paddingVertical: 10
  },
  textCategory: {
    fontSize: 15 * Dimension.scale,
    fontWeight: '500',
    paddingVertical: 5,
    color: Resource.colors.black1
  },
  viewButton: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  buttonByCourse: {
    backgroundColor: Resource.colors.greenColorApp,
    paddingHorizontal: 23 * Dimension.scale,
    paddingVertical: 8 * Dimension.scale,
    borderRadius: 20 * Dimension.scale
  },
  titleButton: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.white100
  },
  viewComent: {
    marginTop: 10,
    paddingVertical: 15,
    backgroundColor: Resource.colors.white100
  },

  courseProgress: {
    paddingVertical: 15,
    backgroundColor: '#E9EDF0'
  },
  titlecourseProgress: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    marginLeft: 20,
    color: Resource.colors.black1,
    paddingBottom: 10
  },
  textViewMore: {
    fontSize: 16,
    color: Resource.colors.greenColorApp,
    fontWeight: '500'
  },
  specArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '95%',
    alignSelf: 'center',
    margin: 5
  },
  headerStyles: {
    borderTopWidth: 0.3,
    borderTopColor: 'grey'
  },
  parentHeaderStyle: {
    marginVertical: 0
  },
  header: {
    height: 50,
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center'
  },
  textSpec: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red'
  }
});
