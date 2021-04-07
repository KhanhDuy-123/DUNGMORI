import Colors from 'assets/Colors';
import Images from 'assets/Images';
import Lang from 'assets/Lang';
import Theme from 'assets/Theme';
import BaseNoInternet from 'common/components/base/BaseNoInternet';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Funcs from 'common/helpers/Funcs';
import { getStatusBarHeight } from 'common/helpers/IPhoneXHelper';
import EventService from 'common/services/EventService';
import NavigationService from 'common/services/NavigationService';
import OneSignalService from 'common/services/OneSignalService';
import StorageService from 'common/services/StorageService';
import ScreenNames from 'consts/ScreenName';
import UIConst from 'consts/UIConst';
import React from 'react';
import { Animated, AppState, RefreshControl, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { TabBar, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import AppContextView from 'states/context/views/AppContextView';
import NotifyActionCreator from 'states/redux/actionCreators/NotifyActionCreator';
import PaymentActionCreator from 'states/redux/actionCreators/PaymentActionCreator';
import { getHomeData } from 'states/redux/actions/HomeAction';
import CoursesView from './CoursesView';
import DailyActivitiesView from './DailyActivitiesView';

const width = Dimension.widthParent;
const statusBarHeight = getStatusBarHeight();
class HomeScreen extends AppContextView {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      index: 0,
      routes: [{ key: 'first', title: 'CÁC KHOÁ HỌC' }, { key: 'second', title: 'HOẠT ĐỘNG HÀNG NGÀY' }],
      heightHeader: 1,
      heightScrollView: UIConst.HEIGHT
    };
    this.offsetTab0 = 0;
    this.animatedScroll = new Animated.Value(0);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.onChangeAppState);
    OneSignalService.navigateToScreen();

    // Check has old iap purchase
    this.getListApi();
    this.checkIapPurchase();
  }

  componentWillUnmount() {
    clearTimeout(this.timeShowLoading);
    AppState.removeEventListener('change', this.onChangeAppState);
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getListApi();
  };

  onChangeAppState = (state) => {
    if (state == 'active') {
      NotifyActionCreator.checkNotify();
      this.checkIapPurchase();
    } else if (state == 'inactive' || state == 'background') {
      EventService.emit('paused');
    }
  };

  checkIapPurchase = async () => {
    try {
      let purchaseData = await StorageService.get('IAP_PURCHASE_DATA');
      if (purchaseData) {
        PaymentActionCreator.createIapInvoice(purchaseData, this.getListApi);
      }
    } catch (err) {
      Funcs.log(err);
    }
  };

  getListApi = async () => {
    this.props.getHomeData(() => {
      this.setState({ refreshing: false });
    });
  };

  //navigate buy cource
  onPressListCource = () => {
    NavigationService.navigate(ScreenNames.BuyCourseScreen);
  };

  onIndexChange = (index) => {
    this.setState({ index, heightScrollView: this[`TabHeight${index}`] }, () => {
      if (this.offset >= this.state.heightHeader) {
        this.ScrollView?.getNode().scrollTo({ x: 0, y: this.state.heightHeader, animated: false });
      }
    });
  };

  onListenScroll = ({ nativeEvent }) => {
    this.offset = nativeEvent.contentOffset.y;
  };

  onLayout = ({ nativeEvent }) => {
    this.setState({ heightHeader: nativeEvent.layout.height });
  };

  onSetHeightScreenTab = (height, index) => {
    this[`TabHeight${index}`] = height;
    if (index === 0 && height !== 0) this.setState({ heightScrollView: height });
  };

  renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'first':
        return <CoursesView refreshing={this.state.refreshing} onRefresh={this.onRefresh} onSetHeightScreenTab={this.onSetHeightScreenTab} />;
      case 'second':
        return <DailyActivitiesView refreshing={this.state.refreshing} onRefresh={this.onRefresh} onSetHeightScreenTab={this.onSetHeightScreenTab} />;
    }
  };

  renderIcon = ({ route, focused }) => {
    switch (route.key) {
      case 'first': {
        return <FastImage source={Images.icCourse} style={styles.iconStyle} resizeMode={FastImage.resizeMode.contain} />;
      }
      case 'second': {
        return <FastImage source={Images.icLoa} style={styles.iconStyle} resizeMode={FastImage.resizeMode.contain} />;
      }
    }
  };

  renderTabBar = (props) => {
    const { heightHeader } = this.state;
    const translateTabbar = this.animatedScroll.interpolate({
      inputRange: [0, heightHeader, heightHeader + 1],
      outputRange: [0, 0, 1]
    });
    const backgroundColor = Theme.get('headerColor');
    return (
      <Animated.View style={[styles.parentTabbar, { backgroundColor, transform: [{ translateY: translateTabbar }] }]}>
        <TabBar
          {...props}
          getLabelText={({ route }) => route.title}
          scrollEnabled={true}
          inactiveColor={Colors.white100}
          style={{ ...styles.viewHeader, backgroundColor }}
          labelStyle={styles.labelStyle}
          indicatorStyle={styles.indicatorStyle}
          tabStyle={styles.tabStyle}
          renderIcon={this.renderIcon}
        />
      </Animated.View>
    );
  };

  render() {
    const { refreshing, heightHeader, heightScrollView } = this.state;
    const opacity = this.animatedScroll.interpolate({
      inputRange: [0, heightHeader / 2],
      outputRange: [1, 0]
    });
    const translateY = this.animatedScroll.interpolate({
      inputRange: [0, heightHeader, heightHeader + 1],
      outputRange: [0, -(heightHeader - statusBarHeight), -(heightHeader - statusBarHeight)]
    });
    const { internet = true } = this.context || {};
    const scrollViewHeight = heightScrollView ? heightScrollView + heightHeader + statusBarHeight + 75 : 500 + heightHeader + 75;
    if (!internet) return <BaseNoInternet />;
    return (
      <View style={{ flex: 1 }}>
        <StatusBar translucent={true} barStyle="light-content" backgroundColor="transparent" />
        <View style={[styles.backgoundScrollView, { backgroundColor: Theme.get('headerColor') }]} />
        <View style={[styles.parentStatusBar, { backgroundColor: Theme.get('headerColor') }]} />
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          ref={(refs) => (this.ScrollView = refs)}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} tintColor={'white'} />}
          scrollEventThrottle={16}
          contentContainerStyle={{ height: scrollViewHeight, paddingTop: heightHeader + statusBarHeight - 10 }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.animatedScroll } } }], { useNativeDriver: true, listener: this.onListenScroll })}>
          <View style={styles.container}>
            <TabView
              navigationState={this.state}
              renderScene={this.renderScene}
              // lazy={true}
              lazyPreloadDistance={0}
              swipeEnabled={true}
              initialLayout={Dimension.widthParent}
              renderTabBar={this.renderTabBar}
              onIndexChange={this.onIndexChange}
              style={{ paddingTop: 65 }}
            />
          </View>
        </Animated.ScrollView>
        <Animated.View style={{ position: 'absolute', backgroundColor: Theme.get('headerColor'), transform: [{ translateY }] }}>
          <Animated.View style={[styles.wrapperBanner, { opacity }]} pointerEvents={'none'}>
            <FastImage source={Theme.get('bg_header')} style={styles.icBanner} resizeMode={FastImage.resizeMode.contain} />
          </Animated.View>
          <Animated.View style={[styles.wrapperHeader, { opacity, backgroundColor: 'transparent' }]} onLayout={this.onLayout}>
            <FastImage source={Theme.get('logo')} style={styles.logo} resizeMode={FastImage.resizeMode.contain} />
            <TouchableOpacity style={styles.viewBuyCourse} activeOpacity={0.7} onPress={this.onPressListCource}>
              <FastImage source={Images.icShoppingCart} style={styles.iconCart} />
              <BaseText style={styles.textName}>{Lang.saleLesson.button_buy_course}</BaseText>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
}

