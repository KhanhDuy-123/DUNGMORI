import Images from 'assets/Images';
import Funcs from 'common/helpers/Funcs';
import UrlConst from 'consts/UrlConst';
import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Sound from 'react-native-sound';

export default class ButtonSpeakQuickTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.pauseSound = true;
    this.SoundPlayer = new Sound(UrlConst.MP3 + encodeURI(props.audio.trim()), '', (error) => {
      if (error) {
        Funcs.log(error);
        return;
      }
      this.setState({ loading: false }, () => {
        if (!this.pauseSound) this.SoundPlayer.play();
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.audio !== this.props.audio) {
      this.setState({ loading: true }, () => {
        this.pauseSound = true;
        this.SoundPlayer = new Sound(UrlConst.MP3 + encodeURI(nextProps.audio.trim()), '', (error) => {
          if (error) {
            Funcs.log(error);
            return;
          }
          this.setState({ loading: false });
        });
      });
    }
    return nextProps.audio !== this.props.audio || nextState.loading !== this.state.loading;
  }

  playSound = () => {
    this.pauseSound = false;
    this.SoundPlayer.stop();
    this.SoundPlayer.setCurrentTime(0);
    this.SoundPlayer.play((isFinished) => {
      if (isFinished) {
        this.SoundPlayer.stop();
        this.pauseSound = true;
      }
    });
  };

  stopPlay = () => {
    this.SoundPlayer?.stop();
    this.pauseSound = true;
  };

  onPressPlaySound = () => {
    this.pauseSound = !this.pauseSound;
    this.SoundPlayer.setVolume(1);
    this.props.onPressPlaySound();
    if (!this.pauseSound) {
      this.SoundPlayer.setCurrentTime(0);
      this.SoundPlayer.play((isFinished) => {
        if (isFinished) {
          this.SoundPlayer.stop();
          this.pauseSound = true;
        }
      });
    } else {
      this.SoundPlayer.stop();
      this.pauseSound = true;
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <View>
        <TouchableOpacity style={styles.button} onPress={this.onPressPlaySound} disabled={loading}>
          {loading ? <ActivityIndicator /> : <FastImage source={Images.icSound} style={styles.icButton} />}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
    borderRadius: 100,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: 'white',
    marginRight: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icButton: {
    width: 20,
    height: 20
  }
});
