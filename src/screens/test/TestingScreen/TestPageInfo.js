import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import React, { Component } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SocketOnlineService from 'common/services/SocketOnlineService';
import Dimension from 'common/helpers/Dimension';
import TextCountdown from '../components/TextCountdown';
import UrlConst from 'consts/UrlConst';
import Funcs from 'common/helpers/Funcs';
const width = Dimension.widthParent;

export default class TestPageInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      online: 0
    };
    this.animMove = new Animated.Value(-width);
    this.widthParent = width;
    this.count = 0;
  }

  componentDidMount() {
    const courseName = this.props.courseName;
    SocketOnlineService.disconnect();
    SocketOnlineService.init({
      url: UrlConst.SOCKET_COUNT_ONLINE + `?type=${courseName}`,
      onUpdate: (count) => {
        let listSocket = Object.keys(count);
        for (let i = 0; i < listSocket.length; i++) {
          if (listSocket[i] == courseName) {
            this.setState({ online: count[`${courseName}`] });
            break;
          }
        }
      },
      onConnected: () => {
        Funcs.log(`SOCKET IS CONNECTED`);
        // SocketOnlineService.onSubmit(courseName)
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.count !== this.props.count) {
      const percent = nextProps.count / nextProps.totalAnswer;
      Animated.timing(this.animMove, {
        toValue: -this.widthParent + percent * this.widthParent || 0,
        duration: 400
      }).start();
    }
    return nextProps !== this.props || this.state.online !== nextState.online;
  }

  componentWillUnmount() {
    SocketOnlineService.disconnect();
  }

  getSpendTime = () => {
    let time = this.TextCountdown.getTime();
    return time;
  };

  onLayout = (event) => {
    this.widthParent = event.nativeEvent.layout.width;
    const percent = this.props.count / this.props.totalAnswer;
    Animated.timing(this.animMove, {
      toValue: -this.widthParent + percent * this.widthParent || 0,
      duration: 400
    }).start();
  };

  onPressSubmit = () => {
    this.props.onPress();
  };

  outOfTime = () => {
    this.props.onOutOfTime();
  };

  onPressNextPage = () => {
    this.props.onPressNextPage();
  };

  onPressPrevPage = () => {
    this.props.onPressPrevPage();
  };

  render() {
    const { totalAnswer, count, deltaTime, page, totalList, isList1 } = this.props;
    const { online } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.wrapperOnline}>
          <View style={styles.wrapperContent}>
            <MaterialCommunityIcons name="timer" size={20} color={'grey'} />
            <TextCountdown deltaTime={deltaTime} onTimeOut={this.outOfTime} ref={(refs) => (this.TextCountdown = refs)} />
          </View>
          <View style={styles.wrapperContent}>
            <MaterialCommunityIcons name="eye-outline" size={20} style={{ marginRight: 5 }} color={'grey'} />
            <BaseText style={styles.textTime}>{online}</BaseText>
          </View>
        </View>
        <View style={styles.wrapperAnimBar}>
          <View style={styles.viewWrapAnim} onLayout={this.onLayout}>
            <Animated.View style={[styles.viewAnim, { transform: [{ translateX: this.animMove }] }]} />
            <BaseText style={styles.textCount}>{`${count}/${totalAnswer}`}</BaseText>
          </View>
          {isList1 == 0 ? (
            <View style={[styles.areaPage, { justifyContent: 'center' }]}>
              <TouchableOpacity style={styles.buttonNopbai} onPress={this.onPressSubmit}>
                <BaseText style={styles.textNopBai}>{Lang.try_do_test.submit}</BaseText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.areaPage}>
              {page > 1 ? (
                <TouchableOpacity style={{ width: 40 }} activeOpacity={0.5} onPress={this.onPressPrevPage}>
                  <AntDesign name="caretleft" size={24} color="#8E8E8E" />
                </TouchableOpacity>
              ) : (
                <View style={{ width: 40 }} />
              )}
              <BaseText style={page == totalList ? { position: 'absolute', left: 25 } : null}>{`${page}${'/'}${totalList}`}</BaseText>
              {page == totalList ? (
                <TouchableOpacity style={styles.buttonNopbai} onPress={this.onPressSubmit}>
                  <BaseText style={styles.textNopBai}>{Lang.try_do_test.submit}</BaseText>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{ width: 40, alignItems: 'flex-end' }} activeOpacity={0.5} onPress={this.onPressNextPage}>
                  <AntDesign name="caretright" size={24} color="#8E8E8E" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height: 65,
    paddingHorizontal: 10,
    // paddingBottom: 5,
    backgroundColor: '#EBEBEB'
  },
  textTitle: {
    fontSize: 12,
    color: 'grey'
  },
  textTime: {
    fontSize: 13,
    color: 'red',
    fontWeight: 'bold'
  },
  buttonNopbai: {
    borderRadius: 5,
    backgroundColor: Resource.colors.greenColorApp,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    marginLeft: 5,
    paddingHorizontal: 10
  },
  textNopBai: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white'
  },
  viewWrapAnim: {
    width: '55%',
    height: 20,
    backgroundColor: '#B0C499',
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'center'
  },
  viewAnim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 3
  },
  textCount: {
    fontSize: 12,
    marginLeft: 50,
    position: 'absolute',
    color: 'white',
    fontWeight: '500'
  },
  areaPage: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '40%',
    flexDirection: 'row'
  },
  wrapperOnline: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 5
  },
  wrapperContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  wrapperAnimBar: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
