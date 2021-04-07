import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppConst from 'consts/AppConst';

export default class ItemTagRuby extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderText = (text, textStyle) => {
    const arr = new Array(text.length).fill(1);
    return (
      <View style={styles.textContainer}>
        <View />
        {arr.map((e, i) => (
          <Text style={textStyle} key={'ruby_main_' + i}>
            {text[i]}
          </Text>
        ))}
        <View />
      </View>
    );
  };

  renderMainText = () => {
    const { item, textStyle, renderHTMLTagItem } = this.props;
    if (typeof item.data === 'object' && typeof item.data?.data !== 'string') {
      return renderHTMLTagItem(item.data, 'ruby_main', this.renderText);
    }
    if (typeof item.data === 'string' || typeof item.data?.data === 'string') {
      const str = item.data?.data ? item.data?.data : item.data;
      const style = { ...item.style, ...textStyle };
      if (style.fontSize && AppConst.IS_ANDROID) style.lineHeight = style.fontSize + 3;
      return this.renderText(str, style);
    }
    return null;
  };

  renderFuriganaText = () => {
    const { item, textFuriganaStyle, renderHTMLTagItem } = this.props;
    if (typeof item.subData === 'object' && typeof item.subData?.data !== 'string') {
      return renderHTMLTagItem(item.subData, 'ruby_furigana', this.renderText);
    }
    if (typeof item.subData === 'string' || typeof item.subData?.data === 'string') {
      const str = item.subData?.data ? item.subData?.data : item.subData;
      return this.renderText(str, { ...item.style, ...textFuriganaStyle });
    }
    return null;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderFuriganaText()}
        {this.renderMainText()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end'
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
