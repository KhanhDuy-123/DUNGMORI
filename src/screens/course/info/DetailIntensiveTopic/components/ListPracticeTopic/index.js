import React, { Component } from 'react';
import { FlatList, StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import ItemPracticeTopic from './ItemPracticeTopic';
import BarChart from '../BarChart';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Colors from 'assets/Colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Lang from 'assets/Lang';

export default class ListPracticeTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.listLDKN,
      dataChart: [],
      dataLabel: [
        { id: 845, color: '#8486F1', name: Lang.intensive.textProgram },
        { id: 846, color: '#FFBA3B', name: Lang.course_info.text_gramma },
        { id: 847, color: '#50ABFE', name: Lang.try_do_test.lesson2_N1_N2 },
        { id: 848, color: '#FC8687', name: Lang.try_do_test.listen_lesson }
      ],
      isShow: false,
      category: {},
      point: [{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }, { value: 50 }, { value: 60 }]
    };
  }

  componentDidMount() {
    const { data, dataLabel } = this.state;
    this.listDataChart(data);
    this.setState({ category: this.state.dataLabel[0] }, () => {
      this.dataNew = dataLabel;
      let dataNewLabel = dataLabel.filter((item) => dataLabel[0].id !== item.id);
      this.setState({ dataLabel: dataNewLabel });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.listLDKN !== this.props.listLDKN) {
      this.listDataChart(nextProps.listLDKN);
      this.setState({ data: nextProps.listLDKN });
    }
    return true;
  }

  listDataChart = (data) => {
    let dataChart = [];
    data?.map((val) => {
      for (let i = 0; i < this.dataNew?.length; i++) {
        if (val.id === this.dataNew[i].id) {
          val.lessons.map((k, index) => {
            if (k.grade !== undefined) {
              k = { label: index + 1, value: [k.grade] };
              dataChart.push(k);
            }
          });
        }
      }
    });
    this.setState({ dataChart });
  };

  onPressChooseLesson = (item) => {
    const { data } = this.state;
    data?.map((val) => {
      if (val.id === item.id) {
        val.isChoose = !val.isChoose;
      } else {
        val.isChoose = false;
      }
      return val;
    });
    this.setState({ data });
  };

  onPressShowCategory = () => {
    this.setState({ isShow: !this.state.isShow });
  };

  onPressChooseCategory = (item) => () => {
    const { data } = this.state;
    this.setState({ category: item, isShow: false }, () => {
      let dataNewLabel = this.dataNew.filter((val) => item.id !== val.id);
      let dataChart = [];
      data?.map((val) => {
        if (val.id === item.id) {
          val.lessons.map((k, index) => {
            if (k.grade !== undefined) {
              k = { label: index + 1, value: [k.grade] };
              dataChart.push(k);
            }
          });
        }
      });
      this.setState({ dataLabel: dataNewLabel, dataChart });
    });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => {
    return <ItemPracticeTopic item={item} onPressChooseLesson={this.onPressChooseLesson} />;
  };

  render() {
    const { dataLabel, isShow, category, point, data, dataChart } = this.state;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={{ ...styles.wrapper, marginTop: 13 }}>
            <BaseText style={styles.title}>{Lang.intensive.textSeeSkills}</BaseText>
            <View style={styles.wrapperInput}>
              <TouchableOpacity style={{ ...styles.wrapper, alignItems: 'center' }} onPress={this.onPressShowCategory}>
                <View style={{ ...styles.circle, backgroundColor: category.color }} />
                <BaseText style={styles.textStyle}>{category.name}</BaseText>
                <Icon name={'sort-down'} size={17} color={Colors.grey400} style={{ marginBottom: 8 }} />
              </TouchableOpacity>
              {isShow &&
                dataLabel.map((item, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      style={{ ...styles.wrapper, paddingBottom: 5 * Dimension.scale, alignItems: 'center' }}
                      onPress={this.onPressChooseCategory(item)}>
                      <View style={{ ...styles.circle, backgroundColor: item.color }} />
                      <BaseText style={styles.textStyle}>{item.name}</BaseText>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
          <BarChart point={point} dataChart={dataChart} backgroundBarChart={category.color} />
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
    flexDirection: 'row'
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
    marginRight: 10,
    marginTop: 8
  },
  textStyle: {
    width: 80 * Dimension.scale,
    fontSize: 8 * Dimension.scale,
    color: Colors.grey800
  }
});
