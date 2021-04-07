import Colors from 'assets/Colors';
import React, { Component } from 'react';
import { View } from 'react-native';

export default class ItemTagU extends Component {
  render() {
    let { item, renderHTMLTagItem, saltText, style } = this.props;
    const borderColor = style?.color || Colors.text;
    return (
      <>
        {item.data.map((e, i) => (
          <View style={{ borderBottomWidth: 1, borderColor }} key={'u_content_' + i.toString()}>
            {renderHTMLTagItem(e, i, saltText)}
          </View>
        ))}
      </>
    );
  }
}
