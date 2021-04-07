import Lang from 'assets/Lang';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import { isIphoneX } from 'common/helpers/IPhoneXHelper';
import DownloadVideoService from 'common/services/DownloadVideoService';
import EventService from 'common/services/EventService';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, BackHandler, Platform, StatusBar, UIManager, View } from 'react-native';
import { connect } from 'react-redux';
import CourseController from 'realm/controllers/CourseController';
import LessonController from 'realm/controllers/LessonController';
import LessonGroupController from 'realm/controllers/LessonGroupController';
import VideoController from 'realm/controllers/VideoController';
import VideoNoteController from 'realm/controllers/VideoNoteController';
import TabQuickTest from 'routers/TabQuickTest';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';
import VideoDownloadActionCreator from 'states/redux/actionCreators/VideoDownloadActionCreator';
import { onChangeServerVideo, onSaveServer } from 'states/redux/actions/ChangeServerAction';
import { resetLessonDetail, resetLessonInfo } from 'states/redux/actions/LessonAction';
import Configs from 'utils/Configs';
import GuessImageView from '../GuessImageView';
import ContentDetailLesson from './ContentDetailLesson';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const HEIGHR_HEADER = 50 * Dimension.scale;

class DetailLessonScreen extends Component {
  translateY = new Animated.Value(0);
  roltage = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.props.resetLessonInfo();
    this.props.resetLessonDetail();
    this.lessonId = '';
    const typeNotify = this.props.navigation.getParam('typeNotify');
    this.videoUrl = '';
    this.videoQuality = '';
    this.typeVideo = 'youtube';
    this.params = NavigationService.getParams('item');
    if (typeNotify) {
      if (this.params.item.table_name == Const.TABLE_NAME.FLASHCARD) {
        this.lessonId = this.params.item.lessonId;
      } else if (this.params.item.table_name == 'kaiwa') {
        if (this.params.item.lessonId) {
          this.lessonId = this.params.item.lessonId;
        } else {
          this.lessonId = this.params.item.table_id;
        }
      } else {
        this.lessonId = this.params.item.table_id;
      }
    } else {
      this.lessonId = this.params.item.id;
      this.lessonGroupId = this.params.item.group_id ? this.params.item.group_id : this.params.item.lesson_group_id;
    }

