import Colors from 'assets/Colors';
import Styles from 'assets/Styles';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

const iconURL = 'https://dungmori.com/cdn/lesson_category/';

let itemNormalWidth = Dimension.widthParent / 3 - 10 - 5;
const itemExpertWidth = itemNormalWidth * 2 + itemNormalWidth / 2.5;
let itemExtendlWidth = Dimension.widthParent - 30 - 5 - itemExpertWidth;

export default class ItemCategory extends React.PureComponent {
  onPressChooseCategories = () => {
    this.props.onPressChooseCategories(this.props.item);
  };

  renderContent = () => {
    const { item } = this.props;
    if (item.type === 2) {
      return <ImageBackground source={{ uri: iconURL + item.icon }} style={styles.bgExpert} resizeMode="stretch" />;
    }
    return (
      <>
        <FastImage source={{ uri: iconURL + item.icon }} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
        <BaseText style={styles.title}>{item.title}</BaseText>
      </>
    );
  };

  render() {
    const { item } = this.props;
    let viewButton = item.isExtendsCategory ? [styles.viewButton, styles.extendStyle] : styles.viewButton;
    if (item.type === 2) viewButton = styles.containerExpert;
    const style = [viewButton, item.isChoose ? { borderWidth: 2, borderColor: Colors.greenColorApp } : {}];
    return (
      <TouchableOpacity style={style} onPress={this.onPressChooseCategories} activeOpacity={0.8}>
        {this.renderContent()}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  icon: {
    width: 30 * Dimension.scale,
    height: 30 * Dimension.scale
  },
  viewButton: {
    width: itemNormalWidth,
    height: 85 * Dimension.scaleWidth,
    borderRadius: 10 * Dimension.scale,
    backgroundColor: Colors.white100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#eee',
    shadowColor: 'grey',
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
    marginHorizontal: 5,
    paddingTop: 10 * Dimension.scale
  },
  title: {
    fontSize: 11 * Dimension.scale,
    color: Colors.greenColorApp,
    fontWeight: '600',
    textAlign: 'center',
    paddingTop: 10 * Dimension.scale
  },
  containerExpert: {
    width: itemExpertWidth,
    height: 85 * Dimension.scaleWidth,
    borderRadius: 10 * Dimension.scale,
    backgroundColor: '#93CA8C',
    shadowColor: 'grey',
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
    marginTop: 10 * Dimension.scale,
    marginHorizontal: 5,
    ...Styles.center
  },
  extendStyle: {
    width: itemExtendlWidth
  },
  textStyle: {
    color: Colors.white100,
    fontSize: 9 * Dimension.scale,
    fontWeight: 'bold'
  },
  bgExpert: {
    width: itemExpertWidth - 5 * Dimension.scaleWidth,
    height: 80 * Dimension.scaleWidth
  }
});
