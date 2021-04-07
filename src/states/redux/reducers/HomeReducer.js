import HomeActionType from 'states/redux/actionTypes/HomeActionType';

const initialState = {};

export const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case HomeActionType.GET_SETTING_SUCCESS:
      return {
        ...state,
        setting: action.setting
      };

    default:
      return state;
  }
};
