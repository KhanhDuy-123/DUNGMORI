import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, AppState } from 'react-native';
import BaseText from 'common/components/base/BaseText';
import Resource from 'assets/Resource';
import Lang from 'assets/Lang';
import timeZone from 'moment-timezone';
import moment from 'moment';

var locales = timeZone.tz.guess();
var jun = timeZone('2020-07-05T09:00:00+07:00').tz('Asia/Ho_Chi_Minh');
var currentTimeZone = jun.tz(locales).format();

export default class Countdownt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: null,
      hour: null,
      minutes: null,
      second: null
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange);
    this.updateTime();
  }

  componentWillUnmount() {
    clearInterval(this.time);
    AppState.removeEventListener('change', this.onAppStateChange);
  }

  onAppStateChange = (state) => {
    if (state == 'active') {
      this.updateTime();
    } else if (state == 'inactive' || state == 'background') {
    }
  };

  updateTime = async () => {
    let currentTime = moment().valueOf();
    let time = moment(currentTimeZone).valueOf();
    let timeStamp = (time - currentTime) / 1000;
    clearInterval(this.time);
    this.time = setInterval(() => {
      timeStamp -= 1;
      if (timeStamp <= 0) {
        this.props.onOutOfTime();
        clearInterval(this.time);
      }
      this.calculTime(timeStamp);
    }, 1000);
  };

  calculTime = (timeProgress) => {
    var second = timeProgress % 60;
    var day = Math.floor(timeProgress / 86400);
    var dayRedu = timeProgress / 86400 - day;
    var hour = Math.floor(Math.round(dayRedu * 86400) / 3600);
    const hourRedu = (dayRedu * 86400) / 3600 - hour;
    var min = Math.floor(Math.round(hourRedu * 3600) / 60);
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
    if (day < 10) {
      day = '0' + parseInt(day);
    }
    this.setState({ day, hour, minutes: min, second });
  };

  renderBox = (title, time) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <ImageBackground source={Resource.images.icOclock} style={styles.imgBackground}>
          <BaseText style={styles.textTime}>{time}</BaseText>
        </ImageBackground>
        <BaseText style={styles.textTitle}>{title}</BaseText>
      </View>
    );
  };

  render() {
    const { day, hour, minutes, second } = this.state;

    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {this.renderBox(Lang.try_do_test.day_test, day)}
        {this.renderBox(Lang.try_do_test.hour_test, hour)}
        {this.renderBox(Lang.try_do_test.minutes_test, minutes)}
        {this.renderBox(Lang.try_do_test.second_test, second)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 3,
    borderTopWidth: 0.2,
    borderColor: 'grey'
  },
  textTitle: {
    fontSize: 10,
    marginTop: 2,
    marginBottom: 2
  },
  imgBackground: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTime: {
    fontWeight: '600'
  }
});