const mapDispatchToProps = { getHomeData };

export default connect(
  null,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  wrapperHeader: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10 * Dimension.scale,
    paddingTop: statusBarHeight + 10 * Dimension.scale
  },
  viewBuyCourse: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.white100,
    paddingHorizontal: 7 * Dimension.scaleWidth,
    paddingVertical: 3 * Dimension.scaleHeight,
    borderRadius: 20 * Dimension.scaleHeight,
    marginLeft: 35 * Dimension.scaleWidth
  },
  iconCart: {
    width: 10 * Dimension.scaleWidth,
    height: 10 * Dimension.scaleWidth,
    marginRight: 5 * Dimension.scaleWidth
  },
  logo: {
    width: 70 * Dimension.scaleWidth,
    height: 30 * Dimension.scaleHeight
  },
  textName: {
    color: '#FFFFFF',
    fontSize: 9 * Dimension.scaleWidth
  },
  viewHeader: {
    elevation: 0
  },
  indicatorStyle: {
    width: Dimension.widthParent / 2,
    height: 1.7 * Dimension.scale,
    borderRadius: 2 * Dimension.scale,
    backgroundColor: Colors.white100
  },
  tabStyle: {
    width: Dimension.widthParent / 2,
    height: 55 * Dimension.scale
  },
  iconStyle: {
    width: 25 * Dimension.scale,
    height: 25 * Dimension.scale
  },
  labelStyle: {
    fontSize: 10 * Dimension.scale,
    fontWeight: 'bold'
  },
  parentTabbar: {
    width: UIConst.WIDTH,
    justifyContent: 'flex-end',
    position: 'absolute',
    zIndex: 1
  },
  backgoundScrollView: {
    position: 'absolute',
    height: '50%',
    width: UIConst.WIDTH
  },
  icBanner: {
    position: 'absolute',
    top: UIConst.SCALE * 10,
    right: 0,
    height: UIConst.SCALE * 100,
    width: UIConst.WIDTH - UIConst.SCALE * 90
  },
  wrapperBanner: {
    position: 'absolute',
    top: UIConst.SCALE * 10,
    right: 0,
    height: UIConst.SCALE * 90,
    width: '100%'
  },
  parentStatusBar: {
    width: UIConst.WIDTH,
    height: statusBarHeight,
    position: 'absolute'
  }
});
