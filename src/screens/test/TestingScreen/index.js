import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import DropAlert from 'common/components/base/DropAlert';
import LoadingModal from 'common/components/base/LoadingModal';
import ModalWebView from 'common/components/base/ModalWebView';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import Time from 'common/helpers/Time';
import NavigationService from 'common/services/NavigationService';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import UrlConst from 'consts/UrlConst';
import htmlparser2 from 'htmlparser2';
import React, { Component } from 'react';
import { Alert, BackHandler, FlatList, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import ItemTest from 'screens/components/lession/ItemTest';
import SoundPlayer from 'screens/components/lession/SoundPlayer';
import { getTestingRoom, getTestingCurrentTime } from 'states/redux/actions/TestingAction';
import Utils from 'utils/Utils';
import Header from '../../../common/components/base/Header';
import ItemDoTest from './ItemDoTest';
import TestPageInfo from './TestPageInfo';
import UpdateUserInfoJLPTView from './UpdateUserInfoJLPTView';

const width = Dimension.widthParent;

class TestingScreen extends Component {
  constructor(props) {
    super(props);
    const { params, jumpToRank } = NavigationService.getParams();
    this.params = params;
    this.jumpToRank = jumpToRank;
    const courseName = params.course;
    const examId = params.id;
    this.state = {
      page: 1,
      listQuestion: [],
      countChoice: 0,
      loading: true,
      deltaTime: 0,
      dataList: [],
      list1: [],
      paused: true,
      lessonName: '',
      online: 0
    };
    this.course = {};
    this.listAnswer = {};
    this.countAnswer = 0;
    this.test = null;
    this.countLesson = 0;
    this.dataOld = [];
    this.dataAnswer = [];
    this.currentPage = 1;
    this.data = {
      courseName: `${courseName}${examId}`,
      lesson: {}
    };
    this.totalLes1 = 0;
    this.totalLes2 = 0;
    this.totalLes3 = 0;
    this.result = {};
    this.outTime = false;
    this.timeSpend = 0;
    this.listPage = [];
  }

  componentDidMount() {
    this.getData();
    this.getDeltaTime(this.props);
    BackHandler.addEventListener('hardwareBackPress', this.onHardBackPress);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.currentTime !== this.props.currentTime) {
      this.getDeltaTime(nextProps);
    }
    return nextState !== this.state;
  }

  componentWillUnmount() {
    this.props.getTestingRoom();
    BackHandler.removeEventListener('hardwareBackPress', this.onHardBackPress);
  }

  onHardBackPress = () => {
    this.onBackPress();
    return true;
  };

  getInitUser = async () => {
    try {
      const params = this.params;
      const url =
        UrlConst.API_JP_TEST +
        Const.API.TRY_DO_TEST.INIT_USER +
        `?userId=${Utils.user.id}&examId=${params.id}&course=${params.course}&lid1=${params.lessons[0].id}&lid2=${params.lessons[1].id}&lid3=${
          params.lessons[2].id
        }`;
      Funcs.log('GET', url);
      let response = await fetch(url);
      response = await response.json();
      Funcs.log('Success', response);
      return response;
    } catch (err) {
      Funcs.log('ERROR', err);
    }
    return null;
  };

  getSimpleData = async () => {
    this.totalLes1 = 0;
    this.totalLes2 = 0;
    this.totalLes3 = 0;
    this.countLesson = 1;
    let response = await this.getInitUser();
    if (response) {
      this.countLesson = response.step;
      if (response.result) this.result = response.result;
      let list1 = response.lq1;
      let list2 = response.lq2;
      let list3 = response.lq3;
      for (let i = 0; i < list1.length; i++) {
        if (list1[i].point) this.totalLes1 += list1[i].point;
      }
      for (let i = 0; i < list2.length; i++) {
        if (list2[i].point) this.totalLes2 += list2[i].point;
      }
      for (let i = 0; i < list3.length; i++) {
        if (list3[i].point) this.totalLes3 += list3[i].point;
      }
    }
    this.setState({
      totalLes1: this.totalLes1,
      totalLes2: this.totalLes2,
      totalLes3: this.totalLes3,
      result: this.result,
      lessonName: Lang.try_do_test.text_complete_test
    });
    this.userJoinAt = response?.user_join_at;
  };

  getData = async () => {
    let listQuestion = [];
    let response = await this.getInitUser();
    if (response) {
      listQuestion = response;
      this.countLesson = response.step;
      this.userJoinAt = response.user_join_at;
      // this.userJoinAt = '2020-11-03T22:00:31.000Z';
      if (response.result) this.result = response.result;
      let list1 = response.lq1;
      let list2 = response.lq2;
      let list3 = response.lq3;
      for (let i = 0; i < list1.length; i++) {
        if (list1[i].point) this.totalLes1 += list1[i].point;
      }
      for (let i = 0; i < list2.length; i++) {
        if (list2[i].point) this.totalLes2 += list2[i].point;
      }
      for (let i = 0; i < list3.length; i++) {
        if (list3[i].point) this.totalLes3 += list3[i].point;
      }

      //Get các câu hỏi khi ng dùng out app
      await this.fillQuestion(listQuestion);

      // Lay time hien tai
      this.props.getTestingCurrentTime();

      //Get thoi gian con lai cua bai thi
      this.getLessonName();
      this.getBackUpLink(this.countLesson, listQuestion);
      this.setState(
        {
          testingStep: response.step,
          listQuestion: this.listQuestion,
          loading: false,
          lessonName: this.lessonName,
          totalLes1: this.totalLes1,
          totalLes2: this.totalLes2,
          totalLes3: this.totalLes3,
          result: this.result,
          backupLink: this.backupLink
        },
        () => {
          this.onCreatePage(this.countLesson);
        }
      );
    } else {
      DropAlert.error(Lang.try_do_test.text_error, Lang.try_do_test.text_error_api);
      NavigationService.pop();
    }
  };

  getDeltaTime = async (props = this.props) => {
    const { maximum_time, time_end } = this.params;
    const startTimeStamp = Time.timeStamp(this.userJoinAt);
    let endTimeStamp = startTimeStamp + maximum_time * 60 * 1000;

    // Nếu thời gian thi lớn hơn thời gian kết thúc khoá thi thì lấy thời gian khoá thi
    const endTimeStampOfRoom = Time.timeStamp(time_end);
    if (endTimeStamp > endTimeStampOfRoom) endTimeStamp = endTimeStampOfRoom;

    // Get current time

    // Delta time
    const deltaTime = endTimeStamp - props.currentTime;
    this.setState({ deltaTime });
  };

  getLessonName = () => {
    let lessonName = '';
    if (this.countLesson == 1) {
      lessonName = Lang.try_do_test.text_vocabulary;
    } else if (this.countLesson == 2) {
      lessonName = Lang.try_do_test.text_reading;
    } else if (this.countLesson == 3) {
      lessonName = Lang.try_do_test.text_listening;
    } else {
      lessonName = Lang.try_do_test.text_complete_test;
    }
    this.lessonName = lessonName;
  };

  fillQuestion = async (question) => {
    let listQuestion = question;
    const params = this.params;
    let oldData = {};
    try {
      let data = await StorageService.get(Const.DATA.TRY_DO_TEST);
      if (data) {
        this.dataOld = data;
        for (let i = 0; i < data.length; i++) {
          let courseName = params.course;
          let examId = params.id;
          if (data[i].courseName == `${courseName}${examId}`) {
            this.course = data[i];
            oldData = data[i];
            this.data = {
              courseName: data[i].courseName,
              lesson: data[i].lesson
            };
            if (data[i].countLesson > this.countLesson) this.countLesson = data[i].countLesson;
            let lesson = data[i].lesson[`lesson${this.countLesson}`];
            this.currentPage = lesson ? lesson.page : 1;
            if (lesson.list_answers) this.listAnswer = lesson.list_answers;
            break;
          }
        }
      }
    } catch (error) {
      Funcs.log(error);
    }

    //Điền lại vào các ô đáp án của bài test khi out app
    if (!oldData.countLesson) return (this.listQuestion = listQuestion);
    if (oldData.countLesson <= 3) {
      let listData = listQuestion[`lq${oldData.countLesson}`];
      let OldAnswers = oldData.lesson[`lesson${oldData.countLesson}`];
      if (OldAnswers?.list_answers) {
        for (let i = 0; i < listData.length; i++) {
          let oldListAnswer = Object.keys(OldAnswers.list_answers);
          for (let j = 0; j < oldListAnswer.length; j++) {
            if (listData[i].id == oldListAnswer[j]) {
              let index = 0;
              let answers = [...listData[i].answers];
              const item = listData[i].answers.find((e, ind) => {
                if (e.id == OldAnswers.list_answers[listData[i].id]) {
                  index = ind;
                  e.isCheck = true;
                  return e;
                }
              });
              answers[index] = item;
              listData[i].answers = answers;
            }
          }
        }
      }
      listQuestion[`lq${oldData.countLesson}`] = listData;
    }
    this.listQuestion = listQuestion;
  };

  getBackUpLink = (countLesson, question) => {
    let listQuestion = question.lq3;
    let founded = false;
    for (let i = 0; i < listQuestion.length; i++) {
      let item = { ...listQuestion[i] };
      let dom = htmlparser2.parseDOM(item.content);
      for (let j = 0; j < dom.length; j++) {
        if (dom[j].children[0].name == 'a') {
          this.backupLink = dom[j].children[0].attribs.href;
          listQuestion.splice(i, 1);
          founded = true;
          break;
        }
      }
      if (founded) break;
    }
  };

  onCreatePage = (page) => {
    if (page > 3) return;
    this.countAnswer = 0;
    this.dataAnswer = [];
    const params = this.params;
    const courseName = params.course;
    const { listQuestion } = this.state;
    let countChoice = 0;
    if (Object.keys(this.course).length > 0) {
      let answers = { ...this.course.lesson[`lesson${this.countLesson}`] };
      if (answers.list_answers) {
        countChoice = Object.keys(answers.list_answers).length;
        this.listAnswer = answers.list_answers;
      }
    } else this.listAnswer = {};
    let dataList = listQuestion.lq2;
    let listLS1 = this.caculPage(courseName, page);
    if (page == 1) {
      dataList = listQuestion.lq1;
    } else if (page == 2) {
      dataList = listQuestion.lq2;
    } else {
      dataList = listQuestion.lq3;
    }

    let listLq1 = [];
    let count = 0;
    let index = 0;
    let listResult = [];
    for (let i = 0; i < dataList.length; i++) {
      if (!dataList[i].point) continue;
      count += 1;
      if (count == listLS1[index]) {
        index += 1;
        listResult.push(i + 1);
        count = 0;
      }
      if (dataList[i].answers.length > 0) this.countAnswer += 1;
    }

    let page1 = [...dataList].slice(0, listResult[0]);
    let page2 = [...dataList].slice(listResult[0], listResult[1]);
    let page3 = [...dataList].slice(listResult[1], listResult[2]);
    let page4 = [...dataList].slice(listResult[2], listResult[3]);
    let page5 = [...dataList].slice(listResult[3], listResult[4]);
    let page6 = [...dataList].slice(listResult[4], listResult[5]);
    let page7 = [...dataList].slice(listResult[5], listResult[6]);
    let page8 = [...dataList].slice(listResult[6], listResult[7]);
    let page9 = [...dataList].slice(listResult[7], listResult[8]);
    this.listPage = [];
    switch (courseName) {
      case 'N1':
        if (page == 1) {
          this.listPage = [page1, page2, page3, page4, page5, page6, page7];
          listLq1 = this.onFillQuestionToList(this.currentPage);
        } else if (page == 2) {
          this.listPage = [page1, page2, page3, page4, page5, page6];
          listLq1 = this.onFillQuestionToList(this.currentPage);
        } else {
          dataList.unshift(0);
          listLq1 = dataList;
        }
        break;
      case 'N2':
        if (page == 1) {
          this.listPage = [page1, page2, page3, page4, page5, page6, page7, page8, page9];
          listLq1 = this.onFillQuestionToList(this.currentPage);
        } else if (page == 2) {
          this.listPage = [page1, page2, page3, page4, page5];
          listLq1 = this.onFillQuestionToList(this.currentPage);
        } else {
          dataList.unshift(0);
          listLq1 = dataList;
        }
        break;
      case 'N3':
        if (page == 1) {
          this.listPage = [page1, page2, page3, page4, page5];
          listLq1 = this.onFillQuestionToList(this.currentPage);
        } else if (page == 2) {
          this.listPage = [page1, page2, page3, page4, page5, page6, page7];
          listLq1 = this.onFillQuestionToList(this.currentPage);
        } else {
          dataList.unshift(0);
          listLq1 = dataList;
        }
        break;
      case 'N4':
        if (page == 1) {
          this.listPage = [page1, page2, page3, page4, page5];
          listLq1 = this.onFillQuestionToList(this.currentPage);
        } else if (page == 2) {
          this.listPage = [page1, page2, page3, page4, page5, page6];
          listLq1 = this.onFillQuestionToList(this.currentPage);
        } else {
          dataList.unshift(0);
          listLq1 = dataList;
        }
        break;
      case 'N5':
        if (page == 1) {
          this.listPage = [page1, page2, page3, page4];
          listLq1 = this.onFillQuestionToList(this.currentPage);
        } else if (page == 2) {
          this.listPage = [page1, page2, page3, page4, page5, page6];
          listLq1 = this.onFillQuestionToList(this.currentPage);
        } else {
          dataList.unshift(0);
          listLq1 = dataList;
        }
        break;
    }
    this.setState({ dataList: listLq1, countChoice, page: this.currentPage }, () => {
      setTimeout(() => {
        this.ScrollView && this.ScrollView.scrollToOffset({ animated: true, offset: (this.currentPage - 1) * width });
        this[`ItemDoTest${0}`] && this[`ItemDoTest${0}`].onScrollToTop();
      }, 300);
    });
  };

  caculPage = (courseName, page) => {
    let listLS1 = [5, 5, 5, 7, 5, 5, 12, 5, 5];
    switch (courseName) {
      case 'N1':
        if (page == 1) {
          listLS1 = [6, 7, 6, 6, 10, 5, 5];
        } else if (page == 2) {
          listLS1 = [4, 9, 4, 3, 4, 2];
        }
        return listLS1;
      case 'N2':
        if (page == 1) {
          listLS1 = [5, 5, 3, 7, 5, 5, 12, 5, 5];
        } else if (page == 2) {
          listLS1 = [5, 9, 2, 3, 2];
        }
        return listLS1;
      case 'N3':
        if (page == 1) {
          listLS1 = [8, 6, 11, 5, 5];
        } else if (page == 2) {
          listLS1 = [13, 5, 5, 4, 6, 4, 2];
        }
        return listLS1;
      case 'N4':
        if (page == 1) {
          listLS1 = [7, 5, 8, 4, 4];
        } else if (page == 2) {
          listLS1 = [13, 4, 4, 3, 3, 2];
        }
        return listLS1;
      default:
        if (page == 1) {
          listLS1 = [7, 5, 6, 3];
        } else if (page == 2) {
          listLS1 = [9, 4, 4, 2, 2, 1];
        }
        return listLS1;
    }
  };

  onFillQuestionToList = (pageNum) => {
    let listQuestion = [];
    for (let i = 0; i < pageNum; i++) {
      listQuestion.push(this.listPage[i]);
    }
    return listQuestion;
  };

  onBackPress = () => {
    if (this.countLesson <= 3) {
      Alert.alert('', `${Lang.try_do_test.sure_exit}`, [{ text: 'OK', onPress: () => NavigationService.pop() }, { text: 'CANCEL' }]);
    } else if (this.outTime) {
      NavigationService.pop();
    } else {
      NavigationService.pop();
    }
  };

  onPressPrevPage = () => {
    let page = this.state.page - 1;
    this.currentPage = page;
    let data = { ...this.data.lesson[`lesson${this.countLesson}`] };
    data.page = page;
    this.data.countLesson = this.countLesson;
    this.data.lesson[`lesson${this.countLesson}`] = data;
    if (this.dataOld.length == 0) {
      this.dataOld.push(this.data);
    } else {
      for (let i = 0; i < this.dataOld.length; i++) {
        let courseName = this.data.courseName.slice(0, 2);
        if (this.dataOld[i].courseName == courseName) {
          this.dataOld[i] = this.data;
          break;
        }
      }
    }
    StorageService.save(Const.DATA.TRY_DO_TEST, this.dataOld);
    this.setState({ page }, () => {
      this.ScrollView.scrollToIndex({ animated: true, index: this.state.page - 1 });
      this[`ItemDoTest${this.currentPage - 1}`] && this[`ItemDoTest${this.currentPage - 1}`].onScrollToTop();
    });
  };

  onPressNextPage = () => {
    let page = this.state.page + 1;
    let dataList = this.state.dataList;
    this.currentPage = page;
    let data = { ...this.data.lesson[`lesson${this.countLesson}`] };
    data.page = page;
    this.data.countLesson = this.countLesson;
    this.data.lesson[`lesson${this.countLesson}`] = data;
    if (this.dataOld.length == 0) {
      this.dataOld.push(this.data);
    } else {
      for (let i = 0; i < this.dataOld.length; i++) {
        let courseName = this.data.courseName.slice(0, 2);
        if (this.dataOld[i].courseName == courseName) {
          this.dataOld[i] = this.data;
          break;
        }
      }
    }
    //Chuyển page add thêm vào list Data gốc load từng trang 1
    let havePage = false;
    for (let i = 0; i < this.listPage.length; i++) {
      if (this.currentPage - 1 == dataList.length && dataList[dataList.length - 1] === this.listPage[i] && this.listPage[i + 1]) {
        dataList.push(this.listPage[i + 1]);
        havePage = true;
        break;
      }
    }
    StorageService.save(Const.DATA.TRY_DO_TEST, this.dataOld);
    this.ScrollView.scrollToOffset({ animated: true, offset: (this.currentPage - 1) * width });
    setTimeout(() => {
      let state = { page };
      if (havePage) state = { page, dataList };
      this.setState({ ...state });
      this[`ItemDoTest${this.currentPage - 1}`] && this[`ItemDoTest${this.currentPage - 1}`].onScrollToTop();
    }, 300);
  };

  onSelectedAnswer = (dataObj) => {
    const { page } = this.state;
    let data = this.data;
    data.lesson[`${'lesson'}${this.countLesson}`] = { list_answers: this.listAnswer, page: page };

    data.lesson[`${'lesson'}${this.countLesson}`].list_answers[dataObj.questionId] = dataObj.answerId;
    this.listAnswer = data.lesson[`${'lesson'}${this.countLesson}`].list_answers;
    data.countLesson = this.countLesson;
    this.data = data;

    //Check list thi thử của các khoá học
    if (this.dataOld.length == 0) {
      this.dataOld.push(data);
    } else {
      let index = null;
      for (let i = 0; i < this.dataOld.length; i++) {
        if (this.dataOld[i].courseName == data.courseName) {
          this.dataOld[i] = data;
          index = i;
          break;
        }
      }
      if (index == null) {
        this.dataOld.push(data);
      }
    }
    const lengthListAnswer = Object.keys(this.listAnswer).length;
    this.setState({ countChoice: lengthListAnswer });
    StorageService.save(Const.DATA.TRY_DO_TEST, this.dataOld);
  };

  onEndSound = (item) => {
    let listQuestion = this.state.listQuestion;
    for (let i = 0; i <= listQuestion.length; i++) {
      if (!listQuestion[i]) continue;
      if (listQuestion[i].id == item.id) {
        listQuestion[i].paused = true;
        break;
      }
    }
    this.setState({ listQuestion });
  };

  onPlaySound = (id) => {
    let listQuestion = this.state.listQuestion;
    for (let i = 0; i <= listQuestion.length; i++) {
      if (!listQuestion[i]) continue;
      if (listQuestion[i].id == id) {
        listQuestion[i].paused = !listQuestion[i].paused;
      } else {
        listQuestion[i].paused = true;
      }
    }
    this.setState({ listQuestion });
  };

  onPlaySound = (id) => {
    this.setState({ paused: !this.state.paused });
  };

  onPressSubmitTest = () => {
    if (this.state.countChoice == 0) {
      Alert.alert('', `${Lang.try_do_test.not_complete_test}`, [{ text: 'OK' }], { cancelable: false });
    } else {
      let message = `${Lang.try_do_test.do} ${this.state.countChoice}${'/'}${this.countAnswer} ${Lang.try_do_test.sure_submit}`;
      Alert.alert('', message, [
        {
          text: 'OK',
          onPress: () => {
            this.currentPage = 1;
            this.onSubmit();
          }
        },
        { text: 'CANCEL' }
      ]);
    }
  };

  onSubmit = async () => {
    const params = this.params;
    let lesson = this.data.lesson[`lesson${this.countLesson}`];
    let listAnswer = {};
    if (lesson) {
      if (Object.keys(lesson.list_answers).length > 0) {
        listAnswer = lesson.list_answers;
      } else {
        listAnswer = {};
      }
    }
    const data = {
      step: this.countLesson,
      userId: Utils.user.id,
      examId: params.id,
      course: params.course,
      answers: listAnswer
    };
    LoadingModal.show();
    let response = await Fetch.get(UrlConst.API_JP_TEST + Const.API.TRY_DO_TEST.SUBMIT_TEST, data, null, null, true);
    LoadingModal.hide();
    if (response.status == Fetch.Status.SUCCESS) {
      this.countLesson++;
      !this.outTime ? this.onChangeTest() : null;

      // Có thể sửa thông tin nhận bằng
      this.setState({ certificateEditable: true });
      return true;
    } else {
      DropAlert.error('', Lang.try_do_test.submit_test_error);
    }
    return false;
  };

  onChangeTest = () => {
    let lessonName = this.state.lessonName;
    if (this.outTime) {
      this.getSimpleData();
    } else {
      if (this.countLesson == 2) {
        lessonName = `${Lang.try_do_test.lesson2}`;
      } else if (this.countLesson == 3) {
        lessonName = `${Lang.try_do_test.listen_lesson}`;
      } else if (this.countLesson == 4) {
        this.getSimpleData();
      }
    }
    let course = { ...this.data };
    course.countLesson = this.countLesson;
    course.page = this.currentPage;
    course.lesson[`lesson${this.countLesson}`] = { list_answers: {}, page: 1 };
    this.data = course;
    if (this.dataOld.length == 0) {
      this.dataOld.push(this.data);
    } else {
      for (let i = 0; i < this.dataOld.length; i++) {
        let courseName = this.data.courseName;
        if (this.dataOld[i].courseName == courseName) {
          this.dataOld[i] = this.data;
          break;
        }
      }
    }
    if (this.countLesson == 4) this.dataOld = [];
    StorageService.save(Const.DATA.TRY_DO_TEST, this.dataOld);
    this.course = {};
    // this.dataOld = [];
    this.listAnswer = {};
    this.setState({ lessonName });
    this.onCreatePage(this.countLesson);
  };

  onOutOfTime = async () => {
    this.currentPage = 1;
    this.outTime = true;

    // Auto submit all step
    let submitSuccess = true;
    while (this.countLesson < 4) {
      submitSuccess = await this.onSubmit();
      if (!submitSuccess) break;
    }

    // Nếu submit ko thành công, thì quay lại trang chủ
    if (!submitSuccess) {
      NavigationService.back();
      return;
    }

    // Show thông báo
    setTimeout(() => {
      Alert.alert(
        '',
        `${Lang.try_do_test.out_time}`,
        [
          {
            text: 'OK',
            onPress: () => {
              this.onChangeTest();
            }
          }
        ],
        { cancelable: false }
      );
    }, 1000);
  };

  onPressGoRank = () => {
    if (this.jumpToRank) {
      this.jumpToRank();
    }
    NavigationService.pop();
  };

  onPressOpentLink = () => {
    ModalWebView.show(this.state.backupLink);
  };

  keyExtractor = (item, index) => ('item' + index).toString();

  renderItem = ({ item, index }) => {
    return (
      <ItemTest
        key={'Item_' + index}
        item={item}
        ref={(refs) => (this.TestItem = refs)}
        onSelectedAnswer={this.onSelectedAnswer}
        onEnd={this.onEndSound}
        onPlay={this.onPlaySound}
        isTryDoTest={true}
      />
    );
  };

  renderPager = ({ item, index }) => {
    if (Array.isArray(item)) {
      return <ItemDoTest onSelectedAnswer={this.onSelectedAnswer} item={item} ref={(refs) => (this[`ItemDoTest${index}`] = refs)} />;
    } else {
      return this.renderItem({ item, index });
    }
  };

  renderHeaderListen = () => {
    const { dataList, backupLink } = this.state;
    const data = this.params;
    let linkmp3 = data.lessons[2].mp3;
    if (dataList[0] !== 0 || !linkmp3) return null;
    return (
      <View style={styles.areaSound}>
        <SoundPlayer link={linkmp3} item={{ paused: this.state.paused }} onPlay={this.onPlaySound} type={true} />
        {backupLink && (
          <BaseText style={styles.textDirectLink} onPress={this.onPressOpentLink}>
            {Lang.try_do_test.text_direct_link}
          </BaseText>
        )}
      </View>
    );
  };

  renderContent = () => {
    const { lessonName, result, testingStep, certificateEditable } = this.state;
    const data = this.params;
    let lessonNameFormat = lessonName;
    const courseName = data.course;
    if (courseName == 'N1' || courseName == 'N2') {
      if (this.countLesson == 1) {
        lessonNameFormat = `${Lang.try_do_test.lesson1_N1_N2}`;
      } else if (this.countLesson == 2) {
        lessonNameFormat = `${Lang.try_do_test.lesson2_N1_N2}`;
      } else if (this.countLesson == 3) {
        lessonNameFormat = `${Lang.try_do_test.listen_lesson}`;
      } else {
        lessonNameFormat = `${Lang.try_do_test.complete_test}`;
      }
    }
    const { page, deltaTime, dataList } = this.state;
    if (this.countLesson <= 3 && !this.outTime) {
      return (
        <View style={{ flex: 1 }}>
          <Header
            left
            onBackPress={this.onBackPress}
            onScrollTopHeader={this.onBackPress}
            text={lessonNameFormat}
            titleStyle={styles.titleStyle}
            headerStyle={styles.headerStyle}
          />
          <View style={{ flex: 1 }}>
            {this.renderHeaderListen()}
            <View style={{ flex: 1 }}>
              {dataList[0] !== 0 && (
                <FlatList
                  data={dataList}
                  horizontal={true}
                  ref={(refs) => (this.ScrollView = refs)}
                  scrollEnabled={false}
                  renderItem={this.renderPager}
                  keyExtractor={this.keyExtractor}
                  showsHorizontalScrollIndicator={false}
                  removeClippedSubviews={true}
                  contentContainerStyle={{ width: this.listPage.length * width }}
                />
              )}
              {dataList[0] == 0 && <FlatList data={dataList} renderItem={this.renderItem} keyExtractor={this.keyExtractor} />}
            </View>
            <TestPageInfo
              ref={(refs) => (this.TestPageInfo = refs)}
              courseName={courseName}
              totalAnswer={this.countAnswer}
              count={this.state.countChoice}
              deltaTime={deltaTime}
              onPress={this.onPressSubmitTest}
              onOutOfTime={this.onOutOfTime}
              result={this.result}
              online={this.state.online}
              page={page}
              totalList={this.listPage.length}
              onPressNextPage={this.onPressNextPage}
              onPressPrevPage={this.onPressPrevPage}
              isList1={dataList[0]}
            />
          </View>
        </View>
      );
    }
    if (result) return <UpdateUserInfoJLPTView result={result} isFinishTesting={testingStep >= 4} editable={certificateEditable} />;
    return null;
  };

  renderLoading = () => {
    const { loading } = this.state;
    if (loading) {
      return (
        <View style={styles.wrapperLoading}>
          <View style={{ alignItems: 'center' }}>
            <FastImage source={Images.hocTiepGif} style={styles.img} />
            <BaseText style={styles.textProcess}>{Lang.try_do_test.text_process}</BaseText>
          </View>
        </View>
      );
    }
    return this.renderContent();
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderLoading()}
        <ModalWebView ref={(refs) => (this.ModalWebView = refs)} />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = { getTestingRoom, getTestingCurrentTime };
const mapStateToProps = (state) => ({
  currentTime: state.testingReducer.currentTime || 0
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(TestingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  titleStyle: {
    fontStyle: 'italic',
    marginLeft: 25,
    fontSize: 20
  },
  areaPage: {
    width,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey'
  },
  textPage: {
    fontSize: 15,
    alignSelf: 'center'
  },
  headerStyle: {
    height: 40,
    backgroundColor: 'white'
  },
  areaSound: {
    width
  },
  textDuPhong: {
    marginLeft: 15,
    marginBottom: 5,
    fontSize: 16,
    color: Resource.colors.greenColorApp
  },
  containerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textDirectLink: {
    fontSize: 16,
    marginBottom: 5,
    color: Resource.colors.greenColorApp,
    marginLeft: 15
  },
  wrapperLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textProcess: {
    fontSize: 15,
    marginLeft: 10,
    marginTop: 10,
    color: Colors.greenColorApp
  },
  img: {
    width: 110 * Dimension.scale,
    height: 125 * Dimension.scale,
    marginTop: 30
  }
});
