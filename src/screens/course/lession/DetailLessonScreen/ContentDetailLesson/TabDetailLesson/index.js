import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { Animated, LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import Dimension from 'common/helpers/Dimension';
import ButtonZoomTab from './TabTopLesson/ButtonZoomTab';
import CommentLesson from '../../../containers/containers/CommentLesson';
import TabTopLesson from './TabTopLesson';
import VocabularyFlastCard from './VocabularyFlastCard';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const width = Dimension.widthParent;
const HEIGHR_HEADER = 50 * Dimension.scale;

export default class TabDetailLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableMoveTab: false
    };
    this.translateY = new Animated.Value(0);
    this.heightListVideo = -(width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT - 1;
    this.fullScreenTab = false;
    this.submitTest = 0;
  }

  onMoveTabView = () => {
    const { typeVideo, listVideoState, videoLink, videoName, listVideo } = this.props;
    // typeVideo == 'video' ? this.VideoPlayer.setState({ pauseVideo: true }, () => this.setState({ heightHeader: HEIGHR_HEADER })) : null;
    // typeVideo == 'video' ? this.props.onPauseVideo() : null;
    if (videoLink?.length !== 0 || videoName?.length !== 0) {
      this.fullScreenTab = !this.fullScreenTab;

      //Height cua list video
      if (listVideo.length > 1) {
        if (listVideoState) {
          this.heightListVideo = -(width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT - 45 - 110 * Dimension.scale;
        } else {
          this.heightListVideo = -(width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT - 45;
        }
      }
      if (this.fullScreenTab) {
        this.setState({ youtubePlaying: false });
        this.onMoveTabUp();
      } else {
        this.setState({ youtubePlaying: true });
        this.onMoveTabDown();
      }
    }
  };

  onMoveTabUp = () => {
    this.setState({
      showVideo: false
    });
    Animated.timing(this.translateY, {
      toValue: 100,
      duration: 250
    }).start();
  };

  onMoveTabDown = () => {
    this.setState({
      showVideo: true
    });
    Animated.timing(this.translateY, {
      toValue: 0,
      duration: 250
    }).start();
  };

  onBlurInputComment = () => {
    const { listVideo, listVideoState } = this.props;
    //Height cua list video
    if (listVideo.length > 1) {
      if (listVideoState) {
        this.heightListVideo = -(width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT - 45 - 110 * Dimension.scale;
      } else {
        this.heightListVideo = -(width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT - 45;
      }
    }
    if (this.fullScreenTab) {
      this.setState({ disableMoveTab: false });
    } else {
      this.onMoveTabDown();
      this.setState({ disableMoveTab: false });
    }
  };

  onFocusInputComment = () => {
    const { videoName, listVideo, listVideoState } = this.props;
    //Height cua list video
    if (listVideo.length > 1) {
      if (listVideoState) {
        this.heightListVideo = -(width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT - 45 - 110 * Dimension.scale;
      } else {
        this.heightListVideo = -(width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT - 45;
      }
    }
    if (!this.fullScreenTab && videoName?.length > 0) {
      this.onMoveTabUp();
      this.onLayoutAnimation(300);
      this.setState({ disableMoveTab: true, heightHeader: HEIGHR_HEADER });
    } else {
      this.setState({ disableMoveTab: true });
    }
  };

  onSubmitAnswers = () => {
    this.props.onSubmitAnswers();
  };

  onShowTestResult = (section, item) => {
    this.props.onShowTestResult(section, item);
  };

  onPressIgnore = () => this.props.onPressIgnore();

  onLayoutAnimation = (duration) => {
    return LayoutAnimation.configureNext(
      LayoutAnimation.create(duration, LayoutAnimation.Types.linear, LayoutAnimation.Properties.opacity, LayoutAnimation.Presets.linear)
    );
  };

  flashCardRef = () => this.props.checkTypeCard;

  unfinishCard = () => {
    return this.flashCardRef.unfinishCard();
  };

  finishCard = () => {
    return this.flashCardRef.finishCard();
  };

  renderTab = () => {
    const { checkTabRender, params, typeNotify, courseName, kaiwaNo2Demo, lessonId } = this.props;
    if (!checkTabRender) return;
    return (
      <TabTopLesson
        screenProps={{
          onPressIgnore: this.onPressIgnore,
          typeLesson: params.typeLesson,
          dataReply: params.item.dataNoti,
          lessonId: lessonId,
          type: params.type,
          paramsHistory: params.type === Const.HISORY_TEST ? params : null,
          typeNotify: typeNotify,
          params: params,
          onFocusInputComment: this.onFocusInputComment,
          onBlurInputComment: this.onBlurInputComment,
          onSubmitAnswers: this.onSubmitAnswers,
          onShowTestResult: this.onShowTestResult,
          kaiwaNo2Demo: kaiwaNo2Demo,
          courseName: courseName
        }}
      />
    );
  };

  renderComment = () => {
    const { checkRenderComment, params, typeNotify } = this.props;
    if (!checkRenderComment) return null;
    return (
      <View style={styles.viewComment}>
        <View style={styles.viewTitle}>
          <BaseText style={styles.textComment}>{Lang.chooseLession.text_title_comment}</BaseText>
        </View>
        <CommentLesson
          screenProps={{
            paramsHistory: params.type === Const.HISORY_TEST ? params : null,
            typeNotify: typeNotify,
            params: params,
            onFocusInputComment: this.onFocusInputComment,
            onBlurInputComment: this.onBlurInputComment
          }}
        />
      </View>
    );
  };

  renderButtonZoomTab = () => {
    const { videoName, loading } = this.props;
    const { showVideo } = this.state;
    const { disableMoveTab } = this.state;
    if (videoName?.length == 0) return;
    return <ButtonZoomTab showVideo={showVideo} disableMoveTab={disableMoveTab} onMoveTabView={this.onMoveTabView} loading={loading} />;
  };

  renderContent = () => {
    const { checkTypeCard, dataFlashCard, params, listFinish, courseName, lessonId, fullScreenVideo } = this.props;
    let marginTab = this.translateY.interpolate({
      inputRange: [0, 100],
      outputRange: [1, this.heightListVideo]
    });
    if (fullScreenVideo) marginTab = 100;
    if (checkTypeCard) {
      return (
        <VocabularyFlastCard
          ref={(refs) => {
            this.flashCardRef = refs;
          }}
          listFlashCard={dataFlashCard}
          lessonId={lessonId}
          params={params}
          listFinish={listFinish}
          courseName={courseName}
        />
      );
    }
    return (
      <Animated.View style={[{ flex: 1 }, { marginTop: marginTab }]}>
        {this.renderTab()}
        {this.renderComment()}
        {this.renderButtonZoomTab()}
      </Animated.View>
    );
  };

  render() {
    return this.renderContent();
  }
}

const styles = StyleSheet.create({
  underlineStyle: {
    height: 1,
    bottom: 5,
    justifyContent: 'space-between',
    backgroundColor: Colors.greenColorApp
  },
  scrollStyle: {
    borderBottomWidth: 0,
    backgroundColor: Colors.white100,
    borderWidth: 0,
    alignItems: 'center'
  },
  titleArea: {
    alignItems: 'flex-start'
  },
  textPercent: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.greenColorApp
  },
  viewTitle: {
    width: Dimension.widthParent,
    height: 50,
    paddingLeft: 20,
    justifyContent: 'center'
  },
  viewComment: {
    flex: 1,
    backgroundColor: 'white'
  }
});
