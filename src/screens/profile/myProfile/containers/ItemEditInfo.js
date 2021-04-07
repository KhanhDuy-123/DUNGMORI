import Resource from 'assets/Resource';
import BaseInput from 'common/components/base/BaseInput';
import BaseText from 'common/components/base/BaseText';
import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Const from 'consts/Const';
import Dimension from 'common/helpers/Dimension';

const width = Dimension.widthParent;

class ItemEditInfo extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <BaseText style={styles.textStyle}>{this.props.text}</BaseText>
          <BaseInput
            editable={this.props.editable}
            maxLength={this.props.maxLength}
            value={this.props.value}
            onChangeText={this.props.onChangeText}
            textInputStyle={{ ...styles.textInputStyle, ...this.props.textInputStyle }}
            viewInputStyle={this.props.viewInputStyle}
            multiline={this.props.multiline}
            keyboardType={this.props.keyboardType}
            onFocus={this.props.onFocus}
            onLayout={this.props.onLayout}
            onSelectionChange={this.props.onSelectionChange}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Resource.colors.inactiveButton
  },
  content: {
    width,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textStyle: {
    fontSize: 13 * Dimension.scale,
    color: Resource.colors.black3
  },
  textInputStyle: {
    width: width / 2 + 50,
    paddingVertical: 0,
    paddingTop: 0,
    color: Resource.colors.black1,
    paddingHorizontal: 0,
    fontWeight: '500',
    textAlign: 'right',
    fontSize: 13 * Dimension.scale,
    alignItems: 'center'
  }
});
export default ItemEditInfo;
