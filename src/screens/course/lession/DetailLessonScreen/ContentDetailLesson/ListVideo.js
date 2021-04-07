import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, FlatList, LayoutAnimation, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, UIManager, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const width = Dimension.widthParent;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
export default class ListVideo extends Component {
  roltage = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.state = {
      showListVideo: true,
      heightListVideo: 110 * Dimension.scale
    };
  }

  onPressShowListVideo = () => {
    this.setState(
      (prevState) => {
        const showListVideo = !prevState.showListVideo;
        return { showListVideo };
      },
      () => {
        this.props.onChangeListVideo(this.state.showListVideo);
        if (this.state.showListVideo) {
          Animated.timing(this.roltage, { toValue: 100, duration: 250, useNativeDriver: true }).start();
          LayoutAnimation.easeInEaseOut();
          this.setState({ heightListVideo: 110 * Dimension.scale });
        } else {
          Animated.timing(this.roltage, { toValue: 0, duration: 250, useNativeDriver: true }).start();
          LayoutAnimation.easeInEaseOut();
          this.setState({ heightListVideo: 0 });
        }
      }
    );
  };

  onChangeVideo = (item, index) => () => {
    this.props.onPressChangeVideo(item);
    setTimeout(() => {
      this.FlatList.scrollToIndex({ animated: true, index });
    }, 300);
  };

  keyExtractorListVideo = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={[styles.contentItem]} onPress={this.onChangeVideo(item, index)}>
        <View style={styles.wrapperContent}>
          <FastImage source={Resource.images.imgDocument} style={styles.imageVideo} />
          <View style={styles.backGroundPlayButton}>
            <FastImage style={styles.icPlay} source={item.choose ? Resource.images.icPause : Resource.images.icPlay} />
          </View>
        </View>
        <BaseText style={{ color: 'white', marginTop: 10 }}>{item.video_title}</BaseText>
      </TouchableOpacity>
    );
  };

  render() {
    const roltageIcon = this.roltage.interpolate({
      inputRange: [0, 100],
      outputRange: ['0deg', '-180deg']
    });
    const { showListVideo } = this.state;
    const { listVideo, typeLuyenDe } = this.props;
    return (
      <View style={{ backgroundColor: 'black' }}>
        {typeLuyenDe ? null : (
          <TouchableWithoutFeedback onPress={this.onPressShowListVideo}>
            <View style={styles.buttonListShowVideo}>
              <BaseText style={styles.textShowListVideo}>{Lang.chooseLession.text_button_show_list_video}</BaseText>
              <Animated.Image source={Resource.images.icDown} style={[styles.icDown, { transform: [{ rotate: roltageIcon }] }]} />
            </View>
          </TouchableWithoutFeedback>
        )}
        <View
          style={[
            styles.listVideoArea,
            { height: typeLuyenDe ? 90 * Dimension.scale : this.state.heightListVideo, backgroundColor: typeLuyenDe ? 'white' : 'black' }
          ]}>
          <FlatList
            data={listVideo ? listVideo : []}
            showsHorizontalScrollIndicator={false}
            keyExtractor={this.keyExtractorListVideo}
            renderItem={this.renderItem}
            style={{ flex: 1 }}
            horizontal={true}
            ref={(refs) => (this.FlatList = refs)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonListShowVideo: {
    width,
    height: 45,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: Resource.colors.black1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textShowListVideo: {
    fontSize: 14,
    color: Resource.colors.white100
  },
  icDown: {
    width: 14,
    height: 14
  },
  contentItem: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  imageVideo: {
    width: 120 * Dimension.scale,
    aspectRatio: 1.8 / 1
  },
  listVideoArea: {
    backgroundColor: Resource.colors.black2,
    width,
    borderWidth: 1,
    borderColor: Colors.borderWidth,
    shadowColor: '#000',
    shadowOffset: { x: 2, y: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5
  },
  backGroundPlayButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 35 * Dimension.scale,
    height: 35 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    position: 'absolute'
  },
  icPlay: {
    width: 15 * Dimension.scale,
    height: 15 * Dimension.scale
  },
  wrapperContent: {
    width: 150 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5
  }
});
