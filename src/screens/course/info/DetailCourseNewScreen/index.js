import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import AppConst from 'consts/AppConst';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, BackHandler } from 'react-native';
import { getBottomSpace } from 'common/helpers/IPhoneXHelper';
import { connect } from 'react-redux';
import InputComment from 'screens/components/comment/InputComment';
import ListComment from 'screens/components/comment/ListComment';
import CourseActionCreator from 'states/redux/actionCreators/CourseActionCreator';
import GuideBeforeLearningView from '../components/GuideBeforeLearningView';
import LessonCategoriesView from '../components/LessonCategoriesView';
import LessonGroupView from '../components/LessonGroupView';
import CourseInfoView from './CourseInfoView';
import FreeLessonView from './FreeLessonView';
import { onResetCourse } from 'states/redux/actions/CourseAction';

class DetailCourseNewScreen extends React.Component {
  constructor() {
    super();
    this.courseId = null;
    this.params = NavigationService.getParams();
    let { data, item, typeNotify } = this.params;
    this.dataNotify = {};
    let dataPass = { ...item };
    if (typeNotify) {
      this.courseId = item.table_id;
    } else {
      this.courseId = item ? item.id : data.services.courses[0];
    }

    try {
      if (typeNotify && item) {
        this.dataNotify = dataPass;
        this.dataNotify.dataNoti = JSON.parse(dataPass.dataNoti);
      }
    } catch (error) {
      Funcs.log(error);
    }
    this.heightComent = 0;
    this.heightHeaderContent = 0;
    this.state = {
      groupLessons: [],
      indexCurrent: null
    };
    this.lessonGroupRef = [];
    this.currentButton = 0;
  }

  getHeightComent = (event) => {
    this.heightComent = event.nativeEvent.layout.height;
  };

  getHeigthHeader = (event) => {
    this.heightHeaderContent = event.nativeEvent.layout.height;
  };

  onScrollToCategory = () => {
    let totalHeight = this.heightComent + this.heightHeaderContent;
    this.ScrollView?.scrollTo({ y: totalHeight, x: 0, animated: true });
  };

  onScrollToComment = () => {
    if (this.params?.typeNotify) {
      this.timeScrollComent = setTimeout(() => {
        this.ScrollView?.scrollTo({ y: this.heightHeaderContent, x: 0, animated: true });
      }, 800);
    }
  };

  onBlurInputComment = () => {};

  onFocusInputComment = () => {};

  componentDidMount() {
    CourseActionCreator.getListCourse(this.courseId);
    CourseActionCreator.getStages(this.courseId);
    BackHandler.addEventListener('hardwareBackPress', this.onHardBackPress);
  }

  componentWillUnmount() {
    clearTimeout(this.timer, this.timeScrollComent);
    BackHandler.removeEventListener('hardwareBackPress', this.onHardBackPress);
    this.props.onResetCourse();
  }

  onHardBackPress = () => {
    NavigationService.pop();
    return true;
  };

  onPressChooseCategories = (item, index) => {
    this.lessonGroupRef[this.currentButton]?.reset();
    this.currentButton = index;
    this.setState({ groupLessons: item.groups, indexCurrent: index });
  };

  onPressSaveLesson = () => {};

  renderInputComment = () => {
    if (!this.props.showInput) return null;
    return (
      <InputComment
        ref={'InputComment'}
        objectId={this.courseId}
        type={'course'}
        onFocusInputComment={this.onFocusInputComment}
        onBlurInputComment={this.onBlurInputComment}
      />
    );
  };

  renderCourseStage = () => {
    const { stages = [] } = this.props;
    const { groupLessons, indexCurrent } = this.state;
    return stages?.map((item, index) => (
      <View key={index} style={{ flex: 1, alignItems: 'center' }}>
        {stages?.length > 1 ? (
          <View style={styles.viewStage}>
            <Text style={styles.textStage}>
              {Lang.course_info.text_step} {item.stage}
            </Text>
          </View>
        ) : null}
        <LessonCategoriesView
          ref={(ref) => (this.lessonGroupRef[index] = ref)}
          params={this.params.item}
          categories={item.categories}
          onPressChooseCategories={this.onPressChooseCategories}
          index={index}
        />
        <LessonGroupView
          groupLessons={groupLessons}
          onPressSaveLesson={this.onPressSaveLesson}
          params={this.params.item}
          index={index}
          indexCurrent={indexCurrent}
          isStillTime={this.props.isStillTime}
        />
      </View>
    ));
  };

  render() {
    const { course, lesson, stages = [] } = this.props;
    let categories = stages && stages[0]?.categories;
    return (
      <KeyboardHandle>
        <Container style={styles.container}>
          <Header
            left={true}
            text={Lang.chooseLession.text_header}
            titleStyle={styles.titleStyle}
            titleArea={styles.titleArea}
            headerStyle={styles.headerStyle}
          />
          <ScrollView showsVerticalScrollIndicator={false} ref={(refs) => (this.ScrollView = refs)}>
            <View onLayout={this.getHeigthHeader}>
              <CourseInfoView course={course} />
              <FreeLessonView
                listLesson={lesson}
                type={this.params?.type}
                owned={this.params?.item?.owned}
                course={course}
                onScrollToList={this.onScrollToCategory}
              />
            </View>
            <View style={styles.viewComent} onLayout={this.getHeightComent}>
              <ListComment
                objectId={this.courseId}
                type={'course'}
                data={this.dataNotify.data}
                onScrollToComment={this.onScrollToComment}
                dataReply={this.dataNotify.dataNoti}
              />
            </View>
            {stages.length > 0 ? (
              <>
                <BaseText style={styles.luggage}>{Lang.saleLesson.text_luggage}</BaseText>
                <GuideBeforeLearningView categories={categories} route={0} params={this.params.item} isStillTime={this.props.isStillTime} />
              </>
            ) : null}
            {this.renderCourseStage()}
          </ScrollView>
          {this.renderInputComment()}
        </Container>
      </KeyboardHandle>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
    showInput: state.inputCommentReducer.showInput,
    lesson: state.courseReducer.lesson,
    course: state.courseReducer.course,
    stages: state.courseReducer.stages,
    isStillTime: state.courseReducer.isStillTime
  };
};

const mapDispatchToProps = { onResetCourse };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(DetailCourseNewScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabView: { flex: 1 },
  styleTabBar: {
    backgroundColor: '#F5F5F5',
    height: AppConst.IS_IOS ? getBottomSpace() + 35 * Dimension.scale : 45 * Dimension.scale,
    shadowColor: '#F5F5F5',
    elevation: 0
  },
  labelStyle: {
    color: 'rgba(51, 51, 51, 0.8)',
    fontSize: 9 * Dimension.scale
  },
  iconStyle: {
    width: 17 * Dimension.scale,
    height: 17 * Dimension.scale,
    marginTop: 3
  },
  indicatorStyle: {
    width: 0,
    height: 0
  },
  titleStyle: { fontSize: 18 },
  viewComent: {
    paddingVertical: 15,
    backgroundColor: Colors.white100,
    borderBottomWidth: 8,
    borderBottomColor: '#F3F3F3'
  },
  luggage: {
    textAlign: 'center',
    fontSize: 15 * Dimension.scale,
    fontWeight: '400',
    paddingTop: 20
  },
  viewStage: {
    borderRadius: 15,
    backgroundColor: Colors.greenColorApp,
    paddingHorizontal: 25,
    paddingVertical: 5,
    marginTop: 25,
    marginBottom: 5
  },
  textStage: {
    color: Colors.white100,
    fontSize: 10 * Dimension.scale
  }
});
