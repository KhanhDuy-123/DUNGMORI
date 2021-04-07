import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import UIConst from 'consts/UIConst';
import StaticFlatlist from 'common/components/base/StaticFlatlist';
import BaseInput from 'common/components/base/BaseInput';
import Lang from 'assets/Lang';
import Strings from 'common/helpers/Strings';

const data = require('assets/jsons/vn_state.json');

export default class ModalMenuProvince extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      styles: null,
      title: '',
      contentId: null,
      list: []
    };
    this.animSrping = new Animated.Value(0);
  }

  showModal = () => {
    this.setState({ visible: true, data }, () => {
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

  onPress = (code) => () => {
    this.props.onPress(code);
    this.hideModal();
  };

  onChangeText = (text) => {
    let newData = data.filter((e) => {
      let name = Strings.replaceAscent(e.name.toLowerCase());
      return name.indexOf(Strings.replaceAscent(text.toLowerCase())) >= 0;
    });
    this.setState({ data: newData });
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
            <Animated.View style={[styles.content, this.state.styles, this.props.contentStyle, { opacity: this.animSrping }]}>
              <View style={{ padding: 10 }}>
                <BaseInput
                  placeholder={Lang.try_do_test.filter_province}
                  textInputStyle={styles.textInput}
                  placeholderTextColor={'#999'}
                  onChangeText={this.onChangeText}
                />
              </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    width: Dimension.widthParent - 50 * UIConst.SCALE,
    height: UIConst.HEIGHT - 100 * UIConst.SCALE,
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
    height: 45,
    justifyContent: 'center',
    paddingLeft: 10
  },
  buttonItem: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center'
  },
  textInput: {
    backgroundColor: '#DDD',
    color: '#333',
    paddingHorizontal: UIConst.SCALE * 10,
    borderRadius: UIConst.SCALE * 20,
    fontSize: UIConst.FONT_SIZE
  }
});
