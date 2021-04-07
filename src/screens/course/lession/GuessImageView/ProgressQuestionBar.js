import Colors from 'assets/Colors';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default class ProgressQuestionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.animatedBar = new Animated.Value(-Dimension.widthParent);
    this.currentQuestion = 1;
  }

  componentDidMount() {
    let percent = this.currentQuestion / this.props.dataList.length;
    this.onAnimatedBar(percent);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.pictureAnswer !== this.props.pictureAnswer) {
      const { dataList } = this.props;
      if (nextProps.pictureAnswer) {
        let index = dataList.indexOf(nextProps.pictureAnswer);
        if (index > 0) this.currentQuestion = index + 2;
        else if (index == 0) this.currentQuestion += 1;
        if (index === dataList.length - 1) this.currentQuestion = dataList.length;
        let percent = this.currentQuestion / dataList.length;
        this.onAnimatedBar(percent);
      }
    }
    return nextProps !== this.props;
  }

  onAnimatedBar = (percent) => {
    Animated.timing(this.animatedBar, {
      toValue: -(1 - percent) * (Dimension.widthParent - 48),
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  render() {
    const { dataList } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.wrapperAnimation}>
          <Animated.View style={[styles.viewAnimation, { transform: [{ translateX: this.animatedBar }] }]} />
        </View>
        <View style={styles.wrapperCount}>
          <BaseText style={styles.textCountStyle}>{`${this.currentQuestion}/${dataList.length}`}</BaseText>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimension.widthParent - 40,
    height: 30,
    backgroundColor: Colors.greenColorApp,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 100,
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 2,
    overflow: 'hidden'
  },
  wrapperAnimation: {
    width: Dimension.widthParent - 48,
    height: 25,
    alignSelf: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 2,
    overflow: 'hidden'
  },
  viewAnimation: {
    width: Dimension.widthParent - 48,
    height: 25,
    backgroundColor: 'white',
    borderRadius: 100,
    position: 'absolute'
  },
  wrapperCount: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center'
  },
  textCountStyle: {
    color: Colors.black1,
    fontWeight: '700'
  }
});
