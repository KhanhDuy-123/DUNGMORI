import Colors from 'assets/Colors';
import BaseText from 'common/components/base/BaseText';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Utils from 'utils/Utils';
import ItemQuestion from './ItemQuestion';

class ListTestIntensiveTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.listQuestions,
      dataTotalPage: [],
      currentPage: 0,
      numberDoQuestion: 0
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listQuestions !== this.props.listQuestions) {
      this.setState({ data: nextProps.listQuestions });
    }
    return nextState !== this.state;
  }

  onPressChooseAnswer = (dataObj) => {
    Utils.resultAnswers = Utils.resultAnswers.filter((item) => {
      return item.questionId != dataObj.questionId;
    });
    Utils.resultAnswers.push(dataObj);
    this.setState({ numberDoQuestion: Utils.resultAnswers?.length });
  };

  onPressNextLeft = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage > 1 ? currentPage - 1 : 0 }, () => {
      this.ScrollView.scrollTo({ y: 0, x: this.state.currentPage * (Dimension.widthParent - 20), animated: true });
    });
  };
  onPressNextRight = () => {
    const { currentPage, data } = this.state;
    this.setState({ currentPage: currentPage === data?.length - 1 ? currentPage : currentPage + 1 }, () => {
      this.ScrollView.scrollTo({ y: 0, x: this.state.currentPage * (Dimension.widthParent - 20), animated: true });
    });
  };

  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item }) => {
    return <ItemQuestion item={item} onPressChooseAnswer={this.onPressChooseAnswer} />;
  };

  render() {
    const { data, currentPage, numberDoQuestion } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.viewTitle}>
          <BaseText style={styles.textTitle}>
            Câu {numberDoQuestion}/{this.props.numberQuestion}(語彙ー漢字)
          </BaseText>
        </View>
        <ScrollView
          horizontal={true}
          pagingEnabled={true}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          ref={(refs) => (this.ScrollView = refs)}
          scrollEnabled={false}>
          {data?.map((item, i) => {
            return (
              <ScrollView key={i} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1 }}>
                  <HTMLFurigana html={item.value} style={{ width: Dimension.widthParent - 20 }} textStyle={styles.textQues} />
                  <View style={styles.wrapper}>
                    <FlatList data={item?.questions} extraData={this.state} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
                  </View>
                </View>
              </ScrollView>
            );
          })}
        </ScrollView>
        <View style={styles.wrapperFooter}>
          <TouchableOpacity onPress={this.onPressNextLeft}>
            <Icon name={'arrow-alt-circle-left'} size={30} color={Colors.violet} />
          </TouchableOpacity>
          <BaseText style={styles.page}>
            {currentPage + 1}/{data?.length}
          </BaseText>
          <TouchableOpacity onPress={this.onPressNextRight}>
            <Icon name={'arrow-alt-circle-right'} size={30} color={Colors.violet} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10
  },
  viewTitle: {
    width: 140,
    backgroundColor: '#474DDA',
    paddingLeft: 10,
    paddingVertical: 5
  },
  textTitle: {
    color: Colors.white100,
    fontSize: 10 * Dimension.scale,
    fontWeight: 'bold'
  },
  textQues: {
    fontSize: 12 * Dimension.scale,
    fontWeight: '100',
    paddingTop: 10 * Dimension.scale
  },
  wrapper: {
    width: Dimension.widthParent - 20,
    maxHeight: Dimension.widthParent,
    marginTop: 10,
    borderWidth: 2,
    borderColor: Colors.inactiveButton,
    borderRadius: 5,
    backgroundColor: Colors.white100
  },
  wrapperFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15
  },
  page: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '600',
    color: Colors.violet
  }
});

export default ListTestIntensiveTopic;
