import ImageZoom from 'common/components/base/ImageZoom';
import Dimension from 'common/helpers/Dimension';
import React, { Component, PureComponent } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Const from 'consts/Const';
import Configs from 'utils/Configs';
import ModalWebView from 'common/components/base/ModalWebView';

export default class Advertisement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressShowWebview = (item) => () => {
    if (Configs.enabledFeature.purchase) {
      this.ModalWebView.showModal(item.link);
    } else {
      ImageZoom.show([Const.RESOURCE_URL.ADVERTISE.DEFAULT + item.image_name]);
    }
  };

  renderItem = (item, index) => {
    return (
      <TouchableOpacity key={item.id} activeOpacity={0.8} style={styles.wrapperItem} onPress={this.onPressShowWebview(item)}>
        <FastImage source={{ uri: Const.RESOURCE_URL.ADVERTISE.DEFAULT + item.image_name }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  render() {
    const { advertisement } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {advertisement?.map(this.renderItem)}
        </ScrollView>
        <ModalWebView ref={(refs) => (this.ModalWebView = refs)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15
  },
  image: {
    width: 200 * Dimension.scale,
    aspectRatio: 1.9 / 1,
    borderRadius: 8
  },
  wrapperItem: {
    alignSelf: 'center',
    marginRight: 10,
    marginVertical: 10
  }
});
