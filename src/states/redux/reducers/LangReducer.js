const { CHANGE_LANGUAGE } = require('states/redux/actions');

const initialState = {
  language: 'vi'
};

export const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return { language: action.language };
    default:
      return state;
  }
};
