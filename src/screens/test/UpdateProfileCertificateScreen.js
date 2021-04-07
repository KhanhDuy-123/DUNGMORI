import Colors from 'assets/Colors';
import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseInput from 'common/components/base/BaseInput';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import DropAlert from 'common/components/base/DropAlert';
import Header from 'common/components/base/Header';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import LoadingModal from 'common/components/base/LoadingModal';
import ModalWebView from 'common/components/base/ModalWebView';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Time from 'common/helpers/Time';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { onUpdateUser } from 'states/redux/actions';
import Utils from 'utils/Utils';
import ModalChooseDate from './components/ModalChooseDate';
import ModalMenuCountry from './components/ModalMenuCountry';
import ModalMenuProvince from './components/ModalMenuProvince';

const refName = 'name';
const refPhone = 'phone';
const refNote = 'note';
class UpdateProfileCertificateScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      province: null,
      date: ''
    };
    this.params = {};
    this.dataParent = [];
    this.districtId = null;
    this.wardId = null;
    this.InputName = 'name';
  }

  componentDidMount() {
    const params = this.props.navigation.state.params;
    const { user } = this.props;
    if (params?.certificate_info || user) {
      let certificate_info = params?.certificate_info;
      this.refs.name.onChangeText(certificate_info?.fullname || user.name);
      this.refs.phone.onChangeText(certificate_info?.mobile || user.phone);
      this.refs.note.onChangeText(certificate_info?.note);
      this.InputPostalCode.onChangeText(certificate_info?.postalcode);
      this.InputAddress.onChangeText(certificate_info?.address || user?.address);
      this.ModalChooseDate.changeDate(certificate_info?.dob);
      this.setState({
        date: user?.birth ? Time.format(user.birth, 'DD/MM/YYYY') : Time.format(certificate_info?.dob, 'DD/MM/YYYY'),
        countryCode: certificate_info?.country || 'vi'
      });
    }
  }

  onBackPress = () => {
    NavigationService.pop();
  };

  onBlur = () => {
    Keyboard.dismiss();
  };

  onPressShowDateTime = () => {
    this.ModalChooseDate.showModal();
  };

  onPressSend = async () => {
    Keyboard.dismiss();
    const { user } = this.props;
    const { countryCode, province, date } = this.state;
    let name = this.refs.name.getText();
    let dates = date ? date : this.ModalChooseDate.getDate();
    let phone = this.refs.phone.getText();
    let address = this.InputAddress.getText();
    let postalCode = this.InputPostalCode.getText();
    if (!name || name.length == 0) {
      return DropAlert.info('', `${Lang.try_do_test.not_enter_name}`);
    } else if (!date) {
      return DropAlert.info('', `${Lang.try_do_test.not_enter_date}`);
    } else if (!phone || phone.length == 0) {
      return DropAlert.info('', `${Lang.try_do_test.not_enter_phone}`);
    } else if (!countryCode) {
      return DropAlert.info('', `${Lang.try_do_test.not_choose} ${Lang.try_do_test.country}`);
    } else if (!postalCode || postalCode.length == 0) {
      return DropAlert.info('', `${Lang.try_do_test.not_enter_postal_code}`);
    } else if (!address || address.length == 0) {
      return DropAlert.info('', `${Lang.try_do_test.not_enter_address}`);
    } else {
      const results = NavigationService.getParams('data');
      if (results?.kaiwaCertificate == 'kaiwaCertificate') {
        let value = {
          name: name ? name : user.name,
          birth: dates ? dates : user.birth,
          phone: phone ? phone : user.phone,
          postalcode: postalCode,
          address: address ? address : user.address,
          countryCode,
          note: this.refs.note.getText(),
          date: new Date()
        };
        LoadingModal.show();
        let changeInfo = await Fetch.post(Const.API.USER.CHANGE_INFO, { certificateReceiveInfo: JSON.stringify(value) }, true);
        LoadingModal.hide();
        if (changeInfo.status === Fetch.Status.SUCCESS) {
          Utils.user = changeInfo.data;
          this.props.onUpdateUser(changeInfo.data);
          DropAlert.success('', Lang.profile.text_upgrade_user_success);
          NavigationService.navigate(ScreenNames.KaiwaCertidicateScreen);
        } else if (changeInfo.status === Fetch.Status.INTERNAL_SERVER_ERROR) {
          DropAlert.warn('', Lang.profile.text_error);
        }
        return;
      }

      const params = {
        fullname: name,
        dob: dates,
        mobile: phone,
        province,
        countryCode,
        address,
        email: user?.email,
        note: this.refs.note.getText(),
        result: results?.data || results,
        level: results.courseName,
        postalcode: postalCode
      };
      NavigationService.navigate(ScreenNames.ConfirmInfoScreen, params);
    }
  };

  convertCountryCodeToName = (countryCode) => {
    if (countryCode === 'jp') return Lang.try_do_test.text_jp;
    if (countryCode === 'vi') return Lang.try_do_test.text_vn;
    return Lang.try_do_test.text_other;
  };

  onShowDate = (date) => {
    this.setState({ date: Time.format(date, 'DD/MM/YYYY') });
  };

  onPressShowContent = () => {
    let data = {};
    let title = '';
    data.title = title;
    this.ButtonContry.measure((x, y, w, h, px, py) => {
      data.style = {
        height: 120,
        top: py + 45,
        width: w,
        left: px
      };
      this.ModalMenuCountry.showModal(data);
    });
  };

  onPressItemCountry = (country) => {
    this.setState({ countryCode: country.code });
  };

  onPressProvince = () => {
    this.ModalMenuProvince.showModal();
  };

  onPressProvinceItem = (province) => {
    this.setState({ province });
  };

  onPressShowPostalCode = () => {
    let url = 'https://buucuc.com/ma-buu-dien-zip-postal-code-viet-nam';
    if (this.state.countryCode == 'jp') url = 'https://japan-postcode.810popo.net/';
    this.ModalWebView.showModal(url);
  };

  renderTextInPut = (title, placeholder, viewId, props = {}, style) => {
    let viewInputStyle = styles.viewInputStyle;
    let textInputStyle = styles.textInputStyle;
    if (style) {
      viewInputStyle = { ...styles.viewInputStyle, ...style.viewInputStyle };
      textInputStyle = { ...styles.textInputStyle, ...style.textInputStyle };
    }
    return (
      <View style={styles.areaInput}>
        <BaseText style={{ marginLeft: 3, paddingLeft: 15 }}>
          <BaseText style={styles.titleStyle}>{title}</BaseText>
          {!props.multiline && <BaseText style={{ color: 'red' }}>*</BaseText>}
        </BaseText>
        <BaseInput
          viewInputStyle={viewInputStyle}
          textInputStyle={textInputStyle}
          placeholder={placeholder}
          ref={viewId}
          onBlur={this.onBlur}
          keyboardType={props.keyboardType}
          multiline={props.multiline}
          scrollEnabled={false}
        />
      </View>
    );
  };

  renderSubmitButton = () => {
    return (
      <View style={styles.areaButton}>
        <TouchableOpacity style={styles.button} onPress={this.onPressSend}>
          <BaseText style={styles.textButtonSend}>{Lang.try_do_test.send}</BaseText>
        </TouchableOpacity>
      </View>
    );
  };

  renderEnterAddress = () => {
    let { countryCode, province } = this.state;
    return (
      <View>
        <View style={styles.areaInput}>
          <BaseText style={{ marginLeft: 3, paddingLeft: 15 }}>
            <BaseText style={styles.titleStyle}>{`${Lang.try_do_test.country}`}</BaseText>
            <BaseText style={{ color: 'red' }}>*</BaseText>
          </BaseText>
          <TouchableOpacity onPress={this.onPressShowContent} ref={(refs) => (this.ButtonContry = refs)}>
            <View style={{ justifyContent: 'center' }}>
              <View style={[styles.customInput, styles.viewInputStyle]}>
                <BaseText style={{ color: countryCode ? 'black' : '#CFCFCF', paddingLeft: 10 }}>{this.convertCountryCodeToName(countryCode)}</BaseText>
              </View>
              <FastImage source={Resource.images.icDropDown} style={styles.iconDropDown} />
            </View>
          </TouchableOpacity>
          <BaseText style={{ marginLeft: 3, paddingLeft: 15, marginTop: 10 }}>
            <BaseText style={styles.titleStyle}>{`${Lang.try_do_test.province}`}</BaseText>
            <BaseText style={{ color: 'red' }}>*</BaseText>
          </BaseText>
          <View style={styles.viewWrapperCountry}>
            <TouchableOpacity
              style={{ width: '45%' }}
              onPress={this.onPressProvince}
              ref={(refs) => (this.ButtonProvinces = refs)}
              disabled={countryCode !== 'vi'}>
              <View style={{ opacity: countryCode !== 'vi' ? 0.5 : 1, justifyContent: 'center' }}>
                <View style={[styles.customInput, styles.viewInputStyle]}>
                  <BaseText style={{ paddingLeft: 10 }}>{province?.name || Lang.try_do_test.province}</BaseText>
                </View>
                <FastImage source={Resource.images.icDropDown} style={styles.iconDropDown} />
              </View>
            </TouchableOpacity>
            <BaseInput
              viewInputStyle={[styles.viewInputStyle, { width: '50%' }]}
              textInputStyle={styles.textInputStyle}
              placeholder={Lang.try_do_test.post_code}
              ref={(refs) => (this.InputPostalCode = refs)}
              onBlur={this.onBlur}
              keyboardType="number-pad"
              maxLength={8}
            />
          </View>
        </View>
        <View style={styles.areaInput}>
          <View style={styles.areaButtonPostcode}>
            <View style={styles.viewWrapperTextPostcode}>
              <BaseText style={styles.textSuggest}>{Lang.try_do_test.text_suggest_postcode}</BaseText>
            </View>
            <TouchableOpacity style={styles.buttonViewPostal} onPress={this.onPressShowPostalCode}>
              <BaseText style={styles.textPostal}>{Lang.try_do_test.text_view_postal_code}</BaseText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.areaInput}>
          <BaseInput
            viewInputStyle={styles.viewInputStyle}
            textInputStyle={styles.textInputStyle}
            placeholder={Lang.try_do_test.house_number}
            ref={(refs) => (this.InputAddress = refs)}
            onBlur={this.onBlur}
          />
        </View>
      </View>
    );
  };

  renderButtonChooseDate = () => {
    const { date } = this.state;
    return (
      <TouchableOpacity style={styles.areaInput} onPress={this.onPressShowDateTime}>
        <BaseText style={{ marginLeft: 3, paddingLeft: 15 }}>
          <BaseText style={styles.titleStyle}>{Lang.try_do_test.date}</BaseText>
          <BaseText style={{ color: 'red' }}>*</BaseText>
        </BaseText>
        <View style={{ justifyContent: 'center' }}>
          <View style={[styles.customInput, styles.viewInputStyle]}>
            <BaseText style={{ color: date ? 'black' : '#CFCFCF', paddingLeft: 10 }}>{date ? date : Lang.profile.text_day_month_year}</BaseText>
          </View>
          <FastImage source={Resource.images.IcCalendar} style={styles.iconCalendar} />
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const styleMultiLine = { viewInputStyle: styles.viewMultiline, textInputStyle: styles.textMultiLine };
    return (
      <Container>
        <Header
          left
          text={Lang.try_do_test.info_degree}
          onBackPress={this.onBackPress}
          titleArea={styles.titleArea}
          titleStyle={styles.texTitle}
          headerStyle={{ backgroundColor: 'white' }}
        />
        <KeyboardHandle>
          <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
              <View style={{ flex: 1 }}>
                <View style={styles.viewRequireInfo}>
                  <BaseText style={styles.textRequire}>{Lang.try_do_test.text_require_info1}</BaseText>
                  <BaseText style={styles.textRequire}>{Lang.try_do_test.text_require_info2}</BaseText>
                </View>
                {this.renderTextInPut(Lang.try_do_test.name, Lang.try_do_test.name, refName)}
                {this.renderButtonChooseDate()}
                {this.renderTextInPut(Lang.try_do_test.phone, Lang.try_do_test.phone, refPhone, { keyboardType: 'phone-pad' })}
                {this.renderEnterAddress()}
                {this.renderTextInPut(Lang.try_do_test.note, '', refNote, { multiline: true }, styleMultiLine)}
              </View>
            </ScrollView>
            {this.renderSubmitButton()}
          </View>
        </KeyboardHandle>
        <ModalMenuCountry ref={(refs) => (this.ModalMenuCountry = refs)} onPressItem={this.onPressItemCountry} />
        <ModalMenuProvince ref={(refs) => (this.ModalMenuProvince = refs)} onPress={this.onPressProvince} onPressItem={this.onPressProvinceItem} />
        <ModalChooseDate ref={(refs) => (this.ModalChooseDate = refs)} onShowDate={this.onShowDate} />
        <ModalWebView ref={(refs) => (this.ModalWebView = refs)} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white100
  },
  titleArea: {
    marginLeft: 20,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  texTitle: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: '500'
  },
  titleStyle: {
    color: '#4F4F4F',
    fontSize: 11 * Dimension.scale,
    fontWeight: '500'
  },
  viewInputStyle: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C6C6C6',
    marginTop: 5,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    height: 35 * Dimension.scale
  },
  textInputStyle: {
    color: '#000000',
    paddingHorizontal: 15,
    fontSize: 14
  },
  areaInput: {
    width: '100%',
    paddingHorizontal: 15,
    marginTop: 10
  },
  areaButton: {
    alignItems: 'center'
  },
  button: {
    width: '80%',
    height: 35,
    position: 'absolute',
    bottom: 10,
    backgroundColor: Resource.colors.greenColorApp,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonCancel: {
    backgroundColor: 'white',
    marginTop: 10,
    borderWidth: 0.5
  },
  customInput: {
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingLeft: 5
  },
  iconDropDown: {
    width: 14,
    height: 7,
    position: 'absolute',
    right: 10,
    bottom: 15
  },
  iconCalendar: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 10
  },
  textRequire: {
    textAlign: 'center',
    fontSize: 12
  },
  viewRequireInfo: {
    marginTop: 20,
    marginBottom: 10
  },
  buttonViewPostal: {
    height: 35,
    borderRadius: 10,
    backgroundColor: '#FF9A00',
    width: 130,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textPostal: {
    color: 'white',
    fontSize: 11 * Dimension.scale,
    fontWeight: '500'
  },
  areaButtonPostcode: {
    height: 35,
    flexDirection: 'row'
  },
  viewWrapperTextPostcode: {
    width: '60%',
    marginRight: 10,
    justifyContent: 'center'
  },
  textSuggest: {
    fontSize: 13
  },
  viewWrapperCountry: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  textButtonSend: {
    color: 'white',
    fontWeight: '600'
  },
  viewMultiline: {
    height: 120,
    justifyContent: 'flex-start'
  },
  textMultiLine: {
    flex: 1
  }
});

const mapStateToProps = (state) => ({
  user: state.userReducer.user
});

const mapDispatchToProps = { onUpdateUser };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateProfileCertificateScreen);
