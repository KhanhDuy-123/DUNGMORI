import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseForgot from 'common/components/base/BaseForgot';
import DropAlert from 'common/components/base/DropAlert';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import LoadingModal from 'common/components/base/LoadingModal';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import NavigationService from 'common/services/NavigationService';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Funcs from 'common/helpers/Funcs';

const width = Dimension.widthParent;

class CreateNewPasswordScreen extends PureComponent {
  onPressCreatePassword = async () => {
    const { firebaseToken, phoneOrEmail, type, code } = this.props.navigation.state.params;

    let password = this.inputCreatePassRef.inputRef1.getText();
    let confirmPassword = this.inputCreatePassRef.inputRef2.getText();
    if (!Funcs.validatePassword(password, confirmPassword)) {
      return;
    }
    let objectPass = {};

    if (type === 'confirmEmail') {
      objectPass = {
        email: phoneOrEmail,
        newPassword: password,
        code
      };
    } else {
      objectPass = {
        firebaseToken,
        newPassword: password
      };
    }
    LoadingModal.show();
    let res = await Fetch.post(Const.API.USER.CREATE_PASSWORD, objectPass);
    LoadingModal.hide();
    if (res.status === Fetch.Status.SUCCESS) {
      DropAlert.success('', Lang.forgotPassword.hint_create_password_success);
      NavigationService.reset(ScreenNames.ParentAuthenticateScreen);
    } else if (res.status === Fetch.Status.INTERNAL_SERVER_ERROR) {
      DropAlert.success('', Lang.forgotPassword.hint_error);
    }
  };

  render() {
    return (
      <KeyboardHandle>
        <BaseForgot
          ref={(ref) => (this.inputCreatePassRef = ref)}
          confirm
          newPassword
          secureTextEntry={true}
          imageInput={styles.imageInput}
          viewInputStyle={styles.viewInputStyle}
          textInputStyle={styles.textInputStyle}
          source={Resource.images.imPregnant2}
          source2={Resource.images.iconNewPass}
          textContent={Lang.forgotPassword.hint_content_password}
          textContent1={Lang.forgotPassword.hint_description_password}
          placeholder={Lang.forgotPassword.hint_placeholder_password}
          placeholder1={Lang.forgotPassword.hint_placeholder_confirm_password}
          textButton={Lang.forgotPassword.text_button_create_password}
          onPress={this.onPressCreatePassword}
        />
      </KeyboardHandle>
    );
  }
}

const styles = StyleSheet.create({
  imageInput: {
    width: width * Dimension.scale,
    height: 180 * Dimension.scale
  },
  viewInputStyle: {
    flex: 1,
    borderBottomWidth: 0.5,
    height: 50 * Dimension.scale,
    borderRadius: 0,
    borderBottomColor: Resource.colors.inactiveButton
  },
  textInputStyle: {
    fontSize: 12 * Dimension.scale,
    paddingTop: 10 * Dimension.scale,
    color: Resource.colors.black1
  }
});
export default CreateNewPasswordScreen;
