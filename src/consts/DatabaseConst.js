import RNFetchBlob from 'rn-fetch-blob';

export default {
  MODELS: {
    COURSE: 'Course',
    LESSON_GROUP: 'LessonGroup',
    LESSON: 'Lesson',
    VIDEO: 'Video',
    VIDEO_NOTE: 'VideoNote',
    KAIWA_CHECK: 'KaiwaCheck'
  },
  VIDEO_PATH: `${RNFetchBlob.fs.dirs.DocumentDir}/videos/`
};
