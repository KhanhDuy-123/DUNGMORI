import React, { PureComponent } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import ImageZoom from './ImageZoom';

const width = Dimension.widthParent;

const baseStyle = {
  backgroundColor: 'transparent'
};

export default class AutoSizeImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
      source: props.source
    };
  }

  componentDidMount() {
    //avoid repaint if width/height is given
    Image.getSize(this.props.source.uri, (w, h) => {
      let { maxWidth } = this.props;
      if (!maxWidth) maxWidth = width;
      let scale = 1;
      if (w > maxWidth) scale = maxWidth / w;
      this.setState({ width: w * scale, height: h * scale });
    });
  }

  onPressImage = () => {
    let { source } = this.props;
    Funcs.log('Show image ' + source.uri);
    ImageZoom.show([source.uri]);
  };

  render() {
    let { width, height, source } = this.state;
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={this.onPressImage}>
        {height > 1 && width > 1 ? <FastImage style={{ width, height }} source={source} /> : null}
      </TouchableOpacity>
    );
  }
}
