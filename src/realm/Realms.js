import Funcs from 'common/helpers/Funcs';
import fs from 'react-native-fs';
import Realm from 'realm';
import CourseModel from './models/CourseModel';
import KaiwaCheckModel from './models/KaiwaCheckModel';
import LessonGroupModel from './models/LessonGroupModel';
import LessonModel from './models/LessonModel';
import VideoModel from './models/VideoModel';
import VideoNoteModel from './models/VideoNoteModel';

const config = {
  path: 'database.realm',
  schema: [CourseModel, LessonGroupModel, LessonModel, VideoModel, VideoNoteModel, KaiwaCheckModel],
  schemaVersion: 13 //add video name
};

let instance = {};
try {
  instance = new Realm(config);
  Funcs.log('Relam instance', instance);
} catch (err) {
  Funcs.log('PATH', fs.DocumentDirectoryPath);
  Funcs.log('ERROR', err);
}

export default {
  config,

  getInstance: () => {
    if (!instance) {
      instance = new Realm(config);
    }
    return instance;
  },

  close: () => {
    if (!instance) {
      return;
    }
    Funcs.log('Close database');
    try {
      instance.close();
      instance = null;
    } catch (err) {
      Funcs.log('ERROR', err);
    }
  }
};
