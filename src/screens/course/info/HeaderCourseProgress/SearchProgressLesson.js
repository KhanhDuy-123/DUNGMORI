import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseEmpty from 'common/components/base/BaseEmpty';
import BaseImage from 'common/components/base/BaseImage';
import BaseText from 'common/components/base/BaseText';
import Funcs from 'common/helpers/Funcs';
import { getBottomSpace, isIphoneX } from 'common/helpers/IPhoneXHelper';
import NavigationService from 'common/services/NavigationService';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';
import Dimension from '../../../../common/helpers/Dimension';
const statusBarHeight = getStatusBarHeight();
const spaceBottom = getBottomSpace();
let headerHeight = statusBarHeight + spaceBottom;
if (statusBarHeight > 24 && !isIphoneX()) {
  headerHeight = spaceBottom;
}

class ItemSeach extends Component {
  onPressGoDetailLesson = () => {
    this.props.onPressGoDetailLesson(this.props.item);
  };

  onPressDelete = () => {
    this.props.onPressDeleteHistory(this.props.item);
  };

  render() {
    const { item, isHistory } = this.props;
    let source = Images.icVideo;
    if (item.type === 'test') {
      source = Images.icQuestion;
    } else if (item.type === 'docs') {
      source = Images.icDoc;
    } else if (item.type === 'flashcard') {
      source = Images.icFlash;
    }
    let marginVertical = 0;
    if (isHistory) marginVertical = 5;
    return (
      <TouchableOpacity style={styles.wrapperItem} activeOpacity={0.4} onPress={this.onPressGoDetailLesson}>
        <View style={{ flex: 1, marginVertical }}>
          <View style={styles.wrapperName}>
            {isHistory ? <Entypo name="back-in-time" size={20} color="#777777" /> : <BaseImage source={source} style={styles.icon} resizeMode="contain" />}
            <BaseText style={styles.name} numberOfLines={1}>
              {item.name}
            </BaseText>
          </View>
          {!isHistory && (
            <BaseText style={styles.textGroup} numberOfLines={1}>
              {item.group_name}
            </BaseText>
          )}
        </View>
        {isHistory && (
          <TouchableOpacity style={styles.buttonDelete} onPress={this.onPressDelete}>
            <AntDesign name="close" size={20} color={Colors.greenColorApp} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }
}

export default class SearchProgressLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      showHistory: true,
      isHistory: true
    };
    this.animatedView = new Animated.Value(1.1);
    this.params = props.params;
    this.groupLesson = [];
    this.history = [];
    this.text = '';
  }

  componentDidMount() {
    this.getHistory();
  }

  getHistory = async () => {
    try {
      let history = await StorageService.get(Const.DATA.HISTORY_LESSON);
      history = Funcs.jsonParse(history);
      if (history) {
        this.history = history;
        // this.showSearch();
      }
    } catch (error) {
      Funcs.log(error);
    }
  };

  showSearch = () => {
    let listHistory = [...this.history];
    this.setState({ visible: true, data: listHistory.reverse(), isHistory: true }, this.onAnimatedView);
  };

  hideSearch = () => {
    this.setState({ visible: false, data: [], showHistory: true }, this.onAnimatedView);
  };

  setData = (listLesson, text) => {
    if (text?.length > 0) {
      let id = 0;
      let lastItem = null;
      if (this.history.length > 0) {
        lastItem = this.history[this.history.length - 1];
        id = lastItem.id + 1;
      }
      let data = {
        id,
        name: text
      };
      let oldItem = this.history.find((e) => e.name == text);
      if (this.history.length == 0 || !oldItem) this.history.push(data);
      StorageService.save(Const.DATA.HISTORY_LESSON, JSON.stringify(this.history));
    }
    this.setState({ data: listLesson, isHistory: false });
  };

  setGroup = (groups) => {
    this.groupLesson = groups;
  };

