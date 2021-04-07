import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Time from 'common/helpers/Time';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
const width = Dimension.widthParent;

export default class ItemHistoryTest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressViewTest = (item) => () => {
    this.props.onPressTestOld(item);
  };

  onPressDeleteTest = (item) => () => {
    this.props.onPressDeleteTest(item);
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = (item, index) => {
    const { section } = this.props;
    const timeFormat = item.time ? Time.format(item.time, 'HH:mm') : null;
    const dayFormat = item.time ? Time.format(item.time, 'DD/MM/YYYY') : null;
    let params = item;
    params.idSection = this.props.idSection;
    return (
      <View style={index === 0 ? styles.containerContents : styles.containerContent} key={index}>
        <BaseText style={{ marginVertical: 5 }}>
          <BaseText style={styles.textTitleTime}>{Lang.historyOfTest.text_time_do_test}</BaseText>{' '}
          <BaseText style={styles.textDetailValue}>
            {timeFormat} - {dayFormat}
          </BaseText>
        </BaseText>
        <BaseText style={{ marginVertical: 5 }}>
          <BaseText style={styles.textTitleTime}>{Lang.historyOfTest.text_total_point}</BaseText>{' '}
          <BaseText style={styles.textDetailValue}>
            {item.grade}/{item.total_grade}
          </BaseText>
        </BaseText>
        <BaseText style={{ marginVertical: 5 }}>
          <BaseText style={styles.textTitleTime}>{Lang.historyOfTest.text_result_test}</BaseText>{' '}
          {item.grade >= section.pass_marks ? (
            <BaseText style={styles.textDetailValue}>{Lang.historyOfTest.text_passed_test}</BaseText>
          ) : (
            <BaseText style={styles.textDetailValue}>{Lang.historyOfTest.text_fail_test}</BaseText>
          )}
        </BaseText>
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.buttonDelete} onPress={this.onPressDeleteTest(params)}>
            <BaseText style={styles.textButtonDelete}>{Lang.historyOfTest.text_button_delete}</BaseText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonViewTest} onPress={this.onPressViewTest(item)}>
            <BaseText style={styles.textButtonViewTest}>{Lang.historyOfTest.text_button_view_test}</BaseText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const { results } = this.props;
    return <View>{results.map(this.renderItem)}</View>;
  }
}

const styles = StyleSheet.create({
  textTitleTest: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '500',
    color: Resource.colors.black1
  },
  containerContent: {
    justifyContent: 'center',
    width: width - 40,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey'
  },
  containerContents: {
    justifyContent: 'center',
    width: width - 40,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3
  },
  textTitleTime: {
    fontSize: 12 * Dimension.scale
  },
  textDetailValue: {
    fontSize: 12 * Dimension.scale,
    fontWeight: Platform.OS == 'ios' ? '500' : '600'
  },
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 20
  },
  buttonDelete: {
    width: 110 * Dimension.scale,
    height: 32 * Dimension.scale,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Resource.colors.black1,
    backgroundColor: Resource.colors.white100
  },
  buttonViewTest: {
    width: 110 * Dimension.scale,
    height: 32 * Dimension.scale,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Resource.colors.greenColorApp
  },
  textButtonDelete: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.black1
  },
  textButtonViewTest: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.white100
  }
});
