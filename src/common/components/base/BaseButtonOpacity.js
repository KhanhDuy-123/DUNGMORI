import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Dimension from 'common/helpers/Dimension';
import FastImage from 'react-native-fast-image';

const width = Dimension.widthParent;

class BaseButtonOpacity extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func
  };

  static defaultProps = {
    styleImage: {
      width: 25,
      height: 25,
      marginLeft: 15
    }
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <TouchableOpacity disabled={this.props.disabled} onPress={this.props.onPress} style={[styles.socialButtonStyle, this.props.socialButtonStyle]}>
        {this.props.icon ? (
          <FastImage source={this.props.icon} style={this.props.styleImage} tintColor={this.props.tintColor} resizeMode={FastImage.resizeMode.contain} />
        ) : null}
        <BaseText style={{ ...styles.textStyle, ...this.props.textStyle }}>{this.props.text}</BaseText>
        {this.props.number ? <BaseText style={{ ...styles.textStyle, ...styles.number }}>{this.props.number}</BaseText> : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  socialButtonStyle: {
    width: width * 0.78,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45 * Dimension.scale,
    borderRadius: (45 / 245) * Dimension.scale
  },

  textStyle: {
    color: Resource.colors.black1,
    fontSize: 16
  },
  number: {
    paddingLeft: 10,
    color: 'white',
    fontWeight: '600'
  }
});

export default BaseButtonOpacity;
