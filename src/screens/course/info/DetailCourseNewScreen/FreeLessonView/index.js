import React from 'react';
import { StyleSheet, View, ScrollView, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import BaseText from 'common/components/base/BaseText';
import Lang from 'assets/Lang';
import Const from 'consts/Const';
import LinearGradient from 'react-native-linear-gradient';
import Dimension from 'common/helpers/Dimension';
import Colors from 'assets/Colors';
import Utils from 'utils/Utils';
import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import NavigationService from 'common/services/NavigationService';
import ScreenNames from 'consts/ScreenName';
import Configs from 'utils/Configs';
import { onChangeSpeedPlayVideo } from 'states/redux/actions/SpeedVideoAction';
import { connect } from 'react-redux';

const fontSizeTextLesson = 12 * Dimension.scale;
const itemWidth = 145 * Dimension.scale;
class FreeLessonView extends React.PureComponent {
  constructor() {
    super();
  }

  updateData = () => {
    this.props.onChangeSpeedPlayVideo(Const.VIDEO_SPEED['1x']);
  };

  onPressDetail = (params) => () => {
    const { lesson, type, owned } = this.props;
    let data = params;
    let typeLesson = lesson && lesson.type ? lesson.type : type;
    data.courseId = this.props.courseId;
    if (!Utils.user || !Utils.user.id) ModalLoginRequiment.show();
    else {
      NavigationService.push(ScreenNames.DetailLessonScreen, {
        item: data,
        typeView: Const.TYPE_VIEW_DUNGMORI,
        typeLesson,
        isTryLesson: true,
        owned,
        courseName: this.props.courseName,
        course: this.props.course,
        updateData: this.updateData // chon bai hoc duy nhat khi di tu man hinh home vao
      });
    }
  };

  onPressDetailChooseLesson = () => {
    const { course } = this.props;
    let params = {
      ...course,
      course_id: course.id
    };
    if (course.premium === 1) {
      NavigationService.navigate(ScreenNames.CourseProgressScreen, { params });
    } else {
      NavigationService.navigate(ScreenNames.ChooseLessionScreen, { params });
    }
  };

  //navigation detail buy course
  onPressDetailBuyCourse = () => {
    const { course } = this.props;
    let buyCourse = course;
    if (!Utils.user || !Utils.user.id) ModalLoginRequiment.show();
    else NavigationService.navigate(ScreenNames.DetailBuyCourseScreen, { buyCourse, type: 'buyCourse' });
  };

  onScrollToList = () => this.props.onScrollToList();

  keyExtractor = (item, index) => index.toString();

  renderButtonBuyCourse = () => {
    const { course } = this.props;
    if (course?.price === 0) {
      return (
        <TouchableOpacity onPress={this.onPressDetailChooseLesson} style={styles.buttonByCourse}>
          <BaseText style={styles.titleButton}>{Lang.saleLesson.button_learn_now}</BaseText>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={this.onPressDetailBuyCourse} style={styles.buttonByCourse}>
        <BaseText style={styles.titleButton}>{Lang.saleLesson.button_buy_course}</BaseText>
      </TouchableOpacity>
    );
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.wrapper} onPress={this.onPressDetail(item)} activeOpacity={0.9}>
        <ImageBackground
          source={{ uri: `${Const.RESOURCE_URL.LESSON.SMALL}${item.avatar_name}` }}
          style={styles.imageDescreption}
          imageStyle={styles.imageStyle}>
          <LinearGradient colors={['rgba(0, 0, 0, 0.01)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.4)']} style={styles.linearStyle}>
            <BaseText style={styles.textLessonName} numberOfLines={1}>
              {item.name}
            </BaseText>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  render() {
    const { listLesson } = this.props;
    return (
      <View style={styles.container}>
        <BaseText style={styles.textTitle}>{Lang.saleLesson.text_title_lesson}</BaseText>
        <FlatList
          data={listLesson ? listLesson : []}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
          horizontal={true}
          renderItem={this.renderItem}
          contentContainerStyle={styles.containerStyle}
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.viewButton}>{this.renderButtonBuyCourse()}</View>
        <TouchableOpacity style={{ alignSelf: 'center', marginBottom: 15 }} onPress={this.onScrollToList}>
          <BaseText style={styles.textViewMore}>{Lang.saleLesson.text_seemore_course}</BaseText>
        </TouchableOpacity>
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
)(FreeLessonView);

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 8,
    borderBottomColor: '#F3F3F3'
  },
  scrollView: {
    height: 150
  },
  containerStyle: {
    paddingHorizontal: 15
  },
  containerItem: {
    width: 200,
    borderWidth: 1,
    margin: 10
  },
  textTitle: {
    marginLeft: 15,
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 15
  },
  wrapper: {
    width: itemWidth
    // paddingVertical: 5
  },
  imageDescreption: {
    width: '100%',
    aspectRatio: 2 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 5
  },
  textLessonName: {
    fontSize: fontSizeTextLesson,
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '500',
    position: 'absolute',
    bottom: 5,
    left: 8,
    marginRight: 15
  },
  buttonPlay: {
    width: 35 * Dimension.scale,
    height: 35 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 100
  },
  icPlay: {
    width: 15 * Dimension.scale,
    height: 15 * Dimension.scale
  },
  imageStyle: {
    borderRadius: 6,
    borderWidth: 0.2,
    borderColor: Colors.grey400,
    backgroundColor: Colors.greenColorApp
  },
  linearStyle: {
    width: '100%',
    height: 35,
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  viewButton: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15
  },
  buttonByCourse: {
    backgroundColor: Colors.greenColorApp,
    paddingHorizontal: 23 * Dimension.scale,
    paddingVertical: 8 * Dimension.scale,
    borderRadius: 20 * Dimension.scale
  },
  titleButton: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '600',
    color: Colors.white100
  },
  viewComent: {
    marginTop: 10,
    paddingVertical: 15,
    backgroundColor: Colors.white100
  },
  textViewMore: {
    fontSize: 16,
    color: Colors.greenColorApp,
    fontWeight: '500'
  }
});
