import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

const width = Dimension.widthParent;
class ItemPaymentHistory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.viewItem}>
        <BaseText style={styles.textItem}>{this.props.title}</BaseText>
        <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 20 }}>
          <BaseText style={{ ...styles.textItem, ...this.props.styleTextColor }}>
            {this.props.content} <BaseText style={styles.textCopper}>{this.props.contentCopper}</BaseText>
          </BaseText>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    width: width - 40,
    alignSelf: 'center'
  },
  textItem: {
    fontSize: 11 * Dimension.scale,
    color: Resource.colors.black1
  },
  textCopper: {
    marginLeft: 5,
    color: Resource.colors.red700
  }
});

export default ItemPaymentHistory;
