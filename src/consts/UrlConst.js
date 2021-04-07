import Configs from 'utils/Configs';

const { NODE_DEV } = Configs;

const SOCKET = {
  local: 'http://192.168.8.188:8801',
  development: 'http://chat-test.dungmori.com',
  production: 'https://chat.dungmori.com'
};

const API = {
  local: 'http://192.168.8.188:8800',
  development: 'http://api-test.dungmori.com',
  production: 'https://api.dungmori.com'
};

const API_JP_TEST = {
  local: 'https://jlpt-test.dungmori.com/api/',
  development: 'https://jlpt-test.dungmori.com/api/',
  production: 'https://mjt.dungmori.com/api/'
};

const SOCKET_COUNT_ONLINE = {
  local: 'https://count-test.dungmori.com',
  development: 'https://count-test.dungmori.com',
  production: 'https://mjt-count.dungmori.com'
};

const API_RANKING = 'https://dungmori.com/api/jlpt';

const CDN = {
  local: 'http://192.168.8.188:8800/cdn',
  development: 'https://api-test.dungmori.com/cdn',
  production: 'https://dungmori.com/cdn'
};
const NEWS = 'https://dungmori.com/bai-viet/';
const MP3 = 'https://mp3.dungmori.com/';

export default {
  API: API[NODE_DEV],
  SOCKET: SOCKET[NODE_DEV],
  CDN: CDN[NODE_DEV],
  NEWS,
  MP3,
  API_JP_TEST: API_JP_TEST[NODE_DEV],
  SOCKET_COUNT_ONLINE: SOCKET_COUNT_ONLINE[NODE_DEV],
  API_RANKING
};
