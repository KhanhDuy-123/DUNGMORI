import Images from 'assets/Images';
import BaseText from 'common/components/base/BaseText';
import React, { PureComponent } from 'react';
import { Animated, StyleSheet, PanResponder, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import ModalTakeGift from '../ModalTakeGift';
import Dimension from 'common/helpers/Dimension';

export default class ButtonTakeGift extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    const touchThreshold = 20;
    this.animatedScale = new Animated.Value(0);
    this.moveAnimated = new Animated.ValueXY({ x: Dimension.widthParent - 60 * Dimension.scale, y: Dimension.heightParent - 105 * Dimension.scale });
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (e, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > touchThreshold || Math.abs(dy) > touchThreshold;
      },
      onPanResponderGrant: () => {
        this.moveAnimated.setOffset({
          x: this.moveAnimated.x._value,
          y: this.moveAnimated.y._value
        });
        this.moveAnimated.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gesture) => {
        this.moveAnimated.setValue({
          x: gesture.dx,
          y: gesture.dy
        });
      },
      onPanResponderRelease: () => {
        this.moveAnimated.flattenOffset();
      }
    });
  }

  animatedScroll = (direction) => {
    Animated.timing(this.animatedScale, {
      toValue: direction === 'up' ? 0 : 1,
      duration: 400
    }).start();
  };

  onPressShowModal = () => {
    ModalTakeGift.show();
  };

  render() {
    // const { hideText } = this.props;
    // const scaleX = this.animatedScale.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [150, 50]
    // });
    // const scaleViewText = this.animatedScale.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ['100%', '0%']
    // });
    return (
      <Animated.View {...this.panResponder.panHandlers} style={[this.moveAnimated.getLayout(), styles.wrapperButton, this.props.style]}>
        <TouchableOpacity style={styles.buttonShare} onPress={this.onPressShowModal}>
          {/* {!hideText && (
            <Animated.View style={{ width: scaleViewText, alignItems: 'flex-start', paddingHorizontal: 20 }}>
              <View style={{ alignItems: 'center' }}>
                <BaseText numberOfLines={1} style={styles.textTake}>
                  NHẬN
                </BaseText>
                <BaseText numberOfLines={1} style={styles.textGift}>
                  QUÀ NGAY
                </BaseText>
              </View>
            </Animated.View>
          )} */}
          <View style={styles.viewCircleWhite} />
          <View style={styles.button}>
            <View style={styles.viewCircleBig} />
            <View style={styles.viewCircleSmall} />
            <FastImage source={Images.icGiftBox} style={styles.Images} resizeMode={FastImage.resizeMode.contain} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperButton: {
    position: 'absolute'
  },
  buttonShare: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FF7144',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFD1A9',
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  viewCircleWhite: {
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 100,
    position: 'absolute',
    right: 0
  },
  viewCircleBig: {
    width: 40,
    height: 40,
    borderRadius: 45,
    backgroundColor: '#FFE7D2'
  },
  viewCircleSmall: {
    width: 30,
    height: 30,
    borderRadius: 40,
    backgroundColor: '#FFD1A9',
    position: 'absolute'
  },
  Images: {
    width: 20,
    height: 20,
    position: 'absolute'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 4
  },
  textTake: {
    letterSpacing: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5C47'
  },
  textGift: {
    color: '#FF5C47',
    fontWeight: '600',
    letterSpacing: -0.5
  }
});
