import React, { Component } from 'react';
import { Animated, StyleSheet, View, Easing } from 'react-native';
import Resource from '../../../assets/Resource';
import Dimension from 'common/helpers/Dimension';
import Colors from 'assets/Colors';

export default class ProgressBar extends Component {
  static defaultProps = {
    percent: 0
  };
  constructor(props) {
    super(props);
    this.widthParent = Dimension.widthParent;
    this.state = {
      widthParent: Dimension.widthParent
    };
    this.widthValue = new Animated.Value(0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.percent !== this.props.percent || this.state.widthParent !== nextState.widthParent) {
      this.onProgress(nextProps.percent);
    }
    return nextProps.percent !== this.props.percent || nextState !== this.state;
  }

  onProgress = (percent) => {
    if (!percent) percent = 0;
    Animated.timing(this.widthValue, {
      toValue: percent,
      duration: 1200,
      easing: Easing.linear
    }).start();
  };

  onGetWidth = (event) => {
    this.setState({ widthParent: event.nativeEvent.layout.width });
  };

  render() {
    const translateX = this.widthValue.interpolate({
      inputRange: [0, 100],
      outputRange: [-this.state.widthParent, 0]
    });
    const backgroundColor = this.widthValue.interpolate({
      inputRange: [0, 25, 50, 75, 100],
      outputRange: [Colors.redCircle, Colors.redCircle, Colors.yellowCircle, Colors.greenCircle, Colors.greenColorApp]
    });
    return (
      <View style={[styles.progressArea, this.props.containerStyles]} onLayout={this.onGetWidth}>
        <Animated.View
          style={[
            styles.animatedProgress,
            {
              transform: [{ translateX }],
              backgroundColor
            },
            this.props.sliderBar
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  progressArea: {
    overflow: 'hidden'
  },
  animatedProgress: {
    flex: 1,
    backgroundColor: Resource.colors.greenColorApp
  }
});
