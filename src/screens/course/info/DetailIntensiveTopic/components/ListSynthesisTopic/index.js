import Colors from 'assets/Colors';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import BarChart from '../BarChart';
import ItemSynthesisTopic from './ItemSynthesisTopic';
import Lang from 'assets/Lang';
import NavigationService from 'common/services/NavigationService';
import ScreenNames from 'consts/ScreenName';

class ListSynthesisTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataChart: [],
      dataLabel: [
        { id: 0, color: '#FFE8B9', name: Lang.intensive.textProgram },
        { id: 1, color: '#8486F1', name: Lang.try_do_test.lesson2_N1_N2 },
        { id: 2, color: '#FC8687', name: Lang.try_do_test.listen_lesson }
      ]
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listLDTH !== this.props.listLDTH) {
      let dataChart = [];
      nextProps.listLDTH[0].lessons.map((item, index) => {
        if (item.grade !== undefined) {
          let scoreData = JSON.parse(item.score_data);
          let arrayData = Object.keys(scoreData).map((key) => scoreData[key]);
          item = { label: index + 1, value: arrayData };
          dataChart.push(item);
        }
      });
      this.setState({
        data: nextProps.listLDTH[0].lessons,
        dataChart
      });
    }
    return nextState !== this.state;
  }

  onPressChooseLesson = (item) => {
    const value = {
      ...item,
      type: 'ldth'
    };
    NavigationService.navigate(ScreenNames.CategoryScreen, value);
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    return <ItemSynthesisTopic item={item} onPressChooseLesson={this.onPressChooseLesson} />;
  };

  render() {
    const { dataLabel, data } = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={{ ...styles.wrapper, justifyContent: 'space-around', marginTop: 15 }}>
            {dataLabel.map((item) => {
              return (
                <View style={{ ...styles.wrapper, marginHorizontal: 15 }} key={item.id}>
                  <View style={{ ...styles.circle, backgroundColor: item.color }} />
                  <BaseText style={styles.name}>{item.name}</BaseText>
                </View>
              );
            })}
          </View>
          <BarChart multiChart dataChart={this.state.dataChart} />
          <FlatList data={data} extraData={this.state} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  circle: {
    width: 4 * Dimension.scale,
    height: 4 * Dimension.scale,
    borderRadius: 2 * Dimension.scale,
    marginRight: 7
  },
  name: {
    fontSize: 8 * Dimension.scale,
    color: Colors.black3
  },
  wrapperInput: {
    width: 120 * Dimension.scale,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#F1F3F6',
    borderRadius: 9 * Dimension.scale
  },
  title: {
    fontSize: 8 * Dimension.scale,
    fontWeight: '500',
    marginRight: 10
  },
  textStyle: {
    width: 80 * Dimension.scale,
    fontSize: 8 * Dimension.scale,
    color: Colors.grey800
  }
});

export default ListSynthesisTopic;
