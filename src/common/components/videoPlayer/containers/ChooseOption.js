import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { onChangeServerVideo } from 'states/redux/actions/ChangeServerAction';
import { onChangeHD } from 'states/redux/actions/QualityAction';
import { onChangeSpeedPlayVideo } from 'states/redux/actions/SpeedVideoAction';
import Dimension from 'common/helpers/Dimension';
import { styles } from './Styles';
class ChooseOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      server: [],
      videoDownloaded: false,
      showChooselink: props.showChooselink,
      showServer: props.showServer,
      showSpeed: props.showSpeed,
      qualityType: null
    };
    this.disabled = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.showChooselink !== this.props.showChooselink) {
      this.setState({ showChooselink: nextProps.showChooselink });
    }
    if (nextProps.showServer !== this.props.showServer) {
      this.setState({ showServer: nextProps.showServer });
    }
    if (nextProps.showSpeed !== this.props.showSpeed) {
      this.setState({ showSpeed: nextProps.showSpeed });
    }
    return nextState !== this.state;
  }

  onPressChangeServer = (data, jp) => () => {
    let url = data.url;
    if (jp) {
      let random = Math.floor(Math.random() * Math.floor(2));
      if (random == 0) {
        url = url.replace('tokyo', 'osaka');
      }
    }
    let datas = {
      name: data.name,
      url: url,
      id: data.id
    };
    this.props.onChangeServerVideo(datas);
    this.props.onPressChangeServer(url);
  };

  onPressChangeQuality = (data) => () => {
    if (data == Const.VIDEO_QUALITY['720p']) {
      this.props.onChangeHD(Const.VIDEO_QUALITY['720p']);
      this.props.onPressChangLink(Const.VIDEO_QUALITY['720p']);
    }
    if (data == Const.VIDEO_QUALITY['480p']) {
      this.props.onChangeHD(Const.VIDEO_QUALITY['480p']);
      this.props.onPressChangLink(Const.VIDEO_QUALITY['480p']);
    }
    if (data == Const.VIDEO_QUALITY['360p']) {
      this.props.onChangeHD(Const.VIDEO_QUALITY['360p']);
      this.props.onPressChangLink(Const.VIDEO_QUALITY['360p']);
    }
  };

  onPressChangeSpeed = (speed) => () => {
    this.props.onChangeSpeedPlayVideo(speed);
    this.props.onPressSpeed(speed);
  };

  render() {
    const { fadeView } = this.props;
    const { showChooselink, showServer, showSpeed } = this.state;
    let height = '0%';
    showSpeed || showChooselink || showServer ? (height = '100%') : (height = '0%');
    return (
      <Animated.View style={[styles.chooseDataArea, { opacity: fadeView, height }]}>
        {showSpeed == true ? (
          <View style={[styles.areaChooseOption, { height: 25 * 5 * Dimension.scale, width: '13%' }]}>
            <TouchableOpacity style={styles.buttonchooseItem} onPress={this.onPressChangeSpeed(Const.VIDEO_SPEED['0.75x'])}>
              <BaseText style={styles.textButton}>{Lang.detailLesson.text_speed_075x}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonchooseItem} onPress={this.onPressChangeSpeed(Const.VIDEO_SPEED['1x'])}>
              <BaseText style={styles.textButton}>{Lang.detailLesson.text_speed_1x}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonchooseItem} onPress={this.onPressChangeSpeed(Const.VIDEO_SPEED['1.25x'])}>
              <BaseText style={styles.textButton}>{Lang.detailLesson.text_speed_125x}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonchooseItem} onPress={this.onPressChangeSpeed(Const.VIDEO_SPEED['1.5x'])}>
              <BaseText style={styles.textButton}>{Lang.detailLesson.text_speed_15x}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonchooseItem} onPress={this.onPressChangeSpeed(Const.VIDEO_SPEED['2x'])}>
              <BaseText style={styles.textButton}>{Lang.detailLesson.text_speed_2x}</BaseText>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
        {showChooselink == true ? (
          <View style={[styles.areaChooseOption, { height: 3 * 25 * Dimension.scale, width: '15%', left: '13%' }]}>
            <TouchableOpacity style={styles.buttonchooseItem} onPress={this.onPressChangeQuality(Const.VIDEO_QUALITY['720p'])}>
              <BaseText style={styles.textButton}>{Lang.detailLesson.text_quality_720p}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonchooseItem} onPress={this.onPressChangeQuality(Const.VIDEO_QUALITY['480p'])}>
              <BaseText style={styles.textButton}>{Lang.detailLesson.text_quality_480p}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonchooseItem} onPress={this.onPressChangeQuality(Const.VIDEO_QUALITY['360p'])}>
              <BaseText style={styles.textButton}>{Lang.detailLesson.text_quality_360p}</BaseText>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
        {showServer == true ? (
          <View style={[styles.areaChooseOption, { height: 2 * 25 * Dimension.scale, left: '28%' }]}>
            <TouchableOpacity style={styles.buttonchooseItem} onPress={this.onPressChangeServer(this.props.server[0], false)}>
              <BaseText style={styles.textButton}>{Lang.detailLesson.text_choose_server_vietnam}</BaseText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonchooseItem} onPress={this.onPressChangeServer(this.props.server[1], true)}>
              <BaseText style={styles.textButton}>{Lang.detailLesson.text_choose_server_japan}</BaseText>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
      </Animated.View>
    );
  }
}

const mapDispatchToProps = { onChangeServerVideo, onChangeHD, onChangeSpeedPlayVideo };

const mapStateToProps = (state) => ({
  server: state.changeServerReducer.listServer
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(ChooseOption);
