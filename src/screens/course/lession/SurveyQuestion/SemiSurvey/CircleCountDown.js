import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default class CircleCountDown extends Component {
  static defaultProps = {
    size: 100,
    activeColor: 'blue',
    inActiveColor: 'black'
  };

  constructor(props) {
    super(props);
    const { length, a_length } = props.videoQuestionInfo;
    this.state = {
      time: Math.round(length)
    };
    this.animCircle = new Animated.Value(0);
    this.result = a_length;
  }

  componentDidMount() {
    this.onAnimCircle();
    clearInterval(this.timeCountDown);
    this.timeCountDown = setInterval(() => {
      let time = this.state.time - 1;
      this.setState({ time }, () => {
        if (time <= 0 && !this.state.showResult) {
          clearInterval(this.timeCountDown);
          this.setState({ showResult: true });
          this.props.showResult();
          this.onCountShowResult();
        }
      });
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
    clearInterval(this.timeCountDown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  onAnimCircle = () => {
    Animated.timing(this.animCircle, {
      toValue: 1,
      duration: Math.round(this.props.duration * 1000),
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  render() {
    const { time } = this.state;
    const { size } = this.props;
    const strokeDasharray = (size / 2 - 2) * 2 * Math.PI;
    const transform = this.animCircle.interpolate({
      inputRange: [0, 1],
      outputRange: [0, strokeDasharray]
    });
    return (
      <View style={styles.container}>
        <Svg width={`${size}`} height={`${size}`}>
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            stroke="rgba(255,255,255,255)"
            fill="none"
            strokeWidth={2}
            strokeDashoffset={transform}
            strokeDasharray={`${strokeDasharray}`}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <Text style={styles.textTime}>{time}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textTime: {
    position: 'absolute',
    color: 'rgba(255,255,255,255)',
    fontSize: 17 * Dimension.scale,
    fontWeight: '700',
    transform: [{ rotateY: '-180deg' }]
  },
  container: {
    transform: [{ rotateY: '180deg' }],
    alignItems: 'center',
    justifyContent: 'center'
  }
});
