import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

class ItemResultExamQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.item.questions
    };
  }

  componentDidMount() {
    const { item, dataAnswers } = this.props;
    item.questions?.map((val) => {
      val.answers?.map((k) => {
        if (k.grade > '0' && k.id == dataAnswers[val.id]) {
          k.isCorrect = true;
        } else if (k.grade == '0' && k.id == dataAnswers[val.id]) {
          k.isCorrect = false;
        }
        return k;
      });
      val.answerCorrect = val.answers?.find((m) => m.grade > '0');
      val.chooseAnswers = dataAnswers[val.id];
      return val;
    });
    this.setState({ data: item.questions });
  }

  onPressShowResult = () => {
    const { item } = this.props;
    this.props.onPressShowResult(item);
  };

  onPressDetailQuestion = (item) => () => {
    this.props.onPressDetailQuestion(item);
  };

  renderDotAnswer = (val) => {
    if (val.isCorrect || val.grade > '0') {
      return (
        <View style={styles.borderCircle}>
          <View style={styles.dot} />
        </View>
      );
    }
    if (val.isCorrect === false) {
      return (
        <View style={{ ...styles.borderCircle, borderColor: Colors.black5 }}>
          <View style={{ ...styles.dot, backgroundColor: Colors.black5 }} />
        </View>
      );
    }
    if (val.grade == '0') {
      return <View style={{ ...styles.dot, marginLeft: 35, backgroundColor: '#E5E5E5' }} />;
    }
  };
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    if (item.type !== 5) {
      return (
        <View style={styles.viewTitle}>
          <TouchableOpacity onPress={this.onPressDetailQuestion(item)}>
            <Text style={styles.textTitle1}>{`Câu ${index + 1}`}</Text>
          </TouchableOpacity>
          <View style={styles.border} />
          {item.answers?.map((val, i) => {
            return <View key={i}>{this.renderDotAnswer(val, i)}</View>;
          })}
          <FastImage
            source={item.chooseAnswers == item.answerCorrect?.id ? Images.intensive.icCheckCircle : Images.intensive.icCloseCircle}
            style={styles.icon}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      );
    }
  };

  render() {
    const { item, index } = this.props;
    const numberQuestion = [...Array(4).keys()];
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPressShowResult} activeOpacity={0.9}>
        <View style={{ ...styles.wrapperLayout, borderBottomWidth: item.isShow ? 2 : 0, paddingBottom: item.isShow ? 15 : 0 }}>
          <View style={styles.wrapperRow}>
            <View style={styles.circle} />
            <BaseText style={styles.title}>{`Bài ${index + 1}`}</BaseText>
          </View>
          <BaseText style={styles.question}>{item.question}</BaseText>
          <BaseText style={{ ...styles.question, fontWeight: '100', color: Colors.black3 }}>
            {item.isShow ? Lang.comment.text_collapsi : Lang.teacher.view_infor}
          </BaseText>
        </View>
        {item.isShow && (
          <View style={styles.wrapper}>
            <View style={styles.viewTitle}>
              <Text style={styles.textTitle}>Đáp án</Text>
              <View style={styles.border} />
              {numberQuestion?.map((val, i) => {
                return (
                  <BaseText key={i} style={styles.textQuestion}>
                    {val + 1}
                  </BaseText>
                );
              })}
            </View>
            <View style={styles.borderHorizontal} />
            <FlatList data={this.state.data} extraData={this.state.data} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimension.widthParent - 20,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.borderWidth,
    shadowColor: '#555',
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingVertical: 10,
    backgroundColor: Colors.white100,
    marginBottom: 15
  },
  wrapperLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomColor: Colors.grey400
  },
  wrapperRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  circle: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.violetColor,
    marginRight: 7
  },
  title: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '500',
    color: Colors.black3
  },
  question: {
    fontSize: 10 * Dimension.scale,
    color: Colors.violetColor
  },
  wrapper: {
    width: Dimension.widthParent - 20,
    paddingTop: 10
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  border: {
    width: 1,
    height: 40,
    backgroundColor: Colors.borderWidth
  },
  textQuestion: {
    paddingLeft: 40,
    fontSize: 11 * Dimension.scale,
    fontWeight: '600'
  },
  textTitle1: {
    width: 60 * Dimension.scale,
    textAlign: 'center',
    fontSize: 10 * Dimension.scale,
    color: Colors.violet,
    textDecorationLine: 'underline'
  },
  textTitle: {
    width: 60 * Dimension.scale,
    textAlign: 'center',
    fontSize: 11 * Dimension.scale,
    fontWeight: '500'
  },
  borderHorizontal: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.borderWidth
  },
  icon: {
    width: 22,
    height: 22,
    position: 'absolute',
    right: 20
  },
  borderCircle: {
    width: 22,
    height: 22,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#A1C93D',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 27
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#A1C93D'
  }
});

export default ItemResultExamQuestion;
