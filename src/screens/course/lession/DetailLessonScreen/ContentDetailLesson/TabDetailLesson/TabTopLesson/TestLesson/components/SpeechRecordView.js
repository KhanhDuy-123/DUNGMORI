import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import React from 'react';
import { Animated, NativeModules, PanResponder, Platform, StyleSheet, View } from 'react-native';
import RNSoundLevel from 'react-native-sound-level';
import SoundRecorder from 'react-native-sound-recorder';
import Icon from 'react-native-vector-icons/Ionicons';
var { RNSoundRecorder } = NativeModules;

class SpeechRecordView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.unmount = true;
    this.state = { isSpeak: false, soundLevel: -1, stop: false };
    this.panresponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (this.props.disable) return;
        this.start();
        this.timer = setTimeout(() => {
          this.setState({ stop: true }, this.stop);
        }, 30000);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (this.props.disable) return;
        clearTimeout(this.timer);
        this.stop();
      }
    });
  }

  componentWillUnmount() {
    this.unmount = false;
    if (Platform.OS == 'ios') {
      RNSoundLevel.stop();
    }
  }

  start = async () => {
    // Check permision
    let checkPermissionRecord = await Funcs.checkPermission('microphone');
    if (Platform.OS == 'android') {
      let checkRecord = await Funcs.checkPermission('storage');
      if (!checkPermissionRecord || !checkRecord) return;
    } else {
      if (!checkPermissionRecord) return;
    }

    // iOS
    if (Platform.OS === 'ios') {
      RNSoundLevel.start();
      RNSoundLevel.onNewFrame = this.updateSoundEffect;
    }

    // Speech
    this.setState({
      isSpeak: true
    });

    // Record
    // Why ENCODER_AMR_NB and ENCODER_AAC ??? Tại vì thằng ENCODER_AMR_NB nó nhẹ hơn, gửi file nên nhanh hơn, nhưng nếu dùng nó để decode ra file thì nó lại ko chạy đc trên web
    const { isKaiwa1 } = this.props;
    let option = Platform.OS === 'android' ? { encoder: isKaiwa1 ? RNSoundRecorder.ENCODER_AMR_NB : RNSoundRecorder.ENCODER_AAC } : null;
    this.recordPath = SoundRecorder.PATH_CACHE + '/record.mp4';
    SoundRecorder.start(this.recordPath, option);
    if (Platform.OS === 'android') SoundRecorder.onNewFrame = this.updateSoundEffect;

    // Callback
    if (this.props.onStart) this.props.onStart();

    // Time start
    this.timeStart = Date.now();
  };

  stop = async () => {
    let checkPermissionRecord = await Funcs.checkPermission('microphone');
    if (Platform.OS == 'android') {
      let checkRecord = await Funcs.checkPermission('storage');
      if (!checkPermissionRecord || !checkRecord) return;
    } else {
      if (!checkPermissionRecord) return;
    }

    // Check time
    if (this.timeStart < Date.now() - 500) {
      await Funcs.delay(500);
    }

    // Update state
    if (this) {
      this.setState({
        isSpeak: false
      });
    }

    // Sau 1.5s nếu ko stop đc sẽ tự stop
    let isStopFailed = true;
    if (this.autoStop) clearTimeout(this.autoStop);
    this.autoStop = setTimeout(() => {
      Funcs.log('Manual stop record');
      if (isStopFailed && this.props.onStop) this.props.onStop(this.recordPath);
    }, 1500);

    // Stop
    if (Platform.OS == 'android') {
      await SoundRecorder.stop();
    } else {
      RNSoundLevel.stop();
      await SoundRecorder.stop();
    }

    // Callback
    if (this.props.onStop) this.props.onStop(this.recordPath);
    isStopFailed = false;
  };

  updateSoundEffect = (data) => {
    if (!this.state.isSpeak) return;
    let sub = 160 - Math.abs(data.value);
    let soundLevel = sub / 160 / 2 - 0.2;

    // Update UI effect
    if (this.uiUpdating) return;
    this.uiUpdating = true;
    this.setState(
      {
        soundLevel
      },
      () => {
        this.uiUpdating = false;
      }
    );
  };

  onPress = () => {
    if (this.props.onPress) this.props.onPress();
  };

  renderDotEffect = (isLeft = true) => {
    const style = isLeft ? { left: 0 } : { right: 0, transform: [{ scaleX: -1 }] };
    const array = [[3, 3, 3], [3, 2, 2, 3], [3, 2, 2, 2, 3], [2, 1, 1, 2], [2, 1, 0, 1, 2], [1, 0, 0, 1]];
    let { soundLevel, isSpeak } = this.state;
    const maxActive = isSpeak ? Math.floor(soundLevel * 10) : -1;
    return (
      <View style={{ ...styles.dotContainer, ...style }}>
        {array.map((itemArray, index) => (
          <View key={'parent_' + index}>
            {itemArray.map((item, index1) => (
              <View key={'child_' + index + '_' + index1} style={[styles.dot, { opacity: 1 - index / 10 }, item <= maxActive ? styles.dotActive : {}]} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  render() {
    const { isSpeak, stop } = this.state;
    let borderColor = isSpeak ? '#EC5C3D' : '#C9C9D7';
    let panresponder = { ...this.panresponder.panHandlers };
    if (stop) {
      panresponder = null;
    } else {
      panresponder = { ...this.panresponder.panHandlers };
    }
    return (
      <View style={styles.container}>
        <Animated.View {...panresponder}>
          <Animated.View style={[styles.soundLevel, { borderColor }]} />
          <View style={styles.icMic} activeOpacity={0.75} onPress={this.onPress}>
            <Icon name="ios-mic" size={30} color="#495677" />
          </View>
        </Animated.View>
        {this.renderDotEffect()}
        {this.renderDotEffect(false)}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 220 * Dimension.scale
  },
  icMic: {
    width: 90 * Dimension.scale,
    height: 90 * Dimension.scale,
    borderRadius: (90 / 2) * Dimension.scale,
    justifyContent: 'center',
    alignItems: 'center'
  },
  soundLevel: {
    width: 90 * Dimension.scale,
    height: 90 * Dimension.scale,
    borderRadius: (90 / 2) * Dimension.scale,
    borderWidth: 6,
    position: 'absolute'
  },
  dotContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C9C9D7',
    margin: 3,
    marginVertical: 8
  },
  dotActive: {
    backgroundColor: '#EC5C3D'
  }
});
export default SpeechRecordView;
