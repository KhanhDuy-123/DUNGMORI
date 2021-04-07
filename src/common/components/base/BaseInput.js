import Resource from 'assets/Resource';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Dimensions, Keyboard, StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

class BaseInput extends PureComponent<TextInputProps> {
  static propTypes = {
    style: PropTypes.object,
    value: PropTypes.string,
    onChangeText: PropTypes.func,
    autoFocus: PropTypes.bool
  };

  static defaultProps = {
    autoFocus: false
  };

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  onChangeText = (value) => {
    this.setState({
      value
    });
    if (this.props.onChangeText) this.props.onChangeText(value);
  };

  reset = () => {
    this.setState({
      value: ''
    });
  };

  setText = (value) => {
    this.setState({
      value
    });
  };

  getText = () => {
    return this.state.value;
  };

  focus = () => {
    this.textInputRef && this.textInputRef.focus();
  };

  blur = () => {
    this.setText('');
    this.textInputRef && this.textInputRef.blur();
  };

  render() {
    let value = this.props.value ? this.props.value : this.state.value;
    return (
      <View style={[styles.container, this.props.viewInputStyle]}>
        <TextInput
          {...this.props}
          ref={(ref) => (this.textInputRef = ref)}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor || Resource.colors.inactiveButton}
          secureTextEntry={this.props.secureTextEntry}
          placeholderTextStyle={{ fontStyle: 'italic' }}
          autoFocus={this.props.autoFocus}
          onChangeText={this.onChangeText}
          value={value}
          maxLength={this.props.maxLength}
          password={this.props.password}
          multiline={this.props.multiline}
          autoCapitalize="none"
          style={[styles.textInputStyle, this.props.textInputStyle]}
          onFocus={this.props.onFocus}
          onLayout={this.props.onLayout}
          onSelectionChange={this.props.onSelectionChange}
          onSubmitEditing={Keyboard.dismiss}
          allowFontScaling={false}
        />
        {this.props.showEye ? (
          <TouchableOpacity style={styles.eyeStyle} onPress={this.props.onPressShowPass}>
            <Icon name={this.props.secureTextEntry ? 'ios-eye' : 'ios-eye-off'} size={25} color={Resource.colors.grey500} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  textInputStyle: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
    textAlignVertical: 'top'
  },
  eyeStyle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    position: 'absolute',
    right: 0
  }
});

export default BaseInput;
