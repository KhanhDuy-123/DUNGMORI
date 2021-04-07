import BaseText from 'common/components/base/BaseText';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Easing, Modal, ScrollView, StatusBar, StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Colors from 'assets/Colors';
import Images from 'assets/Images';

const height = Dimension.heightParent;
const width = Dimension.widthParent;
var modalRef = null;
export default class ModalDetailSeri extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: null,
      onMove: true
    };
    this.animatedHeight = new Animated.ValueXY({ x: 0, y: height });
    this.animatedProgress = new Animated.Value(-width);
    this.opacityView = new Animated.Value(1);
  }

  componentDidMount() {
    modalRef = this;
  }

  componentWillUnmount() {
    modalRef = null;
  }

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

  static show = (text) => {
    if (modalRef) modalRef.showModal(text);
  };

  showModal = (data) => {
    this.setState({ visible: true, data }, () => {
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
    Animated.timing(this.animatedHeight.y, {
      toValue: height,
      duration: 300
    }).start(() => {
      this.hideModal();
    });
  };

  renderContent = () => {
    const { data } = this.state;
    return (
      <HTMLFurigana
        html={data?.content}
        textFuriganaStyle={{ fontSize: 7 * Dimension.scale }}
        textStyle={{ fontSize: 13 * Dimension.scale, color: Colors.white100 }}
      />
    );
  };

  render() {
    const { data } = this.state;
    return (
      <Modal transparent={true} visible={this.state.visible} animationType="fade">
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
        <View style={styles.container}>
          <Animated.View style={[styles.content, { transform: [{ translateY: this.animatedHeight.y }] }]}>
            <ScrollView style={{ flex: 1, backgroundColor: data?.color }}>
              <View style={[styles.wrapperContent, { backgroundColor: data?.color }]}>
                <View style={{ ...styles.wrapperTitle, backgroundColor: data?.colorTitle }}>
                  <View style={styles.viewLable}>
                    <BaseText style={styles.textLabel}>{`#${data?.name?.toLowerCase()}`}</BaseText>
                  </View>
                  <TouchableOpacity style={styles.viewIcon} onPress={this.onPressClose}>
                    <FastImage source={Images.icClose} style={styles.iconStyle} resizeMode={FastImage.resizeMode.contain} />
                  </TouchableOpacity>
                </View>
                <BaseText style={styles.titleStyle}>{data?.title}</BaseText>
                <BaseText style={styles.introStyle}>{data?.intro}</BaseText>
                {data?.content ? (
                  <View style={[styles.viewContent, { backgroundColor: data?.colorTitle }]}>
                    <ScrollView showsVerticalScrollIndicator={false}>{this.renderContent()}</ScrollView>
                  </View>
                ) : null}
              </View>
            </ScrollView>
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
    height,
    backgroundColor: '#ffffff'
  },
  wrapperContent: {
    flex: 1,
    width: Dimension.widthParent,
    alignItems: 'center',
    paddingVertical: 20 * Dimension.scale
  },
  titleStyle: {
    fontSize: 20 * Dimension.scale,
    fontWeight: 'bold',
    color: Colors.white100,
    paddingTop: 25 * Dimension.scale,
    paddingHorizontal: 10 * Dimension.scale
  },
  introStyle: {
    fontSize: 13 * Dimension.scale,
    color: Colors.white100,
    padding: 10 * Dimension.scale,
    lineHeight: 25 * Dimension.scale
  },
  viewContent: {
    width: Dimension.widthParent - 40,
    maxHeight: 300 * Dimension.scale,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewLable: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 1 * Dimension.scaleHeight
  },
  textLabel: {
    fontWeight: '500',
    fontSize: 13 * Dimension.scale,
    color: Colors.white100
  },
  wrapperTitle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10 * Dimension.scale
  },
  viewIcon: {
    flex: 1,
    padding: 10,
    position: 'absolute',
    right: 15 * Dimension.scale,
    zIndex: 1000
  },
  iconStyle: {
    width: 20 * Dimension.scale,
    height: 20 * Dimension.scale
  },
  headerPan: {
    width,
    height: 20,
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
