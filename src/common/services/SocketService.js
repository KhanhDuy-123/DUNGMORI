import SocketIOClient from 'socket.io-client';
import Funcs from '../helpers/Funcs';

var socketIO = null;
export default class SocketService {
  senderId = null;
  senderName = null;
  receiverId = null;
  conversationId = null;

  static init({
    url,
    conversationId,
    senderId,
    senderName,
    senderAvatar,
    receiverId,
    onSent = () => {},
    onReceived = () => {},
    onReaded = () => {},
    onTyping = () => {},
    onStopTyping = () => {},
    onDisconnect = () => {}
  }) {
    Funcs.log('SocketService start ', { url, conversationId, senderId, receiverId });
    SocketService.senderId = senderId;
    SocketService.senderName = senderName;
    SocketService.senderAvatar = senderAvatar;
    SocketService.receiverId = receiverId;
    SocketService.conversationId = conversationId;
    socketIO = SocketIOClient(url, { forceNew: true });
    socketIO.on('sent_' + conversationId + '_' + senderId, onSent);
    socketIO.on('received_' + conversationId + '_' + senderId, onReceived);
    socketIO.on('readed_' + conversationId + '_' + senderId, onReaded);
    socketIO.on('typing_' + conversationId + '_' + receiverId, onTyping);
    socketIO.on('stopTyping_' + conversationId + '_' + receiverId, onStopTyping);
    socketIO.on('disconnect', onDisconnect);
    socketIO.on('connect', () => {
      // Clear pending emit
      socketIO.sendBuffer = [];
    });
  }

  static disconnect() {
    if (!socketIO) {
      Funcs.log('SocketService is not ready!');
      return;
    }
    socketIO.disconnect();
  }

  static genMessageContent(content, sentId, type) {
    let { conversationId, senderType = 'user', senderId, receiverId, senderName, senderAvatar } = SocketService;
    return {
      conversationId,
      senderType,
      senderId,
      senderName,
      senderAvatar,
      receiverId,
      content,
      type,
      sentId
    };
  }

  static emit(event, params) {
    if (!socketIO) {
      Funcs.log('SocketService is not ready!');
      return;
    }
    socketIO.emit(event, params);
  }

  static send(content, sentId, type = 'text') {
    SocketService.emit('send', SocketService.genMessageContent(content, sentId, type));
  }

  static read() {
    let { conversationId } = SocketService;
    SocketService.emit('readed', { conversationId, receiverId: 0 });
  }

  static typing() {
    let { conversationId, senderId } = SocketService;
    SocketService.emit('typing', { conversationId, senderId });
  }

  static stopTyping() {
    let { conversationId, senderId } = SocketService;
    SocketService.emit('stopTyping', { conversationId, senderId });
  }
}
