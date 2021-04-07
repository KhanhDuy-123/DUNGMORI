import Lang from 'assets/Lang';
import Resource from 'assets/Resource';
import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import React, { Component } from 'react';
import { Modal, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

export default class ModalCongratulation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      percentComplete: 0,
      part: ''
    };
  }

  showModal = (percent) => {
    let percentComplete = 0;
    let part = '';
    if (percent >= 25 && percent <= 49) {
      percentComplete = 25;
      part = '1/4';
    } else if (percent >= 50 && percent <= 74) {
      percentComplete = 50;
      part = '1/2';
    } else if (percent >= 75 && percent <= 99) {
      percentComplete = 75;
      part = '3/4';
    } else if (percent == 100) {
      percentComplete = 100;
      part = '1';
    }
    this.setState({ visible: true, percentComplete, part });
  };

  onHideModal = () => {
    this.setState({ visible: false });
  };

  render() {
    const { percentComplete, part } = this.state;
    let resource = '';
    if (percentComplete == 25) {
      resource = Resource.images.img25Percent;
    } else if (percentComplete == 50) {
      resource = Resource.images.img50Percent;
    } else if (percentComplete == 75) {
      resource = Resource.images.img75Percent;
    } else if (percentComplete == 100) {
      resource = Resource.images.img100Percent;
    }
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" />
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.body}>
              <FastImage source={resource} style={styles.img} />
              <BaseText style={styles.textComplete}>{`${Lang.chooseLession.text_complete}${' '}${percentComplete}${'%'}${' '}${
                Lang.chooseLession.text_progress_lesson
              }`}</BaseText>
              <BaseText style={styles.textresult}>{`${Lang.chooseLession.text_go}${' '}${part}${' '}${Lang.chooseLession.text_road}`}</BaseText>
            </View>
            <TouchableOpacity style={styles.button} onPress={this.onHideModal}>
              <BaseText style={styles.textButton}>{Lang.chooseLession.text_keep_going}</BaseText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    width: 250 * Dimension.scale,
    height: 300 * Dimension.scale,
    backgroundColor: '#FFFFFF',
    borderRadius: 15
  },
  button: {
    width: '100%',
    height: 45,
    backgroundColor: Resource.colors.greenColorApp,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: 200 * Dimension.scale,
    height: 150 * Dimension.scale,
    marginBottom: 10
  },
  textComplete: {
    fontSize: 16,
    color: 'red',
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 5
  },
  textresult: {
    marginHorizontal: 20,
    textAlign: 'center',
    fontSize: 15
  },
  textButton: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold'
  }
});
