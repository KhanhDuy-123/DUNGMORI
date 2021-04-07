import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseInput from 'common/components/base/BaseInput';
import BaseText from 'common/components/base/BaseText';
import Funcs from 'common/helpers/Funcs';
import FacebookService from 'common/services/FacebookService';
import UIConst from 'consts/UIConst';
import LottieView from 'lottie-react-native';
import React, { Component } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Fetch from 'common/helpers/Fetch';
import Const from 'consts/Const';
import DropAlert from 'common/components/base/DropAlert';
import AppConst from 'consts/AppConst';

export default class ModalTakeGift extends Component {
  static instance;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      step: 1
    };
  }

  componentDidMount() {
    ModalTakeGift.instance = this;
  }

  static show = () => {
    if (ModalTakeGift.instance) {
      ModalTakeGift.instance.showModal();
    }
  };

  showModal = () => {
    this.setState({ visible: true, step: 1 });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  onPressContinue = () => {
    let visible = this.state.visible;
    let step = this.state.step + 1;
    if (step === 3 || step == 6) visible = false;
    this.setState({ step, visible }, () => {
      if (this.state.step == 3) this.onShareFacebook();
    });
  };

  onPressSubmitShare = async () => {
    const link = this.refs.InputLink?.getText();
    if (link.length < 4) {
      DropAlert.error('', Lang.modal_take_gift.link_invalid);
      return;
    }
    const res = await Fetch.post(Const.API.USER.ADD_SHARING_LOG, { link }, true);
    if (res.status === 200) {
      this.refs.InputLink?.setText('');
      this.onPressContinue();
    } else {
      DropAlert.error('', res.data.error);
    }
  };

  onPressBack = () => {
    let step = this.state.step - 1;
    if (step <= 0) {
      this.hideModal();
      return;
    }
    this.setState({ step });
  };

  onShareFacebook = async () => {
    try {
      const sharePhotoContent = {
        contentType: 'link',
        contentUrl: 'http://dungmori.com',
        commonParameters: { hashtag: AppConst.IS_ANDROID ? '#dungmori #jlpt #hoctiengnhat' : '#dungmori' }
      };
      let response = await FacebookService.share(sharePhotoContent);
      if (response) {
        this.setState({ visible: true, step: 3 });
      }
    } catch (error) {
      Funcs.log('Share facebook error', error);
    }
  };

  renderSuggestion = () => {
    return (
      <View style={styles.content}>
        <View style={{ flex: 1, backgroundColor: '#A3B6D8', alignItems: 'center', paddingTop: 20 }}>
          <BaseText style={styles.textTitle}>
            {BaseText.parse(Lang.modal_take_gift.text_coppy_link, [
              <BaseText style={{ color: 'green', fontWeight: 'bold' }} key={'1'}>
                {Lang.modal_take_gift.public}
              </BaseText>,
              <BaseText style={{ color: 'blue', fontWeight: 'bold' }} key={'2'}>
                {'#dungmori'}
              </BaseText>
            ])}
          </BaseText>
          <BaseText style={styles.textWarnning}>{Lang.modal_take_gift.text_warning}</BaseText>
          <LottieView style={styles.containerAnimation} autoPlay source={require('assets/animations/facebook_share_1.json')} />
        </View>
        {this.renderBottomButton(Lang.modal_take_gift.button_skip, Lang.modal_take_gift.button_continue, this.onPressBack, this.onPressContinue)}
      </View>
    );
  };

  renderCoppyLink = () => {
    return (
      <View style={styles.content}>
        <View style={{ flex: 1, backgroundColor: '#A3B6D8', alignItems: 'center', paddingTop: 20 }}>
          <BaseText style={styles.textTitle}>{Lang.modal_take_gift.text_paste_link}</BaseText>
          <BaseText style={styles.textWarnning}>{Lang.modal_take_gift.text_warning}</BaseText>
          <LottieView style={[styles.containerAnimation, { marginTop: 0 }]} autoPlay source={require('assets/animations/facebook_share_2.json')} />
        </View>
        {this.renderBottomButton(Lang.modal_take_gift.button_back, Lang.modal_take_gift.button_continue, this.onPressBack, this.onPressContinue)}
      </View>
    );
  };

  renderShareSuccess = () => {
    return (
      <View style={styles.content}>
        <View style={styles.successView}>
          <Feather name="check-circle" size={120} color="#379C3C" />
          <BaseText style={styles.textSuccess}>{Lang.modal_take_gift.text_share_review_success}</BaseText>
        </View>
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.buttonContinue} onPress={this.onPressContinue}>
            <BaseText style={[styles.textButton, { color: 'white' }]}>{Lang.modal_take_gift.button_continue_take_gift}</BaseText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderTakeGift = () => {
    return (
      <View style={styles.content}>
        <View style={{ flex: 1, backgroundColor: '#A3B6D8', alignItems: 'center', paddingTop: 20 }}>
          <BaseText style={styles.textTitle}>{Lang.modal_take_gift.last_step_take_gift}</BaseText>
          <BaseText style={styles.textTitle}>{Lang.modal_take_gift.last_step_take_gift2}</BaseText>
          <BaseInput
            ref={'InputLink'}
            placeholder={Lang.modal_take_gift.share_input_placeholder}
            textInputStyle={styles.textInputStyle}
            viewInputStyle={styles.viewInputStyle}
          />
          <Image style={styles.iconGift} source={Images.icShareGift} />
        </View>
        {this.renderBottomButton(Lang.modal_take_gift.button_skip, Lang.modal_take_gift.button_take_gift, this.hideModal, this.onPressSubmitShare)}
      </View>
    );
  };

  renderTakeGiftFinish = () => {
    return (
      <View style={styles.content}>
        <View style={{ flex: 1, backgroundColor: '#A3B6D8', alignItems: 'center', paddingTop: 20 }}>
          <BaseText style={[styles.textTitle, { color: 'white', fontWeight: '600', fontSize: UIConst.FONT_SIZE + 1 }]}>
            {Lang.modal_take_gift.submit_share_finish}
          </BaseText>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image style={styles.iconGift} source={Images.icShareGift} />
          </View>
        </View>
        <View style={styles.buttonArea}>
          <TouchableOpacity style={styles.buttonContinue} onPress={this.onPressContinue}>
            <BaseText style={[styles.textButton, { color: 'white' }]}>{Lang.popupMenu.text_agree}</BaseText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderBottomButton = (textBack, textNext, onPressBack, onPressNext) => {
    return (
      <View style={styles.buttonArea}>
        <TouchableOpacity style={styles.buttonSkip} onPress={onPressBack}>
          <BaseText style={styles.textButton}>{textBack}</BaseText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContinue} activeOpacity={0.7} onPress={onPressNext}>
          <BaseText style={[styles.textButton, { color: 'white' }]}>{textNext}</BaseText>
        </TouchableOpacity>
      </View>
    );
  };

  renderContent = () => {
    const { step, visible } = this.state;
    if (!visible) return null;
    if (step == 1) return this.renderSuggestion();
    else if (step == 2) return this.renderCoppyLink();
    else if (step == 3) return this.renderShareSuccess();
    else if (step == 4) return this.renderTakeGift();
    else if (step == 5) return this.renderTakeGiftFinish();
  };

  render() {
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <View style={styles.container}>{this.renderContent()}</View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: 340,
    height: 380,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden'
  },
  buttonArea: {
    width: '100%',
    height: 50,
    flexDirection: 'row'
  },
  buttonSkip: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContinue: {
    flex: 1,
    backgroundColor: '#379C3C',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textButton: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  textTitle: {
    color: '#333',
    marginHorizontal: 20,
    fontSize: 13,
    textAlign: 'center'
  },
  textWarnning: {
    fontSize: 12,
    color: '#EB5757',
    marginTop: 10
  },
  successView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textSuccess: {
    fontSize: 16,
    marginTop: 10
  },
  textInputStyle: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: UIConst.FONT_SIZE,
    color: '#333',
    textAlign: 'center'
  },
  viewInputStyle: {
    width: '90%',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 8
  },
  iconGift: {
    width: 140,
    height: 140,
    resizeMode: 'contain'
  },
  containerAnimation: {
    alignSelf: 'center',
    marginTop: 5,
    width: '85%'
  }
});
