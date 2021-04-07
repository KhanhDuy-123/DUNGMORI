import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import React, { Component } from 'react';
import { View } from 'react-native';
import PushNotification from 'react-native-push-notification';

export default class TextCountdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: props.deltaTime / 1000
    };
  }

  componentDidMount() {
    if (this.props.deltaTime) {
      this.onCouting();
    }
  }

  componentWillUnmount() {
    PushNotification.cancelLocalNotifications({ id: 1 });
    clearInterval(this.timer);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.deltaTime !== this.props.deltaTime && nextProps.deltaTime) {
      clearInterval(this.timer);
      this.setState({ time: nextProps.deltaTime / 1000 }, () => {
        this.onCouting();
      });
    }
    return nextState !== this.state;
  }

  getTime = () => {
    let { deltaTime } = this.props;
    let { time } = this.state;
    let timeSpend = deltaTime / 1000 - time;
    return timeSpend;
    // this.props.saveSpendTime(timeSpend)
  };

  onCouting = () => {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.setState({ time: this.state.time - 1 }, () => {
        if (this.state.time <= 0) {
          clearInterval(this.timer);
          this.props.onTimeOut();
        } else if (Math.floor(this.state.time) == 300) {
          PushNotification.localNotification({
            id: 1,
            title: Lang.try_do_test.text_dungmori, // (optional)
            message: Lang.try_do_test.text_warning_end_time, // (required)
            playSound: true, // (optional) default: true
            soundName: 'default'
          });
        }
      });
    }, 950);
  };

  calculTime = (timeProgress) => {
    var timeStr = '00:00:00';
    if (timeProgress < 0) return timeStr;
    try {
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
    } catch (err) {
      console.log('ERROR', err);
    }
    return timeStr;
  };

  render() {
    return (
      <View>
        <BaseText
          style={{
            fontSize: 13,
            color: 'red',
            fontWeight: '500'
          }}>
          {' '}
          {this.calculTime(this.state.time)}{' '}
        </BaseText>
      </View>
    );
  }
}
