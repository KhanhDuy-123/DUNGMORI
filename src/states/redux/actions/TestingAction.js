import TestingActionType from '../actionTypes/TestingActionType';

export function getTestingRoom(onFinish) {
  return {
    type: TestingActionType.GET_TESTING_ROOM,
    onFinish
  };
}

export function updateTestingRoom(testingInfoData) {
  return {
    type: TestingActionType.UPDATE_TESTING_ROOM,
    testingInfoData
  };
}

export function getTestingCurrentTime() {
  return {
    type: TestingActionType.GET_TESTING_CURRENT_TIME
  };
}
