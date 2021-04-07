import { Component } from 'react';
import { Keyboard, Platform } from 'react-native';

const KEYBOARD_SHOW = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
const KEYBOARD_HIDE = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

class BaseKeyboardListener extends Component {
  componentDidMount() {
    Keyboard.addListener(KEYBOARD_SHOW, this.keyboardDidShow);
    Keyboard.addListener(KEYBOARD_HIDE, this.keyboardDidHide);
  }

  componentWillUnmount() {
    Keyboard.removeListener(KEYBOARD_SHOW, this.keyboardDidShow);
    Keyboard.removeListener(KEYBOARD_HIDE, this.keyboardDidHide);
  }

  keyboardDidShow = () => {};

  keyboardDidHide = () => {};

  render() {
    return null;
  }
}

export default BaseKeyboardListener;
