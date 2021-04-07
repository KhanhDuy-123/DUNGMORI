import Time from 'common/helpers/Time';
import Configs from 'utils/Configs';
import En from './languages/English';
import Vi from './languages/Vietnamese';

const Lang = {
  change: async () => {
    let language = Vi;
    if (Configs.language === 'en') language = En;
    let keys = Object.keys(language);
    for (var i = 0; i < keys.length; i += 1) {
      let key = keys[i];
      Lang[key] = language[key];
    }

    // Change moment
    Time.updateTimeLocate();
  },
  parse: (text, value) => {
    return text.replace('%s', value);
  },
  ...Vi
};
export default Lang;
