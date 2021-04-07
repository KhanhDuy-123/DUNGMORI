import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import Dimension from 'common/helpers/Dimension';
import DownloadVideoService from 'common/services/DownloadVideoService';
import NavigationService from 'common/services/NavigationService';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import DatabaseConst from 'consts/DatabaseConst';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Alert, Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LessonController from 'realm/controllers/LessonController';
import LessonGroupController from 'realm/controllers/LessonGroupController';
import VideoController from 'realm/controllers/VideoController';
import RNFetchBlob from 'rn-fetch-blob';
import VideoDownloadActionCreator from 'states/redux/actionCreators/VideoDownloadActionCreator';
import Utils from 'utils/Utils';
import Resource from '../../../assets/Resource';
import BaseText from '../../../common/components/base/BaseText';
import Funcs from 'common/helpers/Funcs';

const width = Dimension.widthParent;

class ItemChoose extends Component {
  constructor(props) {
    super(props);
    this.animatedBackground = new Animated.Value(0);
    let item = props.item;
    let nameLesson = item.name;
    if (item.is_secret == 1 && (!Utils.user?.id || !props.isStillExpired)) {
      nameLesson = nameLesson.split(':');
      nameLesson = `${nameLesson[0]}: ${Lang.chooseLession.text_hide}`;
    }
    this.state = {
      nameLesson
    };
  }

  onChangeColor = () => {
    Animated.sequence([
      Animated.delay(600),
      Animated.timing(this.animatedBackground, {
        toValue: 1,
        duration: 800
      }),
      Animated.timing(this.animatedBackground, {
        toValue: 2,
        duration: 800
      })
    ]).start();
  };

  async componentDidMount() {
    if (this.props.active || this.props.item.update) {
      this.onChangeColor();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.item.count !== this.props.item.count || nextProps.item.update) {
      this.onChangeColor();
    }
    return nextProps.item !== this.props.item || nextProps.item.count !== this.props.item.count;
  }

  onNavigateDownloadVideo = () => {
    this.props.onNavigateDownloadVideo(this.props.item);
  };

  onPressCancelDownloadVideo = async () => {
    const { item } = this.props;
    const { videoId, videoName } = item;
    if (item.downloadProgress < 100) {
      DownloadVideoService.stop({ videoId: videoId });
      let listLesson = await LessonController.getBy('group.id', item.groupId);
      let deleteVideo = {
        id: videoId,
        downloadPath: null,
        isDownloadFinish: null
      };
      if (listLesson?.length == 1) {
        await LessonGroupController.delete(item.groupId);
        await LessonController.deleteBy('group.id', item.groupId);
      }
      this.onCancelDownloadVideo();
      let path = DatabaseConst.VIDEO_PATH + videoName;
      RNFetchBlob.fs.unlink(path);
      VideoController.add({ ...deleteVideo }, true);
    }
  };

  onCancelDownloadVideo = async () => {
    const { item } = this.props;
    VideoDownloadActionCreator.stopDownload(item);
  };

  onAlertVideoError = () => {
    Alert.alert(
      Lang.alert.text_title,
      Lang.alert.text_alert_video_download_error,
      [
        {
          text: Lang.alert.text_button_cancel,
          style: 'cancel'
        },
        { text: Lang.alert.text_button_download, onPress: this.onNavigateDownloadVideo, style: 'destructive' }
      ],
      { cancelable: false }
    );
  };

  alertCancelDownload = () => {
    Alert.alert(
      Lang.alert.text_title,
      Lang.alert.text_alert_video_is_being_downloaded,
      [
        { text: Lang.alert.text_button_cancel, style: 'cancel' },
        { text: Lang.calendarKaiwa.text_button_confirm, onPress: this.onPressCancelDownloadVideo, style: 'destructive' }
      ],
      {
        cancelable: false
      }
    );
  };

  onPressDetailLesson = (params, index) => async () => {
    const { courseId, sectionId, type, selected, isOffline, item } = this.props;
    if (isOffline && params?.downloadProgress > 0 && params?.downloadProgress < 100) {
      this.alertCancelDownload();
    } else if (isOffline && !params?.isFinish) {
      this.onAlertVideoError();
    } else {
      let videoProgress = 0;
      if (isOffline) NavigationService.navigate(ScreenNames.DetailVideoOfflineScreen, item);
      else {
        if (!Utils.user || !Utils.user.id) ModalLoginRequiment.show();
        else if (type == Const.TYPE_VIEW_DUNGMORI && Utils.user?.id && this.props.isStillExpired) {
          return this.props.onNavigateDetailLesson(params, index);
        } else if (courseId && Utils.user?.id && this.props.isStillExpired) {
          try {
            let data = [];
            const oldLesson = await StorageService.get(Const.DATA.OLD_LESSON);
            if (oldLesson && oldLesson.length !== 0) {
              data = oldLesson;
              data.map((e, ind) => {
                if (e.courseId == courseId) {
                  videoProgress = e.videoProgress ? e.videoProgress : 0;
                  data.splice(ind, 1);
                }
                return e;
              });
            }
            const lesson = {
              courseId: courseId,
              sectionId: sectionId,
              idContent: params.id,
              lessonName: params.name,
              index: index,
              selected: selected,
              videoProgress: videoProgress,
              sort_order: params.sort_order
            };
            data.push(lesson);
            StorageService.save(Const.DATA.OLD_LESSON, data);
          } catch (error) {
            Funcs.log(error);
          }
          this.props.onNavigateDetailLesson(params, index);
        } else if (Utils.user?.id) {
          this.props.onNavigateDetailLesson(params, index);
        }
      }
    }
  };

