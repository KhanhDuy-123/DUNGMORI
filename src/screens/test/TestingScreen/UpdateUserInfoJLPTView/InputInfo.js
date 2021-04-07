import Colors from 'assets/Colors';
import BaseInput from 'common/components/base/BaseInput';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ModalChooseInfo from 'screens/profile/myProfile/containers/ModalChooseInfo';
import BaseDatePicker from 'common/components/base/BaseDatePicker';
import BaseButton from 'common/components/base/BaseButton';
import Funcs from 'common/helpers/Funcs';

const defaultCountry = { name: '', icon: Funcs.countries['VN'].flag, code: '84' };

export default class InputInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getText = () => {
    let text = this.inputRef.getText();
    if (this.props.isPhone) {
      let { country } = this.state;
      if (!country) country = defaultCountry;
      while (text.indexOf('0') === 0 && (country.code === '84' || country.code === '81')) {
        text = text.substr(1);
      }
      return '+' + country.code + text;
    }
    return text;
  };

  setText = (val) => {
    if (this.props.isPhone && val.indexOf('+') === 0) {
      val = val.replace('+84', '');
      val = val.replace('+81', '');
    }
    return this.inputRef.setText(val);
  };

  getDate = () => {
    return this.dateTimePicker.getValue();
  };

  setOptionValue = (val) => {
    return this.refs.ModalChooseInfo?.setValue(val);
  };

  onPressShowCountry = () => {
    let data = Funcs.getAllCountries();
    data = data.map((e) => ({ name: e.name.common, icon: e.flag, code: e.callingCode }));
    this.refs.ModalChooseInfo.showModal(data);
  };

  onChangeCountry = (country) => {
    this.setState({
      country
    });
  };

  renderPhonePrefixOption = () => {
    let { country } = this.state;
    if (!country) country = defaultCountry;
    return (
      <>
        <BaseButton style={styles.containerPhoneOption} onPress={this.onPressShowCountry}>
          <Image resizeMode="contain" source={{ uri: country.icon }} style={{ width: 20, height: 20 }} />
          <BaseText style={{ paddingHorizontal: 5 }}>{'+' + country.code}</BaseText>
          <AntDesign name={'caretdown'} size={10} color={'#111'} />
        </BaseButton>
        <ModalChooseInfo ref={'ModalChooseInfo'} titleStyle={styles.titleDropdown} onChangeOption={this.onChangeCountry} noView />
      </>
    );
  };

  render() {
    const { title, data, wrapperInput, input, dropdown, onChangeOption, titleModal, date, birthDay, isPhone } = this.props;
    return (
      <View style={{ ...styles.wrapperInput, ...wrapperInput }}>
        <BaseText style={styles.title}>{title}</BaseText>
        <View style={styles.border} />
        {input ? (
          <View style={styles.containerInput}>
            {isPhone && this.renderPhonePrefixOption()}
            <BaseInput ref={(ref) => (this.inputRef = ref)} viewInputStyle={styles.viewInput} textInputStyle={styles.textInputStyle} />
          </View>
        ) : null}
        {date ? <BaseDatePicker ref={(ref) => (this.dateTimePicker = ref)} dateTimes={birthDay} dateStyle={styles.dateStyle} /> : null}
        {dropdown ? (
          <View style={styles.dropStyle}>
            {dropdown && <AntDesign name={'caretdown'} size={12} color={'#111'} style={styles.caret} />}
            <ModalChooseInfo ref={'ModalChooseInfo'} title={titleModal} data={data} onChangeOption={onChangeOption} titleStyle={styles.titleDropdown} />
          </View>
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperInput: {
    width: 300 * Dimension.scaleWidth,
    height: 30 * Dimension.scale,
    borderWidth: 1,
    borderColor: Colors.black5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  title: {
    width: 100 * Dimension.scaleWidth,
    paddingLeft: 10 * Dimension.scale,
    color: Colors.black3
  },
  border: {
    width: 1,
    height: 30 * Dimension.scale,
    backgroundColor: Colors.black5
  },
  containerInput: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  viewInput: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 0
  },
  textInputStyle: {
    width: '100%',
    color: Colors.black1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontWeight: '500'
  },
  dateStyle: {
    width: 199 * Dimension.scaleWidth,
    height: '100%',
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 10,
    fontSize: 14 * Dimension.scale,
    paddingVertical: 7,
    textAlign: 'left'
  },
  dropStyle: {
    flex: 1,
    height: 30 * Dimension.scale,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center'
  },
  caret: {
    position: 'absolute',
    right: 10
  },
  titleDropdown: {
    width: 199 * Dimension.scaleWidth,
    textAlign: 'left',
    paddingHorizontal: 10
  },
  containerPhoneOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5
  }
});
