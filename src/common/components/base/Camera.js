import CameraRoll from '@react-native-community/cameraroll';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Button from 'common/components/base/Button';
import Dimension from 'common/helpers/Dimension';
import { getBottomSpace, getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import React, { Component } from 'react';
import { NativeModules, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import FastImage from 'react-native-fast-image';
import KeepAwake from 'react-native-keep-awake';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import Funcs from '../../helpers/Funcs';
const width = Dimension.widthParent;
const height = Dimension.heightParent;

const heightForeGround = Platform.OS === 'ios' ? getStatusBarHeight() + 40 : 40;

export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.recordVideoNaturalSize = null;
    this.state = {
      modalVisible: false,
      pickerType: 0,
      time: 0,
      replayTime: 0
    };
  }

  async show(type) {
    if (!this.state.hasPermissionCamera) {
      let res = await this.checkPermission();
      if (!res) {
        return;
      }
    }

    //Show
    this.setState({
      modalVisible: true,
      pickerType: type ? type : 0
    });

    //Reset
    this.reset();

    // Hiden status bar
    StatusBar.setHidden(true);
    if (NativeModules.KCKeepAwake) KeepAwake.activate();
  }

  hide = () => {
    this.setState({ modalVisible: false });

    // Show status bar
    StatusBar.setHidden(false);
    if (NativeModules.KCKeepAwake) KeepAwake.deactivate();
  };

  async checkPermission() {
    const checkPermissionCamera = await Funcs.checkPermission('camera');
    if (!checkPermissionCamera) return false;
    this.setState({ hasPermissionCamera: true });
    return true;
  }

  reset = () => {
    this.setState({
      capturedImage: null,
      replayTime: 0,
      time: 0
    });
  };

  onPressSelfie = async () => {
    const options = {
      quality: 1,
      skipProcessing: true, //Android
      pauseAfterCapture: true,
      fixOrientation: true, //Android
      forceUpOrientation: true, //IOS fix orientation when save to camera roll
      base64: false,
      mirrorImage: this.state.isCameraFont ? true : false
    };
    try {
      const data = await this.camera.takePictureAsync(options);
      this.setState({
        capturedImage: data
      });
    } catch (error) {
      return error;
    }
  };

  onPressNext = async () => {
    //Save to camera roll
    let res = this.state.capturedImage;
    if (res && res.uri) {
      let aa = await CameraRoll.saveToCameraRoll(res.uri);
    }

    //Callback
    if (this.props.onCaptureSuccess) {
      this.props.onCaptureSuccess(this.state.capturedImage);
    }

    //Hide
    this.hide();
  };

  changeCameraType = () => {
    this.setState({ isCameraFont: !this.state.isCameraFont });
  };

  onPressCancel = () => {
    if (this.state.capturedImage) {
      this.reset();
      return;
    }
    this.hide();
  };

  render() {
    const contentHeight = this.props.height ? this.props.height : height;
    const showCamera = this.state.hasPermissionCamera && !this.state.capturedImage;
    return (
      <Modal
        isVisible={this.state.modalVisible}
        onModalHide={() => {
          if (this.state.capturedImage) {
            this.reset();
            return;
          }
          this.hide();
        }}>
        <View style={styles.modalContainer}>
          {showCamera && this.renderCamera(contentHeight)}
          {this.renderImage(contentHeight)}
          {showCamera && this.renderBottomControl()}
          {this.renderTopControl()}
        </View>
      </Modal>
    );
  }
  renderCamera(contentHeight) {
    return (
      <RNCamera
        style={[styles.camera, { height: contentHeight }]}
        type={this.state.isCameraFont ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}>
        {({ camera, status }) => {
          if (status != 'READY') {
            return null;
          }
          this.camera = camera;
          return null;
        }}
      </RNCamera>
    );
  }
  renderImage(contentHeight) {
    const { capturedImage } = this.state;
    if (!capturedImage) return null;

    //Landscape image
    let imageStyle = {
      width,
      height: contentHeight
    };
    if (capturedImage.pictureOrientation >= 2) {
      let height = (width / contentHeight) * width;
      imageStyle = {
        width,
        height
      };
    }
    return <FastImage style={imageStyle} source={{ uri: capturedImage.uri }} resizeMode={FastImage.resizeMode.contain} />;
  }

  renderBottomControl() {
    const { time } = this.state;
    var progress = (120 - time) / 120;
    if (progress < 0) progress = 0;
    return (
      <View style={[styles.center, styles.bottom]}>
        <TouchableOpacity activeOpacity={0.85} style={styles.captureBottom} onPress={this.onPressSelfie}>
          <View style={styles.center}>
            <Progress.Circle
              borderColor={Resource.colors.white100}
              progress={progress}
              thickness={0}
              size={72}
              borderWidth={5}
              showsText={false}
              direction={'counter-clockwise'}
            />
            <View style={styles.buttonSelfie} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderTopControl() {
    const showNextButton = this.state.capturedImage;
    return (
      <View style={[styles.center, styles.top]}>
        <View style={styles.foreground} />
        {showNextButton ? (
          <Button onPress={this.onPressNext} style={styles.buttonNext}>
            <BaseText style={styles.textStyle}>{Lang.forgotPassword.text_button_send_password}</BaseText>
          </Button>
        ) : (
          <Button style={styles.reverseCameraBox} onPress={this.changeCameraType}>
            <Icon name="ios-reverse-camera" size={40} color={Resource.colors.white100} />
          </Button>
        )}
        <Button onPress={this.onPressCancel} style={styles.buttonCancel}>
          <BaseText style={styles.textStyle}>{Lang.videoDownload.hint_button_cancel}</BaseText>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  camera: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  top: {
    width,
    position: 'absolute',
    top: -20,
    height: heightForeGround
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 130
  },
  foreground: {
    backgroundColor: Resource.colors.black1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3
  },
  captureButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? getBottomSpace() + 20 : 20
  },
  buttonNext: {
    position: 'absolute',
    right: 5,
    height: heightForeGround,
    top: 0,
    minWidth: 60
  },
  reverseCameraBox: {
    position: 'absolute',
    height: heightForeGround,
    right: 10,
    top: 0,
    paddingHorizontal: 7
  },
  buttonCancel: {
    position: 'absolute',
    left: 10,
    top: 0,
    height: heightForeGround,
    minWidth: 60
  },
  buttonSelfie: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25
  },
  textStyle: {
    color: Resource.colors.white100,
    fontSize: 15
  }
});
