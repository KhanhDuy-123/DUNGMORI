import Colors from 'assets/Colors';
import Styles from 'assets/Styles';
import UIConst from 'consts/UIConst';
import Funcs from 'common/helpers/Funcs';
import React, { PureComponent } from 'react';
import { Animated, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import KeyboardHandle from './KeyboardHandle';

interface Config {
  title: string;
  detail: string;
  placeholder: string;
  callback: () => void;
  autoClose: boolean;
}

export default class BaseModal extends PureComponent<Config> {
  static instance = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      config: {}
    };
    this.heightMove = new Animated.Value(0);
    this.styles = styles;
    if (props.name) BaseModal.instance[props.name] = this;
  }

  static show(config: Config = {}) {
    const scope = this.getScope();
    if (!scope) {
      Funcs.log(`${this.prototype.name} instance not exist`);
      return;
    }
    let state = { visible: true };
    state.config = config;
    scope.setState(state, scope.moveUp);
    Keyboard.dismiss();
  }

  static hide() {
    const scope = this.getScope();
    if (!scope) {
      Funcs.log(`${this.prototype.name} instance not exist`);
      return;
    }
    scope.moveDown();
  }

  static update(config) {
    const scope = this.getScope();
    if (!scope) {
      Funcs.log(`${this.prototype.name} instance not exist`);
      return;
    }
    scope.reset();
    scope.setState({ config });
  }

  static getScope() {
    const intanceName = this.prototype.name;
    const scope = BaseModal.instance[intanceName];
    return scope;
  }

  reset = () => {};

  moveUp = () => {
    this.moving = true;
    Animated.timing(this.heightMove, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      this.moving = false;
    });
  };

  moveDown = () => {
    this.moving = true;
    Animated.timing(this.heightMove, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      this.moving = false;
      this.setState({ visible: false });
    });
  };

  onPressForeground = () => {
    if (this.moving) return;
    this.moveDown();
  };

  renderContent = () => {
    return null;
  };

  render() {
    let { visible, config } = this.state;
    if (!visible) return null;
    const translate = this.heightMove.interpolate({
      inputRange: [0, 1],
      outputRange: [UIConst.HEIGHT, 0]
    });
    const { autoClose = true } = config;

    return (
      <KeyboardHandle style={styles.container}>
        <TouchableOpacity activeOpacity={1} style={Styles.modal} onPress={this.onPressForeground} disabled={!autoClose} />
        <Animated.View style={[{ transform: [{ translateY: translate }] }]}>
          <View activeOpacity={1} style={styles.container1}>
            {this.renderContent()}
          </View>
        </Animated.View>
      </KeyboardHandle>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container1: {
    ...Styles.shadow,
    backgroundColor: Colors.backgroundColor,
    width: UIConst.MAX_WIDTH,
    borderRadius: 15,
    padding: 10
  },
  button: {
    ...Styles.center,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    borderRadius: 5
  },
  buttonMarginLeft: {
    ...Styles.center,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 10,
    marginLeft: 10,
    borderRadius: 5
  }
});
