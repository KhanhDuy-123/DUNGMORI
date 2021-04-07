import Funcs from 'common/helpers/Funcs';
import AppConst from 'consts/AppConst';
import FS from 'react-native-fs';
import Sound from 'react-native-sound';
import Strings from 'common/helpers/Strings';

const isDev = __DEV__;
const isAndroid = AppConst.IS_ANDROID;

const getSoundResources = (isFileName) => ({
  startSpeak: isFileName ? 'start_speech.mp3' : require('./sounds/start_speech.mp3'),
  stopSpeak: isFileName ? 'stop_speech.mp3' : require('./sounds/stop_speech.mp3'),
  kaiwaLvS: isFileName ? 'sound_kaiwa_lvs.mp3' : require('./sounds/sound_kaiwa_lvs.mp3'),
  kaiwaLvA: isFileName ? 'sound_kaiwa_lva.mp3' : require('./sounds/sound_kaiwa_lva.mp3'),
  kaiwaLvB: isFileName ? 'sound_kaiwa_lvb.mp3' : require('./sounds/sound_kaiwa_lvb.mp3'),
  kaiwaLvC: isFileName ? 'sound_kaiwa_lvc.mp3' : require('./sounds/sound_kaiwa_lvc.mp3'),
  correctAnswer: isFileName ? 'correct_answer.mp3' : require('./sounds/correct_answer.mp3'),
  wrongAnswer: isFileName ? 'wrong_answer.mp3' : require('./sounds/wrong_answer.mp3'),
  correct: isFileName ? 'correct.mp3' : require('./sounds/correct.mp3')
});

let soundPaths = getSoundResources(true);
const soundKeys = Object.keys(soundPaths);

Sound.setCategory('Playback');

const Sounds = {
  init: async () => {
    // Check codepush sound
    let hasCodePushResouce = false;
    if (!isDev) {
      const path = (isAndroid ? FS.DocumentDirectoryPath : FS.LibraryDirectoryPath + '/Application Support') + '/CodePush';
      if (await FS.exists(path)) {
        Funcs.log('## Sound: Found codepush path');
        try {
          let currentPackage = null;
          let pathCodePush = isAndroid ? '/CodePush/raw' : '/CodePush/assets/src/assets/sounds';
          let listFS = await FS.readDir(path);
          let fileCodePush = await FS.readFile(path + '/codepush.json', 'utf8');
          fileCodePush = JSON.parse(fileCodePush);
          for (let i = 0; i < listFS.length; i++) {
            if (listFS[i].name === fileCodePush.currentPackage) currentPackage = fileCodePush.currentPackage;
          }
          if (currentPackage) {
            let resourceCodePush = path + `/${currentPackage}` + `${pathCodePush}`;
            let listDataCodePush = await FS.readDir(resourceCodePush);
            for (let i = 0; i < listDataCodePush.length; i++) {
              let result = `${resourceCodePush}/${listDataCodePush[i].name}`;
              for (let j = 0; j < soundKeys.length; j += 1) {
                if (listDataCodePush[i].name === soundPaths[soundKeys[j]] || listDataCodePush[i].name === 'src_assets_sounds_' + soundPaths[soundKeys[j]]) {
                  soundPaths[soundKeys[j]] = result;
                  hasCodePushResouce = true;
                  Funcs.log('## Sound: path', result);
                }
              }
            }
          }
        } catch (error) {
          hasCodePushResouce = false;
          console.log(error);
        }
      }
    }

    // No codepush => using require
    if (!hasCodePushResouce) {
      Funcs.log('## Sound: Using require path');
      soundPaths = getSoundResources(false);
    } else {
      Funcs.log('## Sound: Using codepush path');
    }

    // Init sound
    for (let i = 0; i < soundKeys.length; i += 1) {
      try {
        const soundPath = soundPaths[soundKeys[i]];
        Sounds[soundKeys[i]] = await Sounds.get(soundPath);
      } catch (err) {
        console.log('ERROR', err);
      }
    }
  },

  release: async () => {
    try {
      for (let i = 0; i < soundKeys.length; i += 1) {
        if (Sounds[soundKeys[i]]) Sounds[soundKeys[i]].release();
      }
    } catch (err) {
      console.log('ERROR', err);
    }
  },

  play: (sound: Sound | string, speed: number) => {
    return new Promise((resolve, reject) => {
      let soundObj = sound;
      if (!sound) {
        Funcs.log('Sound play error beacause null');
        resolve(false);
      }

      // If sound is string
      if (typeof soundObj === 'string') soundObj = Sounds[soundObj];

      // Play
      try {
        if (speed) soundObj.setSpeed(speed);
        soundObj.play((success) => {
          if (!success) {
            Funcs.log('[Sound] play not success');
            return;
          }
          let soundName = typeof sound === 'string' ? sound : soundObj._filename;
          Funcs.log(`PLay sound "${Strings.getFileNameFromPath(soundName)}"`);
          resolve(true);
        });
      } catch (err) {
        console.log('###', err, sound);
        resolve(false);
      }
    });
  },

  stop: (sound: Sound) => {
    return new Promise((resolve, reject) => {
      if (!sound) {
        Funcs.log('Sound stop error beacause null');
        resolve(false);
      }

      // If sound is string
      let soundObj = sound;
      if (typeof soundObj === 'string') soundObj = Sounds[sound];

      // Play
      try {
        soundObj.stop();
        resolve(true);
        let soundName = typeof sound === 'string' ? sound : soundObj._filename;
        Funcs.log(`Stop sound "${Strings.getFileNameFromPath(soundName)}"`);
      } catch (err) {
        console.log('###', err, sound);
        resolve(false);
      }
    });
  },

  get: (path) => {
    var promise = new Promise((resolve, reject) => {
      try {
        if (!path) {
          Funcs.log('Error sound: Path is empty');
          resolve(null);
        }
        const callback = (error) => {
          if (error) {
            Funcs.log('Error sound: ', path, error);
            resolve(null);
          } else {
            resolve(sound);
          }
        };
        let param2 = typeof path === 'number' ? callback : Sound.MAIN_BUNDLE;

        // On iOS param2 is empty
        if (!isAndroid && typeof path === 'string' && path.indexOf('/') >= 0) param2 = '';
        if (!isAndroid) path = encodeURIComponent(path);
        var sound = new Sound(path, param2, callback);
      } catch (error) {
        Funcs.log('Error sound: ', path, error);
        resolve(null);
      }
    });
    return promise;
  }
};

export default Sounds;
