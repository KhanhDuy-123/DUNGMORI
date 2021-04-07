import Lang from 'assets/Lang';
import BaseText from 'common/components/base/BaseText';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

export default class BackCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item } = this.props;
    return (
      <View style={styles.container}>
        <BaseText style={styles.textGiaithich}>{Lang.guessImage.explain}</BaseText>
        <BaseText>{item?.value?.ex}</BaseText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 25
  },
  textGiaithich: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10
  }
});
