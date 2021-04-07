import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseForgot from 'common/components/base/BaseForgot';
import DropAlert from 'common/components/base/DropAlert';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import LoadingModal from 'common/components/base/LoadingModal';
import Fetch from 'common/helpers/Fetch';
import NavigationService from 'common/services/NavigationService';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import ScreenNames from 'consts/ScreenName';
import { onUpdateUser } from 'states/redux/actions';
import Const from 'consts/Const';
import StorageService from 'common/services/StorageService';
import ModalActivation from './containers/ModalActivation';
import Dimension from 'common/helpers/Dimension';
const width = Dimension.widthParent;

class EnterCodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSendButtonActive: false,
      isVisible: false,
      captcha: ''
    };
  }

  componentDidMount() {
    this.getCaptcha();
  }

  getCaptcha = async () => {
    LoadingModal.show();
    let res = await Fetch.get(Const.API.ACTIVE_CODE.GET_CAPTCHA);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      this.setState({
        captcha: res.data.result.data
      });
    }
  };

  onPressActivation = async () => {
    let data = {
      voucher: this.inputCodeRef.inputRef1.getText(),
      captcha: this.inputCodeRef.inputRef2.getText()
    };
    if (data.captcha === '' && data.voucher === '') {
      DropAlert.warn('', Lang.profile.text_messenger_content_code);
      return;
    } else if (data.voucher === '') {
      DropAlert.warn('', Lang.profile.text_messenger_code);
      return;
    } else if (data.captcha === '') {
      DropAlert.warn('', Lang.profile.text_messenger_captcha);
      return;
    }

    let res = await Fetch.post(Const.API.ACTIVE_CODE.CODE_VOUCHER, data, true);
    if (res.status === Fetch.Status.SUCCESS) {
      const course = await Fetch.get(Const.API.HOME.GET_ALL_COURSE, null, true);
      if (course.status == Fetch.Status.SUCCESS) {
        this.setState({ isVisible: true });
      }
    } else if (res.status === Fetch.Status.NOT_EXITS) {
      this.inputCodeRef.inputRef1.reset(), this.inputCodeRef.inputRef2.reset();
      this.getCaptcha();
      DropAlert.warn('', res.data.message);
    }
  };
  onPressLearnNow = () => {
    this.setState({ isVisible: false });
    NavigationService.replace(ScreenNames.HomeScreen);
  };

  renderModal() {
    return <ModalActivation isVisible={this.state.isVisible} onPress={this.onPressLearnNow} />;
  }

  render() {
    return (
      <KeyboardHandle>
        <View style={{ flex: 1 }}>
          {this.renderModal()}
          <BaseForgot
            ref={ref => (this.inputCodeRef = ref)}
            confirm
            maxLength={10}
            titleHeader={Lang.profile.text_enter_activation_code}
            imageInput={styles.imageInput}
            captcha={this.state.captcha}
            contentStyle={styles.contentStyle}
            textInputStyle={styles.textInputStyle}
            viewInputStyle={styles.viewInputStyle}
            source={Resource.images.imPregnant2}
            source2={Resource.images.logoGif}
            socialButtonStyle={styles.socialButtonStyle}
            textContent={Lang.profile.text_input_code_capcha}
            textContent1={Lang.profile.hint_content_activation}
            placeholder={Lang.profile.text_activation_code}
            placeholder1={Lang.profile.text_anti_spam_code}
            textButton={Lang.profile.text_button_activation}
            onPress={this.onPressActivation}
          />
        </View>
      </KeyboardHandle>
    );
  }
}

const styles = StyleSheet.create({
  imageInput: {
    width: width * Dimension.scale,
    height: 200 * Dimension.scale,
    marginLeft: 5 * Dimension.scale
  },
  contentStyle: {
    paddingHorizontal: 30
  },
  viewInputStyle: {
    flex: 1
  },
  textInputStyle: {
    fontSize: 13 * Dimension.scale
  },
  socialButtonStyle: {
    borderRadius: 30 * Dimension.scale
  }
});
const mapDispatchToProps = { onUpdateUser };
export default connect(
  null,
  mapDispatchToProps
)(EnterCodeScreen);
