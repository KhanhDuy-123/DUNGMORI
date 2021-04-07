import Resource from 'assets/Resource';
import Dimension from 'common/helpers/Dimension';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';

export class BaseDropDown extends PureComponent {
  state = { value: null };
  static defaultProps = {
    fontSize: 14
  };
  componentDidMount() {
    const { value } = this.props;
    this.setState({ value });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data || prevProps.value !== this.props.value) {
      const { value, data } = this.props;
      if (value != null && data.length != 0) {
        const val = data.find((item) => {
          return item.name === value;
        });
        this.setState((prev) => ({ value: val }));
        return;
      }
      if (data !== this.props.data) {
        this.setState((prev) => {
          let value = null;
          if (data.length > 0) value = data[0].name;
          return { value };
        });
      }
    }
  }

  render() {
    return (
      <Dropdown
        dropdownMargins={{ min: 0, max: -50 }}
        containerStyle={[styles.dropStyle, this.props.dropStyle]}
        data={this.props.data}
        dropdownOffset={this.props.offsetStyle}
        fontSize={!this.state.value ? 12 * Dimension.scale : 13 * Dimension.scale}
        pickerStyle={this.props.pickerStyle}
        dropdownPosition={-3}
        selectedItemColor={Resource.colors.greenColorApp}
        textColor={!this.state.value ? Resource.colors.inactiveButton : Resource.colors.black1}
        inputContainerStyle={styles.viewInput}
        itemTextStyle={styles.itemTextStyle}
        itemCount={4}
        overlayStyle={{ justifyContent: 'center' }}
        value={this.state.value || this.props.title}
        valueExtractor={(value) => value}
        labelExtractor={(value) => (value.name ? value.name : '')}
        onChangeText={(value) => {
          this.setState({ value: value.name ? value.name : '' });
          this.props.onChangeText(value);
        }}
      />
    );
  }
}
const styles = StyleSheet.create({
  dropStyle: {
    backgroundColor: Resource.colors.white100,
    height: 40 * Dimension.scale,
    justifyContent: 'center'
  },
  viewInput: {
    borderBottomColor: Resource.colors.white100,
    borderBottomWidth: 0.7
  },
  itemTextStyle: {
    paddingHorizontal: 15,
    paddingVertical: 5
  }
});

export default BaseDropDown;
