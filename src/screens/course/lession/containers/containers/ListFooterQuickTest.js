import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Dimension from 'common/helpers/Dimension';
import BaseText from 'common/components/base/BaseText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Lang from 'assets/Lang';
import Colors from 'assets/Colors';
import FastImage from 'react-native-fast-image';
import Images from 'assets/Images';

export default class ListFooterQuickTest extends Component {
  constructor(props) {
    super(props);
    let totalZeroAnswer = 0;
    for (let i = 0; i < props.dataList.length; i++) {
      if (props.dataList[i].score == 0) totalZeroAnswer += 1;
    }
    this.state = {
      data: this.props.dataList,
      totalZeroAnswer
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.dataList !== this.props.dataList) {
      let totalZeroAnswer = 0;
      for (let i = 0; i < nextProps.dataList.length; i++) {
        if (nextProps.dataList[i].score == 0) totalZeroAnswer += 1;
      }
      this.setState({ data: nextProps.dataList, totalZeroAnswer });
    }
    return nextState !== this.state;
  }

  onPressItem = (item) => () => {
    this.props.onPressNaviItem(item);
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    let iconName = 'checkcircle';
    let color = '#5C973D';
    if (parseInt(item.score) == 0) {
      iconName = 'closecircle';
      color = 'red';
    }
    return (
      <TouchableOpacity style={styles.wrapperResult} onPress={this.onPressItem(item)} key={index}>
        <BaseText>{`Câu ${index + 1}`}</BaseText>
        <AntDesign name={iconName} size={18} color={color} style={{ marginTop: 5 }} />
      </TouchableOpacity>
    );
  };

  render() {
    const { data, totalZeroAnswer } = this.state;
    const { totalScore, currentScore, passMark } = this.props;
    let resultName = Lang.quick_test.pass;
    let backgroundColor = 'red';
    if (currentScore >= passMark) {
      resultName = Lang.quick_test.not_pass;
      backgroundColor = Colors.greenColorApp;
    }
    return (
      <View style={styles.container}>
        <View style={styles.containerResult}>
          <View style={[styles.result, { backgroundColor: backgroundColor }]}>
            <BaseText style={styles.text}>{resultName}</BaseText>
          </View>
          <View style={styles.contentResult}>
            <View style={styles.viewResult}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FastImage source={Images.icForwad} style={styles.iconStyles} />
                <BaseText style={{ color: '#616A71' }}>{Lang.quick_test.forward}</BaseText>
              </View>
              <View style={[styles.circleScore, { backgroundColor: 'red' }]}>
                <BaseText style={styles.textScore}>{totalZeroAnswer}</BaseText>
              </View>
            </View>
            <View style={styles.viewResult}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FastImage source={Images.icScore} style={styles.iconStyles} />
                <BaseText style={{ color: '#616A71' }}>{Lang.quick_test.score}</BaseText>
              </View>
              <View style={styles.circleScore}>
                <BaseText style={styles.textScore}>{currentScore}</BaseText>
              </View>
            </View>
            <View style={[styles.viewResult, styles.viewTotalScore]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FastImage source={Images.icTotalScore} style={styles.iconStyles} />
                <BaseText style={{ color: '#616A71' }}>{Lang.quick_test.total_score}</BaseText>
              </View>
              <View style={[styles.circleScore, { backgroundColor: '#F1953D' }]}>
                <BaseText style={styles.textScore}>{totalScore}</BaseText>
              </View>
            </View>
          </View>
        </View>
        {data.length > 0 && (
          <View style={{ alignItems: 'center' }}>
            <FlatList data={data} renderItem={this.renderItem} numColumns={5} keyExtractor={this.keyExtractor} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimension.widthParent,
    paddingHorizontal: 10,
    paddingTop: 30,
    backgroundColor: '#FFFFFF'
  },
  viewResult: {
    width: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2
  },
  textResult: {
    color: 'red'
  },
  wrapperResult: {
    width: 52 * Dimension.scale,
    aspectRatio: 1 / 1,
    backgroundColor: '#F3F3F3',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3
  },
  containerResult: {
    width: 350,
    height: 140,
    borderRadius: 20,
    alignSelf: 'center',
    backgroundColor: '#EDEDED',
    marginBottom: 15,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row'
  },
  result: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.greenColorApp,
    borderRadius: 100
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 10,
    textAlign: 'center'
  },
  contentResult: {
    marginLeft: 15,
    paddingLeft: 5,
    justifyContent: 'center'
  },
  circleScore: {
    width: 26,
    height: 26,
    backgroundColor: '#5C973D',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textScore: {
    color: '#FFFFFF'
  },
  viewTotalScore: {
    borderTopColor: '#5C973D',
    borderRadius: 2,
    borderTopWidth: 1,
    borderTopRightRadius: 2,
    borderTopLeftRadius: 2,
    paddingTop: 5
  },
  iconStyles: {
    width: 18,
    height: 18,
    marginRight: 10
  }
});
