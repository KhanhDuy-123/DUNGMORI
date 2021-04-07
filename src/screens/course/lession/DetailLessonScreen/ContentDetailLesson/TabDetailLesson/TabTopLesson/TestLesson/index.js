import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import LoadingModal from 'common/components/base/LoadingModal';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import EventService from 'common/services/EventService';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import CourseConst from 'consts/CourseConst';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import ItemTest from 'screens/components/lession/ItemTest';
import KaiwaNo1 from './KaiwaNo1';
import KaiwaNo2 from './KaiwaNo2';
import ModalShowResult from './ModalShowResult';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';

const width = Dimension.widthParent;
class TestLesson extends React.Component {
  constructor(props) {
    super(props);
    let { listQuestionKaiwa1, listQuestions } = this.getListQuestion(props.listQuestions);
    this.state = {
      listQuestions,
      point: 0,
      totalPoint: 0,
      result: false,
      playId: 0,
      idLesson: null,
      dataLesson: {},
      timeTest: null,
      listQuestionKaiwa1
    };
    this.listAnswer = [];
  }

  componentDidMount() {
    const { params, typeNotify } = this.props.screenProps;
    if (typeNotify) {
      if (params.item.table_name == 'kaiwa' && params.item.lessonId) {
        this.timer = setTimeout(() => {
          this.ScrollView.scrollToEnd({ animated: true });
        }, 500);
      }
    }
    EventService.add('paused', () => {
      let { listQuestions } = this.state;
      for (let i = 0; i < listQuestions.length; i++) {
        let item = { ...listQuestions[i] };
        if (!listQuestions[i].paused) {
          item.paused = true;
          listQuestions[i] = item;
          this.setState({ listQuestions });
          break;
        }
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listQuestions !== this.props.listQuestions) {
      let { listQuestionKaiwa1, listQuestions } = this.getListQuestion(nextProps.listQuestions);
      this.setState({ listQuestions, listQuestionKaiwa1 });
    }
    return nextState !== this.state;
  }

  componentWillUnmount() {
    clearTimeout(this.timeScroll);
    clearTimeout(this.timeShowModal);
    EventService.remove('paused');
  }

  getListQuestion = (questions) => {
    let listQuestions = [...questions];
    let listQuestionKaiwa1 = [];
    let isOnlyAnswer = true;
    for (let i = 0; i < listQuestions.length; i++) {
      try {
        let answers = listQuestions[i].answers;
        answers = Funcs.jsonParse(answers);
        answers =
          answers &&
          answers.map((item) => {
            item.grade = parseInt(item.grade);
            return item;
          });
        listQuestions[i].answers = answers;
        listQuestions[i].isPlay = false;
        listQuestions[i].paused = true;
        if (listQuestions[i].type !== Const.LESSON_TYPE.ANSWER) isOnlyAnswer = false;
        if (listQuestions[i].type == Const.LESSON_TYPE.KAIWA) {
          let item = { ...listQuestions[i] };
          item.value = Funcs.jsonParse(listQuestions[i].value);
          if (item.value.type !== 1) listQuestionKaiwa1.push(item);
        }
      } catch (err) {
        Funcs.log(`ERROR`, err, listQuestions[i]);
      }
    }
    if (isOnlyAnswer) listQuestions = listQuestions.map((e) => ({ ...e, finish: true }));
    return { listQuestions, listQuestionKaiwa1 };
  };

  onShowResult = () => {
    const { point, totalPoint, result, idLesson, dataLesson, timeTest } = this.state;
    try {
      let section = {
        id: idLesson,
        pass_marks: dataLesson.pass_marks
      };
      let item = {
        data: Funcs.jsonParse(dataLesson.data),
        passed: result == false ? 0 : 1,
        grade: point,
        total_grade: totalPoint,
        time: timeTest
      };
      this.props.screenProps.onShowTestResult(section, item);
    } catch (error) {}
  };

  onIgnore = () => {
    NavigationService.pop();
  };

  onPressSubmitAnswer = () => {
    if (this.listAnswer.length == 0) {
      Alert.alert('', Lang.test.text_no_answer);
      return;
    } else {
      Alert.alert('', Lang.test.text_ask_submit_test, [{ text: 'OK', onPress: this.onSubmitAnswer }, { text: 'CANCEL' }]);
      return;
    }
  };

  onSubmitAnswer = async () => {
    const data = {
      lessonId: this.props.screenProps.lessonId,
      answer: JSON.stringify(this.listAnswer)
    };
    LessonActionCreator.submitAnswer(data, (value) => {
      let { listQuestions } = this.state;
      listQuestions = listQuestions.map((e) => {
        e = { ...e, finish: true };
        return e;
      });

      // Update
      this.setState({
        point: value.grade,
        totalPoint: value.total_grade,
        result: value.passed,
        idLesson: value.lesson_id,
        dataLesson: value,
        timeTest: value.created_at,
        listQuestions
      });
      this.timeShowModal = setTimeout(() => {
        this.ShowModal.showModal();
      }, 800);
      this.props.screenProps.onSubmitAnswers();
    });
  };

  onSelectedAnswer = (dataObj) => {
    this.listAnswer = this.listAnswer.filter((item1) => {
      return item1.questionId != dataObj.questionId;
    });
    this.listAnswer.push(dataObj);
  };

  onEndSound = (item) => {
    let listQuestions = this.state.listQuestions;
    for (let i = 0; i <= listQuestions.length; i++) {
      if (!listQuestions[i]) continue;
      if (listQuestions[i].id == item.id) {
        listQuestions[i].paused = true;
        break;
      }
    }
    this.setState({ listQuestions });
  };

  onPlaySound = (id) => {
    let listQuestions = this.state.listQuestions;
    for (let i = 0; i <= listQuestions.length; i++) {
      if (!listQuestions[i]) continue;
      if (listQuestions[i].id == id) {
        listQuestions[i].paused = !listQuestions[i].paused;
      } else {
        listQuestions[i].paused = true;
      }
    }
    this.setState({ listQuestions });
  };

  onScrollToEnd = () => {
    this.timeScroll = setTimeout(() => {
      this.ScrollView.scrollToEnd();
    }, 200);
  };

  renderListFooter = () => {
    const { listQuestions } = this.state;
    for (let i = 0; i < listQuestions.length; i++) {
      if (listQuestions[i].type == Const.LESSON_TYPE.MULTI_CHOISE_QUESTION) {
        return (
          <View style={{ width, alignItems: 'center' }}>
            <TouchableOpacity style={styles.buttonSubmitAnswer} onPress={this.onPressSubmitAnswer}>
              <BaseText style={styles.textButton}>{Lang.test.text_submit}</BaseText>
            </TouchableOpacity>
          </View>
        );
      }
    }
    return null;
  };

  renderItem = (item, index) => {
    return (
      <ItemTest
        key={'Item_' + index}
        item={item}
        ref={(refs) => (this.TestItem = refs)}
        onSelectedAnswer={this.onSelectedAnswer}
        playId={this.state.playId}
        onEnd={this.onEndSound}
        onPlay={this.onPlaySound}
      />
    );
  };

  render() {
    const { point, totalPoint, result, listQuestions, listQuestionKaiwa1 } = this.state;
    const { lessonId } = this.props.screenProps;
    const { kaiwaNo2Demo, lessonInfo } = this.props;
    const courseId = parseInt(lessonInfo?.courseId || '0');
    const isKaiwaCourse = courseId === CourseConst.KAIWA.ID || courseId === CourseConst.KAIWA_SOCAP.ID || courseId === CourseConst.KAIWA_TRUNGCAP.ID;
    return (
      <View style={styles.container}>
        <ScrollView ref={(refs) => (this.ScrollView = refs)}>
          {isKaiwaCourse ? (
            <View>
              <KaiwaNo1 listQuestions={listQuestionKaiwa1} kaiwaNo2Demo={kaiwaNo2Demo} lessonId={lessonId} courseId={parseInt(lessonInfo?.courseId || 0)} />
              {Object.keys(kaiwaNo2Demo).length > 0 && (
                <KaiwaNo2 listQuestions={listQuestions} lessonId={lessonId} kaiwaNo2Demo={kaiwaNo2Demo} onScrollToEnd={this.onScrollToEnd} />
              )}
            </View>
          ) : (
            <View>
              {listQuestions && listQuestions.map(this.renderItem)}
              {this.renderListFooter()}
            </View>
          )}
        </ScrollView>
        <ModalShowResult
          ref={(refs) => (this.ShowModal = refs)}
          point={point}
          totalPoint={totalPoint}
          result={result}
          onPressIgnore={this.props.onPressIgnore}
          onShowResult={this.onShowResult}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  listQuestions: state.lessonReducer.listQuestions,
  kaiwaNo2Demo: state.lessonReducer.kaiwaNo2Demo,
  lessonInfo: state.lessonReducer.lessonInfo
});

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(TestLesson);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    paddingTop: 13,
    backgroundColor: Resource.colors.white100,
    alignItems: 'center',
    justifyContent: 'center'
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
  }
});
