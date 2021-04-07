import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import React, { Component } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Sound from 'react-native-sound';

const width = Dimension.widthParent;

type Props = {
  link: String,
  isAdmin: Boolean
};
export default class SoundComment extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      viewReply: false,
      pauseSound: true,
      duration: 0,
      percent: 0,
      timePlay: 0,
      totalTime: 0,
      widthAnimated: 0,
      heAnimated: 0,
      finished: false,
      loading: true
    };

    //Get duration play sound
    let duration = 0;
    this.Sound = new Sound(props.link, '', (error) => {
      if (error) {
        Funcs.log(error);
        return;
      }
      if (this.Sound.getDuration() != -1) {
        duration = this.Sound.getDuration();
        this.setState({ duration, loading: false });
      }
    });
    this.Sound.release();
    this.widthParent = -width;
    this.opacityTotalTime = new Animated.Value(0);
    this.heightParent = 0;
    this.animatedMove = new Animated.Value(-width);
    this.opacProgress = new Animated.Value(1);
    this.countDuration = 0;
  }
  static defaultProps = {
    style: {
      height: 35,
      width: width / 1.6,
      borderRadius: 25,
      backgroundColor: Resource.colors.bgcSound,
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: 10,
      paddingHorizontal: 10
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.changeLink !== this.props.changeLink) {
      let duration = 0;
      this.Sound = new Sound(nextProps.link, '', (error) => {
        if (error) {
          Funcs.log(error);
          return;
        }
        if (this.Sound.getDuration() != -1) {
          duration = this.Sound.getDuration();
          this.setState({ duration, loading: false });
        }
      });
      this.Sound.release();
    }
    return true;
  }

  componentWillUnmount() {
    this.Sound.stop();
    clearInterval(this.timer);
    clearTimeout(this.timeReset);
  }

  duration = () => {
    return this.state.duration;
  };

  onLayout = (event) => {
    this.widthParent = event.nativeEvent.layout.width;
    this.heightParent = event.nativeEvent.layout.height;
    this.setState({
      widthAnimated: this.widthParent,
      heAnimated: this.heightParent
    });
  };

  onLoadSound = (data) => {
    this.setState({ totalTime: data.duration, duration: data.duration, isLoading: true });
  };

  onEndPlaySound = () => {
    Animated.timing(this.animatedMove, {
      toValue: 0,
      duration: 100
    }).start(() => {
      this.setState(
        {
          percent: 0,
          pauseSound: true,
          timePlay: 0
        },
        this.onResetAnimatedValue
      );
    });
  };

  onResetAnimatedValue = () => {
    Animated.timing(this.opacProgress, {
      toValue: 0,
      duration: 200
    }).start(() => {
      this.timeReset = setTimeout(() => {
        this.opacProgress.setValue(1);
        this.animatedMove.setValue(-this.widthParent);
      }, 200);
    });
  };

  //onPressPlay
  onPressPlaySound = () => {
    this.setState(
      {
        pauseSound: !this.state.pauseSound
      },
      () => {
        if (!this.state.pauseSound) {
          this.Sound.play((isFinish) => {
            if (isFinish) {
              this.Sound.stop();
              this.setState({ pauseSound: true });
              this.onEndPlaySound();
            }
          });
          clearInterval(this.timer);
          this.timer = setInterval(() => {
            this.Sound.getCurrentTime((seconds, isFinished) => {
              if (!isFinished) {
                clearInterval(this.timer);
              } else {
                this.onProgress(seconds);
              }
            });
          }, 150);
        } else {
          this.Sound.pause();
        }
      }
    );
  };

  //Progress when sound playing
  onProgress = (data) => {
    let percent = data / this.state.duration;
    if (percent >= 1) {
      percent = 1;
      this.Sound.stop();
    }

    //Start aimation
    Animated.timing(this.animatedMove, {
      toValue: -(this.widthParent - percent * this.widthParent),
      duration: 200,
      easing: Easing.linear
    }).start();
    this.setState({
      timePlay: data,
      percent
    });
  };

  // gen video time
  caculTime = (data) => {
    let time = '00:00';
    try {
      let ratio = Math.round(this.state.duration - data);
      if (ratio <= 0) {
        ratio = 0;
      }
      let seconds = (this.state.duration - data) % 60;
      let min = Math.floor(ratio / 60);
      if (seconds < 10) {
        seconds = '0' + parseInt(seconds);
      } else if (seconds < 60) {
        seconds = parseInt(seconds);
      } else if (min < 10) {
        min = '0' + parseInt(min);
      } else if (min < 60) {
        min = parseInt(min);
      }
      time = min + ':' + seconds;
    } catch (err) {
      console.log('ERROR', err);
    }
    return time;
  };

  renderCount = () => {
    const { timePlay } = this.state;
    const timePlays = this.caculTime(timePlay);
    return (
      <View style={styles.textTimeArea}>
        <BaseText style={{ ...styles.textTime, ...this.props.textTime }}>{timePlays}</BaseText>
      </View>
    );
  };

  render() {
    const { pauseSound, heAnimated, widthAnimated, loading } = this.state;
    const { isAdmin, disablePlay, link } = this.props;
    let colorButton = '#FFFFFF';
    let colorIcon = 'grey';
    if (link?.length > 0) {
      colorButton = 'red';
      colorIcon = 'white';
    }
    if (isAdmin) {
      return (
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.buttonPlay, { backgroundColor: colorButton, marginBottom: 5 }]}
            onPress={this.onPressPlaySound}
            disabled={disablePlay}>
            <FastImage tintColor={colorIcon} source={!pauseSound ? Resource.images.icPause : Resource.images.icPlay} style={styles.iconPlay} />
          </TouchableOpacity>
          {link?.length > 0 && this.renderCount()}
        </View>
      );
    }
    return (
      <View style={[styles.container, this.props.style]} onLayout={this.onLayout}>
        <Animated.View
          style={[
            styles.animatedView,
            {
              height: heAnimated,
              width: widthAnimated,
              transform: [{ translateX: this.animatedMove }],
              opacity: this.opacProgress
            }
          ]}
        />
        {loading ? (
          <View style={styles.buttonPlay}>
            <ActivityIndicator size="small" />
          </View>
        ) : (
          <TouchableOpacity style={styles.buttonPlay} onPress={this.onPressPlaySound}>
            <FastImage tintColor={'#A9A9A9'} source={!pauseSound ? Resource.images.icPause : Resource.images.icPlay} style={styles.iconPlay} />
          </TouchableOpacity>
        )}
        <View style={styles.containerSlider}>
          <View style={styles.contentSlider} />
          {this.renderCount()}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: 35,
    width: width / 1.6,
    borderRadius: 25,
    backgroundColor: Resource.colors.bgcSound,
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 10
  },
  buttonPlay: {
    width: 22,
    height: 22,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Resource.colors.white100,
    zIndex: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 0.2
  },
  containerSlider: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  iconPlay: {
    width: 10,
    height: 10
  },
  thumb: {
    width: 0,
    height: 0,
    backgroundColor: Resource.colors.white100,
    borderRadius: 10 / 2
  },
  textTimeArea: {
    backgroundColor: '#FFFFFF',
    width: 45,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: { width: 1, height: 0 },
    elevation: 0.2
  },
  textTime: {
    color: '#A9A9A9',
    fontSize: 12
  },
  contentSlider: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF'
  },
  animatedView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute'
  }
});
