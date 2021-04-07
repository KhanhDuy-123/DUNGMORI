import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import NavigationService from 'common/services/NavigationService';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  left: Boolean,
  sizeIcon: Number,
  text: String,
  onBackPress: Function
};
class Header extends PureComponent<Props> {
  static defaultProps = {
    colorBackButton: Resource.colors.black1,
    sizeIcon: 18 * Dimension.scale
  };

  onBackPress = () => {
    if (this.props.onBackPress) this.props.onBackPress();
    else NavigationService.pop();
  };

  render() {
    const { rightTitle, rightTitleStyle, renderRight } = this.props;
    return (
      <View style={[styles.container, this.props.headerStyle]}>
        {this.props.left ? (
          <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={this.onBackPress}>
            <View style={[styles.viewIcon, { marginTop: 3 }]}>
              <Icon name="ios-arrow-back" size={this.props.sizeIcon} color={this.props.colorBackButton} />
            </View>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={[styles.viewText, this.props.titleArea]} activeOpacity={1} onPress={this.props.onScrollTopHeader}>
          <BaseText numberOfLines={1} style={{ ...styles.titleStyle, ...this.props.titleStyle }}>
            {this.props.text}
          </BaseText>
        </TouchableOpacity>

        {this.props.right ? (
          <TouchableOpacity onPress={this.props.buttonRight}>
            <View style={[styles.viewIcon, { marginTop: 3, paddingRight: 10 }]}>
              <BaseText style={rightTitleStyle}>{rightTitle}</BaseText>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
        {renderRight && renderRight()}
      </View>
    );
  }
  onBack = () => {
    NavigationService.pop();
  };
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Resource.colors.white100,
    height: 45 * Dimension.scale
  },
  viewIcon: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewText: {
    flex: 1,
    alignItems: 'center'
  },
  titleStyle: {
    color: Resource.colors.black1,
    fontSize: 15 * Dimension.scale,
    fontWeight: '600'
  },
  countSelectStyle: {
    flexDirection: 'row'
  },
  countTotalStyle: {
    fontSize: 14,
    color: Resource.colors.white100
  }
});
export default Header;
