import React, { PureComponent } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import Configs from 'utils/Configs';
import { onSliComplete, onSliding } from 'states/redux/actions/SlidingAction';

const { width } = Dimensions.get('window');

const MAX = 100.0;
const MIN = 0.0;

class Slider extends PureComponent {
  static defaultProps = {
    thumStyle: { width: 20, height: 20, borderRadius: 20, backgroundColor: 'rgba(0,255, 0, 0.4)', position: 'absolute' },
    hintTrackStyle: { width: '100%', height: 10, backgroundColor: 'grey', borderRadius: 10 },
    trackStyle: { width: '100%', height: '100%', backgroundColor: 'green', borderRadius: 10, position: 'absolute' },
    style: { width: width - 100, height: 50, justifyContent: 'center' },
    containerTrackStyle: { width: '100%', height: 10, overflow: 'hidden', borderRadius: 10, justifyContent: 'center' }
  };

  constructor(props) {
    super(props);
    this.state = {
      widthParent: width
    };
    this.sliderAnimated = new Animated.ValueXY({ x: 0, y: 0 });
    this.animatedWidthParent = new Animated.Value(0);
    this.pageX = 0;
    this.percent = 0;
    this.isPan = false;
    this.widthParent = width;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx >= 3 || gestureState.dx <= 3;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx >= 3 || gestureState.dx <= 3;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx >= 3 || gestureState.dx <= 3;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dx >= 3 || gestureState.dx <= 3;
      },
      onPanResponderGrant: (evt, gestureState) => {
        this.locationX = gestureState.x0 - this.pageX - evt.nativeEvent.locationX;
        this.props.onSlidingStart();
        this.isPan = true;
        this.props.onSliding();
      },
      onPanResponderMove: (evt, gestureState) => {
        let thumSize = this.props.thumStyle?.width;
        let range = this.locationX + gestureState.dx;
        let ratio = (range / (this.widthParent - thumSize)) * 100;
        if (ratio >= MAX) ratio = MAX;
        if (ratio <= MIN) ratio = MIN;
        // console.log(`RATIO`, ratio);
        this.percent = ratio;
        this.props.onValueChange(this.percent / 100);
        this.sliderAnimated.setValue({ x: (ratio / 100) * (this.widthParent - thumSize), y: 0 });
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.props.onSlidingComplete(this.percent);
        this.isPan = false;
        this.props.onSliComplete();
      }
    });
    this.count = 0;
  }

  onLayout = () => {
    setTimeout(() => {
      this.Container.measure((x, y, w, h, px, py) => {
        this.setState({ parentPX: px, widthParent: w });
        this.pageX = px;
        this.widthParent = w;
        this.animatedWidthParent.setValue(w);
        let thumSize = this.props.thumStyle?.width;
        //Check khi rotage man hinh
        this.sliderAnimated.setValue({ x: (this.percent / 100) * (this.widthParent - thumSize), y: 0 });
      });
    }, 500);
  };

  setValue = (value) => {
    this.percent = value * 100;
    const thumSize = this.props.thumStyle?.width;
    Animated.spring(this.sliderAnimated.x, {
      toValue: value * (this.state.widthParent - thumSize),
      bounciness: 0,
      speed: 100,
      useNativeDriver: true
    }).start();
  };

  onPressSeekSlider = (event) => {
    if (this.isPan || this.props.disabled) return;
    const { pageX } = event.nativeEvent;
    this.Container.measure((x, y, w, h, px, py) => {
      this.props.onTapStart();
      const thumSize = this.props.thumStyle?.width;
      const { widthParent } = this.state;
      let positionX = pageX - px - thumSize / 2;
      let ratio = (positionX / (widthParent - thumSize)) * 100;
      if (ratio >= MAX) ratio = MAX;
      if (ratio <= MIN) ratio = MIN;
      this.sliderAnimated.setValue({ x: (ratio / 100) * (widthParent - thumSize), y: 0 });
      this.props.onTapComplete(ratio);
      this.percent = ratio;
    });
  };

  renderNoteVideoQuestion = (item, index) => {
    const { totalTime, containerTrackStyle } = this.props;
    let percent = item.time_start / totalTime;
    let translateX = this.animatedWidthParent.interpolate({
      inputRange: [0, this.widthParent],
      outputRange: [0, percent * this.widthParent]
    });
    if (totalTime > 0) return <Animated.View style={[styles.noteQuestion, { height: containerTrackStyle.height, transform: [{ translateX }] }]} key={index} />;
  };

  render() {
    const { widthParent } = this.state;
    const { thumStyle, hintTrackStyle, trackStyle, style, containerTrackStyle, disabled, videoQuestionInfo } = this.props;
    let panResponder = { ...this.panResponder.panHandlers };
    if (disabled) panResponder = null;
    const thumSize = this.props.thumStyle?.width;
    let trackTransform = 0;
    if (widthParent > 0) {
      trackTransform = this.sliderAnimated.x.interpolate({
        inputRange: [0, widthParent - thumSize],
        outputRange: [-(widthParent - thumSize), 0],
        extrapolate: 'clamp'
      });
    }
    return (
      <View
        renderToHardwareTextureAndroid={true}
        onTouchStart={this.onPressSeekSlider}
        style={[styles.content, style]}
        ref={(refs) => (this.Container = refs)}
        onLayout={this.onLayout}>
        <View style={[styles.wrapTrack, containerTrackStyle]}>
          <View style={[styles.hintTrack, hintTrackStyle]} />
          <Animated.View style={[styles.track, trackStyle, { transform: [{ translateX: trackTransform }] }]} />
          {videoQuestionInfo.map(this.renderNoteVideoQuestion)}
        </View>
        <Animated.View style={[styles.thum, thumStyle, { transform: [{ translateX: this.sliderAnimated.x }] }]} {...panResponder} />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  videoQuestionInfo: state.lessonReducer.videoQuestionInfo || []
});

const mapDispatchToProps = { onSliding, onSliComplete };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(Slider);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    width: width - 100,
    height: 50,
    justifyContent: 'center'
    // backgroundColor: 'red',
  },
  hintTrack: {
    width: '100%',
    height: 10,
    backgroundColor: 'grey',
    borderRadius: 10
  },
  track: {
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 10,
    position: 'absolute'
  },
  wrapTrack: {
    width: '100%',
    height: 10,
    overflow: 'hidden',
    borderRadius: 10,
    justifyContent: 'center'
  },
  thum: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(0,255, 0, 0.4)',
    position: 'absolute'
  },
  noteQuestion: {
    width: 3,
    backgroundColor: 'yellow',
    position: 'absolute'
  }
});