  setHistory = () => {
    if (this.state.showHistory) {
      this.setState({ showHistory: false });
    }
  };

  onAnimatedView = () => {
    clearTimeout(this.timeAnimated);
    Animated.spring(this.animatedView, {
      toValue: this.state.visible ? 1 : 1.1,
      bounciness: 0
    }).start();
  };

  updateProgressLesson = (videoProgress, examProgress, lessonId, lessonGroupId, selected, courseId) => {
    const data = {
      videoProgress: videoProgress,
      exampleProgress: examProgress,
      lessonId: lessonId,
      lessonGroupId,
      selected,
      courseId,
      groupLessons: this.groupLesson
    };
    LessonActionCreator.updateLessonNew(data, (listData) => {
      this.props.updateSearchProgress(listData, videoProgress, lessonGroupId);
    });
  };

  onPressClose = () => {
    this.props.onPressCloseSearch();
    this.hideSearch();
  };

  onPressGoDetailLesson = (item) => {
    if (this.state.isHistory) this.props.onPressSearchAgain(item);
    else {
      let data = {
        ...item,
        courseId: this.params.course_id,
        courseName: this.params.name,
        course_expired_day: this.params.course_expired_day,
        group_id: item.group_id
      };
      NavigationService.navigate(ScreenNames.DetailLessonScreen, {
        item: data,
        itemLesson: this.groupLesson,
        owned: this.params.owned,
        updateProgressLesson: this.updateProgressLesson
      });
    }
  };

  onPressDeleteHistory = (item) => {
    this.history = this.history.filter((e) => e.name !== item.name);
    let listHistory = [...this.history];
    this.setState({ data: listHistory.reverse() });
    StorageService.save(Const.DATA.HISTORY_LESSON, JSON.stringify(this.history));
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    const { isHistory } = this.state;
    return (
      <ItemSeach
        item={item}
        index={index}
        onPressGoDetailLesson={this.onPressGoDetailLesson}
        isHistory={isHistory}
        onPressDeleteHistory={this.onPressDeleteHistory}
      />
    );
  };

  render() {
    const { data, visible, showHistory } = this.state;
    const opacity = this.animatedView.interpolate({
      inputRange: [1, 1.1],
      outputRange: [1, 0.7]
    });
    let titleName = Lang.chooseLession.text_history_search;
    if (!showHistory) titleName = Lang.chooseLession.text_result_search;
    if (!visible) return null;
    return (
      <Animated.View style={[styles.container, { opacity, transform: [{ scale: this.animatedView }] }]}>
        <View style={styles.wrapperTitle}>
          <BaseText style={styles.textTitle}>{titleName}</BaseText>
          <TouchableOpacity style={styles.buttonClose} onPress={this.onPressClose}>
            <BaseText>{Lang.chooseLession.text_close}</BaseText>
          </TouchableOpacity>
        </View>
        {data.length == 0 ? (
          <BaseEmpty text={showHistory ? '' : Lang.chooseLession.text_result_not_found} />
        ) : (
          <FlatList data={data} showsVerticalScrollIndicator={false} renderItem={this.renderItem} keyExtractor={this.keyExtractor} style={{ marginTop: 20 }} />
        )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimension.widthParent,
    height: Dimension.heightParent - (50 * Dimension.scale + headerHeight),
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 15
  },
  textTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  wrapperItem: {
    width: '100%',
    // height: 45,
    borderTopWidth: 0.5,
    borderTopColor: 'grey',
    paddingHorizontal: 10,
    flexDirection: 'row'
  },
  wrapperName: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center'
  },
  icon: {
    width: 15 * Dimension.scale,
    height: 15 * Dimension.scale
  },
  name: {
    marginLeft: 10,
    marginRight: 10
  },
  textGroup: {
    color: '#BDBDBD',
    marginBottom: 5,
    fontSize: 12
  },
  wrapperTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  buttonClose: {
    minWidth: 40,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonDelete: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  }
});
