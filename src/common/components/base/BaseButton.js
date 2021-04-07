import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import BaseText from './BaseText';

type Props = {
  text?: string
};
export default class BaseButton extends PureComponent<Props, TouchableOpacityProps> {
  render() {
    const { text, textStyle, children } = this.props;
    return (
      <TouchableOpacity activeOpacity={0.75} {...this.props}>
        {text ? <BaseText style={[styles.text, textStyle]}>{text}</BaseText> : children}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    textTransform: 'uppercase',
    textAlign: 'center'
  }
});
