import React, { PureComponent } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default class KeyboardHandle extends PureComponent {
  render() {
    // keyboardVerticalOffset phụ thuộc vào padding top của root view #https://github.com/facebook/react-native/issues/13393
    var { children } = this.props;
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : this.props.verticalAndroid}
        behavior="padding"
        enabled={true}
        {...this.props}
        style={{ flex: 1, ...this.props.style }}>
        {children}
      </KeyboardAvoidingView>
    );
  }
}

KeyboardHandle.defaultProps = {
  verticalAndroid: -500
};
