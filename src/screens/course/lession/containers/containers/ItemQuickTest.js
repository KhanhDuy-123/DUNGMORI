import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Clipboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import StripTags from 'striptags';
import ButtonSpeakQuickTest from './ButtonSpeakQuickTest';
export default class ItemQuickTest extends Component {
  constructor(props) {
    super(props);

    let item = { ...this.props.item };
    let question = props.item;
    question.value = question.value.replace(new RegExp('&nbsp;', 'g'), '');

    //Cau hoi
    let index = question.value.indexOf('{?');
    let audio = '';
    while (index > 0) {
      let indexNext = question.value.indexOf('?}', index);
      if (index > 0 && indexNext > 0) {
        audio = question.value.substring(index + 2, indexNext);
        let subtr = question.value.substring(index, indexNext + 2);
        question.value = question.value.replace(subtr, '');
      }
      index = question.value.indexOf('{?');
    }

    //Cau tra loi
    let indexAnswer = question.value.indexOf('{!');
    let indexNextAnswer = question.value.indexOf('!}', indexAnswer);
    let audioAnswer = '';
    if (indexAnswer > 0 && indexNextAnswer > 0) {
      audioAnswer = question.value.substring(indexAnswer + 2, indexNextAnswer);
      let subtr = question.value.substring(indexAnswer, indexNextAnswer + 2);
      question.value = question.value.replace(subtr, '');
    }
    item.audio = audio.trim();
    item.audioAnswer = audioAnswer.trim();
    item.value = question.value;
    let correctAnswer = props.item?.answers?.find((e) => e.grade > 0);
    let viewResult = props.isViewResult ? true : false;
    this.state = {
      answers: props.item.answers,
      disabled: viewResult,
      correctAnswer: correctAnswer,
      item
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  onPressChooseAnswer = (e) => () => {
    let { answers } = this.state;
    let params = {};
    let question = {};
    let answersChoose = {};
    for (let i = 0; i < answers.length; i++) {
      let item = { ...answers[i] };
      item.choose = e.id == item.id;
      if (e.id == item.id) {
        params = item;
        params.questionId = this.props.item.id;
        answersChoose[`${this.props.item.id}`] = item.id;
        question.answerId = item.id;
        question.score = parseInt(item.grade);
      }
      answers[i] = item;
    }
    question.questionId = this.props.item.id;
    let mondai = this.props.item.mondai;
    this.setState({ answers }, () => {
      const { item } = this.state;
      let audioAnswer = item.audioAnswer;
      this.props.onPressChooseAnswer(params, this.props.index, this.state.correctAnswer, question, mondai, audioAnswer);
    });
  };

  mondai = () => {
    return this.props.item.mondai;
  };

  onDisableButtonAnswers = () => {
    this.setState({ disabled: true });
  };

  playSound = () => {
    this.ButtonSpeakQuickTest?.playSound();
  };

  stopPlaySound = () => {
    this.ButtonSpeakQuickTest?.stopPlay();
    this.ButtonSpeakResult?.stopPlay();
  };

  onLongPressCopyText = (content) => async () => {
    content = content.replace(new RegExp('&nbsp;', 'g'), '');
    await Clipboard.setString(StripTags(content));
    DropAlert.info('', Lang.comment.text_dropdown);
  };

  onPressPlaySound = () => {
    this.ButtonSpeakResult?.stopPlay();
    this.props.onPressPlaySound();
  };

  onPressPlayResult = () => {
    this.ButtonSpeakQuickTest?.stopPlay();
    this.props.onPressPlaySound();
  };

  renderButtonVolumn = () => {
    const { item } = this.state;
    if (!item.audio) return;
    return <ButtonSpeakQuickTest audio={item.audio} ref={(refs) => (this.ButtonSpeakQuickTest = refs)} onPressPlaySound={this.onPressPlaySound} />;
  };

  renderAnswers = (e, index) => {
    const { disabled } = this.state;
    let itemStyles = styles.itemAnswers;
    let textStyles = styles.textAnswers;
    if ((disabled && e.grade == 0 && e.choose) || e.userCheck) {
      itemStyles = { ...itemStyles, borderWidth: 1, borderColor: 'red', backgroundColor: '#FFFFFF' };
      textStyles = { ...styles.textAnswers, color: '#000000' };
    } else if ((disabled && e.grade > 0 && !e.choose) || e.choose || e.correct) {
      itemStyles = { ...styles.itemAnswers, backgroundColor: Colors.greenColorApp };
      textStyles = { ...styles.textAnswers, color: '#FFFFFF' };
    }
    return (
      <View style={styles.answers} key={index}>
        <TouchableOpacity
          style={itemStyles}
          onPress={this.onPressChooseAnswer(e)}
          onLongPress={this.onLongPressCopyText(e.value)}
          disabled={this.state.disabled}>
          <BaseText style={{ ...textStyles, paddingRight: 0 }}>{`${index + 1}.`}</BaseText>
          <BaseText style={{ ...textStyles, width: '95%' }}>{e.value}</BaseText>
        </TouchableOpacity>
      </View>
    );
  };

  renderViewResult = () => {
    const { item } = this.state;
    const { isViewResult } = this.props;
    if (!(isViewResult && item.audioAnswer)) return null;
    if (isViewResult && item.audioAnswer) {
      return (
        <View style={styles.wrapResult}>
          <BaseText style={styles.textResult}>Đáp án</BaseText>
          <ButtonSpeakQuickTest audio={item.audioAnswer} ref={(refs) => (this.ButtonSpeakResult = refs)} onPressPlaySound={this.onPressPlayResult} />
        </View>
      );
    }
  };

  render() {
    const { item, answers } = this.state;
    let notAnswer = '';
    if (item.user_not_answer) notAnswer = Lang.quick_test.not_answer;
    if (item.type !== 10) return null;
    return (
      <View style={styles.container}>
        <View style={styles.viewQuestion}>
          {this.renderButtonVolumn()}
          <TouchableOpacity style={{ maxWidth: '95%', paddingRight: 10 }} onLongPress={this.onLongPressCopyText(item.value)}>
            <HTMLFurigana html={item.value} normalText={{ fontSize: 15 }} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewAnswers}>{answers.map(this.renderAnswers)}</View>
        {this.renderViewResult()}
        <BaseText style={styles.textNotAnswer}>{notAnswer}</BaseText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimension.widthParent,
    marginTop: 15
  },
  question: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 15
  },
  textMondai: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  viewQuestion: {
    flexDirection: 'row',
    width: Dimension.widthParent,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  button: {
    width: 35,
    height: 35,
    borderRadius: 100,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: 'white',
    margin: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  icButton: {
    width: 22,
    height: 22
  },
  textQuestion: {
    marginLeft: 10,
    fontSize: 14
  },
  viewAnswers: {
    marginTop: 15,
    width: 328 * Dimension.scale
  },
  answers: {
    width: Dimension.widthParent,
    marginBottom: 10,
    alignItems: 'center'
  },
  itemAnswers: {
    width: 280 * Dimension.scale,
    backgroundColor: 'white',
    minHeight: 40,
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    flexDirection: 'row',
    paddingHorizontal: 5
  },
  textAnswers: {
    fontSize: 11 * Dimension.scale,
    paddingHorizontal: 10
  },
  textResult: {
    fontSize: 15,
    marginRight: 5
  },
  wrapResult: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 10
  },
  textNotAnswer: {
    color: 'red',
    marginLeft: 10,
    marginTop: 5,
    fontSize: 16
  }
});
