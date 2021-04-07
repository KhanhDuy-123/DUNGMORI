import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Menu from 'react-native-material-menu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BaseText from './BaseText';

export default class MenuSort extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  showMenu = () => {
    this.Menu.show();
  };

  hideMenu = () => {
    this.Menu.hide();
  };

  render() {
    const { onPressSortLike, onPressSortNew } = this.props;
    return (
      <Menu ref={(refs) => (this.Menu = refs)} button={<Ionicons name="md-options" size={24} color={Resource.colors.gray} onPress={this.showMenu} />}>
        <TouchableOpacity onPress={onPressSortLike}>
          <View style={styles.itemMenu}>
            <BaseText style={styles.textItem} numberOfLines={1}>
              {Lang.popupMenu.text_like}
            </BaseText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressSortNew}>
          <View style={styles.itemMenu}>
            <BaseText style={styles.textItem} numberOfLines={1}>
              {Lang.popupMenu.text_new_coment}
            </BaseText>
          </View>
        </TouchableOpacity>
      </Menu>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  itemMenu: {
    paddingHorizontal: 25,
    justifyContent: 'center',
    height: 40
  },
  textItem: {
    fontSize: 14,
    fontWeight: '500'
  }
});
