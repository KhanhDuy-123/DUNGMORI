import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import moment from 'moment';
import React, { Component } from 'react';
import { StyleSheet, View, AppState } from 'react-native';
import Dimension from 'common/helpers/Dimension';
const TIME_COWNTDOWN = 1 * 60 * 60;
class CountDownBookingKaiwa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hour: null,
      minutes: null,
      second: null
    };
  }
  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange);
    this.updateTime(this.props?.dataBookingRemain?.lastCancel);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps?.dataBookingRemain?.lastCancel !== this?.props?.dataBookingRemain?.lastCancel) {
      this.updateTime(nextProps?.dataBookingRemain?.lastCancel);
    }
    return true;
  }
  componentWillUnmount() {
    clearInterval(this.time);
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = (state) => {
    if (state == 'active') {
      this.updateTime(this?.props?.dataBookingRemain?.lastCancel);
    }
  };

  updateTime = (lastCancel) => {
    if (lastCancel) {
      let timeNow = moment().valueOf();
      let timeLastCancel = moment(lastCancel).valueOf();
      let lastTime = timeNow - timeLastCancel < 0 ? 0 : timeNow - timeLastCancel;
      let timeStamp = TIME_COWNTDOWN - lastTime / 1000;
      clearInterval(this.time);
      this.time = setInterval(() => {
        timeStamp -= 1;
        if (timeStamp <= 0) {
          clearInterval(this.time);
          return;
        }
        this.calculTime(timeStamp);
      }, 1000);
    }
  };

  calculTime = (timeProgress) => {
    var hour = Math.floor(Math.round(timeProgress) / 3600);
    var min = Math.floor(Math.round(timeProgress - hour) / 60);
    var second = timeProgress % 60;
    if (second < 60) {
      second = parseInt(second);
    }
    if (second < 10) {
      second = '0' + parseInt(second);
    }
    if (min < 10) {
      min = '0' + min;
    }
    if (hour < 10) {
      hour = '0' + parseInt(hour);
    }
    this.setState({ hour, minutes: min, second });
  };

  render() {
    const { minutes, second } = this.state;
    if ((!minutes && !second) || (minutes == 0 && second == 0)) return <View />;
    return (
      <View style={{ width: Dimension.widthParent - 50, alignItems: 'flex-start', paddingTop: 10 }}>
        <BaseText style={styles.dateStyle}>
          {Lang.chooseLession.hint_text_time_remaining}
          <BaseText style={styles.timeStyle}>{`00:${minutes}:${second}`}</BaseText>
        </BaseText>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  dateStyle: {
    fontSize: 14 * Dimension.scale,
    color: Resource.colors.grey800
  },
  timeStyle: {
    fontSize: 14 * Dimension.scale,
    color: Resource.colors.greenColorApp
  }
});

export default CountDownBookingKaiwa;
