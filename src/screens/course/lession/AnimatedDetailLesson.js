import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Easing, PanResponder, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Const from 'consts/Const';

const STATUS_BAR_HEIGHT = getStatusBarHeight();
const width = Dimension.widthParent;
const height = Dimension.heightParent;

let HEIGHT_DIMESON = (width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT;
export default class AnimatedDetailLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxOffset: 0,
      visible: false,
      content: ''
    };
    this.maxOffset = 0;
    this.totalMove = 0;
    this.bottom = false;
    this.top = true;
    this.animatedTranslate = new Animated.ValueXY({ x: 0, y: 0 });
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy >= 2 || gestureState.dy <= -2;
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dy >= 2 || gestureState.dy <= -2;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy >= 2 || gestureState.dy <= -2;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return gestureState.dy >= 2 || gestureState.dy <= -2;
      },
      onPanResponderGrant: (evt, gestureState) => {
        //Tinh max offset
        this.AnimView.getNode().measure((x, y, w, h, px, py) => {
          if (Math.round(h) == Math.round(HEIGHT_DIMESON)) {
            this.top = true;
            this.bottom = false;
            this.totalMove = height - (STATUS_BAR_HEIGHT + h * 0.25 + 10);
          } else {
            this.totalMove = -(height - (STATUS_BAR_HEIGHT + h + 10));
          }
          if (this.totalMove < 0) this.totalMove = -this.totalMove;
          this.setState({ maxOffset: this.totalMove });
        });
        this.animatedTranslate.setOffset({ x: this.animatedTranslate.x._value, y: this.animatedTranslate.y._value });
        this.animatedTranslate.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        //Giới hạn vuốt xuống khi đang ở dưới đáy màn hình
        if (this.bottom && gestureState.dy <= 0) {
          if (gestureState.dy >= -this.totalMove) {
            this.animatedTranslate.setValue({ x: 0, y: gestureState.dy });
          }
        } else if (this.top && gestureState.dy >= 0) {
          //Giới hạn vuốt lên khi đang ở trên đỉnh màn hình
          if (gestureState.dy <= this.totalMove) {
            this.animatedTranslate.setValue({ x: 0, y: gestureState.dy });
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.animatedTranslate.flattenOffset();
        if (gestureState.dy >= 70) {
          this.bottom = true;
          this.top = false;
          let value = this.totalMove;
          Animated.timing(this.animatedTranslate.y, {
            toValue: value,
            duration: 300,
            easing: Easing.linear()
            // friction: 10
          }).start();
        } else if (gestureState.dy > 0 && gestureState.dy < 70) {
          if (!this.bottom) {
            this.top = true;
            this.bottom = false;
            Animated.timing(this.animatedTranslate.y, {
              toValue: 0,
              duration: 300
              // easing: Easing.out(Easing.in)
              // friction: 10
            }).start();
          }
        } else if (gestureState.dy < 0 && gestureState.dy > -100) {
          this.top = true;
          this.bottom = false;
          Animated.timing(this.animatedTranslate.y, {
            toValue: 0,
            duration: 300
            // easing: Easing.out(Easing.in)
            // friction: 10
          }).start();
        } else if (gestureState.dy <= -100) {
          this.top = true;
          this.bottom = false;
          Animated.timing(this.animatedTranslate.y, {
            toValue: 0,
            duration: 300
            // easing: Easing.out(Easing.in)
            // friction: 10
          }).start();
        }
      }
    });
  }

  componentDidMount() {
    if (Platform.OS == 'android') {
      StatusBar.setTranslucent(false);
    }
  }

  componentWillUnmount() {
    if (Platform.OS == 'android') {
      StatusBar.setTranslucent(true);
    }
  }

  show = (item) => {
    this.setState({ visible: true, content: item.name }, () => {
      Animated.timing(this.animatedTranslate.y, {
        toValue: 0,
        duration: 300
      }).start();
    });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  render() {
    const { maxOffset, visible, content } = this.state;

    const scaleY = this.animatedTranslate.y.interpolate({
      inputRange: [0, maxOffset],
      outputRange: [1, 0.25]
    });

    const scaleX = this.animatedTranslate.y.interpolate({
      inputRange: [0, maxOffset * 0.95, maxOffset],
      outputRange: [1, 0.95, 0.25]
    });

    const translateX = this.animatedTranslate.y.interpolate({
      inputRange: [0, maxOffset * 0.95, maxOffset],
      outputRange: [0, 0, -width * 0.35]
    });

    const translateY = this.animatedTranslate.y.interpolate({
      inputRange: [0, maxOffset],
      outputRange: [0, -(HEIGHT_DIMESON + HEIGHT_DIMESON / 2)]
    });

    const backgroundParent = this.animatedTranslate.y.interpolate({
      inputRange: [0, maxOffset],
      outputRange: ['rgba(255,255,255,255)', 'rgba(255,255,255,0)']
    });

    const translateParent = scaleX.interpolate({
      inputRange: [0.25, 0.95, 1],
      outputRange: [maxOffset, maxOffset * 0.95, 0]
    });

    let translateTitle = width;
    let translatePlay = width;
    let translateClose = width;
    if (maxOffset !== 0) {
      //Dịch chuyển title bài học
      translateTitle = this.animatedTranslate.y.interpolate({
        inputRange: [maxOffset * 0.95, maxOffset],
        outputRange: [width, width - width * 0.75 + 8 * Dimension.scaleWidth]
      });
      //Dịch chuyển nút play/pause
      translatePlay = this.animatedTranslate.y.interpolate({
        inputRange: [maxOffset * 0.95, maxOffset],
        outputRange: [width, width - 120]
      });
      //Dịch chuyển nút đóng
      translateClose = this.animatedTranslate.y.interpolate({
        inputRange: [maxOffset * 0.95, maxOffset],
        outputRange: [width, width - 65]
      });
    }

    if (visible) {
      return (
        <Animated.View style={[styles.container, { transform: [{ translateY: translateParent }], backgroundColor: backgroundParent }]}>
          <View style={styles.viewBackground} />
          <Animated.View
            style={[styles.viewVideo, { transform: [{ scaleY }, { translateX }, { translateY }, { scaleX }] }]}
            {...this.panResponder.panHandlers}
            ref={(refs) => (this.AnimView = refs)}>
            {/* <VideoPlayer sourceVideo={{ uri: 'https://vn.dungmori.com/720p/Kaiwa-3.1.mp4/index.m3u8' }} /> */}
          </Animated.View>
          <Animated.View style={[styles.viewTitle, { transform: [{ translateX: translateTitle }] }]} {...this.panResponder.panHandlers}>
            <BaseText style={styles.textTitle} numberOfLines={1}>
              {Lang.detailLesson.text_comunication}
            </BaseText>
            <BaseText style={styles.textContent} numberOfLines={1}>
              {content}
            </BaseText>
          </Animated.View>

          <Animated.View style={[styles.buttonPlay, { transform: [{ translateX: translatePlay }] }]} {...this.panResponder.panHandlers}>
            <TouchableOpacity style={styles.button} activeOpacity={0.8}>
              <Entypo name="controller-play" size={28} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.buttonClose, { transform: [{ translateX: translateClose }] }]} {...this.panResponder.panHandlers}>
            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={this.hide}>
              <Ionicons name="md-close" size={26} />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    position: 'absolute',
    backgroundColor: 'skyblue',
    overflow: 'hidden'
  },
  viewVideo: {
    width: width,
    height: (width / Const.VIDEO_CONFIG.SIZE.WIDTH) * Const.VIDEO_CONFIG.SIZE.HEIGHT,
    backgroundColor: 'cyan',
    overflow: 'visible',
    elevation: 0.5
  },
  viewTitle: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'white',
    width: width * 0.75 - 130,
    height: HEIGHT_DIMESON * 0.25,
    justifyContent: 'space-evenly',
    elevation: 0.5
  },
  buttonPlay: {
    position: 'absolute',
    width: 55,
    height: HEIGHT_DIMESON * 0.25,
    elevation: 0.5
  },
  buttonClose: {
    position: 'absolute',
    width: 55,
    height: HEIGHT_DIMESON * 0.25,
    elevation: 0.5
  },
  button: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0.5
  },
  textTitle: {
    marginHorizontal: 10,
    fontSize: 12 * Dimension.scale
  },
  textContent: {
    marginHorizontal: 10,
    fontSize: 11 * Dimension.scale
  },
  viewBackground: {
    width: width - 15,
    position: 'absolute',
    backgroundColor: 'white',
    height: HEIGHT_DIMESON / 4,
    alignSelf: 'center',
    shadowColor: 'grey',
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.5,
    borderTopColor: 'grey',
    borderTopWidth: 0.5,
    elevation: 0.5
  }
});
