import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import Funcs from 'common/helpers/Funcs';
import React, { Component } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import VideoController from 'realm/controllers/VideoController';
import AppProvider from 'states/context/providers/AppProvider';
import VideoDownloadActionCreator from 'states/redux/actionCreators/VideoDownloadActionCreator';
import Configs from 'utils/Configs';
import { styles } from './Styles';

class ControllerTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoDownloaded: false,
      showSpeed: props.showSpeed,
      isDownloading: false,
      disabled: false
    };
  }

  async componentDidMount() {
    const { videoID, nameVideo, lessonDownloading } = this.props;
    const downloadProgress = 0;
    VideoDownloadActionCreator.onVideodownloadProgress({ downloadProgress });
    let video = await VideoController.getBy('id', videoID);
    video.map((item) => {
      this.idVideoDownloaded = item.id;
    });
    video = video?.length > 0 && video[0];
    if (video) {
      const disabled =
        nameVideo == video.downloadPath &&
        lessonDownloading?.downloadProgress > 0 &&
        lessonDownloading?.downloadProgress < 100 &&
        videoID === lessonDownloading?.videoId;
      this.setState({ videoDownloaded: video.downloadPath && video.isDownloadFinish, disabled });
    }
  }

  async shouldComponentUpdate(nextProps, nextState) {
    const { lessonDownloading, showChooselink, showSpeed, videoID } = this.props;
    const { videoDownloaded } = this.state;
    if (nextProps.showChooselink !== showChooselink) {
      this.setState({ showChooselink: nextProps.showChooselink });
    }
    if (nextProps.showSpeed !== showSpeed) {
      this.setState({ showSpeed: nextProps.showSpeed });
    }
    if (lessonDownloading.downloadProgress !== nextProps.lessonDownloading.downloadProgress && videoID === nextProps.lessonDownloading?.videoId) {
      const disabled = nextProps.lessonDownloading.downloadProgress >= 0;
      let state = { isDownloading: nextProps.lessonDownloading.downloadProgress >= 0 };
      if (nextProps.lessonDownloading?.downloadProgress >= 100) {
        state = { ...state, videoDownloaded: true, disabled };
      } else {
        state = { ...state, downloadProgress: nextProps.lessonDownloading.downloadProgress, disabled };
      }
      this.setState(state);
    }
    if (nextProps.videoID !== this.idVideoDownloaded) {
      if (videoDownloaded) {
        this.idVideoDownloaded = null;
        this.setState({ videoDownloaded: false, isDownloading: false });
      } else {
        let video = await VideoController.getBy('id', nextProps.videoID);
        video.map((item) => {
          this.idVideoDownloaded = item.id;
          if (item.id === nextProps.videoID && item.isDownloadFinish) {
            this.setState({ videoDownloaded: true });
          }
        });
      }
    }
    return nextState !== this.state || nextProps.server !== this.props.server;
  }

  onPressShowQuality = () => {
    this.props.onPressShowQuality();
  };

  onPressShowServer = () => {
    this.props.onPressShowServer();
  };

  onPressShowSpeedPlay = () => {
    this.props.onPressShowSpeedPlay();
  };

  onPressShowDownload = () => {
    if (this.state.disabled) {
      Funcs.log('Video download disabled');
      return;
    }
    const { internet } = AppProvider.instance.state;
    if (!internet) {
      DropAlert.warn('', Lang.download.internet_fail);
      return;
    }
    this.setState({ downloadProgress: 0.5, isDownloading: true, disabled: true });
    this.props.onPressDownloadVideo();
  };

  renderProgress = () => {
    const color = '#00e0ff';
    const { downloadProgress, isDownloading } = this.state;
    if (!isDownloading) return <FastImage source={Resource.images.icDownload} style={styles.iconDrop} tintColor={Resource.colors.white100} />;
    return (
      <AnimatedCircularProgress size={20} width={2} fill={downloadProgress} tintColor={color} style={styles.progressStyle} backgroundColor="#3d5875">
        {/* {() => <FastImage source={Resource.images.icDownload} style={styles.iconDownload} tintColor={color} />} */}
        {() => <BaseText style={{ fontSize: 8, color, fontWeight: 'bold' }}>{Math.floor(downloadProgress)}</BaseText>}
      </AnimatedCircularProgress>
    );
  };
  render() {
    const { fadeView, params } = this.props;
    const { videoDownloaded, showSpeed, isDownloading, disabled } = this.state;
    const { showChooselink, showServer, speed, quality, server } = this.props;
    const textDownload = videoDownloaded
      ? Lang.chooseLession.text_downloaded
      : isDownloading
      ? Lang.chooseLession.text_downloading
      : Lang.chooseLession.text_download;
    const translateY = fadeView.interpolate({
      inputRange: [0, 1],
      outputRange: [-50, 0]
    });
    let nameServer =
      server.name.indexOf('Việt Nam') >= 0 ? (nameServer = Lang.detailLesson.text_choose_server_vietnam) : Lang.detailLesson.text_choose_server_jp;
    return (
      <Animated.View style={[styles.controllerTop, { transform: [{ translateY }] }]}>
        <TouchableOpacity style={[styles.buttonChooseMenu, { width: '13%' }]} onPress={this.onPressShowSpeedPlay}>
          <Text style={styles.textButton}>{`${speed}${'x'}`}</Text>
          <FastImage source={showSpeed == true ? Resource.images.icUp : Resource.images.icDown} style={styles.iconDrop} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonChooseMenu]} onPress={this.onPressShowQuality}>
          <Text style={styles.textButton}>{quality}</Text>
          <FastImage source={showChooselink ? Resource.images.icUp : Resource.images.icDown} style={styles.iconDrop} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonChooseMenu, { marginLeft: 12 }]} onPress={this.onPressShowServer}>
          <Text style={styles.textButton}>{nameServer}</Text>
          <FastImage source={showServer ? Resource.images.icUp : Resource.images.icDown} style={styles.iconDrop} />
        </TouchableOpacity>
        {Configs.enabledFeature.downloadVideo && params?.owned == 1 ? (
          <TouchableOpacity style={[styles.buttonChooseMenu1]} disabled={disabled || videoDownloaded} onPress={this.onPressShowDownload}>
            <Text style={styles.textButton}>{textDownload}</Text>
            {videoDownloaded ? <Icon name="check" size={18} color="#00e0ff" style={{ paddingLeft: 10 }} /> : this.renderProgress()}
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    );
  }
}

const mapStateToProps = (state) => ({
  server: state.changeServerReducer.server,
  quality: state.qualityVideoReducer.quality,
  speed: state.speedVideoReducer.speed,
  lessonDownloading: state.videoDownloadReducer.lessonDownloading
});

export default connect(
  mapStateToProps,
  null
)(ControllerTop);
