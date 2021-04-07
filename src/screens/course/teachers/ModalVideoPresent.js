import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import YouTube from 'react-native-youtube';
import Const from 'consts/Const';
import Dimension from 'common/helpers/Dimension';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class ModalVideoPresent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      videoId: null,
      fullscreen: false
    };
  }

  showModal = (videoId) => {
    this.setState({ visible: true, videoId });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  onVideoEnd = () => {};

  onPressClose = () => {
    this.setState({ visible: false });
  };

  onChangeFullScreen = (event) => {
    if (event.isFullscreen) {
      this.setState({ fullscreen: true });
    } else {
      this.setState({ fullscreen: false });
    }
  };

  render() {
    const { videoId, visible } = this.state;
    if (!visible) return null;
    return (
      <View style={styles.container}>
        <StatusBar hidden={visible} />
        <TouchableOpacity style={styles.buttonClose} onPress={this.onPressClose}>
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
        <YouTube
          videoId={videoId}
          origin={'http://www.youtube.com'}
          play={true}
          fullscreen={false}
          loop={false}
          apiKey={Const.APP_KEY.YOUTUBE_API}
          style={{ alignSelf: 'stretch', height: (Dimension.widthParent / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimension.widthParent,
    height: Dimension.heightParent,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute'
  },
  buttonClose: {
    width: 50,
    height: 35,
    borderRadius: 10,
    position: 'absolute',
    right: 20,
    top: 30,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
