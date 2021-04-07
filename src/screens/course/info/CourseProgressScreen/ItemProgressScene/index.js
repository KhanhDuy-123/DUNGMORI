import Dimension from 'common/helpers/Dimension';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { onChangeSpeedPlayVideo } from 'states/redux/actions/SpeedVideoAction';
import Configs from 'utils/Configs';
import GuideBeforeLearningView from '../../components/GuideBeforeLearningView';
import LessonCategoriesView from '../../components/LessonCategoriesView';
import LessonGroupView from '../../components/LessonGroupView';
import ButtonAdditionalCourse from './ButtonAdditionalCourse';
import ButtonTakeGift from './ButtonTakeGift';
import CourseProgressView from './CourseProgressView';

class ItemProgressScene extends React.Component {
  constructor(props) {
    super(props);
    const { route, index, params, oldData } = props;
    this.state = {
      groupLessons: index === 0 ? route.categories[1].groups : route.categories[0].groups,
      textLesson: {},
      indexCurrent: 0
    };
    this.oldLesson = {};
    this.oldData = oldData ? oldData : [];
    this.params = params;
    this.heightCategory = 0;
    this.groupLessonIndex = 0;
    this.lessonIndex = 0;
    this.listRefCategories = [];
    this.categoriesId = null;
    this.guideUpdate = false;
    this.lessonGroupId = null;
    this.postionY = 0;
    this.direction = 'up';
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.oldData !== this.props.oldData) {
      this.oldData = nextProps.oldData;
    }
    return nextProps !== this.props || this.state !== nextState;
  }

  setLessonGroupIndex = (lessonGroupIndex, lessonIndex) => {
    this.groupLessonIndex = lessonGroupIndex;
    this.lessonIndex = lessonIndex;
  };

  onScrollToOldLesson = (keepLearn) => {
    if (keepLearn) {
      let itemHeight = 35 * Dimension.scale;
      let groupHeight = itemHeight * (this.groupLessonIndex + 1);
      let lessonHeight = itemHeight * this.lessonIndex;
      let totalHeight = groupHeight + lessonHeight + this.heightCategory + 7 * this.groupLessonIndex;
      clearTimeout(this.timeScroll);
      clearTimeout(this.timer);
      this.timeScroll = setTimeout(() => {
        this.scrollRef?.scrollTo({ x: 0, y: totalHeight, animated: true });
      }, 700);
    }
  };

  setItemGroupLesson = (groups, index) => {
    this[`LessonGroupView${index}`]?.setItemGroupLesson(groups);
  };

  onLayout = (event) => {
    this.heightCategory = event.nativeEvent.layout.height;
  };

  onUpdateProgressLesson = (groupLessons, index, video_progress, lessonGroupId, keepLearn, guide) => {
    let { route, oldLesson } = this.props;
    let categories = route.categories;
    let categorieId = keepLearn ? oldLesson?.categoriesId : this.categoriesId;
    if (guide) {
      categorieId = route.categories[0].id;
      this.guideUpdate = true;
      this.lessonGroupId = lessonGroupId;
    } else if (this.guideUpdate && !guide) {
      //Reset update ở danh mục hướng dẫn bài học
      this.onResetUpdateGuideLesson();
    }
    for (let i = 0; i < categories.length; i++) {
      let item = { ...categories[i] };
      if (item.id == categorieId) {
        item.groups = groupLessons;
        let groupLesson = item.groups;
        let videoGroupProgress = 0;
        let exampleGroupProgress = 0;
        for (let j = 0; j < groupLesson.length; j++) {
          let itemGroup = { ...groupLesson[j] };
          videoGroupProgress += groupLesson[j].video_progress;
          exampleGroupProgress += groupLesson[j].example_progress;
          itemGroup.isShow = itemGroup.id == lessonGroupId;
          groupLesson[j] = itemGroup;
        }
        item.groups = groupLesson;
        item.example_progress = exampleGroupProgress / groupLesson.length;
        item.video_progress = videoGroupProgress / groupLesson.length;
      }
      item.isChoose = item.id == categorieId;
      categories[i] = item;
    }

    route.categories = [...categories];
    this.props.updateProgressRoute(index, route);
    if (!guide) this.setState({ groupLessons: [...groupLessons] });

    //Update progress video khi an back
    this.onUpdateWhenPressBack(index, video_progress, guide);

    //Học tiếp bài học cũ cuộn đến bài học đó
    this.onScrollToOldLesson(keepLearn);
    this.props.onChangeSpeedPlayVideo(Const.VIDEO_SPEED['1x']);
  };

  onResetUpdateGuideLesson = () => {
    let { route } = this.props;
    let group = route.categories[0].groups.find((e, index) => {
      return e.id == this.lessonGroupId;
    });
    group.lessons = group?.lessons.map((e) => {
      if (e.update) {
        e = { ...e };
        e.update = false;
      }
      return e;
    });
  };

  onUpdateWhenPressBack = (index, video_progress, guide) => {
    if (guide) return null;
    let oldData = this.oldData;
    for (let i = 0; i < oldData.length; i++) {
      let content = { ...oldData[i] };
      if (this.params.course_id == content.courseId && content.stage == index) {
        content.videoProgress = video_progress;
        oldData[i] = content;
        break;
      }
    }
    this.oldData = oldData;
    StorageService.save(Const.DATA.OLD_LESSON_NEW, oldData);
  };

  onPressSaveLesson = (item, itemGroupLesson, index) => {
    let categories = this.props.route?.categories?.find((e) => e.id == this.categoriesId);
    let groups = categories?.groups?.find((e) => e.id == itemGroupLesson.id);
    let oldData = this.props.oldData ? this.props.oldData : [];
    let data = {
      courseId: this.params.course_id,
      stage: index,
      stageName: this.props.route.title,
      categoriesId: this.categoriesId,
      categoriesName: categories?.title,
      groupLessonId: itemGroupLesson.id,
      lessonGroupName: groups?.name,
      lessonId: item.id,
      lessonName: item.name,
      videoProgress: 0,
      item
    };
    let course = this.oldData.find((e) => e.courseId == this.params.course_id);
    if (oldData?.length == 0 || !course) {
      oldData.push(data);
    } else {
      let ind = null;
      let lesson = oldData.find((e, num) => {
        if (e.courseId == this.params.course_id) {
          ind = num;
          return e;
        }
      });
      if (lesson) oldData[ind] = data;
    }
    this.oldData = oldData;
    StorageService.save(Const.DATA.OLD_LESSON_NEW, oldData);
  };

  onPressChooseCategories = (item, index) => {
    this.categoriesId = item.id;
    let textLesson = item.text_group_left;
    this.setState({ groupLessons: item.groups, textLesson, indexCurrent: index }, () => {
      this.props.onChangeCatesGory(this.state.groupLessons);
      this.timer = setTimeout(() => {
        let refCategory = this.listRefCategories[index];
        this.scrollRef?.scrollTo({ y: refCategory?.layoutY, animated: true });
      }, 300);
    });
  };

  onScrollListener = (event) => {
    let scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 0 && scrollY > this.postionY && this.direction === 'up') {
      //Scroll down
      this.direction = 'down';
      this.ButtonAdditionalCourse?.onAnimatedAddition(this.direction);
    } else if (scrollY < this.postionY && this.direction === 'down') {
      //Scroll up
      this.direction = 'up';
      this.ButtonAdditionalCourse?.onAnimatedAddition(this.direction);
    }
    this.postionY = scrollY;
  };

  render() {
    const { route, totalProgress, params, oldLesson, user } = this.props;
    let categories = route.categories;
    let canShowAdditional = Const.COURSE_HAS_ADDITION_LIST.indexOf(params.name) >= 0 && params.showAddition;
    const { groupLessons, indexCurrent, textLesson } = this.state;
    if (route.key !== 0) {
      categories.sort(function(a, b) {
        return a.id - b.id;
      });
    }
    return (
      <View style={styles.container}>
        <ScrollView onScroll={this.onScrollListener} scrollEventThrottle={16} showsVerticalScrollIndicator={false} ref={(ref) => (this.scrollRef = ref)}>
          <View onLayout={this.onLayout}>
            <CourseProgressView categories={categories} courseName={params.name} index={route.index} totalProgress={totalProgress} />
            <GuideBeforeLearningView
              categories={categories}
              params={params}
              route={route.key}
              categoriesId={this.categoriesId}
              onUpdateProgressLesson={this.onUpdateProgressLesson}
            />
            <LessonCategoriesView
              categories={categories}
              params={params}
              index={route.index}
              onPressChooseCategories={this.onPressChooseCategories}
              ref={(ref) => (this.listRefCategories[route.index] = ref)}
            />
          </View>
          <LessonGroupView
            groupLessons={groupLessons}
            textLesson={textLesson}
            params={params}
            groupLessonId={oldLesson?.lessonGroupId}
            onUpdateProgressLesson={this.onUpdateProgressLesson}
            index={route.index}
            indexCurrent={indexCurrent}
            onPressSaveLesson={this.onPressSaveLesson}
            ref={(refs) => (this[`LessonGroupView${route.key}`] = refs)}
            isProgress={true}
          />
        </ScrollView>
        {/* {Configs.enabledFeature.takeGift && user?.id && <ButtonTakeGift ref={(refs) => (this.ButtonTakeGift = refs)} />} */}
        {Configs.enabledFeature.additionalCourse && user?.id && canShowAdditional && (
          <ButtonAdditionalCourse courseName={params.name} ref={(refs) => (this.ButtonAdditionalCourse = refs)} />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user
  };
};

const mapDispatchToProps = { onChangeSpeedPlayVideo };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(ItemProgressScene);

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabView: { flex: 1 }
});
