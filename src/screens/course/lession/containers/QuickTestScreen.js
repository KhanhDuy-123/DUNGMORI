import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Header from 'common/components/base/Header';
import LoadingModal from 'common/components/base/LoadingModal';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import { isIphoneX } from 'common/helpers/IPhoneXHelper';
import EventService from 'common/services/EventService';
import NavigationService from 'common/services/NavigationService';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import HeaderMondaiQuickTest from './containers/HeaderMondaiQuickTest';
import ItemQuickTest from './containers/ItemQuickTest';
import ListFooterQuickTest from './containers/ListFooterQuickTest';
import ModalSettingQuickTest from './containers/ModalSettingQuickTest';
import PopupShowResultQuickTest from './containers/PopupShowResultQuickTest';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';

const STATUS_BAR_HEIGHT = getStatusBarHeight();
const width = Dimension.widthParent;
class QuickTestScreen extends Component {
  constructor(props) {
    super(props);
    this.listAnswer = [];
    const isViewResult = this.props.navigation?.state?.params?.isViewResult;
    this.state = {
      value: false,
      isViewResult,
      data: [],
      choosed: isViewResult ? true : false,
      mondaiName: '',
      listMondai: [],
      currentScore: 0,
      listAnswer: [...this.listAnswer],
      currentQuestion: 0
    };
    this.questionIndex = 0;
    this.AnimatedHeight = new Animated.Value(0);
    this.countPage = 0;
    this.offsetY = 0;
    this.Mondai = [];
    this.totalCorrect = 0;
    this.correctAnswer = {};
    this.listUserChoose = [];
  }

  componentDidMount() {
    StatusBar.setBackgroundColor(Colors.greenColorApp);
    const { listQuestion } = this.props;
    const navigation = this.props.navigation?.state?.params;
    const historyTest = navigation?.historyTest;
    const listQuestions = navigation?.listQuestions;
    let question = historyTest ? listQuestions : listQuestion;
    this.onFillQuestion(question);
  }
  componentWillUnmount() {
    this.PopupCorrect?.stop();
    this[`ItemQuickTest${this.questionIndex}`]?.stopPlaySound();
    clearTimeout(this.timeScroll);
    StatusBar.setBackgroundColor(null);
  }

  onFillQuestion = (listQuestion = []) => {
    const listUserChoose = this.props.navigation?.state?.params?.answers;
    const answerChoosed = this.props.navigation?.state?.params?.item;
    let question = [...listQuestion];
    let totalScore = 0;
    let countMondai = 0;
    let totalQuestion = 0;
    //Lấy danh sách số lượng mondai
    for (let i = 0; i < question.length; i++) {
      let content = { ...question[i] };
      if (content.type == 1) {
        countMondai += 1;
        content.countMondai = countMondai;
        content.index = i;
        this.Mondai.push(content);
      }
      content.mondai = countMondai;
      if (question[i + 1]?.type == 1 && !answerChoosed) content.mondai += 1;
      question[i] = content;
    }

    //Danh sách câu hỏi
    let listData = question.filter((e) => e.type == 10);
    for (let i = 0; i < listData.length; i++) {
      let content = { ...listData[i] };
      this.lessonId = content.lesson_id;
      if (!content.answers) continue;
      if (answerChoosed?.questionId == content.id) {
        this.questionIndex = i;
        this.questionMondai = content.mondai;
      }
      totalQuestion += 1;
      try {
        //Parse json cau tra loi va check cau tra loi dung
        content.answers = Funcs.jsonParse(content.answers);
        let listAnswer = content.answers;
        let answers = [];
        for (let j = 0; j < listAnswer.length; j++) {
          let itemAnswer = { ...listAnswer[j] };
          if (parseInt(listAnswer[j].grade) > 0) totalScore = totalScore + parseInt(listAnswer[j].grade);
          if (!listUserChoose) continue;
          //Check đáp án khi làm trên web và làm trên app
          if ((listUserChoose[content.id]?.v == itemAnswer.id || listUserChoose[content.id] == itemAnswer.id) && itemAnswer.grade == 0) {
            itemAnswer.userCheck = true;
          } else if ((listUserChoose[content.id]?.v !== itemAnswer.id || listUserChoose[content.id] !== itemAnswer.id) && itemAnswer.grade > 0) {
            itemAnswer.correct = true;
          }
          answers.push(itemAnswer);
        }
        //Check người dùng không chọn đáp
        if (listUserChoose && !listUserChoose[content.id] && answerChoosed) content.user_not_answer = true;
        content.answers = listUserChoose ? answers : listAnswer;
      } catch (error) {
        Funcs.log(error);
      }
      listData[i] = content;
    }
    if (!answerChoosed) listData.push(0);
    let currentQuestion = this.state.currentQuestion + 1;
    if (answerChoosed) currentQuestion = 0;
    this.setState({ data: listData, totalScore, totalQuestion, currentQuestion }, this.onScrolllToItem);
  };

