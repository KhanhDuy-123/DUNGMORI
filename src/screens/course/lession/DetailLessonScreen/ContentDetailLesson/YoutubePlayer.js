import Dimension from 'common/helpers/Dimension';
import React from 'react';
import { StatusBar, View, AppState, Platform } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import YouTube from 'react-native-youtube';
import Const from 'consts/Const';
const width = Dimension.widthParent;

export default class YoutubePlayer extends React.PureComponent {
  durationYoutube = 0;
  ready = false;

  state = {
    youtubeHeight: (width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT,
    heightHeader: 0,
    youtubePlaying: true,
    fullscreen: false,
    loading: false
  };

  percentLoadActive = 0;

  componentDidMount() {
    if (Platform.OS === 'android') AppState.addEventListener('change', this.onChangeStateListener);
  }

  componentWillUnmount() {
    clearTimeout(this.timeReadyYoutube);
    if (Platform.OS === 'android') AppState.removeEventListener('change', this.onChangeStateListener);
  }

  onChangeStateListener = async (state) => {
    if (state == 'active') {
      this.setState({ loading: false });
    } else if (state == 'background') {
      this.percentLoadActive = await this.getCurrentTime();
      this.setState({ loading: true, youtubePlaying: true });
    }
  };

  onReadyPlay = () => {
    this.ready = true;
    const params = this.props.params;
    this.Youtube?.getDuration().then((duration) => {
      this.durationYoutube = duration;
      this.setState({ youtubeHeight: (width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT + 1 }, () => {
        if (params?.item?.videoProgress && this.percentLoadActive == 0) {
          let progress = 0;
          progress = Math.round((params.item.videoProgress * this.durationYoutube) / 100);
          this.Youtube.seekTo(progress);
        } else if (this.percentLoadActive > 0) {
          let progress = Math.round((this.percentLoadActive / 100) * this.durationYoutube);
          this.Youtube.seekTo(progress);
        }
      });
    });
  };

  onChangeFullScreen = (event) => {
    if (event.isFullscreen) {
      Orientation.lockToLandscape();
      this.setState({ fullscreen: true });
    } else {
      Orientation.lockToPortrait();
      StatusBar.setHidden(false);
      this.setState({ fullscreen: false });
    }
  };

  onChangeStateYoutube = (event) => {
    if (event.state === 'playing') {
      this.setState({ youtubePlaying: true });
    } else if (event.state === 'paused' || event.state === 'stopped') {
      this.setState({ youtubePlaying: false });
    } else if (event.state === 'ended') {
      this.props.onEndYoutube();
      this.setState({ youtubePlaying: false });
    }
  };

  getCurrentTime = async () => {
    let currentTimePlay = 0;
    let videoProgress = 0;
    if (!this.ready) return (videoProgress = 0);
    return this.Youtube.getCurrentTime()
      .then((currentTime) => {
        currentTimePlay = currentTime;
        videoProgress = Math.round((currentTimePlay / this.durationYoutube) * 100);
        return videoProgress;
      })
      .catch(() => {
        return videoProgress;
      });
  };

  render() {
    const { videoName } = this.props;
    const { youtubeHeight, youtubePlaying, fullscreen, loading } = this.state;
    return (
      <View style={[{ width, height: youtubeHeight }]}>
        {!loading && (
          <YouTube
            videoId={videoName}
            origin={'http://www.youtube.com'}
            play={youtubePlaying}
            fullscreen={fullscreen}
            loop={false}
            apiKey={Const.APP_KEY.YOUTUBE_API}
            onReady={this.onReadyPlay}
            resumePlayAndroid={false}
            onChangeFullscreen={this.onChangeFullScreen}
            style={{ height: youtubeHeight, alignSelf: 'stretch' }}
            ref={(refs) => (this.Youtube = refs)}
            onChangeState={this.onChangeStateYoutube}
          />
        )}
      </View>
    );
  }
}
