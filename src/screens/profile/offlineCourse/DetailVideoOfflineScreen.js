import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import AppConst from 'consts/AppConst';
import React, { Component } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import VideoController from 'realm/controllers/VideoController';
import BaseVideoPlayer from 'screens/components/BaseVideoPlayer';
import ListVideo from 'screens/course/lession/DetailLessonScreen/ContentDetailLesson/ListVideo';

const HEIGHR_HEADER = 50 * Dimension.scale;
class DetailVideoOfflineScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullScreenVideo: false,
      listVideo: [],
      videoID: null
    };
    this.currentTime = 0;
    this.params = NavigationService.getParams();
    BackHandler.addEventListener('hardwareBackPress', this.onHardPress);
  }

  async componentDidMount() {
    let listVideo = await VideoController.getBy('lessonId', this.params.id);
    listVideo = listVideo.map((item) => {
      return {
        id: item?.id,
        video_title: item?.title,
        lessonId: item?.lessonId,
        downloadPath: item?.downloadPath,
        isDownloadFinish: item?.isDownloadFinish
      };
    });
    listVideo[0].choose = true;
    listVideo = listVideo.filter((value) => value.isDownloadFinish !== null);
    this.setState({ listVideo, videoID: listVideo[0].id });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onHardPres);
  }

  onVideoFullScreen = () => {
    this.setState({ fullScreenVideo: !this.state.fullScreenVideo });
  };

  onHardPress = () => {
    let fullScreenVideo = this.state.fullScreenVideo;
    if (fullScreenVideo) {
      this.BaseVideoPlayer?.VideoPlayer?.onHardBackPress();
      this.setState({ fullScreenVideo: false });
    } else {
      NavigationService.pop();
    }
    return true;
  };
  onChangeListVideo = () => {};

  onPressChangeVideo = (item) => {
    const { listVideo } = this.state;
    listVideo.map((value) => {
      if (value.id === item.id) {
        value.choose = true;
      } else {
        value.choose = false;
      }
      return value;
    });
    this.setState({ listVideo, videoID: item.id });
  };

  render() {
    const { fullScreenVideo, listVideo, videoID } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {fullScreenVideo ? null : (
          <Header
            left={true}
            text={Lang.profile.text_video_download}
            titleStyle={styles.titleStyle}
            titleArea={styles.areaHeaderText}
            headerStyle={styles.headerStyle}
          />
        )}
        {videoID && <BaseVideoPlayer videoOffline videoID={videoID} onVideoFullScreen={this.onVideoFullScreen} ref={(refs) => (this.BaseVideoPlayer = refs)} />}
        {listVideo?.length > 1 && (
          <ListVideo
            onPressChangeVideo={this.onPressChangeVideo}
            listVideo={listVideo}
            heightHeader={HEIGHR_HEADER}
            onChangeListVideo={this.onChangeListVideo}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  areaHeaderText: {
    paddingTop: 10 * Dimension.scale
  },
  headerStyle: {
    backgroundColor: Resource.colors.white100,
    height: AppConst.IS_IPHONEX ? 80 * Dimension.scale : 50 * Dimension.scale,
    paddingTop: AppConst.IS_IPHONEX ? 30 : 10
  },
  titleStyle: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '600',
    paddingLeft: 10,
    paddingBottom: 10
  }
});

export default DetailVideoOfflineScreen;
