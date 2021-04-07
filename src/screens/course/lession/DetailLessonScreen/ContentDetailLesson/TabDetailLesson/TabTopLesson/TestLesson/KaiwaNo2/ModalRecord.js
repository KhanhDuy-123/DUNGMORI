import BaseText from 'common/components/base/BaseText';
import Dimension from 'common/helpers/Dimension';
import Time from 'common/helpers/Time';
import React, { Component } from 'react';
import { Modal, StatusBar, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Resource from 'assets/Resource';
import SpeechRecordView from '../components/SpeechRecordView';
import Lang from 'assets/Lang';
import Colors from 'assets/Colors';
import Utils from 'utils/Utils';

export default class ModalRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      seconds: 0
    };
    this.toogleSpeak = false;
  }

  componentWillUnmount() {
    clearTimeout(this.timeStopSpeak);
  }

  showModal = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  onStartSpeech = () => {
    clearInterval(this.intervalTime);
    this.intervalTime = setInterval(() => {
      this.setState({ seconds: this.state.seconds + 1 });
    }, 950);
  };

  onStopSpeech = async (response) => {
    clearInterval(this.intervalTime);
    this.setState({ seconds: 0 });
    this.props.onStopSpeak(response);
    this.timeStopSpeak = setTimeout(() => {
      this.hideModal();
    }, 300);
  };

  render() {
    const timePlay = Time.convertSecondToTime(this.state.seconds);
    return (
      <Modal transparent={true} visible={this.state.visible}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.7)" />
        <TouchableWithoutFeedback onPress={this.hideModal}>
          <View style={styles.container}>
            <View style={styles.content}>
              {Utils.user.is_tester == 1 && <BaseText style={styles.textAdmin}>{Lang.detailLesson.kaiwa_2_admin}</BaseText>}
              <View style={styles.timeContainer}>
                <View style={[styles.viewTextRecord]}>
                  <BaseText style={styles.textTime}>{timePlay}</BaseText>
                </View>
                <View style={[styles.triagle]} />
              </View>
              <SpeechRecordView ref={(refs) => (this.SpeechRecordView = refs)} onStart={this.onStartSpeech} onStop={this.onStopSpeech} />
              <View style={styles.buttonClose}>
                <AntDesign name="closecircleo" size={26} onPress={this.hideModal} color="grey" />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    width: 280 * Dimension.scale,
    height: 280 * Dimension.scale,
    backgroundColor: Resource.colors.white100,
    borderRadius: 20 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20
  },
  viewTextRecord: {
    width: 70 * Dimension.scale,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ED5C3F',
    paddingHorizontal: 10,
    padding: 5,
    borderRadius: 20
  },
  triagle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 10,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ED5C3F'
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  textTime: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600'
  },
  buttonClose: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  textAdmin: {
    fontSize: 16,
    color: Colors.greenColorApp,
    top: 30,
    position: 'absolute'
  }
});
