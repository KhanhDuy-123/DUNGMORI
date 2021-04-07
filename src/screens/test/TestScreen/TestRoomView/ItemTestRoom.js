import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import NavigationService from 'common/services/NavigationService';
import ScreenNames from 'consts/ScreenName';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import UserActionCreator from 'states/redux/actionCreators/UserActionCreator';
import ButtonJoinRoom from './ButtonJoinRoom';

const { width } = Dimensions.get('screen');

export default class ItemTestRoom extends Component {
  onPressGoDoTest = (e) => {
    UserActionCreator.verifySession(() => {
      NavigationService.navigate(ScreenNames.TestingScreen, {
        params: this.props.item,
        jumpToRank: this.props.jumpToRank
      });
    });
  };

  render() {
    const { item } = this.props;
    if (!item?.course) {
      return (
        <View style={styles.areaContent} key={'title'}>
          <View style={[styles.content, { flex: 1 }]}>
            <BaseText style={styles.textTitle}>{Lang.testScreen.text_rank}</BaseText>
          </View>
          <View style={[styles.content, { flex: 1 }]}>
            <BaseText style={styles.textTitle}>{Lang.testScreen.text_online}</BaseText>
          </View>
          <View style={styles.content}>
            <BaseText style={styles.textTitle}>{Lang.testScreen.text_lich_thi}</BaseText>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.areaTest} key={item.course}>
          <View style={[styles.content, { flex: 1 }]}>
            <View style={[styles.frameName, { backgroundColor: item.color }]}>
              <BaseText style={styles.textName}>{item.course}</BaseText>
            </View>
          </View>
          <View style={[styles.content, styles.contentNew]}>
            {!item.expired ? (
              <View style={[styles.flexible, { flexDirection: 'row' }]}>
                <View style={styles.animatedCircle} />
                <BaseText style={styles.textOnline}>{item.online}</BaseText>
              </View>
            ) : (
              <View style={{ alignSelf: 'center' }}>
                <BaseText>-</BaseText>
              </View>
            )}
          </View>
          <View style={styles.content}>
            <ButtonJoinRoom item={item} onGoDoTest={this.onPressGoDoTest} />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  flexible: {
    alignItems: 'center',
    justifyContent: 'center'
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
