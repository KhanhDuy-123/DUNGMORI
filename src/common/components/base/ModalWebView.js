import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Easing, Modal, PanResponder, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import Funcs from 'common/helpers/Funcs';
const height = Dimension.heightParent;
const width = Dimension.widthParent;
const STATUS_BAR_HEIGHT = getStatusBarHeight();
var refDetail = null;

export default class ModalWebView extends Component {
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
        if (gestureState.dy < 90) {
          Animated.timing(this.animatedHeight.y, {
            toValue: 0,
            duration: 150,
            easing: Easing.linear
          }).start();
        } else {
          this.onMoveTapDown();
        }
        this.animatedHeight.flattenOffset();
      }
    });
  }

  componentDidMount() {
    refDetail = this;
  }

  componentWillUnmount() {
    clearTimeout(this.timeHide);
    clearTimeout(this.timeShow);
    refDetail = null;
  }

  static show = (data) => {
    if (refDetail) refDetail.showModal(data);
    else Funcs.log('ModalDetail not instancse');
  };

  static hide = () => {
    if (refDetail) refDetail.hideModal();
    else Funcs.log('ModalDetail not instancse');
  };

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
      easing: Easing.linear
    }).start();
  };

  onMoveTapDown = () => {
    Animated.timing(this.animatedHeight.y, {
      toValue: height,
      duration: 300
    }).start(() => {
      this.hideModal();
    });
  };

  showModal = (data) => {
    this.setState({ visible: true, data, title: data }, () => {
      this.timeShow = setTimeout(() => {
        this.onMoveUp();
      }, 150);
    });
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
              <View style={styles.buttonClose}>
                <TouchableOpacity onPress={this.onMoveTapDown}>
                  <Icon name="ios-close" size={35} color={Resource.colors.black1} />
                </TouchableOpacity>
              </View>

              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <FontAwesome name="lock" size={20} color={Resource.colors.greenColorApp} />
                  <BaseText numberOfLines={1} style={{ marginLeft: 10 }}>
                    {this.state.title}
                  </BaseText>
                </View>
              </View>
            </View>
            <WebView
              source={{
                uri: data
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
    justifyContent: 'flex-end',
    paddingTop: STATUS_BAR_HEIGHT + 20
  },
  content: {
    width,
    height: height - (STATUS_BAR_HEIGHT + 50),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#ffffff'
  },
  wraperHeader: {
    width,
    height: 40,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  indicatorStyle: {
    width,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute'
  },
  buttonClose: {
    top: 2,
    zIndex: 10
  },
  header: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10
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
