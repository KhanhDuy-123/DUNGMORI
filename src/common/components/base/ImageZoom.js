import PhotoView from '@merryjs/photo-viewer';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import Funcs from 'common/helpers/Funcs';

var self = null;
export default class ImageZoom extends PureComponent {
  state = { isVisible: false, data: [] };

  static show = (urlList = []) => {
    if (!self) {
      Funcs.log('ImageZoom not init');
      return;
    }
    var data = urlList.map((uri) => {
      return {
        source: {
          uri
        }
      };
    });
    self.setState({ isVisible: true, data });
  };

  static hide = () => {
    if (!self) {
      Funcs.log('ImageZoom not init');
      return;
    }
    self.setState({ isVisible: false });
  };

  componentDidMount() {
    self = this;
  }

  componentWillUnmount() {
    self = null;
  }

  render() {
    return (
      <PhotoView
        visible={this.state.isVisible}
        hideStatusBar={false}
        hideShareButton={true}
        hideCloseButton={false}
        initial={0}
        onDismiss={ImageZoom.hide}
        {...this.props}
        data={this.state.data}
      />
    );
  }
}

const styles = StyleSheet.create({});
