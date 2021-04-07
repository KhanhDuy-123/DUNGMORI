import TestingActionType from '../actionTypes/TestingActionType';

const initialState = {};

export const testingReducer = (state = initialState, action) => {
  switch (action.type) {
    case TestingActionType.GET_TESTING_ROOM_SUCCESS:
      return {
        ...state,
        testingInfoData: action.testingInfoData,
        currentTime: action.currentTime
      };
    case TestingActionType.UPDATE_TESTING_ROOM:
      return {
        ...state,
        testingInfoData: action.testingInfoData
      };
    case TestingActionType.GET_TESTING_CURRENT_TIME_SUCCESS:
      return {
        ...state,
        currentTime: action.currentTime
      };
    default:
      return state;
  }
};
