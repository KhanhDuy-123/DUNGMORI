import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Dimension from 'common/helpers/Dimension';
import Colors from 'assets/Colors';
import BaseText from 'common/components/base/BaseText';
import StripTags from 'striptags';
import DropAlert from 'common/components/base/DropAlert';
import Lang from 'assets/Lang';

const width = Dimension.widthParent;

export default class Answers extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressChooseAnswer = () => {
    const { item, id } = this.props;
    this.props.onPressChooseAnswer(item, id);
  };

  onLongPressCopyText = async () => {
    const { item, isTryDoTest } = this.props;
    await Clipboard.setString(StripTags(isTryDoTest ? item.content : item.value ? item.value.trim() : null));
    DropAlert.info('', Lang.comment.text_dropdown);
  };

  render() {
    const { item, idx, isTryDoTest, disabled } = this.props;
    let iconName = 'ios-radio-button-off';
    if (item.isCheck || item.isCheckResult) iconName = 'ios-radio-button-on';
    else if (item.isEmptyCheck) iconName = 'ios-checkmark-circle';
    return (
      <TouchableOpacity
        key={idx}
        style={[styles.itemAnswers, item.isEmptyCheck ? styles.borderStyle : null]}
        onPress={this.onPressChooseAnswer}
        onLongPress={this.onLongPressCopyText}
        disabled={disabled}>
        <Icon
          style={{ paddingTop: 0.7 * Dimension.scale }}
          name={iconName}
          size={13 * Dimension.scale}
          color={item.isCheck ? Colors.greenColorApp : item.isCheckResult ? 'red' : Colors.greenColorApp}
        />
        <BaseText
          style={{
            ...styles.textAnswers,
            color: item.isCheck ? Colors.greenColorApp : item.isCheckResult ? 'red' : Colors.black3
          }}>
          {StripTags(isTryDoTest ? item.content : item.value ? item.value.trim() : null)} {item.isEmptyCheck ? '(Đúng)' : ''}
        </BaseText>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
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
    backgroundColor: Colors.greenColorApp,
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
  },
  borderStyle: {
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: Colors.greenColorApp
  }
});
