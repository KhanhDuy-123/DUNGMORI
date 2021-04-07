import Lang from 'assets/Lang';
import Configs from 'utils/Configs';
import { CHANGE_LANGUAGE } from 'states/redux/actions';
import Store from 'states/redux/Store';

export default {
  changeLanguage: (language) => {
    Configs.language = language;
    Lang.change();
    Store.dispatch({
      type: CHANGE_LANGUAGE,
      language
    });
  }
};
