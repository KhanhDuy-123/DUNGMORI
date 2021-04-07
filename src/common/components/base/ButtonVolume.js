import Resource from 'assets/Resource';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Video from 'react-native-video';

class ButtonVolume extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPlay: props.isPlayCard
    };
  }

  onPressPlaySound = () => {
    this.Sound.seek(0);
    this.setState({
      isPlay: true
    });
  };

  onEnd = () => {
    this.setState(
      {
        isPlay: false
      },
      () => this.Sound.seek(0)
    );
  };

  render() {
    let { isPlay } = this.state;
    return (
      <TouchableOpacity style={{ ...styles.icVolume, ...this.props.icVolume }} onPress={this.onPressPlaySound} {...this.props}>
        <Video
          source={{ uri: this.props.linkSound }}
          audioOnly={true}
          volume={1.0}
          paused={!isPlay}
          repeat={false}
          ref={(refs) => (this.Sound = refs)}
          onEnd={this.onEnd}
        />
        <Icon name="volume-up" size={20} color={this.props.soundColor ? this.props.soundColor : 'white'} />
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  icVolume: {
    width: 30 * Dimension.scale,
    height: 30 * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    backgroundColor: Resource.colors.greenColorApp,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
export default ButtonVolume;
