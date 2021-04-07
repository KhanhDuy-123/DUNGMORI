import React, { Component } from 'react';
import { Switch } from 'react-native';

export default class SwitchComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.notify == 1 ? true : false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.notify !== this.props.notify) {
      this.setState({ value: nextProps.notify == 1 ? true : false });
    }
    return nextState !== this.state;
  }

  toogleSwitch = (value) => {
    this.setState({ value }, this.props.onValueChange(value));
  };

  render() {
    return <Switch value={this.state.value} onValueChange={this.toogleSwitch} />;
  }
}
