import Resource from 'assets/Resource';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Dimension from 'common/helpers/Dimension';
import Colors from 'assets/Colors';

export class ButtonSocial extends PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={[styles.button, this.props.button]}>
        {this.props.icon ? this.props.icon : <Icon name={this.props.name} size={20 * Dimension.scale} color={Resource.colors.white100} />}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    height: 35 * Dimension.scale,
    width: 35 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5 * Dimension.scale,
    backgroundColor: Colors.white100,
    shadowColor: '#000',
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3
  }
});

export default ButtonSocial;
