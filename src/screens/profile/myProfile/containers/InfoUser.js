import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ItemInfoUser from './ItemInfoUser';
import Resource from 'assets/Resource';

class InfoUser extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <ItemInfoUser title={this.props.title} content={this.props.content} />
        <View style={styles.barStyle} />
        <ItemInfoUser title={this.props.title1} content={this.props.content1} />
        <View style={styles.barStyle} />
        <ItemInfoUser title={this.props.title2} content={this.props.content2} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  barStyle: {
    width: 1,
    height: 20,
    backgroundColor: Resource.colors.inactiveButton
  }
});

export default InfoUser;
