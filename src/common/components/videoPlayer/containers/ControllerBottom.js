import BaseText from 'common/components/base/BaseText';
import Slider from 'common/components/base/Slider';
import Dimension from 'common/helpers/Dimension';
import { getBottomSpace, isIphoneX } from 'common/helpers/IPhoneXHelper';
import Time from 'common/helpers/Time';
import React, { Component } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Configs from 'utils/Configs';
import { styles } from './Styles';
const ipXBottomSpace = getBottomSpace();

export default class ControllerBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playingTime: 0
    };
  }

  setCurrentTime = (currentTime) => {
    const progress = currentTime / this.props.totalTime;
    this.refs?.Slider?.setValue(progress ? progress : 0);
    this.setState({
      playingTime: currentTime
    });
  };

  getCurrentTime = () => {
    return this.state.playingTime;
  };

  onSeekVideoStart = () => {
    this.props.onSeekVideoStart();
  };

  onSeekVideoComplete = (percent) => {
    this.props.onSeekVideoComplete(percent / 100);
  };

  onPressSeekStart = () => {
    this.props.onPressSeekStart();
  };

  onPressSeekComplete = (percent) => {
    this.props.onPressSeekComplete(percent / 100);
  };

  onPressFullScreen = () => {
    this.props.onPressFullScreen();
  };

  onValueChange = (percent) => {
    this.props.onValueChange(percent);
  };

  render() {
    let { fadeView, totalTime, fullScreen, loading, showSurvey, spinValue } = this.props;
    let heightViewBottomSpace = 0;
    let heightContainer = 30 * Dimension.scale;
    if (fullScreen && isIphoneX()) {
      heightViewBottomSpace = ipXBottomSpace;
      heightContainer = 20 * Dimension.scale + ipXBottomSpace;
    }
    const { playingTime } = this.state;
    const timePlay = Time.convertTimeToHour(playingTime);
    const duration = Time.convertTimeToHour(totalTime);
    let disabled = false;
    if (loading || showSurvey) disabled = true;
    let translateY = fadeView.interpolate({
      inputRange: [0, 1],
      outputRange: [heightContainer + 1, 0]
    });
    const nameIcon = fullScreen ? 'fullscreen-exit' : 'fullscreen';
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    return (
      <Animated.View style={[styles.containerControllerBottom, { transform: [{ translateY }], height: heightContainer }]} pointerEvents="box-none">
        <View style={styles.controllerBottom}>
          <View style={styles.showTimeArea}>
            <BaseText style={styles.textShowTime}>{timePlay}</BaseText>
          </View>
          <View
            style={[{ height: 30, marginHorizontal: 5, flex: 1, justifyContent: 'center' }]}
            ref={(refs) => (this.ViewSlider = refs)}
            renderToHardwareTextureAndroid={true}>
            <Slider
              ref={'Slider'}
              style={styles.containerSlider}
              trackStyle={styles.track}
              thumStyle={styles.thumb}
              onSlidingStart={this.onSeekVideoStart}
              onSlidingComplete={this.onSeekVideoComplete}
              hintTrackStyle={styles.hintTrackStyle}
              containerTrackStyle={styles.containerTrack}
              onTapStart={this.onPressSeekStart}
              onTapComplete={this.onPressSeekComplete}
              disabled={disabled}
              totalTime={totalTime}
              onValueChange={this.onValueChange}
            />
          </View>
          <View style={styles.showTimeArea}>
            <BaseText style={styles.textShowTime}>{duration}</BaseText>
          </View>
          {Configs.enabledFeature.videoNote ? (
            <TouchableOpacity onPress={this.onPressAddNote}>
              <Animated.Image
                style={{
                  width: 20,
                  height: 20,
                  transform: [{ rotate: spin }]
                }}
                resizeMode="contain"
                source={{ uri: 'https://s3.amazonaws.com/media-p.slid.es/uploads/alexanderfarennikov/images/1198519/reactjs.png' }}
              />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={this.onPressFullScreen} style={styles.buttonFullScreenVideo} disabled={loading}>
            <MaterialIcons name={nameIcon} color={'#FFFFFF'} size={28 * Dimension.scale} />
          </TouchableOpacity>
        </View>
        <View style={{ height: heightViewBottomSpace }} />
      </Animated.View>
    );
  }
}
