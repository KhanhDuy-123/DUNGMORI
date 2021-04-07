import BaseText from 'common/components/base/BaseText';
import moment from 'moment';
import timeZone from 'moment-timezone';
import React, { Component } from 'react';
import { View } from 'react-native';

const LOCALES = 'Asia/Ho_Chi_Minh';
export default class TextCountNext extends Component {
  constructor(props) {
    super(props);
    const { time } = this.props;
    let data = new Date(time);
    const hour = data.getHours() * 3600;
    const minute = data.getMinutes() * 60;
    const second = data.getSeconds();
    this.state = {
      time: hour + minute + second
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.time !== this.props.time) {
      clearInterval(this.time);
      const { time } = nextProps;
      let data = new Date(time);
      const hour = data.getHours() * 3600;
      const minute = data.getMinutes() * 60;
      const second = data.getSeconds();
      this.setState({ time: hour + minute + second }, () => {
        this.onCountingTime(nextProps);
      });
    }
    return nextState !== this.state;
  }

  componentDidMount() {
    this.onCountingTime(this.props);
  }

  onCountingTime = (props) => {
    const { time } = props;
    const day = moment(time).format();
    var jun = timeZone(day).tz(LOCALES);
    let timeZoneFormat = jun.tz(LOCALES);
    var hourTimeZone = timeZoneFormat.format('HH');
    var minuteTimeZone = timeZoneFormat.format('mm');
    var secondTimeZone = timeZoneFormat.format('ss');
    let totalTime = parseInt(hourTimeZone) * 3600 + parseInt(minuteTimeZone) * 60 + parseInt(secondTimeZone);
    let timeRunning = totalTime;
    clearInterval(this.time);
    this.time = setInterval(() => {
      timeRunning += 1;
      this.setState({ time: timeRunning });
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.time);
  }

  calculTime = (timeProgress) => {
    var timeStr = '00:00:00';
    var second = timeProgress % 60;
    var hour = Math.floor(timeProgress / 3600);
    const hourRedu = timeProgress / 3600 - hour;
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
    timeStr = hour + ':' + min + ':' + second;
    return timeStr;
  };

  render() {
    return (
      <View>
        <BaseText style={this.props.textStyle}> {this.calculTime(this.state.time)} </BaseText>
      </View>
    );
  }
}
