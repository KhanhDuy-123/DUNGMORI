import Resource from 'assets/Resource';
import Dimension from 'common/helpers/Dimension';
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';

export default class AnimatedFloatButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.animatedSpring = new Animated.Value(1);
    this.animatedOpac = new Animated.Value(1);
  }

  componentDidMount() {
    this.onAnimatedBuyButton();
  }

  componentWillUnmount() {
    clearTimeout(this.timeRepeatAni);
  }

  onAnimatedBuyButton = () => {
    this.onSpring().start();
    this.timeRepeatAni = setTimeout(() => {
      this.onOpacity().start(() => {
        this.animatedOpac.setValue(1);
        this.animatedSpring.setValue(1);
        this.onAnimatedBuyButton();
      });
    }, 400);
  };

  onSpring = () => {
    return Animated.spring(this.animatedSpring, {
      toValue: 1.7,
      useNativeDriver: true,
      stiffness: 15
    });
  };

  onOpacity = () => {
    return Animated.timing(this.animatedOpac, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    });
  };

  render() {
    const { onPress, certificate, buttonStyle, viewButton, totalProgress } = this.props;
    return (
      <View style={{ ...styles.viewButton, ...viewButton }}>
        {totalProgress < 90 ? null : (
          <Animated.View style={[styles.viewSping, this.props.viewSping, { transform: [{ scale: this.animatedSpring }], opacity: this.animatedOpac }]} />
        )}
        <TouchableOpacity {...this.props} style={{ ...styles.buttonStyle, ...buttonStyle }} onPress={onPress}>
          {certificate ? (
            <FastImage source={Resource.images.icCertificate} style={styles.iconStyles} resizeMode={FastImage.resizeMode.contain} />
          ) : (
            <Icon name="ios-cart" size={20 * Dimension.scale} color={Resource.colors.white100} />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewButton: {
    position: 'absolute',
    bottom: 20 * Dimension.scale,
    right: 20 * Dimension.scale
  },
  buttonStyle: {
    width: 35 * Dimension.scale,
    height: 35 * Dimension.scale,
    borderRadius: 100,
    backgroundColor: '#FF9A00',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 1.3
  },
  viewSping: {
    width: 35 * Dimension.scale,
    height: 35 * Dimension.scale,
    borderRadius: 100,
    borderWidth: 1.2,
    borderColor: '#FF9A00',
    position: 'absolute'
  },
  iconStyles: {
    width: 20 * Dimension.scale,
    height: 20 * Dimension.scale
  }
});
