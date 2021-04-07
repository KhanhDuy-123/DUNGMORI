import React, { Component } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { styles } from './Styles';
import Resource from '../../../../assets/Resource';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class PlayButton extends Component {
  state = {
    pauseVideo: this.props.pauseVideo
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.pauseVideo !== this.props.pauseVideo) {
      this.setState({ pauseVideo: nextProps.pauseVideo });
    }
    return nextState !== this.state || nextProps.alwayShowController !== this.props.alwayShowController;
  }

  onPressForwardVideo = () => {
    this.props.onPressForwardVideo();
  };

  onPressPlayVideo = () => {
    this.props.onPressPlayVideo();
  };

  onPressPreviousVideo = () => {
    this.props.onPressPreviousVideo();
  };

  render() {
    let { fadeView, alwayShowController, videoFinish } = this.props;
    const { pauseVideo } = this.state;
    return (
      <Animated.View style={[styles.buttonPlayerArea, { opacity: fadeView }]}>
        <TouchableOpacity style={styles.playBackButton} onPress={this.onPressPreviousVideo} disabled={alwayShowController ? true : false}>
          <FastImage source={Resource.images.icBack10s} style={styles.icPlayBack} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={this.onPressPlayVideo} disabled={alwayShowController ? true : false}>
          <FastImage source={videoFinish ? Resource.images.icRotate : pauseVideo ? Resource.images.icPlay : Resource.images.icPause} style={styles.icPlay} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playBackButton} onPress={this.onPressForwardVideo} disabled={alwayShowController ? true : false}>
          <FastImage source={Resource.images.icNext10s} style={styles.icPlayBack} />
        </TouchableOpacity>
      </Animated.View>
    );
  }
}
