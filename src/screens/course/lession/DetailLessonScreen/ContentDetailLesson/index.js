import Colors from 'assets/Colors';
import Resource from 'assets/Resource';
import Styles from 'assets/Styles';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import IPhoneXHelper, { isIphoneX } from 'common/helpers/IPhoneXHelper';
import NavigationService from 'common/services/NavigationService';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, FlatList, PanResponder, StatusBar, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Spinner from 'react-native-spinkit';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import { connect } from 'react-redux';
import BaseVideoPlayer from 'screens/components/BaseVideoPlayer';
import HeaderLesson from './HeaderLesson';
import ListVideo from './ListVideo';
import TabDetailLesson from './TabDetailLesson';
import YoutubePlayer from './YoutubePlayer';

const HEIGHR_HEADER = 50 * Dimension.scale;
let STATUS_BAR_HEIGHT = IPhoneXHelper.getStatusBarHeight();

const isNotch = STATUS_BAR_HEIGHT > 24;
let notchRange = isNotch ? STATUS_BAR_HEIGHT : 0;
class ContentDetailLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullScreenVideo: false,
      listVideoState: true,
      showContent: false,
      itemTextNote: {}
    };

    this.totalMove = HEIGHR_HEADER + STATUS_BAR_HEIGHT;
    this.pageY = 0;
    this.top = false;
    this.bottom = true;
    this.AnimVideo = new Animated.ValueXY({ x: 0, y: this.totalMove });
    this.locationY = 0;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 2 || gestureState.dy < -2;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dy > 2 || gestureState.dy < -2;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 2 || gestureState.dy < -2;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dy > 2 || gestureState.dy < -2;
      },
      onPanResponderGrant: (evt, gestureState) => {
        if (this.top) this.locationY = notchRange;
        else this.locationY = this.totalMove;
      },
      onPanResponderMove: (evt, gestureState) => {
        let range = this.locationY + gestureState.dy;
        let ratio = (range / this.totalMove) * 100;
        if (ratio >= 100.0) ratio = 100.0;
        else if (ratio <= 0) ratio = 0.0;
        let moveY = (ratio / 100) * this.totalMove;
        if (moveY <= (notchRange / this.totalMove) * this.totalMove) moveY = (notchRange / this.totalMove) * this.totalMove;
        this.AnimVideo.setValue({ x: 0, y: moveY });
      },
      onPanResponderRelease: (evt, gestureState) => {
        let range = this.locationY + gestureState.dy;
        let ratio = (range / this.totalMove) * 100;
        if (ratio >= 100.0) ratio = 100.0;
        else if (ratio <= 0) ratio = 0.0;
        if (ratio <= 50.0) {
          this.top = true;
          !isIphoneX() && !isNotch ? StatusBar.setHidden(true, 'slide') : null;
          Animated.timing(this.AnimVideo.y, {
            toValue: notchRange,
            duration: 200
          }).start();
        } else if (ratio > 30.0) {
          this.top = false;
          this.top = false;
          this.bottom = true;
          !isIphoneX() || !isNotch ? StatusBar.setHidden(false, 'slide') : null;
          Animated.timing(this.AnimVideo.y, {
            toValue: this.totalMove,
            duration: 200
          }).start();
        }
        this.AnimVideo.flattenOffset();
      }
    });
  }

  onVideoEndYoutube = () => {
    Animated.timing(this.AnimVideo.y, {
      toValue: this.totalMove,
      duration: 200
    }).start();
  };

  onVideoEnd = () => {
    this.props.onVideoEnd();
  };

  updateFlashCard = async () => {
    const listDocument = this.props;
    const { lessonId } = this.props;
    if (this.typeCard) {
      let dataFinish = this.TabDetailLesson.finishCard();
      let dataUnFinish = this.TabDetailLesson.unfinishCard();
      if (dataFinish.length > 0 || dataUnFinish.length > 0) {
        if (dataFinish) {
          var idCardFinish = [];
          var idCardUnFinish = [];
          let listNotLearn = listDocument.filter((item) => {
            if (dataFinish.length === 0) {
              return item;
            } else {
              for (let i = 0; i < dataFinish.length; i++) {
                if (item.id === dataFinish[i].id) {
                  break;
                } else if (i === dataFinish.length - 1) {
                  return item;
                }
              }
            }
          });
          for (let i = 0; i < dataFinish.length; i++) {
            idCardFinish.push(dataFinish[i].id);
          }
          for (let j = 0; j < dataUnFinish.length; j++) {
            idCardUnFinish.push(dataUnFinish[j].id);
          }
          listNotLearn = listNotLearn.map((item) => item.id);
          let objectCard = {
            remember: JSON.stringify(idCardFinish),
            nonRemember: JSON.stringify(listNotLearn)
          };
          await Fetch.post(Const.API.FLASHCARD.UPDATE_FLASHCARD, objectCard, true);
        }
        // save list unfinish Card
        if (dataUnFinish.length > 0) {
          let flashcardUnFinish = {
            lessonId: lessonId,
            data: dataUnFinish
          };
          StorageService.save(Const.DATA.UNFINISH_FLASHCARD, flashcardUnFinish);
        }
      }
    }
  };

  onPressGoChooseLesson = () => {
    const { lessonInfo, typeVideo, course } = this.props;
    //Screen name and params pass
    let screenName = lessonInfo?.isStillTime ? ScreenNames.ChooseLessionScreen : ScreenNames.DetailBuyCourseScreen;
    if (lessonInfo?.isStillTime || lessonInfo?.courseName == 'N5') screenName = ScreenNames.CourseProgressScreen;
    if (!lessonInfo?.isStillTime) screenName = ScreenNames.DetailBuyCourseScreen;
    let params = { course_id: lessonInfo?.courseId, title: course?.name };
    let item = { id: lessonInfo?.courseId, name: course?.name };
    let data = {
      typeView: Const.TYPE_VIEW_DUNGMORI,
      isStillExpired: lessonInfo?.isStillTime,
      buyCourse: course,
      type: 'buyCourse'
    };
    lessonInfo?.isStillTime ? (data.params = params) : (data.item = item);

    //Paused video khi chuyen man hinh
    typeVideo == 'video' ? this.VideoRef?.VideoPlayer.setState({ pauseVideo: true }) : null;
    if (typeVideo == 'youtube') {
      this.YouTube.setState({ youtubePlaying: false });
    }
    this.setState({
      youtubePlaying: false,
      heightHeader: HEIGHR_HEADER
    });
    NavigationService.navigate(screenName, data);
  };

  onVideoFullScreen = () => {
    this.setState({ fullScreenVideo: !this.state.fullScreenVideo }, () => {
      if (!this.state.fullScreenVideo) StatusBar.setHidden(false);
      else StatusBar.setHidden(true);
    });
  };

  onChangeLinkVideo = (url) => this.props.onChangeLinkVideo(url);

  onchangeServerVideo = (url) => this.props.onChangeServerVideo(url);

  onPressDownloadVideo = () => this.props.onPressDownloadVideo();

  onPressChangeVideo = (item) => this.props.onPressChangeVideo(item);

  videoHideController = () => this.VideoRef?.VideoPlayer.hideControler().start();

  videoPlayVideo = () => this.VideoRef?.VideoPlayer.setState({ pauseVideo: false });

  videoResetTime = () => this.VideoRef?.VideoPlayer.setCurrentTime(0);

  pauseVideo = () => this.VideoRef?.VideoPlayer.setState({ pauseVideo: true });

  changeLinkVideoSeekTime = () => {
    return this.VideoRef?.VideoPlayer.handleChageVideolinkSeekTime();
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

  getCurrentTimeYoutube = async () => {
    let currentTime = 0;
    try {
      currentTime = await this.YouTube?.getCurrentTime();
      if (currentTime >= 95) currentTime = 100;
    } catch (error) {
      Funcs.log(error);
    }
    return currentTime;
  };

  getCurrentTimeVideo = () => {
    let currentTime = 0;
    currentTime = Math.round(this.VideoRef?.VideoPlayer?.state.percent * 100);
    if (currentTime >= 95) currentTime = 100;
    return currentTime;
  };

  onPauseVideo = () => this.VideoRef?.VideoPlayer.setState({ pauseVideo: true });

  onSubmitAnswers = () => {
    this.submitTest = 100;
  };

  getExamProgress = () => {
    return this.submitTest;
  };

  onShowTestResult = (section, item) => {
    const { videoName, lessonInfo } = this.props;
    let videoProgress = 100;
    let examProgress = 0;
    if (videoName.length !== 0 && this.VideoRef?.VideoPlayer && this.VideoRef?.VideoPlayer.state) {
      videoProgress = Math.round(this.VideoRef?.VideoPlayer.state.percent * 100);
    }
    if (lessonInfo?.isExam == 0 || this.submitTest == 100) {
      examProgress = 100;
    }
    this.props.onNavigateHistoryTest(section, item, videoProgress, examProgress);
  };

  onChangeListVideo = (showVideo) => {
    let listVideoState = false;
    if (showVideo) listVideoState = true;
    this.setState({ listVideoState });
  };

  onLockPotraitScreen = () => {
    this.setState({ fullScreenVideo: false }, () => {
      this.VideoRef?.VideoPlayer.onHardBackPress();
    });
  };

  flashcardType = () => this.TabDetailLesson.flashCardRef;

  onBackPress = () => {
    this.props.onBackPress();
  };

  onPressShowContentVideoNote = (item) => () => {
    const { listVideoNote } = this.props;
    for (let i = 0; i < listVideoNote.length; i++) {
      if (listVideoNote[i].id === item.id) {
        item.isShow = true;
      } else {
        item.isShow = false;
      }
    }
    // this.setState({ itemTextNote: item });
  };

  onLayout = (event) => {
    this.ViewVideo?.getNode().measure((x, y, w, h, px, py) => {
      this.pageY = py;
    });
  };

  renderVideo = () => {
    const { typeVideo, videoName, params, videoID, parentState } = this.props;
    const { fullScreenVideo } = this.state;
    if (typeVideo == 'youtube' && videoName?.length > 0) {
      return (
        <YoutubePlayer
          ref={(refs) => (this.YouTube = refs)}
          videoName={videoName}
          fullScreenVideo={fullScreenVideo}
          params={params}
          onEndYoutube={this.onVideoEndYoutube}
        />
      );
    } else if (parentState.videoLink?.length !== 0) {
      return (
        <BaseVideoPlayer
          videoOnline
          params={params}
          nameVideo={videoName}
          ref={(ref) => (this.VideoRef = ref)}
          videoID={videoID}
          url={parentState.videoLink}
          onVideoEnd={this.onVideoEnd}
          onVideoFullScreen={this.onVideoFullScreen}
          changLinkVideo={this.onChangeLinkVideo}
          changeServerVideo={this.onchangeServerVideo}
          downloadVideoOffline={this.onPressDownloadVideo}
        />
      );
    } else return null;
  };

  renderHeader = () => {
    const { nameCourse, isTryLesson, checkTypeCard, lessonInfo } = this.props;
    const { fullScreenVideo } = this.state;
    if (fullScreenVideo) return null;
    return (
      <HeaderLesson
        heightHeader={this.AnimVideo.y}
        nameCourse={nameCourse}
        isTryLesson={isTryLesson}
        lessonName={lessonInfo?.lessonName || ''}
        onBackPress={this.onBackPress}
        onPressGoChooseLesson={this.onPressGoChooseLesson}
        checkTypeCard={checkTypeCard}
        buttonRight={this.onPressGoChooseLesson}
        isStillTime={lessonInfo?.isStillTime}
        courseName={lessonInfo?.courseName}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.buttonTime} onPress={this.onPressShowContentVideoNote(item)}>
        <BaseText>{item.duration}</BaseText>
      </TouchableOpacity>
    );
  };

  renderContent = () => {
    const {
      heightHeader,
      parentState,
      videoName,
      params,
      typeNotify,
      lessonId,
      typeVideo,
      checkTypeCard,
      dataFlashCard,
      listFinish,
      lessonInfo,
      listQuestions,
      listDocument,
      listVideoNote
    } = this.props;
    const { itemTextNote, showContent, fullScreenVideo } = this.state;
    this.typeCard = checkTypeCard;
    let checkTabRender = false;
    let checkRenderComment = false;
    const { loading, listVideo } = this.props.parentState;
    if (listVideo?.length <= 1) {
      checkTabRender = listQuestions?.length !== 0 || listDocument?.length !== 0;
      checkRenderComment = listQuestions?.length == 0 && listDocument?.length == 0 && !loading;
    } else {
      checkTabRender = (listQuestions?.length !== 0 || listDocument?.length !== 0) && listVideo?.length == 1;
      checkRenderComment = (listQuestions?.length == 0 && listDocument?.length == 0 && !loading) || listVideo?.length > 1;
    }
    let panResponder = { ...this.panResponder.panHandlers };
    if (this.props.isSliding) panResponder = null;
    return (
      <View style={{ flex: 1 }}>
        <Animated.View {...panResponder} ref={(refs) => (this.ViewVideo = refs)} onLayout={this.onLayout}>
          {this.renderVideo()}
        </Animated.View>
        {listVideoNote?.length > 0 ? (
          <Animated.View style={styles.viewVideoNote}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              data={listVideoNote}
              horizontal
              extraData={this.state}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
            {showContent ? (
              <View style={styles.viewContent}>
                <BaseText>{itemTextNote?.content}</BaseText>
              </View>
            ) : null}
          </Animated.View>
        ) : null}
        {listVideo?.length > 1 && (
          <ListVideo
            onPressChangeVideo={this.onPressChangeVideo}
            listVideo={listVideo}
            heightHeader={heightHeader}
            ref={(refs) => (this.ListVideo = refs)}
            onChangeListVideo={this.onChangeListVideo}
          />
        )}
        <TabDetailLesson
          ref={(refs) => (this.TabDetailLesson = refs)}
          listVideo={parentState.listVideo}
          listVideoState={this.state.listVideoState}
          videoName={videoName}
          showVideo={parentState.showVideo}
          loading={parentState.loading}
          disableMoveTab={parentState.disableMoveTab}
          checkTabRender={checkTabRender}
          params={params}
          typeNotify={typeNotify}
          courseName={lessonInfo?.courseName}
          kaiwaNo2Demo={parentState.kaiwaNo2Demo}
          lessonId={lessonId}
          checkTypeCard={checkTypeCard}
          dataFlashCard={dataFlashCard}
          listFinish={listFinish}
          checkRenderComment={checkRenderComment}
          onPauseVideo={this.onPauseVideo}
          typeVideo={typeVideo}
          isExam={lessonInfo?.isExam}
          onSubmitAnswers={this.onSubmitAnswers}
          onShowTestResult={this.onShowTestResult}
          onPressIgnore={this.onBackPress}
          fullScreenVideo={fullScreenVideo}
        />
      </View>
    );
  };

  render() {
    const { loading } = this.props.parentState;
    return (
      <View style={Styles.flex}>
        {this.renderHeader()}
        {loading ? (
          <View style={[Styles.flex, Styles.center]}>
            <Spinner size={30} type={'Circle'} color={Colors.primaryColor} />
          </View>
        ) : (
          this.renderContent()
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  listDocument: state.lessonReducer.listDocument,
  listQuestions: state.lessonReducer.listQuestions,
  lessonInfo: state.lessonReducer.lessonInfo,
  isSliding: state.slidingReducer.isSliding
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(ContentDetailLesson);

const styles = StyleSheet.create({
  viewVideoNote: {
    justifyContent: 'center',
    paddingVertical: 10
  },
  buttonTime: {
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Resource.colors.grey400,
    backgroundColor: Resource.colors.white100,
    paddingHorizontal: 7,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginLeft: 10
  },
  viewContent: {
    paddingVertical: 15,
    alignItems: 'center'
  }
});
