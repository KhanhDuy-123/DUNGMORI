import React, { PureComponent } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

export default class BaseText extends PureComponent<TextProps> {
  static parse = (text, values = []) => {
    let list = text.split('%s');
    let listElement = [];
    for (let i = 0; i < list.length; i += 1) {
      listElement.push(<BaseText key={i.toString()}>{list[i]}</BaseText>);
      if (values.length > i) listElement.push(<BaseText key={i.toString() + '_'}>{values[i]}</BaseText>);
    }
    return listElement;
  };

  render() {
    return (
      <Text allowFontScaling={false} {...this.props} style={[styles.text, this.props.style]}>
        {this.props.children}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {}
});
