import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import ButtonSpeakQuickTest from './ButtonSpeakQuickTest';

export default class PopupShowResultQuickTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      correct: false,
      correctAnswers: '',
      audioAnswer: ''
    };
    this.AnimatedHeight = new Animated.Value(0);
  }

  async componentDidMount() {
    this.autoPlaySound = await StorageService.get(Const.DATA.QUICKTEST_SETTING);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  showResult = async (grade, correctAnswers, audioAnswer) => {
    this.stop();
    let correct = true;
    if (parseInt(grade) == 0) correct = false;
    this.setState({ correct, correctAnswers: correctAnswers.value, audioAnswer }, () => {
      Animated.timing(this.AnimatedHeight, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.elastic()
      }).start();
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if ((this.autoPlaySound || this.autoPlaySound === null) && this.ButtonSpeakQuickTest) {
          this.ButtonSpeakQuickTest?.playSound();
        }
      }, 500);
    });
  };

  hideResult = () => {
    Animated.timing(this.AnimatedHeight, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.elastic()
    }).start();
  };

  stop = () => {
    clearTimeout(this.timer);
    this.ButtonSpeakQuickTest?.stopPlay();
  };

  render() {
    const { correct, correctAnswers, audioAnswer } = this.state;
    let titleName = Lang.quick_test.congrarilation;
    if (!correct) titleName = Lang.quick_test.failed;
    const heightAnimated = this.AnimatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -this.props.offsetY]
    });
    return (
      <Animated.View
        style={[
          styles.wrapperResult,
          {
            transform: [{ translateY: heightAnimated }],
            opacity: this.AnimatedHeight,
            backgroundColor: correct ? 'rgba(100,255,25, 0.2)' : 'rgba(255,0,1, 0.2)'
          }
        ]}>
        <View style={{ height: 90, justifyContent: 'center' }}>
          <BaseText>{titleName}</BaseText>
          <View style={styles.viewWrapResult}>
            <BaseText style={{ maxWidth: '85%', marginRight: 10 }}>{correctAnswers}</BaseText>
            {audioAnswer ? (
              <ButtonSpeakQuickTest
                audio={audioAnswer}
                ref={(refs) => (this.ButtonSpeakQuickTest = refs)}
                onPressPlaySound={this.props.onPressPlaySoundPopup}
              />
            ) : null}
          </View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperResult: {
    width: Dimension.widthParent,
    minHeight: 150,
    paddingHorizontal: 15,
    borderBottomColor: '#E7E8E9',
    borderBottomWidth: 1,
    position: 'absolute',
    bottom: -70,
    backgroundColor: 'rgba(100,255,25, 0.2)',
    // backgroundColor: 'rgba(255,0,1, 0.2)',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  viewWrapResult: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimension.widthParent - 30,
    marginTop: 5
  },
  icButton: {
    width: 20,
    height: 20
  },
  buttonPlay: {
    width: 35,
    height: 35,
    borderRadius: 100,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: 'white',
    margin: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  }
});
