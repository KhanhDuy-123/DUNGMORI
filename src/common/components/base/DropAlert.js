import React, { PureComponent } from 'react';
import DropdownAlert from 'react-native-dropdownalert';

var refDropdownAlert = null;
export default class DropAlert extends PureComponent {
  static error(title, message, interval) {
    refDropdownAlert.alertWithType('error', title, message, {}, interval);
  }

  static success(title, message, interval) {
    refDropdownAlert.alertWithType('success', title, message, {}, interval);
  }

  static info(title, message, interval) {
    refDropdownAlert.alertWithType('info', title, message, {}, interval);
  }

  static warn(title, message, interval) {
    refDropdownAlert.alertWithType('warn', title, message, {}, interval);
  }

  componentWillUnmount() {
    refDropdownAlert = null;
  }

  render() {
    return (
      <DropdownAlert
        inactiveStatusBarBackgroundColor={'rgba(255,255,255,0)'}
        successImageSrc={null}
        infoImageSrc={null}
        warnImageSrc={null}
        errorImageSrc={null}
        translucent={true}
        inactiveStatusBarStyle={'dark-content'}
        ref={(ref) => {
          refDropdownAlert = ref;
        }}
      />
    );
  }
}
