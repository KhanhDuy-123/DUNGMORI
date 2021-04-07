import Dimension from 'common/helpers/Dimension';
import Fetch from 'common/helpers/Fetch';
import OneSignalService from 'common/services/OneSignalService';
import React from 'react';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { onCountConversation, onCountNotify } from 'states/redux/actions/CountNotiAction';
import Utils from 'utils/Utils';
import Resource from '../assets/Resource';
import Const from '../consts/Const';

const BADGE_CHAT = 'chat';
class BadgeIconTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.badgeType == BADGE_CHAT ? props.totalConversation : props.totalNotify
    };
    this.event = Const.EVENT.COUNT_NOTIFY;
    this.data = Const.DATA.COUNT_NOTI;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { badgeType } = this.props;
    if (badgeType !== BADGE_CHAT) {
      if (nextProps.totalNotify !== this.props.totalNotify) {
        let count = nextProps.totalNotify;
        this.setState({ count });
      }
    } else {
      if (nextProps.totalConversation !== this.props.totalConversation) {
        let count = nextProps.totalConversation;
        this.setState({ count });
      }
    }
    return nextState !== this.state;
  }

  componentDidMount() {
    const { badgeType, focused } = this.props;
    if (badgeType == BADGE_CHAT) {
      this.event = Const.EVENT.REVIEVE_NOTI_CHAT;
      this.data = Const.DATA.COUNT_NOTI_CHAT;
    } else {
      this.event = Const.EVENT.COUNT_NOTIFY;
      this.data = Const.DATA.COUNT_NOTI;
    }

    //Check focus tab chat thì reset số thông báo chat
    if (focused) {
      this.focus = this.props.navigation.addListener('didFocus', this.onReadedNotify);
    }

    //Lắng nghe thông báo về đếm số thông báo
    DeviceEventEmitter.addListener(this.event, this.onRecieveNotify);
  }

  onReadedNotify = async () => {
    const { badgeType, navigation } = this.props;
    if (badgeType == BADGE_CHAT && navigation.isFocused() && Utils.token.length > 0) {
      let readedNotify = await Fetch.post(Const.API.CONVERSATION.MAKE_READED, null, true);
      if (readedNotify.status == Fetch.Status.SUCCESS) {
        OneSignalService.countNotifyChat = 0;
        this.props.onCountConversation(0);
      }
    }
  };

  onRecieveNotify = (params) => {
    const { focused, badgeType, totalNotify, totalConversation } = this.props;
    if (!focused) {
      let count = totalNotify;
      let total = badgeType !== BADGE_CHAT ? totalNotify : totalConversation;
      count = total > 0 ? 1 + total : params;
      this.setState({ count });
      badgeType !== BADGE_CHAT ? this.props.onCountNotify(count) : this.props.onCountConversation(count);
    }
  };

  componentWillUnmount() {
    if (Utils.token.length > 0) {
      DeviceEventEmitter.removeListener(this.event);
    }
  }

  render() {
    const { focused, img1, img2 } = this.props;
    const { count } = this.state;
    return (
      <View style={styles.cotainer}>
        <View>
          <FastImage source={focused ? img1 : img2} style={styles.imageTab} resizeMode={FastImage.resizeMode.contain} />
          {count > 0 && (
            <View style={styles.badge}>{count <= 9 ? <Text style={styles.textBadge}>{count}</Text> : <Text style={styles.textBadge}>9+</Text>}</View>
          )}
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = { onCountNotify, onCountConversation };

const mapStateToProps = (state) => ({
  totalNotify: state.countNotifyReducers.totalNotify,
  totalConversation: state.countNotifyReducers.totalConversation
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(BadgeIconTab);

const styles = StyleSheet.create({
  cotainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  imageTab: {
    width: 18 * Dimension.scale,
    height: 18 * Dimension.scale
  },
  labelStyle: {
    fontSize: 9 * Dimension.scale,
    fontWeight: '600',
    marginTop: 5,
    color: Resource.colors.black1
  },
  labelStyles: {
    fontSize: 9 * Dimension.scale,
    fontWeight: '500',
    marginTop: 5,
    color: Resource.colors.black3
  },
  badge: {
    width: 18,
    height: 18,
    borderRadius: 100,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -5,
    right: -5
  },
  textBadge: {
    fontSize: 9 * Dimension.scale,
    color: 'white',
    fontWeight: '600'
  }
});
