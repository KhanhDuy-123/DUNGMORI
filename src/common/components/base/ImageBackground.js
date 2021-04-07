import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const width = Dimension.widthParent;

export class ImageBackground extends PureComponent {
  render() {
    return <FastImage style={[styles.container, this.props.bgStyle]} source={this.props.nameImage} resizeMode={FastImage.resizeMode.contain} />;
  }
}

const styles = StyleSheet.create({
  container: {
    width: width / (2 * Dimension.scale) - 30,
    height: width / (4 * Dimension.scale),
    marginTop: width / (3 * Dimension.scale) + 50
  }
});

export default ImageBackground;