  renderDownloadProgress = () => {
    const { isOffline, item } = this.props;
    const { downloadProgress } = item;
    if (isOffline && downloadProgress > 0 && downloadProgress < 100) {
      return (
        <AnimatedCircularProgress
          size={20}
          width={2}
          fill={downloadProgress}
          tintColor={Resource.colors.greenColorApp}
          style={{ justifyContent: 'center', alignItems: 'center' }}
          backgroundColor={Resource.colors.grey100}>
          {() => <BaseText style={{ fontSize: 8, color: Resource.colors.greenColorApp, fontWeight: 'bold' }}>{Math.floor(downloadProgress)}</BaseText>}
        </AnimatedCircularProgress>
      );
    } else if (isOffline && !item?.isFinish) {
      return <FastImage source={Resource.images.icError} style={styles.iconError} resizeMode={FastImage.resizeMode.contain} />;
    }
  };

  renderCheck = () => {
    const { item, isStillExpired, courseName } = this.props;
    const progress = Math.round((item.example_progress + item.video_progress) / 2);
    const isPass = progress >= 95;
    let isTryLesson = item.price_option === 0;
    let expried = isStillExpired;
    if (courseName && courseName == 'N5') expried = true;
    if (!expried && !isTryLesson) return <FontAwesome name="lock" color="grey" size={20} />;
    if (!expried && isTryLesson) {
      return (
        <View style={styles.areaTextTry}>
          <BaseText style={styles.textTry}>{Lang.detailLesson.text_try_lesson}</BaseText>
        </View>
      );
    }
    if (isPass) return <Entypo name="check" size={22} color={Resource.colors.greenColorApp} />;
    return null;
  };

  render() {
    const { item, index, isStillExpired } = this.props;
    let transformColor = this.animatedBackground.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ['#FFFFFF', Colors.greenColorApp, '#FFFFFF'],
      extrapolate: 'clamp'
    });
    let tranColor = this.animatedBackground.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ['#000000', '#FFFFFF', '#000000']
    });
    if (item.is_secret == 1 && (!Utils.user?.id || !isStillExpired)) tranColor = 'grey';
    let isTryLesson = item.price_option === 0;
    return (
      <TouchableOpacity onPress={this.onPressDetailLesson(item, index)} disabled={!isStillExpired && !isTryLesson ? true : false} activeOpacity={0.2}>
        <Animated.View style={[styles.content, { backgroundColor: transformColor }]}>
          <View style={[styles.textArea, { width: !isStillExpired && isTryLesson ? '75%' : '90%' }]}>
            <View style={styles.viewTitle}>
              <FastImage source={Resource.images.icCircleLession} style={styles.iconCircle} />
              <Animated.Text style={[styles.textTitleLession, { color: tranColor }]} numberOfLines={1}>
                {this.state.nameLesson}
              </Animated.Text>
            </View>
          </View>
          {this.renderDownloadProgress()}
          {this.renderCheck()}
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    width: width - 20,
    paddingHorizontal: 15 * Dimension.scale,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Resource.colors.white100,
    borderRadius: 10,
    height: 50,
    borderTopWidth: 1,
    borderTopColor: Resource.colors.greyIndicator,
    justifyContent: 'space-between'
  },
  textArea: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconCircle: {
    width: 8 * Dimension.scale,
    height: 8 * Dimension.scale,
    marginRight: 10 * Dimension.scale
  },
  textTitleLession: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1,
    marginRight: 20 * Dimension.scale,
    fontFamily: 'Montserrat'
  },
  areaTextTry: {
    width: 80,
    height: 25,
    backgroundColor: Resource.colors.greenColorApp,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTry: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600'
  },
  textFree: {
    fontSize: 12,
    color: 'red',
    fontWeight: '600'
  },
  viewTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconDrop: {
    width: 8 * Dimension.scale,
    height: 8 * Dimension.scale
  },
  iconError: {
    width: 15 * Dimension.scale,
    height: 15 * Dimension.scale
  }
});

export default ItemChoose;
