import React, { PureComponent } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { Circle, Svg } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default class LoadingVideo extends PureComponent {
  static defaultProps = {
    size: 100,
    color: 'green'
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.animatedCircle = new Animated.Value(0);
    this.animatedCircleChild = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.loop(
      Animated.parallel([
        Animated.timing(this.animatedCircle, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear
        }),
        Animated.timing(this.animatedCircleChild, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear
        })
      ])
    ).start();
  }

  render() {
    const { size, color } = this.props;
    const strokeDashArray = (Math.PI * 90 * (size / 2 - 3)) / 180;
    const strokeDashArrayChild = (Math.PI * 90 * (size / 2 - 12)) / 180;
    const rotate = this.animatedCircle.interpolate({
      inputRange: [0, 1],
      outputRange: [0, (size / 2 - 3) * 2 * Math.PI]
    });
    const rotageChild = this.animatedCircleChild.interpolate({
      inputRange: [0, 1],
      outputRange: [(size / 2 - 12) * 2 * Math.PI, 0]
    });
    return (
      <Svg width={`${size}`} height={`${size}`}>
        <AnimatedCircle
          cy={`${size / 2}`}
          cx={`${size / 2}`}
          r={size / 2 - 3}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeDasharray={strokeDashArray}
          strokeDashoffset={rotate}
          strokeLinecap="round"
        />
        <AnimatedCircle
          cy={`${size / 2}`}
          cx={`${size / 2}`}
          r={size / 2 - 12}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeDasharray={strokeDashArrayChild}
          strokeDashoffset={rotageChild}
          strokeLinecap="round"
        />
      </Svg>
    );
  }
}

const styles = StyleSheet.create({});
