import NetInfo from '@react-native-community/netinfo';
import Lang from 'assets/Lang';
import Sounds from 'assets/Sounds';
import CodePush from 'common/components/base/CodePush';
import DropAlert from 'common/components/base/DropAlert';
import ImageZoom from 'common/components/base/ImageZoom';
import LoadingModal from 'common/components/base/LoadingModal';
import ModalLoginRequiment from 'common/components/base/ModalLoginRequiment';
import ModalWebView from 'common/components/base/ModalWebView';
import RootView from 'common/components/base/RootView';
import ModalUpgradle from 'common/components/modal/ModalUpgradle';
import EventService from 'common/services/EventService';
import NavigationService from 'common/services/NavigationService';
import React, { Component } from 'react';
import 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import Realms from 'realm/Realms';
import MainNavigation from 'routers/MainNavigation';
import ModalReplyComment from 'screens/components/comment/ModalReplyComment';
import ModalTakeGift from 'screens/course/info/CourseProgressScreen/ModalTakeGift';
import ModalTestingResult from 'screens/test/components/ModalTestingResult';
import AppAction from 'states/context/actions/AppAction';
import AppProvider from 'states/context/providers/AppProvider';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    Realms.close();
    Sounds.init();
    NetInfo.addEventListener((state) => {
      if (state.isInternetReachable === false) {
        AppAction.onGetConnectInternet(state.isInternetReachable);
        DropAlert.warn(Lang.NoInternetComponent.no_internet_connection, Lang.NoInternetComponent.pls_check_your_internet_connection);
      } else {
        AppAction.onGetConnectInternet(true);
      }
    });
    Orientation.lockToPortrait();
  }

  componentWillUnmount() {
    Sounds.release();
    Realms.close();
    EventService.clear();
  }

  render() {
    return (
      <AppProvider>
        <RootView>
          <MainNavigation ref={(navigatorRef) => NavigationService.setNavigator(navigatorRef)} />
          <ModalTakeGift />
          <ModalTestingResult />
          <ModalLoginRequiment />
          <ImageZoom />
          <LoadingModal />
          <ModalReplyComment />
          <ModalWebView />
          <ModalUpgradle />
          <DropAlert />
          <CodePush />
        </RootView>
      </AppProvider>
    );
  }
}
