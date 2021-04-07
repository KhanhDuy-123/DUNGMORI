import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class ModalMenuChoose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      chooseTime: true
    };
    this.animScale = new Animated.Value(0);
  }

  onAnimShow = () => {
    Animated.timing(this.animScale, {
      toValue: 1,
      duration: 200,
      easing: Easing.elastic(0)
    }).start();
  };

  onAnimHide = (callback) => {
    Animated.timing(this.animScale, {
      toValue: 0,
      duration: 200,
      easing: Easing.elastic(0)
    }).start(callback);
  };

  show = () => {
    this.setState({ visible: true }, () => {
      this.timer = setTimeout(() => {
        this.onAnimShow();
      }, 200);
    });
  };

  hide = () => {
    this.props.onHide();
    this.onAnimHide(() => this.setState({ visible: false }));
  };

  chooseTime = () => {
    this.setState({ chooseTime: true }, () => {
      this.hide();
      this.props.onChooseTime();
    });
  };

  chooseSeri = () => {
    this.setState({ chooseTime: false }, () => {
      this.hide();
      this.props.onChooseSeri();
    });
  };

  render() {
    const { visible, chooseTime } = this.state;
    const width = this.animScale.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 220]
    });
    const height = this.animScale.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 80]
    });

    if (visible) {
      return (
        <View style={{ width: Dimension.widthParent, height: Dimension.heightParent, position: 'absolute' }}>
          <TouchableWithoutFeedback onPress={this.hide} style={{ position: 'absolute' }}>
            <View style={styles.container}>
              <Animated.View style={[styles.content, { width, height, opacity: this.animScale }]}>
                <TouchableOpacity style={styles.contentMenu} onPress={this.chooseTime}>
                  <BaseText numberOfLines={1} style={styles.textContent}>
                    {Lang.seriHistory.text_sort_time}
                  </BaseText>
                  <MaterialIcons name={chooseTime ? 'radio-button-checked' : 'radio-button-unchecked'} size={18} color={Resource.colors.greenColorApp} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.contentMenu} onPress={this.chooseSeri}>
                  <BaseText numberOfLines={1} style={styles.textContent}>
                    {Lang.seriHistory.text_sort_seri}
                  </BaseText>
                  <MaterialIcons name={chooseTime ? 'radio-button-unchecked' : 'radio-button-checked'} size={18} color={Resource.colors.greenColorApp} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  content: {
    width: 220,
    height: 80,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    right: 0
  },
  contentMenu: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  textContent: {
    fontSize: 15,
    fontWeight: '500'
  }
});
