import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  size: number,
  color: string,
  text: string,
  checked: boolean,
  textStyle: {},
  onChange: () => {}
};
export default class CheckBox extends PureComponent<Props> {
  static defaultProps = {
    size: 26,
    color: '#111',
    text: null,
    default: false,
    onChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      checked: props.default
    };
  }

  onPress = () => {
    this.setState(
      {
        checked: !this.state.checked
      },
      () => {
        this.props.onChange(this.state.checked);
      }
    );
  };

  setValue = (checked) => {
    this.setState({
      checked
    });
  };

  getValue = () => {
    return this.state.checked;
  };

  render() {
    let { checked } = this.state;
    let { size, color, text, textStyle } = this.props;
    return (
      <TouchableOpacity style={styles.container} activeOpacity={0.85} {...this.props} onPress={this.onPress}>
        <MaterialIcons name={checked ? 'check-box' : 'check-box-outline-blank'} size={size} color={color} />
        {text ? <Text style={[styles.text, textStyle]}>{text}</Text> : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontWeight: '500',
    fontSize: 16,
    paddingHorizontal: 5
  }
});
