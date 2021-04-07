import Colors from 'assets/Colors';
import Funcs from 'common/helpers/Funcs';
import React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import BaseButton from '../BaseButton';

export default class ItemTagA extends React.PureComponent {
  onPress = () => {
    let { item } = this.props;
    try {
      Linking.openURL(item.uri);
    } catch (err) {
      Funcs.log(err);
    }
  };

  render() {
    let { item, textStyle } = this.props;
    return (
      <BaseButton style={styles.textContainer} onPress={this.onPress}>
        <Text
          style={{
            ...textStyle,
            color: Colors.text,
            ...item.style
          }}>
          {item.content ? item.content : item.data}
        </Text>
      </BaseButton>
    );
  }
}

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'flex-end'
  }
});
