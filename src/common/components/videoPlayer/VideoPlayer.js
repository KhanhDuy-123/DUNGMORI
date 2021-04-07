import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import AppConst from 'consts/AppConst';
import Const from 'consts/Const';
import React from 'react';
import { Animated, Easing, NativeModules, Platform, TouchableWithoutFeedback, View } from 'react-native';
import KeepAWake from 'react-native-keep-awake';
import { hideNavigationBar, showNavigationBar } from 'react-native-navigation-bar-color';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import { connect } from 'react-redux';
import SurveyQuestion from 'screens/course/lession/SurveyQuestion';
import ChooseOption from './containers/ChooseOption';
import ControllerBottom from './containers/ControllerBottom';
import ControllerTop from './containers/ControllerTop';
import ModalVideoNote from './containers/ModalVideoNote';
import PlayButton from './containers/PlayButton';
import { styles } from './containers/Styles';
import LoadingVideo from './LoadingVideo';

const { NavigationBarColor } = NativeModules;

const width = Dimension.widthParent;
const height = Dimension.heightParent;
const HEIGHT_VIDEO = (width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT;

class VideoPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    let keepLearning = false;
    this.videoProgress = 0;
    if (props.params && props.params.item) {
      this.videoProgress = props.params.item.videoProgress;
      keepLearning = props.params.item.keepLearning;
    }
    this.state = {
      pauseVideo: false,
      percent: 0,
      speedPlayVideo: 1.0,
      totalTime: 0,
      showController: false,
      alwayShowController: true,
      showServer: false,
      showChooselink: false,
      showSpeed: false,
      fullScreen: false,
      loading: true,
      keepLearning,
      showSurvey: false,
      activeSurvey: true,
      video: { width: width, height: HEIGHT_VIDEO }
    };
    this.fadeView = new Animated.Value(1);
    this.spinValue = new Animated.Value(0);
    this.showSurvey = false;
    this.surveyQuestion = {};
    this.saveCurrentTime = 0;
  }

  componentDidMount() {
    this.animated = this.showControler().start();
    this.spin();
    if (AppConst.IS_ANDROID) KeepAWake.activate();
  }

  componentWillUnmount() {
    this.clearAllTimeout();
    if (AppConst.IS_ANDROID) KeepAWake.deactivate();
  }

  spin = () => {
    this.spinValue.setValue(0);
    Animated.timing(this.spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear
    }).start(() => this.spin());
  };

  onLoadVideoStart = () => {
    this.setState({ loading: true });
  };

  setCurrentTime = (time) => {
    this.saveCurrentTime = time;
    this.ControllerBottom?.setCurrentTime(time);
  };

  caculTimePlay = (timeProgress) => {
    //tinh thoi gian cua video
    var timeStr = '00:00:00';
    try {
      var second = timeProgress % 60;
      var hour = Math.floor(timeProgress / 3600);
      const hourRedu = timeProgress / 3600 - hour;
      var min = Math.floor(Math.round(hourRedu * 3600) / 60);
      if (second < 60) {
        second = parseInt(second);
      }
      if (second < 10) {
        second = '0' + parseInt(second);
      }
      if (min < 10) {
        min = '0' + min;
      }
      if (hour < 10) {
        hour = '0' + parseInt(hour);
      }
      timeStr = hour + ':' + min + ':' + second;
    } catch (err) {
      console.log('ERROR', err);
    }
    return timeStr;
  };

  onPressChangLink = (type) => {
    //luu thoi gian video dang choi hien tai
    this.setState({ pauseVideo: true, showChooselink: false, loading: true }, () => {
      this.props.changLinkVideo(type);
      this.saveCurrentTime = this.getCurrentTime();
    });
  };

  onPressChangeServer = (url) => {
    this.setState({ pauseVideo: true, showServer: false, loading: true }, () => {
      this.props.changeServerVideo(url);
      this.saveCurrentTime = this.getCurrentTime();
    });
  };

  onPressDownloadVideo = () => {
    this.props.downloadVideoOffline();
  };

  onHardBackPress = () => {
    this.setState({ fullScreen: false, showSurvey: false, video: { width: width, height: HEIGHT_VIDEO } }, () => {
      showNavigationBar();
      Orientation.lockToPortrait();
      this.SurveyQuestion?.hideSurvey();
      this.animated?.stop();
      this.animated = this.alwayShowControll(1500).start();
    });
  };

  onPressFullScreen = () => {
    let fullScreenVideo = !this.state.fullScreen;
    let video = { ...this.state.video };
    let pauseVideo = this.state.pauseVideo;
    if (fullScreenVideo) {
      Platform.OS == 'android' && NavigationBarColor ? hideNavigationBar() : null;
      video = { width: height, height: width };
      if (this.showSurvey && fullScreenVideo == true && this.state.pauseVideo && this.surveyQuestion.type == 1) {
        pauseVideo = false;
      }
    } else {
      Platform.OS == 'android' && NavigationBarColor ? showNavigationBar() : null;
      this.showSurvey = false;
      video = {
        width: width,
        height: (width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT
      };
    }
    if (fullScreenVideo) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
    this.setState({ fullScreen: fullScreenVideo, showSurvey: this.showSurvey, video, pauseVideo }, () => {
      this.props.onFullScreen();
    });
  };

  onPressSpeed = (speed) => {
    if (this.animated) this.animated.stop();
    this.clearAllTimeout();
    this.setState({ speedPlayVideo: Const.VIDEO_SPEED[`${speed}${'x'}`], showSpeed: false });
    this.animated = this.hideControler().start();
  };

  onPressShowSpeedPlay = () => {
    if (this.animated) this.animated.stop();
    this.clearAllTimeout();
    let showSpeed = !this.state.showSpeed;
    this.setState({ showSpeed, showChooselink: false, showServer: false }, this.onAlwayShowOption);
  };

  onPressShowServer = () => {
    //hien thi danh sach server
    if (this.animated) this.animated.stop();
    this.clearAllTimeout();
    let showServer = !this.state.showServer;
    this.setState({ showServer, showChooselink: false, showSpeed: false }, this.onAlwayShowOption);
  };

  onPressShowQuality = () => {
    //hien thi danh sach do phan giai cua video
    if (this.animated) this.animated.stop();
    this.clearAllTimeout();
    let showChooselink = !this.state.showChooselink;
    this.setState({ showChooselink, showServer: false, showSpeed: false }, this.onAlwayShowOption);
  };

  onAlwayShowOption = () => {
    const { showChooselink, showServer, showSpeed, pauseVideo } = this.state;
    if (showChooselink == true || showServer == true || pauseVideo == true || showSpeed == true) {
      this.animated = this.showControler().start();
    } else {
      this.animated = Animated.sequence([Animated.delay(1000), this.hideControler()]);
      this.animated.start();
    }
  };

  handleChageVideolinkSeekTime = () => {
    if (this.animated) this.animated.stop();
    this.hideControler().start();
    this.setState({ pauseVideo: false, loading: false });
  };

  onPressForwardVideo = () => {
    //tua nhanh 10s video
    let pauseVideos = this.state.pauseVideo;
    const { totalTime } = this.state;
    let playingTime = this.getCurrentTime();
    this.clearAllTimeout();
    if (this.animated) this.animated.stop();
    this.animated = this.showControler().start();
    if (totalTime - playingTime < 10) return;
    playingTime = playingTime + 10;
    this.ControllerBottom?.setCurrentTime(playingTime);
    this.setState({ pauseVideo: pauseVideos, alwayShowController: false }, () => {
      this.VideoPlayer.seek(playingTime, 0);
      this.clearAllTimeout();
      this.timer = setTimeout(() => {
        const { pauseVideo } = this.state;
        this.setState({ alwayShowController: pauseVideo ? false : true });
        this.hideControler().start();
      }, 2000);
    });
  };

  onPressPreviousVideo = () => {
    //tua lai 10s video
    let pauseVideos = this.state.pauseVideo;
    this.clearAllTimeout();
    let playingTime = this.getCurrentTime();
    if (this.animated) this.animated.stop();
    this.animated = this.showControler().start();
    if (playingTime < 10) return;
    else {
      playingTime = playingTime - 10;
      this.ControllerBottom?.setCurrentTime(playingTime);
      this.setState({ pauseVideo: pauseVideos, alwayShowController: false }, () => {
        this.VideoPlayer.seek(playingTime, 0);
        this.clearAllTimeout();
        this.timer = setTimeout(() => {
          const { pauseVideo } = this.state;
          this.setState({ alwayShowController: pauseVideo ? false : true });
          this.hideControler().start();
        }, 2000);
      });
    }
  };

  onPressPlayVideo = () => {
    //xu ly khi chay video
    this.clearAllTimeout();
    let paused = this.state.pauseVideo;
    this.setState({ pauseVideo: !paused }, () => {
      const { pauseVideo } = this.state;
      if (pauseVideo == true) {
        if (this.animated) this.animated.stop();
        this.animated = this.showControler().start();
        this.setState({ alwayShowController: false });
      } else {
        if (this.animated) this.animated.stop();
        this.animated = this.hideControler().start();
        this.setState({ alwayShowController: true });
      }
    });
    if (this.state.percent >= 1.0) {
      this.VideoPlayer.seek(0, 0);
      this.setState({ percent: 0, pauseVideo: false });
    }
  };

  onEndVideo = () => {
    this.clearAllTimeout();
    this.animated && this.animated.stop();
    this.animated = this.showControler().start();
    this.setState({ percent: 1.0, pauseVideo: true, alwayShowController: false });
    this.props.onVideoEnd();
  };

  onChangeValueOfSlider = (percent) => {
    const playingTime = Math.floor(this.state.totalTime * percent);
    this.ControllerBottom?.setCurrentTime(playingTime);
  };

  onSeekVideoComplete = (percent) => {
    this.animated?.stop();
    const { totalTime } = this.state;
    this.setState({ pauseVideo: false, percent: percent }, () => {
      clearTimeout(this.timeSlide);
      this.timeSlide = setTimeout(() => {
        this.setState({ alwayShowController: this.state.pauseVideo ? false : true, percent });
        this.animated = this.hideControler().start();
      }, 2000);
    });
    const seekTime = percent * totalTime;
    this.VideoPlayer.seek(seekTime, 0);
  };

  onSeekVideoStart = () => {
    clearTimeout(this.timeSlide);
    this.animated?.stop();
    this.setState({ pauseVideo: true, alwayShowController: false }, () => {
      this.animated = this.showControler().start();
    });
  };

  onPressVideo = () => {
    const { alwayShowController, showChooselink, showServer, showSpeed, pressSeek } = this.state;
    if (pressSeek) return;
    if (this.animated) this.animated.stop();
    if (showChooselink || showServer || showSpeed) {
      //neu option dang mo thi dong option lai
      this.setState({ showChooselink: false, showServer: false, showSpeed: false });
      this.animated = this.alwayShowControll(1500);
      this.animated.start();
    } else {
      this.animated = this.alwayShowControll(2000);
      this.animated.start();
      if (this.state.pauseVideo) {
        if (alwayShowController) {
          this.animated.stop();
          this.animated = this.showControler().start();
          this.setState({ alwayShowController: false });
        } else {
          this.animated.stop();
          this.animated = this.hideControler().start();
          this.setState({ alwayShowController: true });
        }
      } else {
        if (alwayShowController) {
          this.animated.stop();
          this.setState({ alwayShowController: false }, () => {
            this.animated = this.alwayShowControll(2000);
            this.animated.start(() => this.setState({ alwayShowController: true }));
          });
        } else {
          this.setState({ alwayShowController: true }, () => {
            this.animated = this.hideControler().start();
          });
        }
      }
    }
  };

  alwayShowControll = (duration) => {
    return Animated.sequence([this.showControler(), Animated.delay(duration), this.hideControler()]);
  };

  showControler = () => {
    return Animated.timing(this.fadeView, {
      toValue: 1,
      duration: 200
    });
  };

  hideControler = () => {
    return Animated.timing(this.fadeView, {
      toValue: 0,
      duration: 400
    });
  };

  onLoadVideo = (video) => {
    //load video va check xem thay doi link video dang chay den thoi gian nao
    Funcs.log('Video loaded', video);
    this.animated?.stop();
    this.animated = this.hideControler().start();
    const { keepLearning } = this.state;
    if (keepLearning) {
      let progress = 0;
      progress = Math.round(this.videoProgress * video.duration) / 100;
      this.setState({ totalTime: video.duration, keepLearning: false, loading: false }, () => {
        this.VideoPlayer.seek(progress, 0);
      });
    } else {
      this.setState({ totalTime: video.duration, loading: false }, () => {
        this.VideoPlayer.seek(this.saveCurrentTime, 0);
      });
    }
    this.props.onLoadVideo();
  };

  onProgressVideo = (progress) => {
    if (this.state.pressSeek) return;
    let showSur = this.state.showSurvey;
    const { videoQuestionInfo } = this.props;
    if (videoQuestionInfo) {
      //Lọc lấy câu hỏi survey video
      for (let i = 0; i < videoQuestionInfo.length; i++) {
        let item = { ...videoQuestionInfo[i] };
        if (Math.round(item?.time_start) == Math.round(progress.currentTime) && !this.state.showSurvey) {
          showSur = true;
          this.surveyQuestion = item;
          break;
        }
      }
    }
    this.ControllerBottom?.setCurrentTime(progress.currentTime);

    //Xử lý câu hỏi video
    this.onShowSurvey(showSur);
  };

  onShowSurvey = (showSurvey) => {
    let playingTime = this.getCurrentTime();
    const { fullScreen, activeSurvey } = this.state;
    let pauseVideo = this.state.pauseVideo;
    if (!showSurvey || !activeSurvey) return;
    let semiSurveyScreen = Math.round(playingTime) == Math.round(this.surveyQuestion?.time_start) && !this.showSurvey && !fullScreen && !Dimension.isIPad;
    let fullSurveyScreen = Math.round(playingTime) == Math.round(this.surveyQuestion?.time_start) && !this.showSurvey && (fullScreen || Dimension.isIPad);
    this.animated?.stop();
    this.animated = this.hideControler().start();
    if (semiSurveyScreen || fullSurveyScreen) {
      this.showSurvey = true;
      if (this.surveyQuestion?.type == 2) pauseVideo = true;
    }
    this.SurveyQuestion?.showSurvey(this.surveyQuestion);
    this.setState({ pauseVideo, showSurvey: true });
  };

  seekToTime = (currentTime) => {
    this.VideoPlayer.seek(currentTime, 0);
  };

  getCurrentTime = () => {
    return this.ControllerBottom?.getCurrentTime();
  };

  onErrorVideo = (event) => {
    this.props.onErrorVideo(event);
  };

  onPressAddNote = () => {
    this.setState({ pauseVideo: true }, () => {
      this.textNoteRef.showModal();
    });
  };

  onPauseVideo = () => {
    this.setState({ pauseVideo: false });
  };

  onHideSurvey = () => {
    if (this.surveyQuestion?.type == 2) this.VideoPlayer.seek(this.getCurrentTime() + 1, 0);
    this.setState({ showSurvey: false, pauseVideo: false, alwayShowController: true });
    this.showSurvey = false;
  };

  onStartPressSlider = () => {
    this.animated?.stop();
    clearTimeout(this.timeSlide);
    this.fadeView.setValue(1);
    this.setState({ pauseVideo: true, alwayShowController: false, pressSeek: true });
  };

  onPressSeekSliderComplete = (percent) => {
    this.VideoPlayer.seek(percent * this.state.totalTime, 0);
    const playingTime = percent * this.state.totalTime;
    this.ControllerBottom?.setCurrentTime(playingTime);
    setTimeout(() => {
      this.setState({ pauseVideo: false, pressSeek: false, percent });
    }, 150);
    clearTimeout(this.timeSlide);
    this.timeSlide = setTimeout(() => {
      this.animated?.stop();
      this.animated = this.hideControler().start(() => {
        this.setState({ alwayShowController: true });
      });
    }, 2000);
  };

  onPressCloseSuggest = () => {
    this.VideoPlayer.seek(this.getCurrentTime() + 1, 0);
    this.setState({ showSurvey: false, pauseVideo: false, alwayShowController: true });
    this.showSurvey = false;
    this.hideControler().start();
  };

  clearAllTimeout = () => {
    clearTimeout(this.timeReady);
    clearTimeout(this.timer);
    clearTimeout(this.timeSlide);
  };

  setActiveSurvey = (activeSurvey) => {
    this.setState({ activeSurvey });
  };

  renderTextNote = () => {
    const { params, videoID } = this.props;
    const playingTime = this.getCurrentTime();
    const timePlay = this.caculTimePlay(playingTime);
    return <ModalVideoNote ref={(refs) => (this.textNoteRef = refs)} timePlay={timePlay} params={params} videoID={videoID} onPauseVideo={this.onPauseVideo} />;
  };

  renderLoading = () => {
    const { video } = this.state;
    let controllerStyle = { backgroundColor: 'rgba(0,0,0,1)', width: video.width, height: video.height };
    if (!this.state.loading) return null;
    return (
      <View style={[styles.loading, controllerStyle]}>
        <LoadingVideo size={50} color={'#FFFFFF'} />
      </View>
    );
  };

  renderSurvey = () => {
    const { fullScreen, activeSurvey } = this.state;
    if (!activeSurvey) return null;
    return <SurveyQuestion fullScreen={fullScreen} ref={(refs) => (this.SurveyQuestion = refs)} onHideSurvey={this.onHideSurvey} />;
  };

  renderController = () => {
    const { loading, pauseVideo, percent, alwayShowController, showSurvey, fullScreen, showChooselink, showServer, showSpeed } = this.state;
    const { videoOffline, videoID, nameVideo, params } = this.props;
    const videoFinish = percent === 1.0;
    if (showSurvey && !fullScreen) return null;
    if (videoOffline) {
      return (
        <PlayButton
          pauseVideo={pauseVideo}
          percent={percent}
          fadeView={this.fadeView}
          onPressPreviousVideo={this.onPressPreviousVideo}
          onPressPlayVideo={this.onPressPlayVideo}
          onPressForwardVideo={this.onPressForwardVideo}
          alwayShowController={alwayShowController}
          videoFinish={videoFinish}
        />
      );
    }
    return (
      <View style={styles.wrapperController}>
        {!loading && (
          <PlayButton
            videoFinish={videoFinish}
            pauseVideo={pauseVideo}
            percent={percent}
            fadeView={this.fadeView}
            onPressPreviousVideo={this.onPressPreviousVideo}
            onPressPlayVideo={this.onPressPlayVideo}
            onPressForwardVideo={this.onPressForwardVideo}
            alwayShowController={alwayShowController}
          />
        )}
        <ChooseOption
          fadeView={this.fadeView}
          showChooselink={showChooselink}
          showServer={showServer}
          showSpeed={showSpeed}
          onPressSpeed={this.onPressSpeed}
          onPressChangLink={this.onPressChangLink}
          onPressChangeServer={this.onPressChangeServer}
        />
        <ControllerTop
          videoID={videoID}
          nameVideo={nameVideo}
          fadeView={this.fadeView}
          onPressShowQuality={this.onPressShowQuality}
          onPressShowServer={this.onPressShowServer}
          onPressShowSpeedPlay={this.onPressShowSpeedPlay}
          onPressDownloadVideo={this.onPressDownloadVideo}
          showServer={showServer}
          showChooselink={showChooselink}
          showSpeed={showSpeed}
          params={params}
        />
      </View>
    );
  };

  renderVideo = () => {
    const { speedPlayVideo, pauseVideo, video } = this.state;
    const { sourceVideo } = this.props;
    if (!sourceVideo.uri) return <View style={[styles.backgroundVideo, video]} />;
    let { uri } = sourceVideo;
    uri = encodeURI(uri);
    return (
      <Video
        onLoad={this.onLoadVideo}
        paused={pauseVideo}
        style={[styles.backgroundVideo, video]}
        onProgress={this.onProgressVideo}
        rate={speedPlayVideo}
        ref={(ref) => (this.VideoPlayer = ref)}
        source={{ uri }}
        onEnd={this.onEndVideo}
        repeat={false}
        fullscreen={false}
        resizeMode="contain"
        playInBackground={true}
        playWhenInactive={true}
        onLoadStart={this.onLoadVideoStart}
        onError={this.onErrorVideo}
      />
    );
  };

  render() {
    const { showSurvey, loading, percent, totalTime, fullScreen, video } = this.state;
    let changeBackground = this.fadeView.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255,255,255,0)', 'rgba(0,0,0,0.35)']
    });
    let disabled = false;
    let controllerStyle = { backgroundColor: changeBackground, opacity: this.fadeView, width: video.width, height: video.height };
    if (showSurvey) disabled = true;
    return (
      <View style={{ backgroundColor: 'black' }}>
        <View style={styles.videoArea}>
          {this.renderVideo()}
          <View style={[video, styles.containerVideo]}>
            <TouchableWithoutFeedback onPress={this.onPressVideo} disabled={disabled}>
              <View style={{ flex: 1 }}>
                {this.renderLoading()}
                <Animated.View style={[styles.viewBackground, controllerStyle]}>{this.renderController()}</Animated.View>
              </View>
            </TouchableWithoutFeedback>
            <ControllerBottom
              fadeView={this.fadeView}
              percent={percent}
              totalTime={totalTime}
              fullScreen={fullScreen}
              loading={loading}
              showSurvey={showSurvey}
              spinValue={this.spinValue}
              onSeekVideoStart={this.onSeekVideoStart}
              onSeekVideoComplete={this.onSeekVideoComplete}
              onPressSeekStart={this.onStartPressSlider}
              onPressSeekComplete={this.onPressSeekSliderComplete}
              ref={(refs) => (this.ControllerBottom = refs)}
              onPressFullScreen={this.onPressFullScreen}
              onValueChange={this.onChangeValueOfSlider}
            />
          </View>
          {this.renderTextNote()}
        </View>
        {this.renderSurvey()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  videoQuestionInfo: state.lessonReducer.videoQuestionInfo
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(VideoPlayer);
