import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Styles from 'assets/Styles';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-spinkit';
import { TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import ModalShowOldLesson from 'screens/components/lession/ModalShowOldLesson';
import CourseActionCreator from 'states/redux/actionCreators/CourseActionCreator';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';
import CourseProgressTabBar from './CourseProgressTabBar';
import ItemProgressScene from './ItemProgressScene';
import HeaderCourseProgress from '../HeaderCourseProgress';
import SearchProgressLesson from '../HeaderCourseProgress/SearchProgressLesson';
import ModalTakeGift from './ModalTakeGift/index';

class CourseProgressScreen extends React.Component {
  constructor() {
    super();
    this.params = NavigationService.getParams()?.params;
    this.state = {
      index: 0,
      routes: null,
      categoriesId: null,
      oldData: [],
      oldLesson: {}
    };
    this.oldData = [];
    this.oldLesson = {};
    this.currentIndex = 0;
    this.groupLessonIndex = 0;
    this.lessonIndex = 0;
    this.currentIndexTab = 0;
    this.showModal = false;
    this.groupLesson = [];
  }

  componentDidMount() {
    CourseActionCreator.getStages(this.params?.course_id, () => {
      this.getOldLesson();
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.stages && this.props.stages !== nextProps.stages) {
      const routes = nextProps.stages.map((item, index) => ({
        index,
        key: index,
        title: Lang.ChooseLessonNew.text_stage + ' ' + item.stage,
        categories: item.categories
      }));
      const totalProgress = this.caculatorTotalProgress(routes);
      this.setState({
        routes,
        totalProgress
      });
    }
    return this.state !== nextState;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  getOldLesson = async () => {
    let oldData = await StorageService.get(Const.DATA.OLD_LESSON_NEW);
    if (!oldData) this.oldData = [];
    else {
      this.oldData = oldData;
      let lesson = oldData.find((e) => e.courseId == this.params?.course_id);
      // Update current category selected
      // let { routes } = this.state;
      // routes = routes.map((item) => {
      //   item.categories = item.categories.map((item1) => {
      //     let isChoose = false;
      //     item1.groups = item1.groups.map((item2) => {
      //       if (item2.id === lesson.groupLessonId) {
      //         isChoose = true;
      //       }
      //       return item2;
      //     });
      //     if (isChoose) item1 = { ...item1, isChoose };
      //     return item1;
      //   });
      //   return item;
      // });

      // Show popup
      if (lesson) this.oldLesson = lesson;
      let title = `${this.oldLesson.stageName} ➜ ${this.oldLesson.categoriesName} ➜ ${this.oldLesson.lessonGroupName} ➜ ${this.oldLesson.lessonName}`;
      if (this.state.routes?.length === 1) {
        title = `${this.oldLesson.categoriesName} ➜ ${this.oldLesson.lessonGroupName} ➜ ${this.oldLesson.lessonName}`;
      }
      if (lesson?.courseId == this.params?.course_id) {
        if (this[`jumpTo${0}`]) this[`jumpTo${0}`](lesson.stage);
        this.ModalKeepLearn.showModal(title);
      }
      this.setState({ oldLesson: this.oldLesson, oldData: this.oldData });
    }
  };

  caculatorTotalProgress = (routes) => {
    if (!routes) routes = this.state.routes;
    let videoProgress = 0;
    let exampleProgress = 0;
    for (let i = 0; i < routes.length; i++) {
      let categories = routes[i].categories;
      let cateGoryVideoProgress = 0;
      let cateGoryExamProgress = 0;
      for (let j = 0; j < categories.length; j++) {
        cateGoryVideoProgress += categories[j].video_progress;
        cateGoryExamProgress += categories[j].example_progress;
      }
      videoProgress += cateGoryVideoProgress / categories.length;
      exampleProgress += cateGoryExamProgress / categories.length;
    }
    videoProgress = videoProgress / 3;
    exampleProgress = exampleProgress / 3;
    let totalProgress = Math.round((videoProgress + exampleProgress) / 2);
    Funcs.log('Progress', (videoProgress + exampleProgress) / 2);
    return totalProgress;
  };

  onChangTab = (index) => {
    this.setState({ index });
  };

  onPressCancel = () => {
    let ind = null;
    let lesson = this.oldData.find((e, index) => {
      if (e.courseId == this.oldLesson.courseId) {
        ind = index;
        return e;
      }
    });
    if (lesson) this.oldData.splice(ind, 1);
    StorageService.save(Const.DATA.OLD_LESSON_NEW, this.oldData);
  };

  onUpdateLesson = (videoProgress, examProgress, lessonId, lessonGroupId, selected, courseId) => {
    let stageIndex = 0;
    const stage = this.state.routes.find((e, index) => {
      if (e.key == this.oldLesson.stage) {
        stageIndex = index;
        return e;
      }
    });
    const categories = stage.categories.find((e) => e.id == this.oldLesson.categoriesId);
    const groups = categories?.groups.find((e) => e.id == this.oldLesson.groupLessonId);
    const data = {
      videoProgress: videoProgress,
      exampleProgress: examProgress,
      lessonId: lessonId,
      lessonGroupId,
      selected,
      courseId,
      groupLessons: categories?.groups
    };

    this[`ItemProgressScene${stageIndex}`]?.setItemGroupLesson(groups, stageIndex);
    LessonActionCreator.updateLessonNew(data, (listData, lessonGroupIndex, lessonIndex) => {
      // Chuyển tab và lưu indexgroup, indexlesson để cuộn list
      if (this[`jumpTo${0}`]) this[`jumpTo${0}`](this.oldLesson?.stage);
      this[`ItemProgressScene${stageIndex}`]?.setLessonGroupIndex(lessonGroupIndex, lessonIndex);
      this[`ItemProgressScene${stageIndex}`]?.onUpdateProgressLesson(listData, stageIndex, videoProgress, lessonGroupId, true);
    });
  };

  onUpdateProgress = (index, route) => {
    let routes = this.state.routes;
    routes[index] = route;
    const totalProgress = this.caculatorTotalProgress(routes);
    this.setState({ routes, totalProgress });
  };

  onShowModalKeepLearn = (title, oldLesson) => {
    if (!this.showModal) {
      this.ModalKeepLearn?.showModal(title);
      this.showModal = true;
      this.oldLesson = oldLesson;
    }
  };

  onPressKeepLearning = () => {
    const stage = this.state.routes.find((e) => e.key == this.oldLesson.stage);
    const categories = stage.categories.find((e) => e.id == this.oldLesson.categoriesId);
    let item = this.oldLesson;
    item = { ...item, ...this.oldLesson.item };
    let content = {
      ...item,
      courseId: this.params?.course_id,
      courseName: this.params?.name,
      course_expired_day: this.params?.course_expired_day,
      group_id: this.oldLesson?.groupLessonId
    };
    NavigationService.navigate(ScreenNames.DetailLessonScreen, {
      item: content,
      itemLesson: categories,
      owned: this.params.owned,
      updateProgressLesson: this.onUpdateLesson
    });
  };

  onBackPress = () => {
    if (this.props.navigation.state.params.updateData) {
      this.props.navigation.state.params.updateData();
    }
    NavigationService.pop();
  };

  onShowSearch = () => {
    this.SearchProgressLesson?.showSearch();
  };

  onHideSearch = () => {
    this.SearchProgressLesson?.hideSearch();
  };

  onChangeCatesGory = (groups) => {
    this.HeaderCourseProgress?.setGroupData(groups);
    this.SearchProgressLesson?.setGroup(groups);
  };

  onSearchComplete = (listLesson, text) => {
    this.SearchProgressLesson?.setData(listLesson, text);
  };

  updateSearchProgress = (groupLessons, videoProgress, lessonGroupId) => {
    this[`ItemProgressScene${this.state.index}`]?.onUpdateProgressLesson(groupLessons, this.state.index, videoProgress, lessonGroupId);
  };

  onPressClose = () => {
    this.HeaderCourseProgress?.onPressClose();
  };

  changeTextTitle = () => {
    this.SearchProgressLesson?.setHistory();
  };

  onPressSearchAgain = (item) => {
    this.HeaderCourseProgress?.onChangeText(item.name);
  };

  renderSceneItem = ({ route, jumpTo }) => {
    const { totalProgress, oldLesson, oldData } = this.state;
    this[`jumpTo${route.key}`] = jumpTo;
    return (
      <ItemProgressScene
        route={route}
        totalProgress={totalProgress}
        params={this.params}
        updateProgressRoute={this.onUpdateProgress}
        onChangeRouteData={this.onChangeRouteData}
        onChange
        oldLesson={oldLesson}
        oldData={oldData}
        showModalKeepLearn={this.onShowModalKeepLearn}
        onChangeCatesGory={this.onChangeCatesGory}
        ref={(refs) => (this[`ItemProgressScene${route.index}`] = refs)}
      />
    );
  };

  renderTabBar = (props) => {
    const { routes } = this.state;
    if (routes.length === 1) return null;
    return <CourseProgressTabBar {...props} />;
  };

  renderContent = () => {
    const { routes } = this.state;
    // Loading
    if (!routes) {
      return (
        <View style={[Styles.flex, Styles.center]}>
          <Spinner size={30} type={'Circle'} color={Colors.greenColorApp} />
        </View>
      );
    }

    // Empty
    if (routes.length < 1) {
      return (
        <View style={[Styles.flex, Styles.center]}>
          <FastImage source={Images.testGif} style={{ width: 200, height: 200 }} resizeMode={'contain'} />
        </View>
      );
    }

    // Tab view
    return (
      <TabView
        navigationState={this.state}
        tabBarPosition="bottom"
        onIndexChange={this.onChangTab}
        renderScene={this.renderSceneItem}
        lazy={true}
        swipeEnabled={true}
        keyboardDismissMode="none"
        renderTabBar={this.renderTabBar}
        style={styles.tabView}
      />
    );
  };

  render() {
    return (
      <Container style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} enabled={false} behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
          <HeaderCourseProgress
            onShowSearch={this.onShowSearch}
            onHideSearch={this.onHideSearch}
            onSearchComplete={this.onSearchComplete}
            changeTextTitle={this.changeTextTitle}
            ref={(refs) => (this.HeaderCourseProgress = refs)}
          />
          {this.renderContent()}
          <ModalShowOldLesson ref={(refs) => (this.ModalKeepLearn = refs)} onPressKeepLearning={this.onPressKeepLearning} onPressCacel={this.onPressCancel} />
          <SearchProgressLesson
            ref={(refs) => (this.SearchProgressLesson = refs)}
            params={this.params}
            oldLesson={this.state.oldLesson}
            updateSearchProgress={this.updateSearchProgress}
            onPressCloseSearch={this.onPressClose}
            onPressSearchAgain={this.onPressSearchAgain}
          />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.userReducer.user,
    stages: state.courseReducer.stages
  };
};

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(CourseProgressScreen);

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabView: { flex: 1 },
  buttonShare: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FF5C47',
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    bottom: 75,
    right: 10,
    shadowColor: 'rgba(255, 92, 71,255)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    justifyContent: 'center'
  },
  viewCircleBig: {
    width: 40,
    height: 40,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 92, 71,0.3)'
  },
  viewCircleSmall: {
    width: 30,
    height: 30,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 92, 71,0.6)',
    position: 'absolute'
  },
  Images: {
    width: 35,
    height: 35,
    position: 'absolute'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 4
  }
});
