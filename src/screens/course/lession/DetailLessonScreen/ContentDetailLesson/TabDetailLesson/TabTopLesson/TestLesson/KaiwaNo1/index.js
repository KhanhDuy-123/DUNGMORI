import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Swiper from 'common/components/base/Swiper';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import CourseConst from 'consts/CourseConst';
import React, { Component } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import KaiwaCheckController from 'realm/controllers/KaiwaCheckController';
import { onSavePercent } from 'states/redux/actions/PercentKaiwaAction';
import Configs from 'utils/Configs';
import ItemKaiwaNo1 from './ItemKaiwaNo1';

const width = Dimension.widthParent;
const FIXED_BAR_WIDTH = 280;
const BAR_SPACE = 5;
class KaiwaNo1 extends Component {
  constructor(props) {
    super(props);
    this.numItems = props.listQuestions.length;
    this.itemWidth = FIXED_BAR_WIDTH / this.numItems - (this.numItems - 1) * BAR_SPACE;
    this.animVal = new Animated.Value(0);
    this.totalCorrect = 0;
    this.previousIndex = 0;
    this.totalScore = 0;
    this.state = { listQuestions: [] };
    this.limitCheckEnable = props.courseId && props.courseId !== CourseConst.KAIWA.ID;
  }

  async componentDidMount() {
    let { lessonId, listQuestions } = this.props;

    // Nếu kaiwa mới thì mới check limit
    if (this.limitCheckEnable) {
      let kaiwaChecks = await KaiwaCheckController.getBy('lessonId', lessonId);
      listQuestions = listQuestions.map((item) => {
        let kaiwaCheck = kaiwaChecks.find((e) => e.id === item.id);
        if (kaiwaCheck) {
          item = { ...item };
          item.kaiwaCheck = kaiwaCheck;
        }
        return item;
      });
    }

    this.setState({
      listQuestions
    });
  }

  onLayout = (e) => {
    this.width = e.nativeEvent.layout.width;
    this.height = e.nativeEvent.layout.height;
  };

  onChangeIndex = (currentIndex) => {
    let { listQuestions } = this.state;
    const totalQuestion = listQuestions.length;
    for (var i = 0; i < totalQuestion; i += 1) {
      let item = { ...listQuestions[i] };
      let lastItem = { ...listQuestions[totalQuestion - 1] };
      if (i == currentIndex - 1 && !item.isForward) {
        let ref = this['ItemKaiwaNo1' + i];
        if (ref && ref.isCorrect()) {
          this.totalCorrect++;
          const percent = (this.totalCorrect / (totalQuestion - 1)) * 100;
          this.props.onSavePercent(percent);
          item.isForward = true;
        }
        lastItem = {
          ...lastItem,
          totalCorrect: this.totalCorrect,
          totalScore: this.totalCorrect * 10,
          totalQuestion
        };
        listQuestions[i] = item;
        listQuestions[totalQuestion - 1] = lastItem;
      }
    }
    this.setState({ listQuestions });
  };

  onStartRecord = (index) => {
    const { listQuestions } = this.state;
    let item = listQuestions.find((e, ind) => {
      return ind == index && e.isForward;
    });
    if (this.totalCorrect > 0 && item && item.isForward && !item.answerAgain) {
      this.totalCorrect--;
      item.isForward = false;
      item.answerAgain = true;
      listQuestions[index] = { ...item };
      const percent = (this.totalCorrect / (listQuestions.length - 1)) * 100;
      this.props.onSavePercent(percent);
    }
  };

  onSpeechFinish = async (score, percent) => {
    let currentIndex = this.swiper.getCurrentIndex();
    currentIndex++;
    await Funcs.delay(2000);
    let checkCorrect = Configs.enabledFeature.checkCorrectKaiwa1 ? percent >= 0.85 : score == 1;
    if (checkCorrect) this.swiper.scrollToIndex(currentIndex);
  };

  render() {
    const { listQuestions } = this.state;
    const { kaiwaNo2Demo } = this.props;
    return (
      <View style={styles.container}>
        {Object.keys(kaiwaNo2Demo).length > 0 && (
          <View>
            <BaseText style={[styles.textTitle, { marginTop: 15 }]}>{Lang.test.text_kaiwa}</BaseText>
            <BaseText style={[styles.textTitle, styles.textNote]}>{Lang.test.text_note_kaiwa1}</BaseText>
          </View>
        )}
        <Swiper
          onChangeIndex={this.onChangeIndex}
          ref={(ref) => (this.swiper = ref)}
          data={listQuestions}
          renderItem={this.renderItem}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: this.animVal } } }])}
        />
        <View style={styles.activeStyle}>{this.renderDot()}</View>
      </View>
    );
  }

  renderItem = (item, index) => {
    // if (item.isResult) return <ResultSpeechToText item={item} />;
    if (item.isResult) return null;
    return (
      <ItemKaiwaNo1
        item={item}
        index={index}
        onFinish={this.onSpeechFinish}
        onStart={this.onStartRecord}
        ref={(ref) => (this['ItemKaiwaNo1' + index] = ref)}
        limitCheckEnable={this.limitCheckEnable}
      />
    );
  };

  renderDot() {
    const { listQuestions } = this.state;
    let dotArray = [];
    listQuestions.map((item, index) => {
      const scrollBarVal = this.animVal.interpolate({
        inputRange: [width * (index - 1), width * (index + 1)],
        outputRange: [-this.itemWidth, this.itemWidth]
        // extrapolate: 'extend'
      });

      let dotActive = (
        <View
          key={index}
          style={[
            styles.dotStyle,
            {
              width: 8,
              marginLeft: index === 0 ? 0 : BAR_SPACE,
              borderRadius: 4
            }
          ]}>
          <Animated.View
            style={[
              styles.barStyle,
              {
                width: 8,
                transform: [{ translateX: scrollBarVal }],
                borderRadius: 4
              }
            ]}
          />
        </View>
      );
      dotArray.push(dotActive);
    });
    return dotArray;
  }
}

const mapDispatchToProps = { onSavePercent };
export default connect(
  null,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(KaiwaNo1);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 40
  },
  dotStyle: {
    backgroundColor: '#ccc',
    overflow: 'hidden',
    height: 8
  },
  activeStyle: {
    position: 'absolute',
    bottom: -15,
    flexDirection: 'row'
  },
  barStyle: {
    backgroundColor: Resource.colors.greenColorApp,
    height: 8
  },
  textTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginHorizontal: 20
  },
  textNote: {
    marginVertical: 0,
    fontStyle: 'italic',
    fontWeight: '500',
    marginBottom: 10
  }
});
