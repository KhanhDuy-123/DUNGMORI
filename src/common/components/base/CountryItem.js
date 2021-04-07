import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import BaseText from './BaseText';

class CountryItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.contentContainer} onPress={this.props.onCountryPressed(this.props.item)}>
          <Image resizeMode="contain" source={{ uri: this.props.item.flag }} style={styles.imageStyle} />
          <BaseText style={styles.textStyle}>
            {this.props.item.name.common} (+
            {this.props.item.callingCode})
          </BaseText>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#d9d9d9d9',
    flex: 1
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  imageStyle: {
    width: 40,
    height: 25,
    marginRight: 5
  },
  textStyle: {
    paddingLeft: 12,
    flex: 1
  }
});

export default CountryItem;
