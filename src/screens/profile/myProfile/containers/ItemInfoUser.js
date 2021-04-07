import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Const from 'consts/Const';
import Dimension from 'common/helpers/Dimension';

const { width } = Dimensions.get('window');
class ItemInfoUser extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <BaseText style={styles.title}>{this.props.title}</BaseText>
        <BaseText style={styles.contentStyle}>{this.props.content}</BaseText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 11 * Dimension.scale,
    color: Resource.colors.black1
  },
  contentStyle: {
    fontSize: 12 * Dimension.scale,
    fontWeight: '600',
    color: Resource.colors.greenColorApp,
    paddingTop: 5
  }
});

export default ItemInfoUser;
