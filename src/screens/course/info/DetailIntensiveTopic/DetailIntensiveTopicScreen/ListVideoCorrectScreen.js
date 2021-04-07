import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import Header from 'common/components/base/Header';
import Dimension from 'common/helpers/Dimension';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import BaseVideoPlayer from 'screens/components/BaseVideoPlayer';
import ListVideo from 'screens/course/lession/DetailLessonScreen/ContentDetailLesson/ListVideo';
import Images from 'assets/Images';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseText from 'common/components/base/BaseText';
const HEIGHR_HEADER = 50 * Dimension.scale;

class ListVideoCorrectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailVideo: null,
      url: '',
      listVideo: [],
      dataTab: [{ id: 0, title: 'PDF tài liệu', icon: Images.imDocumenta }, { id: 1, title: 'Bình luận', icon: Images.imCommenta }]
    };
    this.videoUrl = props.server.url;
    this.videoQuality = props.quality;
  }

  componentDidMount() {
    const { listVideo } = this.props;
    const { dataTab } = this.state;
    let newDataTab = [{ ...dataTab[0], isChoose: true }, { ...dataTab[1] }];
    this.setState({ detailVideo: listVideo[0], dataTab: newDataTab }, () => {
      const { detailVideo } = this.state;
      this.urlVideo(this.videoUrl, detailVideo);
    });
  }

  onVideoFullScreen = () => {};
  onChangeLinkVideo = (type) => {
    const { detailVideo } = this.state;
    this.urlVideo(this.videoUrl, detailVideo);
  };
  onchangeServerVideo = (url) => {
    const { detailVideo } = this.state;
    this.urlVideo(url, detailVideo);
  };
  onPressChangeVideo = (item) => {
    this.urlVideo(this.videoUrl, item);
  };

  urlVideo = (videoUrl, video) => {
    const { listVideo } = this.props;
    listVideo.map((item) => {
      item.choose = item.id === video.id;
      return item;
    });
    let videoLink = videoUrl + `${'/'}${this.videoQuality}${'/'}` + video?.video_name + Const.VIDEO_CONFIG.FILE_NAME;
    this.setState({ url: videoLink, listVideo }, () => {
      this.BaseVideoPlayer?.VideoPlayer?.onPauseVideo();
    });
  };

  onChangeListVideo = () => {};
  onVideoEnd = () => {};

  onPressChooseTab = (item) => () => {
    const { dataTab } = this.state;
    dataTab?.map((v) => {
      v.isChoose = v.id === item.id;
      return v;
    });
    this.setState({ dataTab });
  };

  render() {
    const { listVideo } = this.state;
    const { detailVideo, url, dataTab } = this.state;
    return (
      <View style={styles.container}>
        <Header left={true} text={Lang.intensive.textHeaderChuaDe} titleStyle={styles.titleStyle} headerStyle={styles.headerStyle} />
        {detailVideo?.id && (
          <BaseVideoPlayer
            url={url}
            onVideoFullScreen={this.onVideoFullScreen}
            changLinkVideo={this.onChangeLinkVideo}
            changeServerVideo={this.onchangeServerVideo}
            onVideoEnd={this.onVideoEnd}
            ref={(refs) => (this.BaseVideoPlayer = refs)}
          />
        )}
        {listVideo?.length > 1 && (
          <ListVideo
            typeLuyenDe
            onPressChangeVideo={this.onPressChangeVideo}
            listVideo={listVideo}
            heightHeader={HEIGHR_HEADER}
            onChangeListVideo={this.onChangeListVideo}
          />
        )}
        <View style={styles.wrapperButton}>
          {dataTab?.map((item, i) => (
            <View key={i} style={styles.wrapperTabTop}>
              <View>
                <BaseButtonOpacity
                  icon={item.icon}
                  text={item.title}
                  tintColor={item.isChoose ? Colors.violet : Colors.black}
                  socialButtonStyle={styles.socialButtonStyle}
                  textStyle={styles.textStyle}
                  onPress={this.onPressChooseTab(item)}
                />
                {item.isChoose && <View style={styles.layout} />}
              </View>
              <View style={styles.border} />
            </View>
          ))}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerStyle: {
    backgroundColor: Colors.white100,
    shadowColor: '#777',
    shadowOffset: { x: 5, y: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    paddingTop: 20 * Dimension.scale
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: '500'
  },
  wrapperTabTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6'
  },
  wrapperButton: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: Colors.borderWidth,
    position: 'absolute',
    bottom: 0
  },
  socialButtonStyle: {
    width: Dimension.widthParent / 2,
    height: 45 * Dimension.scale,
    backgroundColor: '#F6F6F6'
  },
  border: {
    width: 2,
    height: 40 * Dimension.scale,
    backgroundColor: Colors.borderWidth
  },
  textStyle: {
    fontWeight: '500',
    fontSize: 13 * Dimension.scale,
    paddingLeft: 10
  },
  layout: {
    width: Dimension.widthParent / 2,
    height: 5 * Dimension.scale,
    backgroundColor: Colors.violet,
    position: 'absolute',
    bottom: 3
  }
});
const mapStateToProps = (state) => ({
  server: state.changeServerReducer.server,
  quality: state.qualityVideoReducer.quality,
  listVideo: state.lessonReducer.listVideo
});
export default connect(mapStateToProps)(ListVideoCorrectScreen);
