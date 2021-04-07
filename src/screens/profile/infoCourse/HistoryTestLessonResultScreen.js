import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import Header from 'common/components/base/Header';
import LoadingModal from 'common/components/base/LoadingModal';
import ItemTest from 'screens/components/lession/ItemTest';
import Const from 'consts/Const';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import NavigationService from 'common/services/NavigationService';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import ListFooterQuickTest from 'screens/course/lession/containers/containers/ListFooterQuickTest';
import ScreenNames from 'consts/ScreenName';

const width = Dimension.widthParent;

const ContentResult = (item) => {
  return (
    <View style={styles.viewContent}>
      <BaseText>{item.title}</BaseText>
      <BaseText style={item.contentStyle}>{item.content}</BaseText>
    </View>
  );
};
export default class HistoryTestLessonResultScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listQuestions: [],
      loading: true,
      playId: 0
    };
    this.totalScore = 0;
    this.currentScore = 0;
  }

  async componentDidMount() {
    let paramsHistory = NavigationService.getParams('paramsHistory');
    LoadingModal.show();
    let res = await Fetch.get(Const.API.LESSON.GET_LESSON_DETAIL, { lessonId: paramsHistory.section.id }, true);
    LoadingModal.hide();
    this.listDataParent = [];
    if (res.status === Fetch.Status.SUCCESS) {
      let listData = res.data;
      let isQuickTest = false;
      try {
        let listQuestions = [];
        for (let j = 0; j < listData.length; j++) {
          let item = { ...listData[j] };
          if (item.type === Const.LESSON_TYPE.MULTI_CHOISE_QUESTION || item.type == Const.LESSON_TYPE.AUDIO || item.type == 10 || item.type == 1) {
            if (item.type == 10 && !isQuickTest) isQuickTest = true;
            if (item.type == Const.LESSON_TYPE.AUDIO) {
              item.paused = true;
            }
            this.listDataParent.push(listData[j]);
            const idQuestion = item.id;
            // if (!item.answers) continue;
            let listAnswers = item.answers;
            listAnswers = Funcs.jsonParse(item.answers);
            let answerId = null;
            let score = 0;
            for (let i = 0; i < listAnswers?.length; i++) {
              let answerItem = { ...listAnswers[i] };
              try {
                if (answerItem.grade > 0 && !(answerItem?.id == parseInt(paramsHistory.item.data[idQuestion]))) {
                  answerItem.isEmptyCheck = true;
                  this.totalScore += parseInt(answerItem.grade);
                } else if (answerItem.grade > 0 && answerItem?.id == parseInt(paramsHistory.item.data[idQuestion])) {
                  answerItem.isCheck = true;
                }
              } catch (error) {
                Funcs.log(error);
              }

              if (answerItem?.id == paramsHistory.item.data[idQuestion]?.v) {
                answerItem.isCheckResult = true;
                answerId = answerItem.id;
                score = answerItem.grade;
                this.currentScore += parseInt(answerItem.grade);
              }
              //Check đáp án khi làm trên web
              if (answerItem?.id == parseInt(paramsHistory.item.data[idQuestion])) {
                answerItem.isCheckResult = true;
                answerId = answerItem.id;
                score = answerItem.grade;
                this.currentScore += parseInt(answerItem.grade);
              }
              listAnswers[i] = answerItem;
            }
            item.answers = listAnswers;
            if (isQuickTest) {
              let content = { answerId: answerId, questionId: idQuestion, score: score };
              listQuestions.push(content);
            } else listQuestions.push(item);
          }
        }
        this.setState({
          listQuestions: listQuestions,
          loading: false,
          isQuickTest
        });
      } catch (error) {
        Funcs.log(error, 'ERROR RESULT TEST');
      }
    }
  }

  onBack = () => {
    const { navigation } = this.props;
    if (navigation.state.params.reload) {
      navigation.state.params.reload(
        navigation.state.params.videoProgress,
        navigation.state.params.examProgress,
        navigation.state.params.lessonId,
        navigation.state.params.groupLessonId
      );
    }
    NavigationService.pop();
  };

  onPlay = (id) => {
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

  onPressNaviQuickTest = (item) => {
    let paramsHistory = NavigationService.getParams('paramsHistory');
    let data = {
      isViewResult: true,
      item: item,
      answers: paramsHistory.item.data,
      historyTest: true,
      listQuestions: this.listDataParent,
      lessonName: paramsHistory.section.name
    };
    NavigationService.navigate(ScreenNames.QuickTestScreen, data);
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    return <ItemTest item={item} disabled={true} onPlay={this.onPlay} playId={this.state.playId} onEnd={this.onEndSound} />;
  };

  renderResult() {
    let paramsHistory = NavigationService.getParams('paramsHistory');
    const { isQuickTest } = this.state;
    if (isQuickTest) return null;
    return (
      <View style={styles.viewResult}>
        <BaseText style={{ fontSize: 17 }}>{paramsHistory.section.name}</BaseText>
        <View style={styles.viewDes}>
          <View style={styles.shadowStyle}>
            <ContentResult
              title={Lang.profile.text_result}
              content={paramsHistory.item.grade >= paramsHistory.section.pass_marks ? Lang.historyOfTest.text_passed_test : Lang.historyOfTest.text_fail_test}
              contentStyle={{ color: paramsHistory.item.grade >= paramsHistory.section.pass_marks ? 'black' : 'red' }}
            />
            <ContentResult title={Lang.profile.text_point_test} content={`${paramsHistory.item.grade} ${Lang.test.text_point}`} />
            <ContentResult title={Lang.profile.text_total_score} content={`${paramsHistory.item.total_grade} ${Lang.test.text_point}`} />
            <ContentResult title={Lang.testScreen.hint_text_date_test} content={paramsHistory.item.time} />
          </View>
        </View>
      </View>
    );
  }

  renderContent = () => {
    const { listQuestions, isQuickTest } = this.state;
    let paramsHistory = NavigationService.getParams('paramsHistory');
    if (isQuickTest) {
      return (
        <ListFooterQuickTest
          dataList={listQuestions}
          onPressNaviItem={this.onPressNaviQuickTest}
          totalScore={this.totalScore}
          currentScore={this.currentScore}
          passMark={paramsHistory.section.pass_marks}
        />
      );
    }
    return (
      <View style={styles.container}>
        {listQuestions.length !== 0 ? (
          <FlatList
            style={styles.flatlist}
            data={listQuestions}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            bounces={false}
            extraData={this.state}
            showsVerticalScrollIndicator={false}
          />
        ) : !this.state.loading ? (
          <FastImage source={Resource.images.imgEmpty} style={styles.imageEmpty} />
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <Container>
        <Header left text={Lang.profile.text_header_test_result} titleArea={styles.titleArea} titleStyle={styles.titleStyle} onBackPress={this.onBack} />
        <ScrollView>
          {this.renderResult()}
          {this.renderContent()}
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: Resource.colors.white100
  },
  titleArea: {
    alignItems: 'flex-start'
  },
  titleStyle: {
    fontStyle: 'italic'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerItem: {
    flex: 1
  },
  flatlist: {
    flex: 1
  },
  imageEmpty: {
    width: '50%',
    aspectRatio: 1 / 1,
    marginBottom: 10
  },
  viewResult: {
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    marginBottom: 10
  },
  viewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4
  },
  viewDes: {
    alignItems: 'center',
    marginVertical: 15
  },
  shadowStyle: {
    width: width - 30 * Dimension.scale,
    backgroundColor: Resource.colors.white100,
    padding: 15,
    borderWidth: 0.5,
    borderRadius: 15,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center'
  }
});
