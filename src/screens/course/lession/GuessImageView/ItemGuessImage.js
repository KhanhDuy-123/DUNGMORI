import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { Animated, Easing, PanResponder, StyleSheet, TouchableWithoutFeedback, View, Keyboard } from 'react-native';
import BackCard from './BackCard';
import FrontCard from './FrontCard';

export default class ItemGuessImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFront: true
    };
    this.isFrontCard = true;
    this.animatedRotate = new Animated.Value(0);
    this.opacity = new Animated.Value(0);
    this.animatedFlip = new Animated.Value(0);
    this.animatedZIndex = new Animated.Value(0);
    this.animationTransX = new Animated.Value(-1);
    this.animationCard = new Animated.ValueXY({ x: 0, y: 0 });
    this.panresPonder = PanResponder.create({
      onStartShouldSetPanResponder: this.onPanCreate,
      onStartShouldSetPanResponderCapture: this.onPanCreate,
      onMoveShouldSetPanResponder: this.onPanCreate,
      onMoveShouldSetPanResponderCapture: this.onPanCreate,
      onPanResponderMove: (evt, gestureState) => {
        this.animationCard.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: this.onPanRelease
    });
    this.keyboardShow = false;
  }

  componentDidMount() {
    const { index, dataLength } = this.props;
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.timing(this.animationTransX, {
        toValue: 0,
        duration: 200
      }),
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: 150
      })
    ]).start();
    let rotate = 0;
    if (index === dataLength - 1 && dataLength > 0) rotate = 0;
    else if (index % 2 === 0) rotate = -5;
    else rotate = 5;
    this.animatedRotate.setValue(rotate);
    Keyboard.addListener('keyboardDidShow', this.listenKeyBoardShow);
    Keyboard.addListener('keyboardDidHide', this.listenKeyBoardHide);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.index !== this.props.index || nextProps.dataLength !== this.props.dataLength) {
      let rotate = 0;
      if (nextProps.index === nextProps.dataLength - 1 && nextProps.dataLength > 0) rotate = 0;
      else if (nextProps.index % 2 === 0) rotate = -5;
      else rotate = 5;
      Animated.timing(this.animatedRotate, {
        toValue: rotate,
        duration: 150
      }).start();
    }
    return nextProps !== this.props || this.state !== nextState;
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow', this.listenKeyBoardShow);
    Keyboard.removeListener('keyboardDidHide', this.listenKeyBoardHide);
  }

  onPanCreate = (evt, gestureState) => {
    if (this.keyboardShow) return false;
    return gestureState.dy >= 3 || gestureState.dy <= -3 || gestureState.dx >= 3 || gestureState.dx <= -3;
  };

  onPanRelease = (evt, gestureState) => {
    let dy = gestureState.dy;
    let dx = gestureState.dx;
    if ((dy >= 0 || dy <= 0) && ((dx >= 0 && dx <= 100) || (dx <= 0 && dx >= -100))) {
      Animated.spring(this.animationCard, {
        toValue: { x: 0, y: 0 },
        speed: 40,
        bounciness: 0
      }).start();
    } else {
      let value = gestureState.dx > 0 ? Dimension.widthParent : -Dimension.widthParent;
      Animated.spring(this.animationCard, {
        toValue: { x: value, y: 0 },
        speed: 40,
        bounciness: 0
      }).start(({ finished }) => {
        if (finished) this.props.onSlideComplete(this.props.item, this.props.index);
      });
    }
  };

  listenKeyBoardShow = () => {
    this.keyboardShow = true;
  };

  listenKeyBoardHide = () => {
    this.keyboardShow = false;
  };

  onPressFlipCard = () => {
    if (this.keyboardShow || !this.showResult) {
      return Keyboard.dismiss();
    }
    this.isFrontCard = !this.isFrontCard;
    Animated.timing(this.animatedFlip, {
      toValue: this.isFrontCard ? 0 : 1,
      easing: Easing.linear,
      useNativeDriver: true,
      duration: 700
    }).start(({ finished }) => {
      if (finished) {
        this.setState({ isFront: !this.state.isFront });
      }
    });
  };

  onShowResult = (item) => {
    this.showResult = !this.showResult;
    this.props.onShowResult(item);
  };

  render() {
    const { item, index } = this.props;

    let rotageX = this.animatedRotate.interpolate({
      inputRange: [-5, 0, 5],
      outputRange: ['-5deg', '0deg', '5deg']
    });

    const flipCard = this.animatedFlip.interpolate({
      inputRange: [0, 0.25, 0.75],
      outputRange: ['0deg', '0deg', '180deg'],
      extrapolate: 'clamp'
    });
    const springOut = this.animatedFlip.interpolate({
      inputRange: [0, 0.25, 0.75, 1],
      outputRange: [1, 1.1, 1.1, 1]
    });
    const flipBackCard = this.animatedFlip.interpolate({
      inputRange: [0, 0.25, 0.75],
      outputRange: ['-180deg', '-180deg', '0deg'],
      extrapolate: 'clamp'
    });

    let outputRange = [Dimension.widthParent, 0];
    if (index % 2 === 0) outputRange = [-Dimension.widthParent, 0];

    const translateX = this.animationTransX.interpolate({
      inputRange: [-1, 0],
      outputRange: outputRange
    });

    const opacity = this.animationTransX.interpolate({
      inputRange: [-1, -0.25, 0],
      outputRange: [0, 0, 1]
    });
    return (
      <Animated.View
        {...this.panresPonder.panHandlers}
        style={[styles.container, { transform: [{ translateX: this.animationCard.x }, { translateY: this.animationCard.y }, { translateX }], opacity }]}>
        <TouchableWithoutFeedback onPress={this.onPressFlipCard}>
          <View style={{ flex: 1 }}>
            <Animated.View
              style={[
                styles.content,
                {
                  transform: [{ rotateY: flipBackCard }, { rotate: rotageX }, { scale: springOut }],
                  zIndex: this.state.isFront ? 0 : 10
                }
              ]}>
              <BackCard index={index} item={item} />
            </Animated.View>
            <Animated.View
              style={[
                styles.content,
                {
                  transform: [{ rotateY: flipCard }, { rotate: rotageX }, { scale: springOut }],
                  zIndex: this.state.isFront ? 10 : 0
                }
              ]}>
              <FrontCard index={index} item={item} onShowResult={this.onShowResult} />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 270 * Dimension.scale,
    height: 380 * Dimension.scale,
    alignSelf: 'center',
    position: 'absolute',
    top: 40,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3
  },
  textStyles: {
    fontSize: 26,
    color: 'white'
  },
  content: {
    width: 270 * Dimension.scale,
    height: 380 * Dimension.scale,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'android' ? 0.5 : 0,
    borderColor: 'grey',
    borderRadius: 10,
    backfaceVisibility: 'hidden',
    position: 'absolute'
  }
});
