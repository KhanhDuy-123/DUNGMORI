import DateTimePicker from '@react-native-community/datetimepicker';
import BaseText from 'common/components/base/BaseText';
import React, { Component } from 'react';
import { Modal, Platform, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default class ModalChooseDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.date = new Date();
  }

  changeDate = (date) => {
    this.date = date;
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  onDateChange = (event, date) => {
    this.date = date;
    if (Platform.OS == 'android' && date) {
      this.props.onShowDate(this.date);
      this.hideModal();
    }
  };

  getDate = () => {
    return this.date;
  };

  onPressOk = () => {
    this.props.onShowDate(this.date);
    this.hideModal();
  };

  render() {
    if (Platform.OS == 'ios') {
      return (
        <Modal transparent={true} visible={this.state.visible}>
          <TouchableWithoutFeedback onPress={this.hideModal}>
            <View style={styles.container}>
              <View style={{ backgroundColor: 'white', width: 300 }}>
                <DateTimePicker
                  mode="date"
                  locale="vi"
                  style={{ backgroundColor: 'white' }}
                  onChange={this.onDateChange}
                  value={new Date()}
                  maximumDate={new Date()}
                />
                <View style={styles.areaButton}>
                  <TouchableOpacity style={styles.button} onPress={this.hideModal}>
                    <BaseText>CANCEL</BaseText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={this.onPressOk}>
                    <BaseText>OK</BaseText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    } else if (this.state.visible) {
      return (
        <DateTimePicker
          mode="date"
          locale="vi"
          style={{ backgroundColor: 'white' }}
          onChange={this.onDateChange}
          value={new Date()}
          display="spinner"
          maximumDate={new Date()}
        />
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 65,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  areaButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  }
});
