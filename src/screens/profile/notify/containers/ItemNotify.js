import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import Time from 'common/helpers/Time';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Utils from 'utils/Utils';

export default class ItemNotify extends Component {
  constructor(props) {
    super(props);

    const { content, infoData } = this.getCommentData();
    this.state = { content, infoData };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item !== this.props.item) {
      let { content, infoData } = this.getCommentData(nextProps);
      this.setState({ content, infoData });
    }
    return nextState !== this.state || nextProps.item !== this.props.item;
  }

  getCommentData = (props) => {
    if (!props) props = this.props;
    let content = '';
    let infoData = {};
    try {
      const { item, inforUser } = props;
      if (item.data) infoData = Funcs.jsonParse(item.data);
      let backContent = item.lesson_name;
      content = infoData?.heading;
      if (item.table_name == Const.TABLE_NAME.LESSON) {
        backContent = `${Lang.notification.text_lesson} ${item.lesson_name}, ${Lang.notification.text_name_course} ${item.lesson_course_name}`;
      } else if (item.table_name == Const.TABLE_NAME.COURSE) {
        backContent = `${Lang.notification.text_course} ${item.course_name}`;
      } else if (item.table_name == Const.TABLE_NAME.COMBO) {
        backContent = `${Lang.notification.text_combo_course} ${item.combo_name}`;
      } else if (item.table_name == Const.TABLE_NAME.FLASHCARD) {
        backContent = `${Lang.notification.text_lesson} ${item.flashcard_lesson_name}, ${Lang.notification.text_name_course} ${item.flashcard_course_name}`;
      }

      if (item.type == Const.TABLE_NAME.REPLY) {
        if (infoData.lessonId && item.table_name == 'kaiwa') {
          content = item.title;
        } else if (infoData.commentUserId == item.sender_id) {
          content = `${Lang.listNotify.text_reply_own_comment} ${backContent}`;
        } else if (infoData.commentUserId && infoData.commentUserId !== item.sender_id && infoData.commentUserId !== inforUser.id) {
          content = `${Lang.listNotify.text_reply_same_comment} ${backContent}`;
        } else {
          content = `${Lang.listNotify.text_reply_comment} ${backContent}`;
        }
      }
      if (item.type == Const.TABLE_NAME.LIKE) {
        content = `${Lang.listNotify.text_like_comment} ${backContent}`;
      }
      if (item.type == Const.TABLE_NAME.INVOICE) {
        content = Lang.listNotify.text_buy_course_success;
      }
      if (item.type == 'global') {
        content = item.title;
      }
    } catch (error) {
      Funcs.log('ERROR PARSE', error);
    }
    return { content, infoData };
  };

  onPressNavigate = () => {
    const { infoData } = this.state;
    const { item } = this.props;
    let tableName = item.table_name;
    let data = {};
    try {
      data = JSON.parse(item.data);
    } catch (err) {
      Funcs.log(err);
    }
    switch (tableName) {
      case Const.TABLE_NAME.LESSON: {
        let params = { ...item };
        params.dataNoti = item.data;
        NavigationService.navigate(ScreenNames.DetailLessonScreen, {
          item: params,
          typeNotify: true
        });
        this.props.onReadNotify(item);
        break;
      }
      case Const.TABLE_NAME.COMBO: {
        if (item.type == Const.TABLE_NAME.INVOICE) {
          NavigationService.navigate(ScreenNames.DetailPayment, { idPayment: data.id });
        } else {
          let params = { ...item };
          params.dataNoti = item.data;
          NavigationService.navigate(ScreenNames.DetailComboScreen, {
            data: params,
            typeNotify: true,
            type: Const.TYPE_VIEW_DUNGMORI
          });
        }
        this.props.onReadNotify(item);
        break;
      }
      case Const.TABLE_NAME.COURSE: {
        if (item.type !== Const.TABLE_NAME.INVOICE) {
          let params = { ...item };
          const { course_name } = params;
          params.dataNoti = item.data;
          let screenName = ScreenNames.DetailCourseScreen;
          const course = Utils.listCourse.find((e) => e.name === course_name);
          if (course?.premium) screenName = ScreenNames.DetailCourseNewScreen;
          NavigationService.navigate(screenName, {
            item: params,
            typeNotify: true,
            type: Const.TYPE_VIEW_DUNGMORI
          });
        } else {
          NavigationService.navigate(ScreenNames.DetailPayment, { idPayment: data.id });
        }
        this.props.onReadNotify(item);
        break;
      }
      case Const.TABLE_NAME.KAIWA: {
        let params = { ...item };
        if (infoData.lessonId) {
          params.lessonId = infoData.lessonId;
        }
        NavigationService.navigate(ScreenNames.DetailLessonScreen, {
          item: params,
          typeNotify: true
        });
        this.props.onReadNotify(item);
        break;
      }
      case Const.TABLE_NAME.FLASHCARD: {
        let params = { ...item };
        params.lessonId = infoData.lessonId;
        NavigationService.navigate(ScreenNames.DetailLessonScreen, {
          item: params,
          typeNotify: true
        });
        this.props.onReadNotify(item);
        break;
      }
      case Const.TABLE_NAME.JLPT: {
        NavigationService.navigate(ScreenNames.TestScreen);
        break;
      }
      case Const.TABLE_NAME.INVOICE: {
        NavigationService.navigate(ScreenNames.DetailPayment, { idPayment: item.table_id });
        this.props.onReadNotify(item);
        break;
      }
      case Const.TABLE_NAME.SALE: {
        NavigationService.navigate(ScreenNames.BuyCourseScreen);
        this.props.onReadNotify(item);
        break;
      }
      case Const.TABLE_NAME.BOOKING: {
        NavigationService.navigate(ScreenNames.BookingKaiwaScreen);
        this.props.onReadNotify(item);
        break;
      }
      case null: {
        // NavigationService.navigate('Learncreen');
        this.props.onReadNotify(item);
        break;
      }
      default: {
        break;
      }
    }
  };

  renderContent = () => {
    const { item, inforUser } = this.props;
    const { infoData } = this.state;
    if (item.type == 'global' || infoData?.heading) {
      return (
        <View style={{ flex: 1 }}>
          <BaseText style={styles.textTitle}>{infoData?.heading}</BaseText>
          <BaseText>{item.title}</BaseText>
        </View>
      );
    } else {
      return item.data === null ? (
        <BaseText>{item.title}</BaseText>
      ) : (
        <BaseText>
          {item.sender_id == 0 && <BaseText style={styles.textName}>Admin </BaseText>}
          {item.name && <BaseText style={styles.textName}>{item.name} </BaseText>}
          <BaseText style={styles.textNotify}>{this.state.content}</BaseText>{' '}
          {infoData.commentUserId !== item.sender_id && infoData.commentUserId !== inforUser.id ? (
            <BaseText style={styles.textName}>{infoData.commentUserName}</BaseText>
          ) : null}
          {infoData.uuid && <BaseText style={styles.textCodeCourse}>{infoData.uuid}</BaseText>}
        </BaseText>
      );
    }
  };

  render() {
    const { infoData } = this.state;
    const { item } = this.props;
    let time = Time.fromNow(item.created_at);
    if (infoData?.logs && infoData?.logs.length > 0) {
      time = Time.fromNow(infoData.logs[0].time * 1000);
    }
    let avatarSource = Resource.images.icAdmin;
    if (item.sender_id == 0 || item.sender_id == null) {
      avatarSource = Resource.images.icAdmin;
    } else {
      if (item.avatar) {
        avatarSource = { uri: Const.RESOURCE_URL.AVATAR.DEFAULT + item.avatar };
      } else {
        avatarSource = Resource.images.noAvt;
      }
    }
    return (
      <TouchableOpacity
        style={[styles.container, item.readed == 1 ? { backgroundColor: Resource.colors.white100 } : { backgroundColor: '#E2E2E2' }]}
        onPress={this.onPressNavigate}
        disabled={!item.table_name ? true : false}>
        <FastImage source={avatarSource} style={styles.avatar} />
        <View style={styles.viewRight}>
          {this.renderContent()}
          <BaseText style={styles.textTime}>{time}</BaseText>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 10
  },
  viewRight: {
    flex: 1
  },
  textName: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: 'bold'
  },
  textNotify: {
    fontSize: 12 * Dimension.scale,
    fontFamily: 'Montserrat'
  },
  textTime: {
    fontSize: 13,
    marginVertical: 5
  },
  avatar: {
    width: 40 * Dimension.scale,
    aspectRatio: 1 / 1,
    borderRadius: 50,
    marginRight: 10
  },
  textCodeCourse: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black'
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 3
  }
});
