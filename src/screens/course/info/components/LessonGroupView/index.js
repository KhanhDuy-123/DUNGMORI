import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import ScreenNames from 'consts/ScreenName';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';
import Utils from 'utils/Utils';
import ItemLessonGroupView from './ItemLessonGroupView';
import { connect } from 'react-redux';
import { onChangeSpeedPlayVideo } from 'states/redux/actions/SpeedVideoAction';
import Const from 'consts/Const';

class LessonGroupView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupLessons: [],
      itemGroupLesson: {},
      isGuide: false
    };
  }

  componentDidMount() {
    this.setState({ groupLessons: this.props.groupLessons });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.groupLessons !== this.props.groupLessons) {
      for (let i = 0; i < nextProps.groupLessons.length; i++) {
        let content = { ...nextProps.groupLessons[i] };
        if (!content.isShow) content.isShow = false;
        nextProps.groupLessons[i] = content;
      }
      this.setState({ groupLessons: nextProps.groupLessons });
    }
    return nextState !== this.state;
  }

  setItemGroupLesson = (item) => {
    this.setState({ itemGroupLesson: item });
  };

  onPressShowLesson = (item) => {
    let { groupLessons } = this.state;
    for (let i = 0; i < groupLessons.length; i++) {
      let content = { ...groupLessons[i] };
      if (item.id === content.id) {
        content.isShow = !content.isShow;
      } else {
        content.isShow = false;
      }
      groupLessons[i] = content;
    }
    this.setState({ groupLessons, itemGroupLesson: item });
  };

  onUpdateProgressLesson = (videoProgress, examProgress, lessonId, lessonGroupId, selected, courseId) => {
    let { groupLessons } = this.state;
    const data = {
      videoProgress: videoProgress,
      exampleProgress: examProgress,
      lessonId: lessonId,
      lessonGroupId,
      selected,
      courseId,
      groupLessons
    };
    LessonActionCreator.updateLessonNew(data, (listData) => {
      this.props.onUpdateProgressLesson(listData, this.props.index, videoProgress, lessonGroupId);
    });
  };

  updateData = () => {
    this.props.onChangeSpeedPlayVideo(Const.VIDEO_SPEED['1x']);
  };

  onPressDetailLesson = (item) => {
    const { params, index } = this.props;
    const { itemGroupLesson } = this.state;
    let course = Utils.listCourse.find((val) => val.id == item.course_id);
    if (!Utils.user || !Utils.user.id) return ModalLoginRequiment.show();
    let content = {
      ...item,
      courseId: course?.id,
      courseName: course?.name,
      course_expired_day: course?.course_expired_day,
      group_id: itemGroupLesson.id
    };
    NavigationService.push(ScreenNames.DetailLessonScreen, {
      item: content,
      itemLesson: itemGroupLesson,
      owned: params.owned,
      updateProgressLesson: params.owned || params.name == 'N5' ? this.onUpdateProgressLesson : null,
      updateData: !params.owned ? this.updateData : null
    });
    this.props.onPressSaveLesson(item, itemGroupLesson, index);
  };

  keyExtractor = (item) => item.id.toString();

  renderItem = ({ item }) => {
    const { isStillTime, textLesson } = this.props;
    return (
      <ItemLessonGroupView
        item={item}
        owned={this.props.params?.owned}
        onPressShowLesson={this.onPressShowLesson}
        onPressDetailLesson={this.onPressDetailLesson}
        isStillTime={isStillTime}
        textLesson={textLesson}
      />
    );
  };
  render() {
    const { groupLessons } = this.state;
    const { indexCurrent, index } = this.props;
    if (indexCurrent !== index) return null;
    return (
      <View style={styles.container}>
        <FlatList data={groupLessons} extraData={this.state} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
      </View>
    );
  }
}

const mapDispatchToProps = { onChangeSpeedPlayVideo };

export default connect(
  null,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(LessonGroupView);
const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: Dimension.widthParent - 20
  }
});
