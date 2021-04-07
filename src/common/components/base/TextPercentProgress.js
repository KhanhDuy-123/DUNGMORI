import React from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

export default class TextPercentProgress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
    this.animatedText = new Animated.Value(0);
    this.onChangeValueText(props.percent);
  }

  componentWillUnmount() {
    this.animatedText.removeListener(this.listenAnimated);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.percent !== this.props.percent) {
      this.onChangeValueText(nextProps.percent);
    }
    return true;
  }

  onChangeValueText = (percent) => {
    this.listenAnimated = this.animatedText.addListener(({ value }) => this.setState({ value }));
    Animated.timing(this.animatedText, {
      toValue: percent,
      duration: 1200,
      easing: Easing.linear
    }).start();
  };

  render() {
    return <Animated.Text {...this.props} style={[styles.text, this.props.textStyle]}>{`${Math.round(this.state.value)}${'%'}`}</Animated.Text>;
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Montserrat'
  }
});
