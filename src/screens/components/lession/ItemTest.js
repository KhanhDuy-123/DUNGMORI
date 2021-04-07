import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import Const from 'consts/Const';
import React from 'react';
import { Clipboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import StripTags from 'striptags';
import Answers from './ItemAnswers';
import SoundPlayer from './SoundPlayer';
const width = Dimension.widthParent;

export default class ItemTest extends React.Component {
  constructor(props) {
    super(props);
    const { item } = this.props;
    var question = {};
    try {
      if (item) {
        question = item;
        if (
          question.type !== Const.LESSON_TYPE.DOCUMENT ||
          question.type !== Const.LESSON_TYPE.VIDEO ||
          question.type !== Const.LESSON_TYPE.MULTI_CHOISE_QUESTION
        ) {
          if (item.value) {
            let value = null;
            if ((question.type && question.type == Const.LESSON_TYPE.AUDIO) || question.type == Const.LESSON_TYPE.ANSWER) {
              value = Funcs.jsonParse(item.value);
            } else {
              value = item.value;
            }
            question.value = value;
          }
        }
      }
    } catch (error) {
      Funcs.log(`error parse`, error);
    }

    this.state = {
      answers: item && item.answers && item.answers != null ? item.answers : [],
      chooseAnswer: [],
      question: question,
      playId: 0,
      toggleShow: true,
      paused: props.item.paused
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item.paused !== this.state.paused) {
      this.setState({ paused: nextProps.item.paused });
    }
    return (
      nextProps.item.paused !== this.state.paused ||
      nextProps.item.finish !== this.state.finish ||
      nextState.answers !== this.state.answers ||
      nextState.toggleShow !== this.state.toggleShow
    );
  }

  onPressChooseAnswer = (item, id) => {
    var { answers } = this.state;
    const listAnswer = answers.map((item1) => {
      item1.isCheck = item1.id == item.id;
      return item1;
    });
    this.setState({
      answers: listAnswer
    });
    const dataObj = { questionId: id, answerId: item.id, score: item.grade };
    this.props.onSelectedAnswer(dataObj);
  };

  onShowContent = () => {
    this.setState({ toggleShow: !this.state.toggleShow });
  };

  onLongPressCopyText = (content) => async () => {
    content = content.replace(new RegExp('&nbsp;', 'g'), '');
    await Clipboard.setString(StripTags(content));
    DropAlert.info('', Lang.comment.text_dropdown);
  };

  //render Questions
  renderQuestion() {
    var { item, disabled, isTryDoTest } = this.props;
    let content = isTryDoTest ? item.content : item.value;
    const isResultSuggess = Array.isArray(content);
    if (isResultSuggess) {
      if (!item.finish) return null;
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={this.onShowContent} activeOpacity={0.7} style={{ width: '100%' }}>
            <View style={styles.textTitle}>
              <BaseText style={styles.textResult}>{item.value[0].name}</BaseText>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={this.state.toggleShow}>
            <TouchableOpacity onLongPress={this.onLongPressCopyText(item.value[0].content)} activeOpacity={1}>
              <HTMLFurigana html={item.value[0].content} showResult={disabled} />
            </TouchableOpacity>
          </Collapsible>
        </View>
      );
    }
    return (
      <TouchableOpacity onLongPress={this.onLongPressCopyText(content)} activeOpacity={1}>
        <HTMLFurigana html={item.type == Const.LESSON_TYPE.PDF ? null : content} showResult={disabled} />
      </TouchableOpacity>
    );
  }

  //render Answers
  renderAnswers = (id) => {
    const { isTryDoTest, disabled } = this.props;
    var { item } = this.props;
    var { answers } = this.state;
    try {
      let checkAnswers = answers && answers.length > 0;
      if (!checkAnswers || parseInt(item.grade) < 1) return null;
      return (
        <View style={styles.boxItem}>
          {answers?.map((e, idx) => (
            <Answers item={e} key={idx} id={id} isTryDoTest={isTryDoTest} disabled={disabled} onPressChooseAnswer={this.onPressChooseAnswer} />
          ))}
        </View>
      );
    } catch (error) {
      Funcs.log(`ERORR`, error);
    }
    return null;
  };

  render() {
    var { item } = this.props;
    const { question } = this.state;
    return (
      <View style={styles.containerItem}>
        <View style={styles.itemQuestion}>{item.type !== Const.LESSON_TYPE.AUDIO ? this.renderQuestion() : null}</View>
        {question.type && question.type == Const.LESSON_TYPE.AUDIO ? (
          <SoundPlayer
            link={question.value && question.value.link}
            playId={this.props.playId}
            id={item.id}
            item={item}
            onEnd={this.props.onEnd}
            onPlay={this.props.onPlay}
          />
        ) : null}
        {this.renderAnswers(item.id)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerItem: {
    width: '100%',
    paddingTop: 12
  },
  flatlist: {
    flex: 1
  },
  itemQuestion: {
    flex: 1,
    paddingHorizontal: 10
  },
  webview: {
    width: width - 20,
    marginTop: 20
  },
  borderStyle: {
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: Resource.colors.greenColorApp
  },
  boxItem: {
    width: width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10
  },
  itemAnswers: {
    width: width / 2 - 5 * Dimension.scale,
    marginLeft: 4,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  textAnswers: {
    fontSize: 13 * Dimension.scale,
    marginLeft: 7 * Dimension.scale
  },
  imageEmpty: {
    width: '30%',
    aspectRatio: 1 / 1,
    marginBottom: 10
  },
  buttonSubmitAnswer: {
    width: '50%',
    height: 45 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Resource.colors.greenColorApp,
    margin: 10,
    borderRadius: 30
  },
  textButton: {
    fontSize: 14 * Dimension.scale,
    color: 'white',
    fontWeight: '500'
  },
  textResult: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
    alignSelf: 'center',
    color: '#FFFFFF'
  },
  textTitle: {
    height: 35,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
    marginVertical: 10
  }
});
