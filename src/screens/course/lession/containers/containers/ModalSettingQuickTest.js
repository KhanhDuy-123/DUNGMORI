import React, { Component } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import ModalScreen from 'common/components/base/ModalScreen';
import BaseText from 'common/components/base/BaseText';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import Dimension from 'common/helpers/Dimension';
import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';

export default class ModalSettingQuickTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      autoPlay: true
    };
  }
  async componentDidMount() {
    let autoPlay = await StorageService.get(Const.DATA.QUICKTEST_SETTING);
    this.setState({ autoPlay: autoPlay === null ? true : autoPlay });
  }

  showModal = () => {
    this.setState({
      isVisible: true
    });
  };

  hideModal = () => {
    this.setState({
      isVisible: false
    });
  };

  onValueChangeSound = () => {
    this.setState({ autoPlay: !this.state.autoPlay });
  };

  onPressBack = async () => {
    let autoPlay = await StorageService.get(Const.DATA.QUICKTEST_SETTING);
    this.setState({
      isVisible: false,
      autoPlay: autoPlay === null ? true : autoPlay
    });
  };

  onPressSave = () => {
    StorageService.save(Const.DATA.QUICKTEST_SETTING, this.state.autoPlay);
    this.setState({
      isVisible: false
    });
  };

  render() {
    return (
      <ModalScreen isVisible={this.state.isVisible} swipeDirection={['down']} onSwipeComplete={this.hideModal} style={styles.modal}>
        <View style={styles.wrapper}>
          <BaseText style={styles.title}>{Lang.flashcard.hint_text_custom}</BaseText>
          <View style={styles.viewSwitch}>
            <BaseText style={styles.text}>{Lang.flashcard.hint_auto_sound}</BaseText>
            <Switch onValueChange={this.onValueChangeSound} value={this.state.autoPlay} trackColor={{ true: Resource.colors.greenColorApp }} />
          </View>
          <View style={styles.wrapperButton}>
            <BaseButtonOpacity text={Lang.flashcard.text_button_back} onPress={this.onPressBack} socialButtonStyle={styles.buttonLeft} />
            <BaseButtonOpacity
              text={Lang.flashcard.text_button_save}
              onPress={this.onPressSave}
              textStyle={{ color: Resource.colors.black1 }}
              socialButtonStyle={styles.buttonRight}
            />
          </View>
        </View>
      </ModalScreen>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    height: 200 * Dimension.scale,
    justifyContent: 'flex-end',
    margin: 0
  },
  wrapper: {
    height: 200 * Dimension.scale,
    backgroundColor: 'white'
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 20,
    fontWeight: '500'
  },
  viewSwitch: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15
  },
  text: {
    fontSize: 16,
    color: Resource.colors.grey800
  },
  dropStyle: {
    width: 100 * Dimension.scale,
    backgroundColor: Resource.colors.white100
  },
  pickerStyle: {
    width: (Dimension.widthParent / 3) * Dimension.scale,
    marginLeft: 120 * Dimension.scale,
    borderRadius: 10 * Dimension.scale
  },
  offsetStyle: {
    top: 15,
    right: 10,
    bottom: 20
  },
  wrapperButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginHorizontal: 40,
    marginBottom: 50
  },
  buttonLeft: {
    width: 120 * Dimension.scale,
    height: 40,
    borderWidth: 0.5,
    borderColor: Resource.colors.grey500,
    borderRadius: 20,
    marginRight: 40
  },
  buttonRight: {
    width: 120 * Dimension.scale,
    height: 40,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 20
  }
});
