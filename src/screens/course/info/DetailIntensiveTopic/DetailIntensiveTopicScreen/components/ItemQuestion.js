import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BaseText from 'common/components/base/BaseText';
import Colors from 'assets/Colors';
import Dimension from 'common/helpers/Dimension';
import HTMLFurigana from 'common/components/base/HTMLFurigana';

export default class ItemQuestion extends Component {
  constructor(props) {
    super(props);
    let item = this.props.item;
    try {
      item.answers = JSON.parse(item.answers);
    } catch (err) {
      console.log('ERROR', err);
    }
    this.state = {
      item
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item !== this.props.item) {
      try {
        nextProps.item.answers = JSON.parse(nextProps.item.answers);
        this.setState({ item: nextProps.item });
      } catch (err) {
        console.log('ERROR', err);
      }
    }
    return nextState !== this.state;
  }

  onPressChooseAnswer = (val) => () => {
    const { item } = this.state;
    if (item) {
      item.answers?.map((k) => {
        k.isChoose = k.id === val.id;
        return k;
      });
      this.setState({ item });
    }
    const dataObj = { questionId: item.id, answerId: val.id, score: val.grade };
    this.props.onPressChooseAnswer(dataObj);
  };

  getValue = () => {
    return this.state.item;
  };

  render() {
    const { item } = this.state;
    return (
      <View style={styles.container}>
        <HTMLFurigana html={item.value} style={{ width: Dimension.widthParent - 40 }} textStyle={styles.name} />
        {item.answers?.map((val, i) => {
          return (
            <TouchableOpacity key={`id${val.id}`} style={styles.wrapperQuestion} onPress={this.onPressChooseAnswer(val)}>
              <View style={{ ...styles.borderCircle, borderColor: val.isChoose ? '#8486F1' : Colors.white100 }}>
                <View style={{ ...styles.circle, backgroundColor: val.isChoose ? '#8486F1' : '#E5E5E5' }} />
              </View>
              <BaseText style={styles.question}>{val.value}</BaseText>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10
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
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7
  },
  question: {
    paddingLeft: 10
  }
});
