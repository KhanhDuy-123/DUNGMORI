import { SERVER_VIDEO_SELECTED, LIST_SERVER } from './ActionTypes';

export function onChangeServerVideo(link) {
  return {
    type: SERVER_VIDEO_SELECTED,
    payload: link
  };
}

export function onSaveServer(server) {
  return {
    type: LIST_SERVER,
    payload: server
  };
}
