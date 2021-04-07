import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseDatePicker from 'common/components/base/BaseDatePicker';
import BaseText from 'common/components/base/BaseText';
import Container from 'common/components/base/Container';
import DropAlert from 'common/components/base/DropAlert';
import Header from 'common/components/base/Header';
import KeyboardHandle from 'common/components/base/KeyboardHandle';
import LoadingModal from 'common/components/base/LoadingModal';
import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import Time from 'common/helpers/Time';
import NavigationService from 'common/services/NavigationService';
import Const from 'consts/Const';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { onUpdateUser } from 'states/redux/actions';
import Utils from 'utils/Utils';
import ItemEditInfo from './containers/ItemEditInfo';
import ModalChooseInfo from './containers/ModalChooseInfo';

const width = Dimension.widthParent;
class EditInfoUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      birthDay: '',
      phone: '',
      email: '',
      level: [{ id: 0, name: 'N5' }, { id: 1, name: 'N4' }, { id: 2, name: 'N3' }, { id: 3, name: 'N2' }, { id: 4, name: 'N1' }],
      level_id: null,
      level_name: '',
      country: [{ id: 230, name: Lang.profile.text_vietnam }, { id: 107, name: Lang.profile.text_japan }, { id: 1, name: Lang.profile.text_other }],
      country_id: null,
      gender: [{ id: 0, name: Lang.profile.text_gender_male }, { id: 1, name: Lang.profile.text_gender_Famale }, { id: 2, name: Lang.profile.text_other }],
      gender_id: null,
      gender_name: '',
      country_name: '',
      address: '',
      valueSelect: '',
      heightContent: 0
    };
    this.heightContent = 0;
  }

  componentDidMount() {
    const { user } = this.props.navigation.state.params;
    if (user) {
      this.setState({
        userName: user && user.name,
        birthDay: user && user.birth ? Time.format(user.birth) : null,
        phone: user && user.phone ? user.phone : null,
        email: user && user.email ? user.email : null,
        address: user && user.address ? user.address : null
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeSelect);
  }

  onChangeUserName = (userName) => {
    this.setState({ userName });
  };

  onChangeEmail = (email) => {
    this.setState({ email });
  };

  onChangePhone = (phone) => {
    this.setState({ phone });
  };

  onChangeLevel = (value) => {
    this.setState({ level_id: value.id, level_name: value.name });
  };

  onChangeGender = (value) => {
    this.setState({ gender_id: value.id, gender_name: value.name });
  };

  onChangeCountry = (value) => {
    this.setState({ country_id: value.id });
  };

  onChangeAdress = (address) => {
    this.setState({ address });
  };

  onPressChangeInfo = async () => {
    const { user } = this.props.navigation.state.params;
    const { userName, birthDay, level_name, country_id, address, gender_name, email, phone } = this.state;
    if (userName.length === 0) {
      DropAlert.warn('', Lang.profile.text_not_empty_name);
      return;
    }
    let newInfoUser = {
      name: userName,
      email,
      phone,
      birth: this.dateTimePicker && this.dateTimePicker.getValue() ? this.dateTimePicker.getValue() : birthDay,
      gender: gender_name ? gender_name : user.gender,
      japaneseLevel: level_name ? level_name : user.japanese_level,
      country: country_id ? country_id : user.country,
      address
    };
    LoadingModal.show();
    let changeInfo = await Fetch.post(Const.API.USER.CHANGE_INFO, newInfoUser, true);
    LoadingModal.hide();
    if (changeInfo.status === Fetch.Status.SUCCESS) {
      Utils.user = changeInfo.data;
      this.props.onUpdateUser(changeInfo.data);
      DropAlert.success('', Lang.profile.text_upgrade_user_success);
      NavigationService.pop();
    } else if (changeInfo.status === Fetch.Status.NOT_EXITS) {
      DropAlert.warn('', changeInfo.data.message);
    } else if (changeInfo.status === Fetch.Status.INTERNAL_SERVER_ERROR) {
      DropAlert.warn('', Lang.profile.text_error);
    }
  };

  onBackPress = () => {
    NavigationService.pop();
  };

  onLayout = (event) => {
    this.heightContent = event.nativeEvent.layout.height;
    this.setState({
      heightContent: this.heightContent
    });
  };

  onFocus = () => {
    this.onSelectionChange();
  };

  onSelectionChange = () => {
    this.setState({
      heightContent: this.heightContent + 10
    });
    this.timeSelect = setTimeout(() => {
      this.flatListRef.scrollTo({ y: this.state.heightContent + 105 * Dimension.scale, x: 0, animated: true });
    }, 50);
  };

  render() {
    const { userName, birthDay, phone, email, address, gender, country, level } = this.state;
    const { user } = this.props.navigation.state.params;
    let nameCountry = '';
    if (user.country == 230) {
      nameCountry = Lang.profile.text_vietnam;
    } else if (user.country == 107) {
      nameCountry = Lang.profile.text_japan;
    } else if (user.country == 1) {
      nameCountry = Lang.profile.text_other;
    } else {
      nameCountry = '';
    }
    return (
      <KeyboardHandle>
        <Container>
          <Header left text={Lang.editInfo.text_header} titleStyle={styles.titleStyle} titleArea={styles.areaHeaderText} onBackPress={this.onBackPress} />
          <ScrollView
            ref={(ref) => (this.flatListRef = ref)}
            keyboardShouldPersistTaps="handled"
            onScroll={this.onScroll}
            contentContainerStyle={styles.container}>
            <ItemEditInfo
              text={Lang.editInfo.hint_user_name}
              value={userName}
              onChangeText={this.onChangeUserName}
              multiline={false}
              maxLength={30}
              textInputStyle={styles.textInputStyle}
              viewInputStyle={styles.viewInputStyle}
            />
            <View style={styles.viewBirth}>
              <BaseText style={styles.birthStyle}>{Lang.editInfo.hint_birth_day}</BaseText>
              <BaseDatePicker ref={(ref) => (this.dateTimePicker = ref)} dateTimes={birthDay} dateStyle={styles.dateStyle} />
            </View>
            <ItemEditInfo
              editable={user.phone === null ? true : false}
              text={Lang.editInfo.hint_phone_number}
              value={phone}
              onChangeText={this.onChangePhone}
              textInputStyle={styles.textInputStyle}
              keyboardType="number-pad"
              maxLength={11}
            />
            <ItemEditInfo
              editable={user.email === null ? true : false}
              text={Lang.editInfo.hint_email}
              value={email}
              onChangeText={this.onChangeEmail}
              textInputStyle={styles.textInputStyle}
              multiline={true}
              viewInputStyle={styles.viewInputStyle}
            />
            <View style={styles.viewCountry}>
              <BaseText style={styles.birthStyle}>{Lang.editInfo.hint_level}</BaseText>
              <ModalChooseInfo value={user.japanese_level} title={Lang.editInfo.text_title_level} data={level} onChangeOption={this.onChangeLevel} />
            </View>
            <View style={styles.viewCountry}>
              <BaseText style={styles.birthStyle}>{Lang.editInfo.hint_country}</BaseText>
              <ModalChooseInfo value={nameCountry} title={Lang.editInfo.text_title_country} data={country} onChangeOption={this.onChangeCountry} />
            </View>
            <View style={styles.viewCountry}>
              <BaseText style={styles.birthStyle}>{Lang.editInfo.hint_gender}</BaseText>
              <ModalChooseInfo value={user.gender} title={Lang.editInfo.text_title_gender} data={gender} onChangeOption={this.onChangeGender} />
            </View>
            <ItemEditInfo
              text={Lang.editInfo.hint_address}
              value={address}
              onChangeText={this.onChangeAdress}
              textInputStyle={styles.textInputStyle}
              viewInputStyle={styles.viewInputStyle}
              multiline={false}
              onFocus={this.onFocus}
              onLayout={this.onLayout}
              onSelectionChange={this.onSelectionChange}
            />
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={this.onPressChangeInfo} style={styles.viewButton}>
                <BaseText style={styles.textStyle}>{Lang.editInfo.text_button_save}</BaseText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Container>
      </KeyboardHandle>
    );
  }
}
const styles = StyleSheet.create({
  titleStyle: {
    color: Resource.colors.black1
  },
  areaHeaderText: {
    alignItems: 'flex-start'
  },
  container: {
    marginTop: 10,
    paddingBottom: 50
  },
  socialButtonStyle: {
    width: (width * Dimension.scale) / 3,
    backgroundColor: Resource.colors.colorButton,
    height: 40,
    marginVertical: 50
  },
  viewBirth: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: Resource.colors.inactiveButton,
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  viewCountry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: Resource.colors.inactiveButton,
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  birthStyle: {
    fontSize: 13 * Dimension.scale,
    color: Resource.colors.black3
  },
  viewInputStyle: {
    maxHeight: 80 * Dimension.scale
  },
  textInputStyle: {
    color: Resource.colors.black1
  },
  dropStyle: {
    width: 85 * Dimension.scale,
    backgroundColor: Resource.colors.white100
  },
  dropStyle1: {
    width: 50 * Dimension.scale,
    backgroundColor: Resource.colors.white100
  },
  dropGenderStyle: {
    width: 60 * Dimension.scale,
    backgroundColor: Resource.colors.white100
  },
  dateStyle: {
    width: (width / 2) * Dimension.scale
  },
  pickerStyle: {
    width: (width / 3) * Dimension.scale,
    marginLeft: 120 * Dimension.scale,
    borderRadius: 10 * Dimension.scale
  },
  pickerStyle1: {
    width: 50 * Dimension.scale,
    marginLeft: 230 * Dimension.scale,
    marginTop: 50 * Dimension.scale,
    borderRadius: 10 * Dimension.scale
  },
  offsetStyle: {
    top: 15,
    right: 10,
    bottom: 20
  },
  viewButton: {
    marginTop: 30,
    height: 40 * Dimension.scale,
    width: (width / 2.5) * Dimension.scale,
    borderRadius: 20 * Dimension.scale,
    backgroundColor: Resource.colors.greenColorApp,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 14 * Dimension.scale,
    color: Resource.colors.white100,
    fontWeight: '500'
  }
});

const mapDispatchToProps = { onUpdateUser };
export default connect(
  null,
  mapDispatchToProps
)(EditInfoUserScreen);
