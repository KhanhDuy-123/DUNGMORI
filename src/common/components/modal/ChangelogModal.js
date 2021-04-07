import Colors from 'assets/Colors';
import Styles from 'assets/Styles';
import UIConst from 'consts/UIConst';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import BaseButton from '../base/BaseButton';
import BaseModal from '../base/BaseModal';
import BaseText from '../base/BaseText';

export default class ChangelogModal extends BaseModal {
  static defaultProps = {
    name: 'ChangelogModal'
  };

  state = { data: [] };

  componentDidMount() {
    let data = require('../../../../changelog.json');
    if (!data) data = [];
    this.setState({ data });
  }

  onPressOk = () => {
    ChangelogModal.hide();
  };

  renderContent = () => {
    return (
      <View style={styles.container}>
        <BaseText style={styles.title}>{'Changelog'}</BaseText>
        <View style={[Styles.center, Styles.flex]}>
          <ScrollView>
            {this.state.data.map((item, index) => (
              <BaseText key={index.toString()}>- {item}</BaseText>
            ))}
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <BaseButton style={styles.button} onPress={this.onPressOk} text={'OK'} />
        </View>
      </View>
    );
  };
}

ChangelogModal.prototype.name = ChangelogModal.defaultProps.name;

const styles = StyleSheet.create({
  container: {
    height: (UIConst.HEIGHT * 2) / 3
  },
  title: {
    marginHorizontal: 10,
    textAlign: 'center',
    fontSize: UIConst.FONT_SIZE + 5,
    fontWeight: '600',
    marginVertical: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  button: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    height: 40,
    ...Styles.center,
    borderWidth: 1,
    borderColor: Colors.border
  }
});
