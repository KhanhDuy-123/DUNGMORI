import {SPEED_VIDEO} from './ActionTypes'

export function onChangeSpeedPlayVideo(speed){
  return{
    type: SPEED_VIDEO,
    payload: speed
  }
}