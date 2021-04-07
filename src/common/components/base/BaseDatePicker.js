import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Time from 'common/helpers/Time';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

const width = Dimension.widthParent;

export class BaseDatePicker extends PureComponent {
  state = {
    date: '',
    isDateTimePickerVisible: false
  };

  showDateTimePicker = (title, date) => this.setState({ isDateTimePickerVisible: true, title });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  handleDatePicked = (date) => {
    let DateTime = Time.format(date);
    this.setState({ date: DateTime });
    this.hideDateTimePicker();
    if (this.props.onPicked) this.props.onPicked(date);
  };

  getValue = () => {
    return this.state.date;
  };

  setValue = (date) => {
    this.setState({ date });
  };

  render() {
    let locale = 'vi';
    const { dateTimes } = this.props;
    let maxDate = new Date();
    let dateTime = '';
    if (dateTimes !== '') {
      dateTime = this.state.date ? this.state.date : dateTimes;
    }
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity onPress={this.showDateTimePicker}>
          <BaseText style={{ ...styles.dateTimeStyle, ...this.props.dateStyle }}>{dateTime}</BaseText>
        </TouchableOpacity>
        <DateTimePicker
          confirmTextIOS={Lang.picker.text_choose_date}
          cancelTextIOS={Lang.picker.text_back}
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          locale={locale}
          maximumDate={maxDate}
          minuteInterval={this.props.minuteInterval}
          date={dateTime == null ? maxDate : moment(dateTime).toDate()}
          mode="date"
          titleIOS={this.state.title || Lang.editInfo.text_title_time}
          titleStyle={styles.textTitle}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  dateTimeStyle: {
    width: width / 2 + 50,
    fontSize: 13 * Dimension.scale,
    color: Resource.colors.black1,
    paddingHorizontal: 0,
    fontWeight: '500',
    textAlign: 'right'
  },
  textTitle: {
    fontSize: 16 * Dimension.scale,
    color: Resource.colors.black3,
    textAlign: 'center',
    fontWeight: '500'
  }
});

export default BaseDatePicker;
