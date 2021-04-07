import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import ItemSurveyAnswers from './ItemSurveyAnswers';

export default class FullSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      landscape: false
    };
    this.AnimatedSurvey = new Animated.Value(0);
    this.countButton = 0;
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
    this.setState({ landscape: true });
  };

  onProtrait = () => {
    this.setState({ landscape: false });
  };

  showFullSurvey = () => {
    Animated.timing(this.AnimatedSurvey, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  hideFullSurvey = () => {
    Animated.timing(this.AnimatedSurvey, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(({ finished }) => {
      if (finished) this.props.onHideFullSurvey();
    });
  };

  onPressCheckResult = () => {
    this.hideFullSurvey();
  };

  onChangeButtonNext = () => {
    this.ItemSurveyAnswersFull.onShowResult(this.props.videoQuestionInfo);
    this.setState({ showResult: true });
  };

  render() {
    const { videoQuestionInfo } = this.props;
    const { showResult, landscape } = this.state;
    const translateY = this.AnimatedSurvey.interpolate({
      inputRange: [0, 1],
      outputRange: [Dimension.heightParent, 0]
    });
    let buttonName = Lang.survey_video.forward;
    let fontSize = 12 * Dimension.scale;
    let questionFullStyle = { height: '20%' };
    if (landscape) {
      fontSize = 15 * Dimension.scale;
      questionFullStyle = { height: '40%' };
    }
    if (showResult) buttonName = Lang.survey_video.next;
    return (
      <Animated.View style={[styles.containerFull, { transform: [{ translateY: translateY }] }]}>
        <View style={styles.containerQuestFull}>
          <View style={[styles.viewQuestionFull, questionFullStyle]}>
            <View
              style={{
                ...styles.wrapQuestion,
                backgroundColor: !videoQuestionInfo.content ? 'transparent' : 'rgba(18, 104, 136, 1)',
                width: !landscape ? '95%' : '90%'
              }}>
              <HTMLFurigana html={videoQuestionInfo.content} textStyle={{ ...styles.textFurigana, fontSize }} textContainer={{ justifyContent: 'center' }} />
            </View>
          </View>
          <ItemSurveyAnswers
            answer={videoQuestionInfo.answers}
            ref={(refs) => (this.ItemSurveyAnswersFull = refs)}
            fullSurvey={true}
            onChangeButtonNext={this.onChangeButtonNext}
            showed={videoQuestionInfo.showed}
            landscape={landscape}
            onSkipPlayVideo={this.onPressCheckResult}
          />
          {!landscape && (
            <TouchableOpacity style={[styles.buttonSkip, styles.buttonSkipPotrait]} onPress={this.onPressCheckResult}>
              <BaseText style={styles.textButtonSkip}>{buttonName}</BaseText>
            </TouchableOpacity>
          )}
        </View>
        {landscape && (
          <View style={styles.containerAnswerFull}>
            {!showResult && (
              <TouchableOpacity style={styles.buttonSkip} onPress={this.onPressCheckResult}>
                <BaseText style={styles.textButtonSkip}>{buttonName}</BaseText>
              </TouchableOpacity>
            )}
          </View>
        )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  containerFull: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(54, 145, 176, 0.5)',
    position: 'absolute',
    flexDirection: 'row'
  },
  containerQuestFull: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 3
  },
  containerAnswerFull: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 0.5
  },
  viewQuestionFull: {
    width: '100%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
    // marginBottom: 5,
  },
  wrapQuestion: {
    width: '90%',
    backgroundColor: 'rgba(18, 104, 136, 1)',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
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
    justifyContent: 'center',
    marginTop: 5
  },
  buttonSkip: {
    width: '90%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 45, 45, 0.8)',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 12
  },
  textButtonSkip: {
    color: '#FFFFFF',
    fontSize: 12
  },
  textQuestion: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  textFurigana: {
    fontSize: 12 * Dimension.scale,
    fontWeight: '600',
    color: 'white'
  },
  buttonSkipPotrait: {
    marginVertical: 5,
    width: 70,
    height: 25,
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: 5
  }
});
