import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import ScreenNames from 'consts/ScreenName';
import React from 'react';
import { Alert, Animated, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import VideoController from 'realm/controllers/VideoController';
import ItemChoose from 'screens/components/lession/ItemChoose';
import AppContextView from 'states/context/views/AppContextView';
const width = Dimension.widthParent;

export default class ListLessonOffline extends AppContextView {
  constructor(props) {
    super(props);
    this.state = {
      videoId: null,
      videoName: '',
      lessons: []
    };
    this.animated = new Animated.Value(0);
  }

  componentDidMount() {
    let lessons = this.props.item?.lessons || [];
    this.updateLessonVideoOffline(lessons);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.item.isShowContent != nextProps.item.isShowContent) {
      this.onToogleShowContent(nextProps.item.isShowContent);
    }
    if (nextProps.item?.lessons !== this.props.item?.lessons) {
      let lessons = nextProps.item?.lessons || [];
      this.updateLessonVideoOffline(lessons);
    }
    return this.props.item != nextProps.item || nextState !== this.state;
  }

  updateLessonVideoOffline = async (lessons) => {
    for (let i = 0; i < lessons.length; i += 1) {
      let item = lessons[i];
      let listVideo = await VideoController.getBy('lessonId', item.id);
      listVideo = listVideo.map((item1) => ({ videoId: item1.id, videoName: item1.downloadPath, lessonId: item1.lessonId }));
      const videoInfo = listVideo.length > 0 && listVideo[0];
      item = { ...item, videoId: videoInfo.videoId, videoName: videoInfo.videoName };
      lessons[i] = item;
    }
    this.setState({
      lessons
    });
  };

  onPressShowContent = () => {
    this.props.onPressShowContent(this.props.item);
  };

  onLongPress = () => {
    this.props.onLongPress(this.props.item);
  };

  onPressCheck = () => {
    this.props.onPressCheck(this.props.item);
  };

  onToogleShowContent = (isShowContent) => {
    if (isShowContent) {
      Animated.timing(this.animated, {
        toValue: 1,
        friction: 8
      }).start();
    } else {
      Animated.spring(this.animated, {
        toValue: 0,
        friction: 11
      }).start();
    }
  };

  onNavigateDownloadVideo = (data) => {
    const { internet = true } = this.context || {};
    if (!internet) {
      Alert.alert(
        Lang.alert.text_title,
        Lang.alert.text_alert_no_network,
        [
          {
            text: Lang.alert.text_button_understand,
            style: 'cancel'
          }
        ],
        { cancelable: false }
      );
      return;
    }
    const { expiredDate } = this.props;
    let value = this.props.item;
    for (let i = 0; i < value.lessons.length; i += 1) {
      if (value.lessons[i].id == data.id) {
        let item = {
          courseId: value.courseId,
          courseName: value.courseName,
          course_expired_day: expiredDate,
          group_id: value.id,
          id: value.lessons[i].id,
          name: value.lessons[i].name,
          sort_order: value.lessons[i].sort
        };
        let itemLesson = {
          name: value.name,
          sort: value.sort
        };
        NavigationService.push(ScreenNames.DetailLessonScreen, {
          item,
          itemLesson,
          owned: true
        });
      }
    }
  };

  renderItem = ({ item, index }) => {
    return <ItemChoose isOffline item={item} onNavigateDownloadVideo={this.onNavigateDownloadVideo} index={index} isStillExpired={true} isTryLesson={true} />;
  };

  renderFlatlist() {
    const { lessons } = this.state;
    return (
      <FlatList data={lessons} extraData={this.props} keyExtractor={(item, index) => index.toString()} renderItem={this.renderItem} scrollEnabled={false} />
    );
  }

  render() {
    const { item } = this.props;
    const { lessons } = this.state;
    const lengthLesson = lessons ? lessons.length : 0;
    let translateY = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 50 * lengthLesson],
      extrapolate: 'clamp'
    });
    return (
      <View style={styles.container}>
        <View style={styles.parentContent}>
          <TouchableOpacity style={styles.contentHeader} onLongPress={this.onLongPress} onPress={this.onPressShowContent} activeOpacity={1}>
            <BaseText style={styles.textTitle} numberOfLines={1}>
              {item.name}
            </BaseText>
            {item.isShowCheckbox ? (
              <TouchableOpacity style={{ padding: 5 }} onPress={this.onPressCheck}>
                {item.isChecked ? (
                  <Ionicons name={'check-circle'} size={20} color={Resource.colors.greenColorApp} />
                ) : (
                  <Ionicons name={'circle'} size={20} color={Resource.colors.grey500} />
                )}
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>
          <Animated.View style={[{ height: translateY, overflow: 'hidden' }, { borderRadius: 10 }]}>{this.renderFlatlist()}</Animated.View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  contentHeader: {
    height: 50,
    width: width - 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: 'grey',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 1
  },
  textTitle: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '500',
    width: width - 90
  },
  viewStep: {
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5
  },
  textStep: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Resource.colors.black1
  },
  parentContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5
  }
});
