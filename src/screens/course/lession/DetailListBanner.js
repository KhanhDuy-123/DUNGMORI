import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import IPhoneXHelper from 'common/helpers/IPhoneXHelper';
import React, { Component } from 'react';
import { Animated, Easing, Modal, PanResponder, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

const width = Dimension.widthParent;
const height = Dimension.heightParent;
const STATUS_BAR_HEIGHT = IPhoneXHelper.getStatusBarHeight();

export default class DetailListBanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      title: '',
      data: {}
    };
    this.animatedHeight = new Animated.ValueXY({ x: 0, y: height });
    this.animatedProgress = new Animated.Value(-width);
    this.opacityView = new Animated.Value(1);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (event, gestureState) => {
        this.animatedHeight.setOffset({ x: this.animatedHeight.x._value, y: 0 });
        this.animatedHeight.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (event, gestureState) => {
        this.animatedHeight.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (event, gestureState) => {
        this.animatedHeight.flattenOffset();
        if (gestureState.dy < 90) {
          Animated.timing(this.animatedHeight.y, {
            toValue: 0,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true
          }).start();
        } else {
          this.onMoveTapDown();
        }
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeHide);
  }

  onLoad = () => {
    Animated.timing(this.animatedProgress, {
      toValue: -width / 2,
      duration: 1000,
      useNativeDriver: true
    }).start();
  };

  onEnd = () => {
    Animated.sequence([
      Animated.timing(this.animatedProgress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.delay(400),
      Animated.timing(this.opacityView, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      this.setState({ title: 'dungmori.com' });
    });
  };

  onMoveUp = () => {
    Animated.timing(this.animatedHeight.y, {
      toValue: 0,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  };

  onMoveTapDown = () => {
    Animated.timing(this.animatedHeight.y, {
      toValue: height,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      this.hideModal();
    });
  };

  showModal = (data) => {
    const textData = data && data.link ? data.link : null;
    this.setState({ visible: true, data, title: textData }, this.onMoveUp);
  };

  hideModal = () => {
    this.timeHide = setTimeout(() => {
      this.setState({ visible: false });
    }, 100);
  };

  onPressClose = () => {
    this.hideModal();
  };

  render() {
    const { data } = this.state;
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
        <View style={styles.container}>
          <Animated.View {...this.panResponder.panHandlers} style={[styles.headerPan, { transform: [{ translateY: this.animatedHeight.y }] }]}>
            <View style={styles.contentPan} />
          </Animated.View>
          <Animated.View style={[styles.content, { transform: [{ translateY: this.animatedHeight.y }] }]}>
            <View style={styles.wraperHeader}>
              <Animated.View
                style={[
                  styles.indicatorStyle,
                  {
                    transform: [{ translateX: this.animatedProgress }],
                    opacity: this.opacityView
                  }
                ]}
              />
              <TouchableOpacity style={styles.buttonClose} onPress={this.onMoveTapDown}>
                <Icon name="ios-close" size={25 * Dimension.scale} color={Resource.colors.black1} />
              </TouchableOpacity>
              <View
                style={{
                  alignSelf: 'center',
                  flex: 1,
                  alignItems: 'center',
                  marginHorizontal: 10
                }}>
                <View style={styles.viewContent}>
                  <FontAwesome name="lock" size={16 * Dimension.scale} color={Resource.colors.greenColorApp} />
                  <BaseText numberOfLines={1} style={{ marginLeft: 10 }}>
                    {this.state.title}
                  </BaseText>
                </View>
              </View>
            </View>
            <WebView
              source={{
                uri: data && data.link ? data.link : null
              }}
              onLoadStart={this.onLoad}
              onLoadEnd={this.onEnd}
              onError={this.onEnd}
            />
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  content: {
    width,
    height: height - (STATUS_BAR_HEIGHT + 25),
    borderTopLeftRadius: 10 * Dimension.scale,
    borderTopRightRadius: 10 * Dimension.scale,
    backgroundColor: '#ffffff',
    overflow: 'hidden'
  },
  viewContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  wraperHeader: {
    width,
    height: 30 * Dimension.scale,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30 * Dimension.scale
  },
  indicatorStyle: {
    width,
    height: 40 * Dimension.scale,
    backgroundColor: Resource.colors.greyProgress,
    position: 'absolute'
  },
  buttonClose: {
    width: 35 * Dimension.scale,
    height: 30 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 2 * Dimension.scale,
    left: 0 * Dimension.scale
  },
  headerPan: {
    width,
    height: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentPan: {
    width: '30%',
    height: 5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF'
  }
});
