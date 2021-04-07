import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const IS_PASS = 19;
class ItemSynthesisTopic extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { item } = this.props;
    if (item) {
      try {
        let scoreData = JSON.parse(item.score_data);
        let arrayData = Object.keys(scoreData).map((key) => scoreData[key]);
        let filterResultNotPass = arrayData.filter((v) => v < IS_PASS);
        if (filterResultNotPass.length > 0) {
          this.setState({ isCondition: false });
        }
      } catch (err) {
        console.log('ERROR', err);
      }
    }
  }

  onPressChooseLesson = () => {
    this.props.onPressChooseLesson(this.props.item);
  };

  render() {
    const { item } = this.props;
    const { isCondition } = this.state;
    let isPass = item.grade >= item.pass_marks;
    let isGrade = item.grade !== undefined;
    return (
      <View style={styles.wrapperTitle}>
        <TouchableOpacity
          style={{ ...styles.viewTitle, paddingBottom: item.isChoose ? 12 * Dimension.scale : 0 }}
          onPress={this.onPressChooseLesson}
          activeOpacity={0.9}>
          <FastImage source={Images.intensive.iconLesson} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
          <View style={{ ...styles.viewTitle, width: Dimension.widthParent / 1.5, justifyContent: 'space-between' }}>
            <BaseText style={styles.title}>{item.name}</BaseText>
            <BaseText
              style={{
                ...styles.textName,
                color: isGrade ? Colors.violet : Colors.grey600,
                fontWeight: isGrade ? '500' : '100'
              }}>
              {item.grade || 0}/{item.total_marks}
            </BaseText>
            <BaseText style={styles.textResult}>
              {Lang.profile.text_result}:{' '}
              {isGrade ? (
                <BaseText style={{ ...styles.result, color: isPass && isCondition ? '#0EB78F' : 'red' }}>
                  {isPass && isCondition ? Lang.historyOfTest.text_passed_test : Lang.historyOfTest.text_fail_test}
                </BaseText>
              ) : null}
            </BaseText>
          </View>
          {isGrade ? (
            <FastImage
              source={isPass && isCondition ? Images.intensive.icCheckCircle : Images.intensive.icCloseCircle}
              style={styles.iconCheck}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : null}
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 16 * Dimension.scale,
    height: 16 * Dimension.scale
  },
  title: {
    width: 80 * Dimension.scale,
    fontSize: 13 * Dimension.scale,
    fontWeight: '500',
    color: Colors.black5,
    paddingLeft: 10 * Dimension.scale
  },
  textName: {
    width: 80 * Dimension.scale,
    fontSize: 10 * Dimension.scale,
    color: Colors.grey600,
    fontWeight: '100'
  },
  textResult: {
    width: 90 * Dimension.scale,
    fontSize: 8 * Dimension.scale,
    color: Colors.grey600,
    fontWeight: '100'
  },
  result: {
    fontWeight: '500'
  },
  iconCheck: {
    width: 10 * Dimension.scale,
    height: 10 * Dimension.scale,
    position: 'absolute',
    right: 5
  }
});
export default ItemSynthesisTopic;
