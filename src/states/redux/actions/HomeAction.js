import HomeActionType from '../actionTypes/HomeActionType';

export function getHomeData(onSuccess) {
  return {
    type: HomeActionType.GET_HOME_DATA,
    onSuccess
  };
}
