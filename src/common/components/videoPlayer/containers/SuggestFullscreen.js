import Lang from 'assets/Lang';
import Const from 'consts/Const';
import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
const HEIGHT_VIDEO = (Dimension.widthParent / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT;

export default class SuggestFullscreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fullscreen: false
    };
  }

  onPressCloseSuggest = () => {
    this.props.onPressCloseSuggest();
  };

  render() {
    return (
      <View style={styles.containerPotrait}>
        <BaseText style={styles.textQuestion}>{Lang.survey_video.text_suggest_fullscreen1}</BaseText>
        <BaseText style={styles.textQuestion}>{Lang.survey_video.text_suggest_fullscreen2}</BaseText>
        <TouchableOpacity style={styles.buttonClose} onPress={this.onPressCloseSuggest}>
          <BaseText style={styles.textButton}>Bỏ qua</BaseText>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerPotrait: {
    width: Dimension.widthParent,
    height: HEIGHT_VIDEO - 30 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  textQuestion: {
    color: '#FFFFFF',
    fontWeight: '600'
  },
  buttonClose: {
    width: 60 * Dimension.scale,
    height: 30 * Dimension.scale,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 20,
    bottom: 10,
    borderRadius: 5
  },
  textButton: {
    color: 'white'
  }
});
