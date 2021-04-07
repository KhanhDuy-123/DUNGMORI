import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Dimension from 'common/helpers/Dimension';
import Colors from 'assets/Colors';

export default class AnimatedLoadMore extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.AnimatedDot1 = new Animated.Value(0);
    this.AnimatedDot2 = new Animated.Value(0);
    this.AnimatedDot3 = new Animated.Value(0);
    this.AnimatedDot4 = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.sequence([this.onAnimatedDotUp(this.AnimatedDot1), this.onAnimatedDotDown(this.AnimatedDot1)]),
        Animated.sequence([this.onAnimatedDotUp(this.AnimatedDot2), this.onAnimatedDotDown(this.AnimatedDot2)]),
        Animated.sequence([this.onAnimatedDotUp(this.AnimatedDot3), this.onAnimatedDotDown(this.AnimatedDot3)]),
        Animated.sequence([this.onAnimatedDotUp(this.AnimatedDot4), this.onAnimatedDotDown(this.AnimatedDot4)])
      ])
    ).start();
  }

  onAnimatedDotUp = (animated) => {
    return Animated.timing(animated, {
      toValue: 1,
      duration: 120
    });
  };

  onAnimatedDotDown = (animated) => {
    return Animated.timing(animated, {
      toValue: 0,
      duration: 120
    });
  };

  render() {
    const moveDot1 = this.AnimatedDot1.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5]
    });
    const moveDot2 = this.AnimatedDot2.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5]
    });
    const moveDot3 = this.AnimatedDot3.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5]
    });
    const moveDot4 = this.AnimatedDot4.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5]
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.dot, { transform: [{ translateY: moveDot1 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: moveDot2 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: moveDot3 }] }]} />
        <Animated.View style={[styles.dot, { transform: [{ translateY: moveDot4 }] }]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimension.widthParent,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: Colors.greenColorApp,
    borderRadius: 100,
    margin: 2
  }
});
