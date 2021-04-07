import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseButtonOpacity from 'common/components/base/BaseButtonOpacity';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Const from 'consts/Const';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Utils from 'utils/Utils';

const STATUS_FULL_BOOKING = 1;

class ItemBookingKaiwa extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressRegisterKaiwa = () => {
    const { item } = this.props;
    this.props.onPressRegisterKaiwa(item);
  };

  renderButton() {
    const { item, registed, date } = this.props;
    let timestamp = moment(`${this.props.date}`).valueOf();
    let today = moment().format('YYYY-MM-DD 00:00:00');
    let timestampToday = moment(today).valueOf() >= timestamp;
    if (item.user_1.id == Utils.user.id || item.user_2.id == Utils.user.id) {
      return (
        <BaseButtonOpacity
          text={Lang.calendarKaiwa.text_button_cancel}
          onPress={this.onPressRegisterKaiwa}
          socialButtonStyle={styles.socialButtonStyle}
          textStyle={{ ...styles.textStyle }}
        />
      );
    } else {
      if ((item.user_1 == '' || item.user_2 == '') && !item.is_full) {
        if (registed?.date === date) {
          return null;
        }
        return (
          <BaseButtonOpacity
            text={timestampToday ? Lang.calendarKaiwa.text_button_expired : Lang.calendarKaiwa.text_button_regis}
            disabled={timestampToday ? true : false}
            onPress={this.onPressRegisterKaiwa}
            socialButtonStyle={{
              ...styles.socialButtonStyle,
              borderColor: timestampToday ? Resource.colors.grey500 : Resource.colors.greenColorApp
            }}
            textStyle={{ ...styles.textStyle, color: timestampToday ? Resource.colors.grey500 : Resource.colors.greenColorApp }}
          />
        );
      }
      if (item.user_1.id != Utils.user.id && item.user_2.id != Utils.user.id) {
        if (registed?.date === date) {
          return null;
        }
        return (
          <BaseButtonOpacity
            text={timestampToday ? Lang.calendarKaiwa.text_button_expired : Lang.calendarKaiwa.text_button_full}
            onPress={this.onPressRegisterKaiwa}
            disabled={true}
            socialButtonStyle={{ ...styles.socialButtonStyle, borderColor: timestampToday ? Resource.colors.grey500 : Resource.colors.green400 }}
            textStyle={{ ...styles.textStyle, color: timestampToday ? Resource.colors.grey500 : 'black' }}
          />
        );
      }
      return null;
    }
  }

  render() {
    const { item } = this.props;
    let avatarUser1 = Resource.images.noAvt;
    if (item.user_1 && item.user_1.avatar != '') {
      avatarUser1 = { uri: Const.RESOURCE_URL.AVATAR.SMALL + item.user_1.avatar };
    }

    let avatarUser2 = Resource.images.noAvt;
    if (item.user_2 && item.user_2.avatar != '') {
      avatarUser2 = { uri: Const.RESOURCE_URL.AVATAR.SMALL + item.user_2.avatar };
    }

    return (
      <View style={styles.viewItem}>
        <View style={styles.viewAvatar}>
          <FastImage source={Resource.images.icTeacher} style={styles.avatar} resizeMode={FastImage.resizeMode.contain} />
        </View>
        <View style={styles.viewContent}>
          <BaseText style={styles.timeStyle}>{item.name}</BaseText>
          <View style={styles.wrapper}>
            <BaseText style={styles.content}>{item.time}</BaseText>
            <View style={styles.viewUserAvatar}>
              {item.user_1 ? (
                <FastImage source={avatarUser1} style={styles.userStyle} resizeMode={FastImage.resizeMode.contain} />
              ) : item.is_full === STATUS_FULL_BOOKING ? (
                <FastImage source={Resource.images.noAvt} style={styles.userStyle} resizeMode={FastImage.resizeMode.contain} />
              ) : (
                <View style={styles.viewAdd} />
              )}
              {item.user_2 ? (
                <FastImage source={avatarUser2} style={styles.userStyle} resizeMode={FastImage.resizeMode.contain} />
              ) : item.is_full === STATUS_FULL_BOOKING ? (
                <FastImage source={Resource.images.noAvt} style={styles.userStyle} resizeMode={FastImage.resizeMode.contain} />
              ) : (
                <View style={styles.viewAdd} />
              )}
            </View>
          </View>
        </View>
        {this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewItem: {
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  viewContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center'
  },
  viewAvatar: {
    width: 35 * Dimension.scale,
    height: 35 * Dimension.scale,
    borderRadius: (35 / 2) * Dimension.scale,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  wrapper: {
    width: 160 * Dimension.scale,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  avatar: {
    width: 35 * Dimension.scale,
    height: 35 * Dimension.scale,
    borderRadius: (35 / 2) * Dimension.scale
  },
  viewBar: {
    width: 0.8,
    height: 65 * Dimension.scale,
    backgroundColor: Resource.colors.black1,
    marginLeft: 10
  },
  timeStyle: {
    width: 160 * Dimension.scale,
    fontSize: 12 * Dimension.scale,
    color: Resource.colors.greenColorApp
  },
  content: {
    fontSize: 18 * Dimension.scale,
    paddingTop: 7
  },
  userStyle: {
    width: 20 * Dimension.scale,
    height: 20 * Dimension.scale,
    borderRadius: 10 * Dimension.scale
  },
  viewAdd: {
    width: 18 * Dimension.scale,
    height: 18 * Dimension.scale,
    borderRadius: 9 * Dimension.scale,
    backgroundColor: '#C4C4C4'
  },
  viewUserAvatar: {
    flexDirection: 'row',
    width: 50,
    justifyContent: 'space-between',
    paddingTop: 7
  },
  socialButtonStyle: {
    width: 57 * Dimension.scale,
    height: 40 * Dimension.scale,
    borderWidth: 1,
    borderColor: '#484848',
    borderRadius: 10
  },
  textStyle: {
    fontWeight: '500',
    fontSize: 10 * Dimension.scale
  }
});

export default ItemBookingKaiwa;
