import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import ItemResultExamQuestion from './ItemResultExamQuestion';
import Ionicons from 'react-native-vector-icons/Ionicons';
class ListResultExamQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataResult: props.listResultLuyenDe,
      dataQuestion: props.listQuestions,
      dataResultAnswer: {},
      isWatch: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listResultLuyenDe !== this.props.listResultLuyenDe) {
      this.setState({ dataResult: nextProps.listResultLuyenDe });
    }
    if (nextProps.listQuestions !== this.props.listQuestions) {
      try {
        nextProps.listQuestions?.map((item) => {
          item.questions?.map((val) => {
            val.answers = JSON.parse(val.answers);
            return val;
          });
          return item;
        });
      } catch (err) {
        console.log('ERROR', err);
      }

      this.setState({ dataQuestion: nextProps.listQuestions });
    }
    return nextState !== this.state;
  }

  onPressShowResult = (item) => {
    const { dataQuestion } = this.state;
    dataQuestion?.map((val) => {
      if (val.id === item.id) {
        val.isShow = !val.isShow;
      } else {
        val.isShow = false;
      }
    });
    this.setState({ dataQuestion });
  };

  onPressDetailQuestion = (val) => {
    this.setState({ isWatch: true, dataResultAnswer: val });
  };

  onPressCloseResult = () => {
    this.setState({ isWatch: false });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    return (
      <ItemResultExamQuestion
        item={item}
        index={index}
        dataAnswers={this.state.dataResult.data}
        onPressShowResult={this.onPressShowResult}
        onPressDetailQuestion={this.onPressDetailQuestion}
      />
    );
  };

  render() {
    const { dataResult, dataQuestion, isWatch, dataResultAnswer } = this.state;
    if (isWatch) {
      return (
        <View style={styles.wrapperHTML}>
          <HTMLFurigana html={dataResultAnswer.value} style={{ width: Dimension.widthParent - 40 }} textStyle={styles.name} />
          {dataResultAnswer.answers?.map((val, i) => {
            let borderColor = Colors.white100;
            let backgroundColor = '#E5E5E5';
            if (val.isCorrect || val.grade > '0') {
              borderColor = '#A1C93D';
              backgroundColor = '#A1C93D';
            } else if (val.isCorrect === false) {
              borderColor = Colors.black5;
              backgroundColor = Colors.black5;
            }
            return (
              <View key={`id${val.id}`} style={styles.wrapperQuestion}>
                <View style={{ ...styles.borderCircle, borderColor }}>
                  <View style={{ ...styles.circleAnswer, backgroundColor }} />
                </View>
                <BaseText style={styles.question}>{val.value}</BaseText>
              </View>
            );
          })}
          <TouchableOpacity onPress={this.onPressCloseResult} style={styles.iconClose}>
            <Ionicons name="md-close" size={26} />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={{ ...styles.wrapperRow, marginVertical: 10 }}>
          <View style={styles.circle} />
          <BaseText style={styles.textStyle}>
            {Lang.historyOfTest.text_total_point}{' '}
            <BaseText style={{ color: Colors.violet, fontWeight: '600' }}>
              {dataResult?.grade}/{dataResult?.total_grade}
            </BaseText>
          </BaseText>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={dataQuestion}
          extraData={this.state}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  wrapperRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  circle: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.violet,
    marginRight: 7
  },
  textStyle: {
    fontSize: 14 * Dimension.scale,
    color: Colors.grey600
  },
  wrapperHTML: {
    padding: 10,
    paddingTop: 50,
    borderWidth: 1,
    borderColor: Colors.bgcSound,
    borderRadius: 5,
    marginTop: 40,
    marginHorizontal: 10
  },
  name: {
    paddingBottom: 5,
    fontSize: 12 * Dimension.scale
  },
  wrapperQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10
  },
  borderCircle: {
    width: 22,
    height: 22,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleAnswer: {
    width: 14,
    height: 14,
    borderRadius: 7
  },
  question: {
    paddingLeft: 10
  },
  iconClose: {
    padding: 10,
    paddingHorizontal: 20,
    position: 'absolute',
    right: 0,
    top: 0
  }
});

export default ListResultExamQuestion;
