import Colors from 'assets/Colors';
import Images from 'assets/Images';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Lang from 'assets/Lang';

class ItemPracticeTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressChooseLesson = () => {
    this.props.onPressChooseLesson(this.props.item);
  };

  onPressDetailLesson = (val) => () => {
    const value = {
      ...val,
      type: 'ldkn'
    };
    NavigationService.navigate(ScreenNames.CategoryScreen, value);
  };

  render() {
    const { item } = this.props;
    return (
      <View style={styles.wrapperTitle}>
        <TouchableOpacity
          style={{ ...styles.viewTitle, paddingBottom: item.isChoose ? 12 * Dimension.scale : 0 }}
          onPress={this.onPressChooseLesson}
          activeOpacity={0.9}>
          <FastImage source={Images.intensive.iconLesson} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
          <BaseText style={styles.title}>{item.name}</BaseText>
        </TouchableOpacity>
        {item.isChoose &&
          item.lessons.map((val) => {
            return (
              <TouchableOpacity style={[styles.viewTitle, styles.viewLesson]} key={val.id} onPress={this.onPressDetailLesson(val)}>
                <BaseText style={styles.textName}>{val.name}</BaseText>
                <BaseText
                  style={{
                    ...styles.textName,
                    fontWeight: val.grade !== undefined ? '500' : '100',
                    width: 60 * Dimension.scale,
                    color: val.grade !== undefined ? Colors.violet : Colors.grey600
                  }}>
                  {val.grade || 0}/{val.total_marks}
                </BaseText>
                <View style={{ ...styles.viewTitle, paddingLeft: 10 * Dimension.scale }}>
                  <BaseText style={styles.textResult}>
                    {Lang.profile.text_result}:{' '}
                    {val.grade !== undefined && (
                      <BaseText style={{ ...styles.result, color: val.grade >= val.pass_marks ? '#0EB78F' : 'red' }}>
                        {val.grade >= val.pass_marks ? Lang.historyOfTest.text_passed_test : Lang.historyOfTest.text_fail_test}
                      </BaseText>
                    )}
                  </BaseText>
                  {val.grade !== undefined ? (
                    <FastImage
                      source={val.grade >= val.pass_marks ? Images.intensive.icCheckCircle : Images.intensive.icCloseCircle}
                      style={styles.iconCheck}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperTitle: {
    width: Dimension.widthParent - 20,
    borderWidth: 1,
    borderColor: Colors.borderWidth,
    shadowColor: '#000',
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    padding: 10,
    borderRadius: 7,
    marginTop: 10 * Dimension.scale,
    backgroundColor: Colors.white100
  },
  viewTitle: {
    flexDirection: 'row'
  },
  icon: {
    width: 16 * Dimension.scale,
    height: 16 * Dimension.scale
  },
  title: {
    fontSize: 13 * Dimension.scale,
    fontWeight: '500',
    color: Colors.black5,
    paddingLeft: 10 * Dimension.scale
  },
  viewLesson: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderWidth,
    paddingVertical: 12,
    paddingLeft: 25 * Dimension.scale
  },
  textName: {
    width: 80 * Dimension.scale,
    fontSize: 10 * Dimension.scale,
    color: Colors.grey600,
    fontWeight: '400'
  },
  textResult: {
    width: 100 * Dimension.scale,
    fontSize: 8 * Dimension.scale,
    color: Colors.grey600,
    fontWeight: '100'
  },
  result: {
    fontWeight: '500',
    color: '#0EB78F'
  },
  iconCheck: {
    width: 10 * Dimension.scale,
    height: 10 * Dimension.scale,
    position: 'absolute',
    right: 0
  }
});

export default ItemPracticeTopic;
