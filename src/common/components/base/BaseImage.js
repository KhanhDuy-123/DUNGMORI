import React, { PureComponent } from 'react';
import { ActivityIndicator, ImageProps, View } from 'react-native';
import FastImage from 'react-native-fast-image';

export default class BaseImage extends PureComponent<ImageProps> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  onLoadStart = () => {
    this.setState({ loading: true });
  };

  onLoadEnd = () => {
    this.setState({ loading: false });
  };

  render() {
    const { source, style } = this.props;
    const { loading } = this.state;
    return (
      <FastImage source={source} {...this.props} style={[styles.imageStyles, style]} onLoadStart={this.onLoadStart} onLoadEnd={this.onLoadEnd}>
        {loading ? <ActivityIndicator size={'large'} color={'grey'} style={styles.viewLoading} /> : null}
      </FastImage>
    );
  }
}

const styles = {
  viewLoading: {
    position: 'absolute'
  },
  imageStyles: {
    alignItems: 'center',
    justifyContent: 'center'
  }
};
