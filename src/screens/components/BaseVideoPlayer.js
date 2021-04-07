import VIForegroundService from '@voximplant/react-native-foreground-service';
import VideoPlayer from 'common/components/videoPlayer/VideoPlayer';
import Funcs from 'common/helpers/Funcs';
import EncryptFileService from 'common/services/EncryptFileService';
import AppConst from 'consts/AppConst';
import DatabaseConst from 'consts/DatabaseConst';
import React from 'react';
import { AppState, Platform } from 'react-native';
import StaticServer from 'react-native-static-server';
import { connect } from 'react-redux';
import VideoController from 'realm/controllers/VideoController';
import { onChangeVideoQuestion } from 'states/redux/actions/LessonAction';

class BaseVideoPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
      videoError: false
    };
    AppState.addEventListener('change', this.onAppStateChange);
  }

  async componentDidMount() {
    try {
      // get path video download
      const { videoID } = this.props;
      this.getVideoOffline(videoID);
      if (!videoID) {
        this.setState({ url: this.props.url });
      }
    } catch (err) {
      console.log('ERROR', err);
    }
  }

  async shouldComponentUpdate(nextProps, nextState) {
    const { videoOffline, videoID } = nextProps;
    if (videoOffline && videoID !== this.props.videoID) {
      this.getVideoOffline(videoID);
    }
    if (nextProps.url !== this.props.url) {
      this.setState({ url: nextProps.url });
    }
    return true;
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
    if (this.videoPath) {
      EncryptFileService.reEncryptVideo(this.videoPath);
    }
    if (this.server && this.server.isRunning()) {
      this.server.stop();
    }
    this.stopService();
  }

  getVideoOffline = async (videoID) => {
    // Get all Video
    let videoOffline = await VideoController.getBy('id', videoID);
    videoOffline = videoOffline.map((item) => {
      return {
        id: item.id,
        downloadPath: item.downloadPath,
        lessonId: item.lessonId,
        isDownloadFinish: item.isDownloadFinish
      };
    });
    videoOffline = videoOffline.length > 0 && videoOffline[0];
    if (videoOffline && videoOffline.downloadPath && videoOffline.isDownloadFinish) {
      this.videoPath = DatabaseConst.VIDEO_PATH + `${videoOffline.downloadPath}/`;
      this.server = new StaticServer(AppConst.IS_IOS ? 9951 : 8890, this.videoPath, { localOnly: true, keepAlive: true });
      await this.processVideo();
      //Reset câu hỏi tương tác khi ở chế độ xem offline
      if (this.props.videoOffline) this.props.onChangeVideoQuestion([]);
      return;
    } else {
      this.setState({ url: this.props.url });
    }
  };

  onAppStateChange = (state) => {
    if (this.videoPath) {
      if (state == 'active') {
        this.processVideo();
      } else if (state == 'background') {
        this.currentTime = this.VideoPlayer.getCurrentTime();
        EncryptFileService.reEncryptVideo(this.videoPath);
        this.setState({ url: '' });
      }
    }
    if (state == 'active') this.VideoPlayer.setActiveSurvey(true);
    else if (state == 'background') this.VideoPlayer.setActiveSurvey(false);
  };

  processVideo = async () => {
    // Decrypt video
    try {
      if (this.videoPath) {
        this.setState({ url: '' });
        const res = await EncryptFileService.decryptVideo(this.videoPath);
        if (res) {
          this.server.start().then((url) => {
            this.setState({ url: url + '/tmp.m3u8' }, async () => {
              await Funcs.delay(200);
              if (this.currentTime) this.VideoPlayer.seekToTime(this.currentTime);
            });
          });
        } else {
          this.setState({ videoError: true });
        }
      }
    } catch (err) {
      Funcs.log('ERROR', err);
    }
  };

  onLoadVideo = async () => {
    if (Platform.OS !== 'android') return;
    if (Platform.Version >= 26) {
      const chanelConfig = {
        id: 'ForegroundServiceChannel',
        name: 'Dũng Mori',
        description: 'Bài học của Dũng Mori',
        enableVibration: false,
        importance: 2
      };
      await VIForegroundService.createNotificationChannel(chanelConfig);
    }
    let notificationConfig = {
      id: 3456,
      title: 'Bài học của Dũng Mori',
      text: 'Tiến trình chạy video ngầm đang chạy',
      icon: 'ic_notification',
      priority: 0
    };
    if (Platform.Version >= 26) {
      notificationConfig.channelId = 'ForegroundServiceChannel';
    }
    await VIForegroundService.startService(notificationConfig);
  };

  stopService = async () => {
    await VIForegroundService.stopService();
  };

  onVideoEnd = () => {
    this.props.onVideoEnd();
  };
  onErrorVideo = (event) => {
    Funcs.log('EVENT ERROR:', event);
  };

  render() {
    const { url } = this.state;
    return (
      <VideoPlayer
        {...this.props}
        sourceVideo={{ uri: url }}
        onFullScreen={this.props.onVideoFullScreen}
        ref={(refs) => (this.VideoPlayer = refs)}
        onVideoEnd={this.onVideoEnd}
        onErrorVideo={this.onErrorVideo}
        onLoadVideo={this.onLoadVideo}
      />
    );
  }
}

const mapDispatchToProps = { onChangeVideoQuestion };

export default connect(
  null,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(BaseVideoPlayer);
