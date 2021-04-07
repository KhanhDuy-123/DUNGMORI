import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import StaticFlatlist from 'common/components/base/StaticFlatlist';

export default class ModalMenuCountry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      styles: null,
      title: '',
      contentId: null,
      data: [
        { code: 'vi', name: Lang.try_do_test.text_vn },
        { code: 'jp', name: Lang.try_do_test.text_jp },
        { code: 'other', name: Lang.try_do_test.text_other }
      ]
    };
    this.animSrping = new Animated.Value(0);
  }

  showModal = (data) => {
    this.setState({ visible: true, styles: data.style }, () => {
      Animated.spring(this.animSrping, {
        toValue: 1,
        speed: 30
      }).start();
    });
  };

  hideModal = () => {
    Animated.spring(this.animSrping, {
      toValue: 0,
      speed: 30
    }).start();
    this.timer = setTimeout(() => {
      this.setState({ visible: false });
    }, 200);
  };

  getContentId = () => {
    return this.state.contentId;
  };

  onPressItem = (item) => () => {
    if (this.props.onPressItem) this.props.onPressItem(item);
    this.hideModal();
  };

  onPressChooseCountry = (code) => () => {
    this.props.onPressCountry(code);
    this.hideModal();
  };

  convertCountryCodeToName = (countryCode) => {
    const country = this.state.data.find((e) => e.code === countryCode);
    return country?.name;
  };

  keyExtractor = (item, index) => item.id.toString();

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.wrapperItem} onPress={this.onPressItem(item)}>
        <BaseText>{item.name}</BaseText>
      </TouchableOpacity>
    );
  };
  render() {
    return (
      <Modal transparent={true} visible={this.state.visible} animationType="fade">
        <TouchableWithoutFeedback onPress={this.hideModal}>
          <View style={styles.container}>
            <Animated.View
              style={[styles.content, this.state.styles, this.props.contentStyle, { transform: [{ scale: this.animSrping }], opacity: this.animSrping }]}>
              <StaticFlatlist data={this.state.data} renderItem={this.renderItem} />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center'
  },
  content: {
    width: Dimension.widthParent - 50,
    height: 200,
    backgroundColor: 'white',
    position: 'absolute'
  },
  textTitle: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 18,
    fontStyle: 'italic'
  },
  wrapperItem: {
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingVertical: 10
  },
  buttonItem: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center'
  }
});
