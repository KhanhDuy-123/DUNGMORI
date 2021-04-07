import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Keyboard, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Dimension from 'common/helpers/Dimension';

export default class ModalViewResult extends Component {
  static defaultProps = {
    buttonLeft: Lang.calendarKaiwa.text_button_back,
    buttonRight: Lang.calendarKaiwa.text_button_confirm
  };
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      IDSkype: props.user ? props.user : ''
    };
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  onChangeSkype = (IDSkype) => {
    this.setState({ IDSkype });
  };

  onPressIgnore = () => {
    this.setState({ visible: false });
  };

  onPressShowResult = () => {
    this.setState({ visible: false });
    this.props.onShowResult();
  };
  backShowModal = () => {
    this.setState({ visible: true });
  };
  onPressTutorial = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate(ScreenNames.GetIdSkypeTutoriol, { backShowModal: this.backShowModal });
  };

  onPressKeyboardDismis = () => {
    Keyboard.dismiss();
  };

  render() {
    const { visible } = this.state;
    return (
      <Modal transparent={true} visible={visible} onRequestClose={() => {}}>
        <TouchableOpacity style={styles.container} onPress={this.onPressKeyboardDismis} activeOpacity={1}>
          <View style={[styles.content, this.props.contentStyle]}>
            {this.props.showSkype || this.props.showAttention ? null : (
              <View style={[styles.areaText, this.props.areaText]}>
                <View style={styles.wrapper}>
                  <BaseText style={{ ...styles.textTitle, ...this.props.textTitle }}>{this.props.title}</BaseText>
                </View>
                <BaseText style={{ ...styles.textContent, ...this.props.textContent }}>{this.props.content}</BaseText>
              </View>
            )}
            {this.props.showSkype ? (
              <View style={[styles.wrapperSkype, { paddingHorizontal: 5 }]}>
                <FastImage source={Resource.images.icSkype} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={Lang.chooseLession.text_placeholder_skype}
                    value={this.state.IDSkype}
                    onChangeText={this.onChangeSkype}
                    allowFontScaling={false}
                  />
                </View>
                <TouchableOpacity onPress={this.onPressTutorial}>
                  <BaseText style={styles.textStyle}>{Lang.calendarKaiwa.text_get_ID_skype_tutoriol}</BaseText>
                </TouchableOpacity>
              </View>
            ) : null}
            {this.props.showAttention ? (
              <View style={styles.wrapperSkype}>
                <BaseText style={{ ...styles.title1Style, ...this.props.title1Style }}>{this.props.title1}</BaseText>
                <FastImage source={this.props.source} style={styles.icon} resizeMode={FastImage.resizeMode.contain} />
                <BaseText style={{ ...styles.textContent, ...this.props.textContent }}>{this.props.content1}</BaseText>
              </View>
            ) : null}
            <View style={styles.areaButton}>
              {this.props.showResult ? null : (
                <TouchableOpacity style={styles.buttonIgnore} onPress={this.onPressIgnore}>
                  <BaseText style={styles.textButtonIgnore}>{this.props.buttonLeft}</BaseText>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={{ ...styles.buttonView, ...this.props.buttonView }} onPress={this.onPressShowResult}>
                <BaseText style={styles.textButtonView}>{this.props.buttonRight}</BaseText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: 290 * Dimension.scale,
    height: 230 * Dimension.scale,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center'
  },
  areaButton: {
    width: 220 * Dimension.scale,
    height: 70 * Dimension.scale,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonIgnore: {
    width: 100 * Dimension.scale,
    height: 30 * Dimension.scale,
    borderRadius: 15 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C6C6C6'
  },
  textButtonIgnore: {
    fontSize: 14,
    color: '#7B7B7B',
    fontWeight: '500'
  },
  buttonView: {
    width: 100 * Dimension.scale,
    height: 30 * Dimension.scale,
    borderRadius: 15 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Resource.colors.greenColorApp
  },
  textButtonView: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500'
  },
  areaText: {
    width: 280 * Dimension.scale,
    height: 160 * Dimension.scale,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  textTitle: {
    fontSize: 14 * Dimension.scale
  },
  textContent: {
    fontSize: 14 * Dimension.scale,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    textAlign: 'center'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    backgroundColor: Resource.colors.greenColorApp,
    marginRight: 5
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  skype: {
    fontSize: 14 * Dimension.scale
  },
  wrapperSkype: {
    flex: 1,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewInput: {
    width: 250 * Dimension.scale,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  icon: {
    width: 80,
    height: 80,
    marginVertical: 20
  },
  textInput: {
    width: 170 * Dimension.scale,
    marginLeft: 5,
    padding: 5,
    fontSize: 16
  },
  textID: {
    fontStyle: 'italic',
    fontSize: 15,
    color: Resource.colors.greenColorApp,
    paddingHorizontal: 10,
    paddingTop: 10
  },
  textStyle: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Resource.colors.greenColorApp,
    paddingVertical: 10
  },
  title1Style: {
    fontSize: 15 * Dimension.scale,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    textAlign: 'center'
  }
});