  onScrolllToItem = () => {
    const answerChoosed = this.props.navigation.state.params?.item;
    if (answerChoosed) {
      clearTimeout(this.timeScroll);
      this.timeScroll = setTimeout(() => {
        this.questionIndex -= 1;
        this.onScrollNextQuestion();
      }, 500);
    }
  };

  onPressChooseAnswer = (item, index, correctAnswer, question, mondai, audioAnswer) => {
    let { data, currentQuestion } = this.state;
    this.questionIndex = index;
    this.questionMondai = mondai;
    this.correctAnswer = correctAnswer;
    this.audioAnswer = audioAnswer;
    let choosed = this.listAnswer.find((e) => e.questionId == question.questionId);
    if (!choosed) {
      this.listAnswer.push(question);
      this.listUserChoose.push(item);
    } else {
      for (let i = 0; i < this.listAnswer.length; i++) {
        let content = { ...this.listAnswer[i] };
        if (content.questionId == question.questionId) {
          this.listAnswer[i] = question;
          this.listUserChoose[i] = item;
          break;
        }
      }
    }
    //Hiển thị kết quả
    let showSubmit = false;
    this.countPage += 1;
    this[`ItemQuickTest${this.questionIndex}`].onDisableButtonAnswers();
    this[`ItemQuickTest${this.questionIndex}`]?.stopPlaySound();
    this.PopupCorrect.showResult(item.grade, this.correctAnswer, this.audioAnswer);
    if (currentQuestion + 1 == data.length) showSubmit = true;
    this.setState({ choosed: item.choose, answer: item, showSubmit });
  };

  onPressNextPage = () => {
    let { endList, isViewResult } = this.state;
    if (isViewResult) this.onScrollNextQuestion();
    else if (!endList) this.onScrollList();
    else {
      EventService.emit('doTestAgain');
      this.props.navigation.replace(ScreenNames.QuickTestScreen);
    }
  };

  onScrollNextQuestion = () => {
    const { data } = this.state;
    this[`ItemQuickTest${this.questionIndex}`]?.stopPlaySound();
    this.questionIndex += 1;
    if (this.questionIndex > data.length - 1) return;
    let index = this[`ItemQuickTest${this.questionIndex}`]?.mondai();
    this.HeaderMondaiQuickTest.scrollTo(index - 1);
    this.setState({ currentQuestion: this.questionIndex + 1 });
    this.ScrollView.scrollTo({ y: 0, x: this.questionIndex * width, animated: true });
  };

