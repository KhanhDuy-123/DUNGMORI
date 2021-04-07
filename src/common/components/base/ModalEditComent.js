import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { Animated, Dimensions, Easing, Keyboard, Modal, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import BaseText from './BaseText';
const { height, width } = Dimensions.get('window');

const STATUS_BAR_HEIGHT = getStatusBarHeight();

export default class ModalEditComent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      text: '',
      avatar: '',
      id: null
    };
    this.heightMove = new Animated.Value(0);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  showEdit = (data) => {
    this.setState({ visible: true, text: data.content, avatar: data.avatar, id: data.id }, this.onMoveView);
  };

  hideEdit = () => {
    Keyboard.dismiss();
    this.timer = setTimeout(() => {
      this.setState({ visible: false });
    }, 100);
  };

  onMoveView = () => {
    Animated.timing(this.heightMove, {
      toValue: 1,
      duration: 300,
      easing: Easing.elastic(0.7)
    }).start();
  };

  onMoveTapDown = () => {
    Animated.timing(this.heightMove, {
      toValue: 0,
      duration: 300
    }).start(() => {
      this.hideEdit();
    });
  };

  onChangeText = (text) => {
    this.setState({ text });
  };

  onHideKeyboard = () => {
    Keyboard.dismiss();
  };

  onPressUpdateComent = (id, text) => () => {
    this.props.onPressUpdateComent(id, text);
  };

  render() {
    let isChangeText = this.state.text.length !== 0;
    let translate = this.heightMove.interpolate({
      inputRange: [0, 1],
      outputRange: [height - (STATUS_BAR_HEIGHT + 10), 0]
    });
    const { onPressUpdateComent } = this.props;
    const avat = this.state.avatar ? Const.RESOURCE_URL.AVATAR.SMALL + this.state.avatar : null;
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
        <View style={styles.container}>
          <Animated.View style={[styles.content, { transform: [{ translateY: translate }] }]}>
            <View style={styles.title}>
              <BaseText style={styles.textTitle}>{Lang.popupMenu.text_edit}</BaseText>
            </View>
            <View>
              <View style={styles.editView}>
                <FastImage source={avat ? { uri: avat } : Resource.images.noAvt} style={styles.avt} />
                <TextInput
                  placeholder={Lang.popupMenu.text_content}
                  style={styles.input}
                  multiline={true}
                  onChangeText={this.onChangeText}
                  onBlur={this.onHideKeyboard}
                  value={this.state.text}
                  allowFontScaling={false}
                />
              </View>

              <View style={styles.buttonView}>
                <TouchableOpacity style={styles.buttonCancel} onPress={this.onMoveTapDown}>
                  <BaseText style={styles.textButton}>{Lang.popupMenu.text_cancel.toLocaleUpperCase()}</BaseText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.buttonUpdate,
                    {
                      marginLeft: 8,
                      backgroundColor: isChangeText ? Resource.colors.greenColorApp : '#EFEFEF'
                    }
                  ]}
                  onPress={this.onPressUpdateComent(this.state.id, this.state.text)}>
                  <BaseText
                    style={{
                      ...styles.textButton,
                      color: isChangeText ? '#FFFFFF' : '#000000'
                    }}>
                    {Lang.popupMenu.text_button_update}
                  </BaseText>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    width,
    height
  },
  content: {
    width,
    height: height - (STATUS_BAR_HEIGHT + 10),
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  title: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF'
  },
  textTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000000'
  },
  editView: {
    width,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 25
  },
  avt: {
    width: 50,
    height: 50,
    borderRadius: 100
  },
  input: {
    width: '70%',
    borderRadius: 5,
    maxHeight: 110,
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    padding: 5,
    marginLeft: 20,
    textAlignVertical: 'top'
  },
  buttonView: {
    marginRight: 20,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 10
  },
  buttonCancel: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 10
  },
  buttonUpdate: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECEDF2',
    borderRadius: 5,
    paddingHorizontal: 10
  },
  textButton: {
    fontSize: 13,
    fontWeight: '600'
  }
});
