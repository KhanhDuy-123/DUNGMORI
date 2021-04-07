import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import ProgressBar from 'common/components/base/ProgressBar';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { PureComponent } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import HomeActionCreator from 'states/redux/actionCreators/HomeActionCreator';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';
import { onChangeSpeedPlayVideo } from 'states/redux/actions/SpeedVideoAction';
import Utils from 'utils/Utils';

const width = Dimension.widthParent;
const itemWidth = 110 * Dimension.scale;

class MyCourse extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onUpdateProgressLesson = async (videoProgress, examProgress, lessonId, lessonGroupId, selected, courseId) => {
    //update tien do bai hoc
    const data = {
      videoProgress: videoProgress,
      exampleProgress: examProgress,
      lessonId: lessonId,
      lessonGroupId,
      selected,
      courseId
    };
    LessonActionCreator.updateLesson(data, () => {
      HomeActionCreator.getHomeLesson();
    });
    this.props.onChangeSpeedPlayVideo(Const.VIDEO_SPEED['1x']);
  };

  onPressGoDetailLesson = (item) => () => {
    if (!Utils.user || !Utils.user.id) ModalLoginRequiment.show();
    else NavigationService.navigate(ScreenNames.DetailLessonScreen, { item, updateProgressLesson: this.onUpdateProgressLesson });
  };

  onLayout = (event) => {
    // this.Container.measure((x, y, w, h, px, py) => {
    //   this.props.onLayoutChange(h, py);
    // });
  };

  keyExtractor = (item, index) => item.id.toString();

  renderItem = ({ item, index }) => {
    const progress = (item.example_progress + item.video_progress) / 2;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.onPressGoDetailLesson(item)}>
        <View style={styles.wrapperItem}>
          <View style={styles.imageItem}>
            <FastImage style={styles.imageStyle} source={item.avatar_name} />
            <View style={styles.areaButtonPlay}>
              <View style={styles.buttonPlay}>
                <AntDesign name="caretright" size={18} color="#000000" />
              </View>
              <ProgressBar percent={progress} containerStyles={styles.containerStyles} sliderBar={styles.sliderBar} widthParent={itemWidth} />
            </View>
          </View>
          <BaseText style={styles.textName} numberOfLines={1}>
            {item.name}
          </BaseText>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.course} onLayout={this.onLayout} ref={(refs) => (this.Container = refs)}>
        <TouchableOpacity activeOpacity={0.8}>
          <View style={styles.viewTitle}>
            <BaseText style={styles.title}>{this.props.title}</BaseText>
            <View style={styles.buttonViewmore}>
              <AntDesign name="caretright" size={6} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>
        <FlatList
          data={this.props.lessons}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          horizontal={true}
          style={{ marginTop: 10 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}

const mapDispatchToProps = { onChangeSpeedPlayVideo };
const mapStateToProps = (state) => ({
  lessons: state.lessonReducer.listHomeLesson,
  title: state.lessonReducer.titleHomeLesson
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(MyCourse);

const styles = StyleSheet.create({
  course: {
    width: width - 30,
    height: 125 * Dimension.scale,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 0 },
    alignSelf: 'center',
    elevation: 5
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 12
  },
  buttonViewmore: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    width: 10,
    height: 10,
    marginLeft: 5,
    borderRadius: 50,
    paddingTop: 1
  },
  wrapperItem: {
    width: itemWidth,
    marginHorizontal: 5
  },
  imageItem: {
    width: '100%',
    aspectRatio: 1.85 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 5
  },
  buttonPlay: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    width: 30,
    height: 30,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textName: {
    fontSize: 13
  },
  containerStyles: {
    width: '100%',
    height: 1.95,
    backgroundColor: '#C3CDD4',
    position: 'absolute',
    bottom: -1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  sliderBar: {
    backgroundColor: 'red'
  },
  areaButtonPlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  }
});