  onScrollList = async () => {
    let { data, answer, currentScore, currentQuestion } = this.state;
    let autoPlaySound = await StorageService.get(Const.DATA.QUICKTEST_SETTING);
    let question = currentQuestion + 1;
    if (autoPlaySound || autoPlaySound === null) {
      this[`ItemQuickTest${question - 1}`]?.playSound();
    }
    if (this.ScrollView && this.countPage == 1 && data[this.questionIndex + 1]) {
      //Chuyển page
      this.PopupCorrect.hideResult();
      this.ScrollView.scrollTo({ animated: true, y: 0, x: (this.questionIndex + 1) * width });
      this.countPage = 0;
      let choosed = false;
      if (this.questionIndex + 1 == data.length) choosed = true;
      currentScore += parseInt(answer.grade);
      //Paused sound
      this.PopupCorrect?.stop();
      this[`ItemQuickTest${this.questionIndex}`]?.stopPlaySound();
      this.setState({ choosed, currentScore: currentScore, currentQuestion: question });

      //Cuộn mondai
      let index = this[`ItemQuickTest${this.questionIndex}`]?.mondai();
      this.HeaderMondaiQuickTest?.scrollTo(index - 1);
    } else if (this.ScrollView && this.countPage == 1 && !data[this.questionIndex + 1]) {
      //Submit và chuyển sang page kết qủa
      this.PopupCorrect.hideResult();
      this.PopupCorrect?.stop();
      currentScore += parseInt(answer.grade);
      this.onSubmitAnswer(currentScore);
    }
  };

  onPressPlaySoundPopup = () => {
    this[`ItemQuickTest${this.questionIndex}`]?.stopPlaySound();
  };

  onPressPlaySound = () => {
    this.PopupCorrect?.stop();
  };

  onSubmitAnswer = async (currentScore) => {
    const data = {
      lessonId: this.lessonId,
      answer: JSON.stringify(this.listAnswer)
    };
    LessonActionCreator.submitAnswer(data, (value) => {
      this.ScrollView.scrollToEnd({ animated: true });
      EventService.emit('submitQuickTest');
      try {
        value.data = Funcs.jsonParse(value.data);
        this.setState({
          listAnswer: this.listAnswer,
          endList: true,
          answers: value.data,
          passMark: value.pass_marks,
          currentScore
        });
      } catch (error) {
        Funcs.log(error);
      }
    });
  };

  onPressIgnore = () => {
    this.props.navigation.goBack();
    this.PopupCorrect?.stop();
    this[`ItemQuickTest${this.questionIndex}`]?.stopPlaySound();
  };

  onPressNaviItem = (item) => {
    const { answers } = this.state;
    this.props.navigation.push(ScreenNames.QuickTestScreen, { isViewResult: true, listAnswer: this.listUserChoose, answers, item });
  };

  onLayout = (event) => {
    this.offsetY = event.nativeEvent.layout.height;
  };

  onPressSetting = () => {
    this.quickTestRef.showModal();
  };

  onBackPress = () => NavigationService.pop();

  keyExtractor = (item, index) => item.id.toString();

  renderHeader = () => {
    const lessonName = this.props.navigation?.state?.params?.lessonName;
    const historyTest = this.props.navigation?.state?.params?.historyTest;
    if (!historyTest) return null;
    return (
      <SafeAreaView style={{ width: Dimension.widthParent, backgroundColor: Colors.greenColorApp }}>
        <Header
          left
          headerStyle={styles.headerStyle}
          text={lessonName}
          titleStyle={{ fontSize: 18, color: Colors.white100 }}
          colorBackButton={Colors.white100}
          onBackPress={this.onBackPress}
        />
      </SafeAreaView>
    );
  };

  renderItem = (item, index) => {
    const { isViewResult } = this.state;
    if (item == 0) return this.renderListFooter();
    return (
      <ItemQuickTest
        key={`Item ${item.id}`}
        isViewResult={isViewResult}
        item={item}
        onPressChooseAnswer={this.onPressChooseAnswer}
        onPressPlaySound={this.onPressPlaySound}
        index={index}
        ref={(refs) => (this[`ItemQuickTest${index}`] = refs)}
      />
    );
  };

