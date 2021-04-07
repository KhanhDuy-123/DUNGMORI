import SocketIOClient from 'socket.io-client';
import Funcs from '../helpers/Funcs';

var socketIOOnline = null;
export default class SocketOnlineService {
  static init({ url, onUpdate = () => {} }) {
    Funcs.log('Socket init', url);
    socketIOOnline = SocketIOClient(url, { forceNew: true });
    socketIOOnline.on('count', onUpdate);
    socketIOOnline.on('connect', () => {
      Funcs.log('Socket connected!');
    });
    socketIOOnline.on('disconnect', () => {
      Funcs.log('Socket disconnected!');
    });
  }

  static disconnect() {
    if (!socketIOOnline) {
      Funcs.log('SocketService is not ready!');
      return;
    }
    socketIOOnline.disconnect();
  }
}
