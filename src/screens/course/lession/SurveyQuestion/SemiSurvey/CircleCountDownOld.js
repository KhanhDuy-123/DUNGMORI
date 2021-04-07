import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component, PureComponent } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

let defaultSize = 100;
class SemiCircle extends PureComponent {
  static defaultProps = {
    size: defaultSize,
    borderTopLeftRadius: defaultSize,
    borderTopRightRadius: defaultSize,
    borderColor: 'blue',
    backgroundColor: 'blue'
  };
  render() {
    const { size, color } = this.props;
    let circleStyle = {
      borderTopLeftRadius: size,
      borderTopRightRadius: size,
      borderColor: color,
      backgroundColor: color,
      width: size,
      height: size / 2
    };
    return <View style={[styles.semiCircle, circleStyle]} />;
  }
}

export default class CircleCountDowntOld extends Component {
  static defaultProps = {
    size: 100,
    activeColor: 'blue',
    inActiveColor: 'black'
  };

  constructor(props) {
    super(props);
    const { length, a_length } = props.videoQuestionInfo;
    this.state = {
      time: Math.round(length),
      showResult: false
    };
    this.AnimatedCircle = new Animated.Value(0);
    this.start = false;
    this.result = a_length;
  }

  componentDidMount() {
    this.onAnimCircle();
    clearInterval(this.timeCountDown);
    this.timeCountDown = setInterval(() => {
      this.AnimatedCircle.setValue(0);
      let time = this.state.time - 1;
      if (time >= 0) this.setState({ time }, this.onAnimCircle);
      else if (time <= 0 && !this.state.showResult) {
        clearInterval(this.timeCountDown);
        this.setState({ showResult: true });
        this.props.showResult();
        this.onCountShowResult();
      }
    }, 990);
  }

  onCountShowResult = () => {
    clearInterval(this.showResult);
    this.showResult = setInterval(() => {
      this.result -= 1;
      let time = this.result;
      if (time <= 0) {
        clearInterval(this.showResult);
        this.props.onEndTime();
      }
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.showResult);
    clearInterval(this.timeCountDown);
  }

  onAnimCircle = () => {
    Animated.timing(this.AnimatedCircle, {
      toValue: 2,
      duration: 990,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  render() {
    const { time, showResult } = this.state;
    const roateUp = this.AnimatedCircle.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
      extrapolate: 'clamp'
    });

    const roateDown = this.AnimatedCircle.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ['0deg', '0deg', '180deg']
    });
    const { size, activeColor, inActiveColor } = this.props;
    let borderColor = '#00FF50';
    if (showResult) borderColor = 'red';
    return (
      <View style={[styles.container, { borderRadius: size * 2, backgroundColor: inActiveColor, borderColor }]}>
        <View style={{ overflow: 'hidden' }}>
          <SemiCircle size={size} color={inActiveColor} />
          <Animated.View
            style={[
              styles.halfCircle,
              {
                transform: [{ translateY: size / 4 }, { rotate: roateUp }, { translateY: -size / 4 }],
                bottom: -1
              }
            ]}>
            <SemiCircle size={size} color={activeColor} />
          </Animated.View>
        </View>
        <View style={styles.halfBelow}>
          <SemiCircle color={inActiveColor} size={size} />
          <Animated.View
            style={[
              styles.halfCircle,
              {
                transform: [{ translateY: size / 4 }, { rotate: roateDown }, { translateY: -size / 4 }]
              }
            ]}>
            <SemiCircle size={size} color={activeColor} />
          </Animated.View>
        </View>
        <BaseText style={styles.textTime}>{time}</BaseText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    transform: [{ rotate: '90deg' }],
    borderWidth: 3,
    borderColor: '#00FF50',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  semiCircle: {
    width: 100,
    height: 50,
    overflow: 'hidden',
    borderColor: 'blue',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  halfBelow: {
    transform: [{ rotate: '180deg' }],
    overflow: 'hidden'
  },
  halfCircle: {
    position: 'absolute'
  },
  textTime: {
    position: 'absolute',
    color: '#FFFFFF',
    fontSize: 20 * Dimension.scale,
    fontWeight: 'bold',
    transform: [{ rotate: '-90deg' }]
  }
});
