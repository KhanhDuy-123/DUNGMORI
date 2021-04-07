import Colors from 'assets/Colors';
import Sounds from 'assets/Sounds';
import BaseText from 'common/components/base/BaseText';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import Dimension from 'common/helpers/Dimension';
import React, { Component, PureComponent } from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';
import { onChangeVideoQuestion } from '../../../../states/redux/actions/LessonAction';

let heightAnswer = Dimension.isIPad ? '35%' : '44%';
class AnswerSurvey extends PureComponent {
  viewAnswer = {
    width: '49%',
    height: heightAnswer,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: this.props.fullSurvey ? 5 : 10,
    justifyContent: 'center',
    top: -4,
    left: -2
  };

  background = new Animated.Value(0);

  onPressChooseAnswer = () => {
    this.props.onPressChooseAnswer(this.props.item.id);
  };

  changeBackGround = () => {
    return Animated.loop(
      Animated.timing(this.background, {
        toValue: 2,
        duration: 600
      })
    );
  };

  render() {
    const { item, showResult, fullSurvey, index, landscape } = this.props;
    let backgroundParent = '#22677E';
    let backgroundColor = '#72C5D7';

    if (showResult) {
      this.viewAnswer = [this.viewAnswer, !fullSurvey ? { top: -4, left: -2 } : null];
      if (item.choose && !item.showResult) {
        this.viewAnswer = [this.viewAnswer, { borderWidth: 0 }];
        backgroundParent = '#764021';
        backgroundColor = '#F28445';
      }
      if (item.showResult) {
        let outputRange = ['rgba(10, 255, 134, 255)', 'rgba(114, 200, 215, 255)', 'rgba(10, 255, 134, 255)'];
        if (item.choose) outputRange = ['rgba(242, 132, 69, 255)', 'rgba(10, 255, 134, 255)', 'rgba(242, 132, 69, 255)'];
        backgroundColor = this.background.interpolate({
          inputRange: [0, 1, 2],
          outputRange: outputRange
        });
      }
    } else {
      if (item.choose) {
        backgroundColor = '#F28445';
        backgroundParent = '#764021';
      } else if (!item.choose) {
        backgroundColor = '#72C5D7';
        this.viewAnswer = {
          width: '49%',
          height: heightAnswer,
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: fullSurvey ? 5 : 10,
          justifyContent: 'center',
          position: 'absolute',
          top: -4,
          left: -2
        };
      }
    }
    let fontSize = 8.5 * Dimension.scale;
    if (landscape) fontSize = 12 * Dimension.scale;
    if (fullSurvey && !landscape) {
      return (
        <View style={[styles.wrapperFullPortrait]}>
          <TouchableWithoutFeedback disabled={item.disable ? true : false} onPress={this.onPressChooseAnswer}>
            <Animated.View style={[styles.viewAnswerPortrait, { backgroundColor: backgroundColor }]}>
              <View style={[styles.buttonAnswer]}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={styles.wrapperNumber}>
                    <BaseText style={[styles.textFurigana, { fontSize }]}>{index + 1 + '.'}</BaseText>
                  </View>
                  <HTMLFurigana html={item.value} textStyle={[styles.textFurigana, { fontSize }]} textContainer={{ justifyContent: 'center' }} />
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
    return (
      <View style={[this.viewAnswer, { backgroundColor: backgroundParent }, styles.parentAnswers]}>
        <TouchableWithoutFeedback onPress={this.onPressChooseAnswer} disabled={item.disable ? true : false}>
          <Animated.View style={[this.viewAnswer, { width: '100%', height: '100%', backgroundColor }]}>
            <View style={styles.buttonAnswer}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={styles.wrapperNumber}>
                  <BaseText style={[styles.textFurigana, { fontSize }]}>{index + 1 + '.'}</BaseText>
                </View>
                <HTMLFurigana html={item.value} textStyle={[styles.textFurigana, { fontSize }]} textContainer={{ justifyContent: 'center' }} />
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

class ItemSurveyAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: props.answer,
      showResult: props.showed ? true : false
    };
    this.index = 0;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.fullSurvey !== this.props.fullSurvey || nextState !== this.state || nextProps.landscape !== this.props.landscape;
  }

  componentWillUnmount() {
    clearTimeout(this.timeHide);
  }

  onPressChooseAnswer = (id) => {
    const { fullSurvey } = this.props;
    let { answer } = this.state;
    for (let i = 0; i < answer.length; i++) {
      let item = { ...answer[i] };
      item.choose = answer[i].id == id;
      answer[i] = item;
    }
    if (fullSurvey) this.props.onChangeButtonNext();
    this.setState({ answer });
  };

  onShowResult = (surveyQuestion) => {
    let videoQuestion = [...this.props.videoQuestionInfo];
    let questionInfo = { ...surveyQuestion };
    let { answer } = this.state;
    let userCorrect = false;
    for (let i = 0; i < answer.length; i++) {
      let item = { ...answer[i] };
      if (item.grade > 0) {
        item.showResult = true;
        this.index = i;
        if (item.choose) userCorrect = true;
      }
      item.disable = true;
      answer[i] = item;
    }
    questionInfo.answers = answer;
    questionInfo.showed = true;
    for (let j = 0; j < videoQuestion.length; j++) {
      let item = { ...videoQuestion[j] };
      if (item.id == surveyQuestion.id) {
        item = questionInfo;
        videoQuestion[j] = item;
        break;
      }
    }
    this.props.onChangeVideoQuestion(videoQuestion);
    this.setState({ answer, showResult: true });
    this[`AnswerSurvey${this.index}`]?.changeBackGround().start();
    if (userCorrect) {
      Sounds.stop('wrongAnswer');
      Sounds.stop('correctAnswer');
      Sounds.play('correctAnswer').then((finish) => {
        if (this.props.fullSurvey && finish) this.timeHideFullServey();
      });
    } else {
      Sounds.stop('wrongAnswer');
      Sounds.stop('correctAnswer');
      Sounds.play('wrongAnswer').then((finish) => {
        if (this.props.fullSurvey && finish) this.timeHideFullServey();
      });
    }
  };

  timeHideFullServey = () => {
    clearTimeout(this.timeHide);
    this.timeHide = setTimeout(() => {
      this.props.onSkipPlayVideo();
    }, 2000);
  };

  stopChangeBackground = () => {
    this[`AnswerSurvey${this.index}`]?.changeBackGround().stop();
  };

  renderItem = (item, index) => {
    const { showResult } = this.state;
    const { fullSurvey, landscape } = this.props;
    return (
      <AnswerSurvey
        ref={(refs) => (this[`AnswerSurvey${index}`] = refs)}
        item={item}
        onPressChooseAnswer={this.onPressChooseAnswer}
        showResult={showResult}
        key={item.id}
        fullSurvey={fullSurvey}
        index={index}
        landscape={landscape}
      />
    );
  };

  renderSurvey = () => {
    const { fullSurvey, answer, landscape } = this.props;
    let parentStyles = { paddingVertical: 0 };
    if (fullSurvey && !landscape) {
      return <View style={styles.wrapperFullSurvey}>{answer.map(this.renderItem)}</View>;
    }
    if (fullSurvey) parentStyles = { paddingVertical: 5, width: '90%' };
    return <View style={[styles.wrapperAnswer, parentStyles]}>{answer.map(this.renderItem)}</View>;
  };

  render() {
    return this.renderSurvey();
  }
}

const mapStateToProps = (state) => ({
  videoQuestionInfo: state.lessonReducer.videoQuestionInfo
});
const mapDispatchToProps = { onChangeVideoQuestion };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(ItemSurveyAnswers);

const styles = StyleSheet.create({
  viewAnswer: {
    width: '48%',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingLeft: 15,
    justifyContent: 'center'
  },
  textAnswers: {
    marginLeft: 5,
    fontWeight: '600'
  },
  viewAnimated: {
    width: '100%',
    height: 3,
    backgroundColor: Colors.greenColorApp,
    position: 'absolute'
  },
  buttonAnswer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginRight: 10,
    overflow: 'hidden'
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignSelf: 'center',
    backgroundColor: 'red',
    height: '90%'
  },
  viewCircle: {
    width: 20,
    height: 20,
    borderRadius: 25,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapperAnswer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'space-around'
  },
  viewAnswerFull: {
    width: '85%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textFurigana: {
    color: 'white',
    fontSize: 12 * Dimension.scale,
    fontWeight: '600'
  },
  viewAnimatedBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'yellow',
    position: 'absolute',
    borderRadius: 10
  },
  wrapperNumber: {
    width: 20 * Dimension.scale,
    aspectRatio: 1 / 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  parentAnswers: {
    position: 'relative',
    top: 0,
    left: 0
  },
  viewBlink: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10
  },
  wrapperFullSurvey: {
    flex: 1,
    width: '100%'
  },
  wrapperFullPortrait: {
    flex: 1,
    marginTop: 5,
    alignItems: 'center'
  },
  viewAnswerPortrait: {
    width: '95%',
    height: '100%',
    borderRadius: 5
  }
});
