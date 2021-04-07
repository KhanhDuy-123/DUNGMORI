import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

export default class ButtonZoomTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.animatedSuggest = new Animated.Value(0);
    this.animatedSpring = new Animated.Value(0.5);
  }

  componentDidMount() {
    const { loading } = this.props;
    if (!loading) {
      Animated.sequence([Animated.delay(2000), Animated.parallel([this.onSpring(1), this.onOpacity(1)])]).start(() => {
        this.timeHide = setTimeout(() => {
          Animated.parallel([this.onOpacity(0), this.onSpring(0.2)]).start();
        }, 3500);
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeHide);
  }

  onSpring = (value) => {
    return Animated.spring(this.animatedSpring, {
      toValue: value,
      bounciness: 10
    });
  };

  onOpacity = (value) => {
    return Animated.timing(this.animatedSuggest, {
      toValue: value,
      duration: 300
    });
  };

  onMoveTab = () => {
    this.props.onMoveTabView();
  };

  render() {
    const { showVideo, disableMoveTab } = this.props;
    let name = Images.icArrowUp;
    showVideo ? (name = Images.icArrowUp) : (name = Images.icArrowDown);

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.viewButton} onPress={this.onMoveTab} disabled={disableMoveTab}>
          <FastImage source={name} style={{ width: 30, height: 30 }} resizeMode={FastImage.resizeMode.contain} />
        </TouchableOpacity>
        <Animated.View style={[styles.areaSuggest, { opacity: this.animatedSuggest, transform: [{ scale: this.animatedSpring }] }]}>
          <View style={styles.triagle} />
          <View style={styles.textSuggest}>
            <BaseText>{Lang.saleLesson.text_button_zoom}</BaseText>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: Dimension.widthParent / 2 - 40
  },
  viewButton: {
    width: 80,
    height: 50,
    alignItems: 'center'
  },
  textComment: {
    fontSize: 14 * Dimension.scale,
    fontWeight: '500'
  },
  triagle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E1E1E1',
    marginLeft: 13
  },
  textSuggest: {
    width: 150,
    height: 35,
    backgroundColor: '#E1E1E1',
    borderRadius: 6,
    left: -112,
    alignItems: 'center',
    justifyContent: 'center'
  },
  areaSuggest: {
    position: 'absolute',
    bottom: -43
  }
});
