import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Dimension from 'common/helpers/Dimension';
import ModalWebView from 'common/components/base/ModalWebView';
import Countdownt from './Cowndownt';
import Images from 'assets/Images';
const width = Dimension.widthParent;
const parentWidth = width - 30;

export default class TryDoTestJLPT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      front: 1,
      testTime: false
    };
    this.animatedJLPT = new Animated.Value(0);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onOutOfTime = () => {
    this.setState({ testTime: true });
  };

  onPressShowWebview = () => {
    this.props.navigation.navigate(ScreenNames.TestScreen);
  };

  renderCountDown = () => {
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPressShowWebview}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <FastImage source={Resource.images.icJLPT} style={styles.icon} />
          <View style={styles.areaText}>
            <BaseText style={styles.textTest}>DUNGMORI 日本語テスト</BaseText>
            <BaseText style={{ ...styles.textTest, fontWeight: 'bold', fontSize: 14 }}>05/07/2020</BaseText>
          </View>
        </View>
        <View style={styles.wrapperTime}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FastImage source={Resource.images.icTimeToTest} style={{ width: 20, height: 20 }} />
            <BaseText style={styles.textTimeToTest}>{Lang.try_do_test.text_time_to_test}</BaseText>
          </View>
          <Countdownt onOutOfTime={this.onOutOfTime} />
        </View>
        <ModalWebView ref={(refs) => (this.ModalWebView = refs)} />
      </TouchableOpacity>
    );
  };

  renderTestTime = () => {
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPressShowWebview}>
        <FastImage source={Resource.images.imgTestJLPT} style={styles.imgTestJLPT} />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} activeOpacity={0.8} onPress={this.onPressShowWebview}>
          <FastImage style={styles.imageBackground} source={Resource.images.imgLogoJLPT} />
          <FastImage source={Resource.images.icJLPT} style={styles.icon} />
          <View style={styles.areaText}>
            <BaseText style={styles.textTest}>{Lang.homeScreen.text_test_JLPT}</BaseText>
            <BaseText style={styles.textContent}>{Lang.homeScreen.text_every_saturday}</BaseText>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: parentWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    alignSelf: 'center',
    flexDirection: 'row',
    elevation: 1,
    marginTop: 30,
    height: 60 * Dimension.scale,
    alignItems: 'center'
  },
  icon: {
    width: 32 * Dimension.scale,
    height: 37 * Dimension.scale,
    marginLeft: 15
  },
  areaText: {
    marginLeft: 10,
    alignItems: 'center'
  },
  textTest: {
    fontSize: 18,
    marginBottom: 3,
    fontWeight: '600'
  },
  textContent: {
    fontSize: 9
  },
  imageBackground: {
    height: '100%',
    width: '50%',
    position: 'absolute',
    right: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
  },
  wrapper: {
    width: 70,
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden'
  },
  view1: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    transform: [{ rotateX: '0deg' }]
  },
  view2: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    transform: [{ rotateX: '120deg' }]
  },
  view3: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    transform: [{ rotateX: '240deg' }]
  },
  wrapperTime: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F0F7E9',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: 60 * Dimension.scale
  },
  textTimeToTest: {
    fontSize: 9.5,
    fontWeight: '600'
  },
  imgTestJLPT: {
    width: '100%',
    height: '100%',
    borderRadius: 8
  }
});