  renderListFooter = () => {
    const { isViewResult, listAnswer, totalScore, currentScore, passMark } = this.state;
    if (isViewResult) return null;
    return (
      <ListFooterQuickTest
        onPressNaviItem={this.onPressNaviItem}
        dataList={listAnswer}
        totalScore={totalScore}
        currentScore={currentScore}
        key={'ListFooterQuickTest'}
        passMark={passMark}
      />
    );
  };

  renderTotalQuestion = () => {
    const { endList, totalQuestion, currentQuestion } = this.state;
    if (!endList) {
      return (
        <View style={styles.viewCount}>
          <View style={styles.wrapperCount}>
            <BaseText style={{ textAlign: 'center', paddingLeft: 30 * Dimension.scale }}>{`${currentQuestion}/${totalQuestion}`}</BaseText>
          </View>
          <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={this.onPressSetting}>
            <Icon name="ios-settings" size={24} />
          </TouchableOpacity>
        </View>
      );
    }
  };

  renderButtonNext = () => {
    const { data, choosed, isViewResult, endList, currentQuestion, showSubmit } = this.state;
    let buttonName = Lang.quick_test.continue;
    if (endList) buttonName = Lang.quick_test.do_again;
    if (isViewResult && currentQuestion == data.length) return null;
    if (showSubmit && !endList) buttonName = Lang.quick_test.text_submit;
    return (
      <TouchableOpacity
        style={[styles.button, { backgroundColor: choosed ? Colors.greenColorApp : '#999999' }]}
        disabled={!choosed}
        onPress={this.onPressNextPage}>
        <BaseText style={styles.textButton}>{buttonName}</BaseText>
      </TouchableOpacity>
    );
  };

  render() {
    const { data, isViewResult, endList } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        <View style={styles.container}>
          {this.renderTotalQuestion()}
          <HeaderMondaiQuickTest dataLength={data.length} endList={endList} listMondai={this.Mondai} ref={(refs) => (this.HeaderMondaiQuickTest = refs)} />
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            ref={(refs) => (this.ScrollView = refs)}
            removeClippedSubviews={true}
            scrollEnabled={false}>
            {data.map(this.renderItem)}
          </ScrollView>
        </View>
        <PopupShowResultQuickTest offsetY={this.offsetY} ref={(refs) => (this.PopupCorrect = refs)} onPressPlaySoundPopup={this.onPressPlaySoundPopup} />
        <View style={styles.areaCheck} onLayout={this.onLayout}>
          {this.renderButtonNext()}
          {isViewResult && (
            <TouchableOpacity style={styles.buttonBack} onPress={this.onPressIgnore}>
              <BaseText style={{ ...styles.textButton, color: Colors.greenColorApp }}>{Lang.quick_test.back}</BaseText>
            </TouchableOpacity>
          )}
        </View>
        <ModalSettingQuickTest ref={(ref) => (this.quickTestRef = ref)} />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listQuestion: state.lessonReducer.listQuestions
  };
};

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(QuickTestScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    marginLeft: 35
  },
  textTitle: {
    fontSize: 26,
    fontStyle: 'italic'
  },
  button: {
    width: 260 * Dimension.scale,
    height: 38,
    borderRadius: 100,
    backgroundColor: Resource.colors.greenColorApp,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15
  },
  textButton: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600'
  },
  viewResults: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15 * Dimension.scale,
    marginHorizontal: 15
  },
  areaCheck: {
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF'
  },
  textResults: {
    fontSize: 20,
    color: '#379C3B',
    fontWeight: '600'
  },
  icButton: {
    width: 20,
    height: 20
  },
  viewCount: {
    width: Dimension.widthParent,
    height: 30,
    flexDirection: 'row',
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapperCount: {
    flex: 5
  },
  buttonBack: {
    width: 260 * Dimension.scale,
    height: 38,
    borderRadius: 100,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: Colors.greenColorApp
  },
  headerStyle: {
    backgroundColor: Colors.greenColorApp,
    paddingTop: isIphoneX() ? 0 : STATUS_BAR_HEIGHT
  }
});
