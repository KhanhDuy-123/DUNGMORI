import Funcs from '../helpers/Funcs';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';

export default class EventService {
  static event = null;
  static eventList = [];

  static getInstance() {
    if (!EventService.event) {
      EventService.event = new EventEmitter();
      EventService.eventList = [];
    }
    return EventService.event;
  }

  static add(eventName, callback) {
    var index = EventService.findEventByName(eventName);
    if (index > -1) {
      Funcs.log('Fail to add event', eventName, 'because it exist.');
      return;
    }
    const subscription = EventService.getInstance().addListener(eventName, callback);
    EventService.eventList.push({
      name: eventName,
      event: subscription
    });
  }

  static emit(eventName, params) {
    var index = EventService.findEventByName(eventName);
    if (index <= -1) {
      Funcs.log('Fail to emit event', eventName, 'because it been not listen.');
      return;
    }
    EventService.getInstance().emit(eventName, params);
  }

  static remove(eventName) {
    var index = EventService.findEventByName(eventName);
    if (index > -1) {
      EventService.eventList[index].event.remove();
      EventService.eventList.splice(index, 1);
    } else {
      Funcs.log('Fail to remove event', eventName, 'because it not found.');
    }
  }

  static clear() {
    for (var i = 0; i < EventService.eventList.length; i += 1) {
      EventService.eventList[i].event.remove();
    }
    EventService.eventList = [];
  }

  static findEventByName(eventName) {
    for (var i = 0; i < EventService.eventList.length; i += 1) {
      if (EventService.eventList[i].name === eventName) {
        return i;
      }
    }
    return -1;
  }
}
