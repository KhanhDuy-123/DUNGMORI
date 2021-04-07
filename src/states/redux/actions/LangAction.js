import { CHANGE_LANGUAGE } from './ActionTypes';
import Configs from 'utils/Configs';
import Lang from 'assets/Lang';
export const changeLanguage = (language) => {
  Configs.language = language;
  Lang.change();
  return {
    type: CHANGE_LANGUAGE,
    language
  };
};
