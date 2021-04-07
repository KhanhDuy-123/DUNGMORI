import React from 'react';
import { StyleSheet, View } from 'react-native';
import BaseButton from 'common/components/base/BaseButton';
import BaseText from 'common/components/base/BaseText';
import Colors from 'assets/Colors';
import Dimension from 'common/helpers/Dimension';
import Lang from 'assets/Lang';
import ListLessonView from '../LessonGroupView/ItemLessonGroupView/ListLessonView';
import NavigationService from 'common/services/NavigationService';
import ScreenNames from 'consts/ScreenName';
import Utils from 'utils/Utils';
import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';

export default class GuideBeforeLearningView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      data: this.getLesson(props.categories)
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.categories !== this.props.categories) {
      this.setState({ data: this.getLesson(nextProps.categories) });
    }
    return nextState !== this.state;
  }

  getLesson = (categories) => {
    let data = [];
    if (categories?.length > 1) {
      categories[0].groups.map((item) => {
        item.lessons.map((val) => {
          val.group_id = item.id;
          data.push(val);
        });
      });
      data.sort(function(a, b) {
        return a.id - b.id;
      });
    }
    return { lessons: data };
  };

  onPressGuideSchool = () => {
    this.setState({ isShow: !this.state.isShow });
  };

  onUpdateLesson = (videoProgress, examProgress, lessonId, lessonGroupId, selected, courseId) => {
    const categories = this.props.categories[0];
    const data = {
      videoProgress: videoProgress,
      exampleProgress: examProgress,
      lessonId: lessonId,
      lessonGroupId,
      selected,
      courseId,
      groupLessons: categories?.groups
    };

    LessonActionCreator.updateLessonNew(data, (listData, lessonGroupIndex, lessonIndex) => {
      // Chuyển tab và lưu indexgroup, indexlesson để cuộn list
      const { route } = this.props;
      this.props.onUpdateProgressLesson(categories?.groups, route, videoProgress, lessonGroupId, false, true);
    });
  };

  onPressDetailLesson = (item) => {
    if (!Utils.user || !Utils.user.id) return ModalLoginRequiment.show();
    const { params } = this.props;
    const categories = this.props.categories[0];
    const groups = categories?.groups.find((e) => e.id == item.group_id);
    let content = {
      ...item,
      courseId: params.course_id,
      courseName: params.name,
      course_expired_day: params.course_expired_day,
      group_id: item.group_id
    };
    NavigationService.push(ScreenNames.DetailLessonScreen, {
      item: content,
      itemLesson: groups,
      owned: params.owned,
      updateProgressLesson: params.owned || params.price == 0 ? this.onUpdateLesson : null
    });
  };

  render() {
    const { data, isShow } = this.state;
    const { route, params, isStillTime } = this.props;
    let item = { ...data, isShow };
    if (route !== 0) return null;
    return (
      <View style={styles.container}>
        <BaseButton style={styles.button} onPress={this.onPressGuideSchool}>
          <BaseText style={styles.title}>{Lang.ChooseLessonNew.text_guide}</BaseText>
        </BaseButton>
        <ListLessonView item={item} owned={params?.owned} onPressDetailLesson={this.onPressDetailLesson} isStillTime={isStillTime} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10
  },
  button: {
    height: 35 * Dimension.scale,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greenColorApp,
    shadowColor: 'grey',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1
  },
  title: {
    color: Colors.white100,
    fontSize: 12 * Dimension.scale,
    fontWeight: '500'
  }
});
