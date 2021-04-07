import AsyncStorage from '@react-native-community/async-storage';
import Funcs from '../helpers/Funcs';

async function save(key, value) {
  try {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    Funcs.log(err);
  }
  return null;
}

async function get(key) {
  let data = null;
  try {
    data = await AsyncStorage.getItem(key);
    if (data) {
      data = JSON.parse(data);
    }
  } catch (err) {
    Funcs.log(key, err);
  }
  return data;
}

async function remove(key) {
  return AsyncStorage.removeItem(key);
}

export default {
  save,
  get,
  remove
};
