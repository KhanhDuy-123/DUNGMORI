import Images from 'assets/Images';
import BaseImage from 'common/components/base/BaseImage';
import BaseText from 'common/components/base/BaseText';
import HTMLFurigana from 'common/components/base/HTMLFurigana';
import Dimension from 'common/helpers/Dimension';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { Animated, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const width = Dimension.widthParent;
const height = Dimension.heightParent;
let widthRatio = width / 50;
const backgroundRatio = 375 / 582;

export default class ModalViewTeacherInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      left: 0,
      top: 0
    };
    this.animatedParent = new Animated.Value(0);
    this.animatedOpacity = new Animated.Value(0);
  }

  showModal = (item, pageX, pageY) => {
    let information = item.information.replace(new RegExp('<br>', 'g'), '\n');
    this.setState({ visible: true, item, left: pageX, top: pageY, information }, () => {
      Animated.parallel([
        Animated.timing(this.animatedParent, {
          toValue: 2,
          duration: 400
        }),
        Animated.timing(this.animatedOpacity, {
          toValue: 1,
          duration: 400
        })
      ]).start();
    });
  };

  hideModal = () => {
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: 200
    }).start(() => {
      this.setState({ visible: false }, () => {
        this.animatedParent.setValue(0);
      });
    });
  };

  render() {
    const { item, left, top, information } = this.state;
    let moveX = width / 2 - left;
    let moveY = height / 2 - top;
    const translateX = this.animatedParent.interpolate({
      inputRange: [0, 1],
      outputRange: [0, moveX],
      extrapolate: 'clamp'
    });
    const translateY = this.animatedParent.interpolate({
      inputRange: [0, 1],
      outputRange: [0, moveY],
      extrapolate: 'clamp'
    });

    const scale = this.animatedParent.interpolate({
      inputRange: [1, 2],
      outputRange: [1, widthRatio],
      extrapolate: 'clamp'
    });

    const scaleContent = this.animatedParent.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [50 / width, 50 / width, 50 / width]
    });
    const math = Math.floor(Math.random() * 10);
    let imgSource = Images.imgTeacherBackgound;
    if (math % 2 == 0) imgSource = Images.imgTeacherBackgound2;
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <Animated.View
          style={[
            styles.container,
            { left: left - 25, top: top - 50 / (width / height) / 2, transform: [{ translateX }, { translateY }, { scale }], opacity: this.animatedOpacity }
          ]}>
          <Animated.View style={{ width, height, transform: [{ scale: scaleContent }] }}>
            <BaseImage source={imgSource} style={styles.imgBackground} resizeMode="cover" />
            <View style={styles.image}>
              <BaseImage source={{ uri: Const.RESOURCE_URL.TEACHER.DEFAULT_DETAIL + item?.avartar_detail }} style={styles.viewAvatar} resizeMode="contain" />
            </View>
            <View style={styles.viewInfor}>
              <ScrollView>
                <View style={styles.viewName}>
                  <BaseText style={styles.textName}>{item?.name}</BaseText>
                </View>
                <BaseText style={styles.textInfo}>{information}</BaseText>
                {item && <HTMLFurigana html={item.description} textStyle={{ color: '#FFFFFF', fontSize: 13 }} />}
              </ScrollView>
              <TouchableOpacity style={styles.buttonClose} onPress={this.hideModal}>
                <AntDesign name="close" size={24} color={'#FFFFFF'} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50 / (width / height),
    backgroundColor: 'white',
    position: 'absolute',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: Dimension.widthParent,
    height: 220 * Dimension.scale,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center'
  },
  viewInfor: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,1)',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 40,
    paddingTop: 20
  },
  viewName: {
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#8BD888',
    marginBottom: 20
  },
  textName: {
    fontSize: 16 * Dimension.scale,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  buttonClose: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: -10,
    top: 20
  },
  viewAvatar: {
    width: 140 * Dimension.scale,
    height: 175 * Dimension.scale,
    position: 'absolute',
    bottom: 0
  },
  textInfo: {
    color: '#FFFFFF'
  },
  imgBackground: {
    width,
    height: width / backgroundRatio,
    position: 'absolute',
    top: -50
  }
});
