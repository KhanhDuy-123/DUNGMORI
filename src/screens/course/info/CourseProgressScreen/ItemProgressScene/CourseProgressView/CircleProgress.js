import TextPercentProgress from 'common/components/base/TextPercentProgress';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const size = 105 * Dimension.scale;
const strokeWidthHint = 2.75;
const strokeWidth = 5.5;
export default class CircleProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.animatedCircle = new Animated.Value(0);
  }

  componentDidMount() {
    this.onAnimatedCircle(this.props.percent);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.percent !== this.props.percent) {
      this.onAnimatedCircle(nextProps.percent);
    }
    return nextProps.percent !== this.props.percent;
  }

  onAnimatedCircle = (percent) => {
    let value = percent ? percent : 0;
    Animated.timing(this.animatedCircle, {
      toValue: value,
      duration: 1200,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  render() {
    const strokeDasharray = (size / 2 - strokeWidth) * 2 * Math.PI;
    const strokeDashoffset = this.animatedCircle.interpolate({
      inputRange: [0, 100],
      outputRange: [strokeDasharray, 0]
    });
    return (
      <View style={styles.container}>
        <Svg width={`${size}`} height={`${size}`}>
          <Circle cx={size / 2} cy={size / 2} r={size / 2 - strokeWidth / 2 - strokeWidthHint} stroke="#DCDBDC" strokeWidth={strokeWidthHint} fill="none" />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - strokeWidth}
            stroke="#379C3C"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${strokeDasharray}`}
            strokeDashoffset={strokeDashoffset}
            origin={`${size / 2}, ${size / 2}`}
            strokeLinecap="round"
          />
        </Svg>
        <TextPercentProgress percent={this.props.percent} textStyle={styles.textTitlePercent} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    transform: [{ rotate: '-90deg' }],
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTitlePercent: {
    fontSize: 24 * Dimension.scale,
    color: '#379C3C',
    fontWeight: 'bold',
    position: 'absolute',
    transform: [{ rotate: '90deg' }]
  }
});
