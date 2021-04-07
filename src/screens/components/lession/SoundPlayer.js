import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import UrlConst from 'consts/UrlConst';
import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View, AppState, StyleProp } from 'react-native';
import FastImage from 'react-native-fast-image';
import Slider from 'react-native-slider';
import Video from 'react-native-video';
import Dimension from 'common/helpers/Dimension';
import Sound from 'react-native-sound';
import Funcs from 'common/helpers/Funcs';

type Props = {
  isAdmin: Boolean,
  style: StyleProp
};
var duration = 0;

export default class SoundPlayer extends Component<Props> {
  constructor(props) {
    super(props);
    let mp3 = this.props.link ? this.props.link : '';
    this.state = {
      percent: 0,
      timePlay: 0,
      totalTime: 0,
      link: props.isAdmin ? encodeURI(mp3) : UrlConst.MP3 + encodeURIComponent(mp3),
      pauseSound: true,
      loading: true
    };
    this.isSliding = false;
    this.isEnd = false;
    this.sound = new Sound(this.state.link, '', (error) => {
      if (error) {
        Funcs.log(error);
        return;
      }
      if (this.sound.getDuration() != -1) {
        duration = this.sound.getDuration();
        this.setState({ totalTime: duration, loading: false });
      }
    });
    this.sound.release();
  }

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = (state) => {
    if (state !== 'active' && !this.state.pauseSound && this.props.type) {
      this.setState({
        pauseSound: true
      });
      this.props.onPlay(this.props.id);
    }
  };

  getDuration = () => {
    return duration;
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item?.paused !== this.state.pauseSound && !this.props.isAdmin) {
      if (!this.isSliding || !this.isEnd) {
        this.setState({ pauseSound: nextProps.item?.paused }, () => {
          if (!this.state.pauseSound) this.onPlaySound();
          else this.sound?.pause();
        });
      }
    }
    if ((nextProps.link !== this.props.link && this.props.isAdmin) || nextProps.changeLink !== this.props.changeLink) {
      this.sound = new Sound(this.props.isAdmin ? encodeURI(nextProps.link) : UrlConst.MP3 + encodeURIComponent(nextProps.link), '', (error) => {
        if (error) {
          Funcs.log(error);
          return;
        }
        if (this.sound.getDuration() != -1) {
          duration = this.sound.getDuration();
          this.setState({ totalTime: duration, loading: false });
        }
      });
      this.sound.release();
    }
    return nextState !== this.state;
  }

  onPressPlaySound = () => {
    this.isEnd = !this.isEnd;
    if (!this.props.isAdmin) this.props.onPlay(this.props.id);
    else {
      this.setState({ pauseSound: !this.state.pauseSound }, () => {
        if (!this.state.pauseSound) this.onPlaySound();
        else this.sound?.pause();
      });
    }
  };

  onProgress = (time) => {
    const { totalTime } = this.state;
    let percent = time / totalTime;
    this.setState({
      timePlay: time,
      percent
    });
  };

  caculTime = (data) => {
    let time = '00:00';
    try {
      let seconds = data % 60;
      let min = Math.floor(data / 60);
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

  onEndPlaySound = () => {
    if (this.props.onEnd) this.props.onEnd(this.props.item);
    this.isEnd = true;
    this.setState({ percent: 0, timePlay: 0, pauseSound: true }, () => {
      this.sound?.setCurrentTime(0);
    });
  };

  onLoadSound = (sound) => {
    duration = sound.duration;
    this.setState({ totalTime: sound.duration, loading: false });
  };

  onPlaySound = () => {
    this.sound.play((isFinish) => {
      if (isFinish) {
        this.sound.stop();
        this.setState({ pauseSound: true });
        this.onEndPlaySound();
      }
    });
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.sound.getCurrentTime((seconds, isFinished) => {
        if (!isFinished) {
          clearInterval(this.timer);
        } else {
          this.onProgress(seconds);
        }
      });
    }, 150);
  };

  onPressSeekSound = (event) => {
    this.isSliding = true;
    this.sound.pause();
    this.setState({ pauseSound: true }, () => {
      this.slider.measure((x, y, width, height, px, py) => {
        const mathss = (event.nativeEvent.locationX - 18) / width;
        this.setState(
          {
            timePlay: Math.floor(mathss * this.state.totalTime),
            percent: mathss,
            pauseSound: false
          },
          () => {
            this.isSliding = false;
            this.onPlaySound();
            this.sound?.setCurrentTime(this.state.timePlay);
          }
        );
      });
    });
  };

  onSeekVideoComplete = (percent) => {
    if (this.props.type) return;
    this.isSliding = false;
    this.setState({ percent, pauseSound: false });
    this.onPlaySound();
    this.sound?.setCurrentTime(percent * this.state.totalTime);
  };

  onSlidingStart = () => {
    if (this.props.type) return;
    this.isSliding = true;
    this.setState({ pauseSound: true });
    this.sound.pause();
  };

  onChangeValueOfSlider = (percent) => {
    this.setState({ timePlay: Math.floor(percent * this.state.totalTime) });
  };

  render() {
    const { percent, timePlay, link, totalTime, pauseSound, loading } = this.state;
    const timeDuration = this.caculTime(totalTime);
    const timePlays = this.caculTime(timePlay);
    const { type, item } = this.props;
    return (
      <View style={[styles.container, this.props.style]}>
        {loading ? (
          <View style={styles.buttonPlay}>
            <ActivityIndicator size="small" color={'#FFFFFFFF'} />
          </View>
        ) : (
          <TouchableOpacity style={styles.buttonPlay} onPress={this.onPressPlaySound}>
            <FastImage source={!pauseSound ? Resource.images.icPause : Resource.images.icPlay} style={styles.iconPlay} />
          </TouchableOpacity>
        )}
        <View style={styles.textTimeArea}>
          <BaseText style={styles.textTime}>{timePlays}/</BaseText>
          <BaseText style={styles.textTime}>{timeDuration}</BaseText>
        </View>
        <View style={styles.containerSlider} ref={(refs) => (this.slider = refs)} renderToHardwareTextureAndroid={true}>
          <TouchableWithoutFeedback onPressIn={this.onPressSeekSound} disabled={type ? true : false}>
            <Slider
              minimumValue={0}
              maximumValue={1.0}
              value={percent}
              onValueChange={this.onChangeValueOfSlider}
              style={styles.slider}
              trackStyle={styles.track}
              thumbStyle={styles.thumb}
              minimumTrackTintColor={Resource.colors.greenColorApp}
              maximumTrackTintColor={Resource.colors.white100}
              thumbTouchSize={styles.thumbSize}
              onSlidingComplete={this.onSeekVideoComplete}
              onSlidingStart={this.onSlidingStart}
              disabled={type ? true : false}
            />
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 45,
    borderRadius: 25,
    shadowColor: Resource.colors.grey600,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 1,
    backgroundColor: Resource.colors.white100,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 15
  },
  buttonPlay: {
    width: 25,
    height: 25,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Resource.colors.greenColorApp,
    marginLeft: 10
  },
  iconPlay: {
    width: 14,
    height: 14
  },
  containerSlider: {
    height: 30,
    width: '50%',
    marginLeft: 5
  },
  slider: {
    height: 30,
    width: '100%'
  },
  track: {
    height: 2,
    backgroundColor: '#CBDDE5'
  },
  thumb: {
    width: 10,
    height: 10,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 10 / 2
  },
  thumbSize: {
    width: 50,
    height: 40
  },
  textTimeArea: {
    width: '25%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 3
  },
  textTime: {
    fontSize: 10 * Dimension.scale
  }
});
