import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Const from 'consts/Const';
import Dimension from 'common/helpers/Dimension';

const width = Dimension.widthParent;

class ItemContentUser extends PureComponent {
  render() {
    const { item } = this.props;
    return (
      <View style={styles.itemInfo}>
        <BaseText style={styles.textTitle}>{item.title}</BaseText>
        <BaseText style={styles.textContent}>{item.content}</BaseText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemInfo: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20
  },

  textTitle: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black3
  },
  textContent: {
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.black1,
    fontWeight: '500',
    textAlign: 'right',
    width: width / 2 + 70
  }
});

export default ItemContentUser;
