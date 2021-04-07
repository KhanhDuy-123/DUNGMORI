import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import moment from 'moment';
import timeZone from 'moment-timezone';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
const { width } = Dimension.widthParent;

const LOCALES = 'Asia/Ho_Chi_Minh';
export default class ButtonJoinRoom extends Component {
  constructor(props) {
    super(props);
    this.state = { status: -1 };
    this.currentTime = props.item.currentTime;
  }

  componentDidMount() {
    this.updateStatus();
    clearInterval(this.timer);
    this.timer = setInterval(this.updateStatus, 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.item.currentTime !== this.props.item.currentTime) {
      this.currentTime = nextProps.item.currentTime;
    }
    return this.state !== nextState;
  }

  updateStatus = () => {
    this.currentTime += 1000;
    const { item } = this.props;
    let { time_start, time_end } = item;
    if (!time_start && !time_end) return;
    const timeStartStamp = moment(time_start).valueOf();
    const timeEndStamp = moment(time_end).valueOf();

    // Hêt giờ
    let status = -1;
    if (this.currentTime >= timeStartStamp && this.currentTime < timeEndStamp) {
      // Đang thi
      status = 1;
    } else if (timeStartStamp > this.currentTime) {
      // Trước giờ thi
      status = 0;
    }
    this.setState({
      status
    });

    // if (item.course === 'N5') {
    //   console.log(item.course, this.formatDayTimeZone(time_start, 'HH:mm, DD/MM'), '=> ', this.formatDayTimeZone(time_end, 'HH:mm, DD/MM'), status);
    // }
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  onGoDoTest = () => {
    this.props.onGoDoTest(this.props.item);
  };

  formatDayTimeZone = (day, format) => {
    let str = '';
    var jun = timeZone(day).tz(LOCALES);
    let timeZoneFormat = jun.tz(LOCALES).format(format);
    str = timeZoneFormat;
    return str;
  };

  renderNoneTestTime = (item) => {
    return (
      <View style={{ justifyContent: 'center' }}>
        <BaseText style={{ fontWeight: '500' }}>{item.time_start}</BaseText>
      </View>
    );
  };

  render() {
    const { status } = this.state;
    const { item } = this.props;
    if (!item.test) return this.renderNoneTestTime(item);

    /**Hết giờ thi */
    if (status === -1) {
      let timeEndFormat = this.formatDayTimeZone(item.time_end, 'HH:mm ngày DD/MM');
      return (
        <View style={[styles.flexible, { flex: 1 }]}>
          <View style={styles.flexible}>
            <BaseText style={{ color: '#7B7B7B' }}>{Lang.testScreen.text_end_test}</BaseText>
            <BaseText style={{ color: 'black' }}>{timeEndFormat}</BaseText>
          </View>
        </View>
      );
    }

    /**Trươc thời gian thi */
    if (status === 0) {
      return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <BaseText style={styles.textTimeStart}>{`${Lang.try_do_test.time_test}`}</BaseText>
          <BaseText style={{ color: '#3E8839' }}>{this.formatDayTimeZone(item.time_start, 'HH:mm, DD/MM/YYYY')}</BaseText>
          <BaseText style={styles.textTimeStart}>{`${Lang.testScreen.text_time_vn}${' '}`}</BaseText>
        </View>
      );
    }

    /**Trong thời gian bài thi */
    if (status === 1) {
      return (
        <TouchableOpacity style={styles.areaGoTest} onPress={this.onGoDoTest}>
          <BaseText style={styles.textGoTest}>{Lang.testScreen.text_gotest}</BaseText>
        </TouchableOpacity>
      );
    }
    return <View />;
  }
}

const styles = StyleSheet.create({
  flexible: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 30,
    backgroundColor: 'white'
  },
  title: {
    width: 290 * Dimension.scale,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  textVietname: {
    fontWeight: '700',
    fontSize: 14
  },
  areaTime: {
    flexDirection: 'row',
    marginTop: 10
  },
  showTime: {
    height: 30 * Dimension.scale,
    paddingHorizontal: 5,
    width: 125 * Dimension.scale,
    borderRadius: 5,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#345086',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTime: {
    fontWeight: '600',
    color: '#345086',
    fontSize: 15
  },
  areaContent: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center'
  },
  content: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000'
  },
  frameName: {
    width: 70,
    height: 40,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  areaGoTest: {
    width: 150,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    backgroundColor: Resource.colors.greenColorApp,
    marginVertical: 5,
    height: 40
  },
  textGoTest: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600'
  },
  textTesting: {
    fontSize: 13,
    color: Resource.colors.greenColorApp
  },
  textTimeStart: {
    fontSize: 14
  },
  viewWrappVn: {
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: 'green',
    paddingVertical: 3,
    marginRight: 5
  },
  areaTest: {
    flex: 1,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E7E8E9'
  },
  viewWrappTimeEnd: {
    backgroundColor: '#676767',
    padding: 5,
    borderRadius: 5,
    marginVertical: 3
  },
  animatedCircle: {
    width: 10,
    height: 10,
    backgroundColor: Resource.colors.greenColorApp,
    borderRadius: 50,
    marginRight: 10
  },
  viewFooter: {
    width: width,
    height: 80,
    alignItems: 'center',
    backgroundColor: '#EEF7FE',
    marginTop: 30,
    flexDirection: 'row'
  },
  viewOnline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  contentNew: {
    flex: 1,
    paddingRight: 15,
    justifyContent: 'center'
  },
  textOnline: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});
