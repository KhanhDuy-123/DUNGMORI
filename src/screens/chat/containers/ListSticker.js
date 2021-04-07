import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, PixelRatio, Dimensions, Animated, Easing } from 'react-native';
import Const from '../../../consts/Const';
import FastImage from 'react-native-fast-image';
import Dimension from 'common/helpers/Dimension'

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)

const data = [
  { name: 'https://mpng.pngfly.com/20180703/cbw/kisspng-sticker-telegram-onion-line-clip-art-5b3bdf6d1a9061.9129714615306504771088.jpg' },
  { name: 'https://cdn.imgbin.com/19/20/4/imgbin-red-onion-sticker-telegram-onion-ZH1yrveQpryUk7AmCDwbiQ0Wu.jpg' },
  { name: 'https://cdn.imgbin.com/20/8/2/imgbin-sticker-telegram-decal-emoticon-onion-stickers-telegram-eg6bATS08ie5qYnMLUM5TDuCs.jpg' },
  { name: 'https://cdn.imgbin.com/22/20/22/imgbin-sticker-telegram-vkontakte-musk-stick-telegram-5VfJyfAxzxQXqfmzLAq9WDVfA.jpg' },
  { name: 'https://cdn.imgbin.com/6/21/16/imgbin-sticker-telegram-onion-com-fragile-sticker-4sai3iRUd7K1JXEerSVmX9fer.jpg' },
  { name: 'https://cdn.imgbin.com/3/17/0/imgbin-sticker-telegram-emoticon-onion-onion-yVrDXcFhZbS0YErkq7EpLaYkK.jpg' },
  { name: 'https://c7.uihere.com/files/911/53/135/sticker-telegram-onion-com-clip-art-onions.jpg' },
  { name: 'https://c7.uihere.com/files/981/1015/590/sticker-whiskers-clip-art-telegram-wife-onion-stickers-telegram.jpg' },
  { name: 'https://www.stickpng.com/assets/thumbs/586612f17d90850fc3ce2a4f.png' },
  { name: 'https://i.pinimg.com/736x/c4/d7/55/c4d7559b99559a3dc0f4c43e4e589451--minion-games-minion-.jpg' },
  { name: 'https://www.pngsee.com/uploadpng/detail/231-2317669_bob-the-minion-sad-hd-png-download.png' },
  { name: 'https://thumbs.gfycat.com/WeakThirdCrocodile-size_restricted.gif' },
  { name: 'https://thumbs.gfycat.com/FriendlyHeartfeltCowbird-size_restricted.gif' },
  { name: 'https://2.bp.blogspot.com/-I1v3v8CC0J8/U1T1V_P-kdI/AAAAAAAANRw/DQR7AGxCLfE/s640/DespicableMe16.png' },
  { name: 'http://www.stickpng.com/assets/thumbs/5866144b7d90850fc3ce2a64.png' },
  { name: 'http://assets.stickpng.com/thumbs/5866129a7d90850fc3ce2a47.png' },
  { name: 'https://www.stickpng.com/assets/images/586613b17d90850fc3ce2a5c.png' },
];

const ratio = Dimension.widthParent / 320;
export default class ListEmoji extends Component {
  constructor(props) {
    super(props);
    let paddingViewParent = 0;
    let widthImage = 60;
    if (ratio <= 2) {
      widthImage = 68 * Dimension.scale;
      paddingViewParent = 3.5 * ratio;
    } else if (ratio > 2 && ratio <= 2.5) {
      widthImage = 64 * Dimension.scale;
      paddingViewParent = 3.5 * ratio;
    } else if (ratio > 2.5 && ratio <= 3.0) {
      widthImage = 60 * Dimension.scale;
      paddingViewParent = 4.5 * ratio;
    } else {
      widthImage = 60 * Dimension.scale;
      paddingViewParent = 2 * ratio;
    }

    this.state = {
      dataList: data,
      paddingViewParent,
      widthImage,
      maxHeight: 0
    };
    this.showSticker = false
    this.animatedHeight = new Animated.Value(0)
  }

  onPressSendSticker = (item, index) => () => {
    console.log(`ITEM`, item, index);
  };

  tooggleSticker = () =>{
    this.showSticker = !this.showSticker
    if(this.showSticker){
      this.show()
    }else{
      this.hide()
    }
  }

  show = () =>{
    this.setState({maxHeight: 220})
  }

  hide = () =>{
    this.setState({maxHeight: 0})
    this.showSticker = false
  }
  renderItem = (item, index) => {
    const { widthImage } = this.state;
    return (
      <TouchableOpacity
        key={item.name}
        style={[styles.button, { width: widthImage }]}
        activeOpacity={0.5}
        onPress={this.onPressSendSticker(item, index)}>
        <FastImage source={{ uri: item.name }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  render() {
    const { paddingViewParent } = this.state;
    return (
      <AnimatedScrollView style={{maxHeight: this.state.maxHeight}} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, { paddingHorizontal: paddingViewParent }]}>
          {this.state.dataList.map(this.renderItem)}
        </View>
      </AnimatedScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-evenly',
    paddingBottom: 20
  },
  button: {
    marginLeft: 10,
    marginBottom: 10,
    width: 67 * Dimension.scale,
    aspectRatio: 1 / 1
  },
  image: {
    width: '100%',
    height: '100%'
  }
});
