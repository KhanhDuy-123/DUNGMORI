import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import DropAlert from 'common/components/base/DropAlert';
import Header from 'common/components/base/Header';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import NavigationService from 'common/services/NavigationService';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Utils from 'utils/Utils';
import CertificateJLPTView from './CertificateJLPTView';
import InputInfo from './InputInfo';

export default class UpdateUserInfoJLPTView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showResult: false,
      date: null
    };
  }

  componentDidMount() {
    this.updateShowExistData(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.result !== this.props.result) {
      this.updateShowExistData(nextProps);
    }
    return this.state !== nextState;
  }

  updateShowExistData = (props) => {
    const { InputName, InputEmail, InputPhone, OptionAddress, OptionLevel, OptionCareer } = this.refs;
    const { result } = props || {};
    let certificateInfo = Funcs.jsonParse(result?.certificate_info);
    if (!certificateInfo?.fullname) return;
    this.address = Utils.listTestingAddress.find((e) => e.id == certificateInfo.address);
    this.level = Utils.listTestingLevel.find((e) => e.id == certificateInfo.level);
    this.career = Utils.listCareer.find((e) => e.id == certificateInfo.career);

    // Disable edit info
    if (props.isFinishTesting && certificateInfo?.career && certificateInfo?.level && certificateInfo?.address) {
      const userData = certificateInfo;
      this.setState({
        showResult: true,
        userData
      });
    } else {
      InputName.setText(certificateInfo.fullname);
      this.setState({ date: certificateInfo.dob });
      InputEmail.setText(certificateInfo.email);
      InputPhone.setText(certificateInfo.mobile);
      InputPhone.setText(certificateInfo.mobile);
      OptionAddress.setOptionValue(this.address?.name);
      OptionLevel.setOptionValue(this.level?.name);
      OptionCareer.setOptionValue(this.career?.name);
    }
  };

  onPressContinue = async () => {
    const { InputName, InputDate, InputEmail, InputPhone } = this.refs;
    const { career, level, address } = this;
    const fullname = InputName.getText();
    const dob = InputDate.getDate() ? InputDate.getDate() : this.state.date;
    const email = InputEmail.getText();
    const mobile = InputPhone.getText();
    if (!Funcs.validateUserName(fullname)) return;
    if (!dob) return DropAlert.warn('', `${Lang.try_do_test.not_enter_date}`);
    if (!Funcs.validateEmail(email)) return;
    if (!Funcs.validatePhone(mobile)) return;
    if (!address || !address.name) return DropAlert.warn('', `${Lang.try_do_test.not_enter_address}`);
    if (!level || !level.name) return DropAlert.warn('', `${Lang.try_do_test.not_enter_level}`);
    if (!career || !career.name) return DropAlert.warn('', `${Lang.try_do_test.not_enter_career}`);

    // Show confirm
    const userData = { career: career.id, level: level.id, address: address.id, fullname, dob, email, mobile };
    this.setState({
      showResult: true,
      userData
    });
  };

  onBackPress = () => {
    const { showResult } = this.state;
    if (showResult && !this.props.isFinishTesting) {
      this.setState(
        {
          showResult: false
        },
        this.updateShowExistData
      );
      return;
    }
    NavigationService.back();
  };

  onChangeAddress = (item) => {
    this.address = item;
  };
  onChangeLevel = (item) => {
    this.level = item;
  };
  onChangeCareer = (item) => {
    this.career = item;
  };

  renderInputContent = () => {
    const { showResult, date } = this.state;
    if (showResult) return null;
    return (
      <KeyboardHandle>
        <ScrollView>
          <View style={styles.container}>
            <FastImage source={Images.icBackgroundCerti} style={styles.background} resizeMode={FastImage.resizeMode.cover} />
            <FastImage source={Images.icHoaLeft} tintColor={Colors.greenColorApp} style={styles.iconStyle} resizeMode={FastImage.resizeMode.contain} />
            <FastImage
              source={Images.icCay}
              tintColor={Colors.greenColorApp}
              style={{ ...styles.iconStyle, left: Dimension.widthParent / 2 - 25 * Dimension.scaleWidth }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <FastImage
              source={Images.icHoaRight}
              tintColor={Colors.greenColorApp}
              style={{ ...styles.iconStyle, left: null, right: 0 }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <View style={styles.wrapper}>
              <BaseText style={styles.titleStyle}>MORI 日本語テスト</BaseText>
              <BaseText>{Lang.try_do_test.complete_infomation}</BaseText>
              <InputInfo ref={'InputName'} input title={Lang.try_do_test.name} wrapperInput={styles.wrapperInput} />
              <InputInfo ref={'InputDate'} birthDay={date} date title={Lang.try_do_test.date} />
              <InputInfo ref={'InputEmail'} input title={Lang.try_do_test.email} />
              <InputInfo ref={'InputPhone'} input title={Lang.try_do_test.phone} isPhone />
              <InputInfo
                ref={'OptionAddress'}
                dropdown
                title={Lang.try_do_test.address}
                titleModal={Lang.try_do_test.address}
                data={Utils.listTestingAddress}
                onChangeOption={this.onChangeAddress}
              />
              <InputInfo
                ref={'OptionLevel'}
                dropdown
                title={Lang.try_do_test.my_level}
                titleModal={Lang.try_do_test.my_level}
                data={Utils.listTestingLevel}
                onChangeOption={this.onChangeLevel}
              />
              <InputInfo
                ref={'OptionCareer'}
                dropdown
                title={Lang.try_do_test.career}
                titleModal={Lang.try_do_test.career}
                data={Utils.listCareer}
                onChangeOption={this.onChangeCareer}
              />

              <View style={styles.viewButton}>
                <BaseButtonOpacity
                  onPress={this.onPressContinue}
                  text={Lang.try_do_test.continue}
                  socialButtonStyle={styles.socialButtonStyle}
                  textStyle={{ color: 'white', fontWeight: '500' }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardHandle>
    );
  };

  render() {
    const { showResult, userData } = this.state;
    return (
      <Container>
        <Header left onBackPress={this.onBackPress} text={Lang.try_do_test.complete_test} headerStyle={styles.headerStyle} />
        {this.renderInputContent()}
        {showResult && userData && <CertificateJLPTView userData={userData} result={this.props.result} editable={this.props.editable} />}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimension.heightParent - 70 * Dimension.scaleHeight,
    backgroundColor: Colors.white100
  },
  background: {
    width: Dimension.widthParent,
    height: Dimension.heightParent,
    opacity: 0.1,
    position: 'absolute',
    top: 0
  },
  iconStyle: {
    width: 50 * Dimension.scaleWidth,
    height: 50 * Dimension.scaleWidth,
    position: 'absolute',
    top: 7 * Dimension.scaleHeight,
    left: 0
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30 * Dimension.scaleHeight
  },
  titleStyle: {
    fontSize: 17 * Dimension.scale,
    fontWeight: '600',
    paddingTop: 40 * Dimension.scale,
    paddingBottom: 5
  },
  wrapperInput: {
    marginTop: 20 * Dimension.scaleWidth
  },
  viewButton: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 15 * Dimension.scaleHeight
  },
  socialButtonStyle: {
    backgroundColor: Colors.greenColorApp,
    width: 300 * Dimension.scaleWidth,
    height: 37 * Dimension.scale,
    borderRadius: 10
  }
});
