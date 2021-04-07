import Colors from 'assets/Colors';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React from 'react';
import { FlatList, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Utils from 'utils/Utils';

const fontSizeTextLesson = 12 * Dimension.scale;
const itemWidth = 145 * Dimension.scale;
export default class ListLessonHorizon extends React.Component {
  state = {
    listLesson: []
  };

  componentDidMount() {
    this.setState({ listLesson: this.props.dataList });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.dataList !== this.props.dataList) {
      this.setState({ listLesson: nextProps.dataList });
    }
    return nextState !== this.state;
  }

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
        updateSpeedPlay: this.props.updateSpeedPlay,
        course: this.props.course // chon bai hoc duy nhat khi di tu man hinh home vao
      });
    }
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    const { isKaiwa } = this.props;
    return (
      <TouchableOpacity style={styles.wrapper} onPress={this.onPressDetail(item)} activeOpacity={0.9}>
        <ImageBackground
          source={{ uri: `${Const.RESOURCE_URL.LESSON.SMALL}${item.avatar_name}` }}
          style={styles.imageDescreption}
          imageStyle={[styles.imageStyle, { backgroundColor: isKaiwa ? '#ffb629' : '#d6902e' }]}>
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
    const { listLesson } = this.state;
    return (
      <FlatList
        data={listLesson ? listLesson : []}
        keyExtractor={this.keyExtractor}
        extraData={this.state}
        horizontal={true}
        renderItem={this.renderItem}
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10
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
    borderColor: Resource.colors.grey400,
    backgroundColor: Resource.colors.greenColorApp
  },
  linearStyle: {
    width: '100%',
    height: 35,
    position: 'absolute',
    left: 0,
    bottom: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  }
});
