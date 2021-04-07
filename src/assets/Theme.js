import Configs from 'utils/Configs';
import themes from './themes';

const TYPE = {
  NORMAL: 'normal',
  MERRY_CHRISMAS: 'christmas',
  HAPPY_NEW_YEAR: 'newyear'
};

export default {
  TYPE,
  get: (key) => {
    if (!Configs.theme) Configs.theme = TYPE.NORMAL;
    if (!themes[Configs.theme]) return null;
    return themes[Configs.theme][key];
  }
};
