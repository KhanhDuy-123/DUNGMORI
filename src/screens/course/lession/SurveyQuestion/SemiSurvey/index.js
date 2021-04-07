import Dimension from 'common/helpers/Dimension';
import { getBottomSpace, getStatusBarHeight, isIphoneX } from 'common/helpers/IPhoneXHelper';
import Const from 'consts/Const';
import React, { PureComponent } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import ItemSurveyAnswers from '../ItemSurveyAnswers';
import CircleCountDown from './CircleCountDown';

const { widthParent, heightParent } = Dimension;
let HEIGHT_VIDEO = (widthParent / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT;
const ipXBottomSpace = getBottomSpace();
const ipxStatusBarHeight = getStatusBarHeight();
const WIDTH_SURVEY = isIphoneX() ? heightParent - (ipXBottomSpace + ipxStatusBarHeight) : heightParent;

export default class SemiSurvey extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      parentSurveyStyles: {
        width: WIDTH_SURVEY,
        height: (widthParent / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT
      },
      landscape: false
    };
    this.AnimatedContent = new Animated.Value(0);
  }

  componentDidMount() {
    Orientation.getOrientation((orientation) => {
      if (orientation === 'LANDSCAPE-LEFT' || orientation == 'LANDSCAPE-RIGHT') this.onLandscape();
      else if (orientation === 'PORTRAIT') this.onProtrait();
    });
    Orientation.addOrientationListener(this.onOrientitationChange);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.onOrientitationChange);
  }

  onOrientitationChange = (orientation) => {
    if (orientation == 'LANDSCAPE-LEFT' || orientation == 'LANDSCAPE-RIGHT') this.onLandscape();
    else if (orientation == 'PORTRAIT') this.onProtrait();
  };

  onLandscape = () => {
    HEIGHT_VIDEO = widthParent;
    let parentSurveyStyles = { ...this.state.parentSurveyStyles };
    parentSurveyStyles.width = WIDTH_SURVEY;
    parentSurveyStyles.height = widthParent;
    this.setState({ parentSurveyStyles, landscape: true });
  };

  onProtrait = () => {
    HEIGHT_VIDEO = (widthParent / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT;
    let parentSurveyStyles = { ...this.state.parentSurveyStyles };
    parentSurveyStyles.width = widthParent;
    parentSurveyStyles.height = HEIGHT_VIDEO;
    this.setState({ parentSurveyStyles, landscape: false });
  };

  showSurvey = () => {
    Animated.timing(this.AnimatedContent, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  hideSurvey = (callback) => {
    Animated.timing(this.AnimatedContent, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(callback);
  };

  onEndTime = () => {
    this.ItemSurveyAnswers?.stopChangeBackground();
    this.hideSurvey((finished) => {
      if (finished) this.props.onHideSurvey();
    });
  };

  onShowResult = () => {
    this.ItemSurveyAnswers?.onShowResult(this.props.videoQuestionInfo);
  };

  render() {
    const { videoQuestionInfo } = this.props;
    const { parentSurveyStyles, landscape } = this.state;
    const translateSurvey = this.AnimatedContent.interpolate({
      inputRange: [0, 1],
      outputRange: [HEIGHT_VIDEO / 2, 0]
    });
    return (
      <View style={[styles.container, parentSurveyStyles]}>
        <Animated.View style={[styles.content, { transform: [{ translateY: translateSurvey }], width: parentSurveyStyles.width - 20 }]}>
          <View style={{ alignSelf: 'flex-end', marginRight: 10, marginBottom: 5 }}>
            <CircleCountDown
              size={35 * Dimension.scale}
              duration={videoQuestionInfo.length}
              activeColor={'rgba(0,0,0,0.5)'}
              inActiveColor={'rgba(0,0,0,0.0)'}
              onEndTime={this.onEndTime}
              showResult={this.onShowResult}
              videoQuestionInfo={videoQuestionInfo}
            />
          </View>
          <View style={styles.containerQuestion}>
            <View style={styles.containerAnswer}>
              <ItemSurveyAnswers
                landscape={landscape}
                answer={videoQuestionInfo.answers}
                ref={(refs) => (this.ItemSurveyAnswers = refs)}
                showed={videoQuestionInfo.showed}
              />
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0, 0)',
    width: Dimension.widthParent,
    height: (Dimension.widthParent / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-end',
    alignSelf: 'center'
  },
  content: {
    height: '65%',
    backgroundColor: 'transparent',
    position: 'absolute',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden',
    justifyContent: 'space-evenly',
    // flexDirection: 'row',
    paddingHorizontal: isIphoneX() ? ipxStatusBarHeight / 2 : 0
  },
  viewAnswer: {
    width: '48%',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingLeft: 15
  },
  containerAnswer: {
    flex: 3,
    paddingHorizontal: 10
  },
  wrapperQuestion: {
    flex: 2,
    padding: 10,
    paddingTop: 5
  },
  containerQuestion: {
    flex: 1
  },
  viewQuestion: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    flex: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  textQuestion: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  wrapperAnswer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  containerFull: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    position: 'absolute'
  },
  containerQuestFull: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerAnswerFull: {
    flex: 3,
    alignItems: 'center'
  },
  viewQuestionFull: {
    width: '85%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15
  },
  viewAnswerFull: {
    width: '85%',
    height: '80%',
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  viewButtonSkip: {
    width: '85%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  buttonSkip: {
    width: 75,
    height: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 45, 45, 0.8)',
    borderRadius: 5
  },
  textButtonSkip: {
    color: '#FFFFFF'
  },
  textFurigana: {
    color: 'white',
    fontSize: 14 * Dimension.scale,
    fontWeight: '600'
  }
});
