import StorageService from 'common/services/StorageService';
import Const from 'consts/Const';
import ScreenNames from 'consts/ScreenName';
import { DeviceEventEmitter } from 'react-native';
import RNOneSignal from 'react-native-onesignal';
import UserActionCreator from 'states/redux/actionCreators/UserActionCreator';
import Utils from 'utils/Utils';
import Fetch from '../helpers/Fetch';
import Funcs from '../helpers/Funcs';
import EncryptFileService from './EncryptFileService';
import EventService from './EventService';
import NavigationService from './NavigationService';

const listCourse = ['N1', 'N2', 'N3', 'N4', 'N5'];

export default class OneSignalService {
  static deviceId = null;
  static countOpenNotification = 0;
  static notificationOpenData = null;
  static countNotifyChat = 0;
  static countNotify = 0;

  static onReceived(notification) {
    let params = notification.payload.additionalData;
    Funcs.log(`ON RECIEVE`, notification);
    if (params.type && params.type !== Const.TABLE_NAME.CHAT) {
      //Dem so thong bao hien thi len badge
      OneSignalService.countNotify += 1;
      EventService.emit(Const.EVENT.RECIEVE_NOTIFY, params);
      DeviceEventEmitter.emit(Const.EVENT.COUNT_NOTIFY, OneSignalService.countNotify);
      if (params.table_name == 'tips') {
        EventService.emit('tips');
      }
    } else if (params.type && params.type == Const.TABLE_NAME.CHAT) {
      //Dem so thong bao hien thi len badge chat
      OneSignalService.countNotifyChat += 1;
      DeviceEventEmitter.emit(Const.EVENT.REVIEVE_NOTI_CHAT, OneSignalService.countNotifyChat);
    }
    OneSignalService.countOpenNotification++;
  }

  static async onOpened(openResult) {
    OneSignalService.notificationOpenData = openResult.notification.payload.additionalData;
    OneSignalService.navigateToScreen();
  }

  static async navigateToScreen() {
    if (OneSignalService.countOpenNotification < 1) {
      OneSignalService.countOpenNotification = 1;
      return;
    }

    // Save data
    let result = OneSignalService.notificationOpenData;
    if (!result) return;

    // Navigate
    OneSignalService.countOpenNotification = 0;
    const tableName = result.table_name;
    let item = {
      name: result.sender?.name,
      avatar: result.sender?.avatar,
      table_id: result.table_id,
      table_name: result.table_name,
      type: result.type
    };
    Funcs.log(`ON RECIEVE`, result);
    let course = {};
    try {
      course = await JSON.parse(result.data);
    } catch (error) {
      Funcs.log(error);
    }
    if (result.type == Const.TABLE_NAME.CHAT) {
      NavigationService.navigate(ScreenNames.ChatScreen);
    } else if (tableName == Const.TABLE_NAME.INVOICE) {
      NavigationService.navigate(ScreenNames.DetailPayment, { idPayment: result.table_id });
    } else if (tableName == Const.TABLE_NAME.COURSE) {
      result.data ? (item.dataNoti = result.data) : null;
      let screenName = ScreenNames.DetailCourseScreen;
      let indexCourse = listCourse.indexOf(course.courseName);
      if (indexCourse >= 0) screenName = ScreenNames.DetailCourseNewScreen;
      NavigationService.navigate(screenName, {
        typeNotify: true,
        type: Const.TYPE_VIEW_DUNGMORI,
        item: item
      });
    } else if (tableName == Const.TABLE_NAME.COMBO) {
      result.data ? (item.dataNoti = result.data) : null;
      NavigationService.navigate(ScreenNames.DetailComboScreen, {
        typeNotify: true,
        type: Const.TYPE_VIEW_DUNGMORI,
        data: item
      });
    } else if (tableName == Const.TABLE_NAME.LESSON) {
      result.data ? (item.dataNoti = result.data) : null;
      EventService.emit(Const.EVENT.PRESS_NOTIFY_GO_TO_LESSON, result);
      NavigationService.navigate(ScreenNames.DetailLessonScreen, {
        typeNotify: true,
        item: item
      });
    } else if (tableName == Const.TABLE_NAME.KAIWA) {
      let params = { ...item };
      params.lessonId = result.table_id;
      NavigationService.navigate(ScreenNames.DetailLessonScreen, {
        item: params,
        typeNotify: true
      });
    } else if (tableName == Const.TABLE_NAME.FLASHCARD) {
      try {
        let response = JSON.parse(result.data);
        item.lessonId = response.lessonId;
        NavigationService.navigate(ScreenNames.DetailLessonScreen, {
          typeNotify: true,
          item: item
        });
      } catch (error) {
        Funcs.log(error);
      }
    } else if (tableName == Const.TABLE_NAME.JLPT) {
      NavigationService.navigate(ScreenNames.TestScreen);
    } else if (tableName == Const.TABLE_NAME.SALE) {
      if (result.type == 'global') {
        await Fetch.post(Const.API.PROFILE.UPDATE_VISIBLE_NOTIFY, { id: result.notice_id }, true);
      }
      NavigationService.navigate(ScreenNames.BuyCourseScreen);
    } else if (tableName == Const.TABLE_NAME.BOOKING) {
      if (result.type == 'global') {
        await Fetch.post(Const.API.PROFILE.UPDATE_VISIBLE_NOTIFY, { id: result.notice_id }, true);
      }
      NavigationService.navigate(ScreenNames.BookingKaiwaScreen);
    } else if (!tableName) {
      if (result.type == 'global') {
        await Fetch.post(Const.API.PROFILE.UPDATE_VISIBLE_NOTIFY, { id: result.notice_id }, true);
      }
      NavigationService.navigate('Notify');
    } else if (tableName == Const.TABLE_NAME.TIPS) {
      if (result.type == 'global') {
        await Fetch.post(Const.API.PROFILE.UPDATE_VISIBLE_NOTIFY, { id: result.notice_id }, true);
      }
      const data = {
        blog_id: result.table_id,
        typeNotify: true
      };
      NavigationService.navigate(ScreenNames.BlogScreen, data);
    }
  }

  static async onIds(device) {
    Funcs.log('Device info: ', device);
    OneSignalService.deviceId = device.userId;

    // Save device id
    if (!Utils.deviceId) EncryptFileService.addSalt(device.userId);
    Utils.deviceId = device.userId;
    StorageService.save(Const.DATA.DEVICE_ID, device.userId);

    // Update device
    OneSignalService.updateDeviceId();
  }

  static updateDeviceId() {
    if (!Utils.token || !OneSignalService.deviceId) return;
    UserActionCreator.updateDevice(OneSignalService.deviceId);
  }

  static async removeDeviceId() {
    if (!Utils.token || !OneSignalService.deviceId) return;
    await Fetch.post(Const.API.USER.REMOVE_DEVICE_ID, { deviceId: OneSignalService.deviceId }, true);
  }

  static init() {
    RNOneSignal.init(Const.APP_KEY.ONE_SIGNAL);
    RNOneSignal.inFocusDisplaying(2);
    RNOneSignal.addEventListener('received', OneSignalService.onReceived);
    RNOneSignal.addEventListener('opened', OneSignalService.onOpened);
    RNOneSignal.addEventListener('ids', OneSignalService.onIds);
    RNOneSignal.clearOneSignalNotifications();
  }

  static reset() {
    RNOneSignal.removeEventListener('received', OneSignalService.onReceived);
    RNOneSignal.removeEventListener('opened', OneSignalService.onOpened);
    RNOneSignal.removeEventListener('ids', OneSignalService.onIds);
  }
}
