import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseForgot from 'common/components/base/BaseForgot';
import DropAlert from 'common/components/base/DropAlert';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import LoadingModal from 'common/components/base/LoadingModal';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import Const from 'consts/Const';

const width = Dimension.widthParent;

class ChangePasswordScreen extends PureComponent {
  onPressChangePassword = async () => {
    let oldPassword = this.inputPasswordRef.inputRef1.getText();
    let newPassword = this.inputPasswordRef.inputRef2.getText();
    let confirmNewPassword = this.inputPasswordRef.inputRef3.getText();
    if (!Funcs.validateChangePass(newPassword, confirmNewPassword)) return;
    let newObject = {
      password: oldPassword ? oldPassword : '',
      newPassword
    };
    LoadingModal.show();
    let res = await Fetch.post(Const.API.PROFILE.CHANGE_PASSWORD, newObject, true);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      DropAlert.success('', res.data.result);
      NavigationService.pop();
    } else if (res.status === Fetch.Status.NOT_EXITS) {
      this.inputPasswordRef.inputRef1.reset();
      this.inputPasswordRef.inputRef2.reset();
      this.inputPasswordRef.inputRef3.reset();
      DropAlert.error('', res.data.error);
    }
  };

  render() {
    return (
      <KeyboardHandle>
        <BaseForgot
          ref={(ref) => (this.inputPasswordRef = ref)}
          old
          confirm
          changePassword
          secureTextEntry={true}
          titleHeader={Lang.profile.text_header_change_password}
          imageInput={styles.imageInput}
          viewInputStyle1={styles.viewInputStyle}
          socialButtonStyle={styles.socialButtonStyle}
          contentStyle={styles.contentStyle}
          source={Resource.images.imChangePass}
          source2={Resource.images.logoChangePass}
          textContent={Lang.profile.text_sugges_change_password}
          textContent1={Lang.profile.hint_description_change_password}
          placeholder={Lang.profile.hint_placeholder_old_password}
          placeholder1={Lang.forgotPassword.hint_placeholder_password}
          placeholder2={Lang.forgotPassword.hint_placeholder_confirm_password}
          textButton={Lang.profile.text_header_change_password}
          onPress={this.onPressChangePassword}
        />
      </KeyboardHandle>
    );
  }
}

const styles = StyleSheet.create({
  imageInput: {
    width: width * Dimension.scale,
    height: 250 * Dimension.scale,
    marginLeft: 5 * Dimension.scale
  },
  contentStyle: {
    paddingHorizontal: 30
  },
  socialButtonStyle: {
    width: 200,
    borderRadius: 30 * Dimension.scale
  },
  viewInputStyle: {
    marginLeft: 5
  }
});

export default ChangePasswordScreen;
