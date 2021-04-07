import React from 'react';
import { Animated, Easing } from 'react-native';

export default class BaseAnimated extends React.PureComponent {
  constructor(props) {
    super(props);
    var { scale, rotate, opacity, translateX, translateY } = this.props;
    this.scale = new Animated.Value(scale != undefined ? scale : 1);
    this.rotate = new Animated.Value(rotate ? rotate : 0);
    this.opacity = new Animated.Value(opacity != undefined ? opacity : 1);
    this.translateX = new Animated.Value(translateX != undefined ? translateX : 0);
    this.translateY = new Animated.Value(translateY != undefined ? translateY : 0);
  }

  stop() {
    if (this.animated) {
      this.animated.stop();
    }
  }

  scaleAnimated(config) {
    return Animated.timing(this.scale, {
      toValue: config.value,
      duration: config.duration,
      easing: config.easing ? config.easing : Easing.linear(),
      useNativeDriver: true
    });
  }

  opacityAnimated(config) {
    return Animated.timing(this.opacity, {
      toValue: config.value,
      duration: config.duration,
      easing: config.easing ? config.easing : Easing.linear(),
      useNativeDriver: true
    });
  }

  translateXAnimated(config) {
    return Animated.timing(this.translateX, {
      toValue: config.value,
      duration: config.duration,
      easing: config.easing ? config.easing : Easing.linear(),
      useNativeDriver: true
    });
  }

  translateYAnimated(config) {
    return Animated.timing(this.translateY, {
      toValue: config.value,
      duration: config.duration,
      easing: config.easing ? config.easing : Easing.linear(),
      useNativeDriver: true
    });
  }

  rotateAnimated(config) {
    return Animated.timing(this.rotate, {
      toValue: config.value,
      duration: 300,
      easing: config.easing ? config.easing : Easing.linear(),
      useNativeDriver: true
    });
  }

  /*
    animatedDataList: [
      {type: 'delay', value: 1000},
      {type: 'scale', duration: 1000, value: 1, easing: Easing.linear()},
      {type: 'opacity', duration: 1000, value: 1, easing: Easing.linear()},
      {type: 'rotate', duration: 1000, value: 1, easing: Easing.linear()},
    ],
  */
  start(animatedDataList, callback = () => {}) {
    // Stop old animated
    this.stop();

    // Check configs
    if (!animatedDataList) return;

    // Animate
    var animatedList = [];
    for (var i = 0; i < animatedDataList.length; i += 1) {
      let animated = null;
      let animatedData = animatedDataList[i];
      switch (animatedData.type) {
        default:
          break;
        case 'delay':
          animated = Animated.delay(animatedData.value);
          break;
        case 'scale':
          animated = this.scaleAnimated(animatedData);
          break;
        case 'rotate':
          animated = this.rotateAnimated(animatedData);
          break;
        case 'opacity':
          animated = this.opacityAnimated(animatedData);
          break;
        case 'translateY':
          animated = this.translateYAnimated(animatedData);
          break;
        case 'translateX':
          animated = this.translateXAnimated(animatedData);
          break;
      }
      animated.type = animatedData.type;
      if (animated) animatedList.push(animated);
    }

    // Animation
    this.animated = Animated.sequence(animatedList);
    this.animated.start(typeof callback === 'function' ? callback : null);
  }

  render() {
    const { translateX, opacity, scale, translateY } = this;
    const rotate = this.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    return (
      <Animated.View style={{ ...this.props.style, opacity, transform: [{ scale }, { translateX }, { translateY }, { rotate }] }}>
        {this.props.children}
      </Animated.View>
    );
  }
}
