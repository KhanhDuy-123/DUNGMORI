import Resource from 'assets/Resource';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import BaseText from './BaseText';

class BaseEmpty extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.viewEmpty}>
        <FastImage source={Resource.images.imgEmpty} style={styles.iconLogo} />
        <BaseText style={styles.textNotify}>{this.props.text}</BaseText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconLogo: {
    width: 200 * Dimension.scale,
    height: 200 * Dimension.scale
  },
  textNotify: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 10,
    color: Resource.colors.red700,
    textAlign: 'center'
  }
});

export default BaseEmpty;
