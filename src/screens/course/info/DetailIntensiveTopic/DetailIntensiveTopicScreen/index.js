import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseButton from 'common/components/base/BaseButton';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import LessonActionCreator from 'states/redux/actionCreators/LessonActionCreator';
import ListTestIntensiveTopic from './components/ListTestIntensiveTopic';
import ListResultExamQuestion from './components/ListResultExamQuestion';
import Const from 'consts/Const';
import Utils from 'utils/Utils';
import ScreenNames from 'consts/ScreenName';

class DetailIntensiveTopicScreen extends Component {
  constructor(props) {
    super(props);
    this.params = NavigationService.getParams();
    this.state = {
      index: 0,
      routes: this.params.routes,
      dataQuestions1: [],
      dataQuestions2: [],
      dataQuestions3: [],
      numberQuestion: 0
    };
  }
  componentDidMount() {
    this.filterDataQuestion(this.props.listQuestions);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listQuestions !== this.props.listQuestions) {
      this.filterDataQuestion(nextProps.listQuestions);
    }
    return nextState !== this.state;
  }

  componentWillUnmount() {
    Utils.resultAnswers = [];
    this.setState({ dataQuestions1: [], dataQuestions2: [], dataQuestions3: [] });
  }

  filterDataQuestion = (listQuestions) => {
    if (listQuestions) {
      let numberQuestion = listQuestions.filter((item) => item.type === 3)?.length;
      let dataQuestions1 = [];
      let dataQuestions2 = [];
      let dataQuestions3 = [];
      if (this.params.type === Const.COURSE_TYPE.LDKN) {
        dataQuestions1 = this.listNewQuestion(listQuestions);
      } else {
        let filterData = listQuestions.filter((item) => item.type_ld === null);
        if (filterData.length === 0) {
          dataQuestions1 = this.listNewQuestion(listQuestions.filter((item) => item.type_ld === '1'));
          dataQuestions2 = listQuestions.filter((item) => item.type_ld === '2');
          dataQuestions2 = this.listNewQuestion(dataQuestions2.sort((a, b) => a.id - b.id));
          dataQuestions3 = this.listNewQuestion(listQuestions.filter((item) => item.type_ld === '3'));
        }
      }
      this.setState({ numberQuestion, dataQuestions1, dataQuestions2, dataQuestions3 });
    }
  };

  listNewQuestion = (listQuestions) => {
    const result = [];
    let index = -1;
    listQuestions.forEach((element) => {
      let isParent = element.type === 1;
      if (isParent) {
        index++;
        result[index] = element;
      } else {
        if (typeof result[index].questions === 'undefined') {
          result[index].questions = [];
        }
        result[index].questions.push(element);
      }
    });
    return result;
  };

  onPressSubmit = () => {
    const data = {
      lessonId: this.params.id,
      answer: JSON.stringify(Utils.resultAnswers)
    };
    LessonActionCreator.submitAnswer(data, (value) => {
      if (this.params.type === Const.COURSE_TYPE.LDTH) {
        NavigationService.navigate(ScreenNames.CertificateLuyenDeScreen);
      } else {
        NavigationService.back();
      }
    });
  };
  onIndexChange = (index) => {
    this.setState({ index });
  };

  onPressBack = () => {
    Utils.resultAnswers = [];
    NavigationService.back();
  };

  renderScene = ({ route, jumpTo }) => {
    return this.params.typeCategory === 'question' ? (
      <ListTestIntensiveTopic listQuestions={this.state[`dataQuestions${route.key}`]} numberQuestion={this.state.numberQuestion} />
    ) : (
      <ListResultExamQuestion listResultLuyenDe={this.props.listResultLuyenDe} listQuestions={this.state[`dataQuestions${route.key}`]} />
    );
  };

  renderTabBar = (props) => {
    const { routes } = this.state;
    let width = (Dimension.widthParent - 20) / routes.length;
    return (
      <TabBar
        {...props}
        labelStyle={styles.labelStyle}
        indicatorStyle={styles.indicatorStyle}
        style={[styles.viewTabbar, styles.shadow]}
        contentContainerStyle={{ ...styles.viewTabbar, marginHorizontal: 0 }}
        renderLabel={({ route, focused }) => {
          return (
            <View style={{ ...styles.viewButtonTabbar, width, backgroundColor: focused ? '#8486F1' : Colors.white100 }}>
              <BaseText style={{ color: focused ? Colors.white100 : '#9C9C9C', fontSize: 14, fontWeight: 'bold' }}>{route.title}</BaseText>
            </View>
          );
        }}
      />
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.wrapperHeader, styles.header, styles.shadow]}>
          <TouchableOpacity onPress={this.onPressBack}>
            <Icon name="ios-arrow-back" size={23} />
          </TouchableOpacity>
          {this.params.typeCategory === 'result' ? (
            <View style={{ width: Dimension.widthParent - 50 * Dimension.scale, paddingLeft: 50 * Dimension.scale }}>
              <BaseText style={styles.titleStyle}>{this.params.nameHeader}</BaseText>
            </View>
          ) : (
            <View style={{ ...styles.wrapperHeader, marginLeft: 50 * Dimension.scale }}>
              <FontAwesome name={'clock'} size={22} color={Colors.violet} />
              <BaseText style={styles.time}>01:30:00</BaseText>
            </View>
          )}
          {this.params.typeCategory === 'question' && (
            <BaseButton text={Lang.test.text_submit} textStyle={styles.textStyle} style={styles.button} onPress={this.onPressSubmit} />
          )}
        </View>
        <View style={styles.container}>
          <TabView
            navigationState={this.state}
            renderScene={this.renderScene}
            initialLayout={Dimension.widthParent}
            renderTabBar={this.renderTabBar}
            onIndexChange={this.onIndexChange}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapperHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    paddingTop: 25 * Dimension.scale,
    backgroundColor: Colors.white100,
    justifyContent: 'space-between',
    paddingHorizontal: 10 * Dimension.scale,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderWidth,
    paddingBottom: 7
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { x: 5, y: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
  titleStyle: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '500',
    paddingLeft: 7
  },
  time: {
    fontSize: 14 * Dimension.scale,
    color: Colors.violet,
    fontWeight: '500',
    paddingLeft: 7
  },
  button: {
    backgroundColor: '#F2994A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15 * Dimension.scale
  },
  textStyle: {
    fontSize: 10 * Dimension.scale,
    fontWeight: '700',
    textTransform: 'none',
    color: Colors.white100,
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  indicatorStyle: {
    height: 0
  },
  labelStyle: {
    fontSize: 10 * Dimension.scale,
    fontWeight: 'bold'
  },
  viewTabbar: {
    height: 40,
    backgroundColor: Colors.white100,
    marginHorizontal: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  viewButtonTabbar: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    top: -5
  }
});
const mapStateToProps = (state) => ({
  listQuestions: state.lessonReducer.listQuestions,
  listResultLuyenDe: state.lessonReducer.listResultLuyenDe
});
export default connect(mapStateToProps)(DetailIntensiveTopicScreen);