    this.state = {
      videoLink: '',
      video: {},
      fullScreenVideo: false,
      listVideo: [],
      listVideoNote: [],
      loading: true,
      server: [],
      listData: {},
      heightHeader: HEIGHR_HEADER
    };
    this.videoName = '';
    this.videoTitle = '';
    this.videoID = null;
    this.isStillTime = true;
    this.isTryLesson = false;
    this.courseId = null;
    this.totalAnswer = 0;
    this.examProgress = 0;
    this.videoProgress = 100;
    this.videoUrl = props.server.url;
    this.videoQuality = props.quality;
    BackHandler.addEventListener('hardwareBackPress', this.onHardPressBack);
  }

  async componentDidMount() {
    await this.getListApi();
    EventService.add('submitQuickTest', this.onListenSubmit);
    EventService.add('doTestAgain', this.onListenDoAgain);
    //check bai giang xem thu
    const tryLesson = this.props.navigation.getParam('isTryLesson');
    this.isTryLesson = tryLesson ? true : false;
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.server !== this.props.server) {
      this.videoUrl = nextProps.server.url;
    }
    if (nextProps.quality !== this.props.quality) {
      this.videoQuality = nextProps.quality;
    }
    if (nextProps.dataVideoNote !== this.props.dataVideoNote) {
      let { listVideoNote } = this.state;
      this.setState({ listVideoNote: [...listVideoNote, { ...nextProps.dataVideoNote }] });
    }
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onHardPressBack);
    EventService.remove('submitQuickTest', this.onListenSubmit);
    EventService.remove('doTestAgain', this.onListenDoAgain);
  }

  onListenDoAgain = () => {
    this.submitTest = 0;
  };

  onListenSubmit = () => {
    this.onSubmitAnswers();
  };

  async getListApi() {
    try {
      LessonActionCreator.getLessonInfo(this.lessonId);

      //danh sach server
      LessonActionCreator.getLessonDetail(this.lessonId, (typeVideo, totalAnswer, kaiwaLesson, listVideo) => {
        this.typeVideo = typeVideo;
        this.totalAnswer = totalAnswer;
        this.kaiwaLesson = kaiwaLesson;
        this.onLoadVideo(listVideo);
      });

      //Lấy list câu hỏi của video
      LessonActionCreator.getVideoQuestion();
    } catch (err) {
      Funcs.log(err);
    }
  }

  getVideoIdYouTube = (link) => {
    let linkFormat = link.split('/');
    if (link.indexOf('v=') !== -1) {
      const index = link.indexOf('=');
      this.videoName = link.substr(index + 1, link.length);
      if (this.videoName.indexOf('&') !== -1) {
        const indexChild = this.videoName.indexOf('&');
        this.videoName = this.videoName.substr(0, indexChild);
      }
    } else if (linkFormat[0] == 'http:' || linkFormat[0] == 'https:') {
      this.videoName = linkFormat[linkFormat.length - 1];
    }
  };

  onHardPressBack = () => {
    const fullScreenVideo = this.ContentDetailLesson?.state?.fullScreenVideo;
    if (fullScreenVideo) {
      this.ContentDetailLesson.onLockPotraitScreen();
    } else {
      this.onBackPress();
    }
    return true;
  };

  onBackPress = async () => {
    StatusBar.setBarStyle('dark-content', true);
    StatusBar.setHidden(false, 'slide');
    //tinh progress bai test
    if (this.kaiwaLesson) {
      this.examProgress = this.props.percentKaiwa;
    }
    if (this.totalAnswer == 0 || this.submitTest == 100) {
      this.examProgress = 100;
    }
    if (this.ContentDetailLesson?.getExamProgress()) this.examProgress = 100;
    if (this.typeVideo == 'youtube' && this.videoName.length !== 0) {
      // tinh progress khi choi video youtube
      this.videoProgress = await this.ContentDetailLesson.getCurrentTimeYoutube();
    } else if (this.videoName.length !== 0 && this.ContentDetailLesson) {
      // tinh progress khi choi video bang player
      this.videoProgress = this.ContentDetailLesson.getCurrentTimeVideo();
    }
    this.onBackPressChooseLesson();

    // post flashcard finish
    if (this.ContentDetailLesson) this.ContentDetailLesson.updateFlashCard();
  };

  onBackPressChooseLesson = () => {
    if (this.typeCard) {
      this.videoProgress = 0;
      this.examProgress = 0;
    }
    if (this.props.navigation.state.params.updateProgressLesson) {
      this.updateProgressLesson();
    } else if (this.props.navigation.state.params.updateData) {
      this.props.navigation.state.params.updateData();
    } else if (this.props.navigation.state.params.updateSpeedPlay) {
      this.props.navigation.state.params.updateSpeedPlay();
    }
    NavigationService.pop();
  };

  onVideoEnd = () => {
    this.videoProgress = 100;
    this.examProgress = 100;
    this.updateProgressLesson();
  };

  updateProgressLesson = () => {
    let params = this.props.navigation.state.params.item;
    this.props.navigation.state.params.updateProgressLesson(
      this.videoProgress,
      this.examProgress,
      this.lessonId,
      this.lessonGroupId,
      params.selected,
      parseInt(params.courseId)
    );
  };

  onSubmitAnswers = () => {
    this.submitTest = 100;
  };

  onLoadVideo = (listVideo) => {
    //xử lý add chọn video đầu tiên để phát
    listVideo.map((e, index) => {
      e.choose = index == 0;
      return e;
    });
    this.setState({ listVideo, loading: false }, () => {
      for (let i = 0; i < listVideo.length; i++) {
        if (listVideo[i].choose) {
          this.videoName = listVideo[i].video_name;
          this.videoTitle = listVideo[i]?.video_title;
          this.videoID = listVideo[i].id;
          this.getListTextNoteVideo(this.videoID);
          const videoLink =
            this.typeVideo == 'video' ? this.videoUrl + `${'/'}${this.videoQuality}${'/'}` + this.videoName + Const.VIDEO_CONFIG.FILE_NAME : listVideo[i].value;
          this.setState({ videoLink });
          this.getVideoIdYouTube(this.videoName);
        }
      }
    });
  };

  getListTextNoteVideo = async (videoId) => {
    try {
      let listVideoNote = await VideoNoteController.getBy('video.id', videoId);
      if (listVideoNote?.length > 0) {
        listVideoNote = listVideoNote.map((item) => {
          return {
            id: item?.id,
            video: item.video?.id,
            content: item?.content,
            duration: item?.duration
          };
        });
        this.setState({ listVideoNote });
      }
    } catch (error) {
      Funcs.log('###VideoNote', error);
      this.setState({ listVideoNote: [] });
    }
  };

  onPressChangeVideo = (item) => {
    this.typeVideo == 'video' ? this.ContentDetailLesson.videoResetTime(0) : null;
    let { listVideo } = this.state;
    listVideo.map((e) => {
      e.choose = e.id == item.id;
      return e;
    });
    this.setState({ listVideo }, () => {
      for (let i = 0; i < listVideo.length; i++) {
        if (listVideo[i].choose) {
          this.videoName = listVideo[i].video_name;
          this.videoTitle = listVideo[i]?.video_title;
          this.videoID = listVideo[i].id;
          const videoLink =
            this.typeVideo == 'video' ? this.videoUrl + `${'/'}${this.videoQuality}${'/'}` + this.videoName + Const.VIDEO_CONFIG.FILE_NAME : listVideo[i].value;
          this.setState({ videoLink });
          this.typeVideo == 'video' ? this.ContentDetailLesson.videoPlayVideo() : null;
          this.typeVideo == 'video' ? this.ContentDetailLesson.videoHideController() : null;
          this.getVideoIdYouTube(this.videoName);
        }
      }
    });
  };

  onChangeLinkVideo = (type) => {
    let videoLink = this.videoUrl + `${'/'}${Const.VIDEO_QUALITY[type]}${'/'}` + this.videoName + Const.VIDEO_CONFIG.FILE_NAME;
    this.setState({ videoLink }, () => {
      this.ContentDetailLesson.changeLinkVideoSeekTime();
    });
  };

  onPressDownloadVideo = async () => {
    let videoLink = this.videoUrl + `${'/'}${Const.VIDEO_QUALITY['480p']}${'/'}` + this.videoName + Const.VIDEO_CONFIG.FILE_NAME;
    let videoLinkTs = this.videoUrl + `${'/'}${Const.VIDEO_QUALITY['480p']}${'/'}` + this.videoName;
    let videoDir = this.videoName;
    let data = {
      videoId: this.videoID,
      videoLink,
      videoLinkTs,
      videoDir
    };
    DownloadVideoService.download({
      data,
      onStart: () => {
        this.insertData();
      },
      onProgress: (received, total) => {
        const downloadProgress = (received / total) * 100;
        this.onUpdateProgress(downloadProgress);
      },
      onFinish: () => {
        this.onUpdateProgress(100);
        VideoController.add({ id: this.videoID, isDownloadFinish: true }, true);
      },
      onError: () => {
        this.onUpdateProgress(-1);
        VideoController.add({ id: this.videoID, isDownloadFinish: null }, true);
      }
    });
  };

  onUpdateProgress = (downloadProgress) => {
    VideoDownloadActionCreator.onVideodownloadProgress({
      downloadProgress,
      videoId: this.videoID,
      lessonId: this.params.item?.id,
      groupId: this.params.item?.group_id
    });
  };

  insertData = () => {
    // thêm data vào bảng
    let courseData = {
      id: parseInt(this.params.item.courseId),
      name: this.params.item.courseName,
      expiredDate: this.params.item.course_expired_day
    };
    let lessonGroupData = {
      id: this.params.item.group_id,
      name: this.params.item && this.params.item?.lessonGroupName ? this.params.item.lessonGroupName : this.params.itemLesson?.name,
      sort: this.params.itemLesson?.sort
    };
    let lessonData = {
      id: this.params.item.id,
      name: this.params.item.name,
      sort: this.params.item?.sort_order
    };
    let videoData = {
      id: this.videoID,
      title: this.videoTitle,
      lessonId: this.params.item.id,
      downloadPath: this.videoName
    };
    this.insertDataRealmDatabase(courseData, lessonGroupData, lessonData, videoData);
  };

  insertDataRealmDatabase = async (courseData, groupData, lessonData, videoData) => {
    const course = await CourseController.add(courseData);
    const group = await LessonGroupController.add({ ...groupData, course });
    LessonController.add({ ...lessonData, course, group });
    VideoController.add({ ...videoData });
  };

  onChangeServerVideo = (url) => {
    let videoLink = url + `${'/'}${this.videoQuality}${'/'}` + this.videoName + Const.VIDEO_CONFIG.FILE_NAME;
    this.setState({ videoLink }, () => {
      this.ContentDetailLesson.changeLinkVideoSeekTime();
    });
  };

  unFinishVocabulary = () => {
    const { listDocument } = this.props;
    let unfinish = [];
    if (listDocument) {
      unfinish = listDocument.filter((item) => item.memorized !== true);
    }
    return unfinish;
  };

  finishVocabulary = () => {
    const { listDocument } = this.props;
    let finish = [];
    if (listDocument) {
      finish = listDocument.filter((item) => item.memorized === true);
    }
    return finish;
  };

  checkTypeCard = (data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === Const.LESSON_TYPE.FLASHCARD) {
        return data[i].type;
      }
    }
  };

  onNavigateHistoryTest = (section, item, videoProgress, examProgress) => {
    NavigationService.replace(ScreenNames.HistoryTestLessonResultScreen, {
      section,
      item,
      videoProgress,
      examProgress,
      lessonId: this.lessonId,
      groupLessonId: this.lessonGroupId,
      reload: this.props.navigation.state.params.updateProgressLesson
    });
  };

  render() {
    const { params } = this;
    const typeNotify = params.typeNotify;
    const { fullScreenVideo, listData, heightHeader, listVideoNote } = this.state;
    const { lessonInfo, listDocument, lessonCondition } = this.props;
    //Check data flashcard
    let listUnFinish = this.unFinishVocabulary();
    let listFinish = this.finishVocabulary();
    let dataFlashCard = [];
    if (params.type === Const.TYPE_CARD.UNFINISH) {
      dataFlashCard = listUnFinish;
    } else if (params.type === Const.TYPE_CARD.FINISH) {
      dataFlashCard = listFinish;
    } else {
      if (listDocument) {
        dataFlashCard = [...listDocument];
      }
    }
    let checkTypeCard = this.checkTypeCard(dataFlashCard);
    this.typeCard = checkTypeCard;
    let courseName = lessonInfo?.courseName ? lessonInfo?.courseName : '';
    const nameCourse = Lang.learn.text_cours + ' ' + courseName;
    let hideStatusBar = false;
    if (fullScreenVideo || (heightHeader == 0 && !isIphoneX())) {
      hideStatusBar = true;
    } else {
      hideStatusBar = false;
    }
    const lessonType = lessonCondition?.lessonType;
    if (lessonType == Const.LESSON_TYPE.PICTURE_GUESS && Configs.enabledFeature.pictureGuess) return <GuessImageView params={params} />;
    return (
      <KeyboardHandle verticalAndroid={heightHeader > 0 || fullScreenVideo ? -500 : 0}>
        {lessonType == Const.LESSON_TYPE.QUIZ_TEST ? (
          <TabQuickTest
            screenProps={{
              typeNotify: typeNotify,
              params: params,
              dataReply: params.item.dataNoti,
              onFocusInputComment: this.onFocusInputComment,
              onBlurInputComment: this.onBlurInputComment,
              listData: listData,
              lessonId: this.lessonId,
              nameCourse: nameCourse,
              onBackPress: this.onBackPress
            }}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <StatusBar hidden={hideStatusBar} translucent={true} />
            <ContentDetailLesson
              {...this.props}
              onBackPress={this.onBackPress}
              parentState={this.state}
              typeNotify={typeNotify}
              ref={(refs) => (this.ContentDetailLesson = refs)}
              videoName={this.videoName}
              nameCourse={nameCourse}
              checkTypeCard={checkTypeCard}
              isTryLesson={this.isTryLesson}
              typeVideo={this.typeVideo}
              params={params}
              course={params.course}
              videoID={this.videoID}
              lessonId={this.lessonId}
              listVideoNote={listVideoNote}
              lessonGroupId={this.lessonGroupId}
              totalAnswer={this.totalAnswer}
              onVideoEnd={this.onVideoEnd}
              onChangeLinkVideo={this.onChangeLinkVideo}
              onChangeServerVideo={this.onChangeServerVideo}
              onPressDownloadVideo={this.onPressDownloadVideo}
              onPressChangeVideo={this.onPressChangeVideo}
              onBackPressChooseLesson={this.onBackPressChooseLesson}
              dataFlashCard={dataFlashCard}
              listFinish={listFinish}
              onNavigateHistoryTest={this.onNavigateHistoryTest}
            />
          </View>
        )}
      </KeyboardHandle>
    );
  }
}

const mapStateToProps = (state) => ({
  server: state.changeServerReducer.server,
  quality: state.qualityVideoReducer.quality,
  percentKaiwa: state.percentKaiwaReducer.percent,
  listDocument: state.lessonReducer.listDocument,
  lessonInfo: state.lessonReducer.lessonInfo,
  lessonCondition: state.lessonReducer.lessonCondition,
  dataVideoNote: state.videoNoteReducer.dataNote
});

const mapDispatchToProps = { onChangeServerVideo, onSaveServer, resetLessonDetail, resetLessonInfo };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(DetailLessonScreen);
