import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Colors from 'assets/Colors';
const parentWidth = Dimension.widthParent - 30;
let SCALE = Dimension.scale;

export default class ItemAllCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressItem = () => {
    this.props.onPressItem(this.props.item);
  };

  renderLabel = (item) => {
    let text = '';
    if (item.price == 0 || item.name?.toUpperCase() == 'N5') {
      text = Lang.homeScreen.text_free;
    } else if (item.owned == 1) {
      text = Lang.homeScreen.text_bought;
    }
    let backgroundColor = Colors.greenColorApp;
    if (item.price == 0) backgroundColor = '#FF9A00';
    if (!(item.owned == 1 || item.price == 0)) return <View />;
    return (
      <View style={[styles.viewBadge, { backgroundColor }]}>
        <BaseText style={styles.textBadge}>{text}</BaseText>
      </View>
    );
  };

  render() {
    const { item, index } = this.props;
    if (item.isFollow) return null;
    let borderTopLeftRadius = index == 0 ? 8 : 0;
    let borderTopRightRadius = index == 2 ? 8 : 0;
    let borderBottomLeftRadius = index == 3 ? 8 : 0;
    let borderBottomRightRadius = index == 5 ? 8 : 0;
    return (
      <TouchableOpacity
        style={[styles.wrapperItem, { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius }]}
        activeOpacity={0.7}
        onPress={this.onPressItem}>
        <View style={styles.wrapperImage}>
          <FastImage source={item.resource} style={styles.img} resizeMode={FastImage.resizeMode.contain} />
          <BaseText style={styles.textName}>{item.name}</BaseText>
        </View>
        {this.renderLabel(item)}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapperItem: {
    width: parentWidth / 3 - 0.7,
    height: 89 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginRight: 0.7,
    marginBottom: 0.7
  },
  img: {
    width: 45 * SCALE,
    height: 40 * SCALE
  },
  textName: {
    fontSize: 10 * Dimension.scale,
    textAlign: 'center',
    fontWeight: '500'
  },
  viewBadge: {
    minWidth: 35 * Dimension.scale,
    paddingHorizontal: 4,
    backgroundColor: 'red',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 7 * Dimension.scale
  },
  textBadge: {
    fontSize: 7,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginHorizontal: 3 * Dimension.scale,
    marginVertical: 2 * Dimension.scale
  },
  wrapperImage: {
    width: '100%',
    height: 89 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5 * Dimension.scale,
    marginBottom: 6 * Dimension.scale
  }
});
